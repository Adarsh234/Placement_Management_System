import { Response } from 'express'
import { pool } from '../config/db'
import { AuthRequest } from '../middleware/authMiddleware'
import { sendStatusEmail } from '../utils/emailService' // <--- Import the service

// 1. Student Applies for Job
export const applyForJob = async (req: AuthRequest, res: Response) => {
  const { jobId } = req.body
  const userId = req.user?.id

  try {
    // Get Student ID from User ID
    const student = await pool.query(
      'SELECT id FROM students WHERE user_id = $1',
      [userId],
    )
    if (student.rows.length === 0)
      return res.status(404).json({ message: 'Student profile not found' })

    await pool.query(
      'INSERT INTO applications (job_id, student_id) VALUES ($1, $2)',
      [jobId, student.rows[0].id],
    )
    res.status(201).json({ message: 'Applied successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Already applied or server error' })
  }
}

// 2. Company Views Applicants for a Job (UPDATED with new fields)
export const getJobApplicants = async (req: AuthRequest, res: Response) => {
  const { jobId } = req.params
  try {
    // ADDED: s.course, s.semester, s.backlogs to the SELECT query
    const applicants = await pool.query(
      `
      SELECT 
        s.full_name, 
        s.cgpa, 
        s.skills, 
        s.resume_url, 
        s.course, 
        s.semester, 
        s.backlogs, 
        a.status, 
        a.id as application_id
      FROM applications a
      JOIN students s ON a.student_id = s.id
      WHERE a.job_id = $1
    `,
      [jobId],
    )
    res.json(applicants.rows)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching applicants' })
  }
}

// 3. Company Updates Status (Multi-Stage Pipeline) -> NOW SENDS EMAILS FOR ALL STAGES
export const updateStatus = async (req: AuthRequest, res: Response) => {
  const { applicationId, status } = req.body // e.g. 'SHORTLISTED', 'INTERVIEW', 'SELECTED', etc.

  try {
    // 1. Update the status in the database
    // We use RETURNING to get the IDs immediately so we can look up email info
    const updateResult = await pool.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING student_id, job_id',
      [status, applicationId],
    )

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' })
    }

    const { student_id, job_id } = updateResult.rows[0]

    // 2. Fetch Student Email, Name, and Job Title
    const details = await pool.query(
      `
      SELECT u.email, s.full_name, j.title 
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN jobs j ON j.id = $1
      WHERE s.id = $2
    `,
      [job_id, student_id],
    )

    // 3. Trigger the Email Notification (Async - don't wait for it to finish)
    if (details.rows.length > 0) {
      const { email, full_name, title } = details.rows[0]

      // Send email for all pipeline stages (skip if they just move it back to 'PENDING')
      if (status !== 'PENDING') {
        sendStatusEmail(email, status, title, full_name)
      }
    }

    res.json({ message: 'Status updated and notification sent' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error updating status' })
  }
}

// 4. NEW: Get All Jobs a Student Has Applied For (For "Already Applied" button logic)
export const getStudentApplications = async (
  req: AuthRequest,
  res: Response,
) => {
  const userId = req.user?.id

  try {
    // First, find the student's internal ID using their Auth User ID
    const student = await pool.query(
      'SELECT id FROM students WHERE user_id = $1',
      [userId],
    )

    // If they haven't set up a profile yet, they couldn't have applied to anything
    if (student.rows.length === 0) {
      return res.json([])
    }

    // Now get all application records for that student
    const applications = await pool.query(
      `SELECT job_id FROM applications WHERE student_id = $1`,
      [student.rows[0].id],
    )

    // This returns an array like: [ { job_id: 1 }, { job_id: 4 } ]
    res.json(applications.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error fetching applications' })
  }
}
