import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  // Use relative paths for Capacitor, absolute for GitHub Pages
  // Run: npm run build:pages for GitHub Pages deployment
  base: mode === 'pages' ? '/aeldrebagen/' : './',
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  // Allow external hosts for tunneling (localtunnel, ngrok, etc.)
  server: {
    allowedHosts: 'all'
  }
}))
