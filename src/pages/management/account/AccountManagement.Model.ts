export enum EState {
  Activate = 0,
  DeActivate = 1,
  Blocked = 2,
  Deleted = 3
}
export enum EDeleteState {
  None = 0,
  HardDelete = 1,
  SoftDelete = 2
}

export enum EGender {
  Male = 0,
  Female = 1,
  Other = 2
}

export const GenderOptions = [
  {
    label: 'Male',
    value: EGender.Male
  },
  {
    label: 'Female',
    value: EGender.Female
  }
];
export const DepartmentOptions = [
  {
    label: 'Tester',
    value: 'Tester'
  },
  {
    label: 'Developer',
    value: 'Developer'
  }
];
