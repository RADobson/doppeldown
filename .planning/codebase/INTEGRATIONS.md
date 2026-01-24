# External Integrations

**Analysis Date:** 2026-01-24

## APIs & External Services

**Payment Processing:**
- Stripe - Payment processing and subscription management
  - SDK/Client: `stripe` (v17.4.0 server), `@stripe/stripe-js` (v8.6.0 client)
  - Auth: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
  - Implementation: `src/lib/stripe.ts` - Checkout sessions, customer management, subscriptions
  - Webhooks: POST `/api/stripe/webhook` handles subscription events

**WHOIS & Domain Information:**
- WHOIS APIs (multiple fallbacks):
  - WhoisXMLAPI: `https://www.whoisxmlapi.com/whoisserver/WhoisService`
  - WhoAPI: `https://api.whoapi.com/`
  - IANA WHOIS: `https://whois.iana.org/`
  - DNS resolution via Google DNS: `https://dns.google/resolve`
  - Implementation: `src/lib/evidence-collector.ts` - Domain registration data collection

**Web Search & Detection:**
- SerpAPI (primary web/social search)
  - Auth: `SERPAPI_API_KEY`
  - Used via: `WEB_SEARCH_PROVIDER=serpapi`, `SOCIAL_SEARCH_PROVIDER=serpapi`
  - Implementation: `src/lib/web-scanner.ts`, `src/lib/social-scanner.ts`
  - Fallback search enabled: `WEB_SEARCH_FALLBACK=true`, `SOCIAL_SEARCH_FALLBACK=true`

**Image & Logo Detection:**
- Google Vision API (primary logo detection)
  - Auth: `GOOGLE_VISION_API_KEY`
  - Endpoint: `https://vision.googleapis.com/v1/images:annotate`
  - Implementation: `src/lib/logo-scanner.ts`
  - Provider config: `LOGO_SEARCH_PROVIDER=google_vision`
  - Fallback: SerpAPI Google Lens (`https://serpapi.com/search`)

**AI/ML Analysis:**
- OpenAI - Vision and intent analysis for phishing detection
  - Auth: `OPENAI_API_KEY`
  - Models: `OPENAI_VISION_MODEL` (gpt-4o-mini default), `OPENAI_INTENT_MODEL` (gpt-5-mini default)
  - Endpoint: `https://api.openai.com/v1/responses` (configurable via `OPENAI_BASE_URL`)
  - Features: Visual similarity detection, phishing intent classification
  - Implementation: `src/lib/openai-analysis.ts`
  - Toggle: `OPENAI_VISION_ENABLED=true`, `OPENAI_INTENT_ENABLED=true`

## Data Storage

**Databases:**
- Supabase (PostgreSQL)
  - Connection: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (client), `SUPABASE_SERVICE_ROLE_KEY` (server)
  - Client: `@supabase/supabase-js` with `@supabase/ssr` for cookie handling
  - Tables: users, brands, threats, scans, scan_jobs
  - Schema: `supabase/schema.sql` (PostgreSQL with UUID, JSONB support)
  - Implementation:
    - Browser client: `src/lib/supabase/client.ts`
    - Server client: `src/lib/supabase/server.ts` (with service role)

**File Storage:**
- Supabase Storage (implied by schema logo_url, screenshot_url fields)
- Evidence artifacts: Screenshots, WHOIS snapshots, HTML snapshots stored as JSONB in database

**Caching:**
- Not detected - no Redis or Memcached integration

## Authentication & Identity

**Auth Provider:**
- Supabase Auth (built-in)
  - Implementation: Cookie-based with Next.js SSR support
  - Uses: `@supabase/ssr` for secure cookie handling in Server Components
  - Pages: `/app/auth/login`, `/app/auth/signup`, `/app/auth/forgot-password`, `/app/auth/reset-password`
  - Features: Password reset, email verification

## Monitoring & Observability

**Error Tracking:**
- Not detected - no Sentry, LogRocket, or similar

**Logs:**
- Console logging in source code (basic error/info logging)
- No structured logging framework detected

## CI/CD & Deployment

**Hosting:**
- Vercel - Primary deployment platform
  - Configuration: `vercel.json` with cron job scheduling
  - Cron: `/api/cron/scan` scheduled every 6 hours (`0 */6 * * *`)
  - Supports: Server Functions, Edge Functions

**Alternative Deployment:**
- Docker support for containerized deployments
  - Dockerfile: Node.js 20-slim with Chromium pre-installed
  - Environment: `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium`

**CI Pipeline:**
- Not detected (no GitHub Actions, GitLab CI, or similar)

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role (server-only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `STRIPE_STARTER_PRICE_ID`, `STRIPE_PRO_PRICE_ID`, `STRIPE_ENTERPRISE_PRICE_ID` - Stripe plan IDs

**Optional env vars (with defaults):**
- `NEXT_PUBLIC_APP_URL` - Application base URL (default: http://localhost:3000)
- `SMTP_HOST` - Email SMTP host (default: smtp.gmail.com)
- `SMTP_PORT` - SMTP port (default: 587)
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `EMAIL_FROM` - Sender email address
- `CRON_SECRET` - Secret for cron job authentication
- `SCAN_WORKER_POLL_MS` - Worker polling interval (default: 5000ms)
- `SCAN_JOB_STALE_MINUTES` - Stale job timeout (default: 30 minutes)
- `WORKER_ID` - Worker identifier (default: scan-worker-1)

**Search & Detection vars:**
- `WEB_SEARCH_PROVIDER` - Search engine (serpapi, default)
- `SOCIAL_SEARCH_PROVIDER` - Social platform search (serpapi, default)
- `SERPAPI_API_KEY` - SerpAPI authentication
- `GOOGLE_VISION_API_KEY` - Google Vision API key
- `LOGO_SEARCH_PROVIDER` - Logo detection service (google_vision, default)
- `LOGO_SEARCH_FALLBACK` - Fallback to SerpAPI (true/false)

**AI Analysis vars:**
- `OPENAI_API_KEY` - OpenAI API key
- `OPENAI_VISION_MODEL` - Vision model (default: gpt-4o-mini)
- `OPENAI_INTENT_MODEL` - Intent model (default: gpt-5-mini)
- `OPENAI_VISION_ENABLED` - Enable vision analysis (true/false)
- `OPENAI_INTENT_ENABLED` - Enable intent analysis (true/false)
- `OPENAI_BASE_URL` - OpenAI endpoint override
- `OPENAI_TIMEOUT_MS` - API timeout (default: 15000ms)
- `PHISHING_INTENT_MAX_CHARS` - Character limit for intent analysis (default: 4000)

**Secrets location:**
- `.env.local` file (development)
- Vercel Secrets (production) - configured in project settings
- `.env.example` provided as template

## Webhooks & Callbacks

**Incoming:**
- Stripe Webhooks: `POST /api/stripe/webhook`
  - Events handled: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
  - Webhook secret verification enabled via `STRIPE_WEBHOOK_SECRET`
  - Updates user subscription status in Supabase on payment events

**Outgoing:**
- Custom webhooks from threat detection (optional)
  - Implementation: `src/lib/webhooks.ts` - `sendThreatDetectedWebhook()`
  - Can notify external systems when threats are detected
  - Triggered from `src/lib/scan-runner.ts` scan completion

---

*Integration audit: 2026-01-24*
