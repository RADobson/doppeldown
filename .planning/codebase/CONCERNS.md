# Codebase Concerns

**Analysis Date:** 2026-01-24

## Tech Debt

**Silent Error Swallowing:**
- Issue: Multiple `.catch()` handlers silently suppress errors without logging or propagating failures.
- Files: `src/app/api/evidence/sign/route.ts`, `src/app/api/brands/logo/route.ts`, `src/lib/openai-analysis.ts`, `src/lib/logo-scanner.ts`
- Impact: Failures go undetected, making debugging difficult. API calls that fail silently return empty defaults, degrading data quality.
- Fix approach: Replace silent catch blocks with explicit error logging and graceful fallbacks that inform callers of failure.

**Weak Type Safety with 'any':**
- Issue: Core API routes accept `any` types for evidence and request bodies, bypassing type checking.
- Files: `src/app/api/evidence/sign/route.ts` (lines 6, 14, 27, 34), `src/app/api/reports/route.ts` (line 12)
- Impact: Type errors in evidence handling pass through until runtime. Invalid data structures can cause crashes or incorrect behavior.
- Fix approach: Replace `any` with explicit interfaces for request bodies and evidence objects.

**Database Query Patterns Without Null Checking:**
- Issue: Supabase queries access `.data` property without always checking for errors first, relying on optional chaining.
- Files: `src/lib/scan-runner.ts` (lines 484, 569, 647), `src/lib/evidence-collector.ts` (line 115)
- Impact: Unexpected database errors could result in undefined objects being processed as valid data.
- Fix approach: Add explicit error checks before accessing query results.

## Known Issues

**Unhandled Promise Rejections in Scan Progress:**
- Issue: `ensureNotCancelled()` and `updateProgress()` catch errors but only warn; parent scan may continue processing.
- Files: `src/lib/scan-runner.ts` (lines 334-338, 354-356)
- Impact: Cancellation signals may be ignored; progress updates may fail silently, leaving UI out of sync.
- Fix approach: Propagate cancellation errors instead of suppressing them.

**OpenAI Vision Endpoint Mismatch:**
- Issue: Calls `/responses` endpoint which doesn't appear to be a standard OpenAI API. Vision models typically use `/chat/completions`.
- Files: `src/lib/openai-analysis.ts` (line 65)
- Impact: Vision analysis will fail in production. Feature advertised but non-functional.
- Fix approach: Use correct OpenAI `/chat/completions` endpoint with vision models (gpt-4-vision, gpt-4o).

**Incomplete Email Configuration Validation:**
- Issue: Email transport created without checking if SMTP credentials exist; will fail silently if env vars missing.
- Files: `src/lib/email.ts` (lines 5-13)
- Impact: Email alerts may never send without user notification. Critical security feature silently disabled.
- Fix approach: Validate SMTP credentials on startup; log warnings if email unavailable.

## Security Considerations

**Exposed Debug Logging in Production:**
- Issue: Debug mode controlled by environment variables (`SCAN_DEBUG_BRAND`, `SCAN_DEBUG_DOMAINS`) logs detailed brand/domain info to console.
- Files: `src/lib/scan-runner.ts` (lines 115-116, 287-290, 379-387, 411-417, 422-427)
- Impact: In production, sensitive brand monitoring patterns could be logged to application logs if debug env vars are set.
- Recommendations: Remove debug logging or gate it behind a flag that's false in production by default.

**Unauthenticated Evidence Signing Route:**
- Issue: Evidence signing endpoint validates user but doesn't verify brand ownership within the evidence object.
- Files: `src/app/api/evidence/sign/route.ts` (lines 50-59)
- Impact: User could request signed URLs for other users' threat evidence if they know the threatId.
- Recommendations: Add per-evidence authorization check confirming threat belongs to authenticated user's brand.

**Overly Permissive Stripe Webhook:**
- Issue: Webhook endpoint doesn't validate event type before processing, could execute logic on unintended events.
- Files: `src/app/api/stripe/webhook/route.ts` (implied from common patterns)
- Impact: Subscription state could be corrupted by edge-case events or testing events in production.
- Recommendations: Whitelist only required event types before processing.

