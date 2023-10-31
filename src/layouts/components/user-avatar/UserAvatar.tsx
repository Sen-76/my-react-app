import { Avatar, Divider, Dropdown, MenuProps } from 'antd';
import { ImportOutlined, RedoOutlined, UserOutlined } from '@ant-design/icons';
import styles from './UserAvatar.module.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { util } from '@/common/helpers/util';
import { useLoginManager } from '@/common/helpers/login-manager';
import React from 'react';

function UserAvatar() {
  const { t } = useTranslation();
  const { loginOut } = useLoginManager();
  const { getLoginUser } = useLoginManager();
  const userLoged = getLoginUser().user;

  const menuStyle = {
    boxShadow: 'none'
  };
  const dropdownItem = () => {
    const items: MenuProps['items'] = [
      {
        label: (
          <Link to="/user/profile" className={styles.avatarDropdownItem}>
            <UserOutlined />
            <div className="dropdown-item-text">{t('profile')}</div>
          </Link>
        ),
        key: '1'
      },
      {
        label: (
          <Link to="/user/change-password" className={styles.avatarDropdownItem}>
            <RedoOutlined />
            <div className="dropdown-item-text">{t('Common_ChangePassword')}</div>
          </Link>
        ),
        key: '2'
      },
      {
        label: (
          <div onClick={loginOut} className={styles.avatarDropdownItem}>
            <ImportOutlined />
            <div className="dropdown-item-text">{t('sign out')}</div>
          </div>
        ),
        key: '3'
      }
    ];
    return items;
  };

  return (
    <>
      <Dropdown
        menu={{ items: dropdownItem() }}
        trigger={['click']}
        placement="bottomRight"
        arrow
        dropdownRender={(menu) => (
          <div
            style={{
              backgroundColor: '#ffffff',
              boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px'
            }}
          >
            <div className={styles.avatarHeader}>
              <Avatar
                size={50}
                src={localStorage.getItem('avatar')}
                style={{ marginRight: '16px', backgroundColor: util.randomColor() }}
              >
                {userLoged?.fullName?.charAt(0)}
              </Avatar>
              <div className="avatar-header-content">
                <div className="avatar-header-name">{userLoged?.fullName}</div>
                <div className="avatar-header-role">{userLoged?.userRole}</div>
              </div>
            </div>
            <Divider style={{ margin: 0 }} />
            {React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
          </div>
        )}
      >
        <Avatar
          size={40}
          src={localStorage.getItem('avatar')}
          style={{ cursor: 'pointer', backgroundColor: util.randomColor() }}
        >
          {userLoged?.fullName?.charAt(0)}
        </Avatar>
      </Dropdown>
    </>
  );
}

export default UserAvatar;
