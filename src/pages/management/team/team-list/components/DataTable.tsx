/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DeleteOutlined, EditOutlined, PlusOutlined, SmileOutlined, SolutionOutlined } from '@ant-design/icons';
import { Avatar, Button, Modal, Table, TablePaginationConfig, Tooltip, notification } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import styles from '../Team.module.scss';
import { useTranslation } from 'react-i18next';
import Paragraph from 'antd/es/typography/Paragraph';
import Search from 'antd/es/input/Search';
import { TableRowSelection } from 'antd/es/table/interface';
import { util } from '@/common/helpers/util';
import { useLoading } from '@/common/context/useLoading';
import { service } from '@/services/apis';
import { Link } from 'react-router-dom';
import PermissionBlock from '@/common/helpers/permission/PermissionBlock';

interface IProps {
  data: A[];
  openPanel: (data?: A) => void;
  setPage: (paging: number) => void;
  onSearch: (value: string) => void;
  refreshList: () => void;
  loading: boolean;
  param: Common.IDataGrid;
}
function DataTable(props: IProps) {
  const { loading, param } = props;
  const [selectedItem, setSelectedItem] = useState<A[]>([]);
  const { showLoading, closeLoading } = useLoading();
  const { confirm } = Modal;
  const { t } = useTranslation();
  const allPermission = JSON.parse(sessionStorage.getItem('allPermissions') ?? '');

  const columns: ColumnsType<A> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        return (
          <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ maxWidth: 150, minWidth: 30 }}>
            {record.title}
          </Paragraph>
        );
      }
    },
    {
      title: t('members'),
      dataIndex: 'gender',
      key: 'gender',
      render: (_, record) => {
        return (
          <Avatar.Group
            key={record.id}
            maxCount={2}
            maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
            size={40}
          >
            {record.members.map((user: A) => (
              <Avatar key={user.id} src={record.photoUrl} style={{ backgroundColor: util.randomColor() }}>
                {user.fullName?.charAt(0)}
              </Avatar>
            ))}
          </Avatar.Group>
        );
      }
    },
    {
      title: t('department'),
      dataIndex: 'department',
      key: 'department',
      render: (_, record) => {
        return (
          <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ maxWidth: 150, minWidth: 30 }}>
            {record?.department?.title}
          </Paragraph>
        );
      }
    },
    {
      title: t('Common_Description'),
      dataIndex: 'description',
      key: 'description',
      render: (_, record) => {
        return record.description;
      }
    },
    {
      title: t('Common_Action'),
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      className: 'actionCollumn',
      width: 200,
      render: (_, record) => {
        return (
          <div>
            <Tooltip placement="bottom" title={t('Common_ViewDetail')} color="#ffffff" arrow={true}>
              <Link to={`/management/team-management/team-detail/${record.title}/${record.id}`}>
                <Button type="text" icon={<SolutionOutlined />} />
              </Link>
            </Tooltip>
            <PermissionBlock module={allPermission?.Team?.Permission_Update_Team}>
              <Tooltip placement="bottom" title={t('Common_Edit')} color="#ffffff" arrow={true}>
                <Button type="text" onClick={() => props.openPanel(record)} icon={<EditOutlined />} />
              </Tooltip>
            </PermissionBlock>
            <PermissionBlock module={allPermission?.Team?.Permission_Delete_Team}>
              <Tooltip placement="bottom" title={t('Common_Delete')} color="#ffffff" arrow={true}>
                <Button type="text" onClick={() => deleteTeam(record)} icon={<DeleteOutlined />} />
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

  const rowSelection: TableRowSelection<A> = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedItem(selectedRows);
    }
  };

  const confirmDelete = async (id?: string) => {
    try {
      showLoading();
      await service.teamService.delete({ isHardDelete: true, id: id ? [id] : selectedItem });
      props.refreshList();
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

  const deleteTeam = (user?: A) => {
    confirm({
      content: user.id
        ? t('Department_Team_DeleteSingle_Remind_Text').replace('{0}', user.title)
        : t('Department_Team_DeleteMultiple_Remind_Text'),
      title: t('Common_Delete'),
      okText: t('Common_Delete'),
      cancelText: t('Common_Cancel'),
      onOk() {
        confirmDelete(user.id);
      }
    });
  };

  const TableHeader = () => {
    return (
      <>
        <div className={styles.tableHeaderLeft}>
          <PermissionBlock module={allPermission?.Team?.Permission_Update_Team}>
            <Button type="text" onClick={() => props.openPanel()} icon={<PlusOutlined />}>
              {t('Common_AddNew')}
            </Button>
          </PermissionBlock>
          <PermissionBlock module={allPermission?.Team?.Permission_Delete_Team}>
            <Button onClick={deleteTeam} type="text" icon={<DeleteOutlined />} disabled={selectedItem.length === 0}>
              {t('Common_DeleteSelected')}
            </Button>
          </PermissionBlock>
        </div>
        <div className={styles.tableHeaderRight}>
          <Search placeholder={t('Common_SearchByName')} allowClear onSearch={onSearch} style={{ width: 250 }} />
        </div>
      </>
    );
  };

  return (
    <div className={styles.members}>
      <Table
        rowSelection={{ ...rowSelection }}
        columns={columns}
        dataSource={props.data}
        pagination={{
          current: param.pageInfor!.pageNumber,
          pageSize: param.pageInfor!.pageSize,
          total: param.pageInfor!.totalItems,
          simple: false
        }}
        scroll={{ x: 780 }}
        title={() => TableHeader()}
        locale={{
          emptyText: (
            <>
              <SmileOutlined style={{ marginRight: 5 }} /> {t('Common_NoRecord')}
            </>
          )
        }}
        loading={loading}
        onChange={handleTableChange}
        rowKey={(record) => record.id}
      />
    </div>
  );
}

export default DataTable;
