'use client'
import { useEffect, useState } from 'react'
import API from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {
  Search,
  Briefcase,
  UserCircle,
  CheckCircle2,
  Building,
  ExternalLink,
  DollarSign,
  AlertCircle,
  X,
  Save,
  Loader2,
  MapPin,
} from 'lucide-react'

const MySwal = withReactContent(Swal)

export default function StudentDashboard() {
  const [jobs, setJobs] = useState<any[]>([])
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Profile State
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profile, setProfile] = useState({
    resume_url: '',
    roll_number: '',
    cgpa: '',
    skills: '',
  })

  useEffect(() => {
    loadJobs()
    fetchProfile()
  }, [])

  useEffect(() => {
    if (!jobs) return
    const results = jobs.filter((job) => {
      const title = job.title?.toLowerCase() || ''
      const company = job.company_name?.toLowerCase() || ''
      const query = searchQuery.toLowerCase()
      return title.includes(query) || company.includes(query)
    })
    setFilteredJobs(results)
  }, [searchQuery, jobs])

  const loadJobs = () => {
    setLoading(true)
    API.get('/jobs')
      .then((res) => {
        setJobs(res.data)
        setFilteredJobs(res.data)
      })
      .catch((err) => {
        console.error('Error loading jobs:', err)
        setError('Failed to load jobs.')
      })
      .finally(() => setLoading(false))
  }

  const fetchProfile = () => {
    API.get('/student/profile')
      .then((res) => {
        const data = res.data
        setProfile({
          resume_url: data.resume_url || '',
          roll_number: data.roll_number || '',
          cgpa: data.cgpa || '',
          skills: data.skills ? data.skills.join(', ') : '',
        })
      })
      .catch((err) => console.error('Failed to fetch profile', err))
  }

  const handleApply = async (jobId: number) => {
    try {
      await API.post('/jobs/apply', { jobId })
      MySwal.fire({
        icon: 'success',
        title: 'Application Sent!',
        text: 'Good luck! The company has received your application.',
        background: '#fff',
        color: '#1c1917', // Stone-900
        confirmButtonColor: '#10b981', // Emerald-500
        customClass: {
          popup:
            'rounded-2xl border border-stone-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white',
        },
      })
    } catch (err) {
      MySwal.fire({
        icon: 'warning',
        title: 'Already Applied',
        text: 'You have already submitted an application for this position.',
        background: '#fff',
        color: '#1c1917',
        confirmButtonColor: '#f59e0b', // Amber-500
        customClass: {
          popup:
            'rounded-2xl border border-stone-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white',
        },
      })
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)
    try {
      const skillsArray = profile.skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      await API.put('/student/profile', {
        resumeUrl: profile.resume_url,
        rollNumber: profile.roll_number,
        cgpa: profile.cgpa,
        skills: skillsArray,
      })

      setIsProfileOpen(false)
      MySwal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Profile Updated',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#fff',
        color: '#1c1917',
        customClass: {
          popup: 'dark:bg-slate-900 dark:text-white',
        },
      })
    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Please try again.',
        background: '#fff',
        color: '#1c1917',
        customClass: {
          popup: 'dark:bg-slate-900 dark:text-white',
        },
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  return (
    // MAIN CONTAINER: Stone (Light) vs Slate (Dark)
    <div
      className="min-h-screen font-sans relative transition-colors duration-300 
      bg-stone-50 text-stone-900 
      dark:bg-slate-950 dark:text-slate-100"
    >
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 p-8 pb-0">
        <div>
          <h1
            className="text-3xl font-bold flex items-center gap-2 transition-colors
            text-stone-800 dark:text-white"
          >
            <Briefcase
              className="transition-colors text-emerald-600 dark:text-blue-500"
              size={32}
            />
            Student Portal
          </h1>
          <p
            className="mt-1 transition-colors
            text-stone-500 dark:text-slate-400"
          >
            Browse and apply to campus placement drives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle REMOVED */}

          {/* Edit Profile Button */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="px-6 py-3 rounded-xl border flex items-center gap-3 transition-all group shadow-sm
              bg-white border-stone-200 hover:border-emerald-500/50 hover:shadow-lg
              dark:bg-slate-900 dark:border-slate-800 dark:hover:border-blue-500/50 dark:hover:shadow-blue-900/20"
          >
            <div
              className="p-2 rounded-lg transition-colors
                bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white
                dark:bg-blue-500/10 dark:text-blue-400 dark:group-hover:bg-blue-500 dark:group-hover:text-white"
            >
              <UserCircle size={24} />
            </div>
            <div className="text-left">
              <p
                className="text-xs font-bold uppercase tracking-wide transition-colors
                  text-stone-400 group-hover:text-stone-500
                  dark:text-slate-500 dark:group-hover:text-slate-400"
              >
                My Account
              </p>
              <p
                className="text-sm font-bold transition-colors
                text-stone-700 dark:text-slate-200"
              >
                Edit Profile
              </p>
            </div>
          </button>
        </div>
      </header>

      {/* --- PROFILE MODAL --- */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 backdrop-blur-sm 
                bg-stone-900/20 dark:bg-slate-950/80"
              onClick={() => setIsProfileOpen(false)}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 m-auto z-50 w-full max-w-lg h-fit rounded-2xl shadow-2xl overflow-hidden border
                bg-white border-stone-200
                dark:bg-slate-900 dark:border-slate-800"
            >
              <div
                className="p-6 border-b flex justify-between items-center
                  border-stone-100 dark:border-slate-800"
              >
                <h2 className="text-xl font-bold text-stone-800 dark:text-white">
                  Update Profile
                </h2>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="transition-colors
                    text-stone-400 hover:text-red-500 
                    dark:text-slate-500 dark:hover:text-red-400"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-500 dark:text-slate-400">
                      Roll Number
                    </label>
                    <input
                      required
                      value={profile.roll_number}
                      onChange={(e) =>
                        setProfile({ ...profile, roll_number: e.target.value })
                      }
                      className="w-full p-3 rounded-lg outline-none transition-all border
                        bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500 text-stone-900 placeholder:text-stone-400
                        dark:bg-slate-950 dark:border-slate-800 dark:focus:ring-blue-500 dark:text-white dark:placeholder:text-slate-600"
                      placeholder="e.g. 2026CS101"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-500 dark:text-slate-400">
                      CGPA
                    </label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={profile.cgpa}
                      onChange={(e) =>
                        setProfile({ ...profile, cgpa: e.target.value })
                      }
                      className="w-full p-3 rounded-lg outline-none transition-all border
                        bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500 text-stone-900 placeholder:text-stone-400
                        dark:bg-slate-950 dark:border-slate-800 dark:focus:ring-blue-500 dark:text-white dark:placeholder:text-slate-600"
                      placeholder="e.g. 8.5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-500 dark:text-slate-400">
                    Skills
                  </label>
                  <input
                    value={profile.skills}
                    onChange={(e) =>
                      setProfile({ ...profile, skills: e.target.value })
                    }
                    className="w-full p-3 rounded-lg outline-none transition-all border
                      bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500 text-stone-900 placeholder:text-stone-400
                      dark:bg-slate-950 dark:border-slate-800 dark:focus:ring-blue-500 dark:text-white dark:placeholder:text-slate-600"
                    placeholder="Java, React..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-500 dark:text-slate-400">
                    Resume Link
                  </label>
                  <input
                    required
                    value={profile.resume_url}
                    onChange={(e) =>
                      setProfile({ ...profile, resume_url: e.target.value })
                    }
                    className="w-full p-3 rounded-lg outline-none transition-all border
                      bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500 text-stone-900 placeholder:text-stone-400
                      dark:bg-slate-950 dark:border-slate-800 dark:focus:ring-blue-500 dark:text-white dark:placeholder:text-slate-600"
                    placeholder="https://drive.google.com/..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="w-full py-3 rounded-lg font-bold transition-colors flex justify-center items-center gap-2 text-white
                      bg-emerald-600 hover:bg-emerald-700
                      dark:bg-blue-600 dark:hover:bg-blue-500"
                  >
                    {isSavingProfile ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Save size={18} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="p-8 pt-0">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-stone-400 dark:text-slate-500" size={20} />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-4 rounded-full outline-none transition-all shadow-lg border
                bg-white border-stone-200 shadow-stone-200/50 focus:ring-2 focus:ring-emerald-500 text-stone-800 placeholder:text-stone-400
                dark:bg-slate-900 dark:border-slate-800 dark:shadow-black/20 dark:focus:ring-blue-500 dark:text-white dark:placeholder:text-slate-500"
            placeholder="Search roles or companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="max-w-4xl mx-auto mb-8 p-4 rounded-lg flex items-center gap-2 border
            bg-red-50 text-red-600 border-red-200
            dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
          >
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full text-center py-20 flex flex-col items-center gap-4 text-stone-500 dark:text-slate-500">
              <Loader2
                className="animate-spin text-emerald-500 dark:text-blue-500"
                size={32}
              />
              Loading opportunities...
            </div>
          )}

          {!loading && filteredJobs.length === 0 && (
            <div className="col-span-full text-center py-20 text-stone-500 dark:text-slate-500">
              No opportunities found.
            </div>
          )}

          {!loading &&
            filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl p-6 shadow-sm border transition-all duration-300 group relative
                    bg-white border-stone-200 hover:border-emerald-300 hover:shadow-xl
                    dark:bg-slate-900/50 dark:backdrop-blur-sm dark:border-slate-800 dark:hover:border-blue-500/50 dark:hover:shadow-lg"
              >
                {/* Decorative glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl transition-opacity pointer-events-none opacity-0 group-hover:opacity-100
                    bg-emerald-500/5 dark:bg-blue-500/5"
                />

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center border transition-colors
                        bg-stone-100 text-stone-400 border-stone-200 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-200
                        dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400 dark:group-hover:border-blue-500/30"
                    >
                      <Building size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight text-stone-800 dark:text-white">
                        {job.title}
                      </h3>
                      <p className="text-sm font-medium text-stone-500 dark:text-slate-400">
                        {job.company_name || 'Unnamed Company'}
                      </p>
                      {job.location && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-stone-400 dark:text-slate-500">
                          <MapPin size={12} /> {job.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border
                      bg-emerald-50 text-emerald-700 border-emerald-200
                      dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                  >
                    <DollarSign size={12} /> {job.salary_package}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border
                      bg-purple-50 text-purple-700 border-purple-200
                      dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20"
                  >
                    <CheckCircle2 size={12} /> CGPA {job.min_cgpa}+
                  </span>
                </div>

                <p className="text-sm mb-6 line-clamp-2 leading-relaxed relative z-10 text-stone-600 dark:text-slate-400">
                  {job.description}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t relative z-10 border-stone-100 dark:border-slate-800">
                  <button
                    onClick={() => handleApply(job.id)}
                    className="flex-1 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg
                        bg-stone-900 text-white hover:bg-emerald-600 shadow-stone-900/10
                        dark:bg-white dark:text-slate-900 dark:hover:bg-blue-500 dark:hover:text-white dark:shadow-black/10"
                  >
                    Apply Now
                  </button>
                  <button
                    className="p-2.5 rounded-lg border transition-colors
                      border-stone-200 text-stone-400 hover:text-stone-900 hover:bg-stone-100
                      dark:border-slate-700 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                  >
                    <ExternalLink size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  )
}
