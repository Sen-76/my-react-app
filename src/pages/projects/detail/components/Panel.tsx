import { CloseOutlined } from '@ant-design/icons';
import { Button, DatePicker, Drawer, Form, Input, notification } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../ProjectDetail.module.scss';
import TextArea from 'antd/es/input/TextArea';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
import dayjs from 'dayjs';
import { useParams } from 'react-router';

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
  const dataLocation = useParams();

  useImperativeHandle(ref, () => ({
    openDrawer
  }));

  const openDrawer = async (data?: Project.IProjectModel) => {
    try {
      showLoading();
      setOpen(true);
      setIsEdit(false);
      if (data?.id) {
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

  const onFinish = async (val: A) => {
    try {
      showLoading();
      if (isEdit) {
        await service.milestoneService.update({
          ...editData,
          ...val,
          projectId: dataLocation.id,
          startDate: dayjs(val.startDate).format('YYYY-MM-DD'),
          dueDate: dayjs(val.dueDate).format('YYYY-MM-DD')
        });
        notification.open({
          message: t('Common_UpdateSuccess'),
          type: 'success'
        });
      } else {
        await service.milestoneService.create({
          ...val,
          projectId: dataLocation.id,
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
    setOpen(false);
    setIsEdit(false);
  };

  const formRule = {
    title: [{ required: true, message: t('Common_Require_Field') }],
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
        title={isEdit ? `${t('Milestone_Edit_Entry')}` : `${t('Milestone_AddNew_Entry')}`}
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
            name="title"
            label={t('Common_Title')}
            rules={formRule.title}
            className={customAlert?.userEmail && 'customFieldAlert'}
          >
            <Input maxLength={250} showCount onChange={() => setCustomAlert({ ...customAlert, title: '' })} />
          </Form.Item>
          {customAlert?.title && <div className="customAlert">{t('Common_TitleExist')}</div>}
          <Form.Item name="startDate" label={t('Milestone_StartDate')} rules={formRule.startDate}>
            <DatePicker format={'DD MMM YYYY'} disabledDate={disabledStartDate} />
          </Form.Item>
          <Form.Item name="dueDate" label={t('Milestone_DueDate')} rules={formRule.dueDate}>
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
