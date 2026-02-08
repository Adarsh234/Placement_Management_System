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
            'rounded-2xl shadow-xl border border-stone-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white',
          title: 'font-bold',
          confirmButton: 'px-6 py-3 rounded-xl text-lg font-bold',
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
    // 1. CONTAINER: Adapts background color
    <div
      className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-300
      bg-stone-50 dark:bg-slate-950"
    >
      {/* 2. BACKGROUND DECOR: Adapts colors */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div
          className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[128px] transition-colors duration-500
          bg-emerald-500/10 dark:bg-blue-500/10"
        />
        <div
          className="absolute top-[10%] -right-[10%] w-[40%] h-[60%] rounded-full blur-[128px] transition-colors duration-500
          bg-stone-500/10 dark:bg-purple-500/10"
        />
      </div>

      {/* --- NEON BORDER CONTAINER --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg z-10 rounded-3xl overflow-hidden shadow-2xl p-0.5"
      >
        {/* --- MOVING LIGHT LAYER --- */}
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
              Create Account
            </h2>
            <p
              className="transition-colors
              text-stone-500 dark:text-slate-400"
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
                className="mb-6 p-3 rounded-lg border flex items-center gap-3 text-sm font-medium overflow-hidden
                  bg-red-50 border-red-200 text-red-600
                  dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
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
                dark:text-slate-500 dark:group-focus-within:text-blue-500"
              >
                <User size={20} />
              </div>
              <input
                className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all font-medium
                  bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                  dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:focus:ring-blue-500 dark:focus:border-transparent
                  placeholder:text-stone-400 dark:placeholder:text-slate-600"
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
                dark:text-slate-500 dark:group-focus-within:text-blue-500"
              >
                <Mail size={20} />
              </div>
              <input
                className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all font-medium
                  bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                  dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:focus:ring-blue-500 dark:focus:border-transparent
                  placeholder:text-stone-400 dark:placeholder:text-slate-600"
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
                placeholder="Password"
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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

            {/* Role Selection */}
            <div className="relative group">
              <div
                className="absolute left-3 top-3.5 transition-colors
                text-stone-400 group-focus-within:text-emerald-600
                dark:text-slate-500 dark:group-focus-within:text-blue-500"
              >
                <Briefcase size={20} />
              </div>
              <select
                className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all font-medium appearance-none cursor-pointer
                  bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
                  dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:focus:ring-blue-500 dark:focus:border-transparent"
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
                border-t-stone-400 dark:border-t-slate-500"
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
                    border-stone-200 dark:border-slate-800"
                  >
                    <p
                      className="text-sm font-bold uppercase tracking-wider pl-1
                      text-stone-500 dark:text-slate-500"
                    >
                      Company Details
                    </p>

                    <div className="relative group">
                      <div
                        className="absolute left-3 top-3.5 transition-colors
                        text-stone-400 group-focus-within:text-purple-600
                        dark:text-slate-500 dark:group-focus-within:text-purple-500"
                      >
                        <Building size={20} />
                      </div>
                      <input
                        className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all font-medium
                          bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500
                          dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:focus:ring-purple-500 dark:focus:border-transparent
                          placeholder:text-stone-400 dark:placeholder:text-slate-600"
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
                        dark:text-slate-500 dark:group-focus-within:text-purple-500"
                      >
                        <Globe size={20} />
                      </div>
                      <input
                        className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all font-medium
                          bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500
                          dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:focus:ring-purple-500 dark:focus:border-transparent
                          placeholder:text-stone-400 dark:placeholder:text-slate-600"
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
              className="w-full p-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6 border border-transparent relative overflow-hidden group active:scale-[0.98]
                bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20
                dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 dark:shadow-blue-500/20"
            >
              <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Register Now <ArrowRight size={20} />
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
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="font-bold hover:underline transition-all
                  text-emerald-600 hover:text-emerald-500
                  dark:text-blue-500 dark:hover:text-blue-400"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
