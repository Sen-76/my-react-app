/* eslint-disable @typescript-eslint/no-non-null-assertion */
import DataTable from './components/DataTable';
import { useEffect, useState } from 'react';
import { service } from '@/services/apis';
import { EStatus } from '@/pages/projects/list/Project.model';

function Projects() {
  const [loading, setLoading] = useState<boolean>(false);
  const [projectList, setProjectList] = useState<Project.IProjectModel[]>([]);
  const id = JSON.parse(sessionStorage.getItem('userDetail') ?? '')?.userDepartmentId ?? '';
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
      { key: 'Status', value: [EStatus.Active] },
      { key: 'DepartmentId', value: [id] }
    ]
  };
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);
  useEffect(() => {
    getProject();
  }, []);

  const getProject = async (draftParam?: Common.IDataGrid) => {
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
    getProject(draftGrid);
  };

  const setPage = (val: number) => {
    const draftGrid = { ...param };
    if (draftGrid.pageInfor) {
      draftGrid.pageInfor.pageNumber = val;
    }
    setParam(draftGrid);
    getProject(draftGrid);
  };

  return (
    <>
      <DataTable data={projectList} loading={loading} onSearch={onSearch} setPage={setPage} param={param} />
    </>
  );
}

export default Projects;
