import { Form, Head } from '@inertiajs/react';
import { useLingui } from '@lingui/react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import {
    AuthBrandBlock,
    AuthCardFrame,
    AuthFormSection,
    AuthOtpInput,
    AuthShell,
    AuthStatusPanel,
} from '@/components/auth';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { store } from '@/routes/two-factor/login';

type ChallengeMode = 'code' | 'recovery';

export default function TwoFactorChallenge() {
    const { i18n } = useLingui();
    const [mode, setMode] = useState<ChallengeMode>('code');
    const [code, setCode] = useState<string>('');

    const isRecoveryMode = mode === 'recovery';

    const switchMode = (
        value: string,
        clearErrors: (...fields: string[]) => void,
    ): void => {
        if (value !== 'code' && value !== 'recovery') {
            return;
        }

        setMode(value);
        clearErrors();
        setCode('');
    };

    return (
        <AuthShell
            width="md"
            className="bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50"
            contentClassName="gap-0"
        >
            <Head title={i18n._('auth.twoFactorChallenge.metaTitle')} />

            <AuthCardFrame
                data-testid="two-factor-challenge-card"
                aria-labelledby="two-factor-challenge-title"
                className="border-zinc-200/80 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
                contentClassName="grid gap-6 px-6 py-7 sm:px-10 sm:py-8"
            >
                <AuthBrandBlock
                    className="gap-3"
                    productName="GuardGuide"
                    title={
                        <span id="two-factor-challenge-title">
                            {i18n._('auth.twoFactorChallenge.brandTitle')}
                        </span>
                    }
                    description={i18n._(
                        'auth.twoFactorChallenge.brandDescription',
                    )}
                />

                <Form
                    {...store.form()}
                    className="flex flex-col gap-6"
                    resetOnError
                    resetOnSuccess={!isRecoveryMode}
                >
                    {({ errors, processing, clearErrors }) => {
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
                                            'auth.twoFactorChallenge.errorTitle',
                                        )}
                                    >
                                        <ul className="list-disc space-y-1 pl-4">
                                            {errorMessages.map((message) => (
                                                <li key={message}>{message}</li>
                                            ))}
                                        </ul>
                                    </AuthStatusPanel>
                                )}

                                <AuthStatusPanel
                                    variant="info"
                                    title={
                                        isRecoveryMode
                                            ? i18n._(
                                                  'auth.twoFactorChallenge.recovery.title',
                                              )
                                            : i18n._(
                                                  'auth.twoFactorChallenge.otp.title',
                                              )
                                    }
                                    message={
                                        isRecoveryMode
                                            ? i18n._(
                                                  'auth.twoFactorChallenge.recovery.description',
                                              )
                                            : i18n._(
                                                  'auth.twoFactorChallenge.otp.description',
                                              )
                                    }
                                />

                                <ToggleGroup
                                    type="single"
                                    variant="outline"
                                    value={mode}
                                    onValueChange={(value) =>
                                        switchMode(value, clearErrors)
                                    }
                                    className="grid w-full grid-cols-2"
                                    aria-label={i18n._(
                                        'auth.twoFactorChallenge.modeLabel',
                                    )}
                                    disabled={processing}
                                >
                                    <ToggleGroupItem
                                        value="code"
                                        className="h-10 w-full text-sm"
                                    >
                                        <ShieldCheck className="size-4" />
                                        {i18n._(
                                            'auth.twoFactorChallenge.otp.switchLabel',
                                        )}
                                    </ToggleGroupItem>
                                    <ToggleGroupItem
                                        value="recovery"
                                        className="h-10 w-full text-sm"
                                    >
                                        <KeyRound className="size-4" />
                                        {i18n._(
                                            'auth.twoFactorChallenge.recovery.switchLabel',
                                        )}
                                    </ToggleGroupItem>
                                </ToggleGroup>

                                {isRecoveryMode ? (
                                    <AuthFormSection
                                        title={i18n._(
                                            'auth.twoFactorChallenge.recovery.title',
                                        )}
                                    >
                                        <div className="grid gap-2">
                                            <Label htmlFor="recovery_code">
                                                {i18n._(
                                                    'auth.twoFactorChallenge.recovery.title',
                                                )}
                                            </Label>
                                            <Input
                                                id="recovery_code"
                                                name="recovery_code"
                                                type="text"
                                                placeholder={i18n._(
                                                    'auth.twoFactorChallenge.recovery.placeholder',
                                                )}
                                                autoComplete="one-time-code"
                                                autoFocus
                                                required
                                                disabled={processing}
                                                aria-invalid={
                                                    errors.recovery_code
                                                        ? true
                                                        : undefined
                                                }
                                                aria-describedby={
                                                    errors.recovery_code
                                                        ? 'recovery-code-error'
                                                        : undefined
                                                }
                                            />
                                            <InputError
                                                id="recovery-code-error"
                                                message={errors.recovery_code}
                                            />
                                        </div>
                                    </AuthFormSection>
                                ) : (
                                    <AuthOtpInput
                                        autoFocus
                                        className="rounded-lg border border-zinc-200 bg-zinc-50/70 px-4 py-5 dark:border-zinc-800 dark:bg-zinc-900/50"
                                        disabled={processing}
                                        error={errors.code}
                                        label={i18n._(
                                            'auth.twoFactorChallenge.otp.title',
                                        )}
                                        length={OTP_MAX_LENGTH}
                                        name="code"
                                        onChange={(value) => setCode(value)}
                                        value={code}
                                    />
                                )}

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                    aria-busy={processing}
                                >
                                    {processing ? (
                                        <Spinner />
                                    ) : (
                                        <ShieldCheck className="size-4" />
                                    )}
                                    {i18n._('auth.twoFactorChallenge.continue')}
                                </Button>
                            </>
                        );
                    }}
                </Form>
            </AuthCardFrame>
        </AuthShell>
    );
}

TwoFactorChallenge.layout = () => [];
