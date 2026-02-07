import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: { id: number; role: string }
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('Authorization')?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Access Denied' })

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string)
    req.user = verified as any
    next()
  } catch (err) {
    res.status(403).json({ message: 'Invalid Token' })
  }
}

export const requireRole = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: 'Access Forbidden' })
    }
    next()
  }
}
