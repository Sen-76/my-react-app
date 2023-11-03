/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { BookOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import DataTable from './components/DataTable';
import styles from './Project.module.scss';
import Panel from './components/Panel';
import FilterPanel from './components/FilterPanel';
import { service } from '@/services/apis';
import { EStatus } from './Project.model';
import { Tabs } from 'antd';

function Projects() {
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
    filter: [{ key: 'Status', value: [EStatus.Active] }]
  };
  const { setBreadcrumb } = useBreadcrumb();
  const [loading, setLoading] = useState<boolean>(false);
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);
  const [projectList, setProjectList] = useState<Project.IProjectModel[]>();
  const [tabStatus, setTabStatus] = useState<number>(EStatus.Active);
  const { t } = useTranslation();
  const panelRef = useRef();
  const filterPanelRef = useRef();

  useEffect(() => {
    setBreadcrumb([{ icon: <BookOutlined />, text: t('projects') }]);
  }, [t]);

  useEffect(() => {
    getProjectList();
  }, []);

  const getProjectList = async (draftParam?: Common.IDataGrid) => {
    try {
      setLoading(true);
      const result = await service.projectService.get(draftParam ?? param);
      setParam({
        ...param,
        pageInfor: {
          pageSize: result.prameter.pageSize,
          pageNumber: result.prameter.pageNumber,
          totalItems: result.prameter.totalItems
        }
      });
      setProjectList(result.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const openPanel = (data?: A) => {
    (panelRef.current as A).openDrawer(data);
  };

  const openFilterPanel = (data?: A) => {
    (filterPanelRef.current as A).openDrawer(data);
  };

  const onSearch = (value: string) => {
    const draftGrid = { ...param };
    if (draftGrid.searchInfor) {
      draftGrid.searchInfor.searchValue = value;
    }
    draftGrid.pageInfor!.pageNumber = 1;
    setParam(draftGrid);
    getProjectList(draftGrid);
  };

  const setPage = (val: number) => {
    const draftGrid = { ...param };
    if (draftGrid.pageInfor) {
      draftGrid.pageInfor.pageNumber = val;
    }
    setParam(draftGrid);
    getProjectList(draftGrid);
  };

  const filterProject = (val: A) => {
    const draftGrid = { ...param };
    if (draftGrid.filter) {
      const department = draftGrid.filter.findIndex((x) => x.key === 'DepartmentId');
      department !== -1 && draftGrid.filter.splice(department, 1);
      const status = draftGrid.filter.findIndex((x) => x.key === 'TeamId');
      status !== -1 && draftGrid.filter.splice(status, 1);
      const team = draftGrid.filter.findIndex((x) => x.key === 'Status');
      team !== -1 && draftGrid.filter.splice(team, 1);
      val.department?.length > 0 &&
        draftGrid.filter.push({
          key: 'DepartmentId',
          value: val.department
        });
      val.status?.length > 0 &&
        draftGrid.filter.push({
          key: 'Status',
          value: val.status
        });
      val.team?.length > 0 &&
        draftGrid.filter.push({
          key: 'TeamId',
          value: val.team
        });
    }
    getProjectList(draftGrid);
  };
  const tabItems = [
    {
      label: t('Project_Active'),
      key: EStatus.Active.toString()
    },
    {
      label: t('Project_Mine'),
      key: 'mine'
    },
    {
      label: t('Project_Inactive'),
      key: EStatus.Inactive.toString()
    }
  ];

  const onTabChanged = (e: A) => {
    const draftGrid = { ...param };
    if (draftGrid.filter) {
      const statusIndex = draftGrid.filter.findIndex((x) => x.key === 'Status');
      statusIndex !== -1 && draftGrid.filter.splice(statusIndex, 1);
      const teamIndex = draftGrid.filter.findIndex((x) => x.key === 'teamId');
      teamIndex !== -1 && draftGrid.filter.splice(teamIndex, 1);
      if (e === 'mine' && draftGrid.filter) {
        draftGrid.filter?.push({
          key: 'teamId',
          value: [JSON.parse(sessionStorage.getItem('userDetail') ?? '')?.teamId ?? '']
        });
      } else if (Number(e) === EStatus.Active)
        draftGrid.filter?.push({ key: 'Status', value: [Number(EStatus.Inactive)], operators: 'not in' });
      else draftGrid.filter?.push({ key: 'Status', value: [Number(EStatus.Inactive)] });
    }
    draftGrid.pageInfor!.pageNumber = 1;
    setParam(draftGrid);
    setTabStatus(e);
    getProjectList(draftGrid);
  };

  return (
    <div className={styles.project}>
      <Tabs items={tabItems} size="large" onChange={onTabChanged} />
      <DataTable
        data={projectList}
        openPanel={openPanel}
        loading={loading}
        openFilterPanel={openFilterPanel}
        tabStatus={tabStatus}
        param={param}
        setPage={setPage}
        onSearch={onSearch}
        refreshList={getProjectList}
      />
      <Panel ref={panelRef} refreshList={getProjectList} />
      <FilterPanel ref={filterPanelRef} filterProject={filterProject} tabStatus={tabStatus} />
    </div>
  );
}

export default Projects;
