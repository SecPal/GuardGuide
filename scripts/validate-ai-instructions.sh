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
TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/guardguide-ai-instructions.XXXXXX")"

cleanup() {
  rm -rf "$TMP_DIR"
}

trap cleanup EXIT

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
  "Person-related data must be encrypted at rest on the application layer"
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

extract_runtime_baseline() {
  local source_file="$1"
  local destination_file="$2"

  awk '
    /^## Core Runtime Baseline$/ {capture=1}
    capture {print}
  ' "$source_file" > "$destination_file"
}

agents_runtime="$TMP_DIR/agents-runtime.md"
copilot_runtime="$TMP_DIR/copilot-runtime.md"
extract_runtime_baseline "$FILE" "$agents_runtime"
extract_runtime_baseline "$COPILOT_FILE" "$copilot_runtime"

if ! cmp -s "$agents_runtime" "$copilot_runtime"; then
  echo "Copilot mirror drift detected between $FILE and $COPILOT_FILE" >&2
  diff -u "$agents_runtime" "$copilot_runtime" >&2 || true
  exit 1
fi

echo "AI instructions look valid."
