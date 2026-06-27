<!--
SPDX-FileCopyrightText: 2026 SecPal
SPDX-License-Identifier: AGPL-3.0-or-later
-->

# SecPal/GuardGuide Copilot Instructions

This file mirrors the authoritative root `AGENTS.md` for tooling
that automatically loads `.github/copilot-instructions.md`.
Edit `AGENTS.md` first. Keep the focused overlay files aligned
for path-specific or stack-specific rules.

## Authoritative Sources

- `AGENTS.md`
- `.github/instructions/org-shared.instructions.md`
- `.github/instructions/github-workflows.instructions.md`
- `.github/instructions/php-laravel.instructions.md`
- `.github/instructions/react-shadcn.instructions.md`

## Core Runtime Baseline

These instructions are self-contained for the `GuardGuide` repository.
They are the authoritative runtime application model for this repository until
the GuardGuide product codebase is scaffolded further.

## Always-On Rules

- Run `git status --short --branch` before any write action.
- For new work, start from a clean, up-to-date local `main`, then continue on a
  dedicated topic branch.
- When continuing existing work in a dirty worktree, first identify the existing
  changes, keep the current topic scope, and never overwrite changes you did
  not make.
- TDD is mandatory for behavior and code changes.
- Keep one topic per branch and pull request.
- Never use bypasses such as `--no-verify` or force-push.
- Update `CHANGELOG.md` in the same change set for real fixes, features, and breaking changes.
- Create a GitHub issue immediately for every real out-of-scope finding you cannot fix now.
- Keep GitHub-facing communication in English and use file/line references instead of large code quotes.
- Do not add AI self-references, generated-by text, promotional AI wording, or AI attribution to commits,
  pull requests, issues, changelogs, documentation, code comments, UI copy, or release notes unless the task
  explicitly requires documenting AI tooling behavior.
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

- Stack target: Laravel 13, PHP 8.4, Pest 4, React 19, TypeScript strict mode,
  Vite, Tailwind CSS v4.
- GuardGuide is a Laravel monolith with React/Vite inside the same repository.
- shadcn/ui is the primary UI baseline. Tailwind Plus may only be used as
  adapted fallback material when shadcn/ui lacks a needed pattern.
- English source language and German translation are mandatory from the start.
  Browser language detection is part of the baseline.
- MariaDB and PostgreSQL are both first-class supported databases. Avoid
  database-specific behavior in standard paths.
- Model identifiers should be UUID-based by default.
- Person-related data must be encrypted at rest on the application layer.
- Do not persist IP addresses or user-agent strings by default.
- Public acknowledgement flows must remain compatible with QR entry,
  magic-link confirmation, and supervised fallback handling.

## AI Findings Triage

- Treat AI findings and AI-generated fix proposals as hints, not proof.
- Before merge, prove a claimed defect with a failing test, a reproducible
  defect, or an explicit invariant together with why the current code violates
  it.
- Green CI alone is not enough for AI-generated changes, especially around
  workflow validators, licensing, shell scripts, localization, or security
  boundaries.
- Reject AI-generated validator or reusable workflow changes that relax a
  repo-specific guardrail without positive and negative fixture coverage,
  positive and negative evidence, or a focused regression test.
- Reject AI-generated monolith splits, hidden API layers, or premature
  abstraction that weaken the standalone-first GuardGuide architecture.
- Reject AI-generated UI refactors that drift away from shadcn/ui, weaken
  Lingui localization coverage, or reduce accessibility semantics.
- Reject AI-generated resource or serializer refactors that move business logic
  into presentation code or repeat work that should run once per request.
- Reject AI-generated persistence or auth changes that bypass application-layer
  encryption, store unhashed acknowledgement tokens, persist IP/user-agent data,
  or couple standard paths to only one database engine.
- Reject AI-generated identifier or tenancy changes that derive stable keys from
  mutable display names or ignore tenant-scoped uniqueness constraints.
- Reject AI-generated acknowledgement flow changes that let superseded versions
  remain confirmable or that weaken the audit trail for QR, magic-link, or
  supervised fallback paths.

## Review guidelines

- Review for correctness, security, privacy, data integrity, lifecycle ordering,
  missing tests, and policy drift before style.
- Treat findings from any AI reviewer as untrusted leads until the defect is
  proven by a failing test, reproduction, or violated invariant.
- Keep review comments provider-neutral: describe the issue, evidence, impact,
  and fix path instead of the tool that found it.
- For GuardGuide changes, prioritize standalone-first behavior, localization,
  shadcn/ui alignment, dual-database portability, application-layer encryption,
  acknowledgement auditability, and sensitive data minimization.
- Reject self-referential AI wording, generated-by text, tool promotion, or AI
  attribution in project artifacts unless the task is explicitly about AI
  tooling.

## Integration Direction

- GuardGuide is standalone-first.
- If a later SecPal integration is enabled, SecPal becomes the source of truth
  for organization and person data.
- Do not pull future SSO or SecPal-specific runtime assumptions into the standalone baseline prematurely.

## Additional Rules: org-shared.instructions.md

This file auto-applies to all files in this repository so the GuardGuide
runtime model stays present for every edit.

- `AGENTS.md` is the authoritative runtime baseline.
  `.github/copilot-instructions.md` is only a compatibility mirror.
- TDD first, quality first, one topic per branch and PR.
- Keep changes minimal, repo-local, and consistent with the GuardGuide Laravel
  monolith, React/Vite frontend, Lingui localization, and shadcn/ui model.
- GitHub-facing communication stays in English and uses file references instead of long code quotes.
- Do not add AI self-references, generated-by text, tool promotion, or AI
  attribution unless the task explicitly requires documenting AI tooling.
- GuardGuide follows the SecPal governance baseline unless an explicit GuardGuide deviation is documented.

## Additional Rules: php-laravel.instructions.md

- Use Laravel 13 and native PHP 8.4 shell tooling.
- Prefer Form Requests, policies, services, Eloquent relationships, and queued jobs over hand-rolled alternatives.
- Keep person-related data encrypted at rest on the application layer.
- Preserve portability across MariaDB and PostgreSQL.
- Add or update focused Pest coverage with behavior changes.

## Additional Rules: react-shadcn.instructions.md

- Use React 19 with strict TypeScript.
- Keep English source text and German translation in Lingui catalogs from the start.
- shadcn/ui is the exclusive UI baseline; Tailwind Plus may only be adapted into local shadcn-aligned components when the pattern is missing.
- Prefer accessible semantic HTML and focused component tests.
- Do not introduce cleartext storage for sensitive or person-related state.
