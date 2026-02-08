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
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center backdrop-blur-sm transition-colors duration-300
            bg-stone-50/90 dark:bg-slate-950/90"
        >
          <div
            className="p-8 rounded-2xl shadow-2xl border flex flex-col items-center text-center max-w-sm mx-4 transition-colors duration-300
            bg-white border-stone-200 
            dark:bg-slate-900 dark:border-slate-800"
          >
            <div className="relative mb-6">
              <div
                className="absolute inset-0 rounded-full blur-xl animate-pulse transition-colors duration-300
                bg-emerald-500/20 dark:bg-blue-500/20"
              />
              <Loader2
                className="w-12 h-12 animate-spin relative z-10 transition-colors duration-300
                text-emerald-600 dark:text-blue-500"
              />
            </div>

            <h3
              className="text-xl font-bold mb-2 transition-colors duration-300
              text-stone-900 dark:text-white"
            >
              Waking up the Server...
            </h3>
            <p
              className="text-sm transition-colors duration-300
              text-stone-500 dark:text-slate-400"
            >
              Since this is a free hosting tier, the server needs a moment to
              wake up from sleep mode. This usually takes about 30-50 seconds.
            </p>

            <div
              className="mt-6 w-full h-1.5 rounded-full overflow-hidden transition-colors duration-300
              bg-stone-100 dark:bg-slate-800"
            >
              <div
                className="h-full w-0 animate-[progress_40s_ease-in-out_forwards] transition-colors duration-300
                bg-emerald-500 dark:bg-blue-500"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
