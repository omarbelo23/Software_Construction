import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), // React plugin for JSX/TSX support
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Path alias for cleaner imports
    },
  },
  base: '/', // Important: ensures assets load correctly on Netlify
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // Dev only
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
