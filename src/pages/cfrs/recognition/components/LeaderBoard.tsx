import { useTranslation } from 'react-i18next';
import styles from '../Recognition.module.scss';
import { Avatar, List } from 'antd';
import { useState, useEffect } from 'react';
import { service } from '@/services/apis';
import { util } from '@/common/helpers/util';
import { StarOutlined } from '@ant-design/icons';

function LeaderBoard() {
  const { t } = useTranslation();
  const [data, setData] = useState<A>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getStar();
  }, []);

  const getStar = async () => {
    try {
      const result = await service.postService.getTop10({ year: 2023, month: 10 });
      setData(result.data);
    } catch (e) {
      console.log(e);
    }
  };

  const item = (item: A, index: number) =>
    index > 2 && (
      <List.Item>
        <List.Item.Meta
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar style={{ marginRight: '16px', backgroundColor: 'gray' }} size={40}>
                  {index + 1}
                </Avatar>
                <Avatar
                  src={item.user?.avatarUrl?.url}
                  style={{ marginRight: '16px', backgroundColor: util.randomColor() }}
                  size={40}
                >
                  {item.user?.fullName?.charAt(0)}
                </Avatar>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>{item.user?.fullName}</div>

                  <div style={{ fontWeight: 500 }}>{item.user?.userEmail}</div>
                </div>
              </div>
              <div>
                {item.numberStars}
                <StarOutlined style={{ marginLeft: 10 }} />
              </div>
            </div>
          }
        />
      </List.Item>
    );

  return (
    <div className={styles.leaderboard}>
      <div style={{ marginBottom: 75 }}>
        <div
          className="top-1"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: '10'
          }}
        >
          <div
            style={{
              width: 200,
              height: 170,
              background: '#b44a4aa8',
              marginTop: 50,
              position: 'absolute',
              zIndex: '0',
              borderTopRightRadius: '45%',
              borderTopLeftRadius: '45%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
          >
            <div style={{ fontWeight: 600 }}>{data[0]?.user?.fullName}</div>
            <div>
              {data[0]?.numberStars}
              <StarOutlined style={{ marginLeft: 10 }} />
            </div>
          </div>
          <span style={{ fontWeight: 600 }}>Top 1</span>
          <Avatar src={data[0]?.user?.avatarUrl?.url} style={{ backgroundColor: util.randomColor() }} size={80}>
            {data[0]?.user?.fullName?.charAt(0)}
          </Avatar>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '-60px' }}>
          <div className="top-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: 200,
                height: 129,
                background: '#b44a4aa8',
                marginTop: 50,
                position: 'absolute',
                zIndex: '0',
                borderTopRightRadius: '45%',
                borderTopLeftRadius: '45%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}
            >
              <div style={{ fontWeight: 600, marginTop: 30 }}>{data[1]?.user?.fullName}</div>
              <div>
                {data[1]?.numberStars}
                <StarOutlined style={{ marginLeft: 10 }} />
              </div>
            </div>
            <span style={{ fontWeight: 600 }}>Top 2</span>
            <Avatar src={data[1]?.user?.avatarUrl?.url} style={{ backgroundColor: util.randomColor() }} size={80}>
              {data[1]?.user?.fullName?.charAt(0)}
            </Avatar>
          </div>
          <div className="top-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: 200,
                height: 129,
                background: '#b44a4aa8',
                marginTop: 50,
                position: 'absolute',
                zIndex: '0',
                borderTopRightRadius: '45%',
                borderTopLeftRadius: '45%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}
            >
              <div style={{ fontWeight: 600, marginTop: 30 }}>{data[2]?.user?.fullName}</div>
              <div>
                {data[2]?.numberStars}
                <StarOutlined style={{ marginLeft: 10 }} />
              </div>
            </div>
            <span style={{ fontWeight: 600 }}>Top 3</span>
            <Avatar src={data[2]?.user?.avatarUrl?.url} style={{ backgroundColor: util.randomColor() }} size={80}>
              {data[2]?.user?.fullName?.charAt(0)}
            </Avatar>
          </div>
        </div>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={data}
        className={styles.list}
        bordered
        renderItem={item}
        loading={loading}
      />
    </div>
  );
}

export default LeaderBoard;
