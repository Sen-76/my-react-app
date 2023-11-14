import { lazy } from 'react';
import { ERole } from '../../common/ERole';

const MyOKRs = lazy(() => import('../../pages/okrs/my-okrs/list/MyOKRsList'));
const MyOKRDetail = lazy(() => import('../../pages/okrs/my-okrs/details/MyOKRDetails'));
const Reviews = lazy(() => import('../../pages/okrs/check-in/CheckIn'));

const routes: IRouter.IRoute<'/okrs'>[] = [
  {
    path: '/okrs/my-okrs',
    name: 'my-okrs',
    exact: true,
    element: MyOKRs,
    meta: { role: [ERole.Admin], pageTitle: 'My OKRs', leftKey: 'my-okrs' }
  },
  {
    path: '/okrs/my-okrs/:id',
    name: 'my-okrs-details',
    exact: true,
    element: MyOKRDetail,
    meta: { role: [ERole.Admin], pageTitle: 'OKRs Detail', leftKey: 'my-okrs' }
  },
  {
    path: '/okrs/check-in',
    name: 'check-in',
    exact: true,
    element: Reviews,
    meta: { role: [ERole.Admin], pageTitle: 'Reviews', leftKey: 'reviews' }
  }
];

export default routes;
