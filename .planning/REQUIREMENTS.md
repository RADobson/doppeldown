# Requirements: DoppelDown

**Defined:** 2026-01-27
**Core Value:** Detect real threats, not noise — AI analysis distinguishes actually-dangerous impersonation sites from benign domain registrations.

## v1.2 Requirements

Requirements for v1.2 Polish for Launch milestone. Each maps to roadmap phases.

### Branding

- [x] **BRAND-01**: Text-based logo using "doppel_down" with clean typography
- [x] **BRAND-02**: Logo variation for dark mode (light text)
- [x] **BRAND-03**: Logo variation for light mode (dark text)
- [x] **BRAND-04**: Favicon (multiple sizes: 16x16, 32x32, 180x180)
- [x] **BRAND-05**: Social sharing images (OG image, Twitter card)

### Landing Page

- [x] **LAND-01**: Hero section with clear value proposition (passes 5-second test)
- [x] **LAND-02**: Concise copy throughout (no wall of text)
- [x] **LAND-03**: Single clear CTA above the fold
- [x] **LAND-04**: Trust signals section (logos, testimonials, or security badges)
- [x] **LAND-05**: Mobile responsive layout
- [x] **LAND-06**: Page load under 2 seconds
- [x] **LAND-07**: Signup form with 3 or fewer fields
- [x] **LAND-08**: Interactive threat scan preview / live demo section

### UI Polish

- [x] **UIPOL-01**: Consistent spacing using 8pt grid system
- [x] **UIPOL-02**: Consistent typography (1-2 fonts max)
- [x] **UIPOL-03**: Loading states for async operations
- [x] **UIPOL-04**: Empty states for lists with no data
- [x] **UIPOL-05**: Focus and hover states for accessibility
- [x] **UIPOL-06**: Clear, helpful error messages
- [x] **UIPOL-07**: Subtle micro-interactions and animations

### Dark Mode

- [x] **DARK-01**: Manual toggle in header/settings
- [x] **DARK-02**: Respects system preference on first visit
- [x] **DARK-03**: Proper dark palette (#121212 base, semantic colors)
- [x] **DARK-04**: WCAG contrast compliance (4.5:1 for text)
- [x] **DARK-05**: User preference persists across sessions
- [x] **DARK-06**: Smooth transition animation between modes

### Dashboard

- [ ] **DASH-01**: Clear information hierarchy
- [ ] **DASH-02**: Reduced visual clutter
- [ ] **DASH-03**: Scannable at a glance
- [ ] **DASH-04**: Progressive disclosure (details on demand)

## Future Requirements

Deferred to future milestones. Tracked but not in current roadmap.

### Integrations

- **INTG-01**: Slack notifications for threats
- **INTG-02**: Microsoft Teams notifications
- **INTG-03**: SIEM export (JSON/CSV)
- **INTG-04**: Webhook support for alerts
- **INTG-05**: Public API for power users

### Team Features

- **TEAM-01**: Team accounts with multiple users
- **TEAM-02**: Role-based permissions
- **TEAM-03**: White-labeling for agencies
- **TEAM-04**: Referral program

### Alert Management

- **ALRT-01**: Resolve/dismiss threats from dashboard
- **ALRT-02**: Archive resolved threats
- **ALRT-03**: Bulk actions on threats

### UX Improvements

- **UX-01**: Mobile responsive app (beyond landing page)
- **UX-02**: Onboarding flow for new users
- **UX-03**: In-app help/tooltips

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Mobile app | Web-first, defer to later |
| OAuth login | Email/password sufficient |
| Real-time chat support | Not needed for launch |
| Multi-language | English only for launch |
| Full redesign of existing features | Polish only, no feature changes |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| BRAND-01 | Phase 6 | Complete |
| BRAND-02 | Phase 6 | Complete |
| BRAND-03 | Phase 6 | Complete |
| BRAND-04 | Phase 6 | Complete |
| BRAND-05 | Phase 6 | Complete |
| LAND-01 | Phase 6 | Complete |
| LAND-02 | Phase 6 | Complete |
| LAND-03 | Phase 6 | Complete |
| LAND-04 | Phase 6 | Complete |
| LAND-05 | Phase 6 | Complete |
| LAND-06 | Phase 6 | Complete |
| LAND-07 | Phase 6 | Complete |
| LAND-08 | Phase 6 | Complete |
| UIPOL-01 | Phase 7 | Complete |
| UIPOL-02 | Phase 7 | Complete |
| UIPOL-03 | Phase 7 | Complete |
| UIPOL-04 | Phase 7 | Complete |
| UIPOL-05 | Phase 7 | Complete |
| UIPOL-06 | Phase 7 | Complete |
| UIPOL-07 | Phase 7 | Complete |
| DARK-01 | Phase 9 | Complete |
| DARK-02 | Phase 9 | Complete |
| DARK-03 | Phase 9 | Complete |
| DARK-04 | Phase 9 | Complete |
| DARK-05 | Phase 9 | Complete |
| DARK-06 | Phase 9 | Complete |
| DASH-01 | Phase 10 | Pending |
| DASH-02 | Phase 10 | Pending |
| DASH-03 | Phase 10 | Pending |
| DASH-04 | Phase 10 | Pending |

**Coverage:**
- v1.2 requirements: 24 total
- Mapped to phases: 24 (100%)
- Unmapped: 0

**Note:** Phase 8 (Semantic Colors Refactor) has no explicit requirements but is architectural prerequisite for Phase 9 (Dark Mode). Research identified this as critical work to prevent refactoring dark mode twice.

---
*Requirements defined: 2026-01-27*
*Last updated: 2026-01-27 after roadmap creation*
