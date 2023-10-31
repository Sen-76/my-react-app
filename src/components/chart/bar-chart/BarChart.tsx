import { useEffect, useRef, useState, useCallback } from 'react';
import { BarChartProps, GenerateOptionFuc } from './BarChart.model';
import { echarts } from '../echartInstall';
// Models
import { EChartsType } from 'echarts/core';
import { Empty } from 'antd';
import styles from './BarChart.module.scss';

const generateOption: GenerateOptionFuc = (option) => {
  const { xAxisLabel, xAxisData } = option;
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      // X axis label
      data: xAxisLabel,
      triggerEvent: true,
      axisLabel: {
        // Show all x axis label, use 0
        interval: 0,
        // X axis styles
        fontSize: 13,
        lineHeight: 18,
        margin: 0,
        width: 70,
        color: '#222'
      },
      axisLine: {
        lineStyle: {
          // X axis color
          color: '#222'
        }
      },
      axisTick: {
        // X axis scale height
        length: 3
      }
    },
    // Y axis config
    yAxis: {
      // The Y-axis interval is an integer and will not appear as 0.5
      minInterval: 1,
      axisLabel: {
        // Y axis label color
        color: '#4B5566'
      }
    },
    // Bar background, color string array
    color: ['#1677ff'],
    series: [
      {
        type: 'bar',
        // Bar data
        data: xAxisData,
        // Bar width
        barWidth: '60%',
        // Number above Bar
        label: {
          show: true,
          color: '#222',
          position: 'top'
        }
      }
    ]
  };
};
const BarChart = (props: BarChartProps) => {
  const { xAxisLabel, xAxisData, customConfig, onClick } = props;

  const chartInstance = useRef<EChartsType>();
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    chartInstance.current?.setOption(generateOption({ xAxisLabel, xAxisData, customConfig }));
    const isEmptyResult = xAxisData.filter((item) => !!item).length === 0;
    setIsEmpty(isEmptyResult);
    if (isEmptyResult) {
      chartInstance.current = undefined;
    }
  }, [xAxisData]);

  // useEffect(() => {
  //   const resizeFunc = () => {
  //     chartInstance.current?.resize();
  //   };
  //   window.addEventListener('resize', resizeFunc);
  //   return () => {
  //     window.removeEventListener('resize', resizeFunc);
  //   };
  // }, []);

  const chartCanvaseRef = useCallback(
    (ref: A) => {
      if (!ref) return;
      if (chartInstance.current) return;
      const config: A = {
        height: '356px'
      };
      const boxWidth = ref?.parentElement?.clientWidth ?? 0;
      const displayNum = 5;
      const itemMinWidth = 120;
      const itemWidth = boxWidth ? (boxWidth as number) / displayNum : itemMinWidth;
      const calculateWidth = xAxisData.length * (itemWidth < itemMinWidth ? itemMinWidth : itemWidth);
      if (calculateWidth >= boxWidth) {
        config.width = calculateWidth + 'px';
      }
      chartInstance.current = echarts.init(ref, null, config);
      chartInstance.current.on('click', (params) => {
        if (onClick) {
          const { name, dataIndex, value } = params;
          onClick({
            name,
            dataIndex,
            value: value as number
          });
        }
      });
      chartInstance.current?.setOption(generateOption({ xAxisLabel, xAxisData, customConfig }));
    },
    [props]
  );

  return (
    <div className={styles.barChart}>
      {isEmpty ? (
        <div className="empty-box">
          <Empty />
        </div>
      ) : (
        <div className="hcis-scrollbar bar-chart-box">
          <div ref={chartCanvaseRef} className="bar-chart-canvas"></div>
        </div>
      )}
    </div>
  );
};
export default BarChart;
