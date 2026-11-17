import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Keep this plain-CSS homepage independent of the unused Next.js scaffold.
  css: { postcss: { plugins: [] } },
  // The backend from ../backend serves /api on port 3000.
  server: { port: 5173, proxy: { '/api': 'http://localhost:3000' } },
  preview: { proxy: { '/api': 'http://localhost:3000' } },
})
