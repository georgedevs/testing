'use client'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authService } from '@/utils/authService';
import { userLoggedOut } from '@/redux/feautures/auth/authSlice';
import { useLoadUserQuery } from '@/redux/feautures/api/apiSlice';

export default function SessionStatusChecker() {
  const { isError } = useLoadUserQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      // Session invalid or expired
      dispatch(userLoggedOut());
      authService.clearLoginStatus();
    }
  }, [isError, dispatch]);

  return null; // This component doesn't render anything
}