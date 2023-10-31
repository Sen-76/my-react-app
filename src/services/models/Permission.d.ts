declare namespace Permission {
  export interface IPermissionModel {
    id: string;
    title: string;
    description?: string;
    content: string;
    resource: number;
    keyI18n: string;
    __entity: string;
  }
  export interface IRolePermissionModel {
    title: string;
    permissions: IPermissionModel[];
  }
}
