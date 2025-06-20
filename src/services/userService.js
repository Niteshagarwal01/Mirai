// API service for user operations
const API_URL = '/api';

export const userService = {
  // Register new user
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
};

export default userService;
