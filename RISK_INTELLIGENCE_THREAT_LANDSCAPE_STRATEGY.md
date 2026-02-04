# DoppelDown: Risk Intelligence & Threat Landscape Analysis Strategy
*Version 1.0 | Prepared: 2026-02-05*
*Companion to: ML_THREAT_DETECTION.md, GTM_PLAYBOOK.md, COMPETITIVE_ANALYSIS.md*

---

## Table of Contents

1. [Strategic Overview](#1-strategic-overview)
2. [Threat Landscape Assessment](#2-threat-landscape-assessment)
3. [Intelligence Collection Framework](#3-intelligence-collection-framework)
4. [Intelligence Sources & Feeds Architecture](#4-intelligence-sources--feeds-architecture)
5. [Analysis & Enrichment Pipeline](#5-analysis--enrichment-pipeline)
6. [Threat Correlation & Fusion Engine](#6-threat-correlation--fusion-engine)
7. [Customer-Facing Threat Detection Integration](#7-customer-facing-threat-detection-integration)
8. [Alerting & Notification Strategy](#8-alerting--notification-strategy)
9. [Threat Intelligence Lifecycle Management](#9-threat-intelligence-lifecycle-management)
10. [Dark Web & Underground Monitoring](#10-dark-web--underground-monitoring)
11. [Newly Registered Domain (NRD) Intelligence](#11-newly-registered-domain-nrd-intelligence)
12. [Certificate Transparency Log Monitoring](#12-certificate-transparency-log-monitoring)
13. [Social Media Threat Intelligence](#13-social-media-threat-intelligence)
14. [Phishing Kit & Infrastructure Tracking](#14-phishing-kit--infrastructure-tracking)
15. [Threat Actor Profiling & Attribution](#15-threat-actor-profiling--attribution)
16. [Risk Scoring & Prioritisation Model](#16-risk-scoring--prioritisation-model)
17. [Customer Threat Landscape Reports](#17-customer-threat-landscape-reports)
18. [Automation & Playbook Integration](#18-automation--playbook-integration)
19. [Data Architecture & Storage](#19-data-architecture--storage)
20. [Metrics, KPIs & Continuous Improvement](#20-metrics-kpis--continuous-improvement)
21. [Implementation Roadmap](#21-implementation-roadmap)
22. [Cost Analysis & Resource Requirements](#22-cost-analysis--resource-requirements)

---

## 1. Strategic Overview

### 1.1 Purpose

This document defines DoppelDown's comprehensive strategy for gathering, analysing, correlating, and operationalising threat intelligence to protect customer brands from impersonation, phishing, and digital fraud. It transforms DoppelDown from a reactive scan-and-detect tool into a **proactive intelligence-driven brand protection platform**.

### 1.2 Strategic Thesis

> **DoppelDown's competitive moat is not scanning — it's intelligence.** Any developer can build a typosquatting generator. The value is in connecting the dots: correlating a newly registered domain with a known phishing kit, linking it to an actor who targeted three other customers last month, and alerting the customer with a risk-scored, evidence-rich, actionable notification before the phishing campaign even launches.

### 1.3 Strategic Objectives

| Objective | Success Metric | Timeline |
|-----------|---------------|----------|
| **Proactive Detection** | Detect 70%+ of threats before customer reports them | 6 months |
| **Mean Time to Detect (MTTD)** | < 4 hours for critical threats (NRDs, phishing pages) | 3 months |
| **Mean Time to Alert (MTTA)** | < 15 minutes after detection for critical/high severity | 3 months |
| **False Positive Rate** | < 5% for high/critical alerts | 6 months |
| **Intelligence Coverage** | 15+ intelligence sources active and contributing | 6 months |
| **Customer Value** | 90%+ of customers rate threat alerts as "actionable" | 9 months |
| **Threat Landscape Reports** | Monthly automated reports for all Pro/Enterprise customers | 4 months |

### 1.4 Current State Assessment

DoppelDown already has substantial infrastructure in place:

| Capability | Status | Maturity |
|-----------|--------|----------|
| Typosquatting domain generation | ✅ Built | Production |
| Web scanning (lookalike detection) | ✅ Built | Production |
| Social media scanning | ✅ Built | Production |
| Evidence collection (screenshots, WHOIS, HTML) | ✅ Built | Production |
| Threat intel feeds (Google Safe Browsing, PhishTank, URLhaus, OpenPhish) | ✅ Built | Production |
| External reputation APIs (VirusTotal, AbuseIPDB, HIBP) | ✅ Built | Production |
| ML threat detection (autoencoder + isolation forest) | ✅ Built | Beta |
| Threat correlation engine | ✅ Built | Beta |
| Intelligence gatherer (OTX, ThreatFox, abuse.ch, MISP) | ✅ Built | Beta |
| Actionable intelligence & playbook generation | ✅ Built | Beta |
| NRD scanning | ✅ Built | Beta |
| Dark web monitoring | ⚠️ Stubbed | Planned |
| Certificate transparency monitoring | ❌ Not built | Planned |
| Phishing kit tracking | ❌ Not built | Planned |
| Threat actor profiling | ❌ Not built | Planned |
| Customer threat landscape reports | ❌ Not built | Planned |
| Predictive threat modelling | ⚠️ Stubbed | Planned |

### 1.5 Design Principles

1. **Intelligence-Led, Not Alert-Led** — Every alert should be enriched with context: who, what, why, when, how likely, and what to do about it.
2. **SMB-Accessible** — Enterprise threat intelligence concepts translated into language and workflows that a founder, marketer, or small security team can act on.
3. **Graceful Degradation** — The system works with zero paid API keys (free feeds only) and gets progressively better as paid sources are added.
4. **Privacy-First** — Customer brand data and scan results are never shared between tenants or with intelligence providers.
5. **Cost-Proportional** — Intelligence costs scale with customer tier. Starter customers get community feeds; Enterprise customers get full enrichment.
6. **Actionable Over Exhaustive** — A scored, contextualised alert with a recommended action beats a dump of 200 raw IOCs every time.

---

## 2. Threat Landscape Assessment

### 2.1 Primary Threat Categories for DoppelDown Customers

| Threat Category | Description | Prevalence | Trend | DoppelDown Coverage |
|----------------|-------------|-----------|-------|-------------------|
| **Typosquatting** | Domains mimicking brand names via character substitution, omission, insertion | Very High | ↑ Increasing | ✅ Strong |
| **Combo-squatting** | Brand name + keywords (e.g., `brand-login.com`, `mybrand-support.net`) | High | ↑↑ Rapidly increasing | ✅ Strong |
| **Homoglyph attacks** | Unicode lookalike characters (`аpple.com` using Cyrillic "а") | Medium | → Stable | ✅ Strong |
| **Phishing pages** | Cloned/fake login pages targeting brand customers | Very High | ↑↑ Rapidly increasing | ✅ Good |
| **Fake social accounts** | Impersonation on Facebook, Instagram, X, LinkedIn, TikTok | Very High | ↑↑ Rapidly increasing | ✅ Good |
| **BEC-adjacent impersonation** | Fake executive profiles used for business email compromise setups | High | ↑ Increasing | ⚠️ Partial |
| **Rogue mobile apps** | Fake brand apps on official and third-party stores | Medium | ↑ Increasing | ❌ Not covered |
| **SEO poisoning** | Malicious ads/results using brand keywords | Medium | ↑ Increasing | ❌ Not covered |
| **Dark web brand mentions** | Brand credentials, data dumps, planned attacks discussed on dark web | Medium | → Stable | ⚠️ Planned |
| **Certificate abuse** | SSL certificates issued for impersonation domains | High | ↑ Increasing | ❌ Planned |
| **DNS hijacking/shadowing** | Subdomain takeover or DNS manipulation | Low-Medium | → Stable | ❌ Not covered |
| **Brand abuse in phishing kits** | Pre-built phishing kits targeting specific brands | High | ↑↑ Rapidly increasing | ❌ Planned |

### 2.2 Threat Actor Landscape

| Actor Type | Motivation | Sophistication | Volume | DoppelDown Relevance |
|-----------|-----------|---------------|--------|---------------------|
| **Opportunistic phishers** | Financial (credential theft, BEC) | Low-Medium | Very High | Primary target |
| **Phishing-as-a-Service operators** | Financial (selling phishing kits/pages) | Medium-High | High | High — upstream detection |
| **Brand impersonation scammers** | Financial (fake products, advance fee fraud) | Low | Very High | Primary target |
| **Credential harvesters** | Financial (selling credentials) | Medium | High | Primary target |
| **Competitors (gray area)** | Market capture | Low | Low | Niche but valuable |
| **Hacktivists** | Ideological | Medium | Low | Low priority |
| **Nation-state (brand targeting)** | Intelligence, disruption | High | Very Low | Out of scope for SMB product |

### 2.3 Attack Lifecycle (Brand Impersonation Kill Chain)

Understanding the brand impersonation kill chain is essential for choosing where DoppelDown can intervene most effectively:

```
┌─────────────────────────────────────────────────────────────────────┐
│                  BRAND IMPERSONATION KILL CHAIN                    │
├──────────────┬──────────────┬──────────────┬───────────┬───────────┤
│ 1. RECON     │ 2. SETUP     │ 3. STAGING   │ 4. LAUNCH │ 5. CASH  │
│              │              │              │           │   OUT     │
│ • Identify   │ • Register   │ • Deploy     │ • Spam/   │ • Steal  │
│   target     │   domain     │   phishing   │   ads/SEO │   creds  │
│   brand      │ • Get SSL    │   page       │ • Social  │ • Sell   │
│ • Clone      │   cert       │ • Create     │   media   │   data   │
│   assets     │ • Set up     │   social     │   posts   │ • Money  │
│ • Study      │   hosting    │   profiles   │ • Email   │   mule   │
│   brand      │ • Buy        │ • Test       │   blasts  │ • Repeat │
│   presence   │   phishing   │   campaign   │ • SMS     │          │
│              │   kit        │              │   phishing│          │
├──────────────┼──────────────┼──────────────┼───────────┼───────────┤
│ DETECTION    │ DETECTION    │ DETECTION    │ DETECTION │ DETECTION │
│ OPPORTUNITY: │ OPPORTUNITY: │ OPPORTUNITY: │ OPPORT.:  │ OPPORT.:│
│ LOW          │ HIGH ★       │ HIGH ★       │ MEDIUM    │ LOW      │
│              │              │              │           │          │
│ • Dark web   │ • NRD feeds  │ • Web scan   │ • Threat  │ • HIBP   │
│   chatter    │ • CT logs    │ • Social     │   feeds   │ • Breach │
│              │ • WHOIS      │   scan       │ • User    │   intel  │
│              │   monitoring │ • Visual     │   reports │          │
│              │              │   similarity │ • Email   │          │
│              │              │              │   intel   │          │
└──────────────┴──────────────┴──────────────┴───────────┴───────────┘
```

**Key Insight:** DoppelDown's maximum value is at Stages 2 and 3 — detecting infrastructure setup before the campaign launches. This is where intelligence-driven detection crushes reactive scanning.

---

## 3. Intelligence Collection Framework

### 3.1 Intelligence Requirements (Priority Intelligence Requirements — PIRs)

Modelled on military/intelligence community PIR methodology, adapted for brand protection:

| PIR ID | Priority Intelligence Requirement | Collection Sources | Refresh Rate |
|--------|----------------------------------|-------------------|-------------|
| **PIR-1** | Which new domains have been registered that impersonate our customers' brands? | NRD feeds, CT logs, passive DNS | Every 1-6 hours |
| **PIR-2** | Are any known phishing pages or kits targeting our customers' brands currently active? | PhishTank, OpenPhish, URLhaus, Google Safe Browsing | Every 15 minutes |
| **PIR-3** | Are any new social media accounts impersonating our customers? | Platform-specific search, social scanning | Every 6-24 hours |
| **PIR-4** | Have any new SSL certificates been issued for domains resembling our customers' brands? | CT log monitoring (crt.sh, Certstream) | Real-time stream |
| **PIR-5** | Is there dark web chatter mentioning our customers' brands in credential dumps, attack planning, or kit distribution? | Dark web monitoring services, paste site monitors | Every 1-6 hours |
| **PIR-6** | What is the global phishing/impersonation trend for each customer's industry? | APWG reports, internal telemetry, threat feeds | Weekly |
| **PIR-7** | Are there known threat actors or campaigns currently active against our customers' industries? | AlienVault OTX, ThreatFox, MISP, internal correlation | Daily |
| **PIR-8** | Have any of our customers' brand assets (logos, content, HTML) appeared in known phishing kits? | Phishing kit trackers, code analysis | Daily |

### 3.2 Collection Disciplines

Borrowing from the intelligence community's collection disciplines (INTs), adapted for DoppelDown:

| Discipline | Analogue | DoppelDown Application | Implementation |
|-----------|---------|----------------------|----------------|
| **OSINT** (Open Source) | Publicly available data | NRD feeds, CT logs, WHOIS, web scraping, social media search | ✅ Core — already partially built |
| **SIGINT** (Signals) | Network/infrastructure signals | DNS analysis, SSL cert analysis, hosting infrastructure fingerprinting | ⚠️ Partial — DNS and SSL planned |
| **HUMINT** (Human) | Community reports | Customer-reported threats, community phishing reports, abuse mailbox integration | ❌ Planned |
| **TECHINT** (Technical) | Technical artefact analysis | Phishing kit dissection, visual similarity ML, HTML analysis | ⚠️ Partial — ML built, kit analysis planned |
| **MASINT** (Measurement & Signature) | Behavioural signatures | Domain registration patterns, hosting migration patterns, temporal activity analysis | ⚠️ Stubbed — correlation engine exists |

### 3.3 Collection Tiers by Customer Plan

Not all customers need (or should pay for) the same intelligence depth:

| Intelligence Capability | Free Tier | Starter ($49) | Professional ($99) | Enterprise ($249) |
|------------------------|-----------|---------------|-------------------|--------------------|
| Typosquatting generation | ✅ 50 variants | ✅ 200 variants | ✅ 500+ variants | ✅ Unlimited |
| Community threat feeds (PhishTank, OpenPhish, URLhaus) | ✅ | ✅ | ✅ | ✅ |
| Google Safe Browsing | ✅ | ✅ | ✅ | ✅ |
| NRD monitoring | ❌ | ✅ Daily | ✅ 6-hourly | ✅ Hourly |
| VirusTotal enrichment | ❌ | ⚠️ Limited | ✅ Full | ✅ Full + historical |
| AbuseIPDB enrichment | ❌ | ❌ | ✅ | ✅ |
| CT log monitoring | ❌ | ❌ | ✅ Daily digest | ✅ Real-time stream |
| ML threat scoring | ❌ | ✅ Basic | ✅ Full ensemble | ✅ Full + custom models |
| Threat correlation | ❌ | ❌ | ✅ Basic | ✅ Full with actor profiling |
| Dark web monitoring | ❌ | ❌ | ❌ | ✅ |
| Phishing kit tracking | ❌ | ❌ | ❌ | ✅ |
| Monthly threat landscape report | ❌ | ❌ | ✅ | ✅ (with analyst commentary) |
| Predictive threat modelling | ❌ | ❌ | ❌ | ✅ |
| Custom intelligence requests | ❌ | ❌ | ❌ | ✅ |

---

## 4. Intelligence Sources & Feeds Architecture

### 4.1 Source Taxonomy

```
┌─────────────────────────────────────────────────────────────────┐
│                    INTELLIGENCE SOURCES                         │
├──────────────────┬──────────────────┬───────────────────────────┤
│   FREE / OSINT   │  FREEMIUM / API  │   COMMERCIAL / PREMIUM   │
├──────────────────┼──────────────────┼───────────────────────────┤
│ OpenPhish        │ VirusTotal (4/m) │ VirusTotal Premium        │
│ PhishTank        │ AbuseIPDB (1K/d) │ Recorded Future           │
│ URLhaus          │ AlienVault OTX   │ Mandiant Threat Intel     │
│ abuse.ch (all)   │ URLScan.io       │ CrowdStrike Intel         │
│ crt.sh (CT logs) │ Shodan (limited) │ DomainTools Iris          │
│ Certstream       │ SecurityTrails   │ RiskIQ/PassiveTotal       │
│ WHOIS lookup     │ CIRCL pDNS       │ SpyCloud (dark web)       │
│ PassiveDNS       │ MISP (self-host) │ Flashpoint (dark web)     │
│ NRD zone files   │ ThreatFox        │ Intel471 (dark web)       │
│ APWG eCrime feed │ HIBP API         │ Bolster.ai (phishing)     │
│ BGP Stream       │ Google SB API    │ PhishLabs (Fortra)        │
│ DNS over HTTPS   │ Pulsedive        │ Silent Push               │
│ Paste monitors   │ GreyNoise        │ Netcraft                  │
│ GitHub (kits)    │ IPInfo           │ Cofense                   │
│ Telegram bots    │ WhoisXML API     │ Custom dark web crawlers  │
└──────────────────┴──────────────────┴───────────────────────────┘
```

### 4.2 Source Integration Priority

**Phase 1 — Immediate (Weeks 1-4): Maximise Free Sources**

| Source | Type | Data Provided | Integration Effort | Cost |
|--------|------|--------------|-------------------|------|
| Certstream | WebSocket stream | Real-time CT log entries for all CAs | Medium (persistent connection) | Free |
| crt.sh API | REST API | Historical CT log searches | Low (simple HTTP) | Free |
| NRD zone files (CZDS) | Daily file download | .com, .net, .org new registrations | Medium (bulk processing) | Free (application required) |
| abuse.ch full feed | REST API | ThreatFox IOCs, URLhaus, MalBazaar | Low (already integrated) | Free |
| APWG eCrime | Data feed | Global phishing report data | Medium (membership) | Free (academic/research) |
| GitHub phishing kit repos | Git/API scraping | Known phishing kit templates | Medium (regex matching) | Free |
| Paste site monitors | Scraping/API | Leaked credentials, brand mentions | Medium | Free |

**Phase 2 — Short-term (Weeks 5-12): Freemium APIs at Scale**

| Source | Type | Data Provided | Integration Effort | Cost |
|--------|------|--------------|-------------------|------|
| VirusTotal (paid) | REST API | Domain/URL/IP reputation, relations | Low (upgrade existing) | ~$100/month |
| URLScan.io (paid) | REST API | Live page screenshots, DOM analysis | Low (upgrade existing) | ~$50/month |
| WhoisXML API | REST API | WHOIS, DNS history, reverse lookups | Medium | ~$50-100/month |
| SecurityTrails | REST API | Historical DNS, WHOIS, subdomains | Medium | ~$50/month |
| Shodan | REST API | Hosting infrastructure intelligence | Medium | ~$60/month |
| Pulsedive | REST API | IOC enrichment, threat indicators | Low | Free tier + $30/month |

**Phase 3 — Medium-term (Months 4-9): Premium Intelligence**

| Source | Type | Data Provided | Integration Effort | Cost |
|--------|------|--------------|-------------------|------|
| DomainTools Iris | REST API | Domain risk scoring, connected infrastructure | Medium | ~$200-500/month |
| SpyCloud | REST API | Dark web credential monitoring | High | ~$500-1000/month |
| Silent Push | REST API | Domain/infrastructure intelligence | Medium | ~$300-500/month |
| PhishLabs / Fortra | API + managed | Phishing takedown + intelligence | High | ~$500-1000/month |

**Phase 4 — Long-term (Months 9-18): Enterprise Capabilities**

| Source | Type | Data Provided | Integration Effort | Cost |
|--------|------|--------------|-------------------|------|
| Recorded Future | API | Comprehensive threat intelligence | High | ~$2000+/month |
| Mandiant / Google TI | API | APT/campaign intelligence | High | ~$2000+/month |
| Custom dark web crawlers | Self-built | Brand-specific monitoring | Very High | Engineering cost |

### 4.3 Source Reliability & Confidence Model

Each intelligence source receives a reliability score that affects how much it contributes to the final threat score:

```typescript
interface IntelligenceSource {
  id: string
  name: string
  category: 'free' | 'freemium' | 'commercial' | 'internal'
  reliability: number           // 0.0 - 1.0 base reliability
  freshnessDecayPerHour: number // How quickly data becomes stale
  coverageDomains: string[]     // What it's good at detecting
  falsePositiveRate: number     // Historical FP rate
  latencyMs: number             // Average response time
  costPerQuery: number          // API cost per query (USD)
}

// Reliability tiers:
// 0.90 - 1.00: Authoritative (Google SB, VirusTotal Premium, internal)
// 0.80 - 0.89: High (AbuseIPDB, ThreatFox, PhishTank verified)
// 0.70 - 0.79: Good (AlienVault OTX, URLhaus, OpenPhish)
// 0.50 - 0.69: Moderate (paste monitors, community reports)
// 0.30 - 0.49: Low (unverified tips, social media mentions)
// 0.00 - 0.29: Unverified (first-seen, single-source only)
```

### 4.4 Source Health Monitoring

Every intelligence source is continuously monitored for:

| Metric | Threshold | Action on Breach |
|--------|----------|-----------------|
| Availability (uptime) | > 95% over 24h | Fallback to cached data; alert ops |
| Response latency | < 5 seconds p95 | Circuit breaker; use cached data |
| Data freshness | Source-specific (15m to 24h) | Log warning; adjust confidence scores |
| False positive rate | < 10% per source | Reduce reliability weight; investigate |
| Data volume anomaly | ±50% from 7-day average | Investigate; may indicate feed issue or attack spike |

---

## 5. Analysis & Enrichment Pipeline

### 5.1 Pipeline Architecture

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌───────────┐
│  COLLECT  │───▶│   NORMALISE  │───▶│    ENRICH    │───▶│   ANALYSE    │───▶│   SCORE   │
│           │    │              │    │              │    │              │    │           │
│ • Feeds   │    │ • Deduplicate│    │ • WHOIS      │    │ • ML models  │    │ • Risk    │
│ • Scans   │    │ • Normalise  │    │ • DNS        │    │ • Correlation│    │   scoring │
│ • Reports │    │   IOC format │    │ • SSL/TLS    │    │ • Pattern    │    │ • Priority│
│ • CT logs │    │ • Tag source │    │ • Hosting    │    │   detection  │    │ • Alert   │
│ • NRDs    │    │ • Timestamp  │    │ • Reputation │    │ • Visual sim │    │   routing │
│ • APIs    │    │ • Validate   │    │ • Historical │    │ • NLP intent │    │           │
└──────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └───────────┘
                                                                                  │
                                                                                  ▼
                                                                         ┌───────────────┐
                                                                         │    DELIVER     │
                                                                         │               │
                                                                         │ • Dashboard   │
                                                                         │ • Email alert │
                                                                         │ • Webhook     │
                                                                         │ • API         │
                                                                         │ • Report      │
                                                                         │ • Takedown    │
                                                                         └───────────────┘
```

### 5.2 Normalisation Layer

All threat indicators are normalised into a common IOC (Indicator of Compromise) format before enrichment:

```typescript
interface NormalisedIndicator {
  // Identity
  id: string                           // UUID
  type: 'domain' | 'url' | 'ip' | 'email' | 'hash' | 'social_profile'
  value: string                        // The indicator value
  defanged: string                     // Defanged version (e.g., hxxps://)
  
  // Source
  source: string                       // Source ID
  sourceCategory: 'feed' | 'scan' | 'report' | 'ct_log' | 'nrd' | 'api'
  sourceReliability: number            // 0.0 - 1.0
  firstSeenAt: string                  // ISO timestamp
  lastSeenAt: string                   // ISO timestamp
  
  // Context
  brandIds: string[]                   // Matched customer brands
  matchType: string                    // How it was matched (typosquat, keyword, visual, etc.)
  matchConfidence: number              // 0.0 - 1.0
  
  // Enrichment (populated downstream)
  enrichment?: EnrichmentData
  
  // Analysis (populated downstream)
  analysis?: AnalysisResult
  
  // Scoring (populated downstream)  
  riskScore?: number                   // 0 - 100
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'info'
  
  // Metadata
  tags: string[]
  ttl: number                          // Seconds until expiry
  status: 'new' | 'enriched' | 'analysed' | 'scored' | 'alerted' | 'resolved'
}
```

### 5.3 Enrichment Stages

Each indicator passes through multiple enrichment stages. Stages execute concurrently where possible:

**Stage 1: Infrastructure Enrichment (immediate)**
| Data Point | Source | Purpose |
|-----------|--------|---------|
| WHOIS registration data | WhoisXML / direct WHOIS | Registrant info, registration date, registrar |
| DNS records (A, MX, NS, TXT) | DNS over HTTPS | Hosting provider, mail config, SPF/DMARC |
| IP geolocation | IPInfo / MaxMind | Hosting country, ASN, provider |
| Reverse DNS | DNS resolver | PTR records, co-hosted domains |
| SSL certificate details | crt.sh / direct TLS | Issuer, subject, SANs, validity dates |

**Stage 2: Reputation Enrichment (seconds)**
| Data Point | Source | Purpose |
|-----------|--------|---------|
| VirusTotal score | VirusTotal API | Multi-engine malware/phishing detection |
| AbuseIPDB score | AbuseIPDB API | IP abuse history |
| Google Safe Browsing | Google API | Known malware/phishing/unwanted software |
| PhishTank verification | PhishTank API | Community-verified phishing URLs |
| URLhaus status | abuse.ch API | Known malware distribution URLs |

**Stage 3: Deep Enrichment (seconds to minutes)**
| Data Point | Source | Purpose |
|-----------|--------|---------|
| Visual similarity (screenshot) | Puppeteer + ML | How closely page resembles target brand |
| Content analysis (NLP) | OpenAI API | Phishing intent detection from page content |
| Historical DNS | SecurityTrails / DNSDB | Previous IP addresses, hosting changes |
| Domain age and history | WhoisXML | Registration patterns, domain parking history |
| Connected infrastructure | DomainTools / VirusTotal | Other domains on same IP/registrant/nameserver |

**Stage 4: Contextual Enrichment (background)**
| Data Point | Source | Purpose |
|-----------|--------|---------|
| Threat actor attribution | Internal correlation | Link to known actor or campaign |
| MITRE ATT&CK mapping | Classification engine | Technique identification |
| Industry threat context | Internal telemetry | How common is this threat type for this industry |
| Historical pattern matching | Internal database | Has this exact pattern been seen before |

### 5.4 Enrichment Cost Management

API calls cost money. DoppelDown must be intelligent about when to enrich:

```
Enrichment Decision Tree:
─────────────────────────

1. Is the indicator already in cache and fresh? → USE CACHE
2. Is this for a Free tier customer? → COMMUNITY FEEDS ONLY (free APIs)
3. Is this a known-benign domain (e.g., google.com)? → SKIP ENRICHMENT
4. Does the initial scan score exceed 40/100? → FULL ENRICHMENT
5. Is this a newly registered domain (< 30 days)? → FULL ENRICHMENT
6. Is this from a CT log matching a customer brand? → FULL ENRICHMENT
7. Otherwise → BASIC ENRICHMENT (free sources only)
```

**Monthly API Budget Allocation (estimated at 100 customers):**

| API | Free Tier | Estimated Monthly Volume | Monthly Cost |
|-----|----------|------------------------|--------------|
| VirusTotal | 500 requests/day | ~15,000 lookups | $100 (premium lite) |
| AbuseIPDB | 1,000 requests/day | ~5,000 lookups | Free |
| Google Safe Browsing | 10,000 URLs/day | ~20,000 lookups | Free |
| PhishTank | Unlimited | ~10,000 lookups | Free |
| URLhaus | Unlimited | ~10,000 lookups | Free |
| URLScan.io | 100 scans/day | ~3,000 scans | $50 (paid tier) |
| WhoisXML | 500 requests/month | ~500 lookups | $50 |
| crt.sh | Unlimited | ~5,000 queries | Free |
| **Total** | | | **~$200/month** |

---

## 6. Threat Correlation & Fusion Engine

### 6.1 Correlation Objectives

The correlation engine transforms individual indicators into connected threat narratives. A single domain registration is noise. Three related domains registered by the same entity within 24 hours, using the same hosting provider, with SSL certs from the same CA, all targeting the same brand — that's actionable intelligence.

### 6.2 Correlation Dimensions

| Dimension | What's Correlated | Example |
|-----------|-------------------|---------|
| **Temporal** | Events occurring in the same time window | 5 brand-related domains registered within 2 hours |
| **Infrastructure** | Shared hosting, DNS, registrar, IP, ASN | 3 phishing domains resolving to the same IP address |
| **Registrant** | Same WHOIS registrant, email, or privacy service | Domains registered by same entity targeting multiple brands |
| **Content** | Similar page content, HTML structure, or assets | Multiple phishing pages using the same kit template |
| **Visual** | Similar screenshots, logos, or design elements | Pages with >80% visual similarity to target brand |
| **Behavioural** | Similar attack patterns, timing, or TTPs | Same phishing flow (fake login → OTP intercept → redirect) |
| **Campaign** | Cross-brand attacks from the same actor/infrastructure | Actor targeting DoppelDown customers across different brands |
| **Historical** | Past incidents involving the same indicators | Domain previously seen in a 2024 phishing campaign |

### 6.3 Correlation Rules Engine

```typescript
interface CorrelationRule {
  id: string
  name: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  conditions: CorrelationCondition[]
  logicOperator: 'AND' | 'OR'
  timeWindowMs: number
  minMatches: number
  action: 'alert' | 'escalate' | 'enrich' | 'tag'
  confidenceBoost: number   // How much to boost confidence when rule fires
}
```

**Example Rules:**

| Rule | Conditions | Time Window | Action |
|------|-----------|-------------|--------|
| **Domain Registration Burst** | ≥3 brand-matching domains registered | 24 hours | Alert (Critical) |
| **Phishing Infrastructure Cluster** | ≥2 domains on same IP + same registrar + brand match | 7 days | Alert (High) |
| **Kit Reuse Detection** | ≥2 pages with >90% HTML similarity | 30 days | Tag campaign, link indicators |
| **Cross-Brand Actor** | Same registrant targeting ≥2 different customer brands | 30 days | Escalate (Critical) |
| **Fast-Flux Detection** | Domain resolving to ≥5 different IPs | 24 hours | Alert (High) |
| **Pre-Attack Staging** | NRD + SSL cert + hosting setup + no content yet | 7 days | Alert (Medium — "watching") |
| **Brand Credential Dump** | Brand-related email addresses in paste/breach | Immediate | Alert (High) |

### 6.4 Threat Fusion Output

The fusion engine produces a unified threat picture per brand:

```typescript
interface BrandThreatPicture {
  brandId: string
  brandName: string
  generatedAt: string
  
  // Active threats
  activeThreats: {
    critical: ThreatCluster[]
    high: ThreatCluster[]
    medium: ThreatCluster[]
    low: ThreatCluster[]
  }
  
  // Campaigns (correlated threat groups)
  campaigns: Campaign[]
  
  // Trends
  trends: {
    newThreatsLast24h: number
    newThreatsLast7d: number
    newThreatsLast30d: number
    trendDirection: 'increasing' | 'stable' | 'decreasing'
    topThreatTypes: { type: string; count: number; percentage: number }[]
    topAttackVectors: string[]
  }
  
  // Risk summary
  overallRiskLevel: 'critical' | 'high' | 'medium' | 'low'
  riskFactors: string[]
  
  // Predictions
  predictions: {
    expectedThreatsNext7d: number
    likelyAttackVectors: string[]
    seasonalFactors: string[]
    confidence: number
  }
}
```

---

## 7. Customer-Facing Threat Detection Integration

### 7.1 Integration Points

The intelligence system integrates with DoppelDown's customer-facing features at multiple points:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CUSTOMER EXPERIENCE                             │
├─────────────┬──────────────┬──────────────┬────────────────────────┤
│  DASHBOARD  │    SCANS     │    ALERTS    │      REPORTS           │
│             │              │              │                        │
│ • Threat    │ • On-demand  │ • Email      │ • Takedown reports     │
│   overview  │   scan with  │   alerts     │ • Monthly threat       │
│ • Risk      │   intel      │ • In-app     │   landscape            │
│   score     │   enrichment │   notifs     │ • Incident timeline    │
│ • Active    │ • Background │ • Webhook    │ • Evidence packages    │
│   threats   │   continuous │   callbacks  │ • Executive summary    │
│ • Trend     │   monitoring │ • SMS for    │ • Compliance           │
│   charts    │              │   critical   │   documentation        │
│ • Campaign  │              │              │                        │
│   view      │              │              │                        │
└─────────────┴──────────────┴──────────────┴────────────────────────┘
```

### 7.2 Dashboard Enhancements

**Threat Intelligence Widget (New)**

Display on the main dashboard after a scan completes or continuously for Pro/Enterprise:

```
┌─────────────────────────────────────────────────────┐
│  🛡️ Threat Intelligence Summary          Last 24h  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Overall Risk: ██████████░░░░░ HIGH (72/100)       │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ 🔴 2     │  │ 🟠 5     │  │ 🟡 12    │         │
│  │ Critical │  │ High     │  │ Medium   │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│                                                     │
│  📊 Trending: Combo-squatting attempts ↑ 40%       │
│  🕵️ 1 active campaign identified                   │
│  🆕 3 new domains registered in last 24h           │
│  📜 2 SSL certificates issued for brand-lookalikes │
│                                                     │
│  [View Full Threat Landscape →]                    │
└─────────────────────────────────────────────────────┘
```

**Threat Timeline View (New)**

Visual timeline showing when threats were detected, enriched, and their current status:

```
┌─────────────────────────────────────────────────────┐
│  📅 Threat Timeline                    Last 30 days │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Feb 5  ●──── mybrand-login.com registered (🔴)    │
│         │     ├ SSL cert issued (Let's Encrypt)     │
│         │     ├ Hosting: Cloudflare (AS13335)       │
│         │     └ Content: Phishing page detected     │
│         │                                           │
│  Feb 3  ●──── my-brand-support.net registered (🟠) │
│         │     ├ Same registrar as mybrand-login.com  │
│         │     └ Status: Parked — monitoring          │
│         │                                           │
│  Feb 1  ●──── @mybrand_official on Instagram (🟡)  │
│         │     ├ 0 followers, 2 posts                │
│         │     └ Uses brand logo as profile pic       │
│         │                                           │
│  Jan 28 ●──── mybrand.xyz registered (🟢 Resolved) │
│               └ Takedown completed Jan 30            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 7.3 Scan Enhancement

When a customer runs a scan, intelligence enrichment happens automatically:

```
Before (Current):
  1. Generate typosquat variants
  2. Check DNS resolution
  3. Screenshot active domains
  4. Check Google Safe Browsing
  → Deliver results

After (With Intelligence):
  1. Generate typosquat variants
  2. Check DNS resolution
  3. ★ Check CT logs for recent certs matching brand
  4. ★ Check NRD feeds for recent registrations matching brand
  5. Screenshot active domains
  6. ★ Multi-source reputation check (VT, AbuseIPDB, GSB, PhishTank, URLhaus)
  7. ★ ML threat scoring (ensemble model)
  8. ★ Visual similarity analysis (if page is active)
  9. ★ Infrastructure correlation (shared IPs, registrants, nameservers)
  10. ★ MITRE ATT&CK classification
  11. ★ Historical correlation (seen this pattern before?)
  → Deliver enriched, scored, prioritised results with recommended actions
```

### 7.4 Continuous Monitoring (Pro/Enterprise)

Beyond on-demand scans, Pro and Enterprise customers get continuous background monitoring:

| Monitor | Check Frequency | What It Catches |
|---------|----------------|-----------------|
| NRD monitor | Hourly (Enterprise) / Daily (Pro) | New brand-matching domains registered today |
| CT log monitor | Real-time stream (Enterprise) / Daily digest (Pro) | SSL certs issued for brand-lookalike domains |
| Threat feed monitor | Every 15 minutes | Brand domains appearing in phishing databases |
| Social media monitor | Every 6 hours | New impersonation accounts |
| Dark web monitor | Every 6 hours (Enterprise only) | Brand mentions in credential dumps, forums |
| Active threat re-check | Every 4 hours | Status changes on previously detected threats |

---

## 8. Alerting & Notification Strategy

### 8.1 Alert Classification

Alerts are classified by a combination of threat severity and confidence:

```
                        CONFIDENCE
                   Low    Medium    High
            ┌─────────┬──────────┬──────────┐
  Critical  │  HIGH   │ CRITICAL │ CRITICAL │  ← Immediate notification
            ├─────────┼──────────┼──────────┤
SEVERITY    │  MEDIUM │  HIGH    │  HIGH    │  ← Urgent notification
  High      ├─────────┼──────────┼──────────┤
            │  LOW    │  MEDIUM  │  HIGH    │  ← Standard notification
  Medium    ├─────────┼──────────┼──────────┤
            │  INFO   │  LOW     │  MEDIUM  │  ← Dashboard only
  Low       └─────────┴──────────┴──────────┘
```

### 8.2 Notification Channels by Alert Level

| Alert Level | Dashboard | Email | In-App Push | Webhook | SMS (Enterprise) |
|-------------|-----------|-------|-------------|---------|------------------|
| CRITICAL | ✅ Immediate | ✅ Immediate | ✅ Immediate | ✅ Immediate | ✅ Immediate |
| HIGH | ✅ Immediate | ✅ Within 15 min | ✅ Immediate | ✅ Within 15 min | ❌ |
| MEDIUM | ✅ Immediate | ✅ Daily digest | ❌ | ✅ Batched hourly | ❌ |
| LOW | ✅ Immediate | ✅ Weekly digest | ❌ | ❌ | ❌ |
| INFO | ✅ On request | ❌ | ❌ | ❌ | ❌ |

### 8.3 Alert Content Template

Every alert should answer these questions:

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔴 CRITICAL ALERT: Active Phishing Page Detected               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ WHAT: A phishing page impersonating [Brand Name] has been       │
│       detected at mybrand-login[.]com                           │
│                                                                 │
│ WHEN: First seen 2026-02-05 03:42 UTC (2 hours ago)            │
│                                                                 │
│ WHY IT MATTERS:                                                 │
│ • Page has 94% visual similarity to your login page             │
│ • Domain registered 18 hours ago (newly registered)             │
│ • SSL certificate issued by Let's Encrypt                      │
│ • Already flagged by Google Safe Browsing                       │
│ • Part of a cluster of 3 related domains (same registrant)     │
│                                                                 │
│ RISK SCORE: 92/100 (Critical)                                  │
│ CONFIDENCE: 97% (corroborated by 4 intelligence sources)       │
│                                                                 │
│ EVIDENCE COLLECTED:                                             │
│ ✅ Screenshot    ✅ HTML archive    ✅ WHOIS record              │
│ ✅ DNS records   ✅ SSL certificate  ✅ Threat intel matches     │
│                                                                 │
│ RECOMMENDED ACTIONS:                                            │
│ 1. 🚨 Initiate takedown immediately (report ready to download) │
│ 2. ⚠️ Warn customers via your communication channels           │
│ 3. 🔍 Monitor the 2 related domains (mybrand-support[.]net,    │
│       my-brand[.]xyz) — currently parked, may activate soon     │
│ 4. 📧 Report to Google Safe Browsing (auto-submitted)          │
│                                                                 │
│ [Download Takedown Report] [View Evidence] [View Campaign]      │
└─────────────────────────────────────────────────────────────────┘
```

### 8.4 Alert Fatigue Prevention

Alert fatigue is the number one killer of security tools. DoppelDown must be ruthless about signal-to-noise ratio:

| Strategy | Implementation |
|----------|---------------|
| **Deduplication** | Same indicator from multiple sources = 1 alert (with boosted confidence) |
| **Clustering** | Related indicators grouped into a single campaign alert |
| **Cooldown periods** | Critical: 5 min, High: 15 min, Medium: 1 hour, Low: 4 hours |
| **Progressive escalation** | New indicators start at LOW; escalate as enrichment confirms threat |
| **Whitelist** | Customer-managed list of domains/accounts to never alert on (e.g., their own subdomains) |
| **Auto-resolution** | Threats confirmed as taken down are auto-closed |
| **Smart digests** | Non-critical alerts batched into daily/weekly digests |
| **Confidence gating** | Only alert when confidence > 60% for Medium, > 70% for High, > 80% for Critical |

---

## 9. Threat Intelligence Lifecycle Management

### 9.1 Intelligence Lifecycle

```
    ┌─────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
    │ COLLECT │────▶│ PROCESS  │────▶│ ANALYSE  │────▶│DISSEMINATE│
    │         │     │          │     │          │     │          │
    │ Gather  │     │ Clean    │     │ Correlate│     │ Alert    │
    │ from    │     │ Dedupe   │     │ Enrich   │     │ Report   │
    │ sources │     │ Normalise│     │ Score    │     │ Integrate│
    └─────────┘     └──────────┘     └──────────┘     └──────────┘
         ▲                                                  │
         │              ┌──────────┐                        │
         └──────────────│ FEEDBACK │◀───────────────────────┘
                        │          │
                        │ Validate │
                        │ Retrain  │
                        │ Improve  │
                        └──────────┘
```

### 9.2 Indicator Lifecycle States

```
NEW → PROCESSING → ENRICHED → ANALYSED → SCORED → [ALERTED] → MONITORING → RESOLVED/EXPIRED
                                                      ↑
                                                ESCALATED (if severity increases)
```

| State | Description | Auto-Transition |
|-------|------------|-----------------|
| NEW | Just collected from source | → PROCESSING immediately |
| PROCESSING | Being deduplicated and normalised | → ENRICHED after normalisation |
| ENRICHED | Infrastructure and reputation data added | → ANALYSED after ML scoring |
| ANALYSED | ML scored, correlated, classified | → SCORED after risk calculation |
| SCORED | Final risk score assigned | → ALERTED if above threshold |
| ALERTED | Customer notified | → MONITORING after cooldown |
| MONITORING | Being tracked for changes | → RESOLVED or ESCALATED |
| RESOLVED | Threat confirmed remediated (taken down, expired) | Terminal state |
| EXPIRED | Indicator TTL exceeded without activity | Terminal state |

### 9.3 Data Retention Policy

| Data Type | Retention | Reason |
|-----------|----------|--------|
| Active threat indicators | Indefinite while threat is active | Operational need |
| Resolved threat indicators | 24 months | Historical analysis, pattern detection |
| Raw feed data | 90 days | Reprocessing, audit |
| Enrichment data | 30 days (refreshed on re-check) | Data freshness |
| Alert history | 36 months | Customer reporting, audit |
| Correlation data | 12 months | Pattern analysis |
| ML training data | Indefinite | Model improvement |
| Customer scan results | Per customer contract | Compliance |

---

## 10. Dark Web & Underground Monitoring

### 10.1 Monitoring Scope

| Channel | What to Monitor | DoppelDown Relevance |
|---------|----------------|---------------------|
| **Paste sites** (Pastebin, GitHub Gists, Ghostbin) | Brand-related credential dumps, leaked databases | Direct — credential leaks affect brand trust |
| **Telegram channels** | Phishing kit distribution, credential trading, target lists | High — many phishing kits are distributed via Telegram |
| **Dark web forums** | Brand targeting discussions, attack planning, kit sales | Medium — early warning of planned attacks |
| **Dark web marketplaces** | Stolen credentials, counterfeit brand goods | Medium — evidence of successful attacks |
| **Code repositories** | Phishing kits, brand-targeting tools, cloned websites | High — phishing kit detection is upstream intelligence |

### 10.2 Implementation Approach

**Phase 1 (Immediate, Free): Surface-level monitoring**
- Monitor paste sites via API (e.g., Pastebin scraping, GitHub code search)
- Monitor public Telegram channels known for phishing kit distribution
- Search GitHub for phishing kits containing customer brand names
- **Estimated effort:** 2-3 days engineering
- **Cost:** Free

**Phase 2 (3-6 months): Managed service integration**
- Integrate SpyCloud or Have I Been Pwned Breach Monitoring API for credential monitoring
- Use Flare or Flashpoint API for dark web brand mentions
- **Estimated effort:** 1-2 weeks engineering
- **Cost:** $500-1000/month (passed through to Enterprise tier pricing)

**Phase 3 (9-12 months): Custom monitoring**
- Deploy Tor-based crawlers for specific forums and marketplaces
- Build brand-specific keyword monitors for dark web search engines
- **Estimated effort:** Significant engineering investment
- **Cost:** Infrastructure + maintenance

### 10.3 Dark Web Alert Types

| Alert Type | Severity | Example |
|-----------|----------|---------|
| Brand credentials in dump | HIGH | "Found 2,347 @yourbrand.com credentials in breach dump posted to BreachForums" |
| Phishing kit targeting brand | CRITICAL | "Phishing kit for [Brand] login page found on Telegram channel @phish_kits" |
| Brand mentioned in attack planning | HIGH | "Forum post discussing targeting [Brand] customers for credential harvesting" |
| Counterfeit brand goods | MEDIUM | "Dark web marketplace listing counterfeit [Brand] products" |
| Brand domain for sale | LOW | "yourbrand-login.com offered for sale on underground forum" |

---

## 11. Newly Registered Domain (NRD) Intelligence

### 11.1 Current State

DoppelDown already has an NRD scanner (`nrd-scanner.ts`) that matches newly registered domains against customer brands using exact match, keyword match, and typosquatting similarity.

### 11.2 Enhancement Strategy

**Expand NRD Data Sources:**

| Source | Coverage | Update Frequency | Cost | Priority |
|--------|----------|-----------------|------|----------|
| ICANN CZDS (Centralized Zone Data Service) | .com, .net, .org, 1200+ gTLDs | Daily zone files | Free (application required) | ★★★ High |
| WhoisDS / DomainCrawler | All major TLDs | Daily | $50-200/month | ★★ Medium |
| Newly Observed Domains (passive DNS) | Domains seen in DNS traffic | Near real-time | Free (Farsight DNSDB lite) | ★★ Medium |
| ccTLD zone files | .com.au, .co.uk, .de, etc. | Varies by registry | Varies | ★ Low (later) |

**Enhance NRD Matching:**

```
Current Matching:
  ├── Exact match (brand.com → brand.xyz) 
  ├── Keyword match (brand name appears in domain)
  └── Typosquat similarity (Levenshtein > 0.75)

Enhanced Matching (proposed):
  ├── Exact match
  ├── Keyword match (expanded keyword lists)
  ├── Typosquat similarity (Levenshtein + Jaro-Winkler + phonetic)
  ├── Homoglyph detection (Unicode confusables)
  ├── Combo-squatting patterns (brand + common suffixes)
  ├── ★ Phonetic similarity (Soundex/Metaphone — catches "faysbuk.com")
  ├── ★ Visual similarity of rendered domain (catches Unicode tricks)
  ├── ★ N-gram overlap scoring (catches partial brand name inclusion)
  └── ★ ML classifier (trained on known-good vs known-bad for this brand)
```

**NRD Risk Scoring Enhancements:**

| Signal | Weight | Rationale |
|--------|--------|-----------|
| Domain age < 24 hours | +15 | Freshly registered = higher risk |
| Domain age < 7 days | +10 | Still very new |
| Privacy-protected WHOIS | +5 | Common for malicious registrations |
| Free/cheap TLD (.xyz, .top, .club) | +8 | Preferred by phishers due to low cost |
| Let's Encrypt SSL cert | +3 | Free SSL = lower barrier |
| No MX records | -3 | Less likely to be used for email phishing |
| Parked/no content | -5 | Not yet weaponised (but watch) |
| Content matches brand | +25 | Active impersonation |
| Same registrar as known-bad domains | +10 | Infrastructure correlation |
| Multiple brand-related domains from same registrant | +20 | Campaign indicator |

### 11.3 NRD Processing Pipeline

```
Daily NRD Feed (millions of domains)
    │
    ▼
┌──────────────────────────────┐
│ Stage 1: Bloom Filter        │  ← Fast rejection of clearly irrelevant domains
│ (brand name substring check) │     Reduces millions → thousands
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Stage 2: Fuzzy Matching      │  ← Levenshtein, Jaro-Winkler, phonetic
│ (all matching algorithms)    │     Reduces thousands → hundreds
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Stage 3: ML Classifier       │  ← Ensemble model scoring
│ (threat probability)         │     Reduces hundreds → tens
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Stage 4: Enrichment          │  ← WHOIS, DNS, hosting, reputation
│ (only for high-probability)  │     Full enrichment on candidates
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Stage 5: Risk Scoring        │  ← Final score + alert decision
│ + Alert Routing              │
└──────────────────────────────┘
```

---

## 12. Certificate Transparency Log Monitoring

### 12.1 Why CT Logs Matter

Certificate Transparency (CT) logs are public, append-only records of all SSL/TLS certificates issued by participating Certificate Authorities. When an attacker registers `mybrand-login.com` and gets a Let's Encrypt certificate, it appears in CT logs — often **before the phishing page is even deployed**.

This is one of the highest-value, lowest-cost intelligence sources available.

### 12.2 Implementation Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CT LOG MONITORING                             │
├─────────────┬──────────────┬──────────────┬────────────────────┤
│  REAL-TIME  │    BATCH     │   HISTORICAL │   ALERTING         │
│  (Certstream)│  (crt.sh API)│  (crt.sh)   │                    │
│             │              │              │                    │
│ • WebSocket │ • Hourly     │ • On brand   │ • Real-time for    │
│   stream    │   queries    │   onboarding │   Enterprise       │
│ • Process   │   for each   │ • Baseline   │ • Digest for       │
│   every     │   brand      │   existing   │   Professional     │
│   cert      │ • Catch-up   │   certs      │ • Included in      │
│ • Match     │   for gaps   │              │   scan results     │
│   against   │              │              │   for all tiers    │
│   brands    │              │              │                    │
└─────────────┴──────────────┴──────────────┴────────────────────┘
```

### 12.3 Certstream Integration

```typescript
// Pseudocode for Certstream monitoring service
import WebSocket from 'ws'

interface CertEntry {
  messageType: string
  data: {
    leafCert: {
      subject: { CN: string }
      extensions: { subjectAltName: string[] }
      issuer: { O: string; CN: string }
      notBefore: number
      notAfter: number
      fingerprint: string
    }
    chain: Array<{ subject: { CN: string } }>
    certIndex: number
    seen: number
    source: { url: string; name: string }
  }
}

class CertStreamMonitor {
  private ws: WebSocket
  private brandPatterns: Map<string, RegExp[]>  // brandId → compiled patterns
  
  connect() {
    this.ws = new WebSocket('wss://certstream.calidog.io/')
    
    this.ws.on('message', (data: string) => {
      const entry: CertEntry = JSON.parse(data)
      if (entry.messageType !== 'certificate_update') return
      
      const domains = this.extractDomains(entry)
      for (const domain of domains) {
        const matches = this.matchAgainstBrands(domain)
        if (matches.length > 0) {
          this.handleMatch(domain, entry, matches)
        }
      }
    })
  }
  
  private extractDomains(entry: CertEntry): string[] {
    const domains: string[] = []
    if (entry.data.leafCert.subject.CN) {
      domains.push(entry.data.leafCert.subject.CN)
    }
    if (entry.data.leafCert.extensions.subjectAltName) {
      domains.push(...entry.data.leafCert.extensions.subjectAltName)
    }
    return [...new Set(domains)]
  }
  
  private matchAgainstBrands(domain: string): BrandMatch[] {
    // Use same matching logic as NRD scanner
    // + homoglyph detection
    // + combo-squatting patterns
    // + ML classifier for borderline cases
  }
  
  private async handleMatch(domain: string, cert: CertEntry, matches: BrandMatch[]) {
    // 1. Create normalised indicator
    // 2. Queue for enrichment
    // 3. If confidence > threshold, create alert
    // 4. Log to CT monitoring table
  }
}
```

### 12.4 CT Log Data Points Extracted

| Data Point | Intelligence Value |
|-----------|-------------------|
| Domain name (CN + SANs) | Primary matching target |
| Certificate Authority | Let's Encrypt = low barrier; EV cert = more investment |
| Issuance timestamp | Timeline correlation |
| Certificate fingerprint | Deduplication, tracking |
| Other SANs on same cert | Infrastructure correlation (what other domains are on this cert?) |
| Certificate chain | CA trust path analysis |

---

## 13. Social Media Threat Intelligence

### 13.1 Current Social Scanning Capabilities

DoppelDown already scans 8 platforms (Facebook, Instagram, X, LinkedIn, TikTok, YouTube, Telegram, Discord) for brand impersonation accounts. The intelligence strategy enhances this with:

### 13.2 Enhanced Social Intelligence

| Enhancement | Description | Value |
|-------------|------------|-------|
| **Account age detection** | Flag accounts created recently (< 30 days) with brand names | Higher confidence for new accounts |
| **Follower/following analysis** | Fake accounts often have abnormal ratios | Helps distinguish real fan accounts from impersonators |
| **Content analysis (NLP)** | Analyse bio, posts for scam/phishing indicators | Catches "DM me for support" / "Limited time offer" patterns |
| **Profile image analysis** | Compare profile images against brand logos and executive headshots | Catches logo theft and executive impersonation |
| **Cross-platform correlation** | Same impersonator active on multiple platforms | Campaign detection |
| **Temporal analysis** | Clusters of fake accounts created around the same time | Coordinated impersonation campaigns |
| **Link extraction** | Extract and check URLs in bios and posts against threat intel | Catches social→phishing pipelines |
| **Engagement bait detection** | Detect fake giveaway, support, or verification scams | Common social engineering pattern |

### 13.3 Social Threat Indicators

| Indicator | Risk Weight | Description |
|-----------|------------|-------------|
| Uses brand name in username | +15 | Direct brand impersonation |
| Uses brand logo as profile picture | +20 | Visual impersonation |
| Account age < 7 days | +10 | Recently created |
| Bio contains "official" or "verified" claims | +15 | False authority claims |
| Bio contains suspicious URLs | +20 | Potential phishing funnel |
| Posts contain urgency language | +10 | "Act now", "Limited time" |
| Posts contain financial instructions | +25 | "Send crypto to...", "Wire transfer..." |
| Low followers, high following | +5 | Abnormal ratio |
| Cross-platform presence (same name, multiple platforms) | +15 | Coordinated campaign |
| Responds to real brand's mentions | +20 | Active impersonation — intercepting real customers |

---

## 14. Phishing Kit & Infrastructure Tracking

### 14.1 Why Track Phishing Kits

Phishing kits are reusable packages (ZIP files, GitHub repos, Telegram channel posts) containing HTML templates, credential-harvesting scripts, and configuration files for impersonating specific brands. Tracking kits provides **upstream intelligence** — identifying attacks at the distribution stage, before they're deployed against customers.

### 14.2 Kit Detection Methods

| Method | Description | Implementation |
|--------|------------|----------------|
| **HTML fingerprinting** | Create fingerprints (structural hashes) of known phishing pages targeting each brand, then match against new findings | Hash the DOM structure, CSS classes, and form fields |
| **Kit distribution monitoring** | Monitor known kit distribution channels (Telegram, forums, GitHub) | Keyword monitoring + automated download and analysis |
| **Deployment pattern recognition** | Identify common hosting patterns used by kit deployers | IP ranges, hosting providers, deployment scripts |
| **Credential exfiltration endpoint detection** | Extract the URLs/emails where stolen credentials are sent | Static analysis of kit code; useful for identifying the actor |
| **JavaScript similarity analysis** | Compare JavaScript code across detected phishing pages | AST-based or minified code similarity |

### 14.3 Kit Intelligence Database

```typescript
interface PhishingKit {
  id: string
  fingerprint: string              // Structural hash of the kit
  targetBrands: string[]           // Brands this kit impersonates
  firstSeen: string
  lastSeen: string
  distributionChannels: string[]   // Where the kit is shared
  exfilEndpoints: string[]         // Where stolen data is sent
  features: {
    hasLoginPage: boolean
    has2FAInterception: boolean
    hasGeofencing: boolean         // Only shows phishing to certain countries
    hasBotDetection: boolean      // Evades scanners
    hasLivePhishing: boolean      // Real-time credential relay
    hasMobileOptimised: boolean
  }
  deployments: KitDeployment[]    // Known instances of this kit in the wild
  actorId?: string                // Linked threat actor
  mitreTechniques: string[]       // MITRE ATT&CK mappings
}
```

### 14.4 Anti-Evasion Intelligence

Sophisticated phishing kits employ evasion techniques that DoppelDown must counter:

| Evasion Technique | How It Works | DoppelDown Counter |
|------------------|-------------|-------------------|
| **Cloaking** | Returns benign content to scanners, phishing content to victims | Use residential proxy IPs for scanning; vary User-Agent |
| **Geofencing** | Only serves phishing page to specific countries | Scan from multiple geolocations (AU, US, UK, EU) |
| **Bot detection** | Detects headless browsers, blocks automated scans | Use stealth Puppeteer with anti-detection plugins |
| **Single-use URLs** | Each victim gets a unique URL; after use, it's dead | Monitor at the domain/path pattern level, not individual URLs |
| **Timed campaigns** | Phishing page only active for short windows (hours) | Continuous monitoring with < 4 hour detection cycles |
| **Cloudflare Turnstile** | CAPTCHA before phishing page | Log the CAPTCHA presence as a signal; manual verification for confirmation |

---

## 15. Threat Actor Profiling & Attribution

### 15.1 Actor Profiling Model

```typescript
interface ThreatActor {
  id: string
  aliases: string[]
  firstSeen: string
  lastSeen: string
  
  // Attribution indicators
  infrastructure: {
    preferredRegistrars: string[]
    preferredHosting: string[]
    preferredCAs: string[]
    knownIPs: string[]
    knownDomains: string[]
    knownEmails: string[]
  }
  
  // Tactics, Techniques, and Procedures
  ttps: {
    attackTypes: string[]         // typosquatting, combo-squatting, homoglyph, etc.
    targetIndustries: string[]
    targetBrands: string[]        // Brands this actor has targeted
    phishingKits: string[]        // Known kit IDs used by this actor
    exfilMethods: string[]        // Email, Telegram bot, custom backend, etc.
    campaignDuration: string      // Typical campaign length
    volumePerCampaign: number     // Typical number of domains per campaign
  }
  
  // Activity patterns
  patterns: {
    activeHours: string           // UTC time range of typical activity
    registrationBurstSize: number // How many domains typically registered at once
    domainNamingPattern: string   // Regex pattern of domain naming conventions
    hostingMigrationFreq: string  // How often they move infrastructure
  }
  
  // Relationship to DoppelDown customers
  targetedCustomers: string[]     // Customer brand IDs this actor has targeted
  
  // Confidence and notes
  confidence: 'high' | 'medium' | 'low'
  notes: string
}
```

### 15.2 Attribution Signals

| Signal | Confidence Contribution | Example |
|--------|------------------------|---------|
| Same WHOIS registrant email | HIGH (+30) | All domains registered with `john.smith.fake@protonmail.com` |
| Same WHOIS registrant name | MEDIUM (+15) | All domains registered by "John Smith" (could be common name) |
| Same nameservers | MEDIUM (+15) | All domains using `ns1.malicious-hosting.ru` |
| Same hosting IP/ASN | MEDIUM (+10) | All domains resolving to IPs in the same /24 |
| Same phishing kit | HIGH (+25) | Same HTML fingerprint across multiple deployments |
| Same exfiltration endpoint | HIGH (+30) | Credentials sent to same Telegram bot or email |
| Temporal clustering | MEDIUM (+10) | Domains registered within the same hour |
| Domain naming pattern | LOW (+5) | All domains follow `brand-word-word.tld` pattern |
| SSL certificate patterns | LOW (+5) | All certs from same CA with similar timing |

### 15.3 Actor Intelligence Value

Linking threats to actors provides exponential value:

- **Predictive:** If an actor's pattern is to register 5 domains and activate 3 days later, we can proactively scan for new domains from the same registrant.
- **Cross-customer protection:** When a new customer onboards, we can immediately check if known actors have targeted their brand.
- **Prioritisation:** Threats from known, active actors are more dangerous than random registrations.
- **Takedown effectiveness:** Understanding actor behaviour helps predict whether they'll re-register after takedown.

---

## 16. Risk Scoring & Prioritisation Model

### 16.1 Multi-Factor Risk Score

The final risk score (0-100) is calculated from multiple weighted factors:

```
RISK SCORE = (
  Σ(Factor × Weight × Confidence)
) / Σ(Weight)

Factors:
┌─────────────────────────────┬────────┬──────────────────────────────────┐
│ Factor                      │ Weight │ Description                      │
├─────────────────────────────┼────────┼──────────────────────────────────┤
│ Domain similarity score     │ 0.15   │ How close to brand domain        │
│ ML threat score             │ 0.15   │ Ensemble ML model output         │
│ Visual similarity           │ 0.15   │ Screenshot comparison score      │
│ Phishing intent (NLP)       │ 0.10   │ Content analysis for phishing    │
│ Reputation (multi-source)   │ 0.15   │ VT, AbuseIPDB, GSB combined     │
│ Infrastructure risk signals │ 0.10   │ Domain age, TLD, hosting, SSL    │
│ Correlation boost           │ 0.10   │ Related to other threats         │
│ Actor attribution           │ 0.05   │ Known threat actor involved      │
│ Temporal urgency            │ 0.05   │ How recently the threat appeared │
└─────────────────────────────┴────────┴──────────────────────────────────┘
```

### 16.2 Severity Mapping

| Score Range | Severity | Customer Action | DoppelDown Behaviour |
|-------------|----------|-----------------|---------------------|
| 85-100 | 🔴 CRITICAL | Immediate takedown required | Real-time alert + auto-generate takedown report |
| 65-84 | 🟠 HIGH | Investigate and likely take down | Alert within 15 minutes + provide evidence |
| 40-64 | 🟡 MEDIUM | Monitor, investigate if escalates | Daily digest alert + add to monitoring |
| 15-39 | 🟢 LOW | Awareness only | Weekly digest + visible in dashboard |
| 0-14 | ⚪ INFO | No action needed | Dashboard only, not alerted |

### 16.3 Dynamic Score Adjustment

Risk scores aren't static — they change as new intelligence arrives:

| Event | Score Adjustment |
|-------|-----------------|
| Page goes from parked → active content | +20 |
| Content confirmed as phishing by VirusTotal | +15 |
| Domain added to Google Safe Browsing | +10 |
| Another domain from same registrant detected | +10 |
| Domain exceeds 90 days with no malicious activity | -15 |
| Domain taken down / no longer resolving | → RESOLVED |
| Customer marks as false positive | → WHITELISTED |
| Phishing kit match confirmed | +20 |
| Dark web mention of the brand | +10 (to overall brand risk) |

---

## 17. Customer Threat Landscape Reports

### 17.1 Report Types

| Report | Frequency | Audience | Customer Tier |
|--------|----------|----------|--------------|
| **Threat Alert** | Real-time | Security/IT team | All tiers |
| **Daily Threat Digest** | Daily | Security/IT team | Pro + Enterprise |
| **Weekly Threat Summary** | Weekly | Management | Pro + Enterprise |
| **Monthly Threat Landscape** | Monthly | Executive/Board | Pro + Enterprise |
| **Quarterly Trend Analysis** | Quarterly | Executive/Board | Enterprise |
| **Incident Post-Mortem** | After major incidents | All stakeholders | Enterprise |

### 17.2 Monthly Threat Landscape Report Template

```
┌─────────────────────────────────────────────────────────────┐
│         MONTHLY THREAT LANDSCAPE REPORT                     │
│         [Brand Name] — February 2026                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  EXECUTIVE SUMMARY                                          │
│  ─────────────────                                          │
│  • Overall risk level: HIGH (increased from MEDIUM)         │
│  • 47 threats detected this month (+23% vs January)         │
│  • 3 critical threats required immediate action             │
│  • 2 active campaigns identified and attributed             │
│  • 28 threats auto-resolved (domain expired/taken down)     │
│  • Mean time to detect: 3.2 hours                          │
│                                                             │
│  THREAT BREAKDOWN                                           │
│  ─────────────────                                          │
│  Domain threats:     23 (12 typosquat, 8 combo, 3 homoglyph)│
│  Social media:       15 (8 Instagram, 4 Facebook, 3 X)     │
│  Phishing pages:      5 (3 active, 2 taken down)           │
│  Credential exposure:  4 (paste sites, breach databases)    │
│                                                             │
│  TOP THREATS                                                │
│  ───────────                                                │
│  1. 🔴 mybrand-secure-login[.]com (Score: 94)              │
│     Active phishing page, 96% visual similarity             │
│     Takedown submitted Feb 3, completed Feb 5               │
│                                                             │
│  2. 🔴 mybrand-verify[.]net (Score: 89)                    │
│     Same actor as #1 (infrastructure correlation)           │
│     Takedown in progress                                    │
│                                                             │
│  3. 🟠 @mybrand.support on Instagram (Score: 72)           │
│     Fake support account, responding to real customers       │
│     Reported to Instagram, pending review                    │
│                                                             │
│  CAMPAIGN ANALYSIS                                          │
│  ─────────────────                                          │
│  Campaign "ALPHA-2026-02" (Active)                         │
│  • Actor: DD-ACTOR-0042 (recurring phisher, 3rd campaign)  │
│  • Infrastructure: NameSilo registrar, Cloudflare CDN       │
│  • Targets: Login page credential harvesting                │
│  • Scale: 5 domains, 2 social accounts                      │
│  • Prediction: Expect 2-3 more domains this week            │
│                                                             │
│  INDUSTRY CONTEXT                                           │
│  ─────────────────                                          │
│  • Your industry (E-commerce) saw a 15% increase in brand  │
│    impersonation attacks globally in February                │
│  • Combo-squatting is the fastest-growing attack vector      │
│  • APWG reports 2.1M phishing attacks in January 2026       │
│    (highest on record)                                      │
│                                                             │
│  RECOMMENDATIONS                                            │
│  ─────────────────                                          │
│  1. Consider upgrading to Enterprise for real-time CT log   │
│     monitoring (would have detected Campaign ALPHA 6h       │
│     earlier)                                                │
│  2. Implement DMARC policy (currently p=none, recommend     │
│     p=quarantine)                                           │
│  3. Register defensive domains: mybrand-login.com,          │
│     mybrandsupport.com (currently available)                │
│                                                             │
│  [Full data available in your DoppelDown dashboard]         │
└─────────────────────────────────────────────────────────────┘
```

### 17.3 Report Generation Architecture

Reports are generated automatically from the threat intelligence database:

```typescript
interface ReportGenerator {
  // Generate monthly landscape report
  generateMonthlyReport(brandId: string, month: string): Promise<ThreatLandscapeReport>
  
  // Data sources for report
  private async gatherReportData(brandId: string, dateRange: DateRange): Promise<{
    threats: Threat[]
    campaigns: Campaign[]
    actors: ThreatActor[]
    industryTrends: IndustryTrend[]
    recommendations: Recommendation[]
    metrics: {
      totalThreats: number
      criticalThreats: number
      mttd: number          // Mean time to detect (hours)
      mtta: number          // Mean time to alert (minutes)
      resolvedCount: number
      falsePositiveRate: number
      trendDirection: string
    }
  }>
  
  // Render as PDF
  renderPDF(report: ThreatLandscapeReport): Promise<Buffer>
  
  // Render as email-friendly HTML
  renderHTML(report: ThreatLandscapeReport): Promise<string>
  
  // Schedule report delivery
  scheduleDelivery(brandId: string, frequency: 'daily' | 'weekly' | 'monthly'): void
}
```

---

## 18. Automation & Playbook Integration

### 18.1 Automated Response Playbooks

DoppelDown already has playbook generation in the actionable-intelligence module. This strategy extends it with intelligence-driven automation:

| Playbook | Trigger | Automated Actions | Human Actions |
|----------|---------|-------------------|---------------|
| **Critical Phishing** | Score ≥ 85 + active content | Auto-collect evidence, auto-generate takedown report, auto-report to Google Safe Browsing, send critical alert | Customer reviews and submits takedown to registrar |
| **NRD Campaign** | ≥ 3 related NRDs in 24h | Auto-enrich all, auto-correlate, create campaign view, alert customer | Customer reviews campaign, decides on defensive registrations |
| **Social Impersonation** | Fake account with brand logo + scam content | Auto-screenshot, auto-generate platform report, alert customer | Customer submits report to platform |
| **Credential Exposure** | Brand emails found in breach dump | Auto-count affected accounts, estimate exposure, alert customer | Customer notifies affected users, forces password resets |
| **CT Log Match** | SSL cert issued for brand-lookalike domain | Auto-enrich domain, auto-check DNS/content, queue for full scan | Customer reviews if domain becomes active |

### 18.2 Automated Takedown Workflow

```
Threat Detected (Score ≥ 85)
    │
    ▼
┌──────────────────────────┐
│ Auto-collect evidence:   │
│ • Screenshot             │
│ • HTML archive           │
│ • WHOIS record           │
│ • DNS records            │
│ • SSL certificate        │
│ • Threat intel matches   │
│ • Visual similarity      │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Auto-generate:           │
│ • PDF takedown report    │
│ • Registrar abuse email  │
│ • Platform report form   │
│ • Google Safe Browsing   │
│   submission             │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Auto-submit (where API   │
│ available):              │
│ • Google Safe Browsing ✅ │
│ • PhishTank report ✅     │
│ • APWG eCrime feed ✅     │
│ • Netcraft report ✅      │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Customer action needed:  │
│ • Download takedown PDF  │
│ • Submit to registrar    │
│ • Submit to social       │
│   platform               │
│ • Notify affected users  │
└──────────────────────────┘
```

### 18.3 Future: Automated Takedown Execution

For Enterprise customers (future roadmap), DoppelDown could offer automated takedown execution:

| Method | Complexity | Success Rate | Timeline |
|--------|-----------|-------------|----------|
| Registrar abuse API (where available) | Medium | 60-70% | 24-72 hours |
| Hosting provider abuse report | Medium | 50-60% | 24-72 hours |
| Google Safe Browsing + Chrome warning | Low (auto) | 100% (warning) | Minutes |
| Social media platform API reports | Medium | 40-60% | 24 hours - 2 weeks |
| UDRP/URS domain dispute | High | 85-90% | 2-8 weeks |

---

## 19. Data Architecture & Storage

### 19.1 Database Schema Extensions

```sql
-- Threat Intelligence Tables (additions to existing Supabase schema)

-- Intelligence indicators (normalised IOCs)
CREATE TABLE threat_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,          -- domain, url, ip, email, hash, social_profile
  value TEXT NOT NULL,
  defanged TEXT,
  source TEXT NOT NULL,
  source_category TEXT NOT NULL,
  source_reliability FLOAT DEFAULT 0.5,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'new',
  risk_score INTEGER,
  severity TEXT,
  confidence FLOAT,
  tags TEXT[],
  ttl INTEGER DEFAULT 86400,
  brand_id UUID REFERENCES brands(id),
  match_type TEXT,
  match_confidence FLOAT,
  enrichment JSONB DEFAULT '{}',
  analysis JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Intelligence source health tracking
CREATE TABLE intel_source_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id TEXT NOT NULL,
  check_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  available BOOLEAN NOT NULL,
  latency_ms INTEGER,
  error_message TEXT,
  data_freshness_seconds INTEGER,
  records_received INTEGER
);

-- CT log matches
CREATE TABLE ct_log_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL,
  cert_fingerprint TEXT,
  issuer TEXT,
  issued_at TIMESTAMPTZ,
  sans TEXT[],
  brand_id UUID REFERENCES brands(id),
  match_confidence FLOAT,
  indicator_id UUID REFERENCES threat_indicators(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Threat campaigns (correlated threat groups)
CREATE TABLE threat_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  actor_id UUID REFERENCES threat_actors(id),
  status TEXT NOT NULL DEFAULT 'active',
  first_seen_at TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL,
  severity TEXT,
  affected_brands UUID[],
  indicator_ids UUID[],
  ttps JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Threat actors
CREATE TABLE threat_actors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aliases TEXT[],
  first_seen_at TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL,
  infrastructure JSONB DEFAULT '{}',
  ttps JSONB DEFAULT '{}',
  patterns JSONB DEFAULT '{}',
  targeted_brands UUID[],
  confidence TEXT DEFAULT 'low',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Phishing kit fingerprints
CREATE TABLE phishing_kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint TEXT NOT NULL UNIQUE,
  target_brands TEXT[],
  first_seen_at TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL,
  distribution_channels TEXT[],
  exfil_endpoints TEXT[],
  features JSONB DEFAULT '{}',
  actor_id UUID REFERENCES threat_actors(id),
  mitre_techniques TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Alert history
CREATE TABLE threat_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id),
  user_id UUID REFERENCES auth.users(id),
  indicator_id UUID REFERENCES threat_indicators(id),
  campaign_id UUID REFERENCES threat_campaigns(id),
  alert_level TEXT NOT NULL,    -- critical, high, medium, low, info
  channel TEXT NOT NULL,        -- email, in_app, webhook, sms
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  actioned_at TIMESTAMPTZ,
  action_taken TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_indicators_brand ON threat_indicators(brand_id, status);
CREATE INDEX idx_indicators_value ON threat_indicators(value);
CREATE INDEX idx_indicators_severity ON threat_indicators(severity);
CREATE INDEX idx_indicators_source ON threat_indicators(source);
CREATE INDEX idx_ct_matches_brand ON ct_log_matches(brand_id);
CREATE INDEX idx_ct_matches_domain ON ct_log_matches(domain);
CREATE INDEX idx_campaigns_status ON threat_campaigns(status);
CREATE INDEX idx_alerts_brand ON threat_alerts(brand_id, created_at DESC);
CREATE INDEX idx_alerts_user ON threat_alerts(user_id, read_at);
```

### 19.2 Caching Strategy

| Data Type | Cache Layer | TTL | Eviction |
|-----------|-----------|-----|----------|
| Feed data (PhishTank, URLhaus) | Redis / in-memory | 15 minutes | Time-based |
| Reputation lookups (VT, AbuseIPDB) | Redis | 1 hour | Time-based |
| WHOIS data | Redis | 24 hours | Time-based |
| NRD matches | PostgreSQL | N/A (persistent) | Never (indicator lifecycle) |
| CT log matches | PostgreSQL | N/A (persistent) | Never (indicator lifecycle) |
| ML model predictions | In-memory LRU | 1 hour | LRU + time-based |
| Brand pattern compilations | In-memory | Until brand updated | Event-based |

---

## 20. Metrics, KPIs & Continuous Improvement

### 20.1 Operational Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Mean Time to Detect (MTTD) | < 4 hours | Time from indicator first-seen-at to indicator creation |
| Mean Time to Alert (MTTA) | < 15 minutes (critical) | Time from indicator scored to alert delivered |
| Mean Time to Resolve (MTTR) | < 72 hours (critical) | Time from alert to threat resolved |
| Detection Coverage | > 80% of threats | Confirmed threats detected vs total threats (inc. customer-reported) |
| False Positive Rate | < 5% (critical/high) | Customer-confirmed FPs / total alerts |
| False Negative Rate | < 15% | Threats missed / total confirmed threats |
| Intelligence Source Availability | > 95% | Uptime of each source |
| Intelligence Freshness | Source-specific | Data age at time of use |
| Alert Actionability | > 90% | % of alerts where customer took action or confirmed value |

### 20.2 Business Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Threats detected per customer per month | 10-50 (varies by brand size) | Total indicators per brand |
| Takedowns initiated per customer per month | 2-5 | Takedown reports generated |
| Customer satisfaction with alerts | > 4.5/5 | In-app feedback widget |
| Feature usage (threat landscape reports) | > 70% of Pro/Enterprise | Report downloads/views |
| Churn reduction (intelligence features) | 20% lower churn vs non-intel users | Cohort analysis |
| Upgrade conversion (Starter → Pro) | > 15% | Customers upgrading for intel features |

### 20.3 Continuous Improvement Loop

```
┌─────────────────┐
│ MEASURE          │  ← Track all metrics above
│ (Monthly review) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ANALYSE          │  ← Why are FPs high? Which sources are underperforming?
│ (Root cause)     │     Which threats are we missing?
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ IMPROVE          │  ← Adjust weights, add sources, retrain ML models,
│ (Act on findings)│     tune correlation rules, update matching patterns
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ RETRAIN          │  ← Feed confirmed threats + FPs back into ML pipeline
│ (ML feedback)    │     Update phishing kit fingerprints
└────────┬────────┘
         │
         └──────────▶ Back to MEASURE
```

### 20.4 ML Model Feedback Loop

```
Customer Action on Alert
    │
    ├── Confirmed Threat → Add to positive training set
    ├── Marked as False Positive → Add to negative training set  
    ├── Takedown initiated → Collect additional evidence for training
    └── Ignored → Track; if consistently ignored, may indicate FP or low value
    
Monthly Retraining:
    1. Aggregate all customer feedback
    2. Augment with new phishing kit samples
    3. Retrain ensemble model
    4. A/B test new model against production model
    5. Deploy if F1 score improves by > 2%
    6. Update scoring weights based on source performance
```

---

## 21. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4) — "See More"

**Goal:** Expand detection coverage with free/low-cost intelligence sources.

| Task | Priority | Effort | Dependencies |
|------|----------|--------|-------------|
| Certstream integration (real-time CT log monitoring) | ★★★ | 3 days | WebSocket infrastructure |
| crt.sh batch query integration | ★★★ | 1 day | None |
| Expand NRD matching (phonetic, n-gram, homoglyph) | ★★★ | 3 days | `nrd-scanner.ts` |
| GitHub phishing kit monitoring (keyword search) | ★★ | 2 days | GitHub API |
| Paste site monitoring (Pastebin, GitHub Gists) | ★★ | 2 days | Scraping infrastructure |
| Intelligence source health monitoring dashboard | ★★ | 2 days | Monitoring infrastructure |
| Threat indicators database (schema + CRUD) | ★★★ | 2 days | Supabase migration |

**Estimated Engineering:** 15 days
**Estimated Cost:** ~$0/month (all free sources)
**Customer Impact:** 40%+ more threats detected per scan

### Phase 2: Enrichment (Weeks 5-8) — "Know More"

**Goal:** Enrich detected threats with multi-source intelligence.

| Task | Priority | Effort | Dependencies |
|------|----------|--------|-------------|
| VirusTotal API upgrade (paid tier integration) | ★★★ | 1 day | VT API key |
| WhoisXML API integration (domain history) | ★★ | 2 days | WhoisXML API key |
| URLScan.io paid integration (live screenshots) | ★★ | 1 day | URLScan API key |
| Multi-source enrichment pipeline | ★★★ | 3 days | Phase 1 complete |
| Enrichment cost management (tier-based) | ★★ | 2 days | Tier system |
| Infrastructure correlation (shared IPs/registrants) | ★★★ | 3 days | Enrichment data |
| Enhanced risk scoring model (multi-factor) | ★★★ | 2 days | Phase 1 + enrichment |

**Estimated Engineering:** 14 days
**Estimated Cost:** ~$200/month (API subscriptions)
**Customer Impact:** Rich context on every threat; 50%+ reduction in false positives

### Phase 3: Intelligence (Weeks 9-16) — "Understand More"

**Goal:** Connect the dots — campaigns, actors, predictions.

| Task | Priority | Effort | Dependencies |
|------|----------|--------|-------------|
| Threat campaign auto-detection | ★★★ | 5 days | Correlation engine |
| Threat actor profiling & attribution | ★★ | 5 days | Campaign data |
| Customer threat landscape reports (monthly auto) | ★★★ | 5 days | Report generator |
| Dashboard threat intelligence widgets | ★★★ | 5 days | Frontend |
| Threat timeline view | ★★ | 3 days | Frontend |
| Continuous monitoring service (Pro/Enterprise) | ★★★ | 5 days | Background workers |
| Alert fatigue prevention system | ★★ | 3 days | Alert system |

**Estimated Engineering:** 31 days
**Estimated Cost:** ~$300/month (additional APIs + compute)
**Customer Impact:** Customers see campaigns, not just indicators; monthly reports

### Phase 4: Advanced (Months 5-9) — "Predict More"

**Goal:** Proactive threat prediction and premium intelligence.

| Task | Priority | Effort | Dependencies |
|------|----------|--------|-------------|
| Phishing kit fingerprinting & tracking | ★★ | 8 days | Kit samples |
| Dark web monitoring integration (SpyCloud or similar) | ★★ | 5 days | API contract |
| Predictive threat modelling | ★ | 8 days | Historical data |
| Anti-evasion scanning (residential proxies, geo-distributed) | ★★ | 5 days | Proxy infrastructure |
| ML model retraining pipeline with customer feedback | ★★ | 5 days | Feedback data |
| Automated takedown submission (where API available) | ★★ | 5 days | Registrar/platform APIs |
| Social media enhanced intelligence (NLP, image analysis) | ★ | 5 days | OpenAI integration |

**Estimated Engineering:** 41 days
**Estimated Cost:** ~$800-1500/month (premium feeds + compute)
**Customer Impact:** Predictive alerts; dark web monitoring; automated takedowns

### Phase 5: Enterprise (Months 9-18) — "Defend More"

**Goal:** Enterprise-grade intelligence capabilities.

| Task | Priority | Effort | Dependencies |
|------|----------|--------|-------------|
| Custom threat intelligence integrations (SIEM, SOAR) | ★ | 10 days | API design |
| Threat intelligence API (customers can query) | ★ | 5 days | API design |
| White-label threat reports | ★ | 3 days | Report generator |
| Multi-tenant threat intelligence sharing (opt-in) | ★ | 8 days | Privacy framework |
| STIX/TAXII compliance (industry standard) | ★ | 5 days | Standards research |
| Regulatory compliance reports (industry-specific) | ★ | 5 days | Compliance requirements |

**Estimated Engineering:** 36 days
**Estimated Cost:** Variable (enterprise contracts)
**Customer Impact:** Enterprise-ready intelligence platform; integration ecosystem

---

## 22. Cost Analysis & Resource Requirements

### 22.1 Monthly Cost Projection (at 100 customers)

| Category | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 |
|----------|---------|---------|---------|---------|---------|
| Intelligence APIs | $0 | $200 | $300 | $1,000 | $2,000 |
| Compute (workers, streaming) | $0 | $50 | $100 | $200 | $500 |
| Storage (indicators, evidence) | $0 | $20 | $50 | $100 | $200 |
| ML inference | $0 | $0 | $50 | $100 | $200 |
| Dark web services | $0 | $0 | $0 | $500 | $1,000 |
| **Total Monthly** | **$0** | **$270** | **$500** | **$1,900** | **$3,900** |

### 22.2 Revenue Coverage

At current pricing ($49-$249/month per customer):

| Scenario | Monthly Revenue | Phase 4 Costs | Margin |
|----------|----------------|--------------|--------|
| 50 customers (avg $99) | $4,950 | $1,900 | 62% |
| 100 customers (avg $99) | $9,900 | $1,900 | 81% |
| 200 customers (avg $120) | $24,000 | $3,000 | 88% |

Intelligence costs scale sub-linearly — many lookups are shared across customers (same feed, cached results, shared indicators). **Intelligence is a moat that gets cheaper per customer as you scale.**

### 22.3 Engineering Resource Estimate

| Phase | Duration | Engineering Days | Solo Developer Timeline |
|-------|----------|-----------------|------------------------|
| Phase 1 | 4 weeks | 15 days | 3 weeks |
| Phase 2 | 4 weeks | 14 days | 3 weeks |
| Phase 3 | 8 weeks | 31 days | 6 weeks |
| Phase 4 | 20 weeks | 41 days | 8 weeks |
| Phase 5 | 36 weeks | 36 days | 7 weeks |
| **Total** | **~18 months** | **137 days** | **~27 weeks** |

---

## Appendix A: Glossary

| Term | Definition |
|------|-----------|
| **IOC** | Indicator of Compromise — a piece of evidence (domain, IP, URL, hash) linked to a threat |
| **NRD** | Newly Registered Domain — a domain registered in the last 30 days |
| **CT Log** | Certificate Transparency Log — public record of SSL/TLS certificates |
| **TTP** | Tactics, Techniques, and Procedures — attacker behaviour patterns |
| **MITRE ATT&CK** | Industry-standard framework for classifying cyber attacks |
| **MTTD** | Mean Time to Detect — average time from threat creation to detection |
| **MTTA** | Mean Time to Alert — average time from detection to customer notification |
| **MTTR** | Mean Time to Resolve — average time from detection to threat remediation |
| **PIR** | Priority Intelligence Requirement — what we need to know |
| **FP** | False Positive — benign activity incorrectly flagged as a threat |
| **FN** | False Negative — a real threat that was not detected |

## Appendix B: MITRE ATT&CK Mapping

| Technique | ID | DoppelDown Detection Method |
|-----------|-----|---------------------------|
| Phishing | T1566 | Web scanning, visual similarity, NLP intent analysis |
| Acquire Infrastructure: Domains | T1583.001 | NRD monitoring, CT log monitoring, typosquatting detection |
| Acquire Infrastructure: Web Services | T1583.006 | Social media scanning |
| Establish Accounts: Social Media | T1585.001 | Social media scanning, profile analysis |
| Stage Capabilities: Upload Tool | T1608.005 | Phishing kit detection, HTML fingerprinting |
| Gather Victim Identity: Credentials | T1589.001 | Dark web monitoring, breach database checking |
| Search Open Websites/Domains | T1593 | Brand asset monitoring |

## Appendix C: Competitive Intelligence Feature Comparison

| Feature | DoppelDown (Current) | DoppelDown (With Strategy) | BrandShield | Red Points | Bolster |
|---------|---------------------|---------------------------|-------------|------------|---------|
| Self-serve onboarding | ✅ | ✅ | ❌ | ❌ | ❌ |
| Transparent pricing | ✅ | ✅ | ❌ | ❌ | ❌ |
| Domain monitoring | ✅ | ✅ Enhanced | ✅ | ✅ | ✅ |
| Social media scanning | ✅ | ✅ Enhanced | ✅ | ✅ | ✅ |
| CT log monitoring | ❌ | ✅ | ✅ | ❌ | ✅ |
| NRD monitoring | ✅ Basic | ✅ Advanced | ✅ | ❌ | ✅ |
| Dark web monitoring | ❌ | ✅ (Enterprise) | ✅ | ❌ | ✅ |
| Phishing kit tracking | ❌ | ✅ | ❌ | ❌ | ✅ |
| Threat actor profiling | ❌ | ✅ | ✅ | ❌ | ❌ |
| Automated takedowns | ❌ | ✅ (Phase 4) | ✅ | ✅ | ✅ |
| ML threat scoring | ✅ | ✅ Enhanced | ✅ | ✅ | ✅ |
| Monthly threat reports | ❌ | ✅ | ✅ | ✅ | ❌ |
| Campaign detection | ❌ | ✅ | ✅ | ❌ | ❌ |
| MITRE ATT&CK mapping | ✅ | ✅ | ❌ | ❌ | ❌ |
| Price (entry level) | $49/mo | $49/mo | ~$30K/yr | ~$15K/yr | Contact Sales |

---

*This strategy positions DoppelDown's threat intelligence as a genuine competitive differentiator. The phased approach ensures Richard can ship incremental value to customers without waiting for the full vision. Phase 1 alone — free CT log monitoring and expanded NRD matching — would put DoppelDown ahead of most competitors at the SMB price point.*

*The intelligence moat deepens with every customer, every scan, and every confirmed threat. Data network effects mean that by the time a competitor tries to copy this, DoppelDown will have months of historical correlation data and trained models they can't replicate.*
