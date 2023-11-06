import { CloseOutlined } from '@ant-design/icons';
import { Button, ColorPicker, Drawer, Form, Input, notification } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../TaskTypeConfiguration.module.scss';
import { useTranslation } from 'react-i18next';
import { util } from '@/common/helpers/util';
import { useLoading } from '@/common/context/useLoading';
import { service } from '@/services/apis';
import IconPicker from './Icon';

interface IProps {
  refreshList: () => void;
}
function Panel(props: IProps, ref: A) {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<TaskPrioty.ITaskPriotyModel>();
  const [form] = Form.useForm();
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
      console.log(form.getFieldValue('iconUrl'));
      const checkValid = await form.validateFields();
      if (checkValid) {
        showLoading();
        if (isEdit) {
          await service.taskPriotyService.update({
            ...editData,
            ...form.getFieldsValue(),
            iconUrl:
              typeof form.getFieldValue('iconUrl') === 'string'
                ? form.getFieldValue('iconUrl').toString()
                : util.rgbToHex(form.getFieldValue('iconUrl').metaColor)
          });
          notification.open({
            message: t('Common_UpdateSuccess'),
            type: 'success'
          });
        } else {
          await service.taskPriotyService.create({
            ...form.getFieldsValue(),
            iconUrl:
              typeof form.getFieldValue('iconUrl') === 'string'
                ? form.getFieldValue('iconUrl').toString()
                : util.rgbToHex(form.getFieldValue('iconUrl').metaColor)
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
    pname: [{ required: true, message: t('Common_Require_Field') }],
    iconUrl: [{ required: true, message: t('Common_Require_Field') }]
  };

  return (
    <>
      <Drawer
        title={isEdit ? t('Configuration_Priority_Edit') : t('Configuration_Priority_Create')}
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
          <Form.Item name="pname" label={t('Common_Name')} rules={formRule.pname}>
            <Input maxLength={250} showCount />
          </Form.Item>
          <Form.Item name="iconUrl" label={t('Common_Icon')} rules={formRule.iconUrl}>
            <IconPicker />
          </Form.Item>
          <Form.Item name="colorIcon" label={t('Common_Color_Icon')}>
            <ColorPicker />
          </Form.Item>
          <Form.Item name="description" label={t('Common_Description')}>
            <Input.TextArea maxLength={1000} showCount rows={5} />
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
