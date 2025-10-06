import express from 'express';
import { requireAuth } from '../middleware/clerk.js';
import OpenAI from 'openai';
import prisma from '../lib/prisma.js';

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

// Prompt templates based on content type
const promptTemplates = {
  'Instagram Post': (topic, tone) => `Create an engaging Instagram post about "${topic}". 
Requirements:
- Short and captivating caption (100-150 characters)
- Include relevant emojis naturally
- Add 5-8 relevant hashtags at the end
- Make it visually appealing and scroll-stopping
- Format with line breaks for better readability
- Tone: ${tone || 'friendly and conversational'}`,

  'LinkedIn Post': (topic, tone) => `Create a professional LinkedIn post about "${topic}".
Requirements:
- Professional and insightful tone
- 150-300 words
- Focus on providing value and building credibility
- Include a thought-provoking question or call-to-action
- Structure with clear paragraphs and line breaks
- Use bullet points or numbered lists when appropriate
- Add relevant professional hashtags (3-5)
- Tone: ${tone || 'professional'}`,

  'Twitter Post': (topic, tone) => `Create a Twitter/X post about "${topic}".
Requirements:
- Maximum 280 characters
- Witty, concise, and engaging
- Can include 1-2 relevant hashtags
- Make it punchy and shareable
- Tone: ${tone || 'casual and witty'}`,

  'Blog Post': (topic, tone) => `Write a comprehensive blog post about "${topic}".
Requirements:
- Include an engaging introduction (hook the reader)
- Well-structured body with 3-4 main points
- Clear conclusion with key takeaways
- 500-700 words
- Tone: ${tone || 'professional yet approachable'}
- Use clear HTML formatting with proper headings (h2, h3), paragraphs, and bullet points
- Structure: Title, Introduction, Main sections with subheadings, Conclusion
- Make it visually appealing and easy to read
- Use <h2> for main sections, <h3> for subsections, <p> for paragraphs, <ul><li> for lists
- Format as proper HTML content for web display`,

  'Email Campaign': (topic, tone) => `Create an email marketing campaign about "${topic}".
Requirements:
- Compelling subject line
- Engaging preview text
- Well-structured email body
- Clear call-to-action
- Tone: ${tone || 'friendly and persuasive'}`,

  'Product Description': (topic, tone) => `Write a compelling product description for "${topic}".
Requirements:
- Highlight key features and benefits
- Address customer pain points
- Include compelling call-to-action
- Tone: ${tone || 'persuasive and benefits-focused'}`,

  'Business Plan': (topic, tone) => `Create a comprehensive business plan based on the following information: ${topic}

Requirements:
- Create a detailed, professional business plan
- Include the following sections:
  1. Executive Summary
  2. Company Description  
  3. Market Analysis
  4. Organization & Management
  5. Service or Product Line
  6. Marketing & Sales Strategy
  7. Funding Request (if applicable)
  8. Financial Projections
  9. Risk Assessment & Mitigation
- Use professional business language
- Include specific, actionable recommendations
- Format with clear headings and bullet points
- Provide realistic projections and timelines
- Address potential challenges and solutions
- Tone: ${tone || 'professional and authoritative'}
- Length: Comprehensive (1500-2500 words)
- Structure the content with proper formatting for readability`
};

// Groq API call
async function callGroqAPI(prompt) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an expert marketing content writer. Create engaging, high-quality content based on the user\'s requirements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error Response:', errorText);
      throw new Error(`Groq API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Groq API');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API call failed:', error);
    throw error;
  }
}

// Hugging Face API call - Using a reliable model
async function callHuggingFaceAPI(prompt) {
  try {
    // Use a simple, always-available model
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        },
        options: {
          wait_for_model: true,
          use_cache: false
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API Error:', response.status, errorText);
      throw new Error(`Hugging Face API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('Hugging Face Response:', data);
    
    if (data.error) {
      throw new Error(`Hugging Face API Error: ${data.error}`);
    }
    
    if (Array.isArray(data) && data[0] && data[0].generated_text) {
      return data[0].generated_text;
    }
    
    if (data.generated_text) {
      return data.generated_text;
    }
    
    return 'Content generated successfully with Hugging Face';
  } catch (error) {
    console.error('Hugging Face API call failed:', error);
    throw error;
  }
}

