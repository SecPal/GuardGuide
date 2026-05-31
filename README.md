<!--
SPDX-FileCopyrightText: 2026 SecPal
SPDX-License-Identifier: CC0-1.0
-->

# GuardGuide by SecPal

GuardGuide is the standalone instruction management and acknowledgement platform from SecPal.

It is designed for organizations that need structured work instructions, approvals, versioning, and documented acknowledgements without adopting the full SecPal product surface.

## Product Direction

- Standalone-first operation with local authentication and simple user management
- Laravel monolith with a React/Vite frontend in the same repository
- Catalyst as the exclusive UI baseline; Tailwind Plus snippets may only be adapted into Catalyst-aligned local components
- English source language with German translation from day one, including browser language detection
- MariaDB and PostgreSQL supported as first-class database targets
- Person-related data encrypted at rest on the application layer
- No persistent IP-address or user-agent storage by default
- Version-bound acknowledgements: only the currently published version can be acknowledged
- SecPal becomes the source of truth for organization and person data when a later integration is enabled

## Scope for v1

GuardGuide v1 covers at minimum:

- organizational hierarchy and delegated administration downward in the tree
- templates and centrally managed mandatory content blocks
- instructions and versioning
- publication and acknowledgement flows
- QR-based acknowledgement entry, magic-link confirmation, and a supervised fallback path

## Repository Conventions

This repository follows the SecPal governance baseline unless GuardGuide defines an explicit deviation.

- TDD first
- one topic per branch and pull request
- REUSE and SPDX compliance throughout the repository
- GitHub-facing communication in English
- AGPL-3.0-or-later for GuardGuide code unless a file carries a different SPDX license intentionally

## Planned Stack

- PHP 8.4
- Laravel 13
- Pest 4
- React 19
- TypeScript strict mode
- Vite 8
- Tailwind CSS v4
- Lingui for English/German localization

## Status

The repository bootstrap is in progress. The initial governance baseline lands first, followed by the monolith scaffold and Catalyst-based application shell.
