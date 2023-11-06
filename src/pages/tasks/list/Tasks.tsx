/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  FilterOutlined,
  OrderedListOutlined,
  SnippetsOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Menu, Tabs, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import styles from './Task.module.scss';
import DataTable from './components/DataTable';
import { useTranslation } from 'react-i18next';
import Panel from './components/Panel';
import Kanban from './components/Kanban';
import { service } from '@/services/apis';
import { useLoading } from '@/common/context/useLoading';
import FilterPanel from './components/FilterPanel';
import Paragraph from 'antd/es/typography/Paragraph';
import Search from 'antd/es/input/Search';
import { OrderBy } from './Task.model';

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
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [taskList, setTaskList] = useState<A[]>([]);
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);
  const [des, setDes] = useState<boolean>(true);
  const [activeFilterKey, setActiveFilterKey] = useState<string>('updateDate');
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
  const getTaskList = async (drafParam?: Common.IDataGrid) => {
    try {
      setLoadingTable(true);
      const result = await service.taskService.get(drafParam ?? param);
      setParam({
        ...param,
        pageInfor: {
          pageSize: result.prameter.pageSize,
          pageNumber: result.prameter.pageNumber,
          totalItems: result.prameter.totalItems
        }
      });
      setTaskList(result.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingTable(false);
    }
  };

  const setPage = (val: number) => {
    const draftGrid = { ...param };
    if (draftGrid.pageInfor) {
      draftGrid.pageInfor.pageNumber = val;
    }
    setParam(draftGrid);
    getTaskList(draftGrid);
  };

  const selectFilter = (val: string) => {
    setActiveFilterKey(val);
    if (val === activeFilterKey) {
      onOrder(val, !des);
      setDes(!des);
    } else {
      setDes(true);
      onOrder(val, true);
    }
  };

  const TableHeader = () => {
    const menu = () => (
      <Menu>
        {OrderBy.map((item) => (
          <Menu.Item
            key={item.key}
            className={`${styles.menuItem} ${item.key === activeFilterKey ? styles.active : ''}`}
            onClick={() => selectFilter(item.key)}
          >
            <Paragraph ellipsis={{ rows: 1, expandable: false }}>{item.value}</Paragraph>
            {item.key === activeFilterKey ? des ? <ArrowDownOutlined /> : <ArrowUpOutlined /> : ''}
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <>
        <Dropdown dropdownRender={menu} placement="bottomRight" trigger={['click']}>
          <Tooltip placement="top" title={t('Common_Order')} color="#ffffff" arrow={true}>
            <Button type="text" icon={<OrderedListOutlined />} />
          </Tooltip>
        </Dropdown>
        <Tooltip placement="bottom" title={t('Common_Filter')} color="#ffffff" arrow={true}>
          <Button type="text" onClick={() => openFilterPanel()} icon={<FilterOutlined />} />
        </Tooltip>
        <Search placeholder={t('Common_SearchByTitle')} allowClear onSearch={onSearch} style={{ width: 250 }} />
      </>
    );
  };

  const onTabChanged = async (e: A) => {
    showLoading();
    const draftParam = { ...param };
    if (e === 'kanban') draftParam.pageInfor!.pageSize = 1000;
    else {
      draftParam.pageInfor!.pageSize = 10;
      draftParam.pageInfor!.pageNumber = 1;
    }
    await getTaskList(draftParam);
    setTabStatus(e);
    closeLoading();
  };

  useEffect(() => {
    setBreadcrumb([{ icon: <SnippetsOutlined />, text: t('Common_Task') }]);
  }, [t]);

  useEffect(() => {
    const fetchApi = async () => {
      showLoading();
      await getTaskList();
      closeLoading();
    };
    fetchApi();
  }, []);

  const openPanel = (data?: A) => {
    (panelRef.current as A).openDrawer(data);
  };

  const openFilterPanel = () => {
    (filterPanelRef.current as A).openDrawer(param.filter);
  };

  const onSearch = async (value: string) => {
    const draftGrid = { ...param };
    if (draftGrid.searchInfor) {
      draftGrid.searchInfor.searchValue = value;
    }
    draftGrid.pageInfor!.pageNumber = 1;
    setParam(draftGrid);
    await getTaskList(draftGrid);
  };

  const onFilter = async (val: A) => {
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
    await getTaskList(draftGrid);
  };

  const onOrder = async (value: string, des: boolean) => {
    const draftGrid = { ...param };
    if (draftGrid.orderInfor) {
      draftGrid.orderInfor.orderBy = [value];
      draftGrid.orderInfor.isAssending = [des];
    }
    draftGrid.pageInfor!.pageNumber = 1;
    setParam(draftGrid);
    await getTaskList(draftGrid);
  };

  return (
    <div className={styles.tasks}>
      <div>
        <Tabs items={tabItems} size="large" onChange={onTabChanged} tabBarExtraContent={TableHeader()} />
        {tabStatus === 'table' && (
          <DataTable
            data={taskList}
            openPanel={openPanel}
            loading={loadingTable}
            onOrder={onOrder}
            param={param}
            setPage={setPage}
          />
        )}
        {tabStatus === 'kanban' && <Kanban taskList={taskList} />}
        <Panel refreshList={getTaskList} ref={panelRef} />
        <FilterPanel ref={filterPanelRef} onFilter={onFilter} />
      </div>
    </div>
  );
}

export default Tasks;
