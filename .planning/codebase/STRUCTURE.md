# Codebase Structure

**Analysis Date:** 2026-01-24

## Directory Layout

```
doppeldown/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Landing page (/)
│   │   ├── layout.tsx                # Root layout with metadata
│   │   ├── globals.css               # Global Tailwind styles
│   │   ├── api/                      # API routes
│   │   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── brands/               # Brand CRUD and logo upload
│   │   │   ├── scan/                 # Scan initiation, status, cancellation
│   │   │   ├── scan/social/          # Social media scanning
│   │   │   ├── reports/              # Report generation
│   │   │   ├── cron/scan/            # Scheduled scan job trigger
│   │   │   ├── stripe/               # Stripe checkout, webhooks, portal
│   │   │   └── evidence/sign/        # Evidence file URL signing
│   │   ├── auth/                     # Auth pages (login, signup, password reset)
│   │   ├── dashboard/                # Authenticated dashboard
│   │   │   ├── layout.tsx            # Dashboard sidebar + nav
│   │   │   ├── page.tsx              # Main dashboard (stats, recent threats)
│   │   │   ├── brands/               # Brand list and detail pages
│   │   │   ├── threats/              # Threat list and detail pages
│   │   │   ├── reports/              # Report generation and list
│   │   │   └── settings/             # User settings
│   │   └── pricing/                  # Pricing page
│   ├── components/
│   │   ├── ui/                       # Reusable UI components (card, button, badge, input)
│   │   ├── dashboard/                # Dashboard-specific components
│   │   └── landing/                  # Landing page components
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Supabase client (browser)
│   │   │   └── server.ts             # Supabase server client + service role
│   │   ├── scan-runner.ts            # Main scanning orchestration logic
│   │   ├── domain-generator.ts       # Typosquatting domain variation generation
│   │   ├── web-scanner.ts            # Bing/search-based web threat detection
│   │   ├── social-scanner.ts         # Social media fake account detection
│   │   ├── logo-scanner.ts           # Google Images reverse image search
│   │   ├── evidence-collector.ts     # Screenshot capture, WHOIS, HTML archival
│   │   ├── threat-analysis.ts        # Composite threat scoring
│   │   ├── openai-analysis.ts        # OpenAI Vision integration for visual similarity
│   │   ├── report-generator.ts       # HTML/PDF/CSV takedown report generation
│   │   ├── email.ts                  # Nodemailer email sending
│   │   ├── webhooks.ts               # Threat webhook delivery
│   │   ├── stripe.ts                 # Stripe SDK setup
│   │   └── utils.ts                  # Helper functions (formatting, color mappings, ID generation)
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces (User, Brand, Threat, Evidence, etc.)
│   └── middleware.ts                 # (if auth middleware exists)
├── scripts/
│   └── scan-worker.ts                # Background worker for processing scan jobs
├── supabase/
│   └── migrations/                   # Database schema migrations (if versioned)
├── public/                           # Static assets
├── .planning/
│   ├── codebase/                     # GSD analysis documents
│   └── research/                     # Research notes
├── .env.local                        # Local environment variables (git-ignored)
├── .env.example                      # Template for environment variables
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
└── next.config.ts                    # Next.js configuration
```

## Directory Purposes

**src/app:**
- Purpose: Next.js App Router pages and API routes
- Contains: Page components (.tsx), API handlers (route.ts), nested layouts
- Key files: `page.tsx`, `layout.tsx`, `route.ts`

**src/app/api:**
- Purpose: Backend HTTP endpoints
- Contains: POST/GET handlers for CRUD, scanning, payments, webhooks
- Organization: One directory per feature (brands, scan, reports, stripe)

**src/app/dashboard:**
- Purpose: Authenticated user interface
- Contains: Dashboard pages, brand management, threat viewing, report generation
- Requires: Auth session (redirects to login if missing)

**src/components/ui:**
- Purpose: Reusable design system components
- Contains: Card, Button, Badge, Input (headless, styled with Tailwind)
- Usage: Imported across all pages

**src/lib:**
- Purpose: Business logic and utilities
- Contains: Database client setup, scanning algorithms, analysis, report generation
- Organization: One file per logical module (domain-generator.ts, scan-runner.ts, etc.)

**src/types:**
- Purpose: TypeScript type definitions
- Contains: Interfaces for User, Brand, Threat, ScanResult, Evidence, etc.
- Usage: Imported across frontend and backend

**scripts/:**
- Purpose: Command-line tools and background workers
- Contains: scan-worker.ts (Node.js CLI for processing scan jobs)

## Key File Locations

**Entry Points:**

- `src/app/page.tsx`: Public landing page (marketing site)
- `src/app/auth/login/page.tsx`: Login form
- `src/app/auth/signup/page.tsx`: Sign-up form
- `src/app/dashboard/page.tsx`: Main dashboard (authenticated)
- `src/app/dashboard/layout.tsx`: Dashboard wrapper with sidebar navigation

**Configuration:**

