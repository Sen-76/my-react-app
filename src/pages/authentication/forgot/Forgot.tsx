import { Button, Form, Input, Row } from 'antd';
import styles from './Forgot.module.scss';
import { useTranslation } from 'react-i18next';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

function Forgot() {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = (values: A) => {
    console.log('Success:', values);
  };

  const formRule = {
    username: [{ required: true, message: t('Common_Require_Field') }]
  };

  return (
    <div className={styles.login}>
      <Form onFinish={onFinish} autoComplete="off" className={styles.form} layout="vertical" form={form}>
        <div className={styles.loginIcon}>
          <UserOutlined />
          <label>{t('Common_Login_ForgotPassword')}</label>
        </div>

        <div>Please enter yout username or account below</div>
        <div style={{ marginBottom: 20 }}>We will sent you a email to help you reset the password</div>

        <Form.Item label={`${t('username')} / ${t('email')}`} name="username" rules={formRule.username}>
          <Input
            size="large"
            prefix={
              <>
                <UserOutlined style={{ marginRight: 5 }} />
                <span>/</span>
                <MailOutlined />
              </>
            }
          />
        </Form.Item>

        <Row>
          <Link to="/login">{t('Common_BackToLogin')} ?</Link>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t('Common_Confirm')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Forgot;
