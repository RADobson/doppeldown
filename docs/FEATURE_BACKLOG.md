# DoppelDown — Feature Backlog

*Scored and sorted. Updated: 2026-02-05*
*Scoring framework: RICE-V (see PRODUCT_ROADMAP_STRATEGY.md Section 5)*

---

## Scoring Key

- **R** = Reach (1-10) — How many customers impacted?
- **I** = Impact (1-10) — How much does it move the needle?
- **C** = Confidence (1-10) — How sure are we?
- **E** = Effort inverted (1-10) — Lower effort = higher score
- **V** = Vision alignment (1-10) — Strategic pillar fit
- **Score** = Weighted average (R×0.25 + I×0.25 + C×0.15 + E×0.20 + V×0.15) × 10
- **Validation** = Level on validation ladder (0=Idea, 1=Problem, 2=Shaped, 3=Demand, 4=Build, 5=Measured)

---

## P0 — Build Now (Score 7.5+)

| # | Feature | R | I | C | E | V | Score | Validation | Target | Status |
|---|---------|---|---|---|---|---|-------|------------|--------|--------|
| 1 | Alert resolution workflow (resolve/dismiss/archive threats) | 10 | 9 | 8 | 5 | 8 | 8.1 | L2 | v1.5 | Not started |
| 2 | Onboarding flow (guided first brand + scan) | 10 | 8 | 8 | 7 | 8 | 8.2 | L2 | v1.4 | Not started |
| 3 | Toast notification system (replace alert()) | 10 | 4 | 10 | 9 | 4 | 7.2 | L2 | v1.4 | Not started |
| 4 | SMTP/email delivery hardening | 8 | 8 | 10 | 9 | 6 | 8.1 | L1 | v1.4 | Blocked (needs creds) |
| 5 | Upgrade prompts (contextual upsell at limits) | 8 | 9 | 7 | 7 | 6 | 7.5 | L2 | v1.5 | Not started |
| 6 | Mobile responsiveness fixes | 8 | 7 | 8 | 5 | 6 | 6.8 | L1 | v1.4 | Not started |
| 7 | Analytics instrumentation (funnel events) | 6 | 8 | 10 | 7 | 6 | 7.3 | L2 | v1.4 | Not started |
| 8 | Slack notification integration | 8 | 7 | 8 | 7 | 6 | 7.2 | L1 | v1.6 | Not started |
| 9 | Threat detail page (deep-dive per threat) | 8 | 8 | 7 | 5 | 8 | 7.2 | L2 | v1.5 | Not started |
| 10 | REST API v1 (read-only) | 6 | 9 | 7 | 3 | 10 | 7.0 | L1 | v1.7 | Not started |
| 11 | Webhook notifications | 6 | 8 | 8 | 5 | 8 | 7.0 | L1 | v1.7 | Not started |
| 12 | Automated takedown request generation | 8 | 10 | 6 | 3 | 10 | 7.5 | L1 | v1.8 | Not started |

## P1 — Build Next (Score 6.0–7.4)

| # | Feature | R | I | C | E | V | Score | Validation | Target | Status |
|---|---------|---|---|---|---|---|-------|------------|--------|--------|
| 13 | Teams integration | 6 | 7 | 8 | 7 | 6 | 6.7 | L1 | v1.7 | Not started |
| 14 | MSP multi-tenant dashboard | 4 | 10 | 6 | 3 | 10 | 6.5 | L1 | v1.9 | Not started |
| 15 | Team accounts (invite, roles) | 6 | 9 | 7 | 3 | 8 | 6.6 | L1 | v1.9 | Not started |
| 16 | Takedown status tracking | 8 | 8 | 6 | 5 | 8 | 7.1 | L0 | v1.8 | Not started |
| 17 | Google Safe Browsing submission | 8 | 7 | 8 | 7 | 6 | 7.2 | L1 | v1.8 | Not started |
| 18 | Threat trend dashboard | 8 | 6 | 6 | 5 | 6 | 6.2 | L0 | v1.6 | Not started |
| 19 | Improved PDF reports (branded, exec summary) | 6 | 6 | 6 | 5 | 6 | 5.8 | L0 | v1.6 | Not started |
| 20 | Error boundary pages (500, rate limit) | 8 | 4 | 10 | 9 | 4 | 6.8 | L2 | v1.4 | Not started |
| 21 | Blog/SEO content engine | 6 | 6 | 6 | 5 | 6 | 5.8 | L1 | v1.5 | Not started |
| 22 | Scan results enrichment (richer threat cards) | 8 | 6 | 7 | 5 | 6 | 6.4 | L0 | v1.5 | Not started |
| 23 | Social proof on landing page | 6 | 6 | 6 | 7 | 4 | 5.8 | L0 | v1.5 | Not started |
| 24 | Customer feedback widget (in-app) | 6 | 5 | 8 | 7 | 6 | 6.2 | L1 | v1.6 | Not started |
| 25 | API key management UI | 4 | 6 | 8 | 7 | 8 | 6.3 | L0 | v1.7 | Not started |
| 26 | PagerDuty/OpsGenie integration | 4 | 6 | 6 | 7 | 6 | 5.7 | L0 | v1.7 | Not started |
| 27 | Custom branding for reports (white-label header) | 4 | 6 | 6 | 7 | 6 | 5.7 | L0 | v1.9 | Not started |
| 28 | Brand health score | 8 | 5 | 4 | 7 | 6 | 5.9 | L0 | v1.6 | Not started |
| 29 | Bulk brand import (CSV) | 4 | 6 | 6 | 7 | 6 | 5.7 | L0 | v1.9 | Not started |
| 30 | Evidence package export (zip) | 6 | 6 | 8 | 7 | 6 | 6.5 | L0 | v1.8 | Not started |
| 31 | Social platform report generation | 6 | 6 | 8 | 7 | 6 | 6.5 | L0 | v1.8 | Not started |

