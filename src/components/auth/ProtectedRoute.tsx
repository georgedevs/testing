import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useLoadUserQuery } from '@/redux/feautures/api/apiSlice';
import LoadingScreen from '../LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'client' | 'admin' | 'counselor'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['client', 'admin', 'counselor']
}) => {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const { isLoading } = useLoadUserQuery();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/signin');
      } else if (!allowedRoles.includes(user.role)) {
        handleUnauthorizedAccess(user.role, router);
      }
    }
  }, [user, isLoading, router, allowedRoles]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  return null;
};

const handleUnauthorizedAccess = (role: string, router: any) => {
  switch (role) {
    case 'client':
      router.push('/dashboard');
      break;
    case 'admin':
      router.push('/admin');
      break;
    case 'counselor':
      router.push('/counselor');
      break;
    default:
      router.push('/signin');
  }
};

export default ProtectedRoute;