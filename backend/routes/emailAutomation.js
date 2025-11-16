import express from 'express';
import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import multer from 'multer';
import xlsx from 'xlsx';

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Path to Python service
const PYTHON_SERVICE_PATH = join(__dirname, '../../langgraph-email-automation-main');

// Store active campaigns and brand configs
const activeCampaigns = new Map();
const brandConfigs = new Map();
const campaignHistory = new Map();

// Configure multer for Excel file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel' ||
        file.originalname.endsWith('.xlsx') ||
        file.originalname.endsWith('.xls')) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'));
    }
  }
});

/**
 * ========================================
 * BRAND CONFIGURATION (One-time setup)
 * ========================================
 */

/**
 * Save brand configuration
 * POST /api/email-automation/brand/setup
 */
router.post('/brand/setup', async (req, res) => {
  try {
    const {
      userId,
      brandName,
      brandDescription,
      industry,
      website,
      emailSignature,
      gmailCredentials, // { email, appPassword }
      defaultTemplate
    } = req.body;

    if (!userId || !brandName || !gmailCredentials) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['userId', 'brandName', 'gmailCredentials']
      });
    }

    // Store brand config
    const brandConfig = {
      userId,
      brandName,
      brandDescription: brandDescription || '',
      industry: industry || 'General',
      website: website || '',
      emailSignature: emailSignature || `Best regards,\n${brandName} Team`,
      gmailCredentials: {
        email: gmailCredentials.email,
        appPassword: gmailCredentials.appPassword // Gmail App Password
      },
      defaultTemplate: defaultTemplate || {
        subject: 'Hello from {brandName}',
        body: 'Hi {name},\n\n{message}\n\n{signature}'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    brandConfigs.set(userId, brandConfig);

    // Save to agency.txt for LangGraph
    const agencyFilePath = join(PYTHON_SERVICE_PATH, 'data', 'agency.txt');
    const agencyData = `
Company Name: ${brandName}
Industry: ${industry}
Website: ${website}
Description: ${brandDescription}

Email Contact: ${gmailCredentials.email}
    `.trim();

    await fs.mkdir(join(PYTHON_SERVICE_PATH, 'data'), { recursive: true });
    await fs.writeFile(agencyFilePath, agencyData);

    res.json({
      success: true,
      message: 'Brand configuration saved',
      brandConfig: {
        ...brandConfig,
        gmailCredentials: { email: gmailCredentials.email } // Hide app password
      }
    });

  } catch (error) {
    console.error('Error saving brand config:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get brand configuration
 * GET /api/email-automation/brand/:userId
 */
router.get('/brand/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const brandConfig = brandConfigs.get(userId);

    if (!brandConfig) {
      return res.status(404).json({
        error: 'Brand configuration not found',
        hint: 'Please complete brand setup first'
      });
    }

    res.json({
      success: true,
      brandConfig: {
        ...brandConfig,
        gmailCredentials: { email: brandConfig.gmailCredentials.email } // Hide app password
      }
    });

  } catch (error) {
    console.error('Error getting brand config:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ========================================
 * CAMPAIGN MANAGEMENT
 * ========================================
 */

/**
 * Create new email campaign
 * POST /api/email-automation/campaign/create
 */
router.post('/campaign/create', upload.single('contactList'), async (req, res) => {
  try {
    const { userId, campaignName, emailSubject, emailBody, sendDelay } = req.body;
    const contactFile = req.file;

    if (!userId || !campaignName || !emailSubject || !emailBody) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['userId', 'campaignName', 'emailSubject', 'emailBody', 'contactList (Excel file)']
      });
    }

    // Check if brand config exists
    const brandConfig = brandConfigs.get(userId);
    if (!brandConfig) {
      return res.status(400).json({
        error: 'Brand not configured',
        hint: 'Please complete brand setup first at /api/email-automation/brand/setup'
      });
    }

    // Parse Excel file
    let contacts = [];
    if (contactFile) {
      try {
        const workbook = xlsx.read(contactFile.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Extract email and name from Excel
        contacts = data.map((row, index) => ({
          id: index + 1,
          email: row.Email || row.email || row.EMAIL,
          name: row.Name || row.name || row.NAME || row.email?.split('@')[0],
          company: row.Company || row.company || '',
          status: 'pending'
        })).filter(c => c.email); // Filter out rows without email

      } catch (parseError) {
        return res.status(400).json({
          error: 'Failed to parse Excel file',
          details: parseError.message,
          hint: 'Ensure Excel has columns: Email, Name (optional), Company (optional)'
        });
      }
    }

    if (contacts.length === 0) {
      return res.status(400).json({
        error: 'No valid contacts found in Excel file',
        hint: 'Excel file must have an "Email" column with valid email addresses'
      });
    }

    // Create campaign
    const campaignId = `campaign_${userId}_${Date.now()}`;
    const campaign = {
      id: campaignId,
      userId,
      name: campaignName,
      subject: emailSubject,
      body: emailBody,
      contacts,
      totalContacts: contacts.length,
      sent: 0,
      failed: 0,
      pending: contacts.length,
      sendDelay: parseInt(sendDelay) || 5, // seconds between emails
      status: 'draft', // draft, running, paused, completed
      createdAt: new Date(),
      updatedAt: new Date(),
      logs: []
    };

    activeCampaigns.set(campaignId, campaign);

    // Save contacts to Excel for Python script
    const contactsFilePath = join(PYTHON_SERVICE_PATH, `contacts_${campaignId}.xlsx`);
    const ws = xlsx.utils.json_to_sheet(contacts);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Contacts');
    await fs.writeFile(contactsFilePath, xlsx.write(wb, { type: 'buffer' }));

    res.json({
      success: true,
      message: 'Campaign created successfully',
      campaign: {
        id: campaignId,
        name: campaignName,
        totalContacts: contacts.length,
        status: 'draft'
      }
    });

  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all campaigns for a user
 * GET /api/email-automation/campaigns/:userId
 */
router.get('/campaigns/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    const userCampaigns = Array.from(activeCampaigns.values())
      .filter(c => c.userId === userId)
      .map(c => ({
        id: c.id,
        name: c.name,
        status: c.status,
        totalContacts: c.totalContacts,
        sent: c.sent,
        failed: c.failed,
        pending: c.pending,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt
      }));

    res.json({
      success: true,
      campaigns: userCampaigns,
      total: userCampaigns.length
    });

  } catch (error) {
    console.error('Error getting campaigns:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get campaign details
 * GET /api/email-automation/campaign/:campaignId
 */
router.get('/campaign/:campaignId', (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = activeCampaigns.get(campaignId);

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({
      success: true,
      campaign
    });

  } catch (error) {
    console.error('Error getting campaign:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Execute email campaign
 * POST /api/email-automation/campaign/execute
 */
router.post('/campaign/execute', async (req, res) => {
  try {
    const { campaignId } = req.body;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const campaign = activeCampaigns.get(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    if (campaign.status === 'running') {
      return res.status(400).json({ error: 'Campaign is already running' });
    }

    const brandConfig = brandConfigs.get(campaign.userId);
    if (!brandConfig) {
      return res.status(400).json({ error: 'Brand configuration not found' });
    }

    // Update campaign status
    campaign.status = 'running';
    campaign.startedAt = new Date();
    
    // Start sending emails
    executeCampaign(campaign, brandConfig);

    res.json({
      success: true,
      message: 'Campaign execution started',
      campaignId,
      totalContacts: campaign.totalContacts
    });

  } catch (error) {
    console.error('Error executing campaign:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Pause campaign
 * POST /api/email-automation/campaign/pause
 */
router.post('/campaign/pause', (req, res) => {
  try {
    const { campaignId } = req.body;
    const campaign = activeCampaigns.get(campaignId);

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    campaign.status = 'paused';
    campaign.updatedAt = new Date();

    res.json({
      success: true,
      message: 'Campaign paused',
      campaignId
    });

  } catch (error) {
    console.error('Error pausing campaign:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete campaign
 * DELETE /api/email-automation/campaign/:campaignId
 */
router.delete('/campaign/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = activeCampaigns.get(campaignId);

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Delete contacts file
    const contactsFilePath = join(PYTHON_SERVICE_PATH, `contacts_${campaignId}.xlsx`);
    try {
      await fs.unlink(contactsFilePath);
    } catch (e) {
      console.log('Contacts file already deleted or not found');
    }

    activeCampaigns.delete(campaignId);

    res.json({
      success: true,
      message: 'Campaign deleted',
      campaignId
    });

  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ========================================
 * CAMPAIGN EXECUTION HELPER
 * ========================================
 */
async function executeCampaign(campaign, brandConfig) {
  console.log(`🚀 Starting campaign: ${campaign.name}`);
  
  for (const contact of campaign.contacts) {
    // Check if campaign is paused
    if (campaign.status === 'paused') {
      console.log('⏸️ Campaign paused');
      break;
    }

    if (contact.status !== 'pending') {
      continue;
    }

    try {
      // Personalize email
      const personalizedSubject = campaign.subject
        .replace(/{name}/g, contact.name)
        .replace(/{email}/g, contact.email)
        .replace(/{company}/g, contact.company)
        .replace(/{brandName}/g, brandConfig.brandName);

      const personalizedBody = campaign.body
        .replace(/{name}/g, contact.name)
        .replace(/{email}/g, contact.email)
        .replace(/{company}/g, contact.company)
        .replace(/{brandName}/g, brandConfig.brandName)
        + '\n\n' + brandConfig.emailSignature;

      // Simulate sending (In production, use nodemailer with Gmail SMTP)
      console.log(`📧 Sending to: ${contact.email}`);
      console.log(`Subject: ${personalizedSubject}`);
      
      // TODO: Implement actual email sending with nodemailer
      // For now, mark as sent after delay
      await new Promise(resolve => setTimeout(resolve, campaign.sendDelay * 1000));

      // Update contact status
      contact.status = 'sent';
      contact.sentAt = new Date();
      campaign.sent++;
      campaign.pending--;

      campaign.logs.push({
        type: 'success',
        contactId: contact.id,
        email: contact.email,
        message: 'Email sent successfully',
        timestamp: new Date()
      });

    } catch (error) {
      console.error(`❌ Failed to send to ${contact.email}:`, error);
      contact.status = 'failed';
      contact.error = error.message;
      campaign.failed++;
      campaign.pending--;

      campaign.logs.push({
        type: 'error',
        contactId: contact.id,
        email: contact.email,
        message: error.message,
        timestamp: new Date()
      });
    }

    campaign.updatedAt = new Date();
  }

  // Mark campaign as completed
  campaign.status = 'completed';
  campaign.completedAt = new Date();
  console.log(`✅ Campaign completed: ${campaign.name}`);
  console.log(`Sent: ${campaign.sent}, Failed: ${campaign.failed}`);
}

/**
 * Get campaign statistics
 * GET /api/email-automation/stats/:userId
 */
router.get('/stats/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    const userCampaigns = Array.from(activeCampaigns.values())
      .filter(c => c.userId === userId);

    const totalCampaigns = userCampaigns.length;
    const totalEmailsSent = userCampaigns.reduce((sum, c) => sum + c.sent, 0);
    const totalEmailsFailed = userCampaigns.reduce((sum, c) => sum + c.failed, 0);
    const activeCampaignsCount = userCampaigns.filter(c => c.status === 'running').length;

    res.json({
      success: true,
      stats: {
        totalCampaigns,
        activeCampaigns: activeCampaignsCount,
        totalEmailsSent,
        totalEmailsFailed,
        successRate: totalEmailsSent + totalEmailsFailed > 0 
          ? ((totalEmailsSent / (totalEmailsSent + totalEmailsFailed)) * 100).toFixed(1)
          : 0
      }
    });

  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Health check for email automation service
 * GET /api/email-automation/health
 */
router.get('/health', (req, res) => {
  try {
    res.json({
      status: 'ok',
      service: 'Email Campaign Manager',
      activeCampaigns: activeCampaigns.size,
      configuredBrands: brandConfigs.size,
      timestamp: new Date()
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

export default router;
