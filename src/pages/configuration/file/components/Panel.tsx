import { CloseOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, Input, Select, notification } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../FileConfiguration.module.scss';
import { useTranslation } from 'react-i18next';
import { fileFolder, fileTypeOption } from '../File.Model';
import { useLoading } from '@/common/context/useLoading';
import { service } from '@/services/apis';

interface IProps {
  all: A;
  refreshList: () => void;
}
function Panel(props: IProps, ref: A) {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { showLoading, closeLoading } = useLoading();
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    openDrawer
  }));

  const openDrawer = (data?: A) => {
    setOpen(true);
    setIsEdit(false);
    if (data) {
      setIsEdit(true);
      form.setFieldsValue({ ...data, fileAccept: data.fileAccept.split(', ') });
    }
  };

  const closeDrawer = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = async (val: A) => {
    try {
      showLoading();
      await service.globalSettingsService.updateFileConfig({
        id: props.all.id,
        fileSting: [
          ...props.all.detail.filter((x: A) => x.title !== val.title),
          { ...val, fileAccept: form.getFieldValue('fileAccept').join(', ') }
        ]
      });
      props.refreshList();
      notification.open({
        message: t('Common_UpdateSuccess'),
        type: 'success'
      });
      closeDrawer();
      closeLoading();
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const fileSizeCustomRule = (rule: A, value: string) => {
    if (value && (!Number.isInteger(Number(value)) || 1 > Number(value) || value.includes('.'))) {
      return Promise.reject('Please enter only Positive Integers in this field.');
    }
    return Promise.resolve();
  };

  const formRule = {
    title: [{ required: true, message: t('Common_Require_Field') }],
    fileSize: [{ required: true, message: t('Common_Require_Field') }, { validator: fileSizeCustomRule }],
    fileAccept: [{ required: true, message: t('Common_Require_Field') }],
    numberOfFile: [{ required: true, message: t('Common_Require_Field') }]
  };

  return (
    <>
      <Drawer
        title={isEdit ? t('Configuration_File_Edit') : t('Configuration_File_Create')}
        placement="right"
        open={open}
        extra={<CloseOutlined onClick={closeDrawer} />}
        onClose={closeDrawer}
        maskClosable={false}
        closable={false}
        width={520}
        destroyOnClose={true}
      >
        <Form form={form} onFinish={onFinish} layout="vertical" className={styles.panelform}>
          <Form.Item name="title" label={t('Common_Title')} rules={formRule.title}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="fileSize" label={`${t('file size')} (MB)`} rules={formRule.fileSize}>
            <Input />
          </Form.Item>
          <Form.Item name="fileAccept" label={t('file accept')} rules={formRule.fileAccept}>
            <Select mode="multiple" options={fileTypeOption} />
          </Form.Item>
          <Form.Item name="fileType" label={t('file type')} rules={formRule.numberOfFile}>
            <Select options={fileFolder} />
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
