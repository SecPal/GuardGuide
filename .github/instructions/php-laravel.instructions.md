---
SPDX-FileCopyrightText: 2026 SecPal
SPDX-License-Identifier: CC0-1.0
name: Laravel Monolith Rules
description: Applies Laravel, Pest, and native PHP runtime rules to PHP work in this repo.
applyTo: "**/*.php,artisan"
---

# Laravel Monolith Rules

- Use Laravel 13 and native PHP 8.4 shell tooling.
- Prefer Form Requests, policies, services, Eloquent relationships, and queued jobs over hand-rolled alternatives.
- Keep person-related data encrypted at rest on the application layer.
- Preserve portability across MariaDB and PostgreSQL.
- Add or update focused Pest coverage with behavior changes.
