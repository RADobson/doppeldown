---
phase: 04-automated-scanning
plan: 01
subsystem: scheduling
tags: [database, tier-limits, cron]
---

# Phase 04 Plan 01: Scan Foundation Summary

**One-liner:** Hours-based scan frequency (null/24/6/1) with brand-level auto_scan_enabled pause flag and optimized scheduling index.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add auto_scan_enabled migration | 3f9167e | supabase/migrations/20260127200001_add_auto_scan_enabled.sql |
| 2 | Update tier-limits with hours-based frequency | 2c62692 | src/lib/tier-limits.ts |

## Implementation Notes

### Migration
- Added `auto_scan_enabled` boolean column to brands table with DEFAULT true
- Created partial index `idx_brands_auto_scan_scheduling` for cron query optimization
- Index covers only active brands with auto-scan enabled, ordered by last_scan_at DESC

### Tier Limits
- Added `scanFrequencyHours` field to TierLimits interface
- Values: free=null (manual only), starter=24, professional=6, enterprise=1
- Added `getScanFrequencyHours()` helper function
- Updated `hasAutomatedScans()` to use hours-based field
- Preserved `scanFrequencyDays` for backward compatibility (marked deprecated)

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

| ID | Decision | Rationale |
|----|----------|-----------|
| 04-01-A | Partial index on (last_scan_at DESC) with WHERE clause | Optimizes cron scheduling query to find oldest-scanned active brands |
| 04-01-B | Keep scanFrequencyDays deprecated | Cron endpoint uses it until Plan 02 updates |

## Files Modified

| File | Change |
|------|--------|
| supabase/migrations/20260127200001_add_auto_scan_enabled.sql | Created - auto_scan_enabled column + scheduling index |
| src/lib/tier-limits.ts | Added scanFrequencyHours field and helper function |

## Verification Results

- [x] Migration file exists with auto_scan_enabled column
- [x] Partial index created for scheduling optimization
- [x] tier-limits.ts exports scanFrequencyHours for all tiers
- [x] Free tier returns null (manual only)
- [x] TypeScript compiles (pre-existing errors unrelated to changes)

## Next Phase Readiness

**Provides:**
- `auto_scan_enabled` column for brand-level pause control
- `scanFrequencyHours` field for hours-based scheduling
- `getScanFrequencyHours()` helper for cron endpoint

**Next plan (04-02) needs:**
- Update cron endpoint to use hours-based scheduling
- Respect auto_scan_enabled flag in scheduling query

## Metrics

- **Duration:** 90s (1m 30s)
- **Completed:** 2026-01-27
