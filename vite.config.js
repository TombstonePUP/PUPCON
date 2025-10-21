import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
    plugins: [
        laravel({
            input: ['resources/scss/app.scss', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    build: {
        outDir: 'public/build',
        manifest: true,
    },
    resolve: {
        alias: {
            // eslint-disable-next-line no-undef
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        cors: {
            origin: [
                'http://localhost:8080',
                'http://127.0.0.1:8080',
                'http://192.168.x.x:8080',
            ],
            credentials: true,
        },
        hmr: {
            host: '192.168.x.x', // use your LAN IP, not localhost
        },
    },
}));
