import { Form } from '@inertiajs/react';
import { useLingui } from '@lingui/react';
import { Eye, EyeOff, LockKeyhole, RefreshCw } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { AuthStatusPanel } from '@/components/auth';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { regenerateRecoveryCodes } from '@/routes/two-factor';

type Props = {
    recoveryCodesList: string[];
    fetchRecoveryCodes: () => Promise<void>;
    errors: string[];
};

export default function TwoFactorRecoveryCodes({
    recoveryCodesList,
    fetchRecoveryCodes,
    errors,
}: Props) {
    const { i18n } = useLingui();
    const [codesAreVisible, setCodesAreVisible] = useState<boolean>(false);
    const codesSectionRef = useRef<HTMLDivElement | null>(null);
    const canRegenerateCodes = recoveryCodesList.length > 0 && codesAreVisible;

    const toggleCodesVisibility = useCallback(async () => {
        if (!codesAreVisible && !recoveryCodesList.length) {
            await fetchRecoveryCodes();
        }

        setCodesAreVisible(!codesAreVisible);

        if (!codesAreVisible) {
            setTimeout(() => {
                codesSectionRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            });
        }
    }, [codesAreVisible, recoveryCodesList.length, fetchRecoveryCodes]);

    const RecoveryCodeIconComponent = codesAreVisible ? EyeOff : Eye;

    return (
        <Card className="rounded-lg border-zinc-200/80 shadow-sm dark:border-zinc-800">
            <CardHeader className="gap-3">
                <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                        <LockKeyhole
                            className="size-4 text-muted-foreground"
                            aria-hidden="true"
                        />
                    </div>
                    <div className="grid gap-1">
                        <CardTitle className="leading-6">
                            {i18n._('settings.recoveryCodes.title')}
                        </CardTitle>
                        <CardDescription>
                            {i18n._('settings.recoveryCodes.description')}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="flex flex-col gap-3 select-none sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        onClick={toggleCodesVisibility}
                        variant={codesAreVisible ? 'secondary' : 'default'}
                        className="w-full sm:w-fit"
                        aria-expanded={codesAreVisible}
                        aria-controls="recovery-codes-section"
                    >
                        <RecoveryCodeIconComponent
                            className="size-4"
                            aria-hidden="true"
                        />
                        {codesAreVisible
                            ? i18n._('settings.recoveryCodes.hide')
                            : i18n._('settings.recoveryCodes.view')}
                    </Button>

                    {canRegenerateCodes && (
                        <Form
                            {...regenerateRecoveryCodes.form()}
                            options={{ preserveScroll: true }}
                            onSuccess={fetchRecoveryCodes}
                        >
                            {({ processing }) => (
                                <Button
                                    variant="outline"
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-fit"
                                    aria-describedby="regenerate-warning"
                                >
                                    <RefreshCw />{' '}
                                    {i18n._(
                                        'settings.recoveryCodes.regenerate',
                                    )}
                                </Button>
                            )}
                        </Form>
                    )}
                </div>

                <div
                    id="recovery-codes-section"
                    className={`relative overflow-hidden transition-all duration-300 ${codesAreVisible ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}
                    aria-hidden={!codesAreVisible}
                >
                    <div className="space-y-3">
                        {errors?.length ? (
                            <AuthStatusPanel variant="error">
                                <ul className="list-disc space-y-1 pl-4">
                                    {Array.from(new Set(errors)).map(
                                        (error) => (
                                            <li key={error}>{error}</li>
                                        ),
                                    )}
                                </ul>
                            </AuthStatusPanel>
                        ) : (
                            <>
                                <div
                                    ref={codesSectionRef}
                                    className="grid gap-2 rounded-lg border border-zinc-200/80 bg-zinc-50 p-4 font-mono text-sm dark:border-zinc-800 dark:bg-zinc-900/50"
                                    role="list"
                                    aria-label={i18n._(
                                        'settings.recoveryCodes.listAriaLabel',
                                    )}
                                >
                                    {recoveryCodesList.length ? (
                                        recoveryCodesList.map((code) => (
                                            <div
                                                key={code}
                                                role="listitem"
                                                className="rounded border border-transparent px-2 py-1 text-foreground select-text"
                                            >
                                                {code}
                                            </div>
                                        ))
                                    ) : (
                                        <div
                                            className="space-y-2"
                                            aria-label={i18n._(
                                                'settings.recoveryCodes.loadingAriaLabel',
                                            )}
                                        >
                                            {Array.from(
                                                { length: 8 },
                                                (_, index) => (
                                                    <div
                                                        key={index}
                                                        className="h-4 animate-pulse rounded bg-muted-foreground/20"
                                                        aria-hidden="true"
                                                    />
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>

                                <AuthStatusPanel
                                    variant="warning"
                                    className="text-xs"
                                >
                                    <p id="regenerate-warning">
                                        {(() => {
                                            const tail = i18n._(
                                                'settings.recoveryCodes.regenerateWarning2',
                                            );
                                            const tailNeedsSpace =
                                                tail.length > 0 &&
                                                !/^[\s.,;:!?)\]}»”"']/.test(
                                                    tail,
                                                );

                                            return (
                                                <>
                                                    {i18n._(
                                                        'settings.recoveryCodes.regenerateWarning1',
                                                    )}{' '}
                                                    <span className="font-bold">
                                                        {i18n._(
                                                            'settings.recoveryCodes.regenerateLink',
                                                        )}
                                                    </span>
                                                    {tailNeedsSpace ? ' ' : ''}
                                                    {tail}
                                                </>
                                            );
                                        })()}
                                    </p>
                                </AuthStatusPanel>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
