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
} from 'lucide-react'

const MySwal = withReactContent(Swal)

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState('list')
  const [myJobs, setMyJobs] = useState<any[]>([])
  const [applicants, setApplicants] = useState<any[]>([])
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [selectedJobTitle, setSelectedJobTitle] = useState('')
  const [loading, setLoading] = useState(false)

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
    fetchJobs()
    fetchProfile()
  }, [])

  const fetchJobs = () => {
    API.get('/jobs').then((res) => setMyJobs(res.data))
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
    const result = await MySwal.fire({
      title: status === 'SELECTED' ? 'Select Candidate?' : 'Reject Candidate?',
      text: `Are you sure you want to ${status === 'SELECTED' ? 'shortlist' : 'reject'} ${studentName}?`,
      icon: status === 'SELECTED' ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: status === 'SELECTED' ? '#16a34a' : '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText:
        status === 'SELECTED' ? 'Yes, Shortlist' : 'Yes, Reject',
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
        title: `Candidate ${status === 'SELECTED' ? 'Shortlisted' : 'Rejected'}`,
        showConfirmButton: false,
        timer: 2000,
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

  return (
    // MAIN CONTAINER
    <div
      className="min-h-screen font-sans p-8 transition-colors duration-300 relative overflow-hidden
      bg-stone-50 text-stone-900 
      dark:bg-[#050505] dark:text-slate-100"
    >
      {/* --- Global Background Image & Cinematic Glass Effects --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Base Image */}
        <div className="absolute inset-0 bg-[url('/photos/png.png')] bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-40 transition-opacity duration-700" />
        {/* Dark Vignette / Cinematic Fade */}
        <div className="absolute inset-0 bg-linear-to-t from-stone-100 via-stone-50/80 to-transparent dark:from-[#050505] dark:via-[#050505]/80 dark:to-transparent" />
        <div className="absolute inset-0 bg-stone-50/50 dark:bg-[#050505]/60" />
        {/* Premium Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] dark:opacity-[0.08] mix-blend-overlay" />
      </div>

      {/* Background Spotlights for depth */}
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-500 bg-emerald-500/20 dark:bg-emerald-500/10 z-1" />
      <div className="fixed bottom-0 right-1/4 w-120 h-120 rounded-full blur-[128px] pointer-events-none transition-colors duration-500 bg-purple-500/10 dark:bg-blue-600/10 z-1" />

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 relative z-10">
        <div>
          <h1
            className="text-3xl font-black flex items-center gap-3 transition-colors drop-shadow-sm
            text-stone-800 dark:text-white dark:uppercase dark:tracking-tighter"
          >
            <Building2
              className="text-purple-600 dark:text-white"
              size={32}
              strokeWidth={1.5}
            />
            Recruiter Portal
          </h1>
          <p
            className="mt-1 transition-colors
            text-stone-500 dark:text-neutral-500 dark:uppercase dark:tracking-widest dark:text-xs"
          >
            Manage jobs, applicants, and company profile.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Tab Toggle */}
          <div
            className="p-1 border shadow-sm flex flex-wrap gap-1 transition-colors
            rounded-xl bg-white/70 backdrop-blur-md border-stone-200 
            /* Dark: Sharp Glass Container */
            dark:rounded-none dark:bg-black/40 dark:backdrop-blur-xl dark:border-white/20 dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
          >
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

      {/* Content Area */}
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
            <div
              className="border p-8 transition-colors shadow-xl
              rounded-2xl bg-white/70 backdrop-blur-xl border-stone-200 
              /* Dark: Deep Glass Card */
              dark:rounded-none dark:bg-black/40 dark:backdrop-blur-2xl dark:border-white/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              <h2
                className="text-lg font-bold mb-6 border-b pb-4 flex items-center gap-3 transition-colors
                text-stone-800 border-stone-100
                dark:text-white dark:border-white/10 dark:uppercase dark:tracking-widest"
              >
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
                        className="w-full pl-10 p-3 border outline-none transition-all
                          rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500
                          /* Dark: Glass Input */
                          dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white"
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
                        className="w-full pl-10 p-3 border outline-none transition-all
                          rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500
                          dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white"
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
                      className="w-full pl-10 p-3 border outline-none transition-all
                        rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500
                        dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white"
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
                    className="w-full h-32 p-3 border outline-none resize-none transition-all
                      rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400
                      dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-500"
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
                    className="w-full py-4 font-bold transition-all shadow-lg flex justify-center items-center gap-2 text-white text-sm uppercase tracking-widest
                      rounded-lg bg-purple-600 hover:bg-purple-700 shadow-purple-500/20
                      /* Dark: Solid White Block */
                      dark:rounded-none dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Save size={18} strokeWidth={2} /> SAVE PROFILE
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
            <div
              className="border p-8 transition-colors shadow-xl
              rounded-2xl bg-white/70 backdrop-blur-xl border-stone-200 
              dark:rounded-none dark:bg-black/40 dark:backdrop-blur-2xl dark:border-white/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              <h2
                className="text-lg font-bold mb-6 border-b pb-4 transition-colors
                text-stone-800 border-stone-100
                dark:text-white dark:border-white/10 dark:uppercase dark:tracking-widest"
              >
                Create New Opportunity
              </h2>
              <form onSubmit={handlePostJob} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-400">
                      Job Title
                    </label>
                    <input
                      className="w-full p-3 border outline-none transition-all
                        rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400
                        dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-500"
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
                      className="w-full p-3 border outline-none transition-all scheme-light dark:scheme-dark
                        rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500
                        dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white"
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
                    className="w-full h-32 p-3 border outline-none resize-none transition-all
                      rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400
                      dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-500"
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
                      className="w-full p-3 border outline-none transition-all
                        rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400
                        dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-500"
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
                      className="w-full p-3 border outline-none transition-all
                        rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400
                        dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-500"
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
                    className="w-full py-4 font-bold transition-all shadow-lg flex justify-center items-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-widest
                      rounded-lg bg-purple-600 hover:bg-purple-700 shadow-purple-500/20
                      /* Dark: Solid White Block */
                      dark:rounded-none dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
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
                className="border p-6 transition-all duration-300 group relative
                  rounded-2xl shadow-sm bg-white/70 backdrop-blur-xl border-stone-200 hover:shadow-md hover:-translate-y-1
                  /* Dark: Deep Glass Card */
                  dark:rounded-none dark:bg-black/40 dark:backdrop-blur-2xl dark:border-white/10 dark:hover:border-white/40 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              >
                <div
                  className="absolute top-4 right-4 transition-colors
                  text-stone-200 group-hover:text-purple-100
                  dark:text-white/5 dark:group-hover:text-white/20"
                >
                  <Briefcase size={48} strokeWidth={1} />
                </div>
                <h3
                  className="font-black text-xl pr-8 transition-colors
                  text-stone-800 dark:text-white dark:uppercase dark:tracking-wider leading-tight"
                >
                  {job.title}
                </h3>
                <p
                  className="text-xs mt-2 mb-6 transition-colors font-bold uppercase tracking-widest
                  text-stone-500 dark:text-neutral-500"
                >
                  Posted: {new Date(job.created_at).toLocaleDateString()}
                </p>

                <div className="space-y-2 mb-6 relative z-10">
                  <div
                    className="flex items-center justify-between text-sm p-2.5 border transition-colors
                    rounded-lg bg-stone-50/50 border-stone-100 text-stone-500
                    /* Dark: Wireframe Data Row */
                    dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:text-neutral-400"
                  >
                    <span className="dark:uppercase dark:text-[10px] dark:font-bold dark:tracking-widest">
                      Package
                    </span>
                    <span className="font-black text-stone-700 dark:text-white">
                      {job.salary_package}
                    </span>
                  </div>
                  <div
                    className="flex items-center justify-between text-sm p-2.5 border transition-colors
                    rounded-lg bg-stone-50/50 border-stone-100 text-stone-500
                    /* Dark: Wireframe Data Row */
                    dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:text-neutral-400"
                  >
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
                  className="w-full flex items-center justify-center gap-2 py-3 border transition-colors text-xs font-bold uppercase tracking-widest relative z-10
                    rounded-xl bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200 hover:text-stone-900
                    /* Dark: Glass Outline Button */
                    dark:rounded-none dark:bg-transparent dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-black"
                >
                  <Users size={16} strokeWidth={2} /> VIEW APPLICANTS
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {/* --- APPLICANTS TABLE VIEW --- */}
        {activeTab === 'applicants' && (
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
              /* Dark: Deep Glass Container */
              dark:rounded-none dark:bg-black/40 dark:backdrop-blur-2xl dark:border-white/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              <div
                className="p-6 border-b flex justify-between items-center
                border-stone-100 dark:border-white/10"
              >
                <h2 className="text-lg font-bold text-stone-800 dark:text-white dark:uppercase dark:tracking-widest">
                  Applicants for{' '}
                  <span className="text-purple-600 dark:text-neutral-400">
                    {selectedJobTitle}
                  </span>
                </h2>
                <span
                  className="px-3 py-1.5 text-[10px] font-bold border uppercase tracking-widest
                  rounded-full bg-purple-50 text-purple-600 border-purple-200
                  /* Dark: Sharp Glass Tag */
                  dark:rounded-none dark:bg-white/10 dark:backdrop-blur-md dark:text-white dark:border-white/20"
                >
                  {applicants.length} CANDIDATES
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-stone-600 dark:text-neutral-400">
                  <thead
                    className="uppercase text-[10px] font-bold tracking-widest
                    bg-stone-50/50 text-stone-500 border-b border-stone-100
                    dark:bg-black/60 dark:text-white dark:border-white/10"
                  >
                    <tr>
                      <th className="p-4">Candidate Name</th>
                      <th className="p-4">CGPA</th>
                      <th className="p-4">Resume</th>
                      <th className="p-4">Current Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-white/5">
                    {applicants.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-8 text-center text-stone-400 dark:text-neutral-600 dark:uppercase dark:text-xs dark:tracking-widest"
                        >
                          No applicants found for this job yet.
                        </td>
                      </tr>
                    )}
                    {applicants.map((app) => (
                      <tr
                        key={app.application_id}
                        className="transition-colors
                          hover:bg-white
                          dark:hover:bg-white/5"
                      >
                        <td className="p-4 font-medium text-stone-900 dark:text-white">
                          {app.full_name}
                        </td>
                        <td className="p-4 font-mono text-xs">{app.cgpa}</td>
                        <td className="p-4">
                          <a
                            href={app.resume_url}
                            target="_blank"
                            className="flex items-center gap-1.5 hover:underline text-xs font-bold uppercase tracking-widest
                              text-blue-600 hover:text-blue-500
                              dark:text-white dark:hover:text-neutral-300"
                          >
                            <FileText size={14} strokeWidth={2} /> VIEW RESUME
                          </a>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 text-[10px] font-bold border uppercase tracking-widest
                            ${
                              app.status === 'SELECTED'
                                ? 'rounded-full bg-emerald-50 text-emerald-700 border-emerald-200 dark:rounded-none dark:bg-white/10 dark:backdrop-blur-sm dark:text-white dark:border-white/30'
                                : app.status === 'REJECTED'
                                  ? 'rounded-full bg-red-50 text-red-700 border-red-200 dark:rounded-none dark:bg-transparent dark:text-neutral-500 dark:border-neutral-700 line-through'
                                  : 'rounded-full bg-amber-50 text-amber-700 border-amber-200 dark:rounded-none dark:bg-transparent dark:text-neutral-400 dark:border-neutral-600'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4 flex justify-end gap-2">
                          <button
                            onClick={() =>
                              updateStatus(
                                app.application_id,
                                'SELECTED',
                                app.full_name,
                              )
                            }
                            title="Shortlist Candidate"
                            className="p-2 border transition-colors
                              rounded-full bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100
                              /* Dark: Sharp Glass Square Button */
                              dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-black"
                          >
                            <CheckCircle2 size={16} strokeWidth={2} />
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(
                                app.application_id,
                                'REJECTED',
                                app.full_name,
                              )
                            }
                            title="Reject Candidate"
                            className="p-2 border transition-colors
                              rounded-full bg-red-50 text-red-600 border-red-200 hover:bg-red-100
                              /* Dark: Sharp Glass Square Button */
                              dark:rounded-none dark:bg-transparent dark:border-white/20 dark:text-neutral-500 dark:hover:bg-white dark:hover:text-black"
                          >
                            <XCircle size={16} strokeWidth={2} />
                          </button>
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
