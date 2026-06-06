import { useSyncExternalStore } from 'react';

export type ResolvedAppearance = 'light' | 'dark';
export type Appearance = ResolvedAppearance | 'system';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    readonly updateAppearance: (mode: Appearance) => void;
};

type BrowserAppearanceAssetSet = {
    readonly icon32: string;
    readonly icon192: string;
    readonly icon512: string;
    readonly manifest: string;
    readonly themeColor: string;
};

declare global {
    interface Window {
        __guardGuideBrowserAppearance?: ResolvedAppearance;
    }
}

const BROWSER_APPEARANCE_ASSETS: Record<
    ResolvedAppearance,
    BrowserAppearanceAssetSet
> = {
    light: {
        icon32: '/brand/guardguide/symbol-light-32.png',
        icon192: '/icons/guardguide-192.png',
        icon512: '/icons/guardguide-512.png',
        manifest: '/manifest.webmanifest?appearance=light',
        themeColor: '#FFFFFF',
    },
    dark: {
        icon32: '/brand/guardguide/symbol-dark-32.png',
        icon192: '/icons/guardguide-dark-192.png',
        icon512: '/icons/guardguide-dark-512.png',
        manifest: '/manifest.webmanifest?appearance=dark',
        themeColor: '#011B2E',
    },
};

const MANAGED_BROWSER_APPEARANCE_ICON_HREFS = new Set<string>([
    BROWSER_APPEARANCE_ASSETS.light.icon32,
    BROWSER_APPEARANCE_ASSETS.light.icon192,
    BROWSER_APPEARANCE_ASSETS.light.icon512,
    BROWSER_APPEARANCE_ASSETS.dark.icon32,
    BROWSER_APPEARANCE_ASSETS.dark.icon192,
    BROWSER_APPEARANCE_ASSETS.dark.icon512,
]);

const listeners = new Set<() => void>();
let currentAppearance: Appearance = 'system';

const prefersDark = (): boolean => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const isAppearance = (value: string | null): value is Appearance => {
    return value === 'system' || value === 'light' || value === 'dark';
};

const getCookieAppearance = (): Appearance | null => {
    if (typeof document === 'undefined') {
        return null;
    }

    const appearanceCookie =
        document.cookie
            .split('; ')
            .find((cookie) => cookie.startsWith('appearance='))
            ?.slice('appearance='.length) ?? null;

    return isAppearance(appearanceCookie) ? appearanceCookie : null;
};

const getStoredAppearance = (): Appearance => {
    if (typeof window === 'undefined') {
        return 'system';
    }

    const storedAppearance = localStorage.getItem('appearance');

    if (isAppearance(storedAppearance)) {
        return storedAppearance;
    }

    return getCookieAppearance() ?? 'system';
};

const isDarkMode = (appearance: Appearance): boolean => {
    return appearance === 'dark' || (appearance === 'system' && prefersDark());
};

const clearBrowserAppearanceTags = (): void => {
    Array.from(
        document.head.querySelectorAll<HTMLLinkElement>('link[rel="icon"]'),
    ).forEach((link) => {
        const href = link.getAttribute('href');

        if (href && MANAGED_BROWSER_APPEARANCE_ICON_HREFS.has(href)) {
            link.remove();
        }
    });

    Array.from(
        document.head.querySelectorAll<HTMLLinkElement>('link[rel="manifest"]'),
    ).forEach((link) => {
        if (
            link
                .getAttribute('href')
                ?.startsWith('/manifest.webmanifest?appearance=')
        ) {
            link.remove();
        }
    });

    Array.from(
        document.head.querySelectorAll<HTMLMetaElement>(
            'meta[name="theme-color"]',
        ),
    ).forEach((meta) => {
        const media = meta.getAttribute('media');
        const content = meta.getAttribute('content');

        if (
            media?.includes('prefers-color-scheme') ||
            content === BROWSER_APPEARANCE_ASSETS.light.themeColor ||
            content === BROWSER_APPEARANCE_ASSETS.dark.themeColor
        ) {
            meta.remove();
        }
    });
};

const createIconLink = (sizes: string, href: string): HTMLLinkElement => {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.setAttribute('sizes', sizes);
    link.href = href;

    return link;
};

const createManifestLink = (href: string): HTMLLinkElement => {
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = href;

    return link;
};

const createThemeColorMeta = (content: string): HTMLMetaElement => {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = content;

    return meta;
};

const syncBrowserAppearance = (appearance: Appearance): void => {
    if (typeof window === 'undefined') {
        return;
    }

    const resolvedAppearance: ResolvedAppearance = isDarkMode(appearance)
        ? 'dark'
        : 'light';
    const assets = BROWSER_APPEARANCE_ASSETS[resolvedAppearance];
    const fragment = document.createDocumentFragment();

    window.__guardGuideBrowserAppearance = resolvedAppearance;

    clearBrowserAppearanceTags();

    fragment.append(
        createIconLink('32x32', assets.icon32),
        createIconLink('192x192', assets.icon192),
        createIconLink('512x512', assets.icon512),
        createManifestLink(assets.manifest),
        createThemeColorMeta(assets.themeColor),
    );

    document.head.append(fragment);
};

const applyTheme = (appearance: Appearance): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const isDark = isDarkMode(appearance);

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    syncBrowserAppearance(appearance);
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

const mediaQuery = (): MediaQueryList | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = (): void => applyTheme(currentAppearance);

export function initializeTheme(): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (!localStorage.getItem('appearance')) {
        const cookieAppearance = getCookieAppearance();
        const initialAppearance = cookieAppearance ?? 'system';

        localStorage.setItem('appearance', initialAppearance);

        if (!cookieAppearance) {
            setCookie('appearance', initialAppearance);
        }
    }

    currentAppearance = getStoredAppearance();
    applyTheme(currentAppearance);

    // Set up system theme change listener
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance(): UseAppearanceReturn {
    const appearance: Appearance = useSyncExternalStore(
        subscribe,
        () => currentAppearance,
        () => 'system',
    );

    const resolvedAppearance: ResolvedAppearance = isDarkMode(appearance)
        ? 'dark'
        : 'light';

    const updateAppearance = (mode: Appearance): void => {
        currentAppearance = mode;

        // Store in localStorage for client-side persistence...
        localStorage.setItem('appearance', mode);

        // Store in cookie for SSR...
        setCookie('appearance', mode);

        applyTheme(mode);
        notify();
    };

    return { appearance, resolvedAppearance, updateAppearance } as const;
}
