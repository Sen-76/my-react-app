/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CloseOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Drawer, Empty, Form, Input, Select, Spin, Steps, Table, Tooltip, notification } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import styles from '../Project.module.scss';
import { useTranslation } from 'react-i18next';
import { service } from '@/services/apis';
import useDebounce from '@/common/helpers/useDebounce';
import { EState } from '@/pages/management/account/AccountManagement.Model';
import Paragraph from 'antd/es/typography/Paragraph';
import { util } from '@/common/helpers/util';
import { ColumnsType } from 'antd/es/table';
import { useLoading } from '@/common/context/useLoading';

interface IProps {
  refreshList: () => void;
}
function Panel(props: IProps, ref: A) {
  const [open, setOpen] = useState<boolean>(false);
  const [isTeamVisible, setIsTeamVisible] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [customAlert, setCustomAlert] = useState<A>({});
  const [searchUserValue, setSearchUserValue] = useState<string>('');
  const [searchManageValue, setSearchManagerValue] = useState<string>('');
  const [selectLoading, setSelectLoading] = useState<boolean>();
  const [tableLoading, setTableLoading] = useState<boolean>();
  const userDebounced = useDebounce(searchUserValue, 300);
  const userDebouncedManager = useDebounce(searchManageValue, 300);
  const [editData, setEditData] = useState<Department.IDepartmentModel>();
  const [step, setStep] = useState<number>(0);
  const { showLoading, closeLoading } = useLoading();
  const [userList, setUserList] = useState<Account.IAccountModel[]>([]);
  const [userMemberList, setUserMemberList] = useState<Account.IAccountModel[]>([]);
  const [memberList, setMemberList] = useState<Department.IDepartmentModel[]>([]);
  const [selectedUser, setSelectedUser] = useState<string[]>([]);
  const [selectedManager, setSelectedManager] = useState<string>();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { TextArea } = Input;

  useImperativeHandle(ref, () => ({
    openDrawer
  }));

  const openDrawer = (data?: A) => {
    setOpen(true);
    setIsEdit(false);
    if (data) {
      getUserDetail(data.id);
      setIsEdit(true);
    }
  };

  const getUserDetail = async (id: string) => {
    try {
      showLoading();
      const { data } = await service.departmentService.getDetail(id);
      setEditData(data);
      data.owner = {
        value: data.manager.id,
        label: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              size={25}
              src={data.manager?.photoUrl}
              style={{ marginRight: 10, backgroundColor: util.randomColor() }}
            >
              {data.manager.fullName?.charAt(0)}
            </Avatar>
            <div>
              <Paragraph
                ellipsis={{ rows: 1, expandable: false }}
                style={{ maxWidth: 350, minWidth: 30, fontWeight: 600, fontSize: 16, lineHeight: '20px' }}
              >
                {data.manager.fullName}
              </Paragraph>
              <Paragraph
                ellipsis={{ rows: 1, expandable: false }}
                style={{ maxWidth: 350, minWidth: 30, lineHeight: '16px', fontSize: 12 }}
              >
                {data.manager.userEmail}
              </Paragraph>
            </div>
          </div>
        )
      };
      setSelectedUser([...(data.users?.map((x: A) => x.id) ?? []), data.manager.id]);
      setMemberList(data.users);
      data.members = data.users;
      form.setFieldsValue(data);
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const closeDrawer = () => {
    form.resetFields();
    setMemberList([]);
    setSelectedUser([]);
    setStep(0);
    setOpen(false);
  };

  const onConfirm = async () => {
    const generalCheck = await form.validateFields();
    setEditData({ ...editData, ...form.getFieldsValue() });
    generalCheck && setStep(1);
    if (step == 1 && generalCheck) {
      try {
        showLoading();
        if (isEdit) {
          await service.departmentService.update({
            ...editData,
            id: editData?.id ?? '',
            members: memberList.map((x) => x.id),
            owner:
              typeof form.getFieldValue('owner') === 'string'
                ? form.getFieldValue('owner')
                : form.getFieldValue('owner').value
          });
          closeLoading();
          closeDrawer();
          props.refreshList();
          notification.open({
            message: t('Common_UpdateSuccess'),
            type: 'success'
          });
        } else {
          await service.departmentService.create({
            ...editData,
            members: memberList.map((x) => x.id),
            owner:
              typeof form.getFieldValue('owner') === 'string'
                ? form.getFieldValue('owner')
                : form.getFieldValue('owner').value
          });
          closeLoading();
          closeDrawer();
          props.refreshList();
          notification.open({
            message: t('Common_CreateSuccess'),
            type: 'success'
          });
        }
      } catch (e: A) {
        if (e.response?.data.status === 422) {
          const errors: A = e.response.data.errors;
          setCustomAlert(errors);
          setStep(0);
        }
      } finally {
        closeLoading();
      }
    }
  };

  const formRule = {
    title: [{ required: true, message: t('Common_Require_Field') }]
  };

  useEffect(() => {
    getUsers(false);
  }, [userDebounced]);

  useEffect(() => {
    getUsers(true);
  }, [userDebouncedManager]);

  const initDataGrid: Common.IDataGrid = {
    pageInfor: {
      pageSize: 10,
      pageNumber: 1,
      totalItems: 0
    },
    searchInfor: {
      searchValue: '',
      searchColumn: ['FullName', 'UserEmail']
    },
    filter: [{ key: 'Status', value: [EState.Activate] }, { key: 'userDepartment' }]
  };

  const getUsers = async (isSearchManager?: boolean) => {
    try {
      const draftParam = { ...initDataGrid };
      draftParam.searchInfor!.searchValue = isSearchManager ? userDebouncedManager : userDebounced ?? '';
      selectedUser?.length > 0 && draftParam.filter!.push({ key: 'id', value: selectedUser, operators: 'not in' });
      const result = await service.accountService.getAccount(draftParam);
      const optionsValue = result.data?.map((x: A) => ({
        label: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size={25} src={x?.photoUrl} style={{ marginRight: 10, backgroundColor: util.randomColor() }}>
              {x.fullName?.charAt(0)}
            </Avatar>
            <div>
              <Paragraph
                ellipsis={{ rows: 1, expandable: false }}
                style={{ maxWidth: 350, minWidth: 30, fontWeight: 600, fontSize: 16, lineHeight: '20px' }}
              >
                {x.fullName}
              </Paragraph>
              <Paragraph
                ellipsis={{ rows: 1, expandable: false }}
                style={{ maxWidth: 350, minWidth: 30, lineHeight: '16px', fontSize: 12 }}
              >
                {x.userEmail}
              </Paragraph>
            </div>
          </div>
        ),
        value: x.id
      }));
      setUserList(optionsValue);
      isSearchManager && setUserMemberList(optionsValue);
    } catch (e) {
      console.log(e);
    } finally {
      setSelectLoading(false);
    }
  };

  const onMemberSelect = async (val: A) => {
    try {
      setTableLoading(true);
      setSearchUserValue('');
      form.setFieldValue('members', '');
      const result = await service.accountService.getDetal(val.key);
      setMemberList([...memberList, result.data]);
      setSelectedUser([...selectedUser, result.data.id]);
    } catch (e) {
      console.log(e);
    } finally {
      setTableLoading(false);
    }
  };

  const onManagerSelect = async (val: A) => {
    setSelectedUser([...selectedUser.filter((x) => x !== selectedManager), val.key]);
    setSelectedManager(val.key);
    setSearchManagerValue('');
    setIsTeamVisible(true);
  };

  const onMemberRemove = (id: string) => {
    setSelectedUser(selectedUser.filter((x: A) => x !== id));
    setMemberList(memberList.filter((x: A) => x.id !== id));
  };

  const onStepChange = async (value: number) => {
    try {
      const generalCheck = await form.validateFields();
      setEditData({ ...editData, ...form.getFieldsValue() });
      generalCheck && setStep(value);
    } catch (e) {
      console.log(e);
    }
  };

  const backStep = () => {
    setStep(step - 1);
  };

  const columns: ColumnsType<A> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        return (
          <Tooltip placement="bottom" title={record.name} color="#ffffff" arrow={true}>
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 150 }}>
              <Avatar size={40} src={record?.photoUrl} style={{ marginRight: 10, backgroundColor: util.randomColor() }}>
                {record.fullName?.charAt(0)}
              </Avatar>
              <div>
                <Paragraph
                  ellipsis={{ rows: 1, expandable: false }}
                  style={{ maxWidth: 150, minWidth: 30, fontWeight: 600, fontSize: 16, lineHeight: '16px' }}
                >
                  {record.fullName}
                </Paragraph>
                <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ maxWidth: 150, minWidth: 30 }}>
                  {record.userEmail}
                </Paragraph>
              </div>
            </div>
          </Tooltip>
        );
      }
    },
    {
      title: t('job'),
      dataIndex: 'job',
      key: 'job',
      render: (_, record) => {
        return record.job;
      }
    },
    {
      title: t('Common_Action'),
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      className: 'actionCollumn',
      render: (_, record) => {
        return (
          <Tooltip placement="bottom" title={t('Common_Delete')} color="#ffffff" arrow={true}>
            <Button type="text" onClick={() => onMemberRemove(record.id)} icon={<DeleteOutlined />} />
          </Tooltip>
        );
      }
    }
  ];

  return (
    <>
      <Drawer
        title={isEdit ? t('Project_Edit_Project') : t('Project_Add_Project')}
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
          items={[{ title: t('Manage_Project_Info') }, { title: t('Common_Addvantd') }]}
        />
        <Form form={form} layout="vertical" className={styles.panelform}>
          {step === 0 && (
            <>
              <Form.Item
                name="title"
                label="Title"
                rules={formRule.title}
                className={customAlert?.title && 'customFieldAlert'}
              >
                <Input maxLength={250} showCount onChange={() => setCustomAlert({ ...customAlert, title: '' })} />
              </Form.Item>
              {customAlert?.title && <div className="customAlert">{t('Manage_Account_Exist_Email')}</div>}
              <Form.Item
                name="department"
                label="Department"
                rules={formRule.title}
                className={customAlert?.title && 'customFieldAlert'}
              >
                <Select
                  labelInValue
                  showSearch
                  placeholder={t('Common_SearchNameAndEmail')}
                  onSelect={onManagerSelect}
                  disabled={tableLoading}
                  onClick={() => {
                    setUserMemberList([]);
                    setSelectLoading(true);
                    getUsers(true);
                  }}
                  onSearch={(value) => {
                    setSelectLoading(true);
                    setUserMemberList([]);
                    setSearchManagerValue(value);
                  }}
                  notFoundContent={
                    selectLoading ? (
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: 100
                        }}
                      >
                        <Spin />
                      </div>
                    ) : (
                      <Empty />
                    )
                  }
                  dropdownRender={(menu) => <>{menu}</>}
                  filterOption={() => true}
                  options={userMemberList}
                  suffixIcon={<SearchOutlined />}
                />
              </Form.Item>
              {isTeamVisible && (
                <Form.Item
                  name="team"
                  label="Team"
                  rules={formRule.title}
                  className={customAlert?.title && 'customFieldAlert'}
                >
                  <Select labelInValue showSearch placeholder={t('Common_SearchNameAndEmail')} />
                </Form.Item>
              )}
              <Form.Item name="description" label={t('Common_Description')}>
                <TextArea maxLength={1000} showCount rows={5} />
              </Form.Item>
            </>
          )}
          {step === 1 && (
            <>
              <Form.Item name="members" label={t('members')}>
                <Select
                  labelInValue
                  style={{ width: '100%', marginBottom: 10 }}
                  size="large"
                  showSearch
                  disabled={tableLoading}
                  onClick={() => {
                    setUserList([]);
                    setSelectLoading(true);
                    getUsers(false);
                  }}
                  onSearch={(value) => {
                    setSelectLoading(true);
                    setUserList([]);
                    setSearchUserValue(value);
                  }}
                  notFoundContent={
                    selectLoading ? (
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: 100
                        }}
                      >
                        <Spin />
                      </div>
                    ) : (
                      <Empty />
                    )
                  }
                  dropdownRender={(menu) => <>{menu}</>}
                  filterOption={() => true}
                  options={userList}
                  suffixIcon={<SearchOutlined />}
                  onSelect={onMemberSelect}
                  placeholder="Assign members to department"
                />
              </Form.Item>
              <div>
                <Table
                  columns={columns}
                  dataSource={memberList}
                  loading={tableLoading}
                  rowKey={(record) => record.id}
                  style={{ marginTop: '-30px' }}
                  pagination={{
                    pageSize: 5,
                    total: memberList?.length
                  }}
                />
              </div>
            </>
          )}
        </Form>
        <div className="actionBtnBottom">
          <Button onClick={closeDrawer}>{t('Common_Cancel')}</Button>
          {step !== 0 && <Button onClick={backStep}>{t('Common_Back')}</Button>}
          <Button type="primary" onClick={onConfirm} loading={tableLoading}>
            {step === 1 ? t('Common_Confirm') : t('Common_Next')}
          </Button>
        </div>
      </Drawer>
    </>
  );
}

export default forwardRef(Panel);
