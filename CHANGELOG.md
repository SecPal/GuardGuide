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

### Changed

- Rebuilt GuardGuide from the standalone React/Vite shell onto a Laravel monolith baseline so frontend, authentication, and future domain slices now share one Inertia application surface.
- Reintroduced Lingui on the new starter stack with English and German catalogs compiled into runtime locale modules under `resources/js/locales`.

### Fixed

- Avoided failing project-board automation runs when the repository does not yet
  have access to the required GitHub App secrets.
- Pinned GuardGuide reusable GitHub workflows to an immutable SecPal `.github` commit for workflow hardening.
- Restricted the draft PR reminder caller to real non-draft pull-request open
  events so issue-triggered project automation runs no longer fail on a
  mismatched reminder job.
- Disabled public self-service registration in the new Fortify baseline so GuardGuide starts from the intended controlled access model.
