import { useLingui } from '@lingui/react';
import { Languages } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { useState } from 'react';
import { activateLocale, locales, persistLocale } from '@/i18n';
import type { Locale } from '@/i18n';
import { cn } from '@/lib/utils';

const localeEntries = Object.entries(locales) as [Locale, string][];

export default function LanguageTabs({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { i18n } = useLingui();
    const [pending, setPending] = useState<Locale | null>(null);
    const [error, setError] = useState<string | null>(null);

    const current = (i18n.locale as Locale | '') || 'en';

    const updateLocale = async (next: Locale): Promise<void> => {
        if (next === current || pending) {
            return;
        }

        setError(null);
        setPending(next);

        try {
            const activated = await activateLocale(next);
            persistLocale(activated);
        } catch {
            setError(i18n._('settings.language.error'));
        } finally {
            setPending(null);
        }
    };

    return (
        <div className="space-y-3">
            <div
                role="radiogroup"
                aria-label={i18n._('settings.language.headingTitle')}
                className={cn(
                    'inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800',
                    className,
                )}
                {...props}
            >
                {localeEntries.map(([value, label]) => {
                    const isActive = current === value;

                    return (
                        <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={isActive}
                            disabled={pending !== null}
                            onClick={() => {
                                void updateLocale(value);
                            }}
                            className={cn(
                                'flex items-center rounded-md px-3.5 py-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-60',
                                isActive
                                    ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                                    : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                            )}
                        >
                            <Languages className="-ml-1 h-4 w-4" />
                            <span className="ml-1.5 text-sm">{label}</span>
                        </button>
                    );
                })}
            </div>

            {error && (
                <p
                    role="alert"
                    aria-live="assertive"
                    className="text-sm text-red-600 dark:text-red-500"
                >
                    {error}
                </p>
            )}
        </div>
    );
}
