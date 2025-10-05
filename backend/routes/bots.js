import express from 'express';
import prisma from '../lib/prisma.js';
import { requireAuth } from '../middleware/clerk.js';

const router = express.Router();

const FREE_BOT_LIMIT = parseInt(process.env.FREE_BOT_LIMIT || '3');

/**
 * POST /api/bots/create
 * Create a new bot (with plan enforcement)
 */
router.post('/create', requireAuth, async (req, res) => {
  try {
    const { clerkUserId, email } = req.user;
    const { name, config } = req.body;

    if (!name || !config) {
      return res.status(400).json({ error: 'Name and config are required' });
    }

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { clerkUserId },
      include: { bots: true },
    });

    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          clerkUserId,
          email,
          plan: 'free',
        },
        include: { bots: true },
      });
    }

    // Plan enforcement: Check bot quota for free users
    if (user.plan === 'free' && user.bots.length >= FREE_BOT_LIMIT) {
      return res.status(402).json({
        error: 'Bot limit reached',
        message: `Free plan allows only ${FREE_BOT_LIMIT} bots. Upgrade to Pro for unlimited bots.`,
        currentBots: user.bots.length,
        limit: FREE_BOT_LIMIT,
      });
    }

    // Create the bot
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name,
        config,
      },
    });

    res.status(201).json({
      success: true,
      bot,
      botsRemaining: user.plan === 'pro' ? 'unlimited' : FREE_BOT_LIMIT - user.bots.length - 1,
    });
  } catch (error) {
    console.error('Create bot error:', error);
    res.status(500).json({ error: 'Failed to create bot' });
  }
});

/**
 * GET /api/bots
 * Get all bots for the authenticated user
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const { clerkUserId } = req.user;

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      include: { bots: true },
    });

    if (!user) {
      return res.json({ bots: [], plan: 'free' });
    }

    res.json({
      bots: user.bots,
      plan: user.plan,
      botsCount: user.bots.length,
      limit: user.plan === 'pro' ? 'unlimited' : FREE_BOT_LIMIT,
    });
  } catch (error) {
    console.error('Get bots error:', error);
    res.status(500).json({ error: 'Failed to fetch bots' });
  }
});

/**
 * DELETE /api/bots/:id
 * Delete a bot
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { clerkUserId } = req.user;
    const botId = parseInt(req.params.id);

    if (isNaN(botId)) {
      return res.status(400).json({ error: 'Invalid bot ID' });
    }

    // Verify ownership
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      include: { bots: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const bot = user.bots.find(b => b.id === botId);
    if (!bot) {
      return res.status(404).json({ error: 'Bot not found or does not belong to you' });
    }

    // Delete the bot
    await prisma.bot.delete({
      where: { id: botId },
    });

    res.json({ success: true, message: 'Bot deleted' });
  } catch (error) {
    console.error('Delete bot error:', error);
    res.status(500).json({ error: 'Failed to delete bot' });
  }
});

export default router;
