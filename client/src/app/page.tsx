'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  Briefcase,
  UserCheck,
  Building2,
  ArrowRight,
  Info,
  Code2,
  Database,
  Cpu,
  ShieldCheck,
} from 'lucide-react'

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function Home() {
  return (
    // MAIN CONTAINER
    <div
      className="min-h-screen overflow-hidden relative transition-colors duration-300 selection:bg-emerald-500/30 dark:selection:bg-white/90 dark:selection:text-black
      bg-stone-50 text-stone-900 
      dark:bg-[#050505] dark:text-white"
    >
      {/* --- Background Spotlights --- */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-500 bg-emerald-500/10 dark:bg-white/5" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-500 bg-stone-500/10 dark:bg-white/5" />

      {/* --- Navbar --- */}
      <nav className="fixed top-0 w-full p-6 z-50 transition-all duration-300 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter transition-colors text-emerald-700 dark:text-white dark:tracking-widest">
            PIMS.
          </div>

          {/* Centered Glass Nav */}
          <div className="hidden md:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
            <Link href="#about">
              <button
                className="flex items-center gap-2 px-5 py-2.5 font-bold text-xs uppercase tracking-widest transition-all
                  bg-white/50 backdrop-blur-md border border-stone-200 text-stone-600 rounded-full hover:bg-white hover:shadow-md
                  dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:text-neutral-300 dark:rounded-none dark:hover:bg-white/10 dark:hover:text-white"
              >
                <Info size={14} /> System Intel
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Link
              href="/auth/login?role=admin"
              className="text-xs font-bold uppercase tracking-[0.2em] transition-colors text-stone-600 hover:text-stone-900 dark:text-neutral-500 dark:hover:text-white"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center pt-32 pb-20 px-4 relative z-10">
        {/* --- HERO SECTION --- */}
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
          className="text-center max-w-5xl mx-auto space-y-10 mb-32"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-3 px-4 py-2 border text-[10px] font-bold uppercase tracking-[0.25em] transition-all
              rounded-full bg-emerald-100/50 border-emerald-200 text-emerald-700
              dark:rounded-none dark:bg-white/5 dark:border-white/10 dark:text-neutral-200"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400 dark:bg-white"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 dark:bg-white"></span>
            </span>
            System Online v2.0
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-8xl font-black tracking-tight text-stone-900 dark:text-white dark:uppercase dark:tracking-tighter dark:leading-[0.9]"
          >
            Campus <br /> Recruitment <br />
            <span className="text-emerald-700 dark:text-neutral-600">
              Simplified.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl max-w-xl mx-auto leading-relaxed transition-colors text-stone-600 dark:text-neutral-400 dark:font-medium dark:text-sm dark:uppercase dark:tracking-widest"
          >
            The centralized platform connecting ambitious students with top-tier
            companies.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap gap-6 justify-center mt-12"
          >
            <Link href="/auth/login?role=student">
              <button className="group relative flex items-center gap-4 px-8 py-4 font-bold transition-all duration-300 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-500 hover:scale-105 shadow-emerald-500/20 dark:rounded-none dark:bg-white dark:text-black dark:shadow-none dark:hover:bg-neutral-200 dark:hover:scale-100 dark:uppercase dark:tracking-widest dark:text-xs">
                Student Login{' '}
                <ArrowRight
                  size={16}
                  className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all text-black"
                />
              </button>
            </Link>
            <Link href="/auth/login?role=company">
              <button className="group relative flex items-center gap-4 px-8 py-4 border font-bold transition-all duration-300 rounded-full bg-white border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-stone-300 dark:rounded-none dark:bg-transparent dark:border-white/20 dark:text-white dark:hover:bg-white/5 dark:hover:border-white/50 dark:uppercase dark:tracking-widest dark:text-xs">
                Recruiter Portal
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* --- EXTENDED ABOUT SECTION --- */}
        <section
          id="about"
          className="w-full max-w-7xl mx-auto py-20 scroll-mt-24 space-y-24"
        >
          {/* 1. Mission Block */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border p-8 md:p-16 transition-all duration-300 rounded-3xl bg-white/50 border-stone-200 dark:rounded-none dark:bg-[#0A0A0A] dark:border-white/10 dark:bg-[url('https://grainy-gradients.vercel.app/noise.svg')] dark:bg-opacity-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div className="md:sticky md:top-32">
                <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-stone-900 dark:text-white dark:uppercase dark:tracking-tighter dark:leading-[0.8]">
                  Bridging <br /> Talent & <br /> Opportunity
                </h2>
                <div className="w-20 h-2 bg-emerald-500 dark:bg-white mb-6"></div>
                <p className="font-bold uppercase tracking-widest text-xs text-stone-500 dark:text-neutral-500">
                  Mission Statement // 2026
                </p>
              </div>
              <div className="space-y-8">
                <div className="prose prose-lg dark:prose-invert">
                  <p className="text-lg leading-relaxed text-stone-600 dark:text-neutral-300 dark:font-light">
                    The{' '}
                    <strong>
                      Placement Information Management System (PIMS)
                    </strong>{' '}
                    is designed to revolutionize how campuses handle
                    recruitment. PIMS creates a unified ecosystem where TPOs,
                    Students, and Recruiters interact seamlessly in real-time.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-6 border rounded-2xl bg-stone-50 border-stone-100 dark:bg-transparent dark:rounded-none dark:border-white/10">
                    <h3 className="text-3xl font-black text-emerald-600 dark:text-white">
                      98%
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-500 mt-2">
                      Placement Rate
                    </p>
                  </div>
                  <div className="p-6 border rounded-2xl bg-stone-50 border-stone-100 dark:bg-transparent dark:rounded-none dark:border-white/10">
                    <h3 className="text-3xl font-black text-purple-600 dark:text-white">
                      500+
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-neutral-500 mt-2">
                      Partner Companies
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. Architecture & Tech Stack (UPDATED) */}
          <div className="space-y-12">
            <div className="text-center">
              <h3 className="text-3xl font-black text-stone-900 dark:text-white dark:uppercase dark:tracking-tighter">
                System Architecture
              </h3>
              <p className="text-stone-500 dark:text-neutral-500 mt-2">
                Powered by modern web technologies
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <TechCard
                icon={<Code2 size={32} />}
                title="Frontend"
                desc="Next.js 14, React, Framer Motion"
              />
              <TechCard
                icon={<Database size={32} />}
                title="Database"
                desc="PostgreSQL, Prisma ORM, Supabase"
              />
              <TechCard
                icon={<ShieldCheck size={32} />}
                title="Security"
                desc="JWT Auth, Bcrypt, Middleware"
              />
              <TechCard
                icon={<Cpu size={32} />}
                title="Backend"
                desc="Serverless Functions, REST API"
              />
            </motion.div>
          </div>

          {/* 3. Workflow Timeline */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="border-t border-stone-200 dark:border-white/10 pt-20"
          >
            <div className="text-center mb-16">
              <h3 className="text-2xl font-black text-stone-900 dark:text-white dark:uppercase dark:tracking-widest">
                System Workflow
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-stone-200 dark:bg-white/10 z-0" />

              <WorkflowStep
                step="01"
                title="Registration"
                desc="Students create profiles. Admin verifies credentials using roll numbers."
              />
              <WorkflowStep
                step="02"
                title="Application"
                desc="Companies post drives. Eligible students apply with one click."
              />
              <WorkflowStep
                step="03"
                title="Selection"
                desc="Real-time updates on shortlisting, interviews, and final offers."
              />
            </div>
          </motion.div>
        </section>

        {/* --- FEATURE CARDS --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-7xl w-full"
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

      <footer className="border-t py-12 text-center text-sm transition-colors border-stone-200 text-stone-500 dark:border-white/10 dark:text-neutral-600 dark:uppercase dark:tracking-[0.3em] dark:text-xs">
        <p>PIMS INC. © 2026 // ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  )
}

// --- SUB-COMPONENTS ---

function TechCard({ icon, title, desc }: any) {
  return (
    <motion.div
      variants={fadeInUp}
      className="group p-8 border transition-all duration-300 h-full relative overflow-hidden
      rounded-2xl bg-white border-stone-200 hover:shadow-xl hover:-translate-y-1
      /* Dark Mode: Brutalist Inversion */
      dark:rounded-none dark:bg-transparent dark:border-white/10 dark:hover:bg-white dark:hover:text-black dark:hover:border-white"
    >
      <div className="relative z-10">
        <div
          className="mb-6 text-emerald-600 transition-transform duration-300 group-hover:scale-110 group-hover:text-emerald-500
          dark:text-white dark:group-hover:text-black"
        >
          {icon}
        </div>
        <h4
          className="text-4xl font-black text-stone-900 uppercase tracking-tighter mb-4 transition-colors
          dark:text-white dark:group-hover:text-black"
        >
          {title}
        </h4>
        <p
          className="font-mono text-sm text-stone-500 transition-colors
          dark:text-neutral-500 dark:group-hover:text-black/70"
        >
          {desc}
        </p>
      </div>
    </motion.div>
  )
}

function WorkflowStep({ step, title, desc }: any) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <div
        className="w-24 h-24 flex items-center justify-center text-2xl font-black mb-6 transition-all
        rounded-full bg-white border-4 border-emerald-100 text-emerald-600
        dark:rounded-none dark:bg-[#050505] dark:border-white/20 dark:text-white"
      >
        {step}
      </div>
      <h4 className="text-xl font-bold mb-2 text-stone-900 dark:text-white dark:uppercase dark:tracking-wide">
        {title}
      </h4>
      <p className="text-stone-600 dark:text-neutral-500 text-sm max-w-xs leading-relaxed">
        {desc}
      </p>
    </div>
  )
}

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
      className="p-10 border transition-all duration-500 group rounded-2xl bg-white border-stone-200 hover:shadow-xl hover:border-stone-300 
      dark:rounded-none dark:bg-[#0A0A0A] dark:border-white/10 dark:hover:border-white dark:hover:bg-black dark:hover:shadow-none"
    >
      <div className="mb-8 w-16 h-16 flex items-center justify-center transition-colors rounded-xl bg-stone-100 text-stone-600 dark:rounded-none dark:bg-black dark:border dark:border-white/10 dark:text-white dark:group-hover:bg-white dark:group-hover:text-black">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 transition-colors text-stone-900 dark:text-white dark:uppercase dark:tracking-[0.2em] dark:text-sm">
        {title}
      </h3>
      <p className="leading-relaxed transition-colors text-stone-600 dark:text-neutral-500 dark:text-xs dark:font-medium dark:uppercase dark:tracking-wide dark:leading-loose">
        {desc}
      </p>
      <div className="hidden dark:block w-full h-1px bg-white/10 mt-8 group-hover:bg-white transition-colors duration-500" />
    </div>
  )
}
