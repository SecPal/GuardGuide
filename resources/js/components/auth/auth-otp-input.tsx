import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { KeyRound } from 'lucide-react';
import { useId } from 'react';
import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type AuthOtpInputProps = {
    autoFocus?: boolean;
    className?: string;
    description?: ReactNode;
    disabled?: boolean;
    error?: string;
    id?: string;
    label: ReactNode;
    length: number;
    name?: string;
    onChange?: (value: string) => void;
    value?: string;
};

export function AuthOtpInput({
    autoFocus,
    className,
    description,
    disabled,
    error,
    id,
    label,
    length,
    name,
    onChange,
    value,
}: AuthOtpInputProps) {
    const reactId = useId();
    const baseId = id ?? name ?? `otp-${reactId}`;
    const inputId = `${baseId}-input`;
    const descriptionId = description ? `${baseId}-description` : undefined;
    const errorId = error ? `${baseId}-error` : undefined;

    return (
        <div className={cn('grid justify-items-center gap-3', className)}>
            <Label
                htmlFor={inputId}
                className="flex items-center gap-2 text-sm font-medium"
            >
                <KeyRound
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                />
                {label}
            </Label>

            {description && (
                <p
                    id={descriptionId}
                    className="max-w-sm text-center text-sm text-muted-foreground"
                >
                    {description}
                </p>
            )}

            <InputOTP
                id={inputId}
                aria-describedby={
                    [descriptionId, errorId].filter(Boolean).join(' ') ||
                    undefined
                }
                aria-invalid={Boolean(error)}
                autoFocus={autoFocus}
                disabled={disabled}
                maxLength={length}
                name={name}
                onChange={onChange}
                pattern={REGEXP_ONLY_DIGITS}
                value={value}
            >
                <InputOTPGroup>
                    {Array.from({ length }, (_, index) => (
                        <InputOTPSlot key={index} index={index} />
                    ))}
                </InputOTPGroup>
            </InputOTP>

            <InputError id={errorId} message={error} />
        </div>
    );
}
