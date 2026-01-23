# Codebase Structure

**Analysis Date:** 2026-01-23

## Directory Layout

```
src/
├── app/                          # Next.js App Router pages and API routes
│   ├── layout.tsx                # Root layout wrapping all pages
│   ├── page.tsx                  # Landing page (/)
│   ├── globals.css               # Global Tailwind/CSS
│   ├── auth/                     # Authentication pages
│   │   ├── login/page.tsx        # Login form
│   │   └── signup/page.tsx       # Registration form
│   ├── pricing/page.tsx          # Pricing page (/)
│   ├── dashboard/                # Protected dashboard routes
│   │   ├── layout.tsx            # Dashboard wrapper with sidebar navigation
│   │   ├── page.tsx              # Dashboard overview with threat summary
│   │   ├── brands/               # Brand management
│   │   │   ├── page.tsx          # List user's brands
│   │   │   ├── new/page.tsx      # Create new brand form
│   │   │   └── [id]/page.tsx     # Brand detail view with scan controls
│   │   ├── threats/              # Threat management
│   │   │   ├── page.tsx          # List all threats for user's brands
│   │   │   └── [id]/page.tsx     # Threat detail with evidence
│   │   ├── reports/              # Report generation
│   │   │   ├── page.tsx          # List generated reports
│   │   │   └── new/page.tsx      # Report builder (select threats)
│   │   └── settings/page.tsx     # User settings and alert preferences
│   └── api/                      # API route handlers
│       ├── auth/[...auth]/       # Supabase Auth routes (auto-handled by NextAuth or custom)
│       ├── scan/                 # Threat scanning endpoints
│       │   ├── route.ts          # POST initiate scan, GET scan status
│       │   └── social/route.ts   # POST scan social media
│       ├── brands/route.ts       # POST create brand, GET list brands
│       ├── reports/route.ts      # POST generate report, GET list reports
│       ├── stripe/               # Payment processing
│       │   ├── checkout/route.ts # POST create checkout session
│       │   ├── portal/route.ts   # POST customer portal link
│       │   └── webhook/route.ts  # POST receive Stripe events
│       └── cron/                 # Background jobs
│           └── scan/route.ts     # GET run automated scans (called by external scheduler)
│
├── components/                   # Reusable React components
│   ├── ui/                       # Headless UI primitives
│   │   ├── button.tsx            # Button component
│   │   ├── input.tsx             # Text input component
│   │   ├── card.tsx              # Card container component
│   │   └── badge.tsx             # Status/label badge component
│   ├── landing/                  # Landing page components
│   │   └── [feature-specific]    # (Optional: future feature components)
│   └── dashboard/                # Dashboard-specific components
│       └── [feature-specific]    # (Optional: threat list, brand card, etc.)
│
├── lib/                          # Business logic and utilities
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client (SSR-safe)
│   │   └── server.ts             # Server Supabase clients (user + service role)
│   ├── domain-generator.ts       # Generate typosquat domain variations
│   ├── web-scanner.ts            # Search for lookalike websites
│   ├── social-scanner.ts         # Detect fake social accounts
│   ├── evidence-collector.ts     # Capture screenshots and WHOIS data
│   ├── report-generator.ts       # Create PDF takedown reports
│   ├── stripe.ts                 # Stripe SDK setup and helpers
│   ├── email.ts                  # Nodemailer email sending
│   ├── webhooks.ts               # Webhook validation utilities
│   └── utils.ts                  # Formatting, styling utilities (cn, formatDate, etc.)
│
└── types/
    └── index.ts                  # Central TypeScript type definitions

```

## Directory Purposes

