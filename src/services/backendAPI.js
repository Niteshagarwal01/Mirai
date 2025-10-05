/**
 * API Service for Backend Communication
 * Base URL: http://localhost:3001
 */

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/**
 * Helper function to get Clerk auth token
 * You'll need to pass this from components using useAuth() hook
 */
const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

/**
 * User API
 */
export const userAPI = {
  /**
   * Get current user profile
   * @param {string} token - Clerk auth token
   */
  async getProfile(token) {
    const response = await fetch(`${API_BASE_URL}/api/user/me`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    return response.json();
  },

  /**
   * Get user's plan and quota status
   * @param {string} token - Clerk auth token
   */
  async getPlan(token) {
    const response = await fetch(`${API_BASE_URL}/api/user/plan`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch plan');
    }
    
    return response.json();
  }
};

/**
 * Bot API
 */
export const botAPI = {
  /**
   * Create a new bot
   * @param {string} token - Clerk auth token
   * @param {string} name - Bot name
   * @param {object} config - Bot configuration
   */
  async create(token, name, config) {
    const response = await fetch(`${API_BASE_URL}/api/bots/create`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ name, config })
    });
    
    const data = await response.json();
    
    // Handle quota exceeded
    if (response.status === 402) {
      throw new QuotaExceededError(data.message, data);
    }
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create bot');
    }
    
    return data;
  },

  /**
   * Get all bots for current user
   * @param {string} token - Clerk auth token
   */
  async getAll(token) {
    const response = await fetch(`${API_BASE_URL}/api/bots`, {
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch bots');
    }
    
    return response.json();
  },

  /**
   * Delete a bot
   * @param {string} token - Clerk auth token
   * @param {number} botId - Bot ID to delete
   */
  async delete(token, botId) {
    const response = await fetch(`${API_BASE_URL}/api/bots/${botId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete bot');
    }
    
    return response.json();
  }
};

/**
 * Payment API - Razorpay
 */
export const paymentAPI = {
  /**
   * Create Razorpay order for Pro upgrade
   * @param {string} token - Clerk auth token
   * @param {string} email - User email
   */
  async createOrder(token, email) {
    const response = await fetch(`${API_BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to create order');
    }
    
    return response.json();
  },

  /**
   * Verify Razorpay payment with signature
   * @param {object} paymentData - Payment verification data
   */
  async verifyPayment(paymentData) {
    const response = await fetch(`${API_BASE_URL}/api/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Payment verification failed');
    }
    
    return response.json();
  }
};

/**
 * Custom Error for quota exceeded (402)
 */
export class QuotaExceededError extends Error {
  constructor(message, data) {
    super(message);
    this.name = 'QuotaExceededError';
    this.data = data;
  }
}

/**
 * Health check
 */
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
};

export default {
  userAPI,
  botAPI,
  paymentAPI,
  healthCheck
};
