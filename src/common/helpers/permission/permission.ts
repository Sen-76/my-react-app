import { service } from '@/services/apis';

export const permissionManager = () => {
  const getAllPermission = async () => {
    try {
      const result = await service.permissionService.get();
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const getAllPermissionTest = async (authToken: string) => {
    const url = import.meta.env.VITE_REACT_APP_API_URL + '/permission/get';

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

  const checkHasPermission = (module: A, doNotHave = false) => {
    const myPermission = JSON.parse(sessionStorage.getItem('permissions') ?? '') as string[];
    if (myPermission[0] === '22697ebc-0ffa-4ffb-af28-15895b951728') return true;
    if (doNotHave) {
      return !myPermission.some((x: string) => module.includes(x));
    }
    return myPermission.some((x: string) => module.includes(x));
  };

  return {
    getAllPermission,
    getAllPermissionTest,
    checkHasPermission
  };
};
