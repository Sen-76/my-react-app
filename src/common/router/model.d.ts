declare namespace IRouter {
  export interface IRoute<T = A> {
    path?: RoutePathName<T>;
    index?: boolean;
    name: string;
    redirectTo?: string;
    exact?: boolean;
    element?: React.LazyExoticComponent<(props?: A) => JSX.Element> | React.ComponentType;
    meta?: IMeta;
    children?: IRoute<T>[];
  }
  export interface RouterProps {
    routers: IRoute[];
    children?: React.ReactNode;
  }
}
