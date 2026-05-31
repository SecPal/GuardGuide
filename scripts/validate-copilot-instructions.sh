#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 SecPal Contributors
# SPDX-License-Identifier: MIT

set -euo pipefail

FILE=".github/copilot-instructions.md"

if [[ ! -f "$FILE" ]]; then
  echo "Missing $FILE" >&2
  exit 1
fi

required_patterns=(
  "Catalyst is the exclusive UI baseline"
  "English source language"
  "MariaDB and PostgreSQL"
  "Person-related data must be encrypted at rest"
  "GuardGuide is standalone-first"
)

for pattern in "${required_patterns[@]}"; do
  if ! grep -Fq "$pattern" "$FILE"; then
    echo "Missing required Copilot instruction text: $pattern" >&2
    exit 1
  fi
done

echo "Copilot instructions look valid."
