import { Router } from 'express'
import {
  createJob,
  getAllJobs,
  getProfile,
  updateProfile,
} from '../controllers/jobController'
import {
  applyForJob,
  getJobApplicants,
  updateStatus,
} from '../controllers/applicationController'
import { authenticateToken, requireRole } from '../middleware/authMiddleware'

const router = Router()

// Public / Student
router.get('/', authenticateToken, getAllJobs)
router.post('/apply', authenticateToken, requireRole('STUDENT'), applyForJob)

// Company / Admin
router.post('/', authenticateToken, requireRole('COMPANY'), createJob) // Changed to COMPANY
router.get(
  '/:jobId/applicants',
  authenticateToken,
  requireRole('COMPANY'),
  getJobApplicants,
)
router.put('/status', authenticateToken, requireRole('COMPANY'), updateStatus)

router.get('/profile', authenticateToken, requireRole('COMPANY'), getProfile)
router.put('/profile', authenticateToken, requireRole('COMPANY'), updateProfile)

export default router
