import {
  CalendarOutlined,
  CloseOutlined,
  CoffeeOutlined,
  ContactsOutlined,
  KeyOutlined,
  MailOutlined,
  ManOutlined,
  PhoneOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  WomanOutlined
} from '@ant-design/icons';
import { Button, Col, Drawer, Form, Row } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../AccountManagement.module.scss';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
import { EGender } from '../AccountManagement.Model';

interface IProps {
  refreshList: () => void;
  openPanel: (data?: A) => void;
}
function DetailPanel(props: IProps, ref: A) {
  const [open, setOpen] = useState<boolean>(false);
  const [user, setUser] = useState<A>(false);
  const { t } = useTranslation();
  const { showLoading, closeLoading } = useLoading();

  useImperativeHandle(ref, () => ({
    openDrawer
  }));

  const getUserInformation = async (id: string) => {
    try {
      showLoading();
      const result = await service.accountService.getDetal(id);
      setUser(result.data);
    } catch (e: A) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const openDrawer = (data?: A) => {
    setOpen(true);
    getUserInformation(data.id);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <>
      <Drawer
        title={t('User_Detail_Panel_Title')}
        placement="right"
        open={open}
        extra={<CloseOutlined onClick={closeDrawer} />}
        onClose={closeDrawer}
        maskClosable={false}
        closable={false}
        width={520}
        destroyOnClose={true}
        className={styles.detailPanel}
      >
        <Form>
          <div className={styles.title}>General Information</div>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>
              <UserOutlined /> {t('fullName')}
            </Col>
            <Col className={styles.valueCol}>{user.fullName}</Col>
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>
              <MailOutlined /> {t('email')}
            </Col>
            <Col className={styles.valueCol}>
              <Link to={`mailto:${user.email}`}>{user.userEmail}</Link>
            </Col>
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>
              <PhoneOutlined /> {t('phone')}
            </Col>
            <Col className={styles.valueCol}>{user.userPhone}</Col>
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>
              <CalendarOutlined /> {t('date of birth')}
            </Col>
            <Col className={styles.valueCol}>{dayjs(user.dob).format('DD MMM YYYY')}</Col>
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>
              {user.gender === EGender.Male ? <ManOutlined /> : <WomanOutlined />} {t('gender')}
            </Col>
            <Col className={styles.valueCol}>{user.gender === EGender.Male ? 'Male' : 'Female'}</Col>
          </Row>
          <div className={styles.title}>System Information</div>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>
              <UserOutlined /> {t('username')}
            </Col>
            <Col className={styles.valueCol}>{user.userName}</Col>
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>
              <CoffeeOutlined /> {t('job')}
            </Col>
            <Col className={styles.valueCol}>{user.jobTitle ?? 'N/A'}</Col>
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>
              <ContactsOutlined /> {t('department')}
            </Col>
            <Col className={styles.valueCol}>{user.userDepartment ?? 'N/A'}</Col>
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>
              <UsergroupAddOutlined /> {t('team')}
            </Col>
            <Col className={styles.valueCol}>{user.team ?? 'N/A'}</Col>
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>
              <KeyOutlined /> {t('role')}
            </Col>
            <Col className={styles.valueCol}>{user.userRole ?? 'N/A'}</Col>
          </Row>
          <div className="actionBtnBottom">
            <Button onClick={closeDrawer}>{t('Common_Cancel')}</Button>
            <Button
              type="primary"
              onClick={() => {
                props.openPanel(user);
                setOpen(false);
              }}
            >
              Update
            </Button>
          </div>
        </Form>
      </Drawer>
    </>
  );
}

export default forwardRef(DetailPanel);
