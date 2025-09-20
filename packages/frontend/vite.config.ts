import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico', 
        'skateboard.svg', 
        'apple-touch-icon.png', 
        'masked-icon.svg'
      ],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff,ttf}'],
        runtimeCaching: [
          // API Cache
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              networkTimeoutSeconds: 10
            }
          },
          // Backend API Cache
          {
            urlPattern: /^https?:\/\/.*\/api\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'backend-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 12 // 12 hours
              },
              networkTimeoutSeconds: 10
            }
          },
          // Firebase Cache
          {
            urlPattern: /^https:\/\/.*\.firebaseapp\.com\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'firebase-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          },
          // Google Fonts Cache
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          // Images Cache
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          // YouTube Thumbnails (para os tutoriais)
          {
            urlPattern: /^https:\/\/i\.ytimg\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'youtube-thumbnails',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          }
        ],
        // Arquivos para cache offline
        additionalManifestEntries: [
          { url: '/offline.html', revision: null }
        ],
        navigateFallback: '/offline.html',
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/]
      },
      manifest: {
        name: 'Skate App - Plataforma para Skatistas',
        short_name: 'Skate App',
        description: 'A plataforma completa para skatistas - Jogue, aprenda e conecte-se!',
        theme_color: '#8b5cf6',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        lang: 'pt-BR',
        categories: ['sports', 'games', 'lifestyle', 'education'],
        shortcuts: [
          {
            name: 'Jogar',
            short_name: 'Game',
            description: 'Iniciar jogo de skate',
            url: '/game',
            icons: [{ src: '/icons/shortcut-game-96x96.png', sizes: '96x96' }]
          },
          {
            name: 'Tutoriais',
            short_name: 'Tutoriais',
            description: 'Aprender novas manobras',
            url: '/tutorials',
            icons: [{ src: '/icons/shortcut-tutorials-96x96.png', sizes: '96x96' }]
          },
          {
            name: 'Skateparks',
            short_name: 'Spots',
            description: 'Encontrar skateparks',
            url: '/skateparks',
            icons: [{ src: '/icons/shortcut-map-96x96.png', sizes: '96x96' }]
          },
          {
            name: 'Ranking',
            short_name: 'Ranking',
            description: 'Ver classificação',
            url: '/ranking',
            icons: [{ src: '/icons/shortcut-ranking-96x96.png', sizes: '96x96' }]
          }
        ],
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/maskable-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      devOptions: {
        enabled: false // Desabilitar PWA em desenvolvimento para melhor performance
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          router: ['react-router-dom'],
          pwa: ['workbox-window']
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 3000,
    host: true,
  },
})