import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, Key, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useForgotPasswordMutation, useResetPasswordMutation } from '@/redux/feautures/auth/authApi';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emailValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const resetPasswordValidationSchema = Yup.object({
  otp: Yup.string()
    .length(6, 'OTP must be exactly 6 digits')
    .matches(/^\d+$/, 'OTP must contain only numbers')
    .required('OTP is required'),
  newPassword: Yup.string()
  .min(8, 'Password must be at least 8 characters')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/[0-9]/, 'Password must contain at least one number')
  .matches(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Password must contain at least one special character'
  )
  .required('Please enter your password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [resetToken, setResetToken] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  
  const [forgotPassword, { isLoading: isSendingOTP }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const handleClose = () => {
    setStep('email');
    setResetToken('');
    setErrorMessage('');
    setSuccessMessage('');
    setUserEmail('');
    onClose();
  };

  const handleEmailSubmit = async (values: { email: string }) => {
    try {
      setErrorMessage('');
      const response = await forgotPassword(values.email).unwrap();
      
      // Store the user's email for the next step
      setUserEmail(values.email);
      
      // In development mode, the API might return a resetToken for testing
      if (response.resetToken) {
        setResetToken(response.resetToken);
      }
      
      setSuccessMessage('If your email exists in our system, you will receive an OTP shortly.');
      setStep('reset');
    } catch (error: any) {
      setErrorMessage(error.data?.message || 'An error occurred. Please try again later.');
    }
  };

  const handleResetSubmit = async (values: any) => {
    try {
      setErrorMessage('');
      
      // If we don't have a token from the API (production mode), use email and OTP
      const resetData = resetToken 
        ? { resetToken, newPassword: values.newPassword }
        : { email: userEmail, otp: values.otp, newPassword: values.newPassword };
        
      await resetPassword(resetData).unwrap();
      setSuccessMessage('Password reset successful!');
      setTimeout(handleClose, 2000);
    } catch (error: any) {
      setErrorMessage(error.data?.message || 'Invalid or expired OTP. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-[95%] mx-auto rounded-3xl border-0 shadow-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-purple-200/20 dark:shadow-orange-900/20 p-8">
        <DialogHeader className="space-y-4 pb-6">
          <div className="mx-auto bg-gradient-to-br from-purple-100 to-orange-100 dark:from-orange-900/30 dark:to-purple-900/30 w-16 h-16 rounded-2xl flex items-center justify-center">
            <Key className="w-8 h-8 text-purple-600 dark:text-orange-500" />
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            {step === 'email' ? 'Forgot Password?' : 'Reset Password'}
          </DialogTitle>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            {step === 'email' 
              ? "Don't worry! It happens. Please enter your email address." 
              : "Please enter the OTP sent to your email."}
          </p>
        </DialogHeader>

        {step === 'email' ? (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={emailValidationSchema}
            onSubmit={handleEmailSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <Field
                      type="email"
                      name="email"
                      className="w-full px-5 py-4 rounded-2xl pl-12 transition-all duration-300 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 group-hover:border-purple-500 dark:group-hover:border-orange-500 focus:ring-purple-500/20 dark:focus:ring-orange-500/20 focus:border-purple-500 dark:focus:border-orange-500 focus:outline-none focus:ring-4"
                      placeholder="Enter your email"
                    />
                    <Mail className="w-5 h-5 text-gray-400 group-hover:text-purple-500 dark:group-hover:text-orange-500 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300" />
                  </div>
                  {errors.email && touched.email && (
                    <div className="text-red-500 text-sm ml-1 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-500"/>
                      {errors.email}
                    </div>
                  )}
                </div>

                {errorMessage && (
                  <div className="p-4 rounded-2xl text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-200 border border-red-100 dark:border-red-800">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSendingOTP}
                  className="w-full py-4 rounded-2xl text-base font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 dark:from-orange-500 dark:to-purple-500 dark:hover:from-orange-600 dark:hover:to-purple-600 text-white disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-purple-500/20 dark:focus:ring-orange-500/20 flex items-center justify-center gap-2 disabled:cursor-not-allowed group"
                >
                  {isSendingOTP ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Send OTP
                      <ArrowLeft className="w-5 h-5 rotate-180 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <div>
            {successMessage && (
              <div className="p-4 rounded-2xl text-sm mb-6 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-200 border border-green-100 dark:border-green-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                {successMessage}
              </div>
            )}
            
            <Formik
              initialValues={{
                otp: '',
                newPassword: '',
                confirmPassword: ''
              }}
              validationSchema={resetPasswordValidationSchema}
              onSubmit={handleResetSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  <div className="space-y-4">
                    <div className="relative group">
                      <Field
                        type="text"
                        name="otp"
                        maxLength={6}
                        className="w-full px-5 py-4 rounded-2xl transition-all duration-300 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 group-hover:border-purple-500 dark:group-hover:border-orange-500 focus:ring-purple-500/20 dark:focus:ring-orange-500/20 focus:border-purple-500 dark:focus:border-orange-500 focus:outline-none focus:ring-4 tracking-widest text-center font-mono"
                        placeholder="000000"
                      />
                      {errors.otp && touched.otp && (
                        <div className="text-red-500 text-sm ml-1 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-red-500"/>
                          {errors.otp}
                        </div>
                      )}
                    </div>

                    <div className="relative group">
                      <Field
                        type="password"
                        name="newPassword"
                        className="w-full px-5 py-4 rounded-2xl pl-12 transition-all duration-300 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 group-hover:border-purple-500 dark:group-hover:border-orange-500 focus:ring-purple-500/20 dark:focus:ring-orange-500/20 focus:border-purple-500 dark:focus:border-orange-500 focus:outline-none focus:ring-4"
                        placeholder="Enter new password"
                      />
                      <Key className="w-5 h-5 text-gray-400 group-hover:text-purple-500 dark:group-hover:text-orange-500 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300" />
                      {errors.newPassword && touched.newPassword && (
                        <div className="text-red-500 text-sm ml-1 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-red-500"/>
                          {errors.newPassword}
                        </div>
                      )}
                    </div>

                    <div className="relative group">
                      <Field
                        type="password"
                        name="confirmPassword"
                        className="w-full px-5 py-4 rounded-2xl pl-12 transition-all duration-300 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 group-hover:border-purple-500 dark:group-hover:border-orange-500 focus:ring-purple-500/20 dark:focus:ring-orange-500/20 focus:border-purple-500 dark:focus:border-orange-500 focus:outline-none focus:ring-4"
                        placeholder="Confirm new password"
                      />
                      <Key className="w-5 h-5 text-gray-400 group-hover:text-purple-500 dark:group-hover:text-orange-500 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300" />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <div className="text-red-500 text-sm ml-1 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-red-500"/>
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-4 rounded-2xl text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-200 border border-red-100 dark:border-red-800">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('email');
                        setErrorMessage('');
                      }}
                      className="flex-1 py-4 rounded-2xl text-base font-semibold transition-all duration-300 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500/20 flex items-center justify-center gap-2 group"
                    >
                      <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isResetting}
                      className="flex-1 py-4 rounded-2xl text-base font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 dark:from-orange-500 dark:to-purple-500 dark:hover:from-orange-600 dark:hover:to-purple-600 text-white disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-purple-500/20 dark:focus:ring-orange-500/20 flex items-center justify-center gap-2 disabled:cursor-not-allowed group"
                    >
                      {isResetting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Reset Password
                          <ArrowLeft className="w-5 h-5 rotate-180 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;