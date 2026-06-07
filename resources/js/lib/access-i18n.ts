import type { I18n } from '@lingui/core';

/**
 * Slugs of roles that GuardGuide seeds and ships translations for. Custom
 * roles created by administrators keep their database `label` instead.
 */
const SYSTEM_ROLE_SLUGS = new Set<string>([
    'platform-administrator',
    'customer-manager',
    'site-manager',
    'operations-user',
]);

/**
 * Resolve a translation by message id, falling back to a caller-provided
 * value when Lingui returns the id verbatim (i.e. no translation exists).
 */
function translateOrFallback(i18n: I18n, id: string, fallback: string): string {
    const translated = i18n._(id);

    return translated === id ? fallback : translated;
}

/**
 * Translate the display label of a role. System roles use a stable
 * `roles.system.<slug>.label` key; custom roles fall back to the label
 * stored in the database (set by the administrator who created the role).
 */
export function translateRoleLabel(
    i18n: I18n,
    slug: string,
    fallback: string,
): string {
    if (SYSTEM_ROLE_SLUGS.has(slug)) {
        return translateOrFallback(
            i18n,
            `roles.system.${slug}.label`,
            fallback,
        );
    }

    return fallback;
}

/**
 * Translate a permission's display name. Falls back to a humanised version
 * of the dotted slug so unknown permissions remain readable in the UI.
 */
export function translatePermissionLabel(i18n: I18n, name: string): string {
    return translateOrFallback(
        i18n,
        `permissions.${name}.label`,
        humanizePermissionSlug(name),
    );
}

/**
 * Translate a permission's description. Falls back to the description that
 * the backend sent (typically the English seed text) when no translation
 * is available.
 */
export function translatePermissionDescription(
    i18n: I18n,
    name: string,
    fallback: string,
): string {
    return translateOrFallback(
        i18n,
        `permissions.${name}.description`,
        fallback,
    );
}

/**
 * Convert a dotted permission slug (e.g. `organizational_units.view`) into a
 * human readable label like `Organizational units · view`. Used only when no
 * translation is registered for the permission.
 */
function humanizePermissionSlug(slug: string): string {
    const [resourcePart = '', actionPart = ''] = slug.split('.', 2);
    const resource = resourcePart.replace(/_/g, ' ');

    if (!actionPart) {
        return resource;
    }

    return `${resource} · ${actionPart}`;
}
