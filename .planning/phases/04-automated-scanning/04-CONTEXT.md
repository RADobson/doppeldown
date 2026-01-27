# Phase 4: Automated Scanning - Context

**Gathered:** 2026-01-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Background job scheduler running tier-appropriate scan frequencies. Users don't interact directly — scans happen automatically based on subscription tier. Brand-level pause is in scope; custom schedules and notifications are not.

</domain>

<decisions>
## Implementation Decisions

### Scheduling approach
- Vercel Cron endpoint (existing `/api/cron/scan`) — runs every hour
- Each invocation checks all brands, filters by tier schedule
- Random jitter (0-5 minutes) added to `scheduled_at` to prevent thundering herd
- Single cron job handles all tiers (no separate jobs per tier)

### Tier schedules
- Free: No automated scans (manual only)
- Starter: Daily (every 24 hours)
- Professional: Every 6 hours
- Enterprise: Hourly
- Update `tier-limits.ts` to match these intervals

### Missed scan handling
- No catch-up logic — if overdue, scan on next cron tick
- `last_scan_at` comparison determines eligibility
- If scan is in-progress/queued, skip (already handled in existing code)

### Brand-level pause
- Add `auto_scan_enabled` boolean to brands table (default: true)
- Users can toggle via brand settings
- Cron job respects this flag — skips paused brands
- No custom schedules per brand (tier determines frequency)

### Failure handling
- Use existing Phase 2 retry infrastructure (scan-queue, exponential backoff)
- Automated scans retry same as manual scans
- No special user notification for failed auto-scans (they see status in dashboard)
- Failed scans don't block next scheduled scan

### Claude's Discretion
- Exact jitter implementation (crypto.randomInt vs Math.random)
- Whether to log skipped brands (noisy vs useful for debugging)
- Index strategy for the scheduling query

</decisions>

<specifics>
## Specific Ideas

- Cron job already exists and has the right structure — this is mostly updating frequency logic and adding the pause flag
- `scanFrequencyDays` in tier-limits needs to become hours-based or add a separate field

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-automated-scanning*
*Context gathered: 2026-01-27*
