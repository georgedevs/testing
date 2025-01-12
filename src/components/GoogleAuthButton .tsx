import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useGoogleAuthMutation } from '@/redux/feautures/auth/authApi';

interface GoogleAuthButtonProps {
  isLoading?: boolean;
  text?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ 
  isLoading: externalLoading = false, 
  text = "Continue with Google",
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [googleAuth,{isSuccess}] = useGoogleAuthMutation();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/dashboard'
      });
  
      console.log('Google SignIn Result:', result);
  
      if (!result?.ok) {
        throw new Error(result?.error || 'Failed to sign in with Google');
      }
  
      const sessionResponse = await fetch('/api/auth/session');
      const session = await sessionResponse.json();
  
      console.log('Session Data:', session);
  
      if (!session?.user?.email || !session?.user?.name) {
        throw new Error('Failed to get user data from Google');
      }
  
      // Call backend API
      try {
        const authResult = await googleAuth({
          email: session.user.email,
          name: session.user.name
        }).unwrap();
  
        console.log('Backend Auth Result:', authResult);
  
        if (!authResult?.accessToken) {
          throw new Error('Failed to authenticate with backend');
        }
        
        toast.success('Successfully signed in with Google!');
        onSuccess?.();
        router.push('/dashboard');
      } catch (backendError: any) {
        console.error('Backend Auth Error:', {
          error: backendError,
          data: backendError.data,
          status: backendError.status,
          message: backendError.data?.message || backendError.message
        });
        throw new Error(backendError.data?.message || 'Failed to authenticate with backend');
      }
    } catch (error) {
      
    }
  };
  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={isLoading || externalLoading}
      className={`
        w-full py-3 px-4 rounded-lg text-sm font-medium 
        flex items-center justify-center gap-3 
        transition-all duration-300
        bg-white dark:bg-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-600
        text-gray-700 dark:text-white
        border border-gray-300 dark:border-gray-600
        focus:outline-none focus:ring-2 
        focus:ring-purple-500 dark:focus:ring-orange-500
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      aria-label={isLoading ? 'Signing in with Google...' : 'Sign in with Google'}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <FcGoogle className="w-5 h-5" aria-hidden="true" />
      )}
      <span>{isLoading ? 'Signing in...' : text}</span>
    </button>
  );
};

export default GoogleAuthButton;