/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { util } from '@/common/helpers/util';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Avatar, List, Tag } from 'antd';
import { useState } from 'react';

const initDataGrid: Common.IDataGrid = {
  pageInfor: {
    pageSize: 10,
    pageNumber: 1,
    totalItems: 20
  },
  searchInfor: {
    searchValue: '',
    searchColumn: []
  }
  // filter: [{ key: 'Status', value: [EState.Activate, EState.DeActivate] }]
};
function History() {
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);
  const data = [
    {
      id: '1',
      title: 'Ant Design Title 1'
    },
    {
      id: '2',
      title: 'Ant Design Title 2'
    },
    {
      id: '3',
      title: 'Ant Design Title 3'
    },
    {
      id: '4',
      title: 'Ant Design Title 4'
    }
  ];

  const handleTableChange = (pagination: A) => {
    console.log(pagination);
  };

  return (
    <List
      pagination={{
        current: param.pageInfor!.pageNumber,
        pageSize: param.pageInfor!.pageSize,
        total: param.pageInfor!.totalItems,
        simple: false,
        onChange: (page) => handleTableChange(page)
      }}
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar
                size={44}
                src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                style={{ marginRight: 10, backgroundColor: util.randomColor() }}
              >
                dm
              </Avatar>
            }
            title={
              <div style={{ display: 'flex' }}>
                <div>{item.title}</div>
                <div style={{ fontWeight: 400, marginLeft: 5 }}>changed status</div>
                <div style={{ fontWeight: 400, opacity: 0.8, fontSize: 14, marginLeft: 20 }}>10 Jan 2099</div>
              </div>
            }
            description={
              <div style={{ display: 'flex', gap: 20 }}>
                <Tag color="blue">Inprogress</Tag>
                <ArrowRightOutlined />
                <Tag color="green">Done</Tag>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
}

export default History;
