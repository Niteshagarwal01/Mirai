import { clerkClient } from '@clerk/clerk-sdk-node';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7);

    if (!token || token.split('.').length !== 3) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const sessionClaims = await clerkClient.verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY
    });

    if (!sessionClaims || !sessionClaims.sub) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const clerkUser = await clerkClient.users.getUser(sessionClaims.sub);

    req.user = {
      clerkUserId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.message?.includes('Invalid JWT form') || error.reason === 'token-invalid') {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

export default requireAuth;
