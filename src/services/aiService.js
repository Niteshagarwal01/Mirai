/**
 * AI Service - Real Implementation
 * Handles all AI-powered content generation via backend API
 */

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

class AIService {
  /**
   * Get available AI content types
   */
  async getContentTypes() {
    try {
      const response = await fetch(`${API_BASE}/api/content/types`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load content types');
      }
      
      return {
        success: true,
        contentTypes: data.contentTypes || []
      };
    } catch (error) {
      console.error('Get content types error:', error);
      return {
        success: false,
        error: error.message,
        contentTypes: []
      };
    }
  }

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
      return {
        success: false,
        error: error.message,
        providers: []
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
          contentType: this.mapContentType(contentData.contentType),
          topic: contentData.prompt,
          tone: contentData.tone,
          provider: contentData.provider
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
   * Map frontend content type IDs to backend content type names
   */
  mapContentType(typeId) {
    const typeMap = {
      'instagram-post': 'Instagram Post',
      'linkedin-post': 'LinkedIn Post',
      'twitter-post': 'Twitter Post',
      'blog-post': 'Blog Post',
      'email-campaign': 'Email Campaign',
      'product-description': 'Product Description'
    };
    return typeMap[typeId] || typeId;
  }

  /**
   * Get user's content generation history
   */
  async getContentHistory(userId) {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${API_BASE}/api/content/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load history');
      }
      
      return {
        success: true,
        history: data.history || []
      };
    } catch (error) {
      console.error('Get history error:', error);
      return {
        success: false,
        error: error.message,
        history: []
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
