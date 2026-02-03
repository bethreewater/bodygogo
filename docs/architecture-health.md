# Architecture Health Notes

This note captures recent changes intended to keep the system healthy, minimal, and performant.

## What Changed
- Community feed now uses batch queries for state and activity data to avoid N+1 calls.
- Community feed data now derives `is_active_today` from same-day logs.
- Private users are filtered out of community results when a `privacy` field is available.
- Dashboard caching now uses tag-based `unstable_cache` with a per-date key.
- Trend history endpoints now return fixed-length arrays with real data.

## Why It Helps
- Fewer database round-trips under community pages.
- Consistent and predictable trend graphs.
- Reduced recomputation across requests.
- Clearer privacy posture in community surfaces.

## Open Considerations
- Confirm whether `users.privacy` exists in the schema; if not, add it or map from settings.
- Decide how to invalidate `dashboard:${date}` tags (e.g., `revalidateTag` on log writes).
    - Added `revalidateTag` calls in server actions for writes to logs and profile.
