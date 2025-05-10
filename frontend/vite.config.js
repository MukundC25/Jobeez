import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get port from environment variable or use default
const backendPort = process.env.JOBEEZ_BACKEND_PORT || 8766
const frontendPort = process.env.JOBEEZ_FRONTEND_PORT || 5200

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(frontendPort),
    strictPort: true, // Fail if port is already in use
    proxy: {
      '/api': {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
      }
    }
  }
})
