import { CaretRightOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, Button, Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import styles from '../../../GiveStar.module.scss';
import dayjs from 'dayjs';
import { util } from '@/common/helpers/util';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
interface IProps {
  record: A;
  refreshList: (draftParam?: Common.IDataGrid, isDelete?: boolean) => void;
  deleteAble?: boolean;
}

function Record(prop: IProps) {
  const { showLoading, closeLoading } = useLoading();
  const deleteRecord = async () => {
    try {
      showLoading();
      await service.postService.delete(prop.record.id);
      await prop.refreshList(undefined, true);
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

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
      <p className={styles.header}>
        {prop.record.title}
        {prop.deleteAble && <Button type="text" onClick={deleteRecord} icon={<DeleteOutlined />} />}
      </p>
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
