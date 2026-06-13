import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as ReactModule from 'react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ConfirmPassword from '@/pages/auth/confirm-password';
import ForgotPassword from '@/pages/auth/forgot-password';
import ResetPassword from '@/pages/auth/reset-password';
import VerifyEmail from '@/pages/auth/verify-email';

type MockFormState = {
    errors: Record<string, string | undefined>;
    processing: boolean;
};

const testState = vi.hoisted(() => ({
    form: {
        errors: {} as Record<string, string | undefined>,
        processing: false,
    },
    passkey: {
        error: null as string | null,
        isLoading: false,
        isSupported: true,
        verify: vi.fn(),
    },
}));

vi.mock('@inertiajs/react', async () => {
    const React = await vi.importActual<typeof ReactModule>('react');

    type LinkHref = string | { url?: string };

    const hrefToString = (href: LinkHref): string =>
        typeof href === 'string' ? href : (href.url ?? '');

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
        Link: ({
            children,
            href,
            ...props
        }: {
            children: ReactNode;
            href: LinkHref;
        }) =>
            React.createElement(
                'a',
                { ...props, href: hrefToString(href) },
                children,
            ),
        router: {
            visit: vi.fn(),
        },
    };
});

vi.mock('@laravel/passkeys/react', () => ({
    usePasskeyVerify: () => testState.passkey,
}));

const messages = {
    'auth.confirmPassword.brandDescription':
        'Confirm your identity before GuardGuide continues.',
    'auth.confirmPassword.brandTitle': 'GuardGuide',
    'auth.confirmPassword.errorTitle': 'Please confirm your password.',
    'auth.confirmPassword.metaTitle': 'Confirm password',
    'auth.confirmPassword.passkeyLabel': 'Confirm with passkey',
    'auth.confirmPassword.passkeyLoading': 'Confirming...',
    'auth.confirmPassword.passkeySeparator': 'Or confirm with password',
    'auth.confirmPassword.securityNotice':
        'This secure area needs a fresh confirmation.',
    'auth.confirmPassword.submit': 'Confirm password',
    'auth.forgotPassword.brandDescription':
        'Request a secure link to get back into GuardGuide.',
    'auth.forgotPassword.brandTitle': 'GuardGuide',
    'auth.forgotPassword.emailLabel': 'Email address',
    'auth.forgotPassword.emailPlaceholder': 'email@example.com',
    'auth.forgotPassword.errorTitle': 'Please check the email address.',
    'auth.forgotPassword.metaTitle': 'Forgot password',
    'auth.forgotPassword.returnLead': 'Or, return to',
    'auth.forgotPassword.returnLink': 'log in',
    'auth.forgotPassword.submit': 'Email password reset link',
    'auth.login.password': 'Password',
    'auth.login.passwordPlaceholder': 'Password',
    'auth.resetPassword.brandDescription':
        'Set a new password for your GuardGuide account.',
    'auth.resetPassword.brandTitle': 'GuardGuide',
    'auth.resetPassword.confirmLabel': 'Confirm password',
    'auth.resetPassword.confirmPlaceholder': 'Confirm password',
    'auth.resetPassword.emailLabel': 'Email',
    'auth.resetPassword.errorTitle': 'Please check the new password.',
    'auth.resetPassword.metaTitle': 'Reset password',
    'auth.resetPassword.passwordLabel': 'Password',
    'auth.resetPassword.passwordPlaceholder': 'Password',
    'auth.resetPassword.submit': 'Reset password',
    'auth.verifyEmail.brandDescription':
        'Verify your email address to finish securing GuardGuide.',
    'auth.verifyEmail.brandTitle': 'GuardGuide',
    'auth.verifyEmail.linkSent':
        'A new verification link has been sent to the email address you provided during registration.',
    'auth.verifyEmail.logout': 'Log out',
    'auth.verifyEmail.metaTitle': 'Email verification',
    'auth.verifyEmail.pendingNotice':
        'Check your inbox and follow the verification link to continue.',
    'auth.verifyEmail.resend': 'Resend verification email',
};

function renderWithI18n(children: ReactNode) {
    return render(<I18nProvider i18n={i18n}>{children}</I18nProvider>);
}

