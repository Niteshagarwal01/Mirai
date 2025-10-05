import express from 'express';
import razorpay from '../lib/stripe.js';
import { requireAuth } from '../middleware/clerk.js';

const router = express.Router();

/**
 * POST /api/checkout
 * Creates a Razorpay order for upgrading to Pro
 * Requires Clerk authentication
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const clerkUserId = req.user.clerkUserId; // From Clerk middleware
    const { email, plan, amount } = req.body;

    console.log('📦 Checkout request received:');
    console.log('  User ID:', clerkUserId);
    console.log('  Email:', email);
    console.log('  Plan:', plan);
    console.log('  Amount:', amount);

    // Validate and get correct amount based on plan
    let finalAmount;
    if (amount) {
      // If frontend sends amount, use it (in paise)
      finalAmount = parseInt(amount);
    } else {
      // Fallback: calculate from plan
      const planPrices = {
        'starter': parseInt(process.env.STARTER_PLAN_PRICE || '157700'),
        'professional': parseInt(process.env.PROFESSIONAL_PLAN_PRICE || '323700'),
        'enterprise': parseInt(process.env.ENTERPRISE_PLAN_PRICE || '655700')
      };
      finalAmount = planPrices[plan] || parseInt(process.env.PRO_PLAN_PRICE || '323700');
    }

    console.log(`💰 Creating Razorpay order - Plan: ${plan}, Amount: ₹${finalAmount/100}`);

    // Generate short receipt (max 40 chars for Razorpay)
    const timestamp = Date.now();
    const shortReceipt = `rcpt_${timestamp}`;

    // Create Razorpay Order
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

    console.log('✅ Razorpay order created successfully:', order.id);

    res.json({ 
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('❌ Checkout error:', error.message);
    console.error('Error details:', error);
    res.status(500).json({ error: 'Failed to create order: ' + error.message });
  }
});

export default router;
