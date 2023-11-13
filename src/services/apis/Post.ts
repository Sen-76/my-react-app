/* eslint-disable no-useless-catch */
import axiosInstance from '../axios-instance/index';

export const postService = {
  async get(param: Common.IDataGrid): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post(`/post/get`, param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async getTop10(param: A): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post(`/board/top10`, param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async delete(param: A): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.delete(`/post/delete/` + param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while delete:', error);
      throw error;
    }
  },
  async getJourney(param: A): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post(`/post/getJourney`, param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async createPost(post: Post.IPostCreateModel): Promise<A> {
    try {
      const response = await axiosInstance.post('/post/create', post);
      return response.data;
    } catch (error) {
      console.error('An error occurred while create:', error);
      throw error;
    }
  },
  async getStarOfNumber(): Promise<A> {
    try {
      const response = await axiosInstance.get('/post/user/stars');
      return response.data;
    } catch (error) {
      console.error('An error occurred while get start:', error);
      throw error;
    }
  }
};
