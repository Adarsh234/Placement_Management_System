import { Router } from 'express'
import {
  updateProfile,
  getProfile,
  verifyStudent,
  getAllStudents,
} from '../controllers/StudentController'
import { authenticateToken, requireRole } from '../middleware/authMiddleware'

const router = Router()

// Only logged-in STUDENTS can access these routes
router.get('/profile', authenticateToken, requireRole('STUDENT'), getProfile)
router.put('/profile', authenticateToken, requireRole('STUDENT'), updateProfile)

// Admin Routes
router.get('/all', authenticateToken, requireRole('ADMIN'), getAllStudents)
router.put(
  '/verify/:studentId',
  authenticateToken,
  requireRole('ADMIN'),
  verifyStudent,
)
export default router
