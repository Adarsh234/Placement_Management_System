'use client'
import { useRouter } from 'next/navigation'
import { LogOut, LayoutDashboard, Bell } from 'lucide-react'
import AuthGuard from '@/components/AuthGuard' // <--- 1. Import AuthGuard

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.clear()
    router.replace('/') // Use replace to prevent "Back" button return
  }

  return (
    // 2. Wrap EVERYTHING inside AuthGuard to protect all dashboard routes
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 relative">
        {/* Background Gradient Spotlights (Fixed) */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none" />

        {/* Top Navigation Bar with Dark Glassmorphism */}
        <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 shadow-sm transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo Section */}
              <div className="flex items-center gap-3 group cursor-default">
                <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform">
                  <LayoutDashboard size={20} />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  PIMS
                  <span className="text-slate-500 font-medium hidden sm:inline ml-2">
                    Dashboard
                  </span>
                </h1>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Notification Bell */}
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-slate-950 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                </button>

                {/* Divider */}
                <div className="h-6 w-px bg-slate-800 mx-2 hidden sm:block"></div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20"
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
