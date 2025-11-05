/**
 * API Service for Backend Communication
 * Base URL: http://localhost:3001
 */

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/**
 * Helper function to get Clerk auth token
 * You'll need to pass this from components using useAuth() hook
 */
const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

/**
 * User API
 */
export const userAPI = {
  /**
   * Get current user profile
   * @param {string} token - Clerk auth token
   */
  async getProfile(token) {
    const response = await fetch(`${API_BASE_URL}/api/user/me`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    return response.json();
  },

  /**
   * Get user's plan and quota status
   * @param {string} token - Clerk auth token
   */
  async getPlan(token) {
    const response = await fetch(`${API_BASE_URL}/api/user/plan`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch plan');
    }
    
    return response.json();
  }
};

/**
 * Bot API
 */
export const botAPI = {
  /**
   * Create a new bot
   * @param {string} token - Clerk auth token
   * @param {string} name - Bot name
   * @param {object} config - Bot configuration
   */
  async create(token, name, config) {
    const response = await fetch(`${API_BASE_URL}/api/bots/create`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ name, config })
    });
    
    const data = await response.json();
    
    // Handle quota exceeded
    if (response.status === 402) {
      throw new QuotaExceededError(data.message, data);
    }
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create bot');
    }
    
    return data;
  },

  /**
   * Get all bots for current user
   * @param {string} token - Clerk auth token
   */
  async getAll(token) {
    const response = await fetch(`${API_BASE_URL}/api/bots`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch bots');
    }
    
    return response.json();
  },

  /**
   * Delete a bot
   * @param {string} token - Clerk auth token
   * @param {number} botId - Bot ID to delete
   */
  async delete(token, botId) {
    const response = await fetch(`${API_BASE_URL}/api/bots/${botId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete bot');
    }
    
    return response.json();
  }
};

/**
 * Chatbot API - Chatbase Integration
 */
export const chatbotAPI = {
  /**
   * Create a new chatbot
   * @param {string} token - Clerk auth token
   * @param {object} chatbotData - Chatbot configuration
   */
  async create(token, chatbotData) {
    const response = await fetch(`${API_BASE_URL}/api/chatbots/create`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(chatbotData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create chatbot');
    }
    
    return data;
  },

  /**
   * Get all chatbots for current user
   * @param {string} token - Clerk auth token
   */
  async getAll(token) {
    const response = await fetch(`${API_BASE_URL}/api/chatbots`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch chatbots');
    }
    
    return response.json();
  },

  /**
   * Get chatbot details
   * @param {string} token - Clerk auth token
   * @param {string} chatbotId - Chatbot ID
   */
  async get(token, chatbotId) {
    const response = await fetch(`${API_BASE_URL}/api/chatbots/${chatbotId}`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch chatbot');
    }
    
    return response.json();
  },

  /**
   * Update chatbot
   * @param {string} token - Clerk auth token
   * @param {string} chatbotId - Chatbot ID
   * @param {object} updates - Update data
   */
  async update(token, chatbotId, updates) {
    const response = await fetch(`${API_BASE_URL}/api/chatbots/${chatbotId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(updates)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update chatbot');
    }
    
    return data;
  },

  /**
   * Delete chatbot
   * @param {string} token - Clerk auth token
   * @param {string} chatbotId - Chatbot ID
   */
  async delete(token, chatbotId) {
    const response = await fetch(`${API_BASE_URL}/api/chatbots/${chatbotId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete chatbot');
    }
    
    return data;
  },

  /**
   * Upload knowledge base files
   * @param {string} token - Clerk auth token
   * @param {string} chatbotId - Chatbot ID
   * @param {FileList} files - Files to upload
   */
  async uploadKnowledgeBase(token, chatbotId, files) {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE_URL}/api/chatbots/${chatbotId}/knowledge-base`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type for FormData, let browser set it
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload knowledge base');
    }
    
    return data;
  },

  /**
   * Get chatbot analytics
   * @param {string} token - Clerk auth token
   * @param {string} chatbotId - Chatbot ID
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   */
  async getAnalytics(token, chatbotId, startDate, endDate) {
    const params = new URLSearchParams({
      startDate,
      endDate
    });

    const response = await fetch(`${API_BASE_URL}/api/chatbots/${chatbotId}/analytics?${params}`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch chatbot analytics');
    }
    
    return response.json();
  },

  /**
   * Test chatbot with a message
   * @param {string} token - Clerk auth token
   * @param {string} chatbotId - Chatbot ID
   * @param {string} message - Test message
   * @param {string} sessionId - Optional session ID
   */
  async test(token, chatbotId, message, sessionId = null) {
    const response = await fetch(`${API_BASE_URL}/api/chatbots/${chatbotId}/test`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ message, sessionId })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to test chatbot');
    }
    
    return data;
  }
};

