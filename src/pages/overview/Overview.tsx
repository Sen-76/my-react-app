import {
  AlignLeftOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  CarryOutOutlined,
  FlagOutlined,
  SmileOutlined
} from '@ant-design/icons';
import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { useEffect } from 'react';
import { Calendar, Checkbox, Col, List, Progress, Row, Timeline } from 'antd';
import styles from './Overview.module.scss';
import { Link } from 'react-router-dom';
import PieChart from '@/components/chart/pie-chart/PieChart';
import BarChart from '@/components/chart/bar-chart/BarChart';
import useGetData from './useGetData';
import { useTranslation } from 'react-i18next';
import PermissionBlock from '@/common/helpers/permission/PermissionBlock';

const Overview = () => {
  const monthNamesAbbreviated = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = [
    {
      title: 'Task Title 1',
      assignDate: '2020-01-01'
    },
    {
      title: 'Task Title 2',
      assignDate: '2020-01-01'
    },
    {
      title: 'Task Title 3',
      assignDate: '2020-01-01'
    },
    {
      title: 'Task Title 4',
      assignDate: '2020-01-01'
    }
  ];
  const { pieChartData, barChartData } = useGetData();
  const { setBreadcrumb } = useBreadcrumb();
  const { t } = useTranslation();
  useEffect(() => {
    setBreadcrumb([{ path: '/', icon: <AppstoreOutlined />, text: 'Overview' }]);
  }, []);
  return (
    <div className={styles.overview}>
      <PermissionBlock module={'0ab7907a-afc1-4311-98e1-2ca3307e7f07'}>{/* <div>CC gi day</div> */}</PermissionBlock>
      <Row className={styles.wrapProcessManage}>
        <Col className={styles.processManage}>
          <Row className={styles.processInfo}>
            <div>
              <FlagOutlined /> To do
            </div>
            <div>11/14</div>
          </Row>
          <Progress percent={30} />
        </Col>
        <Col className={styles.processManage}>
          <Row className={styles.processInfo}>
            <div>
              <FlagOutlined /> To do
            </div>
            <div>11/14</div>
          </Row>
          <Progress percent={30} />
        </Col>
        <Col className={styles.processManage}>
          <Row className={styles.processInfo}>
            <div>
              <FlagOutlined /> To do
            </div>
            <div>11/14</div>
          </Row>
          <Progress percent={30} />
        </Col>
        <Col className={styles.processManage}>
          <Row className={styles.processInfo}>
            <div>
              <FlagOutlined /> To do
            </div>
            <div>11/14</div>
          </Row>
          <Progress percent={30} />
        </Col>
      </Row>
      <Row className={styles.contentOverview}>
        <Col className={styles.left}>
          <div className={styles.draft}>
            <div className={styles.header}>Bar chart</div>
            <div className={styles.chartWrap}>
              <BarChart xAxisData={barChartData.values} xAxisLabel={barChartData.labels} />
            </div>
          </div>
          <div className={styles.draftWrap}>
            <div className={styles.draftHalf}>
              <div className={styles.header}>Pie chart</div>
              <div className={styles.chartWrap}>
                <PieChart data={pieChartData} />
              </div>
            </div>
            <div className={styles.draftHalf}>
              <div className={styles.header}>Pie chart</div>
              <div className={styles.chartWrap}>
                <PieChart data={pieChartData} />
              </div>
            </div>
          </div>
          <div className={styles.draft}></div>
        </Col>
        <Col className={styles.right}>
          <Calendar
            className={styles.callendar}
            fullscreen={false}
            headerRender={({ value }) => (
              <div className={styles.header}>
                <div>
                  <CalendarOutlined /> {monthNamesAbbreviated[value.month()]} - {value.year()}
                </div>
                <Link to={'./'}>View schedule</Link>
              </div>
            )}
          />
          <List
            size="large"
            className={styles.todoList}
            header={
              <div className={styles.header}>
                <div>
                  <CarryOutOutlined /> Todo List
                </div>
                <Link to={'./'}>{t('Common_ViewAll')}</Link>
              </div>
            }
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <div>
                  <Checkbox>{item.title}</Checkbox>
                </div>
                <div>{item.assignDate}</div>
              </List.Item>
            )}
          />
          <div className={styles.timeLine}>
            <div className={styles.header}>
              <div>
                <AlignLeftOutlined /> Recently Activity
              </div>
              <Link to={'./'}>{t('Common_ViewAll')}</Link>
            </div>
            <Timeline
              className={styles.timeContent}
              items={[
                {
                  color: 'green',
                  children: 'Create a services site 2015-09-01'
                },
                {
                  color: 'green',
                  children: 'Create a services site 2015-09-01'
                },
                {
                  color: 'red',
                  children: (
                    <>
                      <p>Solve initial network problems 1</p>
                      <p>Solve initial network problems 2</p>
                      <p>Solve initial network problems 3 2015-09-01</p>
                    </>
                  )
                },
                {
                  children: (
                    <>
                      <p>Technical testing 1</p>
                      <p>Technical testing 2</p>
                      <p>Technical testing 3 2015-09-01</p>
                    </>
                  )
                },
                {
                  color: 'gray',
                  children: (
                    <>
                      <p>Technical testing 1</p>
                      <p>Technical testing 2</p>
                      <p>Technical testing 3 2015-09-01</p>
                    </>
                  )
                },
                {
                  color: 'gray',
                  children: (
                    <>
                      <p>Technical testing 1</p>
                      <p>Technical testing 2</p>
                      <p>Technical testing 3 2015-09-01</p>
                    </>
                  )
                },
                {
                  color: '#00CCFF',
                  dot: <SmileOutlined />,
                  children: <p>Custom color testing</p>
                }
              ]}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Overview;
