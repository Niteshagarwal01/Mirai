/**
 * Admin Access Middleware
 * Grants premium access to prototype/admin accounts
 */

// List of admin emails with full access during prototype phase
const ADMIN_EMAILS = [
  'techniteshgamer@gmail.com',     // Main admin (Google login)
  'hackathonwinner001@gmail.com',  // Judge/Demo account (email/password)
  'judge@mirai.com',               // Judge account (email/password)
  'demo@mirai.com'                 // Demo account (email/password)
];

/**
 * Check if user has admin/premium access
 * @param {string} email - User's email
 * @returns {boolean}
 */
export const hasAdminAccess = (email) => {
  return ADMIN_EMAILS.includes(email?.toLowerCase());
};

/**
 * Get effective plan for user (considering admin access)
 * @param {string} email - User's email
 * @param {string} dbPlan - Plan from database
 * @returns {string} - Effective plan ('pro' for admins, otherwise dbPlan)
 */
export const getEffectivePlan = (email, dbPlan) => {
  if (hasAdminAccess(email)) {
    return 'pro'; // Admins always have pro access
  }
  return dbPlan || 'free';
};

/**
 * Middleware to check if user has premium access (either pro plan or admin)
 */
export const requirePremium = async (req, res, next) => {
  try {
    const user = req.user || req.auth;
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if admin
    if (hasAdminAccess(user.email)) {
      req.isPremium = true;
      req.isAdmin = true;
      return next();
    }

    // Check if has pro plan
    const { default: prisma } = await import('../lib/prisma.js');
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: user.clerkUserId || user.userId },
      select: { plan: true }
    });

    if (dbUser?.plan === 'pro') {
      req.isPremium = true;
      req.isAdmin = false;
      return next();
    }

    return res.status(403).json({ 
      error: 'Premium subscription required',
      message: 'This feature requires a Pro plan subscription'
    });
  } catch (error) {
    console.error('Premium check error:', error);
    return res.status(500).json({ error: 'Failed to verify premium access' });
  }
};
