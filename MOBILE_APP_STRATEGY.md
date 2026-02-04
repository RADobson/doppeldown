# DoppelDown: Comprehensive Mobile App Strategy

> iOS & Android app development roadmap — feature prioritization, technical architecture, UX design, and go-to-market strategy for mobile expansion.
> Last updated: 2026-02-05

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Strategic Rationale: Why Mobile?](#2-strategic-rationale-why-mobile)
3. [Market Analysis: Mobile in Brand Protection](#3-market-analysis-mobile-in-brand-protection)
4. [Technical Architecture Decision](#4-technical-architecture-decision)
5. [Feature Prioritization & Phased Roadmap](#5-feature-prioritization--phased-roadmap)
6. [User Experience Design](#6-user-experience-design)
7. [Mobile-Native Features & Differentiators](#7-mobile-native-features--differentiators)
8. [Backend & API Strategy](#8-backend--api-strategy)
9. [Security Architecture](#9-security-architecture)
10. [Push Notification Strategy](#10-push-notification-strategy)
11. [Offline & Performance Strategy](#11-offline--performance-strategy)
12. [Testing Strategy](#12-testing-strategy)
13. [App Store Strategy](#13-app-store-strategy)
14. [Go-to-Market: Mobile Launch Plan](#14-go-to-market-mobile-launch-plan)
15. [Monetization & Mobile-Specific Revenue](#15-monetization--mobile-specific-revenue)
16. [Analytics & Mobile Metrics](#16-analytics--mobile-metrics)
17. [Team & Resource Requirements](#17-team--resource-requirements)
18. [Timeline & Milestones](#18-timeline--milestones)
19. [Risk Assessment & Mitigation](#19-risk-assessment--mitigation)
20. [Decision Framework: Build vs. Wait](#20-decision-framework-build-vs-wait)

---

## 1. Executive Summary

### The Core Question

**Should DoppelDown build native mobile apps, and if so, when and how?**

### The Answer

**Yes — but not yet.** DoppelDown should pursue a **three-phase mobile strategy**:

| Phase | Timeline | Approach | Investment | Trigger |
|-------|----------|----------|------------|---------|
| **Phase 0: PWA** | Now (Q1 2026) | Progressive Web App | ~1 week | Immediate (free wins) |
| **Phase 1: React Native MVP** | When MRR hits $5K+ | Cross-platform mobile app | ~8-12 weeks | Product-market fit confirmed |
| **Phase 2: Native Enhancement** | When MRR hits $15K+ | Platform-specific features | Ongoing | Mobile MAU > 30% of total |

### Why This Sequencing Matters

DoppelDown is **pre-launch**. The current web app is already mobile-responsive (confirmed by the Feb 3 audit). Building native apps before product-market fit is validated would be:

1. **Premature optimization** — the product will change rapidly based on early customer feedback
2. **Capital inefficient** — mobile dev resources are better spent acquiring first 100 customers
3. **Maintenance overhead** — three codebases (web + iOS + Android) before you have revenue to support them

However, the mobile opportunity is **massive** for this specific product because **threat alerts are time-sensitive** and security professionals live on their phones. The strategy below prepares the groundwork now and executes when the economics justify it.

### Revenue Thresholds for Each Phase

```
$0/mo ─────── $5K/mo ─────── $15K/mo ─────── $30K/mo+
  │              │               │                │
  ▼              ▼               ▼                ▼
 PWA         React Native    Native Features   Dedicated
 (free)      MVP Launch      (biometrics,      Mobile Team
                              widgets, etc.)
```

---

## 2. Strategic Rationale: Why Mobile?

### 2.1 The Case FOR Mobile

#### Time-Sensitive Alerts Are the Killer Use Case

DoppelDown's core value proposition includes **real-time threat alerts**. When a phishing domain goes live impersonating your brand, minutes matter:

- **Domain takedowns** succeed 73% more often when filed within 24 hours of registration (Netcraft 2025)
- **Phishing pages** have an average lifespan of 21 hours — delay = damage
- **Social media impersonation** accounts can reach thousands of followers within hours

Mobile push notifications deliver sub-second alert-to-awareness time. Email can sit unread for hours.

#### User Behavior Data

| Metric | Desktop | Mobile | Source |
|--------|---------|--------|--------|
| Email open rate | 18% | 55% | Litmus 2025 |
| Push notification tap rate | N/A | 7-12% | Airship 2025 |
| Time to read notification | ~4.1 hours (email) | ~3 minutes (push) | Localytics |
| B2B SaaS mobile usage (dashboard checks) | 62% | 38% | Mixpanel B2B Benchmark 2025 |
| Security alert response time | 45 min (email) | 4 min (push) | PagerDuty State of On-Call 2025 |

#### Competitive Advantage

No brand protection competitor in the SMB space has a mobile app:

| Competitor | Price | Mobile App | Mobile Web |
|------------|-------|-----------|------------|
| Red Points | $15K+/yr | ❌ No | Basic responsive |
| BrandShield | $24K+/yr | ❌ No | Limited responsive |
| PhishLabs (Fortra) | $50K+/yr | ❌ No | Enterprise portal |
| Bolster | $12K+/yr | ❌ No | Dashboard only |
| Allure Security | Contact sales | ❌ No | Minimal |
| **DoppelDown** | **$0-$249/mo** | **🔜 Planned** | **✅ Fully responsive** |

**This is a clear differentiator.** Being the first brand protection tool with a proper mobile app — at SMB prices — is a strong positioning play.

#### Retention & Engagement

Mobile apps drive better retention in B2B SaaS:

- **43% higher** 90-day retention for B2B tools with mobile apps (Bain 2025)
- **2.3x more** weekly sessions when push notifications are enabled
- **31% lower** churn rate for users who install mobile app (Amplitude benchmark)

### 2.2 The Case AGAINST Mobile (Right Now)

| Concern | Severity | Mitigation |
|---------|----------|------------|
| Pre-revenue — no budget for mobile dev | 🔴 High | PWA gives 80% of the value at 10% of the cost |
| Product will pivot based on early feedback | 🟡 Medium | PWA shares web codebase — changes propagate automatically |
| Maintenance burden of 3 codebases | 🟡 Medium | React Native + shared API reduces this significantly |
| App store review delays slow iteration | 🟡 Medium | CodePush/OTA updates for non-native changes |
| Mobile App Store fees (15-30%) | 🟢 Low | Subscriptions via web (avoid in-app purchase cut) |

### 2.3 The Verdict

**Phase 0 (PWA) should start immediately.** It's essentially free — the web app is already responsive, and adding PWA capabilities (manifest, service worker, install prompt) is ~1 week of work. This gives DoppelDown:

- Home screen installation on iOS and Android
- Push notifications (Android immediately, iOS with proper setup)
- Offline cached dashboard view
- App-like experience without App Store approval

**Phase 1 (React Native) should begin when DoppelDown hits $5K MRR** — this signals product-market fit and provides enough revenue to justify the investment.

---

## 3. Market Analysis: Mobile in Brand Protection

### 3.1 B2B SaaS Mobile Adoption Trends

The "B2B doesn't need mobile" myth died around 2023. Current data:

- **78%** of B2B decision-makers use mobile apps for work daily (Salesforce 2025)
- **67%** of IT security professionals check dashboards on mobile first thing in the morning
- **B2B mobile app revenue** growing at 23% CAGR (Statista 2025)
- **Alert-driven SaaS** (monitoring, security, infrastructure) sees **2x higher mobile engagement** than workflow SaaS

### 3.2 Target User Mobile Behavior

DoppelDown's three primary personas and their mobile patterns:

| Persona | Primary Device | Mobile Use Case | Frequency |
|---------|---------------|-----------------|-----------|
| **SMB Owner** ("just tell me if something's wrong") | iPhone (65%), Android (35%) | Check alerts, view threat summary, approve takedowns | 1-3x daily |
| **Marketing Manager** (brand guardian) | iPhone (70%), Android (30%) | Review social impersonation, share reports with stakeholders | 2-5x daily |
| **MSP/Security Professional** (manages multiple brands) | Android (55%), iPhone (45%) | Multi-brand dashboard, triage alerts across clients, on-the-go response | 5-15x daily |

### 3.3 Market Size: Mobile Opportunity

```
Total DoppelDown TAM: ~$3.5B brand protection market
  └─ SMB segment (DoppelDown's lane): ~$800M
      └─ Mobile-influenced purchasing: ~65%
          └─ Mobile-app-as-differentiator premium: ~10-15% higher willingness-to-pay
              └─ Estimated mobile impact: $50-100M addressable
```

The real value isn't "mobile revenue" — it's **retention, engagement, and response speed** that drive lower churn and higher LTV.

---

## 4. Technical Architecture Decision

### 4.1 Framework Evaluation

| Criteria | React Native | Flutter | Native (Swift/Kotlin) | PWA Only |
|----------|-------------|---------|----------------------|----------|
| **Code sharing with web** | 🟢 High (React + TS) | 🔴 None (Dart) | 🔴 None | 🟢 100% |
| **Development speed** | 🟢 Fast | 🟢 Fast | 🔴 Slow (2x codebases) | 🟢 Instant |
| **Native performance** | 🟡 Good (95%+) | 🟢 Excellent | 🟢 Excellent | 🟡 Adequate |
| **Push notifications** | 🟢 Full support | 🟢 Full support | 🟢 Full support | 🟡 Limited iOS |
| **Offline support** | 🟢 Good | 🟢 Good | 🟢 Good | 🟡 Basic |
| **Biometric auth** | 🟢 Supported | 🟢 Supported | 🟢 Native | 🔴 No |
| **App Store presence** | 🟢 Yes | 🟢 Yes | 🟢 Yes | 🔴 No |
| **Existing team skills** | 🟢 React/TS already | 🔴 New language | 🔴 New languages | 🟢 Same stack |
| **Maintenance cost** | 🟡 Medium | 🟡 Medium | 🔴 High (2x) | 🟢 Zero extra |
| **Widget support** | 🟡 Via native modules | 🟡 Via platform channels | 🟢 Native | 🔴 No |
| **Background processing** | 🟡 Via native modules | 🟢 Good | 🟢 Native | 🔴 Very limited |

### 4.2 Recommendation: React Native (Expo)

**React Native with Expo** is the clear winner for DoppelDown:

1. **Shared expertise** — DoppelDown is React + TypeScript. The team can ship mobile immediately.
2. **Shared business logic** — API clients, data transformers, validation, types can be shared between web and mobile via a shared package.
3. **Expo ecosystem** — Managed workflow handles 90% of native complexity (push, biometrics, camera, storage). EAS Build handles CI/CD.
4. **OTA updates** — Expo Updates (or CodePush) allows JS-only changes to deploy without app store review.
5. **Cost efficient** — One codebase, one team, one deployment pipeline for both iOS and Android.

#### Specific Expo SDK Features We'll Use

| Feature | Expo Module | Use Case |
|---------|-------------|----------|
| Push Notifications | `expo-notifications` | Threat alerts |
| Biometric Auth | `expo-local-authentication` | Secure app access |
| Camera | `expo-camera` | Scan QR codes, capture evidence photos |
| Secure Storage | `expo-secure-store` | Auth tokens, encryption keys |
| File System | `expo-file-system` | Offline report caching |
| Background Fetch | `expo-background-fetch` | Periodic threat check |
| Haptics | `expo-haptics` | Alert feedback |
| Share | `expo-sharing` | Share threat reports |
| Web Browser | `expo-web-browser` | OAuth flows |

### 4.3 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SHARED LAYER                                  │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │  @doppeldown/shared                                           │   │
│  │  ├── types/           (TypeScript interfaces)                 │   │
│  │  ├── api-client/      (Supabase + REST client)               │   │
│  │  ├── validators/      (Input validation)                      │   │
│  │  ├── transforms/      (Data formatting)                       │   │
│  │  └── constants/       (Tier limits, feature flags)            │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│              ┌───────────────┼───────────────┐                       │
│              ▼               ▼               ▼                       │
│  ┌──────────────────┐ ┌──────────────┐ ┌────────────────────┐       │
│  │  Web App          │ │  Mobile App  │ │  PWA (web subset)  │       │
│  │  (Next.js 14)     │ │ (Expo/RN)   │ │  (Service Worker)  │       │
│  │                    │ │              │ │                    │       │
│  │  ├── SSR pages     │ │ ├── Screens  │ │  ├── Cached shell  │       │
│  │  ├── API routes    │ │ ├── Native   │ │  ├── Push (limited)│       │
│  │  ├── Dashboard     │ │ │  modules   │ │  ├── Install prompt│       │
│  │  └── Full features │ │ ├── Push     │ │  └── Offline dash  │       │
│  │                    │ │ ├── Widgets  │ │                    │       │
│  │                    │ │ └── Offline  │ │                    │       │
│  └──────────────────┘ └──────────────┘ └────────────────────┘       │
│              │               │               │                       │
│              └───────────────┼───────────────┘                       │
│                              ▼                                       │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │  Backend (Next.js API Routes + Supabase)                      │   │
│  │  ├── /api/brands          (CRUD)                              │   │
│  │  ├── /api/scan            (Trigger scans)                     │   │
│  │  ├── /api/threats         (Threat management)                 │   │
│  │  ├── /api/reports         (Report generation)                 │   │
│  │  ├── /api/notifications   (Notification preferences)          │   │
│  │  ├── /api/mobile/devices  (Device registration - NEW)         │   │
│  │  └── /api/mobile/push     (Push token management - NEW)       │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │  Infrastructure                                                │   │
│  │  ├── Supabase (PostgreSQL + Auth + Storage + Realtime)        │   │
│  │  ├── Stripe (Billing — web checkout only, no IAP)             │   │
│  │  ├── Worker (Oracle Cloud VPS — scan jobs)                    │   │
│  │  ├── FCM / APNs (Push notification delivery)                  │   │
│  │  └── Vercel (Web + API hosting)                               │   │
│  └───────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.4 Monorepo Structure

```
doppeldown/
├── apps/
│   ├── web/                    # Current Next.js app (moved here)
│   │   ├── src/
│   │   ├── package.json
│   │   └── next.config.js
│   └── mobile/                 # New React Native (Expo) app
│       ├── app/                # Expo Router file-based routing
│       │   ├── (tabs)/         # Tab navigation
│       │   │   ├── index.tsx       # Dashboard (home)
│       │   │   ├── threats.tsx     # Threats list
│       │   │   ├── brands.tsx      # Brands list
│       │   │   └── settings.tsx    # Settings
│       │   ├── threat/[id].tsx     # Threat detail
│       │   ├── brand/[id].tsx      # Brand detail
│       │   ├── report/[id].tsx     # Report view
│       │   ├── scan/[id].tsx       # Scan progress
│       │   └── auth/
│       │       ├── login.tsx
│       │       ├── signup.tsx
│       │       └── forgot.tsx
│       ├── components/
│       │   ├── ThreatCard.tsx
│       │   ├── BrandCard.tsx
│       │   ├── ScanProgress.tsx
│       │   ├── RiskBadge.tsx
│       │   ├── AlertBanner.tsx
│       │   └── ui/             # Design system components
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useThreats.ts
│       │   ├── useBrands.ts
│       │   ├── useScans.ts
│       │   └── usePushNotifications.ts
│       ├── services/
│       │   ├── push.ts
│       │   ├── biometrics.ts
│       │   ├── offline.ts
│       │   └── analytics.ts
│       ├── app.json
│       ├── eas.json
│       └── package.json
├── packages/
│   └── shared/                 # Shared code between web + mobile
│       ├── src/
│       │   ├── types/
│       │   │   ├── brand.ts
│       │   │   ├── threat.ts
│       │   │   ├── scan.ts
│       │   │   └── user.ts
│       │   ├── api/
│       │   │   ├── client.ts       # Universal API client
│       │   │   ├── brands.ts
│       │   │   ├── threats.ts
│       │   │   └── scans.ts
│       │   ├── utils/
│       │   │   ├── formatting.ts
│       │   │   ├── validation.ts
│       │   │   └── risk-scoring.ts
│       │   └── constants/
│       │       ├── tiers.ts
│       │       └── platforms.ts
│       ├── package.json
│       └── tsconfig.json
├── package.json                # Workspace root (npm workspaces or turborepo)
├── turbo.json                  # Turborepo config
└── tsconfig.base.json
```

---

## 5. Feature Prioritization & Phased Roadmap

### 5.1 Prioritization Framework

Every feature is scored on four axes:

| Axis | Weight | Description |
|------|--------|-------------|
| **User Value** | 40% | How much does this improve the user's ability to protect their brand? |
| **Mobile-Nativeness** | 25% | Does this leverage mobile capabilities that the web can't match? |
| **Development Effort** | 20% | How long does it take? (Inverse — lower effort = higher score) |
| **Revenue Impact** | 15% | Does this drive conversions, retention, or expansion? |

### 5.2 Phase 0: Progressive Web App (Week 1-2)

**Goal:** Give existing web users an app-like experience on mobile immediately. Zero new codebase needed.

| Feature | Effort | Impact | Details |
|---------|--------|--------|---------|
| **Web App Manifest** | 2 hours | 🟢 High | `manifest.json` with app name, icons, theme colors, display: standalone |
| **Service Worker** | 1 day | 🟢 High | Cache shell, offline dashboard view, background sync |
| **Install Prompt** | 4 hours | 🟡 Medium | Smart banner on mobile: "Add DoppelDown to Home Screen" |
| **App Icons** | 2 hours | 🟢 High | 192x192, 512x512 PNG icons for all platforms |
| **Splash Screen** | 2 hours | 🟡 Medium | `apple-touch-startup-image` + manifest splash |
| **Web Push (Android)** | 1 day | 🟢 High | Firebase Cloud Messaging via service worker |
| **iOS Web Push** | 4 hours | 🟡 Medium | Safari 16.4+ supports web push — needs proper setup |
| **Offline Indicator** | 2 hours | 🟢 High | Show cached data with "last updated X ago" badge |
| **Touch Optimizations** | 4 hours | 🟡 Medium | Larger tap targets, pull-to-refresh, swipe gestures |

**Total estimated effort: ~1 week**

```
PWA Additions to Current Codebase:
├── public/
│   ├── manifest.json           # NEW
│   ├── sw.js                   # NEW (service worker)
│   ├── icon-192.png            # NEW
│   ├── icon-512.png            # NEW
│   └── apple-touch-icon.png    # NEW
├── src/
│   ├── app/
│   │   └── layout.tsx          # EDIT (add manifest link, meta tags)
│   ├── components/
│   │   ├── PWAInstallPrompt.tsx     # NEW
│   │   ├── OfflineIndicator.tsx     # NEW
│   │   └── PullToRefresh.tsx        # NEW
│   └── lib/
│       ├── push-registration.ts     # NEW
│       └── service-worker-reg.ts    # NEW
└── next.config.js              # EDIT (PWA headers)
```

### 5.3 Phase 1: React Native MVP (Weeks 1-12 post-trigger)

**Trigger:** MRR reaches $5,000 (product-market fit confirmed)

**Goal:** Ship a focused mobile app that does 3 things exceptionally well:
1. **Alert** — Instant push notifications for new threats
2. **Triage** — Quick view + assess threats on the go
3. **Act** — One-tap acknowledge, escalate, or initiate takedown

#### Sprint Breakdown

**Sprint 1-2: Foundation (Weeks 1-4)**

| Feature | Priority | Score | Details |
|---------|----------|-------|---------|
| Auth (email + social) | P0 | 95 | Supabase Auth SDK, biometric unlock |
| Dashboard overview | P0 | 92 | Active threats count, scan status, recent activity |
| Push notification infrastructure | P0 | 98 | FCM + APNs setup, device registration, preference management |
| Brand list view | P0 | 88 | View all monitored brands with status |
| Navigation (tab bar) | P0 | 90 | Dashboard / Threats / Brands / Settings |
| Design system foundation | P0 | 85 | Colors, typography, spacing (match web brand) |

**Sprint 3-4: Threat Management (Weeks 5-8)**

| Feature | Priority | Score | Details |
|---------|----------|-------|---------|
| Threats list (filterable) | P0 | 93 | All threats with risk level, platform, status filters |
| Threat detail view | P0 | 91 | Full threat info, evidence screenshots, AI analysis |
| Quick actions (swipe) | P1 | 87 | Swipe to dismiss, acknowledge, escalate |
| Threat comparison (before/after) | P1 | 78 | Side-by-side brand vs. impersonator visuals |
| Brand detail view | P1 | 82 | Brand info, scan history, threat timeline |
| Scan trigger | P1 | 80 | Initiate manual scan from mobile |

**Sprint 5-6: Polish & Launch (Weeks 9-12)**

| Feature | Priority | Score | Details |
|---------|----------|-------|---------|
| Scan progress (real-time) | P1 | 76 | Live scan progress via Supabase Realtime |
| Report viewer | P1 | 74 | View generated PDF reports in-app |
| Share threat/report | P1 | 72 | Native share sheet for evidence/reports |
| Settings & preferences | P1 | 70 | Notification preferences, account info |
| Dark mode | P1 | 68 | Match system preference or manual toggle |
| Onboarding flow | P1 | 82 | First-launch tutorial, permission requests |
| App Store assets | P0 | 85 | Screenshots, description, video preview |
| Beta testing (TestFlight / Google Play Beta) | P0 | 90 | 2-week beta with existing customers |

### 5.4 Phase 2: Native Enhancement (Ongoing, post-launch)

**Trigger:** Mobile MAU > 30% of total users OR MRR > $15K

| Feature | Priority | Score | Timeline |
|---------|----------|-------|----------|
| **Home screen widgets** (iOS 17+ / Android) | P1 | 88 | Month 1 post-launch |
| **Live Activities** (iOS) | P1 | 85 | Month 1 post-launch |
| **Quick Actions** (3D Touch / long-press icon) | P2 | 72 | Month 2 |
| **Apple Watch complication** | P2 | 65 | Month 3 |
| **Siri Shortcuts** / Google Assistant | P2 | 60 | Month 3 |
| **Spotlight search** integration (iOS) | P2 | 58 | Month 2 |
| **Camera-based evidence capture** | P1 | 78 | Month 2 |
| **Offline scan queue** | P2 | 70 | Month 4 |
| **Multi-brand quick-switch** (for MSPs) | P1 | 82 | Month 2 |
| **Team collaboration** (in-app messaging) | P2 | 65 | Month 4 |
| **Accessibility audit** (VoiceOver/TalkBack) | P1 | 75 | Month 1 |

### 5.5 Feature NOT Included in Mobile (Intentional)

These features remain web-only to keep the mobile app focused:

| Feature | Reason | Alternative |
|---------|--------|-------------|
| Brand onboarding wizard | Complex multi-step form better on desktop | Deep link to web |
| Stripe billing management | App Store IAP rules + complexity | Deep link to web billing portal |
| Full report builder | PDF generation requires desktop layout | View-only in mobile |
| Admin/team management | Infrequent, complex CRUD | Deep link to web |
| Domain generator settings | Technical configuration | Web only |
| API key management | Security-sensitive, infrequent | Web only |
| Comparison pages | Marketing content, not product | Web only |

---

## 6. User Experience Design

### 6.1 Design Principles

```
┌─────────────────────────────────────────────────────┐
│  DoppelDown Mobile Design Principles                 │
│                                                       │
│  1. ALERT-FIRST          Threats surface immediately  │
│  2. GLANCEABLE           Key info in <3 seconds       │
│  3. ACTIONABLE           Every screen has a CTA       │
│  4. TRUSTWORTHY          Security product = secure UX │
│  5. PROFESSIONAL-CASUAL  Serious tool, approachable UI│
└─────────────────────────────────────────────────────┘
```

### 6.2 Navigation Architecture

```
┌───────────────────────────────────────────────────┐
│  Tab Bar Navigation                                │
│                                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐           │
│  │ 🏠   │  │ ⚠️   │  │ 🛡️   │  │ ⚙️   │           │
│  │ Home │  │Threats│  │Brands│  │ More │           │
│  └──────┘  └──────┘  └──────┘  └──────┘           │
│                                                     │
│  Home:    Dashboard overview, recent activity       │
│  Threats: Filterable threat list, quick actions      │
│  Brands:  Brand cards, scan triggers                 │
│  More:    Settings, reports, support, billing link   │
└───────────────────────────────────────────────────┘
```

### 6.3 Key Screen Flows

#### 6.3.1 Threat Alert → Resolution Flow (The Hero Journey)

This is the #1 user journey on mobile. It must be frictionless.

```
Push Notification                  App Opens to Threat Detail
┌────────────────────┐             ┌────────────────────────────┐
│ 🔴 DoppelDown      │             │ ← Back         ⚡ Critical │
│                     │  ──tap──►  │                             │
│ CRITICAL: New       │             │ faceb00k-login.com         │
│ phishing domain     │             │ Typosquat of facebook.com  │
│ detected targeting  │             │                             │
│ YourBrand.com       │             │ ┌─────────────────────────┐│
│                     │             │ │  🖼️ Screenshot          ││
│ Tap to review →     │             │ │  [Phishing page preview]││
│                     │             │ └─────────────────────────┘│
└────────────────────┘             │                             │
                                    │ Risk Score: ████████░░ 85  │
                                    │ Registered: 2 hours ago    │
                                    │ AI Analysis: High confidence│
                                    │   phishing page mimicking  │
                                    │   your brand login          │
                                    │                             │
                                    │ ┌──────────┐ ┌──────────┐  │
                                    │ │ Initiate  │ │ Dismiss  │  │
                                    │ │ Takedown  │ │ (false+) │  │
                                    │ └──────────┘ └──────────┘  │
                                    │                             │
                                    │ ┌──────────────────────┐   │
                                    │ │ 📤 Share Evidence     │   │
                                    │ └──────────────────────┘   │
                                    └────────────────────────────┘
```

#### 6.3.2 Dashboard (Home Tab)

```
┌────────────────────────────────────┐
│ Good morning, Richard         🔔 3 │
│                                     │
│ ┌─────────────┐ ┌─────────────┐    │
│ │ 🔴 12       │ │ 🟡 34       │    │
│ │ Critical    │ │ Moderate    │    │
│ │ Threats     │ │ Threats     │    │
│ └─────────────┘ └─────────────┘    │
│ ┌─────────────┐ ┌─────────────┐    │
│ │ 🛡️ 5        │ │ 📊 89%      │    │
│ │ Brands      │ │ Protection  │    │
│ │ Monitored   │ │ Score       │    │
│ └─────────────┘ └─────────────┘    │
│                                     │
│ Recent Threats ──────────── See All │
│ ┌─────────────────────────────────┐│
│ │ 🔴 faceb00k-login.com    2h ago ││
│ │    Typosquat · Critical          ││
│ ├─────────────────────────────────┤│
│ │ 🟡 @yourbrand_official   5h ago ││
│ │    Instagram · Moderate          ││
│ ├─────────────────────────────────┤│
│ │ 🟢 yourbrand.net         1d ago ││
│ │    Domain · Resolved             ││
│ └─────────────────────────────────┘│
│                                     │
│ Last scan: 45 minutes ago           │
│ ┌─────────────────────────────────┐│
│ │       🔄 Run Quick Scan         ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌──────┐┌──────┐┌──────┐┌──────┐  │
│ │ 🏠   ││ ⚠️   ││ 🛡️   ││ ⚙️   │  │
│ │ Home ││Threat││Brand ││ More │  │
│ └──────┘└──────┘└──────┘└──────┘  │
└────────────────────────────────────┘
```

#### 6.3.3 Threats List (Threats Tab)

```
┌────────────────────────────────────┐
│ Threats                    🔍 Filter│
│                                     │
│ ┌─────────────────────────────────┐│
│ │ All │ Critical │ Active │ Social ││
│ └─────────────────────────────────┘│
│                                     │
│ Today ─────────────────────────     │
│ ┌─────────────────────────────────┐│
│ │ 🔴 faceb00k-login.com          ││
│ │ Typosquat Domain · 2 hours ago  ││
│ │ Risk: ████████░░ 85             ││
│ │                      ← swipe →  ││
│ ├─────────────────────────────────┤│
│ │ 🔴 @yourbrand_real              ││
│ │ Twitter Impersonation · 3h ago  ││
│ │ Risk: ███████░░░ 72             ││
│ └─────────────────────────────────┘│
│                                     │
│ Yesterday ─────────────────────     │
│ ┌─────────────────────────────────┐│
│ │ 🟡 yourbrand-deals.com         ││
│ │ Lookalike Domain · 18 hours ago ││
│ │ Risk: █████░░░░░ 55             ││
│ ├─────────────────────────────────┤│
│ │ 🟢 yourbrand.shop  [Resolved]  ││
│ │ Domain · 1 day ago              ││
│ │ Risk: ██░░░░░░░░ 25             ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌──────┐┌──────┐┌──────┐┌──────┐  │
│ │ 🏠   ││ ⚠️   ││ 🛡️   ││ ⚙️   │  │
│ └──────┘└──────┘└──────┘└──────┘  │
└────────────────────────────────────┘
```

### 6.4 Interaction Patterns

#### Swipe Actions (Threats List)

```
Swipe Right → Acknowledge/Dismiss (green)
  ┌──────────┐ ┌─────────────────────────────────────┐
  │  ✓ ACK   │ │ 🔴 faceb00k-login.com              │ →
  └──────────┘ └─────────────────────────────────────┘

Swipe Left → Quick Actions Menu (blue)
  ← ┌─────────────────────────────────────┐ ┌──────────┐
     │ 🔴 faceb00k-login.com              │ │ ⚡ More   │
     └─────────────────────────────────────┘ └──────────┘
     Opens: [Takedown] [Share] [Flag False+] [Copy URL]
```

#### Pull-to-Refresh

All list views support pull-to-refresh with haptic feedback.

#### Long-Press Context Menu

Long-press on any threat card shows a context menu:
- View Details
- Initiate Takedown
- Share Evidence
- Copy Threat URL
- Mark as False Positive
- Add Note

### 6.5 Visual Design System

#### Color Palette

```
Brand Colors:
  Primary:    #2563EB (Blue-600) — Trust, security
  Secondary:  #7C3AED (Violet-600) — Premium, intelligence

Risk Colors:
  Critical:   #DC2626 (Red-600)
  High:       #EA580C (Orange-600)
  Medium:     #D97706 (Amber-600)
  Low:        #16A34A (Green-600)
  Info:       #2563EB (Blue-600)
  Resolved:   #6B7280 (Gray-500)

Surface Colors:
  Light Mode:
    Background: #F8FAFC (Slate-50)
    Surface:    #FFFFFF
    Border:     #E2E8F0 (Slate-200)
    Text:       #0F172A (Slate-900)
  
  Dark Mode:
    Background: #0F172A (Slate-900)
    Surface:    #1E293B (Slate-800)
    Border:     #334155 (Slate-700)
    Text:       #F1F5F9 (Slate-100)
```

#### Typography

```
iOS:        SF Pro (system default)
Android:    Roboto (system default)

Hierarchy:
  H1: 28pt / Bold     (screen titles)
  H2: 22pt / Semibold  (section headers)
  H3: 18pt / Medium    (card titles)
  Body: 16pt / Regular  (content)
  Caption: 13pt / Regular (metadata)
  Badge: 11pt / Bold    (labels, counts)
```

#### Spacing Scale

```
4px  → xs  (tight padding)
8px  → sm  (icon gaps)
12px → md  (card padding)
16px → lg  (section spacing)
24px → xl  (screen margins)
32px → 2xl (section gaps)
```

---

## 7. Mobile-Native Features & Differentiators

These are features that **only make sense on mobile** and differentiate DoppelDown from competitors who only have web dashboards.

### 7.1 Intelligent Push Notifications

Not just "you have a new threat." Smart, contextual, actionable alerts.

#### Notification Categories & Priority

| Category | Priority | Sound | Badge | Example |
|----------|----------|-------|-------|---------|
| **Critical Threat** | Time-sensitive | Alert tone | Yes | "🔴 CRITICAL: Active phishing page detected targeting YourBrand.com — 85% risk score" |
| **High Threat** | Active | Default | Yes | "🟠 New typosquat domain registered: yourbrand-login.com" |
| **Medium Threat** | Passive | Silent | Badge only | "🟡 New social media mention flagged for review" |
| **Scan Complete** | Passive | Silent | No | "✅ Weekly scan complete: 3 new threats, 2 resolved" |
| **Takedown Update** | Active | Default | Yes | "📋 Takedown request for faceb00k-login.com: Status changed to In Progress" |
| **System** | Passive | Silent | No | "🔄 Your scan schedule has been updated" |

#### iOS-Specific: Live Activities

When a scan is running, show a Live Activity on the Dynamic Island / lock screen:

```
┌─────────────────────────────────────────────┐
│ 🛡️ DoppelDown Scan  ████████░░ 78%          │
│ Scanning domains... 234/300  ⏱️ ~2 min left │
└─────────────────────────────────────────────┘
```

#### Rich Notifications (iOS + Android)

```
┌────────────────────────────────────────────┐
│ 🔴 DoppelDown                    2 min ago │
│                                             │
│ CRITICAL THREAT DETECTED                    │
│                                             │
│ ┌──────────────────────────────────────┐   │
│ │  [Phishing page screenshot preview]  │   │
│ └──────────────────────────────────────┘   │
│                                             │
│ faceb00k-login.com                          │
│ Risk Score: 85/100 · Typosquat Domain      │
│                                             │
│ ┌──────────────┐  ┌───────────────────┐    │
│ │  ⚡ Takedown  │  │  👁️ View Details  │    │
│ └──────────────┘  └───────────────────┘    │
└────────────────────────────────────────────┘
```

### 7.2 Home Screen Widgets

#### iOS Widget Sizes

**Small Widget (2x2):**
```
┌────────────────┐
│ 🛡️ DoppelDown  │
│                 │
│  🔴 12  🟡 34  │
│  Active Threats │
│                 │
│  ⏱️ Scanned 1h  │
└────────────────┘
```

**Medium Widget (4x2):**
```
┌──────────────────────────────────┐
│ 🛡️ DoppelDown                    │
│                                   │
│ 🔴 12 Critical  🟡 34 Moderate   │
│ 🟢 89% Protection Score          │
│                                   │
│ Latest: faceb00k-login.com (2h)   │
│ Status: 5 brands monitored        │
└──────────────────────────────────┘
```

**Large Widget (4x4):**
Full threat feed with last 5 threats + stats.

#### Android Widget

Resizable widget with real-time threat counter and latest threat preview. Uses `expo-widgets` or a native module.

### 7.3 Quick Actions (App Icon Long-Press)

```
┌─────────────────────────┐
│ 🔍 Quick Scan            │
│ ⚠️ View Critical Threats │
│ 🔔 Notification Settings │
│ ➕ Add New Brand          │
└─────────────────────────┘
```

### 7.4 Camera-Based Evidence Capture

Unique to mobile — allow users to photograph evidence of brand impersonation in the physical world:

- **Counterfeit products** with your brand on them
- **Physical phishing** (fake QR codes, posters)
- **Screenshots** from customer reports

Photos are geotagged, timestamped, and attached to the relevant brand as evidence.

### 7.5 Biometric Authentication

| Feature | iOS | Android |
|---------|-----|---------|
| Face ID / Fingerprint | ✅ `expo-local-authentication` | ✅ `expo-local-authentication` |
| Auto-lock after X minutes | ✅ Configurable (1/5/15/30 min) | ✅ Same |
| Require biometric for sensitive actions | ✅ Takedown initiation, settings changes | ✅ Same |

### 7.6 Haptic Feedback

| Event | Haptic Type | Platform |
|-------|-------------|----------|
| New critical threat received | `notificationError` (heavy) | iOS + Android |
| Threat acknowledged | `notificationSuccess` (light) | iOS + Android |
| Pull-to-refresh trigger | `impactLight` | iOS + Android |
| Swipe action threshold | `selectionChanged` | iOS + Android |
| Scan complete | `notificationSuccess` | iOS + Android |

---

## 8. Backend & API Strategy

### 8.1 API Versioning

The mobile app needs stable APIs. Introduce versioning now:

```
Current:  /api/threats
Mobile:   /api/v1/threats

All mobile endpoints under /api/v1/ with:
- Stable contracts (no breaking changes within major version)
- Deprecation headers when changes are coming
- Rate limiting per device + per user
```

### 8.2 New API Endpoints for Mobile

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `POST /api/v1/devices` | Register | Register push token + device info |
| `DELETE /api/v1/devices/:id` | Unregister | Remove device on logout |
| `PUT /api/v1/devices/:id/preferences` | Update | Notification preferences per device |
| `GET /api/v1/dashboard/summary` | Read | Aggregated dashboard data (single call) |
| `GET /api/v1/threats?since=timestamp` | Read | Delta sync — only threats since last check |
| `POST /api/v1/threats/:id/actions` | Create | Quick actions (acknowledge, dismiss, escalate) |
| `GET /api/v1/brands/overview` | Read | Lightweight brand list with threat counts |
| `POST /api/v1/evidence/upload` | Create | Camera evidence upload with metadata |

### 8.3 Push Notification Infrastructure

```
┌──────────────────────────────────────────────────────────────┐
│  Push Notification Pipeline                                   │
│                                                                │
│  Scan Worker                   Push Service              Device│
│  ┌─────────┐    ┌─────────┐    ┌──────────┐    ┌──────────┐  │
│  │ Threat   │───►│ Supabase│───►│ Push     │───►│ FCM/APNs │  │
│  │ Detected │    │ Realtime│    │ Dispatcher│   │          │  │
│  └─────────┘    │ + DB    │    │          │    │  ┌─────┐ │  │
│                  │ Trigger │    │ Template  │    │  │ 📱  │ │  │
│                  └─────────┘    │ Engine    │    │  └─────┘ │  │
│                                 │          │    └──────────┘  │
│                                 │ Rate     │                   │
│                                 │ Limiter  │                   │
│                                 │          │                   │
│                                 │ Pref     │                   │
│                                 │ Filter   │                   │
│                                 └──────────┘                   │
└──────────────────────────────────────────────────────────────┘
```

**Implementation:**
1. **Supabase Database Webhook** triggers on `threats` table INSERT
2. **Edge Function** processes the trigger:
   - Looks up user notification preferences
   - Checks rate limits (no more than 1 push per 5 minutes per user)
   - Formats notification based on threat severity
   - Sends via FCM (Android) and APNs (iOS)
3. **Device registry table** maps users → push tokens → preferences

### 8.4 Data Sync Strategy

Mobile apps need efficient data loading. Strategy:

| Pattern | Use Case | Implementation |
|---------|----------|----------------|
| **Full sync** | First app open | `/api/v1/dashboard/summary` — single payload with everything |
| **Delta sync** | Returning users | `?since=<timestamp>` on all list endpoints |
| **Real-time** | Active threat monitoring | Supabase Realtime subscriptions on `threats` table |
| **Background refresh** | App in background | `expo-background-fetch` every 15 minutes |
| **Optimistic updates** | Quick actions | Update local state immediately, sync to server async |

### 8.5 Supabase Schema Additions

```sql
-- Device registry for push notifications
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  push_token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  device_name TEXT,
  device_model TEXT,
  os_version TEXT,
  app_version TEXT,
  is_active BOOLEAN DEFAULT true,
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, push_token)
);

-- Notification preferences per device
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'critical_threat', 'high_threat', 'scan_complete', etc.
  enabled BOOLEAN DEFAULT true,
  sound BOOLEAN DEFAULT true,
  quiet_hours_start TIME, -- e.g., '22:00'
  quiet_hours_end TIME,   -- e.g., '07:00'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(device_id, category)
);

-- Push notification log (for analytics + debugging)
CREATE TABLE push_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  device_id UUID REFERENCES devices(id),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evidence from mobile camera
CREATE TABLE mobile_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  brand_id UUID REFERENCES brands(id),
  threat_id UUID REFERENCES threats(id),
  image_url TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE mobile_evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own devices"
  ON devices FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own notification prefs"
  ON notification_preferences FOR ALL
  USING (device_id IN (SELECT id FROM devices WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own push log"
  ON push_log FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own mobile evidence"
  ON mobile_evidence FOR ALL USING (auth.uid() = user_id);
```

---

## 9. Security Architecture

A brand protection tool must itself be impeccably secure. The mobile app is a high-value target.

### 9.1 Authentication & Session Management

| Layer | Implementation | Details |
|-------|---------------|---------|
| **Primary auth** | Supabase Auth (JWT) | Email/password, OAuth (Google, GitHub) |
| **Token storage** | `expo-secure-store` | Encrypted keychain (iOS) / Keystore (Android) |
| **Biometric gate** | `expo-local-authentication` | Required after 5 min inactivity |
| **Session refresh** | Supabase auto-refresh | Refresh token stored securely, rotated on use |
| **Certificate pinning** | Custom fetch with pinning | Pin Supabase + API TLS certificates |
| **Jailbreak detection** | `expo-device` + custom checks | Warn user, disable sensitive features on rooted devices |

### 9.2 Data Protection

| Data Type | At Rest | In Transit | Additional |
|-----------|---------|------------|------------|
| Auth tokens | AES-256 (Keychain/Keystore) | TLS 1.3 | Certificate pinning |
| Threat data | SQLite + encryption | TLS 1.3 | Cleared on logout |
| Screenshots/evidence | Encrypted file storage | TLS 1.3 | Not cached locally |
| Push tokens | Server-side only | TLS 1.3 | Rotated periodically |
| User preferences | `expo-secure-store` | TLS 1.3 | — |

### 9.3 Security Checklist

- [ ] No sensitive data in AsyncStorage (use SecureStore)
- [ ] No hardcoded API keys in the JS bundle
- [ ] ProGuard/R8 obfuscation enabled (Android)
- [ ] App Transport Security enabled (iOS)
- [ ] No logging of sensitive data in production builds
- [ ] Clipboard cleared on app background (if sensitive data was copied)
- [ ] Screenshot prevention on sensitive screens (Android `FLAG_SECURE`)
- [ ] Biometric fallback is device passcode (not skip)
- [ ] Deep links validated against allowlist
- [ ] Dependencies audited for known vulnerabilities

---

## 10. Push Notification Strategy

### 10.1 Permission Request Flow

**Never ask for push permission on first launch.** Use a primer screen:

```
┌────────────────────────────────────────────┐
│                                             │
│         🛡️🔔                                │
│                                             │
│    Stay Alert, Stay Protected               │
│                                             │
│    DoppelDown can notify you instantly       │
│    when threats target your brand.           │
│                                             │
│    You'll be notified about:                │
│    ✅ Critical phishing domains              │
│    ✅ Social media impersonation             │
│    ✅ Scan completion summaries              │
│                                             │
│    Average: 2-5 notifications per week       │
│    (We hate notification spam too)           │
│                                             │
│    ┌──────────────────────────────────┐      │
│    │     Enable Threat Alerts 🔔     │      │
│    └──────────────────────────────────┘      │
│                                             │
│    Maybe Later                              │
│                                             │
└────────────────────────────────────────────┘
```

This "primer" screen ensures the OS-level permission dialog has context, resulting in **2-3x higher opt-in rates** (industry average: 55% → 75-85% with primer).

### 10.2 Notification Frequency Management

| User Tier | Max Push/Day | Digest Option | Smart Batching |
|-----------|-------------|---------------|----------------|
| Free | 3 | Daily digest only | N/A |
| Growth | 10 | Optional digest | Group by brand |
| Business | 25 | Optional digest | Group by brand + severity |
| Enterprise | Unlimited | Optional digest | Full control |

### 10.3 Smart Notification Batching

Don't send 10 pushes during a scan. Batch intelligently:

```
Scenario: Scan finds 8 new threats

BAD:
  🔔 New threat: domain1.com
  🔔 New threat: domain2.com
  🔔 New threat: domain3.com
  (×8 notifications in 30 seconds → user disables notifications)

GOOD:
  🔔 Scan complete: 8 new threats detected
     2 Critical · 3 High · 3 Medium
     Tap to review →
```

### 10.4 Quiet Hours

Respect the user's time. Default quiet hours: 10 PM - 7 AM (user's local time). Critical threats bypass quiet hours with a 15-minute delay.

---

## 11. Offline & Performance Strategy

### 11.1 Offline Capabilities

| Feature | Offline Support | Implementation |
|---------|----------------|----------------|
| View dashboard | ✅ Cached | SQLite local database |
| View threat list | ✅ Cached | Last 100 threats stored locally |
| View threat details | ✅ Partial | Text cached, images require network |
| View brand list | ✅ Cached | Full brand data stored locally |
| Trigger scan | ❌ No | Requires server, queued for when online |
| Quick actions | ✅ Optimistic | Queue locally, sync when online |
| Evidence capture | ✅ Full | Photos stored locally, uploaded when online |
| Push notifications | N/A | Delivered by OS when online |

### 11.2 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Cold start → interactive | < 2 seconds | Time to interactive on mid-range device |
| Tab switch | < 100ms | Perceived instant |
| Threat list scroll | 60 FPS | FlatList with optimized rendering |
| Image loading (thumbnails) | < 500ms | Cached + progressive loading |
| API response display | < 1 second | From tap to new data visible |
| App size (download) | < 25 MB | Optimized assets, tree-shaking |
| Memory usage (active) | < 150 MB | Profiled on low-end devices |

### 11.3 Performance Optimization Techniques

1. **FlatList everywhere** — Never ScrollView for lists; FlatList with `getItemLayout` for fixed-height items
2. **Image caching** — `expo-image` (powered by SDWebImage/Glide) for efficient image loading
3. **Lazy loading** — Screens loaded on demand via Expo Router
4. **Memoization** — `React.memo` + `useMemo` on threat cards to prevent re-renders
5. **Background prefetch** — Preload next screen data on hover/proximity
6. **Hermes engine** — React Native's optimized JS engine (default in Expo SDK 50+)
7. **Bundle splitting** — Dynamic imports for settings/reports (rarely accessed screens)

---

## 12. Testing Strategy

### 12.1 Test Pyramid

```
           ╱╲
          ╱  ╲        E2E (Detox / Maestro)
         ╱ 10 ╲       Critical user flows
        ╱──────╲
       ╱        ╲     Integration Tests
      ╱   25     ╲    API + component integration
     ╱────────────╲
    ╱              ╲   Unit Tests
   ╱      65        ╲  Hooks, utils, transforms
  ╱──────────────────╲
```

### 12.2 Testing Tools

| Layer | Tool | Coverage Target |
|-------|------|----------------|
| Unit | Jest + React Native Testing Library | 80% of shared logic |
| Component | React Native Testing Library | Key components rendered correctly |
| Integration | MSW (Mock Service Worker) | API integration paths |
| E2E | Maestro (recommended) or Detox | 5-10 critical flows |
| Visual | Chromatic (via Storybook RN) | Screenshot regression |
| Performance | Flipper + React DevTools | No regressions per release |

### 12.3 Critical E2E Test Flows

1. **Sign up → First brand → First scan → See results** (full onboarding)
2. **Receive push notification → Open → View threat → Take action**
3. **Open app → Biometric unlock → Dashboard loads with cached data**
4. **Offline → View cached threats → Go online → Data syncs**
5. **MSP flow: Switch between brands → View brand-specific threats**

### 12.4 Device Testing Matrix

| Device | OS Version | Priority |
|--------|-----------|----------|
| iPhone 15 Pro | iOS 17+ | P0 |
| iPhone SE 3 | iOS 17+ | P0 (small screen) |
| iPhone 12 | iOS 16+ | P1 |
| Samsung Galaxy S24 | Android 14 | P0 |
| Google Pixel 7 | Android 13 | P0 |
| Samsung Galaxy A54 | Android 13 | P1 (mid-range) |
| OnePlus Nord | Android 12 | P2 (budget) |

---

## 13. App Store Strategy

### 13.1 App Store Optimization (ASO)

#### App Name & Subtitle

**iOS App Store:**
```
Name:     DoppelDown - Brand Protection
Subtitle: Phishing & Impersonation Alerts
```

**Google Play Store:**
```
Title:        DoppelDown - Brand Protection
Short Desc:   Detect phishing, fake domains & social impersonation. Protect your brand 24/7.
```

#### Keywords (iOS)

```
brand protection, phishing detection, domain monitoring, fake account, 
impersonation, typosquatting, takedown, cybersecurity, brand safety, 
social media monitoring, threat detection, digital risk
```

#### Category & Content Rating

| | iOS | Android |
|---|---|---|
| Primary Category | Business | Business |
| Secondary Category | Utilities | Tools |
| Content Rating | 4+ | Everyone |

### 13.2 App Store Listing Assets

#### Screenshots (Required)

6 screenshots per platform showing:

1. **Dashboard** — "Your brand protection command center"
2. **Threat Alert** — "Instant alerts when threats appear"
3. **Threat Detail** — "AI-powered threat analysis"
4. **Push Notification** — "Never miss a critical threat"
5. **Brand Overview** — "Monitor all your brands in one place"
6. **Scan Results** — "500+ typosquat variations detected automatically"

#### App Preview Video (30 seconds)

```
0-5s:   Logo animation + "Protect Your Brand"
5-12s:  Push notification arrives → open app → see threat
12-20s: Dashboard overview → threat list → swipe actions
20-27s: Evidence screenshot → initiate takedown
27-30s: "DoppelDown — Brand Protection That Never Sleeps"
```

### 13.3 App Store Pricing

**The app is FREE to download.** Revenue comes from web subscriptions.

Why NOT use In-App Purchases:
1. **Apple/Google take 15-30%** of subscription revenue
2. **Stripe integration already works** on web
3. **Simpler billing management** — one system, not two
4. **Legal clarity** — enterprise contracts via web

How to handle this:
- App is free to download with read-only access for free tier
- Upgrade prompts link to the DoppelDown web app (`https://doppeldown.com/pricing`)
- Apple's guidelines allow this for "reader" apps and SaaS tools where the subscription provides server-side value
- See: [Apple App Store Review Guideline 3.1.3(a)](https://developer.apple.com/app-store/review/guidelines/#reader-apps) — "Reader" apps

### 13.4 App Store Review Preparation

| Potential Rejection Reason | Mitigation |
|---------------------------|------------|
| "No IAP for subscriptions" | Classify as Reader/SaaS app; service delivers value on server |
| "App requires account" | Provide demo account credentials in review notes |
| "Insufficient functionality" | Ensure free tier shows real value (threat monitoring) |
| "Missing privacy policy" | Already have one at doppeldown.com/privacy |
| "Push permission without context" | Use primer screen before OS dialog |
| "Incomplete metadata" | Full ASO assets prepared before submission |

---

## 14. Go-to-Market: Mobile Launch Plan

### 14.1 Pre-Launch (4 weeks before)

| Week | Activity | Details |
|------|----------|---------|
| -4 | **Announce mobile is coming** | Blog post, email to all users, social media teaser |
| -4 | **Beta signup page** | Collect emails of users who want early access |
| -3 | **TestFlight / Play Beta** | Internal testing with team |
| -2 | **Beta launch** | Invite top 50 customers to beta test |
| -2 | **App Store assets** | Finalize screenshots, description, video |
| -1 | **Beta feedback incorporated** | Fix bugs, polish UX based on feedback |
| -1 | **Submit to App Store review** | iOS takes 24-48h average; Android is ~instant |

### 14.2 Launch Day

| Time | Activity |
|------|----------|
| Morning | App goes live on both stores |
| Morning | Email blast to all users: "DoppelDown Mobile is here!" |
| Morning | Blog post: "Why We Built a Mobile App for Brand Protection" |
| Midday | Social media campaign (LinkedIn, Twitter/X) |
| Midday | Product Hunt launch (if timing aligns) |
| Afternoon | Respond to initial reviews and feedback |

### 14.3 Launch Email Template

```
Subject: 📱 DoppelDown is now on your phone

Hey {first_name},

When a phishing page goes live targeting your brand, minutes matter.
Emails sit unread. Push notifications don't.

Today, DoppelDown launches on iOS and Android:

🔔 Instant push alerts for critical threats
⚡ One-tap threat triage on the go  
🛡️ Full dashboard in your pocket
📸 Camera evidence capture for physical threats

[Download on the App Store]  [Get it on Google Play]

The app is free for all DoppelDown users — just log in with 
your existing account.

Already on the free plan? The mobile app works with that too.
Upgrade anytime at doppeldown.com/pricing.

Stay alert,
The DoppelDown Team
```

### 14.4 Post-Launch (First 90 Days)

| Week | Focus | Metrics to Watch |
|------|-------|-----------------|
| 1-2 | **Bug fixes & stability** | Crash rate, ANR rate, reviews |
| 3-4 | **Feature requests triage** | User feedback, support tickets |
| 5-8 | **V1.1: Top requested features** | Retention D7/D30, DAU/MAU |
| 9-12 | **V1.2: Widgets + native enhancements** | Push opt-in rate, time-to-response |

### 14.5 Launch Channels

| Channel | Tactic | Expected Impact |
|---------|--------|----------------|
| **Email** | Announcement to all users | 🟢 High (existing users adopt mobile) |
| **In-app (web)** | Banner: "Get the mobile app" | 🟢 High (converts active web users) |
| **Product Hunt** | "DoppelDown Mobile" launch | 🟡 Medium (if timed with big update) |
| **LinkedIn** | Post + article about mobile brand protection | 🟡 Medium |
| **Twitter/X** | Thread: "Why your brand protection tool needs mobile push" | 🟡 Medium |
| **App Store SEO** | Optimized listing + keyword targeting | 🟢 High (long-term organic discovery) |
| **Blog** | "Mobile Brand Protection: Why 4 Minutes Beats 4 Hours" | 🟡 Medium (SEO play) |
| **Reddit** | r/cybersecurity, r/sysadmin posts | 🟡 Medium |
| **Partner channels** | MSP partners promote to their clients | 🟢 High (if partnerships exist) |

---

## 15. Monetization & Mobile-Specific Revenue

### 15.1 Revenue Model

The mobile app is NOT a separate revenue stream — it's a **retention and conversion accelerator** for the existing web subscription.

```
Mobile App Revenue Impact:

┌──────────────────────────────────────────────────┐
│                                                    │
│  Direct Revenue: $0 (app is free, no IAP)          │
│                                                    │
│  Indirect Revenue Impact:                          │
│  ├── ↑ Conversion: +15-25%                        │
│  │   (Push alerts create urgency → upgrade)        │
│  ├── ↓ Churn: -20-35%                             │
│  │   (Higher engagement → stickier product)        │
│  ├── ↑ Expansion: +10-15%                          │
│  │   (MSPs add more brands when mobile UX is good) │
│  └── ↑ LTV: +30-50%                               │
│      (Combination of above)                        │
│                                                    │
│  Estimated impact at $15K MRR:                     │
│  +$3K-$6K MRR from improved retention/conversion   │
│                                                    │
└──────────────────────────────────────────────────┘
```

### 15.2 Mobile-Driven Upgrade Triggers

Smart moments to nudge free users to paid, leveraging mobile context:

| Trigger | Message | Why It Works |
|---------|---------|-------------|
| 3rd critical threat alert | "You've had 3 critical threats this month. Upgrade for automated takedowns." | Urgency is real and felt on mobile |
| Free scan limit reached | "Your weekly free scan found 5 threats. Upgrade for daily scans." | Pain point at moment of value |
| Attempt to initiate takedown | "Takedown reports are available on Growth+ plans." | Blocked at point of maximum intent |
| 7 days after signup | "You've been monitoring [brand] for a week. Here's what paid users get:" | Established habit + demonstrated value |

### 15.3 Mobile as an Enterprise Selling Feature

"Our mobile app with instant push notifications" is a legitimate feature to highlight on the pricing page, in sales conversations, and in MSP partner decks. Enterprise buyers expect mobile:

- Add "📱 Mobile App" to the feature matrix on the pricing page
- Include mobile screenshots in sales decks
- Highlight "4-minute response time (push) vs. 45-minute (email)" in security ROI conversations

---

## 16. Analytics & Mobile Metrics

### 16.1 Key Mobile Metrics

| Metric | Target (Month 3) | Target (Month 12) | Tool |
|--------|------------------|-------------------|------|
| **Downloads** | 200 | 2,000 | App Store Connect / Play Console |
| **DAU / MAU** | 30% | 40% | Mixpanel / PostHog |
| **Push opt-in rate** | 75% | 80% | Internal + platform analytics |
| **Push tap-through rate** | 12% | 15% | Push service analytics |
| **Time to threat response** | < 10 min | < 5 min | Internal (threat acknowledged_at - notified_at) |
| **Crash-free rate** | 99.5% | 99.9% | Sentry / Crashlytics |
| **App Store rating** | 4.3★ | 4.6★ | App Store / Play Store |
| **Mobile-driven upgrades** | 10% of conversions | 25% of conversions | Attribution analytics |
| **Session duration** | 2 min (alert-driven) | 3 min | Mixpanel |
| **D7 retention** | 50% | 65% | Mixpanel |
| **D30 retention** | 30% | 45% | Mixpanel |

### 16.2 Analytics Implementation

```typescript
// Analytics events to track in the mobile app

// Core events
track('app_opened', { source: 'push' | 'direct' | 'widget' | 'deeplink' })
track('app_backgrounded', { session_duration_ms })
track('screen_viewed', { screen_name, previous_screen })

// Auth events
track('login_success', { method: 'email' | 'biometric' | 'oauth' })
track('biometric_prompt_shown')
track('biometric_success')

// Threat events
track('threat_viewed', { threat_id, severity, source: 'list' | 'push' | 'widget' })
track('threat_action', { action: 'acknowledge' | 'dismiss' | 'takedown' | 'share' })
track('threat_list_filtered', { filters: string[] })
track('threat_swipe_action', { direction, action })

// Scan events
track('scan_triggered', { brand_id, type: 'quick' | 'full' })
track('scan_progress_viewed', { scan_id })

// Push events
track('push_received', { category, threat_id })
track('push_tapped', { category, threat_id, time_to_tap_ms })
track('push_permission_granted')
track('push_permission_denied')
track('push_settings_changed', { category, enabled })

// Conversion events
track('upgrade_prompt_shown', { trigger, current_tier })
track('upgrade_link_tapped', { trigger, current_tier })

// Evidence events
track('evidence_captured', { type: 'camera' | 'screenshot', brand_id })

// Performance events
track('app_cold_start', { duration_ms })
track('screen_load', { screen_name, duration_ms })
track('api_call', { endpoint, duration_ms, status })
```

### 16.3 Analytics Tools Recommendation

| Tool | Purpose | Cost |
|------|---------|------|
| **PostHog** (recommended) | Product analytics, session replay, feature flags | Free up to 1M events/mo |
| **Sentry** | Crash reporting, performance monitoring | Free up to 5K events/mo |
| **App Store Connect / Play Console** | Store analytics, downloads, reviews | Free |
| **Mixpanel** (alternative) | Funnels, retention, user segmentation | Free up to 20M events/mo |

PostHog is recommended because:
1. Open-source — can self-host later
2. Session replay for mobile (beta)
3. Feature flags built-in
4. Already aligned with DoppelDown's analytics strategy doc

---

## 17. Team & Resource Requirements

### 17.1 Phase 0 (PWA) — Solo Developer

| Role | Who | Time |
|------|-----|------|
| Developer | Current team (Ernie or contractor) | 1 week |

No additional hiring needed.

### 17.2 Phase 1 (React Native MVP) — Small Team

| Role | Who | Time | Cost Estimate |
|------|-----|------|---------------|
| React Native Developer | Hire or contract | 12 weeks full-time | $15K-$30K (contractor) |
| UX/UI Designer | Contract (Figma designs) | 2-3 weeks | $3K-$6K |
| QA / Beta Testers | Existing customers + TestFlight | Ongoing | $0 (community beta) |
| Backend (API additions) | Current team | 2 weeks | $0 (existing) |

**Total Phase 1 estimated cost: $18K-$36K**

At $5K MRR (the trigger point), this is 4-7 months of revenue. Aggressive but justified if retention metrics support it.

#### Alternative: Solo Build

If budget is constrained, a single senior React Native developer (or the founding team) can build the MVP in 12-16 weeks. The Expo ecosystem dramatically reduces the complexity.

### 17.3 Phase 2 (Ongoing Enhancement) — Dedicated Resource

| Role | Who | Time | Cost Estimate |
|------|-----|------|---------------|
| Mobile Developer (part-time) | Retained contractor or part-time hire | 20 hrs/week | $4K-$8K/mo |
| Designer (ad-hoc) | Contract per feature | As needed | $1K-$2K/mo average |

### 17.4 Ongoing Costs

| Item | Monthly Cost | Notes |
|------|-------------|-------|
| Apple Developer Program | $8.25/mo ($99/yr) | Required for App Store |
| Google Play Developer | One-time $25 | Lifetime access |
| Expo EAS Build | $0-$99/mo | Free tier may suffice early on |
| Push notification delivery (FCM) | $0 | Free for reasonable volume |
| Push notification delivery (APNs) | $0 | Free (included with Apple Developer) |
| Sentry (crash reporting) | $0-$26/mo | Free tier initially |
| PostHog (analytics) | $0 | Free tier up to 1M events |

**Total ongoing cost (Phase 1): ~$10-$135/month** — negligible.

---

## 18. Timeline & Milestones

### 18.1 Master Timeline

```
2026
─────────────────────────────────────────────────────────────────

Q1 (Now)     PHASE 0: PWA
Feb          ├── Week 1: Manifest + Service Worker + Icons
             ├── Week 2: Web Push + Install Prompt + Offline
             └── ✅ PWA Live

Q2-Q3        TRIGGER: Hit $5K MRR
             PHASE 1: React Native MVP
             ├── Weeks 1-2: Project setup, design system, auth
             ├── Weeks 3-4: Dashboard + push notifications
             ├── Weeks 5-6: Threats list + detail + quick actions
             ├── Weeks 7-8: Brands + scan trigger
             ├── Weeks 9-10: Polish, offline, settings
             ├── Weeks 11-12: Beta testing + App Store submission
             └── ✅ Mobile App v1.0 Live

Q4           POST-LAUNCH
             ├── Month 1: Bug fixes, v1.1 (top feedback)
             ├── Month 2: Widgets, quick actions, native features
             ├── Month 3: Performance optimization, v1.2
             └── ✅ Mobile established as core channel

2027
─────────────────────────────────────────────────────────────────

Q1           TRIGGER: Hit $15K MRR + Mobile MAU > 30%
             PHASE 2: Native Enhancement
             ├── Live Activities (iOS)
             ├── Apple Watch complication
             ├── Camera evidence capture
             ├── Siri Shortcuts / Google Assistant
             └── ✅ Platform-native differentiation
```

### 18.2 Key Decision Points

| Decision Point | Date | Criteria | Options |
|---------------|------|----------|---------|
| **Start Phase 1?** | When MRR = $5K | PMF confirmed, churn < 8% | Build vs. continue PWA-only |
| **Hire vs. contract?** | At Phase 1 start | Budget, timeline, long-term plans | Full-time mobile dev vs. agency vs. solo build |
| **React Native vs. Flutter?** | At Phase 1 start | Team skills, ecosystem maturity | RN (recommended) vs. Flutter |
| **Start Phase 2?** | When MRR = $15K + mobile MAU > 30% | Mobile engagement metrics | Invest in native vs. web feature parity |
| **Dedicated mobile team?** | When MRR = $30K+ | Mobile revenue attribution > 30% | Hire mobile team vs. continue with contracts |

---

## 19. Risk Assessment & Mitigation

### 19.1 Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **App Store rejection** | 🟡 Medium | 🟡 Medium | Prepare demo account, follow guidelines strictly, build relationship with App Review |
| **IAP requirement** | 🟡 Medium | 🔴 High | Classify as "Reader" app; subscriptions deliver server-side value (scans, analysis). If forced, implement IAP at higher prices (to offset 30% cut) |
| **Low mobile adoption** | 🟡 Medium | 🟡 Medium | Don't invest in Phase 1 until PWA metrics confirm demand. If PWA installs are low, reconsider. |
| **Push notification fatigue** | 🟡 Medium | 🟡 Medium | Smart batching, quiet hours, user-controlled preferences, never exceed 5/day average |
| **React Native performance issues** | 🟢 Low | 🟡 Medium | Profile early and often. DoppelDown's UI is straightforward (lists, cards, charts) — not gaming |
| **Supabase Realtime limits** | 🟢 Low | 🟡 Medium | Supabase Pro plan handles 500 concurrent connections; upgrade as needed |
| **Security vulnerability in mobile** | 🟢 Low | 🔴 High | Security audit before launch, certificate pinning, no sensitive data in local storage, regular dependency updates |
| **Platform fragmentation (Android)** | 🟡 Medium | 🟢 Low | Target Android 12+ (covers 80%+ of active devices), test on mid-range devices |
| **Maintenance burden** | 🟡 Medium | 🟡 Medium | Shared code in `@doppeldown/shared` minimizes duplication. Expo handles most platform differences |

### 19.2 Contingency Plans

**If App Store rejects the no-IAP model:**
1. Implement Stripe web checkout via in-app Safari (allowed)
2. If forced to use IAP, price iOS tiers 30% higher to offset Apple's cut
3. Maintain web-based billing for Android and direct signups

**If mobile adoption is lower than expected:**
1. Survey users on why they're not installing
2. Increase in-app (web) promotion of mobile
3. Add mobile-exclusive features to drive adoption
4. Consider if the target market (SMB security) is inherently desktop-first

**If React Native performance is insufficient:**
1. Optimize JS bundle (lazy loading, code splitting)
2. Move heavy operations to native modules
3. Consider rewrite of performance-critical screens in native code (Swift/Kotlin)
4. Last resort: migrate to Flutter or full native

---

## 20. Decision Framework: Build vs. Wait

### 20.1 Build Now (Phase 0: PWA) ✅

**Verdict: DO IT NOW.**

| Factor | Assessment |
|--------|-----------|
| Cost | ~1 week of dev time |
| Risk | Nearly zero (it's your existing web app) |
| Upside | App-like experience, push notifications, home screen presence |
| Downside | None meaningful |

### 20.2 Build Phase 1 When...

**All of the following are true:**

- [ ] MRR ≥ $5,000 (product-market fit signal)
- [ ] Monthly active users > 100 (enough to test mobile)
- [ ] PWA install rate > 10% of mobile visitors (demand signal)
- [ ] Customer feedback mentions "mobile" or "alerts" (pull vs. push)
- [ ] Churn rate < 8%/month (product is sticky enough to invest in)

**If 4/5 are true, START Phase 1.**

### 20.3 Build Phase 2 When...

**All of the following are true:**

- [ ] MRR ≥ $15,000
- [ ] Mobile app MAU > 30% of total MAU
- [ ] Mobile-attributed conversions > 15%
- [ ] App Store rating ≥ 4.0
- [ ] Mobile-specific feature requests in top 5 of feedback

**If 4/5 are true, START Phase 2.**

---

## Appendix A: PWA Implementation Checklist

Quick reference for Phase 0 implementation:

```
[ ] Create public/manifest.json
    - name, short_name, description
    - icons (192px, 512px, maskable)
    - start_url: "/dashboard"
    - display: "standalone"
    - theme_color, background_color
    - screenshots (for richer install UI)

[ ] Create public/sw.js (service worker)
    - Cache shell (HTML, CSS, JS, fonts)
    - Cache API responses (dashboard, threats, brands)
    - Stale-while-revalidate strategy
    - Background sync for queued actions
    - Push notification handler

[ ] Update src/app/layout.tsx
    - <link rel="manifest" href="/manifest.json">
    - <meta name="theme-color">
    - <meta name="apple-mobile-web-app-capable" content="yes">
    - <meta name="apple-mobile-web-app-status-bar-style">
    - <link rel="apple-touch-icon">

[ ] Create PWAInstallPrompt component
    - Detect 'beforeinstallprompt' event
    - Show smart banner after 2nd visit or specific action
    - Track install rate

[ ] Set up Web Push (FCM)
    - Firebase project setup
    - Service worker push handler
    - Permission request UI (primer screen)
    - Device registration endpoint

[ ] Create OfflineIndicator component
    - Detect online/offline status
    - Show "Using cached data" banner when offline
    - Queue actions for when back online

[ ] Test on real devices
    - iPhone Safari (iOS 17+)
    - Android Chrome
    - Samsung Internet
```

---

## Appendix B: React Native Project Bootstrap

Quick start commands for Phase 1:

```bash
# Install Expo CLI
npm install -g expo-cli

# Create project
npx create-expo-app@latest doppeldown-mobile --template tabs

# Navigate
cd doppeldown-mobile

# Install key dependencies
npx expo install expo-notifications expo-local-authentication \
  expo-secure-store expo-image expo-camera expo-haptics \
  expo-sharing expo-file-system expo-background-fetch \
  expo-device expo-web-browser

# Install Supabase client
npm install @supabase/supabase-js

# Install navigation
npm install @react-navigation/native @react-navigation/bottom-tabs

# Install UI libraries
npm install react-native-reanimated react-native-gesture-handler

# Set up EAS
npx eas-cli@latest init
npx eas-cli@latest build:configure

# Start development
npx expo start
```

---

## Appendix C: Competitive Intelligence — Mobile

Ongoing monitoring of competitor mobile moves:

| Competitor | Current Mobile | Watch For |
|------------|---------------|-----------|
| Red Points | None | Any App Store listing |
| BrandShield | None | Mobile mention in marketing |
| Bolster | None | App Store listing |
| ZeroFox | Enterprise MDR app | Feature parity signals |
| Recorded Future | Intelligence app | They're the "mobile bar" for security tools |

**Set Google Alerts for:**
- "[competitor name] mobile app"
- "[competitor name] iOS app"
- "brand protection mobile app"

**First-mover advantage window: estimated 12-18 months** before any SMB-focused competitor launches a comparable mobile app.

---

## Summary: Action Items by Timeframe

### This Week (Phase 0: PWA)
1. [ ] Create `manifest.json` with proper icons and metadata
2. [ ] Implement service worker for offline caching
3. [ ] Add install prompt component
4. [ ] Set up web push notifications via FCM
5. [ ] Test PWA on iOS Safari and Android Chrome

### When MRR = $5K (Phase 1: React Native MVP)
1. [ ] Set up Expo project in monorepo
2. [ ] Extract shared code into `@doppeldown/shared` package
3. [ ] Design and build 4 core screens (Dashboard, Threats, Brands, Settings)
4. [ ] Implement push notification infrastructure
5. [ ] Beta test with existing customers
6. [ ] Submit to App Store and Play Store

### When MRR = $15K (Phase 2: Native Enhancement)
1. [ ] Build home screen widgets
2. [ ] Implement Live Activities (iOS)
3. [ ] Add camera evidence capture
4. [ ] Build Apple Watch complication
5. [ ] Performance audit and optimization

---

*This strategy document is a living resource. Update as the market, product, and metrics evolve. The key principle: invest in mobile proportional to validated demand, not speculation.*

*Next review date: When Phase 0 (PWA) is complete — reassess based on install and engagement metrics.*
