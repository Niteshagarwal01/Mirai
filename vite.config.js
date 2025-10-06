import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

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
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  // Add proper history API fallback for client-side routing
  preview: {
    port: 5174,
    strictPort: true,
    host: true,
    headers: {
      'Cache-Control': 'no-store',
    },
  }
})
