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
  },
  async delete(param: A): Promise<A> {
    try {
      const response = await axiosInstance.delete('/task/delete', {
        data: param
      });
      return response.data;
    } catch (error) {
      console.error('An error occurred while delete comment:', error);
      throw error;
    }
  },
  async update(param: A): Promise<A> {
    try {
      const response = await axiosInstance.post('/task/updateComment', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while update comment:', error);
      throw error;
    }
  }
};
