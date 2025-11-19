import express from 'express';
import VapiService from '../lib/vapi.js';
import { requireAuth } from '../middleware/clerk.js';

const router = express.Router();

// Chat endpoint for text-based conversation
router.post('/chat', async (req, res) => {
  try {
    const { message, assistantId } = req.body;

    if (!message || !assistantId) {
      return res.status(400).json({ 
        success: false,
        error: 'Message and assistant ID are required' 
      });
    }

    // Get assistant details to use its system prompt
    const assistantResult = await VapiService.getVoiceAssistant(assistantId);
    
    if (!assistantResult.success) {
      return res.status(404).json({ 
        success: false,
        error: 'Assistant not found' 
      });
    }

    const assistant = assistantResult.assistant;
    const systemPrompt = assistant.model?.systemMessage || 'You are a helpful AI assistant.';

    // Use OpenAI directly for chat (since VAPI is voice-focused)
    // You can integrate with your existing AI service here
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      res.json({
        success: true,
        response: data.choices[0].message.content
      });
    } else {
      throw new Error('No response from AI');
    }
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate response' 
    });
  }
});

// Get all assistants (simplified endpoint for frontend)
router.get('/assistants', async (req, res) => {
  try {
    const result = await VapiService.listVoiceAssistants();
    
    if (result.success) {
      res.json({
        success: true,
        assistants: result.assistants || []
      });
    } else {
      res.status(400).json({ 
        success: false,
        error: result.error 
      });
    }
  } catch (error) {
    console.error('List assistants error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Create assistant (simplified endpoint for frontend)
router.post('/assistants', async (req, res) => {
  try {
    const { name, systemPrompt, model, voice, firstMessage } = req.body;

    if (!name || !systemPrompt) {
      return res.status(400).json({ 
        success: false,
        error: 'Name and system prompt are required' 
      });
    }

    const assistantData = {
      name,
      model: {
        provider: 'openai',
        model: model || 'gpt-4o-mini'
      },
      voice: {
        provider: 'deepgram',
        voiceId: voice || 'luna'
      },
      firstMessage: firstMessage || 'Hello! How can I help you today?',
      systemPrompt
    };

    const result = await VapiService.createVoiceAssistant(assistantData);
    
    if (result.success) {
      res.json({
        success: true,
        ...result.assistant
      });
    } else {
      res.status(400).json({ 
        success: false,
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Create assistant error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Create a new voice assistant
router.post('/create', requireAuth, async (req, res) => {
  try {
    const { name, type, description, systemPrompt, voiceId, firstMessage, endCallMessage } = req.body;
    const userId = req.user.clerkUserId;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        error: 'Name and description are required'
      });
    }

    const assistantData = {
      name,
      type,
      description,
      systemPrompt,
      voiceId,
      firstMessage,
      endCallMessage,
      userId // Add user ID for tracking
    };

    const result = await VapiService.createVoiceAssistant(assistantData);
    
    if (result.success) {
      // TODO: Save assistant info to database with user association
      res.json({
        success: true,
        message: 'Voice assistant created successfully',
        assistant: result.assistant,
        assistantId: result.assistantId
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Create voice assistant error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get voice assistant details
router.get('/:assistantId', requireAuth, async (req, res) => {
  try {
    const { assistantId } = req.params;
    
    const result = await VapiService.getVoiceAssistant(assistantId);
    
    if (result.success) {
      res.json({
        success: true,
        assistant: result.assistant
      });
    } else {
      res.status(404).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Get voice assistant error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// List all voice assistants for the authenticated user
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await VapiService.listVoiceAssistants();
    
    if (result.success) {
      res.json({
        success: true,
        assistants: result.assistants
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('List voice assistants error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update voice assistant
router.put('/:assistantId', requireAuth, async (req, res) => {
  try {
    const { assistantId } = req.params;
    const updates = req.body;
    
    const result = await VapiService.updateVoiceAssistant(assistantId, updates);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Voice assistant updated successfully',
        assistant: result.assistant
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Update voice assistant error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Delete voice assistant
router.delete('/:assistantId', requireAuth, async (req, res) => {
  try {
    const { assistantId } = req.params;
    
    const result = await VapiService.deleteVoiceAssistant(assistantId);
    
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
    console.error('Delete voice assistant error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Create a phone call
router.post('/:assistantId/call', requireAuth, async (req, res) => {
  try {
    const { assistantId } = req.params;
    const { phoneNumber, customerDetails } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }
    
    const result = await VapiService.createCall(assistantId, phoneNumber, customerDetails);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Call initiated successfully',
        call: result.call,
        callId: result.callId
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Create call error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get call details
router.get('/calls/:callId', requireAuth, async (req, res) => {
  try {
    const { callId } = req.params;
    
    const result = await VapiService.getCall(callId);
    
    if (result.success) {
      res.json({
        success: true,
        call: result.call
      });
    } else {
      res.status(404).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Get call error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// List calls for an assistant
router.get('/:assistantId/calls', requireAuth, async (req, res) => {
  try {
    const { assistantId } = req.params;
    const { limit } = req.query;
    
    const result = await VapiService.listCalls(assistantId, limit ? parseInt(limit) : 100);
    
    if (result.success) {
      res.json({
        success: true,
        calls: result.calls
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('List calls error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get voice assistant analytics
router.get('/:assistantId/analytics', requireAuth, async (req, res) => {
  try {
    const { assistantId } = req.params;
    const { startDate, endDate } = req.query;
    
    const result = await VapiService.getCallAnalytics(assistantId, startDate, endDate);
    
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
    console.error('Get voice assistant analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get available voices
router.get('/voices/list', requireAuth, async (req, res) => {
  try {
    const result = await VapiService.getVoices();
    
    if (result.success) {
      res.json({
        success: true,
        voices: result.voices
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Get voices error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;