declare namespace TaskPrioty {
  export interface ITaskPriotyModel {
    id: string;
    pname: string;
    iconUrl: string;
    description: string;
    isDefault: string;
    __entity: string;
  }
  export interface ITaskPriotyCreateModel {
    pname: string;
    description: string;
    iconUrl: string;
  }
  export interface ITaskPriotyUpdateModel {
    id: string;
    pname: string;
    description: string;
    iconUrl: string;
  }
  export interface ITaskPriotyDeleteModel {
    isHardDelete: boolean;
    id: string[];
  }
}
