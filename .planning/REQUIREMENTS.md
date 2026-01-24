# Requirements: DoppelDown

**Defined:** 2026-01-24
**Core Value:** Detect real threats, not noise — AI analysis distinguishes actually-dangerous impersonation sites from benign domain registrations.

## v1 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Alert Settings

- [ ] **ALRT-01**: User can enable/disable email alerts in settings
- [ ] **ALRT-02**: User can set severity threshold for alerts (all / high+critical / critical)
- [ ] **ALRT-03**: User can toggle scan completion summary emails
- [ ] **ALRT-04**: User can toggle weekly digest emails

### Background Scanning

- [ ] **SCAN-01**: System runs automated scans per tier schedule (Starter=daily, Pro=6hr, Enterprise=hourly)
- [ ] **SCAN-02**: Free tier gets no automated scans (upgrade hook)

### Manual Scanning

- [ ] **SCAN-03**: Free tier limited to 1 manual scan per week
- [ ] **SCAN-04**: Paid tiers get unlimited manual scans

### Scanning Hardening

- [ ] **HARD-01**: Scans fail gracefully when external APIs timeout/error
- [ ] **HARD-02**: System respects external API rate limits with queuing
- [ ] **HARD-03**: Failed scans auto-retry with exponential backoff
- [ ] **HARD-04**: User can see scan progress and cancel in-progress scans

### Tier Enforcement

- [ ] **TIER-01**: Fix tier enforcement — Free accounts currently bypass all limits
- [ ] **TIER-02**: Enforce brand count limits per tier
- [ ] **TIER-03**: Enforce scan limits per tier (manual + automated)

### Admin

- [ ] **ADMN-01**: Add `is_admin` column to users table
- [ ] **ADMN-02**: Admin accounts bypass all tier limits

## v2 Requirements

Deferred to future sprints. Tracked but not in current roadmap.

### Alerting Enhancements

- **ALRT-05**: User can configure Slack webhook for alerts
- **ALRT-06**: User can choose alert destination (email, Slack, or both)

### Admin Enhancements

- **ADMN-03**: Admin accounts auto-assigned via email whitelist config
- **ADMN-04**: Admin dashboard for user management
- **ADMN-05**: Admin can impersonate users for support

### Multi-User Organizations

- **TEAM-01**: Organization/team entity that owns brands
- **TEAM-02**: User can invite team members via email
- **TEAM-03**: Organization owner can assign roles (admin, analyst, viewer)
- **TEAM-04**: Team members share access to organization's brands and threats
- **TEAM-05**: Seat-based billing per organization

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Mobile app | Web-first, defer to later |
| OAuth login | Email/password sufficient for launch |
| Real-time chat support | Not needed for v1 |
| Multi-language support | English only for launch |
| Public API | Internal use only for now |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| ALRT-01 | Phase 5 | Pending |
| ALRT-02 | Phase 5 | Pending |
| ALRT-03 | Phase 5 | Pending |
| ALRT-04 | Phase 5 | Pending |
| SCAN-01 | Phase 4 | Pending |
| SCAN-02 | Phase 4 | Pending |
| SCAN-03 | Phase 3 | Pending |
| SCAN-04 | Phase 3 | Pending |
| HARD-01 | Phase 2 | Pending |
| HARD-02 | Phase 2 | Pending |
| HARD-03 | Phase 2 | Pending |
| HARD-04 | Phase 2 | Pending |
| TIER-01 | Phase 1 | Pending |
| TIER-02 | Phase 1 | Pending |
| TIER-03 | Phase 3 | Pending |
| ADMN-01 | Phase 1 | Pending |
| ADMN-02 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

---
*Requirements defined: 2026-01-24*
*Last updated: 2026-01-24 after roadmap creation*
