import { i18n } from '@lingui/core';

export const locales = {
    en: 'English',
    de: 'Deutsch',
} as const;

export type Locale = keyof typeof locales;

export const defaultLocale: Locale = 'en';

export const LOCALE_COOKIE = 'locale';
export const LOCALE_STORAGE_KEY = 'locale';

export type BrowserLocaleSource = {
    language?: string | null;
    languages?: readonly string[];
};

type Messages = Record<string, string | string[]>;

function isLocale(value: string): value is Locale {
    return Object.hasOwn(locales, value);
}

function normalizeLocale(value: string | null | undefined): Locale | null {
    if (!value) {
        return null;
    }

    const [language] = value.toLowerCase().split('-');

    if (!language || !isLocale(language)) {
        return null;
    }

    return language;
}

function getCookieLocale(): Locale | null {
    if (typeof document === 'undefined') {
        return null;
    }

    const cookieValue =
        document.cookie
            .split('; ')
            .find((cookie) => cookie.startsWith(`${LOCALE_COOKIE}=`))
            ?.slice(`${LOCALE_COOKIE}=`.length) ?? null;

    return normalizeLocale(cookieValue);
}

function getStoredLocale(): Locale | null {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        return normalizeLocale(localStorage.getItem(LOCALE_STORAGE_KEY));
    } catch {
        return null;
    }
}

function setLocaleCookie(locale: Locale, days = 365): void {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${maxAge};SameSite=Lax`;
}

export function persistLocale(locale: Locale): void {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(LOCALE_STORAGE_KEY, locale);
        } catch {
            // localStorage might be unavailable (e.g. private mode); the
            // cookie below still keeps the choice across reloads.
        }
    }

    setLocaleCookie(locale);
}

export function detectLocale(
    source: BrowserLocaleSource | undefined = typeof navigator !== 'undefined'
        ? navigator
        : undefined,
): Locale {
    // Cookie is the server-authoritative source; localStorage is only a
    // client-side fallback for environments where cookies are unavailable.
    const stored = getCookieLocale() ?? getStoredLocale();

    if (stored) {
        persistLocale(stored);

        return stored;
    }

    for (const candidate of source?.languages ?? []) {
        const locale = normalizeLocale(candidate);

        if (locale) {
            persistLocale(locale);

            return locale;
        }
    }

    const locale = normalizeLocale(source?.language) ?? defaultLocale;

    persistLocale(locale);

    return locale;
}

async function loadMessages(locale: Locale): Promise<Messages> {
    // Catalogs are compiled with `lingui compile --namespace es`, which emits
    // browser-friendly ESM (`export const messages = ...`) into `.mjs` files.
    const { messages } = await import(`./locales/${locale}/messages.mjs`);

    return messages;
}

const loadedLocales = new Set<Locale>();

/**
 * Pre-register every supported catalog so subsequent `activateLocale` calls
 * become synchronous. This avoids a render with stale strings while a new
 * catalog is being fetched (e.g. on Inertia navigation responses).
 */
export async function loadAllCatalogs(): Promise<void> {
    await Promise.all(
        (Object.keys(locales) as Locale[]).map(async (locale) => {
            i18n.load(locale, await loadMessages(locale));
            loadedLocales.add(locale);
        }),
    );
}

function applyDocumentLang(locale: Locale): void {
    if (typeof document !== 'undefined') {
        document.documentElement.lang = locale;
    }
}

/**
 * Activate a previously preloaded catalog without performing any async work.
 * Returns null when the catalog has not been loaded yet so callers can fall
 * back to {@link activateLocale}.
 */
export function activatePreloadedLocale(locale: string): Locale | null {
    const selectedLocale = normalizeLocale(locale) ?? defaultLocale;

    if (!loadedLocales.has(selectedLocale)) {
        return null;
    }

    i18n.activate(selectedLocale);
    applyDocumentLang(selectedLocale);

    return selectedLocale;
}

export async function activateLocale(locale: string): Promise<Locale> {
    const selectedLocale = normalizeLocale(locale) ?? defaultLocale;

    if (!loadedLocales.has(selectedLocale)) {
        i18n.load(selectedLocale, await loadMessages(selectedLocale));
        loadedLocales.add(selectedLocale);
    }

    i18n.activate(selectedLocale);
    applyDocumentLang(selectedLocale);

    return (i18n.locale as Locale | '') || defaultLocale;
}

/**
 * Like `activateLocale`, but silently falls back to the default locale when
 * the requested catalog cannot be loaded. Intended only for the application
 * bootstrap path where a hard failure would leave the UI in a broken state.
 */
export async function activateLocaleWithFallback(
    locale: string,
): Promise<Locale> {
    const selectedLocale = normalizeLocale(locale) ?? defaultLocale;

    try {
        return await activateLocale(selectedLocale);
    } catch {
        if (selectedLocale !== defaultLocale) {
            return await activateLocale(defaultLocale);
        }

        throw new Error(
            `Failed to load default locale catalog: ${defaultLocale}`,
        );
    }
}
