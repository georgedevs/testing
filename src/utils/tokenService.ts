// src/utils/tokenService.ts
// This file is significantly changed to work with cookies instead of localStorage

export const tokenService = {
    // For cookie-based auth, these get/set functions are mostly for compatibility
    // with existing code. The actual tokens are managed by the server via HTTP-only cookies.
    
    isAuthenticated: (): boolean => {
        // Since we can't directly check HTTP-only cookies from JS,
        // we rely on the server to validate authentication status
        // This is effectively a placeholder for API calls to check auth status
        return true;
    },
    
    // These methods remain for compatibility but don't actually read tokens
    getToken: (): null => null,
    getAccessToken: (): null => null,
    getRefreshToken: (): null => null,
    
    // These methods remain for compatibility but don't actually set tokens
    setToken: (): void => {},
    setTokens: (): void => {},
    
    // These methods remain for compatibility but don't actually remove tokens
    removeToken: (): void => {},
    clearTokens: (): void => {},
    
    // Method to trigger a token refresh via API call
    refreshToken: async (): Promise<boolean> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/refresh`, {
                method: 'POST',
                credentials: 'include', // This is important for cookies
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            return false;
        }
    }
};