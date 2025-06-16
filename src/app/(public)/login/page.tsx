'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Login failed')
      }

      const data = await response.json() as {
        access_token: string
        refresh_token: string
        user: any
      }
      
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      router.push('/campaign/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/oauth/google'
  }

  useEffect(() => {
    const url = new URL(window.location.href)
    const accessToken = url.searchParams.get('access_token')
    const error = url.searchParams.get('error')

    if (error) {
      setError(error)
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (accessToken) {
      localStorage.setItem('access_token', accessToken)
      const refreshToken = url.searchParams.get('refresh_token') || ''
      localStorage.setItem('refresh_token', refreshToken)
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-6 py-12">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm border border-[#EAEDFD]">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Image 
              src="/logo.png" 
              alt="MailNexy Logo" 
              width={40} 
              height={40} 
            />
            <span className="text-2xl font-semibold text-[#5570F1]">MailNexy</span>
          </div>
          <h2 className="text-center text-2xl font-bold text-[#53545C]">Welcome Back</h2>
          <p className="text-sm text-[#696A71] mt-2">Sign in to continue to your account</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl border border-[#D9D9D9] bg-white px-4 py-3 text-sm font-semibold text-[#53545C] hover:bg-[#F5F7FA] transition"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        <div className="relative mb-6 text-center">
          <span className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#D9D9D9]" />
          </span>
          <span className="relative bg-white px-4 text-sm text-[#696A71]">Or sign in with email</span>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#53545C] mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#D9D9D9] p-3 text-[#53545C] text-sm focus:border-[#5570F1] focus:ring-1 focus:ring-[#5570F1]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#53545C] mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#D9D9D9] p-3 text-[#53545C] text-sm focus:border-[#5570F1] focus:ring-1 focus:ring-[#5570F1]"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="text-[#5570F1] hover:underline"
            >
              Forgot password?
            </Link>
            <Link
              href="/register"
              className="text-[#5570F1] hover:underline"
            >
              Create account
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full rounded-xl px-4 py-3 text-white font-semibold text-sm transition ${isLoading ? 'bg-[#5570F1]/70' : 'bg-[#5570F1] hover:bg-[#5570F1]/90'}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}