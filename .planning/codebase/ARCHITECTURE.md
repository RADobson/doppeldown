# Architecture

**Analysis Date:** 2026-01-24

## Pattern Overview

**Overall:** Next.js 14 full-stack application with layered separation between frontend (React Client/Server Components), API routes, and business logic services.

**Key Characteristics:**
- App Router-based with Server Components as default
- API routes handle auth, brand management, scanning, and payment processing
- Business logic separated into `/lib` utility modules
- Supabase for database, auth, and file storage
- Real-time scanning with progress tracking and cancellation support

## Layers

**Presentation Layer:**
- Purpose: Render UI and handle user interactions
- Location: `src/app/` (pages, layouts) and `src/components/` (reusable components)
- Contains: React Client/Server Components, page layouts, form handling
- Depends on: API routes, Supabase client, utility functions
- Used by: Browser client

**API Layer:**
- Purpose: Handle HTTP requests, auth checks, data validation, and orchestration
- Location: `src/app/api/`
- Contains: Route handlers (POST/GET) for brands, scans, reports, payments, auth, webhooks
- Depends on: Supabase, business logic services, utility modules
- Used by: Frontend components and external systems (Stripe webhooks, cron jobs)

**Business Logic Layer:**
- Purpose: Core scanning, analysis, and data processing
- Location: `src/lib/`
- Contains: Domain generation, threat analysis, evidence collection, report generation, email/webhooks
- Depends on: Types, utilities, external APIs (OpenAI, Puppeteer, Bing, Google Images)
- Used by: API routes, scan worker

**Data Layer:**
- Purpose: Database and state management
- Location: Supabase (PostgreSQL database)
- Contains: Users, brands, threats, scans, reports, evidence storage
- Depends on: Supabase SDK
- Used by: All API routes and client-side fetches

**Worker/Background Process:**
- Purpose: Execute long-running scans asynchronously
- Location: `scripts/scan-worker.ts`
- Contains: Scan job processor
- Depends on: Business logic services, Supabase
- Used by: Cron jobs and direct invocation

## Data Flow

**User Registration & Auth:**

1. User signs up via `src/app/auth/signup/page.tsx`
2. Form POST to `/api/auth/` routes (Supabase handles auth)
3. User record created in `auth.users` table
4. Supabase session stored in cookies via `src/lib/supabase/server.ts`

**Brand Creation:**

1. User submits brand form in `src/app/dashboard/brands/new/page.tsx`
2. POST to `src/app/api/brands/route.ts`
3. Route validates user auth, creates `brands` table record
4. Logo uploaded via `src/app/api/brands/logo/route.ts` to Supabase storage
5. Returns brand object to frontend

**Scan Initiation:**

1. User clicks "Run Scan" on `src/app/dashboard/brands/[id]/page.tsx`
2. POST to `src/app/api/scan/route.ts` with brandId and scanType
3. Route creates `scans` record and `scan_jobs` record with 'queued' status
4. Returns scanId to frontend
5. Frontend polls `GET /api/scan?id=scanId` for status updates

**Scan Execution:**

1. Worker/cron fetches queued jobs from `scan_jobs` table
2. Calls `src/lib/scan-runner.ts::runScanForBrand()` with brand and scan config
3. Scan process (based on scanType):
   - Domain variations generation via `src/lib/domain-generator.ts`
   - Domain registration checks and threat assessment
   - Evidence collection via `src/lib/evidence-collector.ts` (screenshots, WHOIS, HTML)
   - Web threat scanning via `src/lib/web-scanner.ts`
   - Logo usage search via `src/lib/logo-scanner.ts`
   - Social media account scanning via `src/lib/social-scanner.ts`
4. Threat analysis via `src/lib/threat-analysis.ts` (domain risk + visual similarity + phishing intent)
5. Threats inserted to `threats` table
6. Scan marked 'completed', brand updated with threat count
7. Alerts sent via `src/lib/email.ts` and `src/lib/webhooks.ts`

**Report Generation:**

1. User selects threats and requests report via `src/app/dashboard/reports/new/page.tsx`
2. POST to `src/app/api/reports/route.ts`
3. Route calls `src/lib/report-generator.ts` to generate HTML/PDF/CSV
4. Report file uploaded to Supabase storage
5. Report record created in `reports` table
6. Returns PDF URL to frontend

**Payment Processing:**

