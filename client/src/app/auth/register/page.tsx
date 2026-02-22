'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import API from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {
  User,
  Lock,
  Mail,
  Building,
  Globe,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Briefcase,
} from 'lucide-react'

const MySwal = withReactContent(Swal)

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'STUDENT',
    companyName: '',
    website: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await API.post('/auth/register', form)

      await MySwal.fire({
        title: 'Welcome Aboard! 🚀',
        text: 'Your account has been created successfully.',
        icon: 'success',
        confirmButtonText: 'Continue to Login',
        confirmButtonColor: '#10b981', // Emerald-500
        background: '#fff',
        color: '#1c1917',
        customClass: {
          popup:
            'rounded-2xl shadow-xl border border-stone-200 dark:bg-[#0A0A0A] dark:border-white/20 dark:text-white dark:rounded-none',
          title: 'font-bold uppercase tracking-widest',
          confirmButton:
            'px-6 py-3 rounded-xl dark:rounded-none text-lg font-bold dark:bg-white dark:text-black',
        },
      })

      router.push('/auth/login')
    } catch (err: any) {
      if (navigator.vibrate) navigator.vibrate(200)

      setError(
        err.response?.data?.message || 'Registration Failed. Please try again.',
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg z-10"
      >
        {/* --- CONTENT LAYER (Deep Glass Panel) --- */}
        <div
          className="relative p-8 md:p-10 h-full transition-all duration-300 border
          /* Light: Frosted White */
          rounded-3xl bg-white/70 backdrop-blur-xl border-stone-200 shadow-2xl
          /* Dark: Deep Glass Panel */
          dark:rounded-3xl dark:bg-black/40 dark:backdrop-blur-2xl dark:border-white/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          <div className="text-center mb-8">
            <h2
              className="text-4xl font-extrabold mb-2 tracking-tight transition-colors
              text-stone-900 
              /* Dark: Uppercase, Widely Spaced */
              dark:text-white dark:uppercase dark:tracking-[0.2em] dark:text-2xl drop-shadow-sm"
            >
              Create Account
            </h2>
            <p
              className="transition-colors text-sm
              text-stone-500 
              dark:text-neutral-400 dark:uppercase dark:tracking-widest"
            >
              Join PIMS to manage your career journey
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

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div className="relative group">
              <div
                className="absolute left-3 top-3.5 transition-colors
                text-stone-400 group-focus-within:text-emerald-600
                dark:text-neutral-500 dark:group-focus-within:text-white"
              >
                <User size={20} strokeWidth={1.5} />
              </div>
              <input
                className="w-full pl-10 pr-4 py-3 border outline-none transition-all font-medium
                  /* Light: Glassy White */
                  rounded-xl bg-white/50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder:text-stone-400
                  /* Dark: Glassy Dark */
                  dark:rounded-xl dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:ring-0 dark:focus:bg-white/10 dark:focus:border-white/30 dark:placeholder:text-neutral-600"
                placeholder="Full Name"
                required
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>

            {/* Email */}
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
                placeholder="Email Address"
                type="email"
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Password */}
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
                placeholder="Password"
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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

            {/* Role Selection */}
            <div className="relative group">
              <div
                className="absolute left-3 top-3.5 transition-colors
                text-stone-400 group-focus-within:text-emerald-600
                dark:text-neutral-500 dark:group-focus-within:text-white"
              >
                <Briefcase size={20} strokeWidth={1.5} />
              </div>
              <select
                className="w-full pl-10 pr-4 py-3 border outline-none transition-all font-medium appearance-none cursor-pointer
                  /* Light: Glassy White */
                  rounded-xl bg-white/50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                  /* Dark: Glassy Dark */
                  dark:rounded-xl dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:ring-0 dark:focus:bg-white/10 dark:focus:border-white/30"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="STUDENT" className="dark:bg-[#0A0A0A]">
                  I am a Student
                </option>
                <option value="COMPANY" className="dark:bg-[#0A0A0A]">
                  I am a Company
                </option>
                <option value="ADMIN" className="dark:bg-[#0A0A0A]">
                  I am an Admin
                </option>
              </select>
              {/* Custom Chevron */}
              <div
                className="absolute right-4 top-4 pointer-events-none border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] 
                border-t-stone-400 dark:border-t-white/50"
              />
            </div>

            {/* Conditional Fields for Company (Animated) */}
            <AnimatePresence>
              {form.role === 'COMPANY' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className="space-y-4 pt-4 pb-2 mt-2 border-t
                    border-stone-200 dark:border-white/10"
                  >
                    <p
                      className="text-xs font-bold uppercase tracking-widest pl-1
                      text-stone-500 dark:text-neutral-400"
                    >
                      Company Details
                    </p>

                    <div className="relative group">
                      <div
                        className="absolute left-3 top-3.5 transition-colors
                        text-stone-400 group-focus-within:text-purple-600
                        dark:text-neutral-500 dark:group-focus-within:text-white"
                      >
                        <Building size={20} strokeWidth={1.5} />
                      </div>
                      <input
                        className="w-full pl-10 pr-4 py-3 border outline-none transition-all font-medium
                          rounded-xl bg-white/50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 placeholder:text-stone-400
                          dark:rounded-xl dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:ring-0 dark:focus:bg-white/10 dark:focus:border-white/30 dark:placeholder:text-neutral-600"
                        placeholder="Company Name"
                        required
                        onChange={(e) =>
                          setForm({ ...form, companyName: e.target.value })
                        }
                      />
                    </div>

                    <div className="relative group">
                      <div
                        className="absolute left-3 top-3.5 transition-colors
                        text-stone-400 group-focus-within:text-purple-600
                        dark:text-neutral-500 dark:group-focus-within:text-white"
                      >
                        <Globe size={20} strokeWidth={1.5} />
                      </div>
                      <input
                        className="w-full pl-10 pr-4 py-3 border outline-none transition-all font-medium
                          rounded-xl bg-white/50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 placeholder:text-stone-400
                          dark:rounded-xl dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:ring-0 dark:focus:bg-white/10 dark:focus:border-white/30 dark:placeholder:text-neutral-600"
                        placeholder="Website (e.g. https://google.com)"
                        required
                        onChange={(e) =>
                          setForm({ ...form, website: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={loading}
              className="w-full p-4 font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6 border border-transparent relative overflow-hidden group active:scale-[0.98]
                /* Light: Rounded, Emerald Gradient */
                rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20
                /* Dark: Sharp, Solid White Block, Black Text */
                dark:rounded-xl dark:bg-white dark:text-black dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] dark:hover:bg-neutral-200 dark:uppercase dark:tracking-widest dark:text-sm"
            >
              <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    INITIALIZING...
                  </>
                ) : (
                  <>
                    REGISTER NOW <ArrowRight size={20} />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p
              className="font-medium transition-colors text-sm
              text-stone-500 dark:text-neutral-400 dark:uppercase dark:tracking-widest"
            >
              ALREADY HAVE AN ACCOUNT?{' '}
              <Link
                href="/auth/login"
                className="font-bold hover:underline transition-all
                  text-emerald-600 hover:text-emerald-500
                  dark:text-white dark:hover:text-neutral-200"
              >
                SIGN IN
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
