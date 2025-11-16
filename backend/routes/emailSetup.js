import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAuth } from '../middleware/clerkAuth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to store setup requests
const requestsFilePath = path.join(__dirname, '../data/setup-requests.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(__dirname, '../data');
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Setup request endpoint - stores requests in JSON file
router.post('/request', requireAuth, async (req, res) => {
  try {
    const { companyName, email, phone, industry, currentEmailVolume, requirements } = req.body;
    const userId = req.auth.userId;

    await ensureDataDirectory();

    // Create new request object
    const newRequest = {
      id: Date.now().toString(),
      userId,
      companyName,
      email,
      phone: phone || '',
      industry: industry || '',
      currentEmailVolume: currentEmailVolume || '',
      requirements: requirements || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Read existing requests
    let requests = [];
    try {
      const data = await fs.readFile(requestsFilePath, 'utf-8');
      requests = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, that's okay
    }

    // Add new request
    requests.push(newRequest);

    // Save updated requests
    await fs.writeFile(requestsFilePath, JSON.stringify(requests, null, 2));

    console.log('📧 New email automation setup request:', {
      company: companyName,
      email: email,
      phone: phone,
      industry: industry
    });

    res.json({
      success: true,
      message: 'Setup request submitted successfully! We will contact you soon.',
      requestId: newRequest.id
    });

  } catch (error) {
    console.error('Error saving setup request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit setup request'
    });
  }
});

// Get all setup requests (admin only)
router.get('/requests', requireAuth, async (req, res) => {
  try {
    await ensureDataDirectory();
    
    const data = await fs.readFile(requestsFilePath, 'utf-8');
    const requests = JSON.parse(data);
    
    res.json({
      success: true,
      requests: requests.reverse() // Most recent first
    });
  } catch (error) {
    res.json({
      success: true,
      requests: []
    });
  }
});

export default router;
