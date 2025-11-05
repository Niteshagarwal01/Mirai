import express from 'express';
import multer from 'multer';
import ChatbaseService from '../lib/chatbase.js';
import { requireAuth } from '../middleware/clerkAuth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept PDF, TXT, DOCX, CSV files
    const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/csv'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, TXT, DOCX, and CSV files are allowed.'), false);
    }
  }
});

// Create a new chatbot
router.post('/create', requireAuth, async (req, res) => {
  try {
    const { name, type, description, personality, language, welcomeMessage, fallbackMessage, integrations } = req.body;
    const userId = req.auth.userId;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        error: 'Name and description are required'
      });
    }

    const chatbotData = {
      name,
      type,
      description,
      personality,
      language,
      welcomeMessage,
      fallbackMessage,
      integrations,
      userId // Add user ID for tracking
    };

    const result = await ChatbaseService.createChatbot(chatbotData);
    
    if (result.success) {
      // TODO: Save chatbot info to database with user association
      res.json({
        success: true,
        message: 'Chatbot created successfully',
        chatbot: result.chatbot,
        chatbotId: result.chatbotId
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Create chatbot error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Upload knowledge base files
router.post('/:chatbotId/knowledge-base', requireAuth, upload.array('files', 10), async (req, res) => {
  try {
    const { chatbotId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    const result = await ChatbaseService.uploadKnowledgeBase(chatbotId, files);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Knowledge base uploaded successfully',
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Upload knowledge base error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get chatbot details
router.get('/:chatbotId', requireAuth, async (req, res) => {
  try {
    const { chatbotId } = req.params;
    
    const result = await ChatbaseService.getChatbot(chatbotId);
    
    if (result.success) {
      res.json({
        success: true,
        chatbot: result.chatbot
      });
    } else {
      res.status(404).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Get chatbot error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// List all chatbots for the authenticated user
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await ChatbaseService.listChatbots();
    
    if (result.success) {
      res.json({
        success: true,
        chatbots: result.chatbots
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('List chatbots error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update chatbot
router.put('/:chatbotId', requireAuth, async (req, res) => {
  try {
    const { chatbotId } = req.params;
    const updates = req.body;
    
    const result = await ChatbaseService.updateChatbot(chatbotId, updates);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Chatbot updated successfully',
        chatbot: result.chatbot
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Update chatbot error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Delete chatbot
router.delete('/:chatbotId', requireAuth, async (req, res) => {
  try {
    const { chatbotId } = req.params;
    
    const result = await ChatbaseService.deleteChatbot(chatbotId);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Delete chatbot error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get chatbot analytics
router.get('/:chatbotId/analytics', requireAuth, async (req, res) => {
  try {
    const { chatbotId } = req.params;
    const { startDate, endDate } = req.query;
    
    const result = await ChatbaseService.getChatbotAnalytics(chatbotId, startDate, endDate);
    
    if (result.success) {
      res.json({
        success: true,
        analytics: result.analytics
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Get chatbot analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Test chatbot (send a message)
router.post('/:chatbotId/test', requireAuth, async (req, res) => {
  try {
    const { chatbotId } = req.params;
    const { message, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }
    
    const result = await ChatbaseService.sendMessage(chatbotId, message, sessionId);
    
    if (result.success) {
      res.json({
        success: true,
        response: result.response,
        sessionId: result.sessionId
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Test chatbot error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;