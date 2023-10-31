export interface IDataTable {
  id?: string;
  date?: string;
  listData?: IListData[];
}
export interface IListData {
  id: string;
  title: string;
  type?: number;
  content?: string;
  startTime?: string;
  endTime?: string;
}
export enum EWorkType {
  Success = 100000000,
  Warning = 100000001,
  Alert = 100000002
}
export const WorkType = [
  { label: 'Success', value: EWorkType.Success },
  { label: 'Warning', value: EWorkType.Warning },
  { label: 'Alert', value: EWorkType.Alert }
];
export const testDataTable: IDataTable[] = [
  {
    id: 's1',
    date: '2023-08-08',
    listData: [
      {
        id: 'a1',
        title: 'Title ne',
        type: 100000001,
        content: 'This is warning event.',
        startTime: '12:00',
        endTime: '13:00'
      },
      {
        id: 'a2',
        title: 'Title ne',
        type: 100000000,
        content: 'This is usual event.',
        startTime: '13:00',
        endTime: '14:00'
      }
    ]
  },
  {
    id: 's2',
    date: '2023-08-10',
    listData: [
      {
        id: 'a3',
        title: 'Title ne',
        type: 100000001,
        content: 'This is warning event.',
        startTime: '01:00',
        endTime: '03:00'
      },
      {
        id: 'a4',
        title: 'Title ne',
        type: 100000000,
        content: 'This is usual event.',
        startTime: '03:00',
        endTime: '05:00'
      },
      {
        id: 'a5',
        title: 'Title ne',
        type: 100000002,
        content: 'This is error event.',
        startTime: '07:00',
        endTime: '09:00'
      }
    ]
  },
  {
    id: 's3',
    date: '2023-08-15',
    listData: [
      {
        id: 'a6',
        title: 'Title ne',
        type: 100000001,
        content: 'This is warning event',
        startTime: '03:00',
        endTime: '05:00'
      },
      {
        id: 'a7',
        title: 'Title ne',
        type: 100000000,
        content: 'This is very long usual event......',
        startTime: '11:00',
        endTime: '12:00'
      },
      {
        id: 'a8',
        title: 'Title ne',
        type: 100000002,
        content: 'This is error event 1.',
        startTime: '12:00',
        endTime: '13:00'
      },
      {
        id: 'a9',
        title: 'Title ne',
        type: 100000002,
        content: 'This is error event 2.',
        startTime: '13:00',
        endTime: '15:00'
      },
      {
        id: 'a10',
        title: 'Title ne',
        type: 100000002,
        content: 'This is error event 3.',
        startTime: '15:00',
        endTime: '17:00'
      },
      {
        id: 'a11',
        title: 'Title ne',
        type: 100000002,
        content: 'This is error event 4.',
        startTime: '20:00',
        endTime: '22:00'
      }
    ]
  },
  {
    id: 's4',
    date: '2023-09-09',
    listData: [
      {
        id: 'a12',
        title: 'Title ne',
        type: 100000001,
        content: 'This is warning event 1',
        startTime: '01:00',
        endTime: '9:00'
      },
      {
        id: 'a13',
        title: 'Title ne',
        type: 100000001,
        content: 'This is warning event 2',
        startTime: '09:00',
        endTime: '12:00'
      },
      {
        id: 'a14',
        title: 'Title ne',
        type: 100000001,
        content: 'This is warning event 3',
        startTime: '12:00',
        endTime: '18:00'
      },
      {
        id: 'a15',
        title: 'Title ne',
        type: 100000001,
        content: 'This is warning event 4',
        startTime: '18:00',
        endTime: '24:00'
      }
    ]
  }
];
