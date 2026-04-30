import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'os';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Hardcoded LAN IP detection removed to allow Vite/Laravel to handle HMR dynamically

export default defineConfig(({ mode }) => ({
  plugins: [
    laravel({
      input: ['resources/scss/app.scss', 'resources/js/app.tsx'],
      ssr: 'resources/js/ssr.jsx',
      refresh: true,
      buildDirectory: 'build',
    }),
    react(),
    tailwindcss(),
  ],
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    cors: true,
    watch: {
      usePolling: true,
      interval: 500,
    },
    hmr: {
        host: 'localhost',
    },
  },
}));