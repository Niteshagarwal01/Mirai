import express from 'express';
import prisma from '../lib/prisma.js';
import crypto from 'crypto';

const router = express.Router();

// Simple hash function (use bcrypt in production)
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

/**
 * POST /api/auth/signup
 * Register new user
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user with simple clerk-like ID
    const clerkUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const hashedPassword = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        clerkUserId,
        email,
        plan: 'free',
        // Store name and password in metadata or separate table if needed
      }
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // In production, verify password hash
    // For now, simple token generation
    const token = `token_${user.clerkUserId}_${Date.now()}`;

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        clerkUserId: user.clerkUserId,
        email: user.email,
        plan: user.plan,
        name: email.split('@')[0]
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
