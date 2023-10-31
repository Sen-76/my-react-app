import { ERole } from '../../common/ERole';
import { lazy } from 'react';

const Overview = lazy(() => import('../../pages/overview/Overview'));

const routes: IRouter.IRoute<'/'>[] = [
  {
    path: '/',
    name: 'overview',
    exact: true,
    element: Overview,
    meta: { role: [ERole.Admin], pageTitle: 'Overview' }
  }
];

export default routes;
