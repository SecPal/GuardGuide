import { Form, Head } from '@inertiajs/react';
import { useLingui } from '@lingui/react';
import { KeyRound } from 'lucide-react';
import {
    AuthBrandBlock,
    AuthCardFrame,
    AuthShell,
    AuthStatusPanel,
} from '@/components/auth';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    const { i18n } = useLingui();

    return (
        <AuthShell
            width="md"
            className="bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"
            contentClassName="gap-0"
        >
            <Head title={i18n._('auth.resetPassword.metaTitle')} />

            <AuthCardFrame
                data-testid="reset-password-card"
                aria-labelledby="reset-password-title"
                className="border-zinc-200/80 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
                contentClassName="grid gap-6 px-6 py-7 sm:px-10 sm:py-8"
            >
                <AuthBrandBlock
                    className="gap-3"
                    productName="GuardGuide"
                    title={
                        <span id="reset-password-title">
                            {i18n._('auth.resetPassword.brandTitle')}
                        </span>
                    }
                    description={i18n._('auth.resetPassword.brandDescription')}
                />

                <Form
                    {...update.form()}
                    className="flex flex-col gap-6"
                    transform={(data) => ({ ...data, token, email })}
                    resetOnSuccess={['password', 'password_confirmation']}
                >
                    {({ processing, errors }) => {
                        const errorMessages = Object.values(errors).filter(
                            (message): message is string =>
                                typeof message === 'string' &&
                                message.length > 0,
                        );

                        return (
                            <>
                                {errorMessages.length > 0 && (
                                    <AuthStatusPanel
                                        variant="error"
                                        title={i18n._(
                                            'auth.resetPassword.errorTitle',
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
                                        <Label htmlFor="email">
                                            {i18n._(
                                                'auth.resetPassword.emailLabel',
                                            )}
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            autoComplete="email"
                                            value={email}
                                            readOnly
                                            disabled={processing}
                                            aria-invalid={
                                                errors.email ? true : undefined
                                            }
                                            aria-describedby={
                                                errors.email
                                                    ? 'reset-password-email-error'
                                                    : undefined
                                            }
                                        />
                                        <InputError
                                            id="reset-password-email-error"
                                            message={errors.email}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">
                                            {i18n._(
                                                'auth.resetPassword.passwordLabel',
                                            )}
                                        </Label>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            autoComplete="new-password"
                                            autoFocus
                                            placeholder={i18n._(
                                                'auth.resetPassword.passwordPlaceholder',
                                            )}
                                            passwordrules={passwordRules}
                                            disabled={processing}
                                            aria-invalid={
                                                errors.password
                                                    ? true
                                                    : undefined
                                            }
                                            aria-describedby={
                                                errors.password
                                                    ? 'reset-password-password-error'
                                                    : undefined
                                            }
                                        />
                                        <InputError
                                            id="reset-password-password-error"
                                            message={errors.password}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">
                                            {i18n._(
                                                'auth.resetPassword.confirmLabel',
                                            )}
                                        </Label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            autoComplete="new-password"
                                            placeholder={i18n._(
                                                'auth.resetPassword.confirmPlaceholder',
                                            )}
                                            passwordrules={passwordRules}
                                            disabled={processing}
                                            aria-invalid={
                                                errors.password_confirmation
                                                    ? true
                                                    : undefined
                                            }
                                            aria-describedby={
                                                errors.password_confirmation
                                                    ? 'reset-password-confirm-error'
                                                    : undefined
                                            }
                                        />
                                        <InputError
                                            id="reset-password-confirm-error"
                                            message={
                                                errors.password_confirmation
                                            }
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-1 w-full"
                                        disabled={processing}
                                        aria-busy={processing}
                                        data-test="reset-password-button"
                                    >
                                        {processing ? (
                                            <Spinner />
                                        ) : (
                                            <KeyRound className="size-4" />
                                        )}
                                        {i18n._('auth.resetPassword.submit')}
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

ResetPassword.layout = () => [];
