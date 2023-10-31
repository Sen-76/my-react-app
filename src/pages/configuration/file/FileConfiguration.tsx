import { SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { useBreadcrumb } from '../../../components/breadcrum/Breadcrum';
import styles from './FileConfiguration.module.scss';
import { service } from '@/services/apis';

//component
import DataTable from './components/DataTable';
import Panel from './components/Panel';

function FileConfiguration() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<A>(false);
  const [fileSetting, setFileSetting] = useState<A>();
  const { setBreadcrumb } = useBreadcrumb();
  const panelRef = useRef();

  useEffect(() => {
    setBreadcrumb([
      { icon: <SettingOutlined />, text: `${t('configuration')}` },
      { text: `${t('Configuration_File')}` }
    ]);
  }, [t]);
  useEffect(() => {
    getFileList();
  }, []);

  const getFileList = async () => {
    try {
      setLoading(true);
      const result = await service.globalSettingsService.getByType(1);
      setFileList(result.detail);
      setFileSetting(result);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const openPanel = (data?: A) => {
    (panelRef.current as A).openDrawer(data);
  };

  return (
    <div className={styles.fileconfiguration}>
      <DataTable data={fileList} openPanel={openPanel} loading={loading} />
      <Panel refreshList={getFileList} ref={panelRef} all={fileSetting} />
    </div>
  );
}

export default FileConfiguration;
