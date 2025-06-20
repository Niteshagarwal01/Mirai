import express from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from './src/db/conn.js';
import User from './src/models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch'; // Add this for making API calls to Gemini/Groq

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// API Keys
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAjgMZWNZtdpiQDxm1zz5jddalLOBp_vpY';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';

// Connect to MongoDB
connectDB();

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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    // Save user to database
    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });
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

    // Find user by email or name (for our admin user)
    let user;
    
    if (email) {
      user = await User.findOne({ email });
    } else if (name) {
      user = await User.findOne({ name });
    }
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // For our admin prototype user (who doesn't have a password)
    if (user.role === 'admin' && user.name === 'Nitesh' && !user.password) {
      // Simplified admin login for prototype (no password check)
      // In production, always use password verification
      const userResponse = {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email || '' // Handle null email
      };

      return res.status(200).json({
        success: true,
        user: userResponse,
        message: 'Admin login successful'
      });
    }

    // Verify password for regular users
    if (!user.password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }// Return user info (excluding password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.status(200).json({
      success: true,
      user: userResponse,
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
    // Get user from database (assuming you'll implement authentication with JWT later)
    // For now we'll use email or name
    const { email, name } = req.body;
    
    let user;
    
    if (email) {
      user = await User.findOne({ email });
    } else if (name) {
      user = await User.findOne({ name });
    } else {
      // For our prototype admin, use 'Nitesh' as default
      user = await User.findOne({ name: 'Nitesh' });
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
    // Get user count
    const userCount = await User.countDocuments({ role: 'user' });
    
    res.status(200).json({
      success: true,
      stats: {
        userCount,
        // Add more stats as needed
        activeUsers: Math.floor(userCount * 0.8), // Dummy data for prototype
        newSignups: Math.floor(userCount * 0.2), // Dummy data for prototype
      }
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ error: 'Server error getting dashboard data' });
  }
});

// AI Content Generation API Routes

// Generate content using AI (with fallback)
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { contentType, prompt, tone, length, userId } = req.body;
    
    console.log(`Generating ${contentType} with prompt: ${prompt}`);
    
    // Format the prompt based on content type
    const formattedPrompt = `
      Create a ${contentType} with the following details:
      Content topic: ${prompt}
      Tone: ${tone || 'professional'}
      Length: ${length || 'medium'}
      
      Ensure the content is engaging, well-structured, and optimized for ${contentType} format.
      Include appropriate hashtags and formatting where relevant.
    `;
    
    // Try Gemini API first
    try {
      const geminiResponse = await callGeminiAPI(formattedPrompt, contentType);
      
      // Save to history if userId is provided
      if (userId) {
        // Save generation history to database (simplified for now)
        console.log(`Saving content history for user ${userId}`);
        // Implement history saving logic here
      }
      
      return res.status(200).json({
        success: true,
        content: geminiResponse,
        provider: 'gemini'
      });
    } catch (geminiError) {
      console.error('Gemini API error, falling back to Groq:', geminiError);
      
      // Fallback to Groq API
      try {
        const groqResponse = await callGroqAPI(formattedPrompt, contentType);
        
        // Save to history if userId is provided
        if (userId) {
          // Save generation history logic
          console.log(`Saving content history for user ${userId}`);
        }
        
        return res.status(200).json({
          success: true,
          content: groqResponse,
          provider: 'groq'
        });
      } catch (groqError) {
        console.error('Groq API error:', groqError);
        throw new Error('Both AI providers failed to generate content');
      }
    }
  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({
      error: 'Failed to generate content. Please try again later.'
    });
  }
});

// Get content types
app.get('/api/ai/content-types', (req, res) => {
  // Return predefined content types
  const contentTypes = [
    {
      id: 'instagram-post',
      name: 'Instagram Post',
      icon: 'instagram',
      description: 'Create engaging captions and visuals optimized for Instagram\'s audience'
    },
    {
      id: 'linkedin-post',
      name: 'LinkedIn Post',
      icon: 'linkedin',
      description: 'Professional content that drives engagement and showcases expertise'
    },
    {
      id: 'twitter-post',
      name: 'Twitter Post',
      icon: 'twitter',
      description: 'Concise, engaging tweets that spark conversation and sharing'
    },
    {
      id: 'blog-post',
      name: 'Blog Post',
      icon: 'file-alt',
      description: 'In-depth content that educates your audience and builds authority'
    },
    {
      id: 'email',
      name: 'Email Copy',
      icon: 'envelope',
      description: 'Compelling email content designed to boost open and click-through rates'
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
    
    // For prototype, return mock data
    // In production, fetch from database
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

// Helper functions for AI API calls
async function callGeminiAPI(prompt, contentType) {
  try {
    // Gemini API documentation: https://ai.google.dev/tutorials/rest_quickstart
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
        }]
      })
    });
    
    const data = await response.json();
    
    // Extract the text from Gemini's response
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

async function callGroqAPI(prompt, contentType) {
  try {
    // Groq API documentation: https://console.groq.com/docs/quickstart
    const response = await fetch('https://api.groq.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{
          role: 'system',
          content: 'You are a professional content creator specializing in marketing copy.'
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 1024
      })
    });
    
    const data = await response.json();
    
    // Extract the response text from Groq
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

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
