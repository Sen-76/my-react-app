import React, { useRef } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn';
import dayLocaleData from 'dayjs/plugin/localeData';
import { Badge, BadgeProps, Calendar, CalendarProps } from 'antd';
import { testDataTable, IDataTable } from '../TestPage.model';
import CalendarPanel from './CalendarPanel';

dayjs.extend(dayLocaleData);

const getListData = (value: Dayjs) => {
  const filteredData = testDataTable.filter(
    (x) =>
      Number(x.date?.split('-')[0]) === value.year() &&
      Number(x.date?.split('-')[1]) === value.month() + 1 &&
      Number(x.date?.split('-')[2]) === value.date()
  );

  return filteredData.length > 0 ? filteredData[0].listData : [];
};
const getMonthData = (value: Dayjs) => {
  const filteredData = testDataTable.filter(
    (x) => Number(x.date?.split('-')[0]) === value.year() && Number(x.date?.split('-')[1]) === value.month() + 1
  );
  return filteredData.length > 0 ? filteredData.length : 0;
};

const TestCalendar = () => {
  const panelRef = useRef();
  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <Badge status="warning" text={`${num} days have task in this month`} />
      </div>
    ) : null;
  };
  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData?.map((item) => (
          <li key={item.id}>
            <Badge status={item.type as BadgeProps['status']} text={item.title} />
          </li>
        ))}
      </ul>
    );
  };
  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };
  const onChange = (value: Dayjs) => {
    const filteredData = testDataTable.filter((x) => x.date?.toString() === value.format('YYYY-MM-DD').toString());
    if (filteredData.length > 0) {
      (panelRef.current as A).openDrawer(filteredData[0]);
    } else {
      const draftData: IDataTable = {};
      draftData.date = value.format('YYYY-MM-DD');
      (panelRef.current as A).openDrawer(draftData);
    }
  };
  const refreshList = () => {
    console.log('cc');
  };
  return (
    <>
      <Calendar cellRender={cellRender} onChange={onChange} style={{ height: '100vh' }} />
      <CalendarPanel ref={panelRef} refreshList={refreshList} />
    </>
  );
};

export default TestCalendar;
