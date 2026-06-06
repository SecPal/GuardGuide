import { useLingui } from '@lingui/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { i18n } = useLingui();

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center">
                <AppLogoIcon className="size-8" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {i18n._('common.appName')}
                </span>
            </div>
        </>
    );
}
