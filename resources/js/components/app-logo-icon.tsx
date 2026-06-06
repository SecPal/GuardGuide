import type { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type AppLogoIconVariant = 'auto' | 'on-light' | 'on-dark';

type AppLogoIconProps = Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    'src' | 'srcSet' | 'alt'
> & {
    alt?: string;
    /**
     * Choose which symbol variant to render.
     * - `auto` (default) follows the active color scheme via the `dark` class.
     * - `on-light` forces the variant intended for light backgrounds.
     * - `on-dark` forces the variant intended for dark backgrounds.
     */
    variant?: AppLogoIconVariant;
};

/*
 * The logo is rendered at small intrinsic sizes (typically 20-48 CSS px) across
 * sidebars, headers and auth layouts. Density descriptors (1x/2x/3x) let the
 * browser pick exactly one candidate based on the device pixel ratio without
 * needing a `sizes` attribute — `w`-descriptors would otherwise default to
 * `100vw` and pull the 512 px asset on every wide viewport.
 */
const LIGHT_SRC = '/brand/guardguide/symbol-light-128.png';
const LIGHT_SRC_SET = [
    '/brand/guardguide/symbol-light-128.png 1x',
    '/brand/guardguide/symbol-light-256.png 2x',
    '/brand/guardguide/symbol-light-512.png 3x',
].join(', ');

const DARK_SRC = '/brand/guardguide/symbol-dark-128.png';
const DARK_SRC_SET = [
    '/brand/guardguide/symbol-dark-128.png 1x',
    '/brand/guardguide/symbol-dark-256.png 2x',
    '/brand/guardguide/symbol-dark-512.png 3x',
].join(', ');

export default function AppLogoIcon({
    className,
    alt = 'GuardGuide',
    variant = 'auto',
    ...props
}: AppLogoIconProps) {
    if (variant === 'on-light') {
        return (
            <img
                {...props}
                src={LIGHT_SRC}
                srcSet={LIGHT_SRC_SET}
                alt={alt}
                className={className}
            />
        );
    }

    if (variant === 'on-dark') {
        return (
            <img
                {...props}
                src={DARK_SRC}
                srcSet={DARK_SRC_SET}
                alt={alt}
                className={className}
            />
        );
    }

    /*
     * Both <img>s share the same `alt` so the visible variant always carries
     * the accessible name. The hidden one is removed from the accessibility
     * tree by `display: none` (Tailwind `hidden`/`dark:hidden`), so screen
     * readers never announce it twice.
     *
     * We keep two real <img> elements (instead of a <picture> with
     * `prefers-color-scheme`) because the app exposes an explicit
     * appearance toggle (light/dark/system) that toggles the `dark` class
     * on <html>. A media-query-based <source> would mismatch whenever the
     * user's choice differs from the OS preference.
     */
    return (
        <>
            <img
                {...props}
                src={LIGHT_SRC}
                srcSet={LIGHT_SRC_SET}
                alt={alt}
                className={cn('block dark:hidden', className)}
            />
            <img
                {...props}
                src={DARK_SRC}
                srcSet={DARK_SRC_SET}
                alt={alt}
                className={cn('hidden dark:block', className)}
            />
        </>
    );
}
