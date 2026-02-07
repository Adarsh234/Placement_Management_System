'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    // 1. If no token, redirect to login
    if (!token) {
      router.replace('/auth/login')
      return
    }

    // 2. Role-Based Access Control (RBAC)
    // Prevent Students from accessing Admin/Company pages, etc.
    if (pathname.includes('/dashboard/admin') && role !== 'ADMIN') {
      router.replace('/dashboard/student') // Redirect to their own dashboard
      return
    }

    if (pathname.includes('/dashboard/company') && role !== 'COMPANY') {
      router.replace('/dashboard/student')
      return
    }

    if (pathname.includes('/dashboard/student') && role !== 'STUDENT') {
      // If an Admin tries to go to student view, maybe allow it?
      // But usually, redirect them back to their home
      if (role === 'ADMIN') router.replace('/dashboard/admin')
      else if (role === 'COMPANY') router.replace('/dashboard/company')
      return
    }

    // 3. If checks pass, allow access
    setIsLoading(false)
  }, [pathname, router])

  // Show a loading spinner while checking auth (prevents flashing protected content)
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white gap-4">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="text-slate-400 text-sm font-medium animate-pulse">
          Verifying Access...
        </p>
      </div>
    )
  }

  return <>{children}</>
}
