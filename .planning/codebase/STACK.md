# Technology Stack

**Analysis Date:** 2026-01-24

## Languages

**Primary:**
- TypeScript 5.7.2 - Full application codebase (React components, Node.js/Next.js backend, API routes)

**Secondary:**
- JavaScript - Configuration files, scripts (tsconfig.json, next.config.js, tailwind.config.ts)
- SQL - Database schema definition in `supabase/schema.sql`

## Runtime

**Environment:**
- Node.js 20.x (specified in Dockerfile, current runtime v24.13.0)

**Package Manager:**
- npm 11.8.0
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 14.2.35 - Full-stack React framework, handles routing, server components, API routes
- React 18.3.1 - UI component library
- React DOM 18.3.1 - React rendering for DOM

**Styling:**
- Tailwind CSS 3.4.17 - Utility-first CSS framework
- PostCSS 8.4.49 - CSS transformation
- Autoprefixer 10.4.20 - Browser vendor prefix support
- Tailwind Merge 2.6.0 - Utility class merging utility

**Testing:**
- Not detected in dependencies (no Jest, Vitest, or similar)

**Build/Dev:**
- Next.js built-in build system
- TypeScript compiler for type checking

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.47.0 - Supabase client for database and authentication
- @supabase/ssr 0.5.0 - Server-Side Rendering utilities for Supabase cookie handling
- stripe 17.4.0 - Stripe server-side SDK for payment processing and subscriptions
- @stripe/stripe-js 8.6.0 - Stripe client-side library for checkout

**Scanning & Detection:**
- puppeteer-core 23.11.0 - Headless browser for web scraping and screenshot capture
- whois-json 2.0.4 - WHOIS domain lookup and parsing

**Email:**
- nodemailer 6.9.16 - Email sending via SMTP for alerts and notifications

**Report Generation:**
- jspdf 2.5.2 - PDF document generation
- html2canvas 1.4.1 - HTML to canvas rendering (for PDF generation)

**UI Components:**
- lucide-react 0.469.0 - Icon library

**Utilities:**
- date-fns 4.1.0 - Date formatting and manipulation
- clsx 2.1.1 - Conditional class name utility
- dotenv 16.4.7 - Environment variable loading
- tsx 4.19.2 - TypeScript execution for Node.js scripts

**Development:**
- @types/node 22.10.5 - TypeScript type definitions for Node.js
- @types/react 18.3.18 - TypeScript types for React
- @types/react-dom 18.3.5 - TypeScript types for React DOM
- @types/nodemailer 6.4.17 - TypeScript types for Nodemailer
- eslint 8.57.0 - Code linting
- eslint-config-next 14.2.35 - Next.js ESLint configuration

## Configuration

**Environment:**
- Configuration via `.env.local` file (see `.env.example` for template)
- Environment variables used for:
  - Supabase connection (URL, keys)
  - Stripe API keys and webhook secret
  - Email/SMTP configuration
  - Third-party API keys (OpenAI, Google Vision, SerpAPI)
  - App configuration (base URL, scan settings)

**Build:**
- `tsconfig.json` - TypeScript configuration with path aliases (`@/*` → `./src/*`)
- `next.config.js` - Next.js config: 10MB server action body limit, image domains
- `tailwind.config.ts` - Custom Tailwind theme with primary, danger, warning, success color palettes
- `postcss.config.js` - PostCSS configuration for Tailwind processing

**Scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run setup` - Run setup script (`scripts/setup.js`)
- `npm run worker:scan` - Run scan worker (`scripts/scan-worker.ts`)

## Platform Requirements

**Development:**
- Node.js 20.x
- npm or compatible package manager
- Environment variables from `.env.example`

**Production:**
- Deployment target: Vercel (indicated by `vercel.json` configuration)
- Docker support (Dockerfile present for containerized deployment)
- Docker uses Node.js 20-slim with Chromium pre-installed for Puppeteer
- Cron jobs: `0 */6 * * *` (every 6 hours) via Vercel Cron

**Browser Support:**
- Modern browsers (Chrome, Firefox, Safari, Edge) - Tailwind CSS v3 compatible
- Chromium (for screenshot capture and web scanning via Puppeteer)

---

*Stack analysis: 2026-01-24*
