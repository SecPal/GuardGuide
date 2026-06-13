import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AuthShellWidth = 'sm' | 'md' | 'lg';

const widthClasses: Record<AuthShellWidth, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
};

type AuthShellProps = {
    children: ReactNode;
    className?: string;
    contentClassName?: string;
    width?: AuthShellWidth;
};

export function AuthShell({
    children,
    className,
    contentClassName,
    width = 'sm',
}: AuthShellProps) {
    return (
        <main
            className={cn(
                'flex min-h-svh flex-col items-center justify-center bg-background px-6 py-10',
                className,
            )}
        >
            <div
                className={cn(
                    'flex w-full flex-col gap-8',
                    widthClasses[width],
                    contentClassName,
                )}
            >
                {children}
            </div>
        </main>
    );
}
