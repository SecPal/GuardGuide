// SPDX-FileCopyrightText: 2026 SecPal
// SPDX-License-Identifier: AGPL-3.0-or-later

import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { isScalar, parseDocument, visit } from 'yaml';

type PinViolation = {
    file: string;
    line: number;
    reference: string;
    reason: 'mutable revision' | 'missing source annotation';
};

const immutableRevisionPattern = /^[0-9a-f]{40}$/;

function workflowFiles(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name);

        if (entry.isDirectory()) {
            return workflowFiles(path);
        }

        return ['.yml', '.yaml'].includes(extname(entry.name)) ? [path] : [];
    });
}

function workflowPinViolations(source: string, file: string): PinViolation[] {
    const document = parseDocument(source);

    if (document.errors.length > 0) {
        throw new Error(`${file}: ${document.errors.join('; ')}`);
    }

    const violations: PinViolation[] = [];

    visit(document, {
        Pair(_key, pair) {
            if (
                !isScalar(pair.key) ||
                pair.key.value !== 'uses' ||
                !isScalar(pair.value) ||
                typeof pair.value.value !== 'string'
            ) {
                return;
            }

            const reference = pair.value.value;

            if (reference.startsWith('./')) {
                return;
            }

            const line = source
                .slice(0, pair.value.range?.[0] ?? 0)
                .split('\n').length;
            const revision = reference.slice(reference.lastIndexOf('@') + 1);

            if (!immutableRevisionPattern.test(revision)) {
                violations.push({
                    file,
                    line,
                    reference,
                    reason: 'mutable revision',
                });
            } else if (!pair.value.comment?.trim()) {
                violations.push({
                    file,
                    line,
                    reference,
                    reason: 'missing source annotation',
                });
            }
        },
    });

    return violations;
}

describe('workflow action pins', () => {
    const fullRevision = 'a'.repeat(40);

    it('rejects mutable action tags', () => {
        const source = `jobs:\n  test:\n    uses: actions/checkout@v7 # v7\n`;

        expect(workflowPinViolations(source, 'fixture.yml')).toEqual([
            expect.objectContaining({ reason: 'mutable revision' }),
        ]);
    });

    it('rejects full revisions without a source annotation', () => {
        const source = `jobs:\n  test:\n    steps:\n      - uses: actions/checkout@${fullRevision}\n`;

        expect(workflowPinViolations(source, 'fixture.yml')).toEqual([
            expect.objectContaining({ reason: 'missing source annotation' }),
        ]);
    });

    it('accepts full revisions with a source annotation', () => {
        const source = `jobs:\n  test:\n    uses: SecPal/.github/.github/workflows/reusable.yml@${fullRevision} # main\n`;

        expect(workflowPinViolations(source, 'fixture.yml')).toEqual([]);
    });

    it('ignores repository-local actions', () => {
        const source = `jobs:\n  test:\n    steps:\n      - uses: ./.github/actions/setup\n`;

        expect(workflowPinViolations(source, 'fixture.yml')).toEqual([]);
    });

    it('pins every external action and reusable workflow in the repository', () => {
        const directory = join(process.cwd(), '.github', 'workflows');
        const violations = workflowFiles(directory).flatMap((file) =>
            workflowPinViolations(readFileSync(file, 'utf8'), file),
        );

        expect(violations).toEqual([]);
    });
});
