import express from 'express';
import razorpay from '../lib/stripe.js';
import { requireAuth } from '../middleware/clerk.js';

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  try {
    const clerkUserId = req.user.clerkUserId;
    const { email, plan, amount } = req.body;

    let finalAmount;
    if (amount) {
      finalAmount = parseInt(amount);
    } else {
      const planPrices = {
        'starter': parseInt(process.env.STARTER_PLAN_PRICE || '157700'),
        'professional': parseInt(process.env.PROFESSIONAL_PLAN_PRICE || '323700'),
        'enterprise': parseInt(process.env.ENTERPRISE_PLAN_PRICE || '655700')
      };
      finalAmount = planPrices[plan] || parseInt(process.env.PRO_PLAN_PRICE || '323700');
    }

    const timestamp = Date.now();
    const shortReceipt = `rcpt_${timestamp}`;

    const order = await razorpay.orders.create({
      amount: finalAmount,
      currency: 'INR',
      receipt: shortReceipt,
      notes: {
        clerkUserId: clerkUserId,
        email: email || '',
        plan: plan || 'professional'
      }
    });

    res.json({ 
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Checkout error:', error.message);
    res.status(500).json({ error: 'Failed to create order: ' + error.message });
  }
});

export default router;
