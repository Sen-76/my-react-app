import { useState, useEffect } from 'react';
import { PieChartProps } from '../../components/chart/pie-chart/PieChart.model';
import { BarChartInfo } from './Chart.model';

const useGetData = () => {
  const [pieChartData, setPieChartData] = useState<PieChartProps['data']>([]);
  const [barChartData, setBarChartData] = useState<BarChartInfo>({
    labels: [],
    values: []
  });
  useEffect(() => {
    setPieChartData([
      { name: 'Resolved', value: 5 },
      { name: 'Open', value: 20 },
      { name: 'Inprogress', value: 15 },
      { name: 'Finished', value: 1 }
    ]);
    setBarChartData({
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [10, 52, 200, 334, 390, 330, 220]
    });
  }, []);
  return {
    pieChartData,
    barChartData
  };
};
export default useGetData;
