// SPDX-FileCopyrightText: 2026 SecPal
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, it } from 'vitest';

import eslintConfig from '../eslint.config.js';

type FlatConfig = {
    ignores?: string[];
    plugins?: Record<string, unknown>;
    rules?: Record<string, unknown>;
};

const configs = eslintConfig as FlatConfig[];
const pluginNames = new Set(
    configs.flatMap((config) => Object.keys(config.plugins ?? {})),
);
const activeRuleNames = configs.flatMap((config) =>
    Object.entries(config.rules ?? {})
        .filter(([, setting]) => setting !== 'off' && setting !== 0)
        .map(([ruleName]) => ruleName),
);

describe('ESLint configuration', () => {
    it('uses maintained React and import plugins', () => {
        expect(pluginNames).toContain('@eslint-react');
        expect(pluginNames).toContain('import-x');
        expect(pluginNames).not.toContain('react');
        expect(pluginNames).not.toContain('import');
    });

    it('keeps React and import rules active', () => {
        expect(
            activeRuleNames.some((ruleName) =>
                ruleName.startsWith('@eslint-react/'),
            ),
        ).toBe(true);
        expect(activeRuleNames).toContain('import-x/order');
        expect(activeRuleNames).toContain(
            'import-x/consistent-type-specifier-style',
        );
    });

    it('keeps Polyscope collaboration data outside lint discovery', () => {
        expect(configs.flatMap((config) => config.ignores ?? [])).toContain(
            '.context',
        );
    });
});
