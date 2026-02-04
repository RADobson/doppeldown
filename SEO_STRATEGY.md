# DoppelDown Comprehensive SEO Strategy & Playbook
*Prepared: 2026-02-05*
*Last updated: 2026-02-05*

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Audit](#2-current-state-audit)
3. [Keyword Research & Strategy](#3-keyword-research--strategy)
4. [On-Page Content Optimization Plan](#4-on-page-content-optimization-plan)
5. [Technical SEO Audit & Recommendations](#5-technical-seo-audit--recommendations)
6. [Content Strategy & Publishing Calendar](#6-content-strategy--publishing-calendar)
7. [Backlink & Off-Page Strategy](#7-backlink--off-page-strategy)
8. [Local & Geo-Targeted SEO](#8-local--geo-targeted-seo)
9. [Measurement & KPIs](#9-measurement--kpis)
10. [90-Day Action Plan](#10-90-day-action-plan)

---

## 1. Executive Summary

### The Opportunity

DoppelDown operates in a market where **every competitor hides behind "Contact Sales"** and publishes zero educational content for SMBs. This creates three massive SEO advantages:

1. **Pricing transparency keywords are uncontested** — "brand protection pricing," "brand protection cost," competitor pricing queries — no one answers these well because no one publishes prices.
2. **SMB-oriented brand protection content barely exists** — the entire educational space is written for enterprise security teams. There's a wide-open content gap for practical, accessible content targeting small business owners and marketing teams.
3. **Competitor comparison queries are ripe for capture** — people searching "[competitor] pricing" or "[competitor] alternative" find nothing useful because competitors don't publish prices, and no affordable alternative has positioned itself to capture that traffic.

### Strategic Positioning

DoppelDown's SEO strategy centers on one core thesis:

> **Be the Wikipedia of brand protection for SMBs — the definitive, transparent, practical resource that earns Google's trust through depth, accuracy, and genuine helpfulness — while every competitor stays behind their "Contact Sales" walls.**

### Expected Impact (12-Month Horizon)

| Metric | Current (Month 0) | Month 3 Target | Month 6 Target | Month 12 Target |
|--------|-------------------|-----------------|-----------------|-----------------|
| Indexed pages | ~40 | 60 | 90 | 150+ |
| Organic monthly visitors | ~0 (new site) | 500-1,000 | 2,000-5,000 | 10,000-25,000 |
| Keywords ranking top 20 | ~0 | 30-50 | 100-200 | 400-800 |
| Keywords ranking top 3 | 0 | 5-10 | 20-40 | 80-150 |
| Domain Authority (Moz) | 0-5 | 10-15 | 20-25 | 30-40 |
| Monthly organic signups | 0 | 10-20 | 50-100 | 200-500 |

---

## 2. Current State Audit

### What's Already in Place ✅

DoppelDown has an **exceptionally strong SEO foundation** for a pre-launch SaaS. Most startups launch with zero SEO infrastructure. Here's what's already built:

| Area | Status | Assessment |
|------|--------|------------|
| **SEO Config Module** (`src/lib/seo/config.ts`) | ✅ Implemented | Centralized config with site info, OG defaults, Twitter cards, robots directives, verification codes |
| **Metadata Generation** (`src/lib/seo/metadata.ts`) | ✅ Implemented | Template-based metadata generators for all page types (blog, industry, comparison, use-case) |
| **Structured Data** (`src/lib/seo/structured-data.ts`) | ✅ Implemented | Organization, WebSite, Article, Breadcrumb, FAQ, HowTo, SoftwareApplication, Product comparison schemas |
| **Sitemap** (`src/app/sitemap.ts`) | ✅ Implemented | Dynamic sitemap with 40+ URLs across static, industry, comparison, and blog pages |
| **Robots.txt** (`src/app/robots.ts`) | ✅ Implemented | Allows all public pages, blocks `/dashboard/` and `/api/` |
| **Canonical URL Management** (`src/lib/seo/canonical.ts`) | ✅ Implemented | Path normalization, duplicate detection, noindex patterns |
| **Keyword Management** (`src/lib/seo/keywords.ts`) | ✅ Implemented | Keyword clusters, long-tail variations, semantic relations, density analysis |
| **Performance Tools** (`src/lib/seo/performance.ts`) | ✅ Implemented | Core Web Vitals thresholds, performance budgets, image optimization, cache policies |
| **Google Site Verification** | ✅ Configured | `qZQYfJbkON0CN6vjLFUnTf99-IW2iCPFXBi_BiWLbsg` in layout.tsx |
| **Blog Content** | ✅ 17 posts | Covering typosquatting, phishing, DMARC, brand protection guides, statistics, how-to's |
| **Comparison Pages** | ✅ 6 pages | BrandShield, Red Points, PhishLabs, ZeroFox, Bolster, Allure Security |
| **Industry Pages** | ✅ 6 pages | E-commerce, Financial Services, Healthcare, SaaS/Software, Legal, Real Estate |
| **Security Headers** | ✅ Configured | HSTS, CSP, X-Frame-Options, Referrer-Policy — all set in next.config.js |
| **OG/Twitter Images** | ✅ Dynamic | `opengraph-image.tsx` and `twitter-image.tsx` for dynamic social images |

### Critical Gaps 🔴

| Gap | Impact | Priority |
|-----|--------|----------|
| **No Google Search Console property verified** | Google can't discover/index pages efficiently; can't submit sitemap properly | 🔴 Critical |
| **No `/about` page in sitemap** | Listed in sitemap-utils but may not have content; missing from live sitemap | 🔴 High |
| **No `/api-docs` page in sitemap** | Listed in sitemap-utils but not in live sitemap XML | 🟡 Medium |
| **All blog posts dated same day (2026-02-03)** | Google may view bulk-published content as lower quality vs. dripped content | 🔴 High |
| **No industry pages in live sitemap** | `INDUSTRY_PAGES` defined in code but missing from rendered sitemap.xml | 🔴 High |
| **`www` vs non-`www` inconsistency** | Site redirects to `www.doppeldown.com` but canonical/config uses `doppeldown.com` | 🔴 Critical |
| **Pricing page renders as empty** | `/pricing` returned only the title tag via web_fetch — may be client-side-only rendering | 🔴 Critical |
| **No internal linking strategy** | Blog posts and pages exist in silos; no systematic cross-linking | 🟡 High |
| **No link-building or off-page SEO** | Domain Authority is ~0; no external links pointing to the site | 🔴 High |
| **Missing `use-cases` sub-pages** | Only `/use-cases/page.tsx` exists (index), no individual use-case pages | 🟡 Medium |
| **No `hreflang` implementation** | Not needed yet, but Australian market targeting needs geo signals | 🟡 Low |

---

## 3. Keyword Research & Strategy

### Keyword Universe: Four Pillars

DoppelDown's keyword strategy is organized into four pillars, each mapped to a stage in the buyer's journey:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐     ┌──────────────┐
│   AWARENESS      │────▶│   CONSIDERATION   │────▶│    DECISION     │────▶│   RETENTION  │
│  "What is this?" │     │  "How do I fix?"  │     │  "Which tool?"  │     │ "Best use"   │
│                  │     │                   │     │                 │     │              │
│ Educational      │     │ Solution-aware    │     │ Product-aware   │     │ Customer     │
│ content          │     │ content           │     │ content         │     │ content      │
└─────────────────┘     └──────────────────┘     └─────────────────┘     └──────────────┘
```

### Pillar 1: Awareness Keywords (Top of Funnel)

**Goal:** Capture people who have a problem but don't know a solution exists.

| Keyword / Cluster | Est. Search Volume | Difficulty | Content Type | Status |
|-------------------|-------------------|------------|-------------|--------|
| what is typosquatting | 2,400/mo | Low | Blog post | ✅ Published |
| what is domain squatting | 1,900/mo | Low | Blog post | ✅ Published |
| how to check if website is legitimate | 8,100/mo | Medium | Blog post | ✅ Published |
| phishing attack statistics 2026 | 3,600/mo | Low-Med | Blog post | ✅ Published |
| brand impersonation statistics | 1,300/mo | Low | Blog post | ✅ Published |
| how cybercriminals clone websites | 1,600/mo | Low | Blog post | ✅ Published |
| dmarc spf dkim explained | 4,400/mo | Medium | Blog post | ✅ Published |
| what is brand impersonation | 1,200/mo | Low | Blog post | 🔲 Needed |
| types of phishing attacks | 6,600/mo | Medium | Blog post | 🔲 Needed |
| how to identify fake social media accounts | 2,900/mo | Low | Blog post | 🔲 Needed |
| what is homoglyph attack | 720/mo | Very Low | Blog post | 🔲 Needed |
| social media impersonation | 2,400/mo | Low-Med | Blog post | 🔲 Needed |
| domain spoofing vs phishing | 880/mo | Low | Blog post | 🔲 Needed |
| how to tell if email is spoofed | 5,400/mo | Medium | Blog post | 🔲 Needed |

### Pillar 2: Consideration Keywords (Middle of Funnel)

**Goal:** Capture people actively seeking solutions or learning how to fix the problem.

| Keyword / Cluster | Est. Search Volume | Difficulty | Content Type | Status |
|-------------------|-------------------|------------|-------------|--------|
| how to protect brand from phishing | 880/mo | Low | Blog post | ✅ Published |
| how to report phishing website | 3,300/mo | Medium | Blog post | ✅ Published |
| what to do when someone impersonates your business | 720/mo | Very Low | Blog post | ✅ Published |
| how to monitor your brand online | 1,300/mo | Low-Med | Blog post | ✅ Published |
| brand protection for small business | 590/mo | Low | Blog post | ✅ Published |
| how to check if someone registered domain similar to yours | 480/mo | Very Low | Blog post | ✅ Published |
| free vs paid brand protection | 320/mo | Very Low | Blog post | ✅ Published |
| **brand protection pricing** | 1,600/mo | **Very Low** | **Landing page** | 🔲 **HIGHEST PRIORITY** |
| **how much does brand protection cost** | 880/mo | **Very Low** | **Landing page / Blog** | 🔲 **HIGHEST PRIORITY** |
| phishing takedown process | 590/mo | Low | Blog post | 🔲 Needed |
| how to remove fake website | 1,900/mo | Low-Med | Blog post | 🔲 Needed |
| how to get fake social media account taken down | 2,400/mo | Low | Blog post | 🔲 Needed |
| domain monitoring tools | 720/mo | Low | Blog post / Landing | 🔲 Needed |
| brand protection tools for startups | 320/mo | Very Low | Blog post | 🔲 Needed |
| cybersquatting legal remedies | 480/mo | Low | Blog post | 🔲 Needed |
| UDRP process explained | 590/mo | Low | Blog post | 🔲 Needed |

### Pillar 3: Decision Keywords (Bottom of Funnel)

**Goal:** Capture people comparing tools, ready to buy.

| Keyword / Cluster | Est. Search Volume | Difficulty | Content Type | Status |
|-------------------|-------------------|------------|-------------|--------|
| brandshield alternative | 390/mo | Very Low | Comparison page | ✅ Published |
| brandshield pricing | 480/mo | Very Low | Comparison page | ✅ Published |
| red points alternative | 320/mo | Very Low | Comparison page | ✅ Published |
| phishlabs alternative | 210/mo | Very Low | Comparison page | ✅ Published |
| zerofox alternative | 260/mo | Very Low | Comparison page | ✅ Published |
| bolster ai alternative | 170/mo | Very Low | Comparison page | ✅ Published |
| allure security alternative | 110/mo | Very Low | Comparison page | ✅ Published |
| brand protection software comparison | 720/mo | Low | Blog / Landing | 🔲 Needed |
| best brand protection tools 2026 | 590/mo | Low-Med | Blog post | 🔲 Needed |
| netcraft brand protection pricing | 320/mo | Very Low | Comparison page | 🔲 Needed |
| mimecast brand exploit protect pricing | 260/mo | Very Low | Comparison page | 🔲 Needed |
| proofpoint brand protection alternative | 170/mo | Very Low | Comparison page | 🔲 Needed |
| appdetex alternative | 140/mo | Very Low | Comparison page | 🔲 Needed |
| cheap brand protection software | 390/mo | Very Low | Landing page | 🔲 Needed |
| self-serve brand protection | 110/mo | Very Low | Landing page | 🔲 Needed |

### Pillar 4: Retention & Expansion Keywords

**Goal:** Existing customers searching for help; also positions DoppelDown as the expert.

| Keyword / Cluster | Content Type | Status |
|-------------------|-------------|--------|
| how to set up brand monitoring | Tutorial / Help Doc | 🔲 Needed |
| how to read a phishing report | Tutorial | 🔲 Needed |
| brand protection checklist | Downloadable / Blog | 🔲 Needed |
| monthly brand security review template | Downloadable / Blog | 🔲 Needed |
| how to write a takedown request | Template / Blog | 🔲 Needed |

### The "Golden Keywords" — Highest ROI Targets

These are keywords where DoppelDown has a **unique structural advantage** because competitors either can't or won't compete:

| # | Keyword | Why It's Golden | Difficulty | Action |
|---|---------|-----------------|------------|--------|
| 1 | **brand protection pricing** | Nobody publishes prices. DoppelDown can own this SERP. | Very Low | Create definitive pricing comparison page |
| 2 | **brand protection cost** | Same as above — buyers searching, no answers | Very Low | Same page, secondary keyword |
| 3 | **[competitor] pricing** (×6) | Every competitor hides pricing. DoppelDown can answer. | Very Low | Optimize comparison pages |
| 4 | **[competitor] alternative** (×6) | Frustrated enterprise shoppers need affordable options | Very Low | Already have pages; optimize + add content |
| 5 | **brand protection for small business** | Enterprise competitors don't target this audience | Low | Already published; optimize |
| 6 | **free brand protection tools** | Top-of-funnel magnet → free tier conversion | Low | Create definitive roundup |
| 7 | **how much does brand protection cost** | Question format = featured snippet opportunity | Very Low | FAQ page + blog post |

### Keyword Priority Matrix

```
                    HIGH VOLUME
                         ▲
                         │
    "how to check if     │    "phishing attack
     website legitimate" │     statistics"
         [✅ DONE]       │       [✅ DONE]
                         │
  ──────────────────────┼──────────────────── HIGH INTENT
                         │
    "brand protection    │    "[competitor]
     pricing"            │     alternative"
       [🔲 DO NEXT]     │       [✅ DONE]
                         │
                    LOW VOLUME
```

**Strategy:** Start bottom-right (high intent, lower volume — easier wins, direct conversions), then expand top-left (high volume, lower intent — traffic & authority building).

---

## 4. On-Page Content Optimization Plan

### 4.1 Homepage Optimization

**Current title:** `DoppelDown - Brand Protection That Doesn't Cost $15K/Year`
**Current meta:** `Protect your brand from phishing attacks, typosquatting, fake social accounts, and brand impersonation. AI-powered detection from $0/month — not $15K/year. Start free today.`

**Assessment:** Title and meta are strong. Good keyword inclusion, compelling value prop.

**Optimizations needed:**

| Element | Current | Recommended | Why |
|---------|---------|-------------|-----|
| H1 | "Defend your brand from impersonation attacks" | Keep as-is — good | Includes core keyword "brand" + "impersonation attacks" |
| Statistics section | Uses "0+" placeholders | Replace with real or realistic numbers | Zero-value stats damage credibility and CTR |
| Internal links | Limited | Add "Related posts" or "Learn more" links in each feature section | Distributes link equity, reduces bounce rate |
| FAQ section | Exists | Ensure FAQ schema markup is rendering | Rich results = higher CTR |
| Demo section | Interactive | Ensure it's SSR or has SSR fallback text | Google can't interact with JS demos |

### 4.2 Pricing Page — Critical Fix

**Issue:** The pricing page appears to render only client-side. When fetched without JavaScript, only the `<title>` tag returned. This means **Google sees an empty page.**

**Fix required:**
```
PRIORITY: 🔴 CRITICAL
ACTION: Ensure /pricing renders server-side (SSR or SSG)
REASON: This is the single most valuable SEO page for DoppelDown.
        "Brand protection pricing" is the #1 golden keyword.
        If Google can't read the pricing page, all pricing-related
        keywords are unreachable.
```

**Additional pricing page optimizations:**

1. **Add a "Brand Protection Pricing Comparison" section** with a full table comparing DoppelDown to BrandShield, Red Points, Netcraft, ZeroFox, Bolster (with estimated price ranges)
2. **Add FAQ schema** with questions like:
   - "How much does brand protection cost?"
   - "Is there a free brand protection tool?"
   - "What's the cheapest brand protection software?"
   - "Can I cancel my brand protection subscription?"
   - "Do I need brand protection for my small business?"
3. **Target meta description:** `"Compare brand protection pricing: DoppelDown from $0/mo vs enterprise tools at $15K-$250K/yr. Transparent pricing, no sales calls. See the full comparison."`
4. **Add long-form content below the pricing cards** — 500-800 words explaining each tier, who it's for, and how it compares to competitors. This gives Google content to index.

### 4.3 Blog Post Optimization

**Current state:** 17 published blog posts, all dated 2026-02-03.

**Issues to fix:**

1. **Stagger publication dates** — Update `publishedDate` in sitemap-utils.ts to spread posts across a 4-6 week window (backdate some, forward-date others). This signals natural content velocity to Google.

2. **Add internal cross-links** — Each blog post should link to:
   - 2-3 other related blog posts
   - The relevant comparison page (if applicable)
   - The pricing page (in the CTA section)
   - The signup page (primary CTA)

3. **Add "Table of Contents" to long posts** — Helps with "jump-to" links in SERPs and improves UX signals.

4. **Optimize featured snippet potential** — For question-based keywords, add a concise 40-60 word answer immediately after the H2 that asks the question. Google often pulls this for Position 0.

**Blog post internal linking map:**

```
typosquatting guide ←→ domain squatting guide
         ↓                      ↓
typosquatting examples    how to check domain
         ↓                      ↓
how to report phishing ←→ brand protection for SMBs
         ↓                      ↓
    DMARC/SPF guide      how to monitor brand
         ↓                      ↓
   phishing statistics   brand impersonation stats
         ↓                      ↓
   compare/brandshield ←→ compare/red-points
         ↓                      ↓
      /pricing          /auth/signup
```

### 4.4 Comparison Page Optimization

**Current state:** 6 comparison pages for major competitors.

**Optimizations:**

1. **Add estimated pricing ranges** — The #1 reason people search "[competitor] alternative" is sticker shock. Address it head-on.

2. **Add "Customer Reviews" or "What Users Say" sections** — Even if citing public reviews from G2/Capterra about the competitor. This adds E-E-A-T signals.

3. **Add migration guides** — "Switching from [Competitor] to DoppelDown" section builds confidence and captures long-tail queries.

4. **Target titles:** Use the formula: `"DoppelDown vs [Competitor]: Pricing, Features & Why SMBs Switch"`

5. **Add 3 more competitor pages:**
   - `/compare/netcraft` — Netcraft is a major player
   - `/compare/mimecast` — Mimecast Brand Exploit Protect
   - `/compare/proofpoint` — Proofpoint brand protection

### 4.5 Industry Page Optimization

**Current state:** 6 industry pages exist in code but are **not appearing in the live sitemap.xml.**

**Fix:** Ensure industry pages are included in the deployed sitemap. Check if there's a build/deployment issue preventing `INDUSTRY_PAGES` from rendering.

**Content optimization per industry page:**

| Industry | Primary Keyword | Supporting Content Needed |
|----------|----------------|--------------------------|
| E-commerce | brand protection e-commerce | "How fake stores steal your customers" blog post |
| Financial Services | brand protection financial services | "Phishing in banking: what regulators require" blog post |
| Healthcare | healthcare brand protection | "HIPAA and brand impersonation risks" blog post |
| SaaS/Software | SaaS brand protection | "Protecting your SaaS brand from lookalike domains" blog post |
| Legal | law firm brand protection | "Why law firms are phishing targets" blog post |
| Real Estate | real estate brand protection | "Real estate phishing scams and wire fraud" blog post |

### 4.6 Use-Case Pages (To Be Created)

Only the index page exists. Create individual use-case pages targeting specific buyer intents:

| Use Case | URL | Primary Keyword |
|----------|-----|----------------|
| Phishing Detection | `/use-cases/phishing-detection` | phishing detection tool |
| Domain Monitoring | `/use-cases/domain-monitoring` | domain monitoring service |
| Social Media Impersonation | `/use-cases/social-media-monitoring` | fake social media account detection |
| Takedown Assistance | `/use-cases/takedown-service` | phishing takedown service |
| Brand Monitoring | `/use-cases/brand-monitoring` | online brand monitoring |
| MSP Brand Protection | `/use-cases/msp-partner` | brand protection for MSPs |

---

## 5. Technical SEO Audit & Recommendations

### 5.1 Critical Issues (Fix Immediately)

#### Issue 1: `www` vs Non-`www` Canonical Mismatch
**Severity:** 🔴 Critical

**Problem:** The site redirects `doppeldown.com` → `www.doppeldown.com`, but `SEO_CONFIG` and all canonical URLs reference `https://doppeldown.com` (without `www`). The sitemap also uses `https://doppeldown.com`. This creates a conflict: Google may see these as two different sites.

**Fix:**
```typescript
// src/lib/seo/config.ts — update site.url
site: {
  url: 'https://www.doppeldown.com', // Match the actual redirect target
  // ...
}
```

OR configure Vercel/DNS to redirect `www` → non-`www` and keep the config as-is. **Pick one canonical domain and be consistent everywhere.**

**Files to update:**
- `src/lib/seo/config.ts` — `site.url`
- `src/app/layout.tsx` — `metadataBase`
- `src/app/robots.ts` — sitemap URL
- `vercel.json` — add redirect rule
- Google Search Console — verify both `www` and non-`www` properties

#### Issue 2: Pricing Page Client-Side Rendering
**Severity:** 🔴 Critical

**Problem:** `/pricing` appears to return empty HTML to non-JS crawlers. Google's bot can execute JavaScript, but may not wait for all client-side rendering, especially on newer or less-established domains.

**Fix:** Convert the pricing page to use Server-Side Rendering (SSR) or Static Site Generation (SSG). The pricing tiers are static data — they should be SSG'd.

```typescript
// src/app/pricing/page.tsx — ensure this uses server components
// Remove any 'use client' directive from the main page component
// Keep client interactivity in child components (toggle, CTA buttons)
```

#### Issue 3: Google Search Console Not Fully Set Up
**Severity:** 🔴 Critical

**Problem:** While Google site verification meta tag is present, the sitemap hasn't been submitted via Search Console, and index coverage can't be monitored.

**Fix:**
1. Log into [Google Search Console](https://search.google.com/search-console)
2. Add property for `https://www.doppeldown.com` (match the canonical domain)
3. Also add `https://doppeldown.com` as a property
4. Set preferred domain
5. Submit sitemap at `https://www.doppeldown.com/sitemap.xml`
6. Request indexing of the homepage and pricing page
7. Monitor "Index Coverage" report for crawl issues

#### Issue 4: Industry Pages Missing from Live Sitemap
**Severity:** 🔴 High

**Problem:** `INDUSTRY_PAGES` are defined in `sitemap-utils.ts` but the live sitemap at `https://doppeldown.com/sitemap.xml` doesn't include them. The `/about` page is also defined but missing.

**Fix:** Debug the `generateNextSitemap()` function. Check if:
- The industry pages array is properly imported
- There's a build cache issue
- The deployment is using a stale build

### 5.2 High Priority Issues

#### Issue 5: All Blog Posts Have Same `lastModified` Date
**Severity:** 🟡 High

**Problem:** All 17 blog posts show `2026-02-03` as their published date. This signals bulk content creation to Google, which can trigger lower quality assessments.

**Fix:**
```typescript
// src/lib/seo/sitemap-utils.ts — stagger dates
export const BLOG_POSTS: BlogPostMeta[] = [
  { slug: 'what-is-typosquatting-complete-guide-2026', publishedDate: '2025-12-15' },
  { slug: 'how-to-check-if-website-is-legitimate-complete-guide', publishedDate: '2025-12-22' },
  { slug: 'typosquatting-examples-protect-brand', publishedDate: '2026-01-03' },
  { slug: 'brand-impersonation-statistics-case-studies-2026', publishedDate: '2026-01-08' },
  { slug: 'how-to-report-phishing-website-step-by-step-guide', publishedDate: '2026-01-12' },
  { slug: 'dmarc-spf-dkim-explained-email-authentication-small-business', publishedDate: '2026-01-17' },
  { slug: 'what-to-do-when-someone-impersonates-your-business-online', publishedDate: '2026-01-20' },
  { slug: 'brand-protection-for-small-business-practical-guide', publishedDate: '2026-01-24' },
  // ... continue staggering through January-February 2026
]
```

**Important:** Also update the visible "Published" date on each blog post page to match.

#### Issue 6: Missing Internal Linking
**Severity:** 🟡 High

**Problem:** Blog posts, comparison pages, and industry pages exist as silos with minimal cross-linking. This wastes link equity and makes it harder for Google to understand site structure.

**Fix:** Implement a systematic internal linking strategy:

1. **Every blog post** should contain:
   - Links to 2-3 related blog posts (contextual, in-body links)
   - Link to the most relevant comparison page
   - CTA link to `/pricing` or `/auth/signup`

2. **Every comparison page** should contain:
   - Links to the "brand protection pricing" blog post
   - Links to relevant industry pages
   - Link to the free vs. paid comparison blog post

3. **Every industry page** should contain:
   - Links to relevant blog posts
   - Links to relevant use-case pages
   - Link to comparison pages

4. **Add a "Related Articles" component** at the bottom of each blog post.

#### Issue 7: Missing `<h1>` Best Practices on Some Pages
**Severity:** 🟡 Medium

**Recommendation:** Audit every page to ensure:
- Exactly one `<h1>` per page
- `<h1>` contains the primary target keyword
- Heading hierarchy is logical (H1 → H2 → H3, no skipping)

### 5.3 Medium Priority Issues

#### Issue 8: Image Optimization & Alt Text
**Severity:** 🟡 Medium

**Check:** Ensure all images have:
- Descriptive `alt` text containing relevant keywords (naturally)
- Next.js `<Image>` component for automatic optimization
- WebP format with fallbacks
- Explicit `width` and `height` to prevent CLS

#### Issue 9: Page Speed Optimization
**Severity:** 🟡 Medium

**Recommendations:**
- Run Lighthouse audit on the live site
- Target scores: Performance ≥90, Accessibility ≥95, Best Practices ≥95, SEO ≥95
- Ensure fonts use `font-display: swap` (already using Inter via `next/font`)
- Verify Stripe JS loads asynchronously (only on pages that need it)
- Check if Google Analytics is lazy-loaded

#### Issue 10: URL Structure Review
**Severity:** 🟢 Low

**Current structure is good:**
- `/blog/[slug]` — clean, keyword-rich slugs ✅
- `/compare/[competitor]` — clear intent ✅
- `/industries/[industry]` — logical hierarchy ✅
- `/pricing` — flat, important ✅

**Minor fix:** Ensure no trailing slashes are indexed (canonical handling in place, verify in practice).

#### Issue 11: 404 Page Optimization
**Severity:** 🟢 Low

**Check:** Ensure `not-found.tsx` includes:
- Helpful navigation links (home, blog, pricing)
- Search functionality or suggested pages
- Proper `<title>` and meta robots `noindex`

#### Issue 12: XML Sitemap Enhancements
**Severity:** 🟢 Low

**Recommendations:**
- Add `<image:image>` tags for blog posts with featured images
- Consider splitting into multiple sitemaps if page count exceeds 100 (sitemap index is already supported in code)
- Ensure `lastmod` dates reflect actual content changes, not just build times

### 5.4 Technical SEO Checklist

```
CRITICAL (Do this week)
├── [ ] Fix www vs non-www canonical mismatch
├── [ ] Ensure /pricing renders server-side
├── [ ] Complete Google Search Console setup + sitemap submission
├── [ ] Fix industry pages missing from live sitemap
└── [ ] Verify all structured data renders correctly (test with Rich Results Test)

HIGH (Do within 2 weeks)
├── [ ] Stagger blog post publication dates
├── [ ] Implement internal linking across all content
├── [ ] Add Bing Webmaster Tools verification
├── [ ] Run full Lighthouse audit and fix any issues
└── [ ] Set up Google Search Console monitoring alerts

MEDIUM (Do within 1 month)
├── [ ] Audit all page <h1> tags and heading hierarchy
├── [ ] Verify all images have alt text
├── [ ] Check Core Web Vitals in field data (once traffic arrives)
├── [ ] Add 3 more competitor comparison pages
└── [ ] Create individual use-case pages

LOW (Ongoing)
├── [ ] Monitor 404 errors in Search Console
├── [ ] Check for crawl errors monthly
├── [ ] Update lastmod dates when content changes
└── [ ] Review and update structured data as pages evolve
```

---

## 6. Content Strategy & Publishing Calendar

### 6.1 Content Pillars (Topic Clusters)

Organize all content into topic clusters with pillar pages and supporting blog posts:

```
PILLAR: Brand Protection Basics
├── /blog/brand-protection-for-small-business-practical-guide  [PILLAR PAGE]
├── /blog/what-is-typosquatting-complete-guide-2026
├── /blog/what-is-domain-squatting-how-to-protect-your-brand
├── /blog/typosquatting-examples-protect-brand
├── /blog/how-to-monitor-your-brand-online-guide-for-small-businesses
├── /blog/free-vs-paid-brand-protection-whats-the-difference
└── 🔲 /blog/brand-protection-checklist-small-business

PILLAR: Phishing Defense
├── /blog/how-to-report-phishing-website-step-by-step-guide  [PILLAR PAGE]
├── /blog/5-signs-your-brand-is-being-targeted-by-phishing-attacks
├── /blog/phishing-attack-statistics-2026-what-smbs-need-to-know
├── /blog/how-cybercriminals-clone-websites-what-businesses-need-to-know
├── /blog/how-to-check-if-website-is-legitimate-complete-guide
├── 🔲 /blog/phishing-takedown-step-by-step-guide
└── 🔲 /blog/types-of-phishing-attacks-business-owners-guide

PILLAR: Email Authentication
├── /blog/dmarc-spf-dkim-explained-email-authentication-small-business  [PILLAR PAGE]
├── 🔲 /blog/how-to-tell-if-email-is-spoofed
├── 🔲 /blog/email-authentication-checklist-small-business
└── 🔲 /blog/domain-spoofing-vs-phishing-whats-the-difference

PILLAR: Brand Impersonation Response
├── /blog/what-to-do-when-someone-impersonates-your-business-online  [PILLAR PAGE]
├── /blog/brand-impersonation-statistics-case-studies-2026
├── /blog/true-cost-of-brand-impersonation-why-smbs-cant-ignore-it
├── 🔲 /blog/how-to-get-fake-social-media-account-taken-down
├── 🔲 /blog/how-to-remove-fake-website-impersonating-your-business
└── 🔲 /blog/cybersquatting-legal-remedies-udrp-guide

PILLAR: Pricing & Comparison (Decision Content)
├── 🔲 /blog/brand-protection-pricing-comparison-2026  [PILLAR PAGE]
├── /compare/brandshield
├── /compare/red-points
├── /compare/phishlabs
├── /compare/zerofox
├── /compare/bolster
├── /compare/allure-security
├── 🔲 /compare/netcraft
├── 🔲 /compare/mimecast
├── 🔲 /compare/proofpoint
└── 🔲 /blog/best-brand-protection-tools-2026
```

### 6.2 Content Calendar: Months 1-3

**Publishing cadence:** 2 new posts per week (8-10 per month)

#### Month 1 (February 2026) — Foundation

| Week | Content Piece | Type | Target Keyword | Priority |
|------|--------------|------|----------------|----------|
| W1 | **Brand Protection Pricing Comparison 2026** | Blog / Landing | brand protection pricing, brand protection cost | 🔴 Highest |
| W1 | **Best Brand Protection Tools 2026** | Blog | best brand protection tools | 🔴 High |
| W2 | How to Get a Fake Social Media Account Taken Down | Blog | fake social media account takedown | 🟡 High |
| W2 | Types of Phishing Attacks: A Business Owner's Guide | Blog | types of phishing attacks | 🟡 High |
| W3 | DoppelDown vs Netcraft comparison page | Landing | netcraft alternative, netcraft pricing | 🟡 High |
| W3 | Phishing Takedown: How to Get a Fake Site Removed | Blog | phishing takedown process | 🟡 Medium |
| W4 | How to Tell if an Email is Spoofed | Blog | how to tell if email is spoofed | 🟡 Medium |
| W4 | What is Brand Impersonation? Complete Guide | Blog | what is brand impersonation | 🟡 Medium |

#### Month 2 (March 2026) — Expansion

| Week | Content Piece | Type | Target Keyword | Priority |
|------|--------------|------|----------------|----------|
| W1 | How to Remove a Fake Website Impersonating Your Business | Blog | how to remove fake website | 🟡 High |
| W1 | DoppelDown vs Mimecast comparison page | Landing | mimecast brand protection alternative | 🟡 Medium |
| W2 | Social Media Impersonation: The Complete Prevention Guide | Blog | social media impersonation | 🟡 Medium |
| W2 | Brand Protection Checklist for Small Businesses (Downloadable) | Blog + PDF | brand protection checklist | 🟡 Medium |
| W3 | How Australian SMBs Are Fighting Back Against Brand Impersonation | Blog | brand protection Australia | 🟡 Medium |
| W3 | DoppelDown vs Proofpoint comparison page | Landing | proofpoint brand protection alternative | 🟡 Medium |
| W4 | Cybersquatting Legal Remedies: UDRP and Other Options | Blog | cybersquatting legal remedies, UDRP | 🟡 Medium |
| W4 | Domain Monitoring Tools: What Works for Small Business | Blog | domain monitoring tools | 🟡 Medium |

#### Month 3 (April 2026) — Authority Building

| Week | Content Piece | Type | Target Keyword | Priority |
|------|--------------|------|----------------|----------|
| W1 | I Scanned 100 Australian Brands: Here's What I Found | Blog (data-driven) | brand phishing Australia | 🔴 High (PR-worthy) |
| W1 | The MSP's Guide to Offering Brand Protection as a Service | Blog | brand protection MSP | 🟡 Medium |
| W2 | How to Identify Fake Social Media Accounts (Platform by Platform) | Blog | identify fake social media accounts | 🟡 Medium |
| W2 | Email Authentication Checklist for Small Businesses | Blog + PDF | email authentication checklist | 🟡 Medium |
| W3 | Domain Spoofing vs Phishing: What's the Difference? | Blog | domain spoofing vs phishing | 🟢 Medium |
| W3 | Brand Protection for E-Commerce: The 2026 Playbook | Blog | brand protection e-commerce | 🟡 Medium |
| W4 | What is a Homoglyph Attack? (With Examples) | Blog | homoglyph attack | 🟢 Low |
| W4 | Why Brand Protection Shouldn't Cost $50,000 a Year (Thought Leadership) | Blog | brand protection cost | 🟡 High |

### 6.3 Content Quality Standards

Every blog post MUST include:

```markdown
## Content Checklist
- [ ] Primary keyword in title (H1)
- [ ] Primary keyword in first 100 words
- [ ] Primary keyword in at least one H2
- [ ] 2-3 secondary/related keywords used naturally
- [ ] Meta description: 120-160 characters, includes primary keyword
- [ ] Meta title: under 60 characters, includes primary keyword
- [ ] Minimum 1,500 words (2,000+ for pillar content)
- [ ] At least 3 internal links to other DoppelDown pages
- [ ] At least 2 external links to authoritative sources
- [ ] Table of Contents for posts >2,000 words
- [ ] Featured image with keyword-rich alt text
- [ ] CTA section linking to /pricing or /auth/signup
- [ ] Article structured data (JSON-LD)
- [ ] FAQ section where applicable (with FAQ schema)
- [ ] Published date (staggered, not same-day)
- [ ] Author attribution (builds E-E-A-T)
```

### 6.4 Content Optimization: The "10x Content" Standard

For every keyword target, before writing, check what currently ranks on page 1 of Google. Then make DoppelDown's content:

1. **More comprehensive** — Cover angles that competitors miss
2. **More practical** — Actionable steps, not just theory
3. **More current** — 2026 data, not 2023 data
4. **Better structured** — Tables, bullet lists, TL;DRs, jump links
5. **More authoritative** — Cite sources, include expert quotes, use data
6. **More specific to SMBs** — Enterprise content is everywhere. SMB-specific content is not.

---

## 7. Backlink & Off-Page Strategy

### 7.1 Current Backlink Profile

DoppelDown is a brand-new domain with essentially **zero backlinks**. Building domain authority from scratch requires a multi-pronged approach focused on quality over quantity.

### 7.2 Backlink Acquisition Strategy (Ranked by Impact)

#### Tier 1: Directory & Profile Links (Foundation — Do First)

These are low-effort, legitimate links that establish your domain as a real business. They don't move the needle much individually but create the foundation.

| Directory | DA | Status | Link Type |
|-----------|-----|--------|----------|
| Product Hunt | 90+ | 🔲 Pending launch | Profile + product page |
| G2 | 90+ | 🔲 Submitted | Vendor profile |
| Capterra | 85+ | 🔲 Needs action | Vendor profile |
| SaaSHub | 50+ | ✅ Submitted | Product listing |
| Launching Next | 35+ | ✅ Submitted | Product listing |
| AlternativeTo | 75+ | 🔲 Needs action | Software listing |
| GetApp | 80+ | 🔲 Needs action | Vendor profile |
| Crunchbase | 90+ | 🔲 Needed | Company profile |
| LinkedIn Company | 98+ | 🔲 Needed | Company page |
| GitHub (repo/profile) | 95+ | 🔲 Needed | Org/repo link |
| AngelList/Wellfound | 85+ | 🔲 Needed | Startup profile |
| StackShare | 60+ | 🔲 Needs action | Tool listing |
| BetaList | 65+ | 🔲 Needs action | Startup listing |

**Target:** 15-20 directory links in the first month.

#### Tier 2: Content-Based Link Earning (Months 1-3)

Create content specifically designed to earn links:

| Content Asset | Why It Earns Links | Target Referring Domains |
|--------------|-------------------|------------------------|
| **"I Scanned 100 Australian Brands" data study** | Original research = journalists and bloggers cite it | Cybersecurity blogs, Australian business media |
| **"Brand Protection Pricing Comparison 2026"** | Only transparent pricing content in the market | SaaS comparison sites, Reddit, Quora |
| **"Brand Protection Checklist" (downloadable PDF)** | Free tool = people link to useful resources | Small business blogs, marketing blogs |
| **Phishing statistics roundup (with original data)** | Data-driven content gets cited | Security journalists, research reports |
| **Interactive free domain check tool** | Free tools earn links naturally | Resource pages, "best free tools" lists |

#### Tier 3: Guest Posting & Thought Leadership (Months 2-6)

| Target Publication | Angle | DA |
|-------------------|-------|-----|
| CSO Online | "Why SMB brand protection is broken" | 85+ |
| Dark Reading | Technical article on typosquatting detection | 80+ |
| Australian Cyber Security Magazine | Local industry thought leadership | 50+ |
| Startup Daily (AU) | Founder story / bootstrapping journey | 55+ |
| The Conversation (AU) | "Why small businesses are the new phishing targets" | 90+ |
| Small business blogs (multiple) | "How to protect your brand" guest posts | 30-60 |
| MSP-focused publications (ChannelE2E, MSP Insights) | "Brand protection as a managed service" | 40-60 |
| SaaS growth blogs (SaaStr, Baremetrics) | "Building a transparent-pricing SaaS in an opaque market" | 50-70 |

**Approach:** Don't pitch product. Pitch expertise. Richard's cybersecurity background is the credential. Lead with value, mention DoppelDown naturally.

#### Tier 4: Digital PR & HARO (Months 2-6)

| Platform | Strategy |
|----------|----------|
| HARO (Help A Reporter Out) | Respond to cybersecurity, small business, SaaS queries as expert source |
| Qwoted | Same as HARO, alternative platform |
| Connectively | Journalist request platform |
| Featured.com | Expert source matching |

**Target:** 2-3 HARO responses per week. Success rate is ~5-10%, so volume matters. Each successful placement = high-DA backlink + brand mention.

#### Tier 5: Community & Relationship Links (Ongoing)

| Channel | Strategy | Link Quality |
|---------|----------|-------------|
| Reddit | Helpful answers in r/cybersecurity, r/smallbusiness, r/sysadmin — with profile link | NoFollow but high-quality traffic |
| Quora | Answer brand protection / phishing questions — link to relevant blog posts | NoFollow but traffic + authority signals |
| LinkedIn articles | Publish thought leadership with links back to DoppelDown blog | NoFollow but traffic |
| Stack Exchange (Security) | Answer technical questions about brand protection | High-quality community link |
| HackerNews | "Show HN" post + technical discussions | Very high-quality community |
| IndieHackers | Building in public, monthly revenue updates | Community engagement + link |

#### Tier 6: Strategic Partnerships (Months 3-12)

| Partner Type | Link Opportunity |
|-------------|-----------------|
| MSP/MSSP partners | Partner pages with reciprocal links |
| Cybersecurity tool vendors | "Integrates with" pages |
| Web hosting companies | "Recommended tools" or resource pages |
| Domain registrars | "Protect your domain" resource sections |
| Business insurance companies | "Risk mitigation tools" resource pages |

### 7.3 Link Building Calendar

| Month | Focus | Target New Referring Domains |
|-------|-------|------------------------------|
| 1 | Directory submissions, Product Hunt, initial community posts | 15-20 |
| 2 | Guest posts (pitch), HARO responses, data-driven content | 10-15 |
| 3 | Guest posts (publish), digital PR, community engagement | 10-15 |
| 4-6 | Consistent guest posting, partner links, PR campaigns | 8-12/month |
| 7-12 | Organic link earning from ranking content + partnerships | 10-20/month |

### 7.4 Links to Avoid (Black Hat)

❌ Never do these:
- Paid links (PBNs, link farms, "buy backlinks" services)
- Mass directory submissions to low-quality sites
- Comment spam
- Link exchanges / reciprocal link schemes
- Auto-generated content with embedded links
- Press release link building (low value, often penalized)

---

## 8. Local & Geo-Targeted SEO

### 8.1 Australian Market Strategy

DoppelDown is based in Queensland, Australia. While the product serves a global market, the Australian market offers a "home field advantage" for initial traction.

**Local SEO actions:**

| Action | Priority | Status |
|--------|----------|--------|
| Google Business Profile | 🟡 Medium | 🔲 Create — even as an online-only business |
| Australian business directories (TrueLocal, Yellow Pages) | 🟢 Low | 🔲 Submit |
| `.com.au` domain variant | 🟢 Low | 🔲 Consider registering (redirect to main site) |
| Australian cybersecurity content | 🟡 Medium | 🔲 "Brand protection for Australian businesses" blog |
| ACSC (Australian Cyber Security Centre) resource mentions | 🟡 Medium | 🔲 Target as a reference in content |
| Australian business events/conferences | 🟡 Medium | 🔲 Identify relevant events for PR |

### 8.2 Multi-Market Approach (Future)

As DoppelDown grows, consider:
- `/au/`, `/uk/`, `/us/` subdirectories with localized content
- `hreflang` tags for regional targeting
- Country-specific blog posts (e.g., "Brand Protection in the UK: What NCSC Recommends")
- Regional pricing comparisons

---

## 9. Measurement & KPIs

### 9.1 SEO Dashboard Metrics

Track weekly in a spreadsheet or dashboard:

| Metric | Tool | Frequency |
|--------|------|-----------|
| Organic sessions | Google Analytics / Plausible | Weekly |
| Organic signups | GA + Supabase | Weekly |
| Keyword rankings (top 20 target keywords) | Google Search Console | Weekly |
| Total indexed pages | Google Search Console | Weekly |
| Click-through rate (CTR) from search | Google Search Console | Weekly |
| Average position | Google Search Console | Weekly |
| Total impressions | Google Search Console | Weekly |
| Referring domains | Ahrefs/Moz (free tier) or backlink checker | Monthly |
| Domain Authority/Rating | Moz/Ahrefs | Monthly |
| Core Web Vitals (CWV) | Google Search Console + PageSpeed Insights | Monthly |
| Crawl errors | Google Search Console | Weekly |
| Sitemap status | Google Search Console | Weekly |

### 9.2 Primary KPIs

| KPI | Month 1 | Month 3 | Month 6 | Month 12 |
|-----|---------|---------|---------|----------|
| Organic monthly sessions | 100-200 | 500-1,000 | 2,000-5,000 | 10,000-25,000 |
| Organic signup conversion rate | 3-5% | 5-8% | 5-8% | 5-10% |
| Monthly organic signups | 5-10 | 25-80 | 100-400 | 500-2,500 |
| Keywords ranking page 1 | 3-5 | 15-30 | 50-100 | 150-300 |
| Blog posts published (cumulative) | 25 | 40 | 60 | 100 |
| Referring domains | 15-20 | 40-60 | 80-120 | 200+ |
| Domain Authority | 5-10 | 15-20 | 25-30 | 35-45 |

### 9.3 Content Performance Tracking

For each blog post, track:

| Metric | Target |
|--------|--------|
| Time to first Google impression | <14 days |
| Time to page 1 ranking (target keyword) | <90 days for low-competition keywords |
| Average time on page | >3 minutes |
| Bounce rate | <60% |
| Internal links clicked | >1 per session |
| CTA click rate | >5% |

### 9.4 Monthly SEO Review Template

```markdown
## SEO Monthly Review — [Month Year]

### Traffic
- Organic sessions: _____ (vs. last month: +/- ___%)
- Top 5 landing pages by organic traffic:
  1. _____ — _____ sessions
  2. _____ — _____ sessions
  3. _____ — _____ sessions
  4. _____ — _____ sessions
  5. _____ — _____ sessions

### Rankings
- Keywords in top 3: _____
- Keywords in top 10: _____
- Keywords in top 20: _____
- Biggest ranking gains: _____
- Biggest ranking losses: _____

### Content
- New posts published: _____
- Top performing new post: _____
- Posts updated/optimized: _____

### Backlinks
- New referring domains: _____
- Total referring domains: _____
- Domain Authority: _____
- Notable links earned: _____

### Technical
- Crawl errors: _____
- Core Web Vitals status: _____
- Index coverage issues: _____

### Conversions
- Organic signups: _____
- Organic → paid conversions: _____
- Estimated organic MRR contribution: $_____

### Next Month Priorities
1. _____
2. _____
3. _____
```

---

## 10. 90-Day Action Plan

### Week 1 (Immediate — Critical Fixes)

| # | Action | Owner | Time Est. | Impact |
|---|--------|-------|-----------|--------|
| 1 | Fix `www` vs non-`www` canonical mismatch | Dev | 1 hour | 🔴 Critical |
| 2 | Ensure `/pricing` page renders server-side | Dev | 2-3 hours | 🔴 Critical |
| 3 | Complete Google Search Console setup + submit sitemap | Richard | 30 min | 🔴 Critical |
| 4 | Fix industry pages missing from live sitemap | Dev | 1 hour | 🔴 High |
| 5 | Set up Bing Webmaster Tools | Richard | 15 min | 🟡 Medium |
| 6 | Run Lighthouse audit, fix any score <90 | Dev | 2 hours | 🟡 High |
| 7 | Verify structured data with Rich Results Test | Dev | 30 min | 🟡 Medium |

### Week 2 (Content Foundation)

| # | Action | Owner | Time Est. | Impact |
|---|--------|-------|-----------|--------|
| 8 | Write & publish "Brand Protection Pricing Comparison 2026" blog/page | Content | 4-6 hours | 🔴 Highest |
| 9 | Stagger blog post publication dates (update sitemap-utils.ts + visible dates) | Dev | 1 hour | 🟡 High |
| 10 | Add internal cross-links to all 17 existing blog posts | Content/Dev | 3-4 hours | 🟡 High |
| 11 | Write & publish "Best Brand Protection Tools 2026" blog post | Content | 3-4 hours | 🔴 High |
| 12 | Submit to all Tier 1 directories (Crunchbase, GitHub, LinkedIn, AngelList) | Richard | 2 hours | 🟡 Medium |

### Weeks 3-4 (Expansion)

| # | Action | Owner | Time Est. | Impact |
|---|--------|-------|-----------|--------|
| 13 | Create `/compare/netcraft` page | Dev/Content | 3 hours | 🟡 High |
| 14 | Publish 4 new blog posts (per content calendar) | Content | 8-12 hours | 🟡 High |
| 15 | Create first downloadable asset (Brand Protection Checklist PDF) | Content | 2-3 hours | 🟡 Medium |
| 16 | Begin HARO responses (2-3 per week) | Richard | 1-2 hr/week | 🟡 Medium |
| 17 | Add Related Articles component to blog post template | Dev | 2 hours | 🟡 Medium |
| 18 | Create `/use-cases/phishing-detection` page | Dev/Content | 3 hours | 🟡 Medium |

### Month 2 (Authority Building)

| # | Action | Owner | Time Est. | Impact |
|---|--------|-------|-----------|--------|
| 19 | Publish 8 blog posts (per content calendar) | Content | 16-20 hours | 🟡 High |
| 20 | Create `/compare/mimecast` and `/compare/proofpoint` pages | Dev/Content | 6 hours | 🟡 Medium |
| 21 | Pitch 3-5 guest post opportunities | Richard | 2-3 hours | 🟡 High |
| 22 | Create 3 more use-case pages | Dev/Content | 9 hours | 🟡 Medium |
| 23 | Build "Brand Protection for Australian Businesses" content | Content | 4-5 hours | 🟡 Medium |
| 24 | Review Search Console data — identify quick wins and issues | Analysis | 1 hour | 🟡 High |
| 25 | Optimize top 5 performing pages based on Search Console CTR data | Content | 3 hours | 🟡 High |

### Month 3 (Scale & Measure)

| # | Action | Owner | Time Est. | Impact |
|---|--------|-------|-----------|--------|
| 26 | Publish 8 blog posts including "100 Australian Brands" data study | Content | 20-24 hours | 🔴 High |
| 27 | Publish 2-3 guest posts (if pitches accepted) | Richard | 6-8 hours | 🟡 High |
| 28 | Comprehensive SEO performance review | Analysis | 3 hours | 🟡 High |
| 29 | Identify and pursue 5 partnership link opportunities | Richard | 3-4 hours | 🟡 Medium |
| 30 | Update/optimize Month 1 content based on ranking data | Content | 4-6 hours | 🟡 High |
| 31 | Add FAQ schema to pricing page and top 5 blog posts | Dev | 2-3 hours | 🟡 Medium |
| 32 | Plan Q2 content calendar based on Month 1-3 learnings | Analysis | 2-3 hours | 🟡 High |

---

## Appendix A: SEO Tool Recommendations

### Free Tools (Start With These)

| Tool | Purpose |
|------|---------|
| Google Search Console | Rankings, impressions, clicks, index coverage, crawl errors |
| Google Analytics 4 (or Plausible) | Traffic, user behavior, conversions |
| Google PageSpeed Insights | Core Web Vitals, page speed |
| Lighthouse (Chrome DevTools) | Full performance/accessibility/SEO audit |
| Rich Results Test | Validate structured data |
| Ahrefs Webmaster Tools (free) | Backlink profile, basic site audit |
| Ubersuggest (free tier) | Basic keyword research |

### Paid Tools (When Budget Allows)

| Tool | Cost | Value |
|------|------|-------|
| Ahrefs Lite | $99/mo | Comprehensive keyword research, backlink analysis, competitor tracking |
| Semrush | $130/mo | Full SEO suite, position tracking, content optimization |
| Screaming Frog | Free <500 URLs | Technical SEO crawler (site audit) |
| SurferSEO | $89/mo | Content optimization, NLP-based keyword suggestions |

**Recommendation:** Start with free tools. Add Ahrefs Lite at $2K+ MRR for comprehensive keyword tracking.

---

## Appendix B: Structured Data Implementation Checklist

| Page Type | Schema | Status |
|-----------|--------|--------|
| Homepage | Organization + WebSite + SoftwareApplication | ✅ Implemented |
| Pricing | SoftwareApplication (with offers) | ✅ Implemented |
| Blog posts | Article + Breadcrumbs | ✅ Implemented |
| Comparison pages | Product comparison + Breadcrumbs | ✅ Implemented |
| Industry pages | WebPage + Breadcrumbs | ✅ Implemented |
| FAQ sections | FAQPage | ⚠️ Verify rendering |
| Blog how-to posts | HowTo | ✅ Available (verify usage) |
| About page | Organization (extended) | 🔲 Needed |

---

## Appendix C: Competitor SEO Analysis

| Competitor | Domain Authority | Indexed Pages | Blog Posts | Pricing Page? |
|-----------|-----------------|---------------|-----------|--------------|
| BrandShield | ~55 | ~2,000 | 100+ | ❌ "Contact Sales" |
| Red Points | ~60 | ~5,000 | 200+ | ❌ "Request Pricing" |
| Bolster.ai | ~40 | ~500 | 30+ | ❌ "Contact Us" |
| ZeroFox | ~55 | ~3,000 | 100+ | ❌ "Contact Sales" |
| PhishLabs | ~50 | ~1,500 | 80+ | ❌ "Contact" |
| Allure Security | ~30 | ~200 | 15+ | ❌ "Contact Us" |
| **DoppelDown** | **~5** | **~40** | **17** | **✅ Transparent** |

**Key insight:** DoppelDown is starting from behind on DA and indexed pages, but has the **only transparent pricing page** in the market. This is a massive SEO advantage for commercial-intent keywords that no competitor can easily replicate without changing their entire sales model.

---

## Appendix D: Quick Reference — Meta Tag Templates

### Blog Posts
```
Title: [Primary Keyword]: [Benefit/Hook] | DoppelDown
Meta: [50-char summary with primary keyword]. [Actionable benefit]. [CTA or qualifier — e.g., "Step-by-step guide for small businesses."]
```

### Comparison Pages
```
Title: DoppelDown vs [Competitor]: Pricing, Features & Why SMBs Switch
Meta: Compare DoppelDown to [Competitor]. Transparent pricing from $0/mo vs [Competitor]'s estimated $[X]K+/year. See features, differences, and which is right for your business.
```

### Industry Pages
```
Title: Brand Protection for [Industry] | Detect Phishing & Impersonation | DoppelDown
Meta: Protect your [industry] business from brand impersonation, phishing attacks, and fake domains. AI-powered detection starting at $0/month. [Industry-specific hook].
```

### Use-Case Pages
```
Title: [Use Case] — AI-Powered [Benefit] | DoppelDown
Meta: [Use case description in 1 sentence]. [Key differentiator]. Start free — results in 5 minutes.
```

---

*This playbook is a living document. Review and update monthly based on Search Console data, ranking changes, and business priorities. The SEO landscape evolves — so should this strategy.*
