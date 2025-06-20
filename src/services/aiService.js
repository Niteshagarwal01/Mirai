// AI service for content generation
// Uses Gemini API with Groq API as a fallback

const AI_URL = '/api/ai';

export const aiService = {
  // Generate content using AI
  async generateContent(contentData) {
    try {
      const response = await fetch(`${AI_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Content generation error:', error);
      throw error;
    }
  },

  // Get content types available
  async getContentTypes() {
    try {
      const response = await fetch(`${AI_URL}/content-types`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching content types:', error);
      throw error;
    }
  },
  
  // Get content history
  async getContentHistory(userId) {
    try {
      const response = await fetch(`${AI_URL}/history?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching content history:', error);
      throw error;
    }
  }
};

export default aiService;
