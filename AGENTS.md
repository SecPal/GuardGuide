<!--
SPDX-FileCopyrightText: 2026 SecPal
SPDX-License-Identifier: AGPL-3.0-or-later
-->

# SecPal/GuardGuide Agent Instructions

This file is the authoritative, provider-neutral repository and runtime baseline
for GuardGuide. `.github/copilot-instructions.md` is a non-authoritative
compatibility mirror.

## Canonical Engineering Governance

The canonical SecPal work-graph and engineering-governance contract at
`SecPal/.github/docs/work-graph-contract.md` is the sole local reference owner
for generic hierarchy, dependencies, sibling order, work selection, delivery,
replanning, findings, review, evidence, and stop semantics. Apply that contract
instead of defining those semantics in this repository.

GuardGuide instructions may add repository-specific technical and operational
constraints, but must not weaken or duplicate the canonical model.

## Focused Overlays

- `.github/instructions/org-shared.instructions.md`
- `.github/instructions/github-workflows.instructions.md`
- `.github/instructions/php-laravel.instructions.md`
- `.github/instructions/react-shadcn.instructions.md`

## Operational Rules

- Run `git status --short --branch` before any write action.
- For new work, start from a clean, current local `main`, then continue on a
  dedicated branch.
- When continuing in a dirty worktree, identify and preserve existing changes;
  never overwrite changes you did not make.
- Never use validation bypasses or force-push.
- Update `CHANGELOG.md` in the same change set for real fixes, features, and
  breaking changes.
- User commits must be cryptographically signed using a repository-accepted
  signature format and satisfy applicable local and GitHub verification.
- Keep GitHub-facing communication in English and use file/line references
  instead of large code quotes.
- Do not add AI self-references, generated-by text, promotional AI wording, or
  AI attribution to project artifacts unless the task explicitly requires
  documenting AI tooling behavior.
- Keep SPDX and REUSE metadata current in edited files.

## Evidence And Validation

- For observable behavior changes, use the smallest meaningful failing-first
  Pest, Vitest, component, or integration evidence when it can prove the changed
  contract.
- For behavior-preserving refactors, preserve the relevant contract tests green;
  do not manufacture an artificial failing test.
- For governance, prose, and graph migration, use structural evidence where
  behavior tests cannot prove the change.
- Stop at the smallest non-redundant evidence set that proves the current
  contract and the affected GuardGuide invariants.
- Before commit, pull request, or merge, run the smallest relevant validation,
  confirm applicable changelog and SPDX/REUSE obligations, verify commit
  signatures, and confirm no bypass was used.

## Architecture And Stack

- GuardGuide is standalone-first. GuardGuide is a Laravel monolith with React/Vite
  inside this repository. Do not introduce a hidden API split or premature
  service boundary.
- Use Laravel 13, PHP 8.4, and Pest 4. Prefer Form Requests, policies, services,
  Eloquent relationships, and queued jobs over hand-rolled alternatives.
- Use React 19, strict TypeScript, Vite, and Tailwind CSS v4.
- shadcn/ui is the primary UI baseline. Tailwind Plus may be adapted only when
  shadcn/ui lacks a required pattern, and the result must remain aligned with
  local shadcn/ui components.
- English source language and German translation through Lingui are required
  from the start, together with browser language detection.

## Persistence, Security, And Privacy

- MariaDB and PostgreSQL are both first-class supported databases. Avoid
  database-specific behavior in standard paths.
- Use UUID-based model identifiers by default and preserve tenant-scoped
  uniqueness constraints.
- Person-related data must be encrypted at rest on the application layer. Never
  introduce cleartext storage for sensitive or person-related state.
- Do not persist IP addresses or user-agent strings by default.
- Keep acknowledgement tokens protected according to their trust boundary; do
  not persist unhashed acknowledgement tokens.

## Acknowledgement Invariants

- Public acknowledgement flows must remain compatible with QR entry,
  magic-link confirmation, and supervised fallback handling.
- Superseded instruction versions must not remain confirmable.
- Preserve a complete audit trail for every acknowledgement path.

## GuardGuide Review Priorities

- Review correctness, security, privacy, data integrity, and lifecycle ordering
  before style.
- Reject changes that weaken the standalone monolith, localization coverage,
  shadcn/ui alignment, accessibility semantics, dual-database portability,
  application-layer encryption, tenant scoping, acknowledgement auditability,
  or sensitive-data minimization.
- Keep business logic out of presentation resources and serializers, and avoid
  repeated work that should run once per request.
- Reject validator or reusable-workflow changes that relax a GuardGuide-specific
  guardrail without focused positive and negative evidence.

## Integration Direction

- GuardGuide remains standalone-first now.
- If a future SecPal integration is enabled, SecPal may become the source of
  truth for organization and person data.
- Do not pull future SSO or SecPal-specific runtime assumptions into the current
  standalone baseline.
