import { SettingOutlined } from '@ant-design/icons';
import DataTable from './components/DataTable';
import styles from './EmailConfiguation.module.scss';
import { useTranslation } from 'react-i18next';
import { useBreadcrumb } from '../../../components/breadcrum/Breadcrum';
import { useRef, useEffect } from 'react';
import Panel from './components/Panel';

const draftEmail = [
  {
    title: 'Test email',
    description: 'N/A',
    updatedDate: '2012/12/12 12:12:12',
    status: 'Active',
    modifiedBy: 'Sen'
  }
];
function EmailConfiguration() {
  const { t } = useTranslation();
  const { setBreadcrumb } = useBreadcrumb();
  const panelRef = useRef();

  useEffect(() => {
    setBreadcrumb([
      { icon: <SettingOutlined />, text: `${t('configuration')}` },
      { text: `${t('Configuration_File')}` }
    ]);
  }, [t]);

  const openPanel = (data?: A) => {
    (panelRef.current as A).openDrawer(data);
  };

  return (
    <div className={styles.emailConfiguration}>
      <DataTable data={draftEmail} openPanel={openPanel} />
      <Panel refreshList={() => console.log('refresh')} ref={panelRef} />
    </div>
  );
}

export default EmailConfiguration;
