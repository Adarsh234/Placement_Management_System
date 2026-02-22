'use client'
import { useEffect, useState } from 'react'
import API from '@/lib/api'
import { motion } from 'framer-motion'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {
  Briefcase,
  Users,
  FileCheck,
  Activity,
  Server,
  Settings,
  ShieldAlert,
  FileText,
  ShieldCheck,
  Download,
} from 'lucide-react'

const MySwal = withReactContent(Swal)

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    jobs: 0,
    students: 0,
    placements: 0,
    activity: [],
  })
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  useEffect(() => {
    fetchStats()
    fetchStudents()
  }, [])

  const fetchStats = () => {
    API.get('/admin/stats')
      .then((res) => {
        setStats(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load admin stats', err)
        setLoading(false)
      })
  }

  const fetchStudents = () => {
    API.get('/student/all')
      .then((res) => setStudents(res.data))
      .catch((err) => console.error('Failed to fetch students', err))
  }

  const toggleVerification = async (
    studentId: number,
    currentStatus: boolean,
    studentName: string,
  ) => {
    const result = await MySwal.fire({
      title: currentStatus ? 'Revoke Verification?' : 'Verify Student?',
      text: `Are you sure you want to ${currentStatus ? 'revoke' : 'verify'} ${studentName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: currentStatus ? '#ef4444' : '#3b82f6',
      cancelButtonColor: '#64748b',
      confirmButtonText: currentStatus ? 'Yes, Revoke' : 'Yes, Verify',
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
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, is_verified: !currentStatus } : s,
        ),
      )

      await API.put(`/student/verify/${studentId}`, {
        isVerified: !currentStatus,
      })

      MySwal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Student ${currentStatus ? 'Revoked' : 'Verified'}`,
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
        title: 'Oops...',
        text: 'Failed to update status. Please try again.',
        background: '#fff',
        color: '#1c1917',
        customClass: {
          popup:
            'dark:bg-black/80 dark:backdrop-blur-md dark:text-white dark:border-white/20 dark:rounded-none',
        },
      })
      fetchStudents()
    }
  }

  const handleManageUsers = () => {
    const element = document.getElementById('student-directory')
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  const handleGenerateReport = () => {
    if (students.length === 0) {
      return MySwal.fire({
        icon: 'info',
        title: 'No Data',
        text: 'There are no students to export yet.',
        background: '#fff',
        color: '#1c1917',
        customClass: {
          popup:
            'dark:bg-black/80 dark:backdrop-blur-md dark:text-white dark:border-white/20 dark:rounded-none',
        },
      })
    }

    let csvContent = 'data:text/csv;charset=utf-8,'
    csvContent += 'ID,Full Name,Email,Roll Number,CGPA,Verified\n'

    students.forEach((s) => {
      const row = `${s.id},"${s.full_name}","${s.email || ''}","${s.roll_number || ''}","${s.cgpa || ''}",${s.is_verified ? 'Yes' : 'No'}`
      csvContent += row + '\n'
    })

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'pims_student_report.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    MySwal.fire({
      icon: 'success',
      title: 'Report Downloaded',
      text: 'The student list has been exported successfully.',
      timer: 2000,
      showConfirmButton: false,
      background: '#fff',
      color: '#1c1917',
      customClass: {
        popup:
          'dark:bg-black/80 dark:backdrop-blur-md dark:text-white dark:border-white/20 dark:rounded-none',
      },
    })
  }

  const handleSystemConfig = async () => {
    const result = await MySwal.fire({
      title: 'Toggle Maintenance Mode?',
      text: 'This will restrict user access to the platform.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#3b82f6',
      confirmButtonText: maintenanceMode
        ? 'Disable Maintenance'
        : 'Enable Maintenance',
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

    if (result.isConfirmed) {
      setMaintenanceMode(!maintenanceMode)
      MySwal.fire({
        title: 'Updated!',
        text: `System is now ${!maintenanceMode ? 'in Maintenance Mode' : 'Online'}.`,
        icon: 'success',
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
      <div className="fixed bottom-0 right-1/4 w-120 h-120 rounded-full blur-[128px] pointer-events-none transition-colors duration-500 bg-blue-500/10 dark:bg-white/5 z-1" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8 relative z-10"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black transition-colors text-stone-800 dark:text-white dark:uppercase dark:tracking-tighter drop-shadow-sm">
              Admin Overview
            </h1>
            <p className="mt-1 transition-colors text-stone-500 dark:text-neutral-400 dark:uppercase dark:tracking-widest dark:text-xs">
              Real-time system data and management.
            </p>
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold border transition-all backdrop-blur-md shadow-sm
              rounded-full ${maintenanceMode ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}
              /* Dark: Sharp Glass Badge */
              dark:rounded-none ${maintenanceMode ? 'dark:bg-red-900/40 dark:text-red-400 dark:border-red-500/50' : 'dark:bg-white/10 dark:text-white dark:border-white/20'}`}
          >
            <Activity size={16} strokeWidth={2} />
            <span className="tracking-widest">
              {loading
                ? 'CONNECTING...'
                : maintenanceMode
                  ? 'MAINTENANCE MODE'
                  : 'SYSTEM ONLINE'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Active Job Drives"
            value={stats.jobs}
            icon={<Briefcase size={24} strokeWidth={1.5} />}
            theme="blue"
            trend="Live Data"
          />
          <StatCard
            title="Total Students"
            value={stats.students}
            icon={<Users size={24} strokeWidth={1.5} />}
            theme="purple"
            trend="Registered"
          />
          <StatCard
            title="Placements"
            value={stats.placements}
            icon={<FileCheck size={24} strokeWidth={1.5} />}
            theme="emerald"
            trend="Selected"
          />
          <StatCard
            title="System Load"
            value={maintenanceMode ? 'High' : 'Low'}
            icon={<Server size={24} strokeWidth={1.5} />}
            theme="orange"
            trend="Stable"
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: STUDENT DIRECTORY */}
          <motion.div
            id="student-directory"
            variants={itemVariants}
            className="lg:col-span-2 border overflow-hidden h-fit shadow-xl transition-all duration-300
              rounded-2xl bg-white/70 backdrop-blur-xl border-stone-200 
              /* Dark: Deep Glass Panel */
              dark:rounded-none dark:bg-black/40 dark:backdrop-blur-2xl dark:border-white/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            <div
              className="p-6 border-b flex justify-between items-center transition-colors
              border-stone-100 dark:border-white/10"
            >
              <div>
                <h2
                  className="text-lg font-bold flex items-center gap-3 transition-colors
                  text-stone-800 
                  dark:text-white dark:uppercase dark:tracking-widest"
                >
                  <Users
                    className="text-blue-500 dark:text-white"
                    size={20}
                    strokeWidth={1.5}
                  />
                  Student Directory
                </h2>
                <p className="text-xs transition-colors text-stone-500 dark:text-neutral-400 dark:uppercase dark:tracking-widest mt-1">
                  Verify registered students.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleGenerateReport}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all border shadow-sm
                    rounded-lg bg-stone-50 border-stone-200 text-stone-600 hover:bg-white hover:shadow-md
                    /* Dark: Sharp Ghost Button */
                    dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-black dark:uppercase dark:tracking-widest"
                >
                  <Download size={14} strokeWidth={2} /> EXPORT CSV
                </button>
                <div
                  className="px-4 py-2 text-xs font-bold flex items-center border shadow-sm
                  rounded-lg bg-blue-50 text-blue-600 border-blue-200
                  /* Dark: Sharp Glass Label */
                  dark:rounded-none dark:bg-white/10 dark:backdrop-blur-md dark:text-white dark:border-white/20 tracking-widest"
                >
                  {students.length} STUDENTS
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-stone-500 dark:text-neutral-400">
                <thead
                  className="uppercase text-[10px] font-bold tracking-widest
                  bg-stone-50/50 text-stone-500 border-b border-stone-100
                  dark:bg-black/60 dark:text-white dark:border-white/10"
                >
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Roll No</th>
                    <th className="p-4">CGPA</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-white/5">
                  {students.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-8 text-center text-stone-400 dark:text-neutral-500 dark:uppercase dark:text-xs dark:tracking-widest"
                      >
                        No students registered yet.
                      </td>
                    </tr>
                  )}
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="transition-colors
                        hover:bg-white
                        dark:hover:bg-white/5"
                    >
                      <td className="p-4 font-medium text-stone-900 dark:text-white">
                        {student.full_name}
                      </td>
                      <td className="p-4 font-mono text-xs">
                        {student.roll_number || '-'}
                      </td>
                      <td className="p-4 font-mono text-xs">
                        {student.cgpa || '-'}
                      </td>
                      <td className="p-4">
                        {student.is_verified ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold border uppercase tracking-widest
                            rounded-full bg-emerald-50 text-emerald-600 border-emerald-200
                            dark:rounded-none dark:bg-white/10 dark:backdrop-blur-sm dark:text-white dark:border-white/20"
                          >
                            <ShieldCheck size={12} strokeWidth={2} /> VERIFIED
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold border uppercase tracking-widest
                            rounded-full bg-amber-50 text-amber-600 border-amber-200
                            dark:rounded-none dark:bg-transparent dark:text-neutral-500 dark:border-white/10"
                          >
                            PENDING
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() =>
                            toggleVerification(
                              student.id,
                              student.is_verified,
                              student.full_name,
                            )
                          }
                          className={`px-4 py-2 text-xs font-bold transition-all border uppercase tracking-widest
                            rounded-lg shadow-sm
                            /* Dark: Sharp Buttons */
                            dark:rounded-none dark:shadow-none
                            ${
                              student.is_verified
                                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-white dark:bg-transparent dark:text-red-400 dark:border-red-500/50 dark:hover:bg-red-900/40'
                                : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-500 dark:bg-white dark:text-black dark:border-white dark:hover:bg-neutral-200'
                            }`}
                        >
                          {student.is_verified ? 'REVOKE' : 'VERIFY'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Right Column: Quick Actions */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div
              className="border p-8 shadow-xl transition-all duration-300
              rounded-2xl bg-white/70 backdrop-blur-xl border-stone-200
              /* Dark: Deep Glass Panel */
              dark:rounded-none dark:bg-black/40 dark:backdrop-blur-2xl dark:border-white/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              <h2 className="text-lg font-bold mb-6 transition-colors text-stone-800 dark:text-white dark:uppercase dark:tracking-widest border-b border-stone-200 dark:border-white/10 pb-4">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <button
                  onClick={handleManageUsers}
                  className="w-full flex items-center gap-4 px-5 py-4 transition-all border font-bold text-xs uppercase tracking-widest shadow-sm
                    rounded-xl bg-white border-stone-200 text-stone-600 hover:shadow-md hover:text-stone-900
                    /* Dark: Sharp Glass Buttons */
                    dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white dark:hover:text-black dark:shadow-none"
                >
                  <Users size={18} strokeWidth={1.5} /> MANAGE USERS
                </button>
                <button
                  onClick={handleGenerateReport}
                  className="w-full flex items-center gap-4 px-5 py-4 transition-all border font-bold text-xs uppercase tracking-widest shadow-sm
                    rounded-xl bg-white border-stone-200 text-stone-600 hover:shadow-md hover:text-stone-900
                    dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white dark:hover:text-black dark:shadow-none"
                >
                  <FileText size={18} strokeWidth={1.5} /> GENERATE REPORTS
                </button>
                <button
                  onClick={handleSystemConfig}
                  className="w-full flex items-center gap-4 px-5 py-4 transition-all border font-bold text-xs uppercase tracking-widest shadow-sm
                    rounded-xl bg-white border-stone-200 text-stone-600 hover:shadow-md hover:text-stone-900
                    dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white dark:hover:text-black dark:shadow-none"
                >
                  <Settings size={18} strokeWidth={1.5} /> SYSTEM CONFIG
                </button>
              </div>
            </div>

            <div
              className={`p-6 border transition-colors duration-300 shadow-xl backdrop-blur-xl
                rounded-2xl 
                /* Dark: Sharp Glass Panel */
                dark:rounded-none dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                ${
                  maintenanceMode
                    ? 'bg-amber-50/90 border-amber-200 dark:bg-yellow-900/20 dark:border-yellow-500/30'
                    : 'bg-red-50/90 border-red-200 dark:bg-red-900/20 dark:border-red-500/30'
                }`}
            >
              <div
                className={`flex items-center gap-3 mb-3 font-bold text-sm uppercase tracking-widest ${
                  maintenanceMode
                    ? 'text-amber-600 dark:text-yellow-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                <ShieldAlert size={20} strokeWidth={1.5} />
                <span>
                  {maintenanceMode ? 'SYSTEM WARNING' : 'MAINTENANCE MODE'}
                </span>
              </div>
              <p
                className={`text-xs leading-relaxed font-medium uppercase tracking-wide ${
                  maintenanceMode
                    ? 'text-amber-700 dark:text-yellow-200/70'
                    : 'text-red-700 dark:text-red-200/70'
                }`}
              >
                {maintenanceMode
                  ? 'System is currently in Maintenance Mode. User access may be restricted.'
                  : 'Database backup scheduled for tonight at 02:00 AM UTC.'}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

// Styled Component for Stats
function StatCard({ title, value, icon, theme, trend }: any) {
  // Light Mode Colors (Rounded/Pastel)
  const lightStyles: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  }

  // Dark Mode uses unified glass styling, so we don't need the theme colors here.
  const currentLightStyle = lightStyles[theme] || lightStyles.blue

  return (
    <motion.div
      variants={itemVariants}
      className={`p-6 border hover:shadow-xl transition-all duration-300 group
        rounded-2xl bg-white/70 backdrop-blur-xl border-stone-200 shadow-sm
        /* Dark: Deep Glass Panel */
        dark:rounded-none dark:bg-black/40 dark:backdrop-blur-2xl dark:border-white/10 dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] dark:hover:border-white/40 dark:hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between mb-6">
        <div
          className={`p-3 border transition-colors
           rounded-xl ${currentLightStyle}
           /* Dark: Sharp Icon Box, Glassy BG, White Icon */
           dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:text-white dark:border-white/20 `}
        >
          {icon}
        </div>
        <span className="text-[10px] font-bold text-stone-400 dark:text-neutral-500 dark:uppercase dark:tracking-widest">
          TOTAL
        </span>
      </div>
      <h3 className="text-4xl font-black text-stone-800 dark:text-white tracking-tighter">
        {value}
      </h3>
      <p className="text-sm font-bold mt-2 text-stone-500 dark:text-neutral-400 dark:uppercase dark:tracking-widest dark:text-[10px]">
        {title}
      </p>
      <p className="text-[10px] mt-4 font-bold text-emerald-600 dark:text-white dark:border-b dark:border-white/30 dark:inline-block pb-0.5 uppercase tracking-widest">
        {trend}
      </p>
    </motion.div>
  )
}