describe('supporting auth pages', () => {
    afterEach(() => {
        cleanup();
    });

    beforeEach(() => {
        i18n.load('en', messages);
        i18n.activate('en');

        testState.form.errors = {};
        testState.form.processing = false;
        testState.passkey.error = null;
        testState.passkey.isLoading = false;
        testState.passkey.isSupported = true;
        testState.passkey.verify.mockReset();
    });

    it('renders forgot-password in the GuardGuide auth shell with status and form target', () => {
        const { container } = renderWithI18n(
            <ForgotPassword status="We have emailed your password reset link." />,
        );

        const card = screen.getByTestId('forgot-password-card');

        expect(screen.getByRole('main')).toContainElement(card);
        expect(card).toHaveAttribute(
            'aria-labelledby',
            'forgot-password-title',
        );
        expect(
            screen.getByText(
                'Request a secure link to get back into GuardGuide.',
            ),
        ).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent(
            'We have emailed your password reset link.',
        );
        expect(container.querySelector('form')).toHaveAttribute(
            'action',
            '/forgot-password',
        );
        expect(container.querySelector('form')).toHaveAttribute(
            'method',
            'post',
        );
        expect(screen.getByLabelText('Email address')).toBeEnabled();
        expect(screen.getByRole('link', { name: /log in/ })).toHaveAttribute(
            'href',
            '/login',
        );
    });

    it('surfaces forgot-password validation errors in the shared alert style', () => {
        testState.form.errors = {
            email: 'We cannot find a user with that email address.',
        };

        renderWithI18n(<ForgotPassword />);

        const alert = screen.getByRole('alert');

        expect(alert).toHaveTextContent('Please check the email address.');
        expect(alert).toHaveTextContent(
            'We cannot find a user with that email address.',
        );
        expect(screen.getByLabelText('Email address')).toHaveAttribute(
            'aria-invalid',
            'true',
        );
        expect(
            screen.getAllByText(
                'We cannot find a user with that email address.',
            ),
        ).toHaveLength(2);
    });

    it('renders reset-password with disabled processing state and field errors', () => {
        testState.form.processing = true;
        testState.form.errors = {
            password: 'The password must be at least 8 characters.',
            password_confirmation: 'The password confirmation does not match.',
        };

        const { container } = renderWithI18n(
            <ResetPassword
                token="reset-token"
                email="user@example.com"
                passwordRules="minlength:8"
            />,
        );

        expect(screen.getByTestId('reset-password-card')).toHaveAttribute(
            'aria-labelledby',
            'reset-password-title',
        );
        expect(container.querySelector('form')).toHaveAttribute(
            'action',
            '/reset-password',
        );
        expect(screen.getByRole('alert')).toHaveTextContent(
            'Please check the new password.',
        );
        expect(screen.getByLabelText('Email')).toHaveValue('user@example.com');
        expect(screen.getByLabelText('Email')).toBeDisabled();
        expect(screen.getByLabelText('Password')).toBeDisabled();
        expect(screen.getByLabelText('Confirm password')).toHaveAttribute(
            'aria-invalid',
            'true',
        );

        const submit = screen.getByRole('button', { name: /Reset password/ });

        expect(submit).toBeDisabled();
        expect(submit).toHaveAttribute('aria-busy', 'true');
    });

    it('renders confirm-password with passkey confirmation and password fallback', async () => {
        const user = userEvent.setup();
        testState.passkey.error = 'Passkey confirmation failed.';

        const { container } = renderWithI18n(<ConfirmPassword />);

        expect(screen.getByTestId('confirm-password-card')).toHaveAttribute(
            'aria-labelledby',
            'confirm-password-title',
        );
        expect(screen.getByRole('status')).toHaveTextContent(
            'This secure area needs a fresh confirmation.',
        );
        expect(container.querySelector('form')).toHaveAttribute(
            'action',
            '/user/confirm-password',
        );
        expect(screen.getByText('Passkey confirmation failed.')).toBeVisible();

        await user.click(
            screen.getByRole('button', { name: 'Confirm with passkey' }),
        );

        expect(testState.passkey.verify).toHaveBeenCalledOnce();
        expect(screen.getByLabelText('Password')).toBeEnabled();
        expect(
            screen.getByRole('button', { name: 'Confirm password' }),
        ).toBeEnabled();
    });

    it('renders verify-email pending and resend-success states in status panels', () => {
        const { rerender, container } = renderWithI18n(<VerifyEmail />);

        expect(screen.getByTestId('verify-email-card')).toHaveAttribute(
            'aria-labelledby',
            'verify-email-title',
        );
        expect(screen.getByRole('status')).toHaveTextContent(
            'Check your inbox and follow the verification link to continue.',
        );
        expect(container.querySelector('form')).toHaveAttribute(
            'action',
            '/email/verification-notification',
        );
        expect(
            screen.getByRole('button', { name: 'Resend verification email' }),
        ).toBeEnabled();
        expect(screen.getByRole('link', { name: /Log out/ })).toHaveAttribute(
            'href',
            '/logout',
        );

        rerender(
            <I18nProvider i18n={i18n}>
                <VerifyEmail status="verification-link-sent" />
            </I18nProvider>,
        );

        expect(screen.getByRole('status')).toHaveTextContent(
            'A new verification link has been sent to the email address you provided during registration.',
        );
    });
});
