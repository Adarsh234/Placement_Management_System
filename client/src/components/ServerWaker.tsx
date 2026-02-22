'use client'
import { useEffect, useState } from 'react'
import API from '@/lib/api'
import { Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ServerWaker() {
  const [isWaking, setIsWaking] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        // We ping the root route '/' or '/api/diagnose' to wake it up
        await API.get('/diagnose')
        setIsWaking(false)
        console.log('✅ Server is awake and ready!')
      } catch (err) {
        console.error('Failed to wake server:', err)
        // Even if it fails (e.g. 404), the server is technically "awake" now.
        // But we set error state just in case it's a real network issue.
        setIsError(true)
        setIsWaking(false)
      }
    }

    wakeUpServer()
  }, [])

  // If server is ready, render nothing
  if (!isWaking && !isError) return null

  return (
    <AnimatePresence>
      {isWaking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-9999 flex items-center justify-center transition-colors duration-300
            bg-stone-50 text-stone-900 
            dark:bg-[#050505] dark:text-white"
        >
          {/* --- Global Background Image & Cinematic Glass Effects --- */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Base Image */}
            <div className="absolute inset-0 bg-[url('/photos/png.png')] bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-40 transition-opacity duration-700" />

            {/* Dark Vignette / Cinematic Fade */}
            <div className="absolute inset-0 bg-linear-to-t from-stone-100 via-stone-50/80 to-transparent dark:from-[#050505] dark:via-[#050505]/80 dark:to-transparent" />
            <div className="absolute inset-0 bg-stone-50/50 dark:bg-[#050505]/60 backdrop-blur-sm" />

            {/* Premium Noise Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] dark:opacity-[0.08] mix-blend-overlay" />
          </div>

          {/* Background Spotlights for depth */}
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none transition-colors duration-500 bg-emerald-500/20 dark:bg-emerald-500/10 z-1" />
          <div className="absolute bottom-0 right-1/4 w-120 h-120 rounded-full blur-[128px] pointer-events-none transition-colors duration-500 bg-purple-500/10 dark:bg-blue-600/10 z-1" />

          {/* --- LOADER CARD --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="p-12 border w-full max-w-sm mx-4 transition-all duration-300 flex flex-col items-center text-center relative z-10
              /* Light: Frosted White */
              rounded-3xl bg-white/70 backdrop-blur-xl border-stone-200 shadow-2xl
              /* Dark: Deep Glass Panel */
              dark:rounded-3xl dark:bg-black/40 dark:backdrop-blur-2xl dark:border-white/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            <div className="relative mb-8">
              <Loader2
                className="w-10 h-10 animate-spin relative z-10 transition-colors duration-300
                text-emerald-600 dark:text-emerald-400"
                strokeWidth={1.5}
              />
            </div>

            {/* Typography: Geometric, Uppercase, Widely Spaced */}
            <h3
              className="text-lg font-black mb-4 uppercase tracking-[0.25em] transition-colors duration-300
              text-stone-900 dark:text-white"
            >
              System Waking
            </h3>

            {/* Description: High contrast, slightly smaller/technical feel */}
            <p
              className="text-xs font-bold leading-relaxed max-w-[70%] uppercase tracking-widest transition-colors duration-300
              text-stone-500 dark:text-neutral-400"
            >
              Initializing instance.
              <br />
              Estimated wait: 30-50s.
            </p>

            {/* Progress Bar: Sharp edges, thin line, high contrast */}
            <div
              className="mt-10 w-full h-px overflow-hidden transition-colors duration-300
              bg-stone-300 dark:bg-white/10 rounded-none"
            >
              <div
                className="h-full w-0 animate-[progress_40s_ease-in-out_forwards] transition-colors duration-300
                bg-emerald-600 dark:bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
