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
        confirmButtonColor: '#9333ea', // Purple-600 (Light Mode)
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
        icon: 'error',
        title: 'Error',
        text: 'Failed to update profile',
        background: '#fff',
        color: '#1c1917',
        customClass: {
          popup:
            'rounded-2xl border border-stone-200 dark:bg-[#0A0A0A] dark:border-white/20 dark:text-white dark:rounded-none',
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
            'rounded-2xl border border-stone-200 dark:bg-[#0A0A0A] dark:border-white/20 dark:text-white dark:rounded-none',
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
            'rounded-2xl border border-stone-200 dark:bg-[#0A0A0A] dark:border-white/20 dark:text-white dark:rounded-none',
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
          'rounded-2xl border border-stone-200 dark:bg-[#0A0A0A] dark:border-white/20 dark:text-white dark:rounded-none',
        title: 'uppercase tracking-widest font-bold',
        confirmButton:
          'dark:bg-white dark:text-black dark:rounded-none font-bold',
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
            'dark:bg-[#0A0A0A] dark:text-white dark:border-white/20 dark:rounded-none',
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
            'dark:bg-[#0A0A0A] dark:text-white dark:border-white/20 dark:rounded-none',
        },
      })
    }
  }

  return (
    // MAIN CONTAINER: Light Stone vs Dark Deep Charcoal
    <div
      className="min-h-screen font-sans p-8 transition-colors duration-300
      bg-stone-50 text-stone-900 
      dark:bg-[#050505] dark:text-slate-100"
    >
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1
            className="text-3xl font-bold flex items-center gap-3 transition-colors
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
            rounded-xl bg-white border-stone-200 
            /* Dark: Sharp Container */
            dark:rounded-none dark:bg-transparent dark:border-white/20 dark:shadow-none"
          >
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all 
                ${
                  activeTab === 'list'
                    ? 'rounded-lg bg-purple-100 text-purple-700 dark:rounded-none dark:bg-white dark:text-black dark:font-bold dark:uppercase dark:tracking-wider'
                    : 'rounded-lg text-stone-500 hover:bg-stone-100 dark:rounded-none dark:text-neutral-400 dark:hover:text-white dark:hover:bg-transparent'
                }`}
            >
              <List size={16} /> My Jobs
            </button>
            <button
              onClick={() => setActiveTab('post')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all 
                ${
                  activeTab === 'post'
                    ? 'rounded-lg bg-purple-100 text-purple-700 dark:rounded-none dark:bg-white dark:text-black dark:font-bold dark:uppercase dark:tracking-wider'
                    : 'rounded-lg text-stone-500 hover:bg-stone-100 dark:rounded-none dark:text-neutral-400 dark:hover:text-white dark:hover:bg-transparent'
                }`}
            >
              <PlusCircle size={16} /> Post Job
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all 
                ${
                  activeTab === 'profile'
                    ? 'rounded-lg bg-purple-100 text-purple-700 dark:rounded-none dark:bg-white dark:text-black dark:font-bold dark:uppercase dark:tracking-wider'
                    : 'rounded-lg text-stone-500 hover:bg-stone-100 dark:rounded-none dark:text-neutral-400 dark:hover:text-white dark:hover:bg-transparent'
                }`}
            >
              <UserCog size={16} /> Company Profile
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
            className="max-w-3xl mx-auto"
          >
            <div
              className="border p-8 backdrop-blur-sm transition-colors shadow-sm
              rounded-xl bg-white border-stone-200 
              /* Dark: Sharp Card */
              dark:rounded-none dark:bg-[#0A0A0A] dark:border-white/10 dark:shadow-none"
            >
              <h2
                className="text-xl font-bold mb-6 border-b pb-4 flex items-center gap-2 transition-colors
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
                    <label className="text-sm font-bold uppercase tracking-wide text-stone-500 dark:text-neutral-500 dark:text-xs">
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
                          /* Dark: Wireframe Input */
                          dark:rounded-none dark:bg-transparent dark:border-white/20 dark:focus:border-white dark:focus:ring-0 dark:text-white"
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
                    <label className="text-sm font-bold uppercase tracking-wide text-stone-500 dark:text-neutral-500 dark:text-xs">
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
                          dark:rounded-none dark:bg-transparent dark:border-white/20 dark:focus:border-white dark:focus:ring-0 dark:text-white"
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
                  <label className="text-sm font-bold uppercase tracking-wide text-stone-500 dark:text-neutral-500 dark:text-xs">
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
                        dark:rounded-none dark:bg-transparent dark:border-white/20 dark:focus:border-white dark:focus:ring-0 dark:text-white"
                      placeholder="e.g. Bangalore, India"
                      value={profile.location}
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-stone-500 dark:text-neutral-500 dark:text-xs">
                    About the Company
                  </label>
                  <textarea
                    className="w-full h-32 p-3 border outline-none resize-none transition-all
                      rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400
                      dark:rounded-none dark:bg-transparent dark:border-white/20 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-700"
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
                    className="w-full font-bold py-3 transition-all shadow-lg flex justify-center items-center gap-2 text-white
                      rounded-lg bg-purple-600 hover:bg-purple-700 shadow-purple-500/20
                      /* Dark: Solid White Block */
                      dark:rounded-none dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:shadow-none dark:uppercase dark:tracking-widest dark:text-sm"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <Save size={18} /> SAVE PROFILE
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
            className="max-w-3xl mx-auto"
          >
            <div
              className="border p-8 backdrop-blur-sm transition-colors shadow-sm
              rounded-xl bg-white border-stone-200 
              dark:rounded-none dark:bg-[#0A0A0A] dark:border-white/10 dark:shadow-none"
            >
              <h2
                className="text-xl font-bold mb-6 border-b pb-4 transition-colors
                text-stone-800 border-stone-100
                dark:text-white dark:border-white/10 dark:uppercase dark:tracking-widest"
              >
                Create New Opportunity
              </h2>
              <form onSubmit={handlePostJob} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wide text-stone-500 dark:text-neutral-500 dark:text-xs">
                      Job Title
                    </label>
                    <input
                      className="w-full p-3 border outline-none transition-all
                        rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400
                        dark:rounded-none dark:bg-transparent dark:border-white/20 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-700"
                      placeholder="e.g. Software Engineer"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wide text-stone-500 dark:text-neutral-500 dark:text-xs">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border outline-none transition-all scheme-light dark:scheme-dark
                        rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500
                        dark:rounded-none dark:bg-transparent dark:border-white/20 dark:focus:border-white dark:focus:ring-0 dark:text-white"
                      value={form.deadline}
                      onChange={(e) =>
                        setForm({ ...form, deadline: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-stone-500 dark:text-neutral-500 dark:text-xs">
                    Job Description
                  </label>
                  <textarea
                    className="w-full h-32 p-3 border outline-none resize-none transition-all
                      rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400
                      dark:rounded-none dark:bg-transparent dark:border-white/20 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-700"
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
                    <label className="text-sm font-bold uppercase tracking-wide text-stone-500 dark:text-neutral-500 dark:text-xs">
                      Minimum CGPA
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full p-3 border outline-none transition-all
                        rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400
                        dark:rounded-none dark:bg-transparent dark:border-white/20 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-700"
                      placeholder="e.g. 7.5"
                      value={form.min_cgpa}
                      onChange={(e) =>
                        setForm({ ...form, min_cgpa: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wide text-stone-500 dark:text-neutral-500 dark:text-xs">
                      Salary Package (CTC)
                    </label>
                    <input
                      className="w-full p-3 border outline-none transition-all
                        rounded-lg bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400
                        dark:rounded-none dark:bg-transparent dark:border-white/20 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-700"
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
                    className="w-full font-bold py-3 transition-all shadow-lg flex justify-center items-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed
                      rounded-lg bg-purple-600 hover:bg-purple-700 shadow-purple-500/20
                      /* Dark: Solid White Block */
                      dark:rounded-none dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:shadow-none dark:uppercase dark:tracking-widest dark:text-sm"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
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
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {myJobs.length === 0 && (
              <div className="col-span-full text-center py-20 text-stone-500 dark:text-neutral-500 dark:uppercase dark:tracking-widest dark:text-xs">
                No jobs posted yet.
              </div>
            )}
            {myJobs.map((job) => (
              <div
                key={job.id}
                className="border p-6 transition-all group relative
                  rounded-xl shadow-sm bg-white border-stone-200 hover:border-stone-300 hover:shadow-md
                  /* Dark: Sharp Card */
                  dark:rounded-none dark:bg-[#0A0A0A] dark:border-white/10 dark:hover:border-white dark:hover:bg-[#0F0F0F] dark:shadow-none"
              >
                <div
                  className="absolute top-4 right-4 transition-colors
                  text-stone-200 group-hover:text-purple-100
                  dark:text-neutral-700 dark:group-hover:text-white"
                >
                  <Briefcase size={48} strokeWidth={1} />
                </div>
                <h3
                  className="font-bold text-lg pr-8 transition-colors
                  text-stone-800 dark:text-white dark:uppercase dark:tracking-wide"
                >
                  {job.title}
                </h3>
                <p
                  className="text-xs mt-1 mb-4 transition-colors
                  text-stone-500 dark:text-neutral-500"
                >
                  Posted: {new Date(job.created_at).toLocaleDateString()}
                </p>

                <div className="space-y-2 mb-6">
                  <div
                    className="flex items-center justify-between text-sm p-2 rounded border transition-colors
                    bg-stone-50 border-stone-100 text-stone-500
                    /* Dark: Wireframe Data Row */
                    dark:rounded-none dark:bg-transparent dark:border-white/10 dark:text-neutral-400"
                  >
                    <span className="dark:uppercase dark:text-xs dark:tracking-wide">
                      Package
                    </span>
                    <span className="font-semibold text-stone-700 dark:text-white">
                      {job.salary_package}
                    </span>
                  </div>
                  <div
                    className="flex items-center justify-between text-sm p-2 rounded border transition-colors
                    bg-stone-50 border-stone-100 text-stone-500
                    /* Dark: Wireframe Data Row */
                    dark:rounded-none dark:bg-transparent dark:border-white/10 dark:text-neutral-400"
                  >
                    <span className="dark:uppercase dark:text-xs dark:tracking-wide">
                      Min CGPA
                    </span>
                    <span className="font-semibold text-stone-700 dark:text-white">
                      {job.min_cgpa}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => viewApplicants(job.id, job.title)}
                  className="w-full flex items-center justify-center gap-2 py-2 border transition-colors text-sm font-medium
                    rounded-lg bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200 hover:text-stone-900
                    /* Dark: Square Outline Button */
                    dark:rounded-none dark:bg-transparent dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-black dark:uppercase dark:tracking-widest dark:text-xs dark:font-bold"
                >
                  <Users size={16} /> VIEW APPLICANTS
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
          >
            <button
              onClick={() => setActiveTab('list')}
              className="mb-6 flex items-center gap-2 transition-colors
                text-stone-500 hover:text-stone-900
                dark:text-neutral-400 dark:hover:text-white"
            >
              <ArrowLeft size={18} strokeWidth={1.5} /> BACK TO JOB LIST
            </button>

            <div
              className="border overflow-hidden backdrop-blur-sm shadow-sm
              rounded-xl bg-white border-stone-200
              /* Dark: Sharp Container */
              dark:rounded-none dark:bg-[#0A0A0A] dark:border-white/10 dark:shadow-none"
            >
              <div
                className="p-6 border-b flex justify-between items-center
                border-stone-100 dark:border-white/10"
              >
                <h2 className="text-xl font-bold text-stone-800 dark:text-white dark:uppercase dark:tracking-widest">
                  Applicants for{' '}
                  <span className="text-purple-600 dark:text-neutral-400">
                    {selectedJobTitle}
                  </span>
                </h2>
                <span
                  className="px-3 py-1 text-xs font-bold border
                  rounded-full bg-purple-50 text-purple-600 border-purple-200
                  /* Dark: Sharp Tag */
                  dark:rounded-none dark:bg-white/10 dark:text-white dark:border-white/20"
                >
                  {applicants.length} CANDIDATES
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-stone-600 dark:text-neutral-400">
                  <thead
                    className="uppercase text-xs font-bold
                    bg-stone-50 text-stone-500
                    dark:bg-black dark:text-white dark:tracking-widest"
                  >
                    <tr>
                      <th className="p-4">Candidate Name</th>
                      <th className="p-4">CGPA</th>
                      <th className="p-4">Resume</th>
                      <th className="p-4">Current Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-white/10">
                    {applicants.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-8 text-center text-stone-400 dark:text-neutral-600 dark:uppercase dark:text-xs dark:tracking-wide"
                        >
                          No applicants found for this job yet.
                        </td>
                      </tr>
                    )}
                    {applicants.map((app) => (
                      <tr
                        key={app.application_id}
                        className="transition-colors
                          hover:bg-stone-50
                          dark:hover:bg-[#0F0F0F]"
                      >
                        <td className="p-4 font-medium text-stone-900 dark:text-white">
                          {app.full_name}
                        </td>
                        <td className="p-4">{app.cgpa}</td>
                        <td className="p-4">
                          <a
                            href={app.resume_url}
                            target="_blank"
                            className="flex items-center gap-1 hover:underline
                              text-blue-600 hover:text-blue-500
                              dark:text-white dark:hover:text-neutral-300"
                          >
                            <FileText size={14} /> VIEW RESUME
                          </a>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 text-xs font-bold border 
                            ${
                              app.status === 'SELECTED'
                                ? 'rounded bg-emerald-50 text-emerald-700 border-emerald-200 dark:rounded-none dark:bg-white/10 dark:text-white dark:border-white/30'
                                : app.status === 'REJECTED'
                                  ? 'rounded bg-red-50 text-red-700 border-red-200 dark:rounded-none dark:bg-transparent dark:text-neutral-500 dark:border-neutral-700 line-through'
                                  : 'rounded bg-amber-50 text-amber-700 border-amber-200 dark:rounded-none dark:bg-transparent dark:text-neutral-400 dark:border-neutral-600'
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
                              /* Dark: Sharp Square Button */
                              dark:rounded-none dark:bg-transparent dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-black"
                          >
                            <CheckCircle2 size={18} strokeWidth={1.5} />
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
                              /* Dark: Sharp Square Button */
                              dark:rounded-none dark:bg-transparent dark:border-white/20 dark:text-neutral-500 dark:hover:bg-white dark:hover:text-black"
                          >
                            <XCircle size={18} strokeWidth={1.5} />
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
