<!--
SPDX-FileCopyrightText: 2026 SecPal
SPDX-License-Identifier: AGPL-3.0-or-later
-->

# SecPal/GuardGuide Copilot Instructions

This file mirrors the authoritative root `AGENTS.md` only as a non-authoritative
compatibility surface for tooling that loads `.github/copilot-instructions.md`.

Apply the canonical SecPal work-graph and engineering-governance contract at
`SecPal/.github/docs/work-graph-contract.md` for generic planning, delivery,
review, evidence, and stop semantics. Do not redefine those semantics here.

## GuardGuide Baseline

- GuardGuide is standalone-first: a Laravel 13/PHP 8.4/Pest 4 monolith with its
  React 19/strict TypeScript/Vite/Tailwind CSS v4 frontend in this repository.
- Do not introduce a hidden API split, premature service boundary, future SSO,
  or SecPal-specific runtime assumptions into the standalone baseline.
- Prefer Form Requests, policies, services, Eloquent relationships, and queued
  jobs over hand-rolled backend alternatives.
- Use shadcn/ui as the primary UI baseline. Adapt Tailwind Plus only when
  shadcn/ui lacks the required pattern.
- Keep English source text, German Lingui translations, browser language
  detection, accessible semantic HTML, and focused component coverage.
- Keep MariaDB and PostgreSQL equally supported and standard paths
  database-portable. Use UUID identifiers by default and preserve tenant-scoped
  uniqueness.
- Encrypt person-related data at rest at the application layer. Do not persist
  sensitive or person-related state in cleartext, IP addresses or user-agent
  strings by default, or unhashed acknowledgement tokens.
- Keep QR, magic-link, and supervised acknowledgement paths compatible. Do not
  let superseded versions remain confirmable, and preserve acknowledgement
  auditability.
- If future SecPal integration is enabled, SecPal may become the source of truth
  for organization and person data.

## Repository Operations

- Run `git status --short --branch` before writes and preserve existing user
  changes.
- Never use validation bypasses or force-push.
- User commits must be cryptographically signed using a repository-accepted
  signature format and satisfy applicable local and GitHub verification.
- Keep applicable changelog, SPDX/REUSE, local-validation, and English
  GitHub-communication requirements from `AGENTS.md`.
- Do not add AI attribution or promotional AI wording to project artifacts
  unless the task explicitly requires documenting AI tooling behavior.

## Focused Overlays

- `.github/instructions/org-shared.instructions.md`
- `.github/instructions/github-workflows.instructions.md`
- `.github/instructions/php-laravel.instructions.md`
- `.github/instructions/react-shadcn.instructions.md`