// Cohere API call - Updated to use new model
async function callCohereAPI(prompt) {
  try {
    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'command-r-plus-08-2024',
        message: `You are an expert marketing content writer. Create engaging, high-quality content based on the following requirements:\n\n${prompt}`,
        max_tokens: 1000,
        temperature: 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cohere API Error Response:', errorText);
      throw new Error(`Cohere API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    if (data.text) {
      return data.text;
    }
    
    throw new Error('Invalid response format from Cohere API');
  } catch (error) {
    console.error('Cohere API call failed:', error);
    throw error;
  }
}

// Anthropic Claude API call
async function callClaudeAPI(prompt) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are an expert marketing content writer. Create engaging, high-quality content based on the following requirements:\n\n${prompt}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API Error Response:', errorText);
      throw new Error(`Claude API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    if (data.content && data.content[0] && data.content[0].text) {
      return data.content[0].text;
    }
    
    throw new Error('Invalid response format from Claude API');
  } catch (error) {
    console.error('Claude API call failed:', error);
    throw error;
  }
}

// Gemini API call
async function callGeminiAPI(prompt) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert marketing content writer. Create engaging, high-quality content based on the following requirements:\n\n${prompt}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
            stopSequences: []
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
      console.error('Invalid Gemini API response:', data);
      throw new Error('Invalid response format from Gemini API');
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw error;
  }
}

// OpenAI API call
async function callOpenAI(prompt, model = 'gpt-3.5-turbo') {
  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert marketing content writer. Create engaging, high-quality content based on the user\'s requirements.' 
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      temperature: 0.7,
      max_tokens: 2048
    });

    if (!completion.choices || !completion.choices[0] || !completion.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API');
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
}

/**
 * GET /api/ai/providers
 * Get available AI providers
 */
router.get('/providers', async (req, res) => {
  try {
    const providers = [
      {
        id: 'groq',
        name: 'Groq (Llama 3.3)',
        description: 'Ultra-fast AI - Powered by Llama 3.3 70B',
        status: process.env.GROQ_API_KEY ? 'available' : 'unavailable'
      },
      {
        id: 'huggingface',
        name: 'Hugging Face',
        description: 'Open-source AI models - Free and powerful',
        status: process.env.HUGGINGFACE_API_KEY ? 'available' : 'unavailable'
      },
      {
        id: 'cohere',
        name: 'Cohere Command',
        description: 'Advanced language model for business use',
        status: process.env.COHERE_API_KEY ? 'available' : 'unavailable'
      },
      {
        id: 'claude',
        name: 'Anthropic Claude',
        description: 'Intelligent and helpful AI assistant',
        status: process.env.ANTHROPIC_API_KEY ? 'available' : 'unavailable'
      },
      {
        id: 'gemini',
        name: 'Google Gemini 1.5 Flash',
        description: 'Temporarily unavailable - API key expired',
        status: 'unavailable'
      },
      {
        id: 'openai-gpt4',
        name: 'OpenAI GPT-4',
        description: 'Temporarily unavailable - Quota exceeded',
        status: 'unavailable'
      },
      {
        id: 'openai-gpt3.5',
        name: 'OpenAI GPT-3.5 Turbo',
        description: 'Temporarily unavailable - Quota exceeded',
        status: 'unavailable'
      },
      {
        id: 'all',
        name: 'All Providers',
        description: 'Get results from all available providers',
        status: 'available'
      }
    ];

    res.json({ providers });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({ error: 'Failed to load providers' });
  }
});

/**
 * POST /api/ai/generate
 * Generate AI content with multiple providers
 */
