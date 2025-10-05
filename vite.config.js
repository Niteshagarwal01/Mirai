import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Changed from 5173 to avoid conflict
    host: '127.0.0.1', // Use IPv4 instead of IPv6
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Updated to match backend port
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
