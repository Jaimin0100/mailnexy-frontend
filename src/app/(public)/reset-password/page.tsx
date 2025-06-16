'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000';

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const resetToken = searchParams.get('reset_token') || '';

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  // Check session validity on mount
  useEffect(() => {
    const resetFlow = sessionStorage.getItem('passwordResetFlow');
    const storedEmail = sessionStorage.getItem('resetEmail');
    const storedToken = sessionStorage.getItem('resetToken');
    const startTime = sessionStorage.getItem('resetStartTime');
    
    const isSessionValid = (
      resetFlow === 'verified' && 
      storedEmail === email && 
      storedToken === resetToken &&
      startTime && 
      (Date.now() - parseInt(startTime)) < 30 * 60 * 1000 // 30 minutes
    );

    if (!isSessionValid) {
      toast.error('Session expired or invalid. Please start again.');
      sessionStorage.removeItem('passwordResetFlow');
      sessionStorage.removeItem('resetEmail');
      sessionStorage.removeItem('resetToken');
      sessionStorage.removeItem('resetStartTime');
      router.push('/forgot-password');
    }
  }, [email, resetToken, router]);

  const validateForm = (): boolean => {
    let isValid = true;
    setPasswordError(null);
    setConfirmPasswordError(null);

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reset_token: resetToken,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Password reset failed');
      }

      // Clear session after successful reset
      sessionStorage.removeItem('passwordResetFlow');
      sessionStorage.removeItem('resetEmail');
      sessionStorage.removeItem('resetToken');
      sessionStorage.removeItem('resetStartTime');

      setSuccess('Password reset successfully');
      toast.success('Password reset successful!');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      console.error('Reset password error:', err);
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
            Reset Password
          </h2>
          <p className="text-sm text-[#696A71] mt-2 text-center">
            Create a new password for your account
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

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-600 border border-green-200"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#53545C] mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-xl border ${
                  passwordError ? 'border-red-200' : 'border-gray-200'
                } px-4 py-2 text-sm text-[#53545C] focus:outline-none focus:ring-2 focus:ring-[#5570F1] transition-all duration-300`}
                placeholder="••••••••"
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? 'password-error' : undefined}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-[#696A71] hover:text-[#5570F1]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            <AnimatePresence>
              {passwordError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  id="password-error"
                  className="mt-1 text-xs text-red-600"
                >
                  {passwordError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#53545C] mb-1"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-xl border ${
                  confirmPasswordError ? 'border-red-200' : 'border-gray-200'
                } px-4 py-2 text-sm text-[#53545C] focus:outline-none focus:ring-2 focus:ring-[#5570F1] transition-all duration-300`}
                placeholder="••••••••"
                aria-invalid={!!confirmPasswordError}
                aria-describedby={confirmPasswordError ? 'confirm-password-error' : undefined}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-[#696A71] hover:text-[#5570F1]"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            <AnimatePresence>
              {confirmPasswordError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  id="confirm-password-error"
                  className="mt-1 text-xs text-red-600"
                >
                  {confirmPasswordError}
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
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="text-sm text-[#5570F1] hover:underline focus:outline-none focus:ring-2 focus:ring-[#5570F1] rounded"
          >
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;