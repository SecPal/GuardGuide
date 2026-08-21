---
SPDX-FileCopyrightText: 2026 SecPal
SPDX-License-Identifier: CC0-1.0
name: GuardGuide Runtime Overlay
description: Applies GuardGuide's repository baseline to every file.
applyTo: '**'
---

# GuardGuide Runtime Overlay

- `AGENTS.md` is the authoritative GuardGuide repository and runtime baseline;
  `.github/copilot-instructions.md` is a non-authoritative compatibility mirror.
- Apply `SecPal/.github/docs/work-graph-contract.md` as the sole local reference
  owner for generic work-graph and engineering-governance semantics.
- Preserve the standalone Laravel monolith, in-repository React/Vite frontend,
  English/German Lingui localization, shadcn/ui baseline, dual-database
  portability, application-layer encryption, acknowledgement auditability, and
  sensitive-data minimization requirements in `AGENTS.md`.
- Keep GitHub communication in English, maintain applicable SPDX/REUSE metadata,
  and do not add AI attribution or promotional AI wording to project artifacts.
