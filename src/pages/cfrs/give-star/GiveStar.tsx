import { useTranslation } from 'react-i18next';
import { Row, Col } from 'antd';
import styles from './GiveStar.module.scss';
import StarNumber from './components/StarsNumber';
import CreatePost from './components/createPost/CreatePost';
import GiveAndReceive from './components/GiveAndReceive/GiveAndReceive';
import Chart from './components/Chart';
import { useEffect, useState } from 'react';
import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { StarOutlined } from '@ant-design/icons';
import { useLoading } from '@/common/context/useLoading';
import { service } from '@/services/apis';

function GiveStar() {
  const { t } = useTranslation();
  const { showLoading } = useLoading();
  const { setBreadcrumb } = useBreadcrumb();
  const [data, setData] = useState<A>(true);

  useEffect(() => {
    getStar();
  }, []);

  useEffect(() => {
    setBreadcrumb([{ icon: <StarOutlined />, text: `CFRs` }, { text: `${t('Give_star')}` }]);
  }, [t]);

  const getStar = async () => {
    try {
      showLoading();
      const result = await service.postService.getStarOfNumber();
      setData(result);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Row gutter={[16, 16]} className={styles.start}>
        <Col span={12}>
          <Col span={24} className={styles.startNumber}>
            <StarNumber numberStar={data} />
          </Col>
          <Col span={24} className={styles.giveStar}>
            <CreatePost numberStar={data.currentUserStars} />
          </Col>
        </Col>
        <Col span={12} className={styles.giveAndReceive}>
          <GiveAndReceive />
        </Col>
      </Row>
      <Row className={styles.start}>
        <Col className={styles.draft}>
          <Chart />
        </Col>
      </Row>
    </>
  );
}

export default GiveStar;
