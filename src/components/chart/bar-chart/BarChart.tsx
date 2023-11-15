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
      data: xAxisLabel,
      triggerEvent: true,
      axisLabel: {
        interval: 0,
        fontSize: 13,
        lineHeight: 18,
        margin: 1,
        width: 70,
        color: '#000000'
      },
      axisLine: {
        lineStyle: {
          color: '#000000'
        }
      },
      axisTick: {
        length: 3
      }
    },
    yAxis: {
      minInterval: 1,
      axisLabel: {
        color: '#4B5566'
      }
    },
    color: ['#1677ff'],
    series: [
      {
        type: 'bar',
        data: xAxisData
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
        height: '356px',
        width: '100%' // Set width to 100%
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
