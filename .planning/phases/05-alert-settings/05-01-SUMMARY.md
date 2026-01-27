---
phase: 05-alert-settings
plan: 01
status: complete
completed: 2026-01-27

subsystem: alert-notifications
tags: [database, types, email, alert-settings]

dependency-graph:
  requires: []
  provides: [alert-preferences-schema, alert-settings-types, email-templates]
  affects: [05-02-settings-ui]

tech-stack:
  added: []
  patterns: [deprecation-comments, jsdoc-interface-docs]

key-files:
  created:
    - supabase/migrations/20260127300001_add_alert_preferences.sql
  modified:
    - src/types/index.ts
    - src/lib/email.ts

decisions:
  - id: 05-01-01
    area: database
    choice: "high_critical as default severity_threshold"
    rationale: "Matches existing alert_on_severity default of ['critical', 'high']"
  - id: 05-01-02
    area: migration
    choice: "Additive columns only, no drops/renames"
    rationale: "Safe rollback, backward compatibility with existing code"
  - id: 05-01-03
    area: types
    choice: "Keep alert_on_severity with @deprecated tag"
    rationale: "Existing code may reference it; new UI uses severity_threshold"

metrics:
  duration: ~90s
---

# Phase 5 Plan 1: Alert Preferences Foundation Summary

**One-liner:** Database schema, TypeScript types, and email templates for severity threshold, scan summaries, and weekly digests.

## What Was Built

### Database Schema (Migration)
- `severity_threshold` column: TEXT with CHECK constraint ('all', 'high_critical', 'critical'), default 'high_critical'
- `scan_summary_emails` column: BOOLEAN, default TRUE
- `weekly_digest` column: BOOLEAN, default TRUE
- Column comments documenting purpose and deprecation of `daily_digest`

### TypeScript Types
- Updated `AlertSettings` interface with new fields
- Added JSDoc comments explaining deprecation and field purposes
- Type-safe union for `severity_threshold`: `'all' | 'high_critical' | 'critical'`

### Email Functions
- `sendScanSummary(to, brand, scanResult)`: Per-scan completion email with domains checked, threats found, top 5 threats
- `sendWeeklyDigest(to, brandSummaries)`: Weekly rollup with per-brand breakdown, top 10 threats per brand
- Both use table-based HTML layout for email client compatibility
- Severity badges with color coding (critical=red, high=orange, medium=amber, low=blue)
- Footer with settings management link

## Commits

| Hash | Message |
|------|---------|
| bf4b091 | feat(05-01): add alert preferences columns to database |
| 36f75f9 | feat(05-01): update AlertSettings interface with new fields |
| e75c6e2 | feat(05-01): add scan summary and weekly digest email functions |

## Deviations from Plan

None - plan executed exactly as written.

## Files Changed

```
supabase/migrations/20260127300001_add_alert_preferences.sql (created)
src/types/index.ts (modified)
src/lib/email.ts (modified)
```

## Next Phase Readiness

**Ready for 05-02:** Settings UI implementation can proceed. Schema, types, and email functions are in place.

**Migration note:** Run `supabase db push` to apply new columns before testing settings UI.
