import { SmileOutlined, SolutionOutlined } from '@ant-design/icons';
import { Button, Progress, Table, Tooltip } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import styles from '../Project.module.scss';
import { useTranslation } from 'react-i18next';
import Paragraph from 'antd/es/typography/Paragraph';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import Search from 'antd/es/input/Search';

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
      title: t('Common_Title'),
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => {
        return (
          <Tooltip placement="bottom" title={record.name} color="#ffffff" arrow={true}>
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 250 }}>
              <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ maxWidth: 150, minWidth: 30 }}>
                {record.title}
              </Paragraph>
            </div>
          </Tooltip>
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
      title: t('Project_Progress'),
      dataIndex: 'progress',
      key: 'progress',
      render: (_, record) => {
        return <Progress className={styles.progress} style={{ width: 100 }} percent={record.progress} />;
      }
    },
    {
      title: t('team'),
      dataIndex: 'team',
      key: 'team',
      render: (_, record) => {
        return record.team.name;
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
        return (
          <div>
            <Tooltip placement="bottom" title={t('Common_ViewDetail')} color="#ffffff" arrow={true}>
              <Link to={`/${record}`}>
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
