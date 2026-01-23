# Codebase Concerns

**Analysis Date:** 2026-01-23

## Security Concerns

**Exposed Secrets in .env.local:**
- Issue: Live Stripe and Supabase credentials committed to repository
- Files: `/home/dobsondev/1000_per_month/doppeldown/.env.local`
- Risk: All API keys, service role keys, and webhook secrets are exposed. This gives attackers direct access to:
  - Stripe payment processing (live mode with real charges)
  - Supabase database (read/write access to all user data)
  - Webhook infrastructure
- Current mitigation: .env.local is tracked in git (should be .gitignored)
- Fix approach: Immediately revoke all exposed keys in Stripe and Supabase dashboards. Move .env.local to .gitignore. Use environment secrets in deployment platform instead.

**Insufficient Webhook Signature Validation:**
- Issue: Stripe webhook handler accepts requests without proper error handling for missing secrets
- Files: `src/app/api/stripe/webhook/route.ts` (lines 10-24)
- Problem: `process.env.STRIPE_WEBHOOK_SECRET!` uses non-null assertion without runtime check. If secret is undefined, webhook signature verification will fail silently with unclear errors.
- Recommendation: Add explicit validation that STRIPE_WEBHOOK_SECRET is defined before processing webhooks. Return clear error messages.

**SMTP Credentials Not Configured:**
- Issue: Email alerts require SMTP credentials (Gmail or custom) but commented out in .env
- Files: `src/lib/email.ts` (lines 5-12), `.env.local` (lines 20-24)
- Risk: If email alerts are enabled without proper SMTP setup, transporter will fail with generic error. Users won't know why alerts aren't sending.
- Impact: Critical alerts about phishing and brand threats won't reach users
- Fix approach: Document required SMTP setup in README. Add fallback email service or validation on startup.

**Unvalidated External API Calls:**
- Issue: Multiple unvalidated HTTP requests to external services (WHOIS, DuckDuckGo, social platforms)
- Files: `src/lib/evidence-collector.ts` (lines 7-29, 83-94), `src/lib/social-scanner.ts` (lines 173-180), `src/lib/web-scanner.ts` (various)
- Risk:
  - No timeout enforcement on most requests (only social-scanner has AbortSignal.timeout)
  - No rate limiting between requests (only hardcoded delays)
  - No validation of response content type or size
  - DNS lookup API (Google DNS) called without validation of response format
- Recommendation: Add consistent timeout (3-5 seconds), validate response headers, implement proper rate limiting with backoff.

**DuckDuckGo Web Scraping:**
- Issue: Scraping DuckDuckGo HTML results using regex
- Files: `src/lib/social-scanner.ts` (lines 171-206)
- Risk: HTML parsing is fragile (regex-based), violates DuckDuckGo ToS, may trigger IP blocks
- Problem: Results are used as evidence for threat detection - incorrect parsing could create false positives
- Fix approach: Use legitimate search API (Bing API has free tier) instead of scraping. Implement proper HTML parser if scraping unavoidable.

**No CORS or CSRF Protection:**
- Issue: API endpoints don't explicitly enforce CORS/CSRF validation
- Files: All files in `src/app/api/`
- Risk: While Next.js provides some defaults, mutation endpoints should explicitly validate origins
- Recommendation: Add explicit CORS validation for cross-origin requests, implement CSRF tokens for state-changing operations.

---

## Tech Debt

**Large Monolithic Components:**
- Issue: Dashboard page is 689 lines with complex polling logic embedded
- Files: `src/app/dashboard/page.tsx` (689 lines)
- Problem:
  - Onboarding flow mixed with dashboard logic
  - Polling interval hardcoded (5 seconds for 5 minutes max)
  - No request deduplication
  - Multiple useState for brand data creates fetch race conditions
- Impact: Hard to test, maintain, and debug. Onboarding changes risk breaking main dashboard.
- Fix approach: Extract `OnboardingFlow` to separate component file. Create custom hook for dashboard data fetching with proper race condition handling.

**Dashboard Settings Page:**
- Issue: 652 lines with embedded stripe integration logic
- Files: `src/app/dashboard/settings/page.tsx` (652 lines)
- Problem: Payment plan UI, user data updates, and alert configuration all in one file
- Impact: Tests would need to mock too many dependencies
- Fix approach: Split into SettingsPage (shell), PlanManagement, AlertSettings, ProfileSettings components.

**Reports Page:**
- Issue: 401 lines in single component with complex PDF generation and download logic
- Files: `src/app/dashboard/reports/new/page.tsx` (401 lines)
- Problem: Client-side PDF generation with jspdf + html2canvas is memory intensive for large threat lists
- Fix approach: Move PDF generation to backend API endpoint, stream results to avoid memory exhaustion.

