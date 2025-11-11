import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // optional, your frontend port
    proxy: {
      // any request starting with /api will be forwarded to your backend
      '/api': {
        target: 'http://localhost:5000', // change to your backend port
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
