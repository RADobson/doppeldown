# Data Governance & Privacy Strategy

**DoppelDown — Comprehensive Framework**
**Dobson Development Pty Ltd** (ACN 688 593 606)
**Version:** 1.0
**Classification:** CONFIDENTIAL — Internal
**Date:** 5 February 2026
**Owner:** Founder / Privacy Lead

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Strategic Vision & Principles](#2-strategic-vision--principles)
3. [Governance Structure](#3-governance-structure)
4. [Data Classification Framework](#4-data-classification-framework)
5. [Data Lifecycle Management](#5-data-lifecycle-management)
6. [Retention & Disposal Policy](#6-retention--disposal-policy)
7. [Access Control Framework](#7-access-control-framework)
8. [Privacy Compliance Program](#8-privacy-compliance-program)
9. [Third-Party & Sub-Processor Governance](#9-third-party--sub-processor-governance)
10. [AI & Automated Processing Governance](#10-ai--automated-processing-governance)
11. [Evidence Collection Ethics](#11-evidence-collection-ethics)
12. [Incident Response & Breach Management](#12-incident-response--breach-management)
13. [Data Subject Rights Program](#13-data-subject-rights-program)
14. [Metrics, Monitoring & Audit](#14-metrics-monitoring--audit)
15. [Training & Awareness](#15-training--awareness)
16. [Implementation Roadmap](#16-implementation-roadmap)
17. [Related Documents](#17-related-documents)

---

## 1. Executive Summary

### Why This Document Exists

DoppelDown is a brand protection platform that processes sensitive data at the intersection of cybersecurity and privacy. We scan the public internet, capture evidence of brand impersonation, analyse content with AI, and store threat intelligence on behalf of our customers. This puts us in a unique position: **a security product that must itself be exemplary at data governance.**

This strategy establishes DoppelDown's unified framework for how we collect, classify, store, process, share, retain, and delete data — not as a compliance checkbox exercise, but as a competitive advantage and trust-building foundation.

### Current State Assessment

| Area | Maturity | Key Gap |
|------|----------|---------|
| Privacy Policy | ✅ Published | Needs deployment on live site + signup flow integration |
| Data Classification | ⚠️ Defined (DATA_HANDLING_GUIDELINES) | Not enforced technically; no labelling in DB |
| Retention Policy | ⚠️ Defined | No automated enforcement; all data stored indefinitely |
| Access Controls | ⚠️ Partial (RLS exists) | Overprivileged DB grants; no MFA; no formal RBAC |
| GDPR Compliance | 🔴 ~25% ready | No DPAs signed; no data export; no deletion flow |
| CCPA Compliance | 🟡 ~35% ready | No request tracking; proactive compliance needed |
| SOC 2 Readiness | 🔴 ~15% ready | No policies; no monitoring; 9–12 months to certification |
| Incident Response | 🔴 Not established | No plan; no detection; no notification process |
| AI Governance | ⚠️ Partial | Data isolation claimed; no technical enforcement of minimisation |

### Strategic Objectives

1. **Trust as product** — Make privacy and data governance a visible competitive differentiator for enterprise sales
2. **Compliance by design** — Bake GDPR, CCPA, and SOC 2 requirements into the product architecture, not bolted on after
3. **Proportionate rigour** — Apply controls proportionate to data sensitivity and business stage (startup pragmatism, not Fortune 500 bureaucracy)
4. **Automation over process** — Where possible, enforce governance through code (RLS, retention crons, schema constraints) not through hope and checklists

---

## 2. Strategic Vision & Principles

### Vision

> DoppelDown protects brands by scanning the internet's dark corners. We earn the right to do that by being transparently responsible with every byte of data we touch — our customers', the public's, and the data subjects who appear incidentally in our evidence.

### Core Principles

| # | Principle | What It Means in Practice |
|---|-----------|--------------------------|
| 1 | **Collect minimum, protect maximum** | Every data field collected must justify its existence. If we can achieve the same outcome with less data, we must. |
| 2 | **No data orphans** | Every piece of data has a defined owner, classification, retention period, and deletion trigger. Nothing sits in the database forever without justification. |
| 3 | **Defence in depth** | No single control is sufficient. RLS + grant restrictions + application validation + encryption + monitoring = confidence. |
| 4 | **Transparency by default** | Users should know what we collect, why, and for how long — before they ask. Our Privacy Policy and dashboard should make this obvious. |
| 5 | **Privacy of third parties** | Our scans capture data about people who didn't sign up for DoppelDown. We have a heightened obligation to minimise, protect, and retain this data responsibly. |
| 6 | **Audit everything, log nothing sensitive** | Log the *fact* that an action occurred, not the sensitive content. Action + actor + timestamp + resource ID — never passwords, tokens, screenshots, or PII in logs. |
| 7 | **Assume breach** | Design data handling as if an attacker will eventually see our database. Minimise blast radius through encryption, segmentation, and least privilege. |

---

## 3. Governance Structure

### 3.1 Roles & Responsibilities

DoppelDown is a lean startup. Governance roles may be held by the same person initially but must be formally assigned.

| Role | Responsibilities | Current Holder |
|------|-----------------|----------------|
| **Data Protection Lead (DPL)** | Overall accountability for privacy compliance; DPIA oversight; regulatory liaison; privacy policy maintenance | Founder (Richard) |
| **Security Lead** | Vulnerability management; incident response; access control reviews; security architecture | Founder (Richard) |
| **Development Lead** | Privacy-by-design implementation; RLS correctness; retention automation; secure coding | Founder (Richard) |
| **EU Representative** (Art. 27 GDPR) | Point of contact for EU supervisory authorities and data subjects | **⚠️ TO BE APPOINTED** — Required before material EU user base |

### 3.2 Governance Cadence

| Activity | Frequency | Owner | Output |
|----------|-----------|-------|--------|
| Privacy & governance review | Quarterly | DPL | Updated risk register + this document |
| Data classification audit | Semi-annually | DPL + Dev Lead | Classification accuracy report |
| Access control review | Quarterly | Security Lead | Access recertification log |
| Retention compliance check | Monthly (automated) + quarterly (manual) | Dev Lead | Retention enforcement report |
| Sub-processor review | Quarterly | DPL | Updated sub-processor register |
| Incident response drill | Semi-annually | Security Lead | Tabletop exercise report |
| Policy document review | Annually | DPL | Updated policy suite |
| Compliance KPI dashboard | Monthly | DPL | KPI report |

### 3.3 Decision Framework

For data governance decisions not covered by existing policy:

```
1. Does it involve new collection of personal data?
   → Requires privacy impact assessment (lightweight DPIA)
   
2. Does it involve sharing data with a new third party?
   → Requires sub-processor assessment + DPA
   
3. Does it change how existing data is used?
   → Requires purpose limitation review + user notification if material
   
4. Does it affect data retention or deletion?
   → Requires retention policy update + implementation plan
   
5. Is it reversible?
   → If yes: proceed with documentation
   → If no: requires explicit DPL approval
```

---

## 4. Data Classification Framework

### 4.1 Classification Tiers

Every data element in DoppelDown is assigned one of four classification levels. Classification determines handling requirements across the entire lifecycle.

| Level | Label | Colour | Description | Examples |
|-------|-------|--------|-------------|---------|
| **L4** | 🔴 CRITICAL | Red | Data whose exposure would cause severe, potentially unrecoverable harm. Includes authentication secrets and infrastructure credentials. | Supabase service role key, Stripe secret key, SMTP credentials, hashed passwords, `CRON_SECRET`, `FIELD_ENCRYPTION_KEY` |
| **L3** | 🟠 CONFIDENTIAL | Orange | Personal data and business-sensitive customer data. Exposure would breach privacy laws and customer trust. | User emails, names, brand data, threat evidence, WHOIS registrant PII, screenshots, billing info, AI analysis results, alert settings, webhook secrets |
| **L2** | 🟡 INTERNAL | Yellow | Operational data not exposed to users. Exposure would aid attackers but not directly breach privacy. | Audit logs, scan job metadata, server logs, error traces, worker IDs, system configuration |
| **L1** | 🟢 PUBLIC | Green | Data intended for or already in the public domain. | Landing page content, pricing tiers, documentation, blog posts, public API docs |

### 4.2 Detailed Classification Register

#### User & Account Data

| Data Element | Classification | Storage | Contains PII | Encryption | Retention |
|---|---|---|---|---|---|
| User email | 🟠 L3 CONFIDENTIAL | `auth.users`, `public.users` | ✅ Direct | AES-256 at rest (Supabase) | Account lifetime + 30 days |
| User full name | 🟠 L3 CONFIDENTIAL | `public.users` | ✅ Direct | AES-256 at rest | Account lifetime + 30 days |
| Hashed password | 🔴 L4 CRITICAL | `auth.users` | ✅ Derived | bcrypt hash (irreversible) | Account lifetime |
| Stripe customer ID | 🟠 L3 CONFIDENTIAL | `public.users` | ✅ Indirect | AES-256 at rest | Account lifetime + 7 years (billing ref) |
| Subscription tier/status | 🟡 L2 INTERNAL | `public.users` | ❌ | AES-256 at rest | Account lifetime + 30 days |
| `is_admin` flag | 🟡 L2 INTERNAL | `public.users` | ❌ | AES-256 at rest | Account lifetime |
| Manual scan count | 🟡 L2 INTERNAL | `public.users` | ❌ | AES-256 at rest | Account lifetime |

#### Brand Data

| Data Element | Classification | Storage | Contains PII | Encryption | Retention |
|---|---|---|---|---|---|
| Brand name | 🟠 L3 CONFIDENTIAL | `public.brands` | ⚠️ Indirect | AES-256 at rest | Account lifetime |
| Brand domain | 🟠 L3 CONFIDENTIAL | `public.brands` | ⚠️ Indirect | AES-256 at rest | Account lifetime |
| Brand logo | 🟠 L3 CONFIDENTIAL | Supabase Storage (`logos`) | ❌ | AES-256 at rest | Account lifetime |
| Brand keywords | 🟡 L2 INTERNAL | `public.brands` | ❌ | AES-256 at rest | Account lifetime |
| Social handles (JSONB) | 🟠 L3 CONFIDENTIAL | `public.brands` | ⚠️ Indirect | AES-256 at rest | Account lifetime |

#### Threat & Evidence Data

| Data Element | Classification | Storage | Contains PII | Encryption | Retention |
|---|---|---|---|---|---|
| Threat URLs/domains | 🟠 L3 CONFIDENTIAL | `public.threats` | ❌ | AES-256 at rest | See §6 (tier-based) |
| WHOIS data (JSONB) | 🟠 L3 CONFIDENTIAL | `public.threats` | ✅ Third-party PII | AES-256 at rest | See §6 (tier-based) |
| Evidence screenshots | 🟠 L3 CONFIDENTIAL | Supabase Storage (`evidence`) | ⚠️ May contain PII | AES-256 at rest | 12 months from capture |
| HTML snapshots | 🟠 L3 CONFIDENTIAL | `public.threats` (JSONB) | ⚠️ May contain PII | AES-256 at rest | 12 months from capture |
| AI analysis results | 🟠 L3 CONFIDENTIAL | `public.threats` (JSONB) | ❌ | AES-256 at rest | See §6 (tier-based) |
| Threat risk scores | 🟡 L2 INTERNAL | `public.threats` | ❌ | AES-256 at rest | See §6 (tier-based) |

#### Operational Data

| Data Element | Classification | Storage | Contains PII | Encryption | Retention |
|---|---|---|---|---|---|
| Scan metadata | 🟡 L2 INTERNAL | `public.scans`, `public.scan_jobs` | ❌ | AES-256 at rest | 12 months |
| Audit logs | 🟡 L2 INTERNAL | `public.audit_logs` | ✅ user_id ref | AES-256 at rest | 24 months |
| Alert settings | 🟠 L3 CONFIDENTIAL | `public.alert_settings` | ✅ email, webhook | AES-256 at rest | Account lifetime |
| Webhook secrets | 🔴 L4 CRITICAL | `public.alert_settings` | ❌ | **Requires app-level encryption** | Account lifetime |
| Notification records | 🟡 L2 INTERNAL | `public.notifications` | ❌ | AES-256 at rest | 90 days |
| PDF reports | 🟠 L3 CONFIDENTIAL | Supabase Storage | ⚠️ Aggregated PII | AES-256 at rest | Account lifetime + 12 months |
| Server/application logs | 🟡 L2 INTERNAL | Vercel logs | ⚠️ IP addresses | Platform-managed | 90 days |

#### Infrastructure Secrets

| Data Element | Classification | Storage | Rotation |
|---|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | 🔴 L4 CRITICAL | Vercel env vars | On compromise + team departure |
| `STRIPE_SECRET_KEY` | 🔴 L4 CRITICAL | Vercel env vars | Quarterly |
| `OPENAI_API_KEY` | 🔴 L4 CRITICAL | Vercel env vars | Quarterly |
| `CRON_SECRET` | 🔴 L4 CRITICAL | Vercel env vars | Quarterly |
| `FIELD_ENCRYPTION_KEY` | 🔴 L4 CRITICAL | Vercel env vars | On compromise (requires re-encryption) |
| `SERPAPI_KEY` | 🟠 L3 CONFIDENTIAL | Vercel env vars | Quarterly |
| SMTP credentials | 🔴 L4 CRITICAL | Vercel env vars | Annually |

### 4.3 Handling Requirements by Classification

| Requirement | 🔴 L4 CRITICAL | 🟠 L3 CONFIDENTIAL | 🟡 L2 INTERNAL | 🟢 L1 PUBLIC |
|-------------|----------------|---------------------|-----------------|--------------|
| Encryption at rest | ✅ Required + app-level | ✅ Required (Supabase) | ✅ Required (Supabase) | ❌ Not required |
| Encryption in transit | ✅ TLS 1.2+ mandatory | ✅ TLS 1.2+ mandatory | ✅ TLS 1.2+ mandatory | ✅ TLS recommended |
| Access control | Infrastructure admin only | RLS-enforced user isolation | Authenticated users (scoped) | None |
| Logging of access | ✅ All access logged | ⚠️ Modifications logged | ⚠️ Sampling recommended | ❌ Not required |
| Included in logs | ❌ NEVER | ❌ Only IDs, never content | ✅ Safe to include | ✅ Safe to include |
| Backup required | ✅ Daily (platform) | ✅ Daily (platform) | ✅ Daily (platform) | ❌ Optional |
| Data export scope | ❌ Never exported | ✅ Included in DSR exports | ⚠️ If relevant to DSR | N/A |
| Deletion cascades | On credential rotation | On account deletion | Per retention schedule | N/A |
| Sharing with third parties | ❌ Never (except infra) | ✅ With DPA only | ✅ With DPA only | ✅ Freely |
| Development/test use | ❌ Never production data | ❌ Synthetic data only | ⚠️ Anonymised only | ✅ Freely |

### 4.4 Classification Enforcement

**Current state:** Classification is documented but not technically enforced.

**Target state (Q2 2026):**

1. **Schema comments** — Add `COMMENT ON COLUMN` to every classified column in PostgreSQL:
   ```sql
   COMMENT ON COLUMN public.users.email IS 'Classification: L3-CONFIDENTIAL | PII: Direct | Retention: account+30d';
   ```

2. **Application-level encryption** — L4 CRITICAL data stored in DB (webhook secrets) must be encrypted with `FIELD_ENCRYPTION_KEY` before storage.

3. **Log sanitisation** — Automated log scrubbing middleware that strips L3/L4 data from error outputs and application logs.

4. **CI/CD check** — Pre-commit hook or CI step that flags new columns without classification comments.

---

## 5. Data Lifecycle Management

### 5.1 Lifecycle Stages

Every piece of data in DoppelDown flows through a defined lifecycle:

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ COLLECT  │ →  │ VALIDATE │ →  │  STORE   │ →  │ PROCESS  │ →  │ ARCHIVE  │ →  │  DELETE  │
│          │    │ & CLASS  │    │          │    │          │    │ (if appl)│    │          │
└─────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │              │               │               │               │
  Minimise       Classify       Encrypt        Purpose-        Reduce          Secure
  at source     & validate      & isolate      limited use     access          erasure
```

### 5.2 Collection — Minimisation Rules

| Data Source | Minimisation Rule |
|---|---|
| **User registration** | Collect only email + name. No phone, no address, no company size. Add optional fields later if needed. |
| **Brand creation** | Collect brand name + domain. Logo and social handles are optional. Keywords are optional. |
| **WHOIS lookups** | Store only: registrant org, creation date, expiry date, nameservers. **Redact registrant personal name and email** unless the query is specifically for takedown evidence. |
| **HTML snapshots** | Truncate to 4,000 characters maximum. Strip `<script>`, `<style>`, and non-visible content. Store only `<body>` inner text + form elements. |
| **Screenshots** | Capture at 1280×720 resolution maximum. Do not capture full-page screenshots (above-fold only). Compress to JPEG quality 80. |
| **AI analysis** | Send only the screenshot + brand logo to OpenAI. Never send user email, user name, or any L3/L4 customer data. |
| **Server logs** | Log request path, method, status, duration, and truncated user ID. Never log request/response bodies. Strip query parameters containing tokens. |

### 5.3 Validation & Classification

All data entering the system must be validated before storage:

1. **Brand domain** — Validate against domain regex; resolve DNS to confirm existence; run through SSRF protection (block internal IPs)
2. **User input** — Validate with Zod schemas; sanitise HTML; enforce length limits
3. **Third-party data** — WHOIS responses validated for structure; HTML snapshots sanitised; screenshots validated as valid image data
4. **Classification assignment** — Automatic based on data type (column-level classification in schema)

### 5.4 Processing — Purpose Limitation

| Processing Activity | Permitted Purposes | Prohibited Uses |
|---|---|---|
| Brand monitoring scans | Detecting typosquatting, phishing, impersonation for the brand owner | Mining for competitive intelligence; selling scan results to third parties; profiling individuals |
| AI threat analysis | Scoring visual similarity and phishing intent | Training general-purpose models; using customer brand data in another customer's analysis; facial recognition |
| Evidence collection | Supporting takedown requests and threat assessment | Building profiles of domain registrants; selling evidence data; bulk WHOIS data aggregation |
| Email notifications | Alerting users to threats and scan completions | Marketing to non-consenting users; sharing alert content with third parties |
| Audit logging | Accountability, compliance, incident investigation | Behaviour profiling of users; performance management |

### 5.5 Archival

DoppelDown currently does not implement a formal archive tier. As data volumes grow, the following archival strategy will apply:

| Data Type | Archive Trigger | Archive Location | Access |
|---|---|---|---|
| Threats older than retention period | Automated cron (weekly) | Soft-delete with `archived_at` timestamp → hard delete after 30 days | Read-only for DPL during grace period |
| Evidence files older than 12 months | Automated cron (weekly) | Moved to cold storage bucket → deleted after 30 days | Emergency access only |
| Billing records beyond 3 years | Annual review | Moved to encrypted archive | Legal/tax compliance access only |

### 5.6 Deletion — Secure Erasure

| Deletion Type | Trigger | Process | Verification |
|---|---|---|---|
| **User-initiated delete** (scan, threat, report) | UI action (swipe/menu) | Immediate DB delete + Storage file delete; audit log entry | Optimistic UI + error rollback |
| **Account deletion** | User request via dashboard/email | 30-day grace period → CASCADE delete from `auth.users` → Storage bucket cleanup → Stripe customer archival | Confirmation email + audit log (anonymised) |
| **Retention-driven delete** | Automated weekly cron | Query for data exceeding retention period → batch delete + Storage cleanup | Cron execution log + monthly verification report |
| **Data subject request** (third-party) | Email to privacy@doppeldown.com | Verify identity → redact personal data from WHOIS/evidence → retain threat record | Request log + response confirmation |
| **Incident-driven delete** | DPL directive | Emergency data purge per incident scope | Incident report + deletion certificate |

**Deletion completeness checklist (account deletion):**
- [ ] `auth.users` record deleted (triggers CASCADE)
- [ ] All brands, threats, scans, scan_jobs, reports, alert_settings, notifications deleted via FK CASCADE
- [ ] Evidence files in Supabase Storage `evidence` bucket deleted
- [ ] Logo files in Supabase Storage `logos` bucket deleted  
- [ ] PDF reports in Supabase Storage deleted
- [ ] Stripe customer record archived (not deleted — billing records retained 7 years)
- [ ] Audit logs: `user_id` set to NULL (logs retained for accountability)
- [ ] Email delivery logs purged (if accessible)
- [ ] Confirmation email sent to user's last-known email

---

## 6. Retention & Disposal Policy

### 6.1 Retention Schedule

Retention periods are defined by data classification, regulatory requirements, and business necessity. **Data is retained for the minimum period necessary.**

| Data Category | Classification | Active Retention | Post-Account Deletion | Legal Hold Override | Rationale |
|---|---|---|---|---|---|
| **User account data** (email, name) | 🟠 L3 | Account lifetime | 30-day grace period → delete | Indefinite if subject to legal proceedings | GDPR Art. 5(1)(e) — storage limitation |
| **Brand data** (name, domain, logo) | 🟠 L3 | Account lifetime | CASCADE with account | Same | Contract performance data |
| **Threat records** (metadata, scores, URLs) | 🟠 L3 | Tier-based (see §6.2) | +90 days after account deletion | Same | Evidence preservation for ongoing takedowns |
| **Evidence files** (screenshots, HTML) | 🟠 L3 | 12 months from capture | Deleted with threat record | Same | Minimise third-party data retention |
| **WHOIS data** | 🟠 L3 | 12 months from capture | Deleted with threat record | Same | Third-party PII minimisation |
| **AI analysis results** | 🟠 L3 | Tied to threat record | Deleted with threat record | Same | No independent retention value |
| **Scan records** | 🟡 L2 | 12 months from scan date | CASCADE with brand | Same | Operational data |
| **Scan jobs** | 🟡 L2 | 90 days from completion | CASCADE with brand | Same | Short-lived operational data |
| **PDF reports** | 🟠 L3 | Account lifetime + 12 months | 12 months post-deletion | Same | Customer may need for legal proceedings |
| **Audit logs** | 🟡 L2 | 24 months from creation | Retained (user_id anonymised) | Indefinite | Compliance and accountability |
| **Alert settings** | 🟠 L3 | Account lifetime | CASCADE with account | N/A | No independent value |
| **Notifications** | 🟡 L2 | 90 days | CASCADE with account | N/A | Transient operational data |
| **Billing records** (in Stripe) | 🟠 L3 | 7 years from transaction | 7 years from last transaction | Indefinite | Australian tax law (7-year records) |
| **Server/app logs** | 🟡 L2 | 90 days | Platform auto-rotation | N/A | Debugging and security |
| **Email delivery logs** | 🟡 L2 | 90 days | Platform auto-rotation | N/A | Delivery verification |
| **Cookie consent records** | 🟡 L2 | 3 years from consent event | 3 years from consent event | N/A | GDPR consent proof |

### 6.2 Tier-Based Threat Retention

Enterprise customers expect longer data retention for ongoing investigations. Retention is tier-based:

| Subscription Tier | Threat Record Retention | Evidence File Retention |
|---|---|---|
| Free | 30 days from detection | 30 days from capture |
| Starter ($29/mo) | 90 days from detection | 90 days from capture |
| Pro ($99/mo) | 12 months from detection | 12 months from capture |
| Enterprise ($249/mo) | 24 months from detection | 12 months from capture |

**Implementation:** A weekly cron job (`/api/cron/retention`) queries for records exceeding the user's tier retention period and batch-deletes them. The cron must:
1. Check the user's current tier (not historical tier)
2. Delete evidence files from Supabase Storage first (to avoid orphaned files)
3. Delete threat records from database
4. Log the retention action in audit_logs

### 6.3 Retention Exceptions

| Exception | Applies To | Duration | Approval |
|---|---|---|---|
| **Legal hold** | Any data subject to active legal proceedings, regulatory investigation, or lawful preservation request | Duration of proceedings + 30 days | DPL written approval |
| **Active takedown** | Threat records where a takedown request is pending or in progress | Until takedown resolution + 90 days | Automatic (system flag) |
| **Regulatory audit** | Audit logs and billing records | Duration of audit + 12 months | DPL written approval |
| **User request for extension** | Enterprise customers may request extended retention via support | Max 36 months (contractual) | DPL approval + documented in DPA |

### 6.4 Disposal Methods

| Data Type | Disposal Method | Verification |
|---|---|---|
| Database records | PostgreSQL `DELETE` (Supabase RLS-enforced) | Query confirmation + audit log |
| Supabase Storage files | Supabase Storage API `remove()` | API response confirmation |
| Stripe records | Stripe API archive/delete | API response confirmation |
| Backups containing deleted data | Supabase manages backup rotation (retained ~7 days) | No manual action; documented SLA |
| Local development data | `DROP DATABASE` + file system delete | Developer attestation |

### 6.5 Automated Retention Enforcement

```
Retention Cron Job (Weekly, Sunday 02:00 UTC)
├── 1. Query users with active retention policies
├── 2. For each user's tier:
│   ├── a. Find threats exceeding retention period
│   ├── b. Delete associated Storage files (evidence, screenshots)
│   ├── c. Delete threat records from database
│   └── d. Log retention action (count, user_id, tier, period)
├── 3. Find scan_jobs older than 90 days → delete
├── 4. Find notifications older than 90 days → delete
├── 5. Find audit_logs older than 24 months → delete
├── 6. Generate retention report → log
└── 7. Alert on failures
```

---

## 7. Access Control Framework

### 7.1 Principles

1. **Least privilege** — Every role, user, and system component gets the minimum access required
2. **Separation of duties** — No single person can both deploy code and access production data without oversight
3. **Explicit over implicit** — All access grants are documented and justified
4. **Revocation over expiration** — Access is actively revoked when no longer needed, not left to expire

### 7.2 Database Access Control

#### Current State (CRITICAL FINDING)

```sql
-- THIS EXISTS AND MUST BE FIXED IMMEDIATELY
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
```

#### Target State

| PostgreSQL Role | Tables Accessible | Permissions | Rationale |
|---|---|---|---|
| `anon` | `public.users` (via trigger only) | USAGE on schema only | Unauthenticated users need zero direct table access |
| `authenticated` | `users` | SELECT, UPDATE (own row via RLS) | Users view/edit their own profile |
| `authenticated` | `brands` | SELECT, INSERT, UPDATE, DELETE (RLS) | Full CRUD on own brands |
| `authenticated` | `threats` | SELECT, INSERT, UPDATE, DELETE (RLS) | Full CRUD on own threats |
| `authenticated` | `scans` | SELECT, INSERT, UPDATE, DELETE (RLS) | Full CRUD on own scans |
| `authenticated` | `scan_jobs` | SELECT, INSERT (RLS) | View and create scan jobs |
| `authenticated` | `reports` | SELECT, INSERT, DELETE (RLS) | View, create, delete own reports |
| `authenticated` | `alert_settings` | SELECT, INSERT, UPDATE (RLS) | Manage own alert settings |
| `authenticated` | `audit_logs` | SELECT (RLS) | View own audit trail |
| `authenticated` | `notifications` | SELECT, UPDATE (RLS) | View and mark-as-read |
| `service_role` | All tables | ALL | Used by API routes and scan worker (server-side only) |

**Implementation priority: IMMEDIATE** (see Compliance Security Audit MIT-C2)

#### Row-Level Security (RLS) Matrix

| Table | Policy Name | Rule | Enforcement |
|---|---|---|---|
| `users` | `users_own_data` | `auth.uid() = id` | SELECT, UPDATE |
| `brands` | `brands_own_data` | `auth.uid() = user_id` | ALL operations |
| `threats` | `threats_via_brand` | `brand.user_id = auth.uid()` (JOIN) | ALL operations |
| `scans` | `scans_via_brand` | `brand.user_id = auth.uid()` (JOIN) | ALL operations |
| `scan_jobs` | `jobs_via_brand` | `brand.user_id = auth.uid()` (JOIN) | SELECT, INSERT |
| `reports` | `reports_via_brand` | `brand.user_id = auth.uid()` (JOIN) | ALL operations |
| `alert_settings` | `alerts_own_data` | `auth.uid() = user_id` | ALL operations |
| `audit_logs` | `audit_own_data` | `auth.uid() = user_id` | SELECT only |
| `notifications` | `notifs_own_data` | `auth.uid() = user_id` | SELECT, UPDATE |

### 7.3 Application Access Control

| System | Access Level: Developer | Access Level: Admin/Founder | Access Level: Scan Worker |
|---|---|---|---|
| **Vercel Dashboard** | Deploy-only | Full | N/A |
| **Supabase Dashboard** | Read-only (non-prod) | Full | N/A |
| **Production DB (direct)** | ❌ Never | Emergency only (documented) | ❌ Never |
| **Stripe Dashboard** | ❌ Never | Full | N/A |
| **OpenAI Dashboard** | ❌ Never | Read-only (usage) | N/A |
| **SerpAPI Dashboard** | ❌ Never | Full | N/A |
| **GitHub Repository** | Full (with branch protection) | Full | N/A |
| **Service Role Key** | ❌ Never on local machines | Via Vercel env vars only | Yes (production env only) |
| **Error Monitoring** (Sentry) | Full | Full | N/A |
| **Log Aggregation** (Axiom) | Read-only | Full | N/A |

### 7.4 Authentication Requirements

| User Type | Current State | Target State (Q2 2026) |
|---|---|---|
| Regular users | Email + password (6-char min) | Email + password (12-char min, NIST 800-63b compliant) |
| Admin users | Same as regular + `is_admin` flag | Email + password + **MFA required** (TOTP via Supabase Auth) |
| API access (future) | N/A | API key + IP allowlisting |
| Scan worker | Service role key | Service role key + **network restriction** (VPS IP allowlist) |
| Cron endpoints | `CRON_SECRET` bearer token | Timing-safe comparison + Vercel CRON IP verification |

### 7.5 Key Rotation Schedule

| Secret | Rotation Frequency | Rotation Trigger | Process |
|---|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | On compromise or team change | Immediately | Generate new key in Supabase dashboard → update all env vars → verify → old key auto-invalidated |
| `STRIPE_SECRET_KEY` | Quarterly | Scheduled | Generate new key → update env vars → verify webhook signing → revoke old key |
| `OPENAI_API_KEY` | Quarterly | Scheduled | Generate new key → update env vars → test API call → delete old key |
| `SERPAPI_KEY` | Quarterly | Scheduled | Generate new key → update env vars → verify → delete old key |
| `CRON_SECRET` | Quarterly | Scheduled | Generate 32-byte random hex → update env vars → update Vercel cron config |
| `FIELD_ENCRYPTION_KEY` | On compromise only | Emergency | Generate new key → re-encrypt all encrypted fields → update env vars |
| SMTP credentials | Annually | Scheduled | Rotate via email provider → update env vars → test email delivery |
| User webhook secrets | On user request | User-initiated | User regenerates in dashboard → old secret invalidated immediately |

### 7.6 Access Reviews

| Review Type | Frequency | Scope | Reviewer | Output |
|---|---|---|---|---|
| Third-party service access | Quarterly | Who has admin access to Supabase, Stripe, Vercel, OpenAI, GitHub | DPL | Access audit log |
| Environment variable audit | Quarterly | Which env vars exist; are any unused; are any over-scoped | Security Lead | Updated secrets inventory |
| RLS policy correctness | On every schema migration | Do RLS policies correctly enforce data isolation | Dev Lead | Migration review checklist |
| Admin user audit | Quarterly | Who has `is_admin = true`; is it justified | DPL | Admin roster log |

---

## 8. Privacy Compliance Program

### 8.1 Regulatory Landscape

| Regulation | Applicability | Status | Priority |
|---|---|---|---|
| **Australian Privacy Act 1988** (APPs) | ✅ Primary jurisdiction (Dobson Development Pty Ltd is Australian) | ⚠️ Compliant in principle; privacy policy published | HIGH |
| **GDPR** (EU 2016/679) | ✅ Applies under Art. 3(2) — services offered to EU data subjects | 🔴 ~25% compliant (no DPAs, no DSR mechanisms, no DPIA enforcement) | CRITICAL |
| **UK GDPR** | ✅ Same as GDPR for UK data subjects | 🔴 Same gaps as GDPR | CRITICAL |
| **CCPA/CPRA** (California) | ⚠️ Proactive compliance — may meet thresholds as business scales | 🟡 ~35% compliant | HIGH |
| **PIPEDA** (Canada) | ⚠️ If/when Canadian customers are acquired | ❌ Not assessed | MEDIUM (future) |
| **POPIA** (South Africa) | ⚠️ If/when South African customers are acquired | ❌ Not assessed | LOW (future) |

### 8.2 Privacy by Design Checklist

For every new feature that touches data:

- [ ] **What data is collected?** Document new data elements and their classification
- [ ] **Why is it needed?** Justify each data element against the feature purpose
- [ ] **Is this the minimum data?** Could the feature work with less data or anonymised data?
- [ ] **How long is it kept?** Assign retention period before writing any code
- [ ] **Who can access it?** Define RLS policy before table creation
- [ ] **Is it shared externally?** If yes, verify DPA with the third party
- [ ] **Can the user see/export/delete it?** Ensure DSR mechanisms cover the new data
- [ ] **Is it logged?** Ensure audit logging covers creation and deletion
- [ ] **Privacy policy update needed?** If new data categories, update before deployment

### 8.3 Lawful Basis Register

| Processing Activity | Lawful Basis (GDPR Art. 6) | Justification | Documented? |
|---|---|---|---|
| User account management | (b) Contract performance | Required to deliver the service | ✅ Privacy Policy §4.1 |
| Brand monitoring & scanning | (b) Contract + (f) Legitimate interest | Contract for user data; legitimate interest for public data scanning | ✅ GDPR/CCPA doc §2.3.2 |
| AI threat analysis | (f) Legitimate interest | Detecting phishing and impersonation serves both customer and public safety | ✅ GDPR/CCPA doc §2.3.3 |
| Evidence collection (WHOIS, screenshots) | (f) Legitimate interest | Necessary for threat assessment; balanced against third-party privacy (LIA complete) | ✅ GDPR/CCPA doc §2.3.2 |
| Payment processing | (b) Contract performance | Required for subscription billing | ✅ Privacy Policy §4.2 |
| Email alerts (transactional) | (b) Contract performance | Core service feature (alerts are the product) | ✅ Privacy Policy §14.1 |
| Marketing emails | (a) Consent | Opt-in only; not yet implemented | ⚠️ To be implemented |
| Analytics cookies | (a) Consent | Opt-in only; not yet implemented | ⚠️ To be implemented |
| Audit logging | (f) Legitimate interest | Accountability and compliance requirement | ✅ Data Handling Guidelines §4.4 |
| Retention-based deletion | (c) Legal obligation + (f) Legitimate interest | Required for storage limitation compliance | ✅ This document §6 |

### 8.4 Legitimate Interest Assessments (LIA)

LIAs have been documented for the following processing activities in the GDPR/CCPA Compliance doc (§2.3):

1. **Brand protection scanning** — Customers and DoppelDown have a legitimate interest in detecting brand impersonation. Balanced against third-party registrant privacy because data is already public, processing is purpose-limited, and retention is time-limited.

2. **AI threat analysis** — Detecting phishing serves public safety. No PII of our users is sent to AI providers. Third-party website content is already publicly accessible.

3. **Evidence collection** — Necessary for the core product function. Minimised (HTML truncation, screenshot compression). Time-limited retention (12 months).

### 8.5 DPIA Register

| Processing Activity | DPIA Required? | DPIA Status | Key Risk | Residual Risk |
|---|---|---|---|---|
| AI-based threat scoring | ✅ (systematic monitoring + automated processing) | ✅ Completed (GDPR/CCPA doc §2.4) | False positives leading to improper takedowns | LOW — scores are advisory; users make enforcement decisions |
| Bulk domain scanning | ✅ (large-scale processing of public data) | ⚠️ To be formalized | Incidental collection of third-party PII in WHOIS/screenshots | MEDIUM — mitigated by retention limits and WHOIS redaction |
| Social media monitoring | ✅ (systematic monitoring of public profiles) | ⚠️ To be formalized | Flagging legitimate accounts as impersonators | LOW — users verify before taking action |
| NRD (Newly Registered Domain) monitoring | ⚠️ (systematic monitoring at scale) | ⚠️ To be formalized | Processing registration data of legitimate registrants | LOW — domain data is public; no profiling of individuals |

### 8.6 International Transfer Mechanisms

| Transfer Route | Mechanism | Status | Action Required |
|---|---|---|---|
| AU → US (Supabase) | Supabase DPA with SCCs | ⚠️ DPA not signed | Sign Supabase DPA (self-serve at supabase.com/legal/dpa) |
| EU → US (Supabase) | SCCs Module 2 (Controller → Processor) | ⚠️ DPA not signed | Same |
| AU/EU → US (Stripe) | Stripe DPA with SCCs + BCRs | ⚠️ Verify auto-DPA | Confirm DPA acceptance in Stripe dashboard |
| AU/EU → US (Vercel) | Vercel DPA with SCCs | ⚠️ DPA not signed | Sign Vercel DPA (self-serve at vercel.com/legal/dpa) |
| AU/EU → US (OpenAI) | OpenAI Data Processing Addendum | ⚠️ DPA not signed | Accept DPA via platform.openai.com |
| AU/EU → US (SerpAPI) | Custom DPA | ⚠️ Not initiated | Contact SerpAPI for DPA; assess if SCCs needed |
| AU/EU → US (Google Cloud) | Google Cloud DPA with SCCs + BCRs | ✅ Standard | Verify acceptance in Google Cloud console |
| AU/EU → EU (WhoAPI, Croatia) | Intra-EEA (no additional mechanism needed for EU transfers) | ✅ N/A | Verify DPA with WhoAPI |

---

## 9. Third-Party & Sub-Processor Governance

### 9.1 Sub-Processor Register

| Sub-Processor | Purpose | Data Classification | Data Elements | Location | DPA | Certifications | Risk |
|---|---|---|---|---|---|---|---|
| **Supabase, Inc.** | Database, auth, storage | 🟠 L3 + 🔴 L4 | All structured data + files | US (AWS) | ⚠️ Pending | SOC 2 Type 2 | HIGH (single point of failure) |
| **Stripe, Inc.** | Payments | 🟠 L3 | Billing data, email | US | ⚠️ Verify | PCI DSS L1, SOC 2 | LOW |
| **Vercel, Inc.** | Hosting | 🟡 L2 + 🔴 L4 (env vars) | Request logs, env vars | US (AWS) | ⚠️ Pending | SOC 2 Type 2 | MEDIUM |
| **OpenAI, Inc.** | AI analysis | 🟠 L3 | Screenshots, HTML excerpts | US | ⚠️ Pending | SOC 2 Type 2 | MEDIUM |
| **SerpAPI** | Web search | 🟠 L3 | Brand names, domains | US | ⚠️ Pending | — | MEDIUM |
| **Google Cloud** | Vision API | 🟠 L3 | Logo images | US | ✅ Standard | ISO 27001, SOC 2 | LOW |
| **WhoisXMLAPI** | WHOIS lookup | 🟢 L1 (sends) / 🟠 L3 (receives) | Domain names → registrant data | US | ⚠️ Pending | — | LOW |
| **WhoAPI** | WHOIS fallback | 🟢 L1 (sends) / 🟠 L3 (receives) | Domain names → registrant data | EU (Croatia) | ⚠️ Pending | — | LOW |
| **SMTP Provider** | Email delivery | 🟠 L3 | Recipient email, notification content | TBD | ⚠️ Pending | TBD | MEDIUM |

### 9.2 Sub-Processor Assessment Criteria

Before onboarding a new sub-processor:

| Criterion | Minimum Requirement | Ideal |
|---|---|---|
| **Security certification** | Documented security practices | SOC 2 Type 2 or ISO 27001 |
| **DPA availability** | Willing to sign a DPA | Standard DPA available |
| **Data residency** | Documented data locations | Ability to choose data region |
| **Breach notification** | Commits to notification | ≤48 hours notification SLA |
| **Data retention** | Documented retention policy | Zero retention / configurable |
| **Sub-processor transparency** | Discloses own sub-processors | Provides sub-processor list |
| **Encryption** | TLS in transit | TLS + AES-256 at rest |
| **API data usage** | Does not use API data for training | Explicit contractual commitment |
| **GDPR compliance** | Awareness | EU Representative appointed; DPF certified |

### 9.3 Sub-Processor Change Management

1. **Evaluation** — Assess new sub-processor against criteria in §9.2
2. **DPA execution** — Sign DPA before any data is shared
3. **Notification** — Notify customers at least **14 days** before activation (per DPA template §5.2)
4. **Register update** — Update this document and public sub-processor page
5. **Privacy policy review** — Determine if privacy policy update is required
6. **Objection handling** — If a customer objects, attempt to provide an alternative or offer pro-rata refund for termination

### 9.4 Data Minimisation for Third Parties

| Sub-Processor | What We Send | What We DON'T Send | Minimisation Technique |
|---|---|---|---|
| **OpenAI** | Screenshot (base64), HTML excerpt (≤4,000 chars), brand logo | User email, name, billing, internal IDs | Character truncation; no user PII in prompts; brand name used only in analysis prompt |
| **SerpAPI** | Brand name, domain, search query text | User email, account data, prior results | Query text only; no user context |
| **Google Vision** | Logo image only | Anything else | Single image per request; no metadata |
| **Stripe** | Email, subscription events | Brand data, threat data, scan results | Minimum for billing; Stripe determines what it needs |
| **WHOIS providers** | Domain name only | Brand name, user data | Single domain per lookup |
| **SMTP** | Recipient email, notification subject + body | Full evidence data, screenshots | Email contains summary + dashboard link, not raw evidence |

---

## 10. AI & Automated Processing Governance

### 10.1 AI Processing Principles

1. **Transparency** — Users are informed that AI is used for threat analysis (Privacy Policy §5; ToS §3.1)
2. **Human oversight** — AI scores are advisory only. All enforcement decisions (takedowns, reports) are made by the user
3. **Data isolation** — Customer data is never used to train models accessible to other customers
4. **Minimisation** — Send the minimum data required for analysis; strip user PII before API calls
5. **No black boxes** — AI analysis results include explanations (similarity reasons, phishing indicators detected)

### 10.2 AI Data Flow Controls

```
Brand Logo        ──→  ┌─────────────┐      ┌─────────────┐
(from Supabase)        │             │      │             │
                       │   Prepare   │ ──→  │   OpenAI    │ ──→  Results
Screenshot       ──→   │   Payload   │      │   Vision    │      (JSONB)
(from evidence)        │             │      │   API       │
                       │ ✓ Strip PII │      │             │
HTML (≤4000)     ──→   │ ✓ Truncate  │      │ Zero-retain │
(from evidence)        │ ✓ No user   │      │ (API TOS)   │
                       │   context   │      │             │
                       └─────────────┘      └─────────────┘
                              ↑                     │
                              │                     │
                    NEVER SENT:                  RETURNED:
                    - User email               - Similarity score
                    - User name                - Phishing indicators
                    - Account ID               - Threat classification
                    - Billing data             - Confidence level
                    - Internal IDs             - Explanation text
```

### 10.3 Automated Decision-Making (GDPR Art. 22)

DoppelDown's AI produces threat scores and classifications. These do **not** constitute solely automated decision-making with legal or similarly significant effects because:

- Scores are **decision-support tools**, not autonomous decisions
- Users review all threats and make their own enforcement decisions
- Users can classify threats as false positives
- No automated takedowns are performed without user action
- No user account decisions are made by AI (e.g., no automated bans)

**User right to human review:** If a user (or affected third party) believes an automated assessment has significantly affected them, they may request human review at privacy@doppeldown.com. Response within 30 days.

### 10.4 Model Improvement Using Customer Data

| Activity | Permitted? | Conditions |
|---|---|---|
| Using individual customer brand data to improve their own scans | ✅ Yes | Core service functionality |
| Using customer data to improve another customer's scans | ❌ No | Violates data isolation principle |
| Using anonymised, aggregated patterns to improve detection heuristics | ✅ Yes | Must be truly anonymised (no brand names, domains, or user IDs); users may opt out |
| Sharing customer data with OpenAI for model training | ❌ No | OpenAI API terms: zero retention for training; we never opt in |

---

## 11. Evidence Collection Ethics

### 11.1 The Ethical Challenge

DoppelDown's core product involves scraping websites, capturing screenshots, and collecting WHOIS data about domains that belong to third parties who have no relationship with us. This creates a unique ethical obligation.

### 11.2 Ethical Principles for Evidence Collection

| Principle | Implementation |
|---|---|
| **Public data only** | We only collect data that is publicly accessible. We never bypass authentication, CAPTCHAs, or access controls. |
| **Proportionality** | Evidence collection is proportionate to the threat level. Low-risk domains get basic checks; high-risk domains get full evidence. |
| **Minimisation** | HTML snapshots are truncated. Screenshots capture above-fold only. WHOIS registrant personal data is redacted when not essential for takedown. |
| **No profiling** | We do not build profiles of domain registrants. WHOIS data is stored only in the context of a specific threat assessment. |
| **Respect robots.txt** | Where feasible, respect `robots.txt` directives. However, for suspected phishing sites, security research is a widely accepted exception. |
| **User-agent honesty** | Our scanner identifies itself clearly in the User-Agent string (e.g., `DoppelDown-Scanner/1.0`). We do not impersonate real browsers for evidence collection. **FINDING:** Current implementation uses a spoofed Chrome user-agent — this should be changed. |
| **No credential harvesting** | We never submit data to forms on scanned sites. Evidence collection is passive observation only. |
| **Time-limited retention** | Evidence older than 12 months is automatically deleted, regardless of the threat record's retention period. |

### 11.3 WHOIS Data Handling

WHOIS data frequently contains third-party personal information (registrant name, email, address, phone).

| Data Element | Store? | Justification | Retention |
|---|---|---|---|
| Registrant organisation | ✅ Yes | Useful for threat assessment | Tied to threat record |
| Registration/expiry dates | ✅ Yes | Useful for threat assessment | Tied to threat record |
| Nameservers | ✅ Yes | Useful for infrastructure analysis | Tied to threat record |
| Registrant personal name | ⚠️ Redact by default | Store only if needed for takedown report and user explicitly requests | Tied to threat record |
| Registrant email | ⚠️ Redact by default | Store only if needed for abuse report contact | Tied to threat record |
| Registrant phone | ❌ Delete | Never needed for our purpose | Immediate |
| Registrant street address | ❌ Delete | Never needed for our purpose | Immediate |

**Implementation:** The WHOIS parser should strip personal contact fields before storing to the database, retaining only organisational and date information by default. A `whois_full` flag on the threat record can be set when a takedown report is generated, which triggers full WHOIS data inclusion.

### 11.4 Screenshot Data Handling

Screenshots may incidentally capture personal information visible on the scanned page (names, photos, addresses).

- Screenshots are stored as **private** objects in Supabase Storage
- Access is via **signed URLs** with a **1-hour TTL**
- Screenshots are JPEG-compressed (quality 80) at a maximum resolution of 1280×720
- Screenshots older than 12 months are automatically deleted
- Screenshots are never used for purposes beyond threat assessment and takedown evidence

---

## 12. Incident Response & Breach Management

### 12.1 Incident Classification

| Severity | Description | Response Target | Notification Required |
|---|---|---|---|
| **P0 — Data Breach** | Confirmed unauthorised access to or exfiltration of personal data | Immediate (within 1 hour of detection) | ✅ Regulatory (72h for GDPR) + Affected users |
| **P1 — Security Incident** | Potential data exposure; vulnerability actively exploited; service compromise | Within 4 hours | ⚠️ Assess — notify if data was accessed |
| **P2 — Vulnerability** | Security weakness discovered but not exploited | Within 24 hours | ❌ Not externally (track internally) |
| **P3 — Policy Violation** | Internal policy breach (e.g., unauthorised production access) | Within 1 business day | ❌ Internal only |

### 12.2 Incident Response Process

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ DETECT   │ →  │ CONTAIN  │ →  │ ASSESS   │ →  │ NOTIFY   │ →  │ REMEDIATE│ →  │ REVIEW   │
│          │    │          │    │          │    │          │    │          │    │          │
│ Monitoring│    │ Isolate  │    │ What data│    │ Regulator│    │ Fix root │    │ Lessons  │
│ User rpt │    │ Rotate   │    │ was       │    │ Users    │    │ cause    │    │ learned  │
│ Anomaly  │    │ creds    │    │ affected?│    │ Partners │    │ Deploy   │    │ Controls │
│ 3rd party│    │ Block    │    │ How many?│    │          │    │ patches  │    │ update   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

### 12.3 Notification Obligations

| Regulation | Who to Notify | Deadline | Threshold |
|---|---|---|---|
| **GDPR Art. 33** | Supervisory authority (lead SA, or OAIC if Australian-led) | 72 hours from awareness | Breach likely to result in risk to rights/freedoms |
| **GDPR Art. 34** | Affected data subjects | Without undue delay | Breach likely to result in *high* risk to rights/freedoms |
| **Australian Privacy Act (NDB scheme)** | OAIC + affected individuals | As soon as practicable | Eligible data breach likely to result in serious harm |
| **CCPA §1798.150** | California AG | Without unreasonable delay | Breach of >500 California residents |

### 12.4 Breach Notification Template

```
SUBJECT: DoppelDown Security Notice — [Date]

Dear [Name],

We are writing to inform you of a security incident affecting your 
DoppelDown account.

WHAT HAPPENED:
[Brief description of the incident]

WHEN IT HAPPENED:
[Date/time range]

WHAT DATA WAS AFFECTED:
[Categories of data]

WHAT WE'VE DONE:
[Containment and remediation steps taken]

WHAT YOU CAN DO:
- Change your DoppelDown password immediately
- Review your account for any unexpected changes
- [Additional recommendations]

CONTACT:
For questions, contact security@doppeldown.com

We sincerely apologize for this incident and are committed to 
preventing it from happening again.

[Founder Name]
DoppelDown
```

### 12.5 Incident Log

All incidents must be recorded in an incident log with:
- Incident ID and classification
- Detection method and time
- Containment actions and time
- Data affected (categories, volume, number of individuals)
- Root cause
- Remediation steps
- Notification actions taken
- Lessons learned and control improvements

---

## 13. Data Subject Rights Program

### 13.1 Rights Matrix

| Right | GDPR | APP (AU) | CCPA | Implementation | Status |
|---|---|---|---|---|---|
| **Access / Know** | Art. 15 | APP 12 | §1798.100 | JSON data export via API or manual | ⚠️ Manual only (no self-service export) |
| **Rectification / Correct** | Art. 16 | APP 13 | §1798.106 | Dashboard (name, email, brand data) + support for other data | ⚠️ Partial (dashboard only) |
| **Erasure / Delete** | Art. 17 | — | §1798.105 | Full account deletion cascade | ⚠️ No self-service flow |
| **Restriction** | Art. 18 | — | — | `processing_restricted` flag → pauses scans | ❌ Not implemented |
| **Portability** | Art. 20 | — | — | JSON export (structured, machine-readable) | ❌ Not implemented |
| **Object** | Art. 21 | — | — | Case-by-case assessment; cease legitimate interest processing | ❌ No mechanism |
| **Automated decision review** | Art. 22 | — | — | Human review of AI scores on request | ✅ Available via email |
| **Opt-out of sale/sharing** | — | — | §1798.120 | N/A — we do not sell/share | ✅ N/A |
| **Non-discrimination** | — | — | §1798.125 | No service degradation for exercising rights | ✅ Policy commitment |
| **Complaint** | Art. 77 | APP complaint | — | Via privacy@doppeldown.com | ✅ Available |

### 13.2 Request Handling Process

```
REQUEST RECEIVED (email to privacy@doppeldown.com)
    │
    ▼
ACKNOWLEDGE (within 5 business days)
    │
    ▼
VERIFY IDENTITY
    ├── Authenticated user? → Account auth sufficient
    ├── Email request? → Confirm via account email
    └── Third-party DSR? → Require proof of identity + proof of data subject status
    │
    ▼
LOG REQUEST (type, date, requestor, data subject, status)
    │
    ▼
ASSESS REQUEST
    ├── Valid + no exemption? → Process
    ├── Exemption applies? → Document exemption, notify requestor
    └── Clarification needed? → Contact requestor (clock pauses)
    │
    ▼
PROCESS (within 25 days to allow buffer before 30-day deadline)
    │
    ▼
RESPOND TO DATA SUBJECT
    │
    ▼
DOCUMENT COMPLETION (log outcome, retain request record for 3 years)
```

### 13.3 Data Export Format

When a user requests data access/portability, the export includes:

```json
{
  "export_metadata": {
    "generated_at": "2026-02-05T00:00:00Z",
    "data_subject": "user@example.com",
    "export_type": "full_account_data",
    "format_version": "1.0"
  },
  "account": {
    "email": "...",
    "full_name": "...",
    "created_at": "...",
    "subscription_tier": "...",
    "subscription_status": "..."
  },
  "brands": [
    {
      "id": "...",
      "name": "...",
      "domain": "...",
      "keywords": [],
      "social_handles": {},
      "created_at": "..."
    }
  ],
  "threats": [
    {
      "id": "...",
      "brand_id": "...",
      "threat_url": "...",
      "threat_type": "...",
      "risk_score": 85,
      "status": "active",
      "detected_at": "...",
      "analysis_summary": "..."
    }
  ],
  "scans": [
    {
      "id": "...",
      "brand_id": "...",
      "scan_type": "...",
      "status": "...",
      "started_at": "...",
      "completed_at": "...",
      "threats_found": 3
    }
  ],
  "reports": [
    {
      "id": "...",
      "brand_id": "...",
      "generated_at": "...",
      "download_url": "..."
    }
  ],
  "alert_settings": {
    "alert_email": "...",
    "severity_threshold": "...",
    "email_alerts_enabled": true,
    "webhook_url": "...",
    "digest_enabled": true
  },
  "audit_trail": [
    {
      "action": "...",
      "resource_type": "...",
      "resource_id": "...",
      "created_at": "..."
    }
  ]
}
```

### 13.4 Third-Party Data Subject Requests

When someone who is NOT a DoppelDown user contacts us about their data appearing in our system (e.g., their WHOIS data was captured, or their social media profile was flagged):

| Step | Action | Timeline |
|---|---|---|
| 1 | Acknowledge receipt | 5 business days |
| 2 | Verify identity (require proof they are the registrant/account holder) | Concurrent with step 1 |
| 3 | Search for their personal data across: `threats.whois_data`, `threats.evidence`, Supabase Storage | 5 business days |
| 4 | Assess: does an exemption apply? (legal claims, public interest) | Case-by-case |
| 5 | If valid: **redact** their personal data from WHOIS evidence; retain the threat record (non-PII portions) | 25 days from receipt |
| 6 | Confirm completion to the requestor | Same day as step 5 |

---

## 14. Metrics, Monitoring & Audit

### 14.1 Privacy & Governance KPIs

| KPI | Target | Measurement Method | Frequency |
|---|---|---|---|
| **DSR response time** | ≤ 30 days (100% compliance) | Request log timestamps | Monthly review |
| **DPA coverage** | 100% of sub-processors have signed DPAs | Sub-processor register | Quarterly audit |
| **Retention compliance** | 0 records exceeding defined retention periods | Automated cron report | Weekly (automated) |
| **RLS correctness** | 0 cross-user data leakage incidents | RLS testing suite + manual audit | On schema change |
| **Breach notification time** | ≤ 72 hours (GDPR) | Incident log | Per incident |
| **Access review completion** | 100% quarterly | Access review log | Quarterly |
| **Security header score** | A+ on SecurityHeaders.com | Automated check | Monthly |
| **Dependency vulnerabilities** | 0 critical/high unpatched >7 days | `npm audit` / Dependabot | Weekly |
| **Key rotation compliance** | 100% on schedule | Rotation log | Quarterly |
| **Privacy policy currency** | Updated within 12 months | Policy version date | Annually |

### 14.2 Monitoring Infrastructure

| What to Monitor | Tool | Alert Threshold |
|---|---|---|
| RLS policy changes | Supabase migration tracking | Any RLS policy ALTER/DROP |
| Failed authentication attempts | Application logging → Sentry/Axiom | >10 failures per IP per 5 minutes |
| Admin actions | Audit log table | Any `is_admin` flag change |
| Data export requests | Application logging | Any (for compliance tracking) |
| Unusual data access patterns | Application logging → analysis | >3x normal query volume for a user |
| Retention cron execution | Cron health check | Any failure or missed execution |
| Sub-processor availability | Synthetic monitoring | Any outage >5 minutes |
| Certificate expiry | Automated cert check | <30 days to expiry |

### 14.3 Audit Program

| Audit Type | Scope | Frequency | Auditor |
|---|---|---|---|
| **Internal privacy audit** | All GDPR/CCPA requirements | Semi-annually | DPL |
| **RLS policy audit** | All RLS policies against data model | On schema migration | Dev Lead |
| **Access control audit** | All system access grants | Quarterly | Security Lead |
| **Sub-processor audit** | DPA status, security posture, data handling | Annually | DPL |
| **Penetration test** | Application + infrastructure | Annually | External firm |
| **SOC 2 audit** (future) | Trust Service Criteria | Annually | External CPA firm |
| **Code security audit** | SAST scan results, dependency vulnerabilities | Monthly | Dev Lead |

### 14.4 Compliance Dashboard

Build an internal compliance dashboard (admin-only page) displaying:

```
┌────────────────────────────────────────────────────────────┐
│  DATA GOVERNANCE COMPLIANCE DASHBOARD                      │
├────────────┬──────────────┬────────────────┬───────────────┤
│ DPA Status │ Retention    │ DSR Requests   │ Incidents     │
│ ████████░░ │ ████████████ │                │               │
│ 7/9 signed │ 100% on time │ 0 pending      │ 0 open        │
│            │              │ 0 overdue      │ 0 in 90 days  │
├────────────┴──────────────┴────────────────┴───────────────┤
│ Key Rotation                                               │
│ ┌──────────────────┬──────────┬────────────────────┐       │
│ │ Secret           │ Last     │ Next Due           │       │
│ │ STRIPE_SECRET    │ Jan 15   │ Apr 15 ✅          │       │
│ │ OPENAI_KEY       │ Dec 01   │ Mar 01 ⚠️ (5 days)│       │
│ │ CRON_SECRET      │ Nov 20   │ Feb 20 🔴 OVERDUE │       │
│ └──────────────────┴──────────┴────────────────────┘       │
├────────────────────────────────────────────────────────────┤
│ Data Volume by Classification                              │
│ 🔴 L4 CRITICAL:     12 secrets (env vars)                 │
│ 🟠 L3 CONFIDENTIAL: 45,231 records                        │
│ 🟡 L2 INTERNAL:     128,492 records                       │
│ 🟢 L1 PUBLIC:       N/A                                   │
└────────────────────────────────────────────────────────────┘
```

---

## 15. Training & Awareness

### 15.1 Training Program

| Audience | Training | Frequency | Delivery | Content |
|---|---|---|---|---|
| **All team members** | Data governance fundamentals | Annually + onboarding | Self-paced document review | This strategy; classification; handling rules; incident reporting |
| **Developers** | Secure coding & privacy by design | Annually + onboarding | Self-paced + code review feedback | RLS patterns; input validation; log sanitisation; SSRF prevention; encryption; DSR implementation |
| **Admins** | Incident response & breach handling | Semi-annually | Tabletop exercise | Incident classification; containment steps; notification obligations; evidence preservation |
| **Customer-facing** (future) | DSR handling & privacy communication | Annually | Self-paced + role play | Request verification; response templates; escalation paths; what you can/cannot say |

### 15.2 Awareness Touchpoints

- **PR review prompt** — When a PR touches data handling code, the PR template includes a privacy-by-design checklist (§8.2)
- **New sub-processor onboarding** — Triggers review against assessment criteria (§9.2)
- **Schema migration** — Triggers RLS review and classification assignment
- **Security incident** — Triggers refresher training + lessons-learned distribution
- **Quarterly governance review** — Produces summary communicated to all team members

---

## 16. Implementation Roadmap

### Phase 0: Legal Foundation (Weeks 1–2)

| # | Task | Effort | Owner | Deliverable |
|---|---|---|---|---|
| 0.1 | Sign DPA with Supabase | 1 hour | DPL | Executed DPA |
| 0.2 | Sign DPA with Stripe | 1 hour | DPL | Executed DPA (verify auto-DPA) |
| 0.3 | Sign DPA with Vercel | 1 hour | DPL | Executed DPA |
| 0.4 | Sign DPA with OpenAI | 1 hour | DPL | Executed DPA |
| 0.5 | Contact SerpAPI for DPA | 2 hours | DPL | Executed DPA or risk acceptance |
| 0.6 | Verify Google Cloud DPA | 30 min | DPL | Confirmation |
| 0.7 | Contact WhoisXMLAPI + WhoAPI for DPA | 2 hours | DPL | Executed DPAs |
| 0.8 | Set up privacy@doppeldown.com | 30 min | Admin | Working email alias |
| 0.9 | Deploy privacy policy to live site | 2 hours | Dev | `/privacy` page live |
| 0.10 | Deploy terms of service to live site | 2 hours | Dev | `/terms` page live |
| 0.11 | Add privacy policy + ToS consent to signup | 1 hour | Dev | Checkbox on signup form |

### Phase 1: Critical Security Fixes (Weeks 2–4)

| # | Task | Effort | Owner | Deliverable |
|---|---|---|---|---|
| 1.1 | Fix database grants (revoke ALL, apply least-privilege) | 2 hours | Dev | Updated `schema.sql` + migration |
| 1.2 | Fix SSRF vulnerability (URL validation) | 4 hours | Dev | `ssrf-protection.ts` module |
| 1.3 | Fix timing attack on cron auth | 30 min | Dev | `timingSafeEqual` in cron routes |
| 1.4 | Add Zod input validation to all API routes | 4 hours | Dev | Validation schemas + route updates |
| 1.5 | Add security headers | 2 hours | Dev | Updated `next.config.js` |
| 1.6 | Add rate limiting middleware | 4 hours | Dev | Rate limit module + route integration |
| 1.7 | Strengthen password policy (12-char min) | 1 hour | Dev | Updated auth pages |
| 1.8 | Implement app-level encryption for webhook secrets | 4 hours | Dev | `crypto.ts` module |
| 1.9 | Fix Docker to run as non-root | 1 hour | Dev | Updated `Dockerfile` |
| 1.10 | Enable Dependabot / npm audit in CI | 30 min | Dev | GitHub Actions update |

### Phase 2: Privacy Compliance Core (Weeks 4–8)

| # | Task | Effort | Owner | Deliverable |
|---|---|---|---|---|
| 2.1 | Build data export API endpoint | 2 days | Dev | `GET /api/user/data-export` |
| 2.2 | Build self-service account deletion flow | 3 days | Dev | Dashboard UI + deletion pipeline |
| 2.3 | Build retention enforcement cron job | 1 week | Dev | `/api/cron/retention` |
| 2.4 | Implement WHOIS data redaction in parser | 4 hours | Dev | Updated WHOIS module |
| 2.5 | Add `processing_restricted` flag for Art. 18 | 4 hours | Dev | Schema migration + scan runner check |
| 2.6 | Create DSR request tracking table | 2 hours | Dev | `data_subject_requests` table |
| 2.7 | Build cookie consent banner (if non-essential cookies added) | 4 hours | Dev | React component |
| 2.8 | Formalise remaining DPIAs (bulk scanning, social monitoring, NRD) | 2 days | DPL | DPIA documents |
| 2.9 | Update User-Agent string for evidence collector | 30 min | Dev | Honest UA in scanner |
| 2.10 | Add classification comments to all DB columns | 2 hours | Dev | Schema migration |

### Phase 3: SOC 2 Foundation (Weeks 8–16)

| # | Task | Effort | Owner | Deliverable |
|---|---|---|---|---|
| 3.1 | Write Information Security Policy | 2 days | Security Lead | Published policy document |
| 3.2 | Write Access Control Policy | 1 day | Security Lead | Published policy document |
| 3.3 | Write Change Management Policy | 1 day | Security Lead | Published policy document |
| 3.4 | Write Incident Response Policy + plan | 2 days | Security Lead | Published policy + runbook |
| 3.5 | Write Risk Management Policy + risk register | 2 days | Security Lead | Published policy + register |
| 3.6 | Write Vendor Management Policy | 1 day | DPL | Published policy document |
| 3.7 | Write Business Continuity / DR Policy | 2 days | Security Lead | Published policy + DR plan |
| 3.8 | Implement MFA for admin accounts | 2 days | Dev | Supabase Auth MFA integration |
| 3.9 | Set up centralized logging (Axiom/Datadog) | 1 week | Dev | Log aggregation + dashboards |
| 3.10 | Set up security monitoring + alerting | 1 week | Dev | Alert rules + notification channels |
| 3.11 | Implement comprehensive audit logging | 2 weeks | Dev | Extended audit_logs schema + logging middleware |
| 3.12 | Add SAST to CI pipeline (CodeQL/Semgrep) | 1 day | Dev | GitHub Actions workflow |
| 3.13 | Implement GitHub branch protection rules | 2 hours | Dev | Required reviews, status checks |
| 3.14 | Schedule first penetration test | 1 week (engagement) | Security Lead | Pentest report |
| 3.15 | Build compliance dashboard (admin page) | 1 week | Dev | Dashboard UI |

### Phase 4: SOC 2 Audit Preparation (Weeks 16–28)

| # | Task | Effort | Owner | Deliverable |
|---|---|---|---|---|
| 4.1 | Select compliance automation platform (Vanta/Drata) | 2 weeks | DPL | Platform onboarded |
| 4.2 | Select SOC 2 auditor (CPA firm) | 2 weeks | DPL | Engagement letter signed |
| 4.3 | Readiness assessment with auditor | 1 week | All | Readiness report |
| 4.4 | Remediate readiness findings | 4 weeks | Dev + DPL | Updated controls |
| 4.5 | Internal mock audit | 1 week | DPL | Internal audit report |
| 4.6 | SOC 2 Type I audit | 2 weeks | External auditor | Type I report |

### Phase 5: SOC 2 Type II (Weeks 28–52)

| # | Task | Duration | Owner | Deliverable |
|---|---|---|---|---|
| 5.1 | Observation period | 6 months | All | Continuous evidence collection |
| 5.2 | Monthly control reviews | Ongoing | DPL | Monthly compliance logs |
| 5.3 | Final audit | 2 weeks | External auditor | SOC 2 Type II report |

### Budget Estimates

| Category | Low | High | Notes |
|---|---|---|---|
| DPA signing (most are free) | $0 | $1,000 | Most providers offer self-serve DPAs |
| Legal review (privacy policy, ToS, DPA template) | $3,000 | $10,000 | May already be complete |
| EU Representative service | $1,500/yr | $5,000/yr | Required when EU user base is material |
| Engineering effort (Phases 1–3) | $15,000 | $40,000 | Internal time or contractor cost |
| Compliance platform (Vanta/Drata) | $10,000/yr | $25,000/yr | Starts in Phase 4 |
| Penetration testing | $5,000 | $15,000 | Annual |
| SOC 2 Type I audit | $15,000 | $30,000 | One-time |
| SOC 2 Type II audit | $25,000 | $50,000 | Annual |
| Security monitoring tools | $2,000/yr | $8,000/yr | Sentry + Axiom + Dependabot |
| **Total Year 1** | **$76,500** | **$184,000** | |
| **Total Year 2+** (ongoing) | **$43,500** | **$108,000** | |

---

## 17. Related Documents

This strategy is the master governance document. It references and is implemented through:

| Document | Location | Purpose |
|---|---|---|
| **Privacy Policy** | `legal/PRIVACY_POLICY.md` | External-facing privacy commitments |
| **Terms of Service** | `legal/TERMS_OF_SERVICE.md` | External-facing service agreement |
| **GDPR/CCPA Compliance Framework** | `doppeldown_test/legal/COMPLIANCE_GDPR_CCPA.md` | Detailed regulatory compliance documentation |
| **Data Handling Guidelines** | `doppeldown_test/legal/DATA_HANDLING_GUIDELINES.md` | Internal data handling procedures |
| **Data Processing Agreement (Template)** | `doppeldown_test/legal/DATA_PROCESSING_AGREEMENT.md` | Enterprise customer DPA template |
| **Compliance & Security Audit** | `docs/COMPLIANCE_SECURITY_AUDIT.md` | Technical vulnerability assessment and remediation plan |
| **Disaster Recovery Plan** | `docs/DISASTER_RECOVERY_PLAN.md` | Business continuity and recovery procedures |

### Document Hierarchy

```
DATA_GOVERNANCE_PRIVACY_STRATEGY.md  ← You are here (master strategy)
    │
    ├── Privacy Policy (external commitment)
    ├── Terms of Service (contractual framework)
    │
    ├── GDPR/CCPA Compliance Framework (regulatory detail)
    │   └── ROPA, DPIAs, transfer mechanisms
    │
    ├── Data Handling Guidelines (internal procedures)
    │   └── Classification, access rules, deletion procedures
    │
    ├── DPA Template (enterprise customer contracts)
    │
    └── Compliance & Security Audit (technical assessment)
        └── Vulnerabilities, mitigations, certification roadmap
```

---

## Appendix A: Quick Reference — What to Do When...

| Scenario | Action | Reference |
|---|---|---|
| **New feature collects data** | Complete privacy-by-design checklist | §8.2 |
| **New third-party integration** | Sub-processor assessment + DPA before any data sharing | §9.2, §9.3 |
| **User requests data export** | Follow DSR process; provide JSON within 30 days | §13.2, §13.3 |
| **User requests account deletion** | 30-day grace period → full cascade deletion | §5.6 |
| **Third party asks about their data** | Verify identity; redact PII; retain threat record | §13.4 |
| **Security incident detected** | Classify severity; contain; assess; notify per obligations | §12.2, §12.3 |
| **New team member joins** | Provision minimum access; assign training; add to governance cadence | §7.3, §15.1 |
| **Team member departs** | Revoke all access immediately; rotate shared credentials | §7.5 |
| **Schema migration** | RLS review + classification comments + privacy checklist | §4.4, §7.2 |
| **Key rotation due** | Follow rotation process; verify; document | §7.5 |
| **Audit or regulatory inquiry** | Engage DPL; preserve all relevant records; legal hold if needed | §6.3 |
| **Enterprise customer asks about SOC 2** | Share current compliance posture honestly; provide timeline | §16 Phase 4–5 |

---

## Appendix B: Glossary

| Term | Definition |
|---|---|
| **APP** | Australian Privacy Principles (Schedule 1, Privacy Act 1988) |
| **CCPA** | California Consumer Privacy Act |
| **CPRA** | California Privacy Rights Act (amends CCPA) |
| **DPA** | Data Processing Agreement |
| **DPF** | EU-US Data Privacy Framework |
| **DPIA** | Data Protection Impact Assessment |
| **DPL** | Data Protection Lead |
| **DSR** | Data Subject Request |
| **GDPR** | General Data Protection Regulation (EU 2016/679) |
| **LIA** | Legitimate Interest Assessment |
| **NDB** | Notifiable Data Breaches (Australian scheme) |
| **PII** | Personally Identifiable Information |
| **RLS** | Row-Level Security (PostgreSQL) |
| **ROPA** | Records of Processing Activities |
| **SCC** | Standard Contractual Clauses |
| **SOC 2** | Service Organization Control Type 2 |

---

## Document Control

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-02-05 | OpenClaw Governance Subagent | Initial comprehensive strategy |

**Next Review:** 2026-05-05 (quarterly)
**Owner:** Data Protection Lead (Founder)
**Approved By:** [Pending Founder Approval]

---

*This document is confidential and intended for DoppelDown internal use only. It does not constitute legal advice. Consult qualified legal counsel for jurisdiction-specific compliance requirements.*
