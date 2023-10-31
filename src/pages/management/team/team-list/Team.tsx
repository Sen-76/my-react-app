/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { service } from '@/services/apis';
import { BulbOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataTable from './components/DataTable';
import Panel from './components/Panel';
import styles from './Team.module.scss';

function Team() {
  const { t } = useTranslation();
  const { setBreadcrumb } = useBreadcrumb();
  const panelRef = useRef();
  const [loading, setLoading] = useState<boolean>(false);
  const [teamList, setTeamList] = useState<Account.IAccountModel[]>([]);
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
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);

  useEffect(() => {
    getTeams();
  }, []);

  const openPanel = (data: A) => {
    (panelRef.current as A).openDrawer(data);
  };

  const onSearch = (value: string) => {
    const draftGrid = { ...param };
    if (draftGrid.searchInfor) {
      draftGrid.searchInfor.searchValue = value;
    }
    draftGrid.pageInfor!.pageNumber = 1;
    setParam(draftGrid);
    getTeams(draftGrid);
  };

  const setPage = (val: number) => {
    const draftGrid = { ...param };
    if (draftGrid.pageInfor) {
      draftGrid.pageInfor.pageNumber = val;
    }
    setParam(draftGrid);
    getTeams(draftGrid);
  };

  const getTeams = async (draftParam?: Common.IDataGrid) => {
    try {
      setLoading(true);
      const result = await service.teamService.get(draftParam ?? param);
      setParam({
        ...param,
        pageInfor: {
          pageSize: result.prameter.pageSize,
          pageNumber: result.prameter.pageNumber,
          totalItems: result.prameter.totalItems
        }
      });
      setTeamList(result.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setBreadcrumb([{ icon: <BulbOutlined />, text: `${t('management')}` }, { text: `${t('Manage_Team')}` }]);
  }, [t]);

  return (
    <div className={styles.team}>
      <DataTable
        data={teamList}
        openPanel={openPanel}
        refreshList={getTeams}
        loading={loading}
        param={param}
        onSearch={onSearch}
        setPage={setPage}
      />
      <Panel refreshList={getTeams} ref={panelRef} />
    </div>
  );
}

export default Team;
