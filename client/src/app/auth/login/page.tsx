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
    // 1. CONTAINER
    <div
      className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-300
      bg-stone-50 dark:bg-[#050505]"
    >
      {/* --- Global Background Image & Cinematic Glass Effects --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Base Image */}
        <div className="absolute inset-0 bg-[url('/photos/png.png')] bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-50 transition-opacity duration-700" />

        {/* Dark Vignette / Cinematic Fade */}
        <div className="absolute inset-0 bg-linear-to-t from-stone-100 via-stone-50/80 to-transparent dark:from-[#050505] dark:via-[#050505]/80 dark:to-transparent" />
        <div className="absolute inset-0 bg-stone-50/50 dark:bg-[#050505]/40" />

        {/* Premium Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] dark:opacity-[0.08] mix-blend-overlay" />
      </div>

      {/* --- Background Glowing Spotlights --- */}
      <div className="fixed top-[10%] left-[20%] w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-500 bg-emerald-500/20 dark:bg-emerald-500/10 z-1" />
      <div className="fixed bottom-[20%] right-[10%] w-120 h-120 rounded-full blur-[128px] pointer-events-none transition-colors duration-500 bg-purple-500/10 dark:bg-blue-600/10 z-1" />

      {/* --- CARD CONTAINER --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        {/* --- CONTENT LAYER (Deep Glass Panel) --- */}
        <div
          className="relative p-8 md:p-12 h-full transition-all duration-300 border
          /* Light: Frosted White */
          rounded-3xl bg-white/70 backdrop-blur-xl border-stone-200 shadow-2xl
          /* Dark: Deep Glass Panel */
          dark:rounded-3xl dark:bg-black/40 dark:backdrop-blur-2xl dark:border-white/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          <div className="text-center mb-10">
            <h2
              className="text-4xl font-extrabold mb-2 tracking-tight transition-colors
              text-stone-900 
              /* Dark: Uppercase, Widely Spaced */
              dark:text-white dark:uppercase dark:tracking-[0.2em] dark:text-2xl drop-shadow-sm"
            >
              Welcome Back
            </h2>
            <p
              className="transition-colors text-sm
              text-stone-500 
              dark:text-neutral-400 dark:uppercase dark:tracking-widest"
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
                className="mb-6 p-3 flex items-center gap-3 text-sm font-medium overflow-hidden transition-all border backdrop-blur-md
                  /* Light: Rounded, Red-50 */
                  rounded-xl bg-red-50/80 border-red-200 text-red-600
                  /* Dark: Sharp, High Contrast Red/Black Glass */
                  dark:rounded-xl dark:bg-red-900/20 dark:border-red-500/30 dark:text-red-400"
              >
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-bold ml-1 transition-colors uppercase tracking-wide
                text-stone-600 dark:text-neutral-300"
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
                    /* Light: Glassy White */
                    rounded-xl bg-white/50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder:text-stone-400
                    /* Dark: Glassy Dark */
                    dark:rounded-xl dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:ring-0 dark:focus:bg-white/10 dark:focus:border-white/30 dark:placeholder:text-neutral-600"
                  placeholder="student@example.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label
                  className="text-xs font-bold transition-colors uppercase tracking-wide
                  text-stone-600 dark:text-neutral-300"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold hover:underline transition-colors
                    text-emerald-600 hover:text-emerald-500
                    dark:text-neutral-400 dark:hover:text-white"
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
                    /* Light: Glassy White */
                    rounded-xl bg-white/50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder:text-stone-400
                    /* Dark: Glassy Dark */
                    dark:rounded-xl dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:ring-0 dark:focus:bg-white/10 dark:focus:border-white/30 dark:placeholder:text-neutral-600"
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
                    dark:text-neutral-500 dark:hover:text-white"
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
              className="w-full p-4 font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6 border border-transparent relative overflow-hidden group active:scale-[0.98]
                /* Light: Rounded, Emerald */
                rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20
                /* Dark: Sharp, Solid White Block, Black Text */
                dark:rounded-xl dark:bg-white dark:text-black dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] dark:hover:bg-neutral-200 dark:uppercase dark:tracking-widest dark:text-sm"
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
              text-stone-500 dark:text-neutral-400"
            >
              NEW TO PIMS?{' '}
              <Link
                href="/auth/register"
                className="font-bold hover:underline transition-all
                  text-emerald-600 hover:text-emerald-500
                  dark:text-white dark:hover:text-neutral-200"
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
