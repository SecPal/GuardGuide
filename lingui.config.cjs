/* eslint-disable @typescript-eslint/no-require-imports, no-undef */

const { formatter } = require('@lingui/format-po');

/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
    locales: ['en', 'de'],
    sourceLocale: 'en',
    catalogs: [
        {
            path: 'resources/js/locales/{locale}/messages',
            include: ['resources/js'],
            exclude: ['**/*.d.ts'],
        },
    ],
    format: formatter({ lineNumbers: false, explicitIdAsDefault: true }),
    orderBy: 'messageId',
};