## P2 — Build Later (Score 4.5–5.9)

| # | Feature | R | I | C | E | V | Score | Validation | Target | Status |
|---|---------|---|---|---|---|---|-------|------------|--------|--------|
| 32 | SIEM integration (Splunk, Sentinel export) | 4 | 8 | 6 | 3 | 8 | 5.7 | L0 | H3 | Not started |
| 33 | OAuth / SSO (Google, Microsoft, SAML) | 6 | 4 | 8 | 5 | 4 | 5.3 | L0 | H3 | Not started |
| 34 | Marketplace monitoring (Amazon, eBay, Shopify) | 6 | 8 | 4 | 1 | 8 | 5.3 | L0 | H3 | Not started |
| 35 | White-label portal (full MSP rebrand) | 4 | 8 | 4 | 1 | 8 | 4.9 | L0 | H3 | Not started |
| 36 | Custom scanning rules | 4 | 6 | 4 | 3 | 6 | 4.5 | L0 | H3 | Not started |
| 37 | Scan history & comparison (before/after diffs) | 6 | 5 | 4 | 5 | 4 | 4.8 | L0 | v1.6 | Not started |
| 38 | Referral program | 6 | 6 | 4 | 5 | 4 | 5.1 | L0 | H3 | Not started |
| 39 | Zapier integration | 4 | 5 | 6 | 5 | 6 | 5.1 | L0 | v1.7 | Not started |
| 40 | Managed takedown service (human-assisted) | 4 | 8 | 4 | 1 | 8 | 4.9 | L0 | H3 | Not started |
| 41 | Threat intelligence sharing (anonymized) | 4 | 6 | 4 | 1 | 8 | 4.4 | L0 | H3 | Not started |
| 42 | Compliance reporting (SOC 2, ISO evidence) | 4 | 6 | 4 | 3 | 6 | 4.5 | L0 | H3 | Not started |
| 43 | Activity log per team | 4 | 5 | 8 | 5 | 6 | 5.3 | L0 | v1.9 | Not started |

## P3 — Maybe (Score 3.0–4.4)

| # | Feature | R | I | C | E | V | Score | Validation | Target | Status |
|---|---------|---|---|---|---|---|-------|------------|--------|--------|
| 44 | Mobile app (iOS/Android) | 6 | 4 | 4 | 1 | 4 | 3.7 | L0 | H3+ | Not started |
| 45 | 3D threat visualization | 4 | 3 | 2 | 1 | 4 | 2.8 | L0 | — | Not started |
| 46 | Chat support (in-app) | 4 | 3 | 4 | 3 | 2 | 3.2 | L0 | — | Not started |

## P4 — No (Score <3.0)

| # | Feature | R | I | C | E | V | Score | Reason Rejected |
|---|---------|---|---|---|---|---|-------|----------------|
| 47 | Multi-language support | 2 | 2 | 4 | 1 | 4 | 2.5 | English-only market sufficient for first 200 customers |
| 48 | Blockchain-based evidence | 2 | 2 | 2 | 1 | 2 | 1.8 | Buzzword, no customer demand signal |
| 49 | Real-time chat between users | 2 | 1 | 2 | 1 | 1 | 1.4 | Not a collaboration tool |

---

## Tech Debt Backlog

| Item | Severity | Effort | Target |
|------|----------|--------|--------|
| Automated test coverage (delete operations) | Medium | 1 week | v1.4 |
| Fix OpenAI Vision endpoint API path | Medium | 1 day | v1.4 |
| Replace alert() with toast system | Low | 1-2 days | v1.4 |
| Add undo after delete | Low | 2-3 days | v1.5 |
| Remove orphaned ErrorMessage component | Low | 30 min | v1.4 |
| Fix /auth/reset-password Suspense warning | Low | 1 hour | v1.4 |
| Storage cleanup for orphaned files | Low | 3-5 days | v1.6 |
| Resolve TypeScript pre-existing errors | Low | 1-2 days | v1.4 |

---

## How to Update This File

1. **New idea:** Add to appropriate priority tier with initial RICE-V scores
2. **Validation changes:** Update the Validation column as ideas progress through the ladder
3. **Score changes:** Re-score when new evidence arrives (customer feedback, usage data)
4. **Status changes:** Update as work begins/completes
5. **Quarterly pruning:** Remove shipped items, re-evaluate P3/P4 items, archive if still irrelevant

*Last pruned: 2026-02-05 (initial creation)*
