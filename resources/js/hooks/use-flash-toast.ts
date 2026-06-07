import { router } from '@inertiajs/react';
import { i18n } from '@lingui/core';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashToast | undefined;

            if (!data) {
                return;
            }

            const message =
                {
                    'Password updated.': i18n._('Password updated.'),
                    'Profile updated.': i18n._('Profile updated.'),
                }[data.message] ?? i18n._(data.message);

            toast[data.type](message);
        });
    }, []);
}
