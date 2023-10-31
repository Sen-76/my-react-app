import { ERole } from '../../common/ERole';
import { lazy } from 'react';

const Profilte = lazy(() => import('../../pages/user/profile/Profile'));
const ChangePassword = lazy(() => import('@/pages/user/change-password/ChangePassword'));

const routes: IRouter.IRoute<'/user'>[] = [
  {
    path: '/user/profile',
    name: 'profile',
    exact: true,
    element: Profilte,
    meta: { role: [ERole.Admin], pageTitle: 'Profile' }
  },
  {
    path: '/user/change-password',
    name: 'change-password',
    exact: true,
    element: ChangePassword,
    meta: { role: [ERole.Admin], pageTitle: 'Change Password' }
  }
];

export default routes;
