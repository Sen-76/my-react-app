import { useLoading } from '@/common/context/useLoading';
import DataTable from './components/DataTable';
import { useEffect, useState } from 'react';

const draftProject = [
  {
    id: 1,
    title: 'Test Project',
    description: 'Test Description',
    progress: 50,
    startDate: '2012/12/12',
    dueDate: '2012/12/12',
    updateDate: '2012/12/12',
    closeDate: '2012/12/12',
    team: {
      id: 1,
      name: 'Team no hope',
      description: 'N/A',
      members: [
        {
          id: 1,
          name: 'Sen 1',
          job: 'Developer',
          gender: 'Male',
          photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
          description: 'N/A'
        },
        {
          id: 2,
          name: 'Sen 2',
          job: 'Developer',
          gender: 'Male',
          photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
          description: 'N/A'
        },
        {
          id: 3,
          name: 'Sen 3',
          job: 'Developer',
          gender: 'Male',
          photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
          description: 'N/A'
        },
        {
          id: 4,
          name: 'Sen 4',
          job: 'Developer',
          gender: 'Male',
          photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
          description: 'N/A'
        },
        {
          id: 5,
          name: 'Sen 5',
          job: 'Developer',
          gender: 'Male',
          photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
          description: 'N/A'
        }
      ]
    }
  }
];
function Projects() {
  const [loading, setLoading] = useState<boolean>(false);
  const { showLoading, closeLoading } = useLoading();

  useEffect(() => {
    getTeams();
  }, []);

  const getTeams = () => {
    showLoading();
    setLoading(true);
    const timeout = setTimeout(() => {
      closeLoading();
      setLoading(false);
      clearTimeout(timeout);
    }, 2000);
  };

  return (
    <>
      <DataTable data={draftProject} loading={loading} refreshList={() => console.log('refresh')} />
    </>
  );
}

export default Projects;
