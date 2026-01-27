---
phase: 04-automated-scanning
plan: 02
subsystem: scheduling
tags: [cron, tier-limits, jitter, vercel]

dependency-graph:
  requires: ["04-01"]
  provides: ["hours-based-cron-scheduling", "jitter", "auto-scan-filtering"]
  affects: ["04-03"]

tech-stack:
  patterns: ["hours-based-scheduling", "jitter-distribution"]

key-files:
  modified:
    - src/app/api/cron/scan/route.ts
    - vercel.json

decisions:
  - id: "04-02-A"
    decision: "Use crypto.randomInt for jitter"
    rationale: "Cryptographically secure, built-in Node.js module, no dependencies"
  - id: "04-02-B"
    decision: "0-5 minute jitter range"
    rationale: "Spreads load without delaying scans significantly"

metrics:
  duration: "45s"
  completed: "2026-01-27"
---

# Phase 04 Plan 02: Cron Scheduling Summary

**One-liner:** Hourly cron with hours-based tier thresholds (null/24/6/1), auto_scan_enabled filtering, and 0-5 min jitter.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Update cron endpoint for hours-based scheduling | 9697760 | src/app/api/cron/scan/route.ts |
| 2 | Update vercel.json to hourly schedule | 8362ce2 | vercel.json |

## Implementation Notes

### Cron Endpoint Changes
- Added `randomInt` import from crypto module
- Added `getScanFrequencyHours` import from tier-limits
- Added `.eq('auto_scan_enabled', true)` filter to brands query
- Replaced `scanFrequencyDays` with `scanFrequencyHours`
- Changed calculation from days to hours: `/ (1000 * 60 * 60)` instead of `/ (1000 * 60 * 60 * 24)`
- Added jitter to scheduled_at: `new Date(Date.now() + jitterMs).toISOString()`

### Vercel Cron Schedule
- Changed from `0 */6 * * *` (every 6 hours) to `0 * * * *` (hourly)
- Enables Enterprise tier to scan hourly
- Lower tiers filtered by hours-based threshold in endpoint

### Tier-Specific Behavior
| Tier | scanFrequencyHours | Behavior |
|------|-------------------|----------|
| Free | null | Never queued (skipped) |
| Starter | 24 | Queued when >= 24 hours since last scan |
| Professional | 6 | Queued when >= 6 hours since last scan |
| Enterprise | 1 | Queued when >= 1 hour since last scan |

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

| ID | Decision | Rationale |
|----|----------|-----------|
| 04-02-A | Use crypto.randomInt for jitter | Cryptographically secure, built-in Node.js module |
| 04-02-B | 0-5 minute jitter range | Spreads load without delaying scans significantly |

## Files Modified

| File | Change |
|------|--------|
| src/app/api/cron/scan/route.ts | Hours-based scheduling, auto_scan_enabled filter, jitter |
| vercel.json | Cron schedule changed to hourly (0 * * * *) |

## Verification Results

- [x] Cron endpoint imports crypto.randomInt
- [x] Cron endpoint filters by auto_scan_enabled = true
- [x] Hours-based calculation (not days)
- [x] Jitter applied to scheduled_at (0-5 min range)
- [x] vercel.json has `0 * * * *` schedule
- [x] TypeScript compiles (pre-existing errors unrelated to changes)

## Next Phase Readiness

**Provides:**
- Hourly cron execution for all tier scanning
- Hours-based filtering per tier
- Jitter distribution to prevent thundering herd
- auto_scan_enabled respect for pause functionality

**Next plan (04-03) needs:**
- Pause/resume UI controls for auto_scan_enabled toggle
- Frequency display in dashboard

## Metrics

- **Duration:** 45s
- **Completed:** 2026-01-27
