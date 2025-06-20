import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './src/models/User.js';

// Load environment variables
dotenv.config();

// Admin account details (feel free to change these)
const adminUser = {
  name: "Admin User",
  email: "admin@mirai.com",
  password: "Admin@123", // You should change this after creation
  role: "admin"
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    return false;
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);
    
    // Create new admin user
    const newAdmin = new User({
      name: adminUser.name,
      email: adminUser.email,
      password: hashedPassword,
      role: adminUser.role
    });
    
    // Save admin to database
    await newAdmin.save();
    console.log('✅ Admin user created successfully');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password:', adminUser.password);
    console.log('⚠️ Please change this password after first login');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

// Main function
const main = async () => {
  const connected = await connectDB();
  
  if (connected) {
    await createAdminUser();
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }
  
  process.exit(0);
};

// Run the script
main();
