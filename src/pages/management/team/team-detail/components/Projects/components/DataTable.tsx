import { SmileOutlined, SolutionOutlined } from '@ant-design/icons';
import { Button, Progress, Table, Tag, Tooltip } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import styles from '../Project.module.scss';
import { useTranslation } from 'react-i18next';
import Paragraph from 'antd/es/typography/Paragraph';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import Search from 'antd/es/input/Search';
import { EStatus } from '@/pages/projects/list/Project.model';

interface IProps {
  data: A[];
  refreshList: () => void;
  loading: boolean;
}
function DataTable(props: IProps) {
  const { loading } = props;
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 20,
    simple: false
  });

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
    props.refreshList();
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
    console.log(val);
    props.refreshList();
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

  return (
    <>
      <Table
        columns={columns}
        dataSource={props.data}
        pagination={pagination}
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
    </>
  );
}

export default DataTable;
