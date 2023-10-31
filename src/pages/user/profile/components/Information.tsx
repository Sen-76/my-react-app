import { Avatar, Col, Image, Row, Tooltip } from 'antd';
import styles from '../Profile.module.scss';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  CalendarOutlined,
  CoffeeOutlined,
  ContactsOutlined,
  EditOutlined,
  MailOutlined,
  ManOutlined,
  PhoneOutlined,
  TeamOutlined,
  WomanOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import Paragraph from 'antd/es/typography/Paragraph';
import { EGender } from '../Profile.model';
import { util } from '@/common/helpers/util';

interface IProps {
  userLoged: A;
  edit: () => void;
}
function Information(props: IProps) {
  const { userLoged, edit } = props;
  const { t } = useTranslation();

  return (
    <>
      <Row className={styles.header}>
        <span>{t('information')}</span>
        <EditOutlined className={styles.editIcon} onClick={edit} />
      </Row>
      <div className={styles.body}>
        <div style={{ marginBottom: 10 }}>
          {userLoged.photoUrl ? (
            <Image className={styles.avatar} width={100} src={userLoged.photoUrl} />
          ) : (
            <Avatar size={100} style={{ backgroundColor: util.randomColor() }}>
              {userLoged.fullName?.charAt(0) ?? 'N/A'}
            </Avatar>
          )}
        </div>
        <span className={styles.userame}>{userLoged.fullName}</span>
        <div>
          <Row gutter={8} className={styles.row}>
            <Col className={styles.keyCol}>
              <MailOutlined /> {t('email')}
            </Col>
            <Col>
              <Tooltip placement="bottom" title={userLoged.userEmail ?? 'N/A'} color="#ffffff" arrow={true}>
                <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ maxWidth: 130, minWidth: 30 }}>
                  <Link to={`mailto:${userLoged.userEmail}`}>{userLoged.userEmail ?? 'N/A'}</Link>
                </Paragraph>
              </Tooltip>
            </Col>
          </Row>
          <Row gutter={8} className={styles.row}>
            <Col className={styles.keyCol}>
              <PhoneOutlined /> {t('phone')}
            </Col>
            <Col className={styles.valCol}>
              <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ maxWidth: 130, minWidth: 30 }}>
                {userLoged.userPhone ?? 'N/A'}
              </Paragraph>
            </Col>
          </Row>
          <Row gutter={8} className={styles.row}>
            <Col className={styles.keyCol}>
              <CalendarOutlined /> {t('date of birth')}
            </Col>
            <Col className={styles.valCol}>
              <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ maxWidth: 130, minWidth: 30 }}>
                {dayjs(userLoged.dob).format('DD MMM YYYY') ?? 'N/A'}
              </Paragraph>
            </Col>
          </Row>
          <Row gutter={8} className={styles.row}>
            <Col className={styles.keyCol}>
              {userLoged.gender === EGender.Male ? <ManOutlined /> : <WomanOutlined />} {t('gender')}
            </Col>
            <Col className={styles.valCol}>
              <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ maxWidth: 130, minWidth: 30 }}>
                {userLoged.gender === EGender.Male ? 'Male' : 'Female'}
              </Paragraph>
            </Col>
          </Row>
          <Row gutter={8} className={styles.row}>
            <Col className={styles.keyCol}>
              <ContactsOutlined /> {t('department')}
            </Col>
            <Col className={styles.valCol}>
              <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ maxWidth: 130, minWidth: 30 }}>
                {userLoged.department ?? 'N/A'}
              </Paragraph>
            </Col>
          </Row>
          <Row gutter={8} className={styles.row}>
            <Col className={styles.keyCol}>
              <TeamOutlined /> {t('team')}
            </Col>
            <Col className={styles.valCol}>
              <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ maxWidth: 130, minWidth: 30 }}>
                {userLoged.team ?? 'N/A'}
              </Paragraph>
            </Col>
          </Row>
          <Row gutter={8} className={styles.row}>
            <Col className={styles.keyCol}>
              <CoffeeOutlined /> {t('job')}
            </Col>
            <Col className={styles.valCol}>
              <Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ maxWidth: 130, minWidth: 30 }}>
                {userLoged.jobTitle ?? 'N/A'}
              </Paragraph>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

export default Information;
