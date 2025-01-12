'use client'
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/card';
import { Mail, Lock, Eye, EyeOff, Shield, UserCircle, Bell, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import { useRegisterMutation } from '@/redux/feautures/auth/authApi';
import VerificationModal from '@/components/VerificationModal';
import PasswordValidator from '@/components/PasswordValidator';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Please enter your email'),
  password: Yup.string()
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
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
});

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const pulseAnimation = {
  scale: [1, 1.02, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};
const SignupPage = () => {
  const [register, { isSuccess, error: registerError, isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [isFormFocused, setIsFormFocused] = useState(false);
  

  const scrollVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20
      }
    }
  };
  
  const formRef = React.useRef(null);
  const isInView = useInView(formRef, { once: true, margin: "-100px" });

  const privacyFeatures = [
    {
      icon: UserCircle,
      title: "Anonymous Identity",
      description: "Choose your avatar - this is how counselors will see you. Your real identity stays private.",
      color: "text-purple-600 dark:text-orange-400"
    },
    {
      icon: Bell,
      title: "Secure Communications",
      description: "Your email is only used for notifications and important updates, never shared with counselors.",
      color: "text-purple-600 dark:text-orange-400"
    },
    {
      icon: Lock,
      title: "Private Sessions",
      description: "All counseling sessions are completely anonymous. Neither party knows the other's identity.",
      color: "text-purple-600 dark:text-orange-400"
    }
  ];

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async ({ email, password }) => {
      try {
        setSignupError(null);
        const result = await register({ email, password });
        
        if ('error' in result) {
          const errorData = result.error as any;
          const errorMessage = errorData?.data?.message || 
            errorData?.message || 
            "An unexpected error occurred during registration";
          
          setSignupError(errorMessage);
          toast.error(errorMessage);
        }
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : "An unexpected error occurred";
        
        setSignupError(errorMessage);
        toast.error(errorMessage);
      }
    }
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Registration successful! Please verify your email.");
      setShowVerification(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (registerError) {
      let errorMessage = "An unexpected error occurred";
      if (typeof registerError === 'object' && registerError !== null) {
        if ('data' in registerError) {
          const errorData = registerError as any;
          errorMessage = errorData.data?.message || 
            errorData.message || 
            "Registration failed. Please try again.";
        } else if ('message' in registerError) {
          errorMessage = (registerError as any).message;
        }
      }
      setSignupError(errorMessage);
      toast.error(errorMessage);
    }
  }, [registerError]);
  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
  >
      <Header />
      
      <motion.div 
        className="container mx-auto px-4 py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          {/* Privacy Banner */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.02 }}
            className="mb-12 text-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
          >
              <motion.div 
              className="flex items-center justify-center gap-3 mb-4"
              animate={pulseAnimation}
            >
              <Shield className="w-8 h-8 text-purple-600 dark:text-orange-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Journey Starts Here, Privately and Securely
              </h1>
            </motion.div>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              We prioritize your privacy. Create an account to begin your anonymous counseling journey.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Sign Up Form */}
            <motion.div 
              className="lg:order-2"
              variants={scrollVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              <Card 
                className={`p-8 rounded-xl shadow-lg mb-8 lg:mb-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-shadow duration-300 ${
                  isFormFocused ? 'shadow-2xl' : ''
                }`}
              >
              <motion.div className="space-y-6" variants={itemVariants}>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent">
                      Create Your Account
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Your email stays private - it's only for notifications
                    </p>
                  </div>

                  {signupError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 dark:bg-red-900/50 border border-red-300 dark:border-red-800 
                        text-red-700 dark:text-red-300 px-4 py-3 rounded-lg"
                    >
                      {signupError}
                    </motion.div>
                  )}

                  <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`w-full px-4 py-3 rounded-lg pl-10 transition-all duration-300
                            bg-gray-50 dark:bg-gray-700 
                            text-gray-900 dark:text-white 
                            border-gray-300 dark:border-gray-600 
                            focus:ring-purple-500 dark:focus:ring-orange-500 
                            focus:border-purple-500 dark:focus:border-orange-500
                            ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                          placeholder="you@example.com"
                        />
                        <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      </div>
                      <AnimatePresence>
                        {formik.touched.email && formik.errors.email && (
                          <motion.p 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-red-500 dark:text-red-400 text-xs mt-1"
                          >
                            {formik.errors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
>
  <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
    Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      id="password"
      name="password"
      value={formik.values.password}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      className={`w-full px-4 py-3 rounded-lg pl-10 pr-12 transition-all duration-300
        bg-gray-50 dark:bg-gray-700 
        text-gray-900 dark:text-white 
        border-gray-300 dark:border-gray-600 
        focus:ring-purple-500 dark:focus:ring-orange-500 
        focus:border-purple-500 dark:focus:border-orange-500
        ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
      placeholder="Create a secure password"
    />
    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
    >
      {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
    </button>
  </div>
  <PasswordValidator 
    password={formik.values.password} 
    className="mt-2"
  />
  <AnimatePresence>
    {formik.touched.password && formik.errors.password && (
      <motion.p 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="text-red-500 dark:text-red-400 text-xs mt-1"
      >
        {formik.errors.password}
      </motion.p>
    )}
  </AnimatePresence>
</motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formik.values.confirmPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`w-full px-4 py-3 rounded-lg pl-10 pr-12 transition-all duration-300
                            bg-gray-50 dark:bg-gray-700 
                            text-gray-900 dark:text-white 
                            border-gray-300 dark:border-gray-600 
                            focus:ring-purple-500 dark:focus:ring-orange-500 
                            focus:border-purple-500 dark:focus:border-orange-500
                            ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : ''}`}
                          placeholder="Confirm your password"
                        />
                        <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                      </div>
                      <AnimatePresence>
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                          <motion.p 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-red-500 dark:text-red-400 text-xs mt-1"
                          >
                            {formik.errors.confirmPassword}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.button
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 rounded-lg text-sm font-medium transition-all duration-300 
                        bg-purple-600 dark:bg-orange-500 
                        text-white
                        hover:bg-purple-700 dark:hover:bg-orange-600
                        focus:outline-none focus:ring-2 focus:ring-offset-2 
                        focus:ring-purple-500 dark:focus:ring-orange-500
                        ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
                        mt-6 relative`}
                    >
                      <span className={`flex items-center justify-center ${isLoading ? 'invisible' : ''}`}>
                        Create Account
                      </span>
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                      )}
                    </motion.button>

                    {/* <div className="space-y-4 mt-6">
                      <div className="relative flex items-center">
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                        <span className="px-4 text-sm text-gray-500 dark:text-gray-400">or</span>
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                      </div>
                      <GoogleAuthButton isLoading={isLoading} />
                    </div> */}
                  </form>

                  <AnimatePresence>
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-center text-gray-600 dark:text-gray-400"
                      >
                        Creating your secure account...
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Already have an account?{" "}
                      <a 
                        href="/signin" 
                        className="font-medium text-purple-600 dark:text-orange-400 hover:text-purple-700 dark:hover:text-orange-300 transition-colors duration-300"
                      >
                        Sign In
                      </a>
                    </p>
                  </div>
                </motion.div>
              </Card>
              </motion.div>

            {/* Privacy Features */}
           <div className="space-y-6 lg:order-1">
              {privacyFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.3 }}
                  whileHover={{ 
                    scale: 1.03,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  onHoverStart={() => setHoveredFeature(index)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300"
                >
                  <motion.div 
                    className="flex items-start gap-4"
                    animate={hoveredFeature === index ? {
                      x: [0, 5, 0],
                      transition: { duration: 0.5 }
                    } : {}}
                  >
                    <motion.div 
                      className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                      animate={hoveredFeature === index ? {
                        rotate: [0, -10, 10, -10, 0],
                        transition: { duration: 0.5 }
                      } : {}}
                    >
                      <feature.icon className={`${feature.color} transition-all duration-300`} />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      <VerificationModal
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
        email={formik.values.email}
      />
    </motion.div>
  );
};

export default SignupPage;