import { StarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from '../GiveStar.module.scss';
import { Col, Row, Statistic } from 'antd';

interface IProps {
  numberStar: A;
}

function StarNumber(prop: IProps) {
  const { t } = useTranslation();
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Statistic
          title={`${t('my_start')}`}
          value={prop.numberStar?.userStars !== null ? prop.numberStar?.userStars : 0}
          valueStyle={{ color: 'violet' }}
          prefix={<StarOutlined />}
          className={styles.startNumberContent}
        />
      </Col>
      <Col span={12}>
        <Statistic
          title={`${t('start_current')}`}
          value={prop.numberStar?.currentUserStars < 0 ? 0 : prop.numberStar?.currentUserStars}
          valueStyle={{ color: 'blue' }}
          prefix={<StarOutlined />}
          className={styles.startNumberContent}
        />
      </Col>
    </Row>
  );
}
export default StarNumber;
