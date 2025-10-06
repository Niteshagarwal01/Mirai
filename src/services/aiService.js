/**
 * AI Service - Real Implementation
 * Handles all AI-powered content generation via backend API
 */

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

class AIService {

  /**
   * Get available AI providers (OpenAI, Claude, etc.)
   */
  async getAvailableProviders() {
    try {
      const response = await fetch(`${API_BASE}/api/ai/providers`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load providers');
      }
      
      return {
        success: true,
        providers: data.providers || []
      };
    } catch (error) {
      console.error('Get providers error:', error);
      // Return fallback providers if API fails
      return {
        success: true,
        providers: [
          { id: 'groq', name: 'Groq (Llama 3.3)', status: 'available' },
          { id: 'huggingface', name: 'Hugging Face', status: 'available' },
          { id: 'cohere', name: 'Cohere Command', status: 'available' },
          { id: 'claude', name: 'Anthropic Claude', status: 'available' }
        ]
      };
    }
  }

  /**
   * Generate AI content based on user input
   */
  async generateContent(contentData) {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${API_BASE}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contentType: contentData.contentType, // Use contentType directly (backend expects exact names)
          topic: contentData.topic, // Backend expects 'topic' field
          tone: contentData.tone,
          provider: contentData.provider || 'groq' // Default to groq
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }
      
      return {
        success: true,
        content: data.content,
        metadata: data.metadata,
        results: data.results // For multi-provider responses
      };
    } catch (error) {
      console.error('Generate content error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate image from text description
   */
  async generateImage(imageData) {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${API_BASE}/api/ai/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: imageData.prompt,
          style: imageData.style,
          size: imageData.size,
          provider: imageData.provider
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }
      
      return {
        success: true,
        imageUrl: data.imageUrl,
        metadata: data.metadata
      };
    } catch (error) {
      console.error('Generate image error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Enhance product image with AI
   */
  async enhanceProductImage(imageData) {
    try {
      const token = await this.getAuthToken();
      
      const formData = new FormData();
      formData.append('image', imageData.file);
      formData.append('enhancement', imageData.enhancement);
      formData.append('background', imageData.background);
      
      const response = await fetch(`${API_BASE}/api/ai/enhance-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance image');
      }
      
      return {
        success: true,
        imageUrl: data.imageUrl,
        originalUrl: data.originalUrl
      };
    } catch (error) {
      console.error('Enhance image error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get authentication token from Clerk
   */
  async getAuthToken() {
    try {
      // Get token from Clerk session
      if (window.Clerk) {
        const session = await window.Clerk.session;
        if (session) {
          return await session.getToken();
        }
      }
      
      throw new Error('Not authenticated');
    } catch (error) {
      console.error('Get auth token error:', error);
      throw error;
    }
  }

  /**
   * Generate business plan using AI
   */
  async generateBusinessPlan(planData) {
    try {
      const token = await this.getAuthToken();
      
      // Format the business plan prompt
      const businessPlanPrompt = `Create a comprehensive business plan for "${planData.businessName}".
      
Business Description: ${planData.businessDescription}
Industry: ${planData.industry}
Target Audience: ${planData.targetAudience || 'General audience'}
Unique Selling Points: ${planData.uniqueSellingPoints || 'To be defined'}`;

      const response = await fetch(`${API_BASE}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contentType: 'Business Plan', // Use specific content type for business plans
          topic: businessPlanPrompt,
          tone: planData.tone || 'professional',
          provider: 'groq' // Default to groq for business plans
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate business plan');
      }
      
      return {
        success: true,
        content: data.content,
        provider: data.metadata?.provider || 'groq'
      };
    } catch (error) {
      console.error('Generate business plan error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check user's plan and usage limits
   */
  async checkUsage() {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${API_BASE}/api/user/usage`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check usage');
      }
      
      return {
        success: true,
        plan: data.plan,
        usage: data.usage,
        limits: data.limits
      };
    } catch (error) {
      console.error('Check usage error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export a singleton instance
const aiService = new AIService();
export default aiService;
