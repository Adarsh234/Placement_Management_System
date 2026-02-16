'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
    // MAIN CONTAINER
    // Light: Stone-50 (Classic Clean)
    // Dark: #050505 (Deepest Charcoal/Black - Brutalist Base)
    <div
      className="min-h-screen overflow-hidden relative transition-colors duration-300 selection:bg-emerald-500/30 dark:selection:bg-white/90 dark:selection:text-black
      bg-stone-50 text-stone-900 
      dark:bg-[#050505] dark:text-white"
    >
      {/* --- Background Spotlights (Subtle Fog in Dark Mode) --- */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-500
        bg-emerald-500/10 
        dark:bg-white/5"
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-500
        bg-stone-500/10 
        dark:bg-white/5"
      />

      {/* --- Navbar --- */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center max-w-7xl mx-auto left-0 right-0 z-50">
        <div
          className="text-2xl font-black tracking-tighter transition-colors
          text-emerald-700 
          dark:text-white dark:tracking-widest"
        >
          PIMS.
        </div>

        <div className="flex items-center gap-6">
          <ThemeToggle />

          <Link
            href="/auth/login?role=admin"
            className="text-xs font-bold uppercase tracking-[0.2em] transition-colors
              text-stone-600 hover:text-stone-900
              dark:text-neutral-500 dark:hover:text-white"
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
          className="text-center max-w-5xl mx-auto space-y-10"
        >
          {/* Badge: Sharp edges, high contrast uppercase */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-3 px-4 py-2 border text-[10px] font-bold uppercase tracking-[0.25em] transition-all
              rounded-full bg-emerald-100/50 border-emerald-200 text-emerald-700
              dark:rounded-none dark:bg-white/5 dark:border-white/10 dark:text-neutral-200"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
                bg-emerald-400 
                dark:bg-white"
              ></span>
              <span
                className="relative inline-flex rounded-full h-1.5 w-1.5
                bg-emerald-500 
                dark:bg-white"
              ></span>
            </span>
            System Online v2.0
          </motion.div>

          {/* Heading: Geometric Sans-Serif, Massive Impact */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-8xl font-black tracking-tight
            text-stone-900
            dark:text-white dark:uppercase dark:tracking-tighter dark:leading-[0.9]"
          >
            Campus <br /> Recruitment <br />
            <span
              className="
              text-emerald-700 
              dark:text-neutral-600"
            >
              Simplified.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl max-w-xl mx-auto leading-relaxed transition-colors
            text-stone-600 
            dark:text-neutral-400 dark:font-medium dark:text-sm dark:uppercase dark:tracking-widest"
          >
            The centralized platform connecting ambitious students with top-tier
            companies.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap gap-6 justify-center mt-12"
          >
            {/* Student Login Button: Solid White Block in Dark Mode */}
            <Link href="/auth/login?role=student">
              <button
                className="group relative flex items-center gap-4 px-8 py-4 font-bold transition-all duration-300
                rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-500 hover:scale-105 shadow-emerald-500/20
                
                /* Dark Mode: Sharp, Solid White, Black Text (High Contrast) */
                dark:rounded-none dark:bg-white dark:text-black dark:shadow-none dark:hover:bg-neutral-200 dark:hover:scale-100 dark:uppercase dark:tracking-widest dark:text-xs"
              >
                Student Login
                <ArrowRight
                  size={16}
                  className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-black"
                />
              </button>
            </Link>

            {/* Company Login Button: Ghost/Outline in Dark Mode */}
            <Link href="/auth/login?role=company">
              <button
                className="group relative flex items-center gap-4 px-8 py-4 border font-bold transition-all duration-300
                rounded-full bg-white border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-stone-300
                
                /* Dark Mode: Sharp, Ghost Button, White Border */
                dark:rounded-none dark:bg-transparent dark:border-white/20 dark:text-white dark:hover:bg-white/5 dark:hover:border-white/50 dark:uppercase dark:tracking-widest dark:text-xs"
              >
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
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-7xl w-full"
        >
          <FeatureCard
            icon={<UserCheck size={32} strokeWidth={1.5} />}
            title="For Students"
            desc="Build your profile, upload resumes, and apply to unlimited drives with a single click."
          />
          <FeatureCard
            icon={<Building2 size={32} strokeWidth={1.5} />}
            title="For Recruiters"
            desc="Post jobs, filter candidates by CGPA/skills, and manage interview rounds effortlessly."
          />
          <FeatureCard
            icon={<Briefcase size={32} strokeWidth={1.5} />}
            title="For TPO Admins"
            desc="Real-time analytics, automated notifications, and complete control over the placement drive."
          />
        </motion.div>
      </main>

      {/* Footer */}
      <footer
        className="border-t py-12 text-center text-sm transition-colors
        border-stone-200 text-stone-500 
        dark:border-white/10 dark:text-neutral-600 dark:uppercase dark:tracking-[0.3em] dark:text-xs"
      >
        <p>PIMS INC. © 2026 // ALL RIGHTS RESERVED.</p>
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
      className="p-10 border transition-all duration-500 group
      rounded-2xl bg-white border-stone-200 hover:shadow-xl hover:border-stone-300
      
      /* Dark Mode: Brutalist Card 
         - Sharp corners (rounded-none)
         - Dark Charcoal BG (#0A0A0A)
         - Thin White Border
         - No shadow, just structure
      */
      dark:rounded-none dark:bg-[#0A0A0A] dark:border-white/10
      dark:hover:border-white dark:hover:bg-black dark:hover:shadow-none"
    >
      <div
        className="mb-8 w-16 h-16 flex items-center justify-center transition-colors
        rounded-xl bg-stone-100 text-stone-600
        /* Dark: Sharp Icon Box, Deep Black BG, White Icon */
        dark:rounded-none dark:bg-black dark:border dark:border-white/10 dark:text-white dark:group-hover:bg-white dark:group-hover:text-black"
      >
        {icon}
      </div>
      <h3
        className="text-xl font-bold mb-4 transition-colors
        text-stone-900 
        dark:text-white dark:uppercase dark:tracking-[0.2em] dark:text-sm"
      >
        {title}
      </h3>
      <p
        className="leading-relaxed transition-colors
        text-stone-600 
        dark:text-neutral-500 dark:text-xs dark:font-medium dark:uppercase dark:tracking-wide dark:leading-loose"
      >
        {desc}
      </p>

      {/* Decorative Line for Brutalist feel */}
      <div className="hidden dark:block w-full h-px bg-white/10 mt-8 group-hover:bg-white transition-colors duration-500" />
    </div>
  )
}