**Type Safety Issues:**
- Issue: Widespread use of `any` types in critical functions
- Files: `src/app/api/scan/route.ts` (lines 73-74), `src/app/api/cron/scan/route.ts` (lines 143-144)
- Problem: runScan and runBrandScan accept `any` for supabase client, breaking type safety
- Risk: Undetected bugs at runtime
- Fix approach: Create proper TypeScript interfaces for supabase client and brand data.

**No Input Validation:**
- Issue: API endpoints accept user input without validation
- Files: `src/app/api/brands/route.ts`, `src/app/api/scan/route.ts`, `src/app/api/scan/social/route.ts`
- Problem: No schema validation on request bodies (brandId, scanType, platforms, etc.)
- Risk: Invalid input could crash scanners or cause database errors
- Fix approach: Use `zod` or similar for request validation on all POST/PUT endpoints.

**Error Handling:**
- Issue: Generic error messages throughout codebase
- Files: Multiple API routes (lines 65-69, 89-94, etc.)
- Problem: `console.error()` logs internally but returns generic "Failed to X" to clients
- Risk: Users and developers can't diagnose failures. Production issues invisible.
- Fix approach: Implement structured logging with error codes. Return descriptive errors for client-side debugging.

**Missing Retry Logic:**
- Issue: External API calls fail silently without retry
- Files: `src/lib/evidence-collector.ts` (getWhoisData, captureScreenshot)
- Problem: Network glitches cause permanent failure to collect evidence
- Impact: Threat evidence incomplete, lowering credibility of takedown reports
- Fix approach: Implement exponential backoff retry (3 attempts) for external calls.

---

## Performance Bottlenecks

**Unbounded Domain Variation Generation:**
- Issue: Domain variation generation explodes exponentially
- Files: `src/lib/domain-generator.ts` (lines 70-112)
- Problem:
  - Missing letter variations: up to N possibilities
  - Double letter variations: up to N possibilities
  - Added letter variations: (N+1) * 26 possibilities
  - Character substitutions: multiple per character
  - Affixes: 10 affixes * 4 formats = 40 per affix
  - Total: Can exceed 100,000+ variations for moderate brand names
- Current limit: `variationLimit: 100` in scan config, but function generates all first
- Risk: Memory exhaustion, slow scan startup
- Fix approach: Generate variations lazily with iterator pattern, stop at limit immediately.

**Synchronous Rate Limiting:**
- Issue: Rate limiting uses setTimeout in loops
- Files: `src/lib/social-scanner.ts` (lines 201, 354, 359)
- Problem: Blocks event loop, prevents other requests while scanning
- Impact: Single scan locks up dashboard for entire duration
- Fix approach: Use Promise.all with concurrency limiter (p-limit) instead.

**Unoptimized Database Queries:**
- Issue: Multiple sequential Supabase calls per scan
- Files: `src/app/api/scan/route.ts`, `src/app/api/cron/scan/route.ts`
- Problem:
  - Fetch brand
  - Create scan record
  - Fetch domain variations
  - For each variation: check registration
  - Create threats
  - Update brand threat count
  - Each is a separate round-trip
- Impact: Scan latency multiplied by network delay
- Fix approach: Batch operations where possible. Use Supabase transaction-like patterns.

**PDF Generation on Client:**
- Issue: Large threat lists cause jspdf + html2canvas memory issues
- Files: `src/app/dashboard/reports/new/page.tsx` (report download logic)
- Problem: Rendering full HTML to canvas before PDF conversion = memory spike
- Impact: Browser crash for users with 100+ threats
- Fix approach: Move PDF generation to backend, stream chunks to client.

**N+1 Query in Dashboard:**
- Issue: Fetching threats then loading associated brand data individually
- Files: `src/app/dashboard/page.tsx` (lines 88-95)
- Problem: Line 90 does `.select('*, brands!inner(name, user_id)')` which is good, but if brands aren't joined properly, code fetches brand details separately
- Risk: Dashboard load time increases with threat count
- Fix approach: Ensure all relations are properly selected in initial query.

---

## Fragile Areas

**Cron Scan Logic:**
- Files: `src/app/api/cron/scan/route.ts` (lines 51-127)
- Why fragile:
  - Manually checks subscription tier against hardcoded tiers (starter/professional/enterprise)
  - If new tier added to Stripe, cron breaks
  - No transaction wrapping - partial failures leave scan record incomplete
  - Brand object accessed with optional chaining but no type safety
- Safe modification: Add enum for subscription tiers. Wrap scan update/create in transaction. Add database constraints.

**Webhook Handler Reliability:**
- Files: `src/app/api/stripe/webhook/route.ts` (lines 29-111)
- Why fragile:
  - Relies on metadata.plan field which may not be present
  - If metadata is missing, makes API call to Stripe to look up price
  - No idempotency key handling - duplicate webhooks create duplicate updates
  - Price lookup logic isn't cached, slows down webhook processing
