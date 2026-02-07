import { Router } from 'express'
import { getDashboardStats } from '../controllers/adminController'
import { authenticateToken, requireRole } from '../middleware/authMiddleware'

const router = Router()

// Protect this route: Only logged-in ADMINs can access it
router.get('/stats', authenticateToken, requireRole('ADMIN'), getDashboardStats)

export default router
