/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import styles from './TaskTypeConfiguration.module.scss';
import DataList from './components/DataList';
import Panel from './components/Panel';
import { service } from '@/services/apis';

function TaskType() {
  const initDataGrid: Common.IDataGrid = {
    pageInfor: {
      pageSize: 100,
      pageNumber: 1,
      totalItems: 0
    },
    searchInfor: {
      searchValue: '',
      searchColumn: ['title']
    }
  };
  const { t } = useTranslation();
  const { setBreadcrumb } = useBreadcrumb();
  const [loading, setLoading] = useState<boolean>(false);
  const [taskTypeList, setTaskTypeList] = useState<TaskType.ITaskTypeModel[]>([]);
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);
  const panelRef = useRef();

  useEffect(() => {
    setBreadcrumb([
      { icon: <SettingOutlined />, text: `${t('configuration')}` },
      { text: `${t('Configuration_Task_Type')}` }
    ]);
  }, [t]);

  useEffect(() => {
    getFileList();
  }, []);

  const getFileList = async (draftParam?: Common.IDataGrid) => {
    try {
      setLoading(true);
      const result = await service.taskTypeService.get(draftParam ?? param);
      setTaskTypeList(result.data ?? []);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const openPanel = (data?: A) => {
    (panelRef.current as A).openDrawer(data);
  };

  const onSearch = (value: string) => {
    const draftGrid = { ...param };
    if (draftGrid.searchInfor) {
      draftGrid.searchInfor.searchValue = value;
    }
    draftGrid.pageInfor!.pageNumber = 1;
    setParam(draftGrid);
    getFileList(draftGrid);
  };

  return (
    <div className={styles.taskType}>
      <DataList
        data={taskTypeList}
        openPanel={openPanel}
        listLoading={loading}
        refreshList={getFileList}
        onSearch={onSearch}
      />
      <Panel ref={panelRef} refreshList={getFileList} />
    </div>
  );
}

export default TaskType;
