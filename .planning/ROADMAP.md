# Roadmap: DoppelDown

## Overview

Transform DoppelDown from validated prototype to production-ready brand protection platform. This milestone hardens existing infrastructure, implements tier-based access controls, adds automated background scanning, and enables user-configured email alerts. Focus: reliability, enforcement, and automation for weekend sprint demo.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Admin Foundation** - Core infrastructure fixes enabling proper tier enforcement
- [ ] **Phase 2: Scanning Hardening** - Fix reliability issues in existing scan flows
- [ ] **Phase 3: Manual Scan Limits** - Enforce tier-based manual scan quotas
- [ ] **Phase 4: Automated Scanning** - Background scan scheduler with tier schedules
- [ ] **Phase 5: Alert Settings** - User-configurable email notification preferences

## Phase Details

### Phase 1: Admin Foundation
**Goal**: Critical infrastructure in place for tier enforcement and admin privileges
**Depends on**: Nothing (first phase)
**Requirements**: ADMN-01, ADMN-02, TIER-01, TIER-02
**Success Criteria** (what must be TRUE):
  1. Admin accounts exist in database with `is_admin` column
  2. Admin accounts bypass all tier limits (brand count, scan limits)
  3. Free accounts cannot create brands beyond limit (currently broken)
  4. Each tier respects its brand count limit (Free=1, Starter=3, Pro=10, Enterprise=unlimited)
**Plans**: 1 plan

Plans:
- [x] 01-01-PLAN.md — Add admin column, fix brand limits, implement admin bypass

### Phase 2: Scanning Hardening
**Goal**: Existing scans run reliably with graceful error handling and recovery
**Depends on**: Phase 1
**Requirements**: HARD-01, HARD-02, HARD-03, HARD-04
**Success Criteria** (what must be TRUE):
  1. Scans continue when individual API calls timeout or fail (no full scan crashes)
  2. System respects external API rate limits with queuing (no 429 errors causing cascading failures)
  3. Failed scans retry automatically with exponential backoff (no manual intervention needed)
  4. User can see real-time scan progress percentage and cancel in-progress scans
**Plans**: TBD

Plans:
- [ ] TBD during planning

### Phase 3: Manual Scan Limits
**Goal**: Tier-based manual scan quotas enforced to drive upgrades
**Depends on**: Phase 1 (tier enforcement infrastructure), Phase 2 (reliable scans)
**Requirements**: SCAN-03, SCAN-04, TIER-03
**Success Criteria** (what must be TRUE):
  1. Free tier users limited to 1 manual scan per week (upgrade wall)
  2. Paid tier users get unlimited manual scans
  3. Manual scan button shows quota status ("X scans remaining" for Free tier)
  4. System tracks manual scan count per user per tier period
**Plans**: TBD

Plans:
- [ ] TBD during planning

### Phase 4: Automated Scanning
**Goal**: Background job scheduler running tier-appropriate scan frequencies
**Depends on**: Phase 2 (hardened scans), Phase 3 (scan limit tracking)
**Requirements**: SCAN-01, SCAN-02
**Success Criteria** (what must be TRUE):
  1. Starter tier brands scanned daily at configured time
  2. Pro tier brands scanned every 6 hours
  3. Enterprise tier brands scanned hourly
  4. Free tier brands never auto-scanned (manual only)
  5. Background jobs respect brand-level scan preferences (pause, schedule override)
**Plans**: TBD

Plans:
- [ ] TBD during planning

### Phase 5: Alert Settings
**Goal**: Users control email notification preferences per threat severity
**Depends on**: Phase 4 (automated scanning generates alerts)
**Requirements**: ALRT-01, ALRT-02, ALRT-03, ALRT-04
**Success Criteria** (what must be TRUE):
  1. User can enable/disable email alerts in settings page
  2. User can set severity threshold (all threats / high+critical / critical only)
  3. User can toggle scan completion summary emails (sent after each scan)
  4. User can toggle weekly digest emails (summarizing week's threats)
  5. Alert preferences persist and apply to all future scans
**Plans**: TBD

Plans:
- [ ] TBD during planning

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Admin Foundation | 1/1 | Complete | 2026-01-25 |
| 2. Scanning Hardening | 0/TBD | Not started | - |
| 3. Manual Scan Limits | 0/TBD | Not started | - |
| 4. Automated Scanning | 0/TBD | Not started | - |
| 5. Alert Settings | 0/TBD | Not started | - |
