import { Form } from '@inertiajs/react';
import { useLingui } from '@lingui/react';
import { ShieldCheck, ShieldOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AuthStatusPanel } from '@/components/auth';
import Heading from '@/components/heading';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { disable, enable } from '@/routes/two-factor';

export type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function ManageTwoFactor(props: Props) {
    const { i18n } = useLingui();
    const requiresConfirmation = props.requiresConfirmation ?? false;
    const twoFactorEnabled = props.twoFactorEnabled ?? false;

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
    const previousTwoFactorEnabledRef = useRef(twoFactorEnabled);

    useEffect(() => {
        if (previousTwoFactorEnabledRef.current && !twoFactorEnabled) {
            clearTwoFactorAuthData();
        }

        previousTwoFactorEnabledRef.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    if (!(props.canManageTwoFactor ?? false)) {
        return null;
    }

    return (
        <div className="space-y-6">
            <Heading
                variant="small"
                title={i18n._('settings.twoFactor.title')}
                description={i18n._('settings.twoFactor.description')}
            />
            {twoFactorEnabled ? (
                <div className="grid gap-4">
                    <div className="grid gap-4 rounded-lg border border-zinc-200/80 bg-card p-4 shadow-sm sm:grid-cols-[1fr_auto] sm:items-start dark:border-zinc-800">
                        <AuthStatusPanel
                            variant="success"
                            title={i18n._('settings.twoFactor.title')}
                            message={i18n._(
                                'settings.twoFactor.enabledDescription',
                            )}
                            className="border-0 bg-transparent p-0 shadow-none"
                        />
                        <Form {...disable.form()}>
                            {({ processing }) => (
                                <Button
                                    variant="destructive"
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto"
                                >
                                    <ShieldOff />
                                    {i18n._('settings.twoFactor.disableButton')}
                                </Button>
                            )}
                        </Form>
                    </div>

                    <TwoFactorRecoveryCodes
                        recoveryCodesList={recoveryCodesList}
                        fetchRecoveryCodes={fetchRecoveryCodes}
                        errors={errors}
                    />
                </div>
            ) : (
                <div className="grid gap-4 rounded-lg border border-zinc-200/80 bg-card p-4 shadow-sm sm:grid-cols-[1fr_auto] sm:items-start dark:border-zinc-800">
                    <AuthStatusPanel
                        variant="warning"
                        title={i18n._('settings.twoFactor.title')}
                        message={i18n._(
                            'settings.twoFactor.disabledDescription',
                        )}
                        className="border-0 bg-transparent p-0 shadow-none"
                    />
                    <div className="sm:justify-self-end">
                        {hasSetupData ? (
                            <Button
                                className="w-full sm:w-auto"
                                onClick={() => setShowSetupModal(true)}
                            >
                                <ShieldCheck />
                                {i18n._(
                                    'settings.twoFactor.continueSetupButton',
                                )}
                            </Button>
                        ) : (
                            <Form
                                {...enable.form()}
                                onSuccess={() => setShowSetupModal(true)}
                            >
                                {({ processing }) => (
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full sm:w-auto"
                                    >
                                        <ShieldCheck />
                                        {i18n._(
                                            'settings.twoFactor.enableButton',
                                        )}
                                    </Button>
                                )}
                            </Form>
                        )}
                    </div>
                </div>
            )}

            <TwoFactorSetupModal
                isOpen={showSetupModal}
                onClose={() => setShowSetupModal(false)}
                requiresConfirmation={requiresConfirmation}
                twoFactorEnabled={twoFactorEnabled}
                qrCodeSvg={qrCodeSvg}
                manualSetupKey={manualSetupKey}
                clearSetupData={clearSetupData}
                fetchSetupData={fetchSetupData}
                errors={errors}
            />
        </div>
    );
}
