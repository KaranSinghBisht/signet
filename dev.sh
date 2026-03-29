#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

# Kill any existing processes on our ports
echo "Cleaning up ports 3000 and 3001..."
lsof -ti :3000 -ti :3001 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

# Load root .env into the environment so all child processes inherit it
if [ -f "$ROOT/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
  echo "Loaded .env"
else
  echo "Warning: no .env found at $ROOT/.env"
fi

echo "Starting Signet dev environment..."
echo "  server  → http://localhost:3001"
echo "  web     → http://localhost:3000"
echo "  agent   → XMTP dev network"
echo ""

# Build shared package first so server/web have up-to-date types
echo "Building @signet/shared..."
cd "$ROOT" && pnpm --filter @signet/shared build 2>&1 | grep -v "^$" || true

# Launch all three services in parallel with labeled output
cd "$ROOT" && pnpm exec concurrently \
  --names "server,agent,web" \
  --prefix-colors "cyan,yellow,magenta" \
  --kill-others-on-fail \
  "pnpm dev:server" \
  "pnpm dev:agent" \
  "pnpm dev:web"
