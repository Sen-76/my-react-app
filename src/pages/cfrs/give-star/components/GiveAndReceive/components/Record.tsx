import { ForwardOutlined, StarFilled } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import styles from '../../../GiveStar.module.scss';
import dayjs from 'dayjs';
interface IProps {
  record: A;
}

function Record(prop: IProps) {
  return (
    <Card style={{ width: '100%', marginBottom: '10px' }}>
      <div className={styles.record}>
        <Meta
          avatar={<Avatar src={prop.record.userSend?.avatarUrl?.url} />}
          title={prop.record.userSend.userName}
          description={prop.record.userSend?.userDepartment2?.title}
        />
        <ForwardOutlined style={{ fontSize: '30px' }} />
        <Meta
          avatar={<Avatar src={prop.record.userGive?.avatarUrl?.url} />}
          title={prop.record.userGive.userName}
          description={prop.record.userGive?.userDepartment2?.title}
        />
      </div>
      <p className={styles.header}>{prop.record.title}</p>
      <p className={styles.contentRecord}>{prop.record.description}</p>
      <p style={{ padding: '10px' }}>
        {prop.record.starGive} <StarFilled style={{ color: 'yellow' }} />{' '}
        {dayjs(prop.record.createdDate).format('YYYY-MM-DD')}
      </p>
    </Card>
  );
}

export default Record;
