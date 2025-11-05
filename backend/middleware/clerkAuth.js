import { clerkClient } from '@clerk/clerk-sdk-node';
import { verifyToken } from '@clerk/backend';

/**
 * Clerk Authentication Middleware (Modern - Networkless Verification)
 * Validates JWT session token from Clerk and attaches user info to req.auth
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const token = authHeader.substring(7);
    
    try {
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY
      });
      
      if (!payload || !payload.sub) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
      }

      req.auth = {
        userId: payload.sub,
        sessionId: payload.sid
      };

      next();
    } catch (verifyError) {
      return res.status(401).json({ error: 'Unauthorized - Token verification failed: ' + verifyError.message });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal server error - Authentication error' });
  }
};

/**
 * Optional Auth Middleware
 * Tries to validate token but doesn't fail if missing
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const payload = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY
        });
        
        if (payload && payload.sub) {
          req.auth = {
            userId: payload.sub,
            sessionId: payload.sid
          };
        }
      } catch (error) {
        // Silent fail
      }
    }
  } catch (error) {
    // Silent fail
  }
  
  next();
};
