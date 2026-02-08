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
        confirmButtonColor: '#9333ea', // Purple-600
        customClass: {
          popup:
            'rounded-2xl border border-stone-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white',
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
            'rounded-2xl border border-stone-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white',
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
            'rounded-2xl border border-stone-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white',
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
            'rounded-2xl border border-stone-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white',
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
          'rounded-2xl border border-stone-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white',
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
          popup: 'dark:bg-slate-900 dark:text-white',
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
          popup: 'dark:bg-slate-900 dark:text-white',
        },
      })
    }
  }

  return (
    // MAIN CONTAINER
    <div
      className="min-h-screen font-sans p-8 transition-colors duration-300
      bg-stone-50 text-stone-900 
      dark:bg-slate-950 dark:text-slate-100"
    >
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1
            className="text-3xl font-bold flex items-center gap-3 transition-colors
            text-stone-800 dark:text-white"
          >
            <Building2
              className="text-purple-600 dark:text-purple-400"
              size={32}
            />
            Recruiter Portal
          </h1>
          <p
            className="mt-1 transition-colors
            text-stone-500 dark:text-slate-400"
          >
            Manage jobs, applicants, and company profile.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Theme Toggle REMOVED */}

          {/* Tab Toggle */}
          <div
            className="p-1 rounded-xl border shadow-sm flex flex-wrap gap-1 transition-colors
            bg-white border-stone-200 
            dark:bg-slate-900 dark:border-slate-800"
          >
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all 
                ${
                  activeTab === 'list'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300'
                    : 'text-stone-500 hover:bg-stone-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
            >
              <List size={16} /> My Jobs
            </button>
            <button
              onClick={() => setActiveTab('post')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all 
                ${
                  activeTab === 'post'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300'
                    : 'text-stone-500 hover:bg-stone-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
            >
              <PlusCircle size={16} /> Post Job
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all 
                ${
                  activeTab === 'profile'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300'
                    : 'text-stone-500 hover:bg-stone-100 dark:text-slate-400 dark:hover:bg-slate-800'
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
              className="rounded-xl shadow-sm border p-8 backdrop-blur-sm transition-colors
              bg-white border-stone-200 
              dark:bg-slate-900/50 dark:border-slate-800"
            >
              <h2
                className="text-xl font-bold mb-6 border-b pb-4 flex items-center gap-2 transition-colors
                text-stone-800 border-stone-100
                dark:text-white dark:border-slate-800"
              >
                <UserCog
                  size={24}
                  className="text-purple-600 dark:text-purple-400"
                />{' '}
                Company Details
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-500 dark:text-slate-400">
                      Company Name
                    </label>
                    <div className="relative group">
                      <Building2
                        className="absolute left-3 top-3.5 text-stone-400 dark:text-slate-500"
                        size={18}
                      />
                      <input
                        className="w-full pl-10 p-3 rounded-lg border outline-none transition-all
                          bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500
                          dark:bg-slate-950 dark:border-slate-800 dark:text-white"
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
                    <label className="text-sm font-semibold text-stone-500 dark:text-slate-400">
                      Website
                    </label>
                    <div className="relative group">
                      <Globe
                        className="absolute left-3 top-3.5 text-stone-400 dark:text-slate-500"
                        size={18}
                      />
                      <input
                        className="w-full pl-10 p-3 rounded-lg border outline-none transition-all
                          bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500
                          dark:bg-slate-950 dark:border-slate-800 dark:text-white"
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
                  <label className="text-sm font-semibold text-stone-500 dark:text-slate-400">
                    Location (Headquarters)
                  </label>
                  <div className="relative group">
                    <MapPin
                      className="absolute left-3 top-3.5 text-stone-400 dark:text-slate-500"
                      size={18}
                    />
                    <input
                      className="w-full pl-10 p-3 rounded-lg border outline-none transition-all
                        bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500
                        dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                      placeholder="e.g. Bangalore, India"
                      value={profile.location}
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-500 dark:text-slate-400">
                    About the Company
                  </label>
                  <textarea
                    className="w-full h-32 p-3 rounded-lg border outline-none resize-none transition-all
                      bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400
                      dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600"
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
                    className="w-full font-bold py-3 rounded-lg transition-all shadow-lg flex justify-center items-center gap-2 text-white
                      bg-purple-600 hover:bg-purple-700 shadow-purple-500/20
                      dark:bg-purple-600 dark:hover:bg-purple-500"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <Save size={18} /> Save Profile
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
              className="rounded-xl shadow-sm border p-8 backdrop-blur-sm transition-colors
              bg-white border-stone-200 
              dark:bg-slate-900/50 dark:border-slate-800"
            >
              <h2
                className="text-xl font-bold mb-6 border-b pb-4 transition-colors
                text-stone-800 border-stone-100
                dark:text-white dark:border-slate-800"
              >
                Create New Opportunity
              </h2>
              <form onSubmit={handlePostJob} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-500 dark:text-slate-400">
                      Job Title
                    </label>
                    <input
                      className="w-full p-3 rounded-lg border outline-none transition-all
                        bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400
                        dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600"
                      placeholder="e.g. Software Engineer"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-500 dark:text-slate-400">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 rounded-lg border outline-none transition-all scheme-light dark:scheme-dark
                        bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500
                        dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                      value={form.deadline}
                      onChange={(e) =>
                        setForm({ ...form, deadline: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-500 dark:text-slate-400">
                    Job Description
                  </label>
                  <textarea
                    className="w-full h-32 p-3 rounded-lg border outline-none resize-none transition-all
                      bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400
                      dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600"
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
                    <label className="text-sm font-semibold text-stone-500 dark:text-slate-400">
                      Minimum CGPA
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full p-3 rounded-lg border outline-none transition-all
                        bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400
                        dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600"
                      placeholder="e.g. 7.5"
                      value={form.min_cgpa}
                      onChange={(e) =>
                        setForm({ ...form, min_cgpa: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-500 dark:text-slate-400">
                      Salary Package (CTC)
                    </label>
                    <input
                      className="w-full p-3 rounded-lg border outline-none transition-all
                        bg-stone-50 border-stone-200 text-stone-900 focus:ring-2 focus:ring-purple-500 placeholder:text-stone-400
                        dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-600"
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
                    className="w-full font-bold py-3 rounded-lg transition-all shadow-lg flex justify-center items-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed
                      bg-purple-600 hover:bg-purple-700 shadow-purple-500/20
                      dark:bg-purple-600 dark:hover:bg-purple-500"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      'Publish Job Post'
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
              <div className="col-span-full text-center py-20 text-stone-500 dark:text-slate-500">
                No jobs posted yet.
              </div>
            )}
            {myJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl shadow-sm border p-6 transition-all group relative
                  bg-white border-stone-200 hover:border-stone-300 hover:shadow-md
                  dark:bg-slate-900/50 dark:backdrop-blur-sm dark:border-slate-800 dark:hover:border-slate-700"
              >
                <div
                  className="absolute top-4 right-4 transition-colors
                  text-stone-200 group-hover:text-purple-100
                  dark:text-slate-700 dark:group-hover:text-purple-500/20"
                >
                  <Briefcase size={48} strokeWidth={1} />
                </div>
                <h3
                  className="font-bold text-lg pr-8 transition-colors
                  text-stone-800 dark:text-white"
                >
                  {job.title}
                </h3>
                <p
                  className="text-xs mt-1 mb-4 transition-colors
                  text-stone-500 dark:text-slate-500"
                >
                  Posted: {new Date(job.created_at).toLocaleDateString()}
                </p>

                <div className="space-y-2 mb-6">
                  <div
                    className="flex items-center justify-between text-sm p-2 rounded border transition-colors
                    bg-stone-50 border-stone-100 text-stone-500
                    dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400"
                  >
                    <span>Package</span>
                    <span className="font-semibold text-stone-700 dark:text-slate-200">
                      {job.salary_package}
                    </span>
                  </div>
                  <div
                    className="flex items-center justify-between text-sm p-2 rounded border transition-colors
                    bg-stone-50 border-stone-100 text-stone-500
                    dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400"
                  >
                    <span>Min CGPA</span>
                    <span className="font-semibold text-stone-700 dark:text-slate-200">
                      {job.min_cgpa}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => viewApplicants(job.id, job.title)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border transition-colors text-sm font-medium
                    bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200 hover:text-stone-900
                    dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700"
                >
                  <Users size={16} /> View Applicants
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
                dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft size={18} /> Back to Job List
            </button>

            <div
              className="rounded-xl shadow-sm border overflow-hidden backdrop-blur-sm
              bg-white border-stone-200
              dark:bg-slate-900/50 dark:border-slate-800"
            >
              <div
                className="p-6 border-b flex justify-between items-center
                border-stone-100 dark:border-slate-800"
              >
                <h2 className="text-xl font-bold text-stone-800 dark:text-white">
                  Applicants for{' '}
                  <span className="text-purple-600 dark:text-purple-400">
                    {selectedJobTitle}
                  </span>
                </h2>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold border
                  bg-purple-50 text-purple-600 border-purple-200
                  dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20"
                >
                  {applicants.length} Candidates
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-stone-600 dark:text-slate-400">
                  <thead
                    className="uppercase text-xs font-bold
                    bg-stone-50 text-stone-500
                    dark:bg-slate-950 dark:text-slate-300"
                  >
                    <tr>
                      <th className="p-4">Candidate Name</th>
                      <th className="p-4">CGPA</th>
                      <th className="p-4">Resume</th>
                      <th className="p-4">Current Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
                    {applicants.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-8 text-center text-stone-400 dark:text-slate-500"
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
                          dark:hover:bg-slate-800/50"
                      >
                        <td className="p-4 font-medium text-stone-900 dark:text-slate-200">
                          {app.full_name}
                        </td>
                        <td className="p-4">{app.cgpa}</td>
                        <td className="p-4">
                          <a
                            href={app.resume_url}
                            target="_blank"
                            className="flex items-center gap-1 hover:underline
                              text-blue-600 hover:text-blue-500
                              dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <FileText size={14} /> View Resume
                          </a>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold border 
                            ${
                              app.status === 'SELECTED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                : app.status === 'REJECTED'
                                  ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20'
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
                            className="p-2 rounded-full border transition-colors
                              bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100
                              dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 dark:hover:bg-emerald-500/20"
                          >
                            <CheckCircle2 size={18} />
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
                            className="p-2 rounded-full border transition-colors
                              bg-red-50 text-red-600 border-red-200 hover:bg-red-100
                              dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-500/20"
                          >
                            <XCircle size={18} />
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
