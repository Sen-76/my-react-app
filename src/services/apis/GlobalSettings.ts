/* eslint-disable no-useless-catch */
import axiosInstance from '../axios-instance/index';

export const globalSettingsService = {
  async getGlobalSetting(): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.get('/globalSettings/get-all');
      return response.data;
    } catch (error) {
      console.error('An error occurred while get global setting:', error);
      throw error;
    }
  },
  async getByType(type: number): Promise<A> {
    try {
      const response = await axiosInstance.get('globalSettings/get-by-type/' + type);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get global setting:', error);
      throw error;
    }
  },
  async getAllEmailTemplate(): Promise<A> {
    try {
      const response = await axiosInstance.get('mail/getAllType');
      return response.data;
    } catch (error) {
      console.error('An error occurred while get email template:', error);
      throw error;
    }
  },
  async getAllEmailTemplateById(type: string): Promise<A> {
    try {
      const response = await axiosInstance.get('mail/getTeamplate/' + type);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get email template:', error);
      throw error;
    }
  },
  async updateEmailtemplate(type: string): Promise<A> {
    try {
      const response = await axiosInstance.get('mail/updateTemplate/' + type);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get email template:', error);
      throw error;
    }
  },
  async getById(id: string): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.get('/users/update/' + id);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get global setting:', error);
      throw error;
    }
  },
  async updateStar(star: Setting.IStarConfigModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/globalSettings/updateStars', star);
      return response.data;
    } catch (error) {
      console.error('An error occurred while update global setting:', error);
      throw error;
    }
  },
  async updateFileConfig(param: A): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/globalSettings/updateFileConfig', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while update global setting:', error);
      throw error;
    }
  }
};
