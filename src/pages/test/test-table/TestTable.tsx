import React, { useState, useEffect } from 'react';
import { Button, Modal, Table, Tag, notification, message, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TablePaginationConfig, TableRowSelection } from 'antd/es/table/interface';
import { BulbOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useBreadcrumb } from '../../../components/breadcrum/Breadcrum';
import { useLoading } from '../../../common/context/useLoading';

interface DataType {
  key: React.ReactNode;
  name: string;
  age: number;
  address: string;
  tags: string[];
  children?: DataType[];
}
const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    fixed: 'left',
    key: 'name',
    render: (text) => <a>{text}</a>
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: '12%'
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (tags: string[]) => (
      <span>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    )
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: '30%',
    key: 'address'
  },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: (_, record) => (record.name !== 'Disabled User' ? <a>action</a> : <>--</>)
  }
];
const data: DataType[] = [
  {
    key: 1,
    name: 'John Brown sr.',
    age: 60,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
    children: [
      {
        key: 11,
        name: 'John Brown',
        age: 42,
        tags: ['nice', 'developer'],
        address: 'New York No. 2 Lake Park'
      },
      {
        key: 12,
        name: 'John Brown jr.',
        age: 30,
        tags: ['nice', 'developer'],
        address: 'New York No. 3 Lake Park',
        children: [
          {
            key: 121,
            name: 'Jimmy Brown',
            age: 16,
            tags: ['nice', 'developer'],
            address: 'New York No. 3 Lake Park'
          }
        ]
      },
      {
        key: 13,
        name: 'Jim Green sr.',
        age: 72,
        tags: ['nice', 'developer'],
        address: 'London No. 1 Lake Park',
        children: [
          {
            key: 131,
            name: 'Jim Green',
            age: 42,
            tags: ['nice', 'developer'],
            address: 'London No. 2 Lake Park',
            children: [
              {
                key: 1311,
                name: 'Jim Green jr.',
                age: 25,
                tags: ['nice', 'developer'],
                address: 'London No. 3 Lake Park'
              },
              {
                key: 1312,
                name: 'Jimmy Green sr.',
                age: 18,
                tags: ['nice', 'developer'],
                address: 'London No. 4 Lake Park'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    key: 2,
    name: 'Joe Black',
    age: 32,
    tags: ['loser'],
    address: 'Sydney No. 1 Lake Park'
  },
  {
    key: 3,
    name: 'Disabled User',
    age: 99,
    tags: ['cool', 'teacher'],
    address: 'Sydney No. 1 Lake Park'
  }
];

function TestTable() {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 20,
    simple: false
  });
  const { setBreadcrumb } = useBreadcrumb();
  const { showLoading, closeLoading } = useLoading();
  const [messageApi, contextHolder] = message.useMessage();
  const { confirm } = Modal;
  useEffect(() => {
    showLoading();
    setBreadcrumb([{ path: '/', icon: <BulbOutlined />, text: 'Test' }, { text: 'Test Table' }]);
    const timeout = setTimeout(() => {
      closeLoading();
      clearTimeout(timeout);
    }, 2000);
    messageApi.info('Welcome to table test page!');

    return () => {
      clearTimeout(timeout);
    };
  }, []);
  const rowSelection: TableRowSelection<DataType> = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedItem(selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(selected, selectedRows, record);
      setSelectedItem(selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
      setSelectedItem(selectedRows);
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === 'Disabled User',
      name: record.name
    })
  };
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
    tableLoading();
  };
  const tableLoading = () => {
    setLoading(true);
    setBreadcrumb([{ path: '/', icon: <BulbOutlined />, text: 'Test' }, { text: 'Test Table' }]);
    const timeout = setTimeout(() => {
      setLoading(false);
      clearTimeout(timeout);
    }, 2000);
  };
  const TableHeader = () => {
    const deleteSelected = () => {
      confirm({
        title: 'Do you Want to delete these items?',
        icon: <ExclamationCircleFilled />,
        content: 'Some descriptions',
        onOk() {
          messageApi.open({
            key: 'updatable',
            type: 'loading',
            content: 'Action in progress..',
            duration: 0
          });
          tableLoading();
          console.log(selectedItem);
          notification.open({
            message: 'Delete thử thôi chứ k xóa đc đâu :")',
            type: 'success'
          });
          setTimeout(() => {
            messageApi.open({
              key: 'updatable',
              type: 'success',
              content: 'Loaded!',
              duration: 2
            });
          }, 1000);
        },
        onCancel() {
          console.log('Cancel');
        }
      });
    };
    const showNotification = () => {
      notification.info({
        message: `Notification topLeft`,
        description: 'Hello, Đây là Page của tớ nhé!!',
        placement: 'topLeft'
      });
    };
    return (
      <>
        <Button type="text" onClick={showNotification}>
          Add new
        </Button>
        <Button
          onClick={deleteSelected}
          loading={loading}
          type="text"
          icon={<DeleteOutlined />}
          disabled={selectedItem.length === 0}
        >
          Delete Selected
        </Button>
        <Button type="text" onClick={showNotification}>
          Open notification
        </Button>
      </>
    );
  };
  return (
    <>
      <div style={{ padding: 20 }}>
        {contextHolder}
        <Button onClick={tableLoading} loading={loading} type="primary">
          Load đi
        </Button>
        <Table
          columns={columns}
          rowSelection={{ ...rowSelection }}
          dataSource={data}
          pagination={pagination}
          scroll={{ x: 768 }}
          loading={loading}
          onChange={handleTableChange}
          title={() => TableHeader()}
          footer={() => 'Footer'}
        />
      </div>
    </>
  );
}

export default TestTable;
