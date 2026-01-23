# Technology Stack

**Analysis Date:** 2026-01-23

## Languages

**Primary:**
- TypeScript 5.7.2 - Full codebase (frontend, backend, API routes)
- JavaScript (JSX/TSX) - React components and Next.js pages

**Secondary:**
- CSS - Via Tailwind (no raw CSS files)

## Runtime

**Environment:**
- Node.js (implicit from Next.js/npm setup)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- Next.js 14.2.35 - Full-stack React framework with App Router
- React 18.3.1 - UI library
- React DOM 18.3.1 - DOM rendering

**Styling:**
- Tailwind CSS 3.4.17 - Utility-first CSS framework
- Autoprefixer 10.4.20 - CSS vendor prefixing
- Tailwind Merge 2.6.0 - Merge Tailwind classes without duplication

**Utilities:**
- Lucide React 0.469.0 - Icon components
- clsx 2.1.1 - Conditional class name utility
- date-fns 4.1.0 - Date/time utilities

## Key Dependencies

**Critical (Business Logic):**
- Stripe 17.4.0 - Payment processing (server-side)
- @stripe/stripe-js 8.6.0 - Payment processing (client-side)
- @supabase/supabase-js 2.47.0 - PostgreSQL database client (browser)
- @supabase/ssr 0.5.0 - Supabase SSR support (server-side)

**Web Scanning & Evidence:**
- puppeteer-core 23.11.0 - Headless browser automation (screenshots/evidence)
- whois-json 2.0.4 - WHOIS domain lookups
- html2canvas 1.4.1 - DOM to canvas/image conversion
- jspdf 2.5.2 - PDF report generation

**Notifications:**
- nodemailer 6.9.16 - Email alerts and notifications

**Build & Dev:**
- eslint 8.57.0 - JavaScript linting
- eslint-config-next 14.2.35 - Next.js ESLint config
- postcss 8.4.49 - CSS transformation
- typescript - TypeScript compiler

**Type Definitions:**
- @types/node 22.10.5
- @types/react 18.3.18
- @types/react-dom 18.3.5
- @types/nodemailer 6.4.17

## Configuration

**Environment Variables Required:**
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Stripe: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_STARTER_PRICE_ID`, `STRIPE_PRO_PRICE_ID`, `STRIPE_ENTERPRISE_PRICE_ID`
- SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`
- App: `NEXT_PUBLIC_APP_URL`
- Optional: `GOOGLE_API_KEY`, `GOOGLE_CSE_ID` (for enhanced web scanning)
- Cron: `CRON_SECRET` (for scheduled scans)

**Files:**
- `tsconfig.json` - TypeScript configuration with path alias `@/*` -> `./src/*`
- `next.config.js` - Next.js config (10mb server action body size limit)
- `tailwind.config.ts` - Tailwind theming (custom colors: primary, danger, warning, success)
- `postcss.config.js` - PostCSS plugins (tailwindcss, autoprefixer)
- `.env.local` - Local environment (actual secrets)
- `.env.example` - Environment template

**Build Configuration:**
- `package.json` scripts:
  - `dev` - Next.js dev server
  - `build` - Production build
  - `start` - Production server
  - `lint` - ESLint check
  - `setup` - Node setup script

## Platform Requirements

**Development:**
- Node.js with npm
- TypeScript 5.7.2+
- Next.js 14.2.35

**Production:**
- Vercel hosting (based on vercel.json)
- Node.js runtime
- Environment variables for all services
- Cron jobs (via Vercel Crons scheduled at `/api/cron/scan`)

## API Versions

**Stripe:**
- API version: `2025-02-24.acacia` (explicit in code)

**Supabase:**
- @supabase/ssr compatible version

---

*Stack analysis: 2026-01-23*
