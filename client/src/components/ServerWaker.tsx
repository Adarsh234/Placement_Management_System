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
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm"
        >
          <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 flex flex-col items-center text-center max-w-sm mx-4">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin relative z-10" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Waking up the Server...
            </h3>
            <p className="text-slate-400 text-sm">
              Since this is a free hosting tier, the server needs a moment to
              wake up from sleep mode. This usually takes about 30-50 seconds.
            </p>

            <div className="mt-6 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-[progress_40s_ease-in-out_forwards] w-0" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
