import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the JSON file
const DB_FILE_PATH = path.join(__dirname, 'localUsers.json');

// Initialize database if it doesn't exist
const initializeDb = () => {
  if (!fs.existsSync(DB_FILE_PATH)) {
    const initialData = {
      users: [
        {
          id: "admin-local-bypass-1",
          name: "Nitesh",
          email: "admin@mirai.com",
          password: "$2a$10$XuYqGYXTfiSrQQA.8S6Gcuhi4Lfbr5O0oi/ZSpEZw58iXlcGuTmgW", // hashed 'Admin@123'
          role: "admin",
          createdAt: new Date().toISOString()
        }
      ],
      contentHistory: [],
      campaigns: []
    };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialData, null, 2));
  }
};

// Read database
const readDb = () => {
  initializeDb();
  const data = fs.readFileSync(DB_FILE_PATH, 'utf8');
  return JSON.parse(data);
};

// Write to database
const writeDb = (data) => {
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2));
};

// User operations
const userOperations = {
  // Find a user by email or ID
  findUser: (identifier) => {
    const db = readDb();
    return db.users.find(user => 
      user.email === identifier || 
      user.id === identifier ||
      user.name === identifier
    );
  },
  
  // Find a user by a specific field
  findUserBy: (field, value) => {
    const db = readDb();
    return db.users.find(user => user[field] === value);
  },
  
  // Get all users
  getAllUsers: () => {
    const db = readDb();
    // Return users without passwords
    return db.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  },
  
  // Get users count
  countUsers: () => {
    const db = readDb();
    return db.users.length;
  },
  
  // Get count of users with a specific role
  countUsersByRole: (role) => {
    const db = readDb();
    return db.users.filter(user => user.role === role).length;
  },
  
  // Add a new user
  createUser: async (userData) => {
    const db = readDb();
    
    // Check if user already exists
    const existingUser = db.users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password if provided
    let hashedPassword = null;
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(userData.password, salt);
    }
    
    // Create new user
    const newUser = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'user',
      createdAt: new Date().toISOString()
    };
    
    // Add user to database
    db.users.push(newUser);
    writeDb(db);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
  
  // Verify user credentials
  verifyUser: async (email, password) => {
    const db = readDb();
    
    // Find user by email
    const user = db.users.find(user => user.email === email);
    if (!user) {
      return false;
    }
    
    // Special case for admin with name "Nitesh"
    if (user.role === 'admin' && user.name === 'Nitesh' && !user.password) {
      return user;
    }
    
    // Verify password
    if (!user.password) return false;
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return false;
    
    // Return user without password
    const { password: userPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};

// Dashboard operations
const dashboardOperations = {  // Get dashboard stats
  getDashboardStats: () => {
    const db = readDb();
    
    const totalUsers = db.users.filter(user => user.role === 'user').length;
      // Calculate active users - ensure it's never more than the total users
    // With only a few users, this means most are active but never more than the total
    const activeUsers = Math.min(totalUsers, Math.ceil(totalUsers * 0.8));
    
    // Get actual campaign count
    const campaigns = db.campaigns ? db.campaigns.length : 0;
    
    // Calculate new signups (users created in the last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newSignups = db.users.filter(user => {
      const userCreatedAt = new Date(user.createdAt);
      return userCreatedAt > oneWeekAgo;
    }).length;
    
    return {
      userCount: totalUsers, 
      activeUsers,
      campaigns,
      newSignups
    };
  }
};

// Content history operations
const contentOperations = {
  // Add content to history
  addContentHistory: (content) => {
    const db = readDb();
    
    // Initialize contentHistory if it doesn't exist
    if (!db.contentHistory) db.contentHistory = [];
    
    db.contentHistory.push({
      id: uuidv4(),
      ...content,
      createdAt: new Date().toISOString()
    });
    
    writeDb(db);
    return db.contentHistory[db.contentHistory.length - 1];
  },
  
  // Get content history for a user
  getContentHistoryForUser: (userId) => {
    const db = readDb();
    return db.contentHistory ? 
      db.contentHistory.filter(content => content.userId === userId) : [];
  },
  
  // Get all content history
  getAllContentHistory: () => {
    const db = readDb();
    return db.contentHistory || [];
  }
};

// Campaign operations
const campaignOperations = {
  // Add a new campaign
  addCampaign: (campaign) => {
    const db = readDb();
    
    // Initialize campaigns if it doesn't exist
    if (!db.campaigns) db.campaigns = [];
    
    const newCampaign = {
      id: uuidv4(),
      ...campaign,
      createdAt: new Date().toISOString()
    };
    
    db.campaigns.push(newCampaign);
    writeDb(db);
    return newCampaign;
  },
  
  // Get all campaigns
  getAllCampaigns: () => {
    const db = readDb();
    return db.campaigns || [];
  },
  
  // Get campaigns count
  countCampaigns: () => {
    const db = readDb();
    return db.campaigns ? db.campaigns.length : 0;
  },
  
  // Initialize default campaigns
  initializeCampaigns: () => {
    const db = readDb();
    
    // Only add default campaigns if there aren't any already
    if (!db.campaigns || db.campaigns.length === 0) {
      const defaultCampaigns = [
        {
          id: uuidv4(),
          name: "Summer Collection Launch",
          platform: "Instagram",
          status: "active",
          startDate: "2025-06-01T00:00:00.000Z",
          endDate: "2025-07-15T00:00:00.000Z",
          createdAt: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: "Email Marketing Drive",
          platform: "Email",
          status: "active",
          startDate: "2025-05-20T00:00:00.000Z",
          endDate: "2025-06-30T00:00:00.000Z",
          createdAt: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: "Product Demo Webinar",
          platform: "LinkedIn",
          status: "upcoming",
          startDate: "2025-07-01T00:00:00.000Z",
          endDate: "2025-07-01T00:00:00.000Z",
          createdAt: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: "Blog Content Series",
          platform: "Website",
          status: "active",
          startDate: "2025-04-15T00:00:00.000Z",
          endDate: "2025-07-15T00:00:00.000Z",
          createdAt: new Date().toISOString()
        }
      ];
      
      // Add campaigns to database
      if (!db.campaigns) db.campaigns = [];
      db.campaigns = [...defaultCampaigns];
      writeDb(db);
      console.log('✅ Default campaigns initialized');
      return defaultCampaigns;
    }
    
    return db.campaigns;
  },
};

// Initialize db on module load
initializeDb();

export {
  userOperations,
  dashboardOperations,
  contentOperations,
  campaignOperations
};
