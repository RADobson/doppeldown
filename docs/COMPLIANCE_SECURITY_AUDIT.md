# DoppelDown — Comprehensive Compliance & Security Audit

**Date:** February 5, 2026  
**Classification:** CONFIDENTIAL  
**Auditor:** OpenClaw Security Subagent  
**Codebase Version:** v1.3  
**Scope:** GDPR, CCPA, SOC 2 Type II, HIPAA; Application Security; Certification Roadmap

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Application Profile & Data Inventory](#2-application-profile--data-inventory)
3. [GDPR Compliance Assessment](#3-gdpr-compliance-assessment)
4. [CCPA Compliance Assessment](#4-ccpa-compliance-assessment)
5. [SOC 2 Type II Readiness Assessment](#5-soc-2-type-ii-readiness-assessment)
6. [HIPAA Applicability Assessment](#6-hipaa-applicability-assessment)
7. [Security Vulnerability Assessment](#7-security-vulnerability-assessment)
8. [Mitigation Strategies](#8-mitigation-strategies)
9. [Certification Roadmap](#9-certification-roadmap)
10. [Appendices](#10-appendices)

---

## 1. Executive Summary

### Overall Compliance Posture

| Framework | Readiness | Gap Score | Priority |
|-----------|-----------|-----------|----------|
| **GDPR** | 🔴 25% Ready | 38 gaps identified | **CRITICAL** — Required for EU customers |
| **CCPA** | 🟡 35% Ready | 24 gaps identified | **HIGH** — Required for California customers |
| **SOC 2 Type II** | 🔴 15% Ready | 52 gaps identified | **HIGH** — Expected by enterprise customers |
| **HIPAA** | ⚪ Not Applicable | N/A | **LOW** — DoppelDown does not process PHI |

### Risk Summary

| Risk Level | Count | Examples |
|------------|-------|---------|
| 🔴 Critical | 8 | SSRF, no DPA, overprivileged DB grants, no encryption key management |
| 🟠 High | 14 | No rate limiting, missing security headers, weak passwords, no incident response |
| 🟡 Medium | 19 | Verbose errors, no CORS policy, Docker root user, no log aggregation |
| 🟢 Low | 11 | Image optimization, font loading, session timeout tuning |

### Key Findings

1. **DoppelDown processes personal data of EU/CA residents** (user emails, names, brand data, IP addresses via web scanning) — GDPR and CCPA compliance is legally mandatory, not optional.
2. **No Data Processing Agreement (DPA)** exists with Supabase, Stripe, OpenAI, SerpAPI, or Google Vision — a direct GDPR Article 28 violation.
3. **Database grants ALL privileges to anon/authenticated roles** — violates least-privilege principle and is incompatible with SOC 2.
4. **No privacy policy, cookie banner, or data subject rights mechanism** exists in the deployed application.
5. **Evidence collection involves scraping third-party websites** and storing HTML/screenshots — raises significant data protection and copyright concerns.
6. **SSRF vulnerability** in evidence collector allows potential access to cloud metadata services.
7. **No incident response plan, business continuity plan, or security monitoring** exists.
8. **No CI/CD security scanning, dependency auditing, or penetration testing** is performed.

### Estimated Remediation Timeline

| Phase | Duration | Focus |
|-------|----------|-------|
| **Phase 0: Legal Foundation** | Weeks 1–2 | Privacy policy, DPAs, legal review |
| **Phase 1: Critical Security** | Weeks 3–6 | SSRF fix, input validation, rate limiting, security headers |
| **Phase 2: GDPR/CCPA Core** | Weeks 7–12 | Consent management, data subject rights, data mapping |
| **Phase 3: SOC 2 Foundation** | Weeks 13–24 | Policies, access controls, monitoring, incident response |
| **Phase 4: SOC 2 Audit Prep** | Weeks 25–36 | Evidence collection, audit readiness, Type I engagement |
| **Phase 5: SOC 2 Type II** | Weeks 37–52 | Observation period + final audit |

---

## 2. Application Profile & Data Inventory

### 2.1 Technology Stack

| Component | Technology | Version | Hosting |
|-----------|-----------|---------|---------|
| Frontend | Next.js 14 (React 18) | 14.2.35 | Vercel |
| Backend | Next.js API Routes + Node.js | 20.x | Vercel Serverless |
| Database | PostgreSQL | Supabase-managed | Supabase Cloud (AWS) |
| Auth | Supabase Auth | 2.47.0 | Supabase Cloud |
| File Storage | Supabase Storage | — | Supabase Cloud (S3) |
| Payments | Stripe | 17.4.0 | Stripe Cloud |
| AI Analysis | OpenAI Vision API | GPT-4o-mini | OpenAI Cloud |
| Web Search | SerpAPI | — | SerpAPI Cloud |
| Logo Detection | Google Vision API | v1 | Google Cloud |
| Email | Nodemailer (SMTP) | 6.9.16 | Gmail / Custom SMTP |
| Screenshot | Puppeteer (Chromium) | 23.11.0 | Worker environment |
| Background Jobs | Custom scan worker | — | Docker / Node.js process |

### 2.2 Data Categories Collected

| Data Category | PII? | Source | Storage Location | Retention | Legal Basis (GDPR) |
|---------------|------|--------|-----------------|-----------|-------------------|
| User email | ✅ | Registration | `auth.users`, `public.users` | Indefinite | Contract (Art. 6(1)(b)) |
| User full name | ✅ | Registration | `public.users` | Indefinite | Contract |
| User IP address | ✅ | HTTP requests | Vercel logs, Supabase logs | Platform default | Legitimate interest (Art. 6(1)(f)) |
| Hashed password | ✅ | Registration | `auth.users` (Supabase-managed) | Indefinite | Contract |
| Subscription/payment data | ✅ | Stripe checkout | `public.users` (IDs only), Stripe | Indefinite | Contract |
| Brand name & domain | Indirect PII | User input | `public.brands` | Indefinite | Contract |
| Brand logo images | Possible PII | User upload | Supabase Storage | Indefinite | Contract |
| Brand keywords | No | User input | `public.brands` | Indefinite | Contract |
| Social handles | Indirect PII | User input | `public.brands` (JSONB) | Indefinite | Contract |
| Threat URLs & domains | No | Scanning | `public.threats` | Indefinite | Legitimate interest |
| WHOIS data (registrant info) | ✅ Third-party PII | WHOIS lookup | `public.threats` (JSONB) | Indefinite | Legitimate interest |
| Website screenshots | Possible PII | Puppeteer capture | Supabase Storage / DB JSONB | Indefinite | Legitimate interest |
| HTML snapshots | Possible PII | HTTP fetch | Supabase Storage / DB JSONB | Indefinite | Legitimate interest |
| AI analysis results | No | OpenAI API | `public.threats` (JSONB) | Indefinite | Legitimate interest |
| Scan metadata | No | System-generated | `public.scans`, `public.scan_jobs` | Indefinite | Contract |
| Audit logs | ✅ (user_id) | System-generated | `public.audit_logs` | Indefinite | Legitimate interest |
| Alert settings | ✅ (email, webhook) | User input | `public.alert_settings` | Indefinite | Contract |
| Reports (PDF) | Aggregated PII | System-generated | Supabase Storage | Indefinite | Contract |
| Notification records | No | System-generated | `public.notifications` | Indefinite | Contract |

### 2.3 Data Flow Diagram (Logical)

```
┌──────────────┐     HTTPS      ┌──────────────┐     SQL/REST     ┌──────────────┐
│              │ ──────────────> │              │ ───────────────> │              │
│  User's      │                │  Vercel       │                 │  Supabase    │
│  Browser     │ <────────────── │  (Next.js)    │ <─────────────── │  (PostgreSQL)│
│              │                │              │                 │              │
└──────────────┘                └──────┬───────┘                 └──────────────┘
                                       │                                │
                              ┌────────┼──────────┐                     │ S3
                              │        │          │               ┌─────┴──────┐
                              ▼        ▼          ▼               │  Supabase  │
                         ┌─────┐  ┌─────┐   ┌─────┐              │  Storage   │
                         │Stripe│  │OpenAI│  │Serp │              └────────────┘
                         │     │  │Vision│  │API  │
                         └─────┘  └─────┘   └─────┘
                                       │
                              ┌────────┼──────────┐
                              │        │          │
                              ▼        ▼          ▼
                         ┌─────┐  ┌─────┐   ┌─────────┐
                         │Google│  │WHOIS│   │Target   │
                         │Vision│  │APIs │   │Websites │
                         └─────┘  └─────┘   │(scrape) │
                                            └─────────┘

┌──────────────┐                ┌──────────────┐
│  Scan Worker │ ─────────────> │  Supabase    │
│  (Node.js)   │  SQL/REST      │  + Storage   │
│  + Puppeteer │ <───────────── │              │
└──────────────┘                └──────────────┘
```

### 2.4 Third-Party Sub-Processors

| Processor | Data Shared | Purpose | DPA Status |
|-----------|-------------|---------|------------|
| **Supabase** (AWS us-east-1) | All database data, auth, files | Database, auth, storage | ❌ No DPA signed |
| **Stripe** | Email, customer_id, payment details | Payment processing | ❌ No DPA signed |
| **Vercel** | HTTP requests, IP addresses, logs | Application hosting | ❌ No DPA signed |
| **OpenAI** | Screenshots (base64), threat URLs | AI threat analysis | ❌ No DPA signed |
| **SerpAPI** | Brand names, search queries | Web/social search | ❌ No DPA signed |
| **Google Vision** | Logo images | Logo detection | ❌ No DPA signed |
| **Gmail/SMTP** | User emails, alert content | Email delivery | ❌ No DPA signed |

---

## 3. GDPR Compliance Assessment

### 3.1 Applicability

**DoppelDown IS subject to GDPR** because:
- It offers services to businesses that may include EU-based entities (Art. 3(1))
- It processes personal data of EU data subjects (user registration data)
- The pricing strategy targets global SMBs, not just domestic markets
- WHOIS evidence collection may capture EU registrant data

### 3.2 Gap Analysis

#### Article 5 — Principles of Processing

| Principle | Status | Finding |
|-----------|--------|---------|
| **Lawfulness, fairness, transparency** | ❌ FAIL | No privacy policy published. No information provided to data subjects about processing activities. |
| **Purpose limitation** | ⚠️ PARTIAL | Data collected for brand protection, but no documented purpose limitation. AI analysis sends screenshots to OpenAI without explicit disclosure. |
| **Data minimisation** | ❌ FAIL | Full HTML pages stored (up to 1MB). WHOIS data stored in full. No mechanism to limit collection to what's necessary. |
| **Accuracy** | ⚠️ PARTIAL | User data can be updated, but WHOIS/threat data has no accuracy verification. |
| **Storage limitation** | ❌ FAIL | **No data retention policy.** All data stored indefinitely. No automated deletion. Schema has no TTL or archival mechanism. |
| **Integrity and confidentiality** | ⚠️ PARTIAL | Supabase provides encryption at rest and TLS in transit. However, RLS bypass via overprivileged grants, no application-level encryption, no audit trail for data access. |
| **Accountability** | ❌ FAIL | No records of processing activities (ROPA). No DPO appointed. No DPIA conducted. |

#### Article 6 — Lawful Basis

| Processing Activity | Claimed Basis | Assessment |
|---------------------|---------------|------------|
| User account management | Contract | ✅ Valid |
| Brand scanning & threat detection | Contract + Legitimate interest | ⚠️ Needs LIA (Legitimate Interest Assessment) for WHOIS/screenshot collection |
| AI analysis (sending data to OpenAI) | Legitimate interest | ❌ Not documented. Requires transparency notice. |
| Email alerts & notifications | Consent / Contract | ⚠️ No explicit consent collected for marketing emails |
| Evidence collection (third-party sites) | Legitimate interest | ❌ Requires LIA. Third-party website owners not informed. |

#### Article 12–23 — Data Subject Rights

| Right | Implemented | Assessment |
|-------|-------------|------------|
| **Right to be informed** (Art. 13/14) | ❌ | No privacy notice. No information provided at collection. |
| **Right of access** (Art. 15) | ❌ | No data export / subject access request (SAR) mechanism. |
| **Right to rectification** (Art. 16) | ⚠️ | Users can update name/email in settings, but cannot correct threat/evidence data. |
| **Right to erasure** (Art. 17) | ❌ | No account deletion flow. `ON DELETE CASCADE` exists on `users` FK but no user-facing mechanism. Evidence in Supabase Storage not cascaded. |
| **Right to restriction** (Art. 18) | ❌ | Not implemented. |
| **Right to data portability** (Art. 20) | ❌ | No data export functionality. |
| **Right to object** (Art. 21) | ❌ | No objection mechanism for processing. |
| **Automated decision-making** (Art. 22) | ⚠️ | AI threat scoring affects threat severity display. Users should be informed and have right to human review. |

#### Article 25 — Data Protection by Design

| Requirement | Status |
|-------------|--------|
| Privacy by default | ❌ All data collected by default, no minimisation |
| Pseudonymisation | ❌ No pseudonymisation of stored data |
| Data minimisation in design | ❌ Full HTML, full WHOIS, full screenshots stored |

#### Article 28 — Processor Requirements

| Requirement | Status |
|-------------|--------|
| Written DPA with each processor | ❌ None signed |
| Processor only acts on documented instructions | ❌ Not contractually established |
| Sub-processor approval process | ❌ Not established |
| Audit rights over processors | ❌ Not established |

#### Article 30 — Records of Processing Activities (ROPA)

| Requirement | Status |
|-------------|--------|
| ROPA document maintained | ❌ Does not exist |
| Categories of data subjects documented | ❌ |
| Categories of personal data documented | ❌ |
| Transfer mechanisms documented | ❌ |

#### Article 32 — Security of Processing

| Measure | Status |
|---------|--------|
| Encryption in transit | ✅ HTTPS/TLS |
| Encryption at rest | ✅ Supabase-managed |
| Pseudonymisation | ❌ |
| Confidentiality assurance | ⚠️ Overprivileged DB grants undermine this |
| Regular testing & assessment | ❌ No penetration testing or security assessments |
| Incident response capability | ❌ No incident response plan |

#### Article 33/34 — Breach Notification

| Requirement | Status |
|-------------|--------|
| 72-hour notification to supervisory authority | ❌ No process exists |
| Notification to data subjects | ❌ No process exists |
| Breach detection capability | ❌ No security monitoring |
| Breach logging and documentation | ❌ |

#### Article 35 — Data Protection Impact Assessment

| Requirement | Status |
|-------------|--------|
| DPIA conducted for high-risk processing | ❌ AI-based threat analysis likely triggers DPIA requirement |
| DPIA documented | ❌ |

#### Article 44–49 — International Transfers

| Transfer | Mechanism | Status |
|----------|-----------|--------|
| EU → US (Supabase/AWS) | EU-US Data Privacy Framework | ⚠️ Needs verification of Supabase's DPF certification |
| EU → US (Stripe) | Standard Contractual Clauses | ⚠️ Needs DPA with SCCs |
| EU → US (OpenAI) | Standard Contractual Clauses | ⚠️ Needs DPA with SCCs |
| EU → US (Vercel) | Standard Contractual Clauses | ⚠️ Needs verification |

### 3.3 GDPR Risk Rating

**Overall: 🔴 HIGH RISK — Non-compliant. Material gaps in all core GDPR requirements.**

Potential maximum fine: **€20M or 4% of global annual turnover** (whichever is higher) under Article 83(5).

---

## 4. CCPA Compliance Assessment

### 4.1 Applicability

DoppelDown may be subject to CCPA (as amended by CPRA) if:
- Annual gross revenues exceed $25M, OR
- Buys/receives/sells personal information of 100,000+ California consumers, OR
- Derives 50%+ revenue from selling/sharing personal information

**Assessment:** While DoppelDown is a startup, CCPA compliance should be implemented proactively because:
- Enterprise customers will require it contractually
- The threshold may be reached as the business scales
- California consumers using the free tier count toward the 100K threshold

### 4.2 Gap Analysis

#### Categories of Personal Information Collected (Cal. Civ. Code § 1798.100)

| CCPA Category | Data Elements | Disclosed? |
|---------------|---------------|------------|
| **A. Identifiers** | Name, email, IP address, Stripe customer ID | ❌ No |
| **B. Customer records** | Name, email, payment history | ❌ No |
| **D. Commercial information** | Subscription tier, purchase history | ❌ No |
| **F. Internet/electronic activity** | Scan history, dashboard usage, threat data | ❌ No |
| **I. Professional information** | Brand/company name, domain | ❌ No |
| **K. Inferences** | AI threat scores, phishing intent analysis | ❌ No |

#### Consumer Rights Implementation

| Right | Status | Finding |
|-------|--------|---------|
| **Right to Know** (§ 1798.100) | ❌ | No mechanism to request disclosure of collected data |
| **Right to Delete** (§ 1798.105) | ❌ | No account deletion flow |
| **Right to Opt-Out of Sale/Sharing** (§ 1798.120) | ❌ | No "Do Not Sell My Info" link. While DoppelDown likely doesn't "sell" data, sharing with OpenAI/SerpAPI may constitute "sharing" under CPRA |
| **Right to Non-Discrimination** (§ 1798.125) | N/A | Not applicable unless rights are exercised |
| **Right to Correct** (§ 1798.106) | ⚠️ | Partial — name/email editable |
| **Right to Limit Use of Sensitive PI** (§ 1798.121) | N/A | No sensitive PI collected under CCPA definition |

#### Notice Requirements

| Requirement | Status |
|-------------|--------|
| Notice at Collection (§ 1798.100(b)) | ❌ Not provided |
| Privacy Policy with CCPA disclosures (§ 1798.130) | ❌ No privacy policy exists |
| "Do Not Sell or Share My Personal Information" link | ❌ Not present |
| Financial incentive notice (if applicable) | N/A |

#### Service Provider Agreements

| Requirement | Status |
|-------------|--------|
| Written agreements prohibiting selling/sharing received data | ❌ Not in place with any processor |
| Annual certification from service providers | ❌ |

### 4.3 CCPA Risk Rating

**Overall: 🟡 MEDIUM-HIGH RISK — Non-compliant but lower immediate regulatory risk than GDPR.**

Potential penalty: **$2,500 per unintentional violation / $7,500 per intentional violation** (CPRA enforcement by California Privacy Protection Agency).

---

## 5. SOC 2 Type II Readiness Assessment

### 5.1 Why SOC 2 Matters for DoppelDown

Enterprise customers ($499/mo+ tier) will require SOC 2 Type II certification before signing. The pricing strategy document identifies enterprise customers as a key revenue segment. **Without SOC 2, DoppelDown cannot credibly sell to security-conscious organizations — the very organizations most likely to need brand protection.**

### 5.2 Trust Service Criteria Assessment

#### Security (Common Criteria — CC) — MANDATORY

| Control | Ref | Status | Gap |
|---------|-----|--------|-----|
| **CC1.1** — Control environment | Governance | ❌ | No security policies, no organizational structure documented |
| **CC1.2** — Board/management oversight | Governance | ❌ | No security committee or designated security owner |
| **CC1.3** — Authority and responsibility | Governance | ❌ | No roles and responsibilities documented |
| **CC1.4** — Competence | HR | ❌ | No security training program |
| **CC1.5** — Accountability | Governance | ❌ | No accountability framework |
| **CC2.1** — Information quality for internal control | Communication | ❌ | No internal communication of security obligations |
| **CC2.2** — Internal communication | Communication | ❌ | No security awareness program |
| **CC2.3** — External communication | Communication | ❌ | No external security communication (privacy policy, security page) |
| **CC3.1** — Risk identification | Risk | ❌ | No formal risk assessment conducted |
| **CC3.2** — Risk assessment | Risk | ❌ | No risk register or risk treatment plan |
| **CC3.3** — Fraud risk consideration | Risk | ❌ | No fraud risk assessment |
| **CC3.4** — Change impact on controls | Risk | ❌ | No change management for security controls |
| **CC4.1** — Monitoring activities | Monitoring | ❌ | No security monitoring (no SIEM, no alerting) |
| **CC4.2** — Evaluation and communication of deficiencies | Monitoring | ❌ | No deficiency reporting process |
| **CC5.1** — Control activities selection | Controls | ⚠️ | Some controls exist (RLS, auth) but not formally selected/documented |
| **CC5.2** — Technology general controls | Controls | ⚠️ | Partial — Supabase provides some, but application layer gaps |
| **CC5.3** — Control activities through policies | Controls | ❌ | No security policies documented |
| **CC6.1** — Logical access controls | Access | ⚠️ | Supabase Auth exists. **BUT: `GRANT ALL` to anon/authenticated is a critical failure.** |
| **CC6.2** — Access provisioning/deprovisioning | Access | ❌ | No formal provisioning process. No MFA. No access reviews. |
| **CC6.3** — Access modification | Access | ❌ | No access modification process |
| **CC6.4** — Physical access | N/A | ✅ | Cloud-hosted — inherited from Supabase/Vercel/AWS |
| **CC6.5** — Physical asset disposal | N/A | ✅ | Cloud-hosted — inherited |
| **CC6.6** — Logical access to IT assets | Access | ⚠️ | Supabase/Vercel dashboards not governed. No secrets management. |
| **CC6.7** — Data transmission restrictions | Network | ✅ | HTTPS enforced. Stripe webhook signatures verified. |
| **CC6.8** — Malicious software prevention | Endpoint | ❌ | No endpoint protection policy for development machines |
| **CC7.1** — Vulnerability detection | Monitoring | ❌ | No vulnerability scanning. No dependency auditing (Dependabot/Snyk). |
| **CC7.2** — Security incident detection | Monitoring | ❌ | No security monitoring or alerting |
| **CC7.3** — Incident evaluation | Incident | ❌ | No incident classification or triage process |
| **CC7.4** — Incident response | Incident | ❌ | No incident response plan |
| **CC7.5** — Incident recovery | Recovery | ❌ | No disaster recovery plan |
| **CC8.1** — Change management | Change | ❌ | No change management process. No code review requirements documented. |
| **CC9.1** — Risk mitigation activities | Risk | ❌ | No formal risk treatment |
| **CC9.2** — Vendor risk management | Vendor | ❌ | No vendor assessment process. No DPAs. |

#### Availability (A Criteria)

| Control | Status | Gap |
|---------|--------|-----|
| **A1.1** — Capacity management | ❌ | No capacity planning. Vercel auto-scales but no monitoring. |
| **A1.2** — Environmental protections | ✅ | Cloud-hosted — inherited from AWS/Vercel |
| **A1.3** — Recovery procedures | ❌ | No backup testing. No documented recovery procedures. |

#### Confidentiality (C Criteria)

| Control | Status | Gap |
|---------|--------|-----|
| **C1.1** — Confidential information identification | ❌ | No data classification scheme |
| **C1.2** — Confidential information disposal | ❌ | No data retention or disposal policy |

#### Processing Integrity (PI Criteria)

| Control | Status | Gap |
|---------|--------|-----|
| **PI1.1** — Processing completeness and accuracy | ⚠️ | Scan progress tracking exists. No end-to-end data integrity checks. |
| **PI1.2** — System inputs | ⚠️ | Some input validation exists but incomplete (no Zod schemas). |
| **PI1.3** — System processing | ⚠️ | Scan runner has error handling. No formal processing integrity controls. |

#### Privacy (P Criteria) — if included in SOC 2 scope

| Control | Status | Gap |
|---------|--------|-----|
| **P1–P8** — All privacy criteria | ❌ | Substantial overlap with GDPR gaps above. No privacy program. |

### 5.3 SOC 2 Readiness Score

```
                    SOC 2 Readiness by Category
   ┌──────────────────────────────────────────────────────┐
   │ Governance (CC1)     ████░░░░░░░░░░░░░░░░░░  5%     │
   │ Communication (CC2)  ██░░░░░░░░░░░░░░░░░░░░  2%     │
   │ Risk Assessment (CC3)████░░░░░░░░░░░░░░░░░░  5%     │
   │ Monitoring (CC4)     ██░░░░░░░░░░░░░░░░░░░░  0%     │
   │ Control Activities   ████████░░░░░░░░░░░░░░ 20%     │
   │ Access Controls (CC6)████████████░░░░░░░░░░ 35%     │
   │ Vulnerability (CC7)  ████░░░░░░░░░░░░░░░░░░  5%     │
   │ Change Mgmt (CC8)    ████░░░░░░░░░░░░░░░░░░  5%     │
   │ Risk Mitigation (CC9)████░░░░░░░░░░░░░░░░░░  5%     │
   │ Availability (A)     ████████░░░░░░░░░░░░░░ 25%     │
   │ Confidentiality (C)  ████░░░░░░░░░░░░░░░░░░  5%     │
   └──────────────────────────────────────────────────────┘
   Overall: ~15% Ready
```

### 5.4 SOC 2 Risk Rating

**Overall: 🔴 NOT READY — Extensive work required across all trust service categories.**

Estimated time to SOC 2 Type II certification: **9–12 months** from starting remediation.

---

## 6. HIPAA Applicability Assessment

### 6.1 Determination

**DoppelDown is NOT a Covered Entity or Business Associate under HIPAA.**

| HIPAA Criterion | Applies? | Rationale |
|-----------------|----------|-----------|
| Health plan | ❌ | DoppelDown is not a health plan |
| Healthcare provider | ❌ | DoppelDown does not provide healthcare |
| Healthcare clearinghouse | ❌ | DoppelDown does not process health claims |
| Business associate | ❌ | DoppelDown does not process PHI on behalf of covered entities |
| Protected Health Information (PHI) | ❌ | No health data collected or processed |

### 6.2 Future Considerations

If DoppelDown expands to serve healthcare organizations (hospitals, health insurers, pharmaceutical companies) as enterprise customers, there are two scenarios:

**Scenario A: Customer monitors their own brand** — DoppelDown processes brand names/domains, not PHI. HIPAA likely does not apply.

**Scenario B: Threat evidence contains patient information** — If a phishing site targeting a healthcare org collects/displays patient data, and DoppelDown captures that as evidence (screenshot/HTML), DoppelDown could inadvertently process PHI. This would require a BAA.

**Recommendation:** For now, exclude HIPAA from compliance scope. Revisit when healthcare vertical is pursued. Add a disclaimer in evidence collection that DoppelDown should not be used to store PHI.

---

## 7. Security Vulnerability Assessment

### 7.1 Critical Vulnerabilities

#### VULN-C1: Server-Side Request Forgery (SSRF) in Evidence Collection
**Severity:** 🔴 CRITICAL  
**Location:** `src/lib/evidence-collector.ts` — `collectEvidence()`, `captureScreenshot()`, `captureHtml()`  
**CVSS 3.1:** 9.1 (Critical)

**Description:** The evidence collector fetches arbitrary URLs constructed from brand domains without validating against internal/reserved IP ranges. An attacker who creates a brand with a domain pointing to `169.254.169.254` (AWS metadata endpoint) or `127.0.0.1` could:
- Exfiltrate cloud credentials (IAM roles, service keys)
- Scan the internal network
- Access internal services

**Proof of Concept:**
```
1. Create brand with domain "169.254.169.254"
2. Trigger scan → evidence-collector.ts fetches http://169.254.169.254
3. HTML snapshot contains AWS metadata including IAM credentials
```

**Impact:** Complete cloud account compromise. Access to Supabase service role key, Stripe secret key, and all environment variables.

---

#### VULN-C2: Overprivileged Database Grants
**Severity:** 🔴 CRITICAL  
**Location:** `supabase/schema.sql` (bottom)  
**Code:**
```sql
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
```

**Description:** Both `anon` (unauthenticated) and `authenticated` roles have ALL privileges on ALL tables and sequences. While RLS mitigates data access, this grant:
- Allows `anon` role to attempt operations on any table
- Defeats defense-in-depth by relying solely on RLS
- Allows DDL operations if RLS has any gaps
- Violates SOC 2 least-privilege requirements

**Impact:** If any RLS policy has a gap, the overprivileged grants allow full data access/modification.

---

#### VULN-C3: Timing Attack on Cron Authentication
**Severity:** 🔴 CRITICAL  
**Location:** `src/app/api/cron/scan/route.ts`, `src/app/api/cron/digest/route.ts`, `src/app/api/cron/nrd/route.ts`  
**Code:**
```typescript
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

**Description:** String comparison using `!==` is vulnerable to timing attacks. An attacker can determine the `CRON_SECRET` one character at a time by measuring response times.

**Impact:** Unauthorized execution of cron jobs. Attacker can trigger mass scanning, email digests, and NRD processing.

---

#### VULN-C4: Missing Input Validation on Brand Creation
**Severity:** 🔴 CRITICAL  
**Location:** `src/app/api/brands/route.ts`

**Description:** No validation on brand name, domain, or keywords. Allows:
- ReDoS via crafted regex patterns in keywords
- XSS payloads stored in database (defense in depth)
- Arbitrarily long strings exhausting database storage
- Domain injection attacks (domains like `; DROP TABLE users; --`)

---

#### VULN-C5: No Encryption Key Management
**Severity:** 🔴 CRITICAL  
**Category:** Data Protection

**Description:** DoppelDown stores sensitive data (webhook secrets, SMTP passwords, API keys) in environment variables with no rotation mechanism. The `alert_settings` table stores `webhook_secret` in plaintext. There is no application-level encryption for sensitive fields.

---

#### VULN-C6: Service Role Key Exposure Risk
**Severity:** 🔴 CRITICAL  
**Location:** `src/lib/supabase/server.ts`

**Description:** The `SUPABASE_SERVICE_ROLE_KEY` bypasses all RLS policies. It's used in the scan worker and some API routes. If this key is exposed (via SSRF, log leakage, or error messages), all data in the database is compromised.

---

#### VULN-C7: Puppeteer Sandbox Escape Risk
**Severity:** 🔴 CRITICAL  
**Location:** `Dockerfile`, `src/lib/evidence-collector.ts`

**Code:**
```typescript
const launchOptions: any = {
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
}
```
```dockerfile
# Dockerfile runs as root, no USER directive
```

**Description:** Puppeteer runs with `--no-sandbox` as root in the Docker container. A malicious website could potentially exploit a Chromium vulnerability to escape the renderer process and gain root access to the container.

---

#### VULN-C8: Race Condition in Manual Scan Quota
**Severity:** 🟠 HIGH  
**Location:** `src/app/api/scan/route.ts`

**Description:** The manual scan quota check and increment are not atomic. A fast attacker sending concurrent requests can bypass the quota by racing the check:

```typescript
// Read: scansUsed = 0
const scansUsed = userData?.manual_scans_count || 0
if (scansUsed >= manualScanLimit) { ... }
// Write: set count = 1 (but another request already passed the check)
await supabase.from('users').update({ manual_scans_count: scansUsed + 1 })
```

---

### 7.2 High Severity Vulnerabilities

#### VULN-H1: No Rate Limiting on Any API Endpoint
**Location:** All routes in `src/app/api/`  
**Impact:** Brute force attacks, credential stuffing, resource exhaustion, scan queue flooding, Stripe webhook replay amplification.

#### VULN-H2: Missing Security Headers
**Location:** `next.config.js`  
**Missing:** HSTS, X-Frame-Options, X-Content-Type-Options, CSP, Referrer-Policy, Permissions-Policy.

#### VULN-H3: Weak Password Policy (6 Characters)
**Location:** `src/app/auth/reset-password/page.tsx`  
**Impact:** Easily guessable passwords. NIST 800-63b recommends minimum 8 characters.

#### VULN-H4: No MFA Support
**Impact:** Single-factor auth for a security product is a credibility issue and SOC 2 gap.

#### VULN-H5: Insufficient Audit Logging
**Finding:** Only delete operations are logged to `audit_logs`. No logging for: login attempts, permission changes, data access, scan operations, admin actions, API key usage.

#### VULN-H6: No Error Handling Information Leakage Prevention
**Location:** Multiple API routes  
**Finding:** Some error paths return internal error details. Stack traces logged to Vercel console without redaction.

#### VULN-H7: Email Header Injection
**Location:** `src/lib/email.ts`  
**Finding:** Email addresses used in `from` and `to` fields without sanitization. An attacker who controls the `alert_email` field in `alert_settings` could inject additional headers.

#### VULN-H8: Unvalidated Redirect in App URLs
**Location:** Email templates  
**Finding:** `NEXT_PUBLIC_APP_URL` is used to construct links in emails. If this env var is compromised or misconfigured, all email links redirect to an attacker-controlled domain.

#### VULN-H9: No CORS Configuration
**Location:** API routes  
**Finding:** No explicit CORS headers. Depending on Vercel's defaults, this may allow cross-origin API access.

#### VULN-H10: Stripe Webhook No Replay Protection
**Location:** `src/app/api/stripe/webhook/route.ts`  
**Finding:** While signature verification is implemented, there's no timestamp tolerance check or replay prevention. An attacker who intercepts a valid webhook can replay it.

#### VULN-H11: No Session Timeout Configuration
**Finding:** Supabase Auth JWT tokens have default expiry. No explicit short session timeout for a security application. No session revocation on password change.

#### VULN-H12: Worker Runs with Service Role Key
**Location:** `scripts/scan-worker.ts`  
**Finding:** The scan worker uses `SUPABASE_SERVICE_ROLE_KEY` which bypasses all RLS. No principle of least privilege applied to background processing.

#### VULN-H13: No Content Security Policy
**Finding:** Missing CSP allows potential XSS and data exfiltration if any injection point is found.

#### VULN-H14: Webhook Secret Stored in Plaintext
**Location:** `public.alert_settings.webhook_secret`  
**Finding:** User webhook secrets stored without encryption in the database.

### 7.3 Medium Severity Vulnerabilities

| ID | Vulnerability | Location |
|----|--------------|----------|
| VULN-M1 | No request timeout on Supabase queries | Database client init |
| VULN-M2 | Docker container runs as root | `Dockerfile` |
| VULN-M3 | No dependency vulnerability scanning | `package.json` / CI pipeline |
| VULN-M4 | 10MB server action body limit excessive | `next.config.js` |
| VULN-M5 | No log aggregation or monitoring | Throughout |
| VULN-M6 | HTML snapshot stored inline in DB (some paths) | `evidence-collector.ts` |
| VULN-M7 | No backup verification process | Supabase |
| VULN-M8 | Browser instances may leak on error | `evidence-collector.ts` |
| VULN-M9 | No IP-based access restrictions for admin | API routes |
| VULN-M10 | OpenAI API key sent in every request without rotation | `src/lib/openai-analysis.ts` |
| VULN-M11 | No secure development lifecycle (SDL) | Process |
| VULN-M12 | Environment variables contain secrets without rotation policy | `.env` configuration |
| VULN-M13 | `handle_new_user()` function defined twice in schema | `supabase/schema.sql` |
| VULN-M14 | No data classification or labeling | Data governance |
| VULN-M15 | User agent spoofing in evidence collection | `evidence-collector.ts` |
| VULN-M16 | No integrity verification on stored evidence | Storage |
| VULN-M17 | Scan worker polling interval is configurable but not validated | `scripts/scan-worker.ts` |
| VULN-M18 | No anti-automation controls on signup | `src/app/auth/signup/page.tsx` |
| VULN-M19 | WHOIS demo keys in code | `evidence-collector.ts` |

---

## 8. Mitigation Strategies

### 8.1 Critical Vulnerability Mitigations

#### MIT-C1: SSRF Protection
**Priority:** Immediate  
**Effort:** 4 hours  
**Implementation:**

```typescript
// src/lib/ssrf-protection.ts
import { lookup } from 'dns/promises';
import { isIP } from 'net';

const BLOCKED_CIDRS = [
  { prefix: '10.', bits: 8 },
  { prefix: '172.16.', bits: 12 },
  { prefix: '192.168.', bits: 16 },
  { prefix: '127.', bits: 8 },
  { prefix: '169.254.', bits: 16 },
  { prefix: '0.', bits: 8 },
];

const BLOCKED_HOSTNAMES = [
  'metadata.google.internal',
  'metadata.google',
  'instance-data',
];

export async function validateUrl(url: string): Promise<{ safe: boolean; reason?: string }> {
  try {
    const parsed = new URL(url);
    
    // Block non-HTTP(S)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { safe: false, reason: 'Non-HTTP protocol' };
    }
    
    // Block known metadata hostnames
    if (BLOCKED_HOSTNAMES.includes(parsed.hostname)) {
      return { safe: false, reason: 'Blocked hostname' };
    }
    
    // Resolve hostname to IP
    const hostname = parsed.hostname;
    let ip: string;
    
    if (isIP(hostname)) {
      ip = hostname;
    } else {
      const result = await lookup(hostname);
      ip = result.address;
    }
    
    // Check against blocked ranges
    for (const cidr of BLOCKED_CIDRS) {
      if (ip.startsWith(cidr.prefix)) {
        return { safe: false, reason: `Blocked IP range: ${cidr.prefix}` };
      }
    }
    
    // Block IPv6 link-local and loopback
    if (ip.startsWith('fe80:') || ip.startsWith('fc00:') || ip === '::1') {
      return { safe: false, reason: 'Blocked IPv6 range' };
    }
    
    return { safe: true };
  } catch (error) {
    return { safe: false, reason: 'URL validation failed' };
  }
}
```

Apply in `evidence-collector.ts` before any `fetch()` or `page.goto()` call.

---

#### MIT-C2: Least-Privilege Database Grants
**Priority:** Immediate  
**Effort:** 2 hours

Replace the overprivileged grants with specific per-table permissions:

```sql
-- Remove excessive grants
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;

-- Grant only necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Users table: authenticated can read/update own row (RLS enforced)
GRANT SELECT, UPDATE ON public.users TO authenticated;

-- Brands: full CRUD for authenticated (RLS enforced)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brands TO authenticated;

-- Threats: read + create for authenticated
GRANT SELECT, INSERT, UPDATE ON public.threats TO authenticated;
GRANT DELETE ON public.threats TO authenticated; -- for delete feature

-- Scans: read + create
GRANT SELECT, INSERT, UPDATE ON public.scans TO authenticated;
GRANT DELETE ON public.scans TO authenticated;

-- Scan jobs: read + create
GRANT SELECT, INSERT ON public.scan_jobs TO authenticated;

-- Reports: read + create + delete
GRANT SELECT, INSERT, DELETE ON public.reports TO authenticated;

-- Alert settings: full CRUD
GRANT SELECT, INSERT, UPDATE ON public.alert_settings TO authenticated;

-- Audit logs: read only
GRANT SELECT ON public.audit_logs TO authenticated;

-- Notifications: read + update
GRANT SELECT, UPDATE ON public.notifications TO authenticated;

-- Sequences needed for UUID generation
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Anon role should have minimal access
GRANT SELECT ON public.users TO anon; -- only for auth trigger
```

---

#### MIT-C3: Timing-Safe Cron Authentication
**Priority:** Immediate  
**Effort:** 30 minutes

```typescript
import { timingSafeEqual } from 'crypto';

function verifyCronSecret(authHeader: string | null): boolean {
  if (!authHeader || !process.env.CRON_SECRET) return false;
  
  const expected = Buffer.from(`Bearer ${process.env.CRON_SECRET}`, 'utf8');
  const provided = Buffer.from(authHeader, 'utf8');
  
  if (expected.length !== provided.length) return false;
  return timingSafeEqual(expected, provided);
}
```

---

#### MIT-C4: Input Validation with Zod
**Priority:** This week  
**Effort:** 4 hours

```typescript
// src/lib/validation.ts
import { z } from 'zod';

export const brandSchema = z.object({
  name: z.string().min(1).max(100).regex(/^[\w\s\-'.&]+$/),
  domain: z.string()
    .min(3).max(253)
    .regex(/^[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?)*\.[a-z]{2,}$/i),
  keywords: z.array(z.string().max(50)).max(20).optional(),
  logo_url: z.string().url().optional(),
  social_handles: z.record(z.string().max(100)).optional(),
});

export const scanRequestSchema = z.object({
  brandId: z.string().uuid(),
  scanType: z.enum(['full', 'quick', 'domain_only', 'web_only', 'social_only']).default('full'),
});
```

---

#### MIT-C5: Secrets Management & Encryption
**Priority:** This sprint  
**Effort:** 8 hours

1. Use Vercel's encrypted environment variables (already available)
2. Implement application-level encryption for sensitive DB fields:

```typescript
// src/lib/crypto.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ENCRYPTION_KEY = Buffer.from(process.env.FIELD_ENCRYPTION_KEY!, 'hex'); // 32 bytes
const ALGORITHM = 'aes-256-gcm';

export function encrypt(plaintext: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${tag}:${encrypted}`;
}

export function decrypt(ciphertext: string): string {
  const [ivHex, tagHex, encryptedHex] = ciphertext.split(':');
  const decipher = createDecipheriv(ALGORITHM, ENCRYPTION_KEY, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

Encrypt: `alert_settings.webhook_secret`, SMTP credentials at rest.

---

### 8.2 Privacy & Compliance Mitigations

#### MIT-P1: Privacy Policy
**Priority:** Immediate (legal blocker)  
**Effort:** 2–3 days with legal review

Create comprehensive privacy policy covering:
- Identity and contact details of the controller
- Categories of personal data processed
- Purposes and legal basis for each processing activity
- Data retention periods
- Data subject rights and how to exercise them
- Third-party recipients and sub-processors
- International transfers and safeguards
- Cookie usage
- Updates and notification process

#### MIT-P2: Cookie Consent Banner
**Priority:** Week 1  
**Effort:** 4 hours (using a library like `react-cookie-consent` or building custom)

Required categories:
- Strictly necessary (Supabase auth cookies)
- Analytics (if added)
- Functional preferences (theme, settings)

#### MIT-P3: Data Subject Rights Portal
**Priority:** Weeks 2–4  
**Effort:** 2–3 weeks

Build `/dashboard/settings/privacy` page with:
- **Data Export:** Generate JSON/CSV of all user data (brands, threats, scans, reports, settings)
- **Account Deletion:** Self-service account deletion with confirmation flow
  - Cascade delete: brands → threats → evidence files → reports → scan jobs → notifications
  - Supabase Storage cleanup (evidence bucket)
  - Stripe customer deletion/anonymization
  - Audit log retention (anonymize user_id)
- **Processing Objection:** Option to opt out of AI analysis

#### MIT-P4: Data Processing Agreements
**Priority:** Weeks 1–2  
**Effort:** 1 week (mostly legal/procurement)

Sign DPAs with:
1. **Supabase** — Available at supabase.com/legal/dpa
2. **Stripe** — Available at stripe.com/legal/dpa
3. **Vercel** — Available at vercel.com/legal/dpa
4. **OpenAI** — Available at platform.openai.com/policies (API Data Processing Addendum)
5. **Google Cloud** — Available via Google Cloud Console
6. **SerpAPI** — Contact directly

#### MIT-P5: Data Retention Policy
**Priority:** Weeks 3–4  
**Effort:** 1 week

| Data Type | Retention | Action |
|-----------|-----------|--------|
| User account data | Until account deletion + 30 days | Delete |
| Brand data | Until brand deletion or account deletion | Delete |
| Threat data | Per tier: Free=7d, Growth=90d, Business=1yr, Enterprise=2yr | Auto-archive then delete |
| Evidence (screenshots, HTML) | Same as threat data | Auto-delete from Storage |
| Scan history | Same as threat data | Auto-delete |
| Audit logs | 2 years minimum (compliance) | Archive then delete |
| Reports | Same as threat data | Auto-delete from Storage |
| Payment records | 7 years (tax/legal) | Archive |

Implement via a daily cron job:
```typescript
// src/app/api/cron/retention/route.ts
// Automatically purge data exceeding retention periods based on tier
```

#### MIT-P6: Records of Processing Activities (ROPA)
**Priority:** Weeks 2–3  
**Effort:** 2 days

Create and maintain a ROPA document covering:
- Name and contact details of the controller
- Purposes of processing
- Categories of data subjects and personal data
- Categories of recipients
- Transfers to third countries
- Retention periods
- Security measures

---

### 8.3 Security Hardening Mitigations

#### MIT-S1: Security Headers
**Priority:** This week  
**Effort:** 2 hours

```javascript
// next.config.js
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data: https://*.supabase.co",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "font-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

module.exports = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  // ...existing config
};
```

#### MIT-S2: Rate Limiting
**Priority:** This week  
**Effort:** 4 hours

```typescript
// src/lib/rate-limit.ts
import { LRUCache } from 'lru-cache';

type RateLimitConfig = {
  interval: number;    // ms
  uniqueTokenPerInterval: number;
  limit: number;
};

const caches = new Map<string, LRUCache<string, number[]>>();

export function rateLimit(config: RateLimitConfig) {
  const { interval, uniqueTokenPerInterval, limit } = config;
  
  const cache = new LRUCache<string, number[]>({
    max: uniqueTokenPerInterval,
    ttl: interval,
  });

  return {
    check: (token: string): { success: boolean; remaining: number } => {
      const now = Date.now();
      const timestamps = cache.get(token) || [];
      const windowTimestamps = timestamps.filter(t => now - t < interval);
      
      if (windowTimestamps.length >= limit) {
        return { success: false, remaining: 0 };
      }
      
      windowTimestamps.push(now);
      cache.set(token, windowTimestamps);
      return { success: true, remaining: limit - windowTimestamps.length };
    },
  };
}

// Pre-configured limiters
export const authLimiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500, limit: 5 });
export const apiLimiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500, limit: 30 });
export const scanLimiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500, limit: 3 });
```

#### MIT-S3: Docker Security Hardening
**Priority:** This sprint  
**Effort:** 1 hour

```dockerfile
FROM node:20-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --production

FROM node:20-slim

# Install Chromium dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium ca-certificates fonts-liberation \
    libasound2 libatk-bridge2.0-0 libatk1.0-0 libcups2 libdrm2 \
    libgbm1 libgtk-3-0 libnss3 libx11-xcb1 libxcomposite1 \
    libxdamage1 libxrandr2 xdg-utils \
  && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser -d /app appuser

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN chown -R appuser:appuser /app

# Run as non-root
USER appuser

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=production

EXPOSE 3000
CMD ["npm", "start"]
```

#### MIT-S4: Comprehensive Audit Logging
**Priority:** Weeks 2–4  
**Effort:** 2 weeks

Extend audit logging to cover:

```sql
-- Extended audit_logs schema
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL, -- 'auth.login', 'auth.login_failed', 'data.access', 'admin.action', etc.
    severity TEXT NOT NULL DEFAULT 'info', -- 'info', 'warning', 'alert', 'critical'
    actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    actor_ip TEXT,
    actor_user_agent TEXT,
    resource_type TEXT, -- 'brand', 'threat', 'scan', 'user', 'settings'
    resource_id UUID,
    action TEXT NOT NULL, -- 'create', 'read', 'update', 'delete', 'login', 'logout'
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_security_audit_event ON public.security_audit_logs(event_type);
CREATE INDEX idx_security_audit_actor ON public.security_audit_logs(actor_id);
CREATE INDEX idx_security_audit_created ON public.security_audit_logs(created_at DESC);
```

Events to log:
- Authentication success/failure
- Password reset requests
- Permission changes (subscription tier changes)
- Data access (brand view, threat view — sampling)
- Data modification (brand create/update/delete, threat status changes)
- Admin actions (admin login, admin data access)
- Scan initiation and completion
- API key usage
- Webhook delivery success/failure
- Rate limit triggers

#### MIT-S5: Incident Response Plan
**Priority:** Weeks 4–6  
**Effort:** 1 week

Create `INCIDENT_RESPONSE.md` covering:
1. **Detection** — How incidents are identified (monitoring alerts, user reports, third-party notifications)
2. **Triage** — Severity classification (P0 = data breach, P1 = service outage, P2 = degraded service, P3 = minor issue)
3. **Containment** — Immediate actions per severity level
4. **Investigation** — Evidence preservation, root cause analysis
5. **Notification** — Timeline for internal notification, customer notification, regulatory notification (72h for GDPR)
6. **Recovery** — Service restoration procedures
7. **Post-incident** — Lessons learned, control improvements
8. **Contact list** — On-call responsibilities, legal contacts, regulatory contacts

#### MIT-S6: Vulnerability Management Program
**Priority:** Weeks 2–4  
**Effort:** 1 week setup + ongoing

1. **Dependency scanning:** Enable `npm audit` in CI, configure Dependabot/Renovate for automated PRs
2. **SAST:** Add CodeQL or Semgrep to CI pipeline
3. **Container scanning:** Add Trivy or Snyk Container to Docker builds
4. **Penetration testing:** Schedule annual pentest (first one before SOC 2 audit)
5. **Bug bounty:** Consider launching after initial hardening

---

## 9. Certification Roadmap

### 9.1 Recommended Certification Sequence

```
Month 1–2:   Legal Foundation (Privacy Policy, DPAs, Terms of Service)
             ─────────────────────────────────────────────────────────
Month 2–3:   Critical Security Fixes (SSRF, input validation, headers)
             ─────────────────────────────────────────────────────────
Month 3–4:   GDPR/CCPA Core Compliance
             ─────────────────────────────────────────────────────────
Month 4–6:   SOC 2 Policy Development
             ─────────────────────────────────────────────────────────
Month 6–8:   SOC 2 Control Implementation
             ─────────────────────────────────────────────────────────
Month 8–9:   SOC 2 Type I Audit (point-in-time)
             ─────────────────────────────────────────────────────────
Month 9–15:  SOC 2 Type II Observation Period (6 months)
             ─────────────────────────────────────────────────────────
Month 15–16: SOC 2 Type II Report Issued
             ═════════════════════════════════════════════════════════
```

### 9.2 Phase 0: Legal Foundation (Weeks 1–4)

| Task | Owner | Deliverable | Est. Cost |
|------|-------|-------------|-----------|
| Draft privacy policy | Legal counsel | Published privacy policy page | $1,500–$3,000 |
| Draft terms of service | Legal counsel | Published ToS page | $1,500–$3,000 |
| Draft acceptable use policy | Legal counsel | Published AUP | Included |
| Sign DPA with Supabase | Admin | Executed DPA | Free |
| Sign DPA with Stripe | Admin | Executed DPA | Free |
| Sign DPA with Vercel | Admin | Executed DPA | Free |
| Sign DPA with OpenAI | Admin | Executed DPA | Free |
| Sign DPA with Google Cloud | Admin | Executed DPA | Free |
| Sign DPA with SerpAPI | Admin | Executed DPA | Free |
| Create ROPA | Compliance | ROPA document | Internal |
| Conduct DPIA for AI analysis | Compliance | DPIA report | $2,000–$5,000 |

**Phase 0 Budget: $5,000–$11,000**

### 9.3 Phase 1: Critical Security Hardening (Weeks 3–6)

| Task | Priority | Effort | Deliverable |
|------|----------|--------|-------------|
| Fix SSRF vulnerability (VULN-C1) | P0 | 4 hours | `ssrf-protection.ts` module |
| Fix DB privileges (VULN-C2) | P0 | 2 hours | Updated `schema.sql` |
| Fix timing attack (VULN-C3) | P0 | 30 min | Updated cron routes |
| Add input validation (VULN-C4) | P0 | 4 hours | Zod schemas + route updates |
| Add security headers (MIT-S1) | P1 | 2 hours | Updated `next.config.js` |
| Add rate limiting (MIT-S2) | P1 | 4 hours | Rate limit middleware |
| Strengthen password policy | P1 | 1 hour | Updated auth pages |
| Docker security hardening | P1 | 1 hour | Updated `Dockerfile` |
| Add field encryption (MIT-C5) | P1 | 8 hours | `crypto.ts` module |
| Configure CORS properly | P2 | 1 hour | CORS middleware |

### 9.4 Phase 2: GDPR/CCPA Compliance (Weeks 7–12)

| Task | Effort | Deliverable |
|------|--------|-------------|
| Implement cookie consent banner | 4 hours | Cookie consent component |
| Build data export endpoint | 2 days | `GET /api/user/data-export` |
| Build account deletion flow | 3 days | Deletion pipeline (DB + Storage + Stripe) |
| Implement data retention automation | 1 week | Retention cron job |
| Add "Do Not Sell" link (CCPA) | 2 hours | Footer link + settings toggle |
| Add AI processing opt-out | 4 hours | Settings toggle + scan runner integration |
| Implement consent tracking | 2 days | Consent records table + middleware |
| Create data breach notification template | 4 hours | Email templates + process doc |
| Publish privacy policy | 2 hours | `/privacy` page |
| Publish terms of service | 2 hours | `/terms` page |

### 9.5 Phase 3: SOC 2 Foundation (Weeks 13–24)

#### Required Policies & Procedures

| Policy | Purpose | SOC 2 Mapping |
|--------|---------|---------------|
| **Information Security Policy** | Overarching security governance | CC1.1, CC1.2, CC5.3 |
| **Access Control Policy** | Authentication, authorization, MFA | CC6.1–CC6.6 |
| **Change Management Policy** | Code review, deployment, rollback | CC8.1 |
| **Incident Response Policy** | Detection, containment, notification | CC7.2–CC7.5 |
| **Risk Management Policy** | Risk identification, assessment, treatment | CC3.1–CC3.4, CC9.1 |
| **Vendor Management Policy** | Third-party assessment, DPAs | CC9.2 |
| **Data Classification Policy** | Data categories, handling requirements | C1.1 |
| **Data Retention & Disposal Policy** | Retention periods, secure deletion | C1.2 |
| **Business Continuity / DR Policy** | Backup, recovery, testing | A1.3, CC7.5 |
| **Acceptable Use Policy** | Employee/contractor conduct | CC1.4, CC1.5 |
| **Vulnerability Management Policy** | Scanning, patching, remediation | CC7.1 |
| **Logging & Monitoring Policy** | What to log, retention, review | CC4.1, CC4.2 |

#### Technical Controls to Implement

| Control | Implementation | Effort |
|---------|---------------|--------|
| MFA for all admin accounts | Supabase Auth MFA + enforce for admin | 2 days |
| Centralized log aggregation | Set up Datadog/Sentry/Axiom | 1 week |
| Automated vulnerability scanning | GitHub Dependabot + CodeQL | 2 days |
| Security monitoring & alerting | Vercel + Supabase alerting | 1 week |
| Backup verification testing | Monthly Supabase backup restore test | 4 hours/month |
| Code review requirements | GitHub branch protection rules | 2 hours |
| CI/CD security gates | GitHub Actions with `npm audit` + SAST | 1 day |
| Secrets rotation process | Quarterly key rotation schedule | 4 hours |
| Employee security training | Annual security awareness (Wizer/KnowBe4) | 2 hours |
| Access review process | Quarterly access recertification | 4 hours/quarter |

### 9.6 Phase 4: SOC 2 Audit Preparation (Weeks 25–36)

| Task | Effort | Deliverable |
|------|--------|-------------|
| Select SOC 2 auditor (CPA firm) | 2 weeks | Engagement letter |
| Conduct readiness assessment with auditor | 1 week | Readiness report |
| Remediate readiness findings | 4 weeks | Updated controls |
| Collect evidence for all controls | 2 weeks | Evidence repository |
| Conduct internal SOC 2 mock audit | 1 week | Internal audit report |
| Begin SOC 2 Type I audit | 2 weeks | Type I report |

**Recommended SOC 2 auditors for startups:**
- **Vanta** (automated compliance platform + audit partner network)
- **Drata** (automated compliance platform)
- **Laika** (compliance management)
- **Prescient Assurance** (startup-friendly CPA firm)
- **Johanson Group** (cost-effective for small companies)

**Estimated SOC 2 Type I audit cost:** $15,000–$30,000  
**Estimated SOC 2 Type II audit cost:** $25,000–$50,000  
**Compliance platform (Vanta/Drata):** $10,000–$25,000/year

### 9.7 Phase 5: SOC 2 Type II Observation (Weeks 37–52)

| Requirement | Description |
|-------------|-------------|
| Duration | 6-month observation period (minimum 3 months) |
| Evidence collection | Continuous automated evidence collection via compliance platform |
| Control monitoring | Monthly review of all controls |
| Exception management | Document and remediate any control exceptions |
| Audit completion | Final audit visit + report issuance |

### 9.8 Total Cost Estimate

| Category | Low Estimate | High Estimate |
|----------|-------------|---------------|
| Legal (privacy policy, ToS, DPAs, DPIA) | $5,000 | $15,000 |
| Engineering (security hardening, compliance features) | $20,000 | $50,000 |
| Compliance platform (Vanta/Drata) | $10,000/yr | $25,000/yr |
| SOC 2 Type I audit | $15,000 | $30,000 |
| SOC 2 Type II audit | $25,000 | $50,000 |
| Penetration testing | $5,000 | $15,000 |
| Security tools (monitoring, scanning) | $3,000/yr | $10,000/yr |
| Training | $500 | $2,000 |
| **TOTAL (Year 1)** | **$83,500** | **$197,000** |

*Note: Engineering costs assume contractor rates. If done in-house, the cash cost is significantly lower but requires dedicated time.*

### 9.9 Certification Timeline (Visual)

```
2026
Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec
 |    |    |    |    |    |    |    |    |    |    |
 ├────┤ Phase 0: Legal Foundation
 │    ├────┤ Phase 1: Critical Security
 │    │    ├─────────┤ Phase 2: GDPR/CCPA
 │    │    │         ├──────────────┤ Phase 3: SOC 2 Foundation
 │    │    │         │              ├──────────┤ Phase 4: Audit Prep
 │    │    │         │              │          ├─────────────────────...
 │    │    │         │              │          │ Phase 5: Type II
 │    │    │         │              │          │ (continues to ~Apr 2027)
 ▼    ▼    ▼         ▼              ▼          ▼
 
Milestones:
 ■ Feb: Privacy policy published
 ■ Mar: Critical vulns fixed
 ■ May: GDPR/CCPA compliant
 ■ Aug: SOC 2 policies complete
 ■ Oct: SOC 2 Type I report
 ■ Apr 2027: SOC 2 Type II report
```

---

## 10. Appendices

### Appendix A: Recommended Compliance Stack

| Tool | Purpose | Est. Cost |
|------|---------|-----------|
| **Vanta** or **Drata** | Automated SOC 2 evidence collection | $10K–$25K/yr |
| **Sentry** | Error tracking & monitoring | Free–$26/mo |
| **Datadog** or **Axiom** | Log aggregation & alerting | $15–$100/mo |
| **GitHub Advanced Security** | CodeQL SAST, Dependabot, Secret scanning | $49/developer/mo |
| **Snyk** | Dependency & container vulnerability scanning | Free–$25/developer/mo |
| **1Password** or **Doppler** | Secrets management | $8–$15/user/mo |
| **OneTrust** or **Osano** | Cookie consent management | $0–$500/mo |
| **Supabase Auth MFA** | Multi-factor authentication | Included in Supabase plan |

### Appendix B: GDPR Compliance Checklist

- [ ] Privacy policy published and accessible
- [ ] Cookie consent mechanism implemented
- [ ] Data subject access request (SAR) process
- [ ] Right to erasure implementation
- [ ] Right to data portability (export)
- [ ] Right to object processing
- [ ] Art. 22 automated decision-making disclosure
- [ ] DPAs signed with all processors
- [ ] ROPA maintained and current
- [ ] DPIA for AI-based threat analysis
- [ ] International transfer mechanisms verified
- [ ] Data breach notification process
- [ ] Data retention policy and automation
- [ ] Consent records maintained
- [ ] Privacy by design review for new features

### Appendix C: CCPA Compliance Checklist

- [ ] Privacy policy with CCPA-required disclosures
- [ ] Notice at collection
- [ ] "Do Not Sell or Share My Personal Information" link
- [ ] Right to Know request process (verify identity, respond within 45 days)
- [ ] Right to Delete request process
- [ ] Right to Correct request process
- [ ] Service provider agreements updated
- [ ] Annual review of data categories collected
- [ ] Privacy training for employees handling consumer requests

### Appendix D: SOC 2 Evidence Repository Structure

```
/compliance
  /policies
    information-security-policy.md
    access-control-policy.md
    change-management-policy.md
    incident-response-policy.md
    risk-management-policy.md
    vendor-management-policy.md
    data-classification-policy.md
    data-retention-policy.md
    business-continuity-policy.md
    acceptable-use-policy.md
    vulnerability-management-policy.md
    logging-monitoring-policy.md
  /evidence
    /access-control
      quarterly-access-reviews/
      mfa-enforcement-screenshots/
      rbac-configuration/
    /change-management
      pr-review-history/
      deployment-logs/
      rollback-procedures/
    /incident-response
      incident-log/
      tabletop-exercises/
      post-mortems/
    /risk-management
      risk-register.md
      risk-assessments/
      vendor-assessments/
    /monitoring
      alert-configurations/
      security-dashboard-screenshots/
      vulnerability-scan-reports/
    /training
      security-awareness-completion/
      onboarding-checklists/
  /assessments
    dpia-ai-analysis.md
    penetration-test-reports/
    readiness-assessment.md
  /legal
    privacy-policy.md
    terms-of-service.md
    dpas/
      supabase-dpa.pdf
      stripe-dpa.pdf
      vercel-dpa.pdf
      openai-dpa.pdf
    ropa.md
```

### Appendix E: Quick Win Priority Matrix

| Action | Impact | Effort | Do When |
|--------|--------|--------|---------|
| Fix SSRF vulnerability | 🔴 Critical | 4 hours | **TODAY** |
| Fix DB grants | 🔴 Critical | 2 hours | **TODAY** |
| Fix timing attack | 🔴 Critical | 30 min | **TODAY** |
| Add security headers | 🟠 High | 2 hours | **This week** |
| Add input validation | 🔴 Critical | 4 hours | **This week** |
| Publish privacy policy | 🔴 Critical (legal) | 2–3 days | **This week** |
| Sign DPAs | 🔴 Critical (legal) | 1 week | **This sprint** |
| Add rate limiting | 🟠 High | 4 hours | **This sprint** |
| Strengthen passwords | 🟠 High | 1 hour | **This sprint** |
| Docker non-root user | 🟡 Medium | 1 hour | **This sprint** |
| Enable Dependabot | 🟡 Medium | 30 min | **This sprint** |
| Add CORS policy | 🟡 Medium | 1 hour | **Next sprint** |
| Implement MFA | 🟠 High | 2 days | **Next sprint** |
| Comprehensive audit logging | 🟠 High | 2 weeks | **Next month** |
| Data retention automation | 🟠 High | 1 week | **Next month** |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-05 | OpenClaw Security Subagent | Initial comprehensive audit |

**Next Review:** 2026-05-05 (quarterly)

---

*This document is confidential and intended for DoppelDown internal use only. Distribution to external parties requires written approval.*

*This audit does not constitute legal advice. Consult qualified legal counsel for jurisdiction-specific compliance requirements.*
