import { Avatar, Col, Collapse, Row, Typography } from 'antd';
import styles from '../TaskDetail.module.scss';
import { useTranslation } from 'react-i18next';
import { util } from '@/common/helpers/util';
import dayjs from 'dayjs';

interface IProps {
  data: A;
}
function TaskInformation(props: IProps) {
  const { data } = props;
  const { t } = useTranslation();

  const onRenderDetail = () => {
    return (
      <Row style={{ display: 'flex', gap: 10 }}>
        <Col style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_Key')}</Col>
            <Col className={styles.valueCol}>{data?.key}</Col>
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_Milestone')}</Col>
            <Col className={styles.valueCol}>{data?.milestone?.title}</Col>
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_Type')}</Col>
            <Col className={styles.valueCol}>{data?.taskType2?.title}</Col>
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_Status')}</Col>
            <Col className={styles.valueCol}>{data?.status?.title}</Col>
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_Prioty')}</Col>
            <Col className={styles.valueCol}>{data?.taskPrioty?.pname}</Col>
          </Row>
        </Col>
      </Row>
    );
  };
  const onRenderDescription = () => {
    return <div dangerouslySetInnerHTML={{ __html: data?.description }} />;
  };
  const onRenderAttachment = () => {
    return <Typography>This feature is comming soon</Typography>;
  };
  const onRenderIssueLink = () => {
    return <Typography>This feature is comming soon</Typography>;
  };
  const onRenderPeople = () => {
    return (
      <Row style={{ display: 'flex', gap: 10 }}>
        <Col style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_Assignee')}</Col>
            <Col className={styles.valueCol}>
              <Typography.Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ cursor: 'pointer' }}>
                <Avatar
                  size={30}
                  src={data?.assignee2?.avatarUrl?.url}
                  style={{ marginRight: '7px', backgroundColor: util.randomColor() }}
                >
                  {data?.assignee2?.fullName?.charAt(0)}
                </Avatar>
                {data?.assignee2?.fullName}
              </Typography.Paragraph>
            </Col>
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_Reporter')}</Col>
            <Col className={styles.valueCol}>
              <Typography.Paragraph ellipsis={{ rows: 1, expandable: false }} style={{ cursor: 'pointer' }}>
                <Avatar
                  size={30}
                  src={data?.reportToRelation?.avatarUrl?.url}
                  style={{ marginRight: '16px', backgroundColor: util.randomColor() }}
                >
                  {data?.reportToRelation?.fullName?.charAt(0)}
                </Avatar>
                {data?.reportToRelation?.fullName}
              </Typography.Paragraph>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };
  const onRenderDates = () => {
    return (
      <Row style={{ display: 'flex', gap: 10 }}>
        <Col style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_CreatedDate')}</Col>
            <Col className={styles.valueCol}>{dayjs(data?.createdDate).format('DD MMM YYYY')}</Col>
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_UpdatedDate')}</Col>
            <Col className={styles.valueCol}>{dayjs(data?.updateDate).format('DD MMM YYYY')}</Col>
          </Row>
          <Row className={styles.detailRow}>
            <Col className={styles.keyCol}>{t('Task_DueDate')}</Col>
            <Col className={styles.valueCol}>{dayjs(data?.dueDate).format('DD MMM YYYY')}</Col>
          </Row>
          {data?.resolvedDate && (
            <Row className={styles.detailRow}>
              <Col className={styles.keyCol}>{t('Task_ResolvedDate')}</Col>
              <Col className={styles.valueCol}>{dayjs(data?.resoleDate).format('DD MMM YYYY')}</Col>
            </Row>
          )}
          {data?.closeDate && (
            <Row className={styles.detailRow}>
              <Col className={styles.keyCol}>{t('Task_ResolvedDate')}</Col>
              <Col className={styles.valueCol}>{dayjs(data?.closeDate).format('DD MMM YYYY')}</Col>
            </Row>
          )}
        </Col>
      </Row>
    );
  };
  const leftInfo = [
    { key: 'Details', label: t('Common_Details'), children: onRenderDetail() },
    { key: 'Descriptions', label: t('Common_Descriptions'), children: onRenderDescription() },
    { key: 'Attachments', label: t('Task_Attachements'), children: onRenderAttachment() },
    { key: 'LinkIssues', label: t('Task_Link_Issues'), children: onRenderIssueLink() }
  ];
  const rightInfo = [
    { key: 'People', label: t('Task_People'), children: onRenderPeople() },
    { key: 'Dates', label: t('Task_Dates'), children: onRenderDates() }
  ];
  return (
    <div className={styles.information}>
      <Collapse
        style={{ minWidth: 700, width: '69%' }}
        items={leftInfo}
        bordered={false}
        defaultActiveKey={['Details', 'Descriptions', 'Attachments', 'LinkIssues']}
        ghost
        size="large"
        expandIconPosition="end"
      />
      <Collapse
        style={{ minWidth: 300, width: '30%' }}
        items={rightInfo}
        bordered={false}
        defaultActiveKey={['People', 'Dates']}
        ghost
        size="large"
        expandIconPosition="end"
      />
    </div>
  );
}

export default TaskInformation;
