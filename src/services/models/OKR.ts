import { KeyResultPriority, OKRStatus } from '@/common/enum/okr.enum';

export type IOKRModel = Partial<{
  id: string;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  status: OKRStatus;
  keyResults: IKeyResult[];
  user: {
    id: string;
    fullName: string;
  };
}>;

export type IKeyResult = Partial<{
  title: string;
  planLink: string;
  progress: number;
  priority: KeyResultPriority;
}>;
