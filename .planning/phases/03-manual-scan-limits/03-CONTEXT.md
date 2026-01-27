# Phase 3: Manual Scan Limits - Context

**Gathered:** 2026-01-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Enforce tier-based manual scan quotas for Free tier users. Paid tiers get unlimited manual scans. Track usage, display quota status, block when exhausted with upgrade CTA. This phase does NOT include automated scanning (Phase 4) or changing tier definitions (Phase 1).

</domain>

<decisions>
## Implementation Decisions

### Quota Display
- Scan button shows remaining quota inline: "Scan Now · 1 left this week"
- When exhausted: button disabled, shows "Upgrade to scan"
- Dashboard brand card shows small badge with quota status for Free tier
- Paid tiers see no quota indicators (unlimited = no need to show)

### Period Boundaries
- Rolling 7-day window from first scan (not calendar week)
- Simpler than calendar weeks, fairer to users who sign up mid-week
- Track `first_scan_of_period` timestamp per user
- Period resets automatically when 7 days have passed since first scan

### Quota Exhaustion Behavior
- Hard block - no soft warnings or "one more" exceptions
- Clear upgrade CTA when limit hit: "You've used your free scan this week. Upgrade for unlimited scans."
- Link directly to pricing page with tier comparison
- No countdown timer or gamification - keep it simple and direct

### Admin Handling
- Admins bypass quota checks entirely (consistent with Phase 1 `!userData?.is_admin &&` pattern)
- Admin accounts see no quota indicators

### Claude's Discretion
- Exact button styling when disabled vs enabled
- Toast/notification when approaching limit vs only when hit
- Whether to show "resets in X days" countdown

</decisions>

<specifics>
## Specific Ideas

- Use existing `is_admin` bypass pattern from Phase 1
- Leverage tier-limits.ts infrastructure already in place
- Rolling window is more user-friendly than hard calendar resets

</specifics>

<deferred>
## Deferred Ideas

None — user delegated decisions to best practices

</deferred>

---

*Phase: 03-manual-scan-limits*
*Context gathered: 2026-01-27*
