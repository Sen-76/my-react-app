import { CloseOutlined } from '@ant-design/icons';
import { Button, ColorPicker, Drawer, Form, Input, notification, Checkbox } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../TaskStatusConfiguration.module.scss';
import { useTranslation } from 'react-i18next';
import { util } from '@/common/helpers/util';
import { useLoading } from '@/common/context/useLoading';
import { service } from '@/services/apis';

interface IProps {
  refreshList: () => void;
}
function Panel(props: IProps, ref: A) {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<TaskStatus.ITaskStatusModel>();
  const [form] = Form.useForm();
  const [isDefaultStatus, setIsDefaultStatus] = useState<boolean>();
  const { showLoading, closeLoading } = useLoading();

  useImperativeHandle(ref, () => ({
    openDrawer
  }));

  const openDrawer = (data?: A) => {
    setOpen(true);
    setIsEdit(false);
    form.setFieldValue('color', '#3762EA');
    if (data) {
      setIsEdit(true);
      setIsDefaultStatus(data.isDefault);
      form.setFieldsValue(data);
      setEditData(data);
    }
  };

  const closeDrawer = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = async () => {
    try {
      const hiddenInKanban = form.getFieldValue('isHiden') || false;
      const checkValid = await form.validateFields();
      if (checkValid) {
        showLoading();
        if (isEdit) {
          await service.taskStatusService.update({
            ...editData,
            ...form.getFieldsValue(),
            hiddenInKanban,
            color:
              typeof form.getFieldValue('color') === 'string'
                ? form.getFieldValue('color').toString()
                : util.rgbToHex(form.getFieldValue('color').metaColor)
          });
          notification.open({
            message: t('Common_UpdateSuccess'),
            type: 'success'
          });
        } else {
          await service.taskStatusService.create({
            ...form.getFieldsValue(),
            hiddenInKanban,
            color:
              typeof form.getFieldValue('color') === 'string'
                ? form.getFieldValue('color').toString()
                : util.rgbToHex(form.getFieldValue('color').metaColor)
          });
          notification.open({
            message: t('Common_CreateSuccess'),
            type: 'success'
          });
        }
        closeDrawer();
        props.refreshList();
      }
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const formRule = {
    title: [{ required: true, message: t('Common_Require_Field') }],
    color: [{ required: true, message: t('Common_Require_Field') }]
  };

  return (
    <>
      <Drawer
        title={isEdit ? t('Configuration_Status_Edit') : t('Configuration_Status_Create')}
        placement="right"
        open={open}
        extra={<CloseOutlined onClick={closeDrawer} />}
        onClose={closeDrawer}
        maskClosable={false}
        closable={false}
        width={720}
        destroyOnClose={true}
      >
        <Form form={form} onFinish={onFinish} layout="vertical" className={styles.panelform}>
          <Form.Item name="title" label={t('Common_Title')} rules={formRule.title}>
            <Input disabled={isDefaultStatus} maxLength={250} showCount />
          </Form.Item>
          <Form.Item name="color" label={t('Common_Color')} rules={formRule.color}>
            <ColorPicker />
          </Form.Item>
          <Form.Item name="description" label={t('Common_Description')}>
            <Input.TextArea maxLength={1000} showCount rows={5} />
          </Form.Item>
          <Form.Item name="isHiden" valuePropName="checked">
            <Checkbox>{t('Status_Field_HiddenInKanbanBoard_Entry')}</Checkbox>
          </Form.Item>
        </Form>
        <div className="actionBtnBottom">
          <Button onClick={closeDrawer}>{t('Common_Cancel')}</Button>
          <Button type="primary" htmlType="submit" onClick={onFinish}>
            {t('Common_Confirm')}
          </Button>
        </div>
      </Drawer>
    </>
  );
}

export default forwardRef(Panel);
