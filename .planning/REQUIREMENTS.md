# Requirements: DoppelDown

**Defined:** 2026-01-28
**Core Value:** Detect real threats, not noise — AI analysis distinguishes actually-dangerous impersonation sites from benign domain registrations.

## v1.3 Requirements

Requirements for Delete Operations with Audit Logging milestone.

### Delete Operations

- [x] **DEL-01**: User can delete a scan (removes scan and associated data from DB)
- [x] **DEL-02**: User can delete a threat (removes threat record from DB)
- [x] **DEL-03**: User can delete a report (removes report from DB)

### User Interface

- [x] **UI-01**: Swipe-to-delete gesture available on list items (scans, threats, reports)
- [x] **UI-02**: 3-dots context menu includes delete option on list items

### Audit Logging

- [x] **AUDIT-01**: All delete actions logged with user, entity type, entity ID, and timestamp

## Future Requirements

Deferred to later milestones.

### Integrations

- **INT-01**: Slack notification integration
- **INT-02**: Teams notification integration
- **INT-03**: SIEM export/webhooks

### Team Features

- **TEAM-01**: Team accounts / multi-user
- **TEAM-02**: API access for power users

### Other

- **OTHER-01**: White-labeling
- **OTHER-02**: Referral programs
- **OTHER-03**: Alert resolution workflow (resolve, dismiss, archive threats)
- **OTHER-04**: Mobile responsiveness
- **OTHER-05**: Onboarding flow improvements

## Out of Scope

Explicitly excluded from this milestone.

| Feature | Reason |
|---------|--------|
| Bulk delete | One item at a time is sufficient for v1.3 |
| Soft delete / undo | Hard delete with audit log provides accountability |
| Confirmation dialog | Instant delete per user request |
| Admin-only delete | All users can delete their own brand's data |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUDIT-01 | Phase 11 | Complete |
| DEL-01 | Phase 12 | Complete |
| DEL-02 | Phase 12 | Complete |
| DEL-03 | Phase 12 | Complete |
| UI-01 | Phase 13 | Complete |
| UI-02 | Phase 13 | Complete |

**Coverage:**
- v1.3 requirements: 6 total
- Mapped to phases: 6
- Unmapped: 0
- Coverage: 100% ✓

---
*Requirements defined: 2026-01-28*
*Last updated: 2026-01-29 after Phase 13 completion*
