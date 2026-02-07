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
        confirmButtonColor: '#3b82f6', // Blue
        background: '#1e293b', // Dark theme background
        color: '#fff',
        customClass: {
          popup: 'rounded-2xl shadow-xl border border-slate-700',
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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-[10%] -right-[10%] w-[40%] h-[60%] bg-purple-500/10 rounded-full blur-[128px]" />
      </div>

      {/* --- NEON BORDER CONTAINER ---
        1. We set p-[2px] which defines the thickness of the neon border.
        2. We add overflow-hidden to crop the spinning layer inside.
      */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg z-10 rounded-3xl overflow-hidden shadow-2xl p-0.5"
      >
        {/* --- THE MOVING LIGHT LAYER --- 
          This layer sits behind the content. It spins continuously. 
          We use a conic gradient to create the "snake" effect with blue, purple, and cyan colors.
          inset-[-200%] ensures the spinning box is much larger than the card so corners don't get cut off.
        */}
        <div className="absolute inset-[-200%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#a855f7_25%,#06b6d4_50%,#3b82f6_100%)]" />

        {/* --- THE ACTUAL FORM CONTENT LAYER ---
          This sits on top of the spinning light. It needs a solid (or slightly transparent) background
          to hide the spinning gradient in the center, revealing only the edges.
        */}
        <div className="relative bg-slate-900/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl h-full">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
              Create Account
            </h2>
            <p className="text-slate-400">
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
                className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm font-medium overflow-hidden"
              >
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div className="relative group">
              <div className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                <User size={20} />
              </div>
              <input
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600 font-medium"
                placeholder="Full Name"
                required
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <div className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                <Mail size={20} />
              </div>
              <input
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600 font-medium"
                placeholder="Email Address"
                type="email"
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <div className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                <Lock size={20} />
              </div>
              <input
                className="w-full pl-10 pr-12 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600 font-medium"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Role Selection */}
            <div className="relative group">
              <div className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                <Briefcase size={20} />
              </div>
              <select
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white font-medium appearance-none cursor-pointer"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="STUDENT">I am a Student</option>
                <option value="COMPANY">I am a Company</option>
                <option value="ADMIN">I am an Admin</option>
              </select>
              {/* Custom Chevron */}
              <div className="absolute right-4 top-4 pointer-events-none border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-slate-500"></div>
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
                  <div className="space-y-4 pt-4 pb-2 border-t border-slate-800 mt-2">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider pl-1">
                      Company Details
                    </p>

                    <div className="relative group">
                      <div className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-purple-500 transition-colors">
                        <Building size={20} />
                      </div>
                      <input
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600 font-medium"
                        placeholder="Company Name"
                        required
                        onChange={(e) =>
                          setForm({ ...form, companyName: e.target.value })
                        }
                      />
                    </div>

                    <div className="relative group">
                      <div className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-purple-500 transition-colors">
                        <Globe size={20} />
                      </div>
                      <input
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600 font-medium"
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
              className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-blue-500 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6 border border-transparent relative overflow-hidden group"
            >
              {/* Button slight glow effect */}
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
            <p className="text-slate-400 font-medium">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-blue-500 font-bold hover:text-blue-400 hover:underline transition-all"
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
