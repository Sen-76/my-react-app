import { service } from '@/services/apis';
import { cookie } from '../cookie/cookie';
import { permissionManager } from '../permission/permission';

export const useLoginManager = () => {
  const { getAllPermissionTest } = permissionManager();
  const loginOut = async () => {
    const url = '/login';
    if (url) {
      cookie.clearCookie('userLogin');
      localStorage.removeItem('avatar');
      sessionStorage.removeItem('permissions');
      sessionStorage.removeItem('allPermissions');
      location.href = url;
    }
  };

  const loginIn = async (userLogin: Authen.IUserLoginModel) => {
    try {
      const serializedObject = JSON.stringify(userLogin);
      const result = await service.authsService.login(userLogin);
      const data = {
        refreshToken: result.refreshToken,
        token: result.token,
        user: {
          id: result.user.id,
          fullName: result.user.fullName,
          userRole: result.user.userRole2.title,
          userEmail: result.user.userEmail
        }
      };
      if (userLogin.remember) {
        cookie.setCookie('userSave', serializedObject, 30);
      }
      cookie.setCookie('userLogin', JSON.stringify(data), 1);
      localStorage.setItem('token', data.token);
      localStorage.setItem('avatar', result.user.photoUrl);
      sessionStorage.setItem('permissions', JSON.stringify(result.user.userRole2.permissions.map((x: A) => x.id)));
      const permissions = await getAllPermissionTest(result.token);
      const customPermission = permissions.data.reduce((result: A, x: A) => {
        result[x.title] = x.permissions.reduce((result2: A, y: A) => {
          result2[y.keyI18n] = y.id;
          return result2;
        }, {});
        return result;
      }, {});
      sessionStorage.setItem('allPermissions', JSON.stringify(customPermission));
      const userDetail = await getUserLoginProfile(result.token, result.user.id);
      sessionStorage.setItem('userDetail', JSON.stringify(userDetail.data));
      location.href = '/';
    } catch (e: A) {
      console.log(e);
      if (e.response?.data.status === 422) {
        return e.response.data.errors;
      }
    }
  };

  const getUserLoginProfile = async (authToken: string, id: string) => {
    const url = import.meta.env.VITE_REACT_APP_API_URL + '/users/userDetail/' + id;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getSaveUser = () => {
    const user = cookie.getCookie('userSave');
    return JSON.parse(user as string);
  };

  const getLoginUser = () => {
    const user = cookie.getCookie('userLogin');
    return JSON.parse(user as string);
  };

  return {
    loginOut,
    loginIn,
    getSaveUser,
    getLoginUser
  };
};
