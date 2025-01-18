// src/utils/tokenService.ts
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenService = {
    getToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(ACCESS_TOKEN_KEY);
        }
        return null;
    },

    getAccessToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(ACCESS_TOKEN_KEY);
        }
        return null;
    },

    getRefreshToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(REFRESH_TOKEN_KEY);
        }
        return null;
    },

    setToken: (token: string): void => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(ACCESS_TOKEN_KEY, token);
        }
    },

    setTokens: (accessToken: string, refreshToken: string): void => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
    },

    removeToken: (): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
        }
    },

    clearTokens: (): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
    },

    isAuthenticated: (): boolean => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem(ACCESS_TOKEN_KEY);
        }
        return false;
    }
};