/* eslint-disable no-useless-catch */
import axiosInstance from '../axios-instance/index';

export const authsService = {
  async login(userLogin: Authen.IUserLoginModel): Promise<A> {
    try {
      const response = await axiosInstance.post('/auth/login', userLogin);
      return response.data;
    } catch (error) {
      console.error('An error occurred while login:', error);
      throw error;
    }
  }
};
