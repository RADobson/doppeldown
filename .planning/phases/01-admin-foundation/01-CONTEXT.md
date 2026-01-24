# Phase 1: Admin Foundation - Context

**Gathered:** 2026-01-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Add admin accounts with tier bypass, and enforce tier-based brand limits. Admins bypass all limits. Free tier stops at 1 brand, Starter at 3, Pro at 10, Enterprise unlimited. Currently broken: free tier bypasses limits.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion

User delegated all implementation decisions. Claude will determine:

**Admin designation:**
- How admins are created (DB flag, seed, invite)
- Admin identification in codebase

**Limit enforcement UX:**
- Error messaging when limit hit
- Upgrade prompt vs hard block
- UI feedback approach

**Admin bypass behavior:**
- Whether admins see limit warnings
- Audit logging considerations

**Tier transition handling:**
- Behavior when user downgrades with excess brands
- Grace period vs immediate enforcement

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-admin-foundation*
*Context gathered: 2026-01-24*
