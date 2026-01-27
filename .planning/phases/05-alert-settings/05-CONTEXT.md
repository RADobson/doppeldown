# Phase 5: Alert Settings - Context

**Gathered:** 2026-01-27
**Status:** Ready for planning

<domain>
## Phase Boundary

User-configurable email notification preferences per threat severity. Users can enable/disable alerts, set severity thresholds, toggle scan summaries, and toggle weekly digests. Email sending infrastructure and templates are in scope; actual email delivery service (SendGrid/Resend/etc.) setup is assumed available.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion

User delegated all implementation decisions to best practices. The following defaults will guide research and planning:

**Settings Page Layout:**
- Single settings page with logical groupings (not scattered across app)
- Toggle switches for on/off preferences (standard pattern)
- Radio buttons or dropdown for severity threshold (mutually exclusive)
- Settings grouped: Alert Preferences → Digest Preferences
- Save button with success feedback (or auto-save with debounce)

**Email Content & Format:**
- Threat alerts: Brand name, threat domain, severity, risk score, brief description, link to dashboard
- Scan summary: Brand scanned, domains checked count, threats found count, top threats list, link to full results
- Weekly digest: All brands summary, new threats this week, severity breakdown, recommended actions
- Clean, minimal HTML template (works in all email clients)
- Plain text fallback for accessibility

**Severity Threshold Logic:**
- Map to existing threat_level values in database (likely: low, medium, high, critical)
- "All threats" = low+ (everything)
- "High + Critical" = high, critical only
- "Critical only" = critical only
- Threshold applies to both immediate alerts and digest inclusion

**Delivery Timing:**
- Immediate alerts: Send within minutes of scan completion (no batching)
- Scan summary: Send immediately after scan completes (if enabled)
- Weekly digest: Monday 9am user's timezone (or UTC if no timezone set)
- Include timezone selector in settings (optional, default UTC)

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. User trusts best practices.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-alert-settings*
*Context gathered: 2026-01-27*
