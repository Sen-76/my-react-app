import { List } from 'antd';

function History() {
  return (
    <List
      itemLayout="horizontal"
      dataSource={[]}
      renderItem={(item: A) => (
        <List.Item key={item.id}>
          <div>
            [{item?.taskLink?.key}] {item?.taskLink?.summary}
          </div>
        </List.Item>
      )}
    />
  );
}

export default History;
