declare namespace Role {
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
  export interface IRoleModel {
    id: string;
    title: string;
    description: string;
    createdDate: DateTime;
    updateDate: DateTime;
    __entity: string;
  }
}
