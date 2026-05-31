#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 SecPal Contributors
# SPDX-License-Identifier: MIT

set -euo pipefail

HOOK_PATH="$(git rev-parse --git-path hooks)/pre-push"
TARGET_PATH="../../scripts/preflight.sh"

mkdir -p "$(dirname "$HOOK_PATH")"
ln -sf "$TARGET_PATH" "$HOOK_PATH"

echo "Pre-push hook installed."
