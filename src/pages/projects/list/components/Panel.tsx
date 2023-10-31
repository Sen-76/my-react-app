import { CloseOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, DatePicker, Drawer, Form, Input, Row, Select, message, notification } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../Project.module.scss';
import TextArea from 'antd/es/input/TextArea';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
import Paragraph from 'antd/es/typography/Paragraph';
import dayjs from 'dayjs';
import { StatusOptions } from '../Project.model';

interface IProps {
  refreshList: () => void;
}
function Panel(props: IProps, ref: A) {
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [editData, setEditData] = useState<Role.IRoleCreateModel>();
  const { showLoading, closeLoading } = useLoading();
  const [customAlert, setCustomAlert] = useState<A>();
  const [departmentList, setDepartmentList] = useState<A>([]);
  const [teamList, setTeamList] = useState<A>([]);

  useImperativeHandle(ref, () => ({
    openDrawer
  }));

  const openDrawer = async (data?: Project.IProjectModel) => {
    try {
      showLoading();
      setOpen(true);
      setIsEdit(false);
      await getDepartmentList();
      if (data?.id) {
        await getTeam(data.departmentId);
        form.setFieldsValue({ ...data, startDate: dayjs(data.startDate), dueDate: dayjs(data.dueDate) });
        setEditData(data);
        setIsEdit(true);
      }
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const getDepartmentList = async () => {
    try {
      const result = await service.departmentService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        }
      });
      setDepartmentList([
        ...result.data.map((department: A) => ({
          label: department.title,
          value: department.id
        }))
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  const getTeam = async (departmentId: string) => {
    try {
      showLoading();
      const result = await service.teamService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        },
        filter: [{ key: 'DepartmentId', value: [departmentId] }]
      });
      setTeamList([
        ...result.data.map((team: A) => ({
          label: team.title,
          value: team.id
        }))
      ]);
      closeLoading();
    } catch (e) {
      console.log(e);
    }
  };

  const onFinish = async (val: A) => {
    try {
      showLoading();
      if (isEdit) {
        await service.projectService.update({
          ...editData,
          ...val,
          startDate: dayjs(val.startDate).format('YYYY-MM-DD'),
          dueDate: dayjs(val.dueDate).format('YYYY-MM-DD')
        });
        notification.open({
          message: t('Common_UpdateSuccess'),
          type: 'success'
        });
      } else {
        await service.projectService.create({
          ...val,
          startDate: dayjs(val.startDate).format('YYYY-MM-DD'),
          dueDate: dayjs(val.dueDate).format('YYYY-MM-DD')
        });
        notification.open({
          message: t('Common_CreateSuccess'),
          type: 'success'
        });
      }
      closeDrawer();
      props.refreshList();
    } catch (e: A) {
      if (e.response?.data.status === 422) {
        const errors: A = e.response.data.errors;
        setCustomAlert(errors);
      }
    } finally {
      closeLoading();
    }
  };

  const closeDrawer = () => {
    form.resetFields();
    setCustomAlert([]);
    setTeamList([]);
    setOpen(false);
    setIsEdit(false);
  };

  const formRule = {
    title: [{ required: true, message: t('Common_Require_Field') }],
    status: [{ required: true, message: t('Common_Require_Field') }],
    department: [{ required: true, message: t('Common_Require_Field') }],
    team: [{ required: true, message: t('Common_Require_Field') }],
    startDate: [{ required: true, message: t('Common_Require_Field') }],
    dueDate: [{ required: true, message: t('Common_Require_Field') }]
  };

  const disabledStartDate = (current: dayjs.Dayjs) => {
    const dueDate = form.getFieldValue('dueDate');
    return dueDate
      ? (current && current > dayjs(dueDate).startOf('day')) || current < dayjs().startOf('day')
      : current < dayjs().startOf('day');
  };

  const disabledDueDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs(form.getFieldValue('startDate')).endOf('day');
  };

  return (
    <>
      <Drawer
        title={isEdit ? `${t('Manage_Project_Edit')}` : `${t('Manage_Project_Add')}`}
        placement="right"
        open={open}
        extra={<CloseOutlined onClick={closeDrawer} />}
        onClose={closeDrawer}
        maskClosable={false}
        closable={false}
        width={720}
        destroyOnClose={true}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} className={styles.panelform}>
          <Form.Item
            name="key"
            label={t('Project_Key')}
            rules={formRule.title}
            className={customAlert?.key && 'customFieldAlert'}
          >
            <Input maxLength={250} showCount onChange={() => setCustomAlert({ ...customAlert, key: '' })} />
          </Form.Item>
          {customAlert?.key && <div className="customAlert">{t('Manage_Account_Exist_Key')}</div>}
          <Form.Item
            name="title"
            label={t('Common_Title')}
            rules={formRule.title}
            className={customAlert?.userEmail && 'customFieldAlert'}
          >
            <Input maxLength={250} showCount onChange={() => setCustomAlert({ ...customAlert, title: '' })} />
          </Form.Item>
          {customAlert?.title && <div className="customAlert">{t('Common_TitleExist')}</div>}
          {isEdit && (
            <Form.Item name="status" label={t('Common_Status')} rules={formRule.status}>
              <Select options={StatusOptions} />
            </Form.Item>
          )}
          <Form.Item name="departmentId" label={t('department')} rules={formRule.department}>
            <Select
              options={departmentList}
              onSelect={(val) => {
                form.setFieldValue('teamId', '');
                getTeam(val);
              }}
              disabled={isEdit}
            />
          </Form.Item>
          {teamList.length !== 0 && (
            <Form.Item name="teamId" label={t('team')} rules={formRule.team}>
              <Select disabled={isEdit} options={teamList} />
            </Form.Item>
          )}
          <Form.Item name="startDate" label={t('Project_StartDate')} rules={formRule.startDate}>
            <DatePicker format={'DD MMM YYYY'} disabledDate={disabledStartDate} />
          </Form.Item>
          <Form.Item name="dueDate" label={t('Project_DueDate')} rules={formRule.dueDate}>
            <DatePicker format={'DD MMM YYYY'} disabledDate={disabledDueDate} />
          </Form.Item>
          <Form.Item name="description" label={t('Common_Description')}>
            <TextArea maxLength={1000} rows={5} showCount />
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
