import { ERole } from '../../common/ERole';
import { lazy } from 'react';

const Goals = lazy(() => import('../../pages/okrs/goals/Goals'));
const Reviews = lazy(() => import('../../pages/okrs/reviews/Reviews'));
const Feedbacks = lazy(() => import('../../pages/okrs/feedbacks/Feedbacks'));

const routes: IRouter.IRoute<'/okrs'>[] = [
  {
    path: '/okrs/goals',
    name: 'goals',
    exact: true,
    element: Goals,
    meta: { role: [ERole.Admin], pageTitle: 'Goals' }
  },
  {
    path: '/okrs/reviews',
    name: 'goals',
    exact: true,
    element: Reviews,
    meta: { role: [ERole.Admin], pageTitle: 'Reviews' }
  },
  {
    path: '/okrs/feedbacks',
    name: 'feedbacks',
    exact: true,
    element: Feedbacks,
    meta: { role: [ERole.Admin], pageTitle: 'Feedbacks' }
  }
];

export default routes;
