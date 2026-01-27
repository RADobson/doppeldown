---
phase: 05-alert-settings
plan: 02
status: complete
completed: 2026-01-27

subsystem: alert-notifications
tags: [settings-ui, cron, email-digest, vercel]

dependency-graph:
  requires: [05-01-alert-preferences-foundation]
  provides: [settings-ui-alert-controls, weekly-digest-cron]
  affects: []

tech-stack:
  added: []
  patterns: [radio-button-groups, toggle-switches, cron-scheduling]

key-files:
  created:
    - src/app/api/cron/digest/route.ts
  modified:
    - src/app/dashboard/settings/page.tsx
    - vercel.json

decisions:
  - id: 05-02-01
    area: ui
    choice: "Radio buttons for severity threshold (3 options)"
    rationale: "Clearer UX than chip toggles; mutually exclusive options"
  - id: 05-02-02
    area: backward-compat
    choice: "Sync daily_digest = weekly_digest on save"
    rationale: "Keeps legacy daily_digest column in sync for any old code"
  - id: 05-02-03
    area: scheduling
    choice: "Monday 9am UTC for weekly digest"
    rationale: "Start of business week, before US/EU working hours"

metrics:
  duration: ~75s
---

# Phase 5 Plan 2: Settings UI and Digest Cron Summary

**One-liner:** Radio buttons for severity threshold, toggle for scan summaries, weekly digest cron on Mondays at 9am UTC.

## What Was Built

### Settings Page Updates
- **Severity Threshold Radio Buttons:** 3 options (All Threats, High+Critical Only, Critical Only) with descriptions
- **Scan Summary Emails Toggle:** On/off switch for per-scan completion emails
- **Weekly Digest Rename:** Changed "Daily Digest" to "Weekly Digest" with updated description
- **Backward Compatibility:** Derives severity_threshold from legacy alert_on_severity on load; syncs daily_digest on save

### Weekly Digest Cron Endpoint
- **Path:** `/api/cron/digest`
- **Auth:** CRON_SECRET bearer token verification
- **Logic:**
  1. Query users with weekly_digest OR daily_digest enabled (transition support)
  2. For each user, get all brands
  3. Fetch threats from past 7 days per brand (limited to 10)
  4. Call sendWeeklyDigest if any threats found
- **Results:** Returns {sent, skipped, errors} counts

### Vercel Cron Schedule
- Added `/api/cron/digest` with schedule `0 9 * * 1` (Monday 9am UTC)
- Existing `/api/cron/scan` unchanged

## Commits

| Hash | Message |
|------|---------|
| 04b2f57 | feat(05-02): add alert preference controls to settings UI |
| 0dbbef9 | feat(05-02): create weekly digest cron endpoint |

## Deviations from Plan

None - plan executed exactly as written.

## Files Changed

```
src/app/dashboard/settings/page.tsx (modified)
src/app/api/cron/digest/route.ts (created)
vercel.json (modified)
```

## Next Phase Readiness

**Phase 5 Complete:** All alert settings features implemented.

**Testing notes:**
- Run `supabase db push` to apply migration from 05-01
- Test settings page save/load cycle
- Test digest cron via: `curl -H "Authorization: Bearer $CRON_SECRET" localhost:3000/api/cron/digest`
