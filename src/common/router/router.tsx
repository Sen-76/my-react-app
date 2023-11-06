import { FC, Suspense, useEffect } from 'react';
import { LoadingProvider } from '../context/useLoading';
import { Routes, BrowserRouter as ReactRouter, Route, useNavigate } from 'react-router-dom';

import LazyLoading from '@/components/lazy-loading/LazyLoading';
import { useLoginManager } from '../helpers/login-manager';
import Login from '@/pages/authentication/login/Login';
import Forgot from '@/pages/authentication/forgot/Forgot';

const RouteList = (list: IRouter.IRoute[]) => {
  return list?.map?.((route) => RouteItem(route)).filter((item) => item);
};

const RouteItem = (route: IRouter.IRoute) => {
  const routerProps: A = {};
  if (route.exact) {
    routerProps.exact = true;
  }
  return route.index ? (
    <Route index key={route.name} element={renderSuspense(route)} />
  ) : (
    <Route {...routerProps} key={route.name} path={route.path} element={renderSuspense(route)}>
      {RouteList(route.children ?? [])}
    </Route>
  );
};

const renderSuspense = (route: IRouter.IRoute): React.ReactNode => {
  if (route.redirectTo) {
    return <Redirect to={route.redirectTo} />;
  }
  if (!route.element) {
    return null;
  }

  return (
    <Suspense fallback={<LazyLoading />}>
      <route.element />
    </Suspense>
  );
};

const Redirect = ({ to }: { to: string }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  });
  return null;
};
const Router: FC<IRouter.RouterProps> = (props) => {
  const { getLoginUser } = useLoginManager();

  return (
    <>
      <ReactRouter>
        <LoadingProvider>
          {props.children}
          <Routes>
            {getLoginUser() ? (
              RouteList(props.routers)
            ) : (
              <>
                <Route
                  path="/login"
                  element={
                    <Suspense fallback={<LazyLoading />}>
                      <Login />
                    </Suspense>
                  }
                ></Route>
                <Route
                  path="/forgot"
                  element={
                    <Suspense fallback={<LazyLoading />}>
                      <Forgot />
                    </Suspense>
                  }
                ></Route>
                <Route path="*" element={<Redirect to="/login" />}></Route>
              </>
            )}
          </Routes>
        </LoadingProvider>
      </ReactRouter>
    </>
  );
};

export default Router;
