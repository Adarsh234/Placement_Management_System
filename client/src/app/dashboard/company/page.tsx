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
  UserCog, // New Icon
  MapPin, // New Icon
  Globe, // New Icon
  Save, // New Icon
} from 'lucide-react'

const MySwal = withReactContent(Swal)

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState('list')
  const [myJobs, setMyJobs] = useState<any[]>([])
  const [applicants, setApplicants] = useState<any[]>([])
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [selectedJobTitle, setSelectedJobTitle] = useState('')
  const [loading, setLoading] = useState(false)

  // --- NEW: Company Profile State ---
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
    fetchProfile() // Fetch profile on load
  }, [])

  const fetchJobs = () => {
    API.get('/jobs').then((res) => setMyJobs(res.data))
  }

  // --- NEW: Fetch Profile Data ---
  const fetchProfile = () => {
    API.get('/jobs/profile')
      .then((res) => {
        // Pre-fill form with existing data
        setProfile({
          company_name: res.data.company_name || '',
          website: res.data.website || '',
          location: res.data.location || '',
          description: res.data.description || '',
        })
      })
      .catch((err) => console.error(err))
  }

  // --- NEW: Handle Update Profile ---
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.put('/jobs/profile', profile)
      await MySwal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Company details have been saved successfully.',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
      })
    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update profile',
        background: '#1e293b',
        color: '#fff',
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // We use the profile company name here now
      await API.post('/jobs', { ...form, company_name: profile.company_name })

      await MySwal.fire({
        icon: 'success',
        title: 'Job Posted Successfully!',
        text: 'Your new opportunity is now live for students.',
        confirmButtonColor: '#9333ea',
        background: '#1e293b',
        color: '#fff',
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
        background: '#1e293b',
        color: '#fff',
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
      background: '#1e293b',
      color: '#fff',
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
        background: '#1e293b',
        color: '#fff',
      })
    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update status',
        background: '#1e293b',
        color: '#fff',
      })
    }
  }

  return (
    <div className="p-8 min-h-screen text-slate-100 font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Building2 className="text-purple-400" size={32} />
            Recruiter Portal
          </h1>
          <p className="text-slate-400 mt-1">
            Manage jobs, applicants, and company profile.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 shadow-sm flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'list' ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <List size={16} /> My Jobs
          </button>
          <button
            onClick={() => setActiveTab('post')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'post' ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <PlusCircle size={16} /> Post Job
          </button>
          {/* NEW PROFILE TAB BUTTON */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <UserCog size={16} /> Company Profile
          </button>
        </div>
      </header>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {/* --- NEW: COMPANY PROFILE TAB --- */}
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-sm border border-slate-800 p-8">
              <h2 className="text-xl font-bold mb-6 text-white border-b border-slate-800 pb-4 flex items-center gap-2">
                <UserCog size={24} className="text-purple-400" /> Company
                Details
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400">
                      Company Name
                    </label>
                    <div className="relative group">
                      <Building2
                        className="absolute left-3 top-3.5 text-slate-500"
                        size={18}
                      />
                      <input
                        className="w-full pl-10 bg-slate-950 border border-slate-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
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
                    <label className="text-sm font-semibold text-slate-400">
                      Website
                    </label>
                    <div className="relative group">
                      <Globe
                        className="absolute left-3 top-3.5 text-slate-500"
                        size={18}
                      />
                      <input
                        className="w-full pl-10 bg-slate-950 border border-slate-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
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
                  <label className="text-sm font-semibold text-slate-400">
                    Location (Headquarters)
                  </label>
                  <div className="relative group">
                    <MapPin
                      className="absolute left-3 top-3.5 text-slate-500"
                      size={18}
                    />
                    <input
                      className="w-full pl-10 bg-slate-950 border border-slate-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="e.g. Bangalore, India"
                      value={profile.location}
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400">
                    About the Company
                  </label>
                  <textarea
                    className="w-full h-32 bg-slate-950 border border-slate-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none placeholder:text-slate-600"
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
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2"
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

        {/* ... (Post Job Form - No changes needed) ... */}
        {activeTab === 'post' && (
          <motion.div
            key="post"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-sm border border-slate-800 p-8">
              <h2 className="text-xl font-bold mb-6 text-white border-b border-slate-800 pb-4">
                Create New Opportunity
              </h2>
              <form onSubmit={handlePostJob} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400">
                      Job Title
                    </label>
                    <input
                      className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none placeholder:text-slate-600"
                      placeholder="e.g. Software Engineer"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none scheme-dark"
                      value={form.deadline}
                      onChange={(e) =>
                        setForm({ ...form, deadline: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400">
                    Job Description
                  </label>
                  <textarea
                    className="w-full h-32 bg-slate-950 border border-slate-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none placeholder:text-slate-600"
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
                    <label className="text-sm font-semibold text-slate-400">
                      Minimum CGPA
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none placeholder:text-slate-600"
                      placeholder="e.g. 7.5"
                      value={form.min_cgpa}
                      onChange={(e) =>
                        setForm({ ...form, min_cgpa: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400">
                      Salary Package (CTC)
                    </label>
                    <input
                      className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none placeholder:text-slate-600"
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
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-purple-500/30 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* ... (Job List View & Applicants View - No changes needed) ... */}
        {/* (I am omitting the rest of the existing views to save space, but they should remain in the file) */}
        {activeTab === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {myJobs.length === 0 && (
              <div className="col-span-full text-center py-20 text-slate-500">
                No jobs posted yet.
              </div>
            )}
            {myJobs.map((job) => (
              <div
                key={job.id}
                className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-slate-800 hover:border-slate-700 hover:shadow-md transition-all group relative"
              >
                <div className="absolute top-4 right-4 text-slate-700 group-hover:text-purple-500/20 transition-colors">
                  <Briefcase size={48} strokeWidth={1} />
                </div>
                <h3 className="font-bold text-lg text-white pr-8">
                  {job.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Posted: {new Date(job.created_at).toLocaleDateString()}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-sm text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
                    <span>Package</span>
                    <span className="font-semibold text-slate-200">
                      {job.salary_package}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
                    <span>Min CGPA</span>
                    <span className="font-semibold text-slate-200">
                      {job.min_cgpa}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => viewApplicants(job.id, job.title)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700 border border-slate-700 transition-colors text-sm font-medium"
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
              className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} /> Back to Job List
            </button>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-sm border border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  Applicants for{' '}
                  <span className="text-purple-400">{selectedJobTitle}</span>
                </h2>
                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-bold">
                  {applicants.length} Candidates
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-slate-950 text-slate-300 font-semibold uppercase text-xs">
                    <tr>
                      <th className="p-4">Candidate Name</th>
                      <th className="p-4">CGPA</th>
                      <th className="p-4">Resume</th>
                      <th className="p-4">Current Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {applicants.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-8 text-center text-slate-500"
                        >
                          No applicants found for this job yet.
                        </td>
                      </tr>
                    )}
                    {applicants.map((app) => (
                      <tr
                        key={app.application_id}
                        className="hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="p-4 font-medium text-slate-200">
                          {app.full_name}
                        </td>
                        <td className="p-4">{app.cgpa}</td>
                        <td className="p-4">
                          <a
                            href={app.resume_url}
                            target="_blank"
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline"
                          >
                            <FileText size={14} /> View Resume
                          </a>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold border 
                            ${
                              app.status === 'SELECTED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : app.status === 'REJECTED'
                                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                  : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
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
                            className="p-2 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
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
                            className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
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
