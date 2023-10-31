import { DeleteOutlined, EditOutlined, PlusOutlined, SmileOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Input, Modal, Tag, Tooltip, notification } from 'antd';
import Table, { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import styles from '../Role.module.scss';
import Paragraph from 'antd/es/typography/Paragraph';
import { service } from '@/services/apis';

interface IProps {
  data: Role.IRoleCreateModel[];
  openPanel: (data?: A) => void;
  refreshList: () => void;
  onSearch: (value: string) => void;
  setPage: (paging: number) => void;
  loading: boolean;
  param: Common.IDataGrid;
}
function DataTable(props: IProps) {
  const { data, loading, openPanel, param } = props;
  const { t } = useTranslation();
  const { Search } = Input;
  const { confirm } = Modal;

  const columns: ColumnsType<A> = [
    {
      title: t('Common_Title'),
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (_, record) => {
        return record.isDefault ? (
          <>
            {record.title}{' '}
            <Tag style={{ marginLeft: 5 }} color="red">
              {t('default')}
            </Tag>
          </>
        ) : (
          <>{record.title}</>
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
      title: t('Common_ModifiedOn'),
      dataIndex: 'modifiedOn',
      key: 'modifiedOn',
      width: 150,
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
      width: 130,
      render: (_, record) => {
        const deleteHandle = () => {
          confirm({
            content: t('Manage_Role_DeleteConfirm').replace('{0}', record.title),
            title: t('Manage_Role_Delete'),
            okText: t('Common_Delete'),
            cancelText: t('Common_Cancel'),
            onOk: async () => {
              try {
                await service.rolesService.delete({
                  isHardDelete: true,
                  id: [record.id]
                });
                notification.open({
                  message: t('Common_DeleteSuccess'),
                  type: 'success'
                });
                props.refreshList();
              } catch (e) {
                console.log(e);
              }
            }
          });
        };
        return (
          <div>
            <Tooltip placement="bottom" title={t('Common_Edit')} color="#ffffff" arrow={true}>
              <Button
                disabled={record.isDefault}
                type="text"
                onClick={() => openPanel(record)}
                icon={<EditOutlined />}
              />
            </Tooltip>
            <Tooltip placement="bottom" title={t('Common_Delete')} color="#ffffff" arrow={true}>
              <Button disabled={record.isDefault} type="text" onClick={deleteHandle} icon={<DeleteOutlined />} />
            </Tooltip>
          </div>
        );
      }
    }
  ];

  const onSearch = (val: A) => {
    props.onSearch(val);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    props.setPage(pagination.current ?? 1);
  };

  const TableHeader = () => {
    return (
      <>
        <div className={styles.tableHeaderLeft}>
          <Button type="text" onClick={() => props.openPanel()} icon={<PlusOutlined />}>
            {t('Common_AddNew')}
          </Button>
        </div>
        <div className={styles.tableHeaderRight}>
          <Search placeholder="Search Name" allowClear onSearch={onSearch} style={{ width: 250 }} />
        </div>
      </>
    );
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: 780 }}
        locale={{
          emptyText: (
            <>
              <SmileOutlined style={{ marginRight: 5 }} /> {t('Common_NoRecord')}
            </>
          )
        }}
        pagination={{
          current: param.pageInfor!.pageNumber,
          pageSize: param.pageInfor!.pageSize,
          total: param.pageInfor!.totalItems,
          simple: false
        }}
        loading={loading}
        onChange={handleTableChange}
        title={() => TableHeader()}
        rowKey={(record) => record.id}
      />
    </>
  );
}

export default DataTable;
