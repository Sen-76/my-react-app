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
interface IProps {
  historyList: A[];
  refreshHistoryList: () => void;
}
function History(props: Readonly<IProps>) {
  const { historyList, refreshHistoryList } = props;
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);

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
      dataSource={historyList}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <List.Item.Meta
            avatar={
              <Avatar
                size={44}
                src={item.author2?.avatarUrl?.url}
                style={{ marginRight: 10, backgroundColor: util.randomColor() }}
              >
                {item.author2?.fullName}
              </Avatar>
            }
            title={
              <div style={{ display: 'flex' }}>
                <div>{item.title}</div>
                <div style={{ fontWeight: 400, marginLeft: 5 }}>{item.author2?.fullName} changed status</div>
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
