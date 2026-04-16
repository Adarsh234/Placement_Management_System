import { Response } from 'express'
import { pool } from '../config/db'
import { AuthRequest } from '../middleware/authMiddleware'

// 1. Get Student Profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id
  try {
    const student = await pool.query(
      'SELECT * FROM students WHERE user_id = $1',
      [userId],
    )
    if (student.rows.length === 0)
      return res.status(404).json({ message: 'Student not found' })

    // Return the profile data (Since it's SELECT *, the new fields will be included automatically)
    res.json(student.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error fetching profile' })
  }
}

// 2. Update Profile (Now includes course, semester, and backlogs)
export const updateProfile = async (req: AuthRequest, res: Response) => {
  // Destructure the new fields from the request body
  const { resumeUrl, rollNumber, cgpa, skills, course, semester, backlogs } =
    req.body
  const userId = req.user?.id

  try {
    // Update the SQL query to include the new columns
    await pool.query(
      `UPDATE students 
       SET resume_url = $1, 
           roll_number = $2, 
           cgpa = $3, 
           skills = $4, 
           course = $5, 
           semester = $6, 
           backlogs = $7
       WHERE user_id = $8`,
      [resumeUrl, rollNumber, cgpa, skills, course, semester, backlogs, userId],
    )
    res.json({ message: 'Profile updated successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error updating profile' })
  }
}

// 3. Verify Student
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