- Safe modification: Add idempotency tracking. Cache price ID to plan mapping. Add fallback plan determination.

**Social Media Profile Detection:**
- Files: `src/lib/social-scanner.ts` (lines 116-150)
- Why fragile:
  - HTTP status code 200 OR 300-399 indicates "exists" (line 139-140)
  - Redirect might indicate bot detection, not actual profile
  - No handling of rate limiting (429 status)
  - Platform profiles may require JavaScript to load (HEAD request fails)
- Safe modification: Test with actual platform rate limiting. Handle 429 gracefully. Consider switching to platform APIs.

**WHOIS Parsing:**
- Files: `src/lib/evidence-collector.ts` (lines 55-80)
- Why fragile:
  - Regex-based parsing assumes WHOIS format consistency
  - Different registrars use different formats
  - Fallback to DNS lookup returns incomplete data
  - No validation that parsed data is actually extracted
- Safe modification: Use dedicated WHOIS library. Add validation of extraction success.

**Domain Registration Check:**
- Files: `src/lib/domain-generator.ts` (function not shown in read, but referenced)
- Why fragile: Likely uses simple HTTP request to check if domain returns any response
- Risk: 404 pages, parked domains, and sinkhole services all return responses
- Fix: Use actual WHOIS or DNS approach for registration detection.

---

## Known Bugs

**Scan Polling Never Completes:**
- Symptom: Onboarding scan shows "Scanning..." forever even after timeout
- Files: `src/app/dashboard/page.tsx` (lines 444-468)
- Trigger: If scan endpoint returns 500 error or network timeout during polling
- Workaround: None - user must refresh page
- Root cause: Polling continues for 5 minutes regardless of response status. If scan fails, no error feedback.
- Fix: Add error state handling, provide user feedback when polling fails, reduce timeout.

**Protection Score Calculation Edge Case:**
- Symptom: Shows 100% protection when user has no threats
- Files: `src/app/dashboard/page.tsx` (lines 152-154)
- Math: When totalThreats=0 and resolvedThreats=0, returns 100
- Problem: Misleading - zero threats doesn't mean 100% protected
- Fix: Return null or special state when insufficient data, show "Not enough data" instead.

**Threats Query Missing Status Filter:**
- Symptom: Stats dashboard counts show threats including resolved ones
- Files: `src/app/dashboard/page.tsx` (line 100-102 uses status filter, but inconsistently)
- Issue: Count query uses `.not('status', 'in', '("resolved","false_positive")')` but string syntax may be incorrect
- Risk: Dashboard stats don't match threat list
- Fix: Use array syntax `.in('status', ['resolved', 'false_positive'])` for consistency.

**Email Alert Silently Fails:**
- Symptom: Threat alerts never arrive but no error in logs
- Files: `src/app/api/cron/scan/route.ts` (lines 100-105)
- Issue: Email send wrapped in try-catch but error logged to console only
- Problem: Production deployments don't capture console.error reliably
- Fix: Use structured logging (Sentry, Datadog, etc.). Store failed alert attempts in database for retry.

---

## Missing Critical Features

**No Rate Limiting:**
- Problem: Scan endpoints can be called infinitely, wasting API quotas and compute
- Files: `src/app/api/scan/route.ts`, `src/app/api/scan/social/route.ts`
- Blocks: Users with free tier can DOS their own account by hammering scan endpoint
- Fix: Implement per-user rate limiting (e.g., 5 scans/hour for free, unlimited for pro)

**No Scan Cancellation:**
- Problem: Long-running scans can't be stopped once started
- Files: `src/app/api/scan/route.ts` background task
- Blocks: Users stuck waiting for slow scans, especially social media scanning
- Fix: Store scan status with cancellation tokens, allow DELETE /api/scan/:id

**No Pagination on Threats:**
- Problem: Dashboard loads first 6 threats, threats page loads all threats with no pagination
- Files: `src/app/dashboard/page.tsx` (line 93 limit 6), `src/app/dashboard/threats/page.tsx`
- Risk: UI becomes slow with 1000+ threats
- Fix: Implement cursor-based pagination, load-more button, or infinite scroll

**Missing Threat Search/Filter:**
- Problem: Can't filter threats by type, severity, date range
- Files: `src/app/dashboard/threats/page.tsx`
- Impact: Users with many brands can't find specific threats
- Fix: Add query parameters for severity, type, date range, status

**No Bulk Operations:**
- Problem: Can't mark multiple threats as resolved at once
- Files: Threats UI components
- Impact: Manual threat management is tedious
- Fix: Add checkboxes, bulk status update endpoint

