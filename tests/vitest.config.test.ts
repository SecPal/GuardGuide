// SPDX-FileCopyrightText: 2026 SecPal
// SPDX-License-Identifier: AGPL-3.0-or-later

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Vitest configuration', () => {
    it('keeps Polyscope collaboration data outside test discovery', () => {
        const configText = readFileSync(
            join(process.cwd(), 'vitest.config.ts'),
            'utf8',
        );

        expect(configText).toContain(
            "exclude: [...configDefaults.exclude, '.context/**']",
        );
    });
});
