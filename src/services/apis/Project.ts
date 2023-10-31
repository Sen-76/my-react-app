import axiosInstance from '../axios-instance/index';

export const projectService = {
  async get(param: Common.IDataGrid): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/project/get', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async restoreProject(ids: string[]): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/project/restore', ids);
      return response.data;
    } catch (error) {
      console.error('An error occurred while restore project:', error);
      throw error;
    }
  },
  async getDetail(param: string): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.get('/project/project/' + param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async create(param: Department.IDepartmentCreateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/project/create', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while create:', error);
      throw error;
    }
  },
  async update(param: Department.IDepartmentUpdateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/project/update', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while update:', error);
      throw error;
    }
  },
  async delete(param: Department.IDepartmentDeleteModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/project/delete', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while delete:', error);
      throw error;
    }
  }
};
