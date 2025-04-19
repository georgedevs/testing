// src/utils/useAuthCheck.ts
import { useEffect, useState } from 'react';
import { tokenService } from '@/utils/tokenService';
import { useLoadUserQuery } from '@/redux/feautures/api/apiSlice';

export const useAuthCheck = () => {
  // Only run the API query if we have a token stored
  const hasStoredToken = Boolean(tokenService.getAccessToken());
  
  // Skip the query if we don't have a token to check
  const { isLoading, error, refetch } = useLoadUserQuery(undefined, {
    skip: !hasStoredToken,
    // Additional RTK Query options to reduce refetching
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  return {
    isLoading: hasStoredToken ? isLoading : false,
    // Don't expose auth errors to components using this hook
    // Components only need to know if a check is in progress
    checkComplete: !hasStoredToken || !isLoading,
    // Only make this available if you need to manually trigger a recheck
    revalidate: refetch
  };
};