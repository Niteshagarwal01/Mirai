// Vercel serverless function entry point
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import aiRouter from '../routes/ai';
import userRouter from '../routes/user';
import checkoutRouter from '../routes/checkout';
import webhooksRouter from '../routes/webhooks';
import botsRouter from '../routes/bots';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://mirai-ejxu.vercel.app',
    'https://mirai-git-main-niteshagarwal01s-projects.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

// JSON body parser
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Mirai Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/webhooks', webhooksRouter);
app.use('/api/payment', webhooksRouter);
app.use('/api/bots', botsRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Default handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

export default app;