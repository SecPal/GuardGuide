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

const LIGHT_SRC = '/brand/guardguide/symbol-light-512.png';
const LIGHT_SRC_SET = [
    '/brand/guardguide/symbol-light-128.png 128w',
    '/brand/guardguide/symbol-light-256.png 256w',
    '/brand/guardguide/symbol-light-512.png 512w',
].join(', ');

const DARK_SRC = '/brand/guardguide/symbol-dark-512.png';
const DARK_SRC_SET = [
    '/brand/guardguide/symbol-dark-128.png 128w',
    '/brand/guardguide/symbol-dark-256.png 256w',
    '/brand/guardguide/symbol-dark-512.png 512w',
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
                alt=""
                aria-hidden="true"
                className={cn('hidden dark:block', className)}
            />
        </>
    );
}
