import { ERole } from '../../common/ERole';
import { lazy } from 'react';

const FileConfiguration = lazy(() => import('../../pages/configuration/file/FileConfiguration'));
const EmailConfiguration = lazy(() => import('../../pages/configuration/email/EmailConfiguration'));
const SmtpConfiguration = lazy(() => import('../../pages/configuration/smtp/Smtp'));
const StarConfiguration = lazy(() => import('../../pages/configuration/star/StarConfiguration'));
const TaskStatusConfiguration = lazy(() => import('../../pages/configuration/task-status/TaskStatusConfiguration'));
const TaskPriotyConfiguration = lazy(() => import('../../pages/configuration/task-prioty/TaskPriotyConfiguration'));

const routes: IRouter.IRoute<'/configuration'>[] = [
  {
    path: '/configuration/file-configuration',
    name: 'fileconfiguration',
    exact: true,
    element: FileConfiguration,
    meta: { role: [ERole.Admin], pageTitle: 'File Configuration' }
  },
  {
    path: '/configuration/email-configuration',
    name: 'emailconfiguration',
    exact: true,
    element: EmailConfiguration,
    meta: { role: [ERole.Admin], pageTitle: 'Email Configuration' }
  },
  {
    path: '/configuration/smtp-configuration',
    name: 'smtpconfiguration',
    exact: true,
    element: SmtpConfiguration,
    meta: { role: [ERole.Admin], pageTitle: 'SMTP Configuration' }
  },
  {
    path: '/configuration/star-configuration',
    name: 'starconfiguration',
    exact: true,
    element: StarConfiguration,
    meta: { role: [ERole.Admin], pageTitle: 'Star Configuration' }
  },
  {
    path: '/configuration/task-status-configuration',
    name: 'taskstatusconfiguration',
    exact: true,
    element: TaskStatusConfiguration,
    meta: { role: [ERole.Admin], pageTitle: 'Task Status Configuration' }
  },
  {
    path: '/configuration/task-prioty-configuration',
    name: 'taskpriotyconfiguration',
    exact: true,
    element: TaskPriotyConfiguration,
    meta: { role: [ERole.Admin], pageTitle: 'Task Prioty Configuration' }
  }
];

export default routes;
