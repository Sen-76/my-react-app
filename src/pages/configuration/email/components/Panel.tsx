import { CloseOutlined } from '@ant-design/icons';
import { Button, Checkbox, Drawer, Form, Input, Select, Steps } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../EmailConfiguation.module.scss';
import { useTranslation } from 'react-i18next';
import { headerOptions } from '../Email.model';

interface IProps {
  refreshList: () => void;
}
function Panel(props: IProps, ref: A) {
  const [open, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<A>();
  const [gerenalForm] = Form.useForm();
  const [templateForm] = Form.useForm();
  const [step, setStep] = useState<number>(0);

  useImperativeHandle(ref, () => ({
    openDrawer
  }));

  const openDrawer = (data?: A) => {
    setOpen(true);
    setIsEdit(false);
    if (data) {
      setIsEdit(true);
      gerenalForm.setFieldsValue(data);
      templateForm.setFieldsValue(data);
    }
  };

  const closeDrawer = () => {
    setOpen(false);
    gerenalForm.resetFields();
    templateForm.resetFields();
  };

  const onConfirm = async (val: A) => {
    const generalCheck = await gerenalForm.validateFields();
    setEditData({ ...editData, ...gerenalForm.getFieldsValue() });
    generalCheck && setStep(1);
    const systemCheck = await templateForm.validateFields();
    if (step == 1 && generalCheck && systemCheck) {
      console.log(val);
    }
  };

  const onStepChange = async (value: number) => {
    try {
      const generalCheck = await gerenalForm.validateFields();
      generalCheck && setStep(value);
    } catch {
      console.log('');
    }
  };

  const formRule = {
    title: [{ required: true, message: t('Common_Require_Field') }],
    emailBody: [{ required: true, message: t('Common_Require_Field') }]
  };

  return (
    <>
      <Drawer
        title={isEdit ? t('Configuration_Email_Edit') : t('Configuration_Email_Create')}
        placement="right"
        open={open}
        extra={<CloseOutlined onClick={closeDrawer} />}
        onClose={closeDrawer}
        maskClosable={false}
        closable={false}
        width={720}
        destroyOnClose={true}
      >
        <Steps
          style={{ width: '70%', margin: 'auto', marginBottom: 20 }}
          onChange={onStepChange}
          current={step}
          items={[{ title: 'Email Info' }, { title: 'Template' }]}
        />
        {step === 0 && (
          <Form form={gerenalForm} layout="vertical" className={styles.panelform}>
            <Form.Item name="title" label={t('Common_Title')} rules={formRule.title}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label={t('Common_Description')}>
              <Input.TextArea />
            </Form.Item>
          </Form>
        )}
        {step === 1 && (
          <Form form={templateForm} layout="vertical" className={styles.panelform}>
            <Form.Item>
              <Checkbox style={{ fontWeight: '600' }}>Include Email Header</Checkbox>
            </Form.Item>
            <div style={{ marginLeft: 20 }}>
              <Form.Item>
                <Select options={headerOptions} />
              </Form.Item>
            </div>
            <Form.Item name="emailBody" label="Email Body" rules={formRule.emailBody}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item>
              <Checkbox style={{ fontWeight: '600' }}>Include Email Footer</Checkbox>
            </Form.Item>
            <div style={{ marginLeft: 20 }}>
              <Form.Item>
                <Select options={headerOptions} />
              </Form.Item>
            </div>
            <div className="actionBtnBottom">
              <Button onClick={closeDrawer}>{t('Common_Cancel')}</Button>
              <Button type="primary" htmlType="submit">
                {t('Common_Confirm')}
              </Button>
            </div>
          </Form>
        )}
        <div className="actionBtnBottom">
          <Button onClick={closeDrawer}>{t('Common_Cancel')}</Button>
          <Button type="primary" onClick={onConfirm}>
            {step === 1 ? t('Common_Confirm') : t('Common_Next')}
          </Button>
        </div>
      </Drawer>
    </>
  );
}

export default forwardRef(Panel);
