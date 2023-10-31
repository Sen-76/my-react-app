import { BellOutlined } from '@ant-design/icons';
import { Avatar, Divider, Dropdown, MenuProps, Radio, Tooltip, Space, Button, Badge } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './Notification.module.scss';
import { util } from '@/common/helpers/util';
import React, { useState, useEffect } from 'react';
import Paragraph from 'antd/es/typography/Paragraph';

const draftNotification = [
  {
    id: '1',
    title: 'This is the title',
    description: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationDetail: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationLink: '/user/profile',
    notificationType: 'type là gì?',
    user: {
      photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
      userName: 'Sen'
    }
  },
  {
    id: '2',
    title: 'This is the title',
    description: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationDetail: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationLink: '/user/profile',
    notificationType: 'type là gì?',
    user: {
      photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
      userName: 'Sen'
    }
  },
  {
    id: '3',
    title: 'This is the title',
    description: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationDetail: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationLink: '/user/profile',
    notificationType: 'type là gì?',
    user: {
      photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
      userName: 'Sen'
    }
  },
  {
    id: '3',
    title: 'This is the title',
    description: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationDetail: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationLink: '/user/profile',
    notificationType: 'type là gì?',
    user: {
      photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
      userName: 'Sen'
    }
  },
  {
    id: '3',
    title: 'This is the title',
    description: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationDetail: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationLink: '/user/profile',
    notificationType: 'type là gì?',
    user: {
      photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
      userName: 'Sen'
    }
  },
  {
    id: '3',
    title: 'This is the title',
    description: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationDetail: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationLink: '/user/profile',
    notificationType: 'type là gì?',
    user: {
      photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
      userName: 'Sen'
    }
  },
  {
    id: '3',
    title: 'This is the title',
    description: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationDetail: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationLink: '/user/profile',
    notificationType: 'type là gì?',
    user: {
      photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
      userName: 'Sen'
    }
  },
  {
    id: '3',
    title: 'This is the title',
    description: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationDetail: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationLink: '/user/profile',
    notificationType: 'type là gì?',
    user: {
      photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
      userName: 'Sen'
    }
  },
  {
    id: '3',
    title: 'This is the title',
    description: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationDetail: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationLink: '/user/profile',
    notificationType: 'type là gì?',
    user: {
      photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
      userName: 'Sen'
    }
  },
  {
    id: '3',
    title: 'This is the title',
    description: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationDetail: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationLink: '/user/profile',
    notificationType: 'type là gì?',
    user: {
      photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
      userName: 'Sen'
    }
  },
  {
    id: '3',
    title: 'This is the title',
    description: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationDetail: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationLink: '/user/profile',
    notificationType: 'type là gì?',
    user: {
      photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
      userName: 'Sen'
    }
  },
  {
    id: '3',
    title: 'This is the title',
    description: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationDetail: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationLink: '/user/profile',
    notificationType: 'type là gì?',
    user: {
      photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
      userName: 'Sen'
    }
  },
  {
    id: '3',
    title: 'This is the title',
    description: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationDetail: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationLink: '/user/profile',
    notificationType: 'type là gì?',
    user: {
      photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
      userName: 'Sen'
    }
  },
  {
    id: '3',
    title: 'This is the title',
    description: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationDetail: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationLink: '/user/profile',
    notificationType: 'type là gì?',
    user: {
      photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
      userName: 'Sen'
    }
  },
  {
    id: '3',
    title: 'This is the title',
    description: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationDetail: 'Lorum gì gì đấy quên rồi, mà sao lại là lorum?',
    notificationLink: '/user/profile',
    notificationType: 'type là gì?',
    user: {
      photoUrl: 'https://top10tphcm.com/wp-content/uploads/2023/02/hinh-anh-meo.jpeg',
      userName: 'Sen'
    }
  }
];
function Notification() {
  const { t } = useTranslation();
  const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);

  useEffect(() => {
    getNotification();
  }, []);

  const menuStyle = {
    boxShadow: 'none'
  };

  const getNotification = () => {
    setMenuItems(
      draftNotification.map((noti) => ({
        label: (
          <Link to={noti.notificationLink} className={styles.notiDropdownItem}>
            <Avatar
              size={40}
              src={noti.user.photoUrl}
              style={{ marginRight: '16px', backgroundColor: util.randomColor() }}
            >
              {noti.user.userName.charAt(0)}
            </Avatar>
            <div>
              <Paragraph
                ellipsis={{ rows: 1, expandable: false }}
                style={{ maxWidth: 300, minWidth: 30, fontWeight: 500 }}
              >
                {noti.title}
              </Paragraph>

              <Paragraph ellipsis={{ rows: 2, expandable: false }} style={{ maxWidth: 300, minWidth: 30 }}>
                {noti.notificationDetail}
              </Paragraph>
            </div>
            <Radio style={{ marginLeft: 20 }}></Radio>
          </Link>
        ),
        key: noti.id
      }))
    );
  };

  return (
    <>
      <Dropdown
        trigger={['click']}
        placement="bottomRight"
        menu={{ items: menuItems }}
        className={styles.notiDropdown}
        overlayClassName={styles.notiOverlay}
        dropdownRender={(menu) => (
          <div
            style={{
              backgroundColor: '#ffffff',
              boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px'
            }}
          >
            <div className={styles.notiheader}>
              <div className={styles.title}>Notification</div>
              <div className={styles.markRead}>Mark all as read</div>
            </div>
            <Divider style={{ margin: 0 }} />
            {React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
            <Divider style={{ margin: 0 }} />
            <Space style={{ padding: 8, display: 'flex', justifyContent: 'center' }}>
              <Button size="small" style={{ width: 100 }} type="primary">
                {t('Common_ViewAll')}
              </Button>
            </Space>
          </div>
        )}
      >
        <Tooltip color="#ffffff" placement="bottom" title={`${t('notification')}`} arrow={true}>
          <Badge count={draftNotification.length}>
            <BellOutlined />
          </Badge>
        </Tooltip>
      </Dropdown>
    </>
  );
}

export default Notification;
