import { IKeyResult } from './../../../services/models/OKR';
import { OKRStatus, KeyResultPriority } from '@/common/enum/okr.enum';

export const OkrStatusColors = {
  [OKRStatus.NOT_STARTED]: 'mediumslateblue',
  [OKRStatus.ONTRACK]: 'cornflowerblue',
  [OKRStatus.BEHIND]: 'burlywood',
  [OKRStatus.COMPLETE]: 'forestgreen',
  [OKRStatus.REJECTED]: 'orangered'
};

export const getOkrProgress = (keyResults: IKeyResult[]) =>
  keyResults?.map((kr) => kr?.progress ?? 0).reduce((acc, curr) => acc + curr, 0) / keyResults?.length;

export const okrStatusOptions = Object.values(OKRStatus).map((value) => ({ label: value, value: value }));
export const keyResultrPriorityOptions = Object.values(KeyResultPriority).map((value) => ({
  label: value,
  value: value
}));
