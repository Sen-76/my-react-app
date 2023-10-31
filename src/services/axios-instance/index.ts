import { cookie } from '@/common/helpers/cookie/cookie';
import { Modal } from 'antd';
import axios, { Canceler } from 'axios';

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
const user: A = cookie.getCookie('userLogin');
const token = JSON.parse(user)?.token ?? '';
const source = axios.CancelToken.source();
let cancelToken: Canceler | undefined;

const instance = axios.create({
  timeout: 600000,
  baseURL: apiUrl,
  headers: {
    // 'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  // withCredentials: true,
  cancelToken: source.token
});

// Request Interceptor
instance.interceptors.request.use(
  (config) => {
    // if (cancelToken) {
    //   cancelToken('Request canceled by the user.');
    // }
    // config.cancelToken = new axios.CancelToken(function executor(c) {
    //   cancelToken = c;
    // });
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      Modal.error({
        title: 'Unauthorized',
        content: 'Your session has expired. Please log in again.',
        onOk: () => {
          cookie.clearCookie('userLogin');
          location.href = '/login';
        }
      });
    }
    // else if (error.response.status === 422) {
    //   Modal.error({
    //     title: 'Api failure',
    //     content: 'Something wrong. Please check api again!'
    //   });
    // }
    else if (error.response.status !== 200 && error.response.status !== 422) {
      Modal.error({
        title: error.response.status,
        content: 'Something wrong!'
      });
    }
    return Promise.reject(error);
  }
);

export default instance;
