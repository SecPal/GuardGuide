<!--
SPDX-FileCopyrightText: 2026 SecPal
SPDX-License-Identifier: CC0-1.0
-->

# Decision 0001: GuardGuide v1 Baseline

## Status

Accepted

## Context

GuardGuide is introduced as a standalone product that later integrates with SecPal.
The repository needs a clear baseline before application scaffolding begins.

## Decision

GuardGuide v1 starts with these binding constraints:

1. GuardGuide by SecPal is a standalone-first product and repository.
2. The implementation uses a Laravel monolith with Inertia and React in the same repository.
3. shadcn/ui is the UI baseline on top of Tailwind CSS v4.
4. English is the source language, with Lingui-backed German translation from the first GuardGuide-specific UI baseline.
5. Browser language detection is enabled from the first UI iteration.
6. MariaDB and PostgreSQL are first-class database targets.
7. UUID-based modeling is the default.
8. Person-related data is encrypted at rest on the application layer.
9. IP addresses and user-agent strings are not stored persistently by default.
10. Acknowledgements are version-bound, and only the currently published version is acknowledgeable.
11. GuardGuide uses ad-hoc acknowledgement participants rather than requiring a pre-maintained employee directory.
12. When SecPal integration is enabled later, SecPal becomes the source of truth for organization and person data.

## Consequences

- governance and CI must support both PHP/Laravel and React/TypeScript from the start
- monolith scaffolding must include Inertia, shadcn/ui, and Lingui-ready frontend structure early
- future data modeling must stay portable across MariaDB and PostgreSQL
- later SSO and SecPal integration must fit around, not replace, standalone operation
