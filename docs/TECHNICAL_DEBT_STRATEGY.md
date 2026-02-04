# DoppelDown — Technical Debt Management & Code Quality Strategy

**Date:** February 5, 2026  
**Version:** 1.0  
**Applies to:** DoppelDown v1.3+ (current ~8,065 LOC backend + frontend)  
**Author:** OpenClaw Engineering Subagent

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technical Debt Inventory](#2-technical-debt-inventory)
3. [Debt Classification Framework](#3-debt-classification-framework)
4. [Prioritized Remediation Roadmap](#4-prioritized-remediation-roadmap)
5. [Code Review Process](#5-code-review-process)
6. [Testing Strategy](#6-testing-strategy)
7. [Refactoring Playbook](#7-refactoring-playbook)
8. [Quality Gates & Metrics](#8-quality-gates--metrics)
9. [Continuous Improvement Process](#9-continuous-improvement-process)
10. [Tooling & Automation](#10-tooling--automation)
11. [Appendices](#11-appendices)

---

## 1. Executive Summary

### Current State

DoppelDown is a brand protection SaaS that shipped from v1.0 to v1.3 in three days (Jan 27–29, 2026). This rapid velocity is both an achievement and a source of accumulated technical debt. The codebase has:

- **~8,065 lines** across 29 backend/library files (not counting components, pages, types)
- **Zero test coverage** — no test framework installed, no test files exist
- **Zero CI/CD pipeline** — no automated builds, lints, or deployments
- **17 known security issues** (8 critical, from compliance audit)
- **Multiple silent-failure patterns** that degrade data quality without user awareness
- **No structured logging, monitoring, or error tracking**
- **Large monolithic files** — `scan-runner.ts` alone is 969 lines

### Why This Matters

Richard's goal is a revenue-generating business, not a pristine codebase. But every one of these issues maps to a business risk:

| Technical Issue | Business Impact |
|----------------|-----------------|
| Zero tests | Features break silently; every change is risky |
| Silent error swallowing | Customers' scans fail without anyone knowing |
| No monitoring | Can't tell if the product is working in production |
| Security vulnerabilities | Enterprise customers won't buy; legal liability |
| Large coupled files | New features take longer; bugs are harder to find |
| No CI/CD | Manual deploys are slow and error-prone |

### Strategy Philosophy

**Ship fast, fix smart.** This strategy doesn't advocate stopping feature development to "pay off debt." Instead, it integrates quality improvements into the normal development flow using three principles:

1. **Boy Scout Rule** — Leave code cleaner than you found it. Every PR touches debt.
2. **Testing as insurance** — Write tests for the code that would hurt most if it broke.
3. **Incremental improvement** — Small, continuous upgrades beat big-bang rewrites.

### Investment Ratio

Target a **70/20/10 split** of development effort:

| Allocation | Focus |
|-----------|-------|
| **70%** | New features and customer-facing work |
| **20%** | Technical debt reduction (testing, refactoring, tooling) |
| **10%** | Infrastructure improvements (CI/CD, monitoring, security) |

This ratio should shift to **60/25/15** when preparing for enterprise sales, and **50/30/20** during any compliance certification effort.

---

## 2. Technical Debt Inventory

### 2.1 Critical Debt Items

These create active risk — data loss, security exposure, or customer-facing failures.

| ID | Category | Description | File(s) | Business Risk |
|----|----------|-------------|---------|---------------|
| **TD-001** | Security | SSRF vulnerability in evidence collector — can access cloud metadata | `evidence-collector.ts` | Data breach; cloud account compromise |
| **TD-002** | Security | HTML injection in report generation and emails | `report-generator.ts`, `email.ts` | XSS in PDF viewers; phishing via own reports |
| **TD-003** | Security | Unauthenticated evidence signing — missing ownership check | `evidence/sign/route.ts` | Cross-user data access (IDOR) |
| **TD-004** | Security | No rate limiting on any API endpoint | All `route.ts` files | DoS; cost escalation via API abuse |
| **TD-005** | Reliability | OpenAI Vision endpoint uses `/responses` instead of `/chat/completions` | `openai-analysis.ts` | Core feature (AI analysis) non-functional |
| **TD-006** | Reliability | Silent error swallowing in 4+ critical paths | `openai-analysis.ts`, `logo-scanner.ts`, `evidence/sign/route.ts`, `brands/logo/route.ts` | Scans succeed but produce garbage data |
| **TD-007** | Data | No threat deduplication across scans | `scan-runner.ts` | Inflated threat counts; duplicate alerts; customer confusion |
| **TD-008** | Data | Database queries without null/error checking | `scan-runner.ts`, `evidence-collector.ts` | Silent data corruption; undefined behavior |

### 2.2 High Debt Items

These slow development velocity or degrade user experience.

| ID | Category | Description | File(s) | Business Risk |
|----|----------|-------------|---------|---------------|
| **TD-009** | Testing | Zero test coverage — no framework, no tests | Entire codebase | Every change risks breaking production |
| **TD-010** | Quality | Weak type safety — `any` used in core API routes | `evidence/sign/route.ts`, `reports/route.ts`, `scan-runner.ts` | Runtime type errors; debugging difficulty |
| **TD-011** | Architecture | `scan-runner.ts` is 969 lines — God object | `scan-runner.ts` | Hard to modify; bugs hide; no unit testability |
| **TD-012** | Operations | No structured logging or error tracking | Entire codebase | Can't diagnose production issues |
| **TD-013** | Operations | No CI/CD pipeline | Repo root | Manual deploys; no build verification |
| **TD-014** | Performance | Dashboard polling every 4s without backoff | `brands/[id]/page.tsx`, `dashboard/page.tsx` | Unnecessary server load; poor scaling |
| **TD-015** | Reliability | Scan cancellation doesn't propagate reliably | `scan-runner.ts` | Stuck scans consuming resources |
| **TD-016** | Reliability | Email SMTP config not validated on startup | `email.ts` | Critical alerts silently never sent |

### 2.3 Medium Debt Items

These are quality-of-life issues that should be addressed opportunistically.

| ID | Category | Description | File(s) | Impact |
|----|----------|-------------|---------|--------|
| **TD-017** | Code Quality | Synchronous HTML parsing with regex in scanners | `web-scanner.ts`, `social-scanner.ts` | Event loop blocking on large responses |
| **TD-018** | Code Quality | ErrorMessage component built but unused | `error-message.tsx` | Dead code; confusing for maintainers |
| **TD-019** | UX | `alert()` used for error feedback instead of toast | Multiple dashboard pages | Jarring UX; blocks thread |
| **TD-020** | UX | No undo after delete operations | Delete UI | Accidental data loss risk |
| **TD-021** | Architecture | No connection pooling for Supabase clients | `supabase/server.ts` | Connection exhaustion under load |
| **TD-022** | Operations | Debug logging leaks sensitive data in production | `scan-runner.ts` | Info disclosure if debug env vars set |
| **TD-023** | Reliability | Evidence storage bucket not validated on startup | `evidence-collector.ts` | Upload failures with cryptic errors |
| **TD-024** | Performance | Sequential logo detection API calls | `logo-scanner.ts` | Slow scans; unreliable fallback |

### 2.4 Low Debt Items

Address when convenient; no active risk.

| ID | Category | Description | File(s) | Impact |
|----|----------|-------------|---------|--------|
| **TD-025** | Code Quality | No JSDoc on exported functions | All `lib/` files | Reduced IDE assistance; onboarding friction |
| **TD-026** | Code Quality | Inconsistent error response shapes | API routes | Client-side error handling harder |
| **TD-027** | Code Quality | No barrel exports for lib modules | `src/lib/` | Verbose imports; more refactor churn |
| **TD-028** | Code Quality | Mixed relative/absolute imports in lib files | `scan-runner.ts` uses `./`, pages use `@/` | Inconsistent; breaks if files move |

---

## 3. Debt Classification Framework

Use this framework to classify new technical debt as it's discovered.

### 3.1 The Debt Quadrant

Adapted from Martin Fowler's Technical Debt Quadrant:

```
                 Deliberate                    Inadvertent
            ┌─────────────────────┬──────────────────────┐
            │                     │                      │
  Reckless  │  "We know this is   │  "What's dependency  │
            │   a hack, ship it"  │   injection?"         │
            │                     │                      │
            ├─────────────────────┼──────────────────────┤
            │                     │                      │
  Prudent   │  "Ship now, fix     │  "Now we know how    │
            │   in Sprint N+1"    │   we should've done   │
            │                     │   it"                 │
            └─────────────────────┴──────────────────────┘
```

**Most of DoppelDown's debt is Prudent/Deliberate** — conscious tradeoffs made to ship fast. This is the healthiest kind, because it's known and tractable.

### 3.2 Severity Scoring

Score each debt item on three dimensions (1–5 scale):

| Dimension | 1 (Low) | 3 (Medium) | 5 (High) |
|-----------|---------|------------|----------|
| **Impact** | Cosmetic issue | Degrades UX or dev velocity | Data loss, security, or outage |
| **Blast Radius** | Single component | Multiple features | Entire system |
| **Remediation Cost** | < 1 hour | 1–4 hours | 1+ days |

**Priority Score** = (Impact × 2) + Blast Radius + (6 - Remediation Cost)

Higher score = fix sooner. The formula weights impact highest and favors quick wins (low remediation cost gets a bonus).

### 3.3 Tracking Process

1. **Discovery** — When debt is found, add an entry to `TECH_DEBT_REGISTER.md` (see Appendix A)
2. **Classification** — Score using the framework above
3. **Scheduling** — Items scoring ≥12 go into the next sprint; 8–11 into backlog; <8 into icebox
4. **Resolution** — When fixed, move to "Resolved" section with date and PR reference
5. **Review** — Monthly review of the register to re-prioritize based on changing needs

---

## 4. Prioritized Remediation Roadmap

### Sprint 1: Foundation (Week 1–2)

**Theme:** "Stop the bleeding" — fix active risks and set up quality infrastructure.

| Task | Debt IDs | Effort | Outcome |
|------|----------|--------|---------|
| Install Vitest + write first tests for `utils.ts` and `domain-generator.ts` | TD-009 | 4h | Test framework operational; pure functions covered |
| Fix OpenAI Vision endpoint (`/responses` → `/chat/completions`) | TD-005 | 1h | AI analysis actually works |
| Add input sanitization to `report-generator.ts` (HTML escape) | TD-002 | 2h | No XSS in generated reports |
| Add SSRF protection to `evidence-collector.ts` (block private IPs) | TD-001 | 2h | Can't access cloud metadata via scans |
| Add ownership check to evidence signing endpoint | TD-003 | 1h | No cross-user data access |
| Replace silent `.catch()` blocks with logging + graceful fallbacks | TD-006 | 3h | Failures are visible; debugging possible |
| Set up GitHub Actions CI: lint + type-check + test | TD-013 | 3h | Every push is validated |

**Total effort:** ~16 hours

### Sprint 2: Testing Core (Week 3–4)

**Theme:** Test the code that matters most — scanning pipeline and API routes.

| Task | Debt IDs | Effort | Outcome |
|------|----------|--------|---------|
| Write unit tests for `threat-analysis.ts` (scoring logic) | TD-009 | 3h | Threat scoring verified |
| Write unit tests for `evidence-collector.ts` (with mocked Puppeteer) | TD-009 | 4h | Evidence flow tested |
| Write integration tests for Brand CRUD API routes | TD-009 | 4h | API contracts verified |
| Write integration tests for Scan API routes | TD-009 | 4h | Scan lifecycle tested |
| Add error checks to database queries in `scan-runner.ts` | TD-008 | 2h | No undefined data processing |
| Replace `any` types with explicit interfaces in API routes | TD-010 | 3h | Type safety in critical paths |
| Add threat deduplication (upsert on domain+brand+type) | TD-007 | 3h | No duplicate threats |

**Total effort:** ~23 hours

### Sprint 3: Architecture Improvement (Week 5–6)

**Theme:** Break apart the monolith; add operational visibility.

| Task | Debt IDs | Effort | Outcome |
|------|----------|--------|---------|
| Decompose `scan-runner.ts` into focused modules | TD-011 | 6h | Testable, maintainable scanning |
| Add structured logging (pino or winston) | TD-012 | 4h | Production debugging possible |
| Implement per-user rate limiting on API routes | TD-004 | 4h | DoS protection; abuse prevention |
| Add exponential backoff to dashboard polling | TD-014 | 2h | Reduced server load |
| Validate SMTP config on startup; log warning if missing | TD-016 | 1h | No silent email failures |
| Add startup validation for storage buckets | TD-023 | 1h | Clear error on misconfiguration |
| Replace `alert()` with toast notification component | TD-019 | 3h | Professional error UX |

**Total effort:** ~21 hours

### Sprint 4: Hardening (Week 7–8)

**Theme:** Production readiness — monitoring, error tracking, and resilience.

| Task | Debt IDs | Effort | Outcome |
|------|----------|--------|---------|
| Integrate Sentry for error tracking | TD-012 | 3h | Automatic error reporting |
| Fix scan cancellation propagation (AbortController) | TD-015 | 4h | Reliable scan cancellation |
| Gate debug logging behind NODE_ENV check | TD-022 | 1h | No info leaks in production |
| Remove unused ErrorMessage component (or integrate it) | TD-018 | 0.5h | Clean codebase |
| Implement parallel logo detection with timeout racing | TD-024 | 3h | Faster, more reliable scans |
| Add E2E tests for auth flow and brand creation | TD-009 | 6h | Critical user paths verified |
| Standardize API error response shape | TD-026 | 2h | Consistent client error handling |

**Total effort:** ~19.5 hours

### Ongoing (Post-Sprint 4)

| Task | Debt IDs | Cadence |
|------|----------|---------|
| Add tests for every new feature before merge | TD-009 | Every PR |
| Monthly tech debt register review | All | Monthly |
| Dependency updates and audit | — | Monthly |
| Add JSDoc to exported functions when touching files | TD-025 | Opportunistic |
| Normalize import style when touching files | TD-028 | Opportunistic |

---

## 5. Code Review Process

### 5.1 Review Principles

DoppelDown is currently a solo/AI-assisted project. Code review doesn't mean "wait for a human reviewer." It means **structured self-review and AI-assisted review** before merge.

#### The Three-Pass Review

Every change goes through three passes before merge:

**Pass 1: Functional Correctness (Author)**
- Does it do what it's supposed to?
- Are edge cases handled?
- Are error paths covered?

**Pass 2: Quality Check (Automated)**
- TypeScript type-check passes (`tsc --noEmit`)
- ESLint passes with no warnings
- All tests pass
- No new `any` types introduced
- No new `console.log` (use structured logger)

**Pass 3: Architecture Review (AI-Assisted or Self)**
- Does this change increase coupling?
- Is this the simplest solution?
- Are new abstractions earning their complexity?
- Is there test coverage for the new/changed code?

### 5.2 Pre-Merge Checklist

```markdown
## Pre-Merge Checklist

### Required
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no warnings
- [ ] All existing tests pass
- [ ] New/changed logic has test coverage
- [ ] No `any` types introduced (use explicit interfaces)
- [ ] No silent `.catch()` blocks (log errors, return meaningful fallbacks)
- [ ] API routes validate input and check auth
- [ ] Error responses use standard shape: `{ error: string, code?: string }`

### Recommended
- [ ] Functions < 50 lines (extract if longer)
- [ ] Files < 300 lines (decompose if longer)
- [ ] New dependencies justified (check bundle size, maintenance status)
- [ ] Database queries check for errors before accessing `.data`
- [ ] Sensitive data not logged (no API keys, user emails, passwords)

### For UI Changes
- [ ] Loading states handled
- [ ] Error states handled (toast, not alert())
- [ ] Empty states handled
- [ ] Keyboard accessible (can tab through, enter submits)
- [ ] Dark mode verified
```

### 5.3 Commit Message Convention

Adopt Conventional Commits for clear history:

```
<type>(<scope>): <description>

[optional body]

[optional footer - e.g., BREAKING CHANGE:, Fixes: TD-007]
```

**Types:**
- `feat` — New feature
- `fix` — Bug fix
- `refactor` — Code restructuring (no behavior change)
- `test` — Adding/fixing tests
- `debt` — Technical debt reduction
- `security` — Security improvement
- `docs` — Documentation
- `ci` — CI/CD changes
- `perf` — Performance improvement

**Examples:**
```
feat(scan): add threat deduplication on domain+brand+type
fix(openai): use /chat/completions endpoint for vision analysis
debt(scan-runner): extract domain-checking into separate module
test(api): add integration tests for brand CRUD routes
security(evidence): add ownership check to evidence signing
```

### 5.4 File Size Guidelines

| Threshold | Action |
|-----------|--------|
| < 200 lines | ✅ Good — maintainable |
| 200–400 lines | ⚠️ Consider splitting if logic is distinct |
| 400+ lines | 🔴 Must decompose — too much in one file |

**Current violations:**
- `scan-runner.ts` — 969 lines 🔴
- `social-scanner.ts` — 686 lines 🔴
- `domain-generator.ts` — 570 lines 🔴
- `web-scanner.ts` — 368 lines ⚠️
- `brands/route.ts` — 325 lines ⚠️
- `evidence-collector.ts` — 311 lines ⚠️
- `threat-analysis.ts` — 299 lines ⚠️
- `report-generator.ts` — 296 lines ⚠️

---

## 6. Testing Strategy

### 6.1 Testing Pyramid

```
        ┌───────────┐
        │   E2E     │  ← Few: critical user journeys (5-10 tests)
        │  Tests    │
       ─┼───────────┼─
        │Integration│  ← Some: API routes, DB interactions (30-50 tests)
        │  Tests    │
       ─┼───────────┼─
        │   Unit    │  ← Many: pure functions, business logic (100+ tests)
        │  Tests    │
        └───────────┘
```

### 6.2 Framework Setup

**Recommended Stack:**

```bash
# Core test framework
npm install -D vitest @vitest/ui @vitest/coverage-v8

# React component testing
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# E2E testing
npm install -D @playwright/test

# API testing utilities
npm install -D msw  # Mock Service Worker for API mocking
```

**Configuration:**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/types/',
      ],
      thresholds: {
        // Start low, ratchet up over time
        statements: 20,
        branches: 15,
        functions: 20,
        lines: 20,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 6.3 Unit Testing Plan

**Priority 1 — Pure Functions (Week 1)**

These are the easiest to test and provide immediate confidence:

| Module | Functions to Test | Est. Tests |
|--------|-------------------|------------|
| `utils.ts` | `formatDate`, `formatDateTime`, `truncateUrl`, `extractDomain`, `severityColor`, `statusColor`, `threatTypeLabel` | 15–20 |
| `domain-generator.ts` | `splitDomainAndTld`, `generateDomainVariations`, homoglyph/typo generation | 25–30 |
| `tier-limits.ts` | All tier limit constants and helper functions | 10–15 |
| `audit-logger.ts` | `logAuditEvent` (with mocked Supabase) | 5–8 |

**Priority 2 — Business Logic (Week 2–3)**

Core scanning and analysis logic:

| Module | Functions to Test | Est. Tests | Mocking Required |
|--------|-------------------|------------|------------------|
| `threat-analysis.ts` | `analyzeThreat`, `calculateCompositeScore`, individual scoring functions | 15–20 | Minimal |
| `scan-runner.ts` | `runScanForBrand`, progress updates, cancellation, phase orchestration | 20–30 | Supabase, fetch |
| `evidence-collector.ts` | Screenshot capture, WHOIS lookup, HTML archival, storage upload | 15–20 | Puppeteer, Supabase |
| `openai-analysis.ts` | Vision analysis, intent detection, response parsing | 10–15 | fetch (OpenAI API) |
| `web-scanner.ts` | Search result parsing, threat detection from web results | 10–15 | fetch |
| `social-scanner.ts` | Platform-specific parsing, account matching logic | 10–15 | fetch |

**Priority 3 — Utility Modules (Week 3–4)**

| Module | Functions to Test | Est. Tests |
|--------|-------------------|------------|
| `email.ts` | Email composition, SMTP validation | 8–10 |
| `webhooks.ts` | Webhook delivery, retry logic | 5–8 |
| `report-generator.ts` | Report HTML generation, data formatting | 10–12 |
| `logo-scanner.ts` | Image search, fallback handling | 8–10 |
| `notifications.ts` | Notification creation and formatting | 5–8 |

### 6.4 Integration Testing Plan

Test API routes with mocked database and external services:

**Critical Path Tests:**

```typescript
// Example: Brand CRUD integration test
describe('POST /api/brands', () => {
  it('creates brand for authenticated user within tier limits', async () => {
    // Mock authenticated user
    // Mock Supabase insert
    // Assert 201 with brand data
  })
  
  it('rejects unauthenticated request with 401', async () => { })
  it('rejects when brand limit reached with 403', async () => { })
  it('validates required fields (name, domain)', async () => { })
  it('sanitizes keywords and social handles', async () => { })
})

describe('POST /api/scan', () => {
  it('creates scan job for valid brand', async () => { })
  it('enforces scan quota for free tier', async () => { })
  it('validates scan type against whitelist', async () => { })
  it('rejects scan for non-owned brand', async () => { })
})

describe('POST /api/stripe/webhook', () => {
  it('handles checkout.session.completed', async () => { })
  it('handles subscription.updated', async () => { })
  it('handles subscription.deleted', async () => { })
  it('rejects invalid webhook signature', async () => { })
  it('ignores unhandled event types', async () => { })
})
```

**Database Interaction Tests:**

```typescript
describe('Scan Pipeline', () => {
  it('creates threats without duplicates on re-scan', async () => { })
  it('updates brand threat count after scan completion', async () => { })
  it('marks scan as failed when scan-runner throws', async () => { })
  it('audit logs delete operations', async () => { })
})
```

### 6.5 E2E Testing Plan

Use Playwright for critical user journeys:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
  },
})
```

**Critical User Journeys (5–10 tests):**

1. **Sign Up → Dashboard** — New user can register and see empty dashboard
2. **Add Brand** — User can create a brand with domain and keywords
3. **Run Scan** — User can trigger scan and see progress
4. **View Threats** — Threats appear after scan completes
5. **Generate Report** — User can select threats and generate PDF
6. **Delete Operations** — User can delete scans/threats/reports
7. **Subscription Flow** — User can view pricing and initiate checkout
8. **Auth Edge Cases** — Login, logout, password reset flow

### 6.6 Coverage Targets (Ratcheting)

Start with achievable targets and increase quarterly:

| Quarter | Statement | Branch | Function | Line |
|---------|-----------|--------|----------|------|
| Q1 2026 (now) | 20% | 15% | 20% | 20% |
| Q2 2026 | 40% | 30% | 40% | 40% |
| Q3 2026 | 60% | 50% | 60% | 60% |
| Q4 2026 | 75% | 65% | 75% | 75% |

**Ratcheting rule:** Coverage can never decrease. CI fails if coverage drops below the current threshold.

### 6.7 Test Data Management

```typescript
// src/test/factories.ts — Test data factories
export function createMockBrand(overrides?: Partial<Brand>): Brand {
  return {
    id: crypto.randomUUID(),
    user_id: crypto.randomUUID(),
    name: 'Test Brand',
    domain: 'testbrand.com',
    keywords: ['test', 'brand'],
    social_handles: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    threat_count: 0,
    ...overrides,
  }
}

export function createMockThreat(overrides?: Partial<Threat>): Threat {
  return {
    id: crypto.randomUUID(),
    brand_id: crypto.randomUUID(),
    domain: 'testbr4nd.com',
    type: 'typosquat',
    severity: 'high',
    status: 'new',
    score: 85,
    evidence: {},
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: crypto.randomUUID(),
    email: 'test@example.com',
    subscription_tier: 'starter',
    subscription_status: 'active',
    is_admin: false,
    created_at: new Date().toISOString(),
    ...overrides,
  }
}
```

---

## 7. Refactoring Playbook

### 7.1 scan-runner.ts Decomposition (TD-011)

**Current state:** 969 lines, single file orchestrating the entire scan pipeline.

**Target state:** 5 focused modules, each < 200 lines:

```
src/lib/scanning/
├── index.ts              # Re-exports for backward compatibility
├── scan-orchestrator.ts  # Main orchestration (runScanForBrand)  ~150 lines
├── domain-checker.ts     # Domain registration checking          ~150 lines  
├── scan-progress.ts      # Progress tracking and cancellation    ~80 lines
├── scan-config.ts        # Configuration and constants           ~60 lines
└── threat-processor.ts   # Threat creation, deduplication        ~120 lines
```

**Migration approach:**
1. Create `src/lib/scanning/` directory
2. Extract `SCAN_CONFIG` and constants → `scan-config.ts`
3. Extract `updateProgress()` and `ensureNotCancelled()` → `scan-progress.ts`
4. Extract domain checking loop → `domain-checker.ts`
5. Extract threat insert/dedup logic → `threat-processor.ts`
6. Slim down `scan-orchestrator.ts` to pure orchestration
7. Add `index.ts` barrel export that re-exports `runScanForBrand`
8. Update imports in `scan/route.ts` and `scan-worker.ts`
9. **Write tests for each new module before touching the next**
10. Delete original `scan-runner.ts` only after all tests pass

**Risk mitigation:** Keep the original file until all new modules have test coverage. Use the barrel export to avoid breaking existing imports.

### 7.2 Type Safety Improvement (TD-010)

**Pattern — Replace `any` with explicit types:**

```typescript
// BEFORE (unsafe)
export async function POST(request: NextRequest) {
  const body = await request.json()  // body: any
  const { threatId, bucket } = body   // no validation
  // ...
}

// AFTER (type-safe)
interface EvidenceSignRequest {
  threatId: string
  bucket?: string
  path?: string
}

function parseEvidenceSignRequest(body: unknown): EvidenceSignRequest {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Request body must be an object')
  }
  const { threatId, bucket, path } = body as Record<string, unknown>
  if (typeof threatId !== 'string' || !threatId) {
    throw new ValidationError('threatId is required')
  }
  return {
    threatId,
    bucket: typeof bucket === 'string' ? bucket : undefined,
    path: typeof path === 'string' ? path : undefined,
  }
}
```

**Alternative (with Zod for runtime validation):**

```typescript
import { z } from 'zod'

const EvidenceSignSchema = z.object({
  threatId: z.string().uuid(),
  bucket: z.string().optional(),
  path: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = EvidenceSignSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 })
  }
  const { threatId, bucket, path } = parsed.data
  // ...
}
```

**Note:** Zod is already in `node_modules` (transitive dependency). Consider adding it as a direct dependency if adopting this pattern broadly.

### 7.3 Error Handling Standardization (TD-006, TD-026)

**Standard error response shape:**

```typescript
// src/lib/api-errors.ts
export interface ApiErrorResponse {
  error: string
  code?: string
  details?: Record<string, string>
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: Record<string, string>,
  ) {
    super(message)
    this.name = 'ApiError'
  }

  toResponse(): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
      {
        error: this.message,
        ...(this.code && { code: this.code }),
        ...(this.details && { details: this.details }),
      },
      { status: this.status },
    )
  }
}

// Common errors
export const Unauthorized = () => new ApiError('Unauthorized', 401, 'UNAUTHORIZED')
export const NotFound = (resource: string) => new ApiError(`${resource} not found`, 404, 'NOT_FOUND')
export const BadRequest = (message: string) => new ApiError(message, 400, 'BAD_REQUEST')
export const Forbidden = (message: string, code?: string) => new ApiError(message, 403, code ?? 'FORBIDDEN')
```

**Standard route handler pattern:**

```typescript
// Wrap route handlers for consistent error handling
export function withErrorHandling(
  handler: (request: NextRequest) => Promise<NextResponse>,
) {
  return async (request: NextRequest) => {
    try {
      return await handler(request)
    } catch (error) {
      if (error instanceof ApiError) {
        return error.toResponse()
      }
      console.error('Unhandled error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      )
    }
  }
}
```

### 7.4 Silent Catch Block Remediation (TD-006)

**Pattern — Replace silent catch with logging + graceful fallback:**

```typescript
// BEFORE (silent failure)
const result = await analyzeWithVision(screenshot).catch(() => null)

// AFTER (visible failure with fallback)
let result = null
try {
  result = await analyzeWithVision(screenshot)
} catch (error) {
  logger.warn('Vision analysis failed, proceeding without visual similarity', {
    error: error instanceof Error ? error.message : String(error),
    threatDomain,
    brandId,
  })
  // Explicitly return a "no analysis" result
  result = { similarityScore: null, analysisSkipped: true, reason: 'vision_api_error' }
}
```

**Files requiring this treatment:**
1. `openai-analysis.ts` — Vision API calls
2. `logo-scanner.ts` — Image search API calls
3. `evidence/sign/route.ts` — URL signing
4. `brands/logo/route.ts` — Logo upload

---

## 8. Quality Gates & Metrics

### 8.1 Automated Quality Gates (CI)

These run on every push and PR. Build fails if any gate fails.

| Gate | Tool | Threshold | Blocks Merge |
|------|------|-----------|-------------|
| Type Safety | `tsc --noEmit` | Zero errors | ✅ Yes |
| Linting | `next lint` | Zero errors, zero warnings | ✅ Yes |
| Unit Tests | `vitest run` | All pass | ✅ Yes |
| Coverage | `vitest --coverage` | Above ratcheted threshold | ✅ Yes |
| Build | `next build` | Successful | ✅ Yes |
| Dependency Audit | `npm audit --production` | No critical/high vulns | ✅ Yes |

### 8.2 Manual Quality Gates (Pre-Release)

These are checked before deploying to production:

| Gate | Method | Threshold |
|------|--------|-----------|
| E2E Tests | `npx playwright test` | All critical paths pass |
| Performance | Lighthouse CI | Performance ≥ 80, Accessibility ≥ 90 |
| Security Headers | Manual check or automated scan | All required headers present |
| Environment Validation | Startup checks | All required env vars present |

### 8.3 Health Metrics Dashboard

Track these metrics over time (in `TECH_DEBT_REGISTER.md` or a dashbaord):

| Metric | Current | Target (Q2) | Target (Q4) |
|--------|---------|-------------|-------------|
| Test coverage (statements) | 0% | 40% | 75% |
| Open debt items (Critical) | 8 | 0 | 0 |
| Open debt items (High) | 8 | 3 | 0 |
| Files > 400 lines | 3 | 1 | 0 |
| `any` type usages | ~10 | 3 | 0 |
| Silent `.catch()` blocks | ~6 | 0 | 0 |
| Average file size (lib/) | ~310 lines | 200 lines | 150 lines |
| Build time | Unknown | < 60s | < 45s |
| Lint warnings | Unknown | 0 | 0 |

### 8.4 Dependency Health

Monthly dependency review checklist:

```markdown
## Monthly Dependency Review — [Month Year]

- [ ] Run `npm audit` and resolve critical/high vulnerabilities
- [ ] Check for major version updates on critical deps (Next.js, Supabase, Stripe)
- [ ] Review transitive dependency count (`npm ls --all | wc -l`)
- [ ] Check for deprecated packages
- [ ] Update TypeScript and type definitions
- [ ] Verify Puppeteer/Chromium compatibility
- [ ] Review bundle size impact of dependency changes

### Findings
- [list any issues or updates made]
```

---

## 9. Continuous Improvement Process

### 9.1 The "Debt Budget" Approach

Every sprint/week, allocate a fixed percentage of time to debt reduction:

| Week Type | Feature Work | Debt Work | Infrastructure |
|-----------|-------------|-----------|----------------|
| Normal week | 70% | 20% | 10% |
| Pre-launch week | 80% | 15% | 5% |
| Debt sprint (quarterly) | 30% | 50% | 20% |

**Rules:**
- Debt work doesn't require justification — it's pre-approved budget
- Debt items are pulled from the prioritized register
- If a feature touches a file with known debt, fixing that debt counts as feature work
- One "debt sprint" per quarter: a focused week of nothing but quality improvement

### 9.2 The Boy Scout Rule (Applied)

When you touch a file for any reason:

1. **Check the debt register** — does this file have known issues?
2. **Fix what's cheap** — if it takes < 15 minutes, fix it now
3. **Log what's expensive** — if it takes > 15 minutes, add to the register
4. **Never make it worse** — don't add new `any`, don't add new silent catches, don't skip tests

### 9.3 Retrospective Questions

Ask these monthly:

1. **What broke in production this month?** → Add test coverage for that path
2. **What took longest to debug?** → Add logging/monitoring there
3. **What file did we touch most?** → Prioritize refactoring that file
4. **What dependency caused problems?** → Consider alternatives or pinning
5. **What did we learn?** → Update conventions, add to this strategy doc

### 9.4 Refactoring Triggers

Refactor when:

| Trigger | Action |
|---------|--------|
| File exceeds 400 lines | Decompose into focused modules |
| Function exceeds 50 lines | Extract helper functions |
| Same code appears 3+ times | Extract shared utility |
| Test is too complex to write | Simplify the code under test |
| Bug found without test coverage | Write the test first (TDD the fix) |
| Performance regression | Profile first, optimize second, test third |

### 9.5 Architecture Decision Records (ADRs)

For significant technical decisions, create lightweight ADRs:

```markdown
# ADR-NNN: [Title]

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-XXX

## Context
What's the situation? What forces are at play?

## Decision
What did we decide?

## Consequences
What are the positive and negative outcomes?

## Alternatives Considered
What else did we evaluate and why did we reject it?
```

Store in `.planning/decisions/ADR-NNN-title.md`.

---

## 10. Tooling & Automation

### 10.1 Recommended Tool Stack

| Category | Tool | Purpose | Priority |
|----------|------|---------|----------|
| Testing | Vitest | Unit + integration tests | Sprint 1 |
| Testing | Playwright | E2E tests | Sprint 4 |
| Testing | MSW | API mocking for tests | Sprint 2 |
| CI/CD | GitHub Actions | Automated builds and tests | Sprint 1 |
| Linting | ESLint (existing) | Code quality rules | Existing |
| Formatting | Prettier | Consistent formatting | Sprint 1 |
| Type Checking | TypeScript strict (existing) | Compile-time safety | Existing |
| Error Tracking | Sentry | Production error monitoring | Sprint 4 |
| Logging | Pino | Structured JSON logging | Sprint 3 |
| Dependency Audit | npm audit + Snyk | Vulnerability detection | Sprint 1 |
| API Validation | Zod | Runtime request validation | Sprint 2 |
| Git Hooks | Husky + lint-staged | Pre-commit quality checks | Sprint 1 |

### 10.2 GitHub Actions CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      
      - run: npm ci
      
      - name: Type Check
        run: npx tsc --noEmit
      
      - name: Lint
        run: npm run lint
      
      - name: Unit Tests
        run: npx vitest run --coverage
      
      - name: Build
        run: npm run build
      
      - name: Dependency Audit
        run: npm audit --production --audit-level=high

  e2e:
    runs-on: ubuntu-latest
    needs: quality
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
        env:
          # Use test environment variables
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}
```

### 10.3 Pre-Commit Hooks

```bash
# Install Husky + lint-staged
npm install -D husky lint-staged
npx husky init
```

```json
// package.json addition
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml}": [
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
npx lint-staged
npx tsc --noEmit
```

### 10.4 NPM Scripts Addition

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "typecheck": "tsc --noEmit",
    "quality": "npm run typecheck && npm run lint && npm run test:run",
    "prepare": "husky"
  }
}
```

---

## 11. Appendices

### Appendix A: Tech Debt Register Template

Create as `TECH_DEBT_REGISTER.md` in the project root:

```markdown
# Technical Debt Register

