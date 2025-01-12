import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useLoadUserQuery } from '@/redux/feautures/api/apiSlice';

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
  const { isLoading, error } = useLoadUserQuery();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // User is not authenticated, redirect to login
        router.push('/signin');
      } else if (!allowedRoles.includes(user.role)) {
        // User's role is not allowed, redirect to appropriate dashboard
        switch (user.role) {
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
      }
    }
  }, [user, isLoading, router, allowedRoles]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If authenticated and authorized, render children
  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
};

export default ProtectedRoute;