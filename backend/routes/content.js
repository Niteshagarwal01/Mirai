import express from 'express';
import { requireAuth } from '../middleware/clerkAuth.js';

const router = express.Router();

// Define all 8 content types with their configurations
const CONTENT_TYPES = [
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    category: 'Social Media',
    maxLength: 2200,
    includeHashtags: true,
    includeEmojis: true,
    promptTemplate: (topic, tone, length) => 
      `Create an engaging Instagram post about: ${topic}\n\nTone: ${tone}\nLength: ${length} (aim for ${length === 'short' ? '100-150' : length === 'medium' ? '150-300' : '300-500'} words)\n\nRequirements:\n- Include relevant emojis throughout\n- Add 10-15 trending hashtags at the end\n- Make it visually appealing with line breaks\n- Use storytelling or hook in first line\n- Call-to-action at the end`
  },
  {
    id: 'linkedin-post',
    name: 'LinkedIn Post',
    category: 'Professional',
    maxLength: 3000,
    includeHashtags: false,
    includeEmojis: false,
    promptTemplate: (topic, tone, length) =>
      `Create a professional LinkedIn post about: ${topic}\n\nTone: ${tone}\nLength: ${length}\n\nRequirements:\n- Professional and thought-leadership focused\n- Clear value proposition\n- Industry insights or personal experience\n- Engaging hook in first 2 lines\n- Question or call-to-action at the end\n- Use line breaks for readability`
  },
  {
    id: 'twitter-post',
    name: 'Twitter Post',
    category: 'Social Media',
    maxLength: 280,
    includeHashtags: true,
    includeEmojis: true,
    promptTemplate: (topic, tone, length) =>
      `Create a viral Twitter/X post about: ${topic}\n\nTone: ${tone}\n\nRequirements:\n- Maximum 280 characters including hashtags\n- Make it punchy and attention-grabbing\n- Include 2-3 relevant hashtags\n- One key insight or hook\n- Encourage retweets or replies`
  },
  {
    id: 'facebook-post',
    name: 'Facebook Post',
    category: 'Social Media',
    maxLength: 2000,
    includeHashtags: false,
    includeEmojis: true,
    promptTemplate: (topic, tone, length) =>
      `Create an engaging Facebook post about: ${topic}\n\nTone: ${tone}\nLength: ${length}\n\nRequirements:\n- Conversational and friendly\n- Include emojis where appropriate\n- Encourage comments and shares\n- Personal touch or story element\n- Clear call-to-action\n- Use line breaks for readability`
  },
  {
    id: 'blog-post',
    name: 'Blog Post',
    category: 'Content',
    maxLength: 4000,
    includeHashtags: false,
    includeEmojis: false,
    promptTemplate: (topic, tone, length) =>
      `Write a comprehensive blog post about: ${topic}\n\nTone: ${tone}\nLength: ${length === 'short' ? '500-700' : length === 'medium' ? '800-1200' : '1500-2000'} words\n\nStructure:\n1. Compelling title (H1)\n2. Introduction with hook\n3. 3-5 main sections with H2 headings\n4. Bullet points or numbered lists where appropriate\n5. Conclusion with key takeaways\n6. Meta description (150-160 characters)\n\nRequirements:\n- SEO-optimized with keywords\n- Research-backed insights\n- Actionable tips or advice\n- Engaging and scannable format`
  },
  {
    id: 'linkedin-article',
    name: 'LinkedIn Article',
    category: 'Content',
    maxLength: 5000,
    includeHashtags: false,
    includeEmojis: false,
    promptTemplate: (topic, tone, length) =>
      `Write a professional LinkedIn article about: ${topic}\n\nTone: ${tone}\nLength: ${length === 'short' ? '800-1000' : length === 'medium' ? '1200-1800' : '2000-3000'} words\n\nStructure:\n1. Professional title\n2. Strong opening with personal insight\n3. 4-6 sections with clear headings\n4. Data, statistics, or case studies\n5. Expert opinion or unique perspective\n6. Conclusion with thought-provoking question\n\nRequirements:\n- Thought leadership focused\n- Industry expertise demonstrated\n- Credible sources referenced\n- Professional yet engaging tone\n- LinkedIn-optimized formatting`
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    category: 'Social Media',
    maxLength: 150,
    includeHashtags: false,
    includeEmojis: true,
    promptTemplate: (topic, tone, length) =>
      `Create an Instagram Story script about: ${topic}\n\nTone: ${tone}\n\nRequirements:\n- 15-30 second script (75-150 words max)\n- Opening hook in first 3 seconds\n- Quick, punchy sentences\n- Include emojis and visual cues\n- Swipe-up or interaction prompt\n- Urgency or curiosity element\n- Mention visual elements (e.g., "Show product here", "Add poll sticker")`
  },
  {
    id: 'product-description',
    name: 'Product Description',
    category: 'E-commerce',
    maxLength: 500,
    includeHashtags: false,
    includeEmojis: false,
    promptTemplate: (topic, tone, length) =>
      `Write a compelling product description for: ${topic}\n\nTone: ${tone}\nLength: ${length === 'short' ? '50-100' : length === 'medium' ? '100-200' : '200-350'} words\n\nStructure:\n1. Catchy headline/tagline\n2. Key benefits (3-5 bullet points)\n3. Features overview\n4. Use case or problem it solves\n5. Trust signals (quality, warranty, etc.)\n6. Strong call-to-action\n\nRequirements:\n- Benefit-focused, not just features\n- Address customer pain points\n- SEO-optimized with keywords\n- Persuasive and conversion-focused\n- Scannable format with bullets\n- Create urgency or FOMO where appropriate`
  },
  {
    id: 'essay',
    name: 'Essay',
    category: 'Content Creation',
    maxLength: 3000,
    includeHashtags: false,
    includeEmojis: false,
    promptTemplate: (topic, tone, length) =>
      `Write a well-structured essay about: ${topic}\n\nTone: ${tone}\nLength: ${length === 'short' ? '500-700' : length === 'medium' ? '800-1200' : '1500-2000'} words\n\nStructure:\n1. Title\n2. Introduction (thesis statement, background context)\n3. Body Paragraphs (3-5 sections with topic sentences)\n4. Supporting evidence and analysis for each point\n5. Conclusion (restate thesis, summarize key points, final thoughts)\n\nRequirements:\n- Clear thesis statement\n- Logical flow and transitions\n- Well-researched arguments\n- Academic or formal writing style\n- Proper paragraph structure\n- Strong opening and closing`
  }
];

