import { Button, DatePicker, Form, Input, Row, Select, notification } from 'antd';
import styles from '../Profile.module.scss';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import EditAvatar from './EditAvatar';
import { useTranslation } from 'react-i18next';
import { useLoading } from '@/common/context/useLoading';
import { service } from '@/services/apis';
import { GenderOptions } from '../Profile.model';

interface IProps {
  userLoged: A;
  cancelEdit: () => void;
  refreshData: () => void;
}
function EditInformation(props: IProps) {
  const { userLoged, cancelEdit } = props;
  const { showLoading } = useLoading();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  

  useEffect(() => {
    userLoged.dob = dayjs(userLoged.dob);
    form.setFieldsValue(userLoged);
  }, []);

  const onFinish = async (val: A) => {
    try {
      showLoading();
      await service.accountService.updateProfile({
        ...val,
        userId: userLoged.id,
        dob: dayjs(val.dob).format('YYYY-MM-DD')
      });
      notification.open({
        message: t('Common_UpdateSuccess'),
        type: 'success'
      });
      refreshList();
    } catch (e: A) {
      console.log(e);
    }
  };

  const refreshList = () => {
    const timeout = setTimeout(() => {
      props.refreshData();
      props.cancelEdit();
      clearTimeout(timeout);
    }, 2000);
  };

  const formRule = {
    fullName: [{ required: true, message: t('Common_Require_Field') }],
    dob: [{ required: true, message: t('Common_Require_Field') }]
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current > dayjs().endOf('day');
  };

  return (
    <div className={styles.editInformation}>
      <Row className={styles.header}>
        <span>{t('information')}</span>
      </Row>
      <div className={styles.body}>
        <div style={{ marginBottom: 10 }}>
          <EditAvatar
            imageLink={userLoged.photoUrl}
            name={userLoged.fullName}
            id={userLoged.id}
            refreshList={refreshList}
          />
        </div>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label={t('fullName')} name="fullName" rules={formRule.fullName}>
            <Input maxLength={250} showCount />
          </Form.Item>
          <Form.Item label={t('date of birth')} name="dob" rules={formRule.dob}>
            <DatePicker format={'DD MMM YYYY'} disabledDate={disabledDate} />
          </Form.Item>
          <Form.Item label={t('gender')} name="gender">
            <Select options={GenderOptions} placeholder="Select a gender" />
          </Form.Item>
          <div className="actionBtnBottom">
            <Button onClick={cancelEdit}>{t('Common_Cancel')}</Button>
            <Button type="primary" htmlType="submit">
              {t('Common_Save')}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default EditInformation;
