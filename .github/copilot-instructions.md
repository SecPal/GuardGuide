<!--
SPDX-FileCopyrightText: 2026 SecPal
SPDX-License-Identifier: AGPL-3.0-or-later
-->

# GuardGuide Repository Instructions

These instructions are self-contained for the `GuardGuide` repository.

## Always-On Rules

- Run `git status --short --branch` before any write action.
- New work starts from a clean, up-to-date local `main`, then continues on a dedicated topic branch.
- TDD is mandatory for behavior and code changes.
- Keep one topic per branch and pull request.
- Never use bypasses such as `--no-verify` or force-push.
- Update `CHANGELOG.md` in the same change set for real fixes, features, and breaking changes.
- Create a GitHub issue immediately for every real out-of-scope finding you cannot fix now.
- Keep GitHub-facing communication in English and use file/line references instead of large code quotes.
- Keep SPDX and REUSE metadata current in edited files.

## Required Validation

Before commit, PR, or merge, verify at minimum:

- the branch still covers exactly one topic
- TDD happened for behavior changes
- the smallest relevant validation passed for the touched area
- out-of-scope findings were tracked immediately
- `CHANGELOG.md` was updated for real changes
- commits are signed
- no bypass was used

## Repository Conventions

- Stack target: Laravel 13, PHP 8.4, Pest 4, React 19, TypeScript strict mode, Vite, Tailwind CSS v4.
- GuardGuide is a Laravel monolith with React/Vite inside the same repository.
- Catalyst is the exclusive UI baseline. Tailwind Plus may only be used as adapted fallback material when Catalyst lacks a needed pattern.
- English source language and German translation are mandatory from the start. Browser language detection is part of the baseline.
- MariaDB and PostgreSQL are both first-class supported databases. Avoid database-specific behavior in standard paths.
- Model identifiers should be UUID-based by default.
- Person-related data must be encrypted at rest on the application layer.
- Do not persist IP addresses or user-agent strings by default.
- Public acknowledgement flows must remain compatible with QR entry, magic-link confirmation, and supervised fallback handling.

## Integration Direction

- GuardGuide is standalone-first.
- If a later SecPal integration is enabled, SecPal becomes the source of truth for organization and person data.
- Do not pull future SSO or SecPal-specific runtime assumptions into the standalone baseline prematurely.
