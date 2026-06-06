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
    const stored = getStoredLocale() ?? getCookieLocale();

    if (stored) {
        return stored;
    }

    for (const candidate of source?.languages ?? []) {
        const locale = normalizeLocale(candidate);

        if (locale) {
            return locale;
        }
    }

    return normalizeLocale(source?.language) ?? defaultLocale;
}

async function loadMessages(locale: Locale): Promise<Messages> {
    // Catalogs are compiled with `lingui compile --namespace es`, which emits
    // browser-friendly ESM (`export const messages = ...`) into `.mjs` files.
    const { messages } = await import(`./locales/${locale}/messages.mjs`);

    return messages;
}

export async function activateLocale(locale: string): Promise<Locale> {
    const selectedLocale = normalizeLocale(locale) ?? defaultLocale;

    try {
        i18n.load(selectedLocale, await loadMessages(selectedLocale));
        i18n.activate(selectedLocale);
    } catch (error) {
        if (selectedLocale !== defaultLocale) {
            i18n.load(defaultLocale, await loadMessages(defaultLocale));
            i18n.activate(defaultLocale);
        } else {
            throw error;
        }
    }

    if (typeof document !== 'undefined') {
        document.documentElement.lang = i18n.locale || defaultLocale;
    }

    return (i18n.locale as Locale | '') || defaultLocale;
}
