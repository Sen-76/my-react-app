import { Checkbox, Col, Form, Input, Modal, notification } from 'antd';
import styles from './ChangePassword.module.scss';
import { useState, useEffect } from 'react';
import { useRule } from '@/common/rule/rule';
import { useTranslation } from 'react-i18next';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
import { useLoginManager } from '@/common/helpers/login-manager';

interface IProps {
  openModal: boolean;
  handleCancel: () => void;
}
function ChangePassword(props: IProps) {
  const [customAlert, setCustomAlert] = useState<A>();
  const [open, setOpen] = useState<boolean>(props.openModal);
  const [isValid, setIsValid] = useState<A>();
  const { showLoading, closeLoading } = useLoading();
  const { getLoginUser } = useLoginManager();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const validPassList = [
    {
      label: t('At_Least_8_Character'),
      value: 'eightCharacters'
    },
    {
      label: t('At_Least_1_Digit'),
      value: 'number'
    },
    {
      label: t('At_Least_1_Lowercase_Character'),
      value: 'lowerCase'
    },
    {
      label: t('At_Least_1_Uppercase_Character'),
      value: 'upperCase'
    }
  ];

  useEffect(() => {
    setOpen(props.openModal);
  }, [props.openModal]);

  const handleOk = async () => {
    try {
      showLoading();
      const validate = await form.validateFields();
      if (validate) {
        if (form.getFieldValue('newPass') !== form.getFieldValue('rePassword')) {
          setCustomAlert({ rePassword: 'Password_Are_Not_Match' });
          return;
        }
        const result = await service.accountService.changePassword({
          userId: getLoginUser().user.id,
          currentPassword: form.getFieldValue('oldPass'),
          newPassword: form.getFieldValue('newPass'),
          confirmPassword: form.getFieldValue('rePassword')
        });
        if (result.statusCode === 400) {
          setCustomAlert({ ...customAlert, oldPassword: result.message });
        } else {
          notification.open({
            message: t('Common_ChangePassSuccess'),
            type: 'success'
          });
          setOpen(false);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setIsValid([
      /[A-Z]/.test(newPassword) && 'upperCase',
      /[a-z]/.test(newPassword) && 'lowerCase',
      newPassword.length >= 8 && 'eightCharacters',
      /\d/.test(newPassword) && 'number'
    ]);
  };

  const validatePasword = (rule: A, value: string) => {
    if (!/[A-Z]/.test(value)) {
      return Promise.reject(t('At_Least_1_Uppercase_Character'));
    }
    if (!/[a-z]/.test(value)) {
      return Promise.reject(t('At_Least_1_Lowercase_Character'));
    }
    if (!/\d/.test(value)) {
      return Promise.reject(t('At_Least_1_Digit'));
    }
    if (value.length < 8) {
      return Promise.reject(t('At_Least_8_Character'));
    }
    return Promise.resolve();
  };

  const formRule = {
    oldPassword: [useRule().createRequiredRule(true, false)],
    newPassword: [{ validator: validatePasword }, useRule().createRequiredRule(true, false)],
    rePassword: [useRule().createRequiredRule(true, false)]
  };

  return (
    <>
      <Modal
        title={t('Change_Password')}
        open={open}
        onOk={handleOk}
        onCancel={props.handleCancel}
        width={'50%'}
        okText={t('Common_Confirm')}
        cancelText={t('Common_Cancel')}
      >
        <div className={styles.changePassword}>
          <Col span={24}>
            <Form layout="vertical" form={form} onFinish={handleOk}>
              <Form.Item
                label={t('Old_Password')}
                name="oldPass"
                rules={formRule.oldPassword}
                className={customAlert?.oldPassword && 'customFieldAlert'}
              >
                <Input.Password onChange={() => setCustomAlert({ ...customAlert, oldPassword: '' })} />
              </Form.Item>
              {customAlert?.oldPassword && (
                <div className="customAlert">{customAlert?.oldPassword ?? t('Common_Login_PasswordRequire_Alert')}</div>
              )}
              <Form.Item label={t('New_Password')} name="newPass" rules={formRule.newPassword}>
                <Input.Password onChange={handlePasswordChange} />
              </Form.Item>
              <Form.Item
                label={t('Confirm_Password')}
                name="rePassword"
                rules={formRule.rePassword}
                className={customAlert?.rePassword && 'customFieldAlert'}
              >
                <Input.Password onChange={() => setCustomAlert({ ...customAlert, rePassword: '' })} />
              </Form.Item>
              {customAlert?.rePassword && <div className="customAlert">{t('Password_Are_Not_Match')}</div>}
            </Form>
            <Checkbox.Group
              disabled
              options={validPassList}
              value={isValid}
              style={{ display: 'flex', flexDirection: 'column', gap: 20, color: '#222222 !important' }}
            />
          </Col>
        </div>
      </Modal>
    </>
  );
}

export default ChangePassword;
