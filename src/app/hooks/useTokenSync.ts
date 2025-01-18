// src/hooks/useTokenSync.ts
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { tokenService } from '@/utils/tokenService';
import { userLoggedOut } from '@/redux/feautures/auth/authSlice';

export const useTokenSync = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Handle storage events for cross-tab synchronization
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'access_token' && !e.newValue) {
                dispatch(userLoggedOut());
            }
        };

        // Handle token expiry
        const token = tokenService.getAccessToken();
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expiryTime = payload.exp * 1000;
                
                if (Date.now() >= expiryTime) {
                    tokenService.clearTokens();
                    dispatch(userLoggedOut());
                } else {
                    const timeoutId = setTimeout(() => {
                        tokenService.clearTokens();
                        dispatch(userLoggedOut());
                    }, expiryTime - Date.now());
                    
                    return () => clearTimeout(timeoutId);
                }
            } catch (error) {
                console.error('Error processing token:', error);
                tokenService.clearTokens();
                dispatch(userLoggedOut());
            }
        }

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [dispatch]);
};