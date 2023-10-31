import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { TeamOutlined } from '@ant-design/icons';

//component
import Members from './components/members/Members';
import Projects from './components/Projects/Project';
import styles from './TeamDetail.module.scss';
import Overview from './components/overview/Overview';

function Team() {
  const { t } = useTranslation();
  const { setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb([{ icon: <TeamOutlined />, text: `${t('team')}` }]);
  }, [t]);

  const tabItems = [
    {
      key: 'overview',
      label: t('Common_Overview'),
      children: <Overview />
    },
    {
      key: 'members',
      label: t('members'),
      children: <Members />
    },
    {
      key: 'projects',
      label: t('projects'),
      children: <Projects />
    }
  ];

  return (
    <div className={styles.viewdetail}>
      <Tabs items={tabItems} size="large" />
    </div>
  );
}

export default Team;
