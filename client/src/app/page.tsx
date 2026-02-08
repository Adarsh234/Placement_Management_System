'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
// 1. Import Theme Toggle
import { ThemeToggle } from '@/components/ThemeToggle'
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
    // MAIN CONTAINER: Stone-50 (Light) vs Slate-950 (Dark)
    <div
      className="min-h-screen overflow-hidden relative transition-colors duration-300 selection:bg-blue-500/30
      bg-stone-50 text-stone-900 
      dark:bg-slate-950 dark:text-white"
    >
      {/* --- Background Gradient Spotlights --- */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-500
        bg-emerald-500/10 
        dark:bg-blue-500/20"
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-500
        bg-stone-500/10 
        dark:bg-purple-500/10"
      />

      {/* --- Navbar --- */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center max-w-7xl mx-auto left-0 right-0 z-50">
        <div
          className="text-2xl font-bold tracking-tighter transition-colors
          text-emerald-700 
          dark:text-blue-500"
        >
          PIMS.
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          <Link
            href="/auth/login?role=admin"
            className="text-sm font-medium transition-colors
              text-stone-600 hover:text-stone-900
              dark:text-slate-400 dark:hover:text-white"
          >
            Admin Portal
          </Link>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center pt-32 pb-20 px-4 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
          className="text-center max-w-5xl mx-auto space-y-8"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium transition-colors
              bg-emerald-100/50 border-emerald-200 text-emerald-700
              dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400"
          >
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
                bg-emerald-400 
                dark:bg-blue-400"
              ></span>
              <span
                className="relative inline-flex rounded-full h-2 w-2
                bg-emerald-500 
                dark:bg-blue-500"
              ></span>
            </span>
            v2.0 Now Live
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r
              from-stone-900 via-stone-700 to-stone-500
              dark:from-white dark:via-slate-200 dark:to-slate-400"
          >
            Campus Recruitment <br />
            <span
              className="
              text-emerald-700 
              dark:text-white"
            >
              Simplified.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed transition-colors
              text-stone-600 
              dark:text-slate-400"
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
              <button
                className="group relative flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white shadow-lg transition-all duration-300 hover:scale-105
                bg-emerald-600 shadow-emerald-500/20 hover:bg-emerald-500
                dark:bg-blue-600 dark:shadow-blue-500/20 dark:hover:bg-blue-500"
              >
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
              <button
                className="group relative flex items-center gap-3 px-8 py-4 border rounded-full font-bold transition-all duration-300
                bg-white border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-stone-300
                dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700 dark:hover:border-slate-600"
              >
                <Building2
                  size={20}
                  className="text-purple-500 dark:text-purple-400"
                />
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
            icon={
              <UserCheck
                size={32}
                className="text-emerald-600 dark:text-blue-500"
              />
            }
            title="For Students"
            desc="Build your profile, upload resumes, and apply to unlimited drives with a single click."
          />
          <FeatureCard
            icon={
              <Building2
                size={32}
                className="text-purple-600 dark:text-purple-500"
              />
            }
            title="For Recruiters"
            desc="Post jobs, filter candidates by CGPA/skills, and manage interview rounds effortlessly."
          />
          <FeatureCard
            icon={
              <Briefcase
                size={32}
                className="text-stone-600 dark:text-emerald-500"
              />
            }
            title="For TPO Admins"
            desc="Real-time analytics, automated notifications, and complete control over the placement drive."
          />
        </motion.div>
      </main>

      {/* Simple Footer */}
      <footer
        className="border-t py-8 text-center text-sm transition-colors
        border-stone-200 text-stone-500 
        dark:border-slate-800/50 dark:text-slate-600"
      >
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
    <div
      className="p-8 rounded-2xl border transition-colors duration-300 hover:shadow-xl
      bg-white border-stone-200 hover:border-stone-300
      dark:bg-slate-900/50 dark:border-slate-800 dark:hover:border-slate-700"
    >
      <div
        className="mb-4 w-14 h-14 flex items-center justify-center rounded-xl transition-colors
        bg-stone-100 
        dark:bg-slate-800/50"
      >
        {icon}
      </div>
      <h3
        className="text-xl font-semibold mb-3
        text-stone-900 
        dark:text-white"
      >
        {title}
      </h3>
      <p
        className="leading-relaxed
        text-stone-600 
        dark:text-slate-400"
      >
        {desc}
      </p>
      <ul className="mt-6 space-y-2">
        <li
          className="flex items-center gap-2 text-sm
          text-stone-500 
          dark:text-slate-500"
        >
          <CheckCircle2
            size={16}
            className="text-emerald-500/50 dark:text-blue-500/50"
          />{' '}
          Real-time tracking
        </li>
        <li
          className="flex items-center gap-2 text-sm
          text-stone-500 
          dark:text-slate-500"
        >
          <CheckCircle2
            size={16}
            className="text-emerald-500/50 dark:text-blue-500/50"
          />{' '}
          Instant Notifications
        </li>
      </ul>
    </div>
  )
}
