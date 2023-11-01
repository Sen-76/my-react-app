import axiosInstance from '../axios-instance/index';

export const taskService = {
  async get(param: Common.IDataGrid): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/task/getAllTask', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async getMyTask(param: Common.IDataGrid): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/task/getMyTask', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async updateStatus(ids: A): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/task/updateStatusTask', ids);
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
      const response = await axiosInstance.post('/task/updateTask', param);
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
  },
  async uploadAttach(userData: A): Promise<A> {
    try {
      const response = await axiosInstance.post('/task/uploadAttach', userData);
      return response.data;
    } catch (error) {
      console.error('An error occurred while import files:', error);
      throw error;
    }
  }
};
