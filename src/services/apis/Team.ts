/* eslint-disable no-useless-catch */
import axiosInstance from '../axios-instance/index';

export const teamService = {
  async get(param: Common.IDataGrid): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/team/get', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async create(param: Team.ITeamCreateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/team/create', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while create:', error);
      throw error;
    }
  },
  async update(param: Team.ITeamUpdateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/team/updateDepartment', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while update:', error);
      throw error;
    }
  },
  async kickMember(param: Team.IKickMemberModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/team/kickMember', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while kick:', error);
      throw error;
    }
  },
  async assignMember(param: Team.IKickMemberModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/team/assignMember', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while assign:', error);
      throw error;
    }
  },
  async getDetail(param: string): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.get('/team/teamDetail/' + param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async delete(param: Team.ITeamDeleteModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/team/delete', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async getMembers(param: string): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/team/member/' + param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async getMembersDetail(id: string | undefined, param: Common.IDataGrid): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/team/member/' + id, param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  }
};
