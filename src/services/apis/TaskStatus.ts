/* eslint-disable no-useless-catch */
import axiosInstance from '../axios-instance/index';

export const taskStatusService = {
  async get(param: Common.IDataGrid): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/status/get', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async create(param: TaskStatus.ITaskStatusCreateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/status/create', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async update(param: TaskStatus.ITaskStatusUpdateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/status/update', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async delete(param: TaskStatus.ITaskStatusDeleteModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/status/delete', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async getDetail(param: string): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.get('/status/status/' + param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  }
};
