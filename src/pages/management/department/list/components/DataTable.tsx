/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DeleteOutlined, EditOutlined, PlusOutlined, SmileOutlined, SolutionOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Table, Tooltip, notification } from 'antd';
import styles from '../Department.module.scss';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import Paragraph from 'antd/es/typography/Paragraph';
import { useLoading } from '@/common/context/useLoading';
import { service } from '@/services/apis';
import PermissionBlock from '@/common/helpers/permission/PermissionBlock';

interface IProps {
  data: A[];
  openPanel: (data?: A) => void;
  loading: boolean;
  onSearch: (value: string) => void;
  setPage: (paging: number) => void;
  param: Common.IDataGrid;
  refreshList: () => void;
}
function DataTable(props: Readonly<IProps>) {
  const { loading, data, param, openPanel } = props;
  const { Search } = Input;
  const { t } = useTranslation();
  const { confirm } = Modal;
  const allPermission = JSON.parse(sessionStorage.getItem('allPermissions') ?? '');
  const { showLoading, closeLoading } = useLoading();

  const columns: ColumnsType<A> = [
    {
      title: t('Department_Name'),
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (_, record) => {
        return (
          <Tooltip placement="bottom" title={record.userEmail} color="#ffffff" arrow={true}>
            <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ minWidth: 100 }}>
              {record.title}
            </Paragraph>
          </Tooltip>
        );
      }
    },
    {
      title: t('Common_Description'),
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (_, record) => {
        return (
          <Tooltip placement="bottom" title={record.description} color="#ffffff" arrow={true}>
            <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ minWidth: 100 }}>
              {record.description}
            </Paragraph>
          </Tooltip>
        );
      }
    },
    {
      title: t('Department_Manger'),
      dataIndex: 'manager',
      width: 200,
      key: 'manager',
      render: (_, record) => record.manager.fullName
    },
    {
      title: t('Common_ModifiedOn'),
      dataIndex: 'modifiedOn',
      key: 'modifiedOn',
      width: 200,
      render: (_, record) => {
        return <div style={{ minWidth: 90 }}>{dayjs(record.updateDate).format('DD MMM YYYY HH:mm')}</div>;
      }
    },
    {
      title: t('Common_Action'),
      dataIndex: 'action',
      key: 'action',
      className: 'actionCollumn',
      fixed: 'right',
      width: 170,
      render: (_, record) => {
        const editClick = () => {
          props.openPanel(record);
        };
        const confirmDelete = async (id: string) => {
          try {
            showLoading();
            await service.departmentService.delete({ isHardDelete: true, id: [id] });
            closeLoading();
            props.refreshList();
            notification.open({
              message: t('Common_DeleteSuccess'),
              type: 'success'
            });
          } catch (e) {
            console.log(e);
          }
        };
        const deleteDepartment = async (department: A) => {
          confirm({
            content: t('Department_Delete_Remind_Text').replace('{0}', department.title),
            title: t('Common_Delete'),
            okText: t('Common_Delete'),
            cancelText: t('Common_Cancel'),
            onOk() {
              confirmDelete(department.id);
            }
          });
        };
        return (
          <div>
            <Tooltip placement="bottom" title={t('Common_ViewDetail')} color="#ffffff" arrow={true}>
              <Link to={`/management/department-management/department-detail/${record.title}/${record.id}`}>
                <Button type="text" icon={<SolutionOutlined />} />
              </Link>
            </Tooltip>
            <PermissionBlock module={allPermission?.Department?.Permission_Edit_Department}>
              <Tooltip placement="bottom" title={t('Common_Edit')} color="#ffffff" arrow={true}>
                <Button type="text" onClick={editClick} icon={<EditOutlined />} />
              </Tooltip>
            </PermissionBlock>
            <PermissionBlock module={allPermission?.Department?.Permission_Delete_Department}>
              <Tooltip placement="bottom" title={t('Common_Delete')} color="#ffffff" arrow={true}>
                <Button type="text" onClick={() => deleteDepartment(record)} icon={<DeleteOutlined />} />
              </Tooltip>
              /
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

  const TableHeader = () => {
    return (
      <>
        <div className={styles.tableHeaderLeft}>
          <PermissionBlock module={allPermission?.Department?.Permission_Create_Department}>
            <Button type="text" onClick={() => openPanel()} icon={<PlusOutlined />}>
              {t('Common_AddNew')}
            </Button>
          </PermissionBlock>
        </div>
        <div className={styles.tableHeaderRight}>
          <Search placeholder="Search Name" allowClear onSearch={onSearch} style={{ width: 250 }} />
        </div>
      </>
    );
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      scroll={{ x: 780 }}
      pagination={{
        current: param.pageInfor!.pageNumber,
        pageSize: param.pageInfor!.pageSize,
        total: param.pageInfor!.totalItems,
        simple: false
      }}
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
  );
}

export default DataTable;