router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { clerkUserId } = req.user;
    const { contentType, topic, tone, provider } = req.body;

    console.log('🔧 Generate request:', { contentType, topic, tone, provider });

    if (!topic || !contentType) {
      return res.status(400).json({ error: 'Topic and content type are required' });
    }

    // Validate provider
    if (!provider) {
      return res.status(400).json({ error: 'Provider is required' });
    }

    // Check user's plan
    const user = await prisma.user.findUnique({
      where: { clerkUserId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Construct prompt using template
    const templateFunction = promptTemplates[contentType];
    if (!templateFunction) {
      return res.status(400).json({ 
        error: 'Invalid content type',
        validTypes: Object.keys(promptTemplates)
      });
    }

    const prompt = templateFunction(topic, tone);
    console.log('📝 Using provider:', provider);

    // If provider is 'all', call all available providers
    if (provider === 'all') {
      const results = {};
      const promises = [];

      // Groq API
      if (process.env.GROQ_API_KEY) {
        promises.push(
          callGroqAPI(prompt)
            .then(content => { results.groq = { content, status: 'success' }; })
            .catch(err => { results.groq = { error: err.message, status: 'failed' }; })
        );
      }

      // Hugging Face API
      if (process.env.HUGGINGFACE_API_KEY) {
        promises.push(
          callHuggingFaceAPI(prompt)
            .then(content => { results.huggingface = { content, status: 'success' }; })
            .catch(err => { results.huggingface = { error: err.message, status: 'failed' }; })
        );
      }

      // Cohere API
      if (process.env.COHERE_API_KEY) {
        promises.push(
          callCohereAPI(prompt)
            .then(content => { results.cohere = { content, status: 'success' }; })
            .catch(err => { results.cohere = { error: err.message, status: 'failed' }; })
        );
      }

      // Claude API
      if (process.env.ANTHROPIC_API_KEY) {
        promises.push(
          callClaudeAPI(prompt)
            .then(content => { results.claude = { content, status: 'success' }; })
            .catch(err => { results.claude = { error: err.message, status: 'failed' }; })
        );
      }

      // Temporarily disabled due to API key issues
      // if (process.env.GEMINI_API_KEY) {
      //   promises.push(
      //     callGeminiAPI(prompt)
      //       .then(content => { results.gemini = { content, status: 'success' }; })
      //       .catch(err => { results.gemini = { error: err.message, status: 'failed' }; })
      //   );
      // }

      // if (process.env.OPENAI_API_KEY) {
      //   promises.push(
      //     callOpenAI(prompt, 'gpt-3.5-turbo')
      //       .then(content => { 
      //         results.openai = { 
      //           content, 
      //           status: 'success' 
      //         }; 
      //       })
      //       .catch(err => { results.openai = { error: err.message, status: 'failed' }; })
      //   );
      // }

      await Promise.all(promises);

      return res.json({
        contentType,
        topic,
        tone,
        results
      });
    }

    // Single provider mode with fallback
    let generatedContent;
    let providerUsed = provider;

    try {
      if (provider === 'groq') {
        if (!process.env.GROQ_API_KEY) {
          return res.status(503).json({ error: 'Groq API key not configured' });
        }
        try {
          generatedContent = await callGroqAPI(prompt);
          providerUsed = 'groq';
        } catch (groqError) {
          console.error('Groq failed:', groqError.message);
          throw groqError;
        }
      } else if (provider === 'huggingface') {
        if (!process.env.HUGGINGFACE_API_KEY) {
          return res.status(503).json({ error: 'Hugging Face API key not configured' });
        }
        try {
          generatedContent = await callHuggingFaceAPI(prompt);
          providerUsed = 'huggingface';
        } catch (hfError) {
          console.error('Hugging Face failed:', hfError.message);
          throw hfError;
        }
      } else if (provider === 'cohere') {
        if (!process.env.COHERE_API_KEY) {
          return res.status(503).json({ error: 'Cohere API key not configured' });
        }
        try {
          generatedContent = await callCohereAPI(prompt);
          providerUsed = 'cohere';
        } catch (cohereError) {
          console.error('Cohere failed:', cohereError.message);
          throw cohereError;
        }
      } else if (provider === 'claude') {
        if (!process.env.ANTHROPIC_API_KEY) {
          return res.status(503).json({ error: 'Claude API key not configured' });
        }
        try {
          generatedContent = await callClaudeAPI(prompt);
          providerUsed = 'claude';
        } catch (claudeError) {
          console.error('Claude failed:', claudeError.message);
          throw claudeError;
        }
      } else if (provider === 'gemini') {
        return res.status(503).json({ error: 'Gemini API temporarily unavailable - API key expired' });
      } else {
        // OpenAI providers temporarily disabled
        return res.status(503).json({ error: 'OpenAI API temporarily unavailable - Quota exceeded' });
      }

      res.json({
        content: generatedContent,
        metadata: {
          contentType,
          topic,
          tone,
          provider: providerUsed
        }
      });

    } catch (error) {
      console.error(`${providerUsed} generation error:`, error);
      res.status(500).json({ 
        error: error.message || 'Failed to generate content' 
      });
    }

  } catch (error) {
    console.error('Generate content error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate content' 
    });
  }
});

