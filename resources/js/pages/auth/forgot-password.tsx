import { Form, Head } from '@inertiajs/react';
import { useLingui } from '@lingui/react';
import { ArrowLeft, Mail } from 'lucide-react';
import {
    AuthBrandBlock,
    AuthCardFrame,
    AuthShell,
    AuthStatusPanel,
} from '@/components/auth';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    const { i18n } = useLingui();

    return (
        <AuthShell
            width="md"
            className="bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"
            contentClassName="gap-0"
        >
            <Head title={i18n._('auth.forgotPassword.metaTitle')} />

            <AuthCardFrame
                data-testid="forgot-password-card"
                aria-labelledby="forgot-password-title"
                className="border-zinc-200/80 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
                contentClassName="grid gap-6 px-6 py-7 sm:px-10 sm:py-8"
            >
                <AuthBrandBlock
                    className="gap-3"
                    productName="GuardGuide"
                    title={
                        <span id="forgot-password-title">
                            {i18n._('auth.forgotPassword.brandTitle')}
                        </span>
                    }
                    description={i18n._('auth.forgotPassword.brandDescription')}
                />

                {status && (
                    <AuthStatusPanel variant="success" message={status} />
                )}

                <Form {...email.form()} className="flex flex-col gap-6">
                    {({ processing, errors }) => {
                        const errorMessages = Array.from(
                            new Set(
                                Object.values(errors).filter(
                                    (message): message is string =>
                                        typeof message === 'string' &&
                                        message.length > 0,
                                ),
                            ),
                        );

                        return (
                            <>
                                {errorMessages.length > 0 && (
                                    <AuthStatusPanel
                                        variant="error"
                                        title={i18n._(
                                            'auth.forgotPassword.errorTitle',
                                        )}
                                    >
                                        <ul className="list-disc space-y-1 pl-4">
                                            {errorMessages.map((message) => (
                                                <li key={message}>{message}</li>
                                            ))}
                                        </ul>
                                    </AuthStatusPanel>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="email">
                                        {i18n._(
                                            'auth.forgotPassword.emailLabel',
                                        )}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        placeholder={i18n._(
                                            'auth.forgotPassword.emailPlaceholder',
                                        )}
                                        disabled={processing}
                                        aria-invalid={
                                            errors.email ? true : undefined
                                        }
                                        aria-describedby={
                                            errors.email
                                                ? 'forgot-password-email-error'
                                                : undefined
                                        }
                                    />

                                    <InputError
                                        id="forgot-password-email-error"
                                        message={errors.email}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                    aria-busy={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing ? (
                                        <Spinner />
                                    ) : (
                                        <Mail className="size-4" />
                                    )}
                                    {i18n._('auth.forgotPassword.submit')}
                                </Button>
                            </>
                        );
                    }}
                </Form>

                <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-center text-sm text-muted-foreground">
                    <span>{i18n._('auth.forgotPassword.returnLead')}</span>
                    <TextLink
                        href={login()}
                        className="inline-flex items-center gap-1 text-foreground"
                    >
                        <ArrowLeft className="size-3.5" />
                        {i18n._('auth.forgotPassword.returnLink')}
                    </TextLink>
                </div>
            </AuthCardFrame>
        </AuthShell>
    );
}

ForgotPassword.layout = () => [];
