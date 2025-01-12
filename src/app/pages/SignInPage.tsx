import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, XCircle, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import Header from "@/components/Header";
import { useLoginMutation } from "@/redux/feautures/auth/authApi";
import { useRouter } from "next/navigation";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import { useAuth } from "../hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const SigninPage = () => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { isAuthenticated, redirectToUserDashboard, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      redirectToUserDashboard();
    }
  }, [isAuthenticated, redirectToUserDashboard, authLoading]);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const gradientAnimation = {
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    },
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "linear"
    }
  };

  if (authLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-screen flex items-center justify-center dark:bg-gray-900 bg-gray-50"
      >
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 dark:text-orange-400" />
      </motion.div>
    );
  }

  const handleSubmit = async (values: any) => {
    setFormError(null);
    try {
      await login(values).unwrap();
      redirectToUserDashboard();
    } catch (err: any) {
      if (err.status === 401) {
        setFormError("Incorrect email or password");
      } else if (err.data?.message?.includes("not verified")) {
        setFormError("Please verify your email address before signing in");
      } else if (err.status === 404) {
        setFormError("No account found with this email address");
      } else {
        setFormError("Unable to sign in. Please try again");
      }
    }
  };

  const initialValues = {
    email: "",
    password: "",
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex flex-col dark:bg-gray-900 bg-gray-50"
    >
      <Header />
      <div className="flex-1 flex">
        {/* Left side with enhanced animations */}
        <motion.div className="hidden lg:flex lg:w-1/2 relative">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br dark:from-orange-400/30 dark:via-purple-500/30 dark:to-orange-400/20 from-purple-600/30 via-orange-500/30 to-purple-600/20"
            animate={gradientAnimation}
          />
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full bg-[radial-gradient(circle_at_top_left,transparent_0%,#f9fafb_100%)] dark:bg-[radial-gradient(circle_at_top_left,transparent_0%,#1f2937_100%)]" />
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full flex items-center justify-center p-8"
          >
            <div className="max-w-lg text-center">
              <motion.h1 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-5xl font-bold mb-6 bg-gradient-to-r dark:from-orange-400 dark:to-purple-500 from-purple-600 to-orange-500 bg-clip-text text-transparent"
              >
                MiCounselor
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl dark:text-gray-300 text-gray-700"
              >
                Continue your path of growth and healing with our supportive community
              </motion.p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right side - Enhanced Sign In Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card className="p-6 lg:p-8 rounded-2xl shadow-lg dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-200">
              <motion.div 
                variants={staggerChildren}
                initial="initial"
                animate="animate"
                className="space-y-6"
              >
                <motion.div 
                  variants={fadeIn}
                  className="text-center lg:text-left"
                >
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r dark:from-orange-400 dark:to-purple-500 from-purple-600 to-orange-500 bg-clip-text text-transparent">
                    Sign In
                  </h2>
                  <p className="text-sm dark:text-gray-400 text-gray-500">
                    Access your personal dashboard
                  </p>
                </motion.div>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                      <AnimatePresence>
                        {formError && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 rounded-lg flex items-center gap-2 dark:bg-red-900/50 dark:text-red-200 dark:border-red-800 bg-red-50 text-red-600 border border-red-200"
                          >
                            <XCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{formError}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.div 
                        variants={staggerChildren}
                        className="space-y-4"
                      >
                        <motion.div variants={fadeIn}>
                          {/* Email Field */}
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium mb-2 dark:text-gray-300 text-gray-700"
                          >
                            Email Address
                          </label>
                          <div className="relative">
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Field
                                type="email"
                                id="email"
                                name="email"
                                className={`w-full px-4 py-3 rounded-xl pl-10 transition-all duration-300 
                                  dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-orange-500 dark:focus:border-orange-500 
                                  bg-gray-50 text-gray-900 border-gray-300 focus:ring-purple-500 focus:border-purple-500 
                                  focus:outline-none focus:ring-2 
                                  ${errors.email && touched.email ? "border-red-500" : ""}`}
                                placeholder="you@example.com"
                              />
                            </motion.div>
                            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          </div>
                          <AnimatePresence>
                            {errors.email && touched.email && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-500 text-sm mt-1"
                              >
                                {errors.email}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        <motion.div variants={fadeIn}>
                          {/* Password Field */}
                          <div className="flex justify-between items-center mb-2">
                            <label
                              htmlFor="password"
                              className="block text-sm font-medium dark:text-gray-300 text-gray-700"
                            >
                              Password
                            </label>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => setShowForgotPassword(true)}
                              className="text-sm dark:text-orange-400 dark:hover:text-orange-300 text-purple-600 hover:text-purple-700"
                            >
                              Forgot password?
                            </motion.button>
                          </div>
                          <div className="relative">
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Field
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className={`w-full px-4 py-3 rounded-xl pl-10 pr-12 transition-all duration-300 
                                  dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-orange-500 dark:focus:border-orange-500 
                                  bg-gray-50 text-gray-900 border-gray-300 focus:ring-purple-500 focus:border-purple-500 
                                  focus:outline-none focus:ring-2 
                                  ${errors.password && touched.password ? "border-red-500" : ""}`}
                                placeholder="Enter your password"
                              />
                            </motion.div>
                            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 dark:text-gray-400 dark:hover:text-gray-300 text-gray-500 hover:text-gray-600"
                            >
                              {showPassword ? (
                                <Eye className="w-5 h-5" />
                              ) : (
                                <EyeOff className="w-5 h-5" />
                              )}
                            </motion.button>
                          </div>
                          <AnimatePresence>
                            {errors.password && touched.password && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-500 text-sm mt-1"
                              >
                                {errors.password}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </motion.div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 rounded-xl text-base font-medium transition-all duration-300 flex items-center justify-center
                          dark:bg-orange-500 dark:text-white dark:hover:bg-orange-600 dark:disabled:bg-orange-400
                          bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-400
                          focus:outline-none focus:ring-2 focus:ring-offset-2
                          dark:focus:ring-orange-500 focus:ring-purple-500
                          disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </motion.button>
                    </Form>
                  )}
                </Formik>

                <motion.div 
                  variants={fadeIn}
                  className="text-center"
                >
                  <p className="text-sm dark:text-gray-400 text-gray-600">
                    Don't have an account?{" "}
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      href="/signup"
                      className="font-medium dark:text-orange-400 dark:hover:text-orange-300 text-purple-600 hover:text-purple-700 transition-colors duration-300"
                    >
                      Sign Up
                    </motion.a>
                  </p>
                </motion.div>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
      <ForgotPasswordModal 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </motion.div>
  );
};

export default SigninPage;