import express from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
// Using file-based DB instead of MongoDB
import { userOperations, dashboardOperations, contentOperations, campaignOperations } from './src/db/fileDb.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch'; // Add this for making API calls to Gemini/Groq

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// API Keys
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAjgMZWNZtdpiQDxm1zz5jddalLOBp_vpY';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || '';

console.log('✅ File-based DB initialized successfully');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// User Registration Route
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    try {
      // Create new user using file DB
      const newUser = await userOperations.createUser({
        name,
        email,
        password,
        role: 'user'
      });
        // Get updated user count for localStorage backup
      const userCount = userOperations.countUsersByRole('user');
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: newUser,
        userCount: userCount // Send user count to client for localStorage backup
      });
    } catch (error) {
      if (error.message === 'User with this email already exists') {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
      throw error; // Re-throw for the outer catch
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Server error during registration'
    });
  }
});

// User Login Route
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check admin bypass login
    const isAdminEmail = email === 'admin@mirai.com' || 
                        email === 'admin' || 
                        email === 'Nitesh' ||
                        name === 'Nitesh';
    
    const isAdminPassword = password === 'Admin@123' || 
                          password === 'admin123' || 
                          password === 'password';
    
    // Special admin bypass login
    if (isAdminEmail && isAdminPassword) {
      console.log('Admin bypass login');
      
      // Check if admin exists, otherwise use default admin
      let adminUser = userOperations.findUser('Nitesh') || 
                     userOperations.findUser('admin@mirai.com');
        // If admin doesn't exist in file db, use the admin from localUsers.json
      if (!adminUser) {
        adminUser = {
          id: 'admin-local-bypass-1', // Use the same ID as in localUsers.json
          name: 'Nitesh',
          email: 'admin@mirai.com',
          role: 'admin'
        };
      }
      
      // Log the admin details for debugging
      console.log('Admin login successful:', adminUser);
      
      return res.status(200).json({
        success: true,
        user: adminUser,
        message: 'Admin login successful'
      });
    }

    // Regular user login
    let identifier = email || name;
    let user = await userOperations.verifyUser(identifier, password);
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Return success with user info
    res.status(200).json({
      success: true,
      user: user,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Server error during login'
    });
  }
});

// Admin authentication middleware
const isAdmin = async (req, res, next) => {
  try {
    // Get user from request body (for API calls) or query params (for direct requests)
    const { email, name, userId } = req.body || req.query || {};
    
    // Handle admin bypass case for the admin dashboard
    if (userId && (userId.includes('admin-local-bypass') || userId === 'admin-local-bypass-1')) {
      return next();
    }
    
    // Find user in file DB
    let user;
    
    if (email) {
      user = userOperations.findUser(email);
    } else if (name) {
      user = userOperations.findUser(name);
    } else {
      // For our prototype admin, use 'Nitesh' as default
      user = userOperations.findUser('Nitesh');
    }
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ error: 'Server error during authentication' });
  }
};

// Admin Dashboard Data Route (protected)
app.post('/api/admin/dashboard', isAdmin, async (req, res) => {
  try {
    // Get dashboard stats from fileDb system
    const stats = dashboardOperations.getDashboardStats();
      // Get the actual values from the file-based DB
    res.status(200).json({
      success: true,
      stats: {
        userCount: stats.userCount,  // Real value from fileDb
        activeUsers: stats.activeUsers,  // Real value from fileDb
        campaigns: stats.campaigns,  // Real value from fileDb
        newSignups: stats.newSignups  // Real value from fileDb
      }
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ error: 'Server error getting dashboard data' });
  }
});

// AI Content Generation API Routes

// Input validation function
function validateContentInput(req, res, next) {
  const { contentType, prompt } = req.body;
  
  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).json({
      error: 'Please provide a prompt for content generation'
    });
  }
  
  if (prompt.trim().length < 10) {
    return res.status(400).json({
      error: 'Please provide a more detailed prompt (at least 10 characters)'
    });
  }
  
  if (!contentType) {
    return res.status(400).json({
      error: 'Please select a content type'
    });
  }
  
  next();
}

