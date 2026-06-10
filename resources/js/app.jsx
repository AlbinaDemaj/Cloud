import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route } from 'ziggy-js';

const appName = 'Cloud';

createInertiaApp({
    title: () => appName,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        window.route = route;
        window.Ziggy = props.initialPage.props.ziggy;

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});