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
        color: '#1c1917',
        confirmButtonColor: '#10b981',
        customClass: {
          popup:
            'rounded-2xl border border-stone-200 dark:bg-[#0A0A0A] dark:border-white/20 dark:text-white dark:rounded-none',
          title: 'uppercase tracking-widest font-bold',
          confirmButton:
            'dark:bg-white dark:text-black dark:rounded-none font-bold',
        },
      })
    } catch (err) {
      MySwal.fire({
        icon: 'warning',
        title: 'Already Applied',
        text: 'You have already submitted an application for this position.',
        background: '#fff',
        color: '#1c1917',
        confirmButtonColor: '#f59e0b',
        customClass: {
          popup:
            'rounded-2xl border border-stone-200 dark:bg-[#0A0A0A] dark:border-white/20 dark:text-white dark:rounded-none',
          title: 'uppercase tracking-widest font-bold',
          confirmButton:
            'dark:bg-white dark:text-black dark:rounded-none font-bold',
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
          popup:
            'dark:bg-[#0A0A0A] dark:text-white dark:border-white/20 dark:rounded-none',
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
          popup:
            'dark:bg-[#0A0A0A] dark:text-white dark:border-white/20 dark:rounded-none',
        },
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  return (
    // MAIN CONTAINER: Light Stone vs Dark Deep Charcoal
    <div
      className="min-h-screen font-sans relative transition-colors duration-300 
      bg-stone-50 text-stone-900 
      dark:bg-[#050505] dark:text-white"
    >
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 p-8 pb-0">
        <div>
          <h1
            className="text-3xl font-bold flex items-center gap-3 transition-colors
            text-stone-800 
            dark:text-white dark:uppercase dark:tracking-tighter"
          >
            <Briefcase
              className="transition-colors text-emerald-600 dark:text-white"
              size={32}
              strokeWidth={1.5}
            />
            Student Portal
          </h1>
          <p
            className="mt-1 transition-colors
            text-stone-500 
            dark:text-neutral-500 dark:uppercase dark:tracking-widest dark:text-xs"
          >
            Browse and apply to campus placement drives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Edit Profile Button */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="px-6 py-3 border flex items-center gap-3 transition-all group shadow-sm
              rounded-xl bg-white border-stone-200 hover:border-emerald-500/50 hover:shadow-lg
              /* Dark: Sharp, Ghost */
              dark:rounded-none dark:bg-transparent dark:border-white/20 dark:hover:bg-white/5 dark:hover:border-white/50 dark:shadow-none"
          >
            <div
              className="p-2 transition-colors
                rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white
                /* Dark: Inverted Icon Box */
                dark:rounded-none dark:bg-white/10 dark:text-white dark:group-hover:bg-white dark:group-hover:text-black"
            >
              <UserCircle size={24} strokeWidth={1.5} />
            </div>
            <div className="text-left">
              <p
                className="text-xs font-bold uppercase tracking-wide transition-colors
                  text-stone-400 group-hover:text-stone-500
                  dark:text-neutral-500 dark:group-hover:text-white dark:tracking-widest"
              >
                My Account
              </p>
              <p
                className="text-sm font-bold transition-colors
                text-stone-700 
                dark:text-white dark:uppercase dark:tracking-wide"
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
              className="fixed inset-0 z-40 backdrop-blur-md
                bg-stone-900/20 dark:bg-black/80"
              onClick={() => setIsProfileOpen(false)}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 m-auto z-50 w-full max-w-lg h-fit border shadow-2xl overflow-hidden
                rounded-2xl bg-white border-stone-200
                /* Dark: Sharp, Deep Charcoal */
                dark:rounded-none dark:bg-[#0A0A0A] dark:border-white/20 dark:shadow-none"
            >
              <div
                className="p-6 border-b flex justify-between items-center
                  border-stone-100 dark:border-white/10"
              >
                <h2 className="text-xl font-bold text-stone-800 dark:text-white dark:uppercase dark:tracking-widest">
                  Update Profile
                </h2>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="transition-colors
                    text-stone-400 hover:text-red-500 
                    dark:text-neutral-500 dark:hover:text-white"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wide text-stone-500 dark:text-neutral-500 dark:text-xs">
                      Roll Number
                    </label>
                    <input
                      required
                      value={profile.roll_number}
                      onChange={(e) =>
                        setProfile({ ...profile, roll_number: e.target.value })
                      }
                      className="w-full p-3 border outline-none transition-all
                        rounded-lg bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500 text-stone-900 placeholder:text-stone-400
                        /* Dark: Sharp, Wireframe */
                        dark:rounded-none dark:bg-transparent dark:border-white/20 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-700"
                      placeholder="e.g. 2026CS101"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wide text-stone-500 dark:text-neutral-500 dark:text-xs">
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
                      className="w-full p-3 border outline-none transition-all
                        rounded-lg bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500 text-stone-900 placeholder:text-stone-400
                        dark:rounded-none dark:bg-transparent dark:border-white/20 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-700"
                      placeholder="e.g. 8.5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-stone-500 dark:text-neutral-500 dark:text-xs">
                    Skills
                  </label>
                  <input
                    value={profile.skills}
                    onChange={(e) =>
                      setProfile({ ...profile, skills: e.target.value })
                    }
                    className="w-full p-3 border outline-none transition-all
                      rounded-lg bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500 text-stone-900 placeholder:text-stone-400
                      dark:rounded-none dark:bg-transparent dark:border-white/20 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-700"
                    placeholder="Java, React..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-stone-500 dark:text-neutral-500 dark:text-xs">
                    Resume Link
                  </label>
                  <input
                    required
                    value={profile.resume_url}
                    onChange={(e) =>
                      setProfile({ ...profile, resume_url: e.target.value })
                    }
                    className="w-full p-3 border outline-none transition-all
                      rounded-lg bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500 text-stone-900 placeholder:text-stone-400
                      dark:rounded-none dark:bg-transparent dark:border-white/20 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-700"
                    placeholder="https://drive.google.com/..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="w-full py-4 font-bold transition-all flex justify-center items-center gap-2 text-white uppercase tracking-widest text-sm
                      rounded-lg bg-emerald-600 hover:bg-emerald-700
                      /* Dark: Solid White Block */
                      dark:rounded-none dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                  >
                    {isSavingProfile ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Save size={18} /> SAVE CHANGES
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
            <Search
              className="text-stone-400 dark:text-neutral-500"
              size={20}
            />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-4 border outline-none transition-all shadow-lg
              rounded-full bg-white border-stone-200 shadow-stone-200/50 focus:ring-2 focus:ring-emerald-500 text-stone-800 placeholder:text-stone-400
              /* Dark: Sharp Wireframe Search */
              dark:rounded-none dark:bg-transparent dark:border-white/20 dark:shadow-none dark:focus:ring-0 dark:focus:border-white dark:text-white dark:placeholder:text-neutral-600"
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
            dark:bg-red-900/20 dark:text-red-400 dark:border-red-500/50 dark:rounded-none"
          >
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full text-center py-20 flex flex-col items-center gap-4 text-stone-500 dark:text-neutral-500 dark:uppercase dark:tracking-widest dark:text-xs">
              <Loader2
                className="animate-spin text-emerald-500 dark:text-white"
                size={32}
              />
              Loading opportunities...
            </div>
          )}

          {!loading && filteredJobs.length === 0 && (
            <div className="col-span-full text-center py-20 text-stone-500 dark:text-neutral-500 dark:uppercase dark:tracking-widest dark:text-xs">
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
                className="p-8 border transition-all duration-300 group relative
                  rounded-2xl bg-white border-stone-200 hover:border-emerald-300 hover:shadow-xl shadow-sm
                  /* Dark: Sharp, Minimalist Card */
                  dark:rounded-none dark:bg-[#0A0A0A] dark:border-white/10 dark:hover:border-white dark:hover:bg-[#0F0F0F] dark:shadow-none"
              >
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex gap-4">
                    <div
                      className="w-14 h-14 flex items-center justify-center border transition-colors
                        rounded-lg bg-stone-100 text-stone-400 border-stone-200 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-200
                        /* Dark: Sharp Icon Box */
                        dark:rounded-none dark:bg-black dark:text-white dark:border-white/10 dark:group-hover:bg-white dark:group-hover:text-black dark:group-hover:border-white"
                    >
                      <Building size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight text-stone-800 dark:text-white dark:uppercase dark:tracking-wide">
                        {job.title}
                      </h3>
                      <p className="text-sm font-medium text-stone-500 dark:text-neutral-500 dark:mt-1">
                        {job.company_name || 'Unnamed Company'}
                      </p>
                      {job.location && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-stone-400 dark:text-neutral-600 dark:uppercase dark:tracking-wider">
                          <MapPin size={12} /> {job.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold border
                      rounded-md bg-emerald-50 text-emerald-700 border-emerald-200
                      /* Dark: Sharp Tag */
                      dark:rounded-none dark:bg-white/5 dark:text-white dark:border-white/20"
                  >
                    <DollarSign size={12} /> {job.salary_package}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold border
                      rounded-md bg-purple-50 text-purple-700 border-purple-200
                      /* Dark: Sharp Tag */
                      dark:rounded-none dark:bg-white/5 dark:text-white dark:border-white/20"
                  >
                    <CheckCircle2 size={12} /> CGPA {job.min_cgpa}+
                  </span>
                </div>

                <p className="text-sm mb-8 line-clamp-2 leading-relaxed relative z-10 text-stone-600 dark:text-neutral-400">
                  {job.description}
                </p>

                <div className="flex items-center gap-3 pt-6 border-t relative z-10 border-stone-100 dark:border-white/10">
                  <button
                    onClick={() => handleApply(job.id)}
                    className="flex-1 py-3 font-bold text-sm transition-all shadow-lg
                        rounded-lg bg-stone-900 text-white hover:bg-emerald-600 shadow-stone-900/10
                        /* Dark: White Ghost Button */
                        dark:rounded-none dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:shadow-none dark:uppercase dark:tracking-widest"
                  >
                    APPLY NOW
                  </button>
                  <button
                    className="p-3 border transition-colors
                      rounded-lg border-stone-200 text-stone-400 hover:text-stone-900 hover:bg-stone-100
                      /* Dark: Square Outline Button */
                      dark:rounded-none dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-black"
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
