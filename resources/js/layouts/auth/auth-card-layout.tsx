import type { PropsWithChildren } from 'react';
import { AuthBrandBlock, AuthCardFrame, AuthShell } from '@/components/auth';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <AuthShell className="bg-muted" width="md" contentClassName="gap-6">
            <AuthBrandBlock
                href={home.url()}
                logoAlt="GuardGuide"
                productName="GuardGuide"
            />
            <AuthCardFrame
                title={title}
                description={description}
                headerClassName="px-10 pt-8 pb-0"
                contentClassName="px-10 py-8"
            >
                {children}
            </AuthCardFrame>
        </AuthShell>
    );
}