**HTML Injection in Report Generation:**
- Issue: Threat URL and domain data inserted directly into HTML report templates without escaping.
- Files: `src/lib/report-generator.ts` (lines 43-54), `src/lib/email.ts` (lines 74-80)
- Impact: Malicious URLs containing `<script>` or `on*` attributes could execute in PDF viewers or email clients.
- Recommendations: Escape HTML entities in dynamic content or use templating engine with auto-escaping.

## Performance Bottlenecks

**Unoptimized Domain Variation Generation:**
- Issue: `scan-runner.ts` generates variations into a Map, then filters/sorts extensively without caching or early termination.
- Files: `src/lib/scan-runner.ts` (lines 391-410)
- Impact: For high variation limits (100+), memory usage and CPU spike. No pagination or streaming.
- Improvement path: Implement lazy generation; yield variations in batches; cache frequently used domains.

**Synchronous HTML Parsing with Regex:**
- Issue: DuckDuckGo HTML parsed with regex loops that build results until limit. No streaming or timeout.
- Files: `src/lib/web-scanner.ts` (lines 61-95), `src/lib/social-scanner.ts` (lines 100-142)
- Impact: Large HTML responses (1-10MB) parsed synchronously, blocking event loop. Network timeout doesn't cover parsing.
- Improvement path: Implement streaming parser or paginated search results.

**Inefficient Logo Detection API Calls:**
- Issue: Google Lens and SerpAPI called sequentially; could fail completely if first API fails.
- Files: `src/lib/logo-scanner.ts` (lines 36-95)
- Impact: Logo detection unreliable; no fallback strategy if APIs rate limit or error.
- Improvement path: Implement parallel API calls with timeout racing; add retry with exponential backoff.

**Polling in Dashboard with No Backoff:**
- Issue: Dashboard components poll every 4 seconds without detecting stale data or implementing exponential backoff.
- Files: `src/app/dashboard/brands/[id]/page.tsx` (line 338), `src/app/dashboard/page.tsx` (line 467)
- Impact: Generates constant load on API; no awareness of user leaving page. Scales poorly with user count.
- Improvement path: Use websockets via Supabase realtime or implement exponential backoff + page visibility API.

## Fragile Areas

**Screenshot Capture Dependency:**
- Issue: Screenshot generation fails silently; scan continues without visual evidence, reducing threat detection quality.
- Files: `src/lib/scan-runner.ts` (lines 359-373), `src/lib/evidence-collector.ts` (lines 158-220)
- Impact: Crucial for visual similarity analysis; if puppeteer fails, evidence is incomplete but scan succeeds.
- Safe modification: Add explicit screenshot validation step; fail scan cleanly if screenshots unavailable.
- Test coverage: No unit tests for screenshot failures; only happy path tested.

**Scan Cancellation State Machine:**
- Issue: Cancellation checked via `ensureNotCancelled()` but not consistently called throughout scan loop.
- Files: `src/lib/scan-runner.ts` (lines 323-339)
- Impact: Scans may continue for minutes after cancellation if currently processing a slow external API call.
- Safe modification: Add cancellation check to every async operation; use AbortController pattern.
- Test coverage: No tests for cancellation paths.

**Evidence Storage Bucket Configuration:**
- Issue: Bucket name determined at runtime from request/env; defaults to 'evidence' if undefined. No validation that bucket exists.
- Files: `src/lib/evidence-collector.ts` (line 21), `src/app/api/evidence/sign/route.ts` (line 15)
- Impact: Evidence uploads fail if bucket misconfigured; users get generic error.
- Safe modification: Validate bucket exists on startup; use single hardcoded bucket or pre-validate config.
- Test coverage: No tests for bucket validation.

**Threat Deduplication Logic:**
- Issue: No explicit deduplication when same domain detected across multiple scans/scan types.
- Files: `src/lib/scan-runner.ts` (line 317), database schema assumed
- Impact: Duplicate threat records created, inflating counts and causing false alert storms.
- Safe modification: Implement domain+type uniqueness constraint; upsert threats instead of insert.
- Test coverage: Unknown; likely not tested.

## Scaling Limits

**Memory Usage with Large Scan Results:**
- Issue: All domain variations loaded into memory (Map) before checking; 100 variations × 5 data points = unbounded arrays.
- Current capacity: Tested with ~100 variations per scan
- Limit: Hitting limits at 1000+ variations or concurrent scans with high variation counts
- Scaling path: Implement pagination in variation generation; use cursor-based scanning.

