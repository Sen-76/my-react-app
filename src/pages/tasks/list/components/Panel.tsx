/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  CloseOutlined,
  EllipsisOutlined,
  EyeOutlined,
  SearchOutlined,
  ShareAltOutlined,
  UploadOutlined
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  DatePicker,
  Drawer,
  Empty,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Upload,
  UploadFile,
  UploadProps,
  notification
} from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import styles from '../Task.module.scss';
import { useTranslation } from 'react-i18next';
import { useLoading } from '@/common/context/useLoading';
import dayjs from 'dayjs';
import { service } from '@/services/apis';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useDebounce from '@/common/helpers/useDebounce';
import Paragraph from 'antd/es/typography/Paragraph';
import { util } from '@/common/helpers/util';
import { useLoginManager } from '@/common/helpers/login-manager';

interface IProps {
  refreshList: () => void;
}
function Panel(props: IProps, ref: A) {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { showLoading, closeLoading } = useLoading();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [projectList, setProjectList] = useState<A[]>();
  const [statusList, setStatusList] = useState<A[]>();
  const [typeList, setTypeList] = useState<A[]>();
  const [selectLoading, setSelectLoading] = useState<boolean>();
  const [userMemberList, setUserMemberList] = useState<A[]>([]);
  const [mileStoneList, setMilestoneList] = useState<A[]>([]);
  const [projectId, setProjectId] = useState<string>('');
  const [priotyList, setPriotyList] = useState<A[]>([]);
  const [taskList, setTaskList] = useState<A[]>([]);
  const [editData, setEditData] = useState<A>();
  const [searchAssigneeValue, setSearchAssigneeValue] = useState<string>('');
  const userDebouncedAssignee = useDebounce(searchAssigneeValue, 300);
  const { getLoginUser } = useLoginManager();

  useEffect(() => {
    getUsers();
  }, [userDebouncedAssignee]);

  useImperativeHandle(ref, () => ({
    openDrawer
  }));

  const openDrawer = async (data?: A) => {
    try {
      showLoading();
      setOpen(true);
      setIsEdit(false);
      const promises = [getProjectList(), getStatusList(), getMilestoneList(), getPriotyList(), getTypeList()];
      await Promise.all(promises);
      if (data) {
        setIsEdit(true);
        await getDetail(data.id);
      }
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const getDetail = async (id: string) => {
    try {
      const { data } = await service.taskService.getDetail(id);
      getTaskList(data.projectId);
      data.dueDate = dayjs(data.dueDate);
      form.setFieldsValue(data);
      setEditData(data);
    } catch (e) {
      console.log(e);
    }
  };

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

  const getProjectList = async () => {
    try {
      const result = await service.projectService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        }
      });
      setProjectList(result.data.map((x: A) => ({ label: x?.title, value: x.id })));
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

  const getStatusList = async () => {
    try {
      const result = await service.taskStatusService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        }
      });
      setStatusList(result.data.map((x: A) => ({ label: x?.title, value: x.id })));
    } catch (e) {
      console.log(e);
    }
  };

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

  const getTaskList = async (projectId?: string) => {
    try {
      const result = await service.taskService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        },
        filter: [{ key: 'projectId', value: [projectId] }]
      });
      setTaskList(result.data.map((x: A) => ({ label: `[` + x.key + `] ` + x.summary, value: x.id })));
    } catch (e) {
      console.log(e);
    }
  };

  const closeDrawer = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = async (val: A) => {
    try {
      showLoading();
      let attachmentList = [];
      fileList.length > 0 && (attachmentList = await handleUpload());
      if (isEdit) {
        await service.taskService.update({
          ...editData,
          ...val,
          assignee: typeof val.assignee === 'string' ? val.assignee : val.assignee.value,
          reportTo: typeof val.reportTo === 'string' ? val.reportTo : val.reportTo.value,
          dueDate: dayjs(val.dueDate).format('YYYY-MM-DD'),
          attachment: attachmentList
        });
        notification.open({
          message: t('Common_UpdateSuccess'),
          type: 'success'
        });
      } else {
        await service.taskService.create({
          ...val,
          assignee: val.assignee ? val.assignee.value : '',
          reportTo: val.reportTo.value ?? '',
          dueDate: dayjs(val.dueDate).format('YYYY-MM-DD'),
          attachment: attachmentList
        });
        notification.open({
          message: t('Common_CreateSuccess'),
          type: 'success'
        });
      }
      props.refreshList();
      closeDrawer();
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const formRule = {
    project: [{ required: true, message: t('Common_Require_Field') }],
    status: [{ required: true, message: t('Common_Require_Field') }],
    key: [{ required: true, message: t('Common_Require_Field') }],
    summary: [{ required: true, message: t('Common_Require_Field') }],
    dueDate: [{ required: true, message: t('Common_Require_Field') }],
    description: [{ required: true, message: t('Common_Require_Field') }],
    reportTo: [{ required: true, message: t('Common_Require_Field') }]
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  const fileProps: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('outletId', 'la cai d gi');
    formData.append('comment', 'comment làm cái đúng gì');
    formData.append('id', editData?.id.toString() ?? 'dm');
    fileList.forEach((file: A) => {
      formData.append('files', file);
    });
    const result = await service.taskService.uploadAttach(formData);
    return result.data;
  };

  const onProjectSelect = (val: string) => {
    showLoading();
    getTaskList(val);
    setProjectId(val);
    closeLoading();
  };

  return (
    <>
      <Drawer
        title={isEdit ? t('Task_Update') : t('Task_Create')}
        placement="right"
        open={open}
        extra={
          <div style={{ display: 'flex', gap: 20 }}>
            {/* <EyeOutlined />
            <ShareAltOutlined />
            <EllipsisOutlined /> */}
            <CloseOutlined onClick={closeDrawer} />
          </div>
        }
        onClose={closeDrawer}
        maskClosable={false}
        closable={false}
        width={720}
        destroyOnClose={true}
      >
        <Form form={form} onFinish={onFinish} layout="vertical" className={styles.panelform}>
          <Form.Item name="projectId" label={t('Task_Project')} rules={formRule.project}>
            <Select options={projectList} onSelect={onProjectSelect} />
          </Form.Item>
          <Form.Item name="taskType" label={t('Task_Type')} rules={formRule.project}>
            <Select options={typeList} />
          </Form.Item>
          {isEdit && (
            <Form.Item name="statusId" label={t('Common_Status')} rules={formRule.status}>
              <Select options={statusList} />
            </Form.Item>
          )}
          <Form.Item name="summary" label={t('Task_Summary')} rules={formRule.summary}>
            <Input maxLength={250} showCount />
          </Form.Item>
          <Form.Item name="dueDate" label={t('Task_DueDate')} rules={formRule.dueDate}>
            <DatePicker format={'DD MMM YYYY'} disabledDate={disabledDate} />
          </Form.Item>
          <Form.Item name="description" label={t('Common_Description')} rules={formRule.description}>
            <ReactQuill theme="snow" />
          </Form.Item>
          <Form.Item name="assignee" label={t('Task_Assignee')} rules={formRule.summary}>
            <Select
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
          <Button
            className={styles.customAlert}
            type="link"
            onClick={() =>
              form.setFieldValue('assignee', {
                label: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      size={25}
                      src={localStorage.getItem('avatar')}
                      style={{ marginRight: 10, backgroundColor: util.randomColor() }}
                    >
                      {getLoginUser().user?.fullName?.charAt(0)}
                    </Avatar>
                    <div>
                      <Paragraph
                        ellipsis={{ rows: 1, expandable: false }}
                        style={{ maxWidth: 350, minWidth: 30, fontWeight: 600, fontSize: 16, lineHeight: '20px' }}
                      >
                        {getLoginUser().user?.fullName}
                      </Paragraph>
                      <Paragraph
                        ellipsis={{ rows: 1, expandable: false }}
                        style={{ maxWidth: 350, minWidth: 30, lineHeight: '16px', fontSize: 12 }}
                      >
                        {getLoginUser().user?.userEmail}
                      </Paragraph>
                    </div>
                  </div>
                ),
                value: getLoginUser().user.id
              })
            }
          >
            {t('Task_Assign_To_Me')}
          </Button>
          <Form.Item name="milestoneId" label={t('Task_Milestone')} rules={formRule.summary}>
            <Select options={mileStoneList} />
          </Form.Item>
          <Form.Item name="taskPriotyId" label={t('Task_Prioty')} rules={formRule.summary}>
            <Select options={priotyList} />
          </Form.Item>
          <Form.Item name="reportTo" label={t('Task_ReportTo')} rules={formRule.reportTo}>
            <Select
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
          <Button
            className={styles.customAlert}
            type="link"
            onClick={() =>
              form.setFieldValue('reportTo', {
                label: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      size={25}
                      src={localStorage.getItem('avatar')}
                      style={{ marginRight: 10, backgroundColor: util.randomColor() }}
                    >
                      {getLoginUser().user?.fullName?.charAt(0)}
                    </Avatar>
                    <div>
                      <Paragraph
                        ellipsis={{ rows: 1, expandable: false }}
                        style={{ maxWidth: 350, minWidth: 30, fontWeight: 600, fontSize: 16, lineHeight: '20px' }}
                      >
                        {getLoginUser().user?.fullName}
                      </Paragraph>
                      <Paragraph
                        ellipsis={{ rows: 1, expandable: false }}
                        style={{ maxWidth: 350, minWidth: 30, lineHeight: '16px', fontSize: 12 }}
                      >
                        {getLoginUser().user.userEmail}
                      </Paragraph>
                    </div>
                  </div>
                ),
                value: getLoginUser().user.id
              })
            }
          >
            {t('Task_Assign_To_Me')}
          </Button>
          <Form.Item name="attachment" label={t('Task_Attachment')}>
            <Upload {...fileProps} listType="picture" multiple>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="taskLinks" label={t('Task_Link_Task')}>
            <Select options={taskList} mode="multiple" />
          </Form.Item>
          <div className="actionBtnBottom">
            <Button onClick={closeDrawer}>{t('Common_Cancel')}</Button>
            <Button type="primary" htmlType="submit">
              {t('Common_Confirm')}
            </Button>
          </div>
        </Form>
      </Drawer>
    </>
  );
}

export default forwardRef(Panel);
