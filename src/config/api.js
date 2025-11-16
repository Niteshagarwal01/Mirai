// API Configuration for development and production
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://your-backend-url.onrender.com'  // Update this with your Render backend URL
    : 'http://localhost:3001');

export default API_BASE_URL;
