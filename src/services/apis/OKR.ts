import axiosInstance from '../axios-instance/index';
import { IOKRModel } from '../models/OKR';

export const okrService = {
  async get(params: { userId: string; range: Date }) {
    return axiosInstance.get(`/okrs`, { params });
  },

  async getDetails(id: string) {
    return axiosInstance.get(`/okrs/${id}`);
  },

  async create(body: IOKRModel) {
    return axiosInstance.post(`/okrs/create`, { ...body });
  },

  async update(body: IOKRModel) {
    return axiosInstance.patch(`/okrs/update`, { ...body });
  }
};
