import { Response } from 'express'
import { pool } from '../config/db'
import { AuthRequest } from '../middleware/authMiddleware'

// 1. Get Student Profile (Resume Link)
export const getProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id
  try {
    const student = await pool.query(
      'SELECT * FROM students WHERE user_id = $1',
      [userId],
    )
    if (student.rows.length === 0)
      return res.status(404).json({ message: 'Student not found' })

    // Return the profile data
    res.json(student.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error fetching profile' })
  }
}

// 2. Update Resume Link
export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { resumeUrl, rollNumber, cgpa, skills } = req.body
  const userId = req.user?.id

  try {
    await pool.query(
      `UPDATE students 
       SET resume_url = $1, roll_number = $2, cgpa = $3, skills = $4
       WHERE user_id = $5`,
      [resumeUrl, rollNumber, cgpa, skills, userId],
    )
    res.json({ message: 'Profile updated successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error updating profile' })
  }
}

export const verifyStudent = async (req: AuthRequest, res: Response) => {
  const { studentId } = req.params
  const { isVerified } = req.body // true or false

  try {
    await pool.query('UPDATE students SET is_verified = $1 WHERE id = $2', [
      isVerified,
      studentId,
    ])
    res.json({ message: 'Student verification status updated' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error verifying student' })
  }
}

// 4. Get All Students (For Admin View)
export const getAllStudents = async (req: AuthRequest, res: Response) => {
  try {
    const students = await pool.query('SELECT * FROM students ORDER BY id DESC')
    res.json(students.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching students' })
  }
}
