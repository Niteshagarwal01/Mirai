// Production configuration - forces correct backend URL
const getBackendUrl = () => {
  // Force production backend URL when deployed
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return 'https://mirai-1-m6bd.onrender.com';
  }
  
  // Use environment variable or fallback to localhost for development
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
};

export const API_BASE_URL = getBackendUrl();

export default {
  API_BASE_URL,
  CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_ZmlybS1tdWRmaXNoLTc1LmNsZXJrLmFjY291bnRzLmRldiQ',
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_RRq1cFdoZZUH8d',
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'production'
};