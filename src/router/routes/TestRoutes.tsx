import { ERole } from '../../common/ERole';
import { lazy } from 'react';

const Test = lazy(() => import('../../pages/test/test-page/TestPage'));
const TestTable = lazy(() => import('../../pages/test/test-table/TestTable'));
const TestShortedTable = lazy(() => import('../../pages/test/shorted-table/ShortedTable'));
const TestImage = lazy(() => import('../../pages/test/test-image/TestImage'));

const routes: IRouter.IRoute<'/test'>[] = [
  {
    path: '/test/test-page',
    name: 'test',
    exact: true,
    element: Test,
    meta: { role: [ERole.Admin], pageTitle: 'Test' }
  },
  {
    path: '/test/test-table',
    name: 'testtable',
    exact: true,
    element: TestTable,
    meta: { role: [ERole.Admin], pageTitle: 'Test Table' }
  },
  {
    path: '/test/test-shortedtable',
    name: 'shortedtable',
    exact: true,
    element: TestShortedTable,
    meta: { role: [ERole.Admin], pageTitle: 'Test Shorted Table' }
  },
  {
    path: '/test/test-image',
    name: 'testimage',
    exact: true,
    element: TestImage,
    meta: { role: [ERole.Admin], pageTitle: 'Test Image' }
  }
];

export default routes;
