import { Response } from 'express'
import { pool } from '../config/db'
import { AuthRequest } from '../middleware/authMiddleware'

export const createJob = async (req: AuthRequest, res: Response) => {
  const {
    title,
    company_name,
    description,
    min_cgpa,
    salary_package,
    deadline,
  } = req.body
  try {
    await pool.query(
      `INSERT INTO jobs (title, company_name, description, min_cgpa, salary_package, deadline, posted_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        title,
        company_name,
        description,
        min_cgpa,
        salary_package,
        deadline,
        req.user?.id,
      ],
    )
    res.status(201).json({ message: 'Job created' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to create job' })
  }
}

export const getAllJobs = async (req: AuthRequest, res: Response) => {
  try {
    const jobs = await pool.query(`SELECT 
        j.*, 
        c.company_name, 
        c.location, 
        c.website 
      FROM jobs j
      LEFT JOIN companies c ON j.posted_by = c.user_id
      ORDER BY j.created_at DESC`)
    res.json(jobs.rows)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs' })
  }
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id
  try {
    const company = await pool.query(
      'SELECT * FROM companies WHERE user_id = $1',
      [userId],
    )

    // If no profile exists, return an empty object (instead of 404 error)
    if (company.rows.length === 0) {
      return res.json({})
    }
    res.json(company.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error fetching profile' })
  }
}

// 2. Update (or Create) Company Profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id
  const { company_name, website, location, description } = req.body

  try {
    // Check if profile already exists
    const check = await pool.query(
      'SELECT * FROM companies WHERE user_id = $1',
      [userId],
    )

    if (check.rows.length === 0) {
      // Create new profile
      await pool.query(
        'INSERT INTO companies (user_id, company_name, website, location, description) VALUES ($1, $2, $3, $4, $5)',
        [userId, company_name, website, location, description],
      )
    } else {
      // Update existing profile
      await pool.query(
        'UPDATE companies SET company_name = $1, website = $2, location = $3, description = $4 WHERE user_id = $5',
        [company_name, website, location, description, userId],
      )
    }
    res.json({ message: 'Profile updated successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error updating profile' })
  }
}
