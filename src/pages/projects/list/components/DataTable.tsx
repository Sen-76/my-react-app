/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  EditOutlined,
  ExportOutlined,
  FilterOutlined,
  PlusOutlined,
  SmileOutlined,
  SolutionOutlined,
  DeleteOutlined,
  UndoOutlined
} from '@ant-design/icons';
import { Button, Table, Tag, Tooltip, notification, Modal } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import styles from '../Project.module.scss';
import Search from 'antd/es/input/Search';
import Paragraph from 'antd/es/typography/Paragraph';
import dayjs from 'dayjs';
import { EStatus } from '../Project.model';
import { Link } from 'react-router-dom';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';

interface IProps {
  data?: Project.IProjectModel[];
  loading: boolean;
  param: Common.IDataGrid;
  tabStatus: number;
  openPanel: (data?: A) => void;
  openFilterPanel: (data?: A) => void;
  setPage: (paging: number) => void;
  onSearch: (value: string) => void;
  refreshList: () => void;
}
function DataTable(props: IProps) {
  const { loading, param, data } = props;
  const { t } = useTranslation();
  const { showLoading, closeLoading } = useLoading();
  const { confirm } = Modal;
  const confirmDelete = async (id: string) => {
    try {
      showLoading();
      await service.projectService.delete({ isHardDelete: false, id: [id] });
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
  const deleteProject = async (project: A) => {
    confirm({
      content: t('Project_Delete_Remind_Text').replace('{0}', project.title),
      title: t('Project_Delete_Title_Confirm'),
      okText: t('Common_Delete'),
      cancelText: t('Common_Cancel'),
      onOk() {
        confirmDelete(project.id);
      }
    });
  };
  const columns: ColumnsType<A> = [
    {
      title: t('Project_Key'),
      dataIndex: 'key',
      key: 'key',
      render: (_, record) => {
        return (
          <Tooltip placement="bottom" title={record.key} color="#ffffff" arrow={true}>
            <Paragraph ellipsis={{ rows: 1, expandable: false }}>{record.key}</Paragraph>
          </Tooltip>
        );
      }
    },
    {
      title: t('Common_Title'),
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => {
        return (
          <Tooltip placement="bottom" title={record.title} color="#ffffff" arrow={true}>
            <Paragraph ellipsis={{ rows: 1, expandable: false }}>{record.title}</Paragraph>
          </Tooltip>
        );
      }
    },
    {
      title: t('department'),
      dataIndex: 'department',
      key: 'department',
      render: (_, record) => {
        return record.department?.title;
      }
    },
    {
      title: t('Project_StartDate'),
      dataIndex: 'startdate',
      key: 'startdate',
      render: (_, record) => {
        return dayjs(record.startDate).format('DD MMM YYYY');
      }
    },
    {
      title: t('Project_DueDate'),
      dataIndex: 'duedate',
      key: 'duedate',
      render: (_, record) => {
        return dayjs(record.dueDate).format('DD MMM YYYY');
      }
    },
    {
      title: t('Project_Status'),
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        return (
          <>
            {record.status === EStatus.Active && <Tag color="blue">{t('Active')}</Tag>}
            {record.status === EStatus.Pause && <Tag color="orange">{t('Pause')}</Tag>}
            {record.status === EStatus.Done && <Tag color="green">{t('Done')}</Tag>}
            {record.status === EStatus.Inactive && <Tag color="red">{t('Inactive')}</Tag>}
            {record.status === EStatus.Closed && <Tag color="black">{t('Closed')}</Tag>}
          </>
        );
      }
    },
    {
      title: t('Common_Action'),
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      className: 'actionCollumn',
      width: 180,
      render: (_, record) => {
        const editClick = () => {
          props.openPanel(record);
        };
        return (
          <div>
            <Tooltip placement="bottom" title={t('Common_ViewDetail')} color="#ffffff" arrow={true}>
              <Link to={`/projects/detail/${record.id}/${record.title}`}>
                <Button type="text" icon={<SolutionOutlined />} />
              </Link>
            </Tooltip>
            <Tooltip placement="bottom" title={t('Common_Edit')} color="#ffffff" arrow={true}>
              <Button type="text" onClick={editClick} icon={<EditOutlined />} />
            </Tooltip>
            {props.tabStatus != EStatus.Inactive ? (
              <Tooltip placement="bottom" title={t('Common_Delete')} color="#ffffff" arrow={true}>
                <Button type="text" onClick={() => deleteProject(record)} icon={<DeleteOutlined />} />
              </Tooltip>
            ) : (
              <Tooltip placement="bottom" title={t('Common_Restore')} color="#ffffff" arrow={true}>
                <Button type="text" onClick={() => restoreUser(record)} icon={<UndoOutlined />} />
              </Tooltip>
            )}
          </div>
        );
      }
    }
  ];

  const restoreUser = async (project?: A) => {
    try {
      showLoading();
      await service.projectService.restoreProject([project.id]);
      notification.open({
        message: t('Common_RestoreSuccess'),
        type: 'success'
      });
      props.refreshList();
      closeLoading();
    } catch (e) {
      console.log(e);
    }
  };

  const onSearch = (val: A) => {
    props.onSearch(val);
  };

  const TableHeader = () => {
    return (
      <>
        <div className={styles.tableHeaderLeft}>
          {props.tabStatus != EStatus.Inactive && (
            <Button type="text" onClick={props.openPanel} icon={<PlusOutlined />}>
              {t('Common_AddNew')}
            </Button>
          )}
          <Button type="text" onClick={exportExcel} icon={<ExportOutlined />}>
            {t('Common_ExportExcel')}
          </Button>
        </div>
        <div className={styles.tableHeaderRight}>
          <Tooltip placement="bottom" title={t('Common_Filter')} color="#ffffff" arrow={true}>
            <Button type="text" onClick={() => props.openFilterPanel(param.filter)} icon={<FilterOutlined />} />
          </Tooltip>
          <Search placeholder={t('Common_SearchByTitle')} allowClear onSearch={onSearch} style={{ width: 250 }} />
        </div>
      </>
    );
  };

  const exportExcel = () => {
    notification.open({
      message: t('Common_ExportSuccess'),
      type: 'success'
    });
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    props.setPage(pagination.current ?? 1);
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          current: param.pageInfor!.pageNumber,
          pageSize: param.pageInfor!.pageSize,
          total: param.pageInfor!.totalItems,
          simple: false
        }}
        scroll={{ x: 1230 }}
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
    </>
  );
}

export default DataTable;
