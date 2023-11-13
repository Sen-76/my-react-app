/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useRef, useEffect, useState } from 'react';
import DataTable from './components/DataTable';
import DetailPanel from './components/DetailPanel';
import Panel from './components/Panel';
import { service } from '@/services/apis';

function Teams() {
  const panelRef = useRef();
  const detailPanelRef = useRef();
  const [loading, setLoading] = useState<boolean>(false);
  const [teamList, setTeamList] = useState<Account.IAccountModel[]>([]);
  const id = JSON.parse(sessionStorage.getItem('userDetail') ?? '{}')?.userDepartmentId;
  const initDataGrid: Common.IDataGrid = {
    pageInfor: {
      pageSize: 10,
      pageNumber: 1,
      totalItems: 0
    },
    searchInfor: {
      searchValue: '',
      searchColumn: ['Title']
    },
    filter: [
      // { key: 'Status', value: [EState.Activate] },
      { key: 'DepartmentId', value: [id] }
    ]
  };
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);

  useEffect(() => {
    getTeams();
  }, []);

  const openPanel = (data: A) => {
    (panelRef.current as A).openDrawer(data);
  };

  const openDetailPanel = (data: A) => {
    (detailPanelRef.current as A).openDrawer(data);
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
      if (id) {
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
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DataTable
        data={teamList}
        openPanel={openPanel}
        openDetailPanel={openDetailPanel}
        refreshList={getTeams}
        loading={loading}
        param={param}
        onSearch={onSearch}
        setPage={setPage}
      />
      <DetailPanel refreshList={getTeams} openPanel={openPanel} ref={detailPanelRef} />
      <Panel refreshList={getTeams} ref={panelRef} />
    </>
  );
}

export default Teams;
