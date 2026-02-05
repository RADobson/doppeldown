# DoppelDown — Documentation & Knowledge Management Strategy

> **Version:** 1.0  
> **Date:** 2026-02-05  
> **Status:** Active  
> **Owner:** Ernie (co-founder, engineering)

---

## Executive Summary

DoppelDown currently has **~2.3 MB of documentation** spread across 40+ markdown files in `docs/`, 12+ in `marketing/`, 14+ in `.planning/`, and 11+ in `sales-enablement/`. While comprehensive in *content*, the documentation lacks a coherent organizational structure, discoverability system, consistent formatting standards, and a maintenance lifecycle. As we grow from a founding team of 3 to onboarding contributors, customers, and partners, this debt will compound.

This strategy establishes the architecture, standards, tooling, and processes to make DoppelDown's knowledge base an asset rather than a liability.

---

## Table of Contents

1. [Current State Audit](#1-current-state-audit)
2. [Documentation Architecture](#2-documentation-architecture)
3. [Content Types & Standards](#3-content-types--standards)
4. [Information Architecture](#4-information-architecture)
5. [Tooling & Infrastructure](#5-tooling--infrastructure)
6. [Authoring Standards & Style Guide](#6-authoring-standards--style-guide)
7. [Maintenance & Governance](#7-maintenance--governance)
8. [Search & Discoverability](#8-search--discoverability)
9. [Versioning & Release Alignment](#9-versioning--release-alignment)
10. [Metrics & Quality Assurance](#10-metrics--quality-assurance)
11. [Scaling Plan](#11-scaling-plan)
12. [Implementation Roadmap](#12-implementation-roadmap)

---

## 1. Current State Audit

### What Exists

| Location | Files | Total Size | Purpose |
|----------|-------|-----------|---------|
| `docs/` | 41 | ~1.2 MB | API reference, strategies, reports, changelogs |
| Root (`*.md`) | 25+ | ~1.0 MB | README, strategy docs, operational docs |
| `.planning/` | 14+ | ~1.0 MB | Roadmap, milestones, codebase analysis |
| `marketing/` | 12 | ~97 KB | Launch posts, directory submissions, email sequences |
| `sales-enablement/` | 11+ dirs | — | Playbooks, battle cards, objection handling |
| `competitive-intelligence/` | 7+ dirs | — | Competitor profiles, monitoring scripts |
| `research/` | 1 | — | Competitive analysis |

### Problems Identified

| Problem | Impact | Severity |
|---------|--------|----------|
| **No single entry point.** No index or navigation. New reader must browse file lists. | Onboarding time 10x longer than needed | 🔴 High |
| **Duplicate content.** Strategy docs appear in both `docs/` and root (e.g., `INTEGRATIONS_ECOSYSTEM_STRATEGY.md` exists in both). | Conflicting versions, wasted edits | 🔴 High |
| **Inconsistent naming.** Mix of `SCREAMING_SNAKE.md`, `kebab-case.md`, `Title Case.md`. No pattern. | Files hard to find, sort, or reference | 🟡 Medium |
| **Strategy docs are massive.** Several files exceed 60-100 KB (60-130K characters). Nobody reads a 100KB markdown file. | Content exists but is unusable | 🔴 High |
| **No audience separation.** API docs, internal strategy, marketing copy, and sales scripts all live together. | Wrong people read wrong docs; confidential content leaks risk | 🔴 High |
| **No freshness tracking.** No "last updated" dates, no review cycles, no ownership. | Stale docs silently mislead | 🟡 Medium |
| **No contribution workflow.** No templates, no review process, no standards. | Quality variance; contributor friction | 🟡 Medium |
| **No generated docs.** OpenAPI spec exists but isn't driving auto-generated reference pages. | Manual API doc drift | 🟡 Medium |

---

## 2. Documentation Architecture

### The Four Quadrants

Organize all documentation into four quadrants by **audience** and **purpose**:

```
                          EXTERNAL                    INTERNAL
                    ┌─────────────────────┬─────────────────────┐
                    │                     │                     │
   LEARNING         │   📘 User Docs      │   📗 Team Handbook  │
   (tutorials,      │   guides, tutorials │   onboarding, SOPs  │
    how-to)         │   FAQs, quickstarts │   runbooks, playbooks│
                    │                     │                     │
                    ├─────────────────────┼─────────────────────┤
                    │                     │                     │
   REFERENCE        │   📙 API Reference  │   📕 Engineering     │
   (lookup,         │   SDK docs, schemas │   architecture, ADRs│
    specs)          │   changelogs, specs │   codebase docs     │
                    │                     │                     │
                    └─────────────────────┴─────────────────────┘
```

### Directory Structure (Target)

```
doppeldown/
├── docs/                          # 📘📙 PUBLIC documentation (ships with product)
│   ├── index.md                   # Documentation home & navigation
│   ├── getting-started/
│   │   ├── quickstart.md          # 5-minute first scan
│   │   ├── installation.md        # Self-hosted setup
│   │   ├── docker.md              # Docker deployment
│   │   └── concepts.md            # Core concepts (brands, scans, threats, evidence)
│   ├── guides/
│   │   ├── brand-monitoring.md    # How to set up brand monitoring
│   │   ├── scan-types.md          # Domain vs social vs full scans
│   │   ├── takedown-reports.md    # Generating and using reports
│   │   ├── webhooks.md            # Setting up webhook integrations
│   │   ├── email-alerts.md        # Configuring email notifications
│   │   └── tier-limits.md         # Understanding plan limits
│   ├── api/
│   │   ├── reference.md           # Full API reference (or auto-generated)
│   │   ├── authentication.md      # Auth methods and token management
│   │   ├── errors.md              # Error codes and handling
│   │   ├── rate-limiting.md       # Rate limit policies
│   │   ├── webhooks-api.md        # Webhook event types and payloads
│   │   ├── changelog.md           # API changelog
│   │   └── openapi.yaml           # OpenAPI 3.0 spec (source of truth)
│   ├── sdk/
│   │   ├── javascript.md          # JS/TS SDK usage
│   │   ├── python.md              # Python SDK usage
│   │   └── curl-examples.md       # cURL examples
│   ├── self-hosting/
│   │   ├── requirements.md        # System requirements
│   │   ├── environment.md         # Environment variables reference
│   │   ├── supabase-setup.md      # Supabase configuration
│   │   ├── stripe-setup.md        # Stripe configuration
│   │   └── scan-worker.md         # Worker node setup
│   ├── security/
│   │   ├── overview.md            # Security posture overview
│   │   ├── data-handling.md       # How we handle your data
│   │   └── compliance.md          # Compliance certifications
│   └── faq.md                     # Frequently asked questions
│
├── internal/                      # 📗📕 PRIVATE documentation (team only, .gitignore'd or separate repo)
│   ├── index.md                   # Internal docs home
│   ├── engineering/
│   │   ├── architecture.md        # System architecture
│   │   ├── codebase-guide.md      # Codebase walkthrough
│   │   ├── conventions.md         # Code style, patterns, naming
│   │   ├── testing.md             # Test strategy and running tests
│   │   ├── ci-cd.md               # CI/CD pipeline reference
│   │   ├── monitoring.md          # Observability setup
│   │   ├── error-handling.md      # Error handling patterns
│   │   ├── caching.md             # Caching strategy
│   │   └── adr/                   # Architecture Decision Records
│   │       ├── 001-nextjs-over-remix.md
│   │       ├── 002-supabase-over-firebase.md
│   │       └── template.md
│   ├── operations/
│   │   ├── runbooks/
│   │   │   ├── incident-response.md
│   │   │   ├── deploy-rollback.md
│   │   │   ├── database-migration.md
│   │   │   └── stripe-troubleshooting.md
│   │   ├── disaster-recovery.md
│   │   ├── on-call.md
│   │   └── vps-worker-setup.md    # Oracle Cloud worker node
│   ├── product/
│   │   ├── roadmap.md             # Product roadmap (current)
│   │   ├── feature-backlog.md     # Prioritized feature list
│   │   ├── pricing-strategy.md    # Pricing rationale and models
│   │   ├── competitive-tracker.md # Live competitive landscape
│   │   └── user-research.md       # User research findings
│   ├── business/
│   │   ├── gtm-playbook.md        # Go-to-market strategy
│   │   ├── fundraising.md         # Fundraising strategy (if applicable)
│   │   ├── compliance/            # Internal compliance docs
│   │   └── data-governance.md     # Data governance policies
│   ├── sales/                     # Sales enablement (move from sales-enablement/)
│   │   ├── playbook.md
│   │   ├── battle-cards/
│   │   ├── objection-handling.md
│   │   └── email-sequences/
│   ├── marketing/                 # Marketing (move from marketing/)
│   │   ├── content-strategy.md
│   │   ├── seo-strategy.md
│   │   ├── launch-posts.md
│   │   └── community-plan.md
│   └── onboarding/
│       ├── new-engineer.md        # Engineering onboarding checklist
│       ├── new-contributor.md     # Open source contributor guide
│       └── tools-setup.md        # Dev environment setup
│
├── CONTRIBUTING.md                # How to contribute (docs included)
├── README.md                      # Project README (entry point)
└── CHANGELOG.md                   # Project-level changelog
```

### Key Principles

1. **`docs/` is public.** Everything in `docs/` could be served to customers. No secrets, no internal strategy.
2. **`internal/` is private.** Business strategy, competitive intel, pricing rationale, architecture internals.
3. **One source of truth.** No file should exist in two locations. If it does, one is a symlink or one gets deleted.
4. **Maximum file size: 5,000 words (~25 KB).** Larger documents must be split into logical sections with a parent index.
5. **Every directory has an `index.md`.** It serves as the table of contents for that section.

---

## 3. Content Types & Standards

### Content Type Definitions

| Type | Audience | Purpose | Max Length | Update Frequency | Template |
|------|----------|---------|-----------|-----------------|----------|
| **Quickstart** | New users | Get running ASAP | 1,500 words | Per major release | ✅ |
| **Tutorial** | Users learning | Step-by-step walkthrough | 3,000 words | Quarterly | ✅ |
| **How-To Guide** | Users doing | Solve a specific problem | 2,000 words | As needed | ✅ |
| **API Reference** | Developers | Complete endpoint spec | Auto-generated | Per API change | N/A |
| **Concept/Explanation** | Anyone learning | Explain *why* something works | 2,500 words | Quarterly | ✅ |
| **Changelog** | Users/devs | What changed and when | Append-only | Per release | ✅ |
| **ADR** | Engineers | Record architectural decisions | 1,000 words | When decision made | ✅ |
| **Runbook** | Ops/on-call | Step-by-step incident response | 2,000 words | Quarterly review | ✅ |
| **Strategy Doc** | Leadership | Strategic direction | 5,000 words | Quarterly | ✅ |
| **Battle Card** | Sales | Competitive comparison (1 page) | 800 words | Monthly | ✅ |

### Diátaxis Framework Alignment

We follow the [Diátaxis](https://diataxis.fr/) documentation framework:

```
             PRACTICAL                          THEORETICAL
        ┌──────────────────┐              ┌──────────────────┐
STUDY   │    Tutorials     │              │   Explanations   │
        │ "Learning-       │              │ "Understanding-  │
        │  oriented"       │              │  oriented"       │
        └──────────────────┘              └──────────────────┘
        ┌──────────────────┐              ┌──────────────────┐
WORK    │   How-To Guides  │              │    Reference     │
        │ "Task-oriented"  │              │ "Information-    │
        │                  │              │  oriented"       │
        └──────────────────┘              └──────────────────┘
```

**Rule:** Every document must fit exactly one quadrant. If it tries to be a tutorial AND a reference, split it.

---

## 4. Information Architecture

### Navigation Hierarchy

```
DoppelDown Docs (docs/)
├── 🚀 Getting Started
│   ├── Quick Start (5 min to first scan)
│   ├── Core Concepts
│   ├── Installation
│   └── Docker Deployment
├── 📖 Guides
│   ├── Brand Monitoring
│   ├── Understanding Scan Types
│   ├── Takedown Reports
│   ├── Webhook Integration
│   ├── Email Alerts
│   └── Plan Limits & Quotas
├── 🔧 API Reference
│   ├── Authentication
│   ├── Brands
│   ├── Scans
│   ├── Threats
│   ├── Reports
│   ├── Evidence
│   ├── Notifications
│   ├── Billing
│   ├── Webhooks
│   ├── Admin
│   ├── Error Codes
│   └── Rate Limiting
├── 📦 SDKs & Libraries
│   ├── JavaScript / TypeScript
│   ├── Python
│   └── cURL Examples
├── 🏠 Self-Hosting
│   ├── Requirements
│   ├── Environment Variables
│   ├── Supabase Setup
│   ├── Stripe Setup
│   └── Scan Worker Setup
├── 🔒 Security
│   ├── Security Overview
│   ├── Data Handling
│   └── Compliance
├── ❓ FAQ
└── 📋 Changelog
```

### Cross-Referencing Rules

1. **Always link to related docs.** Every doc ends with a "See Also" or "Related" section.
2. **Link by relative path.** Never use absolute URLs for internal docs.
3. **Use canonical names.** Reference docs by their section name, not filename: "See the [Authentication guide](./api/authentication.md)."
4. **Bidirectional links.** If A links to B, B should link back to A.

### URL Structure (when docs site is deployed)

```
doppeldown.com/docs/                         → docs/index.md
doppeldown.com/docs/getting-started/         → docs/getting-started/quickstart.md
doppeldown.com/docs/api/brands               → docs/api/reference.md#brands
doppeldown.com/docs/guides/webhooks          → docs/guides/webhooks.md
```

---

## 5. Tooling & Infrastructure

### Phase 1: Markdown + GitHub (Now → 10 customers)

**Cost:** $0  
**Stack:** Markdown files in repo, GitHub for versioning and review

| Tool | Purpose |
|------|---------|
| **Markdown in Git** | Source of truth for all docs |
| **GitHub Pull Requests** | Review process for doc changes |
| **GitHub Actions** | Lint markdown, check links, validate OpenAPI |
| **`openapi.yaml`** | Single source for API reference |
| **Mermaid diagrams** | Architecture and flow diagrams in markdown |

**Automation to add immediately:**

```yaml
# .github/workflows/docs-lint.yml
name: Docs Lint
on:
  pull_request:
    paths: ['docs/**', 'internal/**', '*.md']
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Markdown lint
        uses: DavidAnson/markdownlint-cli2-action@v19
        with:
          globs: 'docs/**/*.md'
      - name: Check links
        uses: gaurav-nelson/github-action-markdown-link-check@v1
        with:
          folder-path: 'docs/'
      - name: Validate OpenAPI
        run: npx @redocly/cli lint docs/api/openapi.yaml
```

### Phase 2: Static Site Generator (10 → 100 customers)

**Cost:** $0 (Vercel hosting)  
**Recommended:** [Nextra](https://nextra.site/) (Next.js-based, since we're already a Next.js shop)

| Feature | Why |
|---------|-----|
| MDX support | Embed React components in docs (interactive examples) |
| Built-in search | Flexsearch, zero config |
| Sidebar auto-generation | From file structure |
| Dark mode | Out of the box |
| i18n ready | Aligns with our i18n strategy |
| Vercel deploy | Same platform as main app |

**Alternative:** [Mintlify](https://mintlify.com/) if we want hosted docs with zero maintenance (free for startups, $150/mo at scale).

### Phase 3: Full Knowledge Platform (100+ customers)

| Need | Tool | Why |
|------|------|-----|
| Internal wiki | Notion or Outline | Team knowledge, meeting notes, SOPs |
| API explorer | Swagger UI / Stoplight | Interactive API testing |
| Customer help center | Intercom / Crisp / Help Scout | Self-service support + search |
| Runbook automation | Rundeck or PagerDuty Runbooks | Automated incident response |
| Analytics | Plausible / PostHog | Track which docs get read |

### Docs-as-Code Pipeline

```
Author writes      PR opened        CI checks          PR merged          Deployed
Markdown/MDX  ──→  in GitHub   ──→  lint + links  ──→  to main    ──→   to Vercel
                       │              + OpenAPI          │
                       │              + spelling         │
                       ▼                                 ▼
                   Review by                        Auto-build
                   doc owner                        docs site
```

---

## 6. Authoring Standards & Style Guide

### Document Frontmatter

Every document MUST begin with a frontmatter block:

```markdown
---
title: "Webhook Integration Guide"
description: "Set up real-time notifications when DoppelDown detects threats"
category: guides
audience: external
last_updated: 2026-02-05
author: ernie
review_due: 2026-05-05
status: current  # current | draft | deprecated | archived
---
```

### Writing Rules

| Rule | Example |
|------|---------|
| **Use active voice** | ✅ "DoppelDown scans your domain" — ❌ "Your domain is scanned by DoppelDown" |
| **Use second person** | ✅ "You can configure..." — ❌ "The user can configure..." |
| **Use present tense** | ✅ "The API returns..." — ❌ "The API will return..." |
| **One idea per paragraph** | Max 3-4 sentences per paragraph |
| **Code examples are mandatory** | Every API endpoint needs at least one cURL example |
| **Lead with the action** | ✅ "To create a brand, send a POST..." — ❌ "A brand can be created by..." |
| **No jargon without definition** | First use of a term → define it or link to glossary |
| **No marketing in technical docs** | Docs explain *how*, not *why you should buy* |

### Formatting Standards

```markdown
# Page Title (H1 — exactly one per page)

## Major Section (H2)

### Subsection (H3)

#### Detail (H4 — use sparingly)

**Bold** for UI elements: Click **Settings** → **API Tokens**.

`code` for:
- API parameters: `brandId`
- File names: `next.config.js`
- Environment variables: `STRIPE_SECRET_KEY`
- CLI commands: `npm run dev`
- HTTP methods: `POST`

> **Note:** For supplementary information.

> **⚠️ Warning:** For things that could cause problems.

> **🚨 Danger:** For things that could break production or lose data.
```

### Code Block Standards

````markdown
```bash
# Always include the language identifier
# Always include comments explaining non-obvious parts
curl -X POST https://doppeldown.com/api/scan \
  -H "Authorization: Bearer $TOKEN" \  # Your Supabase access token
  -H "Content-Type: application/json" \
  -d '{"brandId": "uuid-here", "scanType": "full"}'
```

```json
// Response — annotate key fields
{
  "scanId": "abc-123",     // Use this to poll status
  "status": "pending",     // Will transition to "running" → "completed"
  "threats_found": 0       // Updated as scan progresses
}
```
````

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Directories | `kebab-case` | `getting-started/`, `api/` |
| Files | `kebab-case.md` | `webhook-integration.md` |
| Page titles | Title Case | "Webhook Integration Guide" |
| API endpoints | As-is from code | `/api/brands` |
| Environment variables | SCREAMING_SNAKE | `STRIPE_SECRET_KEY` |

### Glossary (maintained in `docs/glossary.md`)

Required entries:

| Term | Definition |
|------|-----------|
| **Brand** | A domain and associated social handles you want DoppelDown to monitor |
| **Threat** | A detected instance of brand impersonation (typosquat, phishing page, fake account) |
| **Scan** | An automated check across domains, web, and social media for threats |
| **Evidence** | Screenshots, WHOIS data, and HTML snapshots collected as proof of a threat |
| **Takedown Report** | A formatted document for registrars/platforms requesting threat removal |
| **Typosquat** | A domain name that closely resembles your brand's domain, registered by a third party |
| **NRD** | Newly Registered Domain — a domain registered within the last 30 days |
| **Homoglyph** | A character that looks similar to another (e.g., `rn` vs `m`, `0` vs `O`) |

---

## 7. Maintenance & Governance

### Ownership Model

Every document has exactly one **owner** — the person responsible for keeping it accurate.

| Content Area | Owner | Review Cadence |
|-------------|-------|----------------|
| API Reference | Engineering lead | Every release |
| User Guides | Product/Engineering | Quarterly |
| Architecture Docs | Engineering lead | Quarterly |
| Runbooks | On-call engineer | After every incident |
| Sales Materials | Sales lead | Monthly |
| Marketing Content | Marketing lead | Monthly |
| Strategy Docs | Relevant function lead | Quarterly |
| Competitive Intel | Product/Sales | Monthly |

### Document Lifecycle

```
                    ┌──────────┐
                    │  Draft   │
                    │ (WIP)    │
                    └────┬─────┘
                         │ PR merged
                         ▼
                    ┌──────────┐
              ┌────▶│ Current  │◀────┐
              │     │ (active) │     │
              │     └────┬─────┘     │
              │          │           │
         Updated    Past review   Reviewed,
         via PR     date          still good
              │          │           │
              │          ▼           │
              │     ┌──────────┐    │
              │     │ Stale    ├────┘
              │     │ (review  │
              │     │  needed) │
              │     └────┬─────┘
              │          │ No longer relevant
              │          ▼
              │     ┌──────────┐
              └─────│Deprecated│
                    │ (sunset  │
                    │  notice) │
                    └────┬─────┘
                         │ 90 days
                         ▼
                    ┌──────────┐
                    │ Archived │
                    │ (moved to│
                    │ archive/)│
                    └──────────┘
```

### Freshness Enforcement

**Automated checks (CI):**

```javascript
// scripts/docs-freshness.ts
// Run weekly via cron or CI
// Scans all .md files for frontmatter `review_due` dates
// Outputs warnings for docs past their review date
// Opens GitHub issues for docs >30 days past review
```

**Review schedule by type:**

| Doc Type | Review Cycle | Grace Period | Action if Stale |
|----------|-------------|-------------|----------------|
| API Reference | Every release | 0 days | Block release |
| Quickstart | Every release | 7 days | GitHub issue |
| Guides | 90 days | 14 days | GitHub issue |
| Runbooks | 90 days | 7 days | Slack alert |
| Strategy | 90 days | 30 days | Review in next planning |
| ADRs | Never (immutable) | N/A | N/A |

### Quarterly Documentation Review

**Agenda (30 min, quarterly):**

1. **Freshness report** — How many docs are stale? (5 min)
2. **Gap analysis** — What should exist but doesn't? (10 min)
3. **Customer feedback** — What are people asking in support that docs should answer? (10 min)
4. **Action items** — Assign owners and deadlines (5 min)

---

## 8. Search & Discoverability

### Phase 1: In-Repo Search

- GitHub's built-in search works for the team
- Add a comprehensive `docs/index.md` with categorized links
- Every directory gets an `index.md` listing its contents

### Phase 2: Docs Site Search

When we deploy a docs site (Nextra/Mintlify):

- **Flexsearch** (built into Nextra) for client-side full-text search
- **Algolia DocSearch** (free for open-source / qualifying projects) for advanced search

### Phase 3: AI-Powered Search

- Feed docs into a vector store (Supabase `pgvector` — we already use Supabase)
- Expose a `/api/docs/ask` endpoint for natural-language doc queries
- Power a chatbot in the help center: "How do I set up webhooks?" → relevant doc + excerpt

### Discoverability Checklist

- [ ] `docs/index.md` exists with full navigation tree
- [ ] Every guide ends with "Related" / "See Also" links
- [ ] `docs/glossary.md` defines all product-specific terms
- [ ] `docs/faq.md` addresses the top 20 customer questions
- [ ] API reference is auto-generated from OpenAPI spec
- [ ] README.md links to docs entry point
- [ ] Dashboard includes contextual "?" help links pointing to relevant docs

---

## 9. Versioning & Release Alignment

### Docs ↔ Product Version Sync

```
Product Release v1.2.0
        │
        ├── Code changes merged
        ├── API changelog entry added
        ├── Affected docs updated in SAME PR (or linked PR)
        ├── OpenAPI spec updated
        ├── Release notes drafted
        └── Docs site deployed alongside product
```

### Rules

1. **No feature ships without docs.** PR checklist must include documentation checkbox.
2. **API changes update `openapi.yaml` first.** Reference docs are generated from this.
3. **Breaking changes get migration guides.** Separate doc explaining what changed and how to migrate.
4. **Changelog is append-only.** Never rewrite history.

### PR Checklist Addition

```markdown
## Pre-merge Checklist
- [ ] Tests pass
- [ ] Code reviewed
- [ ] **Documentation updated** (or N/A — explain why)
  - [ ] API docs (if endpoint changed)
  - [ ] User guides (if behavior changed)
  - [ ] Changelog entry added
  - [ ] OpenAPI spec updated (if API changed)
- [ ] No secrets in diff
```

---

## 10. Metrics & Quality Assurance

### Documentation Health Scorecard

Track monthly:

| Metric | Target | How to Measure |
|--------|--------|---------------|
| **Coverage** | 100% of public API endpoints documented | Script: compare `openapi.yaml` routes vs `docs/api/` |
| **Freshness** | <10% of docs past review date | Script: parse frontmatter `review_due` |
| **Accuracy** | 0 known inaccuracies | Customer-reported doc bugs |
| **Completeness** | All quickstart steps verified working | Monthly manual smoke test |
| **Duplication** | 0 duplicate files | Script: content similarity check |
| **Link health** | 0 broken links | CI: markdown link checker |
| **Customer satisfaction** | >4/5 "Was this helpful?" | Docs site feedback widget |

### Automated Quality Checks

```yaml
# Weekly cron in GitHub Actions
name: Docs Health
on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday 9 AM UTC
jobs:
  health:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check freshness
        run: node scripts/docs-freshness.js
      - name: Check broken links
        run: npx markdown-link-check docs/**/*.md
      - name: Check file sizes
        run: |
          find docs/ -name "*.md" -size +25k -exec echo "⚠️ Too large: {}" \;
      - name: Check frontmatter
        run: node scripts/docs-frontmatter-check.js
      - name: OpenAPI validation
        run: npx @redocly/cli lint docs/api/openapi.yaml
```

---

## 11. Scaling Plan

### Team Size: 1-3 (Current)

- All docs in the monorepo
- Markdown only, no fancy tooling
- Ernie owns all documentation
- GitHub PRs for review (even if self-merged)
- Focus: **Getting basics right** — index, quickstart, API ref, README

### Team Size: 3-10

- Deploy a docs site (Nextra on Vercel)
- Introduce `internal/` directory (or separate private repo)
- Assign doc ownership by area
- Add docs linting to CI
- Quarterly doc review meetings
- Customer-facing changelog with email notifications

### Team Size: 10-30

- Dedicated technical writer (part-time or contractor)
- Notion/Outline for internal knowledge base (meeting notes, RFCs, team processes)
- Intercom/Help Scout for customer help center
- AI-powered doc search
- Localization of key docs (aligns with i18n strategy)
- Community-contributed docs (open PRs welcome)

### Team Size: 30+

- Full documentation team
- Multi-language docs
- Video tutorials and walkthroughs
- Interactive API explorer
- Developer community forum
- Versioned docs (v1, v2) matching API versions
- SLA on doc freshness (24h for critical, 7d for standard)

---

## 12. Implementation Roadmap

### Phase 1: Foundation (Week 1-2) 🔴 Critical

| Task | Effort | Impact |
|------|--------|--------|
| Create `docs/index.md` — single entry point with navigation | 2h | 🔴 |
| Deduplicate files (root vs docs/) — establish single source | 4h | 🔴 |
| Rename all docs to `kebab-case.md` | 2h | 🟡 |
| Split oversized docs (>25 KB) into logical sections | 8h | 🔴 |
| Add frontmatter to all existing docs | 4h | 🟡 |
| Create `docs/glossary.md` | 1h | 🟡 |
| Add doc checkbox to PR template | 15m | 🟡 |

### Phase 2: Separation (Week 3-4) 🟡 Important

| Task | Effort | Impact |
|------|--------|--------|
| Create `internal/` directory structure | 2h | 🔴 |
| Move strategy docs, competitive intel, sales to `internal/` | 4h | 🔴 |
| Create engineering onboarding doc | 4h | 🟡 |
| Create runbook template + first 3 runbooks | 4h | 🟡 |
| Set up ADR directory with template + backfill 3-5 key decisions | 4h | 🟡 |
| Create doc authoring guide (this style guide, extracted) | 2h | 🟡 |

### Phase 3: Automation (Week 5-6) 🟢 Nice-to-Have

| Task | Effort | Impact |
|------|--------|--------|
| Set up markdown linting in CI | 2h | 🟡 |
| Set up broken link checker in CI | 1h | 🟡 |
| Auto-generate API reference from `openapi.yaml` | 4h | 🔴 |
| Build freshness checker script | 3h | 🟡 |
| Build frontmatter validator script | 2h | 🟡 |

### Phase 4: Docs Site (Week 7-8) 🟢 Growth Enabler

| Task | Effort | Impact |
|------|--------|--------|
| Set up Nextra project in `docs/` or separate `docs-site/` | 4h | 🔴 |
| Configure sidebar navigation | 2h | 🟡 |
| Deploy to `docs.doppeldown.com` | 2h | 🔴 |
| Add search (Flexsearch built-in) | 1h | 🟡 |
| Add "Was this helpful?" feedback widget | 2h | 🟡 |
| Add contextual help links in dashboard | 4h | 🟡 |

---

## Appendix A: Document Templates

### Template: How-To Guide

```markdown
---
title: "How to [Action]"
description: "[One-line description]"
category: guides
audience: external
last_updated: YYYY-MM-DD
author: [name]
review_due: YYYY-MM-DD
status: current
---

# How to [Action]

[1-2 sentence intro explaining what this guide helps you do and why you'd want to.]

## Prerequisites

- [What you need before starting]
- [Any required plan tier]

## Steps

### 1. [First Step]

[Explanation]

```bash
# Code example
```

### 2. [Second Step]

[Explanation]

### 3. [Third Step]

[Explanation]

## Verify It Works

[How to confirm the setup is correct]

## Troubleshooting

| Problem | Solution |
|---------|---------|
| [Common issue] | [Fix] |

## Related

- [Link to related guide]
- [Link to API reference]
```

### Template: Architecture Decision Record (ADR)

```markdown
---
title: "ADR-NNN: [Decision Title]"
category: adr
audience: internal
status: accepted  # proposed | accepted | deprecated | superseded
date: YYYY-MM-DD
deciders: [names]
superseded_by: ADR-NNN  # if applicable
---

# ADR-NNN: [Decision Title]

## Status

[Accepted | Proposed | Deprecated | Superseded by ADR-NNN]

## Context

[What is the issue we're facing? What forces are at play?]

## Decision

[What did we decide to do?]

## Consequences

### Positive
- [Good outcome]

### Negative
- [Tradeoff we accept]

### Neutral
- [Side effect]
```

### Template: Runbook

```markdown
---
title: "Runbook: [Incident/Task Name]"
category: runbook
audience: internal
last_updated: YYYY-MM-DD
author: [name]
review_due: YYYY-MM-DD
status: current
severity: [P1 | P2 | P3]
estimated_time: [e.g., 15 min]
---

# Runbook: [Incident/Task Name]

## When to Use This

[What symptoms or alerts trigger this runbook]

## Impact

[What is affected if this isn't resolved]

## Prerequisites

- [ ] Access to [system/tool]
- [ ] [Credentials/permissions needed]

## Steps

### 1. Assess

```bash
# Command to check status
```

[What to look for]

### 2. Mitigate

```bash
# Command to fix
```

### 3. Verify

```bash
# Command to verify fix
```

### 4. Follow Up

- [ ] Update incident log
- [ ] Notify stakeholders
- [ ] Create post-mortem if P1/P2

## Escalation

If the above doesn't work:
- Contact: [name/team]
- Slack: [channel]
- Phone: [number]

## Post-Incident

- [ ] Update this runbook with learnings
- [ ] File ticket for root cause fix
```

### Template: API Changelog Entry

```markdown
## [1.x.x] - YYYY-MM-DD

### Added
- `POST /api/endpoint` - [Description of new endpoint]
- New field `fieldName` on `GET /api/existing` response

### Changed
- `GET /api/endpoint` now returns [new behavior]
- Rate limit for free tier increased from X to Y

### Deprecated
- 🗑️ `GET /api/old-endpoint` — use `GET /api/new-endpoint` instead. Removal: YYYY-MM-DD.

### Fixed
- Fixed [bug description] in `POST /api/endpoint`

### Security
- [Security-related change]
```

---

## Appendix B: Immediate Deduplication Plan

The following files exist in multiple locations and must be consolidated:

| File | Location 1 | Location 2 | Keep |
|------|-----------|-----------|------|
| `INTEGRATIONS_ECOSYSTEM_STRATEGY.md` | Root | `docs/` | `internal/product/` |
| `COMPETITIVE_TRACKER.md` | `docs/` | `.planning/` | `internal/product/` |
| `FEATURE_BACKLOG.md` | `docs/` | `.planning/` | `internal/product/` |
| `PRODUCT_ROADMAP_STRATEGY.md` | `docs/` | `.planning/` | `internal/product/` |
| `error-handling.md` | `docs/` (lowercase) | `docs/ERROR_HANDLING.md` | Merge → `docs/api/errors.md` |
| `PENTEST_VULNERABILITY_STRATEGY.md` | Root (test) | `docs/` | `internal/engineering/` |

**Action:** Consolidate to the "Keep" location. Delete duplicates. Add redirects or symlinks if needed for backward compatibility.

---

## Appendix C: Docs That Should Exist But Don't

| Document | Priority | Category | Why |
|----------|----------|----------|-----|
| `docs/getting-started/concepts.md` | 🔴 | External | Users need to understand brands, threats, scans before using the API |
| `internal/engineering/architecture.md` | 🔴 | Internal | Exists in `.planning/codebase/` but not in a discoverable location |
| `internal/onboarding/new-engineer.md` | 🔴 | Internal | Critical for scaling the team |
| `docs/guides/scan-types.md` | 🟡 | External | Users don't know the difference between full, domain_only, social |
| `docs/security/data-handling.md` | 🟡 | External | Enterprise customers will ask |
| `internal/engineering/adr/` | 🟡 | Internal | No architectural decisions are recorded |
| `docs/guides/tier-limits.md` | 🟡 | External | Tier limits are scattered across multiple docs |
| `CONTRIBUTING.md` | 🟡 | External | No contributor guide exists |
| `internal/operations/runbooks/*` | 🟡 | Internal | No incident response procedures documented |
| `docs/glossary.md` | 🟢 | External | Terms like "typosquat", "homoglyph", "NRD" need definitions |

---

## Appendix D: Content Migration Map

### Root-level files → Target locations

| Current File | Target Location | Action |
|-------------|----------------|--------|
| `README.md` | Stay at root | Keep — link to docs |
| `DEPLOY.md` | `docs/self-hosting/` | Move |
| `LAUNCH_PLAN.md` | `internal/marketing/` | Move |
| `GTM_PLAYBOOK.md` | `internal/marketing/` | Move |
| `SEO_STRATEGY.md` | `internal/marketing/` | Move |
| `CONTENT_MARKETING_THOUGHT_LEADERSHIP_STRATEGY.md` | `internal/marketing/` | Move + split |
| `CUSTOMER_ACQUISITION_GROWTH_STRATEGY.md` | `internal/marketing/` | Move + split |
| `PARTNERSHIP_CHANNEL_STRATEGY.md` | `internal/business/` | Move + split |
| `RISK_INTELLIGENCE_THREAT_LANDSCAPE_STRATEGY.md` | `internal/product/` | Move + split |
| `ANALYTICS_BUSINESS_INTELLIGENCE_STRATEGY.md` | `internal/product/` | Move + split |
| `MOBILE_APP_STRATEGY.md` | `internal/product/` | Move + split |
| `ONBOARDING_ACTIVATION_STRATEGY.md` | `internal/product/` | Move + split |
| `USER_RESEARCH_FEEDBACK_STRATEGY.md` | `internal/product/` | Move + split |
| `COMPETITIVE_INTELLIGENCE_SYSTEM.md` | `internal/product/` | Move |
| `COMPETITIVE_INTELLIGENCE_QUICK_REFERENCE.md` | `internal/product/` | Move |
| `RADobson-Security-Audit-2026-02-03.md` | `internal/engineering/audits/` | Move |
| `OPTIMIZATION-SUMMARY.md` | `internal/engineering/` | Move |
| `ML_THREAT_DETECTION.md` | `internal/engineering/` | Move |

### docs/ files → Target locations

| Current File | Target Location | Action |
|-------------|----------------|--------|
| `QUICKSTART.md` | `docs/getting-started/quickstart.md` | Move |
| `API.md` | `docs/api/reference.md` | Move |
| `CHANGELOG.md` | `docs/api/changelog.md` | Move |
| `SDK_EXAMPLES.md` | `docs/sdk/` (split by language) | Move + split |
| `WEBHOOKS.md` | `docs/guides/webhooks.md` | Move |
| `ERROR_HANDLING.md` | `docs/api/errors.md` | Move |
| `openapi.yaml` | `docs/api/openapi.yaml` | Move |
| `PRICING_STRATEGY.md` | `internal/product/pricing.md` | Move (internal) |
| `FUNDRAISING_STRATEGY.md` | `internal/business/fundraising.md` | Move (internal) |
| `BRAND_POSITIONING_MESSAGING_STRATEGY.md` | `internal/marketing/brand.md` | Move (internal) |
| `COMPLIANCE_SECURITY_AUDIT.md` | `internal/engineering/compliance.md` | Move (internal) |
| `DEVX_STRATEGY.md` | `internal/engineering/devx.md` | Move (internal) |
| `DISASTER_RECOVERY_PLAN.md` | `internal/operations/disaster-recovery.md` | Move (internal) |
| `CUSTOMER_SUPPORT_SUCCESS_STRATEGY.md` | `internal/operations/support.md` | Move (internal) |
| `DATA_GOVERNANCE_PRIVACY_STRATEGY.md` | `internal/business/data-governance.md` | Move (internal) |
| `I18N_STRATEGY.md` | `internal/engineering/i18n.md` | Move (internal) |
| `PENTEST_VULNERABILITY_STRATEGY.md` | `internal/engineering/security/pentest.md` | Move (internal) |
| `TECHNICAL_DEBT_STRATEGY.md` | `internal/engineering/tech-debt.md` | Move (internal) |
| `MONITORING.md` | `internal/engineering/monitoring.md` | Move (internal) |
| `CACHING.md` | `internal/engineering/caching.md` | Move (internal) |
| `API_VERSIONING_STRATEGY.md` | `internal/engineering/api-versioning.md` | Move (internal) |
| `SCAN_WORKER_VPS_SETUP.md` | `docs/self-hosting/scan-worker.md` | Move (public) |

---

## Summary

This strategy transforms DoppelDown's documentation from a pile of files into a structured knowledge system. The key shifts:

1. **Audience separation** — Public docs for customers, internal docs for the team
2. **Discoverability** — Index pages, glossary, cross-references, search
3. **Quality enforcement** — Linting, link checking, freshness tracking, size limits
4. **Maintainability** — Ownership, review cycles, lifecycle management
5. **Scalability** — From markdown-in-repo to a full docs site to a knowledge platform

**Estimated total effort for Phase 1-2:** ~40 hours  
**Estimated total effort for Phase 3-4:** ~20 hours  
**ROI:** Every hour invested in documentation saves 10+ hours in support, onboarding, and miscommunication.
