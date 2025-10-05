import express from 'express';
import prisma from '../lib/prisma.js';
import { requireAuth } from '../middleware/clerk.js';
import { getEffectivePlan, hasAdminAccess } from '../middleware/adminAccess.js';

const router = express.Router();

/**
 * GET /api/user/me
 * Get current user profile and plan
 */
router.get('/me', requireAuth, async (req, res) => {
  try {
    const { clerkUserId, email } = req.user;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { clerkUserId },
      include: {
        bots: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      // Auto-create user on first request
      user = await prisma.user.create({
        data: {
          clerkUserId,
          email,
          plan: 'free',
        },
        include: {
          bots: true,
        },
      });
    }

    // Get effective plan (admin accounts get pro access)
    const effectivePlan = getEffectivePlan(user.email, user.plan);
    const isAdmin = hasAdminAccess(user.email);

    res.json({
      id: user.id,
      clerkUserId: user.clerkUserId,
      email: user.email,
      plan: effectivePlan,
      isAdmin: isAdmin,
      createdAt: user.createdAt,
      botsCount: user.bots.length,
      bots: user.bots,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * GET /api/user/plan
 * Get user's current plan status
 */
router.get('/plan', requireAuth, async (req, res) => {
  try {
    const { clerkUserId, email } = req.user;
    console.log('📋 Fetching plan for clerkUserId:', clerkUserId);
    console.log('📧 User email from Clerk:', email);

    // Find or create user with email
    let user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: {
        plan: true,
        email: true,
        _count: {
          select: { bots: true },
        },
      },
    });

    // Auto-create user if doesn't exist
    if (!user && email) {
      console.log('👤 User not found, creating new user...');
      user = await prisma.user.create({
        data: {
          clerkUserId,
          email,
          plan: 'free',
        },
        select: {
          plan: true,
          email: true,
          _count: {
            select: { bots: true },
          },
        },
      });
      console.log('✅ User created:', user);
    }

    console.log('👤 User found:', user);

    // Get effective plan (admin accounts get pro access)
    const effectivePlan = getEffectivePlan(user?.email, user?.plan);
    const isAdmin = hasAdminAccess(user?.email);
    
    console.log('🔍 Email:', user?.email);
    console.log('🎯 Effective plan:', effectivePlan);
    console.log('👑 Is admin:', isAdmin);
    
    const botsCount = user?._count.bots || 0;
    const limit = effectivePlan === 'pro' ? 'unlimited' : parseInt(process.env.FREE_BOT_LIMIT || '3');

    const response = {
      plan: effectivePlan,
      isAdmin: isAdmin,
      botsCount,
      limit,
      canCreateMore: effectivePlan === 'pro' || botsCount < limit,
    };

    console.log('📤 Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

export default router;
