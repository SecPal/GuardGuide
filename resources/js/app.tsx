import { createInertiaApp } from '@inertiajs/react';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import { activateLocaleWithFallback, detectLocale } from '@/i18n';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'GuardGuide';

async function bootstrap() {
    await activateLocaleWithFallback(detectLocale());

    await createInertiaApp({
        title: (title) => (title ? `${title} - ${appName}` : appName),
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
