import { Button } from 'antd';
import styles from './NotFound.module.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import notFoundIcon from '@/common/assets/svg/page_background_404.svg';

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div
        className={styles.backgroundImage}
        // style={{
        //   backgroundImage: `url(https://png.pngtree.com/png-clipart/20210829/original/pngtree-error-404-page-not-found-png-image_6681621.jpg)`
        // }}
      />
      <p className={styles.title}>{t('Common_Oop')}</p>
      <p className={styles.description}>{t('Common_Oop_Description')}</p>
      <Link to="/">
        <Button>Back to home page</Button>
      </Link>
    </div>
  );
};

export default NotFound;
