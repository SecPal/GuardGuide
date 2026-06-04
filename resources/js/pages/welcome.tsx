import { Head, Link, usePage } from '@inertiajs/react';
import { i18n } from '@lingui/core';
import { dashboard, login } from '@/routes';

export default function Welcome() {
    const { auth } = usePage<{ auth: { user: unknown | null } }>().props;

    const highlights = [
        {
            title: i18n._('welcome.feature.publication.title'),
            body: i18n._('welcome.feature.publication.body'),
        },
        {
            title: i18n._('welcome.feature.acknowledgement.title'),
            body: i18n._('welcome.feature.acknowledgement.body'),
        },
        {
            title: i18n._('welcome.feature.foundation.title'),
            body: i18n._('welcome.feature.foundation.body'),
        },
    ];

    return (
        <>
            <Head title={i18n._('welcome.metaTitle')} />

            <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ece8da_0%,#f7f5ee_35%,#ffffff_100%)] text-slate-950 dark:bg-[radial-gradient(circle_at_top,#1c2218_0%,#11150f_38%,#090b08_100%)] dark:text-slate-50">
                <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.28em] text-emerald-700 uppercase dark:text-emerald-300">
                            {i18n._('common.appName')}
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            SecPal
                        </p>
                    </div>

                    <Link
                        href={auth.user ? dashboard() : login()}
                        className="inline-flex items-center rounded-full border border-slate-900/10 bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-900/20 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:border-white/20 dark:hover:bg-white/15"
                    >
                        {auth.user
                            ? i18n._('welcome.cta.dashboard')
                            : i18n._('welcome.cta.login')}
                    </Link>
                </header>

                <main className="mx-auto grid max-w-6xl gap-8 px-6 pt-8 pb-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(21rem,0.95fr)] lg:px-8 lg:pt-14 lg:pb-24">
                    <section className="rounded-[2rem] border border-slate-900/5 bg-white/80 p-8 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.45)] backdrop-blur lg:p-12 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_90px_-40px_rgba(0,0,0,0.8)]">
                        <p className="text-sm font-medium tracking-[0.24em] text-emerald-700 uppercase dark:text-emerald-300">
                            {i18n._('welcome.eyebrow')}
                        </p>

                        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance lg:text-6xl">
                            {i18n._('welcome.title')}
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 lg:text-lg dark:text-slate-300">
                            {i18n._('welcome.body')}
                        </p>

                        <div className="mt-10 flex flex-wrap gap-4">
                            <Link
                                href={auth.user ? dashboard() : login()}
                                className="inline-flex items-center rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400"
                            >
                                {auth.user
                                    ? i18n._('welcome.cta.dashboard')
                                    : i18n._('welcome.cta.login')}
                            </Link>
                        </div>
                    </section>

                    <aside className="grid gap-4">
                        {highlights.map((highlight) => (
                            <section
                                key={highlight.title}
                                className="rounded-[1.75rem] border border-slate-900/5 bg-white/70 p-6 shadow-[0_20px_70px_-45px_rgba(15,23,42,0.4)] backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-[0_20px_70px_-45px_rgba(0,0,0,0.85)]"
                            >
                                <p className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                                    {highlight.title}
                                </p>
                                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                    {highlight.body}
                                </p>
                            </section>
                        ))}
                    </aside>
                </main>
            </div>
        </>
    );
}
