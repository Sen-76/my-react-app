/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { SnippetsOutlined } from '@ant-design/icons';
import { Select, Tabs } from 'antd';
import { useEffect, useRef, useState } from 'react';
import styles from './Task.module.scss';
import DataTable from './components/DataTable';
import { useTranslation } from 'react-i18next';
import Panel from './components/Panel';
import Kanban from './components/Kanban';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
import FilterPanel from './components/FilterPanel';

function Tasks() {
  const { setBreadcrumb } = useBreadcrumb();
  const initDataGrid: Common.IDataGrid = {
    pageInfor: {
      pageSize: 10,
      pageNumber: 1,
      totalItems: 0
    },
    searchInfor: {
      searchValue: '',
      searchColumn: ['summary']
    },
    filter: []
    // orderInfor: {
    //   orderBy: ['updateDate'],
    //   isAssending: [true]
    // }
  };
  const [tabStatus, setTabStatus] = useState<string>('table');
  const [projectList, setProjectList] = useState<Project.IProjectModel[]>();
  const [taskList, setTaskList] = useState<A[]>([]);
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);
  const { showLoading, closeLoading } = useLoading();
  const { t } = useTranslation();
  const panelRef = useRef();
  const filterPanelRef = useRef();
  const tabItems = [
    {
      label: t('Task_Table_View'),
      key: 'table'
    },
    {
      label: t('Task_Kanban_View'),
      key: 'kanban'
    }
  ];

  const getProjectList = async () => {
    try {
      showLoading();
      const result = await service.projectService.get({
        pageInfor: {
          pageSize: 100,
          pageNumber: 1,
          totalItems: 0
        }
      });
      setProjectList(result.data.map((x: A) => ({ label: x.title, value: x.id })));
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const getTaskList = async (drafParam?: Common.IDataGrid) => {
    try {
      showLoading();
      const result = await service.taskService.get(drafParam ?? param);
      setTaskList(result.data);
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };

  const onChangeProject = (val: string) => {
    const draftParam = { ...param };
    if (draftParam.filter) {
      const projectId = draftParam.filter.findIndex((x) => x.key === 'projectId');
      projectId !== -1 && draftParam.filter.splice(projectId, 1);
      draftParam.filter.push({
        key: 'projectId',
        value: [val]
      });
    }
    setParam(draftParam);
    getTaskList(draftParam);
  };

  const onTabChanged = (e: A) => {
    setTabStatus(e);
  };

  useEffect(() => {
    setBreadcrumb([{ icon: <SnippetsOutlined />, text: t('Common_Task') }]);
  }, [t]);

  useEffect(() => {
    const fetchApi = async () => {
      await getProjectList();
      await getTaskList();
    };
    fetchApi();
  }, []);

  const openPanel = (data?: A) => {
    (panelRef.current as A).openDrawer(data);
  };

  const openFilterPanel = () => {
    (filterPanelRef.current as A).openDrawer(param.filter);
  };

  const onSearch = (value: string) => {
    const draftGrid = { ...param };
    if (draftGrid.searchInfor) {
      draftGrid.searchInfor.searchValue = value;
    }
    draftGrid.pageInfor!.pageNumber = 1;
    setParam(draftGrid);
    getTaskList(draftGrid);
  };

  const onFilter = (val: A) => {
    const draftGrid = { ...param };
    if (draftGrid.filter) {
      const projectId = draftGrid.filter.findIndex((x) => x.key === 'projectId');
      projectId !== -1 && draftGrid.filter.splice(projectId, 1);
      const milestoneId = draftGrid.filter.findIndex((x) => x.key === 'milestoneId');
      milestoneId !== -1 && draftGrid.filter.splice(milestoneId, 1);
      const statusId = draftGrid.filter.findIndex((x) => x.key === 'statusId');
      statusId !== -1 && draftGrid.filter.splice(statusId, 1);
      const taskPriotyId = draftGrid.filter.findIndex((x) => x.key === 'taskPriotyId');
      taskPriotyId !== -1 && draftGrid.filter.splice(taskPriotyId, 1);
      const assignee = draftGrid.filter.findIndex((x) => x.key === 'assignee');
      assignee !== -1 && draftGrid.filter.splice(assignee, 1);
      const reportTo = draftGrid.filter.findIndex((x) => x.key === 'reportTo');
      reportTo !== -1 && draftGrid.filter.splice(reportTo, 1);
      val.projectId?.length > 0 &&
        draftGrid.filter.push({
          key: 'projectId',
          value: val.projectId
        });
      val.statusId?.length > 0 &&
        draftGrid.filter.push({
          key: 'statusId',
          value: val.statusId
        });
      val.milestoneId?.length > 0 &&
        draftGrid.filter.push({
          key: 'milestoneId',
          value: val.milestoneId
        });
      val.taskPriotyId?.length > 0 &&
        draftGrid.filter.push({
          key: 'taskPriotyId',
          value: val.taskPriotyId
        });
      val.assignee?.length > 0 &&
        draftGrid.filter.push({
          key: 'assignee',
          value: val.assignee
        });
      val.reportTo?.length > 0 &&
        draftGrid.filter.push({
          key: 'reportTo',
          value: val.reportTo
        });
    }
    getTaskList(draftGrid);
  };

  const onOrder = (value: string, des: boolean) => {
    const draftGrid = { ...param };
    if (draftGrid.orderInfor) {
      draftGrid.orderInfor.orderBy = [value];
      draftGrid.orderInfor.isAssending = [des];
    }
    draftGrid.pageInfor!.pageNumber = 1;
    setParam(draftGrid);
    getTaskList(draftGrid);
  };

  return (
    <div className={styles.tasks}>
      <div>
        <Tabs
          items={tabItems}
          size="large"
          onChange={onTabChanged}
          tabBarExtraContent={
            <></>
            // <Select
            //   className={styles.select}
            //   placeholder={t('Task_Select_Project')}
            //   options={projectList}
            //   onChange={onChangeProject}
            // />
          }
        />
        {tabStatus === 'table' && (
          <DataTable
            data={taskList}
            openPanel={openPanel}
            loading={false}
            onSearch={onSearch}
            openFilterPanel={openFilterPanel}
            openDetailPanel={() => console.log('cc')}
            onOrder={onOrder}
            param={param}
          />
        )}
        {tabStatus === 'kanban' && <Kanban />}
        <Panel refreshList={() => console.log('cc')} ref={panelRef} />
        <FilterPanel ref={filterPanelRef} onFilter={onFilter} />
      </div>
    </div>
  );
}

export default Tasks;
