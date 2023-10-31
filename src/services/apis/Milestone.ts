/* eslint-disable no-useless-catch */
import axiosInstance from '../axios-instance/index';

export const milestoneService = {
  async get(param: Common.IDataGrid): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post(`/milestone/get`, param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async create(param: Milestone.IMilestoneCreateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post(`/milestone/create`, param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while create:', error);
      throw error;
    }
  },
  async update(param: Milestone.IMilestoneUpdateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post(`/milestone/update`, param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while update:', error);
      throw error;
    }
  },
  async delete(param: Milestone.IMilestoneDeleteModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post(`/milestone/delete`, param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while delete:', error);
      throw error;
    }
  },
  async getDetail(param: string): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.get(`/milestone/milestone/` + param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  }
};
