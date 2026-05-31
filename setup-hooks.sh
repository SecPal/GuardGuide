#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 SecPal Contributors
# SPDX-License-Identifier: MIT

set -euo pipefail

./scripts/setup-pre-commit.sh
./scripts/setup-pre-push.sh

HOOKS_DIR="$(git rev-parse --git-path hooks)"
HOOK_PATH="$HOOKS_DIR/commit-msg"
TARGET_PATH="../../scripts/strip-ai-trailers.sh"

mkdir -p "$HOOKS_DIR"
ln -sf "$TARGET_PATH" "$HOOK_PATH"

echo "Git hooks installed for GuardGuide."
