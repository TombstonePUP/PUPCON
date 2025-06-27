import '../css/app.css';
import '../scss/app.scss';
import 'nprogress/nprogress.css'; // Optional if not already included
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './hooks/use-appearance';

declare global {
    const route: typeof routeFn;
}

createInertiaApp({
    title: (title) => `${title}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#daa520',         // Your brand color
        showSpinner: true,        // You can toggle spinner
        delay: 250,               // Delay before showing bar
    },
});

// This will set light / dark mode on load...
initializeTheme();