**Email Delivery Queue Not Implemented:**
- Issue: Email sending is synchronous; if SMTP slow, HTTP request hangs.
- Current capacity: Works fine with <10 concurrent threat alerts
- Limit: Breaks under load (high-threat periods with 50+ alerts)
- Scaling path: Move email to background job queue (Bull, RabbitMQ); implement retry logic.

**Supabase Connection Pool:**
- Issue: Each API endpoint creates fresh Supabase client; no connection pooling at application level.
- Current capacity: ~100 concurrent requests
- Limit: Could exhaust Supabase connection limits under high load
- Scaling path: Implement singleton Supabase clients or use Supabase connection pooling tier.

## Dependencies at Risk

**Puppeteer-Core Without Chromium:**
- Risk: Puppeteer-core requires external Chromium binary; deployment must include compatible binary or use browserless service.
- Impact: Screenshot capture fails if deployment environment missing Chromium (serverless, Docker without headless-shell).
- Migration plan: Either vendor Chromium binary in deployment or migrate to browserless API (e.g., Browserless, Bright Data).

**Node.js WHOIS Module (whois-json):**
- Risk: Package has no recent updates; relies on public WHOIS servers which have rate limits and unreliable formatting.
- Impact: WHOIS lookups fail inconsistently; evidence collection incomplete.
- Migration plan: Use dedicated WHOIS API (WhoisXML, DomainTools) with guaranteed uptime.

**Nodemailer without Queue:**
- Risk: Direct SMTP connection; no retry logic, no queue, no delivery tracking.
- Impact: Emails lost if SMTP unavailable; users don't know alerts failed.
- Migration plan: Use email service (SendGrid, AWS SES) with queuing and delivery webhooks.

## Missing Critical Features

**No Rate Limiting on Public APIs:**
- Problem: Scan and report endpoints have no rate limit; malicious user could DoS by spamming requests.
- Blocks: Production deployment; OWASP compliance.
- Recommendations: Add per-user rate limiting using Redis or Supabase; implement exponential backoff.

**No Audit Logging:**
- Problem: No logging of who accessed which threats/reports; no compliance trail for regulatory requirements.
- Blocks: Enterprise sales; SOC2 compliance.
- Recommendations: Log all data access to immutable audit table; implement data retention policies.

**No Data Encryption at Rest:**
- Problem: Screenshots and HTML snapshots stored in Supabase unencrypted; compliance risk.
- Blocks: Enterprise sales; GDPR compliance.
- Recommendations: Enable Supabase encryption; implement end-to-end encryption for sensitive evidence.

**No Threat Prioritization Algorithm:**
- Problem: All threats returned with same priority; no risk scoring based on brand similarity, domain history, etc.
- Blocks: Enterprise feature; user experience degradation with 100+ threats.
- Recommendations: Implement multi-factor scoring (visual similarity, WHOIS newness, hosting provider reputation).

## Test Coverage Gaps

**Scan Cancellation:**
- What's not tested: User-initiated scan cancellation; behavior of in-flight API calls when cancelled.
- Files: `src/lib/scan-runner.ts` (entire cancellation flow)
- Risk: Scans may not cancel; users stuck with running scans; resource leaks.
- Priority: High

**Error Handling in API Routes:**
- What's not tested: Malformed JSON bodies; database connection failures; partial response errors.
- Files: All `src/app/api/**/route.ts`
- Risk: Silent failures; 500 errors without proper messages; debugging difficult.
- Priority: High

**Evidence Storage Failures:**
- What's not tested: S3/Supabase upload failures; bucket misconfiguration; permission denied scenarios.
- Files: `src/lib/evidence-collector.ts` (upload functions)
- Risk: Evidence lost; scans succeed but evidence unavailable; reports have broken links.
- Priority: High

**OpenAI Vision Analysis:**
- What's not tested: Vision API failures; timeout behavior; parsing of malformed responses.
- Files: `src/lib/openai-analysis.ts`
- Risk: Feature silently disabled on API failure; users unaware visual analysis unavailable.
- Priority: Medium

**Threat Deduplication:**
- What's not tested: Same threat detected in multiple scans; database constraint violations.
- Files: Database insert logic in `src/lib/scan-runner.ts`
- Risk: Duplicate threats created; false positive alerts sent multiple times.
- Priority: Medium

---

*Concerns audit: 2026-01-24*
