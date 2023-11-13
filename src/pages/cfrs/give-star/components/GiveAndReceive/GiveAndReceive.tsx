import { DatePicker, Space, Tabs } from 'antd';
import Receive from './components/Receive';
import { useTranslation } from 'react-i18next';
import Give from './components/Give';
import styles from '../../GiveStar.module.scss';
import dayjs from 'dayjs';
import { forwardRef, useImperativeHandle, useRef } from 'react';
function GiveAndReceive(props: A, ref: A) {
  const { t } = useTranslation();
  const postRef = useRef();
  const tabItems = [
    {
      key: 'give',
      label: t('CFRS_Give'),
      children: <Give ref={postRef} />
    },
    {
      key: 'receive',
      label: t('CFRS_Receive'),
      children: <Receive />
    }
  ];

  useImperativeHandle(ref, () => ({
    addPost
  }));

  const onrenderTabExtra = () => (
    <Space direction="horizontal" className={styles.spacePicker}>
      <DatePicker.MonthPicker defaultValue={dayjs()} />
    </Space>
  );

  const addPost = () => {
    (postRef.current as A).addPost();
  };

  return (
    <div className={styles.projectdetail}>
      <Tabs items={tabItems} size="large" tabBarExtraContent={onrenderTabExtra()} />
    </div>
  );
}
export default forwardRef(GiveAndReceive);