1. User selects plan on pricing page, clicks "Start Free Trial" or upgrade
2. Redirects to `src/app/api/stripe/checkout/route.ts`
3. Creates Stripe checkout session, stores plan selection in metadata
4. User completes payment in Stripe-hosted checkout
5. Stripe webhooks POST to `src/app/api/stripe/webhook/route.ts`
6. Webhook updates user's `subscription_status` and `subscription_tier`

**State Management:**

- **Client-side:** React hooks (useState, useEffect) for UI state; Supabase client for reactive queries
- **Server-side:** Supabase as source of truth; no global state library
- **Real-time updates:** Frontend polling for scan progress (not subscriptions)
- **Persistent data:** All user data in Supabase PostgreSQL

## Key Abstractions

**ScanRunner:**
- Purpose: Orchestrate multi-phase threat scanning process
- Examples: `src/lib/scan-runner.ts`
- Pattern: Async function that coordinates domain generation, web scanning, social scanning, evidence collection, and threat analysis; includes progress updates and cancellation support

**EvidenceCollector:**
- Purpose: Capture and store evidence for threats (screenshots, WHOIS, HTML)
- Examples: `src/lib/evidence-collector.ts`
- Pattern: Functions that use Puppeteer for screenshots, whois-json for domain data, fetch HTML snapshots, store artifacts in Supabase storage

**ThreatAnalysis:**
- Purpose: Build composite threat severity using multiple ML/heuristic signals
- Examples: `src/lib/threat-analysis.ts`
- Pattern: Combines domain risk scoring (registration patterns), visual similarity (OpenAI Vision optional), and phishing intent detection

**ReportGenerator:**
- Purpose: Generate takedown reports in multiple formats (HTML, PDF, CSV)
- Examples: `src/lib/report-generator.ts`
- Pattern: Functions that build structured threat data and render to HTML templates, converted to PDF via jspdf/html2canvas

**DomainGenerator:**
- Purpose: Generate typosquatting domain variations
- Examples: `src/lib/domain-generator.ts`
- Pattern: Algorithmic generation of 10+ variation types (homoglyph, keyboard proximity, TLD swap, etc.); seed-based expansion from brand name

## Entry Points

**Web Application:**
- Location: `src/app/layout.tsx` (root layout) → `src/app/page.tsx` (landing) / `src/app/dashboard/layout.tsx` (authenticated)
- Triggers: Browser navigation
- Responsibilities: Render UI, handle auth state, manage client-side navigation

**API Endpoints:**
- Location: `src/app/api/**/route.ts`
- Triggers: HTTP requests from client or external systems
- Responsibilities: Auth verification, request validation, orchestration of business logic, response serialization

**Scan Worker:**
- Location: `scripts/scan-worker.ts`
- Triggers: Node.js CLI invocation or cron job
- Responsibilities: Fetch scan jobs, execute runScanForBrand, handle errors, mark jobs as complete

**Webhooks:**
- Location: `src/app/api/stripe/webhook/route.ts`
- Triggers: Stripe POST requests
- Responsibilities: Verify webhook signature, process payment events, update user subscription

## Error Handling

**Strategy:** Try-catch blocks at API route level; errors logged to console; user-friendly error messages returned as JSON responses

**Patterns:**

- **API Routes:** Wrap business logic in try-catch; return 400/401/404/500 with error message
  ```typescript
  try {
    const result = await businessLogic()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
  ```

- **Auth Errors:** Check `supabase.auth.getUser()` result; return 401 if missing
  ```typescript
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  ```

- **Database Errors:** Catch errors from insert/update/select operations; provide context
  ```typescript
  const { data, error } = await supabase.from('table').select()
  if (error) throw error
  ```

- **Scan Failures:** Mark scan as 'failed' with error message; update UI via polling

## Cross-Cutting Concerns

**Logging:** console.error(), console.warn(), console.log() for debugging; includes context in messages (brandId, scanId, userId)

**Validation:**
- Input validation at API routes (required fields, type checks)
- Scan type validation via ALLOWED_SCAN_TYPES whitelist
- Email format validation via regex

**Authentication:**
- Supabase auth session validated on every API request
- User ID cross-checked with resource ownership (e.g., brand.user_id must match authenticated user)
- Service role key used for sensitive operations (email sending, webhook verification)

**Authorization:**
- Row-level access enforced via joins: `eq('brands.user_id', user.id)`
- Subscription tier checked for feature access (e.g., Enterprise for webhooks)

**Rate Limiting:** Not implemented; relies on Supabase and Stripe rate limits

---

*Architecture analysis: 2026-01-24*
