import { EditOutlined, ExportOutlined, PlusOutlined, SmileOutlined, SolutionOutlined } from '@ant-design/icons';
import { Button, Table, Tag, Tooltip, notification } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import styles from '../Task.module.scss';
import Paragraph from 'antd/es/typography/Paragraph';
import { Link } from 'react-router-dom';

interface IProps {
  data: A[];
  loading: boolean;
  param: Common.IDataGrid;
  openPanel: (data?: A) => void;
  onOrder: (value: string, des: boolean) => void;
}
function DataTable(props: IProps) {
  const { loading, data } = props;
  const { t } = useTranslation();
  const columns: ColumnsType<A> = [
    {
      title: t('Task_Key'),
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => {
        return (
          <Tooltip placement="bottom" title={record?.key} color="#ffffff" arrow={true}>
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
          <Tooltip placement="bottom" title={record?.title} color="#ffffff" arrow={true}>
            <Paragraph ellipsis={{ rows: 1, expandable: false }}>{record.summary}</Paragraph>
          </Tooltip>
        );
      }
    },
    {
      title: t('Task_Priority'),
      dataIndex: 'description',
      key: 'description',
      render: (_, record) => {
        return (
          <Tag>
            <Paragraph ellipsis={{ rows: 1, expandable: false }}>{record.taskPrioty?.pname}</Paragraph>
          </Tag>
        );
      }
    },
    {
      title: t('Task_Assignee'),
      dataIndex: 'modifiedOn',
      key: 'modifiedOn',
      render: (_, record) => {
        return <Paragraph ellipsis={{ rows: 1, expandable: false }}>{record.assignee2?.fullName}</Paragraph>;
      }
    },
    {
      title: t('Task_ReportTo'),
      dataIndex: 'modifiedBy',
      key: 'modifiedBy',
      render: (_, record) => (
        <Paragraph ellipsis={{ rows: 1, expandable: false }}>{record.reportToRelation?.fullName}</Paragraph>
      )
    },
    {
      title: t('Task_Status'),
      dataIndex: 'description',
      key: 'description',
      render: (_, record) => {
        return (
          <Tag color={record.status?.color}>
            <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ color: 'white' }}>
              {record.status?.title}
            </Paragraph>
          </Tag>
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
              <Link to={`/tasks/task-detail/${record.key}/${record.id}`}>
                <Button type="text" icon={<SolutionOutlined />} />
              </Link>
            </Tooltip>
            <Tooltip placement="bottom" title={t('Common_Edit')} color="#ffffff" arrow={true}>
              <Button
                type="text"
                disabled={record.status?.title !== 'Open'}
                onClick={() => props.openPanel(record)}
                icon={<EditOutlined />}
              />
            </Tooltip>
          </div>
        );
      }
    }
  ];

  const TableHeader = () => {
    return (
      <>
        <div className={styles.tableHeaderLeft}>
          <Button type="text" icon={<PlusOutlined />} onClick={() => props.openPanel()}>
            {t('Common_AddNew')}
          </Button>
          <Button type="text" onClick={exportExcel} icon={<ExportOutlined />}>
            {t('Common_ExportExcel')}
          </Button>
        </div>
        <div className={styles.tableHeaderRight}></div>
      </>
    );
  };

  const exportExcel = () => {
    notification.open({
      message: t('Common_ExportSuccess'),
      type: 'success'
    });
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: 780 }}
        locale={{
          emptyText: (
            <>
              <SmileOutlined style={{ marginRight: 5 }} /> {t('Common_NoRecord')}
            </>
          )
        }}
        loading={loading}
        title={() => TableHeader()}
        rowKey={(record) => record.id}
      />
    </>
  );
}

export default DataTable;