/**
 * GET /api/content/types
 * Get all available content types
 */
router.get('/types', (req, res) => {
  try {
    const contentTypes = CONTENT_TYPES.map(type => ({
      id: type.id,
      name: type.name,
      category: type.category,
      maxLength: type.maxLength,
      includeHashtags: type.includeHashtags,
      includeEmojis: type.includeEmojis
    }));

    res.json({
      success: true,
      contentTypes
    });
  } catch (error) {
    console.error('❌ Error fetching content types:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content types'
    });
  }
});

/**
 * POST /api/content/generate
 * Generate content using AI
 */
router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { contentType, prompt, tone, length, provider } = req.body;

    if (!contentType || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'Content type and prompt are required'
      });
    }

    // Find content type configuration
    const typeConfig = CONTENT_TYPES.find(t => t.id === contentType || t.name === contentType);
    
    if (!typeConfig) {
      return res.status(400).json({
        success: false,
        error: 'Invalid content type'
      });
    }

    console.log(`🎨 Generating ${typeConfig.name}:`, {
      userId: req.auth.userId,
      prompt: prompt.substring(0, 50) + '...',
      tone,
      length,
      provider: provider || 'groq'
    });

    // Build AI prompt based on content type
    const aiPrompt = typeConfig.promptTemplate(prompt, tone || 'professional', length || 'medium');

    // Use Groq for content generation
    const groqApiKey = process.env.GROQ_API_KEY;
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{
          role: 'system',
          content: 'You are an expert content creator and copywriter. Create high-quality, engaging content that matches the specified requirements exactly.'
        }, {
          role: 'user',
          content: aiPrompt
        }],
        temperature: 0.8,
        max_tokens: typeConfig.maxLength > 2000 ? 4000 : 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Groq API Error:', errorText);
      throw new Error('AI content generation failed');
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log(`✅ Generated ${typeConfig.name} successfully`);

    // Generate SEO data for blog posts and articles
    let seoData = null;
    if (typeConfig.category === 'Content') {
      seoData = {
        title: extractTitle(generatedContent),
        metaDescription: extractMetaDescription(generatedContent),
        keywords: extractKeywords(prompt),
        readingTime: calculateReadingTime(generatedContent)
      };
    }

    res.json({
      success: true,
      content: generatedContent,
      contentType: typeConfig.name,
      metadata: {
        tone,
        length,
        wordCount: generatedContent.split(/\s+/).length,
        characterCount: generatedContent.length,
        includeHashtags: typeConfig.includeHashtags,
        includeEmojis: typeConfig.includeEmojis
      },
      seoData,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Content generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate content'
    });
  }
});

