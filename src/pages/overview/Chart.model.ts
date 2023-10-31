import { BarChartProps } from '../../components/chart/bar-chart/BarChart.model';

export interface BarChartInfo {
  labels: BarChartProps['xAxisLabel'];
  values: BarChartProps['xAxisData'];
}
