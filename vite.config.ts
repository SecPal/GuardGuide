import { existsSync } from 'node:fs';
import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

const shouldGenerateWayfinder =
    !process.env.GUARDGUIDE_SKIP_WAYFINDER && existsSync('vendor/autoload.php');

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        inertia({
            // GuardGuide does not ship an SSR entry or a built SSR bundle, so
            // we disable the @inertiajs/vite SSR endpoint and module-graph
            // warmup. Re-enable (and add resources/js/ssr.tsx) only when a
            // real Node SSR server is part of the deployment.
            ssr: false,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        ...(shouldGenerateWayfinder
            ? [
                  wayfinder({
                      formVariants: true,
                  }),
              ]
            : []),
    ],
});