## Active Items

| ID | Severity | Category | Description | File(s) | Score | Sprint | Owner |
|----|----------|----------|-------------|---------|-------|--------|-------|
| TD-001 | Critical | Security | SSRF in evidence collector | evidence-collector.ts | 15 | S1 | — |
| ... | | | | | | | |

## Resolved Items

| ID | Description | Resolved | Resolution |
|----|-------------|----------|------------|
| — | — | — | — |

## Metrics History

| Date | Critical | High | Medium | Low | Test Coverage |
|------|----------|------|--------|-----|---------------|
| 2026-02-05 | 8 | 8 | 8 | 4 | 0% |
```

### Appendix B: File Health Heatmap

Files ranked by debt density (issues × severity / lines):

```
🔴 HIGH DEBT DENSITY (fix first)
├── scan-runner.ts         — 969 lines, 5 debt items (TD-007,008,011,015,022)
├── evidence-collector.ts  — 311 lines, 3 debt items (TD-001,008,023)
├── openai-analysis.ts     — 165 lines, 2 debt items (TD-005,006)
├── evidence/sign/route.ts — 113 lines, 3 debt items (TD-003,006,010)

🟡 MEDIUM DEBT DENSITY (address in sprints 2-3)
├── report-generator.ts    — 296 lines, 1 debt item (TD-002)
├── email.ts               — 164 lines, 2 debt items (TD-002,016)
├── logo-scanner.ts        — 144 lines, 2 debt items (TD-006,024)
├── web-scanner.ts         — 368 lines, 1 debt item (TD-017)
├── social-scanner.ts      — 686 lines, 1 debt item (TD-017)

