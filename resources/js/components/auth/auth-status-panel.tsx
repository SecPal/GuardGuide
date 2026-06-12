import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import type { ComponentType, ReactNode, SVGProps } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

type AuthStatusVariant = 'error' | 'info' | 'success' | 'warning';

const variantClasses: Record<AuthStatusVariant, string> = {
    error: 'border-destructive/50 bg-destructive/10 text-destructive dark:bg-destructive/15',
    info: 'border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-900/60 dark:bg-blue-950/35 dark:text-blue-100',
    success:
        'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/35 dark:text-emerald-100',
    warning:
        'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/35 dark:text-amber-100',
};

const icons: Record<
    AuthStatusVariant,
    ComponentType<SVGProps<SVGSVGElement>>
> = {
    error: AlertCircle,
    info: Info,
    success: CheckCircle2,
    warning: TriangleAlert,
};

type AuthStatusPanelProps = {
    children?: ReactNode;
    className?: string;
    message?: ReactNode;
    title?: ReactNode;
    variant?: AuthStatusVariant;
};

export function AuthStatusPanel({
    children,
    className,
    message,
    title,
    variant = 'info',
}: AuthStatusPanelProps) {
    const Icon = icons[variant];
    const role = variant === 'error' ? 'alert' : 'status';

    return (
        <Alert
            role={role}
            variant={variant === 'error' ? 'destructive' : 'default'}
            className={cn(variantClasses[variant], className)}
        >
            <Icon aria-hidden="true" />
            {title && <AlertTitle>{title}</AlertTitle>}
            {(message || children) && (
                <AlertDescription className="text-current/80">
                    {message}
                    {children}
                </AlertDescription>
            )}
        </Alert>
    );
}
