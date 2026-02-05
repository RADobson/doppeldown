---
title: "New Engineer Onboarding"
description: "Everything a new engineer needs to get productive with DoppelDown"
category: onboarding
audience: internal
last_updated: 2026-02-05
author: ernie
review_due: 2026-05-05
status: current
---

# New Engineer Onboarding

Welcome to DoppelDown! This guide gets you from zero to productive.

**Expected time:** 2-4 hours

---

## Day 1: Environment Setup

### 1. Access & Accounts

- [ ] GitHub access to `RADobson/doppeldown` repository
- [ ] Supabase project access (`jbbxjpzdlndzqefzucwb`)
- [ ] Vercel team access (`richards-projects-1a0af3cb`)
- [ ] Stripe dashboard access (test mode)
- [ ] Communication channels (Discord/Slack)

### 2. Clone & Install

```bash
git clone git@github.com:RADobson/doppeldown.git
cd doppeldown
npm install
```

### 3. Environment Setup

```bash
# Copy the example env file
cp .env.example .env.local

# Ask a team member for the values, or run the setup wizard:
npm run setup
```

Key env vars you'll need:
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from Supabase dashboard)
- `SUPABASE_SERVICE_ROLE_KEY` (from Supabase dashboard → Settings → API)
- `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (use test mode keys)
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`

### 4. Run the App

```bash
npm run dev
```

Open http://localhost:3000. You should see the DoppelDown landing page.

### 5. Run Tests

```bash
# Unit tests
npm test

# E2E tests (requires Chromium)
npm run test:e2e
```

---

## Day 1: Understand the Architecture

### Read These (in order)

1. **[README.md](../../README.md)** — Project overview, features, tech stack (10 min)
2. **[Architecture](../engineering/architecture.md)** — System layers and data flow (15 min)
3. **[API Reference](../../docs/API.md)** — All endpoints (skim, 15 min)
4. **[Codebase Guide](../engineering/codebase-guide.md)** — File structure walkthrough (15 min)

### Tech Stack Summary

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14, React 18, Tailwind CSS | SSR, App Router, rapid UI dev |
| API | Next.js API Routes | Co-located with frontend |
| Database | Supabase (PostgreSQL) | Auth, RLS, real-time, storage |
| Payments | Stripe | Subscription billing |
| Deployment | Vercel | Zero-config Next.js hosting |
| Worker | Node.js + Puppeteer (PM2 on VPS) | Background scanning with browser |
| AI | OpenAI (GPT-4o-mini) | Visual similarity analysis |

### Key Directories

```
src/
├── app/           # Pages and API routes (Next.js App Router)
│   ├── api/       # Backend endpoints
│   ├── dashboard/ # Authenticated user pages
│   └── auth/      # Login, signup, password reset
├── components/    # React components
├── lib/           # Core business logic (scanning, analysis, etc.)
└── types/         # TypeScript type definitions
```

### Core Business Logic (in `src/lib/`)

| File | Purpose |
|------|---------|
| `domain-generator.ts` | Generates 500+ typosquat domain variations |
| `web-scanner.ts` | Searches web for phishing pages |
| `social-scanner.ts` | Checks social platforms for fake accounts |
| `evidence-collector.ts` | Screenshots, WHOIS, HTML archival |
| `openai-analysis.ts` | AI visual similarity scoring |
| `report-generator.ts` | Takedown report generation |
| `scan-runner.ts` | Orchestrates full scan workflow |
| `stripe.ts` | Stripe SDK and billing logic |
| `tier-limits.ts` | Plan-based feature gating |

---

## Day 2: Make Your First Change

### Suggested First Tasks

Pick one of these to get familiar with the codebase:

1. **Fix a typo in docs** — Easiest possible PR to test the workflow
2. **Add a test** — Write a unit test for any function in `src/lib/`
3. **UI improvement** — Tweak a Tailwind class on any dashboard component
4. **Add an API parameter** — Add an optional query param to an existing endpoint

### PR Process

1. Create a branch: `git checkout -b feat/your-feature`
2. Make your changes
3. Run tests: `npm test`
4. Run lint: `npm run lint`
5. Commit with a clear message
6. Push and open a PR against `main`
7. Fill out the PR checklist (including documentation checkbox)

### Commit Message Convention

```
type(scope): short description

feat(api): add brand logo upload endpoint
fix(scanner): handle timeout in domain resolution
docs(api): add webhook payload examples
chore(deps): update stripe to v17.5
```

---

## Week 1: Deep Dives

### Understand the Scan Pipeline

```
Brand Created → Scan Triggered → Domain Generator → Web Scanner → Social Scanner
                                       ↓                ↓              ↓
                                  DNS Resolution    Page Fetch    Profile Search
                                       ↓                ↓              ↓
                                  Threat Created   AI Analysis   Match Scoring
                                       ↓                ↓              ↓
                                  Evidence ← ← ← ← ← ← ← ← ← ← ← ←
                                       ↓
                                  Notification → Email / Webhook
```

### Read the Strategy Docs

- [Product Roadmap](../product/roadmap.md) — Where we're headed
- [Pricing Strategy](../product/pricing.md) — Why tiers are structured this way
- [Competitive Tracker](../product/competitive-tracker.md) — Who we compete with

---

## Useful Commands

```bash
npm run dev              # Start development server
npm test                 # Run unit tests
npm run test:e2e         # Run E2E tests
npm run lint             # ESLint
npm run build            # Production build
npm run setup            # Interactive setup wizard
npm run validate:env     # Check env vars
npm run verify:deploy    # Verify deployment health
```

---

## Questions?

- **Architecture questions:** Read the ADRs in `internal/engineering/adr/`
- **Product questions:** Check the roadmap or ask in the product channel
- **Stuck on something:** Ask in the engineering channel — no question is too basic

---

## See Also

- [Code Conventions](../engineering/conventions.md)
- [Testing Guide](../engineering/testing.md)
- [CI/CD Pipeline](../engineering/ci-cd.md)
- [Monitoring](../engineering/monitoring.md)
