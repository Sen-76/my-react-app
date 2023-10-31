import axiosInstance from '../axios-instance/index';

export const taskService = {
  async get(param: Common.IDataGrid): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/task/get', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async restoretask(ids: string[]): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/task/restore', ids);
      return response.data;
    } catch (error) {
      console.error('An error occurred while restore task:', error);
      throw error;
    }
  },
  async getDetail(param: string): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.get('/task/getTaskDetail/' + param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async create(param: Department.IDepartmentCreateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/task/create', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while create:', error);
      throw error;
    }
  },
  async update(param: Department.IDepartmentUpdateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/task/update', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while update:', error);
      throw error;
    }
  },
  async delete(param: Department.IDepartmentDeleteModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/task/delete', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while delete:', error);
      throw error;
    }
  }
};
