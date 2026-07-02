<!--
SPDX-FileCopyrightText: 2026 SecPal
SPDX-License-Identifier: CC0-1.0
-->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- tightened the provider-neutral governance rollout so `AGENTS.md` and the Copilot mirror now advertise the workflow overlay explicitly, the workflow overlay itself exempts reusable-workflow caller jobs from impossible caller-level `timeout-minutes` requirements, and the local AI-instructions validator now enforces the full mirrored runtime baseline plus the person-related-data encryption guardrail
- Bundled platform-specific optional binaries (`@rollup/rollup-*`, `@tailwindcss/oxide-*`, `lightningcss-*`) into a single Dependabot group named `platform-binaries` in `.github/dependabot.yml` so each cycle's bumps land as one PR. Each per-binary bump otherwise also rewrote the root `dependencies` block of `package-lock.json` (npm re-pinned the optional entry there too), producing a duplicate-entry diff that the next install reverted and that reviewers had to mentally subtract on every cycle. Closes #81.

### Fixed

- Excluded dependency lockfiles, license texts, and generated Lingui locale artifacts from the PR size check by adding a repo-local `.preflight-exclude`, aligning GuardGuide with the existing SecPal repos so mechanical file churn no longer turns CI red by itself.
- Updated `guzzlehttp/guzzle` to `7.13.1` (with `guzzlehttp/psr7` `2.12.3`) so the Composer lockfile includes the upstream fixes for `CVE-2026-55568` / `GHSA-wpwq-4j6v-78m3`, `CVE-2026-55767` / `GHSA-cwxw-98qj-8qjx`, and `CVE-2026-55766` / `GHSA-vm85-hxw5-5432`.
- Fixed the GuardGuide access seeder test support class being declared inside `tests/Feature/GuardGuideAccessSeederTest.php`, which violated the `Tests\\ => ./tests` PSR-4 autoload rule and emitted a Composer warning during optimized autoload generation.
- Fixed `scripts/validate-ai-instructions.sh` trimming the entire `governance-ref` value after removing its YAML prefix, so quoted refs in `.github/workflows/quality.yml` now keep their pinned SHA during drift checks.
- Fixed GuardGuide production builds depending on live `fonts.bunny.net` fetches for `Instrument Sans`; Vite now uses the already-pinned local `@fontsource/inter` files so Polyscope provisioning and other offline-restricted builds no longer fail on external font resolution.
- Fixed the high-severity `esbuild` advisory [GHSA-gv7w-rqvm-qjhr](https://github.com/advisories/GHSA-gv7w-rqvm-qjhr) (missing binary integrity verification in the Deno module, RCE via `NPM_CONFIG_REGISTRY`) by pinning `esbuild` to `>=0.28.1` through an `overrides` block in `package.json`. The vulnerable `esbuild@0.25.12` was pulled in transitively as `@lingui/cli@6.3.0 → esbuild "^0.25.1"`, and `@lingui/cli@6.3.0` is currently the newest release on npm with no upstream version that ships the patched esbuild, so Dependabot could not generate the security update itself; the manual override resolves Dependabot alert #1 and lets `npm audit` report 0 vulnerabilities while keeping `lingui compile` and the production build green.
- Fixed the auth page error summary dropping validation messages when two fields produced the same string (e.g. `password` and `password_confirmation` returning the matching-confirmation error) because the React `<li>` key was the message itself; deduplicated `errorMessages` before mapping so every distinct error is rendered exactly once across login, forgot-password, reset-password, confirm-password, and two-factor-challenge.
- Fixed `AuthStatusPanel` exposing the `warning` variant as `role="status"` (polite live region), which let screen readers miss the disabled-2FA security prompt; warnings now use `role="alert"` so the assistive announcement matches the actionable security context.
- Fixed `AuthOtpInput` providing no programmatic label association — the visible `<Label>` had no `htmlFor` and the underlying OTP input had no `id`, so the accessible name fell back to an optional `aria-label` that was only set for string labels; the component now generates a stable input id (via `useId`) and binds the label via `htmlFor`, keeping the association even when a `ReactNode` label is provided.
- Fixed the Blade app shell still rendering `@fonts` during Laravel feature tests even though `Tests\TestCase` disables Vite; test requests now skip font injection so the suite no longer fails on stale or absent build font manifests.
- Fixed `UserRoleController::redirectToFirstUser` evaluating the authorization gate after the `firstOrFail()` query, which caused an unauthenticated 404 instead of a 403 when no users existed; gate is now checked before the query.
- Fixed `StoreCustomerAssignmentRequest`, `StoreOrganizationalUnitAssignmentRequest`, and `StoreSiteAssignmentRequest` returning `true` from `authorize()` for any authenticated user instead of requiring `USER_ASSIGNMENTS_MANAGE`; Form Request gate now aligns with the controller gate.
- Fixed `SaveOrganizationalUnitRequest::authorize()` returning `true` for any authenticated user instead of checking `ORGANIZATIONAL_UNITS_CREATE` or `ORGANIZATIONAL_UNITS_UPDATE` depending on the HTTP method.
- Fixed `sharedPermissions` in `HandleInertiaRequests` being evaluated eagerly on every Inertia response, triggering DB queries via `CustomerPolicy::viewAny` and `SitePolicy::viewAny` even for responses that Inertia does not serialize; wrapped in a closure so resolution is deferred.
- Fixed `organizational_unit_id` on the `customers` table being added in a separate alter migration that ran after the create migration, making it impossible to safely roll back or seed between the two; column is now part of the original create migration.
- Fixed stale prefetch cache after mutations so newly created organizational units, customers, and sites appear in the user assignments dropdowns immediately, without requiring a manual page reload; a global `useFlushPrefetchOnMutation` hook flushes Inertia's prefetch cache after every non-GET request, and additionally tracks in-flight prefetch start times so that a hover-triggered prefetch which resolves after the mutation is re-flushed instead of repopulating the cache with stale data — without cancelling unrelated async traffic like `router.reload()`, polling, or deferred props.
- Fixed an eager-load conflict in `UserAssignmentController::index` where `sites.customer` was silently dropped by a duplicate `sites` key, causing `customer_name` to always be `null` in the assignments payload; added a regression test to prevent recurrence.
- Fixed `effectiveContext` in `HandleInertiaRequests` running three database queries on every authenticated page load with no per-request deduplication; `UserContextResolver` is now bound as a scoped singleton so repeated calls within the same request resolve to the cached result.
- Fixed hardcoded URL template literals in `user-assignments/index.tsx` replaced with typed wayfinder route helpers so route renames are caught at compile time.

### Added

- Added a language settings page and locale cookie handling so users can switch
  between English and German while the server keeps the document locale aligned.
- Added an `is_admin` flag on users with a matching factory state, seeded the local test user as admin, and required admin privileges to view or modify organizational units and user assignments so the management surfaces no longer allow any verified account to manage other users.
- Added the initial GuardGuide repository governance baseline, project decision record, and GitHub automation bootstrap.
- Added the first Laravel 13 backend baseline for GuardGuide, including a backend-only Composer scaffold, Pest as the default test runner, and PHPStan/Pint wiring for the initial PHP slice.
- Added the first React/Vite frontend shell baseline for GuardGuide with strict TypeScript and Lingui English/German localization wiring.
- Added the new Laravel 13 Inertia React starter baseline with shadcn/ui, Fortify, passkeys, and the GuardGuide-branded localized welcome and login surfaces.
- Added a dedicated Composer `analyse` script for PHPStan so local automation and Polyscope can invoke the current GuardGuide static-analysis entry point through the repo script surface.
- Added the organization-context foundation with internal units, customers, sites, user assignments, management UI, and an effective user-context resolver for follow-up instruction features.
- Added a role management surface (RBAC) so platform administrators can create, edit, and delete custom roles with fine-grained permission assignments; predefined system roles are seeded from the catalog and their labels are translated via Lingui.

### Changed

- Refined the login page to more closely match the current SecPal auth presentation, including the simplified `login-05`-style field order, footer placement, and a local `Inter` treatment for the login flow.
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
- Cleared dependent `user_organizational_unit_assignments` and `user_site_assignments` rows when the related organizational unit or site is soft-deleted so the management UI and effective user context no longer hide assignments that still exist in the pivot tables.
- Selected trashed sites for customer-assignment cleanup through an explicit `withTrashed` subquery instead of `whereHas`, so removing a customer assignment also removes site assignments that point at soft-deleted sites of that customer.
- Pre-grouped organizational units by `parent_id` when rendering the hierarchy so building the tree and flattened list runs in a single linear pass instead of O(n²) repeated filtering for every node.
- Fell back to the existing localized "unknown customer" string in the site assignment dropdown so soft-deleted or unloaded customer relations no longer surface a literal "null" next to the site name.
- Localized the application sidebar entries through Lingui keys and routed the navigation through the generated Wayfinder helpers so English and German translations stay in sync with the rest of the UI.
- Generated stable unique input IDs for organizational-unit form fields with `useId()` so create and edit forms on the same page no longer share `name-root` / `sort-order-root` identifiers that broke label-to-input association.
- Disabled the assignment "Hinzufügen" buttons until a value is selected and required a selection in the dropdown so the form no longer submits an empty request that returns "The customer id field is required".
- Updated ADR 0002 to reflect that `sites.organizational_unit_id` is nullable and that `tenant_id` scoping is documented as a follow-up rather than an enforced invariant in this slice.
