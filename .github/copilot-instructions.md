<!--
SPDX-FileCopyrightText: 2026 SecPal
SPDX-License-Identifier: AGPL-3.0-or-later
-->

# GuardGuide Repository Instructions

These instructions are self-contained for the `GuardGuide` repository.
They are the authoritative runtime application model for this repository until
the GuardGuide product codebase is scaffolded further.

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

## Integration Direction

- GuardGuide is standalone-first.
- If a later SecPal integration is enabled, SecPal becomes the source of truth
  for organization and person data.
- Do not pull future SSO or SecPal-specific runtime assumptions into the standalone baseline prematurely.
