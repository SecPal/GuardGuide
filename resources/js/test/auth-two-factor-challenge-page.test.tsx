import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as ReactModule from 'react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TwoFactorChallenge from '@/pages/auth/two-factor-challenge';

type MockFormState = {
    clearErrors: (...fields: string[]) => void;
    errors: Record<string, string | undefined>;
    processing: boolean;
};

const testState = vi.hoisted(() => ({
    form: {
        clearErrors: vi.fn(),
        errors: {} as Record<string, string | undefined>,
        processing: false,
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
        }: {
            action?: string;
            children: (state: MockFormState) => ReactNode;
            className?: string;
            method?: string;
        }) =>
            React.createElement(
                'form',
                { action, className, method },
                children(testState.form),
            ),
        Head: () => null,
    };
});

const messages = {
    'auth.twoFactorChallenge.brandDescription':
        'Finish the protected sign-in step for your GuardGuide workspace.',
    'auth.twoFactorChallenge.brandTitle': 'GuardGuide',
    'auth.twoFactorChallenge.continue': 'Continue',
    'auth.twoFactorChallenge.errorTitle': 'Please check the verification code.',
    'auth.twoFactorChallenge.metaTitle': 'Two-factor authentication',
    'auth.twoFactorChallenge.modeLabel': 'Verification method',
    'auth.twoFactorChallenge.otp.description':
        'Enter the authentication code provided by your authenticator application.',
    'auth.twoFactorChallenge.otp.switchLabel': 'Authenticator',
    'auth.twoFactorChallenge.otp.title': 'Authentication code',
    'auth.twoFactorChallenge.recovery.description':
        'Please confirm access to your account by entering one of your emergency recovery codes.',
    'auth.twoFactorChallenge.recovery.placeholder': 'Enter recovery code',
    'auth.twoFactorChallenge.recovery.switchLabel': 'Recovery',
    'auth.twoFactorChallenge.recovery.title': 'Recovery code',
};

function renderChallenge() {
    return render(
        <I18nProvider i18n={i18n}>
            <TwoFactorChallenge />
        </I18nProvider>,
    );
}

describe('two-factor challenge page', () => {
    afterEach(() => {
        cleanup();
    });

    beforeEach(() => {
        i18n.load('en', messages);
        i18n.activate('en');

        testState.form.errors = {};
        testState.form.processing = false;
        testState.form.clearErrors.mockReset();
    });

    it('renders the challenge as a GuardGuide auth card with OTP input', async () => {
        const user = userEvent.setup();
        const { container } = renderChallenge();

        const card = screen.getByTestId('two-factor-challenge-card');

        expect(screen.getByRole('main')).toContainElement(card);
        expect(card).toHaveAttribute(
            'aria-labelledby',
            'two-factor-challenge-title',
        );
        expect(
            screen.getByRole('heading', { name: 'GuardGuide' }),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'Finish the protected sign-in step for your GuardGuide workspace.',
            ),
        ).toBeInTheDocument();
        expect(container.querySelector('form')).toHaveAttribute(
            'action',
            '/two-factor-challenge',
        );
        expect(container.querySelector('form')).toHaveAttribute(
            'method',
            'post',
        );

        const otpInput = screen.getByLabelText('Authentication code');

        expect(screen.getByRole('status')).toHaveTextContent(
            'Authentication code',
        );
        expect(screen.getByRole('status')).toHaveTextContent(
            'Enter the authentication code provided by your authenticator application.',
        );
        expect(
            screen.getByRole('radiogroup', { name: 'Verification method' }),
        ).toBeInTheDocument();
        expect(otpInput).toBeEnabled();
        expect(screen.getByRole('button', { name: /Continue/ })).toBeEnabled();

        await user.type(otpInput, '123456');

        expect(otpInput).toHaveValue('123456');
    });

    it('switches between authenticator and recovery-code entry', async () => {
        const user = userEvent.setup();

        renderChallenge();

        expect(
            screen.getByLabelText('Authentication code'),
        ).toBeInTheDocument();

        await user.click(screen.getByRole('radio', { name: /Recovery/ }));

        expect(testState.form.clearErrors).toHaveBeenCalledOnce();
        expect(
            screen.queryByLabelText('Authentication code'),
        ).not.toBeInTheDocument();
        expect(screen.getByLabelText('Recovery code')).toBeEnabled();
        expect(screen.getByLabelText('Recovery code')).toHaveAttribute(
            'name',
            'recovery_code',
        );
        expect(screen.getByRole('status')).toHaveTextContent('Recovery code');
        expect(screen.getByRole('status')).toHaveTextContent(
            'Please confirm access to your account by entering one of your emergency recovery codes.',
        );

        await user.click(screen.getByRole('radio', { name: /Authenticator/ }));

        expect(testState.form.clearErrors).toHaveBeenCalledTimes(2);
        expect(
            screen.getByLabelText('Authentication code'),
        ).toBeInTheDocument();
    });

    it('surfaces Fortify validation errors in the card and on the active field', async () => {
        const user = userEvent.setup();

        testState.form.errors = {
            code: 'The provided two factor authentication code was invalid.',
            recovery_code: 'The provided two factor recovery code was invalid.',
        };

        renderChallenge();

        const alert = screen.getByRole('alert');

        expect(alert).toHaveTextContent('Please check the verification code.');
        expect(alert).toHaveTextContent(
            'The provided two factor authentication code was invalid.',
        );
        expect(screen.getByLabelText('Authentication code')).toHaveAttribute(
            'aria-invalid',
            'true',
        );
        expect(
            screen.getAllByText(
                'The provided two factor authentication code was invalid.',
            ),
        ).toHaveLength(2);

        await user.click(screen.getByRole('radio', { name: /Recovery/ }));

        expect(screen.getByLabelText('Recovery code')).toHaveAttribute(
            'aria-invalid',
            'true',
        );
        expect(
            screen.getAllByText(
                'The provided two factor recovery code was invalid.',
            ),
        ).toHaveLength(2);
    });
});
