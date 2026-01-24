# DoppelDown

**Take Down Brand Impostors - Phishing Detection & Fake Account Removal**

Automatically detect typosquatting domains, phishing pages, fake social media accounts, and brand impersonation. Collect evidence and generate takedown reports.

## Features

- **Domain Monitoring**: Detect 500+ typosquatting variations (homoglyphs, typos, TLD swaps)
- **Web Scanning**: Find lookalike websites and phishing pages
- **Social Media Scanning**: Detect fake accounts on Facebook, Instagram, Twitter/X, LinkedIn, TikTok, YouTube, Telegram
- **Evidence Collection**: Screenshots, WHOIS data, HTML archival
- **Takedown Reports**: Professional PDF reports ready for registrars and social platforms
- **Real-time Alerts**: Email notifications for new threats
- **Subscription Billing**: Stripe integration for recurring payments

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **Deployment**: Vercel (recommended)

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase account (free tier works)
- A Stripe account (test mode for development)
- Chromium/Chrome installed (only required where the scan worker runs)

### Setup

1. **Clone and install**:
   ```bash
   cd doppeldown
   npm install
   ```

2. **Run the setup wizard**:
   ```bash
   npm run setup
   ```
   This will guide you through:
   - Creating a Supabase project
   - Setting up the database schema
   - Configuring Stripe products
   - Creating your `.env.local` file

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open** http://localhost:3000

## Docker (includes Chromium)

This runs both the web app and the scan worker with Chromium baked in.

1. Create `.env.local` (see the environment variables section below).
2. Run:
   ```bash
   docker compose up --build
   ```
3. Open http://localhost:3000

The scan worker runs in the `worker` service. View logs with:
```bash
docker compose logs -f worker
```

## Manual Setup

If you prefer to set up manually:

### 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `supabase/schema.sql`
3. Copy your API keys from Project Settings > API

### 2. Stripe Setup

1. Create products in your Stripe dashboard:
   - Starter: $49/month
   - Professional: $99/month
   - Enterprise: $249/month
2. Copy the Price IDs for each product
3. Set up a webhook endpoint: `your-domain.com/api/stripe/webhook`

### 3. Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Evidence storage (worker)
SUPABASE_EVIDENCE_BUCKET=evidence
SUPABASE_EVIDENCE_PUBLIC=false
PUPPETEER_EXECUTABLE_PATH=/path/to/chrome
EVIDENCE_SCREENSHOTS_ENABLED=true
EVIDENCE_HTML_MAX_BYTES=1048576
EVIDENCE_SIGNED_URL_TTL_SECONDS=3600

# Brand logos + image search
SUPABASE_LOGO_BUCKET=logos
LOGO_MAX_BYTES=5242880
LOGO_SEARCH_PROVIDER=google_vision
GOOGLE_VISION_API_KEY=your_google_vision_api_key
# Optional: fallback to SerpAPI Lens if Vision returns no results
LOGO_SEARCH_FALLBACK=serpapi
# Alternatively, SerpAPI (Google Lens)
SERPAPI_API_KEY=your_serpapi_api_key
LOGO_SEARCH_MAX_RESULTS=15

# Web/social search provider
WEB_SEARCH_PROVIDER=serpapi
SOCIAL_SEARCH_PROVIDER=serpapi
# Set to false to disable fallback to DuckDuckGo when SerpAPI fails
WEB_SEARCH_FALLBACK=true
SOCIAL_SEARCH_FALLBACK=true

# OpenAI (AI analysis)
OPENAI_API_KEY=your_openai_api_key
VISION_PROVIDER=openai
OPENAI_VISION_MODEL=gpt-4o-mini
OPENAI_INTENT_MODEL=gpt-4o-mini
OPENAI_INTENT_ENABLED=true
OPENAI_VISION_ENABLED=true
PHISHING_INTENT_MAX_CHARS=4000
```

Create a Supabase Storage bucket named `evidence` (or change `SUPABASE_EVIDENCE_BUCKET`).
For public screenshot URLs, make the bucket public and set `SUPABASE_EVIDENCE_PUBLIC=true`.
For private buckets, reports use signed URLs (default 1 hour). You can also request one via `POST /api/evidence/sign`.

Create a Supabase Storage bucket named `logos` (or change `SUPABASE_LOGO_BUCKET`) and make it public so scans can fetch the logo URL for image search.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add all environment variables
5. Deploy

### Post-Deployment

1. Update `NEXT_PUBLIC_APP_URL` to your production domain
2. Add the Stripe webhook endpoint in your Stripe dashboard
3. Switch to Stripe live keys for production

## Pricing Strategy

| Plan | Price | Target Customer |
|------|-------|----------------|
| Starter | $49/mo | Small businesses, 1 brand |
| Professional | $99/mo | Growing companies, 3 brands |
| Enterprise | $249/mo | Large orgs, 10 brands |

**Revenue Goal**: 10 customers at Professional tier = $990/month

## Marketing Tips

1. **Launch on ProductHunt** - Great for B2B SaaS
2. **LinkedIn Content** - Post about brand protection, phishing trends
3. **IndieHackers** - Share your journey building this
4. **Cold Outreach** - Email marketing agencies, startup founders
5. **SEO** - Target "brand protection tool", "phishing detection", "fake account removal"
6. **Partnerships** - Domain registrars, hosting companies

## Project Structure

```
doppeldown/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   ├── auth/         # Auth pages
│   │   └── dashboard/    # Dashboard pages
│   ├── components/       # React components
│   ├── lib/              # Core utilities
│   │   ├── domain-generator.ts   # Typosquat detection
│   │   ├── web-scanner.ts        # Web scanning
│   │   ├── social-scanner.ts     # Social media scanning
│   │   ├── evidence-collector.ts # Evidence gathering
│   │   ├── report-generator.ts   # PDF reports
│   │   ├── stripe.ts             # Payment handling
│   │   └── email.ts              # Alert system
│   └── types/            # TypeScript types
├── supabase/
│   └── schema.sql        # Database schema
└── scripts/
    └── setup.js          # Setup wizard
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/brands` | GET, POST | List/create brands |
| `/api/scan` | POST, GET | Start full scan / get status |
| `/api/scan/social` | POST | Scan social media platforms only |
| `/api/reports` | POST, GET | Generate/list reports |
| `/api/stripe/checkout` | POST | Create checkout session |
| `/api/stripe/webhook` | POST | Handle Stripe events |

## Social Media Platforms Supported

- Facebook (Pages & Profiles)
- Instagram
- Twitter/X
- LinkedIn (Company Pages)
- TikTok
- YouTube
- Telegram
- Discord

## License

MIT

---

Built with Claude Code
