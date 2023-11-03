import { Col, Collapse, Row } from 'antd';
import { service } from '@/services/apis';
import Paragraph from 'antd/es/typography/Paragraph';
import { useLoading } from '@/common/context/useLoading';
import styles from '../../ViewDetail.module.scss';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function Overview() {
  const { showLoading, closeLoading } = useLoading();
  const [editData, setEditData] = useState<A>();
  const { t } = useTranslation();
  const id = JSON.parse(sessionStorage.getItem('userDetail') ?? '')?.userDepartmentId ?? '';

  useEffect(() => {
    getDepartmentDetail();
  }, []);

  const getDepartmentDetail = async () => {
    try {
      showLoading();
      const { data } = await service.departmentService.getDetail(id);
      setEditData(data);
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

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
                    <Col className={styles.keyCol}>{t('Department_Name')}</Col>
                    <Col className={styles.valueCol}>{editData?.title}</Col>
                  </Row>
                  <Row className={styles.detailRow}>
                    <Col className={styles.keyCol}>{t('Department_Manger')}</Col>
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

export default Overview;
