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
    // 1. CONTAINER: Stone-50 (Light) vs Deep Charcoal #050505 (Dark)
    <div
      className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-300
      bg-stone-50 dark:bg-[#050505]"
    >
      {/* 2. BACKGROUND DECOR: Subtle Fog in Dark Mode, Colors in Light Mode */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[128px] transition-colors duration-500
          bg-emerald-500/10 dark:bg-white/5"
        />
        <div
          className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full blur-[128px] transition-colors duration-500
          bg-stone-500/10 dark:bg-white/5"
        />
      </div>

      {/* --- CARD CONTAINER --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10 p-0.5 transition-all duration-300
          /* Light: Rounded, Shadow */
          rounded-3xl shadow-2xl
          /* Dark: Sharp, No Shadow */
          dark:rounded-none dark:shadow-none"
      >
        {/* --- BORDER LAYER --- */}
        {/* Light: Spinning Gradient. Dark: Static Sharp White Border */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl dark:rounded-none">
          <div
            className="absolute inset-[-200%] animate-[spin_4s_linear_infinite] 
              bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#a855f7_25%,#06b6d4_50%,#3b82f6_100%)]
              dark:hidden"
          />
          {/* Dark Mode Border replacement */}
          <div className="hidden dark:block absolute inset-0 border border-white/20" />
        </div>

        {/* --- CONTENT LAYER --- */}
        <div
          className="relative p-8 md:p-12 h-full backdrop-blur-xl transition-all duration-300
          /* Light: Rounded, White/80 */
          rounded-3xl bg-white/80
          /* Dark: Sharp, Deep Charcoal #0A0A0A */
          dark:rounded-none dark:bg-[#0A0A0A]"
        >
          <div className="text-center mb-10">
            <h2
              className="text-4xl font-extrabold mb-2 tracking-tight transition-colors
              text-stone-900 
              /* Dark: Uppercase, Widely Spaced */
              dark:text-white dark:uppercase dark:tracking-[0.2em] dark:text-2xl"
            >
              Welcome Back
            </h2>
            <p
              className="transition-colors text-sm
              text-stone-500 
              dark:text-neutral-500 dark:uppercase dark:tracking-widest"
            >
              Sign in to access system
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-6 p-3 flex items-center gap-3 text-sm font-medium overflow-hidden transition-all
                  /* Light: Rounded, Red-50 */
                  rounded-lg bg-red-50 border border-red-200 text-red-600
                  /* Dark: Sharp, High Contrast Red/Black */
                  dark:rounded-none dark:bg-red-900/20 dark:border-red-500/50 dark:text-red-400"
              >
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-1">
              <label
                className="text-xs font-bold ml-1 transition-colors uppercase tracking-wide
                text-stone-600 dark:text-neutral-400"
              >
                Email Address
              </label>
              <div className="relative group">
                <div
                  className="absolute left-3 top-3.5 transition-colors
                  text-stone-400 group-focus-within:text-emerald-600
                  dark:text-neutral-500 dark:group-focus-within:text-white"
                >
                  <Mail size={20} strokeWidth={1.5} />
                </div>
                <input
                  className="w-full pl-10 pr-4 py-3 border outline-none transition-all font-medium
                    /* Light: Rounded, Stone Colors */
                    rounded-xl bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder:text-stone-400
                    /* Dark: Sharp, Black/White High Contrast */
                    dark:rounded-none dark:bg-[#0F0F0F] dark:border-white/10 dark:text-white dark:focus:ring-0 dark:focus:border-white dark:placeholder:text-neutral-700"
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
                  className="text-xs font-bold transition-colors uppercase tracking-wide
                  text-stone-600 dark:text-neutral-400"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold hover:underline transition-colors
                    text-emerald-600 hover:text-emerald-500
                    dark:text-neutral-500 dark:hover:text-white"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <div
                  className="absolute left-3 top-3.5 transition-colors
                  text-stone-400 group-focus-within:text-emerald-600
                  dark:text-neutral-500 dark:group-focus-within:text-white"
                >
                  <Lock size={20} strokeWidth={1.5} />
                </div>
                <input
                  className="w-full pl-10 pr-12 py-3 border outline-none transition-all font-medium
                    /* Light: Rounded, Stone Colors */
                    rounded-xl bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder:text-stone-400
                    /* Dark: Sharp, Black/White High Contrast */
                    dark:rounded-none dark:bg-[#0F0F0F] dark:border-white/10 dark:text-white dark:focus:ring-0 dark:focus:border-white dark:placeholder:text-neutral-700"
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
                    dark:text-neutral-600 dark:hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={20} strokeWidth={1.5} />
                  ) : (
                    <Eye size={20} strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full p-4 font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 border border-transparent relative overflow-hidden group active:scale-[0.98]
                /* Light: Rounded, Emerald Gradient */
                rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20
                /* Dark: Sharp, Solid White Block, Black Text */
                dark:rounded-none dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:shadow-none dark:uppercase dark:tracking-widest dark:text-sm"
            >
              <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    SIGN IN <ArrowRight size={20} />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-10 text-center">
            <p
              className="text-sm font-medium transition-colors
              text-stone-500 dark:text-neutral-500"
            >
              NEW TO PIMS?{' '}
              <Link
                href="/auth/register"
                className="font-bold hover:underline transition-all
                  text-emerald-600 hover:text-emerald-500
                  dark:text-white dark:hover:text-neutral-300"
              >
                CREATE ACCOUNT
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
