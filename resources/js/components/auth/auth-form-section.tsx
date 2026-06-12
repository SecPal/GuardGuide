import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AuthFormSectionProps = {
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
    description?: ReactNode;
    title?: ReactNode;
};

export function AuthFormSection({
    actions,
    children,
    className,
    description,
    title,
}: AuthFormSectionProps) {
    return (
        <section className={cn('grid gap-4', className)}>
            {(title || description || actions) && (
                <div className="flex items-start justify-between gap-4">
                    {(title || description) && (
                        <div className="grid gap-1">
                            {title && (
                                <h2 className="text-sm font-medium">{title}</h2>
                            )}
                            {description && (
                                <p className="text-sm text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}

                    {actions && (
                        <div className="shrink-0 text-sm">{actions}</div>
                    )}
                </div>
            )}

            <div className="grid gap-4">{children}</div>
        </section>
    );
}
