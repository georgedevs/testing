'use client'
import Heading from '@/components/Heading';
import SigninPage from '../pages/SignInPage';

export default function SigninRoute() {
  return (
    <>
      <Heading
        title='Sign In | MiCounselor'
        description='MiCounselor is a platform that provides anonymous marriage and relationship counseling'
        keywords='Counseling, Therapy, MiCounselor, Marriage'
      />
      <SigninPage />
    </>
  );
}