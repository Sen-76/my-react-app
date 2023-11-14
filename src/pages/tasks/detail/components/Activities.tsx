import { Collapse, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import History from './History';
import Comment from './Comment';

interface IProps {
  commentList: A[];
  refreshCommentList: () => void;
  nextHistory: () => void;
  historyList: A[];
}
function Activities(props: Readonly<IProps>) {
  const { commentList, refreshCommentList, historyList, nextHistory } = props;
  const { t } = useTranslation();
  const onRenderNothing = () => {
    const tabItems = [
      {
        label: t('Task_Comments'),
        key: 'comment',
        children: <Comment commentList={commentList} refreshCommentList={refreshCommentList} />
      },
      {
        label: t('Task_Histories'),
        key: 'history',
        children: <History historyList={historyList} nextHistory={nextHistory} />
      }
    ];
    return <Tabs items={tabItems} size="large" />;
  };
  const items = [{ key: 'Activities', label: t('Common_Activities'), children: onRenderNothing() }];
  return <Collapse items={items} bordered={false} defaultActiveKey={['Activities']} ghost size="large" />;
}

export default Activities;
