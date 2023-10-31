import { routers } from './router/RouterConfig';
import Router from './common/router/router';
import { BreadcrumbProvider } from './components/breadcrum/Breadcrum';
import { ConfigProvider, App as AntdApp } from 'antd';
import TableEmpty from './components/tab-empty/TabEmpty';
import theme from './theme';
import './i18n';

function App() {
  const renderEmpty = (name?: string) => {
    if (name === 'Table') return <TableEmpty />;
  };
  return (
    <>
      <ConfigProvider theme={theme} renderEmpty={renderEmpty}>
        <AntdApp style={{ height: '100%' }}>
          <BreadcrumbProvider>
            <Router routers={routers}></Router>
          </BreadcrumbProvider>
        </AntdApp>
      </ConfigProvider>
    </>
  );
}

export default App;
