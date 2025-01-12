'use client'

import React, { useEffect, useState, Suspense } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Loader2, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useRegisterMutation } from '@/redux/feautures/auth/authApi';
import VerificationModal from '@/components/VerificationModal';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Heading from '@/components/Heading';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  fullName: Yup.string()
    .required('Full name is required'),
  gender: Yup.string()
    .required('Gender is required')
});

// Create a client-side only form component
const RegistrationForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [register, { isLoading }] = useRegisterMutation();
  const [showVerification, setShowVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registrationToken = searchParams.get('token');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      gender: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!registrationToken) {
        toast.error('Invalid registration link');
        return;
      }

      try {
        const result = await register({
          ...values,
          role: 'counselor',
          registrationToken
        }).unwrap();

        toast.success('Registration successful! Please verify your email.');
        setShowVerification(true);
      } catch (error: any) {
        toast.error(error.data?.message || 'Registration failed');
      }
    },
  });

  useEffect(() => {
    if (!registrationToken) {
      router.push('/');
      toast.error('Invalid registration link');
    }
  }, [registrationToken, router]);

  if (!registrationToken) return null;

  return (
    <Card className="max-w-lg mx-auto p-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent">
            Counselor Registration
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Complete your profile to join MiCounselor
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Full Name Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 rounded-lg pl-10 bg-gray-50 dark:bg-gray-700 
                  text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 
                  focus:ring-purple-500 dark:focus:ring-orange-500 
                  focus:border-purple-500 dark:focus:border-orange-500"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {formik.touched.fullName && formik.errors.fullName && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{formik.errors.fullName}</p>
            )}
          </motion.div>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 rounded-lg pl-10 bg-gray-50 dark:bg-gray-700 
                  text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 
                  focus:ring-purple-500 dark:focus:ring-orange-500 
                  focus:border-purple-500 dark:focus:border-orange-500"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{formik.errors.email}</p>
            )}
          </motion.div>

          {/* Password Fields */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password (min. 8 characters)"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 rounded-lg pl-10 pr-12 bg-gray-50 dark:bg-gray-700 
                    text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 
                    focus:ring-purple-500 dark:focus:ring-orange-500 
                    focus:border-purple-500 dark:focus:border-orange-500"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{formik.errors.password}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 rounded-lg pl-10 pr-12 bg-gray-50 dark:bg-gray-700 
                    text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 
                    focus:ring-purple-500 dark:focus:ring-orange-500 
                    focus:border-purple-500 dark:focus:border-orange-500"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{formik.errors.confirmPassword}</p>
              )}
            </motion.div>
          </div>

          {/* Gender Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Gender</label>
            <select
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 
                text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 
                focus:ring-purple-500 dark:focus:ring-orange-500 
                focus:border-purple-500 dark:focus:border-orange-500"
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{formik.errors.gender}</p>
            )}
          </motion.div>

          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg text-sm font-medium transition-all duration-300 
              bg-purple-600 dark:bg-orange-500 text-white
              hover:bg-purple-700 dark:hover:bg-orange-600
              focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-purple-500 dark:focus:ring-orange-500
              disabled:opacity-75 disabled:cursor-not-allowed
              relative"
          >
            <span className={`flex items-center justify-center ${isLoading ? 'invisible' : ''}`}>
              Complete Registration
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            )}
          </motion.button>
        </form>
      </motion.div>
      
      <VerificationModal
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
        email={formik.values.email}
      />
    </Card>
  );
};

// Main component with Suspense boundary
const CounselorRegistration = () => {
  return (
    <>
      <Heading 
        title='Counselor Registration | MiCounselor'
        description='MiCounselor is a platform that provides anonymous marriage and relationship counseling'
        keywords='Counseling, Registration, MiCounselor, Marriage'
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Header />
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Banner */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-purple-600 dark:text-orange-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Join Our Counseling Team
                </h1>
              </div>
              <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                Complete your registration to become a part of our professional counseling network.
              </p>
            </motion.div>

            <Suspense fallback={<div>Loading...</div>}>
              <RegistrationForm />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default CounselorRegistration;