import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { SettingOutlined } from '@ant-design/icons';
import { Button, Form, InputNumber, notification } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './StarConfiguration.module.scss';
import { useLoading } from '@/common/context/useLoading';
import { service } from '@/services/apis';

function StarConfiguration() {
  const { t } = useTranslation();
  const { setBreadcrumb } = useBreadcrumb();
  const { showLoading, closeLoading } = useLoading();
  const [form] = Form.useForm();

  useEffect(() => {
    setBreadcrumb([
      { icon: <SettingOutlined />, text: `${t('configuration')}` },
      { text: `${t('Configuration_File')}` }
    ]);
  }, [t]);

  useEffect(() => {
    getStar();
  }, []);

  const getStar = async () => {
    try {
      showLoading();
      const result = await service.globalSettingsService.getByType(3);
      form.setFieldsValue(result.detail);
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const setStar = async () => {
    try {
      showLoading();
      const result = await service.globalSettingsService.updateStar(form.getFieldsValue());
      result.statusCode === 200 &&
        notification.open({
          message: t('Common_UpdateSuccess'),
          type: 'success'
        });
      form.setFieldsValue(result);
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  return (
    <div className={styles.starConfig}>
      <Form layout="vertical" className={styles.form} form={form}>
        <Form.Item>{t('Configuration_Star_Description')}</Form.Item>
        <Form.Item
          label={t('Configuration_Star_TotalStar')}
          name="numberOfStars"
          rules={[{ required: true, message: t('Common_Require_Field') }]}
          style={{ width: '50%', minWidth: 300 }}
        >
          <InputNumber min={1} max={100000000000}></InputNumber>
        </Form.Item>
      </Form>
      <div className="actionBtnBottom">
        <Button type="primary" htmlType="submit" onClick={setStar}>
          {t('Common_Confirm')}
        </Button>
      </div>
    </div>
  );
}

export default StarConfiguration;
