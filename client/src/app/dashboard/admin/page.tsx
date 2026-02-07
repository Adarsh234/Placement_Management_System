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
      background: '#1e293b', // Dark background for modal
      color: '#fff', // White text
      customClass: {
        popup: 'rounded-2xl shadow-xl border border-slate-700',
        title: 'font-bold',
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
        background: '#1e293b',
        color: '#fff',
      })
    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to update status. Please try again.',
        background: '#1e293b',
        color: '#fff',
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
        background: '#1e293b',
        color: '#fff',
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
      background: '#1e293b',
      color: '#fff',
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
      background: '#1e293b',
      color: '#fff',
    })

    if (result.isConfirmed) {
      setMaintenanceMode(!maintenanceMode)
      MySwal.fire({
        title: 'Updated!',
        text: `System is now ${!maintenanceMode ? 'in Maintenance Mode' : 'Online'}.`,
        icon: 'success',
        background: '#1e293b',
        color: '#fff',
      })
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-8 space-y-8"
    >
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
          <p className="text-slate-400 mt-1">
            Real-time system data and management.
          </p>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            maintenanceMode
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}
        >
          <Activity size={16} />
          {loading
            ? 'Connecting...'
            : maintenanceMode
              ? 'Maintenance Mode'
              : 'System Online'}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Active Job Drives"
          value={stats.jobs}
          icon={<Briefcase className="text-blue-400" size={24} />}
          color="bg-blue-500/10 border border-blue-500/20"
          trend="Live Data"
        />
        <StatCard
          title="Total Students"
          value={stats.students}
          icon={<Users className="text-purple-400" size={24} />}
          color="bg-purple-500/10 border border-purple-500/20"
          trend="Registered"
        />
        <StatCard
          title="Placements"
          value={stats.placements}
          icon={<FileCheck className="text-emerald-400" size={24} />}
          color="bg-emerald-500/10 border border-emerald-500/20"
          trend="Selected"
        />
        <StatCard
          title="System Load"
          value={maintenanceMode ? 'High' : 'Low'}
          icon={<Server className="text-orange-400" size={24} />}
          color="bg-orange-500/10 border border-orange-500/20"
          trend="Stable"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: STUDENT DIRECTORY */}
        <motion.div
          id="student-directory"
          variants={itemVariants}
          className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden h-fit"
        >
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="text-blue-400" size={20} />
                Student Directory
              </h2>
              <p className="text-sm text-slate-400">
                Verify registered students.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleGenerateReport}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors border border-slate-700"
              >
                <Download size={14} /> Export CSV
              </button>
              <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center">
                {students.length} Students
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950/50 text-slate-300 font-semibold uppercase text-xs">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Roll No</th>
                  <th className="p-4">CGPA</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {students.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No students registered yet.
                    </td>
                  </tr>
                )}
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-4 font-medium text-white">
                      {student.full_name}
                    </td>
                    <td className="p-4">{student.roll_number || '-'}</td>
                    <td className="p-4">{student.cgpa || '-'}</td>
                    <td className="p-4">
                      {student.is_verified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                          <ShieldCheck size={12} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-bold">
                          Pending
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          student.is_verified
                            ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                            : 'bg-blue-600 text-white border-blue-500 hover:bg-blue-500'
                        }`}
                      >
                        {student.is_verified ? 'Revoke' : 'Verify'}
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
          <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={handleManageUsers}
                className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition border border-slate-700"
              >
                <Users size={18} /> Manage Users
              </button>
              <button
                onClick={handleGenerateReport}
                className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition border border-slate-700"
              >
                <FileText size={18} /> Generate Reports
              </button>
              <button
                onClick={handleSystemConfig}
                className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition border border-slate-700"
              >
                <Settings size={18} /> System Config
              </button>
            </div>
          </div>

          <div
            className={`p-6 rounded-xl border transition-colors duration-300 ${
              maintenanceMode
                ? 'bg-yellow-500/10 border-yellow-500/20'
                : 'bg-red-500/10 border-red-500/20'
            }`}
          >
            <div
              className={`flex items-center gap-2 mb-2 font-bold ${
                maintenanceMode ? 'text-yellow-400' : 'text-red-400'
              }`}
            >
              <ShieldAlert size={20} />
              {maintenanceMode ? 'System Warning' : 'Maintenance Mode'}
            </div>
            <p
              className={`text-sm mb-4 ${
                maintenanceMode ? 'text-yellow-200' : 'text-red-200'
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
  )
}

function StatCard({ title, value, icon, color, trend }: any) {
  return (
    <motion.div
      variants={itemVariants}
      className={`p-6 rounded-xl border hover:shadow-lg transition-all ${color.replace(
        'bg-',
        'hover:bg-',
      )} bg-slate-900/50 backdrop-blur-sm border-slate-800`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-slate-950 border border-slate-800`}>
          {icon}
        </div>
        <span className="text-xs font-medium text-slate-500">Total</span>
      </div>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
      <p className="text-sm text-slate-400 font-medium mt-1">{title}</p>
      <p className="text-xs text-emerald-400 mt-2 font-semibold">{trend}</p>
    </motion.div>
  )
}
