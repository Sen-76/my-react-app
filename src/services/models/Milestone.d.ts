declare namespace Milestone {
  export interface IMilestoneModel {
    id: string;
    title: string;
    description: string;
    projectId: string;
    dueDate: Date;
    startDate: Date;
    updateDate: DateTime;
    percentDone: number;
    __entity: string;
  }
  export interface IMilestoneCreateModel {
    title: string;
    description: string;
    projectId: string;
    dueDate: Date;
    startDate: Date;
  }
  export interface IMilestoneUpdateModel {
    id: string;
    title: string;
    description: string;
    projectId: string;
    dueDate: Date;
    startDate: Date;
  }
  export interface IMilestoneDeleteModel {
    isHardDelete: boolean;
    id: string[];
  }
}
