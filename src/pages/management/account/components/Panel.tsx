import { CloseOutlined } from '@ant-design/icons';
import { Button, DatePicker, Drawer, Form, Input, Select, Steps, notification } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../AccountManagement.module.scss';
import dayjs from 'dayjs';
import { GenderOptions, EGender } from '../AccountManagement.Model';
import { useTranslation } from 'react-i18next';
import { service } from '@/services/apis';
import { Rule } from 'antd/es/form';
import { useLoading } from '@/common/context/useLoading';
import { useRule } from '@/common/rule/rule';

interface IProps {
  refreshList: () => void;
}
function Panel(props: IProps, ref: A) {
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { showLoading, closeLoading } = useLoading();
  const [customAlert, setCustomAlert] = useState<A>();
  const [step, setStep] = useState<number>(0);
  const [editData, setEditData] = useState<A>();
  const [roleList, setRoleList] = useState<A>();
  const [departmentList, setDepartmentList] = useState<A>();
  const [teamList, setTeamList] = useState<A>([]);
  const { t } = useTranslation();
  const [generalForm] = Form.useForm();
  const [systemForm] = Form.useForm();

  useImperativeHandle(ref, () => ({
    openDrawer
  }));

  const openDrawer = async (data?: A) => {
    try {
      showLoading();
      generalForm.setFieldValue('gender', EGender.Male);
      setIsEdit(false);
      setOpen(true);
      await getRoleList();
      await getDepartmentList();
      if (data) {
        setIsEdit(true);
        await getUserInformation(data.id);
      }
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const getRoleList = async () => {
    try {
      const result = await service.rolesService.get({
        pageInfor: {
          pageSize: 100000,
          pageNumber: 1,
          totalItems: 0
        }
      });
      setRoleList(
        result.data.map((role: A) => ({
          label: role.title,
          value: role.id
        }))
      );
    } catch (e) {
      console.log(e);
    }
  };

  const getDepartmentList = async () => {
    try {
      const result = await service.departmentService.get({
        pageInfor: {
          pageSize: 100000,
          pageNumber: 1,
          totalItems: 0
        }
      });
      setDepartmentList([
        { label: t('Common_None'), value: null },
        ...result.data.map((department: A) => ({
          label: department.title,
          value: department.id
        }))
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  const getTeam = async (departmentId: string) => {
    try {
      showLoading();
      const result = await service.teamService.get({
        pageInfor: {
          pageSize: 100000,
          pageNumber: 1,
          totalItems: 0
        },
        filter: [{ key: 'DepartmentId', value: [departmentId] }]
      });
      setTeamList([
        { label: t('Common_None'), value: null },
        ...result.data.map((team: A) => ({
          label: team.title,
          value: team.id
        }))
      ]);
      closeLoading();
    } catch (e) {
      console.log(e);
    }
  };

  const closeDrawer = () => {
    setOpen(false);
    setStep(0);
    setEditData({});
    setCustomAlert({});
    generalForm.resetFields();
    systemForm.resetFields();
  };

  const getUserInformation = async (id: string) => {
    try {
      const result = await service.accountService.getDetal(id);
      getTeam(result.data.userDepartmentId);
      result.data.dob = dayjs(result.data.dob);
      setEditData(result.data);
      generalForm.setFieldsValue(result.data);
      systemForm.setFieldsValue(result.data);
    } catch (e: A) {
      console.log(e);
    }
  };

  const backStep = () => {
    setStep(step - 1);
  };

  const onConfirm = async () => {
    try {
      const generalCheck = await generalForm.validateFields();
      setEditData({ ...editData, ...generalForm.getFieldsValue() });
      generalCheck && setStep(1);
      const systemCheck = await systemForm.validateFields();
      if (step == 1 && generalCheck && systemCheck) {
        showLoading();
        if (isEdit) {
          await service.accountService.updateAccount({
            ...editData,
            ...systemForm.getFieldsValue(),
            userName: systemForm.getFieldValue('userName')?.trim() ?? '',
            fullName: generalForm.getFieldValue('fullName')?.trim() ?? '',
            jobTitle: systemForm.getFieldValue('jobTitle')?.trim() ?? '',
            dob: dayjs(generalForm.getFieldValue('dob')).format('YYYY-MM-DD'),
            userDepartment: systemForm.getFieldValue('userDepartmentId'),
            teamId: systemForm.getFieldValue('userTeamId'),
            userRole: systemForm.getFieldValue('userRoleId'),
            gender: generalForm.getFieldValue('gender') ?? 0
          });
          notification.open({
            message: t('Common_UpdateSuccess'),
            type: 'success'
          });
        } else {
          await service.accountService.addAccount({
            ...editData,
            ...systemForm.getFieldsValue(),
            userName: systemForm.getFieldValue('userName')?.trim() ?? '',
            fullName: generalForm.getFieldValue('fullName')?.trim() ?? '',
            jobTitle: systemForm.getFieldValue('jobTitle')?.trim() ?? '',
            dob: dayjs(generalForm.getFieldValue('dob')).format('YYYY-MM-DD'),
            userDepartment: systemForm.getFieldValue('userDepartmentId'),
            teamId: systemForm.getFieldValue('userTeamId'),
            userRole: systemForm.getFieldValue('userRoleId'),
            gender: generalForm.getFieldValue('gender') ?? 0
          });
          notification.open({
            message: t('Common_CreateSuccess'),
            type: 'success'
          });
        }
        closeDrawer();
        props.refreshList();
      }
    } catch (e: A) {
      if (e.response?.data.status === 422) {
        const errors: A = e.response.data.errors;
        setCustomAlert(errors);
        errors.userEmail && setStep(0);
        errors.userPhone && setStep(0);
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
    } catch {
      console.log('');
    }
  };

  const formRule = {
    fullName: [useRule().createRequiredRule(true, false)],
    userEmail: [
      { required: true, message: t('Common_Require_Field') },
      { type: 'email', message: t('Manage_Account_Invalid_Email_Format') }
    ] as Rule[],
    userPhone: [
      { required: true, message: t('Common_Require_Field') },
      {
        pattern: /^(\+?84|0)([35789]\d{8}|[1-9]\d{9})$/,
        message: t('Manage_Account_Invalid_Phone_Format')
      }
    ] as Rule[],
    dob: [{ required: true, message: t('Common_Require_Field') }],
    userName: [useRule().createRequiredRule(true, false)],
    password: [{ required: true, message: t('Common_Require_Field') }],
    userRole: [{ required: true, message: t('Common_Require_Field') }]
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current > dayjs().endOf('day');
  };

  return (
    <Drawer
      title={isEdit ? `${t('edit account')}` : `${t('add account')}`}
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
        items={[{ title: t('Manage_Account_GeneralInfo') }, { title: t('Manage_Account_SystemInfo') }]}
      />
      {step === 0 && (
        <>
          <Form form={generalForm} layout="vertical" className={styles.panelform}>
            <Form.Item name="fullName" label={t('name')} rules={formRule.fullName}>
              <Input maxLength={250} showCount />
            </Form.Item>
            <Form.Item
              name="userEmail"
              label={t('email')}
              rules={formRule.userEmail}
              className={customAlert?.userEmail && 'customFieldAlert'}
            >
              <Input maxLength={250} showCount onChange={() => setCustomAlert({ ...customAlert, userEmail: '' })} />
            </Form.Item>
            {customAlert?.userEmail && <div className="customAlert">{t('Manage_Account_Exist_Email')}</div>}
            <Form.Item
              name="userPhone"
              label={t('phone')}
              rules={formRule.userPhone}
              className={customAlert?.userPhone && 'customFieldAlert'}
            >
              <Input onChange={() => setCustomAlert({ ...customAlert, userPhone: '' })} />
            </Form.Item>
            {customAlert?.userPhone && <div className="customAlert">{t('Manage_Account_Exist_Phone')}</div>}
            <Form.Item name="dob" label={t('date of birth')} rules={formRule.dob}>
              <DatePicker format={'DD MMM YYYY'} disabledDate={disabledDate} />
            </Form.Item>
            <Form.Item name="gender" label={t('gender')}>
              <Select options={GenderOptions} />
            </Form.Item>
          </Form>
        </>
      )}
      {step === 1 && (
        <>
          <Form form={systemForm} layout="vertical" className={styles.panelform}>
            <Form.Item
              name="userName"
              label={t('username')}
              rules={formRule.userName}
              className={customAlert?.userName ? 'customFieldAlert' : ''}
            >
              <Input maxLength={250} showCount onChange={() => setCustomAlert({ ...customAlert, userName: '' })} />
            </Form.Item>
            {customAlert?.userName && <div className="customAlert">{t('Manage_Account_Exist_Username')}</div>}
            <Form.Item name="jobTitle" label={t('job')}>
              <Input maxLength={250} showCount />
            </Form.Item>
            <Form.Item name="userDepartmentId" label={t('department')}>
              <Select
                options={departmentList}
                onSelect={(val) => {
                  systemForm.setFieldValue('userTeam', '');
                  getTeam(val);
                }}
              />
            </Form.Item>
            <Form.Item name="userTeamId" label={t('team')}>
              <Select options={teamList} />
            </Form.Item>
            <Form.Item name="userRoleId" label={t('role')} rules={formRule.userRole}>
              <Select options={roleList} />
            </Form.Item>
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
  );
}

export default forwardRef(Panel);
