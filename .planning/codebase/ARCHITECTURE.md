# Architecture

**Analysis Date:** 2026-01-23

## Pattern Overview

**Overall:** Full-stack Next.js application with server-client architecture following Next.js App Router patterns. The system implements a layered architecture with clear separation between presentation (React components), API layer (Next.js route handlers), business logic (utility libraries), and data access (Supabase).

**Key Characteristics:**
- Server-Side Rendering with client-side interactivity via 'use client' directives
- API routes as middlemen between frontend and external services
- Service layer architecture for threat detection, domain generation, and evidence collection
- Database-driven with Supabase as primary data store
- Subscription-based business logic with Stripe integration
- Background scanning operations triggered via API endpoints

## Layers

**Presentation Layer:**
- Purpose: User interface components and pages for landing, authentication, and dashboard
- Location: `src/app/` (page routes) and `src/components/` (reusable components)
- Contains: React pages, layouts, UI components (button, card, badge, input)
- Depends on: Supabase client, utilities for formatting and styling
- Used by: End users and authenticated dashboard users

**API/Route Handler Layer:**
- Purpose: Endpoints for handling HTTP requests, authentication, and orchestrating business logic
- Location: `src/app/api/`
- Contains: POST/GET handlers that coordinate scanning, data persistence, Stripe webhooks
- Key routes:
  - `api/brands/route.ts`: Brand CRUD operations with subscription limits
  - `api/scan/route.ts`: Initiates background threat scanning
  - `api/scan/social/route.ts`: Social media threat detection
  - `api/reports/route.ts`: Report generation and retrieval
  - `api/stripe/*`: Payment processing and webhook handling
  - `api/cron/scan/route.ts`: Scheduled background scanning
- Depends on: Supabase (client + service), scanning libraries, stripe
- Error Handling: Returns standardized JSON responses with status codes (400, 401, 403, 404, 500)

**Business Logic Layer:**
- Purpose: Core domain logic for threat detection, domain variation generation, evidence collection
- Location: `src/lib/`
- Key Modules:
  - `domain-generator.ts`: Generates 500+ domain variations (typos, homoglyphs, TLD swaps, bitsquats)
  - `web-scanner.ts`: Searches for lookalike websites and phishing pages using DuckDuckGo
  - `social-scanner.ts`: Detects fake social media accounts
  - `evidence-collector.ts`: Captures screenshots, WHOIS data, HTML snapshots
  - `report-generator.ts`: Creates takedown request and evidence package PDFs
  - `stripe.ts`: Stripe SDK initialization and plan mapping
  - `email.ts`: Nodemailer integration for sending alerts and reports
  - `webhooks.ts`: Webhook signature validation
- Depends on: External APIs (DuckDuckGo, Puppeteer for screenshots, WHOIS lookups)

**Data Access Layer:**
- Purpose: Database communication and Supabase client management
- Location: `src/lib/supabase/`
- Contains:
  - `client.ts`: Browser-based Supabase client with SSR support
  - `server.ts`: Server-side Supabase clients (user and service role)
- Abstracts: Supabase authentication, cookie management, cookie-based session handling
- Depends on: @supabase/ssr, @supabase/supabase-js

**Type System:**
- Purpose: Central TypeScript type definitions for all domain models
- Location: `src/types/index.ts`
- Contains: User, Brand, Threat, ScanResult, Report, DomainVariation, AlertSettings, SubscriptionPlan
- Used throughout: All layers reference these types for type safety

**UI Component Library:**
- Purpose: Reusable UI components
- Location: `src/components/ui/`
- Contains: Tailwind-based components (Button, Input, Card, Badge)
- Pattern: Headless components with Tailwind styling

## Data Flow

**Brand Creation Flow:**

1. User submits form in `src/app/dashboard/brands/new/page.tsx` (client component)
2. POST request to `api/brands/route.ts`
3. Route handler authenticates user via Supabase, checks subscription tier against brand limit
4. Brand record inserted into `brands` table with user_id, metadata
5. Service returns brand object to client
6. Client redirects to brand detail page

