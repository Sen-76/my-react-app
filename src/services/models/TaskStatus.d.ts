declare namespace TaskStatus {
  export interface ITaskStatusModel {
    id: string;
    title: string;
    color: string;
    description: string;
    isDefault: string;
    order: number;
    __entity: string;
  }
  export interface ITaskStatusCreateModel {
    title: string;
    description: string;
    color: string;
  }
  export interface ITaskStatusUpdateModel {
    id: string;
    title: string;
    description: string;
    color: string;
  }
  export interface ITaskStatusDeleteModel {
    isHardDelete: boolean;
    id: string[];
  }
}
