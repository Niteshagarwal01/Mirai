import axios from 'axios';

class VapiService {
  constructor() {
    this.apiKey = process.env.VAPI_API_KEY;
    this.baseUrl = 'https://api.vapi.ai';
    
    if (!this.apiKey) {
      console.warn('Vapi API key not found in environment variables');
    }
  }

  // Create a new voice assistant
  async createVoiceAssistant(assistantData) {
    try {
      const config = {
        method: 'POST',
        url: `${this.baseUrl}/assistant`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          name: assistantData.name,
          model: {
            provider: 'openai',
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            maxTokens: 250,
            systemMessage: assistantData.systemPrompt || 'You are a helpful AI voice assistant.'
          },
          voice: {
            provider: 'playht',
            voiceId: assistantData.voiceId || 'jennifer',
            speed: 1.0,
            stability: 0.5,
            similarityBoost: 0.8
          },
          firstMessage: assistantData.firstMessage || 'Hi! How can I help you today?',
          recordingEnabled: true,
          endCallMessage: assistantData.endCallMessage || 'Thank you for calling. Have a great day!',
          endCallPhrases: ['goodbye', 'bye', 'end call', 'hang up'],
          backgroundSound: 'office',
          backchannelingEnabled: true,
          backgroundDenoisingEnabled: true,
          modelOutputInMessagesEnabled: true,
          transportConfigurations: [
            {
              provider: 'twilio',
              timeout: 600,
              record: true
            }
          ]
        }
      };

      const response = await axios(config);
      return {
        success: true,
        assistant: response.data,
        assistantId: response.data.id
      };
    } catch (error) {
      console.error('Vapi assistant creation error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create voice assistant'
      };
    }
  }

  // Get voice assistant details
  async getVoiceAssistant(assistantId) {
    try {
      const config = {
        method: 'GET',
        url: `${this.baseUrl}/assistant/${assistantId}`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      };

      const response = await axios(config);
      return {
        success: true,
        assistant: response.data
      };
    } catch (error) {
      console.error('Vapi get assistant error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get voice assistant'
      };
    }
  }

  // List all voice assistants
  async listVoiceAssistants() {
    try {
      const config = {
        method: 'GET',
        url: `${this.baseUrl}/assistant`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      };

      const response = await axios(config);
      return {
        success: true,
        assistants: response.data || []
      };
    } catch (error) {
      console.error('Vapi list assistants error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to list voice assistants'
      };
    }
  }

  // Update voice assistant
  async updateVoiceAssistant(assistantId, updates) {
    try {
      const config = {
        method: 'PATCH',
        url: `${this.baseUrl}/assistant/${assistantId}`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: updates
      };

      const response = await axios(config);
      return {
        success: true,
        assistant: response.data
      };
    } catch (error) {
      console.error('Vapi update assistant error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update voice assistant'
      };
    }
  }

  // Delete voice assistant
  async deleteVoiceAssistant(assistantId) {
    try {
      const config = {
        method: 'DELETE',
        url: `${this.baseUrl}/assistant/${assistantId}`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      };

      await axios(config);
      return {
        success: true,
        message: 'Voice assistant deleted successfully'
      };
    } catch (error) {
      console.error('Vapi delete assistant error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete voice assistant'
      };
    }
  }

  // Create a phone call
  async createCall(assistantId, phoneNumber, customerDetails = {}) {
    try {
      const config = {
        method: 'POST',
        url: `${this.baseUrl}/call`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          assistantId: assistantId,
          phoneNumberId: phoneNumber, // This should be a Vapi phone number ID
          customer: {
            number: phoneNumber,
            name: customerDetails.name || 'Customer',
            email: customerDetails.email || null
          }
        }
      };

      const response = await axios(config);
      return {
        success: true,
        call: response.data,
        callId: response.data.id
      };
    } catch (error) {
      console.error('Vapi create call error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create call'
      };
    }
  }

  // Get call details
  async getCall(callId) {
    try {
      const config = {
        method: 'GET',
        url: `${this.baseUrl}/call/${callId}`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      };

      const response = await axios(config);
      return {
        success: true,
        call: response.data
      };
    } catch (error) {
      console.error('Vapi get call error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get call details'
      };
    }
  }

  // List calls with filters
  async listCalls(assistantId = null, limit = 100) {
    try {
      const config = {
        method: 'GET',
        url: `${this.baseUrl}/call`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        params: {
          assistantId: assistantId,
          limit: limit
        }
      };

      const response = await axios(config);
      return {
        success: true,
        calls: response.data || []
      };
    } catch (error) {
      console.error('Vapi list calls error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to list calls'
      };
    }
  }

  // Get call analytics
  async getCallAnalytics(assistantId, startDate, endDate) {
    try {
      const calls = await this.listCalls(assistantId);
      
      if (!calls.success) {
        return calls;
      }

      // Filter calls by date range
      const filteredCalls = calls.calls.filter(call => {
        const callDate = new Date(call.createdAt);
        return callDate >= new Date(startDate) && callDate <= new Date(endDate);
      });

      // Calculate analytics
      const analytics = {
        totalCalls: filteredCalls.length,
        completedCalls: filteredCalls.filter(call => call.status === 'ended').length,
        failedCalls: filteredCalls.filter(call => call.status === 'failed').length,
        averageDuration: this.calculateAverageDuration(filteredCalls),
        totalDuration: this.calculateTotalDuration(filteredCalls),
        callsByDay: this.groupCallsByDay(filteredCalls),
        successRate: filteredCalls.length > 0 ? 
          (filteredCalls.filter(call => call.status === 'ended').length / filteredCalls.length * 100).toFixed(2) : 0
      };

      return {
        success: true,
        analytics: analytics
      };
    } catch (error) {
      console.error('Vapi analytics error:', error.message);
      return {
        success: false,
        error: 'Failed to get call analytics'
      };
    }
  }

  // Get available voices
  async getVoices() {
    try {
      const config = {
        method: 'GET',
        url: `${this.baseUrl}/voice`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      };

      const response = await axios(config);
      return {
        success: true,
        voices: response.data || []
      };
    } catch (error) {
      console.error('Vapi get voices error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get voices'
      };
    }
  }

  // Helper methods
  calculateAverageDuration(calls) {
    const completedCalls = calls.filter(call => call.endedAt && call.startedAt);
    if (completedCalls.length === 0) return 0;

    const totalDuration = completedCalls.reduce((sum, call) => {
      const duration = new Date(call.endedAt) - new Date(call.startedAt);
      return sum + duration;
    }, 0);

    return Math.round(totalDuration / completedCalls.length / 1000); // in seconds
  }

  calculateTotalDuration(calls) {
    const completedCalls = calls.filter(call => call.endedAt && call.startedAt);
    const totalMs = completedCalls.reduce((sum, call) => {
      const duration = new Date(call.endedAt) - new Date(call.startedAt);
      return sum + duration;
    }, 0);

    return Math.round(totalMs / 1000); // in seconds
  }

  groupCallsByDay(calls) {
    const groups = {};
    calls.forEach(call => {
      const date = new Date(call.createdAt).toISOString().split('T')[0];
      groups[date] = (groups[date] || 0) + 1;
    });
    return groups;
  }
}

export default new VapiService();