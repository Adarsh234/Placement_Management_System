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
          'rounded-2xl border border-stone-200 dark:bg-[#0A0A0A] dark:border-white/20 dark:text-white dark:rounded-none',
        title: 'uppercase tracking-widest font-bold',
        confirmButton:
          'dark:bg-white dark:text-black dark:rounded-none font-bold',
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
            'dark:bg-[#0A0A0A] dark:text-white dark:border-white/20 dark:rounded-none',
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
            'dark:bg-[#0A0A0A] dark:text-white dark:border-white/20 dark:rounded-none',
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
            'dark:bg-[#0A0A0A] dark:text-white dark:border-white/20 dark:rounded-none',
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
          'dark:bg-[#0A0A0A] dark:text-white dark:border-white/20 dark:rounded-none',
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
          'rounded-2xl border border-stone-200 dark:bg-[#0A0A0A] dark:border-white/20 dark:text-white dark:rounded-none',
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
            'dark:bg-[#0A0A0A] dark:text-white dark:border-white/20 dark:rounded-none',
        },
      })
    }
  }

  return (
    // MAIN CONTAINER: Stone-50 (Light) vs Deep Charcoal #050505 (Dark)
    <div
      className="min-h-screen font-sans p-8 transition-colors duration-300
      bg-stone-50 text-stone-900 
      dark:bg-[#050505] dark:text-slate-100"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold transition-colors text-stone-800 dark:text-white dark:uppercase dark:tracking-tighter">
              Admin Overview
            </h1>
            <p className="mt-1 transition-colors text-stone-500 dark:text-neutral-500 dark:uppercase dark:tracking-widest dark:text-xs">
              Real-time system data and management.
            </p>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1 text-sm font-medium border transition-colors 
              rounded-full ${maintenanceMode ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}
              /* Dark: Sharp, High Contrast */
              dark:rounded-none ${maintenanceMode ? 'dark:bg-red-900/20 dark:text-red-400 dark:border-red-500/50' : 'dark:bg-white/10 dark:text-white dark:border-white/20'}`}
          >
            <Activity size={16} />
            {loading
              ? 'CONNECTING...'
              : maintenanceMode
                ? 'MAINTENANCE MODE'
                : 'SYSTEM ONLINE'}
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
            className="lg:col-span-2 border overflow-hidden h-fit shadow-sm transition-colors
              rounded-xl bg-white border-stone-200 
              /* Dark: Sharp, Minimalist */
              dark:rounded-none dark:bg-[#0A0A0A] dark:border-white/10 dark:shadow-none"
          >
            <div
              className="p-6 border-b flex justify-between items-center transition-colors
              border-stone-100 dark:border-white/10"
            >
              <div>
                <h2
                  className="text-lg font-bold flex items-center gap-2 transition-colors
                  text-stone-800 
                  dark:text-white dark:uppercase dark:tracking-widest"
                >
                  <Users className="text-blue-500 dark:text-white" size={20} />
                  Student Directory
                </h2>
                <p className="text-sm transition-colors text-stone-500 dark:text-neutral-500">
                  Verify registered students.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleGenerateReport}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-colors border
                    rounded-lg bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100
                    /* Dark: Sharp Ghost Button */
                    dark:rounded-none dark:bg-transparent dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-black dark:uppercase dark:tracking-wide"
                >
                  <Download size={14} /> EXPORT CSV
                </button>
                <div
                  className="px-3 py-1.5 text-xs font-bold flex items-center border
                  rounded-lg bg-blue-50 text-blue-600 border-blue-200
                  /* Dark: Sharp Label */
                  dark:rounded-none dark:bg-white/10 dark:text-white dark:border-white/20"
                >
                  {students.length} STUDENTS
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-stone-500 dark:text-neutral-400">
                <thead
                  className="uppercase text-xs font-semibold
                  bg-stone-50 text-stone-500
                  dark:bg-black dark:text-white dark:tracking-widest"
                >
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Roll No</th>
                    <th className="p-4">CGPA</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-white/10">
                  {students.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-6 text-center text-stone-400 dark:text-neutral-600 dark:uppercase dark:text-xs dark:tracking-wide"
                      >
                        No students registered yet.
                      </td>
                    </tr>
                  )}
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="transition-colors
                        hover:bg-stone-50
                        dark:hover:bg-[#0F0F0F]"
                    >
                      <td className="p-4 font-medium text-stone-900 dark:text-white">
                        {student.full_name}
                      </td>
                      <td className="p-4">{student.roll_number || '-'}</td>
                      <td className="p-4">{student.cgpa || '-'}</td>
                      <td className="p-4">
                        {student.is_verified ? (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold border
                            rounded-full bg-emerald-50 text-emerald-600 border-emerald-200
                            dark:rounded-none dark:bg-white/10 dark:text-white dark:border-white/30"
                          >
                            <ShieldCheck size={12} /> VERIFIED
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold border
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
                          className={`px-3 py-1.5 text-xs font-bold transition-all border 
                            rounded-lg 
                            /* Dark: Sharp */
                            dark:rounded-none
                            ${
                              student.is_verified
                                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-transparent dark:text-red-400 dark:border-red-500/50 dark:hover:bg-red-900/20'
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
              className="border p-6 shadow-sm transition-colors
              rounded-xl bg-white border-stone-200
              dark:rounded-none dark:bg-[#0A0A0A] dark:border-white/10 dark:shadow-none"
            >
              <h2 className="text-lg font-bold mb-4 transition-colors text-stone-800 dark:text-white dark:uppercase dark:tracking-widest">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={handleManageUsers}
                  className="w-full flex items-center gap-3 px-4 py-3 transition border font-medium
                    rounded-lg bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100
                    /* Dark: Sharp, Inverted Hover */
                    dark:rounded-none dark:bg-transparent dark:border-white/20 dark:text-neutral-300 dark:hover:bg-white dark:hover:text-black"
                >
                  <Users size={18} strokeWidth={1.5} /> MANAGE USERS
                </button>
                <button
                  onClick={handleGenerateReport}
                  className="w-full flex items-center gap-3 px-4 py-3 transition border font-medium
                    rounded-lg bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100
                    dark:rounded-none dark:bg-transparent dark:border-white/20 dark:text-neutral-300 dark:hover:bg-white dark:hover:text-black"
                >
                  <FileText size={18} strokeWidth={1.5} /> GENERATE REPORTS
                </button>
                <button
                  onClick={handleSystemConfig}
                  className="w-full flex items-center gap-3 px-4 py-3 transition border font-medium
                    rounded-lg bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100
                    dark:rounded-none dark:bg-transparent dark:border-white/20 dark:text-neutral-300 dark:hover:bg-white dark:hover:text-black"
                >
                  <Settings size={18} strokeWidth={1.5} /> SYSTEM CONFIG
                </button>
              </div>
            </div>

            <div
              className={`p-6 border transition-colors duration-300
                rounded-xl 
                dark:rounded-none
                ${
                  maintenanceMode
                    ? 'bg-amber-50 border-amber-200 dark:bg-yellow-900/10 dark:border-yellow-500/30'
                    : 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-500/30'
                }`}
            >
              <div
                className={`flex items-center gap-2 mb-2 font-bold ${
                  maintenanceMode
                    ? 'text-amber-600 dark:text-yellow-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                <ShieldAlert size={20} />
                <span className="dark:uppercase dark:tracking-wide">
                  {maintenanceMode ? 'SYSTEM WARNING' : 'MAINTENANCE MODE'}
                </span>
              </div>
              <p
                className={`text-sm mb-4 ${
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

  // Dark Mode is Strict Monochrome (Brutalist) for all cards
  const currentLightStyle = lightStyles[theme] || lightStyles.blue

  return (
    <motion.div
      variants={itemVariants}
      className={`p-6 border hover:shadow-lg transition-all group
        rounded-xl bg-white border-stone-200 
        /* Dark: Sharp corners, Charcoal BG, Thin White Border */
        dark:rounded-none dark:bg-[#0A0A0A] dark:border-white/10 dark:shadow-none dark:hover:border-white/40`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 border transition-colors
           rounded-lg ${currentLightStyle}
           /* Dark: Sharp Icon Box, Black BG, White Icon */
           dark:rounded-none dark:bg-black dark:text-white dark:border-white/20 `}
        >
          {icon}
        </div>
        <span className="text-xs font-medium text-stone-400 dark:text-neutral-500 dark:uppercase dark:tracking-wider">
          TOTAL
        </span>
      </div>
      <h3 className="text-3xl font-bold text-stone-800 dark:text-white">
        {value}
      </h3>
      <p className="text-sm font-medium mt-1 text-stone-500 dark:text-neutral-400 dark:uppercase dark:tracking-wide dark:text-xs">
        {title}
      </p>
      <p className="text-xs mt-2 font-semibold text-emerald-600 dark:text-white dark:border-b dark:border-white dark:inline-block pb-0.5">
        {trend}
      </p>
    </motion.div>
  )
}
