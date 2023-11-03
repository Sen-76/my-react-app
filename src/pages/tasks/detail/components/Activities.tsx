import { Collapse, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

function Activities() {
  const { t } = useTranslation();
  const onRenderNothing = () => {
    return <Typography>This feature is comming soon</Typography>;
  };
  const items = [{ key: 'Activities', label: t('Common_Activities'), children: onRenderNothing() }];
  return (
    <>
      <Collapse items={items} bordered={false} defaultActiveKey={['Activities']} ghost size="large" />
    </>
  );
}

export default Activities;
