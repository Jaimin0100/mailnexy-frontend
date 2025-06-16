'use client';

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FcGoogle } from 'react-icons/fc'
import { motion, AnimatePresence } from 'framer-motion'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

const API_BASE_URL = 'http://localhost:5000'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)

  const validateForm = (): boolean => {
    let isValid = true
    setEmailError(null)
    setPasswordError(null)
    setConfirmPasswordError(null)

    if (!email) {
      setEmailError('Email is required')
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address')
      isValid = false
    }

    if (!password) {
      setPasswordError('Password is required')
      isValid = false
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long')
      isValid = false
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the form errors')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          passwordHash: password,
          name: name || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Registration failed')
      }

      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!loginResponse.ok) {
        throw new Error('Automatic login after registration failed')
      }

      const loginData = await loginResponse.json() as {
        access_token: string
        refresh_token: string
        user: any
      }

      localStorage.setItem('access_token', loginData.access_token)
      localStorage.setItem('refresh_token', loginData.refresh_token)
      toast.success('Registration successful!')
      router.push('/campaign/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      toast.error(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    const redirectUri = 'http://localhost:5000/auth/google/callback'
    window.location.href = `${API_BASE_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Logo, Title, Description, and Google Login - Left Side */}
        <div className="w-full lg:w-1/2 bg-gradient-to-b from-blue-50 to-white p-8 sm:p-12 flex flex-col justify-center items-center border-r border-gray-200 lg:border-r-0 lg:border-r">
          <Image
            src="/logo.png"
            alt="MailNexy Logo"
            width={100}
            height={100}
            priority
            className="mb-8 transform hover:scale-105 transition-transform duration-300"
          />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-4">
            Welcome to MailNexy
          </h2>
          <p className="text-base text-gray-600 text-center mb-10 max-w-sm leading-relaxed">
            Create your account to unlock powerful email campaign tools, advanced analytics, and seamless automation for your business.
          </p>
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full max-w-md flex items-center justify-center gap-4 rounded-xl border border-gray-200 bg-white py-4 text-base font-semibold text-gray-800 hover:bg-gray-50 transition-colors duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="text-2xl" />
            Sign up with Google
          </button>
        </div>

        {/* Form Section - Right Side */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 bg-white">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Create Your Account</h3>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name (Optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gray-50/50"
                placeholder="Your Name"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-xl border ${
                  emailError ? 'border-red-400' : 'border-gray-300'
                } px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gray-50/50`}
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
                    className="mt-2 text-xs text-red-500"
                  >
                    {emailError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-xl border ${
                    passwordError ? 'border-red-400' : 'border-gray-300'
                  } px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gray-50/50`}
                  placeholder="••••••••"
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? 'password-error' : undefined}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-600 hover:text-blue-500 transition-colors duration-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
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
                    className="mt-2 text-xs text-red-500"
                  >
                    {passwordError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full rounded-xl border ${
                    confirmPasswordError ? 'border-red-400' : 'border-gray-300'
                  } px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gray-50/50`}
                  placeholder="••••••••"
                  aria-invalid={!!confirmPasswordError}
                  aria-describedby={confirmPasswordError ? 'confirm-password-error' : undefined}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-600 hover:text-blue-500 transition-colors duration-200"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
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
                    className="mt-2 text-xs text-red-500"
                  >
                    {confirmPasswordError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between text-sm pt-3">
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors duration-200"
                disabled={isLoading}
              >
                Already have an account? Sign In
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-xl py-4 text-base font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } shadow-md hover:shadow-lg`}
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
              {isLoading ? 'Signing Up...' : 'Create Account'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}