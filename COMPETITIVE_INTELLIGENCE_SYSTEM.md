# DoppelDown: Competitive Intelligence & Market Analysis System
*Version 1.0 | Created: 2026-02-05*
*Companion to: PRICING_STRATEGY.md, GTM_PLAYBOOK.md, PARTNERSHIP_CHANNEL_STRATEGY.md*

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Strategic Framework](#2-strategic-framework)
3. [Competitor Universe — Tiered Classification](#3-competitor-universe--tiered-classification)
4. [Monitoring Cadence & Responsibilities](#4-monitoring-cadence--responsibilities)
5. [Intelligence Collection Methods](#5-intelligence-collection-methods)
6. [Competitor Signal Taxonomy](#6-competitor-signal-taxonomy)
7. [Analysis Frameworks](#7-analysis-frameworks)
8. [Battle Card System](#8-battle-card-system)
9. [Pricing Intelligence](#9-pricing-intelligence)
10. [Feature Parity & Gap Tracking](#10-feature-parity--gap-tracking)
11. [Market Trend Radar](#11-market-trend-radar)
12. [Win/Loss Analysis Framework](#12-winloss-analysis-framework)
13. [Strategic Response Playbooks](#13-strategic-response-playbooks)
14. [Automated Monitoring Infrastructure](#14-automated-monitoring-infrastructure)
15. [Reporting & Distribution](#15-reporting--distribution)
16. [Annual Intelligence Calendar](#16-annual-intelligence-calendar)
17. [File Structure & Maintenance](#17-file-structure--maintenance)

---

## 1. Executive Summary

### Why This System Exists

DoppelDown operates in the Digital Risk Protection (DRP) / Brand Protection market — a space growing at ~20% CAGR to ~$15B by 2029. The market is dominated by enterprise vendors charging $15K–$250K+/year, creating a massive underserved SMB segment. DoppelDown's differentiation — transparent pricing, self-serve onboarding, AI-first architecture — depends on understanding exactly what competitors are doing and where they're headed.

This system ensures DoppelDown:
- **Never gets blindsided** by a competitor move (pricing, feature, acquisition, pivot)
- **Identifies whitespace** before competitors fill it
- **Arms sales conversations** with real-time battle cards
- **Informs product roadmap** with feature gap analysis
- **Validates pricing** against continuous market benchmarks
- **Spots emerging threats** (new entrants, adjacent market pivots, open-source alternatives)

### Key Principles

1. **Signal over noise** — Track what matters, ignore vanity metrics
2. **Actionable intelligence** — Every insight links to a DoppelDown decision
3. **Lightweight operations** — A bootstrapped company can't staff a CI department; automate everything possible
4. **Continuous, not periodic** — Intelligence degrades in hours, not months
5. **Offense, not defense** — CI is about finding opportunities, not just tracking threats

---

## 2. Strategic Framework

### Porter's Five Forces — DoppelDown's Competitive Position

```
                    THREAT OF NEW ENTRANTS: MODERATE-HIGH
                    ┌─────────────────────────────────┐
                    │ • Low barriers to basic scanning │
                    │ • High barriers to AI quality    │
                    │ • Open-source tools exist         │
                    │ • Funded startups emerging         │
                    │ DoppelDown defense: Speed to      │
                    │ market, PLG moat, price position  │
                    └────────────────┬────────────────┘
                                     │
BARGAINING POWER OF                  │                 BARGAINING POWER OF
SUPPLIERS: LOW-MODERATE              │                 BUYERS: HIGH
┌──────────────────────┐             │           ┌───────────────────────┐
│ • Domain data (WHOIS)│             │           │ • Low switching costs │
│ • Cloud infra (AWS)  │             │           │ • Price sensitivity   │
│ • AI models (OpenAI) │             │           │ • Free alternatives   │
│ • Screenshot APIs    │◄────────────┼──────────►│ • Self-serve means    │
│ DoppelDown defense:  │             │           │   easy to leave       │
│ Multi-vendor, own ML │             │           │ DoppelDown defense:   │
│                      │             │           │ Sticky data, PLG,     │
└──────────────────────┘             │           │ switching cost via    │
                                     │           │ evidence history      │
                    ┌────────────────┴────────────────┐
                    │     COMPETITIVE RIVALRY: HIGH     │
                    │  • 15+ direct & indirect players  │
                    │  • Enterprise: Red ocean           │
                    │  • SMB: Blue ocean (DoppelDown)    │
                    │  DoppelDown defense: Only SMB      │
                    │  self-serve brand protection SaaS  │
                    └─────────────────────────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │   THREAT OF SUBSTITUTES: HIGH    │
                    │ • Manual monitoring (free)        │
                    │ • Google Alerts (free)            │
                    │ • Open-source tools (dnstwist)    │
                    │ • Domain registrar alerts          │
                    │ • Bundled into security platforms  │
                    │ DoppelDown defense: AI quality,   │
                    │ actionable reports, convenience   │
                    └─────────────────────────────────┘
```

### DoppelDown's Strategic Positioning

```
                         ENTERPRISE
                            │
   ┌────────────────────────┼────────────────────────┐
   │                        │                        │
   │  BrandShield   ZeroFox │   Netcraft             │
   │    ●              ●    │      ●                 │
   │                        │                        │
   │  PhishFort ●  Doppel ● │  Red Points ●          │
   │                        │                        │
OPAQUE ─────────────────────┼───────────────────── TRANSPARENT
PRICING                     │                       PRICING
   │                        │                        │
   │  Allure ●    Bolster ● │                        │
   │                        │    ★ DoppelDown        │
   │                        │    (unique position)   │
   │                        │                        │
   │  dnstwist(OSS)●        │  urlscan.io ●          │
   │                        │                        │
   └────────────────────────┼────────────────────────┘
                            │
                          SMB
```

**DoppelDown owns the bottom-right quadrant**: SMB-accessible + transparent pricing. No competitor occupies this space meaningfully.

---

## 3. Competitor Universe — Tiered Classification

### Tier 1: Direct Competitors (Monitor Weekly)

Companies offering brand protection / digital risk protection with overlapping target market.

| Company | HQ | Founded | Funding | Target Market | Est. Revenue | Threat Level |
|---------|-----|---------|---------|---------------|-------------|-------------|
| **ZeroFox** | Baltimore, USA | 2013 | $300M+ (public→private 2022) | Mid-Market/Enterprise | $150M+ ARR | 🔴 High |
| **BrandShield** | Tel Aviv, Israel | 2013 | $10M+ | Enterprise | $15-30M ARR | 🟡 Medium |
| **Netcraft** | Bath, UK | 1995 | Bootstrapped→PE acquisition | Enterprise | $50M+ ARR | 🟡 Medium |
| **Red Points** | Barcelona, Spain | 2011 | $50M Series C | Mid-Market/Enterprise | $30-50M ARR | 🟡 Medium |
| **Bolster (CheckPhish)** | Santa Clara, USA | 2017 | $40M+ | Mid-Market | $10-20M ARR | 🟡 Medium |
| **Doppel** | San Francisco, USA | 2022 | $20M+ (Series A) | Enterprise | $5-15M ARR | 🔴 High |
| **PhishFort** | Amsterdam, NL | 2018 | Bootstrapped | Enterprise | $5-10M ARR | 🟢 Low |
| **Allure Security** | Boston, USA | 2017 | $10M+ | Mid-Market | $5-10M ARR | 🟢 Low |
| **Memcyco** | Tel Aviv, Israel | 2021 | $25M+ | Enterprise | $5-10M ARR | 🟡 Medium |

### Tier 2: Adjacent/Indirect Competitors (Monitor Monthly)

Companies whose products partially overlap or could expand into DoppelDown's space.

| Company | Type | Overlap Area | Expansion Risk |
|---------|------|-------------|----------------|
| **Cloudflare** | CDN / Security | Domain monitoring, anti-phishing | 🔴 High — could add brand monitoring |
| **CrowdStrike** | Endpoint Security | Falcon Intelligence includes brand monitoring | 🟡 Medium — enterprise only |
| **Proofpoint** | Email Security | Brand impersonation detection | 🟡 Medium — different angle |
| **Recorded Future** | Threat Intelligence | Brand mention monitoring | 🟡 Medium — enterprise price point |
| **urlscan.io** | URL Scanning | Domain/URL analysis | 🟢 Low — tool, not platform |
| **VirusTotal** | Malware Analysis | URL/domain reputation | 🟢 Low — detection, not protection |
| **DNSTwist** | Open Source | Domain permutation generation | 🟡 Medium — free alternative |
| **Shodan** | Internet Intelligence | Infrastructure discovery | 🟢 Low — different use case |
| **SecurityTrails** | Domain Intelligence | WHOIS/DNS data | 🟢 Low — data provider |
| **SpyCloud** | Account Takeover | Credential exposure monitoring | 🟢 Low — different focus |

### Tier 3: Emerging/Watch List (Monitor Quarterly)

New entrants, pivoting companies, and potential future competitors.

| Signal | What to Watch | Why It Matters |
|--------|---------------|----------------|
| **Y Combinator / TechStars batches** | Any brand protection or DRP startups | Funded competitors with aggressive GTM |
| **Open-source projects** | dnstwist forks, new OSINT tools | Could become hosted SaaS competitors |
| **Big Tech moves** | Google, Microsoft, AWS security offerings | Platform-level brand monitoring would change the game |
| **Domain registrars** | GoDaddy, Namecheap, Cloudflare Registrar | Could add brand monitoring natively |
| **Email security vendors** | Mimecast, Abnormal Security | Could expand to external brand monitoring |
| **SEO/Marketing tools** | SEMrush, Ahrefs, Moz | Already monitor brand mentions; could add threat layer |

---

## 4. Monitoring Cadence & Responsibilities

### Weekly Tasks (~2 hours/week)

| Task | Method | Output |
|------|--------|--------|
| Check Tier 1 competitor websites for changes | Automated script + manual review | Changelog entry |
| Review competitor social media (LinkedIn, Twitter) | Manual scan of feeds | Notable posts log |
| Check for new competitor blog posts / announcements | RSS feeds + script | Content analysis |
| Review Hacker News / Reddit for DRP discussions | Keyword alerts | Community sentiment |
| Check competitor job postings | LinkedIn Jobs, careers pages | Hiring signal analysis |
| Update battle cards if any changes detected | Manual update | Updated battle cards |

### Monthly Tasks (~4 hours/month)

| Task | Method | Output |
|------|--------|--------|
| Deep-dive one Tier 1 competitor (rotate monthly) | Trial signup, full product review | Competitor profile update |
| Review pricing across all Tier 1 competitors | Pricing page scrapes | Pricing tracker update |
| Check Crunchbase / PitchBook for funding news | Database search | Funding signal analysis |
| Review industry analyst reports (Gartner, Forrester) | Read published reports | Market position assessment |
| Scan for new market entrants | ProductHunt, Crunchbase, YC | New entrant profiles |
| Update feature parity matrix | Feature comparison audit | Gap analysis update |
| Review G2/Capterra/TrustRadius reviews | Scrape competitor reviews | Voice-of-customer analysis |

### Quarterly Tasks (~8 hours/quarter)

| Task | Method | Output |
|------|--------|--------|
| Full competitive landscape refresh | All competitor profile updates | Quarterly CI Report |
| Market sizing and trend update | Industry reports, data analysis | Market assessment |
| Strategic response planning | Analysis of accumulated signals | Action recommendations |
| Win/loss analysis review | Customer interview compilation | Product/positioning insights |
| Technology/patent landscape scan | Patent databases, tech blogs | Innovation tracking |
| Board-ready competitive brief | Synthesize all intelligence | Executive summary |

### Annual Tasks (~2 days/year)

| Task | Method | Output |
|------|--------|--------|
| Full market map rebuild | Comprehensive research | Updated market map |
| Competitive strategy review | Strategic analysis | Strategy recommendations |
| Intelligence system audit | Process review | System improvements |

---

## 5. Intelligence Collection Methods

### 5.1 Automated Collection (Scripts)

See `competitive-intelligence/scripts/` for implementation.

| Source | Method | Frequency | Script |
|--------|--------|-----------|--------|
| **Competitor websites** | Wayback Machine + diff detection | Weekly | `monitor-websites.sh` |
| **Competitor pricing pages** | Headless browser screenshot + text extraction | Weekly | `monitor-pricing.sh` |
| **Blog / changelog RSS** | RSS feed aggregation | Daily | `monitor-feeds.sh` |
| **Job postings** | LinkedIn API / careers page scraping | Weekly | `monitor-jobs.sh` |
| **G2/Capterra reviews** | Review aggregation | Monthly | `monitor-reviews.sh` |
| **Domain registrations** | Certificate Transparency logs | Daily | `monitor-ct-logs.sh` |
| **GitHub activity** | Competitor OSS repos, new projects | Weekly | `monitor-github.sh` |
| **News/PR mentions** | Google News API / news aggregation | Daily | `monitor-news.sh` |

### 5.2 Manual Collection

| Source | Method | When |
|--------|--------|------|
| **Conference talks** | Watch recordings, read slide decks | As they happen |
| **Analyst reports** | Gartner Magic Quadrant, Forrester Wave, IDC | Annual cycle |
| **Customer conversations** | Win/loss interviews | After every deal |
| **Partner conversations** | MSP/MSSP partner feedback | Monthly check-ins |
| **Industry events** | RSA, Black Hat, BSides, AusCERT | Event schedule |
| **Competitor free trials** | Sign up, document experience | Quarterly rotation |
| **LinkedIn stalking** | Track competitor exec posts | Ongoing |
| **Patent filings** | USPTO, EPO searches | Quarterly |

### 5.3 Community Intelligence

| Platform | What to Monitor | Keywords |
|----------|-----------------|----------|
| **Hacker News** | DRP discussions, competitor mentions | brand protection, phishing detection, typosquatting, digital risk |
| **Reddit** | r/cybersecurity, r/netsec, r/sysadmin, r/MSP | brand impersonation, domain squatting, phishing protection |
| **Twitter/X** | Competitor accounts, industry hashtags | #brandprotection, #DRP, #phishing, #typosquatting |
| **LinkedIn** | Competitor company pages, exec posts | brand protection, digital risk protection |
| **Discord** | Security communities, startup communities | brand monitoring, domain abuse |
| **Product Hunt** | New security/brand tools | brand, phishing, domain, protection |

---

## 6. Competitor Signal Taxonomy

### What to Track & Why

Every competitor signal falls into one of these categories:

#### 🔴 Strategic Signals (Highest Priority — Report Immediately)

| Signal | Example | DoppelDown Impact |
|--------|---------|-------------------|
| **Pricing change** | Competitor launches self-serve pricing | Directly threatens our positioning |
| **Funding announcement** | Series B/C round for direct competitor | Increased competitive pressure coming |
| **Acquisition** | Competitor acquired by larger platform | Market consolidation signal |
| **SMB pivot** | Enterprise vendor launches SMB tier | Direct threat to our market |
| **Free tier launch** | Competitor offers freemium | Threatens our PLG advantage |
| **Major partnership** | Competitor partners with AWS/GCP/Azure | Distribution advantage |

#### 🟡 Tactical Signals (Medium Priority — Weekly Review)

| Signal | Example | DoppelDown Impact |
|--------|---------|-------------------|
| **Feature launch** | Competitor adds AI visual analysis | Feature parity gap |
| **New integration** | Competitor adds Slack/Teams integration | UX competitiveness |
| **Content campaign** | Competitor publishes comparison page | SEO/positioning impact |
| **Customer case study** | Competitor wins notable customer | Market credibility signal |
| **Hiring patterns** | Engineering hiring surge | Product investment signal |
| **Conference presence** | Competitor sponsors RSA Conference | Market presence signal |

#### 🟢 Background Signals (Low Priority — Monthly Review)

| Signal | Example | DoppelDown Impact |
|--------|---------|-------------------|
| **Blog post** | Thought leadership content | Content strategy reference |
| **Social media activity** | Post engagement patterns | Audience insights |
| **Job posting changes** | New roles appearing/disappearing | Organizational direction |
| **Website copy changes** | Messaging/positioning shifts | Narrative tracking |
| **Review trends** | G2 rating changes | Customer satisfaction signals |
| **Open-source contributions** | GitHub activity patterns | Technology direction |

---

## 7. Analysis Frameworks

### 7.1 SWOT Analysis — DoppelDown vs. Market

| | **Helpful** | **Harmful** |
|---|---|---|
| **Internal** | **STRENGTHS** | **WEAKNESSES** |
| | • Transparent self-serve pricing (unique in market) | • Solo founder bootstrapped (limited resources) |
| | • AI-first architecture (modern tech stack) | • No established brand recognition yet |
| | • Free tier drives PLG (competitors don't offer) | • Limited enterprise features (SSO, SAML, SOC2) |
| | • Richard's cybersecurity domain expertise | • No mobile app |
| | • SMB-optimized UX (no enterprise complexity) | • Young product — limited battle-tested evidence |
| | • Low operational costs (lean team) | • Dependency on third-party AI models |
| | • Speed of iteration (no enterprise bureaucracy) | • No dedicated sales team |
| | | |
| **External** | **OPPORTUNITIES** | **THREATS** |
| | • $15B market growing at 20% CAGR | • Funded competitors (Doppel, ZeroFox) could downmarket |
| | • SMB segment massively underserved | • Open-source tools improve to "good enough" |
| | • AI regulation driving compliance requirements | • Large platforms add brand monitoring natively |
| | • MSP/MSSP channel for distribution | • Price war if competitors match transparent pricing |
| | • API-first enables partner integrations | • AI model costs could increase unpredictably |
| | • Enterprise vendors pricing out mid-market | • Data provider consolidation limiting access |
| | • Global market (not just Australia) | • Customer apathy ("it won't happen to me") |

### 7.2 Value Chain Analysis

Where does DoppelDown add value vs. each competitor?

```
┌──────────────┬─────────────────┬──────────────────┬─────────────────┬──────────────┐
│  DISCOVERY   │    ANALYSIS     │    EVIDENCE      │    ALERTING     │   RESPONSE   │
│              │                 │                  │                 │              │
│ Domain scan  │ AI risk scoring │ Screenshots      │ Email alerts    │ Reports      │
│ Social scan  │ Visual analysis │ WHOIS capture    │ Webhooks        │ Takedown     │
│ NRD monitor  │ Phishing intent │ HTML archival    │ Dashboard       │ guidance     │
│ Web scan     │ Threat fusion   │ DNS records      │ Digests         │              │
├──────────────┼─────────────────┼──────────────────┼─────────────────┼──────────────┤
│ DoppelDown   │ DoppelDown      │ DoppelDown       │ DoppelDown      │ DoppelDown   │
│ ★★★☆☆       │ ★★★★☆ (AI edge)│ ★★★☆☆           │ ★★★☆☆          │ ★★☆☆☆       │
├──────────────┼─────────────────┼──────────────────┼─────────────────┼──────────────┤
│ ZeroFox      │ ZeroFox         │ ZeroFox          │ ZeroFox         │ ZeroFox      │
│ ★★★★★       │ ★★★★☆          │ ★★★★★           │ ★★★★★          │ ★★★★★       │
├──────────────┼─────────────────┼──────────────────┼─────────────────┼──────────────┤
│ BrandShield  │ BrandShield     │ BrandShield      │ BrandShield     │ BrandShield  │
│ ★★★★☆       │ ★★★☆☆          │ ★★★★☆           │ ★★★★☆          │ ★★★★★       │
├──────────────┼─────────────────┼──────────────────┼─────────────────┼──────────────┤
│ Netcraft     │ Netcraft        │ Netcraft         │ Netcraft        │ Netcraft     │
│ ★★★★★       │ ★★★★★          │ ★★★★★           │ ★★★☆☆          │ ★★★★★       │
├──────────────┼─────────────────┼──────────────────┼─────────────────┼──────────────┤
│ Doppel       │ Doppel          │ Doppel           │ Doppel          │ Doppel       │
│ ★★★★☆       │ ★★★★★ (AI)     │ ★★★★☆           │ ★★★★☆          │ ★★★★☆       │
└──────────────┴─────────────────┴──────────────────┴─────────────────┴──────────────┘

DoppelDown's advantage: Best PRICE-TO-VALUE ratio across ALL stages.
DoppelDown's gap: DISCOVERY breadth and RESPONSE (takedown execution).
```

### 7.3 Competitor Response Matrix

How should DoppelDown respond to different competitor moves?

| Competitor Move | DoppelDown Response | Timeline | Severity |
|----------------|---------------------|----------|----------|
| Competitor launches free tier | Differentiate on AI quality + data retention in free tier | 1-2 weeks | 🔴 |
| Competitor drops to $99/mo | Hold price, publish comparison showing feature gaps | 1 week | 🟡 |
| Competitor launches self-serve | Publish "we were first" content, accelerate feature dev | 2-4 weeks | 🔴 |
| Competitor raises massive funding | Double down on speed, ship faster, build brand loyalty | Ongoing | 🟡 |
| Competitor acquires competitor | Analyze integration timeline, target their disgruntled customers | 1-4 weeks | 🟡 |
| Competitor adds AI features | Benchmark quality, publish comparison, iterate | 2-4 weeks | 🟡 |
| Open-source tool improves significantly | Add a "why not DIY" comparison page, emphasize managed service | 1-2 weeks | 🟡 |
| Enterprise vendor targets SMB | Price anchor aggressively, emphasize simplicity | 2-4 weeks | 🔴 |
| Big Tech adds brand monitoring | Niche down on quality + takedown, position as specialist | Ongoing | 🔴 |
| Competitor gets negative press/breach | **Do NOT attack** — publish helpful content, differentiate quietly | Immediate | 🟢 |

---

## 8. Battle Card System

Battle cards are live-updated reference documents for sales conversations. Each card follows a standard template stored in `competitive-intelligence/battle-cards/`.

### Battle Card Template

```markdown
# Battle Card: [Competitor Name]
*Last updated: YYYY-MM-DD | Confidence: High/Medium/Low*

## Quick Stats
- Founded: | HQ: | Employees: | Funding:
- Est. Revenue: | Target Market: | Pricing Model:

## Their Pitch (How They Position Themselves)
> [Their tagline / main value proposition]

## Our Counter-Pitch
> [How DoppelDown positions against them]

## Where They Win
- [Genuine strength 1]
- [Genuine strength 2]

## Where We Win
- [Our advantage 1]
- [Our advantage 2]

## Pricing Comparison
| Feature | Them | DoppelDown |
|---------|------|-----------|

## Objection Handling
| Objection | Response |
|-----------|----------|

## Trap Questions (Questions That Favor Us)
- "Can you show me transparent pricing on your website?"
- "Can I sign up without talking to sales?"
- "Do you offer a free tier?"

## Key Differentiators for This Matchup
1. [Most important differentiator]
2. [Second most important]
3. [Third most important]

## Recent Changes (Last 90 Days)
- [Date]: [Change observed]

## Intelligence Gaps
- [What we don't know about this competitor]
```

See `competitive-intelligence/battle-cards/` for individual battle cards.

---

## 9. Pricing Intelligence

### Pricing Tracking Matrix

Maintain a rolling record of competitor pricing signals.

| Competitor | Last Known Pricing | Pricing Model | Self-Serve? | Free Tier? | Last Verified | Source |
|-----------|-------------------|---------------|-------------|-----------|---------------|--------|
| ZeroFox | $2,000-$15,000/mo | Bundle-based | ❌ Contact sales | ❌ | 2026-02-05 | Website |
| BrandShield | $3,000-$10,000/mo | Contact sales | ❌ Contact sales | ❌ | 2026-02-05 | Website |
| Netcraft | $5,000-$25,000/mo | Contact sales | ❌ Contact sales | ❌ (free tools) | 2026-02-05 | Website |
| Red Points | $1,000-$8,000/mo | Tiered, request | ❌ Request demo | ❌ | 2026-02-05 | Website |
| Bolster/CheckPhish | $1,500-$5,000/mo | Contact sales | ❌ Contact sales | ✅ (CheckPhish free scan) | 2026-02-05 | Website |
| Doppel | $3,000-$15,000/mo | Contact sales | ❌ Contact sales | ❌ | 2026-02-05 | Website |
| PhishFort | $2,000-$10,000/mo | Contact sales | ❌ Contact sales | ❌ | 2026-02-05 | Website |
| Allure Security | $1,500-$5,000/mo | Contact sales | ❌ Contact sales | ❌ | 2026-02-05 | Website |
| **DoppelDown** | **$79-$499/mo** | **Transparent tiers** | **✅ Self-serve** | **✅ Free tier** | **2026-02-05** | **Our site** |

### Pricing Alert Triggers

Automatically flag and escalate when:
- [ ] Any Tier 1 competitor publishes transparent pricing
- [ ] Any competitor launches a self-serve signup flow
- [ ] Any competitor launches a free or freemium tier
- [ ] Any competitor drops below $500/mo for any tier
- [ ] Any competitor mentions "SMB" or "small business" in marketing

### Price Sensitivity Benchmarks

| If Competitor Prices At... | DoppelDown's Position | Action Required? |
|---------------------------|----------------------|-----------------|
| >$2,000/mo (current norm) | 10-25x cheaper — strong | ❌ No change |
| $500-$2,000/mo | 2-10x cheaper — comfortable | 🟡 Monitor closely |
| $200-$500/mo | Direct competition | 🔴 Feature differentiation push |
| <$200/mo | Price war territory | 🔴 Strategic reassessment needed |
| Free | Existential threat to PLG motion | 🔴 Differentiate on quality/support |

---

## 10. Feature Parity & Gap Tracking

### Feature Comparison Matrix

Track feature availability across competitors. Update monthly.

| Feature Category | Feature | DoppelDown | ZeroFox | BrandShield | Netcraft | Doppel | Red Points | Bolster |
|-----------------|---------|:----------:|:-------:|:-----------:|:--------:|:------:|:----------:|:-------:|
| **Onboarding** | Self-serve signup | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | Transparent pricing | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | Free tier | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅* |
| | Instant time-to-value | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅* |
| **Detection** | Typosquatting | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| | Homoglyph | ✅ | ✅ | ✅ | ✅ | ✅ | ❓ | ✅ |
| | Bitsquatting | ✅ | ✅ | ❓ | ✅ | ✅ | ❓ | ❓ |
| | NRD monitoring | ✅ | ✅ | ✅ | ✅ | ✅ | ❓ | ✅ |
| | Social media monitoring | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| | Dark web monitoring | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| | App store monitoring | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| | Marketplace monitoring | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **AI/ML** | AI risk scoring | ✅ | ✅ | ❓ | ✅ | ✅ | ❌ | ✅ |
| | Visual similarity | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ |
| | Phishing intent | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ |
| | NLP content analysis | ❌ | ✅ | ❌ | ❓ | ✅ | ❌ | ❓ |
| **Evidence** | Screenshots | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| | WHOIS data | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| | HTML archival | ✅ | ✅ | ❓ | ✅ | ❓ | ❌ | ❓ |
| | Legal-ready reports | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Response** | Takedown reports | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| | Auto-takedown execution | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| | DMCA assistance | ❌ | ✅ | ✅ | ❓ | ✅ | ✅ | ❌ |
| **Integrations** | API access | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| | Slack/Teams | 🔜 | ✅ | ❓ | ❌ | ✅ | ❌ | ❌ |
| | SIEM integration | 🔜 | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| | Webhooks | ✅ | ✅ | ❓ | ❓ | ✅ | ❌ | ❌ |
| **Enterprise** | SSO/SAML | 🔜 | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| | RBAC | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| | SOC 2 | 🔜 | ✅ | ✅ | ✅ | ✅ | ❓ | ❌ |
| | SLA | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

Legend: ✅ = Available | ❌ = Not available | ❓ = Unknown/unverified | 🔜 = Planned | ✅* = Partial

### Feature Gap Priority

Based on feature parity analysis, rank gaps by customer impact:

| Gap | Customer Impact | Competitor Coverage | Priority | Est. Effort |
|-----|----------------|--------------------|---------|-|
| Auto-takedown execution | 🔴 High — key differentiator for enterprise | 5/7 competitors | P1 | High |
| Dark web monitoring | 🟡 Medium — enterprise feature | 3/7 competitors | P2 | High |
| App store monitoring | 🟡 Medium — growing need | 4/7 competitors | P2 | Medium |
| Slack/Teams integration | 🟡 Medium — workflow integration | 3/7 competitors | P1 | Low |
| SSO/SAML | 🟡 Medium — enterprise table stakes | 5/7 competitors | P1 | Medium |
| NLP content analysis | 🟢 Low — nice-to-have AI feature | 2/7 competitors | P3 | Medium |

---

## 11. Market Trend Radar

### Track These Macro Trends

| Trend | Direction | Impact on DoppelDown | Time Horizon |
|-------|-----------|---------------------|-------------|
| **AI-generated phishing** increasing 300%+ YoY | ↗️ Accelerating | ✅ Positive — increases demand | Now |
| **Regulatory pressure** (DORA, NIS2, SEC rules) | ↗️ Growing | ✅ Positive — mandates monitoring | 1-2 years |
| **SMB security awareness** increasing | ↗️ Growing | ✅ Positive — expands TAM | 1-3 years |
| **AI model commoditization** (costs falling) | ↗️ Accelerating | ✅ Positive — reduces COGS | Now |
| **Platform consolidation** (M&A activity) | → Stable | ⚠️ Mixed — fewer competitors but bigger ones | 1-3 years |
| **Open-source security tools** improving | ↗️ Growing | ⚠️ Negative — substitution risk | 1-2 years |
| **Zero Trust architecture** adoption | ↗️ Growing | ✅ Positive — brand monitoring fits | 1-3 years |
| **Browser-native anti-phishing** | ↗️ Growing | ⚠️ Negative — reduces perceived urgency | 2-5 years |
| **Deepfake brand impersonation** | ↗️ Emerging | ✅ Positive — new protection need | 1-3 years |
| **Cyber insurance requirements** | ↗️ Growing | ✅ Positive — brand monitoring as mandate | 1-2 years |

### Emerging Technology Watch

| Technology | Maturity | Potential Impact | DoppelDown Action |
|-----------|---------|-----------------|-------------------|
| **LLM-powered phishing** | Production | Increases threat volume → more need for DoppelDown | Feature: AI phishing detection improvement |
| **Browser isolation** | Growing | Reduces phishing click-through → doesn't eliminate brand damage | Marketing: emphasize brand damage beyond clicks |
| **Decentralized identity** | Early | Could reduce impersonation → long-term threat | Monitor adoption curves |
| **Generative AI for defense** | Production | Better automated analysis | Feature: leverage for triage and response |
| **Blockchain domain verification** | Early | Could help brand verification | Monitor, don't invest yet |

---

## 12. Win/Loss Analysis Framework

### Data Collection

After every sales conversation (won or lost), capture:

```markdown
## Win/Loss Report: [Company Name]
*Date: YYYY-MM-DD | Outcome: Won/Lost | Tier: Growth/Business/Enterprise*

### Company Profile
- Industry: | Size: | Location:
- Decision maker role:
- Evaluated alternatives:

### Why They Were Looking
- [Pain point that drove the search]

### What They Compared Us To
- [Competitor 1]: [what they liked/disliked]
- [Competitor 2]: [what they liked/disliked]

### Decision Factors (Rank 1-5)
- Price: [1-5]
- Features: [1-5]
- Ease of use: [1-5]
- Brand/trust: [1-5]
- Support: [1-5]
- Time to value: [1-5]

### If Won: What Sealed the Deal?
- [The decisive factor]

### If Lost: Why?
- [Honest reason — feature gap? price? trust? competitor?]

### Verbatim Quotes
> "[Actual words from the prospect]"

### Actionable Insights
- [What should we change/build/say differently?]
```

### Win/Loss Tracking Dashboard

| Metric | Target | Current | Trend |
|--------|--------|---------|-------|
| Win rate vs. no decision | >30% | TBD | — |
| Win rate vs. named competitor | >50% | TBD | — |
| Top loss reason | Track | TBD | — |
| Average deal cycle (days) | <14 | TBD | — |
| Most common competitor encountered | Track | TBD | — |

---

## 13. Strategic Response Playbooks

### Playbook A: Competitor Launches Self-Serve Pricing

**Trigger**: Any Tier 1 competitor publishes transparent pricing or launches self-serve signup.

**Response Timeline**: 48 hours

| Hour | Action |
|------|--------|
| 0-4 | Document their pricing, screenshot everything, sign up for trial |
| 4-12 | Analyze: What tiers? What features per tier? How does it compare to ours? |
| 12-24 | Update battle card. Draft comparison content. |
| 24-48 | Publish "honest comparison" blog post. Update pricing page with competitive anchoring. |
| Ongoing | Monitor their conversion rates (sign up as test user), track social response |

### Playbook B: Well-Funded Competitor Enters SMB Market

**Trigger**: Competitor raises $20M+ and announces SMB strategy.

**Response Timeline**: 2-4 weeks

| Week | Action |
|------|--------|
| 1 | Deep analysis: What's their actual SMB offering? Price? Features? |
| 1 | Accelerate DoppelDown's highest-impact feature development |
| 2 | Publish thought leadership: "Why brand protection needs a different approach for SMBs" |
| 2-3 | Activate partner channel: brief MSP/MSSP partners, provide competitive talking points |
| 3-4 | Launch targeted campaign to competitor's likely targets (similar company profiles) |
| Ongoing | Track their traction via job postings, social mentions, review sites |

### Playbook C: Major Platform Adds Brand Monitoring

**Trigger**: Cloudflare, AWS, Google, or Microsoft announces brand monitoring feature.

**Response Timeline**: 1-2 weeks

| Day | Action |
|-----|--------|
| 1-2 | Analyze: What exactly are they offering? How deep? How good? |
| 2-3 | Identify what they DON'T do that DoppelDown does (likely: AI analysis, takedown reports, evidence packages) |
| 3-7 | Reposition: "Best-in-class brand protection that works alongside [Platform]" |
| 7-14 | Build integration if possible: make DoppelDown complementary, not competitive |
| Ongoing | Monitor adoption and feature evolution |

### Playbook D: Competitor Has Security Breach or PR Crisis

**Trigger**: Competitor suffers data breach, outage, or negative press.

**Response Timeline**: Carefully timed

| | Action |
|---|--------|
| ❌ DO NOT | Attack them publicly, post comparisons referencing their breach, or contact their customers directly about it |
| ✅ DO | Quietly be available if their customers come looking for alternatives |
| ✅ DO | Publish general content about "evaluating brand protection vendor security" (without naming them) |
| ✅ DO | Ensure DoppelDown's own security posture is documented and visible |
| ✅ DO | Update battle card with factual information for sales conversations |

**Principle**: Win on merit, not on others' misfortune. Richard's integrity is a brand asset.

### Playbook E: Open-Source Tool Threatens Substitution

**Trigger**: A free/open-source tool reaches feature parity on core detection.

**Response Timeline**: 2-4 weeks

| Week | Action |
|------|--------|
| 1 | Honestly assess: Is this tool actually good enough to replace DoppelDown for some users? |
| 1-2 | Publish "DoppelDown vs. DIY Brand Monitoring" content — honest, not dismissive |
| 2-3 | Identify what OSS can't do: continuous monitoring, AI analysis, evidence packaging, alerting, reports |
| 3-4 | Consider: Can we integrate or build on top of this tool? Open-source friendliness builds credibility |
| Ongoing | Monitor project health (stars, contributors, commits) |

---

## 14. Automated Monitoring Infrastructure

### Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    COLLECTION LAYER                            │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Website  │  │ RSS Feed │  │ Social   │  │ Review   │     │
│  │ Monitor  │  │ Monitor  │  │ Monitor  │  │ Monitor  │     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│       │              │              │              │           │
│       └──────────────┴──────────────┴──────────────┘           │
│                              │                                 │
│                    ┌─────────▼─────────┐                      │
│                    │  Signal Processor │                      │
│                    │  (classify, score,│                      │
│                    │   deduplicate)    │                      │
│                    └─────────┬─────────┘                      │
│                              │                                 │
├──────────────────────────────┼──────────────────────────────────┤
│                    STORAGE LAYER                               │
│                              │                                 │
│                    ┌─────────▼─────────┐                      │
│                    │  Signal Database  │                      │
│                    │  (JSON files +    │                      │
│                    │   change history) │                      │
│                    └─────────┬─────────┘                      │
│                              │                                 │
├──────────────────────────────┼──────────────────────────────────┤
│                    OUTPUT LAYER                                 │
│                              │                                 │
│               ┌──────────────┼──────────────┐                 │
│               │              │              │                 │
│         ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐          │
│         │ Battle    │ │ Weekly    │ │  Alert    │          │
│         │ Card      │ │ Report    │ │ (urgent   │          │
│         │ Updates   │ │ Generator │ │  signals) │          │
│         └───────────┘ └───────────┘ └───────────┘          │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

### Implementation

Scripts are in `competitive-intelligence/scripts/`. They are designed to run on a cron schedule or manually.

Key scripts:
- `monitor-competitor-sites.sh` — Screenshot + text diff of competitor websites
- `monitor-pricing-pages.sh` — Focused pricing page monitoring
- `aggregate-signals.sh` — Combine all signal sources into unified report
- `generate-weekly-report.sh` — Produce weekly CI summary

See script files for implementation details and usage.

---

## 15. Reporting & Distribution

### Weekly CI Brief (Every Monday)

```markdown
# DoppelDown CI Brief — Week of YYYY-MM-DD

## 🔴 Urgent Signals
- [Any critical competitive moves this week]

## 🟡 Notable Changes
- [Feature launches, pricing changes, content campaigns]

## 🟢 Background Signals
- [Job postings, social activity, content trends]

## Market Sentiment
- [Community discussions, analyst mentions, media coverage]

## Action Items
- [ ] [Specific thing to do based on this week's intelligence]

## Next Week's Focus
- [Which competitor to deep-dive, what to monitor closely]
```

### Monthly CI Report (First Friday of Month)

- Full competitor landscape update
- Pricing tracker refresh
- Feature parity matrix update
- Market trend assessment
- Win/loss summary
- Strategic recommendations

### Quarterly Strategic Brief

- Comprehensive market position assessment
- Competitor trajectory projections
- Strategic option analysis
- Product roadmap competitive alignment
- Annual plan adjustments

---

## 16. Annual Intelligence Calendar

| Month | Deep-Dive Competitor | Industry Event | Special Focus |
|-------|---------------------|----------------|--------------|
| **January** | Doppel | — | Annual planning, full landscape refresh |
| **February** | ZeroFox | — | Q1 competitor earnings/announcements |
| **March** | BrandShield | — | New entrant scan (YC W-batch demos) |
| **April** | Netcraft | RSA Conference | RSA competitive intelligence gathering |
| **May** | Red Points | — | Mid-year pricing review |
| **June** | Bolster/CheckPhish | AusCERT (Australia) | Regional competitor scan |
| **July** | Allure Security | — | H1 strategic review |
| **August** | Memcyco | Black Hat / DEF CON | Security community pulse |
| **September** | PhishFort | — | New entrant scan (YC S-batch demos) |
| **October** | ZeroFox (repeat) | — | Q4 planning, annual review prep |
| **November** | Doppel (repeat) | — | Gartner/Forrester report analysis |
| **December** | — | — | Annual CI system audit & improvement |

---

## 17. File Structure & Maintenance

### Directory Structure

```
competitive-intelligence/
├── competitor-profiles/           # Deep-dive profiles per competitor
│   ├── zerofox.md
│   ├── brandshield.md
│   ├── netcraft.md
│   ├── red-points.md
│   ├── bolster-checkphish.md
│   ├── doppel.md
│   ├── phishfort.md
│   ├── allure-security.md
│   └── memcyco.md
├── battle-cards/                  # Sales-ready competitive cards
│   ├── TEMPLATE.md
│   ├── vs-zerofox.md
│   ├── vs-brandshield.md
│   ├── vs-netcraft.md
│   ├── vs-enterprise-vendors.md   # Generic "vs. any enterprise vendor"
│   └── vs-diy-opensource.md       # vs. manual/open-source approach
├── monitoring/                    # Monitoring logs and changelogs
│   ├── signal-log.md              # Running log of all detected signals
│   ├── pricing-tracker.md         # Historical pricing data
│   └── feature-tracker.md         # Feature change log
├── analysis/                      # Deep analysis documents
│   ├── market-sizing.md
│   ├── swot-analysis.md
│   ├── positioning-map.md
│   └── trend-radar.md
├── tracking/                      # Win/loss and customer intelligence
│   ├── win-loss-log.md
│   └── customer-feedback.md
├── scripts/                       # Automated monitoring scripts
│   ├── monitor-competitor-sites.sh
│   ├── monitor-pricing-pages.sh
│   ├── monitor-reviews.sh
│   └── generate-weekly-report.sh
└── reports/                       # Generated reports
    └── weekly/
```

### Maintenance Rules

1. **Every file has a "Last updated" date** — stale intelligence is dangerous
2. **Confidence levels on all claims** — High/Medium/Low/Unverified
3. **Source attribution** — Every data point traces to a source
4. **Quarterly review** — Remove outdated intelligence, update all profiles
5. **Version history** — Git tracks all changes for historical analysis

---

*This system is designed for a bootstrapped team. Start with the weekly cadence, automate what you can, and expand as the business grows. The goal is decision-quality intelligence, not intelligence-agency-quality intelligence.*
