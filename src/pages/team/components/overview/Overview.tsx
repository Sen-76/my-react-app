import { Col, Collapse, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from '../../TeamDetail.module.scss';
import { useEffect, useState } from 'react';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';

function Overview() {
  const { t } = useTranslation();
  const [editData, setEditData] = useState<A>();
  const { showLoading, closeLoading } = useLoading();
  const id = JSON.parse(sessionStorage.getItem('userDetail') ?? '')?.teamId;
  useEffect(() => {
    getTeamDetail();
  }, []);

  const getTeamDetail = async () => {
    try {
      if (id) {
        showLoading();
        const result = await service.teamService.getDetail(id ?? '');
        setEditData(result.data);
        closeLoading();
      }
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };
  return (
    <>
      {' '}
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
                    <Col className={styles.keyCol}>{t('Department_Name')}</Col>
                    <Col className={styles.valueCol}>{editData?.title}</Col>
                  </Row>
                  <Row className={styles.detailRow}>
                    <Col className={styles.keyCol}>{t('Team_Department')}</Col>
                    <Col className={styles.valueCol}>{editData?.department.title}</Col>
                  </Row>
                  <Row className={styles.detailRow}>
                    <Col className={styles.keyCol}>{t('Team_Leader')}</Col>
                    <Col className={styles.valueCol}>{editData?.manager.fullName}</Col>
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
                      {editData?.description}
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

export default Overview;
