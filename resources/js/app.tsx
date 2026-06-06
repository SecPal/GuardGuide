import { createInertiaApp } from '@inertiajs/react';
import type { ResolvedComponent } from '@inertiajs/react';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import {
    activateLocaleWithFallback,
    activatePreloadedLocale,
    detectLocale,
    loadAllCatalogs,
    LOCALE_STORAGE_KEY,
} from '@/i18n';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'GuardGuide';
const pages = import.meta.glob<{ default: ResolvedComponent }>(
    './pages/**/*.tsx',
);

/**
 * Read the server-resolved locale from the inlined Inertia page payload.
 * Used as one of several signals to decide which catalog to activate at
 * bootstrap; returns null when no payload is available (SSR, tests).
 */
function readSharedLocale(): string | null {
    if (typeof document === 'undefined') {
        return null;
    }

    const root = document.getElementById('app');
    const raw = root?.getAttribute('data-page');

    if (!raw) {
        return null;
    }

    try {
        const page = JSON.parse(raw) as { props?: { locale?: unknown } };
        const locale = page.props?.locale;

        return typeof locale === 'string' ? locale : null;
    } catch {
        return null;
    }
}

/**
 * Read the locale the user explicitly selected in this browser. We honour
 * this even when the server resolved a different locale, e.g. when cookies
 * are blocked but localStorage still works.
 */
function readStoredLocale(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        return window.localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch {
        return null;
    }
}

async function syncSharedLocale(locale: unknown): Promise<void> {
    if (typeof locale !== 'string' || locale === i18n.locale) {
        return;
    }

    if (activatePreloadedLocale(locale) !== null) {
        return;
    }

    await activateLocaleWithFallback(locale).catch((error: unknown) => {
        console.error('Failed to sync GuardGuide i18n locale:', error);
    });
}

async function bootstrap() {
    // Preload every supported catalog so locale switches during navigation
    // are synchronous and never flash strings from the previous catalog.
    await loadAllCatalogs();

    // Stored preference wins over the server payload so users with blocked
    // cookies still see their chosen language. The shared payload is the
    // authoritative source for first-time visitors so SSR and CSR agree.
    const initialLocale =
        readStoredLocale() ?? readSharedLocale() ?? detectLocale();

    await activateLocaleWithFallback(initialLocale);

    await createInertiaApp({
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: async (name, page) => {
            // Awaited inside resolve so the new catalog is active before
            // Inertia mounts the new page; preloaded catalogs make this a
            // synchronous activation in the common case.
            await syncSharedLocale(page?.props.locale);

            const module = await resolvePageComponent(
                `./pages/${name}.tsx`,
                pages,
            );

            return module.default;
        },
        layout: (name) => {
            switch (true) {
                case name === 'welcome':
                    return null;
                case name.startsWith('auth/'):
                    return AuthLayout;
                case name.startsWith('settings/'):
                    return [AppLayout, SettingsLayout];
                default:
                    return AppLayout;
            }
        },
        strictMode: true,
        withApp(app) {
            return (
                <I18nProvider i18n={i18n}>
                    <TooltipProvider delayDuration={0}>
                        {app}
                        <Toaster />
                    </TooltipProvider>
                </I18nProvider>
            );
        },
        progress: {
            color: '#4B5563',
        },
    });
}

void bootstrap().catch((error: unknown) => {
    console.error('Failed to bootstrap GuardGuide i18n:', error);
});

// This will set light / dark mode on load...
initializeTheme();
