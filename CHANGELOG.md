<!--
SPDX-FileCopyrightText: 2026 SecPal
SPDX-License-Identifier: CC0-1.0
-->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added the initial GuardGuide repository governance baseline, project decision record, and GitHub automation bootstrap.
- Added the first Laravel 13 backend baseline for GuardGuide, including a backend-only Composer scaffold, Pest as the default test runner, and PHPStan/Pint wiring for the initial PHP slice.
- Added the first React/Vite frontend shell baseline for GuardGuide with strict TypeScript and Lingui English/German localization wiring.
- Added the new Laravel 13 Inertia React starter baseline with shadcn/ui, Fortify, passkeys, and the GuardGuide-branded localized welcome and login surfaces.
- Added a dedicated Composer `analyse` script for PHPStan so local automation and Polyscope can invoke the current GuardGuide static-analysis entry point through the repo script surface.
- Added the organization-context foundation with internal units, customers, sites, user assignments, management UI, and an effective user-context resolver for follow-up instruction features.

### Changed

- Rebuilt GuardGuide from the standalone React/Vite shell onto a Laravel monolith baseline so frontend, authentication, and future domain slices now share one Inertia application surface.
- Reintroduced Lingui on the new starter stack with English and German catalogs compiled into runtime locale modules under `resources/js/locales`.
- Renamed the GuardGuide frontend Copilot instruction file to `react-shadcn.instructions.md` so repo automation and generated Polyscope prompts match the current shadcn/ui-based frontend stack.

### Fixed

- Avoided failing project-board automation runs when the repository does not yet
  have access to the required GitHub App secrets.
- Pinned GuardGuide reusable GitHub workflows to an immutable SecPal `.github` commit for workflow hardening.
- Restricted the draft PR reminder caller to real non-draft pull-request open
  events so issue-triggered project automation runs no longer fail on a
  mismatched reminder job.
- Disabled public self-service registration in the new Fortify baseline so GuardGuide starts from the intended controlled access model.
- Allowed unverified users to delete their own account by moving `profile.destroy` out of the `verified` middleware group.
- Rotated the user `remember_token` on password resets so previously issued remember-me cookies stop authenticating after a reset.
- Deferred fetching 2FA recovery codes until the user explicitly reveals them so codes no longer enter the DOM on every visit to the security page.
- Hardened the `appearance` cookie flow by whitelisting allowed modes server-side and switching the inline theme bootstrapper to safe JSON encoding to remove an XSS sink.
- Removed the default Laravel `sessions` table from the baseline migration so the standard schema no longer ships `ip_address` and `user_agent` columns that conflict with the no-persistent-PII baseline.
- Gated the development `test@example.com` seed to `local` and `testing` environments so production or staging bootstrap runs cannot ship a known account.
- Fixed the "renders without two factor" security test so it no longer skips itself when the Fortify 2FA feature is part of the baseline.
- Localized the dashboard, appearance settings, email verification, and forgot-password pages through Lingui with matching German translations.
- Compiled the Lingui catalogs as ESM (`.mjs`) so the bootstrap `await import(...)` resolves the `messages` named export instead of failing on a CommonJS namespace and leaving Inertia pages blank.
- Normalized the `email` field on profile updates to lowercase so the saved address matches Fortify's `lowercase_usernames` canonicalization on login.
- Rebuilt the login rate-limit test around the actual `Str::transliterate(Str::lower($email).'|'.$ip)` key (with a mixed-case email) so the seeded bucket truly matches what the limiter hits.
- Ignored the local `storage/phpstan` cache directory and removed the committed PHPStan artifacts that had leaked into the previous baseline push.
- Held ESLint on the supported 9.x line and typed shared Inertia page props so frontend linting and strict TypeScript checks keep passing while the ESLint 10 plugin ecosystem catches up.
- Restored the full AGPLv3-or-later license text in the repository license files so local license scanners and reviewers do not depend on an external URL.
- Dropped the misleading `CC0-1.0` REUSE annotation for `LICENSE` and `LICENSES/*.txt` so the FSF AGPL document is no longer reported as CC0-licensed in REUSE/SPDX scans.
