import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import razorpay from './lib/stripe.js';
import checkoutRouter from './routes/checkout.js';
import webhooksRouter from './routes/webhooks.js';
import botsRouter from './routes/bots.js';
import userRouter from './routes/user.js';
import aiRouter from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'https://mirai-ejxu.vercel.app',
    'https://mirai-git-main-niteshagarwal01s-projects.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

// JSON body parser
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Mirai Backend with Clerk Auth + Razorpay',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database health check
app.get('/api/health/database', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      message: 'Database connected',
      database: 'PostgreSQL'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Razorpay health check
app.get('/api/health/razorpay', (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keySecret) {
    res.json({ 
      status: 'ok', 
      message: 'Razorpay configured',
      keyId: keyId.substring(0, 15) + '...',
      mode: keyId.startsWith('rzp_test_') ? 'test' : 'live'
    });
  } else {
    res.status(500).json({ 
      status: 'error', 
      message: 'Razorpay keys missing',
      hint: 'Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env'
    });
  }
});

// Clerk health check
app.get('/api/health/clerk', (req, res) => {
  const clerkSecret = process.env.CLERK_SECRET_KEY;
  
  if (clerkSecret) {
    res.json({ 
      status: 'ok', 
      message: 'Clerk configured',
      key: clerkSecret.substring(0, 15) + '...',
      mode: clerkSecret.startsWith('sk_test_') ? 'test' : 'live'
    });
  } else {
    res.status(500).json({ 
      status: 'error', 
      message: 'Clerk secret key missing',
      hint: 'Add CLERK_SECRET_KEY to .env'
    });
  }
});

// API Routes
app.use('/api/checkout', checkoutRouter);
app.use('/api/webhooks', webhooksRouter);
app.use('/api/payment', webhooksRouter); // verify route
app.use('/api/bots', botsRouter);
app.use('/api/user', userRouter);
app.use('/api/ai', aiRouter); // AI Content Generation routes

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔐 Auth: Clerk | 💳 Payment: Razorpay | 🗄️ Database: Supabase`);
});

// Export for Vercel serverless
export default app;
