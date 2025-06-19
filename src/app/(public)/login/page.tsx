'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Form validation
  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
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

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json() as {
        access_token: string;
        refresh_token: string;
        user: any;
      };

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      toast.success('Login successful!');
      router.push('/campaign/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/oauth/google`;
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get('access_token');
    const error = url.searchParams.get('error');

    if (error) {
      setError(error);
      toast.error(error);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      const refreshToken = url.searchParams.get('refresh_token') || '';
      localStorage.setItem('refresh_token', refreshToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      toast.success('Google login successful!');
      router.push('/campaign/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8"
      >
        {/* Logo and Branding */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.png"
            alt="MailNexy Logo"
            width={48}
            height={48}
            priority
            className="mb-4"
          />
          <h2 className="text-2xl font-semibold text-[#53545C] text-center">
            Welcome to MailNexy
          </h2>
          <p className="text-sm text-[#696A71] mt-2 text-center">
            Sign in to manage your campaigns
          </p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-[#53545C] hover:bg-gray-50 transition-colors duration-300 shadow-sm mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <span className="relative bg-white px-4 text-sm text-[#696A71]">
            Or sign in with email
          </span>
        </div>

        {/* Error Message */}
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

        {/* Login Form */}
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

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#53545C] mb-1"
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

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => router.push('/forgot-password')}
              className="text-[#5570F1] hover:underline focus:outline-none focus:ring-2 focus:ring-[#5570F1] rounded"
              disabled={isLoading}
            >
              Forgot Password?
            </button>
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="text-[#5570F1] hover:underline focus:outline-none focus:ring-2 focus:ring-[#5570F1] rounded"
              disabled={isLoading}
            >
              Create Account
            </button>
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
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;















// 'use client'

// import React, { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { FcGoogle } from 'react-icons/fc'
// import Image from 'next/image'
// import Link from 'next/link'

// export default function LoginPage() {
//   const router = useRouter()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError(null)

//     try {
//       const response = await fetch('http://localhost:5000/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({ email, password }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(errorData.error || 'Login failed')
//       }

//       const data = await response.json() as {
//         access_token: string
//         refresh_token: string
//         user: any
//       }
      
//       localStorage.setItem('access_token', data.access_token)
//       localStorage.setItem('refresh_token', data.refresh_token)
//       router.push('/campaign/dashboard')
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An unknown error occurred')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleGoogleLogin = () => {
//     window.location.href = 'http://localhost:5000/api/oauth/google'
//   }

//   useEffect(() => {
//     const url = new URL(window.location.href)
//     const accessToken = url.searchParams.get('access_token')
//     const error = url.searchParams.get('error')

//     if (error) {
//       setError(error)
//       // Clean URL
//       window.history.replaceState({}, document.title, window.location.pathname)
//     } else if (accessToken) {
//       localStorage.setItem('access_token', accessToken)
//       const refreshToken = url.searchParams.get('refresh_token') || ''
//       localStorage.setItem('refresh_token', refreshToken)
//       // Clean URL
//       window.history.replaceState({}, document.title, window.location.pathname)
//       router.push('/dashboard')
//     }
//   }, [router])

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-6 py-12">
//       <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm border border-[#EAEDFD]">
//         <div className="flex flex-col items-center mb-8">
//           <div className="flex items-center gap-3 mb-4">
//             <Image 
//               src="/logo.png" 
//               alt="MailNexy Logo" 
//               width={40} 
//               height={40} 
//             />
//             <span className="text-2xl font-semibold text-[#5570F1]">MailNexy</span>
//           </div>
//           <h2 className="text-center text-2xl font-bold text-[#53545C]">Welcome Back</h2>
//           <p className="text-sm text-[#696A71] mt-2">Sign in to continue to your account</p>
//         </div>

//         <button
//           onClick={handleGoogleLogin}
//           className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl border border-[#D9D9D9] bg-white px-4 py-3 text-sm font-semibold text-[#53545C] hover:bg-[#F5F7FA] transition"
//         >
//           <FcGoogle className="text-xl" />
//           Continue with Google
//         </button>

//         <div className="relative mb-6 text-center">
//           <span className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-[#D9D9D9]" />
//           </span>
//           <span className="relative bg-white px-4 text-sm text-[#696A71]">Or sign in with email</span>
//         </div>

//         {error && (
//           <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-[#53545C] mb-1">
//               Email Address
//             </label>
//             <input
//               id="email"
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full rounded-xl border border-[#D9D9D9] p-3 text-[#53545C] text-sm focus:border-[#5570F1] focus:ring-1 focus:ring-[#5570F1]"
//               placeholder="you@example.com"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-[#53545C] mb-1">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full rounded-xl border border-[#D9D9D9] p-3 text-[#53545C] text-sm focus:border-[#5570F1] focus:ring-1 focus:ring-[#5570F1]"
//               placeholder="••••••••"
//             />
//           </div>

//           <div className="flex items-center justify-between text-sm">
//             <Link
//               href="/forgot-password"
//               className="text-[#5570F1] hover:underline"
//             >
//               Forgot password?
//             </Link>
//             <Link
//               href="/register"
//               className="text-[#5570F1] hover:underline"
//             >
//               Create account
//             </Link>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`w-full rounded-xl px-4 py-3 text-white font-semibold text-sm transition ${isLoading ? 'bg-[#5570F1]/70' : 'bg-[#5570F1] hover:bg-[#5570F1]/90'}`}
//           >
//             {isLoading ? (
//               <span className="flex items-center justify-center gap-2">
//                 <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Signing In...
//               </span>
//             ) : 'Sign In'}
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }