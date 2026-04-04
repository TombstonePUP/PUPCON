import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
        const interfaceInfo = interfaces[name];
        for (const { family, address, internal } of interfaceInfo) {
            if (family === 'IPv4' && !internal) {
                return address;
            }
        }
    }
    return '127.0.0.1';
}

const LAN_IP = getLocalIp();

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
    /* build: {
        outDir: 'build',
        manifest: true,
    }, */
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
        cors: true,
        hmr: {
            host: LAN_IP,
        },
    },
}));
