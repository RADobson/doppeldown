# DoppelDown: User Onboarding & Activation Optimization Strategy
*Version 1.0 | Prepared: 2026-02-05*
*Companion documents: CUSTOMER_ACQUISITION_GROWTH_STRATEGY.md, USER_RESEARCH_FEEDBACK_STRATEGY.md, GTM_PLAYBOOK.md*

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Audit](#2-current-state-audit)
3. [Activation Framework: The Aha Moment](#3-activation-framework-the-aha-moment)
4. [Onboarding Flow Redesign](#4-onboarding-flow-redesign)
5. [Persona-Based Onboarding Paths](#5-persona-based-onboarding-paths)
6. [Email Drip Sequences](#6-email-drip-sequences)
7. [In-App Guidance System](#7-in-app-guidance-system)
8. [Behavioral Triggers & Nudges](#8-behavioral-triggers--nudges)
9. [Activation Metrics & Measurement](#9-activation-metrics--measurement)
10. [Conversion Optimization: Free → Paid](#10-conversion-optimization-free--paid)
11. [Churn Prevention & Re-engagement](#11-churn-prevention--re-engagement)
12. [Technical Implementation Plan](#12-technical-implementation-plan)
13. [A/B Testing Roadmap](#13-ab-testing-roadmap)
14. [Quarterly Execution Plan](#14-quarterly-execution-plan)

---

## 1. Executive Summary

### The Problem

DoppelDown's PLG (Product-Led Growth) model lives or dies on one metric: **how fast users go from signup to "holy shit, someone is impersonating my brand."** That's the aha moment. Every second of confusion, every unnecessary step, every missing tooltip between signup and that first threat detection is a user who bounces and never comes back.

The current onboarding exists (3-step in-dashboard flow, onboarding types, database tables for achievements/tours/checklists) but it's **scaffolding, not a system**. The pieces are built. What's missing is the orchestration — the behavioral intelligence that adapts the experience to each user and relentlessly drives them toward activation.

### The Thesis

DoppelDown's activation rate is the single highest-leverage growth metric. Here's why:

```
Current funnel (estimated):
  Visit landing page          1,000
  Sign up (free)               100   (10% conversion — good for B2B SaaS)
  Add first brand               40   (40% of signups — too many drop off)
  Run first scan                25   (62% of brand-adders — decent)
  See first threat              20   (80% of scanners — product works)
  Return within 7 days          10   (50% of activated — retention gap)
  Convert to paid                3   (30% of retained — solid conversion)

If we improve "Add first brand" from 40% → 70%:
  → Paid customers: 3 → 5.25   (+75%)
  → MRR impact at $99 avg: +$222/mo per 1,000 visitors

If we improve "Return within 7 days" from 50% → 70%:
  → Paid customers: 5.25 → 7.35  (+40% additional)
```

**Small activation improvements create massive revenue compounding.** This strategy targets a 2x improvement in the signup-to-activation rate within 90 days.

### Key Principles

1. **Time-to-first-value under 5 minutes** — Signup to seeing threats. No exceptions.
2. **Show, don't tell** — Every screen earns its existence by moving the user toward the aha moment.
3. **Personalize ruthlessly** — A CISO and a small business owner need completely different experiences.
4. **Behavioral triggers over time-based triggers** — React to what users DO, not when they signed up.
5. **Remove friction, then add delight** — Fix the basics before gamifying anything.

---

## 2. Current State Audit

### What Exists (Built)

| Component | Status | Location | Assessment |
|-----------|--------|----------|------------|
| Onboarding types | ✅ Complete | `src/types/onboarding.ts` | Comprehensive — roles, industries, use cases, achievements, tours defined |
| Onboarding DB schema | ✅ Complete | `supabase/migrations/20260203_onboarding.sql` | 7 tables: user_onboarding, achievements, preferences, tour_progress, user_activity, feature_usage, onboarding_checklist |
| Achievement definitions | ✅ Seeded | Migration file | 19 achievements across 5 categories, 4 tiers |
| Onboarding context provider | ✅ Complete | `src/lib/onboarding-context.tsx` | Full React context with checklist, achievements, adaptive UI hooks |
| Onboarding lib functions | ✅ Complete | `src/lib/onboarding.ts` | CRUD for onboarding, achievements, preferences, tour progress |
| Dashboard onboarding flow | ✅ Basic | `src/app/dashboard/page.tsx` | 3-step: Add Brand → Scan → Complete. Functional but minimal. |
| Email system | ✅ Basic | `src/lib/email.ts` | Threat alerts, weekly digests. No onboarding drip sequence. |
| Adaptive UI hook | ✅ Complete | `src/lib/onboarding-context.tsx` | `useAdaptiveUI()` — adjusts complexity by user level |
| Product tours | ✅ Defined | `src/types/onboarding.ts` | Dashboard, Threat Details, Brand Setup tours defined (not rendered) |

### What's Missing (Critical Gaps)

| Gap | Impact | Priority |
|-----|--------|----------|
| **No onboarding email drip sequence** | Users who don't activate on day 1 are lost forever. No re-engagement mechanism. | 🔴 P0 |
| **Tours are defined but not rendered** | Tour steps exist in types but no UI component renders them. Users get no guided walkthrough. | 🔴 P0 |
| **No persona branching in onboarding flow** | Role/industry/use-case are collected in types but the dashboard `OnboardingFlow` ignores them entirely — everyone gets the same 3 steps. | 🔴 P0 |
| **No progress persistence across sessions** | `OnboardingFlow` in `dashboard/page.tsx` uses local state (`useState`). If user leaves mid-onboarding, progress resets. | 🔴 P0 |
| **No behavioral event tracking** | `user_activity` table exists but nothing writes to it. Can't trigger nudges without events. | 🟡 P1 |
| **Achievement triggers not wired** | Achievement definitions seeded, `unlockAchievement()` works, but no scan/threat/report events call it. | 🟡 P1 |
| **No in-app notification/toast system for achievements** | Achievements unlock silently. Users never see the gamification. | 🟡 P1 |
| **Checklist not rendered in dashboard** | `OnboardingContext` builds checklist items but dashboard doesn't display them after initial onboarding. | 🟡 P1 |
| **No upgrade nudges at limit boundaries** | Free tier limits exist in Stripe but no in-app UI shows "you've used 1/1 brands, upgrade for more." | 🟡 P1 |
| **No "empty state" optimization** | Dashboard shows loading spinner then basic onboarding. No sample data, no demo mode, no previews. | 🟢 P2 |

### Current User Journey (As-Is)

```
1. Land on marketing page
2. Click "Get Started Free"
3. Supabase auth (email/password or OAuth)
4. Redirect to /dashboard
5. Dashboard detects 0 brands → shows OnboardingFlow
6. Step 1: Add Brand (name, domain, keywords, social handles)
7. Step 2: Run First Scan (poll for completion)
8. Step 3: "You're All Set!" → redirect to dashboard
9. Dashboard shows stats, threats, brands
10. ...then what? No guidance. No next steps. No email follow-up.
```

**Drop-off points (estimated):**
- After signup, before adding brand: **~60% drop-off** (the form asks for too much upfront)
- During scan (takes minutes): **~15% abandon** (no engagement while waiting)
- After first scan with 0 threats: **~40% never return** (no perceived value)
- After first scan with threats: **~20% never return** (saw value but no next-step guidance)

---

## 3. Activation Framework: The Aha Moment

### Defining DoppelDown's Aha Moment

The aha moment is NOT "signed up" or "added a brand." It's:

> **"The moment a user sees a real threat against THEIR brand and understands what it means."**

This is when the user viscerally understands why DoppelDown exists. A typosquatting domain registered against their brand. A fake social account using their logo. A phishing page copying their login. That's the moment where free users become future paying customers.

### Activation Milestones

We define a **graduated activation model** with measurable milestones:

```
Level 0: REGISTERED          — Created account
Level 1: SETUP COMPLETE      — Added first brand with domain
Level 2: FIRST SCAN          — Completed first scan (any type)
Level 3: ACTIVATED ⭐        — Viewed first threat detail page (the aha moment)
Level 4: ENGAGED             — Returned within 7 days after first scan
Level 5: POWER USER          — Generated a report OR ran 3+ scans
Level 6: CONVERTED           — Upgraded to paid plan
```

**Primary activation metric:** % of signups reaching Level 3 within 48 hours.
**Target:** 50% of signups reach Level 3 within 48 hours (up from estimated ~20%).

### Time-to-Value Targets

| Action | Current (est.) | Target | How |
|--------|---------------|--------|-----|
| Signup → Brand added | ~8 minutes | < 2 minutes | Simplified form, domain auto-detect, skip optional fields |
| Brand added → Scan started | ~2 minutes | < 30 seconds | Auto-scan on brand creation (already supported via `auto_scan_on_add` preference) |
| Scan started → Results visible | 2-5 minutes | 2-5 minutes (unchanged) | Show streaming results during scan |
| Results visible → Threat viewed | ~3 minutes | < 1 minute | Auto-navigate to highest-severity threat, highlight it |
| **Total: Signup → Aha moment** | **~15 minutes** | **< 5 minutes** | Combined improvements above |

---

## 4. Onboarding Flow Redesign

### Design Principles

1. **Progressive disclosure** — Ask only what's needed NOW. Collect profile/role/industry LATER.
2. **Instant gratification** — Show something valuable before asking for anything.
3. **Fail forward** — If a scan finds no threats, that IS the value ("your brand is clean").
4. **Persistent progress** — Survive page refreshes, tab closes, session interruptions.

### Redesigned Flow: "Brand in 60 Seconds"

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  STEP 1: THE ONLY REQUIRED STEP (30 seconds)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  "What's your brand's website?"                       │   │
│  │                                                       │   │
│  │  [  acme.com  ]                                       │   │
│  │                                                       │   │
│  │  We'll auto-detect your brand name, logo, and         │   │
│  │  social accounts. You can edit these later.            │   │
│  │                                                       │   │
│  │  [ 🚀 Protect My Brand ]                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  WHAT HAPPENS ON SUBMIT:                                     │
│  1. Fetch domain → extract brand name, favicon, meta desc    │
│  2. Auto-create brand with detected info                     │
│  3. Auto-start scan immediately                              │
│  4. Redirect to scan-progress view                           │
│                                                              │
│  STEP 2: SCAN PROGRESS (2-5 minutes, keep user engaged)     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🔍 Scanning acme.com...                              │   │
│  │                                                       │   │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░ 58%                       │   │
│  │                                                       │   │
│  │  ✅ 347 typosquat domains checked                     │   │
│  │  ✅ 12 social platforms scanned                       │   │
│  │  ⏳ Analyzing web results...                          │   │
│  │                                                       │   │
│  │  🚨 3 potential threats found so far                  │   │
│  │  ┌─────────────────────────────────────────┐         │   │
│  │  │ 🔴 CRITICAL  acme-login.com             │         │   │
│  │  │    Possible phishing page detected       │         │   │
│  │  ├─────────────────────────────────────────┤         │   │
│  │  │ 🟡 MEDIUM   @acme_official (Instagram)  │         │   │
│  │  │    Potential brand impersonation          │         │   │
│  │  └─────────────────────────────────────────┘         │   │
│  │                                                       │   │
│  │  💡 While you wait:                                   │   │
│  │  "Did you know? 83% of phishing attacks use domains   │   │
│  │   that are 1-2 characters different from the real     │   │
│  │   brand. That's exactly what we're scanning for."     │   │
│  │                                                       │   │
│  │  ── Optional: Tell us about yourself ──               │   │
│  │  What's your role?  [dropdown]                        │   │
│  │  Company size?      [dropdown]                        │   │
│  │  Industry?          [dropdown]                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  STEP 3: RESULTS & NEXT STEPS                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ✅ Scan Complete — 5 threats detected                │   │
│  │                                                       │   │
│  │  [Threats found]        OR       [No threats found]   │   │
│  │  ┌──────────────┐               ┌──────────────────┐ │   │
│  │  │ View Threats  │               │ Your brand looks  │ │   │
│  │  │ (primary CTA)│               │ clean! Here's     │ │   │
│  │  │              │               │ what we checked:  │ │   │
│  │  │ Next: Review │               │                   │ │   │
│  │  │ your threats │               │ • 500+ domains    │ │   │
│  │  │ and generate │               │ • 8 social sites  │ │   │
│  │  │ a takedown   │               │ • Web lookalikes  │ │   │
│  │  │ report.      │               │                   │ │   │
│  │  └──────────────┘               │ We'll notify you  │ │   │
│  │                                  │ if anything       │ │   │
│  │                                  │ appears.          │ │   │
│  │                                  └──────────────────┘ │   │
│  │                                                       │   │
│  │  ── What to do next (personalized checklist) ──       │   │
│  │  ☐ Review detected threats                            │   │
│  │  ☐ Set up email alerts                                │   │
│  │  ☐ Add social media handles for deeper monitoring     │   │
│  │  ☐ Generate your first takedown report                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Key Changes from Current Flow

| Current | Redesigned | Why |
|---------|-----------|-----|
| Step 1 asks: name, domain, keywords, 4 social handles | Step 1 asks: domain only | Reduce friction. Auto-detect the rest. |
| Scan requires manual "Start Scan" button click | Auto-scan on brand creation | Remove a decision point. One less place to drop off. |
| Scan progress shows spinner + numbers only | Live-streaming threat discoveries + educational content + optional profile collection | Keep users engaged during the wait. Collect profile data as a "while you wait" activity instead of a gate. |
| Completion page is generic | Personalized next steps based on results + role | Give clear direction, not just "you're all set." |
| Local state (resets on refresh) | Persisted to `user_onboarding` table + localStorage fallback | Never lose progress. |

### Domain Auto-Detection API

New API endpoint to power the simplified onboarding:

```typescript
// POST /api/brands/detect
// Input: { domain: "acme.com" }
// Output: {
//   name: "Acme Corp",                    // from <title> or Open Graph
//   domain: "acme.com",
//   favicon: "https://acme.com/favicon.ico",
//   description: "Leading provider of...", // from meta description
//   social_handles: {
//     twitter: "@acmecorp",               // from page meta/links
//     facebook: "acmecorp",
//     linkedin: "acme-corp",
//     instagram: "acmecorp"
//   },
//   suggested_keywords: ["acme", "acme corp", "acmecorp"],
//   logo_url: "https://acme.com/logo.png"  // from Open Graph image
// }
```

This lets users enter ONE field (their domain) and we populate everything else. Users can edit/confirm on the brand detail page later.

---

## 5. Persona-Based Onboarding Paths

### Persona Definitions

DoppelDown's existing type system defines 5 roles. Each needs a distinct activation path:

#### Persona 1: Business Owner / Founder
- **Mental model:** "Is anyone impersonating my business?"
- **Technical level:** Low-medium
- **Time budget:** Minimal (want results fast)
- **Key concern:** Reputation damage, customer trust
- **Aha trigger:** Seeing a fake domain or social account using their brand name

**Optimized path:**
```
Domain entry → Auto-scan → See threats → "Generate Takedown Report" CTA
Skip: API docs, webhook setup, detailed scan configs
Emphasize: Plain-language threat descriptions, business impact, recommended actions
Email sequence: Focus on "what this means for your business" framing
```

#### Persona 2: Brand Manager
- **Mental model:** "Is our brand identity being misused?"
- **Technical level:** Medium
- **Time budget:** Moderate (willing to configure)
- **Key concern:** Brand consistency, social media impersonation
- **Aha trigger:** Fake social accounts or trademark-infringing domains

**Optimized path:**
```
Domain entry → Add social handles → Scan (social-heavy) → See social threats
Emphasize: Social media scanning, visual similarity, logo detection
Show: Side-by-side brand vs. impostor comparisons
Email sequence: Weekly brand health digest, social monitoring focus
```

#### Persona 3: Security Researcher / CISO
- **Mental model:** "What's the attack surface for our brand?"
- **Technical level:** High
- **Time budget:** Willing to invest for thoroughness
- **Key concern:** Phishing infrastructure, technical indicators
- **Aha trigger:** Discovering active phishing pages or malicious infrastructure

**Optimized path:**
```
Domain entry → Full scan → Technical threat details (WHOIS, DNS, certificates)
Emphasize: Technical evidence, IOCs, API access, webhook notifications
Show: Threat scores, risk matrices, evidence collection details
Email sequence: Technical digest, new threat intelligence framing
```

#### Persona 4: Marketing Manager
- **Mental model:** "Is anyone damaging our brand online?"
- **Technical level:** Low-medium
- **Time budget:** Moderate
- **Key concern:** Customer confusion, brand dilution
- **Aha trigger:** Lookalike websites or keyword-squatting domains

**Optimized path:**
```
Domain entry → Add brand keywords → Scan → Lookalike/keyword results
Emphasize: Customer-facing impact, visual comparisons, SEO poisoning
Show: How impostor sites might appear in search results
Email sequence: Brand monitoring digest, industry benchmarks
```

#### Persona 5: Developer / Engineer
- **Mental model:** "How can I integrate this into our security stack?"
- **Technical level:** High
- **Time budget:** Varies
- **Key concern:** API access, automation, integrations
- **Aha trigger:** Clean API response with actionable threat data

**Optimized path:**
```
Domain entry → Auto-scan → Results → API Documentation CTA + Webhook Setup
Emphasize: API docs, code examples, webhook payloads, CLI access
Show: Raw JSON responses, integration guides
Email sequence: API changelog, developer tips, integration spotlight
```

### Persona Detection & Routing

Personas are detected through three signals, in order of reliability:

**1. Explicit declaration (highest confidence)**
- During scan wait time, user selects role from dropdown
- Stored in `user_onboarding.role`

**2. Behavioral inference (medium confidence)**
- If user navigates to API docs first → likely Developer
- If user clicks social media scanning → likely Brand Manager
- If user checks WHOIS data → likely Security Researcher
- Tracked via `user_activity` and `feature_usage` tables

**3. Signup context (lowest confidence)**
- Referral source (from UTM params stored in `user_onboarding.referral_source`)
- If from LinkedIn cybersecurity group → likely Security Researcher
- If from Product Hunt → likely Business Owner or Developer
- If from marketing blog post → likely Brand/Marketing Manager

### Adaptive Dashboard Configuration by Persona

```typescript
const PERSONA_DASHBOARD_CONFIGS: Record<UserRole, DashboardLayout> = {
  business_owner: {
    widgets: ['stats', 'threats', 'quick_actions', 'brands'],
    // Simplified view, big numbers, clear actions
  },
  brand_manager: {
    widgets: ['brands', 'threats', 'recent_scans', 'security_score'],
    // Brand-centric, social emphasis
  },
  security_researcher: {
    widgets: ['threats', 'stats', 'recent_scans', 'security_score', 'brands'],
    // Threat-first, technical detail
  },
  marketing_manager: {
    widgets: ['brands', 'stats', 'threats', 'quick_actions'],
    // Brand health focus
  },
  developer: {
    widgets: ['recent_scans', 'threats', 'stats', 'quick_actions'],
    // Data-first, API access prominent
  },
  other: {
    widgets: ['threats', 'brands', 'recent_scans', 'stats', 'quick_actions'],
    // Balanced default
  },
};
```

---

## 6. Email Drip Sequences

### Architecture

DoppelDown needs three email tracks that run in parallel:

1. **Onboarding Sequence** — Drives activation for new signups (behavioral triggers)
2. **Engagement Sequence** — Maintains habit for activated users (time-based + behavioral)
3. **Conversion Sequence** — Nudges free users toward paid (limit-triggered + time-based)

All emails should be **behavioral**, not purely time-based. An email saying "Run your first scan!" to someone who already ran 5 scans is insulting.

### Track 1: Onboarding Sequence

**Trigger:** User creates account

```
EMAIL 1: "Welcome — Your Brand Protection Starts Now"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger:  Immediately after signup
Goal:     Get user to add first brand
Skip if:  User already added a brand (check brands table)

Subject: "Welcome to DoppelDown — let's find out who's targeting your brand"
Content:
  - Welcome + reinforce their decision
  - Single CTA: "Add your brand and scan in 60 seconds"
  - Social proof: "Join 200+ businesses protecting their brand" (or real number)
  - Quick stat: "The average brand has 3-5 impersonating domains they don't know about"

────────────────────────────────────────────────────

EMAIL 2: "Your brand could be at risk right now"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger:  24 hours after signup, IF no brand added
Goal:     Urgency + education → add brand
Skip if:  User has added a brand

Subject: "83% of businesses have impostor domains — yours might too"
Content:
  - Educational hook: phishing stats relevant to their industry (if known)
  - Show example: screenshot of a real typosquat detection
  - Single CTA: "Find out in 60 seconds — free scan"
  - Objection handling: "No credit card needed. Takes 60 seconds."

────────────────────────────────────────────────────

EMAIL 3: "We found something you should see"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger:  First scan completes (within minutes)
Goal:     Get user to VIEW threat details (activation!)
Skip if:  User has already viewed a threat detail page

Subject A (threats found): "🚨 [count] threats detected against [brand name]"
Subject B (no threats):    "✅ Good news: [brand name] looks clean (here's what we checked)"

Content (threats found):
  - Summary: X threats found, Y critical
  - Top 3 threats with one-line descriptions
  - Single CTA: "View threat details and take action"
  - Urgency: "Critical threats should be addressed within 48 hours"

Content (no threats):
  - Reassurance: "Your brand appears clean right now"
  - What we checked (reinforce value even with 0 results)
  - "We'll notify you instantly if anything appears"
  - CTA: "Add more keywords or social accounts for deeper coverage"

────────────────────────────────────────────────────

EMAIL 4: "Your first week of brand protection"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger:  7 days after signup, IF user hasn't returned since day 1
Goal:     Re-engagement + habit formation
Skip if:  User has been active in the last 3 days

Subject: "Your weekly brand protection summary"
Content:
  - Summary of what happened in their first week
  - If threats: "X threats are still unresolved" (create urgency)
  - If no threats: "0 new threats — your brand stays protected"
  - Feature discovery: introduce one feature they haven't used
    (based on feature_usage table)
  - CTA: "Check your dashboard"

────────────────────────────────────────────────────

EMAIL 5: "Pro tip: [persona-specific feature]"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger:  14 days after signup
Goal:     Feature discovery + deepening engagement
Skip if:  User is already a power user (3+ scans or report generated)

Subject (business_owner):    "Generate takedown reports in one click"
Subject (brand_manager):     "Social media monitoring: find fake accounts fast"
Subject (security_researcher): "API access: integrate DoppelDown into your workflow"
Subject (marketing_manager):  "How to monitor your brand keywords"
Subject (developer):          "DoppelDown API: automate your brand protection"

Content: Persona-appropriate feature spotlight with step-by-step guide
```

### Track 2: Engagement Sequence (Post-Activation)

```
WEEKLY DIGEST (already partially built in email.ts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger:  Weekly, every Monday at 9am user's timezone
Goal:     Habit formation — make DoppelDown a weekly ritual
Skip if:  User has opted out (email_weekly_digest preference)

Content:
  - Threats detected this week (new, resolved, still active)
  - Protection score trend (up/down from last week)
  - One insight: "This week, [brand] had 2 new typosquat domains registered"
  - CTA: "View full dashboard"

────────────────────────────────────────────────────

MONTHLY BRAND HEALTH REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger:  Monthly, 1st of month
Goal:     Demonstrate ongoing value, justify subscription
Skip if:  User has opted out

Content:
  - Month-over-month comparison: threats, scans, protection score
  - "Value delivered" section:
    - "X domains monitored"
    - "Y threats detected and alerted"
    - "Z evidence packages collected"
  - Industry benchmark: "Average [industry] company sees X threats/month"
  - For free users: gentle upgrade nudge based on approaching limits

────────────────────────────────────────────────────

ACHIEVEMENT NOTIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger:  Achievement unlocked
Goal:     Positive reinforcement, feature discovery
Skip if:  User has opted out of email_product_updates

Content:
  - 🏆 "You unlocked: [Achievement Name]!"
  - What they did to earn it
  - Their total points and level
  - Hint at next achievable achievement
  - CTA: "See all your achievements"
```

### Track 3: Conversion Sequence (Free → Paid)

```
LIMIT APPROACHING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger:  User reaches 80% of free tier limits
Goal:     Pre-empt frustration, frame upgrade as growth

Subject: "Your brand protection is working — ready for more?"
Content:
  - Celebrate: "You've used [X] of your [limit] — that means DoppelDown is working!"
  - What they'd get with Starter: more brands, more scans, priority scanning
  - Social proof: "[X] users upgraded last month"
  - Limited-time offer (if applicable): "Upgrade this week for [deal]"
  - CTA: "See plans"

────────────────────────────────────────────────────

LIMIT HIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger:  User hits free tier limit (tries to add 2nd brand, etc.)
Goal:     Immediate conversion opportunity

Subject: "You've outgrown the free plan — here's your next step"
Content:
  - Acknowledge the limit clearly
  - Show the value they've gotten: "[X] threats detected, [Y] scans completed"
  - ROI framing: "$49/mo is less than the cost of one phishing incident"
  - Plans comparison table
  - CTA: "Upgrade now" (direct checkout link)

────────────────────────────────────────────────────

VALUE DEMONSTRATION (30-day mark)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger:  30 days after signup, still on free plan
Goal:     Show cumulative value, make the case for paid

Subject: "Your first 30 days: here's what DoppelDown found"
Content:
  - Full 30-day summary with impressive numbers
  - Cost-of-inaction framing:
    "The average cost of a successful phishing attack is $17,700.
     You've been protected for free. Upgrade to stay protected."
  - Testimonial (when available)
  - CTA: "Upgrade to Starter — $49/mo"
```

### Email Implementation Notes

```typescript
// New file: src/lib/email-drip.ts

interface DripEmail {
  id: string;
  track: 'onboarding' | 'engagement' | 'conversion';
  trigger: 'time' | 'behavioral' | 'limit';
  triggerCondition: {
    event?: string;          // e.g., 'signup', 'scan_complete', 'brand_added'
    delayHours?: number;     // hours after trigger event
    skipIf: SkipCondition[]; // conditions that skip this email
  };
  template: string;          // email template name
  personalization: {
    usePersona: boolean;
    useIndustry: boolean;
    useScanResults: boolean;
  };
}

interface SkipCondition {
  table: string;     // Supabase table to check
  column: string;    // Column to check
  operator: 'exists' | 'gt' | 'lt' | 'eq';
  value?: any;
}
```

---

## 7. In-App Guidance System

### Tour Renderer Component

The existing `PRODUCT_TOURS` type definitions need a rendering component. Design:

```typescript
// New component: src/components/onboarding/TourOverlay.tsx

interface TourOverlayProps {
  tourId: string;          // matches PRODUCT_TOURS key
  onComplete: () => void;
  onSkip: () => void;
}

// Renders as:
// - Spotlight effect on target element (dark overlay with cutout)
// - Tooltip positioned next to target element
// - Step counter (1/5, 2/5, etc.)
// - Next / Back / Skip buttons
// - Anchored to DOM elements via data-tour-step="step-id" attributes
```

### Implementation: `data-tour-step` Anchors

Add semantic attributes to dashboard components that tours can target:

```tsx
// In dashboard/page.tsx
<div data-tour-step="dashboard-threats">
  <Card>
    <CardTitle>Recent Threats</CardTitle>
    ...
  </Card>
</div>

<div data-tour-step="dashboard-brands">
  <Card>
    <CardTitle>Your Brands</CardTitle>
    ...
  </Card>
</div>

<div data-tour-step="dashboard-quick-actions">
  ...
</div>
```

### Contextual Tooltips

Beyond tours, individual tooltips should appear for first-time feature discovery:

```typescript
// New component: src/components/onboarding/FeatureTooltip.tsx

interface FeatureTooltipProps {
  featureId: string;       // e.g., 'threat-score', 'evidence-collection'
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;     // wraps the target element
  showOnce?: boolean;      // dismiss permanently after first view
}

// Usage:
<FeatureTooltip
  featureId="threat-score"
  content="Higher scores indicate greater risk. Scores above 70 are typically real threats."
  position="bottom"
  showOnce
>
  <span className="threat-score">Score: 85</span>
</FeatureTooltip>
```

Tooltip dismissal state is stored in `user_preferences.feature_hints_dismissed` (already in schema).

### Empty State Optimization

Every empty state is an activation opportunity:

```
┌─────────────────────────────────────────────────────┐
│ Current empty state (threats page, no threats):      │
│                                                      │
│   🛡️ No threats detected                            │
│   Run a scan to check for potential threats          │
│                                                      │
│ Redesigned empty state:                              │
│                                                      │
│   🛡️ No threats detected yet                        │
│                                                      │
│   That's good news! But threats can appear anytime.  │
│   Here's what we're watching for:                    │
│                                                      │
│   • Typosquatting domains (e.g., acme-login.com)     │
│   • Fake social accounts using your brand            │
│   • Phishing pages copying your website              │
│   • Newly registered lookalike domains               │
│                                                      │
│   [Run a New Scan]   [Set Up Daily Auto-Scan]        │
│                                                      │
│   💡 Pro tip: Add social media handles for           │
│      deeper coverage                                 │
└─────────────────────────────────────────────────────┘
```

### Persistent Onboarding Checklist (Post-Wizard)

After the initial onboarding wizard completes, a persistent checklist widget should appear in the dashboard sidebar:

```
┌─────────────────────────────────────────┐
│ 📋 Getting Started  (3/6 complete)      │
│ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░ 50%              │
│                                         │
│ ✅ Complete your profile                │
│ ✅ Add your first brand                 │
│ ✅ Run your first scan                  │
│ ☐  Review detected threats              │
│ ☐  Configure email notifications        │
│ ☐  Generate a takedown report           │
│                                         │
│ [Dismiss checklist]                     │
└─────────────────────────────────────────┘
```

- Checklist items link to relevant pages
- Items auto-complete based on `onboarding_checklist` table + behavioral detection
- Dismissable but comes back (muted) until fully complete
- Unlocks "Ready for Action" achievement when 100% complete

---

## 8. Behavioral Triggers & Nudges

### Event Tracking Architecture

The existing `user_activity` table needs an event pipeline. Define standard events:

```typescript
// src/lib/analytics/events.ts

export type ActivationEvent =
  // Onboarding events
  | { type: 'signup_complete' }
  | { type: 'onboarding_started' }
  | { type: 'onboarding_step_completed'; step: string }
  | { type: 'onboarding_skipped' }
  | { type: 'onboarding_completed' }
  
  // Brand events
  | { type: 'brand_created'; brandId: string }
  | { type: 'brand_edited'; brandId: string }
  | { type: 'brand_deleted'; brandId: string }
  | { type: 'social_handles_added'; brandId: string; platforms: string[] }
  
  // Scan events
  | { type: 'scan_started'; brandId: string; scanType: string }
  | { type: 'scan_completed'; brandId: string; threatsFound: number; duration: number }
  | { type: 'scan_failed'; brandId: string; error: string }
  | { type: 'scan_cancelled'; brandId: string }
  
  // Threat events
  | { type: 'threat_viewed'; threatId: string; severity: string }
  | { type: 'threat_resolved'; threatId: string }
  | { type: 'threat_false_positive'; threatId: string }
  
  // Report events
  | { type: 'report_generated'; brandId: string; threatCount: number }
  | { type: 'report_downloaded'; reportId: string }
  
  // Engagement events
  | { type: 'dashboard_viewed' }
  | { type: 'page_viewed'; page: string }
  | { type: 'feature_used'; feature: string }
  | { type: 'settings_changed'; setting: string }
  | { type: 'api_docs_viewed' }
  
  // Conversion events
  | { type: 'pricing_page_viewed' }
  | { type: 'checkout_started'; plan: string }
  | { type: 'subscription_created'; plan: string }
  | { type: 'subscription_upgraded'; fromPlan: string; toPlan: string }
  | { type: 'subscription_cancelled'; plan: string; reason?: string }
  
  // Session events
  | { type: 'session_started' }
  | { type: 'session_ended'; duration: number };

export async function trackEvent(event: ActivationEvent): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('user_activity').insert({
    user_id: user.id,
    activity_type: event.type,
    activity_data: event,
    page: typeof window !== 'undefined' ? window.location.pathname : null,
    session_id: getSessionId(), // from sessionStorage
  });

  // Process behavioral triggers
  await processTriggers(user.id, event);
}
```

### Behavioral Trigger Rules

Triggers fire in-app nudges or emails based on user behavior patterns:

```typescript
// src/lib/analytics/triggers.ts

interface BehavioralTrigger {
  id: string;
  name: string;
  description: string;
  conditions: TriggerCondition[];
  action: TriggerAction;
  cooldown: number; // minimum hours between firings
  maxFirings: number; // 0 = unlimited
}

const BEHAVIORAL_TRIGGERS: BehavioralTrigger[] = [
  
  // ── ACTIVATION TRIGGERS ──────────────────────────────
  
  {
    id: 'nudge_first_brand',
    name: 'No brand after 10 minutes',
    description: 'User signed up but hasn\'t added a brand after 10 minutes',
    conditions: [
      { type: 'event_absent', event: 'brand_created', since: 'signup', duration: '10m' },
      { type: 'user_active', within: '5m' }, // only nudge if they're still on the site
    ],
    action: {
      type: 'in_app_nudge',
      template: 'brand_prompt',
      message: 'Ready to protect your brand? Enter your domain and we\'ll do the rest.',
      cta: 'Add your brand',
      ctaLink: '/dashboard/brands/new',
      position: 'bottom-right',
    },
    cooldown: 30, // don't re-nudge for 30 min
    maxFirings: 2,
  },
  
  {
    id: 'nudge_view_threats',
    name: 'Scan complete but threats not viewed',
    description: 'Scan found threats but user hasn\'t clicked into any',
    conditions: [
      { type: 'event_present', event: 'scan_completed', data: { threatsFound: { gt: 0 } } },
      { type: 'event_absent', event: 'threat_viewed', since: 'last_scan_completed', duration: '5m' },
    ],
    action: {
      type: 'in_app_nudge',
      template: 'threat_review',
      message: '🚨 You have unreviewed threats. The critical ones need attention.',
      cta: 'Review threats',
      ctaLink: '/dashboard/threats?status=new&severity=critical',
      position: 'top-center',
      variant: 'warning',
    },
    cooldown: 60,
    maxFirings: 3,
  },
  
  {
    id: 'suggest_social_handles',
    name: 'Brand without social handles',
    description: 'User added a brand but no social handles — social scanning will be limited',
    conditions: [
      { type: 'event_present', event: 'brand_created' },
      { type: 'brand_missing', field: 'social_handles' },
      { type: 'time_since', event: 'brand_created', duration: '1d' },
    ],
    action: {
      type: 'in_app_nudge',
      template: 'social_handles',
      message: '💡 Add social media handles to detect fake accounts impersonating your brand on Instagram, Twitter, Facebook, and more.',
      cta: 'Add social accounts',
      ctaLink: '/dashboard/brands/{brandId}',
      position: 'bottom-right',
    },
    cooldown: 168, // once per week
    maxFirings: 3,
  },
  
  // ── ENGAGEMENT TRIGGERS ──────────────────────────────
  
  {
    id: 'weekly_return_nudge',
    name: 'No login in 7 days',
    description: 'User hasn\'t logged in for a week — send re-engagement email',
    conditions: [
      { type: 'event_absent', event: 'session_started', since: 'now', duration: '7d' },
      { type: 'has_brands', min: 1 }, // only re-engage users who set up
    ],
    action: {
      type: 'email',
      template: 're_engagement_weekly',
      subject: 'Your brand protection update — {threatCount} threats need review',
    },
    cooldown: 168, // max once per week
    maxFirings: 4, // stop after a month of inactivity
  },
  
  {
    id: 'celebrate_clean_scan',
    name: 'Scan with 0 new threats',
    description: 'Positive reinforcement when scan finds nothing new',
    conditions: [
      { type: 'event_present', event: 'scan_completed', data: { threatsFound: 0 } },
      { type: 'scan_count', min: 2 }, // not the first scan (that has its own flow)
    ],
    action: {
      type: 'in_app_toast',
      message: '✅ All clear! No new threats detected. Your brand is looking secure.',
      variant: 'success',
      duration: 5000,
    },
    cooldown: 24,
    maxFirings: 0, // unlimited
  },
  
  // ── CONVERSION TRIGGERS ──────────────────────────────
  
  {
    id: 'upgrade_nudge_brand_limit',
    name: 'Hit free brand limit',
    description: 'User tries to add a 2nd brand on free plan',
    conditions: [
      { type: 'subscription', plan: 'free' },
      { type: 'brand_count', eq: 1 },
      { type: 'event_present', event: 'page_viewed', data: { page: '/dashboard/brands/new' } },
    ],
    action: {
      type: 'in_app_modal',
      template: 'upgrade_brand_limit',
      title: 'Protect More Brands',
      message: 'Your free plan includes 1 brand. Upgrade to Starter ($49/mo) to protect up to 3 brands with priority scanning.',
      primaryCta: 'Upgrade to Starter',
      primaryCtaLink: '/api/stripe/checkout?plan=starter',
      secondaryCta: 'Maybe later',
    },
    cooldown: 72,
    maxFirings: 5,
  },
  
  {
    id: 'upgrade_nudge_scan_frequency',
    name: 'High engagement on free plan',
    description: 'User has been active for 14+ days on free plan with regular logins',
    conditions: [
      { type: 'subscription', plan: 'free' },
      { type: 'days_since_signup', min: 14 },
      { type: 'login_count_last_14d', min: 5 },
    ],
    action: {
      type: 'in_app_banner',
      template: 'upgrade_engaged_user',
      message: 'You\'re getting great use out of DoppelDown! Upgrade for daily auto-scans, priority alerts, and more brands.',
      cta: 'See plans',
      ctaLink: '/#pricing',
      dismissable: true,
      position: 'top',
    },
    cooldown: 168,
    maxFirings: 4,
  },
  
  {
    id: 'upgrade_after_critical_threat',
    name: 'Critical threat on free plan',
    description: 'Free user discovers a critical threat — highest conversion opportunity',
    conditions: [
      { type: 'subscription', plan: 'free' },
      { type: 'event_present', event: 'threat_viewed', data: { severity: 'critical' } },
    ],
    action: {
      type: 'in_app_banner',
      template: 'upgrade_critical_threat',
      message: '🚨 You have a critical threat. Paid plans include priority takedown reports and dedicated support for resolving active threats.',
      cta: 'Upgrade for priority support',
      ctaLink: '/api/stripe/checkout?plan=professional',
      variant: 'urgent',
      dismissable: true,
    },
    cooldown: 48,
    maxFirings: 3,
  },
];
```

### In-App Nudge Component

```typescript
// New component: src/components/onboarding/NudgeManager.tsx

// Renders nudges from behavioral triggers:
// - Toast: bottom-right, auto-dismiss after 5-8s
// - Banner: full-width top or bottom, dismissable
// - Modal: centered overlay, for high-importance upgrades
// - Tooltip: anchored to specific element

// All nudges:
// 1. Check cooldown (don't re-show too quickly)
// 2. Check max firings (don't annoy users)
// 3. Check dismissal state (respect user choice)
// 4. Track impressions + clicks in user_activity
```

---

## 9. Activation Metrics & Measurement

### Primary Metrics (Weekly Review)

| Metric | Definition | Target | Current (est.) |
|--------|-----------|--------|----------------|
| **Signup-to-Brand Rate** | % of signups that add ≥1 brand within 24h | 70% | ~40% |
| **Signup-to-Activation Rate** | % of signups that view ≥1 threat detail within 48h | 50% | ~20% |
| **Time-to-First-Value** | Median minutes from signup to first threat view | <5 min | ~15 min |
| **Day-1 Retention** | % of signups that return within 24h of first session | 40% | ~20% |
| **Day-7 Retention** | % of activated users that return within 7 days | 60% | ~50% |
| **Day-30 Retention** | % of activated users that return within 30 days | 40% | unknown |
| **Free-to-Paid Rate** | % of free users that upgrade within 60 days | 8% | unknown |
| **Onboarding Completion Rate** | % of users that complete all checklist items | 40% | unknown |

### Activation Funnel (Instrumented)

```
STAGE 1: LANDING
  └─ Metrics: Unique visitors, bounce rate, signup click rate
  └─ Events: page_viewed (landing), cta_clicked (signup)

STAGE 2: SIGNUP
  └─ Metrics: Signup completion rate, auth method distribution
  └─ Events: signup_complete

STAGE 3: BRAND SETUP
  └─ Metrics: Brand creation rate, time to create, fields filled
  └─ Events: onboarding_started, brand_created

STAGE 4: FIRST SCAN
  └─ Metrics: Scan start rate, scan completion rate, scan duration
  └─ Events: scan_started, scan_completed

STAGE 5: ACTIVATION (AHA)
  └─ Metrics: Threat view rate, time to first threat view
  └─ Events: threat_viewed (first time = activation!)

STAGE 6: ENGAGEMENT
  └─ Metrics: Return rate, session frequency, feature adoption
  └─ Events: session_started, feature_used, dashboard_viewed

STAGE 7: CONVERSION
  └─ Metrics: Pricing page views, checkout starts, subscription creates
  └─ Events: pricing_page_viewed, checkout_started, subscription_created
```

### Analytics Dashboard (Internal)

Build a simple admin view at `/dashboard/admin/activation` showing:

```
┌─────────────────────────────────────────────────────────┐
│ ACTIVATION FUNNEL (Last 30 days)                        │
│                                                         │
│ Signups          ████████████████████████████  247       │
│ Brand Created    ██████████████████            148 (60%) │
│ Scan Completed   ████████████████              126 (85%) │
│ Threat Viewed    ████████████                   99 (79%) │
│ Returned (7d)    ██████████                     74 (75%) │
│ Paid Conversion  ████                           29 (39%) │
│                                                         │
│ Median Time-to-Value: 4m 32s                            │
│ Activation Rate: 40.1% (target: 50%)                    │
│ Trend: ↑ 12% vs. last month                            │
│                                                         │
│ ── Drop-off Analysis ──                                 │
│ Biggest drop: Signup → Brand Created (40% loss)         │
│ Recommendation: Simplify brand creation form            │
└─────────────────────────────────────────────────────────┘
```

### Cohort Analysis

Track weekly signup cohorts through the activation funnel:

```sql
-- Example: Weekly activation cohort query
SELECT
  date_trunc('week', u.created_at) AS signup_week,
  COUNT(DISTINCT u.id) AS signups,
  COUNT(DISTINCT b.user_id) AS added_brand,
  COUNT(DISTINCT s.user_id) AS ran_scan,
  COUNT(DISTINCT CASE WHEN ua.activity_type = 'threat_viewed' THEN ua.user_id END) AS activated,
  COUNT(DISTINCT sub.user_id) AS converted
FROM auth.users u
LEFT JOIN brands b ON b.user_id = u.id
LEFT JOIN scans s ON s.brand_id = b.id AND s.status = 'completed'
LEFT JOIN user_activity ua ON ua.user_id = u.id AND ua.activity_type = 'threat_viewed'
LEFT JOIN subscriptions sub ON sub.user_id = u.id AND sub.status = 'active'
GROUP BY 1
ORDER BY 1 DESC;
```

---

## 10. Conversion Optimization: Free → Paid

### Free Tier Design Philosophy

The free tier's job is NOT to be a full product. It's a **conversion machine** that:
1. Delivers the aha moment (first scan results) — builds desire
2. Creates a habit (weekly digest, dashboard check-ins) — builds dependency
3. Introduces limits at natural expansion points — creates upgrade triggers

### Strategic Limit Placement

| Limit | Free | Starter ($49) | Pro ($99) | Enterprise ($249) |
|-------|------|-------------|-----------|-------------------|
| Brands monitored | 1 | 3 | 10 | Unlimited |
| Scans per month | 4 | 30 | Unlimited | Unlimited |
| Scan type | Basic (domain only) | Full (domain + social) | Full + NRD monitoring | Full + NRD + custom |
| Email alerts | Weekly digest only | Real-time critical | Real-time all | Real-time + SMS |
| Takedown reports | View only (no PDF) | 3/month PDF | Unlimited PDF | Unlimited + white-label |
| Historical data | 30 days | 90 days | 1 year | Unlimited |
| API access | ❌ | ❌ | ✅ | ✅ + webhooks |

**Key design decisions:**
- Free gets 1 brand, 4 scans/month — enough to feel value, not enough to never upgrade
- PDF reports gated to paid — the "aha" is seeing the report preview; downloading it requires upgrade
- Real-time alerts only on paid — free users get weekly digest (creates urgency to upgrade)
- API access at Pro tier — attracts technical users to higher tier

### Upgrade Touchpoints

Every upgrade nudge should appear at a **natural moment of value**, not randomly:

| Moment | Upgrade Message | Psychology |
|--------|----------------|-----------|
| User tries to add 2nd brand | "Protect all your brands with Starter" | Expansion need |
| Scan finds critical threat | "Get priority support for critical threats" | Urgency/fear |
| User views report but can't download PDF | "Download professional takedown reports with Starter" | Feature-locked value |
| 4th scan attempt in a month | "You've used all your scans. Upgrade for unlimited scanning" | Usage-based limitation |
| First weekly digest email | "Get real-time alerts instead of weekly summaries with Starter" | Speed/urgency |
| 30-day anniversary on free | "Your first month: [stats]. Keep this protection with Starter" | Value demonstration |
| Another user in same company domain signs up | "Your team is using DoppelDown! Get Enterprise for team features" | Social proof + expansion |

### Pricing Page Optimization

The pricing page is a critical conversion surface. Optimize:

```
1. Default to ANNUAL toggle (show monthly with annual savings)
2. Highlight Professional as "Most Popular" (anchoring effect)
3. Show value metrics per plan:
   - "1 brand protected" vs "10 brands protected"
   - Not just feature lists — outcome-oriented language
4. Add ROI calculator:
   "Average phishing attack costs $17,700.
    DoppelDown Professional at $99/mo = $1,188/year.
    ROI: 14.9x if we prevent just one incident."
5. Testimonials per tier (when available)
6. FAQ section addressing common objections:
   - "Can I cancel anytime?" → Yes, no lock-in
   - "What happens to my data if I downgrade?" → Retained for 90 days
   - "Do you offer a trial of paid features?" → 14-day free trial of Starter
```

---

## 11. Churn Prevention & Re-engagement

### Churn Risk Signals

| Signal | Risk Level | Detection | Response |
|--------|-----------|-----------|----------|
| No login for 7 days (activated user) | Medium | Cron job checks `user_activity` | Re-engagement email with threat summary |
| No login for 14 days | High | Cron job | Escalated email: "X threats need your attention" |
| No login for 30 days | Critical | Cron job | Final win-back email + in-app banner on return |
| Reduced scan frequency | Medium | Compare last 30d vs prior 30d | "You used to scan weekly — we miss you" email |
| User views cancellation page | Critical | Page view event | Retention modal with: pause option, downgrade offer, feedback survey |
| Failed payment | High | Stripe webhook | Dunning email sequence (3 emails over 7 days) |

### Win-Back Sequences

```
WIN-BACK EMAIL 1: "Your brand protection is paused"
Trigger: 14 days of inactivity (activated user)
Subject: "[Brand name] has been unmonitored for 2 weeks"
Content:
  - Show what COULD be happening (general threat stats)
  - "In the last 2 weeks, the average brand in [industry] saw X new threats"
  - CTA: "Check your dashboard"

WIN-BACK EMAIL 2: "We found something while you were away"
Trigger: 21 days of inactivity + user has unresolved threats
Subject: "🚨 [X] unresolved threats on [brand name]"
Content:
  - List their actual unresolved threats
  - Urgency framing around critical/high threats
  - CTA: "Review and resolve"

WIN-BACK EMAIL 3: "We'd hate to see you go"
Trigger: 30 days of inactivity
Subject: "Should we keep monitoring [brand name]?"
Content:
  - Acknowledge they've been away
  - One-click options: "Keep monitoring" / "Pause my account" / "Tell us what happened"
  - Feedback link → short survey
  - If paid: "Reply to this email for a free month while you decide"
```

### Cancellation Flow

When a paid user clicks "Cancel subscription":

```
STEP 1: "Before you go..." (retention modal)
  - Ask why (multiple choice):
    □ Too expensive
    □ Not finding enough threats
    □ Switched to another tool
    □ Business closed/changed
    □ Missing features I need
    □ Other
  
STEP 2: Dynamic response based on reason:
  
  "Too expensive" →
    "We get it. Would a 25% discount for 3 months help?
     That's [plan] at $[discounted]/mo."
    [Accept offer] [No thanks, cancel]
    
  "Not finding enough threats" →
    "That might actually be good news! But let's make sure:
     - Have you added social media handles? (Social scanning catches more)
     - Are your keywords comprehensive?
     [Optimize my scans] [Cancel anyway]"
    
  "Missing features" →
    "What features do you need? Your feedback directly shapes our roadmap.
     [Tell us what you need] (opens feedback form)
     [Cancel anyway]"

STEP 3: If still cancelling:
  "Your subscription will remain active until [end date].
   Your data will be retained for 90 days.
   You can reactivate anytime."
  
  Offer: "Want to downgrade to free instead of cancelling completely?
   You'll keep 1 brand monitored." [Downgrade to Free] [Cancel completely]
```

---

## 12. Technical Implementation Plan

### Phase 1: Foundation (Week 1-2) — Critical Path

| Task | Description | Effort | Files |
|------|-------------|--------|-------|
| **Event tracking system** | Implement `trackEvent()` and wire into existing pages | 3 days | `src/lib/analytics/events.ts`, all page components |
| **Simplified brand creation** | Domain-only input + auto-detection API | 2 days | `POST /api/brands/detect`, onboarding flow |
| **Auto-scan on brand creation** | Remove manual "Start Scan" step, auto-trigger | 0.5 day | `src/app/dashboard/page.tsx` (OnboardingFlow) |
| **Persist onboarding state** | Replace `useState` with `user_onboarding` table writes | 1 day | `src/app/dashboard/page.tsx` |
| **Streaming scan results** | Show threats as they're found during scan | 1 day | OnboardingFlow scan step |

### Phase 2: Email System (Week 2-3)

| Task | Description | Effort | Files |
|------|-------------|--------|-------|
| **Email drip engine** | Behavioral email trigger system | 3 days | `src/lib/email-drip.ts`, cron job |
| **Onboarding email sequence** | 5 emails (welcome, nudge, scan results, weekly, feature) | 2 days | Email templates |
| **Unsubscribe handling** | Per-category opt-out, stored in `user_preferences` | 1 day | `/api/email/unsubscribe` |

### Phase 3: In-App Guidance (Week 3-4)

| Task | Description | Effort | Files |
|------|-------------|--------|-------|
| **Tour renderer component** | Spotlight overlay + tooltip positioning | 3 days | `src/components/onboarding/TourOverlay.tsx` |
| **Dashboard tour** | Wire 5-step dashboard tour with `data-tour-step` attrs | 1 day | Dashboard components |
| **Feature tooltips** | Contextual hints on first feature encounters | 2 days | `src/components/onboarding/FeatureTooltip.tsx` |
| **Checklist widget** | Persistent sidebar checklist post-onboarding | 1 day | `src/components/onboarding/ChecklistWidget.tsx` |
| **Achievement toasts** | In-app notification when achievement unlocks | 1 day | `src/components/onboarding/AchievementToast.tsx` |

### Phase 4: Behavioral Triggers (Week 4-5)

| Task | Description | Effort | Files |
|------|-------------|--------|-------|
| **Trigger engine** | Process events against trigger rules | 2 days | `src/lib/analytics/triggers.ts` |
| **Nudge components** | Toast, banner, modal components for nudges | 2 days | `src/components/onboarding/NudgeManager.tsx` |
| **Upgrade modals** | Limit-hit and feature-locked upgrade prompts | 1 day | `src/components/billing/UpgradeModal.tsx` |
| **Wire achievement triggers** | Connect scan/threat/report events to achievements | 1 day | Achievement trigger hooks |

### Phase 5: Measurement & Optimization (Week 5-6)

| Task | Description | Effort | Files |
|------|-------------|--------|-------|
| **Admin activation dashboard** | Internal funnel metrics view | 2 days | `/dashboard/admin/activation` |
| **Cohort tracking queries** | SQL views for weekly cohort analysis | 1 day | Supabase SQL |
| **A/B test framework** | Feature flag system for testing variants | 2 days | `src/lib/experiments.ts` |

### Database Migrations Needed

```sql
-- Migration: 20260206_activation_events.sql

-- Activation level tracking (denormalized for fast queries)
CREATE TABLE IF NOT EXISTS public.user_activation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 0, -- 0=registered, 1=setup, 2=scanned, 3=activated, 4=engaged, 5=power, 6=converted
    level_name TEXT DEFAULT 'registered',
    activated_at TIMESTAMP WITH TIME ZONE, -- when they first hit level 3
    first_brand_at TIMESTAMP WITH TIME ZONE,
    first_scan_at TIMESTAMP WITH TIME ZONE,
    first_threat_viewed_at TIMESTAMP WITH TIME ZONE,
    first_return_at TIMESTAMP WITH TIME ZONE,
    first_report_at TIMESTAMP WITH TIME ZONE,
    converted_at TIMESTAMP WITH TIME ZONE,
    time_to_value_seconds INTEGER, -- signup to first threat view
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Email drip state tracking
CREATE TABLE IF NOT EXISTS public.email_drip_state (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email_id TEXT NOT NULL,  -- e.g., 'onboarding_welcome', 'onboarding_nudge_brand'
    track TEXT NOT NULL,     -- 'onboarding', 'engagement', 'conversion'
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'skipped', 'opened', 'clicked')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    skip_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, email_id)
);

-- Behavioral trigger state (prevent re-firing)
CREATE TABLE IF NOT EXISTS public.trigger_state (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    trigger_id TEXT NOT NULL,
    fire_count INTEGER DEFAULT 0,
    last_fired_at TIMESTAMP WITH TIME ZONE,
    dismissed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, trigger_id)
);

-- Indexes
CREATE INDEX idx_user_activation_level ON public.user_activation(level);
CREATE INDEX idx_user_activation_activated_at ON public.user_activation(activated_at);
CREATE INDEX idx_email_drip_state_user ON public.email_drip_state(user_id, track);
CREATE INDEX idx_email_drip_state_scheduled ON public.email_drip_state(scheduled_at) WHERE status = 'pending';
CREATE INDEX idx_trigger_state_user ON public.trigger_state(user_id, trigger_id);

-- RLS
ALTER TABLE public.user_activation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_drip_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trigger_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activation" ON public.user_activation FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role manages activation" ON public.user_activation FOR ALL USING (true);

CREATE POLICY "Users can view own drip state" ON public.email_drip_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role manages drip state" ON public.email_drip_state FOR ALL USING (true);

CREATE POLICY "Users can view own trigger state" ON public.trigger_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own trigger state" ON public.trigger_state FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role manages trigger state" ON public.trigger_state FOR ALL USING (true);

-- Auto-create activation record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_activation()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_activation (user_id, level, level_name)
    VALUES (NEW.id, 0, 'registered')
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Schedule onboarding welcome email
    INSERT INTO public.email_drip_state (user_id, email_id, track, scheduled_at)
    VALUES (NEW.id, 'onboarding_welcome', 'onboarding', NOW())
    ON CONFLICT (user_id, email_id) DO NOTHING;
    
    -- Schedule nudge email (24h later, will be skipped if brand added)
    INSERT INTO public.email_drip_state (user_id, email_id, track, scheduled_at)
    VALUES (NEW.id, 'onboarding_nudge_brand', 'onboarding', NOW() + INTERVAL '24 hours')
    ON CONFLICT (user_id, email_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_activation ON auth.users;
CREATE TRIGGER on_auth_user_created_activation
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_activation();

GRANT ALL ON public.user_activation TO authenticated;
GRANT ALL ON public.email_drip_state TO authenticated;
GRANT ALL ON public.trigger_state TO authenticated;
```

---

## 13. A/B Testing Roadmap

### Testing Framework

Simple feature flag system using `user_id` hash for deterministic assignment:

```typescript
// src/lib/experiments.ts

interface Experiment {
  id: string;
  name: string;
  variants: string[];
  allocation: number[]; // percentage per variant (must sum to 100)
  active: boolean;
  startDate: string;
  endDate?: string;
}

function getVariant(userId: string, experimentId: string): string {
  // Deterministic hash-based assignment
  const hash = hashCode(`${userId}:${experimentId}`);
  const bucket = Math.abs(hash) % 100;
  // Map bucket to variant based on allocation percentages
  ...
}
```

### Planned Experiments (Priority Order)

| # | Experiment | Hypothesis | Variants | Primary Metric | Duration |
|---|-----------|-----------|----------|----------------|----------|
| 1 | **Simplified vs. Full Brand Form** | Single domain field will increase brand creation rate by 30%+ | A: Current form (name+domain+keywords+social) B: Domain-only with auto-detect | Brand creation rate within 24h | 4 weeks |
| 2 | **Auto-Scan vs. Manual Scan** | Auto-scanning on brand creation will increase activation rate by 20%+ | A: Manual "Start Scan" button B: Auto-scan immediately | Activation rate (threat viewed) | 4 weeks |
| 3 | **Scan Progress Content** | Educational content during scan wait reduces abandonment | A: Spinner only B: Streaming results + educational tips C: Streaming results + profile collection form | Scan completion rate, profile completion | 4 weeks |
| 4 | **Onboarding Email Timing** | Earlier nudge email converts better | A: 24h nudge email B: 4h nudge email C: 1h nudge email | Brand creation rate from email | 6 weeks |
| 5 | **Checklist Persistence** | Persistent checklist increases feature adoption | A: No post-onboarding checklist B: Sidebar checklist widget | Feature adoption rate (reports, notifications) | 6 weeks |
| 6 | **Upgrade Nudge Timing** | Post-critical-threat upgrade prompt converts better than generic | A: Time-based upgrade prompt (14 days) B: Behavior-based (after viewing critical threat) | Free-to-paid conversion rate | 8 weeks |
| 7 | **Tour vs. No Tour** | Dashboard tour increases day-7 retention | A: No tour B: Guided dashboard tour | Day-7 return rate | 6 weeks |

### Statistical Rigor

- **Minimum sample size:** 100 users per variant (calculable with MDE=20%, α=0.05, β=0.2)
- **At current signup rates:** This means experiments run 4-8 weeks minimum
- **Primary metric only:** Each experiment has ONE primary metric. Don't p-hack secondary metrics.
- **Sequential testing:** Use sequential analysis to stop experiments early if effect is large

---

## 14. Quarterly Execution Plan

### Q1 2026 (Months 1-3): Foundation

**Theme: "Build the pipes"**

| Week | Focus | Deliverables | Success Criteria |
|------|-------|-------------|------------------|
| 1-2 | Event tracking + simplified onboarding | `trackEvent()` instrumented across all pages; domain-only brand creation; auto-scan | Events flowing to `user_activity` table |
| 3 | Onboarding email sequence | Welcome, nudge, scan results, 7-day, 14-day emails | Emails sending correctly, skip conditions working |
| 4 | Tour system + checklist | Dashboard tour rendered; sidebar checklist visible | Tour completion tracking in `tour_progress` |
| 5-6 | Behavioral triggers + nudges | 5 core triggers firing; toast/banner components | Triggers firing correctly per rules |
| 7-8 | Admin metrics dashboard | Activation funnel visible; cohort analysis running | Can answer "what's our activation rate?" |
| 9-10 | First A/B test (simplified form) | Experiment running, data collecting | Statistical significance path clear |
| 11-12 | Iterate based on data | Ship winning variants, fix top drop-off point | Activation rate improved ≥20% from baseline |

**Q1 Targets:**
- Activation rate: 20% → 30%
- Time-to-first-value: 15min → 8min
- Onboarding email open rate: >40%
- Day-7 retention (activated users): 50% → 55%

### Q2 2026 (Months 4-6): Optimization

**Theme: "Make it personal"**

| Week | Focus | Deliverables |
|------|-------|-------------|
| 1-3 | Persona-based onboarding paths | Different post-onboarding experiences per role |
| 4-6 | Conversion optimization | Upgrade modals, limit nudges, pricing page A/B test |
| 7-9 | Churn prevention | Cancellation flow, win-back emails, health scoring |
| 10-12 | Referral/viral loop | "Invite a colleague" feature, referral achievement |

**Q2 Targets:**
- Activation rate: 30% → 45%
- Time-to-first-value: 8min → 5min
- Free-to-paid conversion: baseline → 6%
- Monthly churn rate: establish baseline, target <5%

### Q3 2026 (Months 7-9): Scale

**Theme: "Compound the gains"**

- Advanced personalization (ML-based feature recommendations)
- Multi-brand onboarding for teams
- Self-serve trial of paid features (14-day auto-trial)
- Product-qualified lead scoring for outbound sales assist
- Localization of onboarding flows (if international expansion begins)

**Q3 Targets:**
- Activation rate: 45% → 55%
- Free-to-paid conversion: 6% → 10%
- NPS among activated users: >40

---

## Appendix A: Quick-Win Checklist (Ship This Week)

These require minimal code changes and can be shipped immediately:

- [ ] **Enable `auto_scan_on_add` as default for all new users** — already supported in preferences schema, just change default
- [ ] **Add "Skip" button to optional onboarding fields** — reduces friction instantly
- [ ] **Improve empty state copy** on threats and brands pages — swap generic messages for educational + action-oriented ones
- [ ] **Add "What happens next" section** to scan completion screen — prevent post-scan confusion
- [ ] **Wire `unlockAchievement('first_scan')` call** into scan completion handler — achievements exist, just not triggered
- [ ] **Wire `unlockAchievement('first_brand')` call** into brand creation handler — same
- [ ] **Add referral_source capture** from UTM params on signup — field exists in schema, just needs frontend capture

## Appendix B: Competitor Onboarding Benchmarks

| Competitor | Signup to First Value | Onboarding Style | Pricing Transparency |
|-----------|----------------------|-------------------|---------------------|
| BrandShield | Days (requires sales call) | White-glove, manual | Hidden |
| Red Points | Days (requires demo) | Enterprise onboarding team | Hidden |
| PhishLabs | Weeks (enterprise procurement) | Managed service | Hidden |
| Bolster.ai | Hours (self-serve demo) | Product-led with demo mode | Semi-transparent |
| **DoppelDown (target)** | **< 5 minutes** | **Fully self-serve, personalized** | **100% transparent** |

DoppelDown's onboarding speed is its #1 competitive advantage. Protect it ruthlessly.

## Appendix C: Key Decisions & Trade-offs

| Decision | Chosen | Alternative | Reasoning |
|----------|--------|-------------|-----------|
| Collect persona info DURING scan wait, not before | During scan | Upfront (before scan) | Reduces pre-scan friction. Users are idle during scan anyway. |
| Auto-scan on brand creation | Default on | Optional toggle | Removes a decision point. Users can always re-scan. |
| Domain-only brand creation | Single field | Full form with keywords/social | Auto-detect the rest. User can refine later. Conversion > completeness. |
| Free tier gets 4 scans/month (not unlimited) | 4/month | Unlimited | Enough to demonstrate value, creates natural upgrade trigger. |
| Achievement emails (not just in-app) | Both | In-app only | Email brings users back. Achievement unlocks are re-engagement hooks. |
| Time-based + behavioral email triggers | Hybrid | Time-only or behavior-only | Pure time-based is spammy. Pure behavioral misses dormant users. |
| Sequential A/B testing | Yes | Fixed-horizon | Small user volumes make fixed-horizon tests impractical. Sequential lets us stop early when effects are clear. |

---

*This strategy is a living document. Update quarterly based on data from the activation dashboard. The numbers will tell you what's working — ship more of that, kill the rest.*
