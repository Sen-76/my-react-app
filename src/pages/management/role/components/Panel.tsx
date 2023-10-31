import { CloseOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  CollapseProps,
  Drawer,
  Form,
  Input,
  Row,
  Steps,
  message,
  notification
} from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../Role.module.scss';
import TextArea from 'antd/es/input/TextArea';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
import Paragraph from 'antd/es/typography/Paragraph';

interface IProps {
  refreshList: () => void;
}
function Panel(props: IProps, ref: A) {
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const { t } = useTranslation();
  const [generalForm] = Form.useForm();
  const [permissionForm] = Form.useForm();
  const [editData, setEditData] = useState<Role.IRoleCreateModel>();
  const { showLoading, closeLoading } = useLoading();
  const [customAlert, setCustomAlert] = useState<A>();
  const [openDefault, setOpenDefault] = useState<A[]>([]);
  const [roleItems, setRolesItem] = useState<CollapseProps['items']>([]);
  const [messageApi, contextHolder] = message.useMessage();

  useImperativeHandle(ref, () => ({
    openDrawer
  }));

  const openDrawer = async (data?: Role.IRoleModel) => {
    try {
      showLoading();
      setOpen(true);
      setIsEdit(false);
      await getPermissionList();
      if (data) {
        setIsEdit(true);
        await getRoleDetail(data?.id ?? '');
      }
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const getRoleDetail = async (id: string) => {
    try {
      const result = await service.rolesService.detail(id);
      generalForm.setFieldsValue(result.data);
      Object.entries(result.data.permission).map(([label, value]) => {
        permissionForm.setFieldValue(label, value);
        openDefault.push(label);
        setOpenDefault([...openDefault]);
      });
      setEditData(result.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getPermissionList = async () => {
    try {
      const result = await service.permissionService.get();
      genPermissionElements(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const genPermissionElements = (rolesList: A[]) => {
    const item = rolesList.map((x) => ({
      key: x.title,
      label: x.title,
      children: (
        <>
          <Form.Item name={x.title}>
            <Checkbox.Group>
              <Row>
                {x.permissions.map((x: A) => (
                  <Col span={24} key={x.id}>
                    <Checkbox value={x.id}>
                      <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ minWidth: '100%' }}>
                        {t(x.keyI18n)}
                      </Paragraph>
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </>
      )
    }));
    setRolesItem(item);
  };

  const closeDrawer = () => {
    generalForm.resetFields();
    permissionForm.resetFields();
    setCustomAlert([]);
    setOpenDefault([]);
    setStep(0);
    setOpen(false);
  };

  const onConfirm = async () => {
    try {
      const generalCheck = await generalForm.validateFields();
      setEditData({ ...editData, ...generalForm.getFieldsValue() });
      generalCheck && setStep(1);
      const permissionCheck = await permissionForm.validateFields();
      if (step == 1 && generalCheck && permissionCheck) {
        showLoading();
        const per = permissionForm.getFieldsValue();
        if (Object.keys(per).length === 0) {
          messageApi.error(t('Please_Select_At_Least_1_Role'));
          return;
        }
        const permissionValues = [];
        for (const key in per) {
          if (Array.isArray(per[key])) {
            permissionValues.push(...per[key]);
          }
        }
        if (isEdit) {
          await service.rolesService.update({ ...editData, permissionIds: permissionValues });
          closeLoading();
          closeDrawer();
          props.refreshList();
          notification.open({
            message: t('Common_UpdateSuccess'),
            type: 'success'
          });
        } else {
          await service.rolesService.create({ ...editData, permissionIds: permissionValues });
          closeLoading();
          closeDrawer();
          props.refreshList();
          notification.open({
            message: t('Common_CreateSuccess'),
            type: 'success'
          });
        }
      }
    } catch (e: A) {
      if (e.response?.data.status === 422) {
        const errors: A = e.response.data.errors;
        setCustomAlert(errors);
        errors.title && setStep(0);
      }
    } finally {
      closeLoading();
    }
  };

  const onStepChange = async (value: number) => {
    try {
      const generalCheck = await generalForm.validateFields();
      setEditData({ ...editData, ...generalForm.getFieldsValue() });
      generalCheck && setStep(value);
    } catch (e) {
      console.log(e);
    }
  };

  const backStep = () => {
    setStep(step - 1);
  };

  const formRule = {
    title: [{ required: true, message: t('Common_Require_Field') }]
  };

  return (
    <>
      <Drawer
        title={isEdit ? `${t('Manage_Role_Edit')}` : `${t('Manage_Role_Add')}`}
        placement="right"
        open={open}
        extra={<CloseOutlined onClick={closeDrawer} />}
        onClose={closeDrawer}
        maskClosable={false}
        closable={false}
        width={720}
        destroyOnClose={true}
      >
        {contextHolder}
        <Steps
          style={{ width: '70%', margin: 'auto', marginBottom: 20 }}
          onChange={onStepChange}
          current={step}
          items={[{ title: t('Manage_Role_Info') }, { title: t('Manage_Role_Permission') }]}
        />
        {step === 0 && (
          <>
            <Form form={generalForm} layout="vertical" className={styles.panelform}>
              <Form.Item
                name="title"
                label={t('Common_Title')}
                rules={formRule.title}
                className={customAlert?.userEmail && 'customFieldAlert'}
              >
                <Input maxLength={250} showCount onChange={() => setCustomAlert({ ...customAlert, title: '' })} />
              </Form.Item>
              {customAlert?.title && <div className="customAlert">{t('Common_TitleExist')}</div>}
              <Form.Item name="description" label={t('Common_Description')}>
                <TextArea maxLength={1000} rows={5} showCount />
              </Form.Item>
            </Form>
          </>
        )}
        {step === 1 && (
          <>
            <Form form={permissionForm} layout="vertical" className={styles.panelform}>
              <Collapse
                items={roleItems}
                bordered={false}
                ghost
                size="large"
                expandIconPosition="end"
                collapsible="icon"
                defaultActiveKey={openDefault}
              />
            </Form>
          </>
        )}
        <div className="actionBtnBottom">
          <Button onClick={closeDrawer}>{t('Common_Cancel')}</Button>
          {step !== 0 && <Button onClick={backStep}>{t('Common_Back')}</Button>}
          <Button type="primary" onClick={onConfirm}>
            {step === 1 ? t('Common_Confirm') : t('Common_Next')}
          </Button>
        </div>
      </Drawer>
    </>
  );
}

export default forwardRef(Panel);
