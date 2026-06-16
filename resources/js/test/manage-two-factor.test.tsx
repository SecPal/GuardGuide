import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as ReactModule from 'react';
import type { FormEvent, ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ManageTwoFactor from '@/components/manage-two-factor';
import type * as TwoFactorHookModule from '@/hooks/use-two-factor-auth';

type MockFormState = {
    errors: Record<string, unknown>;
    processing: boolean;
};

const testState = vi.hoisted(() => ({
    form: {
        errors: {} as Record<string, unknown>,
        processing: false,
    },
    twoFactor: {
        clearSetupData: vi.fn(),
        clearTwoFactorAuthData: vi.fn(),
        errors: [] as string[],
        fetchRecoveryCodes: vi.fn(async () => undefined),
        fetchSetupData: vi.fn(async () => undefined),
        hasSetupData: false,
        manualSetupKey: null as string | null,
        qrCodeSvg: null as string | null,
        recoveryCodesList: [] as string[],
    },
}));

vi.mock('@inertiajs/react', async () => {
    const React = await vi.importActual<typeof ReactModule>('react');

    return {
        Form: ({
            action,
            children,
            className,
            method,
            onSuccess,
        }: {
            action?: string;
            children: (state: MockFormState) => ReactNode;
            className?: string;
            method?: string;
            onSuccess?: () => void;
        }) =>
            React.createElement(
                'form',
                {
                    action,
                    className,
                    method,
                    onSubmit: (event: FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        onSuccess?.();
                    },
                },
                children(testState.form),
            ),
    };
});

vi.mock('@/hooks/use-two-factor-auth', async () => {
    const actual = await vi.importActual<typeof TwoFactorHookModule>(
        '@/hooks/use-two-factor-auth',
    );

    return {
        ...actual,
        useTwoFactorAuth: () => testState.twoFactor,
    };
});

vi.mock('@/hooks/use-appearance', () => ({
    useAppearance: () => ({ resolvedAppearance: 'light' }),
}));

const messages = {
    common: 'Common',
    'settings.recoveryCodes.description':
        'Recovery codes let you regain access if you lose your 2FA device.',
    'settings.recoveryCodes.hide': 'Hide recovery codes',
    'settings.recoveryCodes.listAriaLabel': 'Recovery codes',
    'settings.recoveryCodes.loadingAriaLabel': 'Loading recovery codes',
    'settings.recoveryCodes.regenerate': 'Regenerate codes',
    'settings.recoveryCodes.regenerateLink': 'Regenerate codes',
    'settings.recoveryCodes.regenerateWarning1':
        'Each recovery code can be used once. If you need more, click',
    'settings.recoveryCodes.regenerateWarning2': 'above.',
    'settings.recoveryCodes.title': '2FA recovery codes',
    'settings.recoveryCodes.view': 'View recovery codes',
    'settings.twoFactor.continueSetupButton': 'Continue setup',
    'settings.twoFactor.description':
        'Manage your two-factor authentication settings',
    'settings.twoFactor.disableButton': 'Disable 2FA',
    'settings.twoFactor.disabledDescription':
        'Enable two-factor authentication to require a secure code during login.',
    'settings.twoFactor.enableButton': 'Enable 2FA',
    'settings.twoFactor.enabledDescription':
        'Two-factor authentication is required during login.',
    'settings.twoFactor.modal.backButton': 'Back',
    'settings.twoFactor.modal.closeButton': 'Close',
    'settings.twoFactor.modal.confirmButton': 'Confirm',
    'settings.twoFactor.modal.continueButton': 'Continue',
    'settings.twoFactor.modal.copySetupKey': 'Copy setup key',
    'settings.twoFactor.modal.enabledDescription':
        'Two-factor authentication is now enabled.',
    'settings.twoFactor.modal.enableDescription':
        'Scan the QR code or enter the setup key in your authenticator app.',
    'settings.twoFactor.modal.enabledTitle':
        'Two-factor authentication enabled',
    'settings.twoFactor.modal.enableTitle': 'Enable two-factor authentication',
    'settings.twoFactor.modal.manualEntry': 'Enter the setup key manually.',
    'settings.twoFactor.modal.manualKeyTab': 'Setup key',
    'settings.twoFactor.modal.qrCodeTab': 'QR code',
    'settings.twoFactor.modal.setupMethodLabel': 'Setup method',
    'settings.twoFactor.modal.verifyDescription':
        'Enter the 6-digit code from your authenticator app.',
    'settings.twoFactor.modal.verifyTitle': 'Verify authentication code',
    'settings.twoFactor.title': 'Two-factor authentication',
};

function renderManageTwoFactor(
    props: Partial<Parameters<typeof ManageTwoFactor>[0]> = {},
) {
    return render(
        <I18nProvider i18n={i18n}>
            <ManageTwoFactor canManageTwoFactor={true} {...props} />
        </I18nProvider>,
    );
}

describe('two-factor management', () => {
    afterEach(() => {
        cleanup();
    });

    beforeEach(() => {
        i18n.load('en', messages);
        i18n.activate('en');

        testState.form.errors = {};
        testState.form.processing = false;
        testState.twoFactor.clearSetupData.mockReset();
        testState.twoFactor.clearTwoFactorAuthData.mockReset();
        testState.twoFactor.errors = [];
        testState.twoFactor.fetchRecoveryCodes.mockClear();
        testState.twoFactor.fetchSetupData.mockClear();
        testState.twoFactor.hasSetupData = false;
        testState.twoFactor.manualSetupKey = null;
        testState.twoFactor.qrCodeSvg = null;
        testState.twoFactor.recoveryCodesList = [];

        Element.prototype.scrollIntoView = vi.fn();
    });

    it('starts two-factor setup from the disabled state', async () => {
        const user = userEvent.setup();
        const { container } = renderManageTwoFactor({
            requiresConfirmation: true,
            twoFactorEnabled: false,
        });

        expect(screen.getByRole('alert')).toHaveTextContent(
            'Enable two-factor authentication to require a secure code during login.',
        );
        expect(container.querySelector('form')).toHaveAttribute(
            'action',
            '/user/two-factor-authentication',
        );

        await user.click(screen.getByRole('button', { name: /Enable 2FA/ }));

        expect(
            await screen.findByRole('dialog', {
                name: 'Enable two-factor authentication',
            }),
        ).toBeInTheDocument();
        expect(testState.twoFactor.fetchSetupData).toHaveBeenCalledOnce();
        expect(
            screen.getByRole('radiogroup', { name: 'Setup method' }),
        ).toBeInTheDocument();
    });

    it('confirms setup with the shared OTP input after manual setup review', async () => {
        const user = userEvent.setup();

        testState.twoFactor.hasSetupData = true;
        testState.twoFactor.manualSetupKey = 'MANUAL-SETUP-KEY';
        testState.twoFactor.qrCodeSvg = '<svg role="img"></svg>';

        renderManageTwoFactor({
            requiresConfirmation: true,
            twoFactorEnabled: false,
        });

        await user.click(
            screen.getByRole('button', { name: /Continue setup/ }),
        );
        await user.click(screen.getByRole('radio', { name: /Setup key/ }));

        expect(screen.getByDisplayValue('MANUAL-SETUP-KEY')).toHaveAttribute(
            'readonly',
        );
        expect(
            screen.getByRole('button', { name: 'Copy setup key' }),
        ).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /^Continue$/ }));

        const otpInput = screen.getByLabelText('Verify authentication code', {
            selector: 'input',
        });

        await user.type(otpInput, '123456');
        await user.click(screen.getByRole('button', { name: /Confirm/ }));

        await waitFor(() => {
            expect(
                screen.queryByRole('dialog', {
                    name: 'Verify authentication code',
                }),
            ).not.toBeInTheDocument();
        });
        expect(testState.twoFactor.clearSetupData).toHaveBeenCalled();
    });

    it('shows and regenerates recovery codes from the enabled state', async () => {
        const user = userEvent.setup();

        testState.twoFactor.recoveryCodesList = [
            'alpha-one',
            'bravo-two',
            'charlie-three',
        ];

        renderManageTwoFactor({ twoFactorEnabled: true });

        expect(screen.getByRole('status')).toHaveTextContent(
            'Two-factor authentication is required during login.',
        );

        await user.click(
            screen.getByRole('button', { name: /View recovery codes/ }),
        );

        expect(
            screen.getByRole('list', { name: 'Recovery codes' }),
        ).toBeInTheDocument();
        expect(screen.getByText('alpha-one')).toBeInTheDocument();
        expect(screen.getByText('bravo-two')).toBeInTheDocument();

        await user.click(
            screen.getByRole('button', { name: /Regenerate codes/ }),
        );

        expect(testState.twoFactor.fetchRecoveryCodes).toHaveBeenCalledOnce();
    });
});
