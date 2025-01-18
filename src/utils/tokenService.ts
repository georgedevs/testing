export const TOKEN_KEY = 'access_token';

export const tokenService = {
    getToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(TOKEN_KEY);
        }
        return null;
    },

    setToken: (token: string): void => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, token);
        }
    },

    removeToken: (): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY);
        }
    },

    isAuthenticated: (): boolean => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem(TOKEN_KEY);
            return !!token;
        }
        return false;
    }
};