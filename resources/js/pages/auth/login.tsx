import { Form, Head } from '@inertiajs/react';
import { useLingui } from '@lingui/react';
import { LogIn } from 'lucide-react';
import {
    AuthBrandBlock,
    AuthCardFrame,
    AuthShell,
    AuthStatusPanel,
} from '@/components/auth';
import InputError from '@/components/input-error';
import LanguageTabs from '@/components/language-tabs';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const { i18n } = useLingui();

    return (
        <AuthShell
            width="md"
            className="bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"
            contentClassName="gap-0"
        >
            <Head title={i18n._('auth.login.metaTitle')} />

            <AuthCardFrame
                data-testid="login-card"
                aria-labelledby="login-card-title"
                className="border-zinc-200/80 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
                contentClassName="grid gap-6 px-6 py-7 sm:px-10 sm:py-8"
                footer={
                    <div className="flex w-full justify-center">
                        <LanguageTabs className="bg-zinc-100 dark:bg-zinc-900" />
                    </div>
                }
            >
                <AuthBrandBlock
                    className="gap-3"
                    productName="GuardGuide"
                    title={
                        <span id="login-card-title">
                            {i18n._('auth.login.brandTitle')}
                        </span>
                    }
                    description={i18n._('auth.login.brandDescription')}
                />

                {status && (
                    <AuthStatusPanel variant="success" message={status} />
                )}

                <PasskeyVerify />

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6"
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
                                        title={i18n._('auth.login.errorTitle')}
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
                                            {i18n._('auth.login.email')}
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder={i18n._(
                                                'auth.login.emailPlaceholder',
                                            )}
                                            disabled={processing}
                                            aria-invalid={
                                                errors.email ? true : undefined
                                            }
                                            aria-describedby={
                                                errors.email
                                                    ? 'email-error'
                                                    : undefined
                                            }
                                        />
                                        <InputError
                                            id="email-error"
                                            message={errors.email}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">
                                                {i18n._('auth.login.password')}
                                            </Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="ml-auto text-sm text-muted-foreground hover:text-foreground"
                                                    tabIndex={5}
                                                >
                                                    {i18n._(
                                                        'auth.login.forgotPassword',
                                                    )}
                                                </TextLink>
                                            )}
                                        </div>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder={i18n._(
                                                'auth.login.passwordPlaceholder',
                                            )}
                                            disabled={processing}
                                            aria-invalid={
                                                errors.password
                                                    ? true
                                                    : undefined
                                            }
                                            aria-describedby={
                                                errors.password
                                                    ? 'password-error'
                                                    : undefined
                                            }
                                        />
                                        <InputError
                                            id="password-error"
                                            message={errors.password}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                disabled={processing}
                                                aria-labelledby="remember-label"
                                            />
                                            <Label
                                                id="remember-label"
                                                htmlFor="remember"
                                                className="text-sm"
                                            >
                                                {i18n._('auth.login.remember')}
                                            </Label>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-1 w-full"
                                        tabIndex={4}
                                        disabled={processing}
                                        aria-busy={processing}
                                        data-test="login-button"
                                    >
                                        {processing ? (
                                            <Spinner />
                                        ) : (
                                            <LogIn className="size-4" />
                                        )}
                                        {i18n._('auth.login.submit')}
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

Login.layout = () => [];
