'use client'
import { useState, useEffect } from 'react'
import API from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {
  Building2,
  Briefcase,
  Users,
  PlusCircle,
  List,
  FileText,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2,
  UserCog,
  MapPin,
  Globe,
  Save,
  Clock,
  ChevronDown,
} from 'lucide-react'

const MySwal = withReactContent(Swal)

// Helper to format enum strings to readable text (e.g. "TECHNICAL_ROUND" -> "Technical Round")
const formatStatus = (status: string) => {
  if (!status) return 'PENDING'
  return status.replace(/_/g, ' ')
}

// NEW: Define the options and their specific hover colors for the custom dropdown
const STATUS_OPTIONS = [
  {
    value: 'PENDING',
    label: 'Pending',
    hoverClass:
      'hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-900/30 dark:hover:text-amber-400',
  },
  {
    value: 'SHORTLISTED',
    label: 'Shortlisted',
    hoverClass:
      'hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-400',
  },
  {
    value: 'APTITUDE_ROUND',
    label: 'Aptitude Round',
    hoverClass:
      'hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-900/30 dark:hover:text-violet-400',
  },
  {
    value: 'TECHNICAL_ROUND',
    label: 'Technical Round',
    hoverClass:
      'hover:bg-fuchsia-50 hover:text-fuchsia-700 dark:hover:bg-fuchsia-900/30 dark:hover:text-fuchsia-400',
  },
  {
    value: 'INTERVIEW',
    label: 'Interview',
    hoverClass:
      'hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/30 dark:hover:text-purple-400',
  },
  {
    value: 'SELECTED',
    label: 'Selected',
    hoverClass:
      'hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400',
  },
  {
    value: 'REJECTED',
    label: 'Rejected',
    hoverClass:
      'hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-400',
  },
]

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState('list')
  const [allJobs, setAllJobs] = useState<any[]>([])
  const [myJobs, setMyJobs] = useState<any[]>([])
  const [applicants, setApplicants] = useState<any[]>([])
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [selectedJobTitle, setSelectedJobTitle] = useState('')
  const [loading, setLoading] = useState(false)

  // NEW: State to track which dropdown is currently open
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)

  // Greeting & Date State
  const [greeting, setGreeting] = useState('Welcome back')
  const [currentDate, setCurrentDate] = useState('')

  // Profile State
  const [profile, setProfile] = useState({
    company_name: '',
    website: '',
    location: '',
    description: '',
  })

  // Job Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    min_cgpa: '',
    salary_package: '',
    deadline: '',
  })

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 18) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')

    setCurrentDate(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    )

    fetchJobs()
    fetchProfile()
  }, [])

  useEffect(() => {
    if (profile.company_name) {
      const filteredJobs = allJobs.filter(
        (job) => job.company_name === profile.company_name,
      )
      setMyJobs(filteredJobs)
    } else {
      setMyJobs([])
    }
  }, [allJobs, profile.company_name])

  const fetchJobs = () => {
    API.get('/jobs').then((res) => setAllJobs(res.data))
  }

  const fetchProfile = () => {
    API.get('/jobs/profile')
      .then((res) => {
        setProfile({
          company_name: res.data.company_name || '',
          website: res.data.website || '',
          location: res.data.location || '',
          description: res.data.description || '',
        })
      })
      .catch((err) => console.error(err))
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.put('/jobs/profile', profile)
      await MySwal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Company details have been saved successfully.',
        background: '#fff',
        color: '#1c1917',
        confirmButtonColor: '#9333ea',
        customClass: {
          popup:
            'rounded-3xl border border-stone-200 dark:bg-black/80 dark:backdrop-blur-2xl dark:border-white/20 dark:text-white dark:rounded-none',
          title: 'uppercase tracking-widest font-bold',
          confirmButton:
            'dark:bg-white dark:text-black dark:rounded-none font-bold',
        },
      })
    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update profile',
        background: '#fff',
        color: '#1c1917',
        customClass: {
          popup:
            'rounded-3xl border border-stone-200 dark:bg-black/80 dark:backdrop-blur-2xl dark:border-white/20 dark:text-white dark:rounded-none',
          title: 'uppercase tracking-widest font-bold',
          confirmButton:
            'dark:bg-white dark:text-black dark:rounded-none font-bold',
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.post('/jobs', { ...form, company_name: profile.company_name })

      await MySwal.fire({
        icon: 'success',
        title: 'Job Posted Successfully!',
        text: 'Your new opportunity is now live for students.',
        confirmButtonColor: '#9333ea',
        background: '#fff',
        color: '#1c1917',
        customClass: {
          popup:
            'rounded-3xl border border-stone-200 dark:bg-black/80 dark:backdrop-blur-2xl dark:border-white/20 dark:text-white dark:rounded-none',
          title: 'uppercase tracking-widest font-bold',
          confirmButton:
            'dark:bg-white dark:text-black dark:rounded-none font-bold',
        },
      })

      setForm({
        title: '',
        description: '',
        min_cgpa: '',
        salary_package: '',
        deadline: '',
      })
      setActiveTab('list')
      fetchJobs()
    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Failed to Post',
        text: 'Something went wrong. Please try again.',
        background: '#fff',
        color: '#1c1917',
        customClass: {
          popup:
            'rounded-3xl border border-stone-200 dark:bg-black/80 dark:backdrop-blur-2xl dark:border-white/20 dark:text-white dark:rounded-none',
          title: 'uppercase tracking-widest font-bold',
          confirmButton:
            'dark:bg-white dark:text-black dark:rounded-none font-bold',
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const viewApplicants = async (jobId: number, jobTitle: string) => {
    setSelectedJob(jobId)
    setSelectedJobTitle(jobTitle)
    const res = await API.get(`/jobs/${jobId}/applicants`)
    setApplicants(res.data)
    setActiveTab('applicants')
  }

  const updateStatus = async (
    appId: number,
    status: string,
    studentName: string,
  ) => {
    // Close the dropdown immediately after selection
    setOpenDropdownId(null)

    const isRejection = status === 'REJECTED'
    const isSelection = status === 'SELECTED'

    let confirmColor = '#9333ea' // Purple default
    if (isRejection) confirmColor = '#ef4444' // Red
    if (isSelection) confirmColor = '#10b981' // Emerald

    const result = await MySwal.fire({
      title: isRejection ? 'Reject Candidate?' : 'Update Stage?',
      text: `Are you sure you want to move ${studentName} to ${formatStatus(status)}?`,
      icon: isRejection ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonColor: confirmColor,
      cancelButtonColor: '#64748b',
      confirmButtonText: `Yes, update to ${formatStatus(status)}`,
      background: '#fff',
      color: '#1c1917',
      customClass: {
        popup:
          'rounded-3xl border border-stone-200 dark:bg-black/80 dark:backdrop-blur-2xl dark:border-white/20 dark:text-white dark:rounded-none',
        title: 'uppercase tracking-widest font-bold',
        confirmButton:
          'dark:bg-white dark:text-black dark:rounded-none font-bold tracking-wider',
        cancelButton:
          'dark:bg-transparent dark:border dark:border-white/20 dark:text-white dark:rounded-none',
      },
    })

    if (!result.isConfirmed) return

    try {
      await API.put('/jobs/status', { applicationId: appId, status })
      setApplicants((prev) =>
        prev.map((app) =>
          app.application_id === appId ? { ...app, status } : app,
        ),
      )
      MySwal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Status updated to ${formatStatus(status)}`,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        background: '#fff',
        color: '#1c1917',
        customClass: {
          popup:
            'dark:bg-black/80 dark:backdrop-blur-md dark:text-white dark:border-white/20 dark:rounded-none',
        },
      })
    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update status',
        background: '#fff',
        color: '#1c1917',
        customClass: {
          popup:
            'dark:bg-black/80 dark:backdrop-blur-md dark:text-white dark:border-white/20 dark:rounded-none',
        },
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses =
      'px-2.5 py-1 text-[10px] font-bold border uppercase tracking-widest dark:rounded-none'

    switch (status) {
      case 'SHORTLISTED':
        return `${baseClasses} rounded-full bg-blue-50 text-blue-700 border-blue-200 dark:bg-white/10 dark:backdrop-blur-sm dark:text-blue-300 dark:border-blue-400/30`
      case 'APTITUDE_ROUND':
        return `${baseClasses} rounded-full bg-violet-50 text-violet-700 border-violet-200 dark:bg-white/10 dark:backdrop-blur-sm dark:text-violet-300 dark:border-violet-400/30`
      case 'TECHNICAL_ROUND':
        return `${baseClasses} rounded-full bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-white/10 dark:backdrop-blur-sm dark:text-fuchsia-300 dark:border-fuchsia-400/30`
      case 'INTERVIEW':
        return `${baseClasses} rounded-full bg-purple-50 text-purple-700 border-purple-200 dark:bg-white/10 dark:backdrop-blur-sm dark:text-purple-300 dark:border-purple-400/30`
      case 'SELECTED':
        return `${baseClasses} rounded-full bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-white/10 dark:backdrop-blur-sm dark:text-emerald-300 dark:border-emerald-400/30`
      case 'REJECTED':
        return `${baseClasses} rounded-full bg-red-50 text-red-700 border-red-200 dark:bg-transparent dark:text-neutral-500 dark:border-neutral-700 line-through`
      default: // PENDING
        return `${baseClasses} rounded-full bg-amber-50 text-amber-700 border-amber-200 dark:bg-transparent dark:text-neutral-400 dark:border-neutral-600`
    }
  }

  return (
    <div
      className="min-h-screen font-sans p-8 transition-colors duration-300 relative overflow-hidden
      bg-stone-50 text-stone-900 
      dark:bg-[#050505] dark:text-slate-100"
    >
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/photos/png.png')] bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-40 transition-opacity duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-100 via-stone-50/80 to-transparent dark:from-[#050505] dark:via-[#050505]/80 dark:to-transparent" />
        <div className="absolute inset-0 bg-stone-50/50 dark:bg-[#050505]/60" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] dark:opacity-[0.08] mix-blend-overlay" />
      </div>

      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-500 bg-emerald-500/20 dark:bg-emerald-500/10 z-1" />
      <div className="fixed bottom-0 right-1/4 w-120 h-120 rounded-full blur-[128px] pointer-events-none transition-colors duration-500 bg-purple-500/10 dark:bg-blue-600/10 z-1" />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 relative z-10">
        <div>
          <p className="text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2 drop-shadow-sm">
            <Clock size={14} strokeWidth={2} /> {currentDate}
          </p>
          <h1 className="text-3xl md:text-4xl font-black flex items-center gap-3 transition-colors drop-shadow-sm text-stone-800 dark:text-white dark:uppercase dark:tracking-tighter">
            {greeting},{' '}
            <span className="text-purple-600 dark:text-purple-400">
              {profile.company_name || 'Recruiter'}
            </span>
          </h1>
          <p className="mt-2 transition-colors text-stone-500 dark:text-neutral-500 dark:uppercase dark:tracking-widest dark:text-xs">
            Manage jobs, applicants, and company profile.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="p-1 border shadow-sm flex flex-wrap gap-1 transition-colors rounded-xl bg-white/70 backdrop-blur-md border-stone-200 dark:rounded-none dark:bg-black/40 dark:backdrop-blur-xl dark:border-white/20 dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all 
                ${
                  activeTab === 'list'
                    ? 'rounded-lg bg-purple-100 text-purple-700 dark:rounded-none dark:bg-white dark:text-black'
                    : 'rounded-lg text-stone-500 hover:bg-stone-100 dark:rounded-none dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5'
                }`}
            >
              <List size={16} strokeWidth={2} /> My Jobs
            </button>
            <button
              onClick={() => setActiveTab('post')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all 
                ${
                  activeTab === 'post'
                    ? 'rounded-lg bg-purple-100 text-purple-700 dark:rounded-none dark:bg-white dark:text-black'
                    : 'rounded-lg text-stone-500 hover:bg-stone-100 dark:rounded-none dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5'
                }`}
            >
              <PlusCircle size={16} strokeWidth={2} /> Post Job
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all 
                ${
                  activeTab === 'profile'
                    ? 'rounded-lg bg-purple-100 text-purple-700 dark:rounded-none dark:bg-white dark:text-black'
                    : 'rounded-lg text-stone-500 hover:bg-stone-100 dark:rounded-none dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5'
                }`}
            >
              <UserCog size={16} strokeWidth={2} /> Company Profile
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {/* --- COMPANY PROFILE TAB --- */}
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-3xl mx-auto relative z-10"
          >
            <div className="border p-8 transition-colors shadow-xl rounded-2xl bg-white/70 backdrop-blur-xl border-stone-200 dark:rounded-none dark:bg-black/40 dark:backdrop-blur-2xl dark:border-white/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <h2 className="text-lg font-bold mb-6 border-b pb-4 flex items-center gap-3 transition-colors text-stone-800 border-stone-100 dark:text-white dark:border-white/10 dark:uppercase dark:tracking-widest">
                <UserCog
                  size={24}
                  className="text-purple-600 dark:text-white"
                  strokeWidth={1.5}
                />{' '}
                Company Details
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-400">
                      Company Name
                    </label>
                    <div className="relative group">
                      <Building2
                        className="absolute left-3 top-3.5 text-stone-400 dark:text-white"
                        size={18}
                        strokeWidth={1.5}
                      />
                      <input
                        className="w-full pl-10 p-3 border outline-none transition-all rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white"
                        value={profile.company_name}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            company_name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-400">
                      Website
                    </label>
                    <div className="relative group">
                      <Globe
                        className="absolute left-3 top-3.5 text-stone-400 dark:text-white"
                        size={18}
                        strokeWidth={1.5}
                      />
                      <input
                        className="w-full pl-10 p-3 border outline-none transition-all rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white"
                        placeholder="https://..."
                        value={profile.website}
                        onChange={(e) =>
                          setProfile({ ...profile, website: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-400">
                    Location (Headquarters)
                  </label>
                  <div className="relative group">
                    <MapPin
                      className="absolute left-3 top-3.5 text-stone-400 dark:text-white"
                      size={18}
                      strokeWidth={1.5}
                    />
                    <input
                      className="w-full pl-10 p-3 border outline-none transition-all rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white"
                      placeholder="e.g. Bangalore, India"
                      value={profile.location}
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-400">
                    About the Company
                  </label>
                  <textarea
                    className="w-full h-32 p-3 border outline-none resize-none transition-all rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-500"
                    placeholder="Describe your company culture, mission, and values..."
                    value={profile.description}
                    onChange={(e) =>
                      setProfile({ ...profile, description: e.target.value })
                    }
                  />
                </div>

                <div className="pt-4">
                  <button
                    disabled={loading}
                    className="w-full py-4 font-bold transition-all shadow-lg flex justify-center items-center gap-2 text-white text-sm uppercase tracking-widest rounded-lg bg-purple-600 hover:bg-purple-700 shadow-purple-500/20 dark:rounded-none dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        {' '}
                        <Save size={18} strokeWidth={2} /> SAVE PROFILE{' '}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* --- POST JOB TAB --- */}
        {activeTab === 'post' && (
          <motion.div
            key="post"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-3xl mx-auto relative z-10"
          >
            <div className="border p-8 transition-colors shadow-xl rounded-2xl bg-white/70 backdrop-blur-xl border-stone-200 dark:rounded-none dark:bg-black/40 dark:backdrop-blur-2xl dark:border-white/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <h2 className="text-lg font-bold mb-6 border-b pb-4 transition-colors text-stone-800 border-stone-100 dark:text-white dark:border-white/10 dark:uppercase dark:tracking-widest">
                Create New Opportunity
              </h2>
              <form onSubmit={handlePostJob} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-400">
                      Job Title
                    </label>
                    <input
                      className="w-full p-3 border outline-none transition-all rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-500"
                      placeholder="e.g. Software Engineer"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-400">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border outline-none transition-all scheme-light dark:scheme-dark rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white"
                      value={form.deadline}
                      onChange={(e) =>
                        setForm({ ...form, deadline: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-400">
                    Job Description
                  </label>
                  <textarea
                    className="w-full h-32 p-3 border outline-none resize-none transition-all rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-500"
                    placeholder="Detail the role responsibilities and requirements..."
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-400">
                      Minimum CGPA
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full p-3 border outline-none transition-all rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-500"
                      placeholder="e.g. 7.5"
                      value={form.min_cgpa}
                      onChange={(e) =>
                        setForm({ ...form, min_cgpa: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-400">
                      Salary Package (CTC)
                    </label>
                    <input
                      className="w-full p-3 border outline-none transition-all rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-500"
                      placeholder="e.g. 12 LPA"
                      value={form.salary_package}
                      onChange={(e) =>
                        setForm({ ...form, salary_package: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled={loading}
                    className="w-full py-4 font-bold transition-all shadow-lg flex justify-center items-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-widest rounded-lg bg-purple-600 hover:bg-purple-700 shadow-purple-500/20 dark:rounded-none dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      'PUBLISH JOB POST'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* --- JOB LIST TAB --- */}
        {activeTab === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10"
          >
            {myJobs.length === 0 && (
              <div className="col-span-full text-center py-20 text-stone-500 dark:text-neutral-500 dark:uppercase dark:tracking-widest dark:text-xs">
                No jobs posted yet.
              </div>
            )}
            {myJobs.map((job) => (
              <div
                key={job.id}
                className="border p-6 transition-all duration-300 group relative rounded-2xl shadow-sm bg-white/70 backdrop-blur-xl border-stone-200 hover:shadow-md hover:-translate-y-1 dark:rounded-none dark:bg-black/40 dark:backdrop-blur-2xl dark:border-white/10 dark:hover:border-white/40 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              >
                <div className="absolute top-4 right-4 transition-colors text-stone-200 group-hover:text-purple-100 dark:text-white/5 dark:group-hover:text-white/20">
                  <Briefcase size={48} strokeWidth={1} />
                </div>
                <h3 className="font-black text-xl pr-8 transition-colors text-stone-800 dark:text-white dark:uppercase dark:tracking-wider leading-tight">
                  {job.title}
                </h3>
                <p className="text-xs mt-2 mb-6 transition-colors font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-500">
                  Posted: {new Date(job.created_at).toLocaleDateString()}
                </p>

                <div className="space-y-2 mb-6 relative z-10">
                  <div className="flex items-center justify-between text-sm p-2.5 border transition-colors rounded-lg bg-stone-50/50 border-stone-100 text-stone-500 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:text-neutral-400">
                    <span className="dark:uppercase dark:text-[10px] dark:font-bold dark:tracking-widest">
                      Package
                    </span>
                    <span className="font-black text-stone-700 dark:text-white">
                      {job.salary_package}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm p-2.5 border transition-colors rounded-lg bg-stone-50/50 border-stone-100 text-stone-500 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:text-neutral-400">
                    <span className="dark:uppercase dark:text-[10px] dark:font-bold dark:tracking-widest">
                      Min CGPA
                    </span>
                    <span className="font-black text-stone-700 dark:text-white">
                      {job.min_cgpa}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => viewApplicants(job.id, job.title)}
                  className="w-full flex items-center justify-center gap-2 py-3 border transition-colors text-xs font-bold uppercase tracking-widest relative z-10 rounded-xl bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200 hover:text-stone-900 dark:rounded-none dark:bg-transparent dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-black"
                >
                  <Users size={16} strokeWidth={2} /> VIEW APPLICANTS
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {/* --- APPLICANTS TABLE VIEW --- */}
        {activeTab === 'applicants' && selectedJob && (
          <motion.div
            key="applicants"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="relative z-10"
          >
            <button
              onClick={() => setActiveTab('list')}
              className="mb-6 flex items-center gap-2 transition-colors text-xs font-bold uppercase tracking-widest
                text-stone-500 hover:text-stone-900
                dark:text-neutral-400 dark:hover:text-white"
            >
              <ArrowLeft size={16} strokeWidth={2} /> BACK TO JOB LIST
            </button>

            <div
              className="border overflow-hidden shadow-xl
              rounded-2xl bg-white/70 backdrop-blur-xl border-stone-200
              dark:rounded-none dark:bg-black/40 dark:backdrop-blur-2xl dark:border-white/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              <div className="p-6 border-b flex justify-between items-center border-stone-100 dark:border-white/10">
                <h2 className="text-lg font-bold text-stone-800 dark:text-white dark:uppercase dark:tracking-widest">
                  Applicants for{' '}
                  <span className="text-purple-600 dark:text-neutral-400">
                    {selectedJobTitle}
                  </span>
                </h2>
                <span
                  className="px-3 py-1.5 text-[10px] font-bold border uppercase tracking-widest
                  rounded-full bg-purple-50 text-purple-600 border-purple-200
                  dark:rounded-none dark:bg-white/10 dark:backdrop-blur-md dark:text-white dark:border-white/20"
                >
                  {applicants.length} CANDIDATES
                </span>
              </div>

              <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left text-sm text-stone-600 dark:text-neutral-400">
                  <thead
                    className="uppercase text-[10px] font-bold tracking-widest
                    bg-stone-50/50 text-stone-500 border-b border-stone-100
                    dark:bg-black/60 dark:text-white dark:border-white/10"
                  >
                    <tr>
                      <th className="p-4">Candidate Name</th>
                      <th className="p-4">Course</th>
                      <th className="p-4">Semester</th>
                      <th className="p-4">CGPA</th>
                      <th className="p-4">Backlogs</th>
                      <th className="p-4">Resume</th>
                      <th className="p-4">Current Status</th>
                      <th className="p-4 text-right">Update Stage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-white/5">
                    {applicants.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="p-8 text-center text-stone-400 dark:text-neutral-600 dark:uppercase dark:text-xs dark:tracking-widest"
                        >
                          No applicants found for this job yet.
                        </td>
                      </tr>
                    )}
                    {applicants.map((app) => (
                      <tr
                        key={app.application_id}
                        className="transition-colors hover:bg-white dark:hover:bg-white/5"
                      >
                        <td className="p-4 font-medium text-stone-900 dark:text-white">
                          {app.full_name}
                        </td>
                        <td className="p-4 font-mono text-xs text-stone-500 dark:text-neutral-400">
                          {app.course || '-'}
                        </td>
                        <td className="p-4 font-mono text-xs text-stone-500 dark:text-neutral-400">
                          {app.semester || '-'}
                        </td>
                        <td className="p-4 font-mono text-xs text-stone-500 dark:text-neutral-400">
                          {app.cgpa || '-'}
                        </td>
                        <td className="p-4 font-mono text-xs">
                          {app.backlogs === 0 || !app.backlogs ? (
                            <span className="text-emerald-500">0</span>
                          ) : (
                            <span className="text-red-500 font-bold">
                              {app.backlogs}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <a
                            href={app.resume_url}
                            target="_blank"
                            className="flex items-center gap-1.5 hover:underline text-[10px] font-bold uppercase tracking-widest
                              text-blue-600 hover:text-blue-500
                              dark:text-white dark:hover:text-neutral-300"
                          >
                            <FileText size={14} strokeWidth={2} /> RESUME
                          </a>
                        </td>
                        <td className="p-4">
                          <span className={getStatusBadge(app.status)}>
                            {formatStatus(app.status)}
                          </span>
                        </td>
                        <td className="p-4 text-right relative">
                          {/* OVERLAY: Closes dropdown if clicked outside */}
                          {openDropdownId === app.application_id && (
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setOpenDropdownId(null)}
                            />
                          )}

                          {/* CUSTOM DROPDOWN TRIGGER */}
                          <button
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === app.application_id
                                  ? null
                                  : app.application_id,
                              )
                            }
                            className="relative z-50 flex items-center justify-between w-40 p-2 text-[10px] font-bold uppercase tracking-widest border transition-all outline-none ml-auto
                              rounded-lg bg-stone-50 text-stone-600 border-stone-200 hover:border-purple-300 hover:bg-white
                              dark:rounded-none dark:bg-[#0A0A0A] dark:text-white dark:border-white/20 dark:hover:border-white/40"
                          >
                            <span className="truncate pr-2">
                              {formatStatus(app.status)}
                            </span>
                            <ChevronDown
                              size={14}
                              strokeWidth={2}
                              className={`transition-transform duration-200 ${openDropdownId === app.application_id ? 'rotate-180' : ''}`}
                            />
                          </button>

                          {/* CUSTOM DROPDOWN MENU */}
                          <AnimatePresence>
                            {openDropdownId === app.application_id && (
                              <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-4 top-14 z-50 w-48 py-2 border shadow-2xl flex flex-col items-stretch text-left overflow-hidden
                                  rounded-xl bg-white/90 backdrop-blur-xl border-stone-200
                                  dark:rounded-none dark:bg-[#0A0A0A]/90 dark:backdrop-blur-2xl dark:border-white/20"
                              >
                                {STATUS_OPTIONS.map((option) => (
                                  <button
                                    key={option.value}
                                    onClick={() =>
                                      updateStatus(
                                        app.application_id,
                                        option.value,
                                        app.full_name,
                                      )
                                    }
                                    className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors text-left
                                      text-stone-600 dark:text-neutral-300
                                      ${option.hoverClass}
                                      ${app.status === option.value ? 'bg-stone-100 dark:bg-white/10 text-stone-900 dark:text-white' : ''}
                                    `}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
