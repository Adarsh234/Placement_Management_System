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
          // Backdrop: Deep charcoal/black with blur, sharp aesthetic
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center backdrop-blur-md transition-colors duration-300
            bg-stone-50/90 dark:bg-[#050505]/95"
        >
          <div
            // Card: Sharp edges (rounded-none), thin borders, high negative space (p-12)
            className="p-12 border w-full max-w-sm mx-4 transition-colors duration-300 flex flex-col items-center text-center shadow-xl
            bg-white border-stone-200 
            dark:bg-[#0A0A0A] dark:border-white/10 dark:shadow-none dark:rounded-none"
          >
            <div className="relative mb-8">
              {/* Removed soft glows for a cleaner, stark look */}
              <Loader2
                className="w-10 h-10 animate-spin relative z-10 transition-colors duration-300
                text-stone-900 dark:text-white"
                strokeWidth={1.5} // Thinner stroke for elegance
              />
            </div>

            {/* Typography: Geometric, Uppercase, Widely Spaced */}
            <h3
              className="text-lg font-bold mb-4 uppercase tracking-[0.25em] transition-colors duration-300
              text-stone-900 dark:text-white"
            >
              System Waking
            </h3>

            {/* Description: High contrast, slightly smaller/technical feel */}
            <p
              className="text-xs font-medium leading-relaxed max-w-70 uppercase tracking-wide transition-colors duration-300
              text-stone-500 dark:text-neutral-400"
            >
              Initializing server instance.
              <br />
              Estimated wait: 30-50 seconds.
            </p>

            {/* Progress Bar: Sharp edges, thin line, high contrast */}
            <div
              className="mt-10 w-full h-0.5 overflow-hidden transition-colors duration-300
              bg-stone-200 dark:bg-neutral-800 rounded-none"
            >
              <div
                className="h-full w-0 animate-[progress_40s_ease-in-out_forwards] transition-colors duration-300
                bg-stone-900 dark:bg-white"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
