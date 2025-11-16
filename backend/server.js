import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import razorpay from './lib/stripe.js';
import checkoutRouter from './routes/checkout.js';
import webhooksRouter from './routes/webhooks.js';
import userRouter from './routes/user.js';
import chatbotsRouter from './routes/chatbots.js';
import voiceAgentsRouter from './routes/voiceAgents.js';
import emailAutomationRouter from './routes/emailAutomation.js';
import emailSetupRouter from './routes/emailSetup.js';
import contentGeneratorRouter from './routes/contentGenerator.js';
import photoshootRouter from './routes/photoshoot.js';
import contentRouter from './routes/content.js';

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
    'https://mirai-mauve.vercel.app',
    'https://mirai-git-main-niteshagarwal01s-projects.vercel.app',
    'https://mirai-backend.onrender.com',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

// Chatbase health check
app.get('/api/health/chatbase', (req, res) => {
  const chatbaseKey = process.env.CHATBASE_API_KEY;
  
  if (chatbaseKey) {
    res.json({ 
      status: 'ok', 
      message: 'Chatbase configured',
      key: chatbaseKey.substring(0, 15) + '...'
    });
  } else {
    res.status(500).json({ 
      status: 'error', 
      message: 'Chatbase API key missing',
      hint: 'Add CHATBASE_API_KEY to .env'
    });
  }
});

// Vapi health check
app.get('/api/health/vapi', (req, res) => {
  const vapiKey = process.env.VAPI_API_KEY;
  
  if (vapiKey) {
    res.json({ 
      status: 'ok', 
      message: 'Vapi configured',
      key: vapiKey.substring(0, 15) + '...'
    });
  } else {
    res.status(500).json({ 
      status: 'error', 
      message: 'Vapi API key missing',
      hint: 'Add VAPI_API_KEY to .env'
    });
  }
});

// Email Automation health check
app.get('/api/health/email-automation', async (req, res) => {
  try {
    const { dirname } = await import('path');
    const { fileURLToPath } = await import('url');
    const { existsSync } = await import('fs');
    
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const { join } = await import('path');
    const pythonServicePath = join(__dirname, 'langgraph-email-automation-main');
    
    const checks = {
      pythonFolder: existsSync(pythonServicePath),
      mainPy: existsSync(join(pythonServicePath, 'main.py')),
      requirements: existsSync(join(pythonServicePath, 'requirements.txt')),
      srcFolder: existsSync(join(pythonServicePath, 'src')),
      dataFolder: existsSync(join(pythonServicePath, 'data')),
      envFile: existsSync(join(pythonServicePath, '.env'))
    };
    
    const allChecks = Object.values(checks).every(v => v === true);
    
    if (allChecks) {
      res.json({
        status: 'ok',
        message: 'Email automation service is properly configured',
        checks
      });
    } else {
      res.status(500).json({
        status: 'warning',
        message: 'Email automation service needs setup',
        checks,
        hint: 'See backend/EMAIL_AUTOMATION_SETUP.md for setup instructions'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error checking email automation service',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/checkout', checkoutRouter);
app.use('/api/webhooks', webhooksRouter);
app.use('/api/payment', webhooksRouter); // verify route
app.use('/api/user', userRouter);
app.use('/api/chatbots', chatbotsRouter);
app.use('/api/voice-agents', voiceAgentsRouter);
app.use('/api/email-automation', emailAutomationRouter);
app.use('/api/email-setup', emailSetupRouter);
app.use('/api', contentGeneratorRouter); // Content generation endpoint (legacy)
app.use('/api/content', contentRouter); // New content creation API (all 9 types)
app.use('/api/photoshoot', photoshootRouter); // AI photoshoot generation

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Serve static files in production environment (for deployment on the same server)
if (process.env.NODE_ENV === 'production' && process.env.SERVE_FRONTEND === 'true') {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const staticPath = join(__dirname, '../dist');
  
  app.use(express.static(staticPath));
  
  // For all requests that don't match an API route or static file, send the index.html
  app.get('*', (req, res) => {
    res.sendFile(join(staticPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 Auth: Clerk (Authentication)`);
  console.log(`💳 Payment: Razorpay (Payment Gateway)`);
  console.log(`🗄️ Database: MongoDB Atlas`);
  console.log(`\n✅ Backend is ready - Authentication & Payment services active`);
});

// Export for Vercel serverless
export default app;
