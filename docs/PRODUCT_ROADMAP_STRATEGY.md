# DoppelDown — Product Roadmap & Feature Prioritization Strategy

*Comprehensive product strategy document | Created 2026-02-05*
*Last updated: 2026-02-05*

---

## Table of Contents

1. [Product Vision & North Star](#1-product-vision--north-star)
2. [Current State Assessment](#2-current-state-assessment)
3. [Competitive Landscape](#3-competitive-landscape)
4. [Customer Segments & Jobs-to-be-Done](#4-customer-segments--jobs-to-be-done)
5. [Feature Prioritization Framework](#5-feature-prioritization-framework)
6. [Product Roadmap: 12-Month Rolling Plan](#6-product-roadmap-12-month-rolling-plan)
7. [Feature Ideation Pipeline](#7-feature-ideation-pipeline)
8. [Validation & Discovery Process](#8-validation--discovery-process)
9. [Customer Feedback Loops](#9-customer-feedback-loops)
10. [Competitive Intelligence System](#10-competitive-intelligence-system)
11. [Delivery & Release Strategy](#11-delivery--release-strategy)
12. [Metrics & Success Criteria](#12-metrics--success-criteria)
13. [Risk Management](#13-risk-management)
14. [Appendices](#appendices)

---

## 1. Product Vision & North Star

### Vision Statement

**Make brand protection accessible to every business, not just enterprises.**

The brand protection industry is a $3.4B market dominated by tools costing $15K–$250K/year, sold exclusively through enterprise sales teams. Millions of SMBs, startups, agencies, and MSPs have zero protection because no product serves them. DoppelDown exists to close that gap — delivering AI-powered brand impersonation detection at price points that make "no protection" an unjustifiable choice.

### North Star Metric

**Monthly Active Protected Brands (MAPB)** — the number of brands with at least one completed scan in the trailing 30 days.

This metric captures:
- Customer acquisition (more accounts = more brands)
- Retention (inactive brands = churn signal)
- Expansion (customers adding more brands = upsell working)
- Product-market fit (brands being scanned = value being delivered)

### Strategic Pillars (3-Year)

| Pillar | Description | Why It Matters |
|--------|-------------|----------------|
| **Accessible Protection** | Self-serve signup, transparent pricing, free tier | Market entry — serve the underserved millions |
| **Intelligent Detection** | AI-powered threat scoring that separates signal from noise | Core differentiator — enterprise tools drown users in alerts |
| **Actionable Response** | From detection to takedown with minimal human effort | Retention — detection without action is useless |
| **Platform Ecosystem** | API, integrations, partnerships (MSPs, agencies) | Growth — become the platform, not just a tool |

### Product Principles

1. **Detection quality over detection quantity.** One accurate high-severity alert beats 100 noisy ones.
2. **Time-to-first-value under 5 minutes.** Sign up, add domain, see results — no onboarding calls.
3. **Transparent everything.** Pricing on the website. Scan methodology explained. No "contact sales" walls.
4. **Progressive complexity.** Simple for SMBs, powerful for enterprises. Same product, different depth.
5. **Revenue through value, not lock-in.** Customers stay because we're useful, not because migration is painful.

---

## 2. Current State Assessment

### What's Shipped (v1.0–v1.3)

| Capability | Status | Tier Availability |
|-----------|--------|-------------------|
| User auth (email/password, Supabase) | ✅ Shipped | All |
| Stripe subscription billing (Free/Starter/Pro/Enterprise) | ✅ Shipped | All |
| Brand CRUD with tier limits (1/3/10/∞) | ✅ Shipped | All |
| Domain variation generation (typosquats, homoglyphs, TLD swaps) | ✅ Shipped | All |
| Web scanning via search API | ✅ Shipped | All |
| Social media account scanning | ✅ Shipped | All |
| Evidence collection (screenshots, WHOIS, HTML) | ✅ Shipped | All |
| AI visual similarity analysis (GPT-4o Vision) | ✅ Shipped | All |
| AI phishing intent detection | ✅ Shipped | All |
| Smart threat scoring (domain 35%, visual 40%, phishing 25%) | ✅ Shipped | All |
| Rate-limited scanning queues (p-queue) | ✅ Shipped | All |
| Auto-retry with exponential backoff | ✅ Shipped | All |
| Real-time scan progress UI | ✅ Shipped | All |
| Manual scan quotas (Free: 1/week) | ✅ Shipped | All |
| Automated background scanning | ✅ Shipped | Starter+ |
| Email alerts with severity thresholds | ✅ Shipped | All |
| Scan summary & weekly digest emails | ✅ Shipped | All |
| In-app notifications | ✅ Shipped | All |
| Social platform selection per brand | ✅ Shipped | All (tier-limited) |
| NRD (Newly Registered Domain) monitoring | ✅ Shipped | Enterprise |
| Professional branding & landing page | ✅ Shipped | — |
| Dark mode with system preference | ✅ Shipped | — |
| Semantic color system (CSS variables) | ✅ Shipped | — |
| F-pattern dashboard with progressive disclosure | ✅ Shipped | — |
| Delete operations (swipe + menu) with audit logging | ✅ Shipped | All |
| PDF takedown reports | ✅ Shipped | All |

### Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, React 18
- **Backend:** Next.js API routes, Supabase (PostgreSQL + Auth + RLS + Storage)
- **Payments:** Stripe (subscriptions, checkout)
- **AI:** OpenAI Vision API (GPT-4o-mini), Claude (analysis)
- **Infrastructure:** Vercel (hosting), p-queue (rate limiting), Redis (caching)
- **Email:** Resend / Nodemailer

### Known Technical Debt

| Item | Severity | Impact |
|------|----------|--------|
| Zero automated test coverage for delete operations | Medium | Risk of regression on critical CRUD paths |
| OpenAI Vision endpoint API path may need fixing | Medium | Could break AI analysis silently |
| `alert()` for error feedback instead of toast | Low | Poor UX for errors |
| No undo after delete | Low | User recovery requires support |
| ErrorMessage component orphaned | Low | Dead code |
| `/auth/reset-password` Suspense boundary warning | Low | Console noise |
| Storage cleanup best-effort (orphaned files) | Low | Slow storage cost accumulation |

### Revenue State

- **Current:** Pre-revenue (Product Hunt launch imminent)
- **Pricing:** Free ($0) → Starter ($49/mo) → Professional ($149/mo) → Enterprise ($249/mo)
- **Go-to-market:** Cold outreach + Product Hunt launch + community engagement

---

## 3. Competitive Landscape

### Market Positioning Map

```
                        HIGH PRICE ($50K+/yr)
                              │
        Bolster ──────────────┼──────────── BrandShield
        Allure Security       │              Red Points
        PhishLabs             │              MarkMonitor
                              │
   NARROW SCOPE ──────────────┼──────────── BROAD SCOPE
   (domain monitoring only)   │         (domains + social +
                              │          marketplace + legal)
                              │
        dnstwist (OSS) ───────┼──────── ★ DoppelDown ★
        PhishTank (free)      │              
        URLScan.io            │              
                              │
                        LOW PRICE (<$300/mo)
```

### Competitive Analysis

| Competitor | Price Range | Strengths | Weaknesses | DoppelDown Advantage |
|-----------|------------|-----------|------------|---------------------|
| **BrandShield** | $15K–$100K/yr | Comprehensive (domains + social + marketplace), legal takedowns | Enterprise-only, no self-serve, opaque pricing | 100x cheaper, self-serve, transparent pricing |
| **Red Points** | $50K–$250K/yr | Marketplace monitoring (Amazon, eBay), automated enforcement | Extremely expensive, enterprise sales cycle | Accessible to SMBs, no sales call needed |
| **Bolster** | $20K–$80K/yr | Real-time phishing detection, fast takedowns | No SMB tier, requires onboarding | Instant time-to-value, free tier |
| **MarkMonitor (Clarivate)** | $30K–$200K/yr | Domain registrar (direct takedown power), deep expertise | Slow, bureaucratic, designed for Fortune 500 | Speed, modern UX, AI-first approach |
| **PhishLabs (Fortra)** | $25K+/yr | SOC-as-a-service, human analysts | Human bottleneck, expensive | AI automation, instant results |
| **Allure Security** | Undisclosed | Real-time phishing page detection | Narrow scope, no public pricing | Broader scope, transparent |
| **dnstwist** | Free (OSS) | Domain generation algorithms, free | CLI only, no monitoring, no AI analysis, no UI | Full SaaS wrapper, AI scoring, continuous monitoring |
| **urlscan.io** | Free/Pro | URL analysis, community intel | Not brand-specific, reactive not proactive | Proactive monitoring, brand-centric |

### Competitive Moats to Build

1. **Data moat:** Accumulate scan data across thousands of brands → improve AI threat models → better detection → more customers → more data (flywheel)
2. **Integration moat:** Deep integrations with MSP/security tools → switching cost → retention
3. **Price moat:** Operational efficiency enables sustainable low pricing → enterprise competitors can't match without cannibalizing revenue
4. **Community moat:** Free tier users contribute to threat intelligence → enriched data for paid tiers

---

## 4. Customer Segments & Jobs-to-be-Done

### Primary Segments

#### Segment 1: SMB Brand Owners (Initial Target)
- **Who:** Businesses with 10–500 employees, recognizable local/regional brands
- **Budget:** $50–$250/month for security tools
- **Pain:** "I don't know if someone is impersonating my brand right now"
- **JTBD:** "Help me know instantly when someone creates a fake version of my brand, and help me make it stop"
- **Buying trigger:** Customer reports phishing email using their brand, or discovers a lookalike website
- **Tier fit:** Starter ($49/mo) → Professional ($149/mo) as they add brands

#### Segment 2: MSPs & MSSPs (High-Value Partners)
- **Who:** Managed service providers serving 20–200 client companies
- **Budget:** Pass-through with markup ($100–$500/client/month)
- **Pain:** "I need a brand protection offering for my clients but enterprise tools are too expensive"
- **JTBD:** "Give me a multi-tenant platform I can white-label and offer to clients as a managed service"
- **Buying trigger:** Client asks about brand protection, competitor MSP offers it
- **Tier fit:** Enterprise ($249/mo) per client, or custom MSP pricing

#### Segment 3: Digital Agencies & Brand Managers
- **Who:** Marketing/PR agencies managing brand reputation for clients
- **Budget:** Absorbed into retainer ($200–$500/month per client)
- **Pain:** "I need to proactively protect my clients' brands, not just react to incidents"
- **JTBD:** "Monitor all my clients' brands from one dashboard and generate professional reports for them"
- **Buying trigger:** Client brand crisis, competitive differentiation for agency
- **Tier fit:** Professional ($149/mo) → Enterprise ($249/mo)

#### Segment 4: E-commerce Brands
- **Who:** DTC brands, Shopify sellers, marketplace sellers with brand equity
- **Budget:** $50–$300/month (directly tied to fraud prevention ROI)
- **Pain:** "Counterfeit sites are stealing my customers and damaging trust"
- **JTBD:** "Find every fake store selling my products and help me shut them down"
- **Buying trigger:** Customer complaint about counterfeit product, fake site appearing in Google ads
- **Tier fit:** Starter → Professional

#### Segment 5: Enterprise Security Teams (Stretch)
- **Who:** Companies with 500+ employees, dedicated security/brand teams
- **Budget:** $5K–$50K/year
- **Pain:** "Our current tool is too expensive / too slow / generates too many false positives"
- **JTBD:** "Integrate brand monitoring into our security stack with API access and SIEM integration"
- **Buying trigger:** Contract renewal for expensive incumbent, security audit recommendation
- **Tier fit:** Enterprise ($249/mo) → Custom

### Jobs-to-be-Done Hierarchy

```
CORE JOB: Protect my brand from impersonation and fraud

├── DETECT threats to my brand
│   ├── Find lookalike domains targeting my brand
│   ├── Identify phishing sites using my brand
│   ├── Discover fake social media accounts
│   ├── Monitor for newly registered suspicious domains
│   └── Alert me when new threats appear
│
├── ASSESS threat severity
│   ├── Distinguish real threats from benign registrations
│   ├── Prioritize which threats need immediate action
│   ├── Understand the risk to my customers/revenue
│   └── Track threat trends over time
│
├── RESPOND to confirmed threats
│   ├── Generate takedown evidence packages
│   ├── Submit takedowns to registrars/platforms
│   ├── Track takedown status and success
│   └── Document resolution for compliance
│
├── REPORT on brand protection status
│   ├── Show ROI to leadership/clients
│   ├── Quantify threats prevented
│   ├── Demonstrate compliance posture
│   └── Benchmark against industry
│
└── INTEGRATE with existing workflows
    ├── Alert my team via existing channels (Slack/Teams/PagerDuty)
    ├── Feed into our SIEM/security tools
    ├── Connect with our ticketing system
    └── API access for custom automation
```

---

## 5. Feature Prioritization Framework

### The RICE-V Framework (Adapted for DoppelDown)

We use a modified RICE framework with an added **Vision alignment** dimension:

| Dimension | Description | Scale | Weight |
|-----------|-------------|-------|--------|
| **R**each | How many customers/prospects does this impact? | 1–10 | 25% |
| **I**mpact | How much does it move the needle per customer? (retention, conversion, revenue) | 1–10 | 25% |
| **C**onfidence | How sure are we this will work? (evidence, validation) | 1–10 | 15% |
| **E**ffort | How much work is this? (inverse: lower effort = higher score) | 1–10 (inverted) | 20% |
| **V**ision | How well does this align with long-term strategic pillars? | 1–10 | 15% |

**RICE-V Score = (R×0.25 + I×0.25 + C×0.15 + E_inv×0.20 + V×0.15) × 10**

### Scoring Rubrics

#### Reach (R)
| Score | Definition |
|-------|-----------|
| 10 | Affects all customers (every user benefits) |
| 8 | Affects majority of target segment (>60% of users) |
| 6 | Affects a key segment (MSPs OR SMBs) |
| 4 | Affects a niche segment or specific tier |
| 2 | Affects a handful of users or single account |
| 1 | Internal/operational improvement only |

#### Impact (I)
| Score | Definition |
|-------|-----------|
| 10 | Unlocks new revenue stream or eliminates top churn reason |
| 8 | Significantly improves conversion or retention (measurable) |
| 6 | Clear value add — customers would be disappointed if removed |
| 4 | Nice-to-have improvement, moderate user satisfaction impact |
| 2 | Minor polish or incremental improvement |
| 1 | Barely noticeable to end users |

#### Confidence (C)
| Score | Definition |
|-------|-----------|
| 10 | Validated with paying customers (they asked for it and would pay) |
| 8 | Multiple prospects/users requested it independently |
| 6 | Strong competitive evidence (competitors have it, customers expect it) |
| 4 | Logical inference from user behavior data |
| 2 | Founder intuition / industry trend |
| 1 | Pure speculation |

#### Effort (E) — Inverted for scoring
| Score | Actual Effort | Inverted Score |
|-------|--------------|----------------|
| 1 | 4+ weeks | 1 |
| 2 | 2-4 weeks | 3 |
| 3 | 1-2 weeks | 5 |
| 4 | 3-5 days | 7 |
| 5 | 1-2 days | 9 |
| 6 | < 1 day | 10 |

#### Vision (V)
| Score | Definition |
|-------|-----------|
| 10 | Core to a strategic pillar, required for vision |
| 8 | Strongly supports a strategic pillar |
| 6 | Moderately aligned, builds toward vision |
| 4 | Tangentially related |
| 2 | Neutral — doesn't help or hurt vision |
| 1 | Potentially conflicts with vision (technical debt, wrong direction) |

### Prioritization Tiers

| Tier | RICE-V Score | Action |
|------|-------------|--------|
| **P0 — Now** | 7.5+ | Build in current/next sprint. Revenue or retention critical. |
| **P1 — Next** | 6.0–7.4 | Build in next 1-2 milestones. Important but not urgent. |
| **P2 — Later** | 4.5–5.9 | Backlog. Build when higher-priority work is done. |
| **P3 — Maybe** | 3.0–4.4 | Park. Revisit quarterly. May never build. |
| **P4 — No** | <3.0 | Explicitly rejected. Document why for future reference. |

---

## 6. Product Roadmap: 12-Month Rolling Plan

### Horizon Model

| Horizon | Timeframe | Focus | Certainty |
|---------|-----------|-------|-----------|
| **H1: Now** | Months 1–3 (Feb–Apr 2026) | Launch, validate, first revenue | High (80%+ committed) |
| **H2: Next** | Months 4–6 (May–Jul 2026) | Retention, expansion, integrations | Medium (50% committed) |
| **H3: Later** | Months 7–12 (Aug 2026–Jan 2027) | Platform, partnerships, scale | Low (directional only) |

---

### H1: Launch & First Revenue (Feb–Apr 2026)

**Theme: "Prove the product sells"**

**Goals:**
- Launch on Product Hunt → 50+ signups
- First 10 paying customers
- Sub-5-minute time-to-first-value validated
- Core conversion funnel measured and optimized

#### v1.4 — Launch Readiness (Target: Feb 2026)

| Feature | RICE-V | Priority | Effort |
|---------|--------|----------|--------|
| **Toast notification system** (replace `alert()`) | 7.8 | P0 | 1-2 days |
| **Onboarding flow** (guided first brand + scan) | 8.2 | P0 | 3-5 days |
| **Mobile responsiveness audit & fixes** | 7.5 | P0 | 3-5 days |
| **SMTP/email delivery hardening** (Resend production) | 8.0 | P0 | 1-2 days |
| **Analytics instrumentation** (key funnel events) | 7.6 | P0 | 2-3 days |
| **Error boundary pages** (500, rate limit, etc.) | 6.5 | P1 | 1-2 days |
| **Resolve known TypeScript errors** (pre-existing) | 5.8 | P1 | 1-2 days |

**Milestone exit criteria:**
- [ ] Product Hunt listing live
- [ ] Onboarding converts 60%+ of signups to first scan
- [ ] Email delivery confirmed (check-email flow works)
- [ ] Mobile experience doesn't break core flows
- [ ] GA4 tracking signup → first scan → first threat viewed funnel

#### v1.5 — Conversion Optimization (Target: Mar 2026)

| Feature | RICE-V | Priority | Effort |
|---------|--------|----------|--------|
| **Alert resolution workflow** (resolve/dismiss/archive threats) | 8.4 | P0 | 1 week |
| **Threat detail page** (deep-dive per threat with evidence) | 7.9 | P0 | 1 week |
| **Upgrade prompts** (contextual upsell at tier limits) | 8.1 | P0 | 3-5 days |
| **Scan results improvement** (richer threat cards, evidence preview) | 7.2 | P1 | 3-5 days |
| **Social proof on landing page** (real testimonials, usage stats) | 6.8 | P1 | 1-2 days |
| **Blog/SEO content engine** (programmatic brand protection articles) | 6.5 | P1 | 1 week |

**Milestone exit criteria:**
- [ ] Users can resolve/dismiss threats (not just view)
- [ ] Upgrade conversion rate measured (free → paid)
- [ ] At least 3 customer testimonials collected
- [ ] First organic search traffic from blog content

#### v1.6 — Retention & Engagement (Target: Apr 2026)

| Feature | RICE-V | Priority | Effort |
|---------|--------|----------|--------|
| **Slack notification integration** | 8.0 | P0 | 3-5 days |
| **Threat trend dashboard** (threats over time, severity trends) | 7.3 | P1 | 1 week |
| **Brand health score** (aggregate protection metric) | 7.0 | P1 | 3-5 days |
| **Improved PDF reports** (branded, executive summary, trend data) | 6.8 | P1 | 3-5 days |
| **Customer feedback widget** (in-app feedback collection) | 6.5 | P1 | 1-2 days |
| **Scan history & comparison** (before/after scan diffs) | 6.2 | P2 | 1 week |

**Milestone exit criteria:**
- [ ] Week-4 retention rate >40% for paid customers
- [ ] At least 5 customers using Slack integration
- [ ] NPS collected from first 20 customers
- [ ] Threat resolution rate >50% (threats are being acted on)

---

### H2: Retention & Expansion (May–Jul 2026)

**Theme: "Make customers successful and grow accounts"**

**Goals:**
- 50+ paying customers
- Net revenue retention >100% (expansion > churn)
- MSP partner pilot launched
- API in beta

#### v1.7 — Integrations & API (Target: May 2026)

| Feature | RICE-V | Priority | Effort |
|---------|--------|----------|--------|
| **Microsoft Teams integration** | 7.5 | P0 | 3-5 days |
| **REST API v1** (read-only: brands, threats, scans) | 8.3 | P0 | 2 weeks |
| **Webhook notifications** (threat.created, scan.completed) | 7.8 | P0 | 1 week |
| **API key management UI** | 7.2 | P1 | 3-5 days |
| **PagerDuty / OpsGenie integration** | 6.5 | P1 | 3-5 days |
| **Zapier integration** (via webhooks) | 6.2 | P2 | 1 week |

#### v1.8 — Takedown Workflows (Target: Jun 2026)

| Feature | RICE-V | Priority | Effort |
|---------|--------|----------|--------|
| **Automated takedown request generation** (registrar templates) | 8.5 | P0 | 2 weeks |
| **Takedown status tracking** (pending/submitted/resolved/failed) | 8.0 | P0 | 1 week |
| **Google Safe Browsing submission** | 7.5 | P0 | 3-5 days |
| **Social platform report generation** (Twitter/FB/IG report links) | 7.0 | P1 | 3-5 days |
| **Evidence package export** (zip with screenshots, WHOIS, HTML) | 6.8 | P1 | 3-5 days |

#### v1.9 — Team & MSP Features (Target: Jul 2026)

| Feature | RICE-V | Priority | Effort |
|---------|--------|----------|--------|
| **Team accounts** (invite members, role-based access) | 8.2 | P0 | 2-3 weeks |
| **MSP multi-tenant dashboard** (view all client brands) | 8.0 | P0 | 2-3 weeks |
| **Activity log per team** (who did what, when) | 6.8 | P1 | 1 week |
| **Custom branding for reports** (white-label PDF header/footer) | 6.5 | P1 | 3-5 days |
| **Bulk brand import** (CSV upload for MSPs) | 6.2 | P2 | 3-5 days |

---

### H3: Platform & Scale (Aug 2026–Jan 2027)

**Theme: "Become the platform for accessible brand protection"**

**Goals:**
- 200+ paying customers
- MSP channel generating 30%+ of new revenue
- API usage growing independently
- Series of strategic partnerships established

#### Planned Capabilities (Directional)

| Capability | Quarter | Strategic Pillar |
|-----------|---------|-----------------|
| **SIEM integration** (Splunk, Sentinel, QRadar export) | Q3 2026 | Platform Ecosystem |
| **Marketplace monitoring** (Amazon, eBay, Shopify fakes) | Q3 2026 | Intelligent Detection |
| **Custom scanning rules** (user-defined detection patterns) | Q3 2026 | Intelligent Detection |
| **OAuth / SSO** (Google, Microsoft, SAML) | Q4 2026 | Accessible Protection |
| **Managed takedown service** (human-assisted for premium tier) | Q4 2026 | Actionable Response |
| **Threat intelligence sharing** (anonymized cross-customer intel) | Q4 2026 | Intelligent Detection |
| **White-label portal** (full MSP/agency rebrand) | Q4 2026 | Platform Ecosystem |
| **Mobile app** (iOS/Android, push notifications) | Q1 2027 | Accessible Protection |
| **Partner marketplace** (third-party integrations) | Q1 2027 | Platform Ecosystem |
| **Compliance reporting** (SOC 2, ISO 27001 evidence) | Q1 2027 | Actionable Response |

---

## 7. Feature Ideation Pipeline

### Idea Sources (Continuous)

```
                    ┌─────────────────┐
                    │  IDEA BACKLOG   │
                    │  (Notion/GitHub) │
                    └───────┬─────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────┴────┐      ┌──────┴──────┐     ┌─────┴─────┐
   │ External │      │  Internal   │     │ Strategic │
   │ Sources  │      │  Sources    │     │ Analysis  │
   └────┬────┘      └──────┬──────┘     └─────┬─────┘
        │                   │                   │
  ┌─────┴─────┐    ┌───────┴───────┐   ┌──────┴──────┐
  │• Customer  │    │• Usage data   │   │• Competitor  │
  │  requests  │    │• Support      │   │  features    │
  │• Prospect  │    │  tickets      │   │• Market      │
  │  objections│    │• Churn        │   │  trends      │
  │• Community │    │  interviews   │   │• Adjacent    │
  │  discussions│   │• Team ideas   │   │  market      │
  │• PH/HN/   │    │• Tech debt    │   │  analysis    │
  │  Reddit    │    │  observations │   │• Regulatory  │
  │• Sales     │    │• Dogfooding   │   │  changes     │
  │  objections│    │               │   │              │
  └────────────┘    └───────────────┘   └─────────────┘
```

### Idea Capture Template

Every feature idea gets captured with minimum viable context:

```markdown
## Feature Idea: [Name]

**Source:** [customer request / competitor / internal / community / data]
**Requester:** [who asked, if applicable]
**Date:** [when captured]

### Problem Statement
[What pain does this solve? For whom?]

### Proposed Solution
[High-level approach — 2-3 sentences max]

### Evidence
[Why do we believe this matters? Links, quotes, data points]

### Initial RICE-V Estimate
- Reach: [1-10]
- Impact: [1-10]
- Confidence: [1-10]
- Effort: [estimated time]
- Vision: [1-10]
- **Score: [calculated]**

### Open Questions
- [What do we need to learn before building?]
```

### Ideation Cadence

| Activity | Frequency | Participants | Output |
|----------|-----------|-------------|--------|
| Backlog grooming | Weekly (30 min) | Richard + Ernie | Scored and sorted backlog |
| Competitive scan | Bi-weekly | Ernie (automated) | Competitor update report |
| Customer insight review | Weekly | Richard + Ernie | Patterns, themes, requests |
| Strategic review | Monthly (60 min) | Richard | Roadmap adjustments |
| Big-picture vision check | Quarterly | Richard | Vision/pillar validation |

---

## 8. Validation & Discovery Process

### Validation Ladder

Every feature passes through increasing levels of validation before significant investment:

```
Level 0: IDEA CAPTURED
    │ Bar: Someone articulated a problem worth solving
    │ Action: Add to backlog with initial RICE-V
    ▼
Level 1: PROBLEM VALIDATED
    │ Bar: 3+ independent signals that this problem exists
    │ Action: Customer interviews, support ticket patterns, competitor analysis
    │ Output: Problem statement with evidence
    ▼
Level 2: SOLUTION SHAPED
    │ Bar: Approach defined, trade-offs understood, effort estimated
    │ Action: Design spike, technical feasibility check, prototype/mockup
    │ Output: Solution brief with wireframes
    ▼
Level 3: DEMAND VALIDATED
    │ Bar: Prospective users confirm they'd use this solution
    │ Action: Show mockups to 3-5 target users, measure enthusiasm
    │ Output: User feedback notes, confidence adjustment
    ▼
Level 4: BUILD
    │ Bar: RICE-V score justifies investment relative to alternatives
    │ Action: Full implementation
    │ Output: Shipped feature
    ▼
Level 5: IMPACT MEASURED
    │ Bar: Feature achieves its success criteria
    │ Action: Usage analytics, customer feedback, metric movement
    │ Output: Impact report (keep, iterate, or kill)
```

### Lightweight Validation Techniques

| Technique | When to Use | Effort | Signal Quality |
|-----------|-------------|--------|----------------|
| **Fake door test** | Test demand before building | 1 day | High (real behavior) |
| **Wizard of Oz** | Validate workflow before automating | 1-3 days | High (real usage) |
| **Concierge MVP** | Validate willingness-to-pay | Manual work | Very High |
| **Customer interview** | Understand problem deeply | 30 min × 5 | Medium-High |
| **Landing page test** | Validate messaging/positioning | 1 day | Medium |
| **Competitor teardown** | Learn from others' solutions | 2-4 hours | Medium |
| **Usage data analysis** | Find friction/drop-off points | 1-2 hours | High (behavioral) |
| **Support ticket mining** | Find common pain points | 1 hour | High (real complaints) |

### Feature Kill Criteria

Features should be killed (or sent back to ideation) when:

1. **Usage < 10% of target segment** after 30 days of availability
2. **Zero correlation** with retention or conversion metrics
3. **Support cost** exceeds value delivered (more confused users than happy ones)
4. **Market shifted** — the problem it solves is no longer relevant
5. **Better alternative** discovered during development

---

## 9. Customer Feedback Loops

### Feedback Collection Points

```
CUSTOMER JOURNEY          FEEDBACK MECHANISM
─────────────────         ──────────────────
Landing page visit   →    Hotjar heatmaps, GA4 bounce rate
Sign up              →    Activation survey ("What brought you here?")
First scan           →    In-app NPS prompt (after first threat found)
Week 1               →    Automated email: "How's your experience?"
Day 30               →    In-app CSAT survey
Upgrade              →    Brief survey: "Why did you upgrade?"
Churn                →    Cancellation survey (required, 3 questions)
Support ticket       →    Post-resolution CSAT
Feature request      →    In-app feedback widget → backlog
Ongoing              →    Quarterly NPS survey (email)
```

### Feedback Processing Workflow

```
Raw Feedback ──→ Capture ──→ Categorize ──→ Prioritize ──→ Act ──→ Close Loop

1. CAPTURE: All feedback logged in single system (GitHub Issues or Notion)
   - Source, date, customer tier, verbatim quote, sentiment

2. CATEGORIZE: Tag with taxonomy
   - Type: bug | feature-request | UX-friction | pricing | praise | churn-reason
   - Segment: SMB | MSP | agency | e-commerce | enterprise
   - Area: scanning | threats | reports | billing | onboarding | integrations

3. PRIORITIZE: Roll up into themes
   - Weekly: review new feedback, identify patterns
   - Monthly: update feature backlog RICE-V scores based on feedback volume

4. ACT: Feed into roadmap
   - 3+ independent requests for same feature → validate at Level 1
   - Churn reason pattern → immediate investigation
   - Bug pattern → hotfix queue

5. CLOSE LOOP: Tell customers what you did
   - Feature shipped → email customers who requested it
   - Bug fixed → respond to original ticket
   - Decided not to build → explain reasoning if customer asked
```

### Key Surveys

#### Activation Survey (Post-First-Scan)
```
1. How did you hear about DoppelDown?
   □ Product Hunt  □ Google  □ Reddit  □ Referral  □ LinkedIn  □ Other: ___

2. What's the #1 thing you're hoping DoppelDown helps you with?
   [Open text, 1-2 sentences]

3. How long have you been concerned about brand impersonation?
   □ Just discovered it  □ Weeks  □ Months  □ Years
```

#### Cancellation Survey (Required at Churn)
```
1. Primary reason for cancelling:
   □ Too expensive  □ Not detecting real threats  □ Too many false positives
   □ Missing features (which? ___)  □ Switched to competitor (which? ___)
   □ No longer need it  □ Other: ___

2. What would have made you stay? [Open text]

3. Would you come back if we [top feature gap]?
   □ Yes  □ Maybe  □ No
```

#### Quarterly NPS
```
On a scale of 0-10, how likely are you to recommend DoppelDown to a colleague?
[0 ─────────────────── 10]

Why did you give that score? [Open text]
```

### Feedback Metrics to Track

| Metric | Target | Frequency |
|--------|--------|-----------|
| NPS | >40 | Quarterly |
| CSAT (post-support) | >4.2/5 | Per ticket |
| Feature request volume | Track trend | Weekly |
| Top 5 feature requests | Identify | Monthly |
| Churn reason #1 | Address within 30 days | Monthly |
| Time to close feedback loop | <7 days for bugs, <30 days for features | Ongoing |

---

## 10. Competitive Intelligence System

### Monitoring Cadence

| Activity | Frequency | Method | Owner |
|----------|-----------|--------|-------|
| Competitor pricing check | Monthly | Manual check of pricing pages | Ernie |
| Competitor feature changelog | Bi-weekly | Monitor release notes, blogs, Twitter | Ernie |
| New entrant scan | Monthly | Search "brand protection SaaS launched", Product Hunt, G2 | Ernie |
| Competitor review mining | Monthly | G2, Capterra, TrustRadius reviews | Ernie |
| Industry report review | Quarterly | Gartner, Forrester, analyst blogs | Richard + Ernie |
| Win/loss analysis | Per deal | Capture why prospects chose us or didn't | Richard |

### Competitor Tracking Dashboard

Maintain a living document tracking key competitors:

```markdown
## Competitor: [Name]
**Last checked:** [date]

### Pricing
- [Current pricing tiers and amounts]

### Recent Changes
- [Date]: [What changed]

### Strengths (relative to us)
- [Bullet list]

### Weaknesses (relative to us)
- [Bullet list]

### Their Customers Say (from reviews)
- 👍 [Positive themes]
- 👎 [Negative themes — these are our opportunities]

### Strategic Response
- [What we should do about this competitor]
```

### Competitive Response Matrix

| If Competitor Does... | Our Response |
|----------------------|-------------|
| Launches SMB tier (price match) | Accelerate integration moat, emphasize AI quality |
| Ships feature we planned | Evaluate — build our version or differentiate on another axis |
| Acquires company in our space | Assess market impact, may create disruption opportunity |
| Gets major funding | Increase speed, focus on conversion efficiency |
| Raises prices | Highlight our pricing advantage in marketing |
| Ships API/integrations | Accelerate our API roadmap |
| Opens free tier | Differentiate on detection quality and depth |

---

## 11. Delivery & Release Strategy

### Release Types

| Type | Cadence | Scope | Testing Required |
|------|---------|-------|-----------------|
| **Hotfix** | As needed | Critical bug, security issue | Smoke test + manual verification |
| **Patch** | Weekly | Bug fixes, minor improvements | Regression test on affected area |
| **Minor** | Bi-weekly | New features, significant changes | Full regression + feature-specific tests |
| **Major** | Monthly | New capabilities, breaking changes | Full E2E suite + beta testing |

### Feature Flag Strategy

Adopt feature flags for anything that touches:
- Revenue (pricing, checkout, upgrade flows)
- Core detection (scanning pipeline, AI scoring)
- New user segments (MSP features, team features)

```typescript
// Example feature flag pattern
const FEATURE_FLAGS = {
  'slack-integration': { enabled: true, tiers: ['starter', 'professional', 'enterprise'] },
  'api-v1': { enabled: false, tiers: ['professional', 'enterprise'], beta: true },
  'team-accounts': { enabled: false, tiers: ['enterprise'], beta: true },
  'takedown-automation': { enabled: false, tiers: ['professional', 'enterprise'] },
} as const
```

### Release Communication

| Audience | Channel | Content |
|----------|---------|---------|
| All users | In-app notification + changelog | What's new, how to use it |
| Affected segment | Email | Feature announcement, relevant to their use case |
| Requesters | Personal email | "You asked, we built" — close the feedback loop |
| Public | Blog post + social | Monthly roundup, thought leadership angle |
| MSP partners | Partner newsletter | How new features benefit their clients |

### Rollback Protocol

1. **Detect:** Monitoring alerts, error spike, customer reports
2. **Assess:** Is this affecting >5% of users? Is it revenue-impacting?
3. **Decide:** Hotfix forward (if simple) or revert (if complex/urgent)
4. **Execute:** `git revert` + deploy, or disable feature flag
5. **Communicate:** Status page update, affected user notification
6. **Post-mortem:** Within 48 hours, document root cause and prevention

---

## 12. Metrics & Success Criteria

### Metric Hierarchy

```
NORTH STAR: Monthly Active Protected Brands (MAPB)
│
├── ACQUISITION
│   ├── Monthly signups (by source)
│   ├── Signup → First scan conversion rate
│   ├── First scan → First threat viewed rate
│   └── Landing page conversion rate
│
├── ACTIVATION
│   ├── Time to first scan (target: <5 min)
│   ├── Onboarding completion rate (target: >60%)
│   └── Brands created per account (first week)
│
├── RETENTION
│   ├── Week-1 retention (target: >60%)
│   ├── Month-1 retention (target: >40%)
│   ├── Month-3 retention (target: >30%)
│   ├── Daily/weekly active users
│   └── Scan frequency per brand
│
├── REVENUE
│   ├── MRR (Monthly Recurring Revenue)
│   ├── ARPU (Average Revenue Per User)
│   ├── Free → Paid conversion rate (target: >5%)
│   ├── Net revenue retention (target: >100%)
│   ├── Churn rate (target: <5% monthly)
│   └── LTV:CAC ratio (target: >3:1)
│
├── ENGAGEMENT
│   ├── Threats resolved per user per month
│   ├── Reports generated per user per month
│   ├── Alerts configured (% of users)
│   ├── Integration adoption (% with Slack/Teams/API)
│   └── Brands per paid account (expansion signal)
│
└── PRODUCT QUALITY
    ├── Threat detection accuracy (precision/recall)
    ├── False positive rate (target: <15%)
    ├── Scan completion rate (target: >95%)
    ├── Page load time (target: <2s)
    ├── Error rate (target: <0.5%)
    └── NPS (target: >40)
```

### Milestone-Specific Success Criteria

| Milestone | Key Metric | Target | Measurement |
|-----------|-----------|--------|-------------|
| v1.4 (Launch) | Signups | 50+ from PH launch week | GA4 + Supabase |
| v1.5 (Conversion) | Free→Paid rate | >3% | Stripe + Supabase |
| v1.6 (Retention) | Month-1 retention | >40% | Cohort analysis |
| v1.7 (API) | API active accounts | 10+ | API key usage logs |
| v1.8 (Takedowns) | Takedown attempts | 20+/month across all users | Feature usage |
| v1.9 (Teams) | Multi-user accounts | 5+ | Account analysis |

---

## 13. Risk Management

### Product Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| **AI costs spike** with user growth | High | High | Batch API calls, cache results, negotiate volume pricing, consider open-source models |
| **Detection quality insufficient** for paying users | Medium | Critical | Invest in precision metrics, customer feedback on false positives, A/B test scoring models |
| **Enterprise competitor launches SMB tier** | Medium | High | Move fast on integrations (switching cost), build community moat, deepen AI quality |
| **Scan API dependencies break** (search API, screenshot) | Medium | High | Multi-provider fallback, graceful degradation, status monitoring |
| **Slow customer acquisition** post-launch | High | High | Diversify channels (SEO, partnerships, content), reduce CAC through referral program |
| **Feature bloat** dilutes focus | Medium | Medium | Strict RICE-V discipline, quarterly pruning, kill unused features |
| **Key person risk** (solo founder) | High | Critical | Document everything, automate operations, build toward hiring |
| **Regulatory change** (GDPR, data privacy) | Low | Medium | Minimize PII storage, document data flows, Privacy Policy review quarterly |

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| **Supabase outage** takes down entire product | Low | Critical | Health checks, graceful error pages, evaluate multi-region when profitable |
| **Vercel cold starts** affect scan performance | Medium | Medium | Edge functions, optimize scan pipeline startup |
| **Rate limit exhaustion** on external APIs | Medium | High | Multi-provider rotation, aggressive caching, queue management |
| **Data breach / security incident** | Low | Critical | RLS everywhere, audit logging, security headers (Helmet), penetration testing |

---

## Appendices

### Appendix A: Feature Backlog (Full Scored List)

| Feature | R | I | C | E (inv) | V | Score | Priority |
|---------|---|---|---|---------|---|-------|----------|
| Onboarding flow | 10 | 8 | 8 | 7 | 8 | **8.2** | P0 |
| Automated takedown generation | 8 | 10 | 6 | 3 | 10 | **7.5** | P0 |
| Alert resolution workflow | 10 | 9 | 8 | 5 | 8 | **8.4** | P0 |
| REST API v1 | 6 | 9 | 7 | 3 | 10 | **7.0** | P0 |
| Team accounts | 6 | 9 | 7 | 3 | 8 | **6.6** | P1 |
| Slack integration | 8 | 7 | 8 | 7 | 6 | **7.2** | P0 |
| Teams integration | 6 | 7 | 8 | 7 | 6 | **6.7** | P1 |
| Webhook notifications | 6 | 8 | 8 | 5 | 8 | **7.0** | P0 |
| Toast notifications | 10 | 4 | 10 | 9 | 4 | **7.2** | P0 |
| Mobile responsiveness | 8 | 7 | 8 | 5 | 6 | **6.8** | P1 |
| MSP multi-tenant dashboard | 4 | 10 | 6 | 3 | 10 | **6.5** | P1 |
| Threat trend dashboard | 8 | 6 | 6 | 5 | 6 | **6.2** | P1 |
| Brand health score | 8 | 5 | 4 | 7 | 6 | **5.9** | P2 |
| SIEM integration | 4 | 8 | 6 | 3 | 8 | **5.7** | P2 |
| Marketplace monitoring | 6 | 8 | 4 | 1 | 8 | **5.3** | P2 |
| Custom scan rules | 4 | 6 | 4 | 3 | 6 | **4.5** | P2 |
| OAuth / SSO | 6 | 4 | 8 | 5 | 4 | **5.3** | P2 |
| White-label portal | 4 | 8 | 4 | 1 | 8 | **4.9** | P2 |
| Mobile app | 6 | 4 | 4 | 1 | 4 | **3.7** | P3 |
| Multi-language support | 2 | 2 | 4 | 1 | 4 | **2.5** | P4 |

### Appendix B: Customer Interview Question Bank

**Discovery (Problem Understanding):**
1. Walk me through the last time you discovered someone impersonating your brand. What happened?
2. How do you currently monitor for brand threats? What tools/processes?
3. How much time per week does your team spend on brand protection?
4. What's the cost when a brand impersonation incident occurs? (revenue, trust, time)
5. Who in your organization cares about brand protection? Who makes the purchasing decision?

**Solution Validation:**
6. [Show mockup] Does this solve the problem you described? What's missing?
7. What would make you confident enough to rely on this tool instead of your current approach?
8. Which features are must-haves vs nice-to-haves for you?
9. How would this fit into your existing workflow? What would need to change?
10. What integrations would be essential for you to adopt this?

**Pricing & Willingness to Pay:**
11. What are you currently spending on brand protection? (including staff time)
12. At what price point would this be an easy "yes" for you?
13. At what price point would you start to hesitate?
14. What would need to be true for you to upgrade from free to paid?
15. Would you prefer monthly or annual billing? What discount would make annual attractive?

### Appendix C: Quarterly Review Template

```markdown
## Q[X] 2026 Product Review

### Shipped This Quarter
- [Feature list with dates]

### Key Metrics
| Metric | Start of Quarter | End of Quarter | Target | Status |
|--------|-----------------|----------------|--------|--------|
| MAPB | | | | |
| MRR | | | | |
| Signups | | | | |
| Churn rate | | | | |
| NPS | | | | |

### What Worked
- [List]

### What Didn't Work
- [List]

### Customer Feedback Themes
1. [Theme + volume + action taken]
2. [Theme + volume + action taken]

### Competitive Landscape Changes
- [Notable competitor moves]

### Roadmap Adjustments for Next Quarter
- [What's changing and why]

### Open Questions for Next Quarter
- [Unresolved strategic questions]
```

### Appendix D: Decision Log Template

| Date | Decision | Options Considered | Rationale | Outcome |
|------|----------|-------------------|-----------|---------|
| | | | | |

*Captures product decisions for future reference. Populated as decisions are made.*

---

## Document Governance

| Aspect | Detail |
|--------|--------|
| **Owner** | Richard (final decisions), Ernie (maintenance & analysis) |
| **Review cadence** | Monthly (roadmap), Quarterly (strategy & vision) |
| **Update triggers** | New customer segment discovered, competitive shift, metric miss, pivot |
| **Version** | 1.0 (2026-02-05) |

---

*This is a living document. The roadmap is a plan, not a promise. It will evolve as we learn from customers, competitors, and our own data. The framework (RICE-V, validation ladder, feedback loops) is more durable than any specific feature list.*
