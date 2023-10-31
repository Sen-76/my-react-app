import { useEffect, useRef, useState } from 'react';
import { BulbOutlined } from '@ant-design/icons';
import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import styles from './Project.module.scss';

import Panel from './components/Panel';
import DataTable from './components/DataTable';
import { useTranslation } from 'react-i18next';
import { service } from '@/services/apis';

function Project() {
  const initDataGrid: Common.IDataGrid = {
    pageInfor: {
      pageSize: 10,
      pageNumber: 1,
      totalItems: 0
    },
    searchInfor: {
      searchValue: '',
      searchColumn: ['Title']
    }
  };
  const { setBreadcrumb } = useBreadcrumb();
  const [loading, setLoading] = useState<boolean>(false);
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);
  const [departmentList, setDeparmentList] = useState<A[]>([]);
  const panelRef = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    setBreadcrumb([{ icon: <BulbOutlined />, text: `${t('management')}` }, { text: `${t('Manage_Project')}` }]);
  }, [t]);

  useEffect(() => {
    getDepartmentsList();
  }, []);

  const getDepartmentsList = async (draftParam?: Common.IDataGrid) => {
    try {
      setLoading(true);
      const result = await service.departmentService.get(draftParam ?? param);
      setParam({
        ...param,
        pageInfor: {
          pageSize: result.prameter.pageSize,
          pageNumber: result.prameter.pageNumber,
          totalItems: result.prameter.totalItems
        }
      });
      setDeparmentList(result.data);
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
    getDepartmentsList(draftGrid);
  };

  const setPage = (val: number) => {
    const draftGrid = { ...param };
    if (draftGrid.pageInfor) {
      draftGrid.pageInfor.pageNumber = val;
    }
    setParam(draftGrid);
    getDepartmentsList(draftGrid);
  };

  return (
    <div className={styles.department}>
      <DataTable
        data={departmentList}
        openPanel={openPanel}
        loading={loading}
        param={param}
        onSearch={onSearch}
        setPage={setPage}
        refreshList={getDepartmentsList}
      />
      <Panel refreshList={getDepartmentsList} ref={panelRef} />
    </div>
  );
}

export default Project;
