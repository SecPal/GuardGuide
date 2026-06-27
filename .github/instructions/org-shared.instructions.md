---
SPDX-FileCopyrightText: 2026 SecPal
SPDX-License-Identifier: CC0-1.0
name: GuardGuide Runtime Overlay
description: Reinforces strict GuardGuide governance for all files in this repo.
applyTo: "**"
---

# GuardGuide Runtime Overlay

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
