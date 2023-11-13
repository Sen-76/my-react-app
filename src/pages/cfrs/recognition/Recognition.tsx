import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { StarOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Recognition.module.scss';
import { DatePicker, Space, Tabs } from 'antd';
import Post from './components/Post';
import LeaderBoard from './components/LeaderBoard';
import dayjs from 'dayjs';

function Recognition() {
  const { setBreadcrumb } = useBreadcrumb();
  const { t } = useTranslation();
  useEffect(() => {
    setBreadcrumb([{ icon: <StarOutlined />, text: `CFRs` }, { text: `${t('recognition')}` }]);
  }, [t]);
  const tabItems = [
    {
      key: 'posts',
      label: t('CFRS_Posts_Entry'),
      children: <Post />
    },
    {
      key: 'leaderBoard',
      label: t('CFRS_LeaderBoard_Entry'),
      children: <LeaderBoard />
    }
  ];

  const onrenderTabExtra = () => (
    <Space direction="horizontal" className={styles.spacePicker}>
      <DatePicker.MonthPicker defaultValue={dayjs()} />
    </Space>
  );
  return (
    <div className={styles.recognitions}>
      <div className={styles.giveAndReceive}>
        <Tabs items={tabItems} size="large" className={styles.tabs} tabBarExtraContent={onrenderTabExtra()} />
      </div>
    </div>
  );
}
export default Recognition;
