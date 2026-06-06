import { Head } from '@inertiajs/react';
import { i18n } from '@lingui/core';
import { useLingui } from '@lingui/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    const { i18n } = useLingui();

    return (
        <>
            <Head title={i18n._('settings.appearance.metaTitle')} />

            <h1 className="sr-only">
                {i18n._('settings.appearance.metaTitle')}
            </h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={i18n._('settings.appearance.headingTitle')}
                    description={i18n._(
                        'settings.appearance.headingDescription',
                    )}
                />
                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = () => ({
    breadcrumbs: [
        {
            title: () => i18n._('settings.appearance.breadcrumb'),
            href: editAppearance(),
        },
    ],
});
