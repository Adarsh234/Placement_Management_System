'use client'
import { useRouter } from 'next/navigation'
import { LogOut, LayoutDashboard, Bell } from 'lucide-react'
import AuthGuard from '@/components/AuthGuard'
// 1. Import the Theme Toggle
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
        Light: Stone-50 background, Stone-900 text
        Dark: Slate-950 background, Slate-200 text
      */}
      <div
        className="min-h-screen font-sans selection:bg-blue-500/30 relative transition-colors duration-300
        bg-stone-50 text-stone-900 
        dark:bg-slate-950 dark:text-slate-200"
      >
        {/* --- Background Gradient Spotlights --- */}
        {/* Light Mode: Subtle Emerald/Stone glow */}
        {/* Dark Mode: Deep Blue/Purple glow */}
        <div
          className="fixed top-0 left-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-500
          bg-emerald-500/5 
          dark:bg-blue-500/10"
        />
        <div
          className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-500
          bg-stone-500/5 
          dark:bg-purple-500/10"
        />

        {/* --- Top Navigation Bar --- */}
        <nav
          className="sticky top-0 z-50 w-full backdrop-blur-xl border-b shadow-sm transition-all duration-300
          bg-white/80 border-stone-200 
          dark:bg-slate-950/80 dark:border-slate-800"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo Section */}
              <div className="flex items-center gap-3 group cursor-default">
                <div
                  className="p-2 rounded-lg border shadow-sm transition-transform group-hover:scale-110
                  bg-emerald-50 border-emerald-200 text-emerald-600
                  dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-500 dark:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                >
                  <LayoutDashboard size={20} />
                </div>
                <h1
                  className="text-xl font-bold tracking-tight transition-colors
                  text-stone-800 
                  dark:text-white"
                >
                  PIMS
                  <span
                    className="font-medium hidden sm:inline ml-2
                    text-stone-400 
                    dark:text-slate-500"
                  >
                    Dashboard
                  </span>
                </h1>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* 2. ADD THEME TOGGLE HERE */}
                <ThemeToggle />

                {/* Notification Bell */}
                <button
                  className="p-2 rounded-full transition-colors relative
                  text-stone-400 hover:text-stone-800 hover:bg-stone-100
                  dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                >
                  <Bell size={20} />
                  <span
                    className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border shadow-sm
                    border-white 
                    dark:border-slate-950"
                  ></span>
                </button>

                {/* Divider */}
                <div
                  className="h-6 w-px mx-2 hidden sm:block
                  bg-stone-200 
                  dark:bg-slate-800"
                ></div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all border border-transparent
                    text-stone-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200
                    dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 dark:hover:border-red-500/20"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
