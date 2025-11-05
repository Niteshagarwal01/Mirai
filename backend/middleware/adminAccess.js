const ADMIN_EMAILS = [
  'techniteshgamer@gmail.com',
  'hackathonwinner001@gmail.com',
  'judge@mirai.com',
  'demo@mirai.com'
];

export const hasAdminAccess = (email) => {
  return ADMIN_EMAILS.includes(email?.toLowerCase());
};

export const getEffectivePlan = (email, dbPlan) => {
  if (hasAdminAccess(email)) {
    return 'pro';
  }
  return dbPlan || 'free';
};

export const requirePremium = async (req, res, next) => {
  try {
    const user = req.user || req.auth;
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (hasAdminAccess(user.email)) {
      req.isPremium = true;
      req.isAdmin = true;
      return next();
    }

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
