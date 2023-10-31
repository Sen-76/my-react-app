declare namespace Common {
  export interface IDataGrid {
    filter?: IFilter[] | null;
    searchInfor?: ISearchInfo | null;
    pageInfor?: IPageInfo | null;
    orderInfor?: IOrderInfo | null;
  }
  export interface IFilter {
    key?: string;
    value?: A[];
    operators?: string;
  }
  export interface ISearchInfo {
    searchValue?: string | number;
    searchColumn?: string[];
  }
  export interface IPageInfo {
    pageSize?: number;
    pageNumber?: number;
    totalItems?: number;
  }
  export interface IOrderInfo {
    orderBy?: string[];
    isAssending?: boolean[];
  }
}