// Get available AI providers
app.get('/api/ai/providers', (req, res) => {
  const providers = [
    { 
      id: 'auto', 
      name: 'Auto (Best Available)', 
      description: 'Automatically selects the best available AI provider',
      status: 'available'
    },
    { 
      id: 'openai', 
      name: 'OpenAI GPT', 
      description: 'High-quality content generation',
      status: OPENAI_API_KEY ? 'available' : 'unavailable'
    },
    { 
      id: 'gemini', 
      name: 'Google Gemini', 
      description: 'Fast and efficient content creation',
      status: GEMINI_API_KEY ? 'available' : 'unavailable'
    },
    { 
      id: 'groq', 
      name: 'Groq', 
      description: 'Fast inference AI models',
      status: GROQ_API_KEY ? 'available' : 'unavailable'
    },
    { 
      id: 'huggingface', 
      name: 'Hugging Face', 
      description: 'Open-source AI models',
      status: HUGGINGFACE_API_KEY ? 'available' : 'unavailable'
    }
  ];
  
  res.status(200).json({
    success: true,
    providers
  });
});

// Generate content using AI (with multiple provider support)
app.post('/api/ai/generate', validateContentInput, async (req, res) => {
  try {
    const { contentType, prompt, tone = 'professional', length = 'medium', userId, provider = 'auto' } = req.body;
    
    console.log(`Generating ${contentType} with provider: ${provider}, prompt: ${prompt.substring(0, 50)}...`);
    
    // Format the prompt based on content type
    const formattedPrompt = buildPrompt(contentType, prompt.trim(), tone, length);
    
    let result;
    let usedProvider;
    
    // Determine which provider to use
    if (provider === 'auto') {
      // Try providers in order of preference
      const providerOrder = ['gemini', 'groq', 'openai', 'huggingface'];
      
      for (const prov of providerOrder) {
        try {
          result = await callAIProvider(prov, formattedPrompt, contentType);
          usedProvider = prov;
          break;
        } catch (error) {
          console.log(`Provider ${prov} failed, trying next...`);
          continue;
        }
      }
      
      if (!result) {
        throw new Error('All AI providers failed to generate content');
      }
    } else {
      // Use specific provider
      result = await callAIProvider(provider, formattedPrompt, contentType);
      usedProvider = provider;
    }
    
    // Save to history if userId is provided
    if (userId && result) {
      console.log(`Saving content history for user ${userId}`);
      contentOperations.addContentHistory({
        userId,
        contentType,
        prompt: prompt.trim(),
        content: result,
        provider: usedProvider
      });
    }
    
    return res.status(200).json({
      success: true,
      content: result,
      provider: usedProvider,
      tokens: null // Can be implemented for token counting
    });
    
  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate content. Please try again later.'
    });
  }
});

// Helper function to build prompts based on content type
function buildPrompt(contentType, prompt, tone, length) {
  const lengthInstructions = {
    'short': 'Keep it concise and brief.',
    'medium': 'Provide a moderate amount of detail.',
    'long': 'Create comprehensive and detailed content.'
  };
  
  const contentTypeInstructions = {
    'instagram-post': 'Create an engaging Instagram post with appropriate hashtags. Include emojis where suitable.',
    'linkedin-post': 'Write a professional LinkedIn post that drives engagement and showcases expertise.',
    'twitter-post': 'Create a concise, engaging tweet that sparks conversation. Keep it under 280 characters.',
    'blog-post': 'Write an in-depth blog post with proper structure, headings, and engaging content.',
    'email-campaign': 'Create a professional email marketing campaign with subject line and body.',
    'product-description': 'Write a compelling product description that highlights benefits and features.',
    'business-plan': 'Create a comprehensive business plan with detailed sections and analysis.'
  };
  
  return `
You are a professional content creator. Create ${contentType.replace('-', ' ')} content with the following requirements:

Topic: ${prompt}
Tone: ${tone}
Length: ${length} - ${lengthInstructions[length] || lengthInstructions.medium}

Instructions: ${contentTypeInstructions[contentType] || 'Create engaging, high-quality content.'}

Please provide only the content without any meta-commentary or explanations.
  `.trim();
}

