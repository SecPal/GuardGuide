import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import {
    AuthBrandBlock,
    AuthCardFrame,
    AuthFormSection,
    AuthOtpInput,
    AuthShell,
    AuthStatusPanel,
} from '@/components/auth';

describe('auth primitives', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders the auth shell, brand block, and card frame', () => {
        render(
            <AuthShell>
                <AuthBrandBlock
                    href="/"
                    title="Sign in"
                    description="Use your GuardGuide account."
                />
                <AuthCardFrame
                    title="Protected area"
                    description="Verification is required."
                    footer={<span>Local GuardGuide auth</span>}
                >
                    <button type="button">Continue</button>
                </AuthCardFrame>
            </AuthShell>,
        );

        expect(screen.getByRole('main')).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { level: 1, name: 'Sign in' }),
        ).toBeInTheDocument();
        expect(screen.getByText('Protected area')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Continue' }),
        ).toBeInTheDocument();
        expect(screen.getByText('Local GuardGuide auth')).toBeInTheDocument();
    });

    it('renders status and error surfaces with the correct live-region roles', () => {
        render(
            <div>
                <AuthStatusPanel
                    variant="success"
                    title="Email sent"
                    message="Check your inbox."
                />
                <AuthStatusPanel
                    variant="error"
                    title="Login failed"
                    message="The credentials were rejected."
                />
            </div>,
        );

        expect(screen.getByRole('status')).toHaveTextContent('Email sent');
        expect(screen.getByRole('alert')).toHaveTextContent('Login failed');
        expect(screen.getByRole('alert')).toHaveTextContent(
            'The credentials were rejected.',
        );
    });

    it('announces warnings assertively so security prompts are not missed', () => {
        render(
            <AuthStatusPanel
                variant="warning"
                title="Two-factor disabled"
                message="Enable two-factor authentication."
            />,
        );

        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent('Two-factor disabled');
        expect(alert).toHaveTextContent('Enable two-factor authentication.');
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('renders form sections with headings and actions', () => {
        render(
            <AuthFormSection
                title="Account"
                description="Enter the account details."
                actions={<a href="/help">Help</a>}
            >
                <input aria-label="Email" type="email" />
            </AuthFormSection>,
        );

        expect(screen.getByText('Account')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Help' })).toHaveAttribute(
            'href',
            '/help',
        );
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('captures one-time-password input and exposes validation state', async () => {
        const user = userEvent.setup();

        function OtpHarness() {
            const [value, setValue] = useState('');

            return (
                <AuthOtpInput
                    label="Security code"
                    length={6}
                    name="code"
                    value={value}
                    onChange={setValue}
                    error="Enter the six-digit code."
                />
            );
        }

        render(<OtpHarness />);

        const input = screen.getByLabelText('Security code');

        await user.type(input, '123456');

        expect(input).toHaveValue('123456');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(
            screen.getByText('Enter the six-digit code.'),
        ).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('6')).toBeInTheDocument();
    });

    it('associates the visible OTP label with the input via htmlFor', () => {
        render(
            <AuthOtpInput
                label={<span>Authenticator code</span>}
                length={6}
                name="code"
            />,
        );

        const input = document.querySelector(
            'input[name="code"]',
        ) as HTMLInputElement | null;
        expect(input).not.toBeNull();
        expect(input).toHaveAttribute('id');

        const label = screen
            .getByText('Authenticator code')
            .closest('label') as HTMLLabelElement | null;
        expect(label).not.toBeNull();
        expect(label).toHaveAttribute('for', input?.id);
    });
});
