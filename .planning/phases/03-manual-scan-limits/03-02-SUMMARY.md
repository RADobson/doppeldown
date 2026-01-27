---
phase: 03-manual-scan-limits
plan: 02
subsystem: ui
tags: [quota, freemium, scan-button, upsell, react-hooks]

# Dependency graph
requires:
  - phase: 03-manual-scan-limits
    plan: 01
    provides: "/api/scan/quota endpoint with QuotaResponse"
provides:
  - useQuotaStatus hook for fetching quota status
  - Scan button with inline quota display for Free tier
  - Upgrade CTA banner when quota exhausted
affects:
  - Any future scan UI components needing quota awareness

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Reusable quota hook with refetch capability
    - Conditional button text based on quota state
    - Inline upgrade CTA when limit reached

key-files:
  created:
    - src/hooks/useQuotaStatus.ts
  modified:
    - src/app/dashboard/brands/[id]/page.tsx

key-decisions:
  - "Hook returns refetch function for post-scan refresh"
  - "Button shows 'X left this week' not 'X/1 remaining' (cleaner)"
  - "Blue upgrade banner matches marketing/info tone, not red/warning"
  - "Quick Actions button mirrors header button logic for consistency"

patterns-established:
  - "useQuotaStatus hook pattern for quota-aware components"
  - "Quota-gated UI: disabled + upgrade CTA when exhausted"

# Metrics
duration: 1m 50s
completed: 2026-01-27
---

# Phase 3 Plan 2: Quota UI Summary

**Scan buttons show quota status for Free tier with upgrade CTA when exhausted; paid/admin see standard UI**

## Performance

- **Duration:** ~1m 50s
- **Started:** 2026-01-27T05:44:57Z
- **Completed:** 2026-01-27T05:46:47Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Created reusable useQuotaStatus hook with fetch/refetch pattern
- Updated header scan button to show "Scan Now - X left this week" for free tier
- Updated header scan button to show "Upgrade to scan" when quota exhausted
- Added blue upgrade CTA banner when quota exhausted
- Updated Quick Actions "Run Full Scan" button with same logic
- Quota auto-refreshes after scan completion

## Task Commits

Each task was committed atomically:

1. **Task 1: Create useQuotaStatus hook** - `9ac071d` (feat)
2. **Task 2: Update brand detail page scan button with quota display** - `cf7854e` (feat)

## Files Created/Modified
- `src/hooks/useQuotaStatus.ts` - New hook exporting useQuotaStatus with quota, loading, error, refetch
- `src/app/dashboard/brands/[id]/page.tsx` - Updated scan buttons with quota display, added upgrade CTA

## UI States

| User Type | Quota State | Header Button | Quick Actions Button | CTA Banner |
|-----------|-------------|---------------|---------------------|------------|
| Free tier | 1 remaining | "Scan Now - 1 left this week" | "Scan Now - 1 left" | Hidden |
| Free tier | 0 remaining | "Upgrade to scan" (disabled) | "Upgrade to scan" (disabled) | Visible |
| Paid tier | Unlimited | "Run Scan" | "Run Full Scan" | Hidden |
| Admin | Unlimited | "Run Scan" | "Run Full Scan" | Hidden |

## Decisions Made
- Hook includes refetch function so UI can refresh quota after scan completes
- Button text uses "X left this week" for clarity (not "X/1 remaining")
- Upgrade banner uses blue/info styling to feel like helpful upsell, not scary warning
- Both scan buttons (header and Quick Actions) share same quota logic for consistency

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness
- Phase 3 complete (quota backend + UI)
- Manual scan limits fully enforced
- Upgrade path visible to free tier users
- Ready for Phase 4 (NRD Monitoring Hardening)

---
*Phase: 03-manual-scan-limits*
*Completed: 2026-01-27*