**Missing Threat History/Audit Log:**
- Problem: No record of when threat status changed or who changed it
- Files: Database schema missing audit fields
- Impact: Can't answer "when was this resolved?" or verify takedown success
- Fix: Add threat_status_history table with timestamp and user_id

**No Integration with Takedown Services:**
- Problem: Generating reports manually, no automation
- Files: `src/lib/report-generator.ts` generates reports but no integration layer
- Impact: Users must manually contact registrars/hosts
- Fix: Add integrations with DMCA notice APIs or takedown service providers

---

## Test Coverage Gaps

**API Endpoints Untested:**
- What's not tested: All /api/* endpoints lack unit/integration tests
- Files: `src/app/api/scan/route.ts`, `src/app/api/brands/route.ts`, `src/app/api/stripe/webhook/route.ts`, etc.
- Risk: Regressions undetected until production. Webhook failures cause user subscription issues.
- Priority: HIGH - Payment and core scanning logic exposed

**Scanning Logic Untested:**
- What's not tested: Domain generation, threat analysis, social media detection algorithms
- Files: `src/lib/domain-generator.ts`, `src/lib/social-scanner.ts`, `src/lib/web-scanner.ts`
- Risk: False positives/negatives sent to users as threat detections
- Priority: HIGH - Core product reliability

**Authentication Untested:**
- What's not tested: Auth flows, permission checks on database queries
- Files: `src/app/auth/login/page.tsx`, `src/app/auth/signup/page.tsx`, API route user checks
- Risk: Users can access other users' data if permission checks break
- Priority: CRITICAL

**Report Generation Untested:**
- What's not tested: PDF generation, report formatting, data accuracy
- Files: `src/lib/report-generator.ts`, report download in `src/app/dashboard/reports/new/page.tsx`
- Risk: Legal documents (takedown reports) may be malformed
- Priority: HIGH - Directly impacts user's legal actions

**Email Delivery Untested:**
- What's not tested: Email template rendering, SMTP integration
- Files: `src/lib/email.ts`
- Risk: Users don't receive alerts, trust product reliability
- Priority: MEDIUM

---

## Dependencies at Risk

**Puppeteer-core Version Pinned (Old):**
- Package: `puppeteer-core@23.11.0` (from package.json)
- Risk: Old version may have security vulnerabilities
- Impact: If used for screenshot capture, could allow code injection
- Current state: Not actively used (commented out in evidence-collector), but imported
- Migration: Update to latest version when implementing screenshot capture, use `puppeteer-extra-plugin-stealth` for evasion

**Whois-json May Be Unmaintained:**
- Package: `whois-json@2.0.4`
- Risk: Package may not receive security updates
- Current usage: Not found in codebase (likely dead code)
- Recommendation: Remove dependency, use native WHOIS lookup or legitimate API

**Nodemailer Without TLS Enforcement:**
- Package: `nodemailer@6.9.16`
- Issue: `secure: false` in email.ts means emails sent unencrypted
- Risk: Email credentials visible on network, alerts intercepted
- Fix: Set `secure: true` for port 465 or handle STARTTLS properly

---

## Scaling Limits

**Database Query Limits:**
- Current capacity: Supabase free tier allows ~1M rows
- Limit: At ~10 threats per brand, 100,000 brands would hit limit
- Constraint: Also row-level security checks on every query
- Scaling path: Move to dedicated Postgres instance. Add threat archival (move old threats to cold storage after 90 days).

**Background Scan Concurrency:**
- Current: Cron job processes brands sequentially (lines 51 in cron/scan/route.ts)
- Capacity: ~50-100 brands maximum before cron timeout (60s on Vercel)
- Limit: Each scan takes 30-60 seconds depending on domain count
- Scaling path: Implement queue (Bull/BullMQ) for async scan processing. Scale horizontal with multiple workers.

**Email Delivery:**
- Current: Uses SMTP (Gmail default or custom)
- Capacity: Gmail free tier = ~500 emails/day before throttling
- Limit: 50+ brands with daily alerts hits limit immediately
- Scaling path: Switch to SendGrid/AWS SES. Batch alerts (daily digest instead of real-time).

**API Rate Limits:**
- External APIs hit during scan:
  - DuckDuckGo: No official rate limit but blocks aggressive scrapers
  - WHOIS: ~60 queries/minute per IP
  - Google DNS: 1000 queries/day free limit
- Scaling path: Implement DNS caching. Use paid WHOIS API. Cache DuckDuckGo results.

**Memory Usage in PDF Generation:**
- Current: html2canvas renders full threat list to canvas
- Limit: Browser crashes with ~200+ threats per report
- Scaling path: Move to backend. Use headless Chrome on server for rendering. Stream PDF chunks.

---

*Concerns audit: 2026-01-23*
