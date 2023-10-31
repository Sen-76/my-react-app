import { useBreadcrumb } from './components/breadcrum/Breadcrum';
import { Outlet } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import LazyLoading from './components/lazy-loading/LazyLoading';
import { useLoading } from './common/context/useLoading';
import { Watermark } from 'antd';

function Layout() {
  const { isLoading } = useLoading();
  const { items } = useBreadcrumb();
  return (
    <>
      {/* <Watermark content="MKT Project Management System"> */}
      <AdminLayout breadcrumbItems={items}>
        <Outlet></Outlet>
      </AdminLayout>
      {/* </Watermark> */}
      {isLoading && <LazyLoading />}
    </>
  );
}

export default Layout;