/**
 * POST /api/ai/generate-image
 * Generate image with DALL-E
 */
router.post('/generate-image', requireAuth, async (req, res) => {
  try {
    const { clerkUserId } = req.user;
    const { prompt, style, size } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ 
        error: 'AI image service not configured' 
      });
    }

    // Generate image with DALL-E
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: size || '1024x1024',
      quality: 'standard',
      style: style || 'vivid'
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      return res.status(500).json({ error: 'Failed to generate image' });
    }

    res.json({
      imageUrl,
      metadata: {
        model: 'dall-e-3',
        size: size || '1024x1024',
        style: style || 'vivid'
      }
    });

  } catch (error) {
    console.error('Generate image error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate image' 
    });
  }
});

/**
 * Helper: Build system prompt based on content type
 */
function buildSystemPrompt(contentType, tone, length) {
  const toneInstructions = {
    professional: 'Use a professional, polished tone.',
    casual: 'Use a casual, friendly tone.',
    friendly: 'Use a warm, approachable tone.',
    authoritative: 'Use an authoritative, expert tone.',
    humorous: 'Use a humorous, entertaining tone.',
    persuasive: 'Use a persuasive, compelling tone.',
    neutral: 'Use a neutral, balanced tone.',
    uplifting: 'Use an uplifting, motivational tone.'
  };

  const lengthInstructions = {
    short: 'Keep it brief and concise (1-2 paragraphs).',
    medium: 'Provide moderate detail (3-5 paragraphs).',
    long: 'Write comprehensive content (6+ paragraphs).'
  };

  const typeInstructions = {
    'instagram-post': 'Create an engaging Instagram caption with relevant hashtags. Include emojis where appropriate.',
    'linkedin-post': 'Write a professional LinkedIn post that provides value and encourages engagement.',
    'twitter-post': 'Create a tweet under 280 characters that is engaging and shareable.',
    'blog-post': 'Write a well-structured blog post with introduction, main points, and conclusion.',
    'email-campaign': 'Create an email marketing campaign with subject line, preview text, and body.',
    'product-description': 'Write a compelling product description highlighting key features and benefits.'
  };

  return `You are an expert marketing content writer. ${toneInstructions[tone] || ''} ${lengthInstructions[length] || ''} ${typeInstructions[contentType] || 'Create high-quality marketing content.'}`;
}

/**
 * Helper: Get model based on provider
 */
function getModelFromProvider(provider) {
  const models = {
    'openai-gpt4': 'gpt-4',
    'openai-gpt3.5': 'gpt-3.5-turbo',
    'auto': 'gpt-3.5-turbo'
  };
  return models[provider] || 'gpt-3.5-turbo';
}

/**
 * Helper: Get temperature based on tone
 */
function getToneTemperature(tone) {
  const temperatures = {
    professional: 0.7,
    casual: 0.8,
    friendly: 0.8,
    authoritative: 0.6,
    humorous: 0.9,
    persuasive: 0.7,
    neutral: 0.6,
    uplifting: 0.8
  };
  return temperatures[tone] || 0.7;
}

/**
 * Helper: Get max tokens based on length
 */
function getLengthTokens(length) {
  const tokens = {
    short: 200,
    medium: 500,
    long: 1000
  };
  return tokens[length] || 500;
}

export default router;
