import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from '../routes/user.js';
import checkoutRouter from '../routes/checkout.js';
import webhooksRouter from '../routes/webhooks.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://mirai-ejxu.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Mirai Backend - Auth & Payment',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/user', userRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/webhooks', webhooksRouter);
app.use('/api/payment', webhooksRouter);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

export default app;