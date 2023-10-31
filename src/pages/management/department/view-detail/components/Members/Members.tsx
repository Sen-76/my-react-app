/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useRef, useState, useEffect } from 'react';
import DataTable from './components/DataTable';
import DetailPanel from './components/DetailPanel';
import Panel from './components/Panel';
import { service } from '@/services/apis';
import { EState } from '@/pages/management/account/AccountManagement.Model';
import { useParams } from 'react-router';

function Members() {
  const data = useParams();
  const initDataGrid: Common.IDataGrid = {
    pageInfor: {
      pageSize: 10,
      pageNumber: 1,
      totalItems: 0
    },
    searchInfor: {
      searchValue: '',
      searchColumn: ['FullName']
    },
    filter: [{ key: 'Status', value: [EState.Activate] }]
  };
  const detailPanelRef = useRef();
  const panelRef = useRef();
  const [loading, setLoading] = useState<boolean>(false);
  const [memberList, setMemberList] = useState<Account.IAccountModel[]>([]);
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);

  useEffect(() => {
    getMembers();
  }, []);

  const openDetailPanel = (data: A) => {
    (detailPanelRef.current as A).openDrawer(data);
  };

  const openPanel = () => {
    (panelRef.current as A).openDrawer();
  };

  const getMembers = async (draftParam?: Common.IDataGrid) => {
    try {
      setLoading(true);
      const result = await service.departmentService.getMembersDetail(data.id, draftParam ?? param);
      // const result = await service.departmentService.getMembers(data.id ?? '');
      setParam({
        ...param,
        pageInfor: {
          pageSize: result.prameter.pageSize,
          pageNumber: result.prameter.pageNumber,
          totalItems: result.prameter.totalItems
        }
      });
      setMemberList(result.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const onSearch = (value: string) => {
    const draftGrid = { ...param };
    if (draftGrid.searchInfor) {
      draftGrid.searchInfor.searchValue = value;
    }
    draftGrid.pageInfor!.pageNumber = 1;
    setParam(draftGrid);
    getMembers(draftGrid);
  };

  const setPage = (val: number) => {
    const draftGrid = { ...param };
    if (draftGrid.pageInfor) {
      draftGrid.pageInfor.pageNumber = val;
    }
    setParam(draftGrid);
    getMembers(draftGrid);
  };

  return (
    <>
      <DataTable
        data={memberList}
        openPanel={openPanel}
        openDetailPanel={openDetailPanel}
        refreshList={getMembers}
        loading={loading}
        setPage={setPage}
        param={param}
        onSearch={onSearch}
      />
      <DetailPanel refreshList={getMembers} openPanel={openPanel} ref={detailPanelRef} />
      <Panel refreshList={getMembers} ref={panelRef} />
    </>
  );
}

export default Members;
