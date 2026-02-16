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
        className="min-h-screen font-sans relative transition-colors duration-300 
        selection:bg-emerald-500/30 dark:selection:bg-white dark:selection:text-black
        bg-stone-50 text-stone-900 
        dark:bg-[#050505] dark:text-white"
      >
        {/* --- Background Spotlights --- */}
        {/* Light Mode: Subtle Emerald/Stone. Dark Mode: Subtle White Fog */}
        <div
          className="fixed top-0 left-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-500
          bg-emerald-500/5 
          dark:bg-white/5"
        />
        <div
          className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-500
          bg-stone-500/5 
          dark:bg-white/5"
        />

        {/* --- Top Navigation Bar --- */}
        <nav
          className="sticky top-0 z-50 w-full backdrop-blur-xl border-b shadow-sm transition-all duration-300
          bg-white/80 border-stone-200 
          dark:bg-[#050505]/80 dark:border-white/10 dark:shadow-none"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo Section */}
              <div className="flex items-center gap-3 group cursor-default">
                <div
                  className="p-2 border shadow-sm transition-transform group-hover:scale-105
                  rounded-lg bg-emerald-50 border-emerald-200 text-emerald-600
                  /* Dark: Sharp, Black High Contrast */
                  dark:rounded-none dark:bg-black dark:border-white/20 dark:text-white dark:shadow-none"
                >
                  <LayoutDashboard size={20} strokeWidth={1.5} />
                </div>
                <h1
                  className="text-xl font-bold tracking-tight transition-colors flex items-baseline gap-3
                  text-stone-800 
                  dark:text-white"
                >
                  PIMS
                  <span
                    className="font-medium hidden sm:inline text-sm
                    text-stone-400 
                    /* Dark: Uppercase, Tech Label style */
                    dark:text-neutral-500 dark:uppercase dark:tracking-widest dark:text-xs"
                  >
                    Dashboard
                  </span>
                </h1>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3 sm:gap-5">
                <ThemeToggle />

                {/* Notification Bell */}
                <button
                  className="p-2 transition-colors relative group
                  rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100
                  /* Dark: Sharp, Inverted Hover */
                  dark:rounded-none dark:text-neutral-400 dark:hover:bg-white dark:hover:text-black"
                >
                  <Bell size={20} strokeWidth={1.5} />
                  <span
                    className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border shadow-sm
                    border-white 
                    /* Dark: Sharp indicator */
                    dark:border-black dark:rounded-none dark:w-1.5 dark:h-1.5"
                  ></span>
                </button>

                {/* Divider */}
                <div
                  className="h-6 w-px mx-1 hidden sm:block
                  bg-stone-200 
                  dark:bg-white/10"
                ></div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all border
                  rounded-lg border-transparent text-stone-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200
                  /* Dark: Sharp, Bordered, Inverted Hover */
                  dark:rounded-none dark:text-neutral-300 dark:border-white/10 dark:hover:bg-white dark:hover:text-black dark:uppercase dark:tracking-wider dark:text-xs dark:font-bold"
                >
                  <LogOut size={16} strokeWidth={1.5} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
