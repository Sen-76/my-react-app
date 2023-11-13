import { useTranslation } from 'react-i18next';
import { Row, Col } from 'antd';
import styles from './GiveStar.module.scss';
import StarNumber from './components/StarsNumber';
import CreatePost from './components/createPost/CreatePost';
import GiveAndReceive from './components/GiveAndReceive/GiveAndReceive';
import Chart from './components/Chart';
import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { StarOutlined } from '@ant-design/icons';
import { useLoading } from '@/common/context/useLoading';
import { service } from '@/services/apis';
import { useEffect, useRef, useState } from 'react';

function GiveStar() {
  const { t } = useTranslation();
  const { showLoading, closeLoading } = useLoading();
  const { setBreadcrumb } = useBreadcrumb();
  const [data, setData] = useState<A>(true);
  const [journeyData, setJourneyData] = useState<A>();

  useEffect(() => {
    const fetchData = async () => {
      showLoading();
      await getStar();
      await getJourney();
      closeLoading();
    };
    fetchData();
  }, []);

  useEffect(() => {
    setBreadcrumb([{ icon: <StarOutlined />, text: `CFRs` }, { text: `${t('Give_star')}` }]);
  }, [t]);

  const getStar = async () => {
    try {
      const result = await service.postService.getStarOfNumber();
      setData(result);
    } catch (e) {
      console.log(e);
    }
  };

  const getJourney = async () => {
    try {
      const result = await service.postService.getJourney({ numberMonth: 12 });
      setJourneyData(result.data);
    } catch (e) {
      console.log(e);
    }
  };

  const postRef = useRef();

  const addPost = () => {
    getStar();
    (postRef.current as A).addPost();
  };

  return (
    <>
      <Row gutter={[16, 16]} className={styles.start}>
        <Col span={12}>
          <Col span={24} className={styles.startNumber}>
            <StarNumber numberStar={data} />
          </Col>
          <Col span={24} className={styles.giveStar}>
            <CreatePost numberStar={data.currentUserStars} addPost={addPost} />
          </Col>
        </Col>
        <Col span={12} className={styles.giveAndReceive}>
          <GiveAndReceive getStar={getStar} ref={postRef} />
        </Col>
      </Row>
      <Row className={styles.start}>
        <Col className={styles.draft}>
          <Chart data={journeyData} />
        </Col>
      </Row>
    </>
  );
}

export default GiveStar;
