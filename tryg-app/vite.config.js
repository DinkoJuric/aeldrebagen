import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const baseUrl = mode === 'pages' ? '/aeldrebagen/' : './';

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'prompt', // Show update prompt instead of auto-updating
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          name: 'Tryg - Familiens Omsorg',
          short_name: 'Tryg',
          description: 'Hold øje med din familie - med omsorg og værdighed',
          theme_color: '#0d9488',
          background_color: '#f5f5f4',
          display: 'standalone',
          orientation: 'portrait',
          start_url: baseUrl, // Dynamic start_url based on deployment
          scope: baseUrl,     // Dynamic scope
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/picsum\.photos\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'daily-photos',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 // 24 hours
                }
              }
            }
          ]
        }
      })
    ],
    // Use relative paths for Capacitor, absolute for GitHub Pages
    // Run: npm run build:pages for GitHub Pages deployment
    base: baseUrl,
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    // Allow external hosts for tunneling (localtunnel, ngrok, etc.)
    server: {
      allowedHosts: 'all'
    }
  };
});
