---
phase: 02-scanning-hardening
plan: 01
subsystem: api
tags: [p-queue, rate-limiting, fetch, retry, abort-signal, exponential-backoff]

# Dependency graph
requires:
  - phase: 01-admin-foundation
    provides: Base tier system and scan infrastructure
provides:
  - Rate-limited queues for DNS, search, screenshot, OpenAI, external APIs
  - Fetch wrapper with retry, timeout, 429 handling, abort support
affects: [02-02-domain-dns-refactor, 02-03-web-scanner-refactor, scanning, scan-runner]

# Tech tracking
tech-stack:
  added: [p-queue@9.1.0]
  patterns: [rate-limited-queues, wrap-and-continue, result-objects-not-throws]

key-files:
  created:
    - src/lib/scan-queue.ts
    - src/lib/api-client.ts
  modified:
    - package.json

key-decisions:
  - "Provider-specific queues with conservative limits (DNS 10/s, search 2/s, screenshot 1/2s, OpenAI 50/min, external 5/s)"
  - "Return result objects instead of throwing for wrap-and-continue pattern"
  - "Full jitter on exponential backoff to prevent thundering herd"

patterns-established:
  - "Queue pattern: Import specific queue from scan-queue.ts, wrap API call with queue.add()"
  - "Result pattern: Check result.success before accessing result.data"
  - "Abort pattern: Pass abortSignal through FetchOptions for cancellation support"

# Metrics
duration: 2min 32s
completed: 2026-01-25
---

# Phase 02 Plan 01: Rate Limiting Infrastructure Summary

**Rate-limited queues with p-queue and retry-capable fetch wrapper using AbortSignal.timeout for safe external API calls**

## Performance

- **Duration:** 2 min 32s
- **Started:** 2026-01-24T23:00:57Z
- **Completed:** 2026-01-24T23:03:29Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Installed p-queue v9.1.0 for rate-limited async queues
- Created 5 provider-specific queues with conservative rate limits
- Built fetch wrapper with exponential backoff, 429 handling, and abort signal support
- Established wrap-and-continue pattern for error handling without crashing scans

## Task Commits

Each task was committed atomically:

1. **Task 1: Install p-queue and create scan-queue.ts** - `2b70e2a` (feat)
2. **Task 2: Create api-client.ts with retry and timeout** - `565852c` (feat)

## Files Created/Modified
- `src/lib/scan-queue.ts` - Rate-limited queues: dnsQueue, searchQueue, screenshotQueue, openaiQueue, externalQueue + helpers
- `src/lib/api-client.ts` - fetchWithRetry and fetchJson with timeout, backoff, 429 handling
- `package.json` - Added p-queue@9.1.0 dependency

## Decisions Made
- **Conservative rate limits:** Started with safe defaults (DNS 10/s, search 2/s) - can be tuned based on 429 monitoring
- **Separate queues per provider:** Allows independent rate limiting without cross-contamination
- **Result objects over throws:** fetchWithRetry returns `{success, data}` or `{success: false, error}` enabling wrap-and-continue
- **Default 10s timeout:** SCAN_NETWORK_TIMEOUT_MS env var overrides for tuning

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript type narrowing in fetchJson**
- **Found during:** Task 2 (api-client.ts creation)
- **Issue:** Returning `result` directly when `result.success === false` didn't narrow types correctly for generic `FetchResult<T>`
- **Fix:** Explicitly reconstruct the failure object with `success: false as const`
- **Files modified:** src/lib/api-client.ts
- **Verification:** `npx tsc --noEmit` passes
- **Committed in:** 565852c (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor type fix required for TypeScript strictness. No scope creep.

## Issues Encountered
- Pre-existing TypeScript errors (pages_scanned, screenshot_url, downlevelIteration) remain in codebase - not related to this plan, documented in STATE.md blockers

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Queue and fetch infrastructure ready for integration into scanner modules
- Next plans (02-02, 02-03) will refactor domain-generator.ts and web-scanner.ts to use these utilities
- No blockers

---
*Phase: 02-scanning-hardening*
*Completed: 2026-01-25*
