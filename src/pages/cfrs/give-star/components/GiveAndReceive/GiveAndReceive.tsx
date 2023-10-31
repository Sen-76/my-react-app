import { Tabs } from 'antd';
import Receive from './components/Receive';
import { useTranslation } from 'react-i18next';
import Give from './components/Give';
import styles from '../../GiveStar.module.scss';
function GiveAndReceive() {
  const { t } = useTranslation();
  const tabItems = [
    {
      key: 'give',
      label: t('Give'),
      children: <Give />
    },
    {
      key: 'reveive',
      label: t('Reveive'),
      children: <Receive />
    }
  ];
  return (
    <div className={styles.projectdetail}>
      <Tabs items={tabItems} size="large" />
    </div>
  );
}
export default GiveAndReceive;