🟢 LOW DEBT DENSITY (opportunistic)
├── utils.ts               — 141 lines, 0 debt items
├── tier-limits.ts         — 145 lines, 0 debt items
├── stripe.ts              — 164 lines, 0 debt items
├── audit-logger.ts        — ~80 lines, 0 debt items
├── notifications.ts       — ~100 lines, 0 debt items
```

### Appendix C: Testing Priority Matrix

Prioritize testing based on risk × change frequency:

```
                    Change Frequency
                 Low              High
            ┌──────────────┬──────────────┐
            │              │              │
  High Risk │  Test now    │  Test first  │
            │  (evidence,  │  (scan-      │
            │   openai)    │   runner,    │
            │              │   brands)    │
            ├──────────────┼──────────────┤
            │              │              │
  Low Risk  │  Test later  │  Test when   │
            │  (utils,     │   touched    │
            │   stripe)    │  (UI comps)  │
            │              │              │
            └──────────────┴──────────────┘
```

### Appendix D: Quick Reference — What to Do When...

| Situation | Action |
|-----------|--------|
| Found a bug in production | Write a failing test first, then fix, then deploy |
| Adding a new API route | Use `withErrorHandling` wrapper, add input validation with Zod, write integration test |
| Adding a new lib function | Write unit test alongside, add JSDoc, keep < 50 lines |
| Touching scan-runner.ts | Check if the code you need can be extracted to a module first |
| Adding a dependency | Check: bundle size, maintenance status, downloads, alternatives |
| Production error reported | Check Sentry (once installed); add logging if blind spot |
| Customer wants a feature | Check debt register — can we reduce debt as part of this feature? |
| Quarterly planning | Run debt sprint; update coverage targets; review register |

### Appendix E: Definition of Done

A feature is **done** when:

1. ✅ Code compiles without errors
2. ✅ Linting passes with no warnings
3. ✅ Unit tests written and passing for new/changed logic
4. ✅ Integration test written for new API endpoints
5. ✅ No new `any` types
6. ✅ No silent error swallowing
7. ✅ Error states handled in UI
8. ✅ Works in dark mode
9. ✅ Commit message follows convention
10. ✅ PR checklist completed
11. ✅ Coverage doesn't decrease

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-05 | OpenClaw Engineering | Initial strategy document |

---

*This is a living document. Update it as the project evolves, processes are refined, and new patterns emerge.*
