# DoppelDown: Analytics & Business Intelligence Strategy

> Comprehensive framework for tracking business metrics, customer analytics, product usage, and automated reporting dashboards to drive data-informed decision making.
> Last updated: 2026-02-05

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Assessment](#2-current-state-assessment)
3. [Analytics Architecture](#3-analytics-architecture)
4. [North Star Metric & Metric Hierarchy](#4-north-star-metric--metric-hierarchy)
5. [Business & Revenue Analytics](#5-business--revenue-analytics)
6. [Customer Analytics](#6-customer-analytics)
7. [Product Usage Analytics](#7-product-usage-analytics)
8. [Acquisition & Marketing Analytics](#8-acquisition--marketing-analytics)
9. [Operational & System Analytics](#9-operational--system-analytics)
10. [Data Infrastructure & Pipeline](#10-data-infrastructure--pipeline)
11. [Dashboard Specifications](#11-dashboard-specifications)
12. [Automated Reporting](#12-automated-reporting)
13. [Data-Informed Decision Framework](#13-data-informed-decision-framework)
14. [Implementation Roadmap](#14-implementation-roadmap)
15. [Appendix: SQL Views & Queries](#15-appendix-sql-views--queries)

---

## 1. Executive Summary

### Why This Matters

DoppelDown is transitioning from "built" to "launched." The difference between SaaS companies that reach $15K MRR and those that stall at $500 is nearly always **feedback speed** — how quickly the founders can answer:

- Which acquisition channel actually converts?
- Where in the funnel are we losing people?
- Are users getting value fast enough to stay?
- Which customers are about to churn, and why?
- Is our unit economics sustainable?

This strategy builds the measurement infrastructure to answer those questions within minutes, not days.

### What We Already Have (Strengths)

DoppelDown has a surprisingly mature foundation for a pre-revenue product:

| Component | Status | Notes |
|-----------|--------|-------|
| **Prometheus metrics** (`metrics.ts`) | ✅ Built | 60+ metrics covering business, security, performance, operations |
| **GA4 integration** (`analytics.tsx`) | ✅ Built | Basic pageview tracking, gtag event helper |
| **Monitoring dashboard** (`monitoring/dashboard.ts`) | ✅ Built | System health, performance, DB stats |
| **User segmentation** (`insights/user-segmentation.ts`) | ✅ Built | Behavioral clustering, lifecycle mapping, churn modeling |
| **Insights dashboard** (`insights/insights-dashboard.ts`) | ✅ Built | Sentiment analysis, trend tracking, executive summaries |
| **Supabase data model** | ✅ Built | Users, brands, threats, scans, reports, audit_logs, subscriptions |
| **Stripe integration** | ✅ Built | Checkout, webhooks, subscription lifecycle events |
| **Audit logging** | ✅ Built | All destructive actions logged with accountability trail |

### What's Missing (Gaps)

| Gap | Impact | Priority |
|-----|--------|----------|
| **No event tracking beyond pageviews** | Can't measure activation, feature adoption, or funnel | 🔴 Critical |
| **No cohort analysis** | Can't measure retention or time-to-value | 🔴 Critical |
| **No revenue analytics** | MRR, LTV, churn rate not tracked over time | 🔴 Critical |
| **Metrics are in-memory only** | All data lost on deploy/restart | 🔴 Critical |
| **No admin analytics dashboard** | No way to see business state at a glance | 🟡 High |
| **No funnel tracking** | Can't identify conversion bottlenecks | 🟡 High |
| **GA4 not configured with custom events** | Missing product-specific tracking | 🟡 High |
| **No automated reports** | Richard can't wake up to "here's what happened overnight" | 🟡 High |
| **User segmentation not connected to real data** | Framework exists but isn't wired up | 🟠 Medium |
| **No A/B testing infrastructure** | Can't test pricing page, CTAs, onboarding variants | 🟠 Medium |

### Strategy Summary

```
Phase 1 (Week 1-2):    Event tracking + persistent metrics + revenue tracking
Phase 2 (Week 3-4):    Admin dashboard + funnel analytics + cohort views  
Phase 3 (Week 5-8):    Automated reports + churn prediction + A/B testing
Phase 4 (Ongoing):     Advanced BI, expansion analytics, ML-driven insights
```

---

## 2. Current State Assessment

### Data Sources Available Today

```
┌─────────────────────────────────────────────────────────────────────┐
│                      DoppelDown Data Landscape                       │
├─────────────────┬───────────────────────┬───────────────────────────┤
│  Source          │  Data Available        │  Current Usage            │
├─────────────────┼───────────────────────┼───────────────────────────┤
│  Supabase (PG)  │  Users, brands, scans, │  Powering the app,        │
│                 │  threats, reports,     │  no analytics queries     │
│                 │  subscriptions, audit  │                           │
├─────────────────┼───────────────────────┼───────────────────────────┤
│  Stripe         │  Payments, invoices,   │  Webhook processing only  │
│                 │  subscriptions, churn  │                           │
├─────────────────┼───────────────────────┼───────────────────────────┤
│  GA4            │  Pageviews, sessions,  │  Script loaded, no custom │
│                 │  traffic sources       │  events configured        │
├─────────────────┼───────────────────────┼───────────────────────────┤
│  In-memory      │  Prometheus counters,  │  /api/metrics endpoint,   │
│  Metrics        │  gauges, histograms    │  lost on restart          │
├─────────────────┼───────────────────────┼───────────────────────────┤
│  Server Logs    │  API calls, errors,    │  console.log, not         │
│                 │  scan outcomes         │  structured or queried    │
├─────────────────┼───────────────────────┼───────────────────────────┤
│  Email          │  Send events, opens,   │  Fire-and-forget,         │
│  (Resend/SMTP)  │  bounces               │  no tracking              │
└─────────────────┴───────────────────────┴───────────────────────────┘
```

### Gap Between Current and Target State

**Current**: We have raw data scattered across systems but no unified view.
**Target**: Any business question answerable in <5 minutes from a dashboard.

---

## 3. Analytics Architecture

### Design Principles

1. **Supabase-native first** — No new databases. PostgreSQL can handle our analytics volume for the foreseeable future (10K+ users before needing a warehouse).
2. **Progressive complexity** — Start with SQL views and cron-materialized tables. Add dedicated analytics tooling only when we outgrow this.
3. **Event-driven, not poll-driven** — Track events as they happen via hooks, not by scanning tables periodically.
4. **Privacy-respectful** — GDPR/CCPA compliant by design. No PII in analytics tables. All user data pseudonymized in aggregate views.
5. **Lightweight frontend** — Admin dashboard built as a protected route in the existing Next.js app, not a separate tool.

### Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                        DATA COLLECTION LAYER                          │
│                                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │
│  │ Client   │  │ API      │  │ Stripe   │  │ Background Jobs      │ │
│  │ Events   │  │ Hooks    │  │ Webhooks │  │ (cron scans, emails) │ │
│  │ (gtag +  │  │ (server) │  │          │  │                      │ │
│  │ custom)  │  │          │  │          │  │                      │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘ │
│       │              │              │                    │             │
│       ▼              ▼              ▼                    ▼             │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │                    EVENT INGESTION                             │    │
│  │  Supabase table: analytics_events                             │    │
│  │  (event_name, user_id, properties, created_at, session_id)   │    │
│  └─────────────────────────┬─────────────────────────────────────┘    │
└────────────────────────────┼──────────────────────────────────────────┘
                             │
┌────────────────────────────┼──────────────────────────────────────────┐
│                        DATA PROCESSING LAYER                          │
│                             ▼                                         │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │              PostgreSQL Materialized Views                     │    │
│  │                                                               │    │
│  │  • mv_daily_metrics       (daily rollups)                     │    │
│  │  • mv_funnel_stages       (signup → activate → pay → expand)  │    │
│  │  • mv_cohort_retention    (weekly/monthly cohorts)            │    │
│  │  • mv_revenue_metrics     (MRR, churn, LTV, ARPU)            │    │
│  │  • mv_feature_adoption    (scan, report, alert usage)         │    │
│  │  • mv_acquisition_channels (source → signup → paid)           │    │
│  │                                                               │    │
│  │  Refreshed by: Supabase cron (pg_cron) or API cron route     │    │
│  └─────────────────────────┬─────────────────────────────────────┘    │
└────────────────────────────┼──────────────────────────────────────────┘
                             │
┌────────────────────────────┼──────────────────────────────────────────┐
│                        PRESENTATION LAYER                             │
│                             ▼                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────────┐    │
│  │ Admin       │  │ Automated    │  │ GA4 (supplementary)       │    │
│  │ Dashboard   │  │ Reports      │  │ - Traffic analytics       │    │
│  │ /dashboard/ │  │ (email,      │  │ - Source attribution      │    │
│  │ admin/      │  │  Slack)      │  │ - Page performance        │    │
│  │ analytics   │  │              │  │ - Audience demographics   │    │
│  └─────────────┘  └──────────────┘  └───────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

### Why Not a Dedicated Analytics Tool?

At DoppelDown's current scale (pre-revenue, bootstrapped), adding Mixpanel, Amplitude, or a data warehouse would be premature:

| Option | Monthly Cost | Complexity | When It Makes Sense |
|--------|-------------|------------|---------------------|
| **Supabase + SQL views (recommended)** | $0 (included) | Low | 0–10K users |
| **PostHog (self-hosted)** | $0–$50 | Medium | 1K–50K users |
| **Mixpanel/Amplitude** | $0–$300 | Medium | 5K–100K users |
| **Data warehouse (BigQuery/Snowflake)** | $100–$1,000+ | High | 100K+ users |

**Recommendation**: Start with Supabase-native analytics. Evaluate PostHog at 1K users. Migrate to a dedicated tool only when PostgreSQL queries start timing out on analytical workloads.

---

## 4. North Star Metric & Metric Hierarchy

### North Star Metric

> **Weekly Active Brands Scanned (WABS)**
> 
> The number of unique brands that completed at least one scan (manual or automated) in the trailing 7 days.

**Why this metric:**
- It directly measures core product usage (scanning = getting value)
- It encompasses both paid and free users (leading indicator for revenue)
- It correlates with threat detection (which drives report generation → demonstrating ROI → retention)
- It's actionable: if WABS drops, either activation is broken, scans are failing, or users are churning

### Metric Hierarchy (Input → Output)

```
                         ┌──────────────────────────┐
                         │   💰 REVENUE OUTCOME      │
                         │   Monthly Recurring       │
                         │   Revenue (MRR)           │
                         └──────────┬───────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
            ┌───────▼─────┐  ┌─────▼──────┐  ┌─────▼──────┐
            │ New MRR      │  │ Expansion  │  │ Churn      │
            │ (new paid    │  │ MRR (tier  │  │ (cancel-   │
            │  customers)  │  │  upgrades) │  │  lations)  │
            └───────┬──────┘  └─────┬──────┘  └─────┬──────┘
                    │               │               │
        ┌───────────┤        ┌──────┤        ┌──────┤
        │           │        │      │        │      │
   ┌────▼───┐ ┌────▼───┐ ┌──▼──┐ ┌─▼──┐ ┌──▼──┐ ┌─▼──────────┐
   │Signup  │ │Free→   │ │Usage│ │Tier│ │Stale│ │No value    │
   │→ Paid  │ │Paid    │ │hits │ │fit │ │users│ │perceived   │
   │conv %  │ │conv %  │ │limit│ │gap │ │     │ │            │
   └────┬───┘ └────┬───┘ └──┬──┘ └─┬──┘ └──┬──┘ └─┬──────────┘
        │          │        │      │       │       │
   ┌────▼──────────▼────────▼──────▼───────▼───────▼───────┐
   │                                                        │
   │             ⭐ NORTH STAR: Weekly Active               │
   │                Brands Scanned (WABS)                   │
   │                                                        │
   └──────────┬──────────────────────────────────┬─────────┘
              │                                  │
     ┌────────▼──────────┐            ┌──────────▼────────┐
     │  ACTIVATION        │            │  ENGAGEMENT        │
     │                    │            │                    │
     │  • Time to first   │            │  • Scans/week      │
     │    scan             │            │  • Reports/month   │
     │  • Time to first   │            │  • Threats viewed   │
     │    threat found     │            │  • Dashboard visits │
     │  • Onboarding %    │            │  • Alert actions    │
     └────────┬───────────┘            └──────────┬────────┘
              │                                   │
     ┌────────▼──────────┐            ┌──────────▼────────┐
     │  ACQUISITION       │            │  PRODUCT QUALITY   │
     │                    │            │                    │
     │  • Signups/week    │            │  • Scan success %  │
     │  • Traffic sources │            │  • Threats/scan    │
     │  • Signup conv %   │            │  • False positive % │
     │  • CAC by channel  │            │  • Page load time  │
     └────────────────────┘            └────────────────────┘
```

### Metric Categories & Ownership

| Category | Primary Audience | Review Cadence | Dashboard |
|----------|-----------------|----------------|-----------|
| Business/Revenue | Founder (Richard) | Daily glance, weekly deep-dive | CEO Dashboard |
| Customer/Lifecycle | Founder + Product | Weekly | Customer Health |
| Product/Usage | Product + Engineering | Daily | Product Analytics |
| Acquisition/Marketing | Founder + Marketing | Weekly | Growth Dashboard |
| Operations/System | Engineering | Real-time + daily | Ops Dashboard (existing) |

---

## 5. Business & Revenue Analytics

### 5.1 Revenue Metrics

These are the numbers that determine whether DoppelDown is a business or a side project.

| Metric | Definition | Formula | Target (Month 6) | Target (Month 12) |
|--------|-----------|---------|-------------------|--------------------|
| **MRR** | Monthly Recurring Revenue | Sum of all active monthly subscription amounts | $5,000 | $15,000 |
| **ARR** | Annual Run Rate | MRR × 12 | $60,000 | $180,000 |
| **New MRR** | Revenue from new customers this month | Sum of first payments | $2,000 | $4,000 |
| **Expansion MRR** | Revenue from upgrades | Sum of (new plan − old plan) amounts | $200 | $1,000 |
| **Churned MRR** | Revenue lost to cancellations | Sum of cancelled subscription amounts | <$500 | <$1,000 |
| **Net MRR Growth** | Month-over-month growth | (New + Expansion − Churned) / Previous MRR | >20% | >15% |
| **ARPU** | Average Revenue Per User | MRR / Paying Customers | $120 | $140 |
| **LTV** | Customer Lifetime Value | ARPU / Monthly Churn Rate | $1,200 | $2,000 |
| **CAC** | Customer Acquisition Cost | Total Sales+Marketing Spend / New Customers | <$200 | <$300 |
| **LTV:CAC Ratio** | Unit economics health | LTV / CAC | >3:1 | >4:1 |
| **Payback Period** | Months to recover CAC | CAC / ARPU | <3 months | <3 months |
| **Revenue Churn Rate** | % MRR lost to cancellations | Churned MRR / Previous MRR | <5% | <4% |
| **Net Revenue Retention** | Revenue retention including expansion | (Start MRR + Expansion − Churned) / Start MRR | >100% | >105% |

### 5.2 Revenue Tracking Implementation

**Data source**: Stripe webhooks → `subscriptions` table + new `revenue_events` table.

```sql
-- New table: revenue_events (append-only ledger)
CREATE TABLE IF NOT EXISTS public.revenue_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL CHECK (event_type IN (
        'new_subscription',
        'upgrade',
        'downgrade',
        'cancellation',
        'reactivation',
        'payment_succeeded',
        'payment_failed',
        'refund',
        'trial_started',
        'trial_converted',
        'trial_expired'
    )),
    subscription_id TEXT,
    tier_from TEXT,
    tier_to TEXT,
    amount_cents INTEGER NOT NULL DEFAULT 0,  -- Monthly normalized amount
    currency TEXT DEFAULT 'usd',
    billing_interval TEXT CHECK (billing_interval IN ('month', 'year')),
    stripe_event_id TEXT UNIQUE,  -- Deduplication key
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_revenue_events_created ON public.revenue_events(created_at DESC);
CREATE INDEX idx_revenue_events_user ON public.revenue_events(user_id);
CREATE INDEX idx_revenue_events_type ON public.revenue_events(event_type);
```

**MRR calculation view:**

```sql
-- Materialized view: daily MRR snapshot
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_daily_mrr AS
WITH active_subs AS (
    SELECT 
        DATE_TRUNC('day', NOW()) AS snapshot_date,
        u.subscription_tier,
        COUNT(*) AS customer_count,
        SUM(CASE u.subscription_tier
            WHEN 'starter' THEN 7900     -- $79
            WHEN 'professional' THEN 19900  -- $199
            WHEN 'enterprise' THEN 49900    -- $499
            ELSE 0
        END) AS mrr_cents
    FROM public.users u
    WHERE u.subscription_status = 'active'
    GROUP BY u.subscription_tier
)
SELECT 
    snapshot_date,
    subscription_tier,
    customer_count,
    mrr_cents,
    ROUND(mrr_cents / 100.0, 2) AS mrr_dollars
FROM active_subs;
```

### 5.3 Subscription Funnel

```
Visitor → Signup → Activate → Free User → Checkout → Paying Customer → Expand → Advocate
  │         │        │           │            │             │              │          │
  │         │        │           │            │             │              │          └─ Referral event
  │         │        │           │            │             │              └─ Tier upgrade
  │         │        │           │            │             └─ Payment succeeded
  │         │        │           │            └─ Stripe checkout initiated
  │         │        │           └─ Scan completed, ≥1 threat found
  │         │        └─ First scan initiated
  │         └─ Account created
  └─ Landing page visit

CONVERSION BENCHMARKS (B2B SaaS):
  Visitor → Signup:     2–5%
  Signup → Activate:    40–60%
  Activate → Paid:      5–15%  (PLG model)
  Paid → Expand:        10–20% annually
  Monthly Churn:        3–7%   (SMB), 1–2% (Enterprise)
```

---

## 6. Customer Analytics

### 6.1 Customer Lifecycle Stages

Every user exists in one of these stages at any time. The analytics system must track transitions.

```
┌─────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ SIGNED  │──▶│ ACTIVAT- │──▶│ ENGAGED  │──▶│ PAYING   │──▶│ POWER    │
│   UP    │   │   ING    │   │ (FREE)   │   │ CUSTOMER │   │ USER     │
└─────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
      │              │              │              │              │
      ▼              ▼              ▼              ▼              ▼
┌─────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ BOUNCED │   │ STALLED  │   │ DORMANT  │   │ AT-RISK  │   │ CHAMPION │
│ (never  │   │ (no      │   │ (no scan │   │ (usage   │   │ (refer-  │
│ logged  │   │ first    │   │ in 14d)  │   │ declining│   │ ring,    │
│ back in)│   │ scan)    │   │          │   │ or churn │   │ expanding│
└─────────┘   └──────────┘   └──────────┘   │ signals) │   │ )        │
                                             └──────────┘   └──────────┘
```

**Stage definitions:**

| Stage | Criteria | Action |
|-------|----------|--------|
| **Signed Up** | Account created, no other actions | Trigger onboarding email sequence |
| **Activating** | Logged in ≥2 times but hasn't completed first scan | Show onboarding wizard, contextual help |
| **Engaged (Free)** | Completed ≥1 scan, returned within 7 days | Nurture with value emails, show upgrade triggers |
| **Paying Customer** | Active subscription (any tier) | Ensure value delivery, monitor usage |
| **Power User** | Paying + ≥3 brands + scans weekly + reports generated | Feature previews, feedback requests, referral asks |
| **Bounced** | Signed up but never returned (>7 days, no activity) | Re-engagement email ("Here's what we found for [brand]") |
| **Stalled** | Logged in but never ran a scan (>3 days) | Product tip email, simplified first-scan guide |
| **Dormant** | No scan activity in 14+ days | Win-back email with new threat summary |
| **At-Risk** | Paying but declining usage (scans ↓50% in 30 days) | Personal outreach, usage review email |
| **Champion** | High NPS, referred others, or expanded subscription | Testimonial request, case study, beta access |

### 6.2 Customer Health Score

A composite score (0–100) calculated daily for each paying customer.

| Factor | Weight | Metric | Good (100) | Warning (50) | Bad (0) |
|--------|--------|--------|------------|--------------|---------|
| **Scan Activity** | 30% | Scans in last 14 days | ≥3 | 1–2 | 0 |
| **Dashboard Visits** | 15% | Login sessions in 14 days | ≥5 | 2–4 | 0–1 |
| **Threats Actioned** | 20% | % threats viewed/resolved | >60% | 30–60% | <30% |
| **Feature Breadth** | 15% | Features used (scan, report, alert, social) | ≥3 | 2 | ≤1 |
| **Recency** | 10% | Days since last activity | 0–2 | 3–7 | >7 |
| **Trend** | 10% | Activity trend (rolling 30d vs prior 30d) | Increasing | Flat | Decreasing |

```sql
-- Customer health score calculation
CREATE OR REPLACE VIEW v_customer_health AS
WITH scan_activity AS (
    SELECT 
        b.user_id,
        COUNT(DISTINCT s.id) AS scans_14d,
        MAX(s.created_at) AS last_scan
    FROM scans s
    JOIN brands b ON b.id = s.brand_id
    WHERE s.created_at > NOW() - INTERVAL '14 days'
    AND s.status = 'completed'
    GROUP BY b.user_id
),
threat_actions AS (
    SELECT 
        b.user_id,
        COUNT(*) FILTER (WHERE t.status != 'new') AS actioned,
        COUNT(*) AS total
    FROM threats t
    JOIN brands b ON b.id = t.brand_id
    WHERE t.created_at > NOW() - INTERVAL '30 days'
    GROUP BY b.user_id
),
feature_usage AS (
    SELECT 
        b.user_id,
        COUNT(DISTINCT 
            CASE 
                WHEN EXISTS(SELECT 1 FROM scans WHERE brand_id = b.id AND created_at > NOW() - INTERVAL '30 days') THEN 'scans'
            END
        ) +
        COUNT(DISTINCT 
            CASE 
                WHEN EXISTS(SELECT 1 FROM reports WHERE brand_id = b.id AND created_at > NOW() - INTERVAL '30 days') THEN 'reports'
            END
        ) AS features_used
    FROM brands b
    GROUP BY b.user_id
)
SELECT 
    u.id AS user_id,
    u.email,
    u.subscription_tier,
    COALESCE(sa.scans_14d, 0) AS scans_14d,
    GREATEST(0, LEAST(100,
        -- Scan Activity (30%)
        (CASE 
            WHEN COALESCE(sa.scans_14d, 0) >= 3 THEN 100
            WHEN COALESCE(sa.scans_14d, 0) >= 1 THEN 50
            ELSE 0
        END) * 0.30 +
        -- Threats Actioned (20%)
        (CASE 
            WHEN COALESCE(ta.total, 0) = 0 THEN 70  -- No threats = neutral
            WHEN (ta.actioned::FLOAT / ta.total) > 0.6 THEN 100
            WHEN (ta.actioned::FLOAT / ta.total) > 0.3 THEN 50
            ELSE 0
        END) * 0.20 +
        -- Recency (10%)
        (CASE 
            WHEN sa.last_scan > NOW() - INTERVAL '2 days' THEN 100
            WHEN sa.last_scan > NOW() - INTERVAL '7 days' THEN 50
            ELSE 0
        END) * 0.10 +
        -- Feature Breadth (15%)
        (COALESCE(fu.features_used, 0) * 33.3) * 0.15 +
        -- Baseline for active users (25%)
        25
    )) AS health_score,
    CASE 
        WHEN COALESCE(sa.scans_14d, 0) = 0 AND sa.last_scan < NOW() - INTERVAL '14 days' THEN 'at_risk'
        WHEN COALESCE(sa.scans_14d, 0) >= 3 THEN 'healthy'
        ELSE 'needs_attention'
    END AS status
FROM users u
LEFT JOIN scan_activity sa ON sa.user_id = u.id
LEFT JOIN threat_actions ta ON ta.user_id = u.id
LEFT JOIN feature_usage fu ON fu.user_id = u.id
WHERE u.subscription_status = 'active';
```

### 6.3 Churn Analytics

| Metric | Definition | How to Measure |
|--------|-----------|----------------|
| **Logo Churn Rate** | % of customers who cancel per month | Cancelled subscriptions / Start-of-month customers |
| **Revenue Churn Rate** | % of MRR lost to cancellations | Churned MRR / Start-of-month MRR |
| **Net Revenue Retention** | MRR retention including expansion | (Start MRR + Expansion − Churned) / Start MRR |
| **Churn Cohort Analysis** | When do customers churn? | Cancellation distribution by tenure month |
| **Churn Reason Taxonomy** | Why they leave | Stripe cancellation feedback + exit survey |

**Key insight**: For B2B SaaS, most churn happens in months 2–4. If a customer survives 6 months, they're likely to stay 18+ months. Focus retention efforts on the first 90 days.

### 6.4 Cohort Retention

Track weekly signup cohorts and measure how many are still active (logged in) at Week 1, 2, 4, 8, 12.

```sql
-- Cohort retention view
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_cohort_retention AS
WITH cohorts AS (
    SELECT 
        id AS user_id,
        DATE_TRUNC('week', created_at) AS cohort_week,
        created_at
    FROM users
),
activity AS (
    SELECT DISTINCT
        b.user_id,
        DATE_TRUNC('week', s.created_at) AS activity_week
    FROM scans s
    JOIN brands b ON b.id = s.brand_id
    WHERE s.status = 'completed'
)
SELECT
    c.cohort_week,
    COUNT(DISTINCT c.user_id) AS cohort_size,
    a.activity_week,
    EXTRACT(DAYS FROM a.activity_week - c.cohort_week) / 7 AS weeks_since_signup,
    COUNT(DISTINCT a.user_id) AS active_users,
    ROUND(
        COUNT(DISTINCT a.user_id)::NUMERIC / NULLIF(COUNT(DISTINCT c.user_id), 0) * 100, 
        1
    ) AS retention_pct
FROM cohorts c
LEFT JOIN activity a ON a.user_id = c.user_id
    AND a.activity_week >= c.cohort_week
GROUP BY c.cohort_week, a.activity_week
ORDER BY c.cohort_week, weeks_since_signup;
```

**Target retention curve (PLG B2B SaaS):**

| Week | Target Retention |
|------|-----------------|
| Week 1 | 60–70% |
| Week 2 | 45–55% |
| Week 4 | 30–40% |
| Week 8 | 20–30% |
| Week 12 | 15–25% |

---

## 7. Product Usage Analytics

### 7.1 Event Tracking Schema

Every meaningful user action should be tracked. Here's the event taxonomy:

```sql
-- Event tracking table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name TEXT NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    session_id TEXT,
    
    -- Event properties (flexible JSON)
    properties JSONB DEFAULT '{}',
    
    -- Context
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_hash TEXT,  -- Hashed IP for geo (not raw IP)
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    
    -- Partitioning hint
    event_date DATE DEFAULT CURRENT_DATE
);

-- Indexes for common queries
CREATE INDEX idx_events_name_date ON public.analytics_events(event_name, event_date);
CREATE INDEX idx_events_user ON public.analytics_events(user_id, created_at DESC);
CREATE INDEX idx_events_session ON public.analytics_events(session_id);

-- Partition by month for efficient cleanup (optional, for scale)
-- CREATE TABLE analytics_events_2026_02 PARTITION OF analytics_events
--     FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
```

### 7.2 Event Taxonomy

**Naming convention**: `object.action` (lowercase, dot-separated)

#### Registration & Onboarding
| Event Name | Properties | Trigger |
|-----------|------------|---------|
| `user.signed_up` | `{ source, referrer, utm_source, utm_medium, utm_campaign }` | After email verification |
| `user.logged_in` | `{ method: "password" \| "magic_link" }` | Successful login |
| `onboarding.started` | `{ step: 1 }` | Onboarding wizard opened |
| `onboarding.step_completed` | `{ step, step_name }` | Each step completed |
| `onboarding.completed` | `{ total_time_seconds }` | All steps done |
| `onboarding.skipped` | `{ at_step }` | User skipped onboarding |

#### Brand Management
| Event Name | Properties | Trigger |
|-----------|------------|---------|
| `brand.created` | `{ brand_id, domain, has_logo, keyword_count }` | Brand added |
| `brand.updated` | `{ brand_id, fields_changed[] }` | Brand edited |
| `brand.deleted` | `{ brand_id, had_threats }` | Brand removed |

#### Scanning
| Event Name | Properties | Trigger |
|-----------|------------|---------|
| `scan.initiated` | `{ brand_id, scan_type, trigger: "manual" \| "automated" }` | Scan started |
| `scan.completed` | `{ brand_id, scan_type, duration_seconds, threats_found, domains_checked }` | Scan finished |
| `scan.failed` | `{ brand_id, scan_type, error_code }` | Scan errored |
| `scan.cancelled` | `{ brand_id, at_progress_pct }` | User cancelled |

#### Threat Interaction
| Event Name | Properties | Trigger |
|-----------|------------|---------|
| `threat.viewed` | `{ threat_id, severity, type, time_since_detection_hours }` | Threat detail opened |
| `threat.status_changed` | `{ threat_id, from_status, to_status }` | Status updated |
| `threat.deleted` | `{ threat_id, severity }` | Threat removed |
| `threat.evidence_viewed` | `{ threat_id, evidence_type: "screenshot" \| "whois" \| "html" }` | Evidence accessed |

#### Reports
| Event Name | Properties | Trigger |
|-----------|------------|---------|
| `report.generated` | `{ report_id, type, threat_count }` | Report created |
| `report.downloaded` | `{ report_id, format }` | PDF downloaded |
| `report.sent` | `{ report_id, recipient_domain }` | Report emailed |

#### Billing
| Event Name | Properties | Trigger |
|-----------|------------|---------|
| `billing.checkout_started` | `{ tier, interval: "month" \| "year", source_page }` | Checkout initiated |
| `billing.checkout_completed` | `{ tier, interval, amount_cents }` | Payment succeeded |
| `billing.checkout_abandoned` | `{ tier, interval, abandon_step }` | Checkout left incomplete |
| `billing.subscription_upgraded` | `{ from_tier, to_tier }` | Plan upgraded |
| `billing.subscription_downgraded` | `{ from_tier, to_tier }` | Plan downgraded |
| `billing.subscription_cancelled` | `{ tier, tenure_days, reason }` | Subscription cancelled |

#### Feature Interaction
| Event Name | Properties | Trigger |
|-----------|------------|---------|
| `dashboard.viewed` | `{ brands_count, threats_count }` | Dashboard loaded |
| `alert_settings.updated` | `{ changes[] }` | Alert preferences changed |
| `notification.clicked` | `{ notification_type }` | In-app notification clicked |
| `pricing.page_viewed` | `{ current_tier, source }` | Pricing page loaded |
| `pricing.tier_compared` | `{ tier_viewed, current_tier }` | Tier details expanded |

### 7.3 Key Product Metrics

| Metric | Definition | Good | Warning | Bad |
|--------|-----------|------|---------|-----|
| **Time to First Scan (TTFS)** | Minutes from signup to first scan completed | <10 min | 10–60 min | >60 min or never |
| **Time to First Threat** | Minutes from signup to first threat detected | <15 min | 15–120 min | >120 min |
| **Activation Rate** | % of signups who complete first scan within 7 days | >50% | 30–50% | <30% |
| **Scan Completion Rate** | % of initiated scans that complete successfully | >95% | 90–95% | <90% |
| **Daily Active Users (DAU)** | Unique users with any activity per day | Growth trend | Flat | Declining |
| **Feature Adoption Rate** | % of users using each feature within 30 days | - | - | - |
| **Report Generation Rate** | Reports per paying customer per month | ≥1 | 0.5–1 | <0.5 |
| **Threats Per Scan** | Average threats detected per completed scan | 2–10 | 0.5–2 | 0 or >20 (noise) |
| **False Positive Rate** | % of threats marked as false positive | <10% | 10–25% | >25% |
| **Scan Frequency** | Average scans per active user per week | ≥2 | 1 | <1 |

### 7.4 Feature Adoption Matrix

Track which features each tier uses, to validate pricing/packaging.

```
Feature Adoption by Tier (% of users who used feature in last 30 days)

                    Free    Growth   Business  Enterprise
                    ─────   ──────   ────────  ──────────
Manual Scan         [████]  [████]   [████]    [████]     
Auto Scan           [----]  [███ ]   [████]    [████]     
View Threats        [███ ]  [████]   [████]    [████]     
Evidence (WHOIS)    [----]  [██  ]   [███ ]    [████]     
Evidence (Screen)   [----]  [██  ]   [████]    [████]     
Generate Report     [----]  [█   ]   [███ ]    [████]     
Send Report         [----]  [    ]   [██  ]    [███ ]     
Email Alerts        [----]  [███ ]   [████]    [████]     
Webhook Alerts      [----]  [----]   [█   ]    [███ ]     
Social Scanning     [█   ]  [██  ]   [███ ]    [████]     
NRD Monitoring      [----]  [----]   [----]    [██  ]     
Dashboard (daily)   [██  ]  [███ ]   [████]    [████]     
```

**Decision**: If a feature has <10% adoption at its tier, either the feature is broken, undiscoverable, or incorrectly packaged.

---

## 8. Acquisition & Marketing Analytics

### 8.1 Channel Attribution

Track the complete journey: Source → Landing → Signup → Activate → Pay.

| Channel | Metrics to Track | Data Source |
|---------|-----------------|-------------|
| **Organic Search** | Keywords, landing pages, signup rate | GA4 + Search Console |
| **Direct** | Landing page performance | GA4 |
| **ProductHunt** | Upvotes, traffic, signups from PH | UTM params + GA4 |
| **Social (organic)** | LinkedIn/Twitter post → signup | UTM params |
| **Content/Blog** | Article views, scroll depth, CTA clicks, signups | GA4 + events |
| **Cold Outreach** | Emails sent, replies, demos, signups | CRM / manual tracking |
| **Referral** | Referrer user → new signup | UTM + referral code |
| **Paid Ads** | Impressions, clicks, CPC, conversions, ROAS | Google Ads + GA4 |

### 8.2 UTM Strategy

Standardize UTM parameters across all marketing:

```
utm_source:   google | linkedin | twitter | producthunt | email | direct | partner_[name]
utm_medium:   organic | paid | social | email | referral | cpc | content
utm_campaign: launch_2026 | blog_[slug] | outreach_[segment] | ph_launch
utm_content:  cta_hero | cta_pricing | sidebar_ad | email_link
utm_term:     [keyword]  (for paid search)
```

**Capture UTMs on signup:**

```typescript
// On signup form submission
const utmParams = {
  utm_source: searchParams.get('utm_source'),
  utm_medium: searchParams.get('utm_medium'),
  utm_campaign: searchParams.get('utm_campaign'),
  utm_content: searchParams.get('utm_content'),
  utm_term: searchParams.get('utm_term'),
  referrer: document.referrer,
  landing_page: window.location.pathname,
};

// Store in user metadata (Supabase auth)
await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: name,
      acquisition: utmParams,
    }
  }
});
```

### 8.3 Landing Page Analytics

| Metric | How to Measure | Target |
|--------|---------------|--------|
| **Bounce Rate** | GA4 engagement rate (inverse) | <50% |
| **Time on Page** | GA4 avg. engagement time | >60 seconds |
| **CTA Click Rate** | Custom event: `cta.clicked` / pageviews | >5% |
| **Pricing Page Conversion** | Signups from /pricing / pricing page visitors | >10% |
| **Blog → Signup Rate** | Blog readers who signup (attributed) | >2% |
| **Demo CTA Conversion** | "Scan Your Brand Free" clicks / visitors | >8% |

### 8.4 Content Performance

```sql
-- Track which blog posts drive signups
CREATE OR REPLACE VIEW v_content_attribution AS
SELECT 
    ae.properties->>'landing_page' AS content_page,
    COUNT(DISTINCT ae.user_id) AS signups,
    COUNT(DISTINCT ae2.user_id) AS activated,
    COUNT(DISTINCT ae3.user_id) AS converted_to_paid,
    ROUND(
        COUNT(DISTINCT ae2.user_id)::NUMERIC / NULLIF(COUNT(DISTINCT ae.user_id), 0) * 100,
        1
    ) AS activation_rate
FROM analytics_events ae
LEFT JOIN analytics_events ae2 ON ae2.user_id = ae.user_id 
    AND ae2.event_name = 'scan.completed'
LEFT JOIN analytics_events ae3 ON ae3.user_id = ae.user_id 
    AND ae3.event_name = 'billing.checkout_completed'
WHERE ae.event_name = 'user.signed_up'
AND ae.properties->>'landing_page' LIKE '/blog/%'
GROUP BY ae.properties->>'landing_page'
ORDER BY signups DESC;
```

---

## 9. Operational & System Analytics

### 9.1 System Health Metrics (Existing + Enhanced)

The existing monitoring system (`src/lib/monitoring/`) already tracks these well. Key additions:

| Metric | Current State | Enhancement |
|--------|--------------|-------------|
| **API Latency (p95)** | ✅ In-memory histogram | Persist to `system_metrics` table daily |
| **Error Rate** | ✅ In-memory counter | Persist + alert at >1% |
| **Scan Queue Depth** | ✅ In-memory gauge | Persist + alert at >50 |
| **DB Query Performance** | ✅ In-memory histogram | Persist slow query log |
| **External API Health** | ✅ Circuit breaker stats | Dashboard visibility |
| **Email Delivery Rate** | ❌ Fire-and-forget | Track via Resend webhooks |
| **Cron Job Success Rate** | ✅ Counter | Add duration tracking |
| **AI API Usage/Cost** | ✅ Model usage tracking | Add per-scan cost attribution |

### 9.2 AI Cost Analytics

DoppelDown's AI-powered analysis is its differentiator but also its primary variable cost. Track carefully.

| Metric | Calculation | Target |
|--------|------------|--------|
| **AI cost per scan** | Total AI API spend / Completed scans | <$0.10 |
| **AI cost per customer/month** | Total AI spend / Active customers | <$2.00 |
| **AI cost as % of revenue** | Total AI spend / MRR | <15% |
| **Vision API calls per scan** | API calls / Scans | Minimize without quality loss |
| **Intent analysis accuracy** | True threats / (True threats + false positives) | >85% |

```sql
-- AI cost tracking (add to scan completion)
ALTER TABLE public.scans ADD COLUMN IF NOT EXISTS ai_cost_cents INTEGER DEFAULT 0;
ALTER TABLE public.scans ADD COLUMN IF NOT EXISTS ai_calls INTEGER DEFAULT 0;
```

### 9.3 Infrastructure Cost Tracking

| Service | Monthly Cost | Per-Unit Cost | Break-Even |
|---------|-------------|---------------|------------|
| **Supabase** | $25 (Pro) | — | 1 paying customer |
| **Vercel** | $20 (Pro) | — | 1 paying customer |
| **Stripe** | 2.9% + $0.30 per txn | ~$2.60 per $79 payment | N/A |
| **OpenAI API** | Variable | ~$0.01–0.05 per scan | Scales with usage |
| **SerpAPI** | $50–100 | ~$0.005 per search | ~20 paying customers |
| **Domain** | $12/year | — | — |
| **Total fixed** | ~$100–150/mo | — | 2 Growth customers |

---

## 10. Data Infrastructure & Pipeline

### 10.1 Event Tracking Implementation

**Server-side event tracker** (add to `src/lib/analytics/tracker.ts`):

```typescript
import { createClient } from '@/lib/supabase/server';

interface TrackEventParams {
  eventName: string;
  userId?: string;
  sessionId?: string;
  properties?: Record<string, unknown>;
  pageUrl?: string;
  referrer?: string;
  userAgent?: string;
}

export async function trackEvent({
  eventName,
  userId,
  sessionId,
  properties = {},
  pageUrl,
  referrer,
  userAgent,
}: TrackEventParams): Promise<void> {
  try {
    const supabase = await createClient();
    
    await supabase.from('analytics_events').insert({
      event_name: eventName,
      user_id: userId || null,
      session_id: sessionId || null,
      properties,
      page_url: pageUrl,
      referrer,
      user_agent: userAgent,
    });
  } catch (error) {
    // Analytics should never break the app
    console.error('[Analytics] Failed to track event:', eventName, error);
  }
}

// Convenience wrappers
export const Analytics = {
  trackSignup: (userId: string, props: Record<string, unknown>) =>
    trackEvent({ eventName: 'user.signed_up', userId, properties: props }),
  
  trackScanInitiated: (userId: string, brandId: string, scanType: string, trigger: string) =>
    trackEvent({ 
      eventName: 'scan.initiated', 
      userId, 
      properties: { brand_id: brandId, scan_type: scanType, trigger } 
    }),
  
  trackScanCompleted: (userId: string, brandId: string, scanType: string, duration: number, threats: number) =>
    trackEvent({ 
      eventName: 'scan.completed', 
      userId, 
      properties: { brand_id: brandId, scan_type: scanType, duration_seconds: duration, threats_found: threats } 
    }),
  
  trackCheckoutStarted: (userId: string, tier: string, interval: string) =>
    trackEvent({ 
      eventName: 'billing.checkout_started', 
      userId, 
      properties: { tier, interval } 
    }),
  
  trackCheckoutCompleted: (userId: string, tier: string, interval: string, amount: number) =>
    trackEvent({ 
      eventName: 'billing.checkout_completed', 
      userId, 
      properties: { tier, interval, amount_cents: amount } 
    }),
  
  trackChurn: (userId: string, tier: string, tenureDays: number, reason?: string) =>
    trackEvent({ 
      eventName: 'billing.subscription_cancelled', 
      userId, 
      properties: { tier, tenure_days: tenureDays, reason: reason || 'unknown' } 
    }),
};
```

**Client-side event bridge** (add to `src/lib/analytics/client.ts`):

```typescript
'use client';

import { gtagEvent } from '@/components/analytics';

// Dual-track: GA4 + server-side
export async function trackClientEvent(
  eventName: string, 
  properties: Record<string, unknown> = {}
) {
  // 1. Send to GA4 (for traffic/attribution analytics)
  gtagEvent(eventName.replace('.', '_'), properties);
  
  // 2. Send to server (for product analytics)
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventName, properties }),
    });
  } catch {
    // Silent fail — analytics should never break UX
  }
}
```

### 10.2 Materialized View Refresh Strategy

Materialized views balance query performance with data freshness:

| View | Refresh Frequency | Method | Latency OK? |
|------|-------------------|--------|-------------|
| `mv_daily_mrr` | Every 6 hours | pg_cron or `/api/cron/analytics` | ✅ Revenue doesn't need to be real-time |
| `mv_cohort_retention` | Daily (2am UTC) | pg_cron | ✅ |
| `mv_funnel_stages` | Every 4 hours | pg_cron | ✅ |
| `mv_feature_adoption` | Daily (3am UTC) | pg_cron | ✅ |
| `mv_daily_metrics` | Every hour | pg_cron | ✅ Near real-time enough |

```sql
-- Cron-based refresh (via Supabase pg_cron extension)
SELECT cron.schedule(
    'refresh-daily-mrr',
    '0 */6 * * *',  -- Every 6 hours
    'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_mrr'
);

SELECT cron.schedule(
    'refresh-cohort-retention',
    '0 2 * * *',  -- Daily at 2am UTC
    'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_cohort_retention'
);
```

### 10.3 Data Retention & Cleanup

| Data Type | Retention Period | Cleanup Method |
|-----------|-----------------|----------------|
| Raw `analytics_events` | 90 days | pg_cron daily delete |
| `revenue_events` | Forever | Never delete (financial audit trail) |
| Materialized views | Rolling recalculation | Refresh covers this |
| `audit_log` | 2 years | pg_cron monthly delete |
| Prometheus metrics (in-memory) | Current session only | N/A (persist key ones to DB) |
| GA4 data | 14 months (Google default) | Google manages |

```sql
-- Daily cleanup of old analytics events
SELECT cron.schedule(
    'cleanup-analytics-events',
    '0 4 * * *',  -- Daily at 4am UTC
    $$DELETE FROM analytics_events WHERE created_at < NOW() - INTERVAL '90 days'$$
);
```

---

## 11. Dashboard Specifications

### 11.1 CEO Dashboard (Richard's Daily View)

**Route**: `/dashboard/admin/analytics`
**Access**: Admin only (`is_admin = true`)
**Purpose**: 30-second morning check of business health

```
┌─────────────────────────────────────────────────────────────────────┐
│  DoppelDown Analytics                          Last updated: 2m ago │
├──────────────────┬──────────────────┬──────────────────┬────────────┤
│  💰 MRR          │  👥 Customers    │  📊 WABS         │  🔥 Churn  │
│  $4,200          │  28 paying       │  45 brands       │  2.1%      │
│  ↑ 12% MoM       │  ↑ 5 this month  │  ↑ 8% WoW        │  ↓ 0.5%   │
├──────────────────┴──────────────────┴──────────────────┴────────────┤
│                                                                      │
│  📈 MRR Trend (6 months)                                            │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │ $5k┤                                            ╱──        │      │
│  │ $4k┤                                      ╱───╱            │      │
│  │ $3k┤                                ╱───╱                  │      │
│  │ $2k┤                      ╱───╱───╱                        │      │
│  │ $1k┤            ╱───╱───╱                                  │      │
│  │  $0┤───╱───╱───╱                                           │      │
│  │    └─Sep──Oct──Nov──Dec──Jan──Feb                          │      │
│  └────────────────────────────────────────────────────────────┘      │
│                                                                      │
├─────────────────────────────────┬────────────────────────────────────┤
│  🎯 Conversion Funnel (30d)     │  🏥 Customer Health Distribution  │
│                                 │                                    │
│  Visitors:     2,400            │  Healthy (70-100):  ██████████ 18  │
│  Signups:        120 (5.0%)     │  Attention (40-69): ████████   7   │
│  Activated:       72 (60.0%)    │  At-Risk (0-39):    ██████     3   │
│  Free→Paid:        8 (11.1%)   │                                    │
│  Expansion:        2 (25.0%)   │  Avg Health Score:  68/100         │
├─────────────────────────────────┼────────────────────────────────────┤
│  🔝 Top Acquisition Channels    │  ⚡ Quick Stats (24h)              │
│                                 │                                    │
│  1. Organic Search   42%  ↑3%  │  Scans completed:        127       │
│  2. Direct           28%  ─    │  Threats detected:        34       │
│  3. LinkedIn         15%  ↑7%  │  Reports generated:        8       │
│  4. ProductHunt       8%  ↓2%  │  New signups:              4       │
│  5. Referral          7%  ↑1%  │  Support tickets:          1       │
└─────────────────────────────────┴────────────────────────────────────┘
```

### 11.2 Product Analytics Dashboard

**Route**: `/dashboard/admin/analytics/product`
**Purpose**: Understand how users interact with the product

```
┌─────────────────────────────────────────────────────────────────────┐
│  Product Analytics                               Period: Last 30d  │
├──────────────────┬──────────────────┬──────────────────┬────────────┤
│  🎯 Activation   │  📱 DAU/MAU      │  ⏱️  TTFS        │  ✅ Scan%  │
│  Rate: 58%       │  Ratio: 0.35     │  Median: 7 min   │  96.2%    │
│  Target: 60%     │  Target: 0.40    │  Target: <10 min  │  Target:95│
├──────────────────┴──────────────────┴──────────────────┴────────────┤
│                                                                      │
│  Feature Adoption (30-day, paying customers)                        │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │  Manual Scan      ████████████████████████████████  95%    │      │
│  │  Auto Scan        █████████████████████████████     87%    │      │
│  │  View Threats     ████████████████████████████████  92%    │      │
│  │  Evidence          █████████████████████████        75%    │      │
│  │  Email Alerts     ████████████████████████          72%    │      │
│  │  Generate Report  ██████████████████                54%    │      │
│  │  Social Scan      ████████████████                  48%    │      │
│  │  Webhook Alerts   ████████                          24%    │      │
│  │  NRD Monitoring   ██████                            18%    │      │
│  └────────────────────────────────────────────────────────────┘      │
│                                                                      │
├─────────────────────────────────┬────────────────────────────────────┤
│  Retention Cohort (Weekly)      │  Active Users by Day of Week      │
│                                 │                                    │
│  W0: ████████████████████ 100%  │  Mon: ████████████████  42         │
│  W1: █████████████████    62%   │  Tue: ██████████████████ 48        │
│  W2: ███████████████      48%   │  Wed: █████████████████  45        │
│  W4: ██████████████       35%   │  Thu: ████████████████   43        │
│  W8: ████████████         28%   │  Fri: █████████████      35        │
│  W12: ██████████          22%   │  Sat: ██████             18        │
│                                 │  Sun: ████               12        │
└─────────────────────────────────┴────────────────────────────────────┘
```

### 11.3 Revenue & Subscription Dashboard

**Route**: `/dashboard/admin/analytics/revenue`

Key visualizations:
1. **MRR waterfall chart**: Start → New → Expansion → Contraction → Churned → End
2. **Subscription distribution**: Pie chart by tier
3. **Revenue by cohort**: How much revenue each monthly cohort generates over time
4. **LTV trend**: Rolling 3-month LTV calculation
5. **Churn analysis**: Cancellations by tenure month + stated reasons

### 11.4 Dashboard Implementation

```typescript
// src/app/dashboard/admin/analytics/page.tsx
// Uses server components to fetch from materialized views

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

async function getAnalyticsData() {
  const supabase = await createClient();
  
  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  
  if (!userData?.is_admin) redirect('/dashboard');
  
  // Fetch analytics data in parallel
  const [mrr, funnel, health, channels, quickStats] = await Promise.all([
    supabase.from('mv_daily_mrr').select('*').order('snapshot_date', { ascending: false }).limit(180),
    supabase.rpc('get_conversion_funnel', { period_days: 30 }),
    supabase.from('v_customer_health').select('*'),
    supabase.rpc('get_acquisition_channels', { period_days: 30 }),
    supabase.rpc('get_quick_stats', { period_hours: 24 }),
  ]);
  
  return { mrr, funnel, health, channels, quickStats };
}

export default async function AnalyticsDashboard() {
  const data = await getAnalyticsData();
  return <AnalyticsDashboardClient data={data} />;
}
```

---

## 12. Automated Reporting

### 12.1 Report Types & Schedule

| Report | Audience | Frequency | Delivery | Content |
|--------|----------|-----------|----------|---------|
| **Morning Brief** | Richard | Daily 7am AEST | Email | MRR, signups, health alerts, action items |
| **Weekly Digest** | Richard | Monday 8am AEST | Email | Full week metrics, trends, cohort updates |
| **Monthly Review** | Richard | 1st of month | Email + PDF | Complete business review, MoM comparisons |
| **Churn Alert** | Richard | Real-time | Email + Slack | When paying customer cancels or health <30 |
| **Milestone Alert** | Richard | Event-triggered | Email | New MRR milestone, customer milestone, etc. |
| **System Health** | Engineering | Daily + alerts | Monitoring channel | API health, error rates, scan success |

### 12.2 Daily Morning Brief Template

```
Subject: DoppelDown Daily Brief — Feb 5, 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DOPPELDOWN DAILY BRIEF — Wednesday, Feb 5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 REVENUE
   MRR: $4,200 (+$200 from yesterday)
   New customers: 1 (Growth tier)
   Churned: 0
   Net new MRR: +$79

👥 CUSTOMERS  
   Total paying: 28
   Free users: 142
   Signups yesterday: 3
   Activations: 2 (66% rate)

⭐ NORTH STAR: Weekly Active Brands Scanned
   This week: 45 (+3 from last week)
   Trend: ↑ (3 consecutive weeks of growth)

🚨 ATTENTION NEEDED
   ⚠️ Customer "Acme Corp" health dropped to 28 — no activity in 12 days
   ⚠️ Blog post "Typosquatting Guide" driving 40% of organic signups — consider updating
   ✅ No system issues

📈 WHAT'S WORKING
   • LinkedIn content driving 3 signups/week (up from 1)
   • New onboarding wizard: activation rate 58% → 62%
   • Scan success rate: 97.1%

📋 SUGGESTED ACTIONS
   1. Reach out to "Acme Corp" — personal email about new features
   2. Write follow-up blog post to typosquatting guide (high-intent traffic)
   3. Consider raising Growth price test (demand signal strong)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 12.3 Implementation

```typescript
// src/lib/analytics/daily-brief.ts

import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';

interface DailyBriefData {
  mrr: number;
  mrrChange: number;
  newCustomers: number;
  churned: number;
  totalPaying: number;
  totalFree: number;
  signupsYesterday: number;
  activationsYesterday: number;
  activationRate: number;
  wabs: number;
  wabsChange: number;
  attentionItems: string[];
  wins: string[];
  suggestedActions: string[];
}

export async function generateDailyBrief(): Promise<DailyBriefData> {
  const supabase = await createClient();
  
  // Fetch all required data
  const [mrrData, customerData, signupData, wabsData, healthAlerts] = await Promise.all([
    supabase.rpc('get_mrr_summary'),
    supabase.rpc('get_customer_counts'),
    supabase.rpc('get_signup_stats', { period_hours: 24 }),
    supabase.rpc('get_wabs'),
    supabase.from('v_customer_health').select('*').lt('health_score', 30),
  ]);
  
  const brief: DailyBriefData = {
    mrr: mrrData.data?.mrr || 0,
    mrrChange: mrrData.data?.mrr_change || 0,
    newCustomers: customerData.data?.new_24h || 0,
    churned: customerData.data?.churned_24h || 0,
    totalPaying: customerData.data?.total_paying || 0,
    totalFree: customerData.data?.total_free || 0,
    signupsYesterday: signupData.data?.count || 0,
    activationsYesterday: signupData.data?.activated || 0,
    activationRate: signupData.data?.activation_rate || 0,
    wabs: wabsData.data?.current || 0,
    wabsChange: wabsData.data?.change || 0,
    attentionItems: [],
    wins: [],
    suggestedActions: [],
  };
  
  // Generate attention items from health alerts
  if (healthAlerts.data?.length) {
    healthAlerts.data.forEach(customer => {
      brief.attentionItems.push(
        `⚠️ Customer "${customer.email}" health dropped to ${customer.health_score}`
      );
    });
  }
  
  return brief;
}

export async function sendDailyBrief(recipientEmail: string) {
  const brief = await generateDailyBrief();
  const html = renderDailyBriefEmail(brief);
  
  await sendEmail({
    to: recipientEmail,
    subject: `DoppelDown Daily Brief — ${new Date().toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`,
    html,
  });
}
```

**Cron route** (`/api/cron/daily-brief/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { sendDailyBrief } from '@/lib/analytics/daily-brief';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  await sendDailyBrief(process.env.ADMIN_EMAIL || 'richard@doppeldown.com');
  
  return NextResponse.json({ success: true });
}
```

### 12.4 Milestone Alerts

Trigger celebratory (and motivating) alerts on key business milestones:

| Milestone | Trigger | Message |
|-----------|---------|---------|
| **First Customer** | First `billing.checkout_completed` event | 🎉 First paying customer! |
| **$1K MRR** | MRR crosses $1,000 | 💰 $1K MRR milestone! |
| **$5K MRR** | MRR crosses $5,000 | 🚀 $5K MRR — ramen profitable! |
| **$10K MRR** | MRR crosses $10,000 | ⭐ $10K MRR — real business! |
| **100 Users** | Total users crosses 100 | 👥 100 users! |
| **1,000 Users** | Total users crosses 1,000 | 🏆 1,000 users! |
| **10,000 Threats Detected** | Cumulative threats crosses 10K | 🔍 10K threats found for customers |

---

## 13. Data-Informed Decision Framework

### 13.1 Decision Matrix

For every significant product/business decision, follow this framework:

```
┌──────────────────────────────────────────────────────────────────┐
│  DATA-INFORMED DECISION FRAMEWORK                                 │
│                                                                   │
│  1. STATE THE QUESTION                                           │
│     "Should we [do X] to improve [metric Y]?"                   │
│                                                                   │
│  2. CHECK EXISTING DATA                                          │
│     → Dashboard / SQL query / GA4                                │
│     → Is there already signal to make this decision?             │
│                                                                   │
│  3. IF UNCLEAR → DESIGN AN EXPERIMENT                            │
│     → Hypothesis: "If we do X, metric Y will change by Z%"      │
│     → Minimum sample: 50 events or 2 weeks (whichever first)    │
│     → Success criteria: Define before starting                   │
│                                                                   │
│  4. EXECUTE                                                      │
│     → Ship the change (feature flag if possible)                 │
│     → Monitor the metric daily                                   │
│                                                                   │
│  5. EVALUATE                                                     │
│     → Did it move the needle?                                    │
│     → Roll forward, iterate, or roll back                        │
│                                                                   │
│  6. DOCUMENT                                                     │
│     → Add to decision log with outcome                           │
└──────────────────────────────────────────────────────────────────┘
```

### 13.2 Key Questions & How to Answer Them

| Business Question | Data Source | Query/Method |
|-------------------|------------|--------------|
| "Are we growing?" | MRR trend, customer count, WABS | CEO Dashboard — 5 second glance |
| "Where are users dropping off?" | Funnel conversion rates | Funnel view — identify lowest conversion step |
| "Is our pricing right?" | Conversion rate by tier, upgrade/downgrade ratio | Revenue dashboard + pricing page analytics |
| "Which channel should we invest in?" | CAC by channel, channel conversion rate | Acquisition dashboard |
| "Are users getting value?" | Activation rate, TTFS, feature adoption | Product dashboard |
| "Who's about to churn?" | Customer health score <40 | Health score alert |
| "Is a feature worth building?" | Feature adoption rate, user requests | Feature adoption matrix + feedback |
| "Should we raise prices?" | Conversion rate trend, competitor pricing, churn at price point | Revenue + churn analysis |
| "What content should we write?" | Blog → signup attribution, keyword gap | Content attribution + Search Console |

### 13.3 Weekly Analytics Review Agenda

Every Monday, 15-minute self-review:

```
WEEKLY ANALYTICS REVIEW — [DATE]

1. NORTH STAR CHECK (2 min)
   □ WABS this week: ___  (vs last week: ___)
   □ Trend direction: ↑ / → / ↓

2. REVENUE CHECK (3 min)
   □ Current MRR: $___
   □ New MRR: $___
   □ Churned MRR: $___
   □ Net growth: ___% 

3. FUNNEL CHECK (3 min)
   □ Signups: ___
   □ Activation rate: ___%
   □ Free→Paid rate: ___%
   □ Biggest bottleneck: ___

4. CUSTOMER HEALTH (3 min)
   □ At-risk customers: ___
   □ Actions taken: ___
   □ Wins: ___

5. EXPERIMENTS (2 min)
   □ Active experiments: ___
   □ Results ready: ___

6. DECISION/ACTION (2 min)
   □ One thing to change this week: ___
   □ One thing that's working to double down on: ___
```

---

## 14. Implementation Roadmap

### Phase 1: Foundation (Week 1–2) — "Measure What Matters"

**Goal**: Start collecting events and see basic business metrics.

| Task | Effort | Impact | Priority |
|------|--------|--------|----------|
| Create `analytics_events` table | 1 hour | 🔴 | P0 |
| Create `revenue_events` table | 1 hour | 🔴 | P0 |
| Build server-side event tracker (`Analytics.track*`) | 2 hours | 🔴 | P0 |
| Add event tracking to signup flow | 1 hour | 🔴 | P0 |
| Add event tracking to scan flow | 1 hour | 🔴 | P0 |
| Add event tracking to Stripe webhook | 1 hour | 🔴 | P0 |
| Create `mv_daily_mrr` materialized view | 1 hour | 🔴 | P0 |
| Configure GA4 custom events | 2 hours | 🟡 | P1 |
| Add UTM capture to signup form | 1 hour | 🟡 | P1 |
| Create `/api/analytics/track` endpoint | 1 hour | 🟡 | P1 |
| **Total Phase 1** | **~12 hours** | | |

**Deliverable**: Events flowing into Supabase. MRR visible in SQL.

### Phase 2: Visibility (Week 3–4) — "See the Business"

**Goal**: Admin dashboard showing all key metrics at a glance.

| Task | Effort | Impact | Priority |
|------|--------|--------|----------|
| Build CEO Dashboard page (`/admin/analytics`) | 4 hours | 🔴 | P0 |
| Create conversion funnel SQL function | 2 hours | 🔴 | P0 |
| Create customer health score view | 2 hours | 🔴 | P0 |
| Create cohort retention materialized view | 2 hours | 🟡 | P1 |
| Build feature adoption tracking | 2 hours | 🟡 | P1 |
| Create acquisition channel attribution view | 2 hours | 🟡 | P1 |
| Set up pg_cron for materialized view refresh | 1 hour | 🟡 | P1 |
| Build product analytics sub-dashboard | 3 hours | 🟡 | P1 |
| **Total Phase 2** | **~18 hours** | | |

**Deliverable**: CEO and Product dashboards live. Can answer key business questions.

### Phase 3: Automation (Week 5–8) — "Intelligence, Not Just Data"

**Goal**: Proactive insights delivered automatically.

| Task | Effort | Impact | Priority |
|------|--------|--------|----------|
| Build daily morning brief email | 4 hours | 🔴 | P0 |
| Build weekly digest email | 3 hours | 🟡 | P1 |
| Implement churn alert (health score <30) | 2 hours | 🔴 | P0 |
| Implement milestone celebration alerts | 1 hour | 🟡 | P1 |
| Revenue dashboard with MRR waterfall | 3 hours | 🟡 | P1 |
| Build at-risk customer outreach triggers | 2 hours | 🟡 | P1 |
| Wire up user segmentation to real data | 4 hours | 🟠 | P2 |
| Add data retention cleanup cron | 1 hour | 🟠 | P2 |
| **Total Phase 3** | **~20 hours** | | |

**Deliverable**: Richard gets daily briefs. Churn alerts are automatic. Revenue trends visible.

### Phase 4: Advanced (Month 3+) — "Predict & Optimize"

**Goal**: Predictive analytics, experimentation, advanced BI.

| Task | Effort | Impact | Priority |
|------|--------|--------|----------|
| A/B testing framework (feature flags) | 8 hours | 🟠 | P2 |
| Churn prediction model (based on health score trends) | 6 hours | 🟠 | P2 |
| AI cost optimization analytics | 3 hours | 🟠 | P2 |
| Monthly PDF business review report | 4 hours | 🟠 | P2 |
| Customer journey mapping visualization | 6 hours | 🟠 | P2 |
| Evaluate PostHog integration (at 1K users) | 4 hours | 🟠 | P2 |
| Revenue forecasting (linear regression on MRR trend) | 4 hours | 🟠 | P2 |
| **Total Phase 4** | **~35 hours** | | |

### Total Investment

| Phase | Time | When | ROI |
|-------|------|------|-----|
| Phase 1 | ~12 hours | Week 1–2 | Unlocks all downstream analytics |
| Phase 2 | ~18 hours | Week 3–4 | Answers key business questions in seconds |
| Phase 3 | ~20 hours | Week 5–8 | Proactive intelligence, reduced churn |
| Phase 4 | ~35 hours | Month 3+ | Predictive capabilities, optimization |
| **Total** | **~85 hours** | | |

---

## 15. Appendix: SQL Views & Queries

### A. Daily Metrics Rollup

```sql
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_daily_metrics AS
SELECT 
    DATE_TRUNC('day', created_at) AS metric_date,
    
    -- User metrics
    COUNT(DISTINCT CASE WHEN event_name = 'user.signed_up' THEN user_id END) AS signups,
    COUNT(DISTINCT CASE WHEN event_name = 'user.logged_in' THEN user_id END) AS logins,
    COUNT(DISTINCT CASE WHEN event_name = 'onboarding.completed' THEN user_id END) AS onboarded,
    
    -- Scan metrics
    COUNT(CASE WHEN event_name = 'scan.initiated' THEN 1 END) AS scans_initiated,
    COUNT(CASE WHEN event_name = 'scan.completed' THEN 1 END) AS scans_completed,
    COUNT(CASE WHEN event_name = 'scan.failed' THEN 1 END) AS scans_failed,
    AVG(CASE WHEN event_name = 'scan.completed' 
        THEN (properties->>'duration_seconds')::NUMERIC END) AS avg_scan_duration,
    SUM(CASE WHEN event_name = 'scan.completed' 
        THEN (properties->>'threats_found')::INTEGER END) AS total_threats_found,
    
    -- Revenue metrics
    COUNT(CASE WHEN event_name = 'billing.checkout_started' THEN 1 END) AS checkouts_started,
    COUNT(CASE WHEN event_name = 'billing.checkout_completed' THEN 1 END) AS checkouts_completed,
    SUM(CASE WHEN event_name = 'billing.checkout_completed' 
        THEN (properties->>'amount_cents')::INTEGER END) AS revenue_cents,
    COUNT(CASE WHEN event_name = 'billing.subscription_cancelled' THEN 1 END) AS cancellations,
    
    -- Engagement metrics
    COUNT(CASE WHEN event_name = 'report.generated' THEN 1 END) AS reports_generated,
    COUNT(CASE WHEN event_name = 'threat.viewed' THEN 1 END) AS threats_viewed,
    COUNT(DISTINCT user_id) AS daily_active_users

FROM analytics_events
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY metric_date DESC;

-- Index for quick lookups
CREATE UNIQUE INDEX ON mv_daily_metrics(metric_date);
```

### B. Conversion Funnel Function

```sql
CREATE OR REPLACE FUNCTION get_conversion_funnel(period_days INTEGER DEFAULT 30)
RETURNS TABLE (
    stage TEXT,
    count BIGINT,
    conversion_rate NUMERIC
) AS $$
WITH stages AS (
    -- Stage 1: Visitors (from GA4 - approximate with signups × inverse conversion)
    -- Using signups as the first measurable stage in our system
    
    SELECT 'signup' AS stage, 
        COUNT(DISTINCT user_id) AS cnt
    FROM analytics_events 
    WHERE event_name = 'user.signed_up'
    AND created_at > NOW() - (period_days || ' days')::INTERVAL
    
    UNION ALL
    
    SELECT 'activated' AS stage,
        COUNT(DISTINCT user_id) AS cnt
    FROM analytics_events 
    WHERE event_name = 'scan.completed'
    AND user_id IN (
        SELECT user_id FROM analytics_events 
        WHERE event_name = 'user.signed_up'
        AND created_at > NOW() - (period_days || ' days')::INTERVAL
    )
    
    UNION ALL
    
    SELECT 'paid' AS stage,
        COUNT(DISTINCT user_id) AS cnt
    FROM analytics_events 
    WHERE event_name = 'billing.checkout_completed'
    AND user_id IN (
        SELECT user_id FROM analytics_events 
        WHERE event_name = 'user.signed_up'
        AND created_at > NOW() - (period_days || ' days')::INTERVAL
    )
),
ordered AS (
    SELECT stage, cnt,
        LAG(cnt) OVER (ORDER BY 
            CASE stage 
                WHEN 'signup' THEN 1 
                WHEN 'activated' THEN 2 
                WHEN 'paid' THEN 3 
            END
        ) AS prev_cnt
    FROM stages
)
SELECT 
    stage,
    cnt AS count,
    CASE WHEN prev_cnt IS NULL OR prev_cnt = 0 THEN 100.0
         ELSE ROUND(cnt::NUMERIC / prev_cnt * 100, 1)
    END AS conversion_rate
FROM ordered
ORDER BY CASE stage 
    WHEN 'signup' THEN 1 
    WHEN 'activated' THEN 2 
    WHEN 'paid' THEN 3 
END;
$$ LANGUAGE SQL;
```

### C. Weekly Active Brands Scanned (WABS)

```sql
CREATE OR REPLACE FUNCTION get_wabs()
RETURNS TABLE (
    current_wabs BIGINT,
    previous_wabs BIGINT,
    change_pct NUMERIC
) AS $$
WITH current_week AS (
    SELECT COUNT(DISTINCT s.brand_id) AS wabs
    FROM scans s
    WHERE s.status = 'completed'
    AND s.created_at > NOW() - INTERVAL '7 days'
),
previous_week AS (
    SELECT COUNT(DISTINCT s.brand_id) AS wabs
    FROM scans s
    WHERE s.status = 'completed'
    AND s.created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days'
)
SELECT 
    cw.wabs AS current_wabs,
    pw.wabs AS previous_wabs,
    CASE WHEN pw.wabs = 0 THEN 0
         ELSE ROUND((cw.wabs - pw.wabs)::NUMERIC / pw.wabs * 100, 1)
    END AS change_pct
FROM current_week cw, previous_week pw;
$$ LANGUAGE SQL;
```

### D. Acquisition Channel Attribution

```sql
CREATE OR REPLACE FUNCTION get_acquisition_channels(period_days INTEGER DEFAULT 30)
RETURNS TABLE (
    channel TEXT,
    signups BIGINT,
    activated BIGINT,
    paid BIGINT,
    activation_rate NUMERIC,
    paid_rate NUMERIC
) AS $$
SELECT 
    COALESCE(
        ae.properties->>'utm_source',
        CASE 
            WHEN ae.properties->>'referrer' LIKE '%google%' THEN 'organic_search'
            WHEN ae.properties->>'referrer' LIKE '%linkedin%' THEN 'linkedin'
            WHEN ae.properties->>'referrer' LIKE '%twitter%' THEN 'twitter'
            WHEN ae.properties->>'referrer' LIKE '%producthunt%' THEN 'producthunt'
            WHEN ae.properties->>'referrer' IS NULL OR ae.properties->>'referrer' = '' THEN 'direct'
            ELSE 'other'
        END
    ) AS channel,
    COUNT(DISTINCT ae.user_id) AS signups,
    COUNT(DISTINCT ae2.user_id) AS activated,
    COUNT(DISTINCT ae3.user_id) AS paid,
    ROUND(COUNT(DISTINCT ae2.user_id)::NUMERIC / NULLIF(COUNT(DISTINCT ae.user_id), 0) * 100, 1) AS activation_rate,
    ROUND(COUNT(DISTINCT ae3.user_id)::NUMERIC / NULLIF(COUNT(DISTINCT ae.user_id), 0) * 100, 1) AS paid_rate
FROM analytics_events ae
LEFT JOIN analytics_events ae2 ON ae2.user_id = ae.user_id AND ae2.event_name = 'scan.completed'
LEFT JOIN analytics_events ae3 ON ae3.user_id = ae.user_id AND ae3.event_name = 'billing.checkout_completed'
WHERE ae.event_name = 'user.signed_up'
AND ae.created_at > NOW() - (period_days || ' days')::INTERVAL
GROUP BY channel
ORDER BY signups DESC;
$$ LANGUAGE SQL;
```

### E. MRR Summary Function

```sql
CREATE OR REPLACE FUNCTION get_mrr_summary()
RETURNS TABLE (
    mrr_cents BIGINT,
    mrr_dollars NUMERIC,
    mrr_change_cents BIGINT,
    paying_customers BIGINT,
    arpu_cents BIGINT,
    tier_breakdown JSONB
) AS $$
WITH current_mrr AS (
    SELECT 
        SUM(CASE subscription_tier
            WHEN 'starter' THEN 7900
            WHEN 'professional' THEN 19900
            WHEN 'enterprise' THEN 49900
            ELSE 0
        END) AS total_cents,
        COUNT(*) AS customer_count,
        JSONB_OBJECT_AGG(
            subscription_tier, 
            sub_count
        ) AS breakdown
    FROM (
        SELECT subscription_tier, COUNT(*) AS sub_count
        FROM users
        WHERE subscription_status = 'active'
        AND subscription_tier != 'free'
        GROUP BY subscription_tier
    ) tier_counts
    CROSS JOIN (
        SELECT 
            SUM(CASE subscription_tier
                WHEN 'starter' THEN 7900
                WHEN 'professional' THEN 19900
                WHEN 'enterprise' THEN 49900
                ELSE 0
            END) AS total_cents,
            COUNT(*) AS customer_count
        FROM users
        WHERE subscription_status = 'active'
        AND subscription_tier != 'free'
    ) totals
),
yesterday_mrr AS (
    SELECT COALESCE(SUM(CASE 
        WHEN re.event_type = 'new_subscription' THEN re.amount_cents
        WHEN re.event_type = 'cancellation' THEN -re.amount_cents
        WHEN re.event_type = 'upgrade' THEN re.amount_cents
        WHEN re.event_type = 'downgrade' THEN -re.amount_cents
        ELSE 0
    END), 0) AS change
    FROM revenue_events re
    WHERE re.created_at > NOW() - INTERVAL '24 hours'
)
SELECT 
    cm.total_cents AS mrr_cents,
    ROUND(cm.total_cents / 100.0, 2) AS mrr_dollars,
    ym.change AS mrr_change_cents,
    cm.customer_count AS paying_customers,
    CASE WHEN cm.customer_count > 0 
         THEN cm.total_cents / cm.customer_count 
         ELSE 0 
    END AS arpu_cents,
    cm.breakdown AS tier_breakdown
FROM current_mrr cm, yesterday_mrr ym;
$$ LANGUAGE SQL;
```

---

## Appendix: GA4 Custom Events Configuration

Add these custom events to GA4 for traffic-side analytics (complement to server-side tracking):

```javascript
// In analytics.tsx — enhanced gtag events
export const GA4Events = {
  // Conversion events (mark as conversions in GA4 admin)
  signupCompleted: () => gtagEvent('sign_up', { method: 'email' }),
  checkoutStarted: (tier: string) => gtagEvent('begin_checkout', { 
    currency: 'USD',
    items: [{ item_name: tier }]
  }),
  purchaseCompleted: (tier: string, value: number) => gtagEvent('purchase', {
    currency: 'USD',
    value,
    items: [{ item_name: tier }]
  }),
  
  // Engagement events
  scanInitiated: (scanType: string) => gtagEvent('scan_initiated', { scan_type: scanType }),
  threatViewed: (severity: string) => gtagEvent('threat_viewed', { severity }),
  reportGenerated: () => gtagEvent('report_generated'),
  
  // Content events  
  blogViewed: (slug: string) => gtagEvent('blog_viewed', { article: slug }),
  ctaClicked: (location: string, target: string) => gtagEvent('cta_clicked', { 
    cta_location: location,
    cta_target: target 
  }),
  pricingViewed: (currentTier: string) => gtagEvent('pricing_viewed', { current_tier: currentTier }),
};
```

**GA4 conversions to configure** (in GA4 Admin → Events → Mark as conversion):
- `sign_up`
- `begin_checkout`
- `purchase`
- `scan_initiated` (proxy for activation)

---

## Appendix: Metrics Glossary

| Term | Definition |
|------|-----------|
| **MRR** | Monthly Recurring Revenue — predictable monthly income from subscriptions |
| **ARR** | Annual Recurring Revenue — MRR × 12 |
| **ARPU** | Average Revenue Per User — MRR / paying customers |
| **LTV** | Customer Lifetime Value — total revenue expected from one customer |
| **CAC** | Customer Acquisition Cost — marketing spend to acquire one customer |
| **Churn** | Customer or revenue lost in a period |
| **NRR** | Net Revenue Retention — measures expansion vs contraction + churn |
| **WABS** | Weekly Active Brands Scanned — DoppelDown's North Star metric |
| **TTFS** | Time to First Scan — activation speed metric |
| **DAU/MAU** | Daily/Monthly Active Users |
| **PLG** | Product-Led Growth — growth model where product drives acquisition |
| **Cohort** | Group of users who signed up in the same time period |
| **Health Score** | Composite score (0–100) predicting customer satisfaction/retention |
| **Activation** | Moment when a user first gets core value (first successful scan) |
| **Expansion** | Revenue increase from existing customers (upgrades, add-ons) |

---

*This strategy should be reviewed monthly as the product matures. Phase 1–2 should be implemented immediately — you can't optimize what you can't measure. As the data flows in, the specific dashboards and reports will evolve based on what we learn.*

*"In God we trust. All others must bring data." — W. Edwards Deming*
