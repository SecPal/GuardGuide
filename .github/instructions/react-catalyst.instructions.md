---
SPDX-FileCopyrightText: 2026 SecPal
SPDX-License-Identifier: CC0-1.0
name: React Catalyst Rules
description: Applies React, strict TypeScript, Lingui, and Catalyst rules to frontend source files.
applyTo: resources/js/**/*.ts,resources/js/**/*.tsx,vite.config.ts,eslint.config.js
---

# React Catalyst Rules

- Use React 19 with strict TypeScript.
- Keep English source text and German translation in Lingui catalogs from the start.
- Catalyst is the exclusive UI system; Tailwind Plus may only be adapted into local Catalyst-aligned components.
- Prefer accessible semantic HTML and focused component tests.
- Do not introduce cleartext storage for sensitive or person-related state.
