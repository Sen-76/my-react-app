import { Col, Progress, Row, Space, Tree } from 'antd';
import { useEffect, useState } from 'react';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { AlignLeftOutlined, DownOutlined } from '@ant-design/icons';
import styles from '../Goals.module.scss';
import dayjs from 'dayjs';

function GoalList() {
  const [treeData, setTreeData] = useState<DataNode[]>([]);

  useEffect(() => {
    getGoals();
  }, []);

  const getGoals = () => {
    const goal = () => (
      <Row style={{ width: '100%' }}>
        <Col>Title nè</Col>
        <Col>
          <Progress style={{ width: 100 }} percent={50} />
        </Col>
        <Col>No Status</Col>
        <Col>{dayjs().format('YYYY MMM DD')}</Col>
        <Col style={{ width: 20 }}>
          <AlignLeftOutlined />
        </Col>
      </Row>
    );
    setTreeData([
      {
        title: goal,
        key: '0-0',
        children: [
          {
            title: goal,
            key: '0-0-0'
          },
          {
            title: goal,
            key: '0-0-1'
          }
        ]
      }
    ]);
  };

  const onDrop: TreeProps['onDrop'] = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    if (info.dropToGap || dropPosition === 0) {
      return;
    }

    const loop = (
      data: DataNode[],
      key: React.Key,
      callback: (node: DataNode, i: number, data: DataNode[]) => void
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...treeData];

    let dragObj: DataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    loop(data, dropKey, (item) => {
      item.children = item.children || [];
      item.children.unshift(dragObj);
    });

    setTreeData(data);
  };

  return (
    <div className={styles.goalList}>
      <Space wrap>
        <Progress type="circle" percent={75} />
      </Space>
      <Tree
        className="draggable-tree"
        switcherIcon={<DownOutlined />}
        treeData={treeData}
        showLine
        draggable
        blockNode
        onDrop={onDrop}
      />
    </div>
  );
}

export default GoalList;
