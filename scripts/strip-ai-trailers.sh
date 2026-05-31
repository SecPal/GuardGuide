#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 SecPal Contributors
# SPDX-License-Identifier: MIT

set -euo pipefail

COMMIT_MSG_FILE="${1:?commit-msg hook requires the commit message file path}"

if [[ ! -f "$COMMIT_MSG_FILE" ]]; then
  echo "strip-ai-trailers: commit message file not found: $COMMIT_MSG_FILE" >&2
  exit 1
fi

AI_PATTERN='Co-[Aa]uthored-[Bb]y:[[:space:]]*(Cursor[^<]*<cursoragent@cursor\.com>|[Cc]ursor[[:space:]]+[Aa]gent[^<]*<[^>]*>|GitHub[[:space:]]+Copilot[^<]*<[^>]*@github\.com>|copilot-pull-request-reviewer(\[bot\])?[^<]*<[^>]*>)'

tmp_file="$(mktemp "${TMPDIR:-/tmp}/strip-ai-trailers.XXXXXX")"
trap 'rm -f "$tmp_file" "${tmp_file}.2"' EXIT

sed -E "/$AI_PATTERN/d" "$COMMIT_MSG_FILE" > "$tmp_file"

awk '{ lines[NR] = $0 }
END {
  last = NR
  while (last > 0 && lines[last] ~ /^[[:space:]]*$/) last--
  for (i = 1; i <= last; i++) print lines[i]
}' "$tmp_file" > "${tmp_file}.2"

mv "${tmp_file}.2" "$tmp_file"
mv "$tmp_file" "$COMMIT_MSG_FILE"
