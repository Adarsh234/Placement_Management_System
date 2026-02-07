'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Briefcase,
  UserCheck,
  Building2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative selection:bg-blue-500/30">
      {/* Background Gradient Spotlights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Navbar Placeholder */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center max-w-7xl mx-auto left-0 right-0 z-50">
        <div className="text-2xl font-bold tracking-tighter text-blue-500">
          PIMS.
        </div>
        <Link
          href="/auth/login?role=admin"
          className="text-sm text-slate-400 hover:text-white transition"
        >
          Admin Portal
        </Link>
      </nav>

      <main className="flex flex-col items-center justify-center pt-32 pb-20 px-4 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
          className="text-center max-w-5xl mx-auto space-y-8"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            v2.0 Now Live
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-slate-200 to-slate-400"
          >
            Campus Recruitment <br />
            <span className="text-white">Simplified.</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            The centralized platform connecting ambitious students with top-tier
            companies. Automate applications, track interviews, and manage
            placements in one place.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap gap-4 justify-center mt-8"
          >
            {/* Student Login Button */}
            <Link href="/auth/login?role=student">
              <button className="group relative flex items-center gap-3 px-8 py-4 bg-blue-600 rounded-full font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 hover:scale-105 transition-all duration-300">
                <UserCheck size={20} />
                Student Login
                <ArrowRight
                  size={16}
                  className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all"
                />
              </button>
            </Link>

            {/* Company Login Button */}
            <Link href="/auth/login?role=company">
              <button className="group relative flex items-center gap-3 px-8 py-4 bg-slate-800 border border-slate-700 rounded-full font-bold text-white hover:bg-slate-700 hover:border-slate-600 transition-all duration-300">
                <Building2 size={20} className="text-purple-400" />
                Recruiter Portal
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full"
        >
          <FeatureCard
            icon={<UserCheck className="text-blue-500" size={32} />}
            title="For Students"
            desc="Build your profile, upload resumes, and apply to unlimited drives with a single click."
          />
          <FeatureCard
            icon={<Building2 className="text-purple-500" size={32} />}
            title="For Recruiters"
            desc="Post jobs, filter candidates by CGPA/skills, and manage interview rounds effortlessly."
          />
          <FeatureCard
            icon={<Briefcase className="text-emerald-500" size={32} />}
            title="For TPO Admins"
            desc="Real-time analytics, automated notifications, and complete control over the placement drive."
          />
        </motion.div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-800/50 py-8 text-center text-slate-600 text-sm">
        <p>&copy; 2026 PIMS Inc. All rights reserved.</p>
      </footer>
    </div>
  )
}

// Reusable Feature Card Component
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
      <div className="mb-4 bg-slate-800/50 w-14 h-14 flex items-center justify-center rounded-xl">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
      <ul className="mt-6 space-y-2">
        <li className="flex items-center gap-2 text-sm text-slate-500">
          <CheckCircle2 size={16} className="text-blue-500/50" /> Real-time
          tracking
        </li>
        <li className="flex items-center gap-2 text-sm text-slate-500">
          <CheckCircle2 size={16} className="text-blue-500/50" /> Instant
          Notifications
        </li>
      </ul>
    </div>
  )
}
