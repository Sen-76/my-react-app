import { CaretRightOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import styles from '../Recognition.module.scss';
import dayjs from 'dayjs';
import { util } from '@/common/helpers/util';
interface IProps {
  record: A;
}

function Record(prop: IProps) {
  return (
    <Card style={{ width: '100%', marginBottom: '10px' }}>
      <div className={styles.record}>
        <Meta
          avatar={
            <Avatar
              src={prop.record.userSend?.avatarUrl?.url}
              style={{ marginRight: '16px', backgroundColor: util.randomColor() }}
              size={40}
            >
              {prop.record.userSend?.fullName?.charAt(0)}
            </Avatar>
          }
          title={prop.record.userSend.fullName}
          description={prop.record.userSend?.userDepartment2?.title}
        />
        <CaretRightOutlined style={{ fontSize: '30px' }} />
        <Meta
          avatar={
            <Avatar
              src={prop.record.userGive?.avatarUrl?.url}
              style={{ marginRight: '16px', backgroundColor: util.randomColor() }}
              size={40}
            >
              {prop.record.userGive?.fullName?.charAt(0)}
            </Avatar>
          }
          title={prop.record.userGive.fullName}
          description={prop.record.userGive?.userDepartment2?.title}
        ></Meta>
      </div>
      <p className={styles.header}>{prop.record.title}</p>
      <p className={styles.contentRecord}>{prop.record.description}</p>
      <p style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {prop.record.starGive} <StarOutlined />
        </div>
        {dayjs(prop.record.createdDate).format('DD MMM YYYY')}
      </p>
    </Card>
  );
}

export default Record;
