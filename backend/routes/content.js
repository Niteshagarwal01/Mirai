import express from 'express';
import { requireAuth } from '../middleware/clerk.js';
import prisma from '../lib/prisma.js';

const router = express.Router();

/**
 * GET /api/content/types
 * Get available content types
 */
router.get('/types', async (req, res) => {
  try {
    const contentTypes = [
      {
        id: 'instagram-post',
        name: 'Instagram Post',
        description: 'Create engaging captions and visuals optimized for Instagram\'s audience',
        category: 'Social Media',
        icon: '📸'
      },
      {
        id: 'linkedin-post',
        name: 'LinkedIn Post',
        description: 'Professional content that drives engagement and showcases expertise',
        category: 'Professional',
        icon: '💼'
      },
      {
        id: 'twitter-post',
        name: 'Twitter Post',
        description: 'Concise, engaging tweets that spark conversation and sharing',
        category: 'Social Media',
        icon: '🐦'
      },
      {
        id: 'blog-post',
        name: 'Blog Post',
        description: 'In-depth content that educates your audience and builds authority',
        category: 'Content Creation',
        icon: '📝'
      },
      {
        id: 'email-campaign',
        name: 'Email Campaign',
        description: 'Draft professional email marketing campaigns',
        category: 'Marketing',
        icon: '✉️'
      },
      {
        id: 'product-description',
        name: 'Product Description',
        description: 'Generate compelling product descriptions for e-commerce',
        category: 'E-commerce',
        icon: '🛍️'
      }
    ];

    res.json({ contentTypes });
  } catch (error) {
    console.error('Get content types error:', error);
    res.status(500).json({ error: 'Failed to load content types' });
  }
});

/**
 * GET /api/content/history
 * Get user's content generation history
 */
router.get('/history', requireAuth, async (req, res) => {
  try {
    const { clerkUserId } = req.user;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId }
    });

    if (!user) {
      return res.json({ history: [] });
    }

    // TODO: Implement content history table in Prisma schema
    // For now, return empty array
    const history = [];

    res.json({ history });
  } catch (error) {
    console.error('Get content history error:', error);
    res.status(500).json({ error: 'Failed to load history' });
  }
});

export default router;
