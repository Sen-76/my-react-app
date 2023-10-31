import { ERole } from '../../common/ERole';
import { lazy } from 'react';

const GiveStar = lazy(() => import('../../pages/cfrs/give-star/GiveStar'));
const Recognition = lazy(() => import('../../pages/cfrs/recognition/Recognition'));

const routes: IRouter.IRoute<'/cfrs'>[] = [
  {
    path: '/cfrs/give-star',
    name: 'give-star',
    exact: true,
    element: GiveStar,
    meta: { role: [ERole.Admin], pageTitle: 'Give stars' }
  },
  {
    path: '/cfrs/recognition',
    name: 'recognition',
    exact: true,
    element: Recognition,
    meta: { role: [ERole.Admin], pageTitle: 'Give stars' }
  }
];
export default routes;
