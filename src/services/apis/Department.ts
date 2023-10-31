/* eslint-disable no-useless-catch */
import axiosInstance from '../axios-instance/index';

export const departmentService = {
  async create(role: Department.IDepartmentCreateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/department/create', role);
      return response.data;
    } catch (error) {
      console.error('An error occurred while create:', error);
      throw error;
    }
  },
  async update(role: Department.IDepartmentUpdateModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/department/updateDepartment', role);
      return response.data;
    } catch (error) {
      console.error('An error occurred while update:', error);
      throw error;
    }
  },
  async delete(role: Department.IDepartmentDeleteModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/department/delete', role);
      return response.data;
    } catch (error) {
      console.error('An error occurred while delete:', error);
      throw error;
    }
  },
  async kickMember(role: Department.IKickMemberModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/department/kickMember', role);
      return response.data;
    } catch (error) {
      console.error('An error occurred while kick:', error);
      throw error;
    }
  },
  async assignMember(role: Department.IKickMemberModel): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/department/assignMember', role);
      return response.data;
    } catch (error) {
      console.error('An error occurred while assign:', error);
      throw error;
    }
  },
  async get(param: Common.IDataGrid): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/department/get', param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async getDetail(param: string): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.get('/department/departmentDetail/' + param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async getMembers(param: string): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/department/member/' + param);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get:', error);
      throw error;
    }
  },
  async getMembersDetail(param: string | undefined, requestBody: Common.IDataGrid): Promise<Response.IDefaultResponse> {
    try {
      const response = await axiosInstance.post('/department/member/' + param, requestBody);
      return response.data;
    } catch (error) {
      console.error('An error occurred while get members list:', error);
      throw error;
    }
  }
};
