/* eslint-disable no-useless-catch */
import axiosInstance from '../axios-instance/index';

export const permissionService = {
  async get(): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.get('/permission/get');
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  }
};
