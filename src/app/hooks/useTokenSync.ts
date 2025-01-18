// src/hooks/useTokenSync.ts
import { userLoggedOut } from '@/redux/feautures/auth/authSlice';
import { tokenService } from '@/utils/tokenService';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useTokenSync = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Handle storage events for cross-tab synchronization
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'access_token') {
                if (!e.newValue) {
                    dispatch(userLoggedOut());
                }
            }
        };

        // Handle token expiry
        const token = tokenService.getToken();
        if (token) {
            try {
                // Parse the token to get expiry
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expiryTime = payload.exp * 1000; // Convert to milliseconds
                
                if (Date.now() >= expiryTime) {
                    tokenService.removeToken();
                    dispatch(userLoggedOut());
                } else {
                    // Set timeout to remove token when it expires
                    const timeoutId = setTimeout(() => {
                        tokenService.removeToken();
                        dispatch(userLoggedOut());
                    }, expiryTime - Date.now());
                    
                    return () => clearTimeout(timeoutId);
                }
            } catch (error) {
                console.error('Error processing token:', error);
                tokenService.removeToken();
                dispatch(userLoggedOut());
            }
        }

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [dispatch]);
};