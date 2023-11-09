/* eslint-disable no-useless-catch */
import axiosInstance from '../axios-instance/index';

export const commentService = {
  async add(param: A): Promise<A> {
    try {
      const response = await axiosInstance.post('/task/comment', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while comment:', error);
      throw error;
    }
  },
  async get(param: A): Promise<A> {
    try {
      const response = await axiosInstance.post('/task/getComment', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get comment:', error);
      throw error;
    }
  }
};
