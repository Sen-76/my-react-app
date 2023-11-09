/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Row, Table, Tag } from 'antd';
import styles from '../Profile.module.scss';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

interface IProps {
  task: A[];
  param: Common.IDataGrid;
  setPage: (paging: number) => void;
}
function Task(props: IProps) {
  const { task, param, setPage } = props;
  const { t } = useTranslation();
  const columns: ColumnsType<A> = [
    {
      title: 'Task name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        return record.summary;
      }
    },
    {
      title: 'Updated time',
      dataIndex: 'assignedTime',
      key: 'assignedTime',
      render: (_, record) => {
        return dayjs(record.updateDate).format('DD MMM YYYY HH:mm');
      }
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (_, record) => {
        return dayjs(record.dueDate).format('DD MMM YYYY');
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        return <Tag color={record.status.color}>{record.status.title}</Tag>;
      }
    }
  ];

  const handleTableChange = async (pagination: TablePaginationConfig) => {
    await setPage(pagination.current ?? 1);
  };

  return (
    <>
      <Row className={styles.header}>
        <span>{t('tasks')}</span>
        <Link to="/tasks">{t('Common_ViewAll')}</Link>
      </Row>
      <div className={styles.body}>
        <Table
          columns={columns}
          dataSource={task}
          rowKey={(record) => record.id}
          scroll={{ x: 430 }}
          pagination={{
            current: param.pageInfor!.pageNumber,
            pageSize: param.pageInfor!.pageSize,
            total: param.pageInfor!.totalItems,
            simple: false
          }}
          onChange={handleTableChange}
        />
      </div>
    </>
  );
}

export default Task;
