# DoppelDown — Disaster Recovery & Business Continuity Plan

**Document Owner:** DoppelDown Engineering  
**Version:** 1.0  
**Created:** 2026-02-05  
**Next Review:** 2026-05-05 (quarterly)  
**Classification:** CONFIDENTIAL — Internal Use Only

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Business Impact Analysis](#3-business-impact-analysis)
4. [Recovery Objectives](#4-recovery-objectives)
5. [Data Backup Strategy](#5-data-backup-strategy)
6. [System Failover Architecture](#6-system-failover-architecture)
7. [Incident Response Procedures](#7-incident-response-procedures)
8. [Disaster Recovery Scenarios](#8-disaster-recovery-scenarios)
9. [Communication Plan](#9-communication-plan)
10. [Testing & Drills](#10-testing--drills)
11. [Roles & Responsibilities](#11-roles--responsibilities)
12. [Compliance & Regulatory](#12-compliance--regulatory)
13. [Runbooks](#13-runbooks)
14. [Appendices](#14-appendices)

---

## 1. Executive Summary

DoppelDown is a brand protection and phishing detection SaaS platform. This Disaster Recovery (DR) and Business Continuity Plan (BCP) ensures that DoppelDown can maintain operations, recover from disruptions, and protect customer data under all foreseeable failure scenarios.

### Scope

This plan covers:
- **Web Application** (Next.js on Vercel)
- **Database** (PostgreSQL on Supabase)
- **Scan Worker** (Node.js on Oracle Cloud VPS, managed by PM2)
- **Scan Job Queue** (PostgreSQL-backed queue in Supabase)
- **Payment Processing** (Stripe integration)
- **Email Alerts** (Nodemailer-based transactional email)
- **Evidence Storage** (screenshots, WHOIS data, HTML snapshots)
- **Cron Jobs** (Vercel crons for scheduled scans, digests, NRD monitoring)

### Key Metrics

| Metric | Target |
|--------|--------|
| **RTO** (Recovery Time Objective) | 4 hours (critical), 24 hours (full) |
| **RPO** (Recovery Point Objective) | 1 hour (database), 24 hours (evidence) |
| **MTTR** (Mean Time to Recovery) | < 2 hours for P1 incidents |
| **Availability Target** | 99.9% (8.76 hours downtime/year) |
| **DR Test Frequency** | Quarterly |

---

## 2. System Architecture Overview

### Component Map

```
┌──────────────────────────────────────────────────────────────┐
│                        INTERNET                               │
│                            │                                  │
│                   ┌────────┴────────┐                        │
│                   │   Cloudflare    │  DNS / CDN / DDoS       │
│                   │     (future)    │  Protection             │
│                   └────────┬────────┘                        │
│                            │                                  │
│            ┌───────────────┼───────────────┐                 │
│            │               │               │                 │
│    ┌───────┴───────┐ ┌────┴─────┐ ┌──────┴──────┐         │
│    │   Vercel      │ │ Supabase │ │   Stripe    │         │
│    │  (Next.js     │ │  (Postgres│ │  (Payments) │         │
│    │   App +       │ │  + Auth + │ │             │         │
│    │   Cron Jobs)  │ │   RLS)   │ │             │         │
│    └───────┬───────┘ └────┬─────┘ └─────────────┘         │
│            │               │                                  │
│            │    ┌──────────┴──────────┐                      │
│            │    │   Oracle Cloud VPS  │                      │
│            │    │  159.13.34.62       │                      │
│            │    │  (Scan Worker +     │                      │
│            │    │   Puppeteer/Chrome) │                      │
│            │    │  PM2 managed        │                      │
│            │    └─────────────────────┘                      │
│            │                                                  │
│    ┌───────┴───────────────┐                                 │
│    │  Email Provider       │                                 │
│    │  (Nodemailer/SMTP)    │                                 │
│    └───────────────────────┘                                 │
└──────────────────────────────────────────────────────────────┘
```

### Component Dependencies

| Component | Provider | Region | Criticality | Dependencies |
|-----------|----------|--------|-------------|--------------|
| Web Application | Vercel | Global (Edge) | **Critical** | Supabase, Stripe |
| Database (PostgreSQL) | Supabase | Configured region | **Critical** | — |
| Authentication | Supabase Auth | Configured region | **Critical** | Database |
| Scan Worker | Oracle Cloud VPS | AU region | **High** | Supabase, DNS resolvers |
| Job Queue | Supabase (scan_jobs) | Configured region | **High** | Database |
| Payments | Stripe | Global | **High** | Webhooks → Vercel |
| Email Alerts | SMTP provider | Global | **Medium** | SMTP credentials |
| Evidence Storage | Supabase (inline) | Configured region | **Medium** | Database |
| Cron Scheduler | Vercel Crons | Global | **Medium** | Web Application |
| DNS | Domain registrar | Global | **Critical** | — |

### Data Classification

| Data Type | Classification | Retention | Backup Priority |
|-----------|---------------|-----------|-----------------|
| User credentials (auth) | **Restricted** | Account lifetime | Critical |
| User profile & subscription | **Confidential** | Account lifetime + 30 days | Critical |
| Brand configurations | **Confidential** | Account lifetime | Critical |
| Threat detection results | **Confidential** | Per tier (7d–2yr) | High |
| Scan job history | **Internal** | 90 days | Medium |
| Evidence (screenshots, WHOIS) | **Confidential** | Per tier retention | High |
| Reports (generated) | **Confidential** | Per tier retention | Medium |
| Alert settings | **Internal** | Account lifetime | Medium |
| Audit logs | **Restricted** | 2 years minimum | High |
| Payment data (Stripe refs only) | **Restricted** | 7 years (tax) | Critical |

---

## 3. Business Impact Analysis

### Service Degradation Levels

| Level | Definition | Impact | Tolerance |
|-------|-----------|--------|-----------|
| **L0 — Total Outage** | All services unavailable | No customers can access platform, no scans run, no alerts sent | ≤ 4 hours |
| **L1 — Critical Degradation** | Auth/database down but web serves cached content | Customers can't log in or view threats; scans halt | ≤ 2 hours |
| **L2 — Partial Degradation** | Scan worker down or slow | Existing data accessible; new scans delayed | ≤ 8 hours |
| **L3 — Minor Degradation** | Email alerts failing, crons delayed | Customers can use dashboard; alerts delayed | ≤ 24 hours |
| **L4 — Cosmetic** | Performance degradation, UI issues | Full functionality at reduced speed | ≤ 72 hours |

### Revenue Impact (Based on Proposed Pricing)

| Downtime Duration | Estimated Revenue Impact | Customer Trust Impact |
|-------------------|-------------------------|----------------------|
| < 1 hour | Negligible | Low (if communicated) |
| 1–4 hours | $50–$500 (depending on customer base) | Medium |
| 4–24 hours | $500–$2,000 + potential churn | High |
| > 24 hours | $2,000+ + significant churn risk | Critical |
| Data loss event | Potentially business-ending | Catastrophic |

### Critical Business Functions

| Function | Maximum Tolerable Downtime | Priority |
|----------|---------------------------|----------|
| User authentication & dashboard access | 2 hours | P1 |
| Real-time threat visibility | 4 hours | P1 |
| Automated scan execution | 8 hours | P2 |
| Alert/notification delivery | 12 hours | P2 |
| New user signups & payments | 4 hours | P1 |
| Report generation | 24 hours | P3 |
| Cron-scheduled tasks | 24 hours | P3 |

---

## 4. Recovery Objectives

### RTO/RPO by Component

| Component | RTO | RPO | Justification |
|-----------|-----|-----|---------------|
| **Database (Supabase)** | 1 hour | 1 hour | Supabase PITR; core of all operations |
| **Web Application (Vercel)** | 30 min | 0 (stateless) | Redeploy from Git; no state |
| **Scan Worker (Oracle VPS)** | 4 hours | 0 (stateless process) | PM2 auto-restarts; manual VPS rebuild if needed |
| **Authentication (Supabase Auth)** | 1 hour | 1 hour | Coupled to database recovery |
| **Stripe Integration** | 30 min | 0 (Stripe-managed) | Re-verify webhook endpoint |
| **Email System** | 8 hours | N/A | Degraded mode acceptable |
| **Evidence Data** | 24 hours | 24 hours | Can be re-scanned; lower priority |
| **DNS** | 1 hour | N/A | TTL-dependent; pre-configure low TTL |

### Recovery Priority Tiers

```
┌─────────────────────────────────────────────────────────────┐
│ TIER 1 — Restore within 1 hour (Business-critical)          │
│   ✦ Database (Supabase PostgreSQL)                          │
│   ✦ Authentication system                                    │
│   ✦ DNS resolution                                           │
│   ✦ Payment processing (Stripe webhooks)                     │
├─────────────────────────────────────────────────────────────┤
│ TIER 2 — Restore within 4 hours (Operations-critical)        │
│   ✦ Web application (Vercel deployment)                      │
│   ✦ Scan worker (Oracle VPS)                                 │
│   ✦ Job queue processing                                     │
├─────────────────────────────────────────────────────────────┤
│ TIER 3 — Restore within 24 hours (Important)                 │
│   ✦ Email alert delivery                                     │
│   ✦ Scheduled cron jobs                                      │
│   ✦ Report generation                                        │
│   ✦ NRD monitoring                                           │
├─────────────────────────────────────────────────────────────┤
│ TIER 4 — Restore within 72 hours (Non-critical)              │
│   ✦ Performance monitoring                                   │
│   ✦ Analytics                                                │
│   ✦ Historical evidence reconstruction                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Data Backup Strategy

### 5.1 Database Backups (Supabase PostgreSQL)

#### Automatic Backups

| Backup Type | Frequency | Retention | Method |
|-------------|-----------|-----------|--------|
| **Supabase Daily Backups** | Daily (automatic) | 7 days (Free), 30 days (Pro+) | Supabase-managed |
| **Point-in-Time Recovery** | Continuous WAL | 7 days (Pro plan) | Supabase PITR |
| **Manual Snapshots** | Before major deployments | 90 days | `pg_dump` to encrypted storage |
| **Off-site Exports** | Weekly | 90 days | `pg_dump` → encrypted → object storage |

#### Recommended Supabase Plan

> **Action Required:** Upgrade to Supabase Pro plan ($25/mo) to enable:
> - Point-in-Time Recovery (PITR) — continuous WAL archiving
> - 30-day backup retention (vs. 7 days on Free)
> - Daily automated backups
> - 8GB database size limit (vs. 500MB Free)

#### Manual Backup Procedure

```bash
# Weekly off-site backup script (run on Oracle VPS or dedicated backup host)
#!/bin/bash
set -euo pipefail

BACKUP_DATE=$(date +%Y-%m-%d_%H%M)
BACKUP_DIR="/backups/doppeldown"
SUPABASE_DB_URL="${DATABASE_URL}"  # Connection string from Supabase dashboard
RETENTION_DAYS=90

mkdir -p "${BACKUP_DIR}"

# Dump database
pg_dump "${SUPABASE_DB_URL}" \
  --format=custom \
  --compress=9 \
  --no-owner \
  --no-privileges \
  --file="${BACKUP_DIR}/doppeldown_${BACKUP_DATE}.dump"

# Encrypt backup
gpg --symmetric --cipher-algo AES256 \
  --passphrase-file /root/.backup-passphrase \
  "${BACKUP_DIR}/doppeldown_${BACKUP_DATE}.dump"

# Remove unencrypted dump
rm -f "${BACKUP_DIR}/doppeldown_${BACKUP_DATE}.dump"

# Upload to off-site storage (e.g., Backblaze B2, AWS S3, or separate cloud)
# rclone copy "${BACKUP_DIR}/doppeldown_${BACKUP_DATE}.dump.gpg" remote:doppeldown-backups/

# Prune old backups
find "${BACKUP_DIR}" -name "*.dump.gpg" -mtime +${RETENTION_DAYS} -delete

echo "Backup completed: doppeldown_${BACKUP_DATE}.dump.gpg"
```

#### Backup Verification

Backups must be verified monthly:

```bash
# Monthly backup restore test
#!/bin/bash
set -euo pipefail

LATEST_BACKUP=$(ls -t /backups/doppeldown/*.dump.gpg | head -1)
TEST_DB="doppeldown_restore_test"

# Decrypt
gpg --decrypt --passphrase-file /root/.backup-passphrase \
  "${LATEST_BACKUP}" > /tmp/restore_test.dump

# Restore to test database
createdb "${TEST_DB}" || true
pg_restore --dbname="${TEST_DB}" --no-owner /tmp/restore_test.dump

# Verify key tables
psql "${TEST_DB}" -c "SELECT COUNT(*) as users FROM public.users;"
psql "${TEST_DB}" -c "SELECT COUNT(*) as brands FROM public.brands;"
psql "${TEST_DB}" -c "SELECT COUNT(*) as threats FROM public.threats;"
psql "${TEST_DB}" -c "SELECT COUNT(*) as scans FROM public.scans;"

# Cleanup
dropdb "${TEST_DB}"
rm -f /tmp/restore_test.dump

echo "Backup verification PASSED"
```

### 5.2 Application Code Backups

| Asset | Location | Backup Method | Frequency |
|-------|----------|---------------|-----------|
| Application source | GitHub (private repo) | Git (distributed) | Every push |
| Environment variables | Vercel dashboard | Encrypted export → password manager | On change |
| Worker config | Oracle VPS `/home/ubuntu/doppeldown-worker` | Git + PM2 ecosystem config | Every deploy |
| Infrastructure config | Docker Compose, Vercel JSON | Git-versioned | Every change |
| SSL certificates | Auto-managed (Vercel/Let's Encrypt) | N/A | Auto-renewed |

#### Critical Secrets Inventory

These must be backed up in a secure password manager (e.g., 1Password, Bitwarden):

| Secret | Location | Rotation Schedule |
|--------|----------|-------------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel + Worker env | On compromise only |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel env | On compromise only |
| `STRIPE_SECRET_KEY` | Vercel env | Annually |
| `STRIPE_WEBHOOK_SECRET` | Vercel env | Annually |
| `CRON_SECRET` | Vercel env | Quarterly |
| `OPENAI_API_KEY` | Vercel + Worker env | Quarterly |
| `SMTP credentials` | Vercel + Worker env | Annually |
| `DATABASE_URL` (direct) | Worker env | On compromise only |
| SSH keys (worker VPS) | `~/.ssh/doppeldown-worker.key` | Annually |
| Backup encryption passphrase | Password manager | Annually |

### 5.3 Evidence & Asset Backups

Currently, evidence (screenshots, WHOIS, HTML) is stored inline in the PostgreSQL `threats.evidence` JSONB column. This means evidence is included in database backups.

> **Future Improvement (Phase 2):** Move evidence to object storage (Supabase Storage / S3) with:
> - Cross-region replication
> - Lifecycle policies for tier-based retention
> - Separate backup schedule from database
> - Reduced database size and query performance impact

### 5.4 Backup Schedule Summary

```
┌──────────────┬────────────┬───────────────────┬──────────────┐
│ What          │ Frequency  │ Retention          │ Verified     │
├──────────────┼────────────┼───────────────────┼──────────────┤
│ DB (Supabase) │ Continuous │ 7–30 days (PITR)  │ Supabase-mgd │
│ DB (pg_dump)  │ Weekly     │ 90 days           │ Monthly      │
│ Source code   │ Every push │ Indefinite (Git)  │ N/A          │
│ Secrets       │ On change  │ Password manager  │ Quarterly    │
│ VPS config    │ On deploy  │ Git + snapshot    │ Quarterly    │
└──────────────┴────────────┴───────────────────┴──────────────┘
```

---

## 6. System Failover Architecture

### 6.1 Current State (Single-Region)

Currently, DoppelDown operates without redundancy:
- Single Vercel deployment (auto-scaled, but vendor-dependent)
- Single Supabase project (single-region PostgreSQL)
- Single Oracle VPS worker node

### 6.2 Recommended Failover Architecture (Phased)

#### Phase 1: Immediate (Current Budget) — "Survive & Recover"

| Component | Failover Strategy | Implementation |
|-----------|-------------------|----------------|
| **Vercel (Web)** | Re-deploy from Git to backup (Netlify/Railway) | Pre-configured alternative deploy target |
| **Supabase (DB)** | Restore from backup to new Supabase project | Scripted restore process |
| **Worker (VPS)** | PM2 auto-restart + manual VPS rebuild | PM2 startup script + Docker image |
| **DNS** | Low TTL (300s) + alternative A record ready | Pre-configured in registrar |

```bash
# PM2 ecosystem config for worker auto-recovery
# /home/ubuntu/doppeldown-worker/ecosystem.config.js
module.exports = {
  apps: [{
    name: 'doppeldown-worker',
    script: 'npm',
    args: 'run worker:scan',
    cwd: '/home/ubuntu/doppeldown-worker',
    autorestart: true,
    watch: false,
    max_memory_restart: '4G',
    restart_delay: 5000,
    max_restarts: 50,
    min_uptime: '30s',
    env: {
      NODE_ENV: 'production'
    },
    // Log rotation
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: '/home/ubuntu/logs/doppeldown-worker-error.log',
    out_file: '/home/ubuntu/logs/doppeldown-worker-out.log',
    merge_logs: true,
    log_type: 'json'
  }]
};
```

#### Phase 2: Growth Stage ($50–200/mo budget) — "Resilient"

| Component | Failover Strategy | Cost |
|-----------|-------------------|------|
| **Supabase Pro** | PITR + 30-day retention | $25/mo |
| **Second Worker** | Standby Oracle VPS (Always Free tier) | $0 |
| **Uptime Monitoring** | BetterUptime or UptimeRobot | $0–$20/mo |
| **Off-site Backups** | Backblaze B2 (10GB free) | $0–$5/mo |
| **Status Page** | Instatus or self-hosted | $0–$10/mo |

#### Phase 3: Scale Stage ($200+/mo budget) — "Highly Available"

| Component | Failover Strategy | Cost |
|-----------|-------------------|------|
| **Multi-region Supabase** | Read replicas + failover | $75+/mo |
| **Worker cluster** | 2+ workers with job queue distribution | $0–$50/mo |
| **CDN/DDoS protection** | Cloudflare Pro | $20/mo |
| **Log aggregation** | Axiom, Logtail, or Datadog | $0–$50/mo |
| **Error tracking** | Sentry (free tier sufficient initially) | $0–$26/mo |

### 6.3 Worker Failover Detail

The scan worker is the most vulnerable single point of failure. Here's the detailed failover approach:

```
┌─────────────────────────────────────────────────────┐
│                 WORKER FAILOVER                      │
│                                                      │
│  PRIMARY WORKER (Oracle VPS - 159.13.34.62)         │
│  ├── PM2 auto-restart on crash                      │
│  ├── PM2 resurrect on reboot                        │
│  ├── Memory limit restart (4GB)                     │
│  └── Max 50 restarts with 5s delay                  │
│                                                      │
│  IF PRIMARY FAILS (>15 min):                        │
│  ├── Health check alert fires                        │
│  ├── Operator receives notification                  │
│  └── Manual actions:                                 │
│      ├── Option A: SSH and debug/restart             │
│      ├── Option B: Start standby worker              │
│      └── Option C: Rebuild from Docker image         │
│                                                      │
│  STANDBY WORKER (Future — second Oracle VPS)        │
│  ├── Pre-configured, not running                    │
│  ├── Start command: pm2 start ecosystem.config.js   │
│  └── Job queue prevents duplicate processing         │
│                                                      │
│  JOB QUEUE RESILIENCE:                              │
│  ├── Jobs stay in 'queued' status if no worker      │
│  ├── Stale job detection (30 min default)           │
│  ├── Auto-retry with exponential backoff            │
│  └── Max 3 attempts per job                         │
└─────────────────────────────────────────────────────┘
```

### 6.4 Database Failover Decision Tree

```
Database Issue Detected
│
├── Supabase Status Page shows outage?
│   ├── YES → Wait for Supabase recovery (they handle HA)
│   │         ├── Update status page
│   │         ├── Notify affected customers if >30 min
│   │         └── Estimated recovery: 15 min – 2 hours
│   │
│   └── NO → Investigate further
│       ├── Connection refused / timeout?
│       │   ├── Check Supabase dashboard → project paused?
│       │   │   └── Resume project in dashboard
│       │   ├── Check network → VPS can't reach Supabase?
│       │   │   └── DNS issue or network partition → switch DNS
│       │   └── Check credentials → rotated/expired?
│       │       └── Update env vars and redeploy
│       │
│       └── Data corruption / wrong data?
│           ├── Identify scope of corruption
│           ├── Use PITR to restore to point before issue
│           └── If PITR unavailable → restore from pg_dump backup
```

---

## 7. Incident Response Procedures

### 7.1 Incident Classification

| Severity | Definition | Response Time | Examples |
|----------|-----------|---------------|----------|
| **P1 — Critical** | Complete service outage or data breach | ≤ 15 minutes | Database down, auth broken, data leak |
| **P2 — High** | Major feature unavailable | ≤ 1 hour | Scans not running, payments failing |
| **P3 — Medium** | Degraded functionality | ≤ 4 hours | Slow queries, email delays, partial scan failures |
| **P4 — Low** | Minor issues | ≤ 24 hours | UI bugs, cosmetic issues, non-critical cron delay |

### 7.2 Incident Response Workflow

```
┌──────────────────────────────────────────────────────────┐
│                 INCIDENT RESPONSE FLOW                    │
│                                                           │
│  1. DETECT                                               │
│     ├── Automated monitoring alert                        │
│     ├── Customer report                                   │
│     ├── Internal discovery                                │
│     └── Third-party notification (Supabase/Vercel status) │
│                                                           │
│  2. TRIAGE (≤ 5 minutes)                                 │
│     ├── Classify severity (P1–P4)                        │
│     ├── Identify affected components                      │
│     ├── Determine blast radius (users affected)           │
│     └── Assign incident commander                         │
│                                                           │
│  3. CONTAIN (≤ 15 minutes for P1)                        │
│     ├── Stop the bleeding (block traffic, disable feature)│
│     ├── Preserve evidence (logs, screenshots)             │
│     ├── Activate relevant runbook                         │
│     └── Begin status page update                          │
│                                                           │
│  4. MITIGATE                                             │
│     ├── Apply fix or workaround                           │
│     ├── Deploy hotfix if code change needed               │
│     ├── Failover if infrastructure issue                  │
│     └── Escalate if beyond team capability                │
│                                                           │
│  5. RESOLVE                                              │
│     ├── Verify fix across all affected areas              │
│     ├── Monitor for recurrence (30 min watch)             │
│     ├── Update status page: resolved                      │
│     └── Notify affected customers                         │
│                                                           │
│  6. POST-MORTEM (within 48 hours)                        │
│     ├── Document timeline                                 │
│     ├── Root cause analysis                               │
│     ├── Impact assessment                                 │
│     ├── Action items with owners and deadlines            │
│     └── Update this DR plan if needed                     │
└──────────────────────────────────────────────────────────┘
```

### 7.3 Data Breach Response Procedure

If customer data is compromised, this additional procedure activates:

```
DATA BREACH DETECTED
│
├── 1. IMMEDIATE (0–1 hour)
│   ├── Revoke compromised credentials/tokens
│   ├── Isolate affected systems
│   ├── Preserve all logs and forensic evidence
│   ├── Document initial scope assessment
│   └── Notify incident commander
│
├── 2. INVESTIGATION (1–24 hours)
│   ├── Determine what data was accessed
│   ├── Identify which customers are affected
│   ├── Determine attack vector
│   ├── Assess if attacker still has access
│   └── Engage external security consultant if needed
│
├── 3. NOTIFICATION (within 72 hours — GDPR requirement)
│   ├── Notify affected customers via email
│   │   ├── What happened
│   │   ├── What data was affected
│   │   ├── What we're doing about it
│   │   └── What they should do (change passwords, etc.)
│   ├── Notify relevant authorities (if EU: supervisory authority)
│   ├── Update public status/blog if warranted
│   └── Prepare FAQ for customer support
│
├── 4. REMEDIATION
│   ├── Patch vulnerability
│   ├── Force password reset for affected users
│   ├── Rotate all secrets and API keys
│   ├── Implement additional monitoring
│   └── Third-party security audit
│
└── 5. REVIEW (within 2 weeks)
    ├── Full post-mortem document
    ├── Update security policies
    ├── Implement preventive measures
    └── Board/stakeholder briefing
```

### 7.4 Escalation Matrix

| Severity | First Responder | Escalation (30 min) | Escalation (2 hr) |
|----------|----------------|--------------------|--------------------|
| **P1** | On-call engineer | Founder/CTO | All engineering + external help |
| **P2** | On-call engineer | Senior engineer | Founder/CTO |
| **P3** | Any engineer | On-call engineer | Senior engineer |
| **P4** | Backlog (async) | — | — |

> **Note for current team size:** As a small team, the "on-call engineer" and "Founder/CTO" may be the same person. The escalation paths become relevant as the team grows. For now, ensure mobile notifications reach the right person 24/7.

---

## 8. Disaster Recovery Scenarios

### Scenario 1: Vercel Complete Outage

| Attribute | Detail |
|-----------|--------|
| **Probability** | Low (Vercel has 99.99% SLA) |
| **Impact** | L0 — Web app and cron jobs completely unavailable |
| **RTO** | 2 hours |
| **Detection** | Uptime monitor, customer reports, Vercel status page |

**Recovery Steps:**
1. Confirm Vercel outage via [status.vercel.com](https://status.vercel.com)
2. If expected downtime > 30 min, activate backup deployment:
   ```bash
   # Pre-configured Railway/Render backup deployment
   cd doppeldown
   railway up  # or render deploy
   ```
3. Update DNS to point to backup deployment (TTL should be 300s)
4. Verify backup deployment is functional
5. Reconfigure Stripe webhook endpoint to backup URL
6. Monitor until Vercel recovers
7. Migrate back to Vercel when stable (reverse DNS change)

**Pre-requirements:**
- [ ] Pre-configure Railway or Render project with env vars
- [ ] Test backup deployment quarterly
- [ ] Keep DNS TTL at 300 seconds
- [ ] Document Stripe webhook URL change procedure

---

### Scenario 2: Supabase Database Outage

| Attribute | Detail |
|-----------|--------|
| **Probability** | Low–Medium |
| **Impact** | L1 — Auth broken, no data access, scans halt |
| **RTO** | 1 hour (Supabase-managed), 4 hours (self-managed restore) |
| **Detection** | Application errors, health check failures |

**Recovery Steps:**
1. Check [status.supabase.com](https://status.supabase.com)
2. If Supabase-wide: wait for their recovery + update status page
3. If project-specific:
   a. Check Supabase dashboard → project status
   b. If paused → resume
   c. If corrupted → initiate PITR restore (Supabase dashboard)
   d. If PITR unavailable → restore from latest pg_dump backup:
      ```bash
      # Create new Supabase project
      # Restore from backup
      gpg --decrypt latest_backup.dump.gpg > /tmp/restore.dump
      pg_restore --dbname="${NEW_SUPABASE_DB_URL}" --no-owner /tmp/restore.dump
      
      # Update environment variables everywhere
      # Vercel: update SUPABASE_URL and keys
      # Worker: update .env
      # Redeploy both
      ```
4. Verify data integrity (user counts, brand counts, recent threats)
5. Test authentication flow
6. Resume scan worker

---

### Scenario 3: Worker VPS Failure

| Attribute | Detail |
|-----------|--------|
| **Probability** | Medium |
| **Impact** | L2 — Scans stop; existing data and dashboard unaffected |
| **RTO** | 4 hours |
| **Detection** | Job queue depth growing, no scan completions |

**Recovery Steps:**
1. Attempt SSH connection:
   ```bash
   ssh -i ~/.ssh/doppeldown-worker.key ubuntu@159.13.34.62
   ```
2. If SSH works:
   ```bash
   # Check PM2 status
   pm2 status
   pm2 logs doppeldown-worker --lines 100
   
   # Restart worker
   pm2 restart doppeldown-worker
   
   # If persistent crashes, check resources
   free -h
   df -h
   top -bn1 | head -20
   ```
3. If SSH fails (VPS unreachable):
   a. Check Oracle Cloud console
   b. Attempt VPS reboot from console
   c. If VPS unrecoverable:
      ```bash
      # Provision new Oracle VPS (Always Free tier)
      # Install dependencies
      sudo apt-get update && sudo apt-get install -y nodejs npm chromium
      npm install -g pm2
      
      # Clone and configure
      git clone <repo> /home/ubuntu/doppeldown-worker
      cp /secure-backup/.env.local /home/ubuntu/doppeldown-worker/.env.local
      cd /home/ubuntu/doppeldown-worker && npm ci
      
      # Start worker
      pm2 start ecosystem.config.js
      pm2 save
      pm2 startup
      ```
4. Verify jobs are being processed:
   ```sql
   SELECT status, COUNT(*) FROM scan_jobs 
   WHERE created_at > NOW() - INTERVAL '1 hour' 
   GROUP BY status;
   ```

**Queue Resilience Note:** The PostgreSQL-backed job queue is self-healing. While the worker is down:
- New scan requests continue to queue successfully
- No jobs are lost
- When the worker restarts, it processes the backlog in priority order
- Stale locks are automatically released after 30 minutes

---

### Scenario 4: Stripe Integration Failure

| Attribute | Detail |
|-----------|--------|
| **Probability** | Low |
| **Impact** | L2 — Can't process payments; existing subscriptions continue |
| **RTO** | 1 hour |
| **Detection** | Webhook failures, customer payment errors |

**Recovery Steps:**
1. Check [status.stripe.com](https://status.stripe.com)
2. Check Stripe Dashboard → Webhooks → Recent deliveries
3. If webhook endpoint misconfigured:
   ```
   Stripe Dashboard → Developers → Webhooks
   → Update endpoint URL to current deployment URL
   → Verify webhook secret matches STRIPE_WEBHOOK_SECRET env var
   ```
4. If Stripe-side outage: wait + enable grace period for affected customers
5. Replay failed webhook events from Stripe dashboard
6. Verify all subscription statuses are correct in database

---

### Scenario 5: DNS/Domain Compromise

| Attribute | Detail |
|-----------|--------|
| **Probability** | Very Low |
| **Impact** | L0 — Complete service unavailability + potential phishing |
| **RTO** | 1–24 hours (DNS propagation) |
| **Detection** | Cannot resolve domain, customer reports |

**Recovery Steps:**
1. Contact domain registrar immediately
2. Enable registrar lock if not already set
3. If domain hijacked:
   a. File complaint with ICANN
   b. Contact registrar abuse team
   c. Use backup domain if available
4. Update DNS records to correct values
5. Wait for propagation (reduce TTL beforehand)
6. Verify SSL certificates are valid
7. Audit for any unauthorized changes

**Prevention:**
- [ ] Enable registrar lock on all domains
- [ ] Enable DNSSEC
- [ ] Use registrar 2FA
- [ ] Keep a backup domain registered and configured

---

### Scenario 6: Secret/Key Compromise

| Attribute | Detail |
|-----------|--------|
| **Probability** | Medium (human error, leaked env file) |
| **Impact** | P1 — Potential data breach |
| **RTO** | 1 hour |

**Recovery Steps:**
1. **Immediately rotate the compromised key:**

   | Secret | Rotation Method |
   |--------|----------------|
   | Supabase Service Role Key | Supabase Dashboard → Settings → API → Regenerate |
   | Supabase Anon Key | Supabase Dashboard → Settings → API → Regenerate |
   | Stripe Secret Key | Stripe Dashboard → Developers → API Keys → Roll Key |
   | Stripe Webhook Secret | Stripe → Webhooks → Reveal → Re-create endpoint |
   | OpenAI API Key | OpenAI Dashboard → API Keys → Revoke + Create New |
   | CRON_SECRET | Generate new: `openssl rand -hex 32` |
   | SSH Key | `ssh-keygen` new key, update `authorized_keys` on VPS |

2. Update environment variables in all locations:
   - Vercel dashboard
   - Worker VPS `.env.local`
   - Any CI/CD configurations
3. Redeploy all services
4. Audit logs for unauthorized access during exposure window
5. Notify affected customers if data was accessed

---

### Scenario 7: Ransomware/Malware on Worker VPS

| Attribute | Detail |
|-----------|--------|
| **Probability** | Low |
| **Impact** | L2+ — Worker compromised, potential data access |
| **RTO** | 4 hours |

**Recovery Steps:**
1. **Immediately isolate:** Block all network access to VPS via Oracle Cloud firewall
2. **Do NOT attempt to clean** — treat as compromised
3. Rotate ALL secrets the worker had access to (see Scenario 6)
4. Terminate the VPS instance
5. Provision new VPS from clean image
6. Deploy worker from Git (never from the compromised instance)
7. Audit database for unauthorized modifications:
   ```sql
   -- Check for unusual recent changes
   SELECT * FROM audit_logs 
   WHERE created_at > '[compromise_time]'
   ORDER BY created_at DESC;
   
   -- Check for new admin users
   SELECT * FROM users WHERE is_admin = true;
   
   -- Check for modified RLS policies
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```

---

## 9. Communication Plan

### Internal Communication

| Event | Channel | Timing |
|-------|---------|--------|
| P1 Incident detected | Phone call + SMS | Immediately |
| P2 Incident detected | Push notification + email | Within 15 min |
| Status updates during incident | Designated chat channel | Every 30 min |
| Incident resolved | Email + chat | Immediately |
| Post-mortem scheduled | Calendar invite | Within 24 hours |

### External Communication (Customers)

| Event | Channel | Timing | Template |
|-------|---------|--------|----------|
| **Planned maintenance** | Email + status page | 72 hours before | [A1] |
| **Unplanned outage (< 30 min)** | Status page only | During incident | [A2] |
| **Unplanned outage (> 30 min)** | Email + status page | At 30 min mark | [A3] |
| **Data breach** | Direct email to affected | Within 72 hours | [A4] |
| **Incident resolved** | Same channels as report | On resolution | [A5] |
| **Post-incident summary** | Blog/email (if significant) | Within 5 days | [A6] |

### Status Page

> **Action Required:** Set up a public status page. Options:
> - **Instatus** (free tier) — instatus.com
> - **BetterUptime** (free tier) — betteruptime.com
> - **Self-hosted**: Upptime (GitHub Pages, free)

Status page should show:
- Web Application
- API / Dashboard
- Scan Engine
- Alert System
- Payment Processing

---

## 10. Testing & Drills

### Test Schedule

| Test Type | Frequency | Duration | Scope |
|-----------|-----------|----------|-------|
| **Backup restore test** | Monthly | 1 hour | Restore pg_dump to test DB |
| **Worker failover drill** | Quarterly | 2 hours | Kill worker, verify queue + restart |
| **Full DR simulation** | Semi-annually | 4 hours | Simulate total infrastructure failure |
| **Incident response drill** | Quarterly | 1 hour | Tabletop exercise with scenarios |
| **Secret rotation drill** | Semi-annually | 2 hours | Rotate all secrets, verify nothing breaks |
| **Communication drill** | Annually | 1 hour | Test alerting and customer notification |

### Backup Restore Test Checklist

```markdown
## Monthly Backup Restore Test — [DATE]

- [ ] Downloaded latest backup from off-site storage
- [ ] Decrypted backup successfully
- [ ] Restored to test database
- [ ] Verified row counts:
  - Users: _____ (expected: ~_____)
  - Brands: _____ (expected: ~_____)
  - Threats: _____ (expected: ~_____)
  - Scans: _____ (expected: ~_____)
- [ ] Verified a sample user can "authenticate" (data present)
- [ ] Verified recent threat data is present
- [ ] Cleaned up test database
- [ ] Updated test log

Result: PASS / FAIL
Notes: _____
```

### Quarterly DR Drill Checklist

```markdown
## Quarterly DR Drill — [DATE]

### Scenario: [chosen scenario from Section 8]

- [ ] Incident detected (simulated alert)
- [ ] Triage completed in ≤ 5 minutes
- [ ] Correct runbook identified and followed
- [ ] Containment actions taken in ≤ 15 minutes
- [ ] Recovery actions completed within target RTO
- [ ] Service verified functional
- [ ] Status page updated (simulated)
- [ ] Customer communication drafted (simulated)
- [ ] Post-drill review completed

Actual RTO achieved: _____
Target RTO: _____
Result: PASS / FAIL

Improvements identified:
1. _____
2. _____
3. _____
```

---

## 11. Roles & Responsibilities

### Current Team (Small Team Configuration)

| Role | Person | Responsibilities |
|------|--------|-----------------|
| **Incident Commander** | Founder/CTO | Declare incident severity, coordinate response, make decisions, communicate externally |
| **On-Call Engineer** | Primary developer | Detect, triage, contain, and resolve technical issues |
| **Communications Lead** | Founder/CTO | Draft and send customer notifications, update status page |
| **Backup Operator** | Primary developer | Execute backup procedures, verify backups, perform restores |

### RACI Matrix

| Activity | Founder/CTO | Primary Dev | Future: DevOps |
|----------|:-----------:|:-----------:|:--------------:|
| Incident detection | I | **R** | **R** |
| Severity classification | **A** | **R** | C |
| Customer communication | **R/A** | I | I |
| Technical investigation | C | **R** | **R** |
| Code deployment | **A** | **R** | **R** |
| Database restore | **A** | **R** | **R** |
| Post-mortem | **R/A** | **R** | C |
| Backup verification | I | **R** | **R** |
| DR plan maintenance | **A** | **R** | C |

*R = Responsible, A = Accountable, C = Consulted, I = Informed*

---

## 12. Compliance & Regulatory

### Data Protection Requirements

| Regulation | Applicability | Key DR Requirements |
|-----------|--------------|---------------------|
| **GDPR** | EU/UK customers | 72-hour breach notification, data export capability, right to deletion |
| **Australian Privacy Act** | AU customers | Notifiable Data Breach scheme (72 hours) |
| **SOC 2** | Enterprise customers may require | Backup testing, incident response, access controls |

### Compliance Checklist for DR

- [ ] Backups are encrypted at rest (AES-256)
- [ ] Backups are encrypted in transit (TLS/SSH)
- [ ] Backup access is logged and auditable
- [ ] Data retention follows tier policies
- [ ] Data deletion cascade works correctly
- [ ] Incident response includes breach notification
- [ ] Customer data export is possible within 30 days
- [ ] Audit logs are retained for 2+ years
- [ ] All personnel with data access have been identified
- [ ] Third-party processors (Supabase, Vercel, Stripe) have DPAs

### Third-Party DPA Status

| Provider | DPA Available | Status |
|----------|--------------|--------|
| Supabase | [supabase.com/privacy](https://supabase.com/privacy) | ☐ Review & sign |
| Vercel | [vercel.com/legal/dpa](https://vercel.com/legal/dpa) | ☐ Review & sign |
| Stripe | [stripe.com/privacy-center/legal](https://stripe.com/privacy-center/legal) | ☐ Review & sign |
| Email provider (SMTP) | Varies | ☐ Identify & review |
| Oracle Cloud | [oracle.com/legal/privacy](https://oracle.com/legal/privacy) | ☐ Review & sign |

---

## 13. Runbooks

### Runbook 1: Health Check — All Systems

```bash
#!/bin/bash
# quick-health-check.sh — Run daily or on suspected issues

echo "=== DoppelDown Health Check ==="
echo "Date: $(date -u)"
echo ""

# 1. Web Application
echo "--- Web Application ---"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://doppeldown.com)
echo "Homepage: HTTP $HTTP_CODE"
API_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://doppeldown.com/api/scan/quota)
echo "API endpoint: HTTP $API_CODE"

# 2. Worker VPS
echo ""
echo "--- Worker VPS ---"
ssh -i ~/.ssh/doppeldown-worker.key -o ConnectTimeout=5 ubuntu@159.13.34.62 \
  'pm2 jlist 2>/dev/null | python3 -c "
import json, sys
procs = json.load(sys.stdin)
for p in procs:
    print(f\"  {p[\"name\"]}: {p[\"pm2_env\"][\"status\"]} (restarts: {p[\"pm2_env\"][\"restart_time\"]}, uptime: {p[\"pm2_env\"][\"pm_uptime\"]}ms\")
"' 2>/dev/null || echo "  ⚠️  VPS unreachable or PM2 not running"

# 3. Job Queue
echo ""
echo "--- Job Queue ---"
# This requires direct DB access or an admin API endpoint
echo "(Check Supabase dashboard → scan_jobs table)"
echo "  Queued jobs: [check manually]"
echo "  Failed jobs (last 24h): [check manually]"

# 4. External Services
echo ""
echo "--- External Services ---"
echo "Supabase: $(curl -s -o /dev/null -w '%{http_code}' https://status.supabase.com)"
echo "Vercel: $(curl -s -o /dev/null -w '%{http_code}' https://status.vercel.com)"
echo "Stripe: $(curl -s -o /dev/null -w '%{http_code}' https://status.stripe.com)"

echo ""
echo "=== Health Check Complete ==="
```

### Runbook 2: Emergency Database Restore

```bash
#!/bin/bash
# emergency-db-restore.sh
# USE ONLY IN EMERGENCY — will overwrite target database

set -euo pipefail

echo "⚠️  EMERGENCY DATABASE RESTORE"
echo "This will restore DoppelDown database from backup."
echo ""

# Configuration
BACKUP_DIR="/backups/doppeldown"
PASSPHRASE_FILE="/root/.backup-passphrase"

# List available backups
echo "Available backups:"
ls -la ${BACKUP_DIR}/*.dump.gpg | tail -10
echo ""

read -p "Enter backup filename to restore: " BACKUP_FILE
read -p "Enter target DATABASE_URL: " TARGET_DB_URL
read -p "⚠️  This will overwrite the target database. Type 'CONFIRM' to proceed: " CONFIRM

if [ "$CONFIRM" != "CONFIRM" ]; then
    echo "Aborted."
    exit 1
fi

echo "Decrypting backup..."
gpg --decrypt --passphrase-file "${PASSPHRASE_FILE}" \
    "${BACKUP_DIR}/${BACKUP_FILE}" > /tmp/emergency_restore.dump

echo "Restoring to target database..."
pg_restore \
    --dbname="${TARGET_DB_URL}" \
    --clean \
    --if-exists \
    --no-owner \
    --no-privileges \
    /tmp/emergency_restore.dump

echo "Verifying restore..."
psql "${TARGET_DB_URL}" -c "
    SELECT 
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM brands) as brands,
        (SELECT COUNT(*) FROM threats) as threats,
        (SELECT COUNT(*) FROM scans) as scans;
"

rm -f /tmp/emergency_restore.dump
echo "✅ Database restore complete."
echo ""
echo "NEXT STEPS:"
echo "1. Update all environment variables to point to new database"
echo "2. Redeploy Vercel application"
echo "3. Restart scan worker"
echo "4. Verify authentication works"
echo "5. Run health check"
```

### Runbook 3: Worker VPS Rebuild

```bash
#!/bin/bash
# rebuild-worker.sh — Provision and configure a new worker VPS
# Run FROM your local machine after provisioning a new Oracle VPS

set -euo pipefail

NEW_VPS_IP="${1:?Usage: $0 <new-vps-ip>}"
SSH_KEY="~/.ssh/doppeldown-worker.key"

echo "=== Rebuilding DoppelDown Worker on ${NEW_VPS_IP} ==="

# 1. System updates
ssh -i "${SSH_KEY}" ubuntu@${NEW_VPS_IP} << 'REMOTE'
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y \
    curl git build-essential \
    chromium-browser ca-certificates \
    fonts-liberation libasound2 libatk-bridge2.0-0 \
    libatk1.0-0 libcups2 libdrm2 libgbm1 libgtk-3-0 \
    libnss3 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Create directories
mkdir -p ~/doppeldown-worker ~/logs
REMOTE

# 2. Deploy application
echo "Deploying application code..."
scp -i "${SSH_KEY}" -r ./doppeldown_test/* ubuntu@${NEW_VPS_IP}:~/doppeldown-worker/
scp -i "${SSH_KEY}" ./doppeldown_test/.env.local ubuntu@${NEW_VPS_IP}:~/doppeldown-worker/.env.local

# 3. Install dependencies and start
ssh -i "${SSH_KEY}" ubuntu@${NEW_VPS_IP} << 'REMOTE'
cd ~/doppeldown-worker
npm ci --production

# Configure PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'doppeldown-worker',
    script: 'npm',
    args: 'run worker:scan',
    cwd: '/home/ubuntu/doppeldown-worker',
    autorestart: true,
    max_memory_restart: '4G',
    restart_delay: 5000,
    max_restarts: 50,
    min_uptime: '30s',
    env: { NODE_ENV: 'production', PUPPETEER_EXECUTABLE_PATH: '/usr/bin/chromium-browser' },
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: '/home/ubuntu/logs/worker-error.log',
    out_file: '/home/ubuntu/logs/worker-out.log',
    merge_logs: true
  }]
};
EOF

pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu
REMOTE

echo "✅ Worker rebuild complete on ${NEW_VPS_IP}"
echo ""
echo "NEXT STEPS:"
echo "1. Update TOOLS.md with new VPS IP"
echo "2. Verify job processing: pm2 logs doppeldown-worker"
echo "3. Update monitoring/alerting with new IP"
```

### Runbook 4: Secret Rotation

```bash
#!/bin/bash
# rotate-secrets.sh — Rotate all application secrets
# Run this quarterly or immediately on compromise

set -euo pipefail

echo "=== DoppelDown Secret Rotation ==="
echo "Date: $(date -u)"
echo ""

# Generate new CRON_SECRET
NEW_CRON_SECRET=$(openssl rand -hex 32)
echo "New CRON_SECRET: ${NEW_CRON_SECRET}"
echo "(Update in Vercel dashboard → Environment Variables)"
echo ""

# Generate new webhook secret
NEW_WEBHOOK_SECRET=$(openssl rand -hex 32)  
echo "New default webhook secret generated: ${NEW_WEBHOOK_SECRET}"
echo ""

echo "=== MANUAL STEPS REQUIRED ==="
echo ""
echo "1. SUPABASE (if compromised):"
echo "   Dashboard → Settings → API → Regenerate service_role key"
echo "   Update SUPABASE_SERVICE_ROLE_KEY in Vercel and Worker"
echo ""
echo "2. STRIPE (annually or if compromised):"
echo "   Dashboard → Developers → API Keys → Roll secret key"
echo "   Recreate webhook endpoint for new signing secret"
echo "   Update STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET"
echo ""
echo "3. OPENAI (quarterly or if compromised):"
echo "   Dashboard → API Keys → Delete old → Create new"
echo "   Update OPENAI_API_KEY in Vercel and Worker"
echo ""
echo "4. SSH KEYS (annually or if compromised):"
echo "   ssh-keygen -t ed25519 -f ~/.ssh/doppeldown-worker-new.key"
echo "   Copy public key to VPS authorized_keys"
echo "   Update TOOLS.md with new key path"
echo ""
echo "5. AFTER ALL ROTATIONS:"
echo "   - Redeploy Vercel: vercel --prod"
echo "   - Restart worker: ssh worker 'pm2 restart all'"
echo "   - Run health check"
echo "   - Update password manager with new values"
echo "   - Update backup of secrets"
echo ""
echo "6. VERIFY:"
echo "   - User can log in"
echo "   - Scan can be triggered"
echo "   - Payment flow works (test mode)"
echo "   - Cron endpoints respond"
echo "   - Worker processes jobs"
```

---

## 14. Appendices

### Appendix A: Communication Templates

#### [A1] Planned Maintenance

```
Subject: DoppelDown Scheduled Maintenance — [DATE]

Hi [Customer Name],

We're performing scheduled maintenance on [DATE] from [TIME] to [TIME] UTC to 
[brief description, e.g., "upgrade our database infrastructure"].

What to expect:
• The dashboard may be briefly unavailable (estimated [X] minutes)
• Automated scans will resume automatically after maintenance
• No data will be lost

No action is required from you.

Questions? Reply to this email or contact support@doppeldown.com.

— The DoppelDown Team
```

#### [A2] Brief Unplanned Outage (Status Page Only)

```
Title: Investigating elevated error rates
Body: We're investigating reports of [issue]. Our team is working on a fix.
Status: Investigating

[Update]
Title: Fix deployed
Body: We've identified and resolved the issue. All services are operating normally. 
We apologize for any inconvenience.
Status: Resolved
```

#### [A3] Extended Unplanned Outage

```
Subject: DoppelDown Service Disruption — Update

Hi [Customer Name],

We're currently experiencing a service disruption affecting [specific services].

Current status:
• Issue identified: [brief description]
• Impact: [what's affected]
• Estimated resolution: [time estimate or "investigating"]

Your data is safe. [If applicable: Automated scans have been queued and will 
process once service is restored.]

We'll send another update in [X] minutes or when the issue is resolved.

For real-time updates: [status page URL]

We apologize for the disruption.

— The DoppelDown Team
```

#### [A4] Data Breach Notification

```
Subject: Important Security Notice — DoppelDown

Dear [Customer Name],

We're writing to inform you of a security incident that may have affected your 
DoppelDown account.

What happened:
On [DATE], we detected [brief, honest description of the incident].

What information was involved:
[List specific data types affected — be precise, not vague]

What we've done:
• [Action 1 — e.g., "Revoked the compromised access immediately"]
• [Action 2 — e.g., "Engaged external security experts"]
• [Action 3 — e.g., "Implemented additional monitoring"]
• [Action 4 — e.g., "Reported to relevant authorities"]

What you should do:
• Change your DoppelDown password immediately
• [If applicable: Review your account for unauthorized changes]
• [If applicable: Monitor for phishing emails]

We take the security of your data extremely seriously. This incident does not 
reflect the standard of protection we strive to provide.

If you have questions, please contact us at security@doppeldown.com.

Sincerely,
[Founder Name]
Founder, DoppelDown
```

#### [A5] Incident Resolved

```
Subject: DoppelDown Service Restored

Hi [Customer Name],

The service disruption we reported earlier has been fully resolved.

Summary:
• Duration: [start time] to [end time] UTC ([X] minutes/hours)
• Impact: [what was affected]
• Root cause: [brief explanation]
• Prevention: [what we're doing to prevent recurrence]

All services are operating normally. Any queued scans have been processed.

We apologize for the inconvenience and appreciate your patience.

— The DoppelDown Team
```

#### [A6] Post-Incident Summary (for significant incidents)

```
Subject: Post-Incident Report — [DATE] Service Disruption

Dear DoppelDown Customers,

On [DATE], we experienced [brief description]. We want to share what happened, 
why it happened, and what we're doing about it.

Timeline:
• [TIME] — [Event]
• [TIME] — [Event]
• [TIME] — [Event]
• [TIME] — Service fully restored

Root Cause:
[Honest, technical-but-accessible explanation]

Impact:
• [X] customers affected
• [Duration] of disruption
• No data was lost [if true]

What We're Doing:
1. [Concrete improvement with timeline]
2. [Concrete improvement with timeline]
3. [Concrete improvement with timeline]

We hold ourselves to a high standard and this incident fell short. Thank you 
for your trust and patience.

— The DoppelDown Team
```

### Appendix B: Monitoring Setup Recommendations

#### Essential Monitors (Set Up Immediately)

| Monitor | Tool | Check | Alert |
|---------|------|-------|-------|
| Web application uptime | UptimeRobot (free) | HTTPS GET every 5 min | Email + SMS |
| API health | UptimeRobot | GET /api/scan/quota every 5 min | Email + SMS |
| Worker VPS SSH | UptimeRobot | TCP port 22 every 5 min | Email |
| Supabase status | RSS/webhook | status.supabase.com | Email |
| Vercel status | RSS/webhook | status.vercel.com | Email |
| SSL certificate expiry | UptimeRobot | Certificate check | 30 days before |

#### Growth-Stage Monitors (Add When Budget Allows)

| Monitor | Tool | Check | Alert |
|---------|------|-------|-------|
| Application errors | Sentry | Error rate threshold | Email + Slack |
| Job queue depth | Custom cron | scan_jobs WHERE status='queued' > 100 | Email |
| Worker memory | PM2 + custom | Memory > 80% of limit | Email |
| Database size | Supabase dashboard | Approaching plan limit | Email |
| Backup freshness | Custom script | Last backup > 8 days old | Email + SMS |
| Response time | UptimeRobot | P95 latency > 3s | Email |

#### Custom Health Endpoint (Implement in Application)

```typescript
// src/app/api/health/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const checks: Record<string, 'ok' | 'degraded' | 'down'> = {}
  
  // Database check
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { error } = await supabase.from('users').select('id').limit(1)
    checks.database = error ? 'degraded' : 'ok'
  } catch {
    checks.database = 'down'
  }
  
  // Job queue check
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data, error } = await supabase
      .from('scan_jobs')
      .select('id', { count: 'exact' })
      .eq('status', 'queued')
      .lt('created_at', new Date(Date.now() - 3600000).toISOString())
    
    checks.queue = error ? 'degraded' : 
                   (data && data.length > 50) ? 'degraded' : 'ok'
  } catch {
    checks.queue = 'degraded'
  }
  
  const overallStatus = Object.values(checks).includes('down') ? 'down' :
                        Object.values(checks).includes('degraded') ? 'degraded' : 'ok'
  
  return NextResponse.json({
    status: overallStatus,
    checks,
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA || 'local'
  }, {
    status: overallStatus === 'down' ? 503 : 200
  })
}
```

### Appendix C: Recovery Verification Checklist

After any recovery action, verify the following:

```markdown
## Post-Recovery Verification — [DATE] [TIME]

### Core Functionality
- [ ] Homepage loads (HTTPS, correct content)
- [ ] User can log in (existing account)
- [ ] User can sign up (new account)
- [ ] Dashboard shows correct brand data
- [ ] Threat list loads with correct data
- [ ] Scan can be triggered manually
- [ ] Scan worker picks up job from queue

### Data Integrity
- [ ] User count matches expected: _____ / _____
- [ ] Brand count matches expected: _____ / _____
- [ ] Recent threats are present (check last 24h)
- [ ] No orphaned records visible

### Integrations
- [ ] Stripe checkout flow works (test mode)
- [ ] Stripe webhook receives test event
- [ ] Email delivery works (send test)
- [ ] Cron endpoints respond to authenticated request

### Security
- [ ] RLS policies active (test unauthorized access returns empty)
- [ ] CRON_SECRET validates correctly
- [ ] SSL certificate valid and not expiring soon

### Performance
- [ ] Dashboard loads in < 3 seconds
- [ ] API response time < 500ms
- [ ] No elevated error rates in logs

Result: PASS / FAIL
Verified by: _____
```

### Appendix D: Vendor Contact Information

| Vendor | Support URL | Priority Channel | Account Info |
|--------|-----------|------------------|--------------|
| **Supabase** | support.supabase.com | Dashboard ticket | Project ID in dashboard |
| **Vercel** | vercel.com/help | Dashboard ticket | Team slug in dashboard |
| **Stripe** | support.stripe.com | Dashboard chat | Account ID: acct_... |
| **Oracle Cloud** | cloud.oracle.com/support | Console ticket | Tenancy OCID |
| **Domain Registrar** | [registrar URL] | Phone/email | [account details in password manager] |

### Appendix E: Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-05 | Engineering | Initial comprehensive DR/BCP plan |

### Appendix F: Action Items — Immediate Implementation

These are the highest-priority items to implement to make this plan actionable:

| Priority | Action | Effort | Cost |
|----------|--------|--------|------|
| 🔴 P1 | Set up UptimeRobot monitoring (web + API + VPS) | 30 min | Free |
| 🔴 P1 | Implement `/api/health` endpoint | 1 hour | Free |
| 🔴 P1 | Set up weekly pg_dump backup script on VPS | 2 hours | Free |
| 🔴 P1 | Document all secrets in password manager | 1 hour | Free |
| 🟡 P2 | Upgrade Supabase to Pro plan (PITR) | 15 min | $25/mo |
| 🟡 P2 | Set up public status page (Instatus/BetterUptime) | 1 hour | Free |
| 🟡 P2 | Configure off-site backup storage (Backblaze B2) | 2 hours | ~$0 |
| 🟡 P2 | Pre-configure backup deployment target (Railway) | 3 hours | Free until used |
| 🟢 P3 | Set DNS TTL to 300 seconds | 5 min | Free |
| 🟢 P3 | Enable registrar lock + DNSSEC | 15 min | Free |
| 🟢 P3 | Run first backup restore test | 1 hour | Free |
| 🟢 P3 | Schedule quarterly DR drill | 15 min | Free |

**Total estimated implementation time:** ~12 hours  
**Total estimated monthly cost:** ~$25/mo (Supabase Pro)

---

*This document is a living plan. Review and update quarterly, or immediately after any incident or significant architecture change.*

*Last verified: 2026-02-05*  
*Next review due: 2026-05-05*
