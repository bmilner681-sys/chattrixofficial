import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Database } from 'sqlite3';
import { getDatabase } from '../database/init.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Register
router.post(
  '/register',
  body('username').isLength({ min: 3 }).trim().escape(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, email, password } = req.body;
    const db = getDatabase();

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = `user_${Date.now()}`;

      db.run(
        'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)',
        [userId, username, email, hashedPassword],
        (err) => {
          if (err) {
            res.status(400).json({ error: 'User already exists' });
            return;
          }

          const token = jwt.sign({ userId, username }, JWT_SECRET, {
            expiresIn: '7d',
          });

          res.status(201).json({ token, userId, username });
        }
      );
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// Login
router.post(
  '/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;
    const db = getDatabase();

    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, user: any) => {
        if (err || !user) {
          res.status(401).json({ error: 'Invalid credentials' });
          return;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          res.status(401).json({ error: 'Invalid credentials' });
          return;
        }

        const token = jwt.sign(
          { userId: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.json({ token, userId: user.id, username: user.username });
      }
    );
  }
);

// Verify token
router.get('/verify', (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    res.json({ valid: true, userId: decoded.userId, username: decoded.username });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
