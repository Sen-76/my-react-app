import { Breadcrumb } from 'antd';
import { BreadcrumbItemType, BreadcrumbSeparatorType } from 'antd/es/breadcrumb/Breadcrumb';
import React, { createContext, useContext, useState, useCallback } from 'react';
import styles from './Breadcrum.module.scss';
import { useNavigate } from 'react-router';

export interface IBreadcrumb {
  path?: string;
  icon?: React.ReactNode;
  text?: React.ReactNode;
  onClick?: VoidFunction;
}
export interface IContext {
  setBreadcrumb: (breadcrumbItems: IBreadcrumb[]) => void;
  items: IBreadcrumb[];
}

export interface IProps {
  children?: React.ReactNode;
}
export interface IBreadcrumbProps {
  items: IBreadcrumb[];
}

export const BreadcrumbContext = createContext<IContext>({
  items: [],
  setBreadcrumb: () => 1
});

export const BreadcrumbProvider = (props: IProps) => {
  const [items, setItems] = useState<IBreadcrumb[]>([]);
  const setBreadcrumb = (breadcrumbItems: IBreadcrumb[]) => {
    setItems([...breadcrumbItems]);
  };
  return <BreadcrumbContext.Provider value={{ items, setBreadcrumb }}>{props.children}</BreadcrumbContext.Provider>;
};

export const BreadcrumbConsumer = BreadcrumbContext.Consumer;

export const SiteBreadcrumb = (props: IBreadcrumbProps) => {
  const navigate = useNavigate();
  const setRenderItems = useCallback(() => {
    return props.items.map((item) => {
      const temp: Partial<BreadcrumbItemType & BreadcrumbSeparatorType> = {};
      if (item.path) {
        temp.onClick = () => {
          if (!item.path) return;
          navigate(item.path);
        };
      }
      if (item.onClick) {
        temp.onClick = item.onClick;
      }
      temp.title = (
        <div className={`${styles.breadcrumbIcon} ${styles.canClickBreadcrumb}`}>
          {item.icon ? <span style={{ marginRight: 10 }}>{item.icon}</span> : null}
          <span>{item.text}</span>
        </div>
      );

      return temp;
    });
  }, [props.items]);
  return (
    <div className={styles.breadcrumb}>
      <Breadcrumb items={setRenderItems()} />
    </div>
  );
};

export const useBreadcrumb = () => useContext(BreadcrumbContext);
