/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CloseOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Drawer, Empty, Form, Select, Spin, Table, Tooltip, notification } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import Paragraph from 'antd/es/typography/Paragraph';
import { useTranslation } from 'react-i18next';
import { util } from '@/common/helpers/util';
import { service } from '@/services/apis';
import { EState } from '@/pages/management/account/AccountManagement.Model';
import useDebounce from '@/common/helpers/useDebounce';
import { useLoading } from '@/common/context/useLoading';
import { useParams } from 'react-router';

interface IProps {
  refreshList: () => void;
}
function Panel(props: IProps, ref: A) {
  const [open, setOpen] = useState<boolean>(false);
  const [memberList, setMemberList] = useState<Department.IDepartmentModel[]>([]);
  const [selectLoading, setSelectLoading] = useState<boolean>();
  const [userList, setUserList] = useState<Account.IAccountModel[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>();
  const [searchUserValue, setSearchUserValue] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string[]>([]);
  const { showLoading, closeLoading } = useLoading();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dataIdDepartment = useParams();
  const userDebounced = useDebounce(searchUserValue, 300);

  useImperativeHandle(ref, () => ({
    openDrawer
  }));

  const openDrawer = () => {
    setOpen(true);
    getUserDetail(dataIdDepartment.id ?? '');
  };

  const getUserDetail = async (id: string) => {
    try {
      showLoading();
      const { data } = await service.departmentService.getDetail(id);
      setMemberList(data.users.filter((x: A) => x.id !== data.manager.id));
      setSelectedUser([...(data.users?.map((x: A) => x.id) ?? []), data.manager.id]);
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
    setOpen(false);
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
        return record.jobTitle;
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

  const onMemberRemove = (id: string) => {
    setSelectedUser(selectedUser.filter((x: A) => x !== id));
    setMemberList(memberList.filter((x: A) => x.id !== id));
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

  const assignCLick = async () => {
    try {
      showLoading();
      await service.departmentService.assignMember({ id: dataIdDepartment.id ?? '', members: selectedUser ?? [] });
      closeDrawer();
      props.refreshList();
      notification.open({
        message: t('Common_AssignSuccess'),
        type: 'success'
      });
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

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
    // filter: [{ key: 'Status', value: [EState.Activate] }, { key: 'ownerDepartmentId' }, { key: 'userDepartment' }]
  };

  const getUsers = async () => {
    try {
      const draftParam = { ...initDataGrid };
      draftParam.searchInfor!.searchValue = userDebounced ?? '';
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
      setSelectLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Drawer
        title={t('Department_Allocate_Member_Entry')}
        placement="right"
        open={open}
        extra={<CloseOutlined onClick={closeDrawer} />}
        onClose={closeDrawer}
        maskClosable={false}
        closable={false}
        width={520}
        destroyOnClose={true}
      >
        <Form form={form}>
          <Form.Item name="members">
            <Select
              style={{ width: '100%', marginBottom: 10 }}
              labelInValue
              size="large"
              onClick={() => {
                setSelectLoading(true);
                setUserList([]);
                getUsers();
              }}
              showSearch
              onSearch={(value) => {
                setSelectLoading(true);
                setUserList([]);
                setSearchUserValue(value);
              }}
              disabled={tableLoading}
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
              placeholder={t('Department_Assign_Member_Search_Placeholder')}
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
        </Form>
        <div className="actionBtnBottom">
          <Button onClick={closeDrawer}>{t('Common_Cancel')}</Button>
          <Button type="primary" onClick={assignCLick} loading={tableLoading}>
            {t('Common_Save')}
          </Button>
        </div>
      </Drawer>
    </>
  );
}

export default forwardRef(Panel);
