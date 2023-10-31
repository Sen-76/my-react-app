/* eslint-disable no-useless-catch */
import axiosInstance from '../axios-instance/index';

export const taskPriotyService = {
  async get(param: Common.IDataGrid): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/prioty/get', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async create(param: TaskPrioty.ITaskPriotyCreateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/prioty/create', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async update(param: TaskPrioty.ITaskPriotyUpdateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/prioty/update', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async delete(param: TaskPrioty.ITaskPriotyDeleteModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/prioty/delete', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async getDetail(param: string): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.get('/prioty/' + param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  }
};
