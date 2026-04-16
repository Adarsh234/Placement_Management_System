import { Router } from 'express'
import {
  updateProfile,
  getProfile,
  verifyStudent,
  getAllStudents,
} from '../controllers/StudentController'
// Import the new controller function we just made
import { getStudentApplications } from '../controllers/applicationController'
import { authenticateToken, requireRole } from '../middleware/authMiddleware'

const router = Router()

// Only logged-in STUDENTS can access these routes
router.get('/profile', authenticateToken, requireRole('STUDENT'), getProfile)
router.put('/profile', authenticateToken, requireRole('STUDENT'), updateProfile)

// NEW: Route to get a list of jobs the student has applied for
router.get(
  '/applications',
  authenticateToken,
  requireRole('STUDENT'),
  getStudentApplications,
)

// Admin Routes
router.get('/all', authenticateToken, requireRole('ADMIN'), getAllStudents)
router.put(
  '/verify/:studentId',
  authenticateToken,
  requireRole('ADMIN'),
  verifyStudent,
)

export default router
