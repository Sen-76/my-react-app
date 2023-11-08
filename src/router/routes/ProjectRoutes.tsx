import { ERole } from '../../common/ERole';
import { lazy } from 'react';

const Projects = lazy(() => import('../../pages/projects/list/Projects'));
const ProjectDetail = lazy(() => import('../../pages/projects/detail/ProjectDetail'));

const routes: IRouter.IRoute<'/projects'>[] = [
  {
    path: '/projects',
    name: 'projects',
    exact: true,
    element: Projects,
    meta: { role: [ERole.Admin], pageTitle: 'Projects', leftKey: 'projects' }
  },
  {
    path: '/projects/detail/:id/:name',
    name: 'projectdetail',
    exact: true,
    element: ProjectDetail,
    meta: { role: [ERole.Admin], pageTitle: 'Project Detail' }
  }
];

export default routes;
