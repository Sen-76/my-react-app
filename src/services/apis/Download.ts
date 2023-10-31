/* eslint-disable no-useless-catch */
import axiosInstance from '../axios-instance/index';

export const downloadService = {
  async downloadTemplate(fileName: string): Promise<A> {
    try {
      const response = await axiosInstance.get(`/dowload/teamplate/${fileName}`, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.error('An error occurred while download:', error);
      throw error;
    }
  }
};
