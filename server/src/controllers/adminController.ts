import { Response } from 'express'
import { pool } from '../config/db'
import { AuthRequest } from '../middleware/authMiddleware'

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const [jobsCount, studentsCount, placementsCount, recentActivity] =
      await Promise.all([
        pool.query('SELECT COUNT(*) FROM jobs'),
        pool.query('SELECT COUNT(*) FROM students'),
        pool.query(
          "SELECT COUNT(*) FROM applications WHERE status = 'SELECTED'",
        ),

        // FIXED QUERY: Joins 'students' with 'users' to get the correct 'created_at'
        pool.query(`
        SELECT * FROM (
            (SELECT 'New Job Posted' as event, company_name as user_name, created_at, 'Success' as status 
             FROM jobs ORDER BY created_at DESC LIMIT 3)
            UNION ALL
            (SELECT 'New Student' as event, s.full_name as user_name, u.created_at, 'Verified' as status 
             FROM students s
             JOIN users u ON s.user_id = u.id
             ORDER BY u.created_at DESC LIMIT 3)
        ) AS activity_log
        ORDER BY created_at DESC
        LIMIT 5
      `),
      ])

    res.json({
      jobs: Number.parseInt(jobsCount.rows[0].count),
      students: Number.parseInt(studentsCount.rows[0].count),
      placements: Number.parseInt(placementsCount.rows[0].count),
      activity: recentActivity.rows,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error fetching admin stats' })
  }
}