/**
 * Voice Agent API - Vapi Integration
 */
export const voiceAgentAPI = {
  /**
   * Create a new voice assistant
   * @param {string} token - Clerk auth token
   * @param {object} assistantData - Voice assistant configuration
   */
  async create(token, assistantData) {
    const response = await fetch(`${API_BASE_URL}/api/voice-agents/create`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(assistantData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create voice assistant');
    }
    
    return data;
  },

  /**
   * Get all voice assistants for current user
   * @param {string} token - Clerk auth token
   */
  async getAll(token) {
    const response = await fetch(`${API_BASE_URL}/api/voice-agents`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch voice assistants');
    }
    
    return response.json();
  },

  /**
   * Get voice assistant details
   * @param {string} token - Clerk auth token
   * @param {string} assistantId - Assistant ID
   */
  async get(token, assistantId) {
    const response = await fetch(`${API_BASE_URL}/api/voice-agents/${assistantId}`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch voice assistant');
    }
    
    return response.json();
  },

  /**
   * Update voice assistant
   * @param {string} token - Clerk auth token
   * @param {string} assistantId - Assistant ID
   * @param {object} updates - Update data
   */
  async update(token, assistantId, updates) {
    const response = await fetch(`${API_BASE_URL}/api/voice-agents/${assistantId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(updates)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update voice assistant');
    }
    
    return data;
  },

  /**
   * Delete voice assistant
   * @param {string} token - Clerk auth token
   * @param {string} assistantId - Assistant ID
   */
  async delete(token, assistantId) {
    const response = await fetch(`${API_BASE_URL}/api/voice-agents/${assistantId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete voice assistant');
    }
    
    return data;
  },

  /**
   * Create a phone call
   * @param {string} token - Clerk auth token
   * @param {string} assistantId - Assistant ID
   * @param {string} phoneNumber - Phone number to call
   * @param {object} customerDetails - Customer information
   */
  async createCall(token, assistantId, phoneNumber, customerDetails = {}) {
    const response = await fetch(`${API_BASE_URL}/api/voice-agents/${assistantId}/call`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ phoneNumber, customerDetails })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create call');
    }
    
    return data;
  },

  /**
   * Get call details
   * @param {string} token - Clerk auth token
   * @param {string} callId - Call ID
   */
  async getCall(token, callId) {
    const response = await fetch(`${API_BASE_URL}/api/voice-agents/calls/${callId}`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch call details');
    }
    
    return response.json();
  },

  /**
   * List calls for an assistant
   * @param {string} token - Clerk auth token
   * @param {string} assistantId - Assistant ID
   * @param {number} limit - Number of calls to fetch
   */
  async getCalls(token, assistantId, limit = 100) {
    const params = new URLSearchParams({ limit: limit.toString() });
    
    const response = await fetch(`${API_BASE_URL}/api/voice-agents/${assistantId}/calls?${params}`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch calls');
    }
    
    return response.json();
  },

  /**
   * Get voice assistant analytics
   * @param {string} token - Clerk auth token
   * @param {string} assistantId - Assistant ID
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   */
  async getAnalytics(token, assistantId, startDate, endDate) {
    const params = new URLSearchParams({
      startDate,
      endDate
    });

    const response = await fetch(`${API_BASE_URL}/api/voice-agents/${assistantId}/analytics?${params}`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch voice assistant analytics');
    }
    
    return response.json();
  },

  /**
   * Get available voices
   * @param {string} token - Clerk auth token
   */
  async getVoices(token) {
    const response = await fetch(`${API_BASE_URL}/api/voice-agents/voices/list`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch voices');
    }
    
    return response.json();
  }
};

/**
 * Payment API - Razorpay
 */
export const paymentAPI = {
  /**
   * Create Razorpay order for Pro upgrade
   * @param {string} token - Clerk auth token
   * @param {string} email - User email
   */
  async createOrder(token, email) {
    const response = await fetch(`${API_BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to create order');
    }
    
    return response.json();
  },

  /**
   * Verify Razorpay payment with signature
   * @param {object} paymentData - Payment verification data
   */
  async verifyPayment(paymentData) {
    const response = await fetch(`${API_BASE_URL}/api/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Payment verification failed');
    }
    
    return response.json();
  }
};

/**
 * Custom Error for quota exceeded (402)
 */
export class QuotaExceededError extends Error {
  constructor(message, data) {
    super(message);
    this.name = 'QuotaExceededError';
    this.data = data;
  }
}

/**
 * Health check
 */
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
};

export default {
  userAPI,
  botAPI,
  chatbotAPI,
  voiceAgentAPI,
  paymentAPI,
  healthCheck
};
