import express from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from './src/db/conn.js';
import User from './src/models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

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
