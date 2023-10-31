import BarChart from '@/components/chart/bar-chart/BarChart';
import styles from '../GiveStar.module.scss';
import useGetData from '@/pages/overview/useGetData';
import { useTranslation } from 'react-i18next';

function Chart() {
  const { barChartData } = useGetData();
  const { t } = useTranslation();
  return (
    <div className={styles.draft}>
      <div className={styles.header}>{t('CFRs_Your_Journey_Entry')}</div>
      <div className={styles.chartWrap}>
        <BarChart xAxisData={barChartData.values} xAxisLabel={barChartData.labels} />
      </div>
    </div>
  );
}
export default Chart;
