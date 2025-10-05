import { clerkClient } from '@clerk/clerk-sdk-node';

/**
 * Middleware to verify Clerk session tokens
 * Attaches user info to req.user
 */
export async function requireAuth(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Check if token has proper JWT format (3 parts separated by dots)
    if (!token || token.split('.').length !== 3) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Verify the session token with Clerk
    const sessionClaims = await clerkClient.verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY
    });

    if (!sessionClaims || !sessionClaims.sub) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get full user details from Clerk
    const clerkUser = await clerkClient.users.getUser(sessionClaims.sub);

    // Attach user info to request
    req.user = {
      clerkUserId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // Handle specific JWT errors
    if (error.message?.includes('Invalid JWT form') || error.reason === 'token-invalid') {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

export default requireAuth;
