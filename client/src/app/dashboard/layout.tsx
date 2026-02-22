'use client'
import { useRouter } from 'next/navigation'
import { LogOut, LayoutDashboard, Bell } from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.clear()
    router.replace('/')
  }

  return (
    <AuthGuard>
      {/* MAIN CONTAINER: 
          Light: Stone-50 background
          Dark: #050505 (Deep Charcoal/Black) 
      */}
      <div
        className="min-h-screen font-sans relative transition-colors duration-300 overflow-hidden
        selection:bg-emerald-500/30 dark:selection:bg-white dark:selection:text-black
        bg-stone-50 text-stone-900 
        dark:bg-[#050505] dark:text-white"
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

        {/* --- Background Glowing Spotlights --- */}
        <div className="fixed top-[10%] left-[20%] w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-500 bg-emerald-500/20 dark:bg-emerald-500/10 z-1" />
        <div className="fixed bottom-[20%] right-[10%] w-120 h-120 rounded-full blur-[128px] pointer-events-none transition-colors duration-500 bg-purple-500/10 dark:bg-blue-600/10 z-1" />

        {/* --- Top Navigation Bar --- */}
        <nav
          className="sticky top-0 z-50 w-full backdrop-blur-xl border-b transition-all duration-300
          bg-white/40 border-stone-200 shadow-sm
          /* Dark: Deep Glass Navbar */
          dark:bg-black/20 dark:border-white/5 dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex justify-between items-center h-20">
              {/* Logo Section */}
              <div className="flex items-center gap-4 group cursor-default">
                <div
                  className="p-2.5 border transition-all group-hover:scale-105 shadow-sm
                  rounded-xl bg-emerald-50 border-emerald-200 text-emerald-600
                  /* Dark: Sharp Glass Icon Box */
                  dark:rounded-none dark:bg-white/5 dark:backdrop-blur-md dark:border-white/20 dark:text-white dark:shadow-none"
                >
                  <LayoutDashboard size={22} strokeWidth={1.5} />
                </div>
                <h1
                  className="text-2xl font-black tracking-tighter transition-colors flex items-baseline gap-3 drop-shadow-sm
                  text-stone-800 
                  dark:text-white"
                >
                  PIMS.
                  <span
                    className="font-bold hidden sm:inline text-sm
                    text-stone-400 
                    /* Dark: Uppercase, Tech Label style */
                    dark:text-neutral-400 dark:uppercase dark:tracking-[0.2em] dark:text-xs"
                  >
                    Dashboard
                  </span>
                </h1>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3 sm:gap-6">
                <ThemeToggle />

                {/* Notification Bell */}
                <button
                  className="p-2.5 transition-all relative group border
                  rounded-xl bg-white/50 border-transparent text-stone-500 hover:text-stone-800 hover:bg-white hover:border-stone-200 hover:shadow-sm
                  /* Dark: Sharp Glass Button */
                  dark:rounded-none dark:bg-transparent dark:border-white/10 dark:text-neutral-400 dark:hover:bg-white dark:hover:text-black dark:hover:border-white"
                >
                  <Bell size={20} strokeWidth={1.5} />
                  <span
                    className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full border shadow-sm
                    bg-red-500 border-white 
                    /* Dark: Sharp indicator */
                    dark:border-black dark:rounded-none dark:w-1.5 dark:h-1.5"
                  ></span>
                </button>

                {/* Divider */}
                <div
                  className="h-8 w-px mx-1 hidden sm:block
                  bg-stone-300 
                  dark:bg-white/10"
                ></div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-5 py-2.5 text-xs font-bold transition-all border shadow-sm
                  rounded-xl bg-white/70 backdrop-blur-md border-stone-200 text-stone-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200
                  /* Dark: Sharp Glass Button */
                  dark:rounded-none dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white dark:hover:text-black dark:uppercase dark:tracking-widest dark:shadow-none"
                >
                  <LogOut size={16} strokeWidth={2} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6 pt-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
