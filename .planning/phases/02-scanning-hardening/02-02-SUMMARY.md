---
phase: 02-scanning-hardening
plan: 02
subsystem: scanning
tags: [progress-tracking, error-aggregation, rate-limiting, retry-visibility]

dependency_graph:
  requires: [02-01]
  provides: [progress-schema, hardened-scan-runner, retry-sync]
  affects: [02-03, 02-04]

tech_stack:
  added: []
  patterns: [weighted-progress-calculation, error-aggregation, queue-integration]

key_files:
  created:
    - supabase/migrations/20260125000001_add_scan_progress_fields.sql
  modified:
    - src/types/index.ts
    - src/lib/scan-runner.ts
    - scripts/scan-worker.ts

decisions: []

metrics:
  duration: 274s
  completed: 2026-01-25
---

# Phase 2 Plan 2: Progress Schema & Hardened Scan Runner Summary

Progress tracking with weighted step calculation, error aggregation for partial failures, and retry count sync for UI visibility.

## What Was Done

### Task 1: Progress Schema Migration
- Created migration adding 6 columns to scans table:
  - `current_step` (TEXT) - tracks scan phase: domains, web, logo, social, finalizing
  - `step_progress` (INTEGER) - items completed in current step
  - `step_total` (INTEGER) - total items in current step
  - `overall_progress` (INTEGER) - 0-100 percentage
  - `partial_errors` (JSONB) - array of non-fatal errors
  - `retry_count` (INTEGER) - synced from scan_jobs.attempts for UI "Retry 2/3"
- Added `ScanError` type to types/index.ts
- Updated `ScanResult` interface with new progress fields

### Task 2: Hardened Scan Runner & Retry Sync
- Added imports: `dnsQueue`, `clearAllQueues` from scan-queue.ts
- Implemented `ScanStep` type and `STEP_WEIGHTS` for weighted progress:
  - domains: 40%, web: 25%, logo: 15%, social: 20%
- Added `calculateOverallProgress()` function:
  - Calculates based on enabled scan modes
  - Handles partial step completion
  - Returns 0-100 percentage
- Refactored `updateProgress()` to track step info:
  - Now takes step, stepProg, stepTot, force parameters
  - Updates current_step, step_progress, step_total, overall_progress
  - Includes partial_errors in updates
- Wrapped DNS checks with `dnsQueue.add()` for rate limiting
- Added try/catch error capture for all scan phases:
  - dns_check errors captured during domain loop
  - web_scan errors captured around web scanning
  - logo_scan errors captured around logo scanning
  - social_scan errors captured around social scanning
- Final completion sets `overall_progress: 100` with all partial_errors
- Added `clearAllQueues()` call on error/cancellation
- Updated scan-worker.ts to sync retry_count:
  - At job start: syncs current attempt count
  - On retry: syncs incremented count for UI visibility

## Key Implementation Details

### Progress Calculation
```typescript
const STEP_WEIGHTS: Record<ScanStep, number> = {
  domains: 40,
  web: 25,
  logo: 15,
  social: 20,
  finalizing: 0
};
```
Only enabled steps contribute to total weight, so a domain-only scan still shows 0-100% correctly.

### Error Aggregation Pattern
```typescript
} catch (err) {
  partialErrors.push({
    type: 'dns_check',
    target: variation.domain,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
    retryable: true
  });
  domainsChecked++; // Count even failures
  // Continue to next domain - don't crash scan
}
```

### Queue Integration
Domain checks now use rate-limited dnsQueue:
```typescript
const isRegistered = await dnsQueue.add(async () => {
  return await checkDomainRegistration(variation.domain);
});
```

## Files Modified

| File | Changes |
|------|---------|
| `supabase/migrations/20260125000001_add_scan_progress_fields.sql` | New migration with 6 columns + comments |
| `src/types/index.ts` | Added ScanError type, updated ScanResult |
| `src/lib/scan-runner.ts` | Queue imports, progress calc, error aggregation, step tracking |
| `scripts/scan-worker.ts` | retry_count sync on job start and retry |

## Verification Results

- Migration file exists with all 6 columns including retry_count
- scan-runner.ts imports dnsQueue and clearAllQueues
- Domain checking uses dnsQueue.add() wrapper
- updateProgress sends current_step, step_progress, step_total, overall_progress
- partialErrors captured for dns, web, logo, social phases
- Final completion sets overall_progress: 100
- scan-worker.ts syncs retry_count to scans table

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

**Ready for 02-03:** Scan runner now uses rate-limited queues and captures partial errors. Progress percentage is calculated and updated in real-time. The UI can show "Retry 2/3" via retry_count column.

**Note:** Pre-existing TypeScript type mismatch in dashboard page (local Scan interface missing pages_scanned) was not addressed - out of scope for this plan but should be fixed separately.