**Threat Scanning Flow:**

1. User initiates scan from `src/app/dashboard/brands/[id]/page.tsx` (client)
2. POST to `api/scan/route.ts` with brandId and scanType
3. Route handler:
   - Authenticates user
   - Fetches brand details
   - Creates scan record with `status: 'running'`
   - **Returns immediately** (returns scanId)
   - Spawns background `runScan()` function asynchronously (fire and forget)
4. Client polls or fetches scan status via GET `api/scan?id={scanId}`
5. Background `runScan()` function executes based on scan mode:
   - **Domain-only mode**: Generates variations → checks registration → collects evidence
   - **Web mode**: Searches for lookalike pages using DuckDuckGo API
   - **Social mode**: Scans social platforms for fake accounts
   - **Full mode**: All three above with up to 100 domain variations
6. For each detected threat:
   - Evidence collected (screenshots via Puppeteer, WHOIS data, HTML)
   - Threat records inserted into `threats` table
7. Scan record updated with `status: 'completed'`, threat counts, timestamps
8. Brand's threat_count aggregated and last_scan_at updated

**Report Generation Flow:**

1. User selects threats and initiates report generation from `dashboard/reports/new`
2. POST to `api/reports/route.ts`
3. Route handler creates report record with `status: 'generating'`
4. Report generator library:
   - Fetches threat details from database
   - Uses jspdf + html2canvas to render professional PDF
   - Stores PDF in accessible location (storage_path)
   - Updates report status to `'ready'`
5. Client can download or email report

**Subscription/Payment Flow:**

1. User selects pricing tier on landing page
2. Initiates checkout → POST `api/stripe/checkout/route.ts`
3. Route creates Stripe checkout session, redirects to Stripe
4. User completes payment
5. Stripe sends webhook to `api/stripe/webhook/route.ts`
6. Webhook handler verifies signature, processes event:
   - `checkout.session.completed`: Updates user subscription_status to 'active', sets subscription_tier and subscription_id
   - `customer.subscription.updated`: Syncs subscription status changes
   - `customer.subscription.deleted`: Sets subscription to 'cancelled'
   - `invoice.payment_failed`: Sets subscription_status to 'past_due'
7. User can now access dashboard with subscription features

**State Management:**

- **Server State**: Supabase handles all persistent data (users, brands, threats, scans, reports)
- **Session State**: Supabase Auth (via cookies) manages user authentication
- **Client State**: React component state for UI interactions (sidebar open/close, form inputs)
- **Background Jobs**: runScan() spawned as background process, no explicit job queue (suitable for small-medium scale)

## Key Abstractions

**Threat Type System:**
- Purpose: Categorizes detected threats
- Examples: `typosquat_domain`, `lookalike_website`, `phishing_page`, `fake_social_account`, `brand_impersonation`
- Pattern: Discriminated union via TypeScript type literals

**Threat Severity System:**
- Purpose: Prioritizes remediation
- Values: `'critical'` → `'high'` → `'medium'` → `'low'`
- Logic: Assessed in `domain-generator.ts` based on variation type (homoglyphs are critical, TLD swaps are low)

**Threat Status Workflow:**
- Purpose: Tracks lifecycle of each threat
- States: `new` → `investigating` → `confirmed` → `takedown_requested` → `resolved` | `false_positive`
- Pattern: State machine managed by frontend and backend

**Domain Variation Generation:**
- Purpose: Create candidate domains to check for brand abuse
- Algorithm: Generates 500+ variations including:
  - Typos: missing letter, double letter, added letter
  - Homoglyphs: visually similar Unicode characters
  - Keyboard proximity: adjacent key typos
  - TLD swaps: alternative top-level domains
  - Bitsquats: single bit flips in ASCII
  - Vowel swaps and hyphens
- Module: `src/lib/domain-generator.ts`

