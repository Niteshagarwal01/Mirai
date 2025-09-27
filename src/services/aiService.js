// AI service for Mirai content generation
// Uses OpenAI, Gemini, and Hugging Face APIs via the Mirai backend

const API_BASE_URL = 'http://localhost:5000/api';

export const aiService = {
  // Validate input before sending to API
  validateInput(contentData) {
    const { prompt, contentType } = contentData;
    
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Please provide a prompt for content generation');
    }
    
    if (prompt.trim().length < 10) {
      throw new Error('Please provide a more detailed prompt (at least 10 characters)');
    }
    
    if (!contentType) {
      throw new Error('Please select a content type');
    }
    
    return true;
  },

  // Generate content using the Mirai backend AI API
  async generateContent(contentData) {
    try {
      // Validate input first
      this.validateInput(contentData);
      
      const { contentType, prompt, tone = 'professional', length = 'medium', userId, provider = 'auto' } = contentData;
      
      console.log('Generating content:', { contentType, prompt, tone, length, provider });
      
      const response = await fetch(`${API_BASE_URL}/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          prompt: prompt.trim(),
          tone,
          length,
          userId,
          provider
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }
      
      const result = await response.json();
      
      return {
        success: true,
        content: result.content,
        provider: result.provider,
        tokens: result.tokens || null
      };
    } catch (error) {
      console.error('Content generation error:', error);
      return {
        success: false,
        error: error.message,
        content: null
      };
    }
  },

  // Generate a business plan using AI with proper validation
  async generateBusinessPlan(planData) {
    try {
      // Validate business plan input
      const requiredFields = ['businessName', 'businessDescription', 'industry'];
      const missingFields = requiredFields.filter(field => !planData[field] || planData[field].trim().length === 0);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      }

      const { 
        businessName, 
        businessDescription, 
        industry, 
        targetAudience, 
        uniqueSellingPoints, 
        tone = 'professional',
        provider = 'auto'
      } = planData;
      
      // Create a comprehensive prompt for the business plan
      const prompt = `Create a comprehensive business plan for "${businessName}".
      
      Business Details:
      - Description: ${businessDescription}
      - Industry: ${industry}
      ${targetAudience ? `- Target Audience: ${targetAudience}` : ''}
      ${uniqueSellingPoints ? `- Unique Selling Points: ${uniqueSellingPoints}` : ''}
      
      Please provide a detailed business plan with the following sections:
      1. Executive Summary
      2. Market Analysis 
      3. Marketing Strategy
      4. Financial Projections
      5. Risk Assessment
      6. Implementation Timeline
      
      Make it professional, detailed, and actionable.`;
      
      return await this.generateContent({
        contentType: 'business-plan',
        prompt,
        tone,
        length: 'long',
        provider
      });
    } catch (error) {
      console.error('Business plan generation error:', error);
      return {
        success: false,
        error: error.message,
        content: null
      };
    }
  },

  // Get available AI providers
  async getAvailableProviders() {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/providers`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch AI providers');
      }
      
      const result = await response.json();
      
      return {
        success: true,
        providers: result.providers
      };
    } catch (error) {
      console.error('Error fetching AI providers:', error);
      
      // Return default providers
      return {
        success: true,
        providers: [
          { id: 'auto', name: 'Auto (Best Available)', description: 'Automatically selects the best available AI provider' },
          { id: 'openai', name: 'OpenAI GPT', description: 'High-quality content generation' },
          { id: 'gemini', name: 'Google Gemini', description: 'Fast and efficient content creation' },
          { id: 'huggingface', name: 'Hugging Face', description: 'Open-source AI models' }
        ]
      };
    }
  },

  // Get content types available from the backend
  async getContentTypes() {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/content-types`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch content types');
      }
      
      const result = await response.json();
      
      return {
        success: true,
        contentTypes: result.contentTypes
      };
    } catch (error) {
      console.error('Error fetching content types:', error);
      
      // Return minimal content types in case of error
      return {
        success: true,
        contentTypes: [
          {
            id: "instagram-post",
            name: "Instagram Post", 
            description: "Create engaging captions and visuals optimized for Instagram's audience",
            icon: "📱",
            category: "Social Media"
          },
          {
            id: "linkedin-post",
            name: "LinkedIn Post",
            description: "Professional content that drives engagement and showcases expertise",
            icon: "💼",
            category: "Professional"
          },
          {
            id: "twitter-post",
            name: "Twitter Post",
            description: "Concise, engaging tweets that spark conversation and sharing",
            icon: "🐦",
            category: "Social Media"
          },
          {
            id: "blog-post",
            name: "Blog Post",
            description: "In-depth content that educates your audience and builds authority",
            icon: "📝",
            category: "Content Creation"
          }
        ]
      };
    }
  },
  
  // Get content history with proper error handling
  async getContentHistory(userId) {
    try {
      if (!userId) {
        return {
          success: true,
          history: []
        };
      }
      
      const response = await fetch(`${API_BASE_URL}/ai/history?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch content history');
      }
      
      const result = await response.json();
      
      return {
        success: true,
        history: result.history || []
      };
    } catch (error) {
      console.error('Error fetching content history:', error);
      return {
        success: true,
        history: []
      };
    }
  }
};

export default aiService;
