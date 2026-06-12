import { Form } from '@inertiajs/react';
import { useLingui } from '@lingui/react';
import {
    ArrowLeft,
    Check,
    Copy,
    Keyboard,
    ScanLine,
    ShieldCheck,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AuthOtpInput, AuthStatusPanel } from '@/components/auth';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useAppearance } from '@/hooks/use-appearance';
import { useClipboard } from '@/hooks/use-clipboard';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { confirm } from '@/routes/two-factor';

function GridScanIcon() {
    return (
        <div className="mb-3 rounded-full border border-border bg-card p-0.5 shadow-sm">
            <div className="relative overflow-hidden rounded-full border border-border bg-muted p-2.5">
                <div className="absolute inset-0 grid grid-cols-5 opacity-50">
                    {Array.from({ length: 5 }, (_, i) => (
                        <div
                            key={`col-${i + 1}`}
                            className="border-r border-border last:border-r-0"
                        />
                    ))}
                </div>
                <div className="absolute inset-0 grid grid-rows-5 opacity-50">
                    {Array.from({ length: 5 }, (_, i) => (
                        <div
                            key={`row-${i + 1}`}
                            className="border-b border-border last:border-b-0"
                        />
                    ))}
                </div>
                <ScanLine className="relative z-20 size-6 text-foreground" />
            </div>
        </div>
    );
}

