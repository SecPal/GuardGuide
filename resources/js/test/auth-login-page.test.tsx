import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as ReactModule from 'react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Login from '@/pages/auth/login';

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
    'auth.login.brandDescription':
        'SecPal-style access for your GuardGuide workspace.',
    'auth.login.brandTitle': 'GuardGuide',
    'auth.login.email': 'Email address',
    'auth.login.emailPlaceholder': 'email@example.com',
    'auth.login.errorTitle': 'Please check the highlighted fields.',
    'auth.login.forgotPassword': 'Forgot your password?',
    'auth.login.metaTitle': 'Log in',
    'auth.login.password': 'Password',
    'auth.login.passwordPlaceholder': 'Password',
    'auth.login.remember': 'Remember me',
    'auth.login.submit': 'Log in',
    'auth.passkey.defaultLabel': 'Sign in with a passkey',
    'auth.passkey.defaultLoading': 'Authenticating...',
    'auth.passkey.defaultSeparator': 'Or continue with email',
    'settings.language.error': 'Could not change language. Please try again.',
    'settings.language.headingTitle': 'Language',
};

function renderLogin(props: Partial<Parameters<typeof Login>[0]> = {}) {
    return render(
        <I18nProvider i18n={i18n}>
            <Login canResetPassword={true} {...props} />
        </I18nProvider>,
    );
}

describe('login page', () => {
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

    it('renders one centered card with the complete login control surface', async () => {
        const user = userEvent.setup();
        const { container } = renderLogin();

        const card = screen.getByTestId('login-card');

        expect(screen.getByRole('main')).toContainElement(card);
        expect(screen.getAllByTestId('login-card')).toHaveLength(1);
        expect(card).toHaveAttribute('aria-labelledby', 'login-card-title');
        expect(
            screen.getByRole('heading', { name: 'GuardGuide' }),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'SecPal-style access for your GuardGuide workspace.',
            ),
        ).toBeInTheDocument();
        expect(container.querySelectorAll('form')).toHaveLength(1);

        expect(screen.getByLabelText('Email address')).toBeEnabled();
        expect(screen.getByLabelText('Password')).toBeEnabled();
        expect(
            screen.getByRole('checkbox', { name: 'Remember me' }),
        ).toBeEnabled();
        expect(
            screen.getByRole('link', { name: 'Forgot your password?' }),
        ).toHaveAttribute('href', '/forgot-password');
        expect(screen.getByRole('button', { name: 'Log in' })).toBeEnabled();
        expect(
            screen.getByRole('radiogroup', { name: 'Language' }),
        ).toBeInTheDocument();

        await user.click(
            screen.getByRole('button', { name: 'Sign in with a passkey' }),
        );

        expect(testState.passkey.verify).toHaveBeenCalledOnce();
    });

    it('surfaces validation errors in the card hierarchy', () => {
        testState.form.errors = {
            email: 'These credentials do not match our records.',
            password: 'The password field is required.',
        };

        renderLogin();

        const alert = screen.getByRole('alert');

        expect(alert).toHaveTextContent('Please check the highlighted fields.');
        expect(alert).toHaveTextContent(
            'These credentials do not match our records.',
        );
        expect(alert).toHaveTextContent('The password field is required.');
        expect(screen.getByLabelText('Email address')).toHaveAttribute(
            'aria-invalid',
            'true',
        );
        expect(screen.getByLabelText('Password')).toHaveAttribute(
            'aria-invalid',
            'true',
        );
        expect(
            screen.getAllByText('These credentials do not match our records.'),
        ).toHaveLength(2);
        expect(
            screen.getAllByText('The password field is required.'),
        ).toHaveLength(2);
    });

    it('makes loading and disabled states visible while login is processing', () => {
        testState.form.processing = true;
        testState.passkey.isLoading = true;

        renderLogin();

        expect(screen.getByLabelText('Email address')).toBeDisabled();
        expect(screen.getByLabelText('Password')).toBeDisabled();
        expect(
            screen.getByRole('checkbox', { name: 'Remember me' }),
        ).toBeDisabled();

        const submit = screen.getByRole('button', { name: /Log in/ });
        const passkey = screen.getByRole('button', {
            name: /Authenticating/,
        });

        expect(submit).toBeDisabled();
        expect(submit).toHaveAttribute('aria-busy', 'true');
        expect(passkey).toBeDisabled();
        expect(screen.getAllByRole('status', { name: 'Loading' }).length).toBe(
            2,
        );
    });
});
