import { AuthBrandBlock, AuthShell } from '@/components/auth';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <AuthShell>
            <AuthBrandBlock
                href={home.url()}
                productName="GuardGuide"
                title={title}
                description={description}
            />
            {children}
        </AuthShell>
    );
}
