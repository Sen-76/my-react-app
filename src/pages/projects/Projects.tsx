import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { BookOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import DataTable from './components/DataTable';
import styles from './Project.module.scss';

const draftProject = [
  {
    id: '1',
    title: 'MKTPMS Marketing Project Management System',
    assignee: 'Sen',
    reportTo: 'Elwyn'
  }
];

function Projects() {
  const { setBreadcrumb } = useBreadcrumb();
  const { t } = useTranslation();

  useEffect(() => {
    setBreadcrumb([{ icon: <BookOutlined />, text: t('projects') }]);
  }, [t]);
  return (
    <div className={styles.project}>
      <DataTable
        data={draftProject}
        openPanel={() => console.log('cc')}
        loading={false}
        openFilterPanel={() => console.log('cc')}
        openDetailPanel={() => console.log('cc')}
        param={{}}
      />
    </div>
  );
}

export default Projects;
