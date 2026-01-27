# Roadmap: DoppelDown

## Milestones

- ✅ **v1.0 Production-Ready Platform** - Phases 1-5 (shipped 2026-01-27)
- ✅ **v1.1 Features** - Quick feature add (shipped 2026-01-28)
- 🚧 **v1.2 Polish for Launch** - Phases 6-10 (in progress)

## Phases

<details>
<summary>✅ v1.0 Production-Ready Platform (Phases 1-5) - SHIPPED 2026-01-27</summary>

### Phase 1: Project Setup & Configuration
**Goal**: Development environment configured with core infrastructure
**Plans**: 3 plans

Plans:
- [x] 01-01: Project scaffolding and configuration
- [x] 01-02: Database schema and Supabase setup
- [x] 01-03: Authentication and basic UI structure

### Phase 2: Brand & Threat Management
**Goal**: Users can register brands and trigger manual scans
**Plans**: 3 plans

Plans:
- [x] 02-01: Brand CRUD with tier limits
- [x] 02-02: Domain variation generation engine
- [x] 02-03: Manual scan orchestration

### Phase 3: Scanning & Evidence Collection
**Goal**: System collects comprehensive threat evidence
**Plans**: 3 plans

Plans:
- [x] 03-01: Web search API integration
- [x] 03-02: Social media scanning
- [x] 03-03: Evidence capture (screenshots, WHOIS, HTML)

### Phase 4: AI Analysis & Threat Scoring
**Goal**: AI evaluates threats and produces actionable scores
**Plans**: 2 plans

Plans:
- [x] 04-01: Visual similarity analysis (GPT-4o-mini vision)
- [x] 04-02: Phishing intent detection and composite scoring

### Phase 5: Alert System & Reliability
**Goal**: Users receive timely, configurable alerts for threats
**Plans**: 3 plans

Plans:
- [x] 05-01: Email alert infrastructure
- [x] 05-02: Scan completion and weekly digest emails
- [x] 05-03: Alert settings with severity thresholds

</details>

<details>
<summary>✅ v1.1 Features - SHIPPED 2026-01-28</summary>

Quick feature additions:
- In-app notifications (threat detected, scan completed, scan failed)
- Social platform selection per brand (tier-based limits)
- NRD (Newly Registered Domains) monitoring for Enterprise tier

</details>

### 🚧 v1.2 Polish for Launch (In Progress)

**Milestone Goal:** Professional, launch-ready product with distinctive branding, conversion-optimized landing page, polished UI, and dark mode support.

#### Phase 6: Branding & Landing Page ✓
**Goal**: Conversion-optimized landing page with distinctive brand identity
**Depends on**: Nothing (independent work)
**Requirements**: BRAND-01, BRAND-02, BRAND-03, BRAND-04, BRAND-05, LAND-01, LAND-02, LAND-03, LAND-04, LAND-05, LAND-06, LAND-07, LAND-08
**Success Criteria** (what must be TRUE):
  1. Text-based "doppel_down" logo displays correctly in light and dark variations across all pages
  2. Landing page communicates core value proposition within 5 seconds (passes readability test)
  3. User can sign up from landing page using 3-or-fewer-field form
  4. Landing page loads in under 2 seconds on standard connection
  5. Landing page displays correctly on mobile devices (responsive layout)
**Plans**: 4 plans
**Completed**: 2026-01-27

Plans:
- [x] 06-01-PLAN.md — Logo component + favicon suite + OG images
- [x] 06-02-PLAN.md — Landing page component extraction + trust signals
- [x] 06-03-PLAN.md — Interactive threat scan demo
- [x] 06-04-PLAN.md — Visual verification checkpoint

#### Phase 7: UI Polish ✓
**Goal**: Consistent, professional design system applied across application
**Depends on**: Phase 6 (branding assets available)
**Requirements**: UIPOL-01, UIPOL-02, UIPOL-03, UIPOL-04, UIPOL-05, UIPOL-06, UIPOL-07
**Success Criteria** (what must be TRUE):
  1. All spacing follows 8pt grid system (8, 16, 24, 32, 40px increments)
  2. Typography uses consistent font families (1-2 fonts maximum)
  3. User sees loading indicators during async operations (no unclear waiting states)
  4. User sees helpful empty states when lists have no data
  5. User can navigate via keyboard with visible focus states
**Plans**: 3 plans
**Completed**: 2026-01-27

Plans:
- [x] 07-01-PLAN.md — Foundation components (EmptyState, Skeleton, focus-visible)
- [x] 07-02-PLAN.md — Dashboard loading states + empty state integration
- [x] 07-03-PLAN.md — Visual verification checkpoint

#### Phase 8: Semantic Colors Refactor
**Goal**: Color system refactored to semantic tokens enabling theme support
**Depends on**: Phase 7 (UI polish identifies all components)
**Requirements**: None (architectural prerequisite for Phase 9)
**Success Criteria** (what must be TRUE):
  1. All hardcoded color values (hex, rgb) replaced with CSS variables
  2. All UI components use semantic color tokens (bg-card not bg-white, text-foreground not text-gray-900)
  3. No visual regressions in light mode after refactor (pixel-perfect match)
  4. Codebase grep for "bg-white", "text-gray-", "bg-gray-" returns zero results in components
**Plans**: TBD

Plans:
- [ ] 08-01: TBD
- [ ] 08-02: TBD

#### Phase 9: Dark Mode Implementation
**Goal**: Fully functional dark mode with system preference support
**Depends on**: Phase 8 (semantic colors ready)
**Requirements**: DARK-01, DARK-02, DARK-03, DARK-04, DARK-05, DARK-06
**Success Criteria** (what must be TRUE):
  1. User can toggle between light and dark modes via header/settings control
  2. Dark mode respects system preference on first visit (auto-detects OS setting)
  3. User's theme preference persists across browser sessions
  4. All text in dark mode meets WCAG AA contrast ratio (4.5:1 minimum)
  5. Theme transitions smoothly without flicker on page load or toggle
**Plans**: TBD

Plans:
- [ ] 09-01: TBD
- [ ] 09-02: TBD

#### Phase 10: Dashboard Cleanup
**Goal**: Dashboard optimized for scannability and reduced cognitive load
**Depends on**: Phase 9 (dark mode complete, both themes available for testing)
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04
**Success Criteria** (what must be TRUE):
  1. User can identify most critical information (brand status, threat count) within 3 seconds
  2. Dashboard displays only essential information by default (advanced features hidden)
  3. User can access advanced features via progressive disclosure (expand/reveal patterns)
  4. Dashboard works effectively in both light and dark themes
**Plans**: TBD

Plans:
- [ ] 10-01: TBD
- [ ] 10-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 6 → 7 → 8 → 9 → 10

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Project Setup | v1.0 | 3/3 | Complete | 2026-01-27 |
| 2. Brand & Threat | v1.0 | 3/3 | Complete | 2026-01-27 |
| 3. Scanning & Evidence | v1.0 | 3/3 | Complete | 2026-01-27 |
| 4. AI Analysis | v1.0 | 2/2 | Complete | 2026-01-27 |
| 5. Alert System | v1.0 | 3/3 | Complete | 2026-01-27 |
| 6. Branding & Landing Page | v1.2 | 4/4 | Complete | 2026-01-27 |
| 7. UI Polish | v1.2 | 3/3 | Complete | 2026-01-27 |
| 8. Semantic Colors Refactor | v1.2 | 0/2 | Not started | - |
| 9. Dark Mode | v1.2 | 0/2 | Not started | - |
| 10. Dashboard Cleanup | v1.2 | 0/2 | Not started | - |
