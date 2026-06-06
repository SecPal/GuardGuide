import { Head } from '@inertiajs/react';
import { i18n } from '@lingui/core';
import { useLingui } from '@lingui/react';
import Heading from '@/components/heading';
import LanguageTabs from '@/components/language-tabs';
import { edit as editLanguage } from '@/routes/language';

export default function Language() {
    const { i18n } = useLingui();

    return (
        <>
            <Head title={i18n._('settings.language.metaTitle')} />

            <h1 className="sr-only">{i18n._('settings.language.metaTitle')}</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={i18n._('settings.language.headingTitle')}
                    description={i18n._('settings.language.headingDescription')}
                />
                <LanguageTabs />
            </div>
        </>
    );
}

Language.layout = () => ({
    breadcrumbs: [
        {
            title: () => i18n._('settings.language.breadcrumb'),
            href: editLanguage(),
        },
    ],
});
