# DoppelDown — Paid APIs & Usage Monitoring

This document lists the **billable external services** used by DoppelDown, where they’re used in the codebase, and what to monitor.

> Goal: avoid surprise bills + catch broken integrations early.

---

## TL;DR (what will cost you first)
1. **OpenAI** (phishing intent + visual similarity)
2. **SERPAPI** (web/social discovery)
3. **VirusTotal / urlscan / AbuseIPDB / HIBP / WHOISXML** (if enabled)
4. **Resend** (transactional/alert email once enabled)
5. **Stripe** (fees + webhook health)

---

## 1) OpenAI (billable)
Used for phishing intent classification and visual similarity checks.

**Env vars**
- `OPENAI_API_KEY`
- `OPENAI_BASE_URL` (default: `https://api.openai.com/v1`)
- `OPENAI_VISION_MODEL`, `OPENAI_INTENT_MODEL`
- `OPENAI_TIMEOUT_MS`
- Feature toggles: `OPENAI_VISION_ENABLED`, `OPENAI_INTENT_ENABLED`, `VISION_PROVIDER`

**Code locations**
- `src/lib/openai-analysis.ts` (calls OpenAI `/responses`)
- Referenced by: `src/lib/threat-analysis.ts`, `src/lib/scan-runner.ts`

**What to monitor**
- OpenAI dashboard usage by API key
- Spend by model (vision calls can spike)
- Error rate / timeouts

---

## 2) SERPAPI (billable)
Used to find pages/accounts for web + social scanning and logo search fallback.

**Env vars**
- `SERPAPI_API_KEY`
- `SEARCH_PROVIDER` / `WEB_SEARCH_FALLBACK` / `LOGO_SEARCH_PROVIDER` / `LOGO_SEARCH_FALLBACK` (behavior depends on config)

**Code locations**
- `src/lib/web-scanner.ts`
- `src/lib/social-scanner.ts`
- `src/lib/logo-scanner.ts`

**What to monitor**
- SERPAPI request volume + quota
- 429s / blocked queries

---

## 3) Stripe (payments; fees + API/webhook health)

**Env vars**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_STARTER_PRICE_ID`, `STRIPE_PRO_PRICE_ID`, `STRIPE_ENTERPRISE_PRICE_ID`

**Code locations**
- `src/lib/stripe.ts`
- API routes: `src/app/api/stripe/checkout/route.ts`, `src/app/api/stripe/portal/route.ts`, `src/app/api/stripe/webhook/route.ts`
- Health check hits Stripe balance: `src/app/api/health/route.ts`

**What to monitor**
- Stripe webhooks delivery failures
- Subscription creation / checkout errors
- Promo code abuse

---

## 4) Resend (email; billable)
Used for transactional emails (welcome, alerts, digests, etc.)

**Env vars**
- `RESEND_API_KEY`
- `FROM_EMAIL`, `REPLY_TO_EMAIL`

**Code locations**
- `lib/email/send.ts`
- Health check: `src/app/api/health/route.ts` (calls `https://api.resend.com/domains`)

**What to monitor**
- Volume and cost
- Bounce rate / complaint rate
- Domain verification status

---

## 5) Threat Intel / Reputation APIs (many are paid if enabled)
Central config: `src/lib/threat-intel/config.ts`

### Common paid/quota-limited providers

#### Google Safe Browsing
- Env: `GOOGLE_SAFE_BROWSING_API_KEY` + `ENABLE_GOOGLE_SAFE_BROWSING`
- Endpoint: `https://safebrowsing.googleapis.com/v4/threatMatches:find`

#### VirusTotal
- Env: `VIRUSTOTAL_API_KEY` + `ENABLE_VIRUSTOTAL`
- Endpoint base: `https://www.virustotal.com/api/v3/`

#### urlscan.io
- Env: `URLSCAN_API_KEY` + `URLSCAN_ENABLED`
- Endpoint base: `https://urlscan.io/api/v1/`

#### AbuseIPDB
- Env: `ABUSEIPDB_API_KEY` + `ABUSEIPDB_ENABLED`
- Endpoint base: `https://api.abuseipdb.com/api/v2/`

#### HaveIBeenPwned (HIBP)
- Env: `HIBP_API_KEY` + `HIBP_ENABLED`
- Endpoint: `https://haveibeenpwned.com/api/v3/`

#### WHOIS / Domain intelligence / NRD
- Env (varies): `WHOIS_API_KEY`, `WHOISXML_API_KEY`, `NRD_PROVIDER`

### Free feeds (still worth monitoring for reliability)
- OpenPhish feed: `ENABLE_OPENPHISH` (free feed)
- URLhaus: `URLHAUS_ENABLED` (free)
- PhishTank: `PHISHTANK_ENABLED` (can be used without a key)

**What to monitor**
- Quotas + 429s
- Provider outages/timeouts
- Per-provider cost vs scan volume

---

## 6) Google Vision (billable if enabled)
Used for logo detection / similarity (when `VISION_PROVIDER=google`).

**Env vars**
- `GOOGLE_VISION_API_KEY`
- `VISION_PROVIDER`

**Code locations**
- `src/lib/logo-scanner.ts`

**What to monitor**
- Request volume + quota

---

## 7) Optional/enterprise intelligence sources (likely paid if configured)
These exist in env/config and may be used depending on feature toggles.

- AlienVault OTX: `ALIENVAULT_OTX_API_KEY`
- MISP: `MISP_URL`, `MISP_API_KEY`
- Dark web monitor: `DARK_WEB_MONITOR_API_KEY`

---

## Recommended guardrails (quick wins)
- Set sane rate limits via the `RATE_LIMIT_*` env vars (already supported).
- Enable caching TTLs (`CACHE_TTL_*`) to reduce duplicate calls.
- Add a simple daily/weekly “API usage summary” cron that logs call counts per provider.
- Put hard budget alerts in the vendor dashboards (OpenAI, SERPAPI, Google, etc.).
