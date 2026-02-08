'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Wait for mount to avoid mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render a placeholder with the same size to prevent layout jump
    return <div className="w-9 h-9" />
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="relative p-2 rounded-lg transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-blue-500
        bg-white border-stone-200 hover:bg-stone-100 text-stone-800
        dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:text-slate-200"
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon (Show when Dark) */}
        <Sun
          className={`absolute inset-0 transition-all duration-300 transform ${
            resolvedTheme === 'dark'
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
          }`}
          size={20}
        />
        {/* Moon Icon (Show when Light) */}
        <Moon
          className={`absolute inset-0 transition-all duration-300 transform ${
            resolvedTheme === 'dark'
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
          size={20}
        />
      </div>
    </button>
  )
}
