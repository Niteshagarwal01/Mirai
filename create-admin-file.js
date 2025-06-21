import bcrypt from 'bcryptjs';
import { userOperations } from './src/db/fileDb.js';

// Admin account details
const adminUser = {
  name: "Admin User",
  email: "admin@mirai.com", 
  password: "Admin@123", // You should change this after creation
  role: "admin"
};

// Create admin user
const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = userOperations.findUser(adminUser.email);
    
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      return;
    }
    
    // Create admin user using our fileDb system
    const newAdmin = await userOperations.createUser(adminUser);
    
    console.log('✅ Admin user created successfully');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${adminUser.password}`);
    console.log('Remember to change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

// Also create the default Nitesh admin (for demo purposes)
const createNiteshAdmin = async () => {
  try {
    // Check if Nitesh admin already exists
    const existingNitesh = userOperations.findUser('Nitesh');
    
    if (existingNitesh) {
      console.log('⚠️ Nitesh admin user already exists');
      return;
    }
    
    // Create Nitesh admin
    const niteshAdmin = await userOperations.createUser({
      name: "Nitesh",
      email: "nitesh@mirai.com",
      password: "admin123",
      role: "admin"
    });
    
    console.log('✅ Nitesh admin user created successfully');
    
  } catch (error) {
    console.error('❌ Error creating Nitesh admin user:', error.message);
  }
};

// Run both admin creation functions
const createAdmins = async () => {
  await createAdminUser();
  await createNiteshAdmin();
  
  // Create a regular test user as well
  try {
    const existingUser = userOperations.findUser('testuser@example.com');
    
    if (!existingUser) {
      await userOperations.createUser({
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
        role: "user"
      });
      console.log('✅ Test user created successfully');
    }
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  }
  
  console.log('✅ Admin setup complete');
  process.exit(0);
};

createAdmins();
