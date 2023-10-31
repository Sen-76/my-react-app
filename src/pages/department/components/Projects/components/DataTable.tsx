import {
  EditOutlined,
  ExportOutlined,
  FilterOutlined,
  PlusOutlined,
  SmileOutlined,
  SolutionOutlined
} from '@ant-design/icons';
import { Button, Table, Tag, Tooltip, notification } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import styles from '../Project.module.scss';
import Search from 'antd/es/input/Search';
import Paragraph from 'antd/es/typography/Paragraph';
import dayjs from 'dayjs';
import { EStatus } from '@/pages/projects/list/Project.model';
import { Link } from 'react-router-dom';

interface IProps {
  data?: Project.IProjectModel[];
  loading: boolean;
  param: Common.IDataGrid;
  setPage: (paging: number) => void;
  onSearch: (value: string) => void;
}
function DataTable(props: IProps) {
  const { loading, param, data } = props;
  const { t } = useTranslation();
  const columns: ColumnsType<A> = [
    {
      title: t('Department_Name'),
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
            {record.status === EStatus.Active && <Tag color="blue">Active</Tag>}
            {record.status === EStatus.Pause && <Tag color="orange">Pause</Tag>}
            {record.status === EStatus.Done && <Tag color="green">Done</Tag>}
            {record.status === EStatus.Inactive && <Tag color="red">Inactive</Tag>}
            {record.status === EStatus.Closed && <Tag color="black">Closed</Tag>}
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
        return (
          <div>
            <Tooltip placement="bottom" title={t('Common_ViewDetail')} color="#ffffff" arrow={true}>
              <Link to={`/projects/detail/${record.id}/${record.title}`}>
                <Button type="text" icon={<SolutionOutlined />} />
              </Link>
            </Tooltip>
          </div>
        );
      }
    }
  ];

  const onSearch = (val: A) => {
    props.onSearch(val);
  };

  const TableHeader = () => {
    return (
      <>
        <div className={styles.tableHeaderLeft}></div>
        <div className={styles.tableHeaderRight}>
          <Search placeholder={t('Common_SearchByTitle')} allowClear onSearch={onSearch} style={{ width: 250 }} />
        </div>
      </>
    );
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
