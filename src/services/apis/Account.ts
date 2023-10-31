import axiosInstance from '../axios-instance/index';

export const accountService = {
  async getAccount(userData: Common.IDataGrid): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/users/get', userData);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get accounts:', error);
      throw error;
    }
  },
  async getDetal(id: string): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.get('/users/userDetail/' + id);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get accounts:', error);
      throw error;
    }
  },
  async addAccount(userData: Account.IAccountCreateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/users/create', userData);
      return response.data;
    } catch (error) {
      console.error('An error occurred while adding the account:', error);
      throw error;
    }
  },
  async updateAccount(userData: Account.IAccountUpdateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/users/update', userData);
      return response.data;
    } catch (error) {
      console.error('An error occurred while updating the account:', error);
      throw error;
    }
  },
  async deleteAccount(deleteData: Account.IAccountDeleteModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/users/delete', deleteData);
      return response.data;
    } catch (error) {
      console.error('An error occurred while deleting accounts:', error);
      throw error;
    }
  },
  async restoreAccount(ids: string[]): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/users/restoreUser', ids);
      return response.data;
    } catch (error) {
      console.error('An error occurred while restore accounts:', error);
      throw error;
    }
  },
  async activeAccount(ids: string[]): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/users/active', ids);
      return response.data;
    } catch (error) {
      console.error('An error occurred while restore accounts:', error);
      throw error;
    }
  },
  async deactiveAccount(ids: string[]): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.get('/users/deactive/' + ids);
      return response.data;
    } catch (error) {
      console.error('An error occurred while restore accounts:', error);
      throw error;
    }
  },
  async updateProfile(userData: Account.IAccountUpdateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/users/update-profile', userData);
      return response.data;
    } catch (error) {
      console.error('An error occurred while updating the account:', error);
      throw error;
    }
  },
  async changePassword(userData: Account.IChangePasswordModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/users/changePassword', userData);
      return response.data;
    } catch (error) {
      console.error('An error occurred while updating the account:', error);
      throw error;
    }
  },
  async importExcel(userData: A): Promise<A> {
    try {
      const response = await axiosInstance.post('/users/excel', userData);
      return response.data;
    } catch (error) {
      console.error('An error occurred while import files:', error);
      throw error;
    }
  },
  async uploadAvatar(userData: A): Promise<A> {
    try {
      const response = await axiosInstance.post('/users/uploadAvatar', userData);
      return response.data;
    } catch (error) {
      console.error('An error occurred while import files:', error);
      throw error;
    }
  }
};
