# DoppelDown Operational Readiness + AI Roadmap
Date: 2026-01-23

This note captures findings, blockers, and a staged plan to move the codebase to
commercial readiness. It also outlines AI feature ideas and a practical MVP AI
implementation path.

-------------------------------------------------------------------------------
FINDINGS (BLOCKERS FOR COMMERCIAL RELEASE)
-------------------------------------------------------------------------------
1) Long-running scans run inside request handlers and continue after the HTTP
   response. This is not reliable on serverless platforms and will be killed.
   - src/app/api/scan/route.ts
   - src/app/api/cron/scan/route.ts

2) Web/social discovery relies on HTML scraping and simple HEAD checks against
   social platforms. This is fragile, frequently blocked, and likely violates
   platform ToS at scale.
   - src/lib/web-scanner.ts
   - src/lib/social-scanner.ts

3) Evidence collection uses demo keys and placeholder screenshot flow. WHOIS
   data is inconsistent. This won't work reliably in production.
   - src/lib/evidence-collector.ts

4) Evidence HTML is stored inline in Postgres. This will bloat the DB, slow
   queries, and increase costs. Binary evidence should be stored in object
   storage with references in DB.
   - supabase/schema.sql
   - src/lib/evidence-collector.ts

5) Plan enforcement is incomplete. Users can run unlimited scans regardless of
   tier; only brand limits are enforced.
   - src/app/api/scan/route.ts
   - src/app/api/scan/social/route.ts

6) Schema grants ALL privileges to anon/authenticated and duplicates
   handle_new_user. RLS mitigates some risk, but least-privilege is needed.
   - supabase/schema.sql

7) Marketing claims "PDF reports" but only HTML/text/CSV is generated. This is
   a product gap for legal/commercial usage.
   - src/lib/report-generator.ts
   - src/app/api/reports/route.ts

-------------------------------------------------------------------------------
OPERATIONALIZATION PLAN (PHASED)
-------------------------------------------------------------------------------
Phase 0: Scope Cut (1-2 days)
- Decide MVP detection sources and reliability targets.
- Recommend MVP: domain variations + WHOIS + evidence + alerting.
- Defer social scraping and web scraping until compliant provider is chosen.

Phase 1: Job Queue + Worker (1-2 weeks)
- Add "scan_jobs" table + job runner.
- API routes enqueue jobs only; workers process scans and write results.
- Cron endpoint should enqueue based on plan frequency, not execute work.

Phase 2: Data Providers (1-2 weeks)
- Replace HTML scraping with official search APIs.
- Use paid RDAP/WHOIS provider for consistent data.
- Screenshot provider or headless browser in worker environment.
- Store evidence in object storage, save references in DB.

Phase 3: Product Hardening (1-2 weeks)
- Enforce scan limits per tier (daily caps, concurrent scan caps).
- Add throttling and abuse protection.
- Implement actual PDF generation and storage.
- Add audit logs and risk scoring visibility.

Phase 4: Ops + Compliance (1-2 weeks)
- Logging, monitoring, dashboards, alerting (scan errors, queue depth).
- Backups, retention and deletion flows.
- Legal: Terms, Privacy, and platform acceptable use.

-------------------------------------------------------------------------------
AI OPPORTUNITIES (SHORTLIST)
-------------------------------------------------------------------------------
Near-term (MVP-friendly)
1) Logo spoof detection on screenshot evidence.
2) Page similarity vs official site (layout + visuals).
3) Threat triage and summarization for reports and alerts.
4) Severity ranking using a learned risk score (features + ML).

Mid-term
5) Entity extraction from WHOIS/HTML to improve takedown routing.
6) Brand impersonation classifier for social profiles and pages.
7) Auto-draft takedown notices with evidence references.

Longer-term
8) Predictive monitoring: identify likely abusive domains before activation.
9) Multilingual phishing classification and translation.
10) Adaptive scanning: choose scans based on model confidence + trend signals.

-------------------------------------------------------------------------------
MVP AI FEATURE: LOGO SPOOF DETECTION
-------------------------------------------------------------------------------
Goal: detect if a screenshot likely contains a customer's logo, or a visually
similar variant.

Recommended approach:
- Input: official brand logo(s) + screenshot evidence images.
- Compute image embeddings for both using a vision model.
- Use cosine similarity to rank matches and flag above threshold.

Implementation outline:
1) Store brand logo assets in object storage.
2) On evidence capture, generate a screenshot image.
3) Compute embeddings for logo + screenshot.
4) Save similarity score and match metadata in DB.
5) Expose "Logo detected" and confidence in threat UI and reports.

Thresholds:
- Start with conservative thresholds (e.g., >0.30) and tune on real data.
- Track false positives/negatives with manual feedback.

Fallback options:
- Perceptual hash (pHash) for quick image similarity.
- Template matching for exact logo detection (less robust).

Operational considerations:
- GPU is not required if using API-based embeddings.
- Cache embeddings for brand logos to reduce cost.
- Store only hashes/embeddings, not raw images, for privacy where possible.

