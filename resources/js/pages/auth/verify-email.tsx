import { Form, Head } from '@inertiajs/react';
import { useLingui } from '@lingui/react';
import { LogOut, MailCheck } from 'lucide-react';
import {
    AuthBrandBlock,
    AuthCardFrame,
    AuthShell,
    AuthStatusPanel,
} from '@/components/auth';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    const { i18n } = useLingui();

    return (
        <AuthShell
            width="md"
            className="bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"
            contentClassName="gap-0"
        >
            <Head title={i18n._('auth.verifyEmail.metaTitle')} />

            <AuthCardFrame
                data-testid="verify-email-card"
                aria-labelledby="verify-email-title"
                className="border-zinc-200/80 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
                contentClassName="grid gap-6 px-6 py-7 sm:px-10 sm:py-8"
            >
                <AuthBrandBlock
                    className="gap-3"
                    productName="GuardGuide"
                    title={
                        <span id="verify-email-title">
                            {i18n._('auth.verifyEmail.brandTitle')}
                        </span>
                    }
                    description={i18n._('auth.verifyEmail.brandDescription')}
                />

                <AuthStatusPanel
                    variant={
                        status === 'verification-link-sent' ? 'success' : 'info'
                    }
                    message={
                        status === 'verification-link-sent'
                            ? i18n._('auth.verifyEmail.linkSent')
                            : i18n._('auth.verifyEmail.pendingNotice')
                    }
                />

                <Form {...send.form()} className="flex flex-col gap-4">
                    {({ processing }) => (
                        <>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                                aria-busy={processing}
                            >
                                {processing ? (
                                    <Spinner />
                                ) : (
                                    <MailCheck className="size-4" />
                                )}
                                {i18n._('auth.verifyEmail.resend')}
                            </Button>

                            <TextLink
                                href={logout()}
                                className="mx-auto inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                            >
                                <LogOut className="size-3.5" />
                                {i18n._('auth.verifyEmail.logout')}
                            </TextLink>
                        </>
                    )}
                </Form>
            </AuthCardFrame>
        </AuthShell>
    );
}

VerifyEmail.layout = () => [];
