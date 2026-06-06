<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = @json($appearance ?? 'system');

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        @php
            $browserAppearance = $appearance ?? 'system';
            $usesSystemBrowserAppearance = $browserAppearance === 'system';
            $usesDarkBrowserAppearance = $browserAppearance === 'dark';
        @endphp

        <link rel="icon" href="/favicon.ico" sizes="any">
        @if ($usesSystemBrowserAppearance)
            <link rel="icon" type="image/png" sizes="32x32" href="/brand/guardguide/symbol-light-32.png" media="(prefers-color-scheme: light)">
            <link rel="icon" type="image/png" sizes="32x32" href="/brand/guardguide/symbol-dark-32.png" media="(prefers-color-scheme: dark)">
            <link rel="icon" type="image/png" sizes="192x192" href="/icons/guardguide-192.png" media="(prefers-color-scheme: light)">
            <link rel="icon" type="image/png" sizes="512x512" href="/icons/guardguide-512.png" media="(prefers-color-scheme: light)">
            <link rel="icon" type="image/png" sizes="192x192" href="/icons/guardguide-dark-192.png" media="(prefers-color-scheme: dark)">
            <link rel="icon" type="image/png" sizes="512x512" href="/icons/guardguide-dark-512.png" media="(prefers-color-scheme: dark)">
        @else
            <link rel="icon" type="image/png" sizes="32x32" href="{{ $usesDarkBrowserAppearance ? '/brand/guardguide/symbol-dark-32.png' : '/brand/guardguide/symbol-light-32.png' }}">
            <link rel="icon" type="image/png" sizes="192x192" href="{{ $usesDarkBrowserAppearance ? '/icons/guardguide-dark-192.png' : '/icons/guardguide-192.png' }}">
            <link rel="icon" type="image/png" sizes="512x512" href="{{ $usesDarkBrowserAppearance ? '/icons/guardguide-dark-512.png' : '/icons/guardguide-512.png' }}">
        @endif
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="manifest" href="/site.webmanifest">
        @if ($usesSystemBrowserAppearance)
            <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)">
            <meta name="theme-color" content="#011B2E" media="(prefers-color-scheme: dark)">
        @else
            <meta name="theme-color" content="{{ $usesDarkBrowserAppearance ? '#011B2E' : '#FFFFFF' }}">
        @endif
        <meta name="application-name" content="{{ config('app.name', 'GuardGuide') }}">
        <meta name="apple-mobile-web-app-title" content="{{ config('app.name', 'GuardGuide') }}">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'GuardGuide') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
