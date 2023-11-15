import BarChart from '@/components/chart/bar-chart/BarChart';
import styles from '../GiveStar.module.scss';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Select } from 'antd';

interface IProps {
  data: A[];
}
function Chart(props: IProps) {
  const [monthNumber, setMonthNumber] = useState<number>(12);
  const { t } = useTranslation();
  const month = [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Feb' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' },
    { value: 5, label: 'May' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Aug' },
    { value: 9, label: 'Sep' },
    { value: 10, label: 'Oct' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dec' }
  ];

  const monthSelect = [
    {
      label: t('3 months'),
      value: 3
    },
    {
      label: t('6 months'),
      value: 6
    },
    {
      label: t('9 months'),
      value: 9
    },
    {
      label: t('12 months'),
      value: 12
    }
  ];

  const [barChartData, setBarChartData] = useState({
    labels: month.map((x) => x.label),
    values: [10, 52, 200, 334, 390, 330, 220]
  });

  useEffect(() => {
    const labels: A = month.map((x) => x.value <= monthNumber && x.label).filter((x) => x !== false);
    const values: A = [];
    for (let i = 1; i <= monthNumber; i++) {
      props.data?.forEach((x) => (x.month === i ? values.push(x.numberStars) : values.push(0)));
    }
    setBarChartData({
      labels,
      values
    });
  }, [props.data, monthNumber]);

  return (
    <div className={styles.draft}>
      <div className={styles.header}>
        {t('CFRs_Your_Journey_Entry')}
        <Select
          style={{ width: 200 }}
          defaultValue={12}
          onChange={(val) => setMonthNumber(val)}
          options={monthSelect}
        ></Select>
      </div>
      <div className={styles.chartWrap}>
        <BarChart xAxisData={barChartData.values} xAxisLabel={barChartData.labels} />
      </div>
    </div>
  );
}
export default Chart;
