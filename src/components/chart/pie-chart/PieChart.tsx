import { useEffect, useRef, useState, useCallback } from 'react';
import { echarts } from '../echartInstall';
// Models
import { EChartsType } from 'echarts/core';
import styles from './PieChart.module.scss';
import { PieChartProps } from './PieChart.model';
import { Empty } from 'antd';

const generateOption = (props: PieChartProps) => {
  const { data, color } = props;
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b} {c} <div>{d}%</div>',
      textStyle: {
        color: '#000000'
      }
    },
    legend: {
      // top: 'middle',
      // right: '40px',
      //orient: 'vertical'
      bottom: '5px',
      left: 'center',
      orient: 'horizontal'
    },
    series: [
      {
        type: 'pie',
        radius: ['30%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data,
        color
      }
    ]
  };
};

const PieChart = (props: PieChartProps) => {
  const { data } = props;
  // const { type } = useDevice();
  const chartInstance = useRef<EChartsType>();

  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    chartInstance.current?.setOption(generateOption(props));
    const isEmptyResult = data.filter((item) => !!item.value).length === 0;
    setIsEmpty(isEmptyResult);
    if (isEmptyResult) {
      chartInstance.current = undefined;
    }
  }, [data]);

  const chartCanvaseRef = useCallback(
    (ref: A) => {
      if (!ref) return;
      if (chartInstance.current) return;
      chartInstance.current = echarts.init(ref, null, {
        height: '370px'
      });
      chartInstance.current?.setOption(generateOption(props));
      // chartInstance.current.on('click', (params) => {
      //   if (onClick) {
      //     const { name, dataIndex, value } = params;
      //     onClick({
      //       name,
      //       dataIndex,
      //       value: value as number
      //     });
      //   }
      // })
    },
    [props]
  );

  const resizeChart = () => {
    chartInstance.current?.resize();
  };
  useEffect(() => {
    window.addEventListener('resize', resizeChart);
    return () => {
      window.removeEventListener('resize', resizeChart);
    };
  }, []);

  return (
    <div className={styles.pieChart}>
      {isEmpty ? (
        <div className="empty-box">
          <Empty />
        </div>
      ) : (
        <div className="pie-chart-box">
          <div ref={chartCanvaseRef} className="pie-chart-canvas"></div>
        </div>
      )}
    </div>
  );
};

export default PieChart;
