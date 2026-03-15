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

// Public / Shared (Students, Companies, and Admins can view all jobs)
router.get('/', authenticateToken, getAllJobs)
router.post('/apply', authenticateToken, requireRole('STUDENT'), applyForJob)

// Company Only
router.post('/', authenticateToken, requireRole('COMPANY'), createJob)
router.put('/status', authenticateToken, requireRole('COMPANY'), updateStatus)
router.get('/profile', authenticateToken, requireRole('COMPANY'), getProfile)
router.put('/profile', authenticateToken, requireRole('COMPANY'), updateProfile)

// --- UPDATED: Allow both COMPANY and ADMIN to view applicants ---
router.get(
  '/:jobId/applicants',
  authenticateToken,
  (req: any, res: any, next: any) => {
    // Check if the user is either a Company or an Admin
    if (req.user?.role === 'COMPANY' || req.user?.role === 'ADMIN') {
      return next()
    }
    return res.status(403).json({
      message: 'Access denied. Requires Company or Admin clearance.',
    })
  },
  getJobApplicants,
)

export default router
