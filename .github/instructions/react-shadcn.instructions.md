---
SPDX-FileCopyrightText: 2026 SecPal
SPDX-License-Identifier: CC0-1.0
name: React shadcn Rules
description: Applies React, strict TypeScript, Lingui, and shadcn/ui rules to frontend source files.
applyTo: resources/js/**/*.ts,resources/js/**/*.tsx,vite.config.ts,eslint.config.js
---

# React shadcn Rules

- Use React 19 with strict TypeScript.
- Keep English source text and German translation in Lingui catalogs from the start.
- shadcn/ui is the exclusive UI baseline; Tailwind Plus may only be adapted into local shadcn-aligned components when the pattern is missing.
- Prefer accessible semantic HTML and focused component tests.
- Do not introduce cleartext storage for sensitive or person-related state.