import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const forPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  base: forPages ? '/grcquiz/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['shield.svg'],
      manifest: {
        name: 'GRC Quiz — Auditor Quest',
        short_name: 'GRC Quiz',
        description: 'Gra do nauki: IT Audyt i GRC oraz Bezpieczeństwo IT w sektorze publicznym',
        theme_color: '#0c1017',
        background_color: '#0c1017',
        display: 'standalone',
        orientation: 'portrait-primary',
        lang: 'pl',
        start_url: forPages ? '/grcquiz/' : '/',
        scope: forPages ? '/grcquiz/' : '/',
        icons: [
          {
            src: 'shield.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'shield.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff,txt}'],
        navigateFallback: forPages ? '/grcquiz/index.html' : '/index.html',
      },
    }),
  ],
  server: {
    port: 5174,
    open: true,
  },
});
