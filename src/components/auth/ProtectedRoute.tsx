import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useLoadUserQuery } from '@/redux/feautures/api/apiSlice';
import AdminVerificationModal from '@/components/admin/AdminVerificationModal';
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
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/signin');
      } else if (!allowedRoles.includes(user.role)) {
        handleUnauthorizedAccess(user.role, router);
      } else if (user.role === 'admin') {
        const isVerified = sessionStorage.getItem('adminVerified');
        if (!isVerified) {
          setShowVerification(true);
        }
      }
    }
  }, [user, isLoading, router, allowedRoles]);

  const handleVerification = () => {
    setShowVerification(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (user && allowedRoles.includes(user.role)) {
    if (user.role === 'admin' && showVerification) {
      return <AdminVerificationModal isOpen={true} onVerify={handleVerification} />;
    }
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