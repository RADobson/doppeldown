# External Integrations

**Analysis Date:** 2026-01-23

## APIs & External Services

**Payment Processing:**
- Stripe - Payment gateway for SaaS subscriptions
  - SDK/Client: `stripe` v17.4.0 (server), `@stripe/stripe-js` v8.6.0 (client)
  - Auth: Environment variables `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - Location: `src/lib/stripe.ts` (main client)
  - Used for: Checkout sessions, customer management, subscription handling, billing portal

**Search & Web Scanning:**
- DuckDuckGo HTML API - Free web search for threat detection
  - Client: Fetch API (no SDK)
  - No auth required
  - Location: `src/lib/web-scanner.ts`
  - Used for: Generating search results for phishing/brand threat detection
  - Pattern: `https://html.duckduckgo.com/html/?q={query}`

- Google Custom Search API - Optional enhanced web scanning
  - SDK/Client: Fetch API
  - Auth: Environment variables `GOOGLE_API_KEY`, `GOOGLE_CSE_ID`
  - Note: Currently commented/documented but not implemented
  - Used for: More targeted brand-related search queries

**Domain/WHOIS Lookups:**
- WHOIS IANA - Domain registration information
  - Client: Fetch API
  - No auth required
  - Location: `src/lib/evidence-collector.ts`
  - Used for: Registrar and registrant information for suspicious domains

- whoisxmlapi.com - Optional WHOIS lookup API
  - SDK/Client: `whois-json` v2.0.4 wrapper
  - Auth: API key (demo key in code)
  - Fallback: Uses Google DNS API for nameserver info

- whoapi.com - Optional alternative WHOIS provider
  - Client: Fetch API
  - Auth: API key (demo)
  - Fallback for basic registration info

**DNS Resolution:**
- Google DNS API - Domain registration verification
  - Endpoint: `https://dns.google/resolve?name={domain}&type=A`
  - No auth required
  - Used for: Checking if typosquatting domains are registered

- Cloudflare DNS (1.1.1.1) - Fallback DNS resolution
  - Endpoint: `https://1.1.1.1/dns-query?name={domain}&type=A`
  - Format: JSON
  - Used for: Nameserver and A record lookups

## Data Storage

**Primary Database:**
- Supabase PostgreSQL
  - Connection: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (browser), `SUPABASE_SERVICE_ROLE_KEY` (server)
  - Client: `@supabase/supabase-js` v2.47.0 (browser), `@supabase/ssr` v0.5.0 (server)
  - Tables: `users`, `brands`, `threats`, `scans`, `domain_variations`
  - Auth: Built-in Supabase Auth integration
  - Locations: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`

**File Storage:**
- Local filesystem only - No cloud storage detected
- Evidence stored as: Screenshots (via puppeteer-core), PDF reports (via jspdf), HTML snapshots

**Caching:**
- None detected (no Redis, Memcached, or similar)

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - Custom JWT-based authentication
  - Implementation: OAuth ready, email/password support
  - Server client with service role for admin operations
  - Browser client with anon key for user operations
  - Cookie-based session management
  - Locations: `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`

## Monitoring & Observability

**Error Tracking:**
- None detected - Standard console.error() logging only

**Logs:**
- Console logging only (development/production logs)
- Locations: Various `console.error()` calls in API routes and scanners
- No structured logging framework (Winston, Pino, etc.)

## CI/CD & Deployment

**Hosting:**
- Vercel - Serverless deployment platform for Next.js
  - Config: `vercel.json`
  - Cron jobs enabled (automated brand scans)

**CI Pipeline:**
- Vercel deployment - Automatic on git push
- Linting via ESLint (manual check via `npm lint`)
- No separate CI service detected

**Build Process:**
- `npm run build` - Next.js production build
- `npm start` - Start production server

## Environment Configuration

**Required env vars (from .env.example):**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public JWT key
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side JWT key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe client key
- `STRIPE_SECRET_KEY` - Stripe server key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signature secret
- `STRIPE_STARTER_PRICE_ID` - Stripe product price ID
- `STRIPE_PRO_PRICE_ID` - Stripe product price ID
- `STRIPE_ENTERPRISE_PRICE_ID` - Stripe product price ID
- `NEXT_PUBLIC_APP_URL` - Application base URL
- `SMTP_HOST` - Email server hostname (optional)
- `SMTP_PORT` - Email server port (optional)
- `SMTP_USER` - Email account username (optional)
- `SMTP_PASS` - Email account password (optional)
- `EMAIL_FROM` - Sender email address (optional)
- `CRON_SECRET` - Secure token for cron jobs (optional)
- `GOOGLE_API_KEY` - Google Custom Search API key (optional)
- `GOOGLE_CSE_ID` - Google Custom Search Engine ID (optional)

**Secrets location:**
- Development: `.env.local` (git-ignored)
- Production: Vercel environment settings (managed via Vercel dashboard)

## Email Service

**SMTP Configuration:**
- Nodemailer 6.9.16 - Email library for alerts and notifications
  - Server: Configurable (defaults to Gmail SMTP)
  - Port: Default 587 (TLS)
  - Auth: Username/password
  - Location: `src/lib/email.ts`
  - Features:
    - Threat alerts (critical, high, medium severity)
    - Daily digest emails
    - Welcome emails for new users
  - Templates: HTML email templates with threat data and call-to-action buttons

## Webhooks & Callbacks

**Incoming (Stripe):**
- `POST /api/stripe/webhook` - Stripe event handling
  - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
  - Signature verification: Stripe webhook signature validation
  - Used for: Subscription lifecycle management, user tier updates
  - Location: `src/app/api/stripe/webhook/route.ts`

**Outgoing (Optional):**
- Custom webhook support (defined in `src/lib/webhooks.ts`)
  - Events: `threat.detected`, `scan.completed`, `threat.resolved`
  - Signature: HMAC-SHA256 signing via `X-DoppelDown-Signature` header
  - Location: `src/lib/webhooks.ts`
  - Used for: Notifying external systems of brand threats
  - Not actively wired into current API routes (future enhancement)

## Automated Tasks

**Cron Jobs (Vercel):**
- Path: `/api/cron/scan`
- Schedule: `0 */6 * * *` (every 6 hours)
- Purpose: Automated brand threat scans for monitored brands
- Auth: Protected via `CRON_SECRET` environment variable
- Location: `src/app/api/cron/scan/route.ts`

## Third-Party Service Integration Points

**Evidence Collection:**
- Screenshot capture via puppeteer-core (headless Chrome)
- PDF generation via jspdf + html2canvas for takedown reports
- WHOIS data collection via public APIs

**Social Media Scanning:**
- No SDK integration - Uses public URLs and pattern matching
- Platforms: Facebook, Instagram, Twitter/X, LinkedIn, TikTok, YouTube, Telegram, Discord
- Detection method: URL pattern matching for fake accounts
- Location: `src/lib/social-scanner.ts`

---

*Integration audit: 2026-01-23*