-------------------------------------------------------------------------------
AI MVP #2: OFFICIAL SITE VISUAL SIMILARITY
-------------------------------------------------------------------------------
Goal: identify lookalike websites that mimic the official site UI.

Approach:
- Take screenshot of official domain.
- Compare with candidate site screenshots using visual embeddings.
- Flag high similarity + domain distance as higher risk.

-------------------------------------------------------------------------------
AI MVP #3: THREAT TRIAGE AND SUMMARIZATION
-------------------------------------------------------------------------------
Goal: reduce analyst time by summarizing evidence and recommending priority.

Approach:
- Input: URL, WHOIS summary, screenshot metadata, HTML signals.
- Output: short summary, recommended severity, suggested takedown targets.
- Use a strict JSON schema with confidence scores and references.

Safety controls:
- Require deterministic structured output.
- Always show source evidence in UI; AI provides suggestions only.

-------------------------------------------------------------------------------
RECOMMENDED NEXT IMPLEMENTATION STEPS
-------------------------------------------------------------------------------
Option A: Job Queue + Worker
- Add scan_jobs table and enqueue logic.
- Implement worker process (node script or separate service).
- Move scanning + evidence collection into worker.

Status: Implemented in code (scan_jobs table + worker loop + enqueue-only APIs).
Worker entry point: scripts/scan-worker.ts
Run: npm run worker:scan
Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SCAN_WORKER_POLL_MS, SCAN_JOB_STALE_MINUTES

Option B: Evidence Storage Pipeline
- Add object storage bucket for evidence.
- Save screenshot/HTML/WHOIS files and only store references in DB.

Option C: AI Logo Detection MVP
- Add logo upload/storage per brand.
- Add embedding generation service and similarity scoring.
- Show "Logo Match Confidence" in threat UI.

-------------------------------------------------------------------------------
OPEN QUESTIONS
-------------------------------------------------------------------------------
1) Hosting target: Vercel only or separate worker service allowed?
2) Will you use paid data providers for search/WHOIS?
3) Which MVP AI feature is highest priority?
4) Do you want to allow customers to upload multiple logos per brand?

-------------------------------------------------------------------------------
ADDITIONAL REQUIREMENTS (USER UPDATE)
-------------------------------------------------------------------------------
- MVP should include all detections: domain, web, social, and Microsoft 365
  email abuse signals (e.g., similar domain registered and configured with O365).
- Preference: avoid paid third-party data providers; willing to spend on AI tokens.
- Hosting: flexible, will follow recommended hosting architecture for reliability.

Risk note on no paid providers:
- Web/social discovery without official APIs is brittle and may be blocked.
- AI can score/triage what you already collect, but it cannot replace data access.
- For MVP, keep scraping best-effort and clearly label confidence/coverage.

O365 detection approach (no paid providers):
- DNS MX inspection: look for *.protection.outlook.com or outlook.com MX targets.
- SPF inspection: look for "include:spf.protection.outlook.com".
- Autodiscover and domain validation endpoints to confirm M365 usage.
- If MX indicates O365 on suspicious domain, raise severity and flag as
  "email infrastructure abuse".
Notes: This is heuristic and should be presented as "likely O365 usage".

Architecture impact:
- Worker should add a DNS-based email-infra check step after domain registration
  detection and before threat insertion.
- Evidence should include MX/SPF records and timestamp in the evidence payload.

-------------------------------------------------------------------------------
END
-------------------------------------------------------------------------------

-------------------------------------------------------------------------------
IMPLEMENTATION UPDATE (2026-01-23)
-------------------------------------------------------------------------------
Queued scans now go to a real job queue and a long-running worker does the heavy
work. API + cron endpoints only enqueue; a shared scan runner executes
domain/web/social scans, updates scans/brands, and sends alerts for automated
runs.

Changes made:
- supabase/schema.sql: added scan_jobs table, indexes, RLS, and updated_at trigger
- src/app/api/scan/route.ts: queue-only scan API
- src/app/api/scan/social/route.ts: queue-only social scan API
- src/app/api/cron/scan/route.ts: cron enqueue only
- src/lib/scan-runner.ts: central scan execution + alerting
- scripts/scan-worker.ts: worker loop with retries/backoff
- package.json: worker script + tsx/dotenv deps
- .env.example: worker config vars
- src/lib/* imports switched to relative paths for worker compatibility

How to run:
1) Apply schema updates in Supabase (re-run supabase/schema.sql)
2) Install deps: npm install
3) Start worker: npm run worker:scan

AI ideas to consider (beyond logo spoofing):
- Visual similarity to official site screenshots
- Phishing intent/content classification
- Severity ranking based on signals
- Auto-draft takedown notices and summaries

O365 detection plan (no paid provider):
- DNS MX inspection: look for *.protection.outlook.com
- SPF check: include:spf.protection.outlook.com
- Autodiscover endpoint checks
- Flag as "likely O365 usage" with evidence attached

Recommended next implementation (choose one):
1) Add O365 detection to scan runner
2) AI logo-spoof detection MVP (embeddings + similarity)
3) Evidence storage pipeline (object storage + DB refs)

-------------------------------------------------------------------------------
