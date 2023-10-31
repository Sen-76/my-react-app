import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { BulbOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataTable from './components/DataTable';
import styles from './Role.module.scss';
import Panel from './components/Panel';
import { service } from '@/services/apis';

function RoleManagement() {
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
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [roleList, setRoleList] = useState<Role.IRoleCreateModel[]>([]);
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);
  const panelRef = useRef();

  useEffect(() => {
    setBreadcrumb([{ icon: <BulbOutlined />, text: t('management') }, { text: t('Manage_Role') }]);
  }, [t]);

  useEffect(() => {
    getRoleList();
  }, []);

  const openPanel = (data?: A) => {
    (panelRef.current as A).openDrawer(data);
  };

  const getRoleList = async (draftParam?: Common.IDataGrid) => {
    try {
      setLoading(true);
      const result = await service.rolesService.get(draftParam ?? param);
      setParam({
        ...param,
        pageInfor: {
          pageSize: result.prameter.pageSize,
          pageNumber: result.prameter.pageNumber,
          totalItems: result.prameter.totalItems
        }
      });
      setRoleList(result.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
    const timeout = setTimeout(() => {
      setLoading(false);
      clearTimeout(timeout);
    }, 2000);
  };

  const onSearch = (value: string) => {
    const draftGrid = { ...param };
    if (draftGrid.searchInfor) {
      draftGrid.searchInfor.searchValue = value;
    }
    draftGrid.pageInfor!.pageNumber = 1;
    setParam(draftGrid);
    getRoleList(draftGrid);
  };

  const setPage = (val: number) => {
    const draftGrid = { ...param };
    if (draftGrid.pageInfor) {
      draftGrid.pageInfor.pageNumber = val;
    }
    setParam(draftGrid);
    getRoleList(draftGrid);
  };

  return (
    <div className={styles.rolemanagement}>
      <DataTable
        param={param}
        onSearch={onSearch}
        setPage={setPage}
        data={roleList}
        openPanel={openPanel}
        loading={loading}
        refreshList={getRoleList}
      />
      <Panel ref={panelRef} refreshList={getRoleList} />
    </div>
  );
}

export default RoleManagement;
