import { Button, Form, Input, Row } from 'antd';
import styles from './Forgot.module.scss';
import { useTranslation } from 'react-i18next';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
import LazyLoading from '@/components/lazy-loading/LazyLoading';

function Forgot() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { isLoading, showLoading, closeLoading } = useLoading();

  const onFinish = async (values: A) => {
    try {
      showLoading();
      await service.authsService.forgot(values);
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const formRule = {
    userEmail: [{ required: true, message: t('Common_Require_Field') }]
  };

  return (
    <div className={styles.login}>
      {isLoading && <LazyLoading />}
      <Form onFinish={onFinish} autoComplete="off" className={styles.form} layout="vertical" form={form}>
        <div className={styles.loginIcon}>
          <UserOutlined />
          <label>{t('Common_Login_ForgotPassword')}</label>
        </div>

        <div>Please enter yout username or account below</div>
        <div style={{ marginBottom: 20 }}>We will sent you a email to help you reset the password</div>

        <Form.Item label={t('email')} name="userEmail" rules={formRule.userEmail}>
          <Input size="large" prefix={<MailOutlined style={{ marginRight: 5 }} />} />
        </Form.Item>

        <Form.Item>
          <Row>
            <Link to="/login">{t('Common_BackToLogin')} ?</Link>
          </Row>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t('Common_Submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Forgot;
