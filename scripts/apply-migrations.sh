#!/usr/bin/env bash
set -euo pipefail

if [ -z "${SUPABASE_URL:-}" ] || [ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
  echo "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
  echo "Example: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... ./scripts/apply-migrations.sh"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MIGRATIONS_DIR="$ROOT_DIR/docs/migrations"

ONLY_FILE=""
SKIP_ROLLBACK=true
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --only)
      ONLY_FILE="$2"
      shift 2
      ;;
    --include-rollback)
      SKIP_ROLLBACK=false
      shift 1
      ;;
    --dry-run)
      DRY_RUN=true
      shift 1
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: ./scripts/apply-migrations.sh [--only <file>] [--include-rollback] [--dry-run]"
      exit 1
      ;;
  esac
done

echo "Applying migrations in $MIGRATIONS_DIR"

for file in "$MIGRATIONS_DIR"/*.sql; do
  base="$(basename "$file")"

  if [ -n "$ONLY_FILE" ] && [ "$base" != "$ONLY_FILE" ]; then
    continue
  fi

  if [ "$SKIP_ROLLBACK" = true ] && [[ "$base" == *"rollback"* ]]; then
    continue
  fi

  echo "==> Applying $file"
  if [ "$DRY_RUN" = true ]; then
    continue
  fi
  curl -sS "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    --data "{\"query\": $(jq -Rs . < "$file")}"> /dev/null
done

echo "Done."
