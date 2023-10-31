import { ERole } from '../../common/ERole';
import { lazy } from 'react';

const AccountManagement = lazy(() => import('../../pages/management/account/AccountManagement'));
const DepartmentManagement = lazy(() => import('../../pages/management/department/list/Department'));
const DepartmentDetail = lazy(() => import('../../pages/management/department/view-detail/ViewDetail'));
const RoleManagement = lazy(() => import('../../pages/management/role/Role'));
const TeamManagement = lazy(() => import('../../pages/management/team/team-list/Team'));
const TeamManagementDetail = lazy(() => import('../../pages/management/team/team-detail/TeamDetail'));

const routes: IRouter.IRoute<'/management'>[] = [
  {
    path: '/management/account-management',
    name: 'account-management',
    exact: true,
    element: AccountManagement,
    meta: { role: [ERole.Admin], pageTitle: 'Account Management' }
  },
  {
    path: '/management/department-management',
    name: 'department-management',
    exact: true,
    element: DepartmentManagement,
    meta: { role: [ERole.Admin], pageTitle: 'Deparment Management' }
  },
  {
    path: '/management/department-management/department-detail/:name/:id',
    name: 'department-detail',
    exact: true,
    element: DepartmentDetail,
    meta: { role: [ERole.Admin], pageTitle: 'Deparment Management Detail' }
  },
  {
    path: '/management/role-management',
    name: 'role-management',
    exact: true,
    element: RoleManagement,
    meta: { role: [ERole.Admin], pageTitle: 'Role Management' }
  },
  {
    path: '/management/team-management',
    name: 'team-management',
    exact: true,
    element: TeamManagement,
    meta: { role: [ERole.Admin], pageTitle: 'Team Management' }
  },
  {
    path: '/management/team-management/team-detail/:name/:id',
    name: 'department-detail',
    exact: true,
    element: TeamManagementDetail,
    meta: { role: [ERole.Admin], pageTitle: 'Deparment Management Detail' }
  }
];

export default routes;
