'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import API from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)

      if (data.role === 'ADMIN') router.push('/dashboard/admin')
      else if (data.role === 'COMPANY') router.push('/dashboard/company')
      else router.push('/dashboard/student')
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Invalid Credentials. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    // 1. CONTAINER: Adapts background color
    <div
      className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-300
      bg-stone-50 dark:bg-slate-950"
    >
      {/* 2. BACKGROUND DECOR: Adapts colors (Emerald/Stone vs Blue/Purple) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[128px] transition-colors duration-500
          bg-emerald-500/10 dark:bg-blue-500/10"
        />
        <div
          className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full blur-[128px] transition-colors duration-500
          bg-stone-500/10 dark:bg-purple-500/10"
        />
      </div>

      {/* --- CARD CONTAINER --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10 rounded-3xl overflow-hidden shadow-2xl p-0.5"
      >
        {/* --- MOVING LIGHT BORDER --- */}
        {/* Kept the same colorful border as it looks good on both modes */}
        <div className="absolute inset-[-200%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#a855f7_25%,#06b6d4_50%,#3b82f6_100%)]" />

        {/* --- CONTENT LAYER --- */}
        <div
          className="relative p-8 md:p-10 rounded-3xl h-full backdrop-blur-xl transition-colors duration-300
          bg-white/80 dark:bg-slate-900/90"
        >
          <div className="text-center mb-8">
            <h2
              className="text-4xl font-extrabold mb-2 tracking-tight transition-colors
              text-stone-900 dark:text-white"
            >
              Welcome Back
            </h2>
            <p
              className="transition-colors
              text-stone-500 dark:text-slate-400"
            >
              Sign in to access your PIMS dashboard
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-6 p-3 rounded-lg border flex items-center gap-3 text-sm font-medium overflow-hidden
                  bg-red-50 border-red-200 text-red-600
                  dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
              >
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1">
              <label
                className="text-sm font-semibold ml-1 transition-colors
                text-stone-600 dark:text-slate-400"
              >
                Email Address
              </label>
              <div className="relative group">
                <div
                  className="absolute left-3 top-3.5 transition-colors
                  text-stone-400 group-focus-within:text-emerald-600
                  dark:text-slate-500 dark:group-focus-within:text-blue-500"
                >
                  <Mail size={20} />
                </div>
                <input
                  className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all font-medium
                    bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                    dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:focus:ring-blue-500 dark:focus:border-transparent
                    placeholder:text-stone-400 dark:placeholder:text-slate-600"
                  placeholder="student@example.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label
                  className="text-sm font-semibold transition-colors
                  text-stone-600 dark:text-slate-400"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold hover:underline transition-colors
                    text-emerald-600 hover:text-emerald-500
                    dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <div
                  className="absolute left-3 top-3.5 transition-colors
                  text-stone-400 group-focus-within:text-emerald-600
                  dark:text-slate-500 dark:group-focus-within:text-blue-500"
                >
                  <Lock size={20} />
                </div>
                <input
                  className="w-full pl-10 pr-12 py-3 border rounded-xl outline-none transition-all font-medium
                    bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                    dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:focus:ring-blue-500 dark:focus:border-transparent
                    placeholder:text-stone-400 dark:placeholder:text-slate-600"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 transition-colors
                    text-stone-400 hover:text-stone-600
                    dark:text-slate-500 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full p-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 border border-transparent relative overflow-hidden group active:scale-[0.98]
                bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20
                dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 dark:shadow-blue-500/20"
            >
              <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight size={20} />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p
              className="font-medium transition-colors
              text-stone-500 dark:text-slate-400"
            >
              New to PIMS?{' '}
              <Link
                href="/auth/register"
                className="font-bold hover:underline transition-all
                  text-emerald-600 hover:text-emerald-500
                  dark:text-blue-400 dark:hover:text-blue-300"
              >
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
