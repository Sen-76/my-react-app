import { ERole } from '../../common/ERole';
import { lazy } from 'react';

const Team = lazy(() => import('../../pages/team/Team'));

const routes: IRouter.IRoute<'/team'>[] = [
  {
    path: '/team',
    name: 'team',
    exact: true,
    element: Team,
    meta: { role: [ERole.Admin], pageTitle: 'Team' }
  }
];

export default routes;
