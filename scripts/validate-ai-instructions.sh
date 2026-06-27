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
QUALITY_WORKFLOW="$REPO_ROOT/.github/workflows/quality.yml"
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

extract_source_list() {
  local source_file="$1"
  local destination_file="$2"

  awk '
    /^## (Focused Overlays|Authoritative Sources)$/ {capture=1}
    capture && /^## / && $0 !~ /^## (Focused Overlays|Authoritative Sources)$/ {capture=0}
    capture && /^- / {print}
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

agents_sources="$TMP_DIR/agents-sources.md"
copilot_sources="$TMP_DIR/copilot-sources.md"
normalized_copilot_sources="$TMP_DIR/copilot-sources-normalized.md"
extract_source_list "$FILE" "$agents_sources"
extract_source_list "$COPILOT_FILE" "$copilot_sources"
grep -Fvx -- '- `AGENTS.md`' "$copilot_sources" > "$normalized_copilot_sources" || true

if ! cmp -s "$agents_sources" "$normalized_copilot_sources"; then
  echo "Copilot source-list drift detected between $FILE and $COPILOT_FILE" >&2
  diff -u "$agents_sources" "$normalized_copilot_sources" >&2 || true
  exit 1
fi

if [[ -f "$QUALITY_WORKFLOW" ]]; then
  ai_uses_ref="$(sed -n 's|.*reusable-ai-instructions\\.yml@\\([^[:space:]]*\\).*|\\1|p' "$QUALITY_WORKFLOW" | head -n1)"
  markdown_uses_ref="$(sed -n 's|.*reusable-markdown-lint\\.yml@\\([^[:space:]]*\\).*|\\1|p' "$QUALITY_WORKFLOW" | head -n1)"
  ai_governance_ref="$(awk '
    $0 ~ /^  ai-instructions:/ {capture=1; next}
    capture && $0 ~ /^  [^[:space:]]/ {capture=0}
    capture && $0 ~ /governance-ref:/ {
      line=$0
      sub(/.*governance-ref:[[:space:]]*["'"'"']?/, "", line)
      sub(/["'"'"'][[:space:]]*$/, "", line)
      print line
      exit
    }
  ' "$QUALITY_WORKFLOW")"
  markdown_governance_ref="$(awk '
    $0 ~ /^  markdown-lint:/ {capture=1; next}
    capture && $0 ~ /^  [^[:space:]]/ {capture=0}
    capture && $0 ~ /governance-ref:/ {
      line=$0
      sub(/.*governance-ref:[[:space:]]*["'"'"']?/, "", line)
      sub(/["'"'"'][[:space:]]*$/, "", line)
      print line
      exit
    }
  ' "$QUALITY_WORKFLOW")"

  if [[ -n "$ai_uses_ref" && "$ai_governance_ref" != "$ai_uses_ref" ]]; then
    echo "AI instructions governance-ref drift in $QUALITY_WORKFLOW" >&2
    echo "  uses ref: $ai_uses_ref" >&2
    echo "  governance-ref: ${ai_governance_ref:-<missing>}" >&2
    exit 1
  fi

  if [[ -n "$markdown_uses_ref" && "$markdown_governance_ref" != "$markdown_uses_ref" ]]; then
    echo "Markdown lint governance-ref drift in $QUALITY_WORKFLOW" >&2
    echo "  uses ref: $markdown_uses_ref" >&2
    echo "  governance-ref: ${markdown_governance_ref:-<missing>}" >&2
    exit 1
  fi
fi

echo "AI instructions look valid."
