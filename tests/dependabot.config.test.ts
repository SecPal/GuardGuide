// SPDX-FileCopyrightText: 2026 SecPal
// SPDX-License-Identifier: AGPL-3.0-or-later

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function getIndentedSection(text: string, sectionName: string): string {
    const lines = text.split('\n');
    const startIndex = lines.findIndex(
        (line) => line.trim() === `${sectionName}:`,
    );

    if (startIndex === -1) {
        return '';
    }

    const sectionIndent = lines[startIndex].match(/^ */)?.[0].length ?? 0;
    const sectionLines = [lines[startIndex]];

    for (const line of lines.slice(startIndex + 1)) {
        const lineIndent = line.match(/^ */)?.[0].length ?? 0;

        if (line.trim() !== '' && lineIndent <= sectionIndent) {
            break;
        }

        sectionLines.push(line);
    }

    return sectionLines.join('\n');
}

describe('Dependabot configuration', () => {
    const configPath = join(process.cwd(), '.github', 'dependabot.yml');
    const workflowPath = join(
        process.cwd(),
        '.github',
        'workflows',
        'dependabot-auto-merge.yml',
    );

    function readConfigText(): string {
        expect(existsSync(configPath)).toBe(true);

        return readFileSync(configPath, 'utf8');
    }

    function readWorkflowText(): string {
        expect(existsSync(workflowPath)).toBe(true);

        return readFileSync(workflowPath, 'utf8');
    }

    it('keeps the Dependabot config in the repository', () => {
        expect(existsSync(configPath)).toBe(true);
    });

    it('groups SecPal reusable workflow bumps into one pull request', () => {
        const secpalWorkflowsGroup = getIndentedSection(
            readConfigText(),
            'secpal-workflows',
        );

        expect(secpalWorkflowsGroup).toContain('secpal-workflows:');
        expect(secpalWorkflowsGroup).toContain('- "SecPal/.github*"');
    });

    it('keeps first-party and third-party GitHub action bumps separated', () => {
        const configText = readConfigText();
        const thirdPartyActionsGroup = getIndentedSection(
            configText,
            'third-party-actions',
        );

        expect(configText).toContain('package-ecosystem: "github-actions"');
        expect(configText).toContain('github-actions:');
        expect(thirdPartyActionsGroup).toContain('third-party-actions:');
        expect(thirdPartyActionsGroup).toContain('- "SecPal/.github*"');
        expect(thirdPartyActionsGroup).toContain('- "actions/*"');
    });

    it('uses the metadata-based Dependabot auto-merge workflow', () => {
        const workflowText = readWorkflowText();
        const reusableWorkflowUsesLine = workflowText
            .split('\n')
            .find((line) =>
                line.includes(
                    'uses: SecPal/.github/.github/workflows/reusable-dependabot-auto-merge.yml@',
                ),
            );

        expect(reusableWorkflowUsesLine).toBeDefined();
        expect(reusableWorkflowUsesLine).toContain(
            'uses: SecPal/.github/.github/workflows/reusable-dependabot-auto-merge.yml@',
        );
        expect(workflowText).not.toContain(
            'uses: SecPal/.github/.github/workflows/reusable-dependabot-auto-merge.yml@v1',
        );
        expect(workflowText).not.toContain(
            'uses: SecPal/.github/.github/workflows/reusable-dependabot-auto-merge.yml@main',
        );
    });
});
