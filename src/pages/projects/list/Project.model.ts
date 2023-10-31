export enum EStatus {
  Active = 0,
  Pause = 1,
  Done = 2,
  Inactive = 3,
  Closed = 4
}
export const StatusOptions = [
  { label: 'Active', value: EStatus.Active },
  { label: 'Pause', value: EStatus.Pause },
  { label: 'Done', value: EStatus.Done },
  { label: 'Inactive', value: EStatus.Inactive },
  { label: 'Closed', value: EStatus.Closed },
];
