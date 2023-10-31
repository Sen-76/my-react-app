import { useLoading } from '@/common/context/useLoading';
import { service } from '@/services/apis';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Paragraph from 'antd/es/typography/Paragraph';
import styles from '../ProjectDetail.module.scss';
import { Col, Collapse, Row } from 'antd';
import { useTranslation } from 'react-i18next';
function GeneralInfo() {
  const { showLoading, closeLoading } = useLoading();
  const dataLocation = useParams();
  const [editData, setEditData] = useState<A>();
  const { t } = useTranslation();

  const getProjectDetail = async () => {
    try {
      showLoading();
      const result = await service.projectService.getDetail(dataLocation.id ?? '');
      setEditData(result.data);
      closeLoading();
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    getProjectDetail();
  }, []);

  return (
    <>
      <Collapse
        defaultActiveKey={['1']}
        items={[
          {
            key: '1',
            label: t('General_Information'),
            children: (
              <Row style={{ display: 'flex', gap: 10 }}>
                <Col style={{ width: 'calc(50% - 10px)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Row className={styles.detailRow}>
                    <Col className={styles.keyCol}>{t('Common_Title')}</Col>
                    <Col className={styles.valueCol}>{editData?.title}</Col>
                  </Row>
                  <Row className={styles.detailRow}>
                    <Col className={styles.keyCol}>{t('Project_Department')}</Col>
                    <Col className={styles.valueCol}>{editData?.department?.title}</Col>
                  </Row>
                  <Row className={styles.detailRow}>
                    <Col className={styles.keyCol}>{t('Project_Team')}</Col>
                    <Col className={styles.valueCol}>{editData?.team?.title}</Col>
                  </Row>
                </Col>
                <Col style={{ width: '50%' }}>
                  <Row className={styles.detailRow} style={{ height: '100%' }}>
                    <Col className={styles.keyCol} style={{ height: '100%' }}>
                      {t('Common_Description')}
                    </Col>
                    <Col
                      className={styles.valueCol}
                      style={{ width: 'calc(100% - 110px)', lineHeight: '20px', paddingTop: 10 }}
                    >
                      <Paragraph ellipsis={{ rows: 5, expandable: false }}>{editData?.description}</Paragraph>
                    </Col>
                  </Row>
                </Col>
              </Row>
            )
          }
        ]}
      />
    </>
  );
}

export default GeneralInfo;
