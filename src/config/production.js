// Production configuration - smart backend URL detection
const getBackendUrl = () => {
  // Check if we're in development mode or localhost
  if (import.meta.env.DEV || 
      (typeof window !== 'undefined' && window.location.hostname === 'localhost')) {
    return import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  }
  
  // Force production backend URL when deployed to production
  return 'https://mirai-1-m6bd.onrender.com';
};

export const API_BASE_URL = getBackendUrl();

export default {
  API_BASE_URL,
  CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_ZmlybS1tdWRmaXNoLTc1LmNsZXJrLmFjY291bnRzLmRldiQ',
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_RRq1cFdoZZUH8d',
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development'
};