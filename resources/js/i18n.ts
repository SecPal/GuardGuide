import { i18n } from '@lingui/core';

export const locales = {
    en: 'English',
    de: 'Deutsch',
} as const;

export type Locale = keyof typeof locales;

export const defaultLocale: Locale = 'en';

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

export function detectLocale(
    source: BrowserLocaleSource | undefined = typeof navigator !== 'undefined'
        ? navigator
        : undefined,
): Locale {
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
