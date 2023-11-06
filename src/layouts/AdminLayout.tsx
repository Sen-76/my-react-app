import { Affix, Drawer, Dropdown, Layout, MenuProps, Row, Tooltip } from 'antd';
import { IBreadcrumb, SiteBreadcrumb } from '../components/breadcrum/Breadcrum';
import UserAvatar from './components/user-avatar/UserAvatar';
import styles from './AdminLayout.module.scss';
import LeftNav from './components/left-navigation/LeftNav';
import { BarsOutlined, CalendarOutlined, TranslationOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useState } from 'react';
import logo from '@/assets/logo.png';
import logoLarge from '@/assets/logoLarge.png';
import Notification from './components/notification/Notification';
import { useLoginManager } from '@/common/helpers/login-manager';
import { Link } from 'react-router-dom';

export interface IProps {
  children?: React.ReactNode;
  breadcrumbItems: IBreadcrumb[];
}
function AdminLayout(props: IProps) {
  const { Header, Content } = Layout;
  const [expandLeftNav, setexpandLeftNav] = useState<boolean>(false);
  const [mobileNav, setmobileNav] = useState<boolean>(false);
  const { t } = useTranslation();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div style={{ minWidth: 150 }} onClick={() => i18next.changeLanguage('vn')}>
          {t('Common_Language_Vietnamese_Entry')}
        </div>
      )
    },
    {
      key: '2',
      label: (
        <div style={{ minWidth: 150 }} onClick={() => i18next.changeLanguage('en')}>
          {t('Common_Language_English_Entry')}
        </div>
      )
    }
  ];

  return (
    <>
      <Layout className={styles.siteLayout}>
        <div className={`${styles.lefNav} ${expandLeftNav && styles.expandLeftNav}`}>
          <div className={styles.logoWrap}>
            <Link to="/">
              {expandLeftNav ? (
                <img src={logo} alt="Logo" width="60" height="35" />
              ) : (
                <img src={logoLarge} alt="Logo" width="200" height="35" />
              )}
            </Link>
          </div>
          <LeftNav collapse={expandLeftNav}></LeftNav>
        </div>
        <Layout style={{ paddingLeft: expandLeftNav ? '80px' : '250px' }}>
          <Affix offsetTop={0}>
            <Header style={{ padding: '0 20px', background: '#fff', borderBottom: `1px solid #EEF2F5` }}>
              <Row style={{ height: '100%', overflow: 'hidden' }} justify="space-between" align="middle">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <BarsOutlined className={styles.barIcon} onClick={() => setexpandLeftNav(!expandLeftNav)} />
                  <BarsOutlined className={styles.barMobileIcon} onClick={() => setmobileNav(!mobileNav)} />
                  <SiteBreadcrumb items={props.breadcrumbItems}></SiteBreadcrumb>
                </div>
                <div className={styles.rightHeader}>
                  <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
                    <Tooltip color="#ffffff" placement="bottom" title={`${t('language')}`} arrow={true}>
                      <TranslationOutlined />
                    </Tooltip>
                  </Dropdown>
                  <Tooltip color="#ffffff" placement="bottom" title={`${t('calendar')}`} arrow={true}>
                    <CalendarOutlined />
                  </Tooltip>
                  <Notification />
                  <UserAvatar />
                </div>
              </Row>
            </Header>
          </Affix>
          <Content className={styles.content}>{props.children}</Content>
        </Layout>
      </Layout>
      <Drawer
        placement="left"
        width={250}
        closable={false}
        onClose={() => setmobileNav(false)}
        open={mobileNav}
        className={styles.mobileLeftNav}
      >
        <div className={styles.logoWrap}>
          <img src={logoLarge} alt="Logo" width="200" height="35" />
        </div>
        <LeftNav onMenuClick={() => setmobileNav(false)} />
      </Drawer>
    </>
  );
}

export default AdminLayout;