/**
 * POST /api/content/optimize
 * Optimize existing content for SEO
 */
router.post('/optimize', requireAuth, async (req, res) => {
  try {
    const { content, contentType, keywords } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    console.log('🔍 Optimizing content for SEO:', {
      userId: req.auth.userId,
      contentType,
      keywords: keywords?.join(', ')
    });

    const groqApiKey = process.env.GROQ_API_KEY;
    
    const optimizationPrompt = `Optimize this content for SEO while maintaining its core message:\n\n${content}\n\n${keywords ? `Target keywords: ${keywords.join(', ')}\n\n` : ''}Requirements:\n- Improve SEO without changing the tone\n- Natural keyword integration\n- Better readability and structure\n- Keep the same approximate length\n- Add meta description if it's blog/article content`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{
          role: 'system',
          content: 'You are an SEO expert. Optimize content while maintaining quality and readability.'
        }, {
          role: 'user',
          content: optimizationPrompt
        }],
        temperature: 0.7,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      throw new Error('SEO optimization failed');
    }

    const data = await response.json();
    const optimizedContent = data.choices[0].message.content;

    console.log('✅ Content optimized successfully');

    res.json({
      success: true,
      optimizedContent,
      original: content,
      improvements: {
        seoScore: calculateSEOScore(optimizedContent, keywords),
        readability: 'improved'
      },
      optimizedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Optimization error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to optimize content'
    });
  }
});

// Helper functions
function extractTitle(content) {
  const lines = content.split('\n');
  const titleLine = lines.find(line => line.startsWith('#') || line.length > 20);
  return titleLine ? titleLine.replace(/^#+\s*/, '').trim() : 'Untitled';
}

function extractMetaDescription(content) {
  const text = content.replace(/[#*\n]/g, ' ').trim();
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
  const description = sentences.slice(0, 2).join('. ').substring(0, 155);
  return description + (description.length >= 155 ? '...' : '.');
}

function extractKeywords(prompt) {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const words = prompt.toLowerCase().split(/\s+/).filter(w => 
    w.length > 3 && !stopWords.includes(w)
  );
  return [...new Set(words)].slice(0, 5);
}

function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

function calculateSEOScore(content, keywords) {
  let score = 50; // Base score
  
  // Check keyword presence
  if (keywords && keywords.length > 0) {
    const lowerContent = content.toLowerCase();
    keywords.forEach(keyword => {
      if (lowerContent.includes(keyword.toLowerCase())) score += 10;
    });
  }
  
  // Check length
  const wordCount = content.split(/\s+/).length;
  if (wordCount >= 300) score += 10;
  if (wordCount >= 800) score += 10;
  
  // Check structure (headings, paragraphs)
  if (content.includes('#')) score += 10;
  
  return Math.min(100, score);
}

export default router;
