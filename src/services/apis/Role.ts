/* eslint-disable no-useless-catch */
import axiosInstance from '../axios-instance/index';

export const rolesService = {
  async create(role: Role.IRoleCreateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/role/create', role);
      return response.data;
    } catch (error) {
      console.error('An error occurred while create:', error);
      throw error;
    }
  },
  async get(param: Common.IDataGrid): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/role/get', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async update(param: Role.IRoleUpdateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/role/update', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while update:', error);
      throw error;
    }
  },
  async delete(param: Role.IRoleDeleteModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/role/delete', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while delete:', error);
      throw error;
    }
  },
  async detail(param: string): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.get('/role/roleDetail/' + param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while delete:', error);
      throw error;
    }
  }
};
