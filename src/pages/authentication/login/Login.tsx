import { Button, Checkbox, Form, Input, Row } from 'antd';
import styles from './Login.module.scss';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLoginManager } from '../../../common/helpers/login-manager';
import { useEffect, useState } from 'react';
import { cookie } from '../../../common/helpers/cookie/cookie';
import { Rule } from 'antd/es/form';
import LazyLoading from '@/components/lazy-loading/LazyLoading';
import { useLoading } from '@/common/context/useLoading';

function Login() {
  const { t } = useTranslation();
  const { loginIn } = useLoginManager();
  const [form] = Form.useForm();
  const [customAlert, setCustomAlert] = useState<A>();
  const { getLoginUser } = useLoginManager();
  const { isLoading, showLoading, closeLoading } = useLoading();

  useEffect(() => {
    const saveUser = cookie.getCookie('userSave');
    form.setFieldsValue(JSON.parse(saveUser as string));
    getLoginUser() && (location.href = '/');
  }, []);

  const onFinish = async (values: A) => {
    try {
      showLoading();
      const result = await loginIn(values);
      console.log(result);
      setCustomAlert(result);
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const formRule = {
    userEmail: [
      { required: true, message: t('Common_Login_UserRequire_Alert') },
      { type: 'email', message: t('Manage_Account_Invalid_Email_Format') }
    ] as Rule[],
    password: [{ required: true, message: t('Common_Login_PasswordRequire_Alert') }]
  };

  return (
    <div className={styles.login}>
      {isLoading && <LazyLoading />}
      <Form
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        className={styles.form}
        layout="vertical"
        form={form}
      >
        <div className={styles.loginIcon}>
          <UserOutlined />
          <label>{t('Common_Login')}</label>
        </div>
        <Form.Item label={t('Common_Email_Entry')} name="userEmail" rules={formRule.userEmail}>
          <Input
            size="large"
            prefix={<UserOutlined style={{ marginRight: 5 }} />}
            onChange={() => setCustomAlert(null)}
          />
        </Form.Item>
        <Form.Item label={t('password')} name="password" rules={formRule.password}>
          <Input.Password
            size="large"
            prefix={<LockOutlined style={{ marginRight: 5 }} />}
            onChange={() => setCustomAlert(null)}
          />
        </Form.Item>
        {customAlert && <span className="customAlert">{t('Common_Login_Failed')}</span>}

        <Row>
          <Form.Item name="remember" valuePropName="checked">
            <div className={styles.refo}>
              <Checkbox>{t('Common_Login_RememberMe')}</Checkbox>
              <Link to="/forgot">{t('Common_Login_ForgotPassword')} ?</Link>
            </div>
          </Form.Item>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {t('Common_Login')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
