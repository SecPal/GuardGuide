#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 SecPal Contributors
# SPDX-License-Identifier: MIT

set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel)"
cd "$ROOT_DIR"

CURRENT_BRANCH="$(git symbolic-ref --short HEAD 2>/dev/null || echo detached)"
if [[ "$CURRENT_BRANCH" == "main" ]]; then
  echo "Direct pushes from main are blocked. Create a topic branch first." >&2
  exit 1
fi

if command -v bash >/dev/null 2>&1; then
  ./scripts/validate-ai-instructions.sh
fi

if [[ -x ./scripts/check-conflict-markers.sh ]]; then
  ./scripts/check-conflict-markers.sh
fi

if command -v reuse >/dev/null 2>&1; then
  reuse lint
fi

if [[ -f package.json ]] && command -v npm >/dev/null 2>&1; then
  if [[ -f package-lock.json ]]; then
    npm ci
  fi
  npm run --if-present format:check
  npm run --if-present lint
  npm run --if-present typecheck
  npm run --if-present test
fi

if [[ -f composer.json ]] && command -v composer >/dev/null 2>&1; then
  composer install --no-interaction --no-progress --prefer-dist
  if [[ -x ./vendor/bin/pint ]]; then
    ./vendor/bin/pint --test
  fi
  if [[ -x ./vendor/bin/phpstan ]]; then
    ./vendor/bin/phpstan analyse
  fi
  if [[ -f artisan ]]; then
    php artisan test
  elif [[ -x ./vendor/bin/pest ]]; then
    ./vendor/bin/pest
  fi
fi

echo "GuardGuide preflight completed."
