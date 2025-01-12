import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useLoadUserQuery } from '@/redux/feautures/api/apiSlice';

export const useAuth = () => {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const { isLoading, error } = useLoadUserQuery((undefined));

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

  const isAuthenticated = !!user;
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