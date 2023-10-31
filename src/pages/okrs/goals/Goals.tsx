import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { BulbOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Goals.module.scss';
import GoalList from './components/GoalList';

function Okrs() {
  const { setBreadcrumb } = useBreadcrumb();
  const { t } = useTranslation();

  useEffect(() => {
    setBreadcrumb([{ icon: <BulbOutlined />, text: `OKRs` }, { text: `${t('goals')}` }]);
  }, [t]);

  const tabItems = [
    {
      label: t('Okrs_Goals_MyGoals'),
      key: '1'
    },
    {
      label: t('Okrs_Goals_CreatedByMe'),
      key: '2'
    },
    {
      label: t('Manage_Account_Department'),
      key: '3'
    }
  ];

  const onTabChanged = (e: A) => {
    console.log('tabChanged');
  };

  return (
    <div className={styles.goals}>
      <Tabs items={tabItems} size="large" onChange={onTabChanged} />
      <GoalList />
    </div>
  );
}

export default Okrs;
