import express from 'express';
import crypto from 'crypto';
import razorpay from '../lib/stripe.js';
import prisma from '../lib/prisma.js';

const router = express.Router();

router.post('/razorpay', express.json(), async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSignature) {
    console.error('Invalid webhook signature');
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const event = req.body.event;
  const payload = req.body.payload;

  try {
    if (event === 'payment.captured') {
      const payment = payload.payment.entity;
      const orderId = payment.order_id;

      const order = await razorpay.orders.fetch(orderId);
      const { clerkUserId, email } = order.notes;

      if (clerkUserId) {
        await prisma.user.upsert({
          where: { clerkUserId },
          update: { plan: 'pro' },
          create: {
            clerkUserId,
            email,
            plan: 'pro',
          },
        });
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

router.post('/verify', express.json(), async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      clerkUserId,
      email,
    } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      await prisma.user.upsert({
        where: { clerkUserId },
        update: { plan: 'pro' },
        create: {
          clerkUserId,
          email,
          plan: 'pro',
        },
      });

      res.json({ success: true, message: 'Payment verified, upgraded to Pro!' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

export default router;