function TwoFactorSetupStep({
    qrCodeSvg,
    manualSetupKey,
    buttonText,
    onNextStep,
    errors,
}: {
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    buttonText: string;
    onNextStep: () => void;
    errors: string[];
}) {
    const { i18n } = useLingui();
    const { resolvedAppearance } = useAppearance();
    const [copiedText, copy] = useClipboard();
    const [setupMode, setSetupMode] = useState<'qr' | 'manual'>('qr');
    const IconComponent = copiedText === manualSetupKey ? Check : Copy;

    return (
        <div className="grid w-full gap-5">
            {errors?.length ? (
                <AuthStatusPanel variant="error">
                    <ul className="list-disc space-y-1 pl-4">
                        {Array.from(new Set(errors)).map((error) => (
                            <li key={error}>{error}</li>
                        ))}
                    </ul>
                </AuthStatusPanel>
            ) : (
                <>
                    <ToggleGroup
                        type="single"
                        variant="outline"
                        value={setupMode}
                        onValueChange={(value) => {
                            if (value === 'qr' || value === 'manual') {
                                setSetupMode(value);
                            }
                        }}
                        className="grid w-full grid-cols-2"
                        aria-label={i18n._(
                            'settings.twoFactor.modal.setupMethodLabel',
                        )}
                    >
                        <ToggleGroupItem
                            value="qr"
                            className="h-10 w-full text-sm"
                        >
                            <ScanLine className="size-4" />
                            {i18n._('settings.twoFactor.modal.qrCodeTab')}
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="manual"
                            className="h-10 w-full text-sm"
                        >
                            <Keyboard className="size-4" />
                            {i18n._('settings.twoFactor.modal.manualKeyTab')}
                        </ToggleGroupItem>
                    </ToggleGroup>

                    {setupMode === 'qr' ? (
                        <div className="mx-auto flex max-w-md overflow-hidden">
                            <div className="mx-auto aspect-square w-64 rounded-lg border border-zinc-200/80 bg-zinc-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                                <div className="z-10 flex h-full w-full items-center justify-center p-5">
                                    {qrCodeSvg ? (
                                        <div
                                            className="aspect-square w-full rounded-lg bg-white p-2 [&_svg]:size-full"
                                            dangerouslySetInnerHTML={{
                                                __html: qrCodeSvg,
                                            }}
                                            style={{
                                                filter:
                                                    resolvedAppearance ===
                                                    'dark'
                                                        ? 'invert(1) brightness(1.5)'
                                                        : undefined,
                                            }}
                                        />
                                    ) : (
                                        <Spinner />
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-3 rounded-lg border border-zinc-200/80 bg-zinc-50/70 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                            <p className="text-sm text-muted-foreground">
                                {i18n._('settings.twoFactor.modal.manualEntry')}
                            </p>
                            <div className="flex w-full items-stretch overflow-hidden rounded-md border border-input bg-background">
                                {manualSetupKey ? (
                                    <>
                                        <Input
                                            type="text"
                                            readOnly
                                            value={manualSetupKey}
                                            className="h-10 rounded-none border-0 font-mono text-sm shadow-none focus-visible:ring-0"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => copy(manualSetupKey)}
                                            aria-label={i18n._(
                                                'settings.twoFactor.modal.copySetupKey',
                                            )}
                                            className="h-10 rounded-none border-l"
                                        >
                                            <IconComponent className="size-4" />
                                        </Button>
                                    </>
                                ) : (
                                    <div className="flex h-10 w-full items-center justify-center">
                                        <Spinner />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex w-full">
                        <Button className="w-full" onClick={onNextStep}>
                            <ShieldCheck />
                            {buttonText}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

function TwoFactorVerificationStep({
    onClose,
    onBack,
}: {
    onClose: () => void;
    onBack: () => void;
}) {
    const { i18n } = useLingui();
    const [code, setCode] = useState<string>('');
    const pinInputContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            pinInputContainerRef.current?.querySelector('input')?.focus();
        }, 0);
    }, []);

    return (
        <Form
            {...confirm.form()}
            onSuccess={() => onClose()}
            resetOnError
            resetOnSuccess
        >
            {({
                processing,
                errors,
            }: {
                processing: boolean;
                errors?: { confirmTwoFactorAuthentication?: { code?: string } };
            }) => (
                <>
                    <div
                        ref={pinInputContainerRef}
                        className="relative w-full space-y-3"
                    >
                        <AuthOtpInput
                            autoFocus
                            className="rounded-lg border border-zinc-200 bg-zinc-50/70 px-4 py-5 dark:border-zinc-800 dark:bg-zinc-900/50"
                            disabled={processing}
                            error={errors?.confirmTwoFactorAuthentication?.code}
                            label={i18n._(
                                'settings.twoFactor.modal.verifyTitle',
                            )}
                            length={OTP_MAX_LENGTH}
                            name="code"
                            onChange={setCode}
                            value={code}
                            description={i18n._(
                                'settings.twoFactor.modal.verifyDescription',
                            )}
                        />

                        <div className="flex w-full gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={onBack}
                                disabled={processing}
                            >
                                <ArrowLeft />
                                {i18n._('settings.twoFactor.modal.backButton')}
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={
                                    processing || code.length < OTP_MAX_LENGTH
                                }
                            >
                                <ShieldCheck />
                                {i18n._(
                                    'settings.twoFactor.modal.confirmButton',
                                )}
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Form>
    );
}

type Props = {
    isOpen: boolean;
    onClose: () => void;
    requiresConfirmation: boolean;
    twoFactorEnabled: boolean;
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    clearSetupData: () => void;
    fetchSetupData: () => Promise<void>;
    errors: string[];
};

export default function TwoFactorSetupModal({
    isOpen,
    onClose,
    requiresConfirmation,
    twoFactorEnabled,
    qrCodeSvg,
    manualSetupKey,
    clearSetupData,
    fetchSetupData,
    errors,
}: Props) {
    const { i18n } = useLingui();
    const [showVerificationStep, setShowVerificationStep] =
        useState<boolean>(false);

    const modalConfig = useMemo<{
        title: string;
        description: string;
        buttonText: string;
    }>(() => {
        if (twoFactorEnabled) {
            return {
                title: i18n._('settings.twoFactor.modal.enabledTitle'),
                description: i18n._(
                    'settings.twoFactor.modal.enabledDescription',
                ),
                buttonText: i18n._('settings.twoFactor.modal.closeButton'),
            };
        }

        if (showVerificationStep) {
            return {
                title: i18n._('settings.twoFactor.modal.verifyTitle'),
                description: i18n._(
                    'settings.twoFactor.modal.verifyDescription',
                ),
                buttonText: i18n._('settings.twoFactor.modal.continueButton'),
            };
        }

        return {
            title: i18n._('settings.twoFactor.modal.enableTitle'),
            description: i18n._('settings.twoFactor.modal.enableDescription'),
            buttonText: i18n._('settings.twoFactor.modal.continueButton'),
        };
    }, [i18n, twoFactorEnabled, showVerificationStep]);

    const resetModalState = useCallback(() => {
        setShowVerificationStep(false);
        clearSetupData();
    }, [clearSetupData]);

    const handleClose = useCallback(() => {
        resetModalState();
        onClose();
    }, [onClose, resetModalState]);

    const handleModalNextStep = useCallback(() => {
        if (requiresConfirmation) {
            setShowVerificationStep(true);

            return;
        }

        handleClose();
    }, [requiresConfirmation, handleClose]);

    const fetchSetupDataRef = useRef(fetchSetupData);

    useEffect(() => {
        fetchSetupDataRef.current = fetchSetupData;
    }, [fetchSetupData]);

    useEffect(() => {
        if (isOpen && !qrCodeSvg) {
            fetchSetupDataRef.current();
        }
    }, [isOpen, qrCodeSvg]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex items-center justify-center">
                    <GridScanIcon />
                    <DialogTitle>{modalConfig.title}</DialogTitle>
                    <DialogDescription className="text-center">
                        {modalConfig.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center space-y-5">
                    {showVerificationStep ? (
                        <TwoFactorVerificationStep
                            onClose={handleClose}
                            onBack={() => setShowVerificationStep(false)}
                        />
                    ) : (
                        <TwoFactorSetupStep
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            buttonText={modalConfig.buttonText}
                            onNextStep={handleModalNextStep}
                            errors={errors}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
