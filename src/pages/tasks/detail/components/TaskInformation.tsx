/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Avatar,
  Button,
  Col,
  Collapse,
  DatePicker,
  Empty,
  Form,
  Image,
  List,
  Modal,
  Row,
  Select,
  Spin,
  Tooltip,
  Typography,
  Upload,
  UploadProps,
  notification
} from 'antd';
import styles from '../TaskDetail.module.scss';
import { useTranslation } from 'react-i18next';
import { util } from '@/common/helpers/util';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
import ReactQuill from 'react-quill';
import {
  DeleteOutlined,
  DownloadOutlined,
  FileOutlined,
  InboxOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import useDebounce from '@/common/helpers/useDebounce';
import Paragraph from 'antd/es/typography/Paragraph';
import { Link, useParams } from 'react-router-dom';
import icons from '@/assets/icons';

interface IProps {
  data: A;
  refreshData: () => void;
  setEditTitle: (value: boolean) => void;
}
function TaskInformation(props: Readonly<IProps>) {
  const { data, refreshData, setEditTitle } = props;
  const paramData = useParams();
  const { t } = useTranslation();
  const { showLoading, closeLoading } = useLoading();
  const [editedField, setEditedField] = useState<string>('');
  const [mileStoneList, setMileStoneList] = useState<A[]>([]);
  const [priotyList, setPriotyList] = useState<A[]>([]);
  const [typeList, setTypeList] = useState<A[]>();
  const [userMemberList, setUserMemberList] = useState<A[]>([]);
  const [taskList, setTaskList] = useState<A[]>([]);
  const [selectLoading, setSelectLoading] = useState<boolean>();
  const [searchAssigneeValue, setSearchAssigneeValue] = useState<string>('');
  const userDebouncedAssignee = useDebounce(searchAssigneeValue, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileAccept, setFileAccept] = useState<A>();
  const [form] = Form.useForm();
  const { Dragger } = Upload;

  useEffect(() => {
    getUsers();
  }, [userDebouncedAssignee]);

  useEffect(() => {
    if (data) {
      getTaskList();
    }
  }, [data]);

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
      const loginUser = JSON.parse(sessionStorage.getItem('userDetail') ?? '{}');
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

  const updateInfo = async (attach?: A, issueLink?: A) => {
    try {
      showLoading();
      setEditedField('');
      const cleanData = { ...data };
      form.getFieldValue('taskLinksMore')?.length > 0 &&
        (issueLink = [...data.taskLinks.map((x: A) => x.id), ...form.getFieldValue('taskLinksMore')]);
      await service.taskService.update({
        ...data,
        ...form.getFieldsValue(),
        assignee: form.getFieldValue('assignee')?.value ? form.getFieldValue('assignee')?.value : data.assignee,
        reportTo: form.getFieldValue('reportTo')?.value ? form.getFieldValue('reportTo')?.value : data.reportTo,
        attachments: attach && attach.length > 0 ? attach : cleanData.fileAttachments,
        taskLinkIds: typeof issueLink === 'object' ? issueLink : cleanData.taskLinks.map((x: A) => x.taskLinkId) ?? []
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
      const promises = [getMilestoneList(), getTypeList(), getPriotyList()];
      await Promise.all(promises);
    };
    fetchApi();
  }, []);

  const editField = (val: string) => {
    if (data.status?.title === 'Open') {
      setEditTitle(false);
      setEditedField(val);
      data.dueDate = dayjs(data.dueDate);
      form.setFieldsValue(data);
    }
  };

  const requiredRule = [{ required: true, message: t('Common_Require_Field') }];

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  let uploadFlag = false;
  const uploadProps: UploadProps = {
    beforeUpload: (file: A, list: A) => {
      if (!uploadFlag) {
        let test: A[] = [];
        list.forEach((filex: A) => {
          let fileType = filex.type;
          if (filex.type === 'application/msword') fileType = 'application/docs';
          const type = fileAccept.fileAccept.split(', ').includes(fileType.split('/')[1]);
          if (!type) {
            notification.open({
              message: t(`You can only upload ${fileAccept.fileAccept} file!`),
              type: 'error'
            });
            return false;
          }
          const size = filex.size < fileAccept.fileSize * 1024 * 1024;
          if (!size) {
            notification.open({
              message: t(`Image must be smaller than ${fileAccept.fileSize}MB!`),
              type: 'error'
            });
            return false;
          } else {
            test = [...test, filex];
          }
        });
        handleUpload(test);
        uploadFlag = true;
      }
      return false;
    }
  };

  useEffect(() => {
    getFileConfig();
  }, []);

  const getFileConfig = async () => {
    try {
      const result = await service.globalSettingsService.getByType(1);
      setFileAccept(result.detail.filter((x: A) => x.title === 'Attachments')[0]);
    } catch (e) {
      console.log(e);
    }
  };

  const IconShow = ({ value, ...props }: A) => {
    const iconItem = icons.find((icon) => icon.value === value);
    return iconItem ? React.cloneElement(iconItem.component, props) : null;
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
      const result = await service.taskService.uploadAttach(formData);
      await updateInfo([...data.fileAttachments, ...result.data]);
      refreshData();
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
      uploadFlag = false;
    }
  };

  const onRenderDetail = () => {
    return (
      <Row style={{ display: 'flex', gap: 10 }}>
        <Col style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          {/* <Row className={styles.detailRow}>
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
          </Row> */}
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
          {/* <Row className={styles.detailRow}>
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
          </Row> */}
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_Priority')}</Col>
            {editedField !== 'taskPriotyId' ? (
              <Button
                type="text"
                style={{ padding: 5, width: 'calc(100% - 110px)' }}
                onClick={() => editField('taskPriotyId')}
              >
                <Col className={styles.valueCol}>
                  <IconShow value={data?.taskPrioty?.iconUrl} disabled style={{ marginRight: 10 }} />
                  {data?.taskPrioty?.pname}
                </Col>
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
      data?.description ? (
        <Button
          type="text"
          style={{ padding: 5, display: 'flex', width: '100%', alignItems: 'center', height: 'auto' }}
          onClick={() => editField('description')}
        >
          <div className="ql-editor" style={{ width: '100%' }}>
            <div dangerouslySetInnerHTML={{ __html: data?.description }} />
          </div>
        </Button>
      ) : (
        <Button
          type="text"
          style={{ padding: 5, display: 'flex', width: '100%', alignItems: 'center', height: 'auto' }}
          onClick={() => editField('description')}
        >
          <Empty />
        </Button>
      )
    ) : (
      <>
        <Form.Item name="description" rules={requiredRule} style={{ width: '100%' }}>
          <ReactQuill
            theme="snow"
            modules={modules}
            style={{ display: 'flex', flexDirection: 'column', height: 200 }}
          />
        </Form.Item>
        <Button type="primary" onClick={updateInfo} style={{ marginTop: 5 }}>
          Save
        </Button>
      </>
    );
  };
  const onRenderAttachment = () => {
    return data.fileAttachments?.length === 0 ? (
      data.status?.title === 'Open' ? (
        <Dragger {...uploadProps} multiple={true} showUploadList={false}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{t('Common_UploadFile_TaskDetail_Entry')}</p>
          <p className="ant-upload-hint">{t('Common_UploadFile_TaskDetail_Description_Entry')}</p>
        </Dragger>
      ) : (
        <Empty />
      )
    ) : (
      <List
        itemLayout="horizontal"
        dataSource={data.fileAttachments}
        renderItem={(item: A) => (
          <List.Item key={item?.fileName}>
            <div style={{ display: 'flex', alignItems: 'center', width: 'calc(100% - 100px)' }}>
              <div style={{ fontSize: 20, margin: '0 20px' }}>
                {item.fileType.toLowerCase() === 'jpg' ||
                item.fileType.toLowerCase() === 'png' ||
                item.fileType.toLowerCase() === 'webp' ||
                item.fileType.toLowerCase() === 'jpeg' ? (
                  <Image width={100} height={100} src={item?.url} />
                ) : (
                  <FileOutlined className="file-icon" />
                )}
              </div>
              <Paragraph ellipsis={{ rows: 1, expandable: false }}>
                <div style={{ fontWeight: 500, fontSize: 18 }}>{item?.fileName}</div>
              </Paragraph>
            </div>
            <div>
              <Tooltip placement="bottom" title={t('Common_Download')} color="#ffffff" arrow={true}>
                <a href={item.url} download>
                  <Button type="text" icon={<DownloadOutlined />} />
                </a>
              </Tooltip>
              {data.status?.title === 'Open' && (
                <Tooltip placement="bottom" title={t('Common_Delete')} color="#ffffff" arrow={true}>
                  <Button
                    type="text"
                    onClick={() => updateInfo(data.fileAttachments.filter((x: A) => x.id !== item.id))}
                    icon={<DeleteOutlined />}
                  />
                </Tooltip>
              )}
            </div>
          </List.Item>
        )}
      />
    );
  };
  const onRenderIssueLink = () => {
    return data.taskLinks?.length > 0 ? (
      <List
        itemLayout="horizontal"
        dataSource={data.taskLinks}
        renderItem={(item: A) => (
          <List.Item key={item.id}>
            <div>
              <Link to={`/tasks/task-detail/${item?.taskLink?.key}/${item?.taskLink?.id}`}>
                [{item?.taskLink?.key}] {item?.taskLink?.summary}
              </Link>
            </div>

            <Tooltip placement="bottom" title={t('Common_Delete')} color="#ffffff" arrow={true}>
              <Button
                type="text"
                onClick={() =>
                  updateInfo(
                    undefined,
                    data.taskLinks?.filter((x: A) => x.taskLinkId !== item.taskLinkId)?.map((x: A) => x.taskLinkId)
                  )
                }
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </List.Item>
        )}
      />
    ) : (
      <Empty />
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
                  style={{ padding: 5, width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}
                  onClick={() => editField('assignee')}
                >
                  <Avatar
                    size={30}
                    src={data?.assignee2?.avatarUrl?.url}
                    style={{ backgroundColor: util.randomColor(), width: 30 }}
                  >
                    {data?.assignee2?.fullName?.charAt(0)}
                  </Avatar>
                  <Typography.Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ cursor: 'pointer' }}>
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
                  style={{ padding: 5, width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}
                  onClick={() => editField('reportTo')}
                >
                  <Avatar
                    size={30}
                    src={data?.reportToRelation?.avatarUrl?.url}
                    style={{ backgroundColor: util.randomColor(), width: 30 }}
                  >
                    {data?.reportToRelation?.fullName?.charAt(0)}
                  </Avatar>
                  <Typography.Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ cursor: 'pointer' }}>
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
  const genExtraAttachment = () =>
    data.status?.title === 'Open' ? (
      <Upload {...uploadProps} multiple={true} showUploadList={false}>
        <Button
          disabled={data.status?.title === 'Done'}
          style={{ padding: 10, marginBottom: '-10px' }}
          onClick={() => (uploadFlag = false)}
          type="text"
          icon={<PlusOutlined />}
        />
      </Upload>
    ) : (
      <></>
    );
  const genExtraTaskLink = () =>
    data.status?.title === 'Open' ? (
      <Button
        disabled={data.status?.title === 'Done'}
        style={{ padding: 10, marginBottom: '-10px' }}
        type="text"
        icon={<PlusOutlined />}
        onClick={showModal}
      />
    ) : (
      <></>
    );
  const showModal = () => {
    form.setFieldValue(
      'taskLinksMore',
      data.taskLinks.map((x: A) => x.taskLinkId)
    );
    setIsModalOpen(true);
  };
  const handleOk = () => {
    console.log(form.getFieldValue('taskLinksMore'));
    updateInfo(undefined, form.getFieldValue('taskLinksMore'));
    form.setFieldValue('taskLinksMore', []);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    form.setFieldValue('taskLinksMore', []);
    setIsModalOpen(false);
  };
  const leftInfo = [
    { key: 'Details', label: t('Common_Details'), children: onRenderDetail() },
    { key: 'Descriptions', label: t('Common_Descriptions'), children: onRenderDescription() },
    { key: 'Attachments', label: t('Task_Attachments'), children: onRenderAttachment(), extra: genExtraAttachment() },
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
      setMileStoneList(result.data.map((x: A) => ({ label: x?.title, value: x.id })));
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
      setPriotyList(
        result.data.map((x: A) => ({
          label: (
            <>
              <IconShow value={x?.iconUrl} disabled style={{ marginRight: 10 }} />
              {x?.pname}
            </>
          ),
          value: x.id
        }))
      );
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
        filter: [
          { key: 'projectId', value: [data?.projectId] },
          {
            key: 'id',
            value: [paramData.id],
            operators: 'not in'
          }
        ]
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
          className={styles.leftCollapse}
          items={leftInfo}
          bordered={false}
          defaultActiveKey={['Details', 'Descriptions', 'Attachments', 'LinkIssues']}
          ghost
          size="large"
          collapsible="icon"
        />
        <Collapse
          className={styles.rightCollapse}
          items={rightInfo}
          bordered={false}
          defaultActiveKey={['People', 'Dates']}
          ghost
          size="large"
          collapsible="icon"
        />
        <Modal title={t('Task_Add_LinkIssues')} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <Form.Item name="taskLinksMore" rules={requiredRule}>
            <Select options={taskList} mode="multiple" />
          </Form.Item>
        </Modal>
      </Form>
    </div>
  );
}

export default TaskInformation;
