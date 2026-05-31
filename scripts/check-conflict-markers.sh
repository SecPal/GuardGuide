#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 SecPal Contributors
# SPDX-License-Identifier: MIT

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel)"
cd "$ROOT_DIR"

if grep -RInE \
  --exclude-dir=.git \
  --exclude-dir=node_modules \
  --exclude-dir=vendor \
  '^(<<<<<<<|=======|>>>>>>>)' .; then
  echo "Merge conflict markers detected." >&2
  exit 1
fi

echo "No merge conflict markers found."
