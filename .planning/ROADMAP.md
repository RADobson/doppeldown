# Roadmap: DoppelDown

## Milestones

- ✅ **v1.0 Production-Ready Platform** - Phases 1-5 (shipped 2026-01-27)
- ✅ **v1.1 Features** - Phases 6-8 (shipped 2026-01-28)
- ✅ **v1.2 Polish for Launch** - Phases 9-10 (shipped 2026-01-28)
- 🚧 **v1.3 Delete Operations with Audit Logging** - Phases 11-13 (in progress)

## Phases

<details>
<summary>✅ v1.0 Production-Ready Platform (Phases 1-5) - SHIPPED 2026-01-27</summary>

Complete production system with AI threat analysis, subscription tiers, automated scanning, and email alerts.

### Phase 1: Foundation
**Goal**: Project infrastructure and authentication
**Plans**: 3 plans

Plans:
- [x] 01-01: Next.js + Supabase setup
- [x] 01-02: Authentication
- [x] 01-03: Subscription tiers

### Phase 2: Core Scanning
**Goal**: Domain variation generation and web scanning
**Plans**: 4 plans

Plans:
- [x] 02-01: Domain variation generator
- [x] 02-02: Web scanning via search API
- [x] 02-03: Social media scanning
- [x] 02-04: Evidence collection

### Phase 3: AI Analysis
**Goal**: AI-powered threat scoring and analysis
**Plans**: 3 plans

Plans:
- [x] 03-01: Visual similarity analysis
- [x] 03-02: Phishing intent detection
- [x] 03-03: Smart threat scoring

### Phase 4: Automation
**Goal**: Automated scanning and rate limiting
**Plans**: 3 plans

Plans:
- [x] 04-01: Rate-limited queues
- [x] 04-02: Automated background scanning
- [x] 04-03: Manual scan quotas

### Phase 5: Alerts
**Goal**: Email notification system
**Plans**: 3 plans

Plans:
- [x] 05-01: Alert severity configuration
- [x] 05-02: Scan completion emails
- [x] 05-03: Weekly digest emails

</details>

<details>
<summary>✅ v1.1 Features (Phases 6-8) - SHIPPED 2026-01-28</summary>

In-app notifications, social platform selection, and NRD monitoring.

### Phase 6: In-App Notifications
**Goal**: Real-time in-app notification system
**Plans**: 2 plans

Plans:
- [x] 06-01: Notification infrastructure
- [x] 06-02: Notification UI

### Phase 7: Social Platform Selection
**Goal**: Per-brand social platform configuration
**Plans**: 2 plans

Plans:
- [x] 07-01: Social platform model + API
- [x] 07-02: Social platform UI

### Phase 8: NRD Monitoring
**Goal**: Newly Registered Domain monitoring for Enterprise
**Plans**: 2 plans

Plans:
- [x] 08-01: NRD data pipeline
- [x] 08-02: NRD integration with scanning

</details>

<details>
<summary>✅ v1.2 Polish for Launch (Phases 9-10) - SHIPPED 2026-01-28</summary>

Branding, landing page, UI polish, semantic colors, dark mode, and scannable dashboard.

### Phase 9: Branding and Landing
**Goal**: Professional branding and conversion-optimized landing page
**Plans**: 6 plans

Plans:
- [x] 09-01: Text-based logo and favicon
- [x] 09-02: Landing page hero
- [x] 09-03: Features and pricing sections
- [x] 09-04: Footer and CTA optimization
- [x] 09-05: Semantic color system
- [x] 09-06: Dark mode with system preference

### Phase 10: Dashboard Polish
**Goal**: Scannable dashboard with progressive disclosure
**Plans**: 2 plans

Plans:
- [x] 10-01: F-pattern layout and progressive disclosure
- [x] 10-02: Dashboard cleanup

</details>

### 🚧 v1.3 Delete Operations with Audit Logging (In Progress)

**Milestone Goal:** Enable users to delete scans, threats, and reports with full accountability via audit logging.

#### Phase 11: Audit Logging Infrastructure
**Goal**: Accountability trail for all delete actions
**Depends on**: Phase 10
**Requirements**: AUDIT-01
**Success Criteria** (what must be TRUE):
  1. Delete actions logged with user, entity type, entity ID, and timestamp
  2. Audit log queryable by admin for compliance purposes
  3. Audit log persists independently of deleted entities
**Plans**: 1 plan

Plans:
- [x] 11-01-PLAN.md — Audit logging table, service function, and admin query endpoint

#### Phase 12: Delete Operations Backend
**Goal**: Users can delete scans, threats, and reports via API
**Depends on**: Phase 11
**Requirements**: DEL-01, DEL-02, DEL-03
**Success Criteria** (what must be TRUE):
  1. User can delete a scan (removes scan and associated threats/evidence from DB)
  2. User can delete a threat (removes threat record and evidence from DB)
  3. User can delete a report (removes report file and DB record)
  4. Deleted entities return 404 when accessed
  5. All deletes trigger audit log entries
**Plans**: 1 plan

Plans:
- [x] 12-01-PLAN.md — DELETE RLS policies and API endpoints for scans, threats, reports

#### Phase 13: Delete UI
**Goal**: Intuitive delete gestures available in dashboard
**Depends on**: Phase 12
**Requirements**: UI-01, UI-02
**Success Criteria** (what must be TRUE):
  1. Swipe-to-delete gesture works on scan, threat, and report list items
  2. 3-dots context menu shows delete option on list items
  3. Delete action executes immediately (no confirmation dialog)
  4. List updates instantly after delete
**Plans**: 3 plans

Plans:
- [x] 13-01-PLAN.md — Install react-swipeable, create SwipeableListItem component, add delete to threats page
- [x] 13-02-PLAN.md — Add swipe and menu delete to reports page
- [x] 13-03-PLAN.md — Add swipe and menu delete to brand detail page (scans + threats)

## Progress

**Execution Order:**
Phases execute in numeric order: 11 → 12 → 13

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 3/3 | Complete | 2026-01-27 |
| 2. Core Scanning | v1.0 | 4/4 | Complete | 2026-01-27 |
| 3. AI Analysis | v1.0 | 3/3 | Complete | 2026-01-27 |
| 4. Automation | v1.0 | 3/3 | Complete | 2026-01-27 |
| 5. Alerts | v1.0 | 3/3 | Complete | 2026-01-27 |
| 6. In-App Notifications | v1.1 | 2/2 | Complete | 2026-01-28 |
| 7. Social Platform Selection | v1.1 | 2/2 | Complete | 2026-01-28 |
| 8. NRD Monitoring | v1.1 | 2/2 | Complete | 2026-01-28 |
| 9. Branding and Landing | v1.2 | 6/6 | Complete | 2026-01-28 |
| 10. Dashboard Polish | v1.2 | 2/2 | Complete | 2026-01-28 |
| 11. Audit Logging | v1.3 | 1/1 | Complete | 2026-01-29 |
| 12. Delete Backend | v1.3 | 1/1 | Complete | 2026-01-29 |
| 13. Delete UI | v1.3 | 3/3 | Complete | 2026-01-29 |
