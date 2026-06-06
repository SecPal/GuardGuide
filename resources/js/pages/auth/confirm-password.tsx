import { Form, Head } from '@inertiajs/react';
import { i18n } from '@lingui/core';
import { useLingui } from '@lingui/react';
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
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
        <>
            <Head title={i18n._('auth.confirmPassword.metaTitle')} />

            <PasskeyVerify
                routes={{
                    options: confirmOptions(),
                    submit: confirmStore(),
                }}
                label={i18n._('auth.confirmPassword.passkeyLabel')}
                loadingLabel={i18n._('auth.confirmPassword.passkeyLoading')}
                separator={i18n._('auth.confirmPassword.passkeySeparator')}
            />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
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
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                            <Button
                                className="w-full"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <Spinner />}
                                {i18n._('auth.confirmPassword.submit')}
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = () => ({
    title: i18n._('auth.confirmPassword.layoutTitle'),
    description: i18n._('auth.confirmPassword.layoutDescription'),
});
