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
    // 1. CONTAINER: Stone-50 (Light) vs Deep Charcoal #050505 (Dark)
    <div
      className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-300
      bg-stone-50 dark:bg-[#050505]"
    >
      {/* 2. BACKGROUND DECOR: Subtle Fog in Dark Mode */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div
          className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[128px] transition-colors duration-500
          bg-emerald-500/10 dark:bg-white/5"
        />
        <div
          className="absolute top-[10%] -right-[10%] w-[40%] h-[60%] rounded-full blur-[128px] transition-colors duration-500
          bg-stone-500/10 dark:bg-white/5"
        />
      </div>

      {/* --- CARD CONTAINER --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg z-10 p-0.5 transition-all duration-300
          /* Light: Rounded, Shadow */
          rounded-3xl shadow-2xl
          /* Dark: Sharp, No Shadow */
          dark:rounded-none dark:shadow-none"
      >
        {/* --- BORDER LAYER --- */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl dark:rounded-none">
          {/* Spinning Gradient (Light Mode Only) */}
          <div
            className="absolute inset-[-200%] animate-[spin_4s_linear_infinite] 
              bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#a855f7_25%,#06b6d4_50%,#3b82f6_100%)]
              dark:hidden"
          />
          {/* Static Sharp White Border (Dark Mode Only) */}
          <div className="hidden dark:block absolute inset-0 border border-white/20" />
        </div>

        {/* --- CONTENT LAYER --- */}
        <div
          className="relative p-8 md:p-10 h-full backdrop-blur-xl transition-all duration-300
          /* Light: Rounded, White/80 */
          rounded-3xl bg-white/80
          /* Dark: Sharp, Deep Charcoal #0A0A0A */
          dark:rounded-none dark:bg-[#0A0A0A]"
        >
          <div className="text-center mb-8">
            <h2
              className="text-4xl font-extrabold mb-2 tracking-tight transition-colors
              text-stone-900 
              /* Dark: Uppercase, Widely Spaced */
              dark:text-white dark:uppercase dark:tracking-[0.2em] dark:text-2xl"
            >
              Create Account
            </h2>
            <p
              className="transition-colors text-sm
              text-stone-500 
              dark:text-neutral-500 dark:uppercase dark:tracking-widest"
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
                  /* Light: Rounded, Stone Colors */
                  rounded-xl bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder:text-stone-400
                  /* Dark: Sharp, Black/White High Contrast */
                  dark:rounded-none dark:bg-[#0F0F0F] dark:border-white/10 dark:text-white dark:focus:ring-0 dark:focus:border-white dark:placeholder:text-neutral-700"
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
                  /* Light: Rounded, Stone Colors */
                  rounded-xl bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder:text-stone-400
                  /* Dark: Sharp, Black/White High Contrast */
                  dark:rounded-none dark:bg-[#0F0F0F] dark:border-white/10 dark:text-white dark:focus:ring-0 dark:focus:border-white dark:placeholder:text-neutral-700"
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
                  /* Light: Rounded, Stone Colors */
                  rounded-xl bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder:text-stone-400
                  /* Dark: Sharp, Black/White High Contrast */
                  dark:rounded-none dark:bg-[#0F0F0F] dark:border-white/10 dark:text-white dark:focus:ring-0 dark:focus:border-white dark:placeholder:text-neutral-700"
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
                  dark:text-neutral-600 dark:hover:text-white"
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
                  /* Light: Rounded, Stone Colors */
                  rounded-xl bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                  /* Dark: Sharp, Black/White High Contrast */
                  dark:rounded-none dark:bg-[#0F0F0F] dark:border-white/10 dark:text-white dark:focus:ring-0 dark:focus:border-white"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="STUDENT">I am a Student</option>
                <option value="COMPANY">I am a Company</option>
                <option value="ADMIN">I am an Admin</option>
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
                      text-stone-500 dark:text-neutral-500"
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
                          rounded-xl bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 placeholder:text-stone-400
                          dark:rounded-none dark:bg-[#0F0F0F] dark:border-white/10 dark:text-white dark:focus:ring-0 dark:focus:border-white dark:placeholder:text-neutral-700"
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
                          rounded-xl bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 placeholder:text-stone-400
                          dark:rounded-none dark:bg-[#0F0F0F] dark:border-white/10 dark:text-white dark:focus:ring-0 dark:focus:border-white dark:placeholder:text-neutral-700"
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
                dark:rounded-none dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:shadow-none dark:uppercase dark:tracking-widest dark:text-sm"
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
              text-stone-500 dark:text-neutral-500 dark:uppercase dark:tracking-widest"
            >
              ALREADY HAVE AN ACCOUNT?{' '}
              <Link
                href="/auth/login"
                className="font-bold hover:underline transition-all
                  text-emerald-600 hover:text-emerald-500
                  dark:text-white dark:hover:text-neutral-300"
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
