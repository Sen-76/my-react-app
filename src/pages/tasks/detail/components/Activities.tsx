import { Collapse, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import Activity from './Activity';
import Comment from './Comment';

function Activities() {
  const { t } = useTranslation();
  const onRenderNothing = () => {
    const tabItems = [
      {
        label: t('Task_Comments'),
        key: 'comment',
        children: <Comment />
      },
      {
        label: t('Task_Activities'),
        key: 'history',
        children: <Activity />
      }
    ];
    const onTabChanged = () => {
      console.log('cc');
    };
    return <Tabs items={tabItems} size="large" onChange={onTabChanged} />;
  };
  const items = [{ key: 'Activities', label: t('Common_Activities'), children: onRenderNothing() }];
  return <Collapse items={items} bordered={false} defaultActiveKey={['Activities']} ghost size="large" />;
}

export default Activities;
