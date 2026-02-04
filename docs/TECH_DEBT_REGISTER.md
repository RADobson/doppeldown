# Technical Debt Register — DoppelDown

**Last Updated:** 2026-02-05  
**Strategy Reference:** `TECHNICAL_DEBT_STRATEGY.md`

---

## Active Items

### 🔴 Critical (Score ≥ 12)

| ID | Category | Description | File(s) | Impact | Blast | Cost | Score | Sprint |
|----|----------|-------------|---------|--------|-------|------|-------|--------|
| TD-001 | Security | SSRF vulnerability — evidence collector can hit private IPs/cloud metadata | `evidence-collector.ts` | 5 | 5 | 2 | 14 | S1 |
| TD-002 | Security | HTML injection in reports and emails — unsanitized threat URLs | `report-generator.ts`, `email.ts` | 5 | 4 | 4 | 14 | S1 |
| TD-003 | Security | Evidence signing lacks ownership check (IDOR) | `evidence/sign/route.ts` | 5 | 3 | 5 | 14 | S1 |
| TD-004 | Security | No rate limiting on any API endpoint | All `route.ts` | 5 | 5 | 3 | 13 | S3 |
| TD-005 | Reliability | OpenAI Vision uses wrong endpoint (`/responses` not `/chat/completions`) | `openai-analysis.ts` | 5 | 3 | 5 | 14 | S1 |
| TD-006 | Reliability | Silent error swallowing in 4+ critical paths | `openai-analysis.ts`, `logo-scanner.ts`, `evidence/sign/route.ts`, `brands/logo/route.ts` | 5 | 4 | 4 | 14 | S1 |
| TD-007 | Data | No threat deduplication across scans | `scan-runner.ts` | 4 | 4 | 4 | 12 | S2 |
| TD-008 | Data | DB queries without null/error checking | `scan-runner.ts`, `evidence-collector.ts` | 4 | 4 | 4 | 12 | S2 |
| TD-009 | Testing | Zero test coverage — no framework, no tests | Entire codebase | 5 | 5 | 1 | 14 | S1→ |

### 🟠 High (Score 8–11)

| ID | Category | Description | File(s) | Impact | Blast | Cost | Score | Sprint |
|----|----------|-------------|---------|--------|-------|------|-------|--------|
| TD-010 | Quality | `any` types in core API routes bypass type checking | `evidence/sign/route.ts`, `reports/route.ts`, `scan-runner.ts` | 3 | 3 | 4 | 10 | S2 |
| TD-011 | Architecture | `scan-runner.ts` is 969 lines — God object | `scan-runner.ts` | 4 | 4 | 1 | 9 | S3 |
| TD-012 | Operations | No structured logging or error tracking | Entire codebase | 4 | 5 | 2 | 11 | S3 |
| TD-013 | Operations | No CI/CD pipeline | Repo root | 3 | 5 | 4 | 10 | S1 |
| TD-014 | Performance | Dashboard polling every 4s without backoff | Dashboard pages | 3 | 3 | 4 | 10 | S3 |
| TD-015 | Reliability | Scan cancellation doesn't propagate reliably | `scan-runner.ts` | 3 | 2 | 3 | 9 | S4 |
| TD-016 | Reliability | Email SMTP config not validated on startup | `email.ts` | 3 | 2 | 5 | 10 | S3 |

### 🟡 Medium (Score 5–7)

| ID | Category | Description | File(s) | Impact | Blast | Cost | Score | Sprint |
|----|----------|-------------|---------|--------|-------|------|-------|--------|
| TD-017 | Quality | Sync HTML parsing with regex blocks event loop | `web-scanner.ts`, `social-scanner.ts` | 2 | 2 | 3 | 7 | Backlog |
| TD-018 | Quality | ErrorMessage component built but unused | `error-message.tsx` | 1 | 1 | 5 | 6 | S4 |
| TD-019 | UX | `alert()` for errors instead of toast | Multiple dashboard pages | 2 | 3 | 4 | 7 | S3 |
| TD-020 | UX | No undo after delete operations | Delete UI | 2 | 2 | 3 | 7 | Backlog |
| TD-021 | Architecture | No Supabase connection pooling | `supabase/server.ts` | 2 | 4 | 3 | 7 | Backlog |
| TD-022 | Operations | Debug logging leaks sensitive data in prod | `scan-runner.ts` | 3 | 2 | 5 | 7 | S4 |
| TD-023 | Reliability | Storage bucket not validated on startup | `evidence-collector.ts` | 2 | 2 | 5 | 7 | S3 |
| TD-024 | Performance | Sequential logo detection API calls | `logo-scanner.ts` | 2 | 1 | 3 | 6 | S4 |

### 🟢 Low (Score < 5)

| ID | Category | Description | File(s) | Impact | Blast | Cost | Score | Sprint |
|----|----------|-------------|---------|--------|-------|------|-------|--------|
| TD-025 | Quality | No JSDoc on exported functions | All `lib/` files | 1 | 3 | 3 | 5 | Ongoing |
| TD-026 | Quality | Inconsistent error response shapes across routes | API routes | 2 | 3 | 3 | 6 | S4 |
| TD-027 | Quality | No barrel exports for lib modules | `src/lib/` | 1 | 2 | 4 | 5 | Ongoing |
| TD-028 | Quality | Mixed relative/absolute imports | `scan-runner.ts` vs pages | 1 | 1 | 5 | 5 | Ongoing |

---

## Resolved Items

| ID | Description | Resolved | Resolution |
|----|-------------|----------|------------|
| — | No items resolved yet | — | — |

---

## Metrics History

| Date | Critical | High | Medium | Low | Test Coverage | Files > 400 LOC |
|------|----------|------|--------|-----|---------------|-----------------|
| 2026-02-05 | 9 | 7 | 8 | 4 | 0% | 3 |

---

## Scoring Formula

**Priority Score** = (Impact × 2) + Blast Radius + (6 − Remediation Cost)

- **Impact** (1–5): 1=cosmetic → 5=data loss/security/outage
- **Blast Radius** (1–5): 1=single component → 5=entire system
- **Remediation Cost** (1–5): 1=days → 5=< 1 hour

Higher score = fix sooner. Quick wins score higher.

---

*Review this register monthly. Update scores as the project evolves.*
