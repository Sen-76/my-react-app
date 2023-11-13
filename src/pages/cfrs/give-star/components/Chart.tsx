import BarChart from '@/components/chart/bar-chart/BarChart';
import styles from '../GiveStar.module.scss';
import { useTranslation } from 'react-i18next';

interface IProps {
  data: A[];
}
function Chart(props: IProps) {
  const monthNumber = 12;
  const monthsInYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const barChartData = {
    labels: monthsInYear,
    values: [10, 52, 200, 334, 390, 330, 220]
  };
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
