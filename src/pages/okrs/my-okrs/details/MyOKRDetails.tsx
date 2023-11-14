import { OKRStatus } from '@/common/enum/okr.enum';
import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { IKeyResult, IOKRModel } from '@/services/models/OKR';
import { BulbOutlined } from '@ant-design/icons';
import { Col, Flex, Progress, Row, Tabs, TabsProps, Typography } from 'antd';
import Table, { ColumnType } from 'antd/es/table';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOKRDetailData } from '../../shared/hooks/use-okr-detail-data';
import { OkrStatusColors, getOkrProgress } from '../../shared/okrs.util';
import styles from './MyOKRDetail.module.scss';

export default function MyOKRDetails() {
  const { setBreadcrumb } = useBreadcrumb();
  const { t } = useTranslation();

  const { okrDetail } = useOKRDetailData();

  useEffect(() => {
    setBreadcrumb([{ icon: <BulbOutlined />, text: `OKRs` }, { text: 'My OKRs' }, { text: okrDetail?.title }]);
  }, [t]);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Overview',
      children: <OverviewTab okrDetail={okrDetail} />
    },
    {
      key: '2',
      label: 'Self Review',
      children: 'Self Review'
    }
  ];

  return (
    <div className={styles.myOKRDetail}>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}

const OverviewTab = ({ okrDetail }: { okrDetail: IOKRModel }) => {
  const columns: ColumnType<IKeyResult>[] = [
    {
      title: 'Key Results',
      dataIndex: 'title',
      width: '50%',
      render: (_) => <Typography.Text ellipsis={{ tooltip: _ }}>{_}</Typography.Text>
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      render: (_) => <Progress percent={_} />
    },
    {
      title: 'Link Plan',
      dataIndex: 'planLink',
      render: (_) =>
        _ && (
          <a href={_} target="_blank" rel="noreferrer">
            Link
          </a>
        )
    }
  ];

  return (
    <>
      <Flex justify="space-evenly" style={{ margin: '2rem 0' }}>
        <div>
          <Progress percent={getOkrProgress(okrDetail?.keyResults ?? [])} />
          <Typography.Text>Overall Progress</Typography.Text>
        </div>

        <Row style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          <Col span={12}>Employee:</Col>
          <Col span={12}>{okrDetail?.user?.fullName}</Col>

          <Col span={12}>Objective:</Col>
          <Col span={12}> {okrDetail?.title}</Col>

          <Col span={12}>Status:</Col>
          <Col span={12} style={{ color: OkrStatusColors[okrDetail?.status ?? OKRStatus.NOT_STARTED] }}>
            {okrDetail?.status}
          </Col>
        </Row>
      </Flex>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={okrDetail?.keyResults}
        pagination={{
          total: okrDetail?.keyResults?.length,
          defaultPageSize: 10
        }}
      />
    </>
  );
};