**src/app/**
- Purpose: Next.js App Router structure; contains all pages and API routes
- Contains: Page components (.tsx files), API route handlers (.ts files), layouts, CSS
- Key files: `page.tsx` files for each route, `route.ts` for API endpoints, `layout.tsx` for wrappers

**src/app/auth/**
- Purpose: Authentication flows (login/signup)
- Contains: Login and signup page components
- Key files: `src/app/auth/login/page.tsx`, `src/app/auth/signup/page.tsx`

**src/app/dashboard/**
- Purpose: Protected authenticated routes; displays user-specific data
- Contains: Page components for overview, brands, threats, reports, settings
- Key files: Layout wrapper (`layout.tsx`), brand management pages, threat detail pages
- Pattern: All children require Supabase auth check

**src/app/api/**
- Purpose: HTTP endpoints for client-server communication
- Contains: Route handlers (POST/GET) that orchestrate business logic
- Key files: `scan/route.ts` (threat detection), `brands/route.ts` (brand CRUD), `stripe/webhook/route.ts` (payment)
- Pattern: All handlers check authentication first, return JSON responses

**src/components/ui/**
- Purpose: Reusable, style-agnostic UI components
- Contains: Button, Input, Card, Badge components with Tailwind styling
- Pattern: Headless components wrapping HTML elements with cn() utility for class merging

**src/lib/supabase/**
- Purpose: Manage Supabase client initialization and session handling
- Contains: Two client instances (browser-safe and server-only with service role)
- Key files: `client.ts` (uses @supabase/ssr), `server.ts` (service role for background jobs)

**src/lib/**
- Purpose: Core business logic, utilities, and external service integration
- Contains: Domain generation, web scanning, evidence collection, PDF generation
- Key files: `domain-generator.ts` (500+ typosquat variations), `web-scanner.ts` (threat search)

**src/types/**
- Purpose: Centralized TypeScript type definitions
- Contains: User, Brand, Threat, ScanResult, Report, Evidence types
- Key file: `index.ts` (all types exported from single file)

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root layout for entire app
- `src/app/page.tsx`: Landing page (/)
- `src/app/dashboard/layout.tsx`: Protected dashboard wrapper with sidebar

**Authentication:**
- `src/app/auth/login/page.tsx`: Login page
- `src/app/auth/signup/page.tsx`: Registration page

**Configuration:**
- `tsconfig.json`: TypeScript config with path alias `@/*` pointing to `src/*`
- `package.json`: Dependencies (Next.js, React, Supabase, Stripe, Puppeteer, etc.)
- `next.config.js`: (if exists) Next.js build configuration

**Core Logic:**
- `src/lib/domain-generator.ts`: Domain variation generation algorithm
- `src/lib/web-scanner.ts`: Web threat detection (DuckDuckGo search)
- `src/lib/supabase/server.ts`: Server-side Supabase auth and queries

**Testing:**
- No test files found in codebase (no Jest/Vitest config detected)

## Naming Conventions

**Files:**
- `page.tsx`: Route pages (matches directory name)
- `route.ts`: API route handlers (for api/* directories)
- `layout.tsx`: Layout wrappers for route segments
- `[id].tsx`: Dynamic route segments
- `[...slug].tsx`: Catch-all routes
- Component files: `ComponentName.tsx` (PascalCase)
- Utility files: `kebab-case.ts` or `camelCase.ts` (see domain-generator, web-scanner, social-scanner)

**Directories:**
- Feature directories: lowercase (e.g., `brands`, `threats`, `dashboard`)
- Dynamic segments: `[param]` in square brackets
- Catch-all segments: `[...slug]` for nested catch-alls
- API route groups: organized under `api/` with feature subdirs (e.g., `api/stripe/`, `api/scan/`)

**React Components:**
- PascalCase filenames matching export name
- Client components: prefixed with `'use client'` directive
- Props interfaces: `Props` suffix (e.g., `ButtonProps`)
- Event handlers: `handle{Action}` pattern (e.g., `handleSignOut`)

**Types:**
- Exported from `src/types/index.ts`
- PascalCase with descriptive suffixes: `User`, `Brand`, `Threat`, `ScanResult`
- Discriminated unions: `ThreatType`, `ThreatStatus`, `ThreatSeverity`
- Interfaces for complex objects: `WhoisData`, `Evidence`, `ScreenshotEvidence`

**Functions:**
- camelCase naming
- Pure utility functions: `formatDate`, `extractDomain`, `severityColor`
- Async functions: `async function scanForThreats()`, `async function checkDomainRegistration()`
- Factory/generator functions: `generateDomainVariations`, `generateSearchQueries`

## Where to Add New Code

**New Feature:**
- Primary code: `src/lib/{feature-name}.ts` for business logic
- API endpoint: `src/app/api/{feature}/route.ts` for HTTP handler
- Page/UI: `src/app/dashboard/{feature}/page.tsx` for user interface
- Tests: (none configured) would go in `src/__tests__/{feature}.test.ts`

**New Component/Module:**
- Reusable UI: `src/components/{category}/{ComponentName}.tsx`
- Dashboard specific: `src/components/dashboard/{ComponentName}.tsx`
- Page-level: inline in `src/app/{route}/page.tsx`

**New Type Definition:**
- Add to `src/types/index.ts` (single source of truth for all types)

**Utilities:**
- Formatting/styling helpers: `src/lib/utils.ts`
- External service integration: `src/lib/{service-name}.ts` (see stripe.ts, email.ts)
- Supabase helpers: `src/lib/supabase/{layer-name}.ts`

**Database Queries:**
- All done via Supabase client (no separate data layer file)
- Imported from `src/lib/supabase/client.ts` or `server.ts`
- Queries inline in API routes or utility functions

## Special Directories

**src/app/api/cron/**
- Purpose: Background jobs and scheduled tasks
- Generated: No (manually created)
- Committed: Yes
- Usage: External scheduler (e.g., Vercel Cron) POSTs to `/api/cron/scan` to trigger automated brand scans
- Pattern: Route handler receives request, spawns background `runScan()` process

**src/app/api/stripe/**
- Purpose: Stripe payment processing and webhook handling
- Generated: No
- Committed: Yes
- Files:
  - `checkout/route.ts`: Creates Stripe checkout session
  - `webhook/route.ts`: Handles Stripe events (subscription updates, payment failures)
  - `portal/route.ts`: Links to Stripe customer portal
- Pattern: Webhook handler verifies signature, switches on event type, updates user subscription in Supabase

**src/components/ui/**
- Purpose: Reusable headless UI components
- Generated: No
- Committed: Yes
- Pattern: Tailwind-based components with `cn()` utility for class merging
- Future additions: would follow same pattern

**.next/**
- Purpose: Build output directory
- Generated: Yes (by `npm run build`)
- Committed: No (should be in .gitignore)

**supabase/**
- Purpose: Supabase configuration and migrations (if present)
- Generated: Partially (migrations auto-generated)
- Committed: Yes
- Note: Directory exists but not fully explored in this analysis

---

*Structure analysis: 2026-01-23*
