import { useEffect, useState } from 'react';
import { useLoadUserQuery } from '@/redux/feautures/api/apiSlice';
import { authService } from '@/utils/authService';

export const useAuthCheck = () => {
  const isLoggedInLocally = authService.isLoggedIn();
  
  // Run the API query if user is potentially logged in
  const { isLoading, error, refetch } = useLoadUserQuery(undefined, {
    skip: !isLoggedInLocally,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  return {
    isLoading: isLoggedInLocally ? isLoading : false,
    checkComplete: !isLoggedInLocally || !isLoading,
    revalidate: refetch
  };
};