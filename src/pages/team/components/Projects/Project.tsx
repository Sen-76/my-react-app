import DataTable from './components/DataTable';
import { useEffect, useState } from 'react';
import { service } from '@/services/apis';
import { EStatus } from '@/pages/projects/list/Project.model';

function Projects() {
  const [loading, setLoading] = useState<boolean>(false);
  const [projectList, setProjectList] = useState<Project.IProjectModel[]>([]);
  const id = JSON.parse(sessionStorage.getItem('userDetail') ?? '')?.teamId;
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
      { key: 'Status', value: [EStatus.Inactive], operators: 'not in' },
      { key: 'teamId', value: [id] }
    ]
  };
  const [param, setParam] = useState<Common.IDataGrid>(initDataGrid);

  useEffect(() => {
    getProjectList();
  }, []);

  const getProjectList = async (draftParam?: Common.IDataGrid) => {
    try {
      if (id) {
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
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DataTable data={projectList} loading={loading} refreshList={() => console.log('refresh')} />
    </>
  );
}

export default Projects;
