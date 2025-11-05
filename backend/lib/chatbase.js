import axios from 'axios';

class ChatbaseService {
  constructor() {
    this.apiKey = process.env.CHATBASE_API_KEY;
    this.baseUrl = 'https://www.chatbase.co/api/v1';
    
    if (!this.apiKey) {
      console.warn('Chatbase API key not found in environment variables');
    }
  }

  // Create a new chatbot
  async createChatbot(chatbotData) {
    try {
      // For now, simulate chatbot creation since we need to verify the exact Chatbase API format
      const mockResponse = {
        id: `chatbot_${Date.now()}`,
        name: chatbotData.name,
        description: chatbotData.description,
        personality: chatbotData.personality,
        language: chatbotData.language,
        welcome_message: chatbotData.welcomeMessage,
        fallback_message: chatbotData.fallbackMessage,
        integrations: chatbotData.integrations,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('✅ Mock Chatbot Created:', mockResponse);
      
      return {
        success: true,
        chatbot: mockResponse,
        chatbotId: mockResponse.id
      };
    } catch (error) {
      console.error('Chatbase chatbot creation error:', error.message);
      return {
        success: false,
        error: error.message || 'Failed to create chatbot'
      };
    }
  }

  // Upload knowledge base documents
  async uploadKnowledgeBase(chatbotId, files) {
    try {
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('files', file.buffer, file.originalname);
      });

      const config = {
        method: 'POST',
        url: `${this.baseUrl}/chatbots/${chatbotId}/data`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      };

      const response = await axios(config);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Chatbase knowledge base upload error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload knowledge base'
      };
    }
  }

  // Get chatbot details
  async getChatbot(chatbotId) {
    try {
      const config = {
        method: 'GET',
        url: `${this.baseUrl}/chatbots/${chatbotId}`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      };

      const response = await axios(config);
      return {
        success: true,
        chatbot: response.data
      };
    } catch (error) {
      console.error('Chatbase get chatbot error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get chatbot'
      };
    }
  }

  // List all chatbots for a user
  async listChatbots() {
    try {
      // Mock response for testing
      const mockChatbots = [
        {
          id: 'chatbot_1699000001',
          name: 'Customer Support Bot',
          description: 'Helps customers with inquiries',
          personality: 'professional',
          language: 'english',
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          id: 'chatbot_1699000002', 
          name: 'Sales Assistant',
          description: 'Assists with sales inquiries',
          personality: 'friendly',
          language: 'english',
          status: 'active',
          created_at: new Date().toISOString()
        }
      ];

      return {
        success: true,
        chatbots: mockChatbots
      };
    } catch (error) {
      console.error('Chatbase list chatbots error:', error.message);
      return {
        success: false,
        error: error.message || 'Failed to list chatbots'
      };
    }
  }

  // Update chatbot settings
  async updateChatbot(chatbotId, updates) {
    try {
      const config = {
        method: 'PUT',
        url: `${this.baseUrl}/chatbots/${chatbotId}`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: updates
      };

      const response = await axios(config);
      return {
        success: true,
        chatbot: response.data
      };
    } catch (error) {
      console.error('Chatbase update chatbot error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update chatbot'
      };
    }
  }

  // Delete chatbot
  async deleteChatbot(chatbotId) {
    try {
      const config = {
        method: 'DELETE',
        url: `${this.baseUrl}/chatbots/${chatbotId}`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      };

      await axios(config);
      return {
        success: true,
        message: 'Chatbot deleted successfully'
      };
    } catch (error) {
      console.error('Chatbase delete chatbot error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete chatbot'
      };
    }
  }

  // Get chatbot analytics
  async getChatbotAnalytics(chatbotId, startDate, endDate) {
    try {
      const config = {
        method: 'GET',
        url: `${this.baseUrl}/chatbots/${chatbotId}/analytics`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        params: {
          start_date: startDate,
          end_date: endDate
        }
      };

      const response = await axios(config);
      return {
        success: true,
        analytics: response.data
      };
    } catch (error) {
      console.error('Chatbase analytics error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get analytics'
      };
    }
  }

  // Send message to chatbot (for testing)
  async sendMessage(chatbotId, message, sessionId = null) {
    try {
      const config = {
        method: 'POST',
        url: `${this.baseUrl}/chatbots/${chatbotId}/chat`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          message: message,
          session_id: sessionId || `session_${Date.now()}`,
          stream: false
        }
      };

      const response = await axios(config);
      return {
        success: true,
        response: response.data.response,
        sessionId: response.data.session_id
      };
    } catch (error) {
      console.error('Chatbase send message error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send message'
      };
    }
  }
}

export default new ChatbaseService();