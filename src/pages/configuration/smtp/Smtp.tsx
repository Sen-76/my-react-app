import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { BookOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import styles from './Smtp.module.scss';
import { Button, Form, Input } from 'antd';
import { useLoading } from '@/common/context/useLoading';

function Projects() {
  const { setBreadcrumb } = useBreadcrumb();
  const { showLoading, closeLoading } = useLoading();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    setBreadcrumb([{ icon: <BookOutlined />, text: t('configuration') }, { text: `Smtp ${t('configuration')}` }]);
  }, [t]);

  useEffect(() => {
    getSmtp();
  }, []);

  const getSmtp = async () => {
    try {
      showLoading();
      // const result = await service.globalSettingsService.getByType(3);
      const result = {};
      form.setFieldsValue(result);
      closeLoading();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className={styles.smtpConfig}>
        <Form layout="vertical" className={styles.form} form={form}>
          <Form.Item>{t('Configuration_SMTP_Description')}</Form.Item>
          <Form.Item
            label={t('Configuration_SMTP_OngoingEmail')}
            name="ongoingEmail"
            rules={[{ required: true, message: t('Common_Require_Field') }]}
            style={{ width: '50%', minWidth: 300 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Port"
            name="port"
            rules={[{ required: true, message: t('Common_Require_Field') }]}
            style={{ width: '50%', minWidth: 300 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('Configuration_SMTP_Sender')}
            name="sender"
            rules={[{ required: true, message: t('Common_Require_Field') }]}
            style={{ width: '50%', minWidth: 300 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('Configuration_SMTP_Password')}
            name="password"
            rules={[{ required: true, message: t('Common_Require_Field') }]}
            style={{ width: '50%', minWidth: 300 }}
          >
            <Input />
          </Form.Item>
        </Form>
        <div className="actionBtnBottom">
          <Button type="primary" htmlType="submit" onClick={getSmtp}>
            {t('Common_Confirm')}
          </Button>
        </div>
      </div>
    </>
  );
}

export default Projects;
