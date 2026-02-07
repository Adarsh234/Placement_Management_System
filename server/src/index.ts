import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'
import jobRoutes from './routes/jobRoutes'
import adminRoutes from './routes/adminRoutes'
import studentRoutes from './routes/studentRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: 'https://placement-management-system-nine.vercel.app',
    credentials: true,
  }),
)
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/student', studentRoutes)

app.get('/', (req, res) => {
  res.send('✅ PIMS Server is Running!')
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
