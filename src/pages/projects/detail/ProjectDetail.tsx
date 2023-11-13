import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { BookOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import styles from './ProjectDetail.module.scss';
import Milestone from './components/MIlestone';
import GeneralInfo from './components/GeneralInfo';
import Task from './components/Task';

function ProjectDetail() {
  const { setBreadcrumb } = useBreadcrumb();
  const { t } = useTranslation();
  const data = useParams();

  useEffect(() => {
    setBreadcrumb([{ icon: <BookOutlined />, text: t('projects'), path: '/projects' }, { text: data.name }]);
  }, [t]);

  const tabItems = [
    {
      key: 'generalInfo',
      label: t('General_Information'),
      children: <GeneralInfo />
    },
    {
      key: 'milestone',
      label: t('Project_Milestone'),
      children: <Milestone />
    },
    {
      key: 'task',
      label: t('Project_Task'),
      children: <Task />
    }
  ];

  return (
    <div className={styles.projectdetail}>
      <Tabs items={tabItems} size="large" />
    </div>
  );
}

export default ProjectDetail;
