import React, { FC, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useActivationMutation } from '@/redux/feautures/auth/authApi';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    email: string;
};

type VerifyNumber = {
    "0": string;
    "1": string;
    "2": string;
    "3": string;
    "4": string;
    "5": string;
};

const VerificationModal: FC<Props> = ({ isOpen, onClose, email }) => {
    const router = useRouter();
    const [activation, { isSuccess, error, isLoading }] = useActivationMutation();
    const [invalidError, setInvalidError] = useState<boolean>(false);
    const [verificationError, setVerificationError] = useState<string | null>(null);
    const [isActivated, setIsActivated] = useState<boolean>(false);
    const [redirectProgress, setRedirectProgress] = useState<number>(0);
    const { activationToken } = useSelector((state:any) => state.auth);

    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
        "0": "",
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
    });

    useEffect(() => {
        if (isSuccess) {
            setIsActivated(true);
            let progress = 0;
            const interval = setInterval(() => {
                progress += 2;
                setRedirectProgress(progress);
                if (progress >= 100) {
                    clearInterval(interval);
                    router.push('/signin');
                }
            }, 40);
            return () => clearInterval(interval);
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                const errorMessage = errorData.data?.message || "Verification failed";
                setVerificationError(errorMessage);
                toast.error(errorMessage);
                setInvalidError(true);
            }
        }
    }, [isSuccess, error, router]);

    const handleInputChange = (index: number, value: string) => {
        const sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 1);
        setInvalidError(false);
        setVerificationError(null);

        const newVerifyNumber = { ...verifyNumber, [index]: sanitizedValue };
        setVerifyNumber(newVerifyNumber);

        if (sanitizedValue === "" && index > 0) {
            inputRefs[index - 1].current?.focus();
        } else if (sanitizedValue.length === 1 && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const verificationHandler = async () => {
        const verificationNumber = Object.values(verifyNumber).join("");
        if (verificationNumber.length !== 6) {
            setInvalidError(true);
            setVerificationError("Please enter all 6 digits");
            return;
        }
        try {
            await activation({
                activation_token: activationToken, 
                activation_code: verificationNumber,
            }).unwrap();
        } catch (err: any) {
            setVerificationError(err.data?.message || "Verification failed");
            setInvalidError(true);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 sm:p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full h-full sm:h-auto sm:max-w-md"
                    >
                        <Card className="w-full h-full sm:h-auto sm:w-full rounded-none sm:rounded-3xl border-0 shadow-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-purple-200/20 dark:shadow-orange-900/20 p-4 sm:p-8">
                            {isActivated ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center"
                                >
                                    <div className="relative mx-auto w-16 sm:w-20 h-16 sm:h-20 mb-4 sm:mb-6">
                                        <svg className="w-full h-full" viewBox="0 0 100 100">
                                            <circle
                                                className="stroke-purple-100 dark:stroke-orange-900/30"
                                                strokeWidth="8"
                                                fill="none"
                                                cx="50"
                                                cy="50"
                                                r="42"
                                            />
                                            <motion.circle
                                                className="stroke-purple-600 dark:stroke-orange-500"
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                fill="none"
                                                cx="50"
                                                cy="50"
                                                r="42"
                                                strokeDasharray="264"
                                                strokeDashoffset={264 - (264 * redirectProgress) / 100}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Check className="w-6 sm:w-8 h-6 sm:h-8 text-purple-600 dark:text-orange-500" />
                                        </div>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                                        Account Activated!
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                                        Redirecting you to login in {Math.ceil((100 - redirectProgress) / 50)} seconds...
                                    </p>
                                </motion.div>
                            ) : (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-center mb-6 sm:mb-8"
                                    >
                                        <div className="mx-auto bg-gradient-to-br from-purple-100 to-orange-100 dark:from-orange-900/30 dark:to-purple-900/30 w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                                            <Check className="w-6 sm:w-8 h-6 sm:h-8 text-purple-600 dark:text-orange-500" />
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                                            Verify Your Account
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                                            Enter the 6-digit code sent to {email}
                                        </p>
                                    </motion.div>

                                    {verificationError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3 sm:p-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-200 border border-red-100 dark:border-red-800 mb-4 sm:mb-6"
                                        >
                                            {verificationError}
                                        </motion.div>
                                    )}

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex justify-center space-x-2 sm:space-x-3 mb-6 sm:mb-8"
                                    >
                                        {Object.keys(verifyNumber).map((key, index) => (
                                            <input
                                                key={key}
                                                ref={inputRefs[index]}
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                maxLength={1}
                                                disabled={isLoading}
                                                value={verifyNumber[key as keyof VerifyNumber]}
                                                onChange={(e) => handleInputChange(index, e.target.value)}
                                                className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold rounded-xl sm:rounded-2xl
                                                    bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white 
                                                    border border-gray-200 dark:border-gray-700 
                                                    group-hover:border-purple-500 dark:group-hover:border-orange-500 
                                                    focus:ring-purple-500/20 dark:focus:ring-orange-500/20 
                                                    focus:border-purple-500 dark:focus:border-orange-500 
                                                    focus:outline-none focus:ring-4
                                                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                                                    ${invalidError 
                                                        ? 'border-red-500 dark:border-red-700 focus:ring-red-500' 
                                                        : 'transition-all duration-300'
                                                    }`}
                                            />
                                        ))}
                                    </motion.div>

                                    <motion.button
                                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                        onClick={verificationHandler}
                                        disabled={isLoading}
                                        className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 
                                            bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 
                                            dark:from-orange-500 dark:to-purple-500 dark:hover:from-orange-600 dark:hover:to-purple-600 
                                            text-white disabled:opacity-50 focus:outline-none focus:ring-4 
                                            focus:ring-purple-500/20 dark:focus:ring-orange-500/20 
                                            flex items-center justify-center gap-2 
                                            disabled:cursor-not-allowed group mb-4 sm:mb-6 relative`}
                                    >
                                        <span className={isLoading ? 'invisible' : ''}>
                                            Verify Code
                                        </span>
                                        {isLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            </div>
                                        )}
                                    </motion.button>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex items-center justify-center"
                                    >
                                        <button
                                            onClick={onClose}
                                            disabled={isLoading}
                                            className={`flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 
                                                hover:text-purple-500 dark:hover:text-orange-500 transition-colors 
                                                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} group`}
                                        >
                                            <ArrowLeft className="w-3 sm:w-4 h-3 sm:h-4 mr-1 transition-transform duration-300 group-hover:-translate-x-1" />
                                            Back to Sign Up
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </Card>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default VerificationModal;