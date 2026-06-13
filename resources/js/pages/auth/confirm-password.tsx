import { Form, Head } from '@inertiajs/react';
import { useLingui } from '@lingui/react';
import { ShieldCheck } from 'lucide-react';
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import {
    AuthBrandBlock,
    AuthCardFrame,
    AuthShell,
    AuthStatusPanel,
} from '@/components/auth';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    const { i18n } = useLingui();

    return (
        <AuthShell
            width="md"
            className="bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"
            contentClassName="gap-0"
        >
            <Head title={i18n._('auth.confirmPassword.metaTitle')} />

            <AuthCardFrame
                data-testid="confirm-password-card"
                aria-labelledby="confirm-password-title"
                className="border-zinc-200/80 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
                contentClassName="grid gap-6 px-6 py-7 sm:px-10 sm:py-8"
            >
                <AuthBrandBlock
                    className="gap-3"
                    productName="GuardGuide"
                    title={
                        <span id="confirm-password-title">
                            {i18n._('auth.confirmPassword.brandTitle')}
                        </span>
                    }
                    description={i18n._(
                        'auth.confirmPassword.brandDescription',
                    )}
                />

                <AuthStatusPanel
                    variant="info"
                    message={i18n._('auth.confirmPassword.securityNotice')}
                />

                <PasskeyVerify
                    routes={{
                        options: confirmOptions(),
                        submit: confirmStore(),
                    }}
                    label={i18n._('auth.confirmPassword.passkeyLabel')}
                    loadingLabel={i18n._('auth.confirmPassword.passkeyLoading')}
                    separator={i18n._('auth.confirmPassword.passkeySeparator')}
                />

                <Form
                    {...store.form()}
                    className="flex flex-col gap-6"
                    resetOnSuccess={['password']}
                >
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
                                            'auth.confirmPassword.errorTitle',
                                        )}
                                    >
                                        <ul className="list-disc space-y-1 pl-4">
                                            {errorMessages.map((message) => (
                                                <li key={message}>{message}</li>
                                            ))}
                                        </ul>
                                    </AuthStatusPanel>
                                )}

                                <div className="grid gap-5">
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">
                                            {i18n._('auth.login.password')}
                                        </Label>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            placeholder={i18n._(
                                                'auth.login.passwordPlaceholder',
                                            )}
                                            autoComplete="current-password"
                                            autoFocus
                                            disabled={processing}
                                            aria-invalid={
                                                errors.password
                                                    ? true
                                                    : undefined
                                            }
                                            aria-describedby={
                                                errors.password
                                                    ? 'confirm-password-error'
                                                    : undefined
                                            }
                                        />

                                        <InputError
                                            id="confirm-password-error"
                                            message={errors.password}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                        aria-busy={processing}
                                        data-test="confirm-password-button"
                                    >
                                        {processing ? (
                                            <Spinner />
                                        ) : (
                                            <ShieldCheck className="size-4" />
                                        )}
                                        {i18n._('auth.confirmPassword.submit')}
                                    </Button>
                                </div>
                            </>
                        );
                    }}
                </Form>
            </AuthCardFrame>
        </AuthShell>
    );
}

ConfirmPassword.layout = () => [];
