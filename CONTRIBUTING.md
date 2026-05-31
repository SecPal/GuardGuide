<!--
SPDX-FileCopyrightText: 2026 SecPal
SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Contributing to GuardGuide

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Core Rules

- TDD first for behavior and code changes
- one topic per branch and pull request
- no direct work on local `main`
- no force-push and no `--no-verify` bypasses
- every real out-of-scope finding becomes a tracked GitHub issue immediately
- GitHub-facing communication stays in English

## Local Setup

1. Clone the repository into your SecPal workspace.
2. Install repository hooks with `./setup-hooks.sh`.
3. Use `./scripts/preflight.sh` before pushing.

## Branch Naming

Use one of these prefixes:

- `feat/`
- `fix/`
- `chore/`
- `docs/`
- `refactor/`
- `test/`
- `spike/`

## Pull Request Expectations

- Open the first PR state as draft.
- Keep the PR focused on one logical topic.
- Add or update tests with behavior changes.
- Update `CHANGELOG.md` for real fixes, features, and breaking changes.
- Reference files and lines in discussions instead of pasting large code blocks.

## Validation

At minimum, contributors are expected to run the smallest relevant local checks
for the touched area. Over time this repository will standardize on:

- PHP formatting and static analysis
- Pest test coverage
- ESLint and TypeScript checks
- Vitest coverage for React components
