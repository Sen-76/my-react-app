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
  const [projectList, setProjectList] = useState<Project.IProjectModel[]>();
  const [statusList, setStatusList] = useState<Project.IProjectModel[]>();
  const [selectLoading, setSelectLoading] = useState<boolean>();
  const [userMemberList, setUserMemberList] = useState<Account.IAccountModel[]>([]);
  const [mileStoneList, setMilestoneList] = useState<Account.IAccountModel[]>([]);
  const [priotyList, setPriotyList] = useState<Account.IAccountModel[]>([]);
  const [taskList, setTaskList] = useState<Account.IAccountModel[]>([]);
  const [editData, setEditDate] = useState<A[]>([]);
  const [searchAssigneeValue, setSearchAssigneeValue] = useState<string>('');
  const userDebouncedAssignee = useDebounce(searchAssigneeValue, 300);

  useEffect(() => {
    getUsers();
  }, [userDebouncedAssignee]);

  useImperativeHandle(ref, () => ({
    openDrawer
  }));

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

  const openDrawer = async (data?: A) => {
    try {
      showLoading();
      setOpen(true);
      setIsEdit(false);
      const promises = [getProjectList(), getTaskList(), getStatusList(), getMilestoneList(), getPriotyList()];
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
      data.dueDate = dayjs(data.dueDate);
      form.setFieldsValue(data);
      setEditDate(data);
    } catch (e) {
      console.log(e);
    }
  };

  const getUsers = async () => {
    try {
      const draftParam = { ...initDataGrid };
      draftParam.searchInfor!.searchValue = userDebouncedAssignee ?? '';
      const result = await service.accountService.getAccount(draftParam);
      const optionsValue = result.data?.map((x: A) => ({
        label: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size={25} src={x?.photoUrl} style={{ marginRight: 10, backgroundColor: util.randomColor() }}>
              {x.fullName?.charAt(0)}
            </Avatar>
            <div>
              <Paragraph
                ellipsis={{ rows: 1, expandable: false }}
                style={{ maxWidth: 350, minWidth: 30, fontWeight: 600, fontSize: 16, lineHeight: '20px' }}
              >
                {x.fullName}
              </Paragraph>
              <Paragraph
                ellipsis={{ rows: 1, expandable: false }}
                style={{ maxWidth: 350, minWidth: 30, lineHeight: '16px', fontSize: 12 }}
              >
                {x.userEmail}
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
      setProjectList(result.data.map((x: A) => ({ label: x.title, value: x.id })));
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
      setStatusList(result.data.map((x: A) => ({ label: x.title, value: x.id })));
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
      setMilestoneList(result.data.map((x: A) => ({ label: x.title, value: x.id })));
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
        }
      });
      setTaskList(result.data.map((x: A) => ({ label: x.summary, value: x.id })));
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
      if (isEdit) {
        await service.taskService.update({
          ...editData,
          ...val,
          assignee: val.assignee.value,
          reportTo: val.reportTo.value,
          taskType: null,
          dueDate: dayjs(val.dueDate).format('YYYY-MM-DD')
        });
        notification.open({
          message: t('Common_UpdateSuccess'),
          type: 'success'
        });
      }
      await service.taskService.create({
        ...val,
        assignee: val.assignee.value,
        reportTo: val.reportTo.value,
        taskType: null,
        dueDate: dayjs(val.dueDate).format('YYYY-MM-DD'),
        statusId: `c24ddc20-68b5-4556-b34f-93b3b70a4e88`
      });
      notification.open({
        message: t('Common_CreateSuccess'),
        type: 'success'
      });
      // props.refreshList();
      // closeDrawer();
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const formRule = {
    project: [{ required: true, message: t('Common_Require_Field') }],
    status: [{ required: true, message: t('Common_Require_Field') }],
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

  return (
    <>
      <Drawer
        title={isEdit ? t('Configuration_File_Edit') : t('Configuration_File_Create')}
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
            <Select options={projectList} />
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
          {/* <Row> */}
          <Form.Item name="assignee" label={t('Task_Assignee')}>
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
          {/* <Button style={{ padding: 0 }} type="link">
              {t('Task_Assign_To_Me')}
            </Button>
          </Row> */}
          <Form.Item name="milestoneId" label={t('Task_Milestone')}>
            <Select options={mileStoneList} />
          </Form.Item>
          <Form.Item name="taskPriotyId" label={t('Task_Prioty')}>
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
