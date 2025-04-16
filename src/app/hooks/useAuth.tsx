import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useLoadUserQuery } from '@/redux/feautures/api/apiSlice';
import { RootState } from '@/redux/store';

export const useAuth = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useSelector((state: RootState) => state.auth);
  const { isLoading: apiLoading, error } = useLoadUserQuery((undefined));
  
  const isLoading = authLoading || apiLoading;

  const redirectToUserDashboard = () => {
    if (user) {
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
          router.push('/dashboard');
      }
    }
  };

  const userRole = user?.role;

  return {
    user,
    isLoading,
    isAuthenticated,
    userRole,
    error,
    redirectToUserDashboard
  };
};