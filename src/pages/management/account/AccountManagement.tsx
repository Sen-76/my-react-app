/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useBreadcrumb } from '../../../components/breadcrum/Breadcrum';
import { BulbOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import styles from './AccountManagement.module.scss';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'antd';
import { service } from '@/services/apis';
import { EState } from './AccountManagement.Model';

//components
import DataTable from './components/DataTable';
import Panel from './components/Panel';
import FilterPanel from './components/FilterPanel';
import DetailPanel from './components/DetailPanel';

function AccountManagement() {
  const initDataGrid: Common.IDataGrid = {
    pageInfor: {
      pageSize: 10,
      pageNumber: 1,
      totalItems: 0
    },
    searchInfor: {
      searchValue: '',
      searchColumn: ['FullName', 'userEmail']
    },
    filter: [{ key: 'Status', value: [EState.Activate, EState.DeActivate] }]
  };
  const { setBreadcrumb } = useBreadcrumb();
  const [tabStatus, setTabStatus] = useState<number>(EState.Activate);
  const [loading, setLoading] = useState<boolean>(false);
  const [accountList, setAccountList] = useState<Account.IAccountModel[]>([]);
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);
  const [selectedItem, setSelectedItem] = useState<Account.IAccountModel[]>([]);
  const panelRef = useRef();
  const filterPanelRef = useRef();
  const detailPanelRef = useRef();
  const { t } = useTranslation();

  const tabItems = [
    {
      label: t('Manage_Account_WorkingUser'),
      key: EState.Activate.toString()
    },
    {
      label: t('Manage_Account_DeletedUser'),
      key: EState.Deleted.toString()
    }
  ];

  useEffect(() => {
    setBreadcrumb([{ icon: <BulbOutlined />, text: `${t('management')}` }, { text: `${t('Manage_Account')}` }]);
  }, [t]);

  useEffect(() => {
    getAccountsList();
  }, []);

  const getAccountsList = async (draftParam?: Common.IDataGrid) => {
    try {
      setLoading(true);
      const result = await service.accountService.getAccount(draftParam ?? param);
      setParam({
        ...param,
        pageInfor: {
          pageSize: result.prameter.pageSize,
          pageNumber: result.prameter.pageNumber,
          totalItems: result.prameter.totalItems
        }
      });
      setAccountList(result.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const openPanel = (data?: A) => {
    (panelRef.current as A).openDrawer(data);
  };

  const openDetailPanel = (data?: A) => {
    (detailPanelRef.current as A).openDrawer(data);
  };

  const openFilterPanel = (data?: A) => {
    (filterPanelRef.current as A).openDrawer(data);
  };

  const onTabChanged = (e: A) => {
    const draftGrid = { ...param };
    if (draftGrid.filter) {
      const statusIndex = draftGrid.filter.findIndex((x) => x.key === 'Status');
      statusIndex !== -1 && draftGrid.filter.splice(statusIndex, 1);
      draftGrid.filter?.push({ key: 'Status', value: [Number(e)] });
    }
    draftGrid.pageInfor!.pageNumber = 1;
    setSelectedItem([]);
    setParam(draftGrid);
    setTabStatus(e);
    getAccountsList(draftGrid);
  };

  const onSearch = (value: string) => {
    const draftGrid = { ...param };
    if (draftGrid.searchInfor) {
      draftGrid.searchInfor.searchValue = value;
    }
    draftGrid.pageInfor!.pageNumber = 1;
    setParam(draftGrid);
    getAccountsList(draftGrid);
  };

  const setPage = (val: number) => {
    const draftGrid = { ...param };
    if (draftGrid.pageInfor) {
      draftGrid.pageInfor.pageNumber = val;
    }
    setParam(draftGrid);
    getAccountsList(draftGrid);
  };

  const filterAccount = (val: A) => {
    const draftGrid = { ...param };
    if (draftGrid.filter) {
      const gender = draftGrid.filter.findIndex((x) => x.key === 'Gender');
      gender !== -1 && draftGrid.filter.splice(gender, 1);
      const department = draftGrid.filter.findIndex((x) => x.key === 'UserDepartment');
      department !== -1 && draftGrid.filter.splice(department, 1);
      const role = draftGrid.filter.findIndex((x) => x.key === 'UserRole');
      role !== -1 && draftGrid.filter.splice(role, 1);
      val.gender?.length > 0 &&
        draftGrid.filter.push({
          key: 'Gender',
          value: val.gender
        });
      val.role?.length > 0 &&
        draftGrid.filter.push({
          key: 'UserRole',
          value: val.role
        });
      val.department?.length > 0 &&
        draftGrid.filter.push({
          key: 'UserDepartment',
          value: val.department
        });
    }
    getAccountsList(draftGrid);
  };

  return (
    <div className={styles.accountconfiguration}>
      <Tabs items={tabItems} size="large" onChange={onTabChanged} />
      <DataTable
        data={accountList}
        openPanel={openPanel}
        openFilterPanel={openFilterPanel}
        openDetailPanel={openDetailPanel}
        tabStatus={tabStatus}
        onSearch={onSearch}
        refreshList={getAccountsList}
        param={param}
        setPage={setPage}
        loading={loading}
        defaultselected={selectedItem}
      />
      <Panel refreshList={getAccountsList} ref={panelRef} />
      <FilterPanel ref={filterPanelRef} onFilter={filterAccount} />
      <DetailPanel refreshList={getAccountsList} ref={detailPanelRef} openPanel={openPanel} />
    </div>
  );
}

export default AccountManagement;
