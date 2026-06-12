import type { ComponentType, ReactNode } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';

type BrandLinkProps = {
    children: ReactNode;
    className?: string;
    href: string;
};

type AuthBrandBlockProps = {
    className?: string;
    description?: ReactNode;
    href?: string;
    linkComponent?: ComponentType<BrandLinkProps>;
    logoAlt?: string;
    productName?: ReactNode;
    title?: ReactNode;
};

export function AuthBrandBlock({
    className,
    description,
    href,
    linkComponent: LinkComponent,
    logoAlt = '',
    productName = 'GuardGuide',
    title,
}: AuthBrandBlockProps) {
    const logo = (
        <span className="flex h-9 w-9 items-center justify-center rounded-md">
            <AppLogoIcon className="size-9" alt={logoAlt} />
        </span>
    );

    const brand = href ? (
        LinkComponent ? (
            <LinkComponent
                href={href}
                className="inline-flex flex-col items-center gap-2 font-medium"
            >
                {logo}
                <span className="sr-only">{productName}</span>
            </LinkComponent>
        ) : (
            <a
                href={href}
                className="inline-flex flex-col items-center gap-2 font-medium"
            >
                {logo}
                <span className="sr-only">{productName}</span>
            </a>
        )
    ) : (
        <div className="inline-flex flex-col items-center gap-2 font-medium">
            {logo}
            <span className="sr-only">{productName}</span>
        </div>
    );

    return (
        <header className={cn('flex flex-col items-center gap-4', className)}>
            {brand}

            {(title || description) && (
                <div className="space-y-2 text-center">
                    {title && <h1 className="text-xl font-medium">{title}</h1>}
                    {description && (
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            )}
        </header>
    );
}
