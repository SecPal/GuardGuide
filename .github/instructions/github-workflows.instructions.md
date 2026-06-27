---
SPDX-FileCopyrightText: 2026 SecPal
SPDX-License-Identifier: CC0-1.0
name: GitHub Workflow Rules
description: Applies workflow and Dependabot rules to GitHub automation files in this repo.
applyTo: .github/workflows/**/*.yml,.github/workflows/**/*.yaml,.github/dependabot.yml
---

# GitHub Workflow Rules

- Set explicit permissions for every workflow.
- Set `timeout-minutes` on jobs that define their own `runs-on` and `steps`.
  Reusable workflow caller jobs that use `jobs.<id>.uses` cannot declare a
  caller-level timeout, so enforce the timeout inside the called reusable
  workflow instead.
- Pin external actions.
- Keep workflows repo-local and reuse central SecPal workflows where practical.
- Do not relax validation coverage or branch-protection assumptions without focused regression proof.
