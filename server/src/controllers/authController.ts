import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../config/db'

export const register = async (req: Request, res: Response) => {
  const { email, password, role, fullName, companyName, website } = req.body

  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ])
    if (userCheck.rows.length > 0)
      return res.status(400).json({ message: 'User already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, role',
      [email, hashedPassword, role],
    )

    const userId = newUser.rows[0].id

    if (role === 'STUDENT') {
      await pool.query(
        'INSERT INTO students (user_id, full_name) VALUES ($1, $2)',
        [userId, fullName],
      )
    } else if (role === 'COMPANY') {
      // Create Company Profile
      await pool.query(
        'INSERT INTO companies (user_id, company_name, website) VALUES ($1, $2, $3)',
        [userId, companyName, website],
      )
    }

    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Login function remains the same as before
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ])
    if (user.rows.length === 0)
      return res.status(400).json({ message: 'User not found' })

    const validPass = await bcrypt.compare(password, user.rows[0].password_hash)
    if (!validPass) return res.status(400).json({ message: 'Invalid password' })

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' },
    )
    res.json({ token, role: user.rows[0].role })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}
