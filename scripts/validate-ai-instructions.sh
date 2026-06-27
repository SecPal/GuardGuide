#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 SecPal Contributors
# SPDX-License-Identifier: MIT

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="${1:-}"

if [[ -z "$REPO_ROOT" ]]; then
  if git -C "$SCRIPT_DIR/.." rev-parse --show-toplevel >/dev/null 2>&1; then
    REPO_ROOT="$(git -C "$SCRIPT_DIR/.." rev-parse --show-toplevel)"
  else
    REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
  fi
fi

FILE="$REPO_ROOT/AGENTS.md"
COPILOT_FILE="$REPO_ROOT/.github/copilot-instructions.md"

if [[ ! -f "$FILE" ]]; then
  echo "Missing $FILE" >&2
  exit 1
fi

if [[ ! -f "$COPILOT_FILE" ]]; then
  echo "Missing $COPILOT_FILE" >&2
  exit 1
fi

required_patterns=(
  "shadcn/ui is the primary UI baseline"
  "English source language and German translation"
  "GuardGuide is a Laravel monolith with React/Vite"
  "MariaDB and PostgreSQL are both first-class supported databases"
  "encrypted at rest on the application layer"
  "GuardGuide is standalone-first"
)

for pattern in "${required_patterns[@]}"; do
  if ! grep -Fq "$pattern" "$FILE"; then
    echo "Missing required AI instruction text: $pattern" >&2
    exit 1
  fi
done

if ! grep -Fq 'This file mirrors the authoritative root `AGENTS.md`' "$COPILOT_FILE"; then
  echo "Missing compatibility mirror marker in $COPILOT_FILE" >&2
  exit 1
fi

for pattern in "${required_patterns[@]}"; do
  if ! grep -Fq "$pattern" "$COPILOT_FILE"; then
    echo "Missing required AI instruction text in copilot mirror: $pattern" >&2
    exit 1
  fi
done

echo "AI instructions look valid."
