# DoppelDown — Deployment Guide

## Quick Deploy to Vercel

### 1. Connect Repository
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the `RADobson/doppeldown` GitHub repository
3. Framework: **Next.js** (auto-detected)
4. Root Directory: `.` (default)

### 2. Environment Variables
Add these in Vercel → Project Settings → Environment Variables:

| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://jbbxjpzdlndzqefzucwb.supabase.co` | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key (JWT) | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | ✅ |
| `STRIPE_SECRET_KEY` | `sk_test_...` or `sk_live_...` | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` | ✅ |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (from Stripe webhook setup) | ✅ |
| `STRIPE_STARTER_PRICE_ID` | `price_...` | ✅ |
| `STRIPE_PRO_PRICE_ID` | `price_...` | ✅ |
| `STRIPE_ENTERPRISE_PRICE_ID` | `price_...` | ✅ |
| `CRON_SECRET` | Any random string (protects cron endpoints) | ✅ |
| `NEXT_PUBLIC_APP_URL` | `https://doppeldown.com` | ✅ |
| `SMTP_HOST` | `smtp.gmail.com` (or your provider) | For alerts |
| `SMTP_PORT` | `587` | For alerts |
| `SMTP_USER` | Your email | For alerts |
| `SMTP_PASS` | App password | For alerts |
| `EMAIL_FROM` | `alerts@doppeldown.com` | For alerts |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | `G-XXXXXXX` | Optional |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | `AW-XXXXXXX` | Optional |

### 3. Deploy
Click **Deploy**. Vercel will build and deploy automatically.

### 4. Custom Domain
1. In Vercel → Project Settings → Domains
2. Add `doppeldown.com`
3. Add DNS records as instructed (usually CNAME or A record)
4. Wait for SSL certificate provisioning (~5 min)

### 5. Stripe Webhook
After deployment:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://doppeldown.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook signing secret → update `STRIPE_WEBHOOK_SECRET` in Vercel

### 6. Verify
- [ ] Landing page loads at doppeldown.com
- [ ] Sign up flow works
- [ ] Login works
- [ ] Dashboard loads
- [ ] Can add a brand
- [ ] Can trigger a scan
- [ ] Stripe checkout works (test mode)
- [ ] Email alerts send (if SMTP configured)
- [ ] Cron jobs appear in Vercel dashboard

## Vercel Cron Jobs (Auto-configured)
These are defined in `vercel.json`:
- **Hourly:** `/api/cron/scan` — triggers automated scans for active brands
- **Weekly (Mon 9am UTC):** `/api/cron/digest` — sends weekly email digests
- **Daily (3am UTC):** `/api/cron/nrd` — checks newly registered domains (Enterprise)

## Worker (Optional — for heavy scanning)
For production workloads, run the scan worker separately:
```bash
npm run worker:scan
```
This can run on any always-on server (Railway, Render, EC2, etc.)
The worker is optional if scan volume is low — the Vercel cron will handle light loads.
