#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 SecPal Contributors
# SPDX-License-Identifier: MIT

set -euo pipefail

if ! command -v pre-commit >/dev/null 2>&1; then
  echo "pre-commit is not installed. Install it before continuing." >&2
  exit 1
fi

pre-commit install --install-hooks
echo "Pre-commit hooks installed."
