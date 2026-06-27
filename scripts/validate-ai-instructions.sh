#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 SecPal Contributors
# SPDX-License-Identifier: MIT

set -euo pipefail

FILE="AGENTS.md"

if [[ ! -f "$FILE" ]]; then
  echo "Missing $FILE" >&2
  exit 1
fi

required_patterns=(
  "shadcn/ui is the exclusive UI baseline"
  "English source text and German translation"
  "GuardGuide is a Laravel monolith"
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
