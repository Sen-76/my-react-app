/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  LogoutOutlined,
  ManOutlined,
  PlusOutlined,
  SmileOutlined,
  SolutionOutlined,
  WomanOutlined
} from '@ant-design/icons';
import { Avatar, Button, Modal, Table, TablePaginationConfig, Tag, Tooltip, notification } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import styles from '../Member.module.scss';
import { useTranslation } from 'react-i18next';
import Paragraph from 'antd/es/typography/Paragraph';
import Search from 'antd/es/input/Search';
import { util } from '@/common/helpers/util';
import { useLoading } from '@/common/context/useLoading';
import { service } from '@/services/apis';
import { useParams } from 'react-router';
import PermissionBlock from '@/common/helpers/permission/PermissionBlock';

interface IProps {
  data: A[];
  openPanel: (data?: A) => void;
  openDetailPanel: (data?: A) => void;
  setPage: (paging: number) => void;
  onSearch: (value: string) => void;
  refreshList: () => void;
  loading: boolean;
  param: Common.IDataGrid;
}
function DataTable(props: IProps) {
  const { loading, param } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { showLoading, closeLoading } = useLoading();
  const data = useParams();
  const { confirm } = Modal;
  const { t } = useTranslation();
  const allPermission = JSON.parse(sessionStorage.getItem('allPermissions') ?? '');

  const columns: ColumnsType<A> = [
    {
      title: t('name'),
      dataIndex: 'fullName',
      key: 'fullName',
      render: (_, record) => {
        return (
          <Tooltip placement="bottom" title={record.fullName} color="#ffffff" arrow={true}>
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 250 }}>
              <Avatar size={40} src={record.photoUrl} style={{ marginRight: 10, backgroundColor: util.randomColor() }}>
                {record.fullName?.charAt(0)}
              </Avatar>
              <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ display: 'flex', flexDirection: 'column' }}>
                {record.fullName}
                {record.isManager && (
                  <Tag style={{ width: '64px' }} color="red">
                    {t('Department_Manger')}
                  </Tag>
                )}
              </Paragraph>
            </div>
          </Tooltip>
        );
      }
    },
    {
      title: t('gender'),
      dataIndex: 'gender',
      key: 'gender',
      render: (_, record) => {
        return record.gender === 'Male' ? (
          <Tooltip placement="bottom" title={t('man')} color="#ffffff" arrow={true}>
            <ManOutlined />
          </Tooltip>
        ) : (
          <Tooltip placement="bottom" title={t('woman')} color="#ffffff" arrow={true}>
            <WomanOutlined />
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
      className: 'actionCollumn',
      fixed: 'right',
      width: 130,
      render: (_, record) => {
        const viewDetailCLick = () => {
          props.openDetailPanel(record);
        };

        return (
          <div>
            <Tooltip placement="bottom" title={t('Common_ViewDetail')} color="#ffffff" arrow={true}>
              <Button type="text" onClick={viewDetailCLick} icon={<SolutionOutlined />} />
            </Tooltip>
            <PermissionBlock module={allPermission?.Department?.Permission_Kick_Member_Department}>
              <Tooltip placement="bottom" title={t('Common_Kick')} color="#ffffff" arrow={true}>
                <Button
                  disabled={record.isManager}
                  type="text"
                  onClick={() => kickoutMembers(record)}
                  icon={<LogoutOutlined />}
                />
              </Tooltip>
            </PermissionBlock>
          </div>
        );
      }
    }
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    props.setPage(pagination.current ?? 1);
  };

  const onSearch = (val: A) => {
    props.onSearch(val);
  };

  const confirmDelete = async (id?: string) => {
    try {
      showLoading();
      await service.departmentService.kickMember({
        id: data.id ?? '',
        members: id ? [id] : (selectedRowKeys as string[])
      });
      props.refreshList();
      setSelectedRowKeys([]);
      notification.open({
        message: t('Common_DeleteSuccess'),
        type: 'success'
      });
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const kickoutMembers = (user?: A) => {
    confirm({
      content: user.id
        ? t('Department_Member_KickDepartmentSingle_Remind_Text').replace('{0}', user.fullName)
        : t('Department_Member_KickDepartmentMultiple_Remind_Text'),
      title: t('Common_Kick'),
      okText: t('Common_Kick'),
      cancelText: t('Common_Cancel'),
      onOk() {
        confirmDelete(user && user.id);
      }
    });
  };

  const TableHeader = () => {
    return (
      <>
        <div className={styles.tableHeaderLeft}>
          <PermissionBlock module={allPermission?.Department?.Permission_Assign_And_Kick_Member_Department}>
            <Button type="text" onClick={() => props.openPanel()} icon={<PlusOutlined />}>
              {t('Department_Allocate_Member_Entry')}
            </Button>
          </PermissionBlock>
          <PermissionBlock module={allPermission?.Department?.Permission_Kick_Member_Department}>
            <Button
              onClick={kickoutMembers}
              loading={loading}
              type="text"
              icon={<LogoutOutlined />}
              disabled={selectedRowKeys.length === 0}
            >
              {t('Common_Kick')}
            </Button>
          </PermissionBlock>
        </div>
        <div className={styles.tableHeaderRight}>
          <Search placeholder={t('Common_SearchByName')} allowClear onSearch={onSearch} style={{ width: 250 }} />
        </div>
      </>
    );
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  return (
    <div className={styles.members}>
      <Table
        columns={columns}
        rowSelection={{ ...rowSelection }}
        dataSource={props.data}
        pagination={{
          current: param.pageInfor!.pageNumber,
          pageSize: param.pageInfor!.pageSize,
          total: param.pageInfor!.totalItems,
          simple: false
        }}
        scroll={{ x: 780 }}
        locale={{
          emptyText: (
            <>
              <SmileOutlined style={{ marginRight: 5 }} /> {t('Common_NoRecord')}
            </>
          )
        }}
        loading={loading}
        onChange={handleTableChange}
        title={() => TableHeader()}
        rowKey={(record) => record.id}
      />
    </div>
  );
}

export default DataTable;
