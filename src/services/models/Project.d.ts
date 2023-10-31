declare namespace Project {
  export interface IRoleCreateModel {
    title?: string;
    description?: string;
    permissionIds?: string[];
  }
  export interface IRoleUpdateModel {
    id?: string;
    title?: string;
    description?: string;
    permissionIds?: string[];
  }
  export interface IRoleDeleteModel {
    isHardDelete: boolean;
    id: string[];
  }
  export interface IProjectModel {
    id: string;
    title: string;
    description: string;
    progress: number;
    startDate: DateTime;
    dueDate: DateTime;
    updateDate: DateTime;
    closeDate: DateTime;
    status: number;
    departmentId: string;
    teamId: string;
    __entity: string;
  }
}
