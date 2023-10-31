import { useBreadcrumb } from '@/components/breadcrum/Breadcrum';
import { BulbOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function Okrs() {
  const { setBreadcrumb } = useBreadcrumb();
  const { t } = useTranslation();

  useEffect(() => {
    setBreadcrumb([{ icon: <BulbOutlined />, text: `OKRs` }, { text: `${t('reviews')}` }]);
  }, [t]);

  return <>Okrs Views</>;
}

export default Okrs;
