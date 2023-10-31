/* eslint-disable no-useless-catch */
import axiosInstance from '../axios-instance/index';

export const taskTypeService = {
  async get(param: Common.IDataGrid): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/taskType/get', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async create(param: TaskType.ITaskTypeCreateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/taskType/create', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async update(param: TaskType.ITaskTypeUpdateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/taskType/update', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async delete(param: TaskType.ITaskTypeDeleteModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/taskType/delete', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async getDetail(param: string): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.get('/taskType/' + param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  }
};
