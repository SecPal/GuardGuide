import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import { Form, Head } from '@inertiajs/react';
import { useLingui } from '@lingui/react';
import { Code2, LogIn, Scale } from 'lucide-react';
import { AuthShell, AuthStatusPanel } from '@/components/auth';
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
            width="sm"
            className="box-border justify-start bg-background px-6 pt-10 pb-4 text-zinc-950 md:px-10 md:pt-10 md:pb-6 dark:text-zinc-50"
            contentClassName="flex-1 min-h-0 gap-6"
        >
            <Head title={i18n._('auth.login.metaTitle')} />

            <div
                className="flex min-h-full flex-1 flex-col gap-6"
                style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontFeatureSettings: 'normal',
                }}
            >
                <div className="flex flex-1 flex-col justify-center gap-6">
                    <div
                        data-testid="login-card"
                        aria-labelledby="login-card-title"
                        className="grid gap-6"
                    >
                        {status && (
                            <AuthStatusPanel
                                variant="success"
                                message={status}
                            />
                        )}

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-6"
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
                                        <div className="flex flex-col items-center gap-2 text-center">
                                            <div className="flex size-12 items-center justify-center rounded-md">
                                                <img
                                                    src="/brand/guardguide/symbol-light-128.png"
                                                    srcSet="/brand/guardguide/symbol-light-128.png 1x, /brand/guardguide/symbol-light-256.png 2x, /brand/guardguide/symbol-light-512.png 3x"
                                                    alt=""
                                                    className="block size-12 dark:hidden"
                                                />
                                                <img
                                                    src="/brand/guardguide/symbol-dark-128.png"
                                                    srcSet="/brand/guardguide/symbol-dark-128.png 1x, /brand/guardguide/symbol-dark-256.png 2x, /brand/guardguide/symbol-dark-512.png 3x"
                                                    alt=""
                                                    className="hidden size-12 dark:block"
                                                />
                                            </div>
                                            <h1
                                                id="login-card-title"
                                                className="text-xl font-bold text-zinc-950 dark:text-zinc-50"
                                            >
                                                {i18n._(
                                                    'auth.login.brandTitle',
                                                )}
                                            </h1>
                                        </div>

                                        {errorMessages.length > 0 && (
                                            <AuthStatusPanel
                                                variant="error"
                                                title={i18n._(
                                                    'auth.login.errorTitle',
                                                )}
                                            >
                                                <ul className="list-disc space-y-1 pl-4">
                                                    {errorMessages.map(
                                                        (message) => (
                                                            <li key={message}>
                                                                {message}
                                                            </li>
                                                        ),
                                                    )}
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
                                                        errors.email
                                                            ? true
                                                            : undefined
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
                                                        {i18n._(
                                                            'auth.login.password',
                                                        )}
                                                    </Label>
                                                    {canResetPassword && (
                                                        <TextLink
                                                            href={request()}
                                                            className="ml-auto text-sm"
                                                            tabIndex={4}
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

                                            <div className="flex items-center space-x-3">
                                                <Checkbox
                                                    id="remember"
                                                    name="remember"
                                                    tabIndex={3}
                                                    disabled={processing}
                                                />
                                                <Label htmlFor="remember">
                                                    {i18n._(
                                                        'auth.login.remember',
                                                    )}
                                                </Label>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="mt-1 w-full"
                                                tabIndex={5}
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

                                        <PasskeyVerify separatorPosition="before" />
                                    </>
                                );
                            }}
                        </Form>
                    </div>

                    <div className="flex justify-center">
                        <LanguageTabs className="bg-zinc-100 dark:bg-zinc-900" />
                    </div>
                </div>

                <footer className="mt-4 w-full max-w-sm text-center text-xs">
                    <div className="flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400">
                        <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                            {i18n._('auth.login.footerTagline')}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                            <a
                                href="https://www.gnu.org/licenses/agpl-3.0.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 hover:text-zinc-950 dark:hover:text-white"
                            >
                                <Scale className="size-4" aria-hidden="true" />
                                <span>AGPL v3+</span>
                            </a>
                            <span
                                className="text-zinc-300 dark:text-zinc-700"
                                aria-hidden="true"
                            >
                                |
                            </span>
                            <a
                                href="https://github.com/SecPal/GuardGuide"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 no-underline hover:text-zinc-950 dark:hover:text-white"
                            >
                                <Code2 className="size-4" aria-hidden="true" />
                                <span>{i18n._('auth.login.footerSource')}</span>
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </AuthShell>
    );
}

Login.layout = () => [];
