import type { ComponentProps, ReactNode } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

type AuthCardFrameProps = Omit<ComponentProps<typeof Card>, 'title'> & {
    children: ReactNode;
    contentClassName?: string;
    description?: ReactNode;
    footer?: ReactNode;
    headerClassName?: string;
    title?: ReactNode;
};

export function AuthCardFrame({
    children,
    className,
    contentClassName,
    description,
    footer,
    headerClassName,
    title,
    ...props
}: AuthCardFrameProps) {
    return (
        <Card
            className={cn('gap-6 rounded-lg py-0 shadow-sm', className)}
            {...props}
        >
            {(title || description) && (
                <CardHeader
                    className={cn('px-8 pt-8 text-center', headerClassName)}
                >
                    {title && (
                        <CardTitle className="text-xl">{title}</CardTitle>
                    )}
                    {description && (
                        <CardDescription>{description}</CardDescription>
                    )}
                </CardHeader>
            )}

            <CardContent className={cn('px-8 py-8', contentClassName)}>
                {children}
            </CardContent>

            {footer && (
                <CardFooter className="border-t px-8 py-4 text-sm text-muted-foreground">
                    {footer}
                </CardFooter>
            )}
        </Card>
    );
}
