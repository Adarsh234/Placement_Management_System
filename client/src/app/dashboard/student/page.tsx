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
  Clock,
  Calendar,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react'

const MySwal = withReactContent(Swal)

const SORT_OPTIONS = [
  { value: 'NEWEST', label: 'Newest First' },
  { value: 'SALARY_HIGH', label: 'Highest Salary' },
  { value: 'CGPA_LOW', label: 'Lowest CGPA Req.' },
]

// NEW: Array for the custom semester dropdown
const SEMESTER_OPTIONS = [
  { value: '1', label: 'Semester 1' },
  { value: '2', label: 'Semester 2' },
  { value: '3', label: 'Semester 3' },
  { value: '4', label: 'Semester 4' },
  { value: '5', label: 'Semester 5' },
  { value: '6', label: 'Semester 6' },
  { value: '7', label: 'Semester 7' },
  { value: '8', label: 'Semester 8' },
]

export default function StudentDashboard() {
  const [jobs, setJobs] = useState<any[]>([])
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])
  const [appliedJobs, setAppliedJobs] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [sortBy, setSortBy] = useState('NEWEST')
  const [isSortOpen, setIsSortOpen] = useState(false)

  // NEW: State to manage the custom semester dropdown
  const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false)

  const [studentName, setStudentName] = useState('Student')
  const [greeting, setGreeting] = useState('Welcome back')
  const [currentDate, setCurrentDate] = useState('')

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profile, setProfile] = useState({
    resume_url: '',
    roll_number: '',
    cgpa: '',
    skills: '',
    course: '',
    semester: '',
    backlogs: '0',
  })

  const [selectedJobDetails, setSelectedJobDetails] = useState<any | null>(null)

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

    const storedName = localStorage.getItem('userName')
    if (storedName) setStudentName(storedName)

    loadJobs()
    fetchProfile()
    fetchAppliedJobs()
  }, [])

  useEffect(() => {
    if (!jobs) return

    let results = jobs.filter((job) => {
      const title = job.title?.toLowerCase() || ''
      const company = job.company_name?.toLowerCase() || ''
      const query = searchQuery.toLowerCase()
      return title.includes(query) || company.includes(query)
    })

    results.sort((a, b) => {
      if (sortBy === 'SALARY_HIGH') {
        return (
          (parseFloat(b.salary_package) || 0) -
          (parseFloat(a.salary_package) || 0)
        )
      }
      if (sortBy === 'CGPA_LOW') {
        return (parseFloat(a.min_cgpa) || 0) - (parseFloat(b.min_cgpa) || 0)
      }
      return b.id - a.id
    })

    setFilteredJobs(results)
  }, [searchQuery, jobs, sortBy])

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

  const fetchAppliedJobs = () => {
    API.get('/student/applications')
      .then((res) => {
        const jobIds = res.data.map((app: any) => app.job_id)
        setAppliedJobs(jobIds)
      })
      .catch((err) => console.error('Failed to fetch applications', err))
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
          course: data.course || '',
          semester: data.semester ? data.semester.toString() : '',
          backlogs: data.backlogs ? data.backlogs.toString() : '0',
        })
        if (data.full_name) setStudentName(data.full_name)
      })
      .catch((err) => console.error('Failed to fetch profile', err))
  }

  const handleApply = async (jobId: number) => {
    try {
      await API.post('/jobs/apply', { jobId })

      setAppliedJobs((prev) => [...prev, jobId])
      setSelectedJobDetails(null)

      MySwal.fire({
        icon: 'success',
        title: 'Application Sent!',
        text: 'Good luck! The company has received your application.',
        background: '#fff',
        color: '#1c1917',
        confirmButtonColor: '#10b981',
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
        icon: 'warning',
        title: 'Already Applied',
        text: 'You have already submitted an application for this position.',
        background: '#fff',
        color: '#1c1917',
        confirmButtonColor: '#f59e0b',
        customClass: {
          popup:
            'rounded-3xl border border-stone-200 dark:bg-black/80 dark:backdrop-blur-2xl dark:border-white/20 dark:text-white dark:rounded-none',
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
        course: profile.course,
        semester: profile.semester ? parseInt(profile.semester) : null,
        backlogs: profile.backlogs ? parseInt(profile.backlogs) : 0,
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
            'dark:bg-black/80 dark:backdrop-blur-md dark:text-white dark:border-white/20 dark:rounded-none',
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
            'dark:bg-black/80 dark:backdrop-blur-md dark:text-white dark:border-white/20 dark:rounded-none',
        },
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  return (
    <div
      className="min-h-screen font-sans relative transition-colors duration-300
      bg-stone-50 text-stone-900 
      dark:bg-[#050505] dark:text-white"
    >
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/photos/png.png')] bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-40 transition-opacity duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-100 via-stone-50/80 to-transparent dark:from-[#050505] dark:via-[#050505]/80 dark:to-transparent" />
        <div className="absolute inset-0 bg-stone-50/50 dark:bg-[#050505]/60" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] dark:opacity-[0.08] mix-blend-overlay" />
      </div>

      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-500 bg-emerald-500/20 dark:bg-emerald-500/10 z-1" />
      <div className="fixed bottom-0 right-1/4 w-120 h-120 rounded-full blur-[128px] pointer-events-none transition-colors duration-500 bg-purple-500/10 dark:bg-blue-600/10 z-1" />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 p-8 pb-0 relative z-10">
        <div>
          <p className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2 drop-shadow-sm">
            <Clock size={14} strokeWidth={2} /> {currentDate}
          </p>
          <h1
            className="text-3xl md:text-4xl font-black transition-colors drop-shadow-sm
            text-stone-800 
            dark:text-white dark:uppercase dark:tracking-tighter"
          >
            {greeting},{' '}
            <span className="text-emerald-600 dark:text-emerald-400">
              {studentName}
            </span>
          </h1>
          <p
            className="mt-2 transition-colors
            text-stone-500 
            dark:text-neutral-400 dark:uppercase dark:tracking-widest dark:text-xs"
          >
            Browse and apply to campus placement drives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="px-6 py-3 border flex items-center gap-3 transition-all group shadow-sm
              rounded-xl bg-white/70 backdrop-blur-md border-stone-200 hover:border-emerald-500/50 hover:shadow-lg
              dark:rounded-none dark:bg-black/40 dark:backdrop-blur-xl dark:border-white/20 dark:hover:bg-white/10 dark:hover:border-white/50 dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
          >
            <div
              className="p-2 transition-colors
                rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white
                dark:rounded-none dark:bg-white/10 dark:text-white dark:group-hover:bg-white dark:group-hover:text-black"
            >
              <UserCircle size={24} strokeWidth={1.5} />
            </div>
            <div className="text-left">
              <p
                className="text-[10px] font-bold uppercase tracking-widest transition-colors
                  text-stone-400 group-hover:text-stone-500
                  dark:text-neutral-400 dark:group-hover:text-white"
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

      {/* --- JOB DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedJobDetails && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 backdrop-blur-xl bg-stone-900/30 dark:bg-black/80"
              onClick={() => setSelectedJobDetails(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 m-auto z-50 w-full max-w-3xl h-fit max-h-[90vh] overflow-hidden flex flex-col border shadow-2xl
                rounded-2xl bg-white border-stone-200
                dark:rounded-none dark:bg-[#0A0A0A] dark:border-white/20 dark:shadow-[0_8px_32px_rgba(0,0,0,0.8)]"
            >
              <div className="p-8 border-b border-stone-100 dark:border-white/10 flex justify-between items-start bg-stone-50/50 dark:bg-white/5 backdrop-blur-md">
                <div className="flex gap-5">
                  <div className="w-16 h-16 shrink-0 flex items-center justify-center border rounded-xl bg-white text-stone-400 border-stone-200 dark:rounded-none dark:bg-black dark:text-white dark:border-white/20">
                    <Building size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-stone-800 dark:text-white dark:uppercase dark:tracking-wider leading-tight">
                      {selectedJobDetails.title}
                    </h2>
                    <p className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mt-1">
                      {selectedJobDetails.company_name || 'Unnamed Company'}
                    </p>
                    {selectedJobDetails.location && (
                      <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-stone-500 dark:text-neutral-400 dark:uppercase dark:tracking-widest">
                        <MapPin size={12} strokeWidth={2} />{' '}
                        {selectedJobDetails.location}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJobDetails(null)}
                  className="p-2 transition-colors text-stone-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-white"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar">
                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold border uppercase tracking-widest rounded-lg bg-emerald-50 text-emerald-700 border-emerald-200 dark:rounded-none dark:bg-white/5 dark:text-white dark:border-white/20">
                    {' '}
                    {selectedJobDetails.salary_package} LPA
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold border uppercase tracking-widest rounded-lg bg-purple-50 text-purple-700 border-purple-200 dark:rounded-none dark:bg-white/5 dark:text-white dark:border-white/20">
                    <CheckCircle2 size={14} strokeWidth={2} /> CGPA{' '}
                    {selectedJobDetails.min_cgpa}+
                  </span>
                  {selectedJobDetails.deadline && (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold border uppercase tracking-widest rounded-lg bg-amber-50 text-amber-700 border-amber-200 dark:rounded-none dark:bg-white/5 dark:text-white dark:border-white/20">
                      <Calendar size={14} strokeWidth={2} /> Deadline:{' '}
                      {new Date(
                        selectedJobDetails.deadline,
                      ).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-500 border-b border-stone-100 dark:border-white/10 pb-2">
                    Role Description & Requirements
                  </h4>
                  <div className="text-sm leading-loose text-stone-700 dark:text-neutral-300 whitespace-pre-wrap">
                    {selectedJobDetails.description}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-stone-100 dark:border-white/10 bg-stone-50 dark:bg-black/80 backdrop-blur-md">
                {appliedJobs.includes(selectedJobDetails.id) ? (
                  <button
                    disabled
                    className="w-full py-4 font-bold text-sm transition-all flex justify-center items-center gap-2
                      rounded-xl bg-stone-200 text-stone-500 cursor-not-allowed
                      dark:rounded-none dark:bg-white/10 dark:text-neutral-500 dark:uppercase dark:tracking-widest"
                  >
                    <CheckCircle2 size={18} strokeWidth={2} /> ALREADY APPLIED
                  </button>
                ) : (
                  <button
                    onClick={() => handleApply(selectedJobDetails.id)}
                    className="w-full py-4 font-bold text-sm transition-all shadow-lg flex justify-center items-center gap-2
                      rounded-xl bg-stone-900 text-white hover:bg-emerald-600 shadow-stone-900/10
                      dark:rounded-none dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] dark:uppercase dark:tracking-widest"
                  >
                    <CheckCircle2 size={18} strokeWidth={2} /> SUBMIT
                    APPLICATION NOW
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- PROFILE MODAL --- */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 backdrop-blur-xl bg-stone-900/20 dark:bg-black/60"
              onClick={() => setIsProfileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 m-auto z-50 w-full max-w-2xl h-fit max-h-[90vh] overflow-y-auto border shadow-2xl
                rounded-2xl bg-white border-stone-200
                dark:rounded-none dark:bg-[#0A0A0A] dark:border-white/20 dark:shadow-[0_8px_32px_rgba(0,0,0,0.8)]"
            >
              <div className="sticky top-0 z-10 p-6 border-b flex justify-between items-center backdrop-blur-md bg-white/80 border-stone-100 dark:bg-black/80 dark:border-white/10">
                <h2 className="text-xl font-bold text-stone-800 dark:text-white dark:uppercase dark:tracking-widest">
                  Update Profile
                </h2>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="transition-colors text-stone-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-white"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-400">
                      Roll Number
                    </label>
                    <input
                      required
                      value={profile.roll_number}
                      onChange={(e) =>
                        setProfile({ ...profile, roll_number: e.target.value })
                      }
                      className="w-full p-3 border outline-none transition-all rounded-lg bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500 text-stone-900 placeholder:text-stone-400 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-600"
                      placeholder="e.g. 2026CS101"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-400">
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
                      className="w-full p-3 border outline-none transition-all rounded-lg bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500 text-stone-900 placeholder:text-stone-400 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-600"
                      placeholder="e.g. 8.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-400">
                      Course
                    </label>
                    <input
                      required
                      value={profile.course}
                      onChange={(e) =>
                        setProfile({ ...profile, course: e.target.value })
                      }
                      className="w-full p-3 border outline-none transition-all rounded-lg bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500 text-stone-900 placeholder:text-stone-400 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-600"
                      placeholder="e.g. B.Tech CSE"
                    />
                  </div>

                  {/* NEW CUSTOM SEMESTER DROPDOWN */}
                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-400">
                      Semester
                    </label>

                    {/* Click-away overlay */}
                    {isSemesterDropdownOpen && (
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setIsSemesterDropdownOpen(false)}
                      />
                    )}

                    {/* Trigger Button */}
                    <button
                      type="button" // Prevents form submission
                      onClick={() =>
                        setIsSemesterDropdownOpen(!isSemesterDropdownOpen)
                      }
                      className="w-full p-3 flex justify-between items-center border transition-all text-left
                        rounded-lg bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500 text-stone-900
                        dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:text-white"
                    >
                      <span>
                        {profile.semester ? (
                          SEMESTER_OPTIONS.find(
                            (opt) => opt.value === profile.semester,
                          )?.label
                        ) : (
                          <span className="text-stone-400 dark:text-neutral-500">
                            Select Sem
                          </span>
                        )}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform text-stone-400 dark:text-neutral-500 ${isSemesterDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isSemesterDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 top-[110%] z-30 w-full max-h-48 overflow-y-auto custom-scrollbar py-2 border shadow-xl flex flex-col items-stretch
                            rounded-xl bg-white border-stone-200
                            dark:rounded-none dark:bg-[#0A0A0A] dark:border-white/20"
                        >
                          {SEMESTER_OPTIONS.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setProfile({
                                  ...profile,
                                  semester: option.value,
                                })
                                setIsSemesterDropdownOpen(false)
                              }}
                              className={`px-4 py-2.5 text-sm transition-colors text-left flex items-center justify-between
                                text-stone-700 hover:bg-emerald-50 hover:text-emerald-700
                                dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white
                                ${profile.semester === option.value ? 'bg-stone-50 font-bold dark:bg-white/5 text-emerald-600 dark:text-emerald-400' : ''}
                              `}
                            >
                              {option.label}
                              {profile.semester === option.value && (
                                <CheckCircle2 size={14} />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-400">
                      Active Backlogs
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={profile.backlogs}
                      onChange={(e) =>
                        setProfile({ ...profile, backlogs: e.target.value })
                      }
                      className="w-full p-3 border outline-none transition-all rounded-lg bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500 text-stone-900 placeholder:text-stone-400 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-600"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-400">
                    Skills
                  </label>
                  <input
                    value={profile.skills}
                    onChange={(e) =>
                      setProfile({ ...profile, skills: e.target.value })
                    }
                    className="w-full p-3 border outline-none transition-all rounded-lg bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500 text-stone-900 placeholder:text-stone-400 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-600"
                    placeholder="Java, React..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-400">
                    Resume Link
                  </label>
                  <input
                    required
                    value={profile.resume_url}
                    onChange={(e) =>
                      setProfile({ ...profile, resume_url: e.target.value })
                    }
                    className="w-full p-3 border outline-none transition-all rounded-lg bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500 text-stone-900 placeholder:text-stone-400 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:focus:border-white dark:focus:ring-0 dark:text-white dark:placeholder:text-neutral-600"
                    placeholder="https://drive.google.com/..."
                  />
                </div>

                <div className="pt-4 pb-2">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="w-full py-4 font-bold transition-all shadow-lg flex justify-center items-center gap-2 text-white uppercase tracking-widest text-sm rounded-lg bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 dark:rounded-none dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50"
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

      <div className="p-8 pt-0 relative z-10">
        <div className="relative max-w-4xl mx-auto mb-12 flex gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search
                className="text-stone-400 dark:text-white/70"
                size={20}
                strokeWidth={1.5}
              />
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-4 border outline-none transition-all shadow-lg
                rounded-full bg-white/70 backdrop-blur-md border-stone-200 shadow-stone-200/50 focus:ring-2 focus:ring-emerald-500 text-stone-800 placeholder:text-stone-400
                dark:rounded-none dark:bg-black/40 dark:backdrop-blur-2xl dark:border-white/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] dark:focus:ring-0 dark:focus:border-white dark:text-white dark:placeholder:text-neutral-500"
              placeholder="Search roles or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            {isSortOpen && (
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsSortOpen(false)}
              />
            )}

            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="relative z-30 h-full px-6 flex items-center gap-3 border transition-all shadow-lg
                rounded-full bg-white/70 backdrop-blur-md border-stone-200 shadow-stone-200/50 hover:bg-white text-stone-600
                dark:rounded-none dark:bg-black/40 dark:backdrop-blur-2xl dark:border-white/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] dark:text-white dark:hover:bg-white/10"
            >
              <SlidersHorizontal
                size={18}
                strokeWidth={1.5}
                className="text-emerald-500 dark:text-white"
              />
              <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">
                {SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label ||
                  'Sort By'}
              </span>
              <ChevronDown
                size={16}
                strokeWidth={1.5}
                className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-[110%] z-40 w-48 py-2 border shadow-2xl flex flex-col items-stretch text-left overflow-hidden
                    rounded-2xl bg-white/90 backdrop-blur-xl border-stone-200
                    dark:rounded-none dark:bg-[#0A0A0A]/95 dark:backdrop-blur-2xl dark:border-white/20"
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value)
                        setIsSortOpen(false)
                      }}
                      className={`px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors text-left flex items-center justify-between
                        text-stone-600 hover:bg-emerald-50 hover:text-emerald-700
                        dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white
                        ${sortBy === option.value ? 'bg-stone-50 text-stone-900 dark:bg-white/5 dark:text-white' : ''}
                      `}
                    >
                      {option.label}
                      {sortBy === option.value && (
                        <CheckCircle2
                          size={14}
                          className="text-emerald-500 dark:text-white"
                        />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 flex items-center gap-3 text-sm font-bold uppercase tracking-widest border backdrop-blur-md rounded-lg bg-red-50/80 text-red-600 border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-500/50 dark:rounded-none">
            <AlertCircle size={20} strokeWidth={1.5} /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full text-center py-20 flex flex-col items-center gap-4 text-stone-500 dark:text-neutral-500 dark:uppercase dark:tracking-widest dark:text-xs">
              <Loader2
                className="animate-spin text-emerald-500 dark:text-white"
                size={32}
              />{' '}
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
                className="p-8 border transition-all duration-300 group relative flex flex-col h-full rounded-2xl bg-white/70 backdrop-blur-xl border-stone-200 hover:border-emerald-300 hover:shadow-xl shadow-sm dark:rounded-none dark:bg-black/40 dark:backdrop-blur-2xl dark:border-white/10 dark:hover:border-white/40 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] dark:hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 shrink-0 flex items-center justify-center border transition-colors rounded-xl bg-stone-100 text-stone-400 border-stone-200 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-200 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:text-white dark:border-white/10 dark:group-hover:bg-white dark:group-hover:text-black dark:group-hover:border-white">
                      <Building size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-black text-xl leading-tight text-stone-800 dark:text-white dark:uppercase dark:tracking-wider line-clamp-2">
                        {job.title}
                      </h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-400 dark:mt-1">
                        {job.company_name || 'Unnamed Company'}
                      </p>
                      {job.location && (
                        <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-stone-400 dark:text-neutral-500 dark:uppercase dark:tracking-widest">
                          <MapPin size={12} strokeWidth={2} /> {job.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold border uppercase tracking-widest rounded-full bg-emerald-50 text-emerald-700 border-emerald-200 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:text-white dark:border-white/20">
                    {' '}
                    {job.salary_package} LPA
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold border uppercase tracking-widest rounded-full bg-purple-50 text-purple-700 border-purple-200 dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:text-white dark:border-white/20">
                    <CheckCircle2 size={12} strokeWidth={2} /> CGPA{' '}
                    {job.min_cgpa}+
                  </span>
                </div>

                <p className="text-sm mb-8 line-clamp-3 leading-relaxed relative z-10 text-stone-600 dark:text-neutral-300 flex-grow">
                  {job.description}
                </p>

                <div className="flex items-center gap-3 pt-6 border-t mt-auto relative z-10 border-stone-100 dark:border-white/10">
                  {appliedJobs.includes(job.id) ? (
                    <button
                      disabled
                      className="flex-1 py-3 font-bold text-sm transition-all flex justify-center items-center gap-2
                        rounded-xl bg-stone-200 text-stone-500 cursor-not-allowed
                        dark:rounded-none dark:bg-white/10 dark:text-neutral-500 dark:uppercase dark:tracking-widest"
                    >
                      <CheckCircle2 size={16} strokeWidth={2} /> APPLIED
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      className="flex-1 py-3 font-bold text-sm transition-all shadow-lg
                          rounded-xl bg-stone-900 text-white hover:bg-emerald-600 shadow-stone-900/10
                          dark:rounded-none dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] dark:uppercase dark:tracking-widest"
                    >
                      APPLY NOW
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedJobDetails(job)}
                    title="View Full Details"
                    className="p-3 border transition-colors rounded-xl border-stone-200 text-stone-400 hover:text-stone-900 hover:bg-white dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-black"
                  >
                    <ExternalLink size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  )
}
