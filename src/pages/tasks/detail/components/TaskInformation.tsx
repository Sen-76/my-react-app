/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Avatar,
  Button,
  Col,
  Collapse,
  DatePicker,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Row,
  Select,
  Spin,
  Tooltip,
  Typography,
  Upload,
  UploadProps
} from 'antd';
import styles from '../TaskDetail.module.scss';
import { useTranslation } from 'react-i18next';
import { util } from '@/common/helpers/util';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
import ReactQuill from 'react-quill';
import { DeleteOutlined, FileOutlined, InboxOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import useDebounce from '@/common/helpers/useDebounce';
import Paragraph from 'antd/es/typography/Paragraph';
import { Link } from 'react-router-dom';

interface IProps {
  data: A;
  refreshData: () => void;
  setEditTitle: (value: boolean) => void;
}
function TaskInformation(props: IProps) {
  const { data, refreshData, setEditTitle } = props;
  const { t } = useTranslation();
  const { showLoading, closeLoading } = useLoading();
  const [editedField, setEditedFields] = useState<string>('');
  const [mileStoneList, setMilestoneList] = useState<A[]>([]);
  const [priotyList, setPriotyList] = useState<A[]>([]);
  const [typeList, setTypeList] = useState<A[]>();
  const [userMemberList, setUserMemberList] = useState<A[]>([]);
  const [taskList, setTaskList] = useState<A[]>([]);
  const [selectLoading, setSelectLoading] = useState<boolean>();
  const [searchAssigneeValue, setSearchAssigneeValue] = useState<string>('');
  const userDebouncedAssignee = useDebounce(searchAssigneeValue, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { Dragger } = Upload;

  useEffect(() => {
    getUsers();
  }, [userDebouncedAssignee]);

  const getUsers = async () => {
    try {
      const initDataGrid: Common.IDataGrid = {
        pageInfor: {
          pageSize: 10,
          pageNumber: 1,
          totalItems: 0
        },
        searchInfor: {
          searchValue: '',
          searchColumn: ['FullName', 'UserEmail']
        },
        filter: []
      };
      const draftParam = { ...initDataGrid };
      draftParam.searchInfor!.searchValue = userDebouncedAssignee ?? '';
      const result = await service.accountService.getAccount(draftParam);
      const loginUser = JSON.parse(sessionStorage.getItem('userDetail') ?? '');
      const data = [...result.data, loginUser];
      const optionsValue = data?.map((x: A) => ({
        label: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size={25} src={x?.photoUrl} style={{ marginRight: 10, backgroundColor: util.randomColor() }}>
              {x?.fullName?.charAt(0)}
            </Avatar>
            <div>
              <Paragraph
                ellipsis={{ rows: 1, expandable: false }}
                style={{ maxWidth: 350, minWidth: 30, fontWeight: 600, fontSize: 16, lineHeight: '20px' }}
              >
                {x?.fullName}
              </Paragraph>
              <Paragraph
                ellipsis={{ rows: 1, expandable: false }}
                style={{ maxWidth: 350, minWidth: 30, lineHeight: '16px', fontSize: 12 }}
              >
                {x?.userEmail}
              </Paragraph>
            </div>
          </div>
        ),
        value: x.id
      }));
      setUserMemberList(optionsValue);
      setSelectLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const updateInfo = async () => {
    try {
      showLoading();
      setEditedFields('');
      await service.taskService.update({
        ...data,
        ...form.getFieldsValue(),
        assignee: form.getFieldValue('assignee').value ? form.getFieldValue('assignee')?.value : data.assignee,
        reportTo: form.getFieldValue('reportTo').value ? form.getFieldValue('reportTo')?.value : data.reportTo
      });
      refreshData();
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    const fetchApi = async () => {
      showLoading();
      const promises = [getMilestoneList(), getTypeList(), getPriotyList(), getTaskList()];
      await Promise.all(promises);
      closeLoading();
    };
    fetchApi();
  }, []);

  const editField = (val: string) => {
    setEditTitle(false);
    setEditedFields(val);
    data.dueDate = dayjs(data.dueDate);
    form.setFieldsValue(data);
  };

  const requiredRule = [{ required: true, message: t('Common_Require_Field') }];

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  let uploadFlag = false;
  const uploadProps: UploadProps = {
    beforeUpload: (file: A, fileList: A) => {
      if (!uploadFlag) {
        handleUpload(fileList);
      }
      return false;
    }
  };

  const handleUpload = async (fileList: A) => {
    try {
      showLoading();
      const formData = new FormData();
      formData.append('outletId', 'la cai d gi');
      formData.append('comment', 'comment làm cái đúng gì');
      formData.append('id', data?.id.toString());
      fileList.forEach((file: A) => {
        formData.append('files', file);
      });
      await service.taskService.uploadAttach(formData);
      uploadFlag = true;
      refreshData();
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const onRenderDetail = () => {
    return (
      <Row style={{ display: 'flex', gap: 10 }}>
        <Col style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_Key')}</Col>
            {editedField !== 'key' ? (
              <Button
                type="text"
                style={{ padding: 5, width: 'calc(100% - 110px)' }}
                // onClick={() => editField('key')}
              >
                <Col className={styles.valueCol}>{data?.key}</Col>
              </Button>
            ) : (
              <Form.Item name="assignee" rules={requiredRule}>
                <Input style={{ width: '100%' }} onBlur={updateInfo} />
              </Form.Item>
            )}
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_Milestone')}</Col>
            {editedField !== 'milestoneId' ? (
              <Button
                type="text"
                style={{ padding: 5, width: 'calc(100% - 110px)' }}
                onClick={() => editField('milestoneId')}
              >
                <Col className={styles.valueCol}>{data?.milestone?.title}</Col>
              </Button>
            ) : (
              <Form.Item name="milestoneId" rules={requiredRule}>
                <Select options={mileStoneList} style={{ width: '100%' }} onBlur={updateInfo} />
              </Form.Item>
            )}
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_Type')}</Col>
            {editedField !== 'taskType' ? (
              <Button
                type="text"
                style={{ padding: 5, width: 'calc(100% - 110px)' }}
                onClick={() => editField('taskType')}
              >
                <Col className={styles.valueCol}>{data?.taskType2?.title}</Col>
              </Button>
            ) : (
              <Form.Item name="taskType" rules={requiredRule}>
                <Select options={typeList} style={{ width: '100%' }} onBlur={updateInfo} />
              </Form.Item>
            )}
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_Prioty')}</Col>
            {editedField !== 'taskPriotyId' ? (
              <Button
                type="text"
                style={{ padding: 5, width: 'calc(100% - 110px)' }}
                onClick={() => editField('taskPriotyId')}
              >
                <Col className={styles.valueCol}>{data?.taskPrioty?.pname}</Col>
              </Button>
            ) : (
              <Form.Item name="taskPriotyId" rules={requiredRule}>
                <Select options={priotyList} style={{ width: '100%' }} onBlur={updateInfo} />
              </Form.Item>
            )}
          </Row>
        </Col>
      </Row>
    );
  };
  const onRenderDescription = () => {
    const modules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],

        ['clean']
      ]
    };
    return editedField !== 'description' ? (
      <Button
        type="text"
        style={{ padding: 5, display: 'flex', width: '100%', alignItems: 'center', height: 'auto' }}
        onClick={() => editField('description')}
      >
        <div>
          <div dangerouslySetInnerHTML={{ __html: data?.description }} />
        </div>
      </Button>
    ) : (
      <Form.Item name="description" rules={requiredRule} style={{ width: '100%' }}>
        <ReactQuill
          theme="snow"
          modules={modules}
          style={{ display: 'flex', flexDirection: 'column', height: 200 }}
          onBlur={updateInfo}
        />
      </Form.Item>
    );
  };
  const onRenderAttachment = () => {
    const getSizeText = (size?: number) => {
      if (!size) {
        return `0KB`;
      }
      const result = (Number((size / 1024).toFixed(2)) * 100) / 100;
      return `${result}KB`;
    };
    return data.attachment?.length != 0 ? (
      <>
        <Dragger {...uploadProps} multiple={true} showUploadList={false}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a multyple upload. Strictly prohibited from uploading company data or other banned files.
          </p>
        </Dragger>
      </>
    ) : (
      <>
        {data!.attachment!.map((item: A) => (
          <div key={item.id} className="info">
            <div className="file-icon-box">
              <FileOutlined className="file-icon" />
            </div>
            <div>
              <div className="name">{item.name}</div>
              <div className="size">{getSizeText(item.size)}</div>
            </div>
          </div>
        ))}
      </>
    );
  };
  const onRenderIssueLink = () => {
    const datas = [
      {
        title: 'Ant Design Title 1'
      },
      {
        title: 'Ant Design Title 2'
      },
      {
        title: 'Ant Design Title 3'
      },
      {
        title: 'Ant Design Title 4'
      }
    ];
    return data.taskLinks?.length == 0 ? (
      <>
        <List
          itemLayout="horizontal"
          dataSource={datas}
          renderItem={(item) => (
            <List.Item key={item.title}>
              <div>
                <Link to="/">{item.title}</Link>
                <div>Description</div>
              </div>

              <Tooltip placement="bottom" title={t('Common_Delete')} color="#ffffff" arrow={true}>
                <Button type="text" onClick={() => console.log('cc')} icon={<DeleteOutlined />} />
              </Tooltip>
            </List.Item>
          )}
        />
      </>
    ) : (
      <Typography>This feature is comming soon</Typography>
    );
  };
  const onRenderPeople = () => {
    return (
      <Row style={{ display: 'flex', gap: 10 }}>
        <Col style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_Assignee')}</Col>
            {editedField !== 'assignee' ? (
              <Col className={styles.valueCol}>
                <Button
                  type="text"
                  style={{ padding: 5, width: '100%', display: 'flex' }}
                  onClick={() => editField('assignee')}
                >
                  <Typography.Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ cursor: 'pointer' }}>
                    <Avatar
                      size={30}
                      src={data?.assignee2?.avatarUrl?.url}
                      style={{ marginRight: '7px', backgroundColor: util.randomColor() }}
                    >
                      {data?.assignee2?.fullName?.charAt(0)}
                    </Avatar>
                    {data?.assignee2?.fullName}
                  </Typography.Paragraph>
                </Button>
              </Col>
            ) : (
              <Form.Item name="assignee" rules={requiredRule}>
                <Select
                  onBlur={updateInfo}
                  labelInValue
                  showSearch
                  placeholder={t('Common_SearchNameAndEmail')}
                  onClick={() => {
                    setUserMemberList([]);
                    setSelectLoading(true);
                    getUsers();
                  }}
                  onSearch={(value) => {
                    setSelectLoading(true);
                    setUserMemberList([]);
                    setSearchAssigneeValue(value);
                  }}
                  notFoundContent={
                    selectLoading ? (
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: 100
                        }}
                      >
                        <Spin />
                      </div>
                    ) : (
                      <Empty />
                    )
                  }
                  dropdownRender={(menu) => <>{menu}</>}
                  filterOption={() => true}
                  options={userMemberList}
                  suffixIcon={<SearchOutlined />}
                />
              </Form.Item>
            )}
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_Reporter')}</Col>
            {editedField !== 'reportTo' ? (
              <Col className={styles.valueCol}>
                <Button
                  type="text"
                  style={{ padding: 5, width: '100%', display: 'flex' }}
                  onClick={() => editField('reportTo')}
                >
                  <Typography.Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ cursor: 'pointer' }}>
                    <Avatar
                      size={30}
                      src={data?.reportToRelation?.avatarUrl?.url}
                      style={{ marginRight: '7px', backgroundColor: util.randomColor() }}
                    >
                      {data?.reportToRelation?.fullName?.charAt(0)}
                    </Avatar>
                    {data?.reportToRelation?.fullName}
                  </Typography.Paragraph>
                </Button>
              </Col>
            ) : (
              <Form.Item name="reportTo" rules={requiredRule}>
                <Select
                  onBlur={updateInfo}
                  labelInValue
                  showSearch
                  placeholder={t('Common_SearchNameAndEmail')}
                  onClick={() => {
                    setUserMemberList([]);
                    setSelectLoading(true);
                    getUsers();
                  }}
                  onSearch={(value) => {
                    setSelectLoading(true);
                    setUserMemberList([]);
                    setSearchAssigneeValue(value);
                  }}
                  notFoundContent={
                    selectLoading ? (
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: 100
                        }}
                      >
                        <Spin />
                      </div>
                    ) : (
                      <Empty />
                    )
                  }
                  dropdownRender={(menu) => <>{menu}</>}
                  filterOption={() => true}
                  options={userMemberList}
                  suffixIcon={<SearchOutlined />}
                />
              </Form.Item>
            )}
          </Row>
        </Col>
      </Row>
    );
  };
  const onRenderDates = () => {
    return (
      <Row style={{ display: 'flex', gap: 10 }}>
        <Col style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_CreatedDate')}</Col>
            <Button type="text" style={{ padding: 5, width: 'calc(100% - 110px)' }}>
              <Col className={styles.valueCol}>{dayjs(data?.createdDate).format('DD MMM YYYY')}</Col>
            </Button>
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_UpdatedDate')}</Col>
            <Button type="text" style={{ padding: 5, width: 'calc(100% - 110px)' }}>
              <Col className={styles.valueCol}>{dayjs(data?.updateDate).format('DD MMM YYYY')}</Col>
            </Button>
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_DueDate')}</Col>
            {editedField !== 'dueDate' ? (
              <Button
                type="text"
                style={{ padding: 5, width: 'calc(100% - 110px)' }}
                onClick={() => editField('dueDate')}
              >
                <Col className={styles.valueCol}>{dayjs(data?.dueDate).format('DD MMM YYYY')}</Col>
              </Button>
            ) : (
              <Form.Item name="dueDate" rules={requiredRule}>
                <DatePicker format={'DD MMM YYYY'} disabledDate={disabledDate} onBlur={updateInfo} />
              </Form.Item>
            )}
          </Row>
          {data?.resolvedDate && (
            <Row className={styles.detailRow}>
              <Col className={styles.keyCol}>{t('Task_ResolvedDate')}</Col>
              <Button type="text" style={{ padding: 5, width: 'calc(100% - 110px)' }}>
                <Col className={styles.valueCol}>{dayjs(data?.resoleDate).format('DD MMM YYYY')}</Col>
              </Button>
            </Row>
          )}
          {data?.closeDate && (
            <Row className={styles.detailRow}>
              <Col className={styles.keyCol}>{t('Task_ResolvedDate')}</Col>
              <Button type="text" style={{ padding: 5, width: 'calc(100% - 110px)' }}>
                <Col className={styles.valueCol}>{dayjs(data?.closeDate).format('DD MMM YYYY')}</Col>
              </Button>
            </Row>
          )}
        </Col>
      </Row>
    );
  };
  const genExtraAttachment = () => (
    <Upload {...uploadProps} multiple={true} showUploadList={false}>
      <Button style={{ padding: 10, marginBottom: '-10px' }} type="text" icon={<PlusOutlined />} />
    </Upload>
  );
  const genExtraTaskLink = () => (
    <Button style={{ padding: 10, marginBottom: '-10px' }} type="text" icon={<PlusOutlined />} onClick={showModal} />
  );
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    updateInfo();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const leftInfo = [
    { key: 'Details', label: t('Common_Details'), children: onRenderDetail() },
    { key: 'Descriptions', label: t('Common_Descriptions'), children: onRenderDescription() },
    { key: 'Attachments', label: t('Task_Attachements'), children: onRenderAttachment(), extra: genExtraAttachment() },
    { key: 'LinkIssues', label: t('Task_Link_Issues'), children: onRenderIssueLink(), extra: genExtraTaskLink() }
  ];
  const rightInfo = [
    { key: 'People', label: t('Task_People'), children: onRenderPeople() },
    { key: 'Dates', label: t('Task_Dates'), children: onRenderDates() }
  ];

  const getMilestoneList = async () => {
    try {
      const result = await service.milestoneService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        }
      });
      setMilestoneList(result.data.map((x: A) => ({ label: x?.title, value: x.id })));
    } catch (e) {
      console.log(e);
    }
  };

  const getTypeList = async () => {
    try {
      const result = await service.taskTypeService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        }
      });
      setTypeList(result.data.map((x: A) => ({ label: x?.title, value: x.id })));
    } catch (e) {
      console.log(e);
    }
  };

  const getPriotyList = async () => {
    try {
      const result = await service.taskPriotyService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        }
      });
      setPriotyList(result.data.map((x: A) => ({ label: x.pname, value: x.id })));
    } catch (e) {
      console.log(e);
    }
  };

  const getTaskList = async () => {
    try {
      const result = await service.taskService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        },
        filter: [{ key: 'projectId', value: [data.projectId] }]
      });
      setTaskList(result.data.map((x: A) => ({ label: `[` + x.key + `] ` + x.summary, value: x.id })));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Form onFinish={updateInfo} className={styles.information} form={form}>
        <Collapse
          style={{ minWidth: 700, width: '69%' }}
          items={leftInfo}
          bordered={false}
          defaultActiveKey={['Details', 'Descriptions', 'Attachments', 'LinkIssues']}
          ghost
          size="large"
          collapsible="icon"
        />
        <Collapse
          style={{ minWidth: 300, width: '30%' }}
          items={rightInfo}
          bordered={false}
          defaultActiveKey={['People', 'Dates']}
          ghost
          size="large"
          collapsible="icon"
        />
        <Modal title={t('Task_Add_LinkIssues')} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <Form.Item name="taskLinks" rules={requiredRule}>
            <Select options={taskList} mode="multiple" />
          </Form.Item>
        </Modal>
      </Form>
    </div>
  );
}

export default TaskInformation;
