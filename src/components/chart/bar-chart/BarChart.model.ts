import type { ECOption } from '../echart.model';
interface CustomConfig {
  barWidth?: string;
  barColor?: string[];
}
export interface BarChartClickParams {
  name: string;
  value: number;
  dataIndex: number;
}
export interface BarChartProps {
  xAxisLabel: string[];
  xAxisData: number[];
  customConfig?: CustomConfig;
  onClick?: (params: BarChartClickParams) => void;
}
export interface CustomOption {
  xAxisLabel: BarChartProps['xAxisLabel'];
  xAxisData: BarChartProps['xAxisData'];
  customConfig?: BarChartProps['customConfig'];
}
export type GenerateOptionFuc = (option: CustomOption) => ECOption;
