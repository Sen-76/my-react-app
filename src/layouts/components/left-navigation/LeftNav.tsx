import { Menu, MenuProps } from 'antd';
import React, { useState, useEffect } from 'react';
import {
  ArrowRightOutlined,
  BulbOutlined,
  SettingOutlined,
  AppstoreOutlined,
  SnippetsOutlined,
  BookOutlined,
  ContactsOutlined,
  ClusterOutlined,
  TeamOutlined,
  StarOutlined
} from '@ant-design/icons';
import styles from './LeftNav.module.scss';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

type MenuItem = Required<MenuProps>['items'][number];
type CustomMenuItem = MenuItem & { path?: string; children?: CustomMenuItem[] };
interface IMenuClickEvent {
  key: string;
  keyPath: string[];
}

const renderIcon = (icon: A) => {
  return React.createElement(icon, {
    style: {
      fontSize: 16
    }
  });
};

interface IProps {
  collapse?: boolean;
  onMenuClick?: (key: string) => void;
}

function LeftNav(props: IProps) {
  const [selectedKey, setSelectedKey] = useState<string[]>(['overview']);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const items: CustomMenuItem[] = [
    {
      label: t('dashboard'),
      path: '/',
      icon: renderIcon(AppstoreOutlined),
      key: 'dashboard'
    },
    {
      label: t('projects'),
      path: '/projects',
      icon: renderIcon(BookOutlined),
      key: 'projects'
    },
    {
      label: t('tasks'),
      path: '/tasks',
      icon: renderIcon(SnippetsOutlined),
      key: 'tasks'
    },
    {
      label: t('department'),
      path: '/department',
      icon: renderIcon(ContactsOutlined),
      key: 'department'
    },
    {
      label: t('team'),
      path: '/team',
      icon: renderIcon(TeamOutlined),
      key: 'team'
    },
    {
      label: 'OKRs',
      icon: renderIcon(BulbOutlined),
      key: 'okrs',
      children: [
        {
          label: t('goals'),
          path: '/okrs/goals',
          icon: renderIcon(ArrowRightOutlined),
          key: 'goals'
        },
        {
          label: t('reviews'),
          path: '/okrs/reviews',
          icon: renderIcon(ArrowRightOutlined),
          key: 'reviews'
        },
        {
          label: t('feedbacks'),
          path: '/okrs/feedbacks',
          icon: renderIcon(ArrowRightOutlined),
          key: 'feedbacks'
        }
      ]
    },
    {
      label: 'CFRs',
      icon: renderIcon(StarOutlined),
      key: 'cfrs',
      children: [
        {
          label: t('CFRS_Recognition_Navigation'),
          path: '/cfrs/recognition',
          icon: renderIcon(ArrowRightOutlined),
          key: 'recognition'
        },
        {
          label: t('CFRS_Give_star_Navigation'),
          path: '/cfrs/give-star',
          icon: renderIcon(ArrowRightOutlined),
          key: 'give-star'
        }
      ]
    },
    {
      label: t('management'),
      icon: renderIcon(ClusterOutlined),
      key: 'management',
      children: [
        {
          label: t('Manage_Department'),
          path: '/management/department-management',
          icon: renderIcon(ArrowRightOutlined),
          key: 'department-management'
        },
        {
          label: t('Manage_Team'),
          path: '/management/team-management',
          icon: renderIcon(ArrowRightOutlined),
          key: 'team-management'
        },
        {
          label: t('Manage_Account'),
          path: '/management/account-management',
          icon: renderIcon(ArrowRightOutlined),
          key: 'account-management'
        },
        {
          label: t('Manage_Role'),
          path: '/management/role-management',
          icon: renderIcon(ArrowRightOutlined),
          key: 'role-management'
        }
      ]
    },
    {
      label: t('configuration'),
      icon: renderIcon(SettingOutlined),
      key: 'configuration',
      children: [
        {
          label: t('Configuration_File'),
          path: '/configuration/file-configuration',
          icon: renderIcon(ArrowRightOutlined),
          key: 'file-configuration'
        },
        {
          label: t('Configuration_Email_Template'),
          path: '/configuration/email-configuration',
          icon: renderIcon(ArrowRightOutlined),
          key: 'email-configuration'
        },
        {
          label: t('Configuration_Email_Setting'),
          path: '/configuration/smtp-configuration',
          icon: renderIcon(ArrowRightOutlined),
          key: 'smtp-configuration'
        },
        {
          label: t('Configuration_Star'),
          path: '/configuration/star-configuration',
          icon: renderIcon(ArrowRightOutlined),
          key: 'star-configuration'
        },
        {
          label: t('Configuration_Task_Status'),
          path: '/configuration/task-status-configuration',
          icon: renderIcon(ArrowRightOutlined),
          key: 'task-status-configuration'
        },
        {
          label: t('Configuration_Task_Priority'),
          path: '/configuration/task-prioty-configuration',
          icon: renderIcon(ArrowRightOutlined),
          key: 'task-prioty-configuration'
        }
      ]
    }
  ];
  useEffect(() => {
    const pathName = location.pathname;
    const activeKey = findItemNodeByKeyOrPath('path', pathName);
    if (activeKey) {
      setSelectedKey([activeKey.key as string]);
    }
  }, []);

  const menuClick = (info: IMenuClickEvent) => {
    if (info.key) {
      setSelectedKey([info.key]);
      const path = findItemNodeByKeyOrPath('key', info.key)?.path;
      path && navigate(path);
      props?.onMenuClick?.(info.key);
    }
  };

  const findItemNodeByKeyOrPath = (key: 'key' | 'path', keyValue: string): CustomMenuItem | null => {
    if (!items || !keyValue) return null;
    const treeList = [...items];
    while (treeList.length > 0) {
      const treeItem = treeList.shift();
      if (!treeItem) return null;
      if (treeItem[key] === keyValue) {
        return treeItem;
      }
      treeItem.children?.forEach((child) => {
        treeList.push(child as CustomMenuItem);
      });
    }
    return null;
  };

  return (
    <Menu
      className={`${styles.leftNav} ${props.collapse && styles.expandLeftNav}`}
      selectedKeys={selectedKey}
      inlineCollapsed={props.collapse}
      inlineIndent={12}
      mode="inline"
      items={items as MenuItem[]}
      onClick={menuClick}
    />
  );
}

export default LeftNav;
