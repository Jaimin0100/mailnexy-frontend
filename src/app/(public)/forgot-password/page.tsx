'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000';

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (): boolean => {
    setEmailError(null);
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

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
        throw new Error(data.error || 'Failed to send OTP');
      }

      // Store verification state in session
      sessionStorage.setItem('passwordResetFlow', 'started');
      sessionStorage.setItem('resetEmail', email);
      sessionStorage.setItem('resetStartTime', Date.now().toString());

      setSuccess('If an account exists, a reset code will be sent');
      toast.success('OTP sent successfully!');
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err) {
      console.error('Forgot password error:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
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
            Forgot Password
          </h2>
          <p className="text-sm text-[#696A71] mt-2 text-center">
            Enter your email to receive an OTP
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
              htmlFor="email"
              className="block text-sm font-medium text-[#53545C] mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-xl border ${
                emailError ? 'border-red-200' : 'border-gray-200'
              } px-4 py-2 text-sm text-[#53545C] focus:outline-none focus:ring-2 focus:ring-[#5570F1] transition-all duration-300`}
              placeholder="you@example.com"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'email-error' : undefined}
              disabled={isLoading}
            />
            <AnimatePresence>
              {emailError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  id="email-error"
                  className="mt-1 text-xs text-red-600"
                >
                  {emailError}
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
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="text-sm text-[#5570F1] hover:underline focus:outline-none focus:ring-2 focus:ring-[#5570F1] rounded disabled={isLoading}"
          >
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;