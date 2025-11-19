import express from 'express';
import prisma from '../lib/prisma.js';
import { requireAuth } from '../middleware/clerk.js';
import { getEffectivePlan, hasAdminAccess } from '../middleware/adminAccess.js';

const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
  try {
    const { clerkUserId, email } = req.user;

    let user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId,
          email,
          plan: 'free',
        },
      });
    }

    const effectivePlan = getEffectivePlan(user.email, user.plan);
    const isAdmin = hasAdminAccess(user.email);

    res.json({
      id: user.id,
      clerkUserId: user.clerkUserId,
      email: user.email,
      plan: effectivePlan,
      isAdmin: isAdmin,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.get('/plan', requireAuth, async (req, res) => {
  try {
    const { clerkUserId, email } = req.user;

    // Check if database is available
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('your_username')) {
      // Return default plan when database is not configured
      console.warn('⚠️ Database not configured - using default plan');
      return res.json({
        plan: 'free',
        isAdmin: hasAdminAccess(email),
      });
    }

    let user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: {
        plan: true,
        email: true,
      },
    });

    if (!user && email) {
      user = await prisma.user.create({
        data: {
          clerkUserId,
          email,
          plan: 'free',
        },
        select: {
          plan: true,
          email: true,
        },
      });
    }

    const effectivePlan = getEffectivePlan(user?.email, user?.plan);
    const isAdmin = hasAdminAccess(user?.email);

    res.json({
      plan: effectivePlan,
      isAdmin: isAdmin,
    });
  } catch (error) {
    console.error('⚠️ Database error - using default plan:', error.message);
    // Return default plan on database error
    res.json({
      plan: 'free',
      isAdmin: hasAdminAccess(req.user?.email),
    });
  }
});

export default router;
