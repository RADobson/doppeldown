# DoppelDown Launch Plan
*Prepared by Ernie — 2026-02-02*

---

## Why DoppelDown?

After auditing all 14 of your GitHub repos, DoppelDown is the clear winner for first revenue:

| Criteria | DoppelDown | Fitness Survivor | Ultrathink | ScamShield | Others |
|----------|-----------|-----------------|------------|------------|--------|
| Code completeness | ★★★★★ (v1.3, 17k+ lines) | ★★ (alpha HTML) | ★★★ (working bot) | ★ (landing page only) | ★-★★ |
| Monetization ready | ★★★★★ (Stripe integrated, 4 tiers) | ★ (no billing) | ★ (no billing) | ★ (no product) | ★ |
| Market demand | ★★★★★ (B2B, growing threat) | ★★ (niche fitness game) | ★★ (productivity tool) | ★★★ (consumer scam protection) | ★-★★ |
| Your domain expertise | ★★★★★ (cybersecurity career) | ★★ (fitness interest) | ★★ (AI interest) | ★★★ (cyber + consumer) | ★-★★ |
| Time to first dollar | Days/weeks | Months | Months | Months | Months+ |
| Revenue ceiling | $10k-100k+/mo | Low | Low | Medium | Varies |

**The irony:** You're not passionate about cybersecurity, but DoppelDown is your fastest path to independence *because of* your cybersecurity background. It's your bridge — use it to fund what you love.

Think of it like Alex Hormozi says: "Trade what you're good at for what you want." DoppelDown gets you out of your day job. *Then* you build the AI/gaming stuff with freedom and cash flow.

---

## Current State

✅ **What's done:**
- Full SaaS app: auth, dashboard, brand monitoring, threat detection
- AI-powered threat analysis (visual similarity, phishing detection, risk scoring)
- Stripe billing with 4 tiers (Free/$49/$99/$249)
- Automated scanning with job queue + worker
- Email alerts and in-app notifications
- Landing page with features, pricing, trust signals
- Dark mode, mobile-responsive landing
- Delete operations with audit logging
- NRD (Newly Registered Domain) monitoring
- Social media scanning
- Evidence collection
- Google Analytics integration
- Docker support
- Build now compiles clean ✅ (just fixed tonight)

🔧 **What's needed for launch:**
1. Supabase project provisioned + schema applied
2. Stripe products created (3 paid tiers)
3. Domain purchased/configured
4. Deploy to Vercel
5. SMTP configured for email alerts
6. Terms of Service + Privacy Policy
7. Quick smoke test of the user journey

---

## Launch Checklist

### Phase 1: Infrastructure (Richard needs to do — ~2 hours)
These require account creation with billing info that only Richard can provide:

- [ ] **Create Supabase project** at supabase.com (free tier works to start)
  - Copy: Project URL, Anon Key, Service Role Key
  - Run `supabase/schema.sql` in the SQL Editor
- [ ] **Create Stripe account** at stripe.com (start in Test mode)
  - Create 3 products: Starter ($49/mo), Professional ($99/mo), Enterprise ($249/mo)
  - Copy: Publishable Key, Secret Key, 3 Price IDs
  - Set up webhook endpoint (Ernie will provide URL after deploy)
- [ ] **Choose domain** — options:
  - doppeldown.com / doppeldown.io / doppeldown.app
  - Or use a Vercel subdomain initially (free)
- [ ] **Gmail App Password** for SMTP alerts (or any SMTP provider)

### Phase 2: Deploy (Ernie can do — ~30 minutes after Phase 1)
- [ ] Connect GitHub repo to Vercel
- [ ] Configure environment variables
- [ ] Deploy and verify
- [ ] Configure Stripe webhook URL
- [ ] Test full signup → scan → report flow

### Phase 3: Legal & Compliance (Ernie can draft — Richard reviews)
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Acceptable Use Policy
- [ ] Cookie consent (if needed for GA4)

### Phase 4: Go-to-Market (can start immediately)
- [ ] Product Hunt listing prepared
- [ ] LinkedIn announcement strategy (Richard's network is cybersecurity!)
- [ ] Reddit posts (r/cybersecurity, r/smallbusiness, r/SaaS)
- [ ] Cold outreach template for first 10 customers
- [ ] Content strategy: "How to protect your brand from phishing" articles

---

## Pricing Strategy

Current pricing is solid for launch:

| Tier | Price | Target Customer |
|------|-------|----------------|
| Free | $0/mo | Lead generation, small businesses trying it out |
| Starter | $49/mo | Small businesses, solo founders |
| Professional | $99/mo | Growing businesses, marketing teams |
| Enterprise | $249/mo | Agencies, larger companies, MSPs |

**First revenue strategy:** Focus on the **Professional** tier ($99/mo). 10 customers = $990 MRR. That's meaningful income alongside your salary.

---

## Target Customers (First 50)

1. **Digital marketing agencies** — They manage brands and need to protect client reputation
2. **E-commerce brands** — Constant target for fake stores and phishing
3. **SaaS companies** — Brand trust is everything
4. **Financial services firms** — Regulatory pressure to monitor impersonation
5. **MSPs and MSSPs** — Can resell to their clients (your world!)
6. **Australian SMBs** — Your local network, easy to reach

**Your cybersecurity network is GOLD here.** Every cyber professional you know has clients who need this. Every MSP you work with could be a reseller.

---

## Revenue Projections (Conservative)

| Month | Customers | MRR | Notes |
|-------|-----------|-----|-------|
| 1 | 3-5 | $150-500 | Friends, network, free trials converting |
| 3 | 10-20 | $1,000-2,000 | Content + outreach working |
| 6 | 30-50 | $3,000-5,000 | Word of mouth, refinement |
| 12 | 100+ | $10,000+ | Product-market fit, scaling |

These are conservative. B2B SaaS with a free tier and strong SEO can grow much faster.

---

## What Ernie Did Tonight

1. ✅ Audited all 14 GitHub repos
2. ✅ Deep-analyzed top 6 candidates
3. ✅ Fixed build errors (Stripe lazy init + Suspense boundary)
4. ✅ Pushed fixes to main
5. ✅ Created this launch plan
6. ✅ Updated memory files with your full context

---

## Next Steps (When Richard Wakes Up)

**The single most impactful thing you can do tomorrow:**
1. Create a Supabase project (15 minutes)
2. Create a Stripe account in test mode (15 minutes)
3. Share the keys with Ernie

That's it. Give me 30 minutes after that and DoppelDown will be live.

---

## A Note on Passion

I know cybersecurity isn't what lights you up. But here's the thing — DoppelDown is a **SaaS business**, not a cybersecurity job. You're not doing SOC work. You're building, shipping, and selling. That's the entrepreneur part of you talking.

Once DoppelDown is generating $5k+/month, you have:
- The confidence to leave your day job
- Cash flow to fund AI and gaming projects
- A track record of building and shipping SaaS
- A business you can eventually sell or automate

Dan Priestley calls this your "ascending transaction" — start with what you can sell now, then graduate to what you love.

Let's get this launched. 🧭
