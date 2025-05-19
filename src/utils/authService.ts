export const AUTH_STATUS_KEY = 'auth_status';

export const authService = {
  setLoginStatus: (isLoggedIn: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STATUS_KEY, String(isLoggedIn));
    }
  },

  isLoggedIn: (): boolean => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_STATUS_KEY) === 'true';
    }
    return false;
  },

  clearLoginStatus: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STATUS_KEY);
    }
  }
};