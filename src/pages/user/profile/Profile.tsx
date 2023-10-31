import { useBreadcrumb } from '../../../components/breadcrum/Breadcrum';
import { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import styles from './Profile.module.scss';
import { Col, Row, Select } from 'antd';
import { useTranslation } from 'react-i18next';

//components
import Information from './components/Information';
import EditProfile from './components/EditInformation';
import Task from './components/Task';
import RecentlyActivities from './components/RecentlyActivities';
import PieChart from '@/components/chart/pie-chart/PieChart';
import { useLoginManager } from '@/common/helpers/login-manager';
import { useLoading } from '@/common/context/useLoading';
import { service } from '@/services/apis';
import { cookie } from '@/common/helpers/cookie/cookie';

function Profile() {
  const { setBreadcrumb } = useBreadcrumb();
  const [isInfoEdit, setIsInfoEdit] = useState<boolean>(false);
  const [taskList, setTaskList] = useState<A[]>([]);
  const { t } = useTranslation();
  const { getLoginUser } = useLoginManager();
  const initDataGrid: Common.IDataGrid = {
    pageInfor: {
      pageSize: 10,
      pageNumber: 1,
      totalItems: 0
    },
    searchInfor: {
      searchValue: '',
      searchColumn: ['summary']
    },
    filter: [
      {
        key: 'assignee',
        value: [getLoginUser().user.id]
      }
    ]
  };
  const [taskParam, setTaskParam] = useState<Common.IDataGrid>(initDataGrid);
  const { showLoading, closeLoading } = useLoading();
  const [user, setUser] = useState<A>(true);

  const pieChartData = [
    { name: 'Resolved', value: 5 },
    { name: 'Open', value: 20 },
    { name: 'Inprogress', value: 15 },
    { name: 'Finished', value: 1 }
  ];
  useEffect(() => {
    const fetchApi = async () => {
      await getUserInformation();
      await getTaskList();
    };
    fetchApi();
  }, []);

  useEffect(() => {
    setBreadcrumb([{ icon: <UserOutlined />, text: t('Profile') }]);
  }, [t]);

  const getTaskList = async (drafParam?: Common.IDataGrid) => {
    try {
      showLoading();
      const result = await service.taskService.get(drafParam ?? taskParam);
      setTaskList(result.data);
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const getUserInformation = async () => {
    try {
      showLoading();
      const result = await service.accountService.getDetal(getLoginUser().user.id);
      localStorage.setItem('avatar', result.data.photoUrl);
      cookie.setCookie(
        'userLogin',
        JSON.stringify({ ...getLoginUser(), user: { ...getLoginUser().user, fullName: result.data.fullName } }),
        1
      );
      setUser(result.data);
    } catch (e: A) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const edit = () => {
    setIsInfoEdit(true);
  };
  const cancelEditz = () => {
    setIsInfoEdit(false);
  };

  return (
    <>
      <Row className={styles.profile}>
        <Col className={styles.information}>
          {!isInfoEdit && <Information userLoged={user} edit={edit} />}
          {isInfoEdit && <EditProfile userLoged={user} cancelEdit={cancelEditz} refreshData={getUserInformation} />}
        </Col>
        <Col className={styles.task}>
          <RecentlyActivities />
        </Col>
        <Col className={styles.task}>
          <Task task={taskList} />
        </Col>
        <Col className={styles.information}>
          <Row className={styles.header}>
            <span>{t('statistical')}</span>
            <Select
              style={{ width: 100 }}
              defaultValue={'Month'}
              options={[
                {
                  value: 'Month',
                  label: 'Month'
                },
                {
                  value: 'Week',
                  label: 'Week'
                },
                {
                  value: 'Day',
                  label: 'Day'
                }
              ]}
            ></Select>
          </Row>
          <div className={styles.body}>
            <PieChart data={pieChartData} />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Profile;
