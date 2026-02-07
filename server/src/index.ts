import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'
import jobRoutes from './routes/jobRoutes'
import adminRoutes from './routes/adminRoutes'
import studentRoutes from './routes/studentRoutes'
import { pool } from './config/db' // Ensure you import 'pool' here

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://placement-management-system-nine.vercel.app', // Vercel URL
    ],
    credentials: true,
  }),
)
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/student', studentRoutes)

// --- DIAGNOSTIC ROUTE START ---
// This route helps debug connection issues on Render
app.get('/api/diagnose', async (req, res) => {
  const report = {
    status: 'Server is Online',
    timestamp: new Date().toISOString(),
    env_checks: {
      JWT_SECRET: process.env.JWT_SECRET ? 'Exists ✅' : 'MISSING ❌',
      DATABASE_URL: process.env.DATABASE_URL ? 'Exists ✅' : 'MISSING ❌',
    },
    database_connection: 'Checking...',
  }

  try {
    // Attempt a simple query to check DB connection
    await pool.query('SELECT 1')
    report.database_connection = 'Success: Connected to Supabase ✅'
    res.status(200).json(report)
  } catch (error: any) {
    report.database_connection = `FAILED ❌: ${error.message}`
    res.status(500).json(report)
  }
})
// --- DIAGNOSTIC ROUTE END ---

app.get('/', (req, res) => {
  res.send('✅ PIMS Server is Running!')
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
