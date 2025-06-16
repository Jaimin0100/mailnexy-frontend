'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000';

const VerifyOTPPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Check session validity on mount
  useEffect(() => {
    const resetFlow = sessionStorage.getItem('passwordResetFlow');
    const storedEmail = sessionStorage.getItem('resetEmail');
    const startTime = sessionStorage.getItem('resetStartTime');
    
    const isSessionValid = (
      resetFlow === 'started' && 
      storedEmail === email && 
      startTime && 
      (Date.now() - parseInt(startTime)) < 30 * 60 * 1000 // 30 minutes
    );

    if (!isSessionValid) {
      toast.error('Session expired or invalid. Please start again.');
      sessionStorage.removeItem('passwordResetFlow');
      sessionStorage.removeItem('resetEmail');
      sessionStorage.removeItem('resetStartTime');
      router.push('/forgot-password');
    }
  }, [email, router]);

  const validateOtp = (): boolean => {
    setOtpError(null);
    if (!otp) {
      setOtpError('OTP is required');
      return false;
    } else if (!/^\d{6}$/.test(otp)) {
      setOtpError('OTP must be a 6-digit number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateOtp()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-reset-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid or expired OTP');
      }

      // Update session state
      sessionStorage.setItem('passwordResetFlow', 'verified');
      sessionStorage.setItem('resetToken', data.reset_token);

      toast.success('OTP verified successfully!');
      router.push(`/reset-password?email=${encodeURIComponent(email)}&reset_token=${encodeURIComponent(data.reset_token)}`);
    } catch (err) {
      console.error('OTP verification error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP');
      }

      // Update session timestamp
      sessionStorage.setItem('resetStartTime', Date.now().toString());

      toast.success('If an account exists, a new OTP will be sent');
    } catch (err) {
      console.error('Resend OTP error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.png"
            alt="Logo"
            width={48}
            height={48}
            priority
            className="mb-4"
          />
          <h2 className="text-2xl font-semibold text-[#53545C] text-center">
            Verify OTP
          </h2>
          <p className="text-sm text-[#696A71] mt-2 text-center">
            Enter the 6-digit code sent to {email}
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-[#53545C] mb-1"
            >
              OTP Code
            </label>
            <input
              id="otp"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className={`w-full rounded-xl border ${
                otpError ? 'border-red-200' : 'border-gray-200'
              } px-4 py-2 text-sm text-[#53545C] text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-[#5570F1] transition-all duration-300`}
              placeholder="123456"
              aria-invalid={!!otpError}
              aria-describedby={otpError ? 'otp-error' : undefined}
              disabled={isLoading}
            />
            <AnimatePresence>
              {otpError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  id="otp-error"
                  className="mt-1 text-xs text-red-600"
                >
                  {otpError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full rounded-xl py-3 text-sm font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 ${
              isLoading
                ? 'bg-[#5570F1]/70 cursor-not-allowed'
                : 'bg-[#5570F1] hover:bg-[#4658C8]'
            }`}
          >
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                />
              </svg>
            )}
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-[#696A71]">Didn&apos;t receive the code? </span>
          <button
            onClick={handleResendOtp}
            disabled={isLoading}
            className="text-[#5570F1] hover:underline focus:outline-none focus:ring-2 focus:ring-[#5570F1] rounded disabled:opacity-50"
          >
            Resend OTP
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTPPage;