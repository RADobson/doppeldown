---
phase: 03-manual-scan-limits
plan: 01
subsystem: api
tags: [quota, rate-limiting, freemium, tier-enforcement, postgresql]

# Dependency graph
requires:
  - phase: 01-admin-foundation
    provides: is_admin column and bypass pattern (!userData?.is_admin &&)
  - phase: 01-admin-foundation
    provides: tier-limits.ts with getEffectiveTier, getTierLimits
provides:
  - Manual scan quota tracking columns (manual_scans_period_start, manual_scans_count)
  - Rolling 7-day window quota enforcement in POST /api/scan
  - Quota status endpoint GET /api/scan/quota
  - getManualScanLimit helper function
  - MANUAL_SCAN_PERIOD_MS constant
affects:
  - 03-02 (UI will consume quota endpoint)
  - any future scan-related features

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Rolling 7-day window quota (period_start + cached count)
    - 429 with QUOTA_EXCEEDED code and quota object
    - Admin bypass for quota checks
    - Separate quota status endpoint

key-files:
  created:
    - supabase/migrations/20260127100001_add_manual_scan_quota.sql
    - src/app/api/scan/quota/route.ts
  modified:
    - src/lib/tier-limits.ts
    - src/app/api/scan/route.ts

key-decisions:
  - "Rolling 7-day window from first scan, not calendar week"
  - "Cached count in users table, not counting scans table"
  - "Admin bypass via !userData?.is_admin && guard (consistent with Phase 1)"
  - "429 status with quota object for frontend consumption"

patterns-established:
  - "Quota enforcement: getManualScanLimit() returns null for unlimited, number for limited"
  - "429 response: { error, code: 'QUOTA_EXCEEDED', quota: { limit, used, resetsAt } }"
  - "Separate /quota endpoint for checking status without action"

# Metrics
duration: 2min
completed: 2026-01-27
---

# Phase 3 Plan 1: Manual Scan Quota Summary

**Tier-based manual scan quota with 7-day rolling window: Free tier gets 1 scan/week, paid tiers unlimited, admin bypass**

## Performance

- **Duration:** 1m 58s
- **Started:** 2026-01-27T05:40:40Z
- **Completed:** 2026-01-27T05:42:38Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- Database schema for quota tracking (period_start + cached count columns)
- Quota enforcement in POST /api/scan with 429 when exceeded
- Quota status endpoint GET /api/scan/quota for UI consumption
- Admin and paid tier bypass (consistent with Phase 1 pattern)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add quota tracking columns** - `554c72e` (feat)
2. **Task 2: Add quota helper function** - `8f26c03` (feat)
3. **Task 3: Add quota enforcement and endpoint** - `12482c2` (feat)

## Files Created/Modified
- `supabase/migrations/20260127100001_add_manual_scan_quota.sql` - Adds manual_scans_period_start and manual_scans_count columns with partial index
- `src/lib/tier-limits.ts` - Added getManualScanLimit() and MANUAL_SCAN_PERIOD_MS constant
- `src/app/api/scan/route.ts` - Quota check before scan creation, 429 when exceeded
- `src/app/api/scan/quota/route.ts` - GET endpoint returning QuotaResponse

## Decisions Made
- Rolling 7-day window from first scan (fairer than calendar week for mid-week signups)
- Cached count in users table avoids counting scans table on every request
- Period auto-resets when 7 days elapsed by setting count=1 (this scan) atomically
- Separate quota endpoint allows UI to show status without triggering scan

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

**Migration must be applied before testing:**
```bash
supabase db push
```

This will add the manual_scans_period_start and manual_scans_count columns to the users table.

## Next Phase Readiness
- Quota backend complete, ready for UI integration (03-02)
- API returns quota info in 429 response for frontend display
- Quota endpoint available for button state management
- Blockers: None

---
*Phase: 03-manual-scan-limits*
*Completed: 2026-01-27*
