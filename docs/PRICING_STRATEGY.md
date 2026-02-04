# DoppelDown Pricing & Packaging Strategy

> Comprehensive analysis, competitive positioning, and actionable pricing recommendations.
> Last updated: 2026-02-05

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Market Analysis](#market-analysis)
3. [Competitive Landscape](#competitive-landscape)
4. [Current Pricing Assessment](#current-pricing-assessment)
5. [Recommended Pricing Strategy](#recommended-pricing-strategy)
6. [Feature Matrix](#feature-matrix)
7. [Value Metrics & Anchoring](#value-metrics--anchoring)
8. [Annual Pricing & Discounts](#annual-pricing--discounts)
9. [Revenue Modeling](#revenue-modeling)
10. [Implementation Plan](#implementation-plan)
11. [Pricing Page Copy & Positioning](#pricing-page-copy--positioning)

---

## Executive Summary

DoppelDown operates in the Digital Risk Protection (DRP) / Brand Protection SaaS market — a space dominated by enterprise vendors charging $2,000–$10,000+/month with opaque "contact sales" pricing. **This is DoppelDown's strategic advantage.**

### Key Recommendations

| Change | Current | Proposed | Rationale |
|--------|---------|----------|-----------|
| **Rename tiers** | Free/Starter/Pro/Enterprise | Free/Growth/Business/Enterprise | Better signals buyer maturity |
| **Raise Starter→Growth** | $49/mo | $79/mo | Underpriced for value; aligns with market |
| **Raise Pro→Business** | $99/mo | $199/mo | Captures mid-market willingness-to-pay |
| **Raise Enterprise** | $249/mo | $499/mo (self-serve) + Custom | Still 80% below enterprise competitors |
| **Add annual discount** | None | 20% off (2 months free) | Reduces churn, improves cash flow |
| **Add team seats** | N/A | Business: 3, Enterprise: 10+ | Unlocks org-level deals |
| **Add API access** | Enterprise only | Business + Enterprise | Key differentiator for technical buyers |

**Projected impact**: 2–3x revenue per customer at current volume, with clearer upgrade paths.

---

## Market Analysis

### Market Size & Dynamics

The Digital Risk Protection market is valued at ~$7.3B (2025) growing to ~$15B by 2029 (CAGR ~20%). Key drivers:

- **AI-generated phishing** has increased brand impersonation attacks by 300%+ since 2024
- **Regulatory pressure** (DORA, NIS2, SEC cybersecurity rules) mandates brand monitoring
- **SMB awareness** is growing — previously only enterprises could afford protection
- **Cost of brand attacks**: Average phishing attack costs $4.76M (IBM 2025); even for SMBs, a single successful phishing domain can cost $50K–$500K in customer trust, fraud liability, and remediation

### Buyer Segments

| Segment | Company Size | Budget | Buying Behavior | DoppelDown Tier |
|---------|-------------|--------|-----------------|-----------------|
| **Solo/Startup** | 1–10 employees | $0–$50/mo | Self-serve, price-sensitive, needs proof | Free |
| **Growing Brand** | 10–50 employees | $50–$200/mo | Self-serve, values automation | Growth |
| **Mid-Market** | 50–500 employees | $200–$1,000/mo | May involve security team, needs reports | Business |
| **Enterprise** | 500+ employees | $1,000–$10,000+/mo | Procurement, compliance-driven | Enterprise |

### Willingness to Pay (WTP) Analysis

Based on competitive positioning and value-based analysis:

- **Prevention of a single phishing attack** saves $50K–$4.7M
- **Monthly monitoring** at $199/mo = $2,388/yr, representing **0.05% of average attack cost**
- **ROI framing**: "Would you spend $200/month to prevent a $500K phishing attack?"
- **Comparable security tools** (SIEM, EDR, etc.) cost $5–$25/seat/month — DoppelDown protects the entire brand, not individual endpoints

---

## Competitive Landscape

### Direct Competitors

| Competitor | Target Market | Pricing Model | Est. Price Range | DoppelDown Advantage |
|-----------|--------------|---------------|------------------|---------------------|
| **ZeroFox** | Mid-Market / Enterprise | Bundle-based, contact sales | $2,000–$15,000/mo | 10x cheaper, self-serve, transparent |
| **BrandShield** | Enterprise | Contact sales only | $3,000–$10,000/mo | Self-serve, AI-first, no sales call needed |
| **Netcraft** | Enterprise | Contact sales only | $5,000–$25,000/mo | Accessible to SMBs, modern UX |
| **Bolster (now under CheckPhish)** | Mid-Market | Contact sales | $1,500–$5,000/mo | Transparent pricing, broader scope |
| **Red Points** | Mid-Market / Enterprise | Tiered, request pricing | $1,000–$8,000/mo | Self-serve signup, faster time-to-value |
| **PhishFort** | Enterprise | Contact sales | $2,000–$10,000/mo | Immediate access, no vendor lock-in |
| **Allure Security** | Mid-Market | Contact sales | $1,500–$5,000/mo | AI visual analysis, broader social coverage |
| **Doppel (the company)** | Enterprise | Contact sales | $3,000–$15,000/mo | SMB-friendly, self-serve, transparent |

### Indirect Competitors

| Competitor | Type | Price | Limitation vs DoppelDown |
|-----------|------|-------|------------------------|
| **dnstwist** | Open-source CLI tool | Free | No monitoring, no AI, no UI, no social |
| **PhishTank** | Community reporting | Free | Reactive only, no proactive scanning |
| **urlscan.io** | URL scanning | Free/$99–$999/mo | No brand focus, no takedown reports |
| **Have I Been Squatted** | Domain squatting checker | Free | One-time check, no monitoring |
| **Google Alerts** | Keyword monitoring | Free | No domain analysis, no AI, no evidence |

### Market Positioning Map

```
                    ENTERPRISE-FOCUSED
                          │
     BrandShield ●        │        ● Netcraft
                          │
     PhishFort ●          │     ● ZeroFox
                          │
                  Red Points ●
    ─────────────────────────────────────────
    OPAQUE PRICING        │     TRANSPARENT PRICING
                          │
              Bolster ●   │
                          │    ● DoppelDown ← HERE
          Allure ●        │      (sweet spot)
                          │
                          │
                    SMB-ACCESSIBLE
```

**DoppelDown's unique position**: The only brand protection SaaS with transparent, self-serve pricing accessible to SMBs while offering enterprise-grade AI analysis. Every competitor either requires a sales call or lacks AI-powered threat scoring.

---

## Current Pricing Assessment

### What's Working

✅ **Free tier exists** — critical for PLG (Product-Led Growth); competitors don't offer this
✅ **Self-serve Stripe checkout** — massive advantage over "contact sales" competitors
✅ **Clear feature differentiation** across tiers
✅ **AI-powered analysis** at every paid tier — not gatekept to enterprise

### What Needs Fixing

| Issue | Impact | Severity |
|-------|--------|----------|
| **Severe underpricing** — $99/mo for Pro vs. competitors at $2,000+/mo | Leaves 10–20x revenue on table | 🔴 Critical |
| **No annual billing** — missing churn reduction lever | ~15–25% higher churn than necessary | 🔴 Critical |
| **Flat naming** — "Starter" and "Pro" don't signal buyer journey | Confusion at purchase decision | 🟡 Medium |
| **No team seats** — no way to sell to organizations | Blocks mid-market expansion | 🔴 Critical |
| **Free tier too generous for $0** — 25 domain variations is enough for some SMBs | Conversion leak from Free→Paid | 🟡 Medium |
| **Inconsistent landing page vs Stripe** — Landing shows different features than Stripe config | Trust issue | 🟡 Medium |
| **Enterprise at $249 signals "not serious"** — security buyers equate low price with low quality | Credibility gap | 🔴 Critical |
| **No usage-based component** — missed expansion revenue | Linear growth only | 🟡 Medium |

### Price-to-Value Gap Analysis

```
Competitor Average (Brand Protection):     $3,000–$5,000/mo
DoppelDown Enterprise:                     $249/mo
Gap:                                       12–20x underpriced

→ Even at $499/mo, DoppelDown is 6–10x cheaper than competitors.
→ This isn't a race to the bottom — it's a credibility problem.
   Security buyers literally won't trust a $99/mo brand protection tool.
```

---

## Recommended Pricing Strategy

### Pricing Philosophy

**"Transparent Premium"** — Be the most accessible brand protection platform while charging what the value warrants. Use transparent pricing as a competitive weapon against "contact sales" incumbents.

### Tier Structure

#### 🆓 Free — "See What's Out There"
**Purpose**: Product-led acquisition funnel. Let users discover threats, then pay to monitor and act.

| Attribute | Value |
|-----------|-------|
| **Price** | $0/forever |
| **Brands** | 1 |
| **Domain Variations** | 10 (reduced from 25) |
| **Social Platforms** | 1 |
| **Scan Frequency** | Manual only, 1/week |
| **Data Retention** | 7 days |
| **AI Analysis** | Basic (domain risk only, no visual/phishing) |
| **Reports** | None |
| **Alerts** | None |
| **Team Seats** | 1 |

**Conversion hook**: Show threats detected but require upgrade to see full details, get AI analysis, or generate reports.

---

#### 🌱 Growth — "Protect Your Brand" — $79/mo ($63/mo annual)
**Purpose**: First paid tier. Solo founders, small businesses, marketing teams protecting one core brand.

| Attribute | Value |
|-----------|-------|
| **Price** | $79/mo (or $756/yr = $63/mo) |
| **Brands** | 3 |
| **Domain Variations** | 150 per brand |
| **Social Platforms** | 3 (choose from 8) |
| **Scan Frequency** | Daily automated |
| **Data Retention** | 90 days |
| **AI Analysis** | Full (domain + visual + phishing intent) |
| **Reports** | Basic takedown reports (PDF) |
| **Alerts** | Email alerts (configurable severity) |
| **Team Seats** | 1 |
| **Evidence Collection** | Screenshots + WHOIS |
| **Support** | Email (48h response) |

**Upgrade trigger**: Hitting 3-brand limit, needing faster scans, wanting team access.

---

#### 🏢 Business — "Serious Brand Defense" — $199/mo ($159/mo annual)
**Purpose**: Growing companies, security-aware teams, agencies. The **recommended** plan (highlighted).

| Attribute | Value |
|-----------|-------|
| **Price** | $199/mo (or $1,908/yr = $159/mo) |
| **Brands** | 10 |
| **Domain Variations** | 500 per brand |
| **Social Platforms** | 6 (choose from 8) |
| **Scan Frequency** | Every 6 hours |
| **Data Retention** | 1 year |
| **AI Analysis** | Full + priority processing |
| **Reports** | Detailed takedown reports + evidence packages |
| **Alerts** | Email + webhook alerts |
| **Team Seats** | 3 included (+$29/mo per additional) |
| **Evidence Collection** | Screenshots + WHOIS + HTML archival |
| **API Access** | Read-only API (1,000 calls/mo) |
| **Support** | Email (24h response) + chat |

**Upgrade trigger**: >10 brands, needing hourly monitoring, NRD feed, full API, or compliance features.

---

#### 🏛️ Enterprise — "Complete Brand Protection" — $499/mo ($399/mo annual)
**Purpose**: Larger organizations, security teams, compliance-driven buyers.

| Attribute | Value |
|-----------|-------|
| **Price** | $499/mo (or $4,788/yr = $399/mo) |
| **Brands** | Unlimited |
| **Domain Variations** | 2,500 per brand |
| **Social Platforms** | All 8 |
| **Scan Frequency** | Hourly |
| **Data Retention** | 2 years |
| **AI Analysis** | Full + priority + custom thresholds |
| **Reports** | Legal-ready reports + full evidence packages |
| **Alerts** | Email + webhook + Slack/Teams (when available) |
| **Team Seats** | 10 included (+$25/mo per additional) |
| **Evidence Collection** | Full package (screenshots, WHOIS, HTML, headers) |
| **NRD Monitoring** | ✅ Newly Registered Domains feed |
| **API Access** | Full API (10,000 calls/mo) |
| **SIEM Integration** | Export + webhooks (when available) |
| **Support** | Priority email (4h response) + chat + onboarding call |
| **Compliance** | SOC 2 readiness report, data handling docs |

---

#### 🤝 Enterprise Custom — "Your Brand, Your Rules"
**Purpose**: Large enterprises with specific needs, high-volume brands, agencies/MSPs.

| Attribute | Value |
|-----------|-------|
| **Price** | Custom (starting from $1,000/mo) |
| **Everything in Enterprise** | ✅ |
| **White-labeling** | Available |
| **Custom integrations** | Available |
| **Dedicated account manager** | ✅ |
| **Custom scan frequency** | Down to 15-minute intervals |
| **SLA** | Custom uptime/response SLA |
| **SSO/SAML** | ✅ |
| **Volume brand discounts** | Negotiated |
| **On-premise option** | Discussion basis |

---

## Feature Matrix

### Complete Feature Comparison

| Feature | Free | Growth ($79) | Business ($199) | Enterprise ($499) |
|---------|:----:|:------------:|:---------------:|:-----------------:|
| | | | **★ RECOMMENDED** | |
| **BRAND MONITORING** | | | | |
| Brands monitored | 1 | 3 | 10 | Unlimited |
| Domain variations per brand | 10 | 150 | 500 | 2,500 |
| Typosquat detection | ✅ | ✅ | ✅ | ✅ |
| Homoglyph detection | ✅ | ✅ | ✅ | ✅ |
| TLD swap detection | ✅ | ✅ | ✅ | ✅ |
| Bitsquat detection | — | ✅ | ✅ | ✅ |
| Keyboard proximity | — | ✅ | ✅ | ✅ |
| | | | | |
| **SOCIAL MEDIA** | | | | |
| Platforms monitored | 1 | 3 | 6 | All 8 |
| Platform selection | — | ✅ | ✅ | ✅ |
| Fake account detection | Basic | ✅ | ✅ | ✅ |
| | | | | |
| **SCANNING** | | | | |
| Automated scans | — | Daily | Every 6h | Hourly |
| Manual scan quota | 1/week | Unlimited | Unlimited | Unlimited |
| NRD monitoring | — | — | — | ✅ |
| Scan history | 7 days | 90 days | 1 year | 2 years |
| | | | | |
| **AI ANALYSIS** | | | | |
| Domain risk scoring | ✅ | ✅ | ✅ | ✅ |
| Visual similarity (AI Vision) | — | ✅ | ✅ | ✅ |
| Phishing intent detection | — | ✅ | ✅ | ✅ |
| Composite threat scoring | — | ✅ | ✅ | ✅ |
| Priority AI processing | — | — | ✅ | ✅ |
| Custom scoring thresholds | — | — | — | ✅ |
| | | | | |
| **EVIDENCE & REPORTING** | | | | |
| Threat dashboard | ✅ | ✅ | ✅ | ✅ |
| Screenshots | — | ✅ | ✅ | ✅ |
| WHOIS data | — | ✅ | ✅ | ✅ |
| HTML archival | — | — | ✅ | ✅ |
| Basic takedown reports | — | ✅ | ✅ | ✅ |
| Detailed evidence packages | — | — | ✅ | ✅ |
| Legal-ready reports | — | — | — | ✅ |
| | | | | |
| **ALERTS & NOTIFICATIONS** | | | | |
| In-app notifications | ✅ | ✅ | ✅ | ✅ |
| Email alerts | — | ✅ | ✅ | ✅ |
| Severity configuration | — | ✅ | ✅ | ✅ |
| Scan summary emails | — | ✅ | ✅ | ✅ |
| Weekly digest | — | ✅ | ✅ | ✅ |
| Webhook alerts | — | — | ✅ | ✅ |
| Slack/Teams (future) | — | — | — | ✅ |
| | | | | |
| **TEAM & ACCESS** | | | | |
| Team seats | 1 | 1 | 3 (+$29/seat) | 10 (+$25/seat) |
| Role-based access | — | — | ✅ | ✅ |
| API access | — | — | Read-only | Full |
| API calls/month | — | — | 1,000 | 10,000 |
| SSO/SAML | — | — | — | Custom |
| | | | | |
| **SUPPORT** | | | | |
| Knowledge base | ✅ | ✅ | ✅ | ✅ |
| Email support | — | 48h response | 24h response | 4h response |
| Chat support | — | — | ✅ | ✅ |
| Onboarding call | — | — | — | ✅ |
| Dedicated CSM | — | — | — | Custom |
| | | | | |
| **DATA & COMPLIANCE** | | | | |
| Data retention | 7 days | 90 days | 1 year | 2 years |
| Audit logging | — | — | ✅ | ✅ |
| Data export | — | — | CSV | CSV + API |
| Compliance docs | — | — | — | ✅ |

---

## Value Metrics & Anchoring

### How to Frame the Price

The most effective pricing communication anchors against the **cost of not having protection**, not against the monthly fee.

#### Value Anchors by Tier

**Growth ($79/mo)**:
> "A single typosquatting domain can steal $50,000+ in customer trust and revenue. DoppelDown monitors your brand 24/7 for less than the cost of a team lunch."

**Business ($199/mo)**:
> "The average phishing attack costs $4.76M. DoppelDown's AI catches threats before they reach your customers — for less than 0.05% of that cost."

**Enterprise ($499/mo)**:
> "Enterprise brand protection typically costs $3,000–$10,000/month. DoppelDown delivers the same AI-powered detection, evidence collection, and takedown reports at a fraction of the cost — with no sales call required."

### Price-per-Brand Economics

| Tier | Monthly Price | Brands | Price per Brand |
|------|-------------|--------|-----------------|
| Growth | $79 | 3 | $26.33/brand |
| Business | $199 | 10 | $19.90/brand |
| Enterprise | $499 | Unlimited | → $0 marginal |

**Messaging**: "As you grow, your per-brand cost drops. Enterprise customers monitoring 50+ brands pay less than $10/brand/month."

### Comparison Calculator (for pricing page)

```
┌─────────────────────────────────────────────────┐
│  What does brand protection really cost?         │
│                                                  │
│  Manual monitoring (your team's time):           │
│  └─ 10 hrs/week × $75/hr = $3,000/month         │
│                                                  │
│  Enterprise vendor (BrandShield, ZeroFox):       │
│  └─ $3,000–$10,000/month + setup fees            │
│                                                  │
│  DoppelDown Business:                            │
│  └─ $199/month — AI-powered, self-serve          │
│                                                  │
│  You save: $2,800–$9,800/month                   │
│  That's $33,600–$117,600/year.                   │
└─────────────────────────────────────────────────┘
```

---

## Annual Pricing & Discounts

### Annual Billing (20% discount = 2 months free)

| Tier | Monthly | Annual (per month) | Annual Total | Savings |
|------|---------|-------------------|-------------|---------|
| Growth | $79/mo | $63/mo | $756/yr | $192/yr |
| Business | $199/mo | $159/mo | $1,908/yr | $480/yr |
| Enterprise | $499/mo | $399/mo | $4,788/yr | $1,200/yr |

**Why 20%**:
- Industry standard for B2B SaaS is 15–20%
- 20% is clean ("2 months free" messaging)
- Significantly reduces churn (annual customers churn 3–5x less)
- Improves cash flow and LTV forecasting

### Promotional Pricing (Launch Phase)

For the first 6 months post-launch, consider:

| Promo | Details | Purpose |
|-------|---------|---------|
| **Founder's Rate** | 40% off annual for first 50 customers, locked for life | Early adopter acquisition |
| **"Scan Your Brand Free"** | Full scan demo before signup | Conversion optimization |
| **14-day trial** on Business tier | No credit card required | Reduce friction |
| **Agency Partner Program** | 30% discount for resellers managing 5+ client brands | Channel sales |

---

## Revenue Modeling

### Conservative Scenario (Year 1)

Based on cold outreach GTM with 2–3 customers/month ramp:

| Month | Free | Growth | Business | Enterprise | MRR |
|-------|------|--------|----------|------------|-----|
| 1–3 | 50 | 3 | 1 | 0 | $436 |
| 4–6 | 150 | 8 | 3 | 1 | $1,728 |
| 7–9 | 300 | 15 | 7 | 2 | $3,583 |
| 10–12 | 500 | 22 | 12 | 3 | $5,615 |

**Year 1 total ARR**: ~$67,000

### Moderate Scenario (Year 1) — with ProductHunt + content marketing

| Month | Free | Growth | Business | Enterprise | MRR |
|-------|------|--------|----------|------------|-----|
| 1–3 | 200 | 8 | 3 | 0 | $1,229 |
| 4–6 | 600 | 20 | 8 | 2 | $3,578 |
| 7–9 | 1,200 | 40 | 18 | 5 | $7,577 |
| 10–12 | 2,000 | 60 | 30 | 8 | $12,710 |

**Year 1 total ARR**: ~$152,000

### Revenue per Customer (ARPC) Comparison

| | Current Pricing | Proposed Pricing | Δ |
|--|----------------|-----------------|---|
| Growth/Starter | $49/mo | $79/mo | +61% |
| Business/Pro | $99/mo | $199/mo | +101% |
| Enterprise | $249/mo | $499/mo | +100% |
| **Blended ARPC** | ~$110/mo | ~$220/mo | **+100%** |

---

## Implementation Plan

### Phase 1: Quick Wins (Week 1–2)

These changes require minimal code changes:

- [ ] **Add annual billing toggle** to pricing page and Stripe configuration
- [ ] **Update pricing copy** on landing page (can be done without tier restructuring)
- [ ] **Add value anchoring** — "Save $X vs. enterprise vendors" messaging
- [ ] **Create Stripe products** for new price points (keep old ones for existing customers)

### Phase 2: Tier Restructuring (Week 3–4)

- [ ] **Rename tiers** in `tier-limits.ts`: starter→growth, professional→business
- [ ] **Update tier limits** per new structure
- [ ] **Reduce Free tier** domain variations: 25→10
- [ ] **Remove AI analysis** (visual + phishing) from Free tier
- [ ] **Add data retention limits** to tier configuration
- [ ] **Create new Stripe price IDs** for $79, $199, $499
- [ ] **Update Pricing.tsx** component with new tier names, prices, features
- [ ] **Grandfather existing customers** at their current pricing

### Phase 3: New Features to Support Pricing (Week 5–8)

- [ ] **Team seats** — multi-user support with role-based access
- [ ] **API access** — rate-limited API keys per tier
- [ ] **Webhook alerts** — for Business+ tiers
- [ ] **Data retention enforcement** — auto-cleanup per tier policy
- [ ] **Usage dashboard** — show customers how much of their plan they're using

### Phase 4: Pricing Page Optimization (Ongoing)

- [ ] **A/B test** pricing page layouts
- [ ] **Add comparison calculator** (DoppelDown vs. manual monitoring vs. enterprise vendors)
- [ ] **Add social proof** (customer count, threats detected, takedowns generated)
- [ ] **Add FAQ section** addressing common pricing objections

### Migration Strategy for Existing Customers

| Customer Type | Action |
|---------------|--------|
| Free users | Auto-migrated to new Free limits (10 domains) with 30-day grace period |
| Paying customers | **Grandfathered** at current price indefinitely; new price on plan change |
| Trial users | Migrated to new pricing immediately |

---

## Pricing Page Copy & Positioning

### Headline Options (A/B test)

**Option A (Pain-focused)**:
> "Stop Brand Impersonators Before They Strike"
> AI-powered brand protection, starting at $0. No sales call required.

**Option B (Value-focused)**:
> "Enterprise Brand Protection at Startup Prices"
> The same AI analysis that Fortune 500 companies use — transparent pricing, instant setup.

**Option C (Comparison-focused)**:
> "Brand Protection Without the $10,000/Month Price Tag"
> AI-powered typosquatting detection, phishing analysis, and takedown reports. Self-serve from $79/mo.

### Per-Tier Taglines

| Tier | Tagline | Target Emotion |
|------|---------|----------------|
| Free | "See what's lurking" | Curiosity / fear |
| Growth | "Protect what you've built" | Pride / responsibility |
| Business | "Defend your brand at scale" | Confidence / control |
| Enterprise | "Complete brand protection" | Security / authority |

### Objection Handling (FAQ)

**"Why is DoppelDown so much cheaper than BrandShield or ZeroFox?"**
> We're built lean — AI-first architecture, self-serve model, no enterprise sales team eating margins. You get the same threat detection technology without the enterprise markup.

**"Is the Free tier really free?"**
> Yes, forever. Monitor 1 brand with domain risk scoring. We built it because we believe every brand deserves basic protection. Upgrade when you need AI analysis, automation, and reports.

**"I'm just one person. Do I need the Business plan?"**
> If you have 1–3 brands, Growth has everything you need. Business is for teams that need collaboration features, API access, and faster scanning across more brands.

**"What happens to my data if I downgrade?"**
> Your data is retained per your previous tier's retention period. After that window, older data is archived. You can export everything before downgrading.

**"Can I switch between monthly and annual?"**
> Yes, anytime. Switch to annual and your discount applies immediately. Switch to monthly and it takes effect at your next billing cycle.

**"Do you offer discounts for nonprofits or startups?"**
> Yes! Contact us for our nonprofit program (50% off) or check if you qualify through our startup partner programs.

---

## Appendix: Code Changes Required

### `tier-limits.ts` — New Configuration

```typescript
export type TierName = 'free' | 'growth' | 'business' | 'enterprise'

export const TIER_LIMITS: Record<TierName, TierLimits> = {
  free: {
    brands: 1,
    variationLimit: 10,        // was 25
    socialPlatforms: 1,
    scanFrequencyHours: null,
    nrdMonitoring: false,
    dataRetentionDays: 7,      // NEW
    teamSeats: 1,              // NEW
    aiVisualAnalysis: false,   // NEW — domain risk only
    aiPhishingIntent: false,   // NEW
    reports: false,            // NEW
    emailAlerts: false,        // NEW
    webhookAlerts: false,      // NEW
    apiAccess: false,          // NEW
    apiCallsPerMonth: 0,       // NEW
    auditLogging: false,       // NEW
    htmlArchival: false,       // NEW
  },
  growth: {
    brands: 3,
    variationLimit: 150,       // was 100
    socialPlatforms: 3,
    scanFrequencyHours: 24,
    nrdMonitoring: false,
    dataRetentionDays: 90,
    teamSeats: 1,
    aiVisualAnalysis: true,
    aiPhishingIntent: true,
    reports: true,             // basic
    emailAlerts: true,
    webhookAlerts: false,
    apiAccess: false,
    apiCallsPerMonth: 0,
    auditLogging: false,
    htmlArchival: false,
  },
  business: {
    brands: 10,
    variationLimit: 500,
    socialPlatforms: 6,
    scanFrequencyHours: 6,
    nrdMonitoring: false,
    dataRetentionDays: 365,
    teamSeats: 3,
    aiVisualAnalysis: true,
    aiPhishingIntent: true,
    reports: true,             // detailed + evidence
    emailAlerts: true,
    webhookAlerts: true,
    apiAccess: true,           // read-only
    apiCallsPerMonth: 1000,
    auditLogging: true,
    htmlArchival: true,
  },
  enterprise: {
    brands: Infinity,
    variationLimit: 2500,
    socialPlatforms: 8,
    scanFrequencyHours: 1,
    nrdMonitoring: true,
    dataRetentionDays: 730,    // 2 years
    teamSeats: 10,
    aiVisualAnalysis: true,
    aiPhishingIntent: true,
    reports: true,             // legal-ready
    emailAlerts: true,
    webhookAlerts: true,
    apiAccess: true,           // full
    apiCallsPerMonth: 10000,
    auditLogging: true,
    htmlArchival: true,
  },
}
```

### `stripe.ts` — New Price Configuration

```typescript
export const PLANS = {
  growth: {
    name: 'Growth',
    priceMonthly: 7900,       // $79/month
    priceAnnual: 63300,       // $63.25/month billed annually ($759/yr)
    priceIdMonthly: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID || '',
    priceIdAnnual: process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID || '',
    // ...features
  },
  business: {
    name: 'Business',
    priceMonthly: 19900,      // $199/month
    priceAnnual: 15900,       // $159/month billed annually ($1,908/yr)
    priceIdMonthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID || '',
    priceIdAnnual: process.env.STRIPE_BUSINESS_ANNUAL_PRICE_ID || '',
    // ...features
  },
  enterprise: {
    name: 'Enterprise',
    priceMonthly: 49900,      // $499/month
    priceAnnual: 39900,       // $399/month billed annually ($4,788/yr)
    priceIdMonthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || '',
    priceIdAnnual: process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID || '',
    // ...features
  },
}
```

### Environment Variables to Add

```env
# New Stripe Price IDs (monthly)
STRIPE_GROWTH_MONTHLY_PRICE_ID=price_...
STRIPE_BUSINESS_MONTHLY_PRICE_ID=price_...
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_...

# New Stripe Price IDs (annual)
STRIPE_GROWTH_ANNUAL_PRICE_ID=price_...
STRIPE_BUSINESS_ANNUAL_PRICE_ID=price_...
STRIPE_ENTERPRISE_ANNUAL_PRICE_ID=price_...
```

---

## Appendix: Psychological Pricing Principles Applied

| Principle | Application |
|-----------|------------|
| **Anchoring** | Show Enterprise ($499) first or show competitor pricing ($3K+) to make Business ($199) feel like a steal |
| **Decoy effect** | Growth at $79 makes Business at $199 look like the obvious best value (2.5x price for 3x+ features) |
| **Loss aversion** | Free tier shows threats but gates the details → "You have 12 threats. Upgrade to see AI analysis." |
| **Social proof** | "2,400+ brands protected" / "47,000 threats detected this month" |
| **Urgency framing** | "3 new threats detected for your brand this week" in email alerts |
| **Round number avoidance** | $79, $199, $499 (not $80, $200, $500) — perceived as more carefully calculated |
| **Default highlighting** | Business plan visually highlighted as "Most Popular" / "Recommended" |
| **Transparent comparison** | Side-by-side with enterprise competitors → makes pricing feel generous |

---

*This document should be reviewed quarterly as the product evolves, customer feedback comes in, and market conditions shift. Pricing is never "done" — it's a continuous optimization.*