// Universal AI provider caller
async function callAIProvider(provider, prompt, contentType) {
  switch (provider) {
    case 'openai':
      if (!OPENAI_API_KEY) throw new Error('OpenAI API key not configured');
      return await callOpenAIAPI(prompt, contentType);
    case 'gemini':
      if (!GEMINI_API_KEY) throw new Error('Gemini API key not configured');
      return await callGeminiAPI(prompt, contentType);
    case 'groq':
      if (!GROQ_API_KEY) throw new Error('Groq API key not configured');
      return await callGroqAPI(prompt, contentType);
    case 'huggingface':
      if (!HUGGINGFACE_API_KEY) throw new Error('Hugging Face API key not configured');
      return await callHuggingFaceAPI(prompt, contentType);
    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}
        


// Get content types
app.get('/api/ai/content-types', (req, res) => {
  // Return predefined content types with image paths
  const contentTypes = [
    {
      id: 'instagram-post',
      name: 'Instagram Post',
      icon: 'instagram',
      image: '/src/assets/insta.jpeg',
      description: 'Create engaging captions and visuals optimized for Instagram\'s audience'
    },
    {
      id: 'linkedin-post',
      name: 'LinkedIn Post',
      icon: 'linkedin',
      image: '/src/assets/LinkedIn-Logo-2-scaled.jpg',
      description: 'Professional content that drives engagement and showcases expertise'
    },
    {
      id: 'twitter-post',
      name: 'Twitter Post',
      icon: 'twitter',
      image: '/src/assets/twitter.jpeg',
      description: 'Concise, engaging tweets that spark conversation and sharing'
    },
    {
      id: 'blog-post',
      name: 'Blog Post',
      icon: 'file-alt',
      image: '/src/assets/blogpost.jpeg',
      description: 'In-depth content that educates your audience and builds authority'
    }
  ];
  
  res.status(200).json({
    success: true,
    contentTypes
  });
});

// Get content history
app.get('/api/ai/history', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // For file-based system, use the mock data for all users
    const mockHistory = [
      {
        id: '1',
        userId,
        contentType: 'instagram-post',
        prompt: 'New summer collection launch',
        content: 'Summer vibes just dropped! 🌞 Our new collection is here to elevate your seasonal style. Swipe to see more and let us know your favorite piece in the comments! #NewCollection #SummerStyle',
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: '2',
        userId,
        contentType: 'blog-post',
        prompt: 'Digital marketing trends 2025',
        content: '# Top Digital Marketing Trends for 2025\n\nAs we move further into the digital age, marketing strategies continue to evolve at a rapid pace...',
        createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      },
      {
        id: '3',
        userId,
        contentType: 'twitter-post',
        prompt: 'AI assistant product launch',
        content: 'Excited to announce our new AI assistant! It\'s going to revolutionize how you work. Early access sign-ups open now! #AIAssistant #ProductLaunch #Innovation',
        createdAt: new Date(Date.now() - 259200000).toISOString() // 3 days ago
      },
      {
        id: '4',
        userId,
        contentType: 'linkedin-post',
        prompt: 'Industry leadership insights',
        content: 'I\'m excited to share some key insights from our latest industry research.\n\nOur team found that companies embracing AI are seeing a 40% increase in productivity.\n\nWhat has been your experience with AI adoption? Share in the comments below!\n\n#AIInnovation #Leadership #IndustryInsights',
        createdAt: new Date(Date.now() - 345600000).toISOString() // 4 days ago
      }
    ];
    
    res.status(200).json({
      success: true,
      history: mockHistory
    });
    
  } catch (error) {
    console.error('Error fetching content history:', error);
    res.status(500).json({
      error: 'Failed to fetch content history'
    });
  }
});

// Get Users List Route (protected)
app.get('/api/admin/users', isAdmin, (req, res) => {
  try {
    // Get all users from file DB
    const users = userOperations.getAllUsers();
    
    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error getting users data' });
  }
});

// Get User Count Route
app.get('/api/stats/user-count', (req, res) => {
  try {
    // Get user count from file DB
    const userCount = userOperations.countUsersByRole('user');
    
    res.status(200).json({
      success: true,
      userCount
    });
  } catch (error) {
    console.error('Get user count error:', error);
    res.status(500).json({ error: 'Server error getting user count' });
  }
});

// Helper functions for AI API calls

// OpenAI API caller
async function callOpenAIAPI(prompt, contentType) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional content creator specializing in marketing copy and business content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });
    
    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      throw new Error('Unexpected response format from OpenAI API');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

// Updated Gemini API caller
async function callGeminiAPI(prompt, contentType) {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        }
      })
    });
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected response format from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

// Updated Groq API caller
async function callGroqAPI(prompt, contentType) {
  try {
    const response = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{
          role: 'system',
          content: 'You are a professional content creator specializing in marketing copy and business content.'
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 1500
      })
    });
    
    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      throw new Error('Unexpected response format from Groq API');
    }
  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
}

// Hugging Face API caller
async function callHuggingFaceAPI(prompt, contentType) {
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 1500,
          temperature: 0.7,
          return_full_text: false
        }
      })
    });
    
    const data = await response.json();
    
    if (Array.isArray(data) && data[0] && data[0].generated_text) {
      return data[0].generated_text;
    } else if (data.generated_text) {
      return data.generated_text;
    } else {
      throw new Error('Unexpected response format from Hugging Face API');
    }
  } catch (error) {
    console.error('Hugging Face API error:', error);
    throw error;
  }
}

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

// Initialize default campaigns if there are none
campaignOperations.initializeCampaigns();

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
