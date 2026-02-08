'use client'
import { useEffect, useState } from 'react'
import API from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'
// 1. Import SweetAlert2
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

// 2. Initialize the wrapper
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

      // ✅ SUCCESS POPUP
      MySwal.fire({
        icon: 'success',
        title: 'Application Sent!',
        text: 'Good luck! The company has received your application.',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
        iconColor: '#3b82f6',
      })
    } catch (err) {
      // ⚠️ ERROR POPUP
      MySwal.fire({
        icon: 'warning',
        title: 'Already Applied',
        text: 'You have already submitted an application for this position.',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#fbbf24',
        iconColor: '#fbbf24',
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

      // ✅ SUCCESS POPUP
      MySwal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Profile Updated Successfully',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#1e293b',
        color: '#fff',
        iconColor: '#22c55e',
      })
    } catch (err) {
      console.error(err)
      // ❌ FAILURE POPUP
      MySwal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Something went wrong while saving your profile. Please try again.',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#ef4444',
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  return (
    <div className="min-h-screen text-slate-100 font-sans relative">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 p-8 pb-0">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Briefcase className="text-blue-500" size={32} />
            Student Portal
          </h1>
          <p className="text-slate-400 mt-1">
            Browse and apply to campus placement drives.
          </p>
        </div>

        {/* Edit Profile Button */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="bg-slate-900 px-6 py-3 rounded-xl border border-slate-800 flex items-center gap-3 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all group"
        >
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <UserCircle size={24} />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide group-hover:text-slate-400">
              My Account
            </p>
            <p className="text-sm font-bold text-slate-200">
              Edit Profile & Resume
            </p>
          </div>
        </button>
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
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
              onClick={() => setIsProfileOpen(false)}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 m-auto z-50 w-full max-w-lg h-fit bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Update Profile</h2>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">
                      Roll Number
                    </label>
                    <input
                      required
                      value={profile.roll_number}
                      onChange={(e) =>
                        setProfile({ ...profile, roll_number: e.target.value })
                      }
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder:text-slate-600"
                      placeholder="e.g. 2026CS101"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">
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
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder:text-slate-600"
                      placeholder="e.g. 8.5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">
                    Skills{' '}
                    <span className="text-xs font-normal text-slate-500">
                      (Comma separated)
                    </span>
                  </label>
                  <input
                    value={profile.skills}
                    onChange={(e) =>
                      setProfile({ ...profile, skills: e.target.value })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder:text-slate-600"
                    placeholder="Java, React, Python, SQL..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400">
                    Resume Link (Google Drive)
                  </label>
                  <input
                    required
                    value={profile.resume_url}
                    onChange={(e) =>
                      setProfile({ ...profile, resume_url: e.target.value })
                    }
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder:text-slate-600"
                    placeholder="https://drive.google.com/..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 className="animate-spin" size={18} /> Saving...
                      </>
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
            <Search className="text-slate-500" size={20} />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-full shadow-lg shadow-black/20 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-500"
            placeholder="Search for roles (e.g. 'Software Engineer') or companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full text-center py-20 text-slate-500 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              Loading opportunities...
            </div>
          )}

          {!loading && filteredJobs.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500">
              No opportunities found. <br />
              <span className="text-sm text-slate-600">
                (Try searching for something else)
              </span>
            </div>
          )}

          {!loading &&
            filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-800 hover:border-slate-700 hover:shadow-lg transition-all duration-300 group relative"
              >
                {/* Decorative glow on hover */}
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors border border-slate-700">
                      <Building size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-sm font-medium text-slate-400">
                        {job.company_name || 'Unnamed Company'}
                      </p>

                      {job.location && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                          <MapPin size={12} /> {job.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                    <DollarSign size={12} /> {job.salary_package}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
                    <CheckCircle2 size={12} /> CGPA {job.min_cgpa}+
                  </span>
                </div>

                <p className="text-sm text-slate-400 mb-6 line-clamp-2 leading-relaxed relative z-10">
                  {job.description}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-800 relative z-10">
                  <button
                    onClick={() => handleApply(job.id)}
                    className="flex-1 bg-white text-slate-900 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-black/10"
                  >
                    Apply Now
                  </button>
                  <button className="p-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
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
