import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  EditOutlined,
  ExportOutlined,
  FilterOutlined,
  OrderedListOutlined,
  PlusOutlined,
  SmileOutlined,
  SolutionOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Menu, Table, Tag, Tooltip, notification } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import styles from '../Task.module.scss';
import Search from 'antd/es/input/Search';
import Paragraph from 'antd/es/typography/Paragraph';
import { OrderBy } from '../Task.model';
import { useState } from 'react';

interface IProps {
  data: A[];
  loading: boolean;
  param: Common.IDataGrid;
  onSearch: (value: string) => void;
  openPanel: (data?: A) => void;
  openFilterPanel: (data?: A) => void;
  openDetailPanel: (data?: A) => void;
  onOrder: (value: string, des: boolean) => void;
}
function DataTable(props: IProps) {
  const { loading, param, data } = props;
  const { t } = useTranslation();
  const [des, setDes] = useState<boolean>(true);
  const [activeFilterKey, setActiveFilterKey] = useState<string>('updateDate');
  const columns: ColumnsType<A> = [
    {
      title: t('Common_Title'),
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => {
        return (
          <Tooltip placement="bottom" title={record.title} color="#ffffff" arrow={true}>
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
        return <Tag>{record.taskPrioty.pname}</Tag>;
      }
    },
    {
      title: t('Task_Assignee'),
      dataIndex: 'modifiedOn',
      key: 'modifiedOn',
      render: (_, record) => {
        return record.assignee2.fullName;
      }
    },
    {
      title: t('Task_ReportTo'),
      dataIndex: 'modifiedBy',
      key: 'modifiedBy',
      render: (_, record) => record.reportToRelation.fullName
    },
    {
      title: t('Task_Status'),
      dataIndex: 'description',
      key: 'description',
      render: (_, record) => {
        return <Tag color={record.status.color}>{record.status.title}</Tag>;
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
              <Button type="text" onClick={() => props.openDetailPanel(record)} icon={<SolutionOutlined />} />
            </Tooltip>
            <Tooltip placement="bottom" title={t('Common_Edit')} color="#ffffff" arrow={true}>
              <Button type="text" onClick={() => props.openPanel(record)} icon={<EditOutlined />} />
            </Tooltip>
          </div>
        );
      }
    }
  ];

  const onSearch = (val: A) => {
    props.onSearch(val);
  };

  const selectFilter = (val: string) => {
    setActiveFilterKey(val);
    if (val === activeFilterKey) {
      props.onOrder(val, !des);
      setDes(!des);
    } else {
      setDes(true);
      props.onOrder(val, true);
    }
  };

  const TableHeader = () => {
    const menu = () => (
      <Menu>
        {OrderBy.map((item) => (
          <Menu.Item
            key={item.key}
            className={`${styles.menuItem} ${item.key === activeFilterKey ? styles.active : ''}`}
            onClick={() => selectFilter(item.key)}
          >
            <Paragraph ellipsis={{ rows: 1, expandable: false }}>{item.value}</Paragraph>
            {item.key === activeFilterKey ? des ? <ArrowDownOutlined /> : <ArrowUpOutlined /> : ''}
          </Menu.Item>
        ))}
      </Menu>
    );

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
        <div className={styles.tableHeaderRight}>
          <Dropdown dropdownRender={menu} placement="bottomRight" trigger={['click']}>
            <Tooltip placement="top" title={t('Common_Order')} color="#ffffff" arrow={true}>
              <Button type="text" icon={<OrderedListOutlined />} />
            </Tooltip>
          </Dropdown>
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
