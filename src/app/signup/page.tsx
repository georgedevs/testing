'use client'
import Heading from '@/components/Heading';
import SignupPage from '../pages/SignUpPage';

export default function SignupRoute() {
  return (
    <>
      <Heading
        title='Sign Up | MiCounselor'
        description='MiCounselor is a platform that provides anonymous marriage and relationship counseling'
        keywords='Counseling, Therapy, MiCounselor, Marriage'
      />
      <SignupPage />
    </>
  );
}