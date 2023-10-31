import { ERole } from '../../common/ERole';
import { lazy } from 'react';

const Department = lazy(() => import('../../pages/department/Department'));

const routes: IRouter.IRoute<'/department'>[] = [
  {
    path: '/department',
    name: 'department',
    exact: true,
    element: Department,
    meta: { role: [ERole.Admin], pageTitle: 'Department' }
  }
];

export default routes;
