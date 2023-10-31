import { ERole } from '../../common/ERole';
import { lazy } from 'react';

const Tasks = lazy(() => import('../../pages/tasks/list/Tasks'));
const TaskDetail = lazy(() => import('../../pages/tasks/detail/TaskDetail'));

const routes: IRouter.IRoute<'/tasks'>[] = [
  {
    path: '/tasks',
    name: 'tasks',
    exact: true,
    element: Tasks,
    meta: { role: [ERole.Admin], pageTitle: 'Tasks' }
  },
  {
    path: '/tasks/task-detail/:name/:id',
    name: 'tasks',
    exact: true,
    element: TaskDetail,
    meta: { role: [ERole.Admin], pageTitle: 'Task Detail' }
  }
];

export default routes;
