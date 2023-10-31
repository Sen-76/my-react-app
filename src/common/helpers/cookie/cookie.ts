export const cookie = {
  setCookie(name: string, value: string, daysToExpire: number) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + expirationDate.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
  },

  clearCookie(name: string) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  },

  getCookie(name: string) {
    const cookieString = decodeURIComponent(document.cookie);
    const cookieArray = cookieString.split('; ');

    for (const cookie of cookieArray) {
      const [cookieName, cookieValue] = cookie.split('=');

      if (cookieName === name) {
        return cookieValue;
      }
    }

    return null;
  }
};