- `package.json`: Dependencies, build/dev/start scripts
- `tsconfig.json`: TypeScript compiler options (strict mode enabled)
- `tailwind.config.ts`: Tailwind CSS customization (primary color, spacing)
- `.env.local`: Secrets (SUPABASE_URL, API_KEYS, etc.)
- `next.config.ts`: Next.js build and runtime config

**Database & Auth:**

- `src/lib/supabase/server.ts`: Server-side Supabase client (with cookie management)
- `src/lib/supabase/client.ts`: Browser-side Supabase client

**Core Logic:**

- `src/lib/scan-runner.ts`: Main scanning orchestration (domain → evidence → analysis → save)
- `src/lib/domain-generator.ts`: Generate typosquatting variations
- `src/lib/evidence-collector.ts`: Capture screenshots, WHOIS, HTML
- `src/lib/threat-analysis.ts`: Build composite threat scores
- `src/lib/report-generator.ts`: Generate PDF/HTML/CSV takedown reports

**API Endpoints:**

- `src/app/api/brands/route.ts`: Brand CRUD (POST create, GET list)
- `src/app/api/scan/route.ts`: Initiate scan (POST) and check status (GET)
- `src/app/api/scan/cancel/route.ts`: Cancel in-progress scan
- `src/app/api/reports/route.ts`: Generate and store reports
- `src/app/api/stripe/webhook/route.ts`: Stripe payment event processing
- `src/app/api/stripe/checkout/route.ts`: Create checkout session

**Utilities:**

- `src/lib/utils.ts`: UI helpers (formatDate, truncateUrl, severityColor, threatTypeLabel)
- `src/types/index.ts`: All TypeScript interfaces

## Naming Conventions

**Files:**

- Pages: `page.tsx` (Next.js convention)
- API routes: `route.ts` (POST/GET/DELETE handlers)
- Utilities: camelCase (scan-runner.ts, domain-generator.ts)
- Components: PascalCase (Card.tsx, Button.tsx)
- Types: `index.ts` or module file

**Directories:**

- Feature-based: `/api/brands`, `/api/scan`, `/api/reports`
- Page routes: `/dashboard/brands`, `/dashboard/threats`
- Dynamic routes: `[id]` folder (e.g., `/dashboard/brands/[id]`)
- Utilities: `/lib` with descriptive module names

**Functions:**

- Async operations: Prefix with async
- Database queries: Start with `get` or `fetch` (e.g., fetchBrands)
- Event handlers: Prefix with `handle` (handleCreateBrand)
- Utility functions: Descriptive names (formatDate, extractDomain)

**TypeScript Types:**

- Interfaces: PascalCase (Brand, Threat, User)
- Union types: camelCase in values (ThreatStatus: 'new' | 'confirmed')
- Enums: Not used; prefer union types

## Where to Add New Code

**New Feature:**

Example: Adding email digest functionality

- **Primary code:**
  - Service: `src/lib/email-digest.ts` (new file for digest logic)
  - API endpoint: `src/app/api/email/digest/route.ts` (new POST handler)
  - Type: Add interface to `src/types/index.ts`

- **Tests:**
  - `src/lib/email-digest.test.ts` (if testing added)

**New Component/Module:**

Example: Adding a new "Compliance" dashboard page

- **Implementation:**
  - Page: `src/app/dashboard/compliance/page.tsx`
  - Layout: `src/app/dashboard/compliance/layout.tsx` (if nested layout needed)
  - Components: `src/components/dashboard/ComplianceWidget.tsx`
  - Type: Add to `src/types/index.ts`

**Utilities:**

- **Shared helpers:** `src/lib/utils.ts` (add function here for UI utilities)
- **Domain-specific:** `src/lib/new-feature.ts` (new file if feature-specific)
- **UI helpers:** `src/components/ui/NewComponent.tsx` (reusable design components)

**API Routes:**

- **New feature endpoints:** `src/app/api/[feature]/route.ts`
- **Nested endpoints:** `src/app/api/[feature]/[action]/route.ts`
- **Example:** `src/app/api/compliance/export/route.ts` for export endpoint

**Database Changes:**

- Supabase migrations stored in `supabase/migrations/` (if schema versioning used)
- Run migrations via Supabase CLI or dashboard

## Special Directories

**src/app/api/auth:**
- Purpose: Authentication endpoints (managed by Supabase, minimal custom code)
- Generated: No (custom auth endpoints if needed)
- Committed: Yes

**src/components/ui:**
- Purpose: Design system components (buttons, cards, badges, inputs)
- Generated: No
- Committed: Yes

**public/:**
- Purpose: Static assets (images, fonts, favicons)
- Generated: No (user uploads go to Supabase storage)
- Committed: Yes

**supabase/:**
- Purpose: Database schema and migrations
- Generated: Partially (migrations auto-created by CLI)
- Committed: Yes

**.next/:**
- Purpose: Next.js build output
- Generated: Yes (during `npm run build`)
- Committed: No (in .gitignore)

**node_modules/:**
- Purpose: npm dependencies
- Generated: Yes (via `npm install`)
- Committed: No (in .gitignore)

---

*Structure analysis: 2026-01-24*
