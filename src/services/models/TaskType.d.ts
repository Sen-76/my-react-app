declare namespace TaskType {
  export interface ITaskTypeModel {
    id: string;
    pname: string;
    iconUrl: string;
    description: string;
    isDefault: string;
    __entity: string;
  }
  export interface ITaskTypeCreateModel {
    pname: string;
    description: string;
    iconUrl: string;
  }
  export interface ITaskTypeUpdateModel {
    id: string;
    pname: string;
    description: string;
    iconUrl: string;
  }
  export interface ITaskTypeDeleteModel {
    isHardDelete: boolean;
    id: string[];
  }
}
