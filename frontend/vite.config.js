import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // When VITE_API_URL is empty, the browser calls /api and /uploads on the frontend's own
    // address and Vite forwards them to the backend running next to it (works in Codespaces).
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
})