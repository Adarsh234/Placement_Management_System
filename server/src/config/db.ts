import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// Create a new pool using the connection string from .env
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase to accept the connection
  },
})

pool.on('connect', () => {
  console.log('✅ Connected to Supabase Database')
})

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err)
  process.exit(-1)
})
