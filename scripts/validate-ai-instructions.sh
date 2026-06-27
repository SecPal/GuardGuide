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

if [[ ! -f "$FILE" ]]; then
  echo "Missing $FILE" >&2
  exit 1
fi

required_patterns=(
  "shadcn/ui is the primary UI baseline"
  "English source language and German translation"
  "GuardGuide is a Laravel monolith with React/Vite"
  "encrypted at rest on the application layer"
  "GuardGuide is standalone-first"
)

for pattern in "${required_patterns[@]}"; do
  if ! grep -Fq "$pattern" "$FILE"; then
    echo "Missing required AI instruction text: $pattern" >&2
    exit 1
  fi
done

echo "AI instructions look valid."