**Evidence Collection:**
- Purpose: Gather proof for legal takedown requests
- Types of evidence:
  - Screenshots: rendered via Puppeteer-core
  - WHOIS snapshots: domain registration data
  - HTML snapshots: page content archival
  - Timestamps: proof of existence
- Storage: Embedded in threat records, may reference external storage paths

**Scan Modes:**
- Purpose: Allow users to choose scanning scope/depth
- Types:
  - `full`: domains + web + social (100 variations, all platforms)
  - `quick`: domains + web (25 variations)
  - `domain_only`: 100 domain variations
  - `web_only`: lookalike website search
  - `social_only`: all social platforms
  - `automated`: cron-triggered full scan

## Entry Points

**Landing Page:**
- Location: `src/app/page.tsx`
- Triggers: User visits root URL
- Responsibilities: Marketing content, navigation to auth pages, pricing display

**Authentication:**
- Location: `src/app/auth/login/page.tsx`, `src/app/auth/signup/page.tsx`
- Triggers: User clicks login/signup from landing or navigation
- Responsibilities: Supabase Auth form submission, redirect to dashboard on success

**Dashboard:**
- Location: `src/app/dashboard/layout.tsx` (wrapper), `src/app/dashboard/page.tsx` (overview)
- Triggers: Authenticated user navigates to /dashboard
- Responsibilities: Protected layout with navigation sidebar, displays user's brands and recent threats

**API Endpoints:**
- `POST /api/scan`: Initiates threat scanning (requires auth)
- `GET /api/scan?id={scanId}`: Fetches scan status and results
- `POST /api/brands`: Creates new brand to monitor
- `GET /api/brands`: Fetches user's brands
- `POST /api/reports`: Generates takedown report PDF
- `GET /api/reports`: Fetches user's reports
- `POST /api/stripe/checkout`: Initiates Stripe payment
- `POST /api/stripe/webhook`: Handles Stripe events
- `GET /api/cron/scan`: Scheduled background scan (typically called by external scheduler)

## Error Handling

**Strategy:** Consistent JSON error responses with HTTP status codes and error messages.

**Patterns:**

- **Authentication errors (401)**: Missing or invalid Supabase session
  - Example: `{ error: 'Unauthorized' }`

- **Authorization errors (403)**: User lacks permission or hits subscription limits
  - Example: `{ error: 'Brand limit reached. Your free plan allows 1 brand...', code: 'BRAND_LIMIT_REACHED' }`

- **Validation errors (400)**: Missing required fields or invalid input
  - Example: `{ error: 'Brand ID is required' }`

- **Not found errors (404)**: Resource doesn't exist or belongs to different user
  - Example: `{ error: 'Brand not found' }`

- **Server errors (500)**: Unhandled exceptions in route handlers or business logic
  - Example: `{ error: 'Failed to start scan' }`
  - All 500 errors logged to console for debugging

- **Background job errors**: Caught in `runScan()`, scan record updated with status='failed' and error message, user never sees exception

## Cross-Cutting Concerns

**Logging:**
- Approach: Console.error/console.log in route handlers and business logic
- Pattern: Log errors at decision points and before external API calls
- Notable logs: domain check errors, scan completion, webhook processing

**Validation:**
- API routes: Manual validation of request bodies (e.g., checking brandId, domain name format)
- Database: Supabase handles schema validation (required fields, types)
- Front-end: Form validation in signup/login pages

**Authentication:**
- Approach: Supabase Auth with email/password, stored in browser cookies
- Pattern: All API routes call `supabase.auth.getUser()` to get authenticated user
- Session: Managed by @supabase/ssr middleware (cookies in server routes, localStorage in client)

**Authorization:**
- Pattern: Resource checks after auth (e.g., verify brand.user_id === user.id)
- Subscription: Brand limits enforced in POST `/api/brands` based on subscription_tier
- Ownership: Queries filtered by user_id to prevent cross-user data access

---

*Architecture analysis: 2026-01-23*
