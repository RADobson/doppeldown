# DoppelDown — Performance Optimization & Scalability Strategy

**Date:** 2026-02-05  
**Scope:** Technical roadmap for scaling from 100 → 100,000+ customers  
**Status:** Comprehensive strategy — ready for phased implementation

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current Architecture Assessment](#2-current-architecture-assessment)
3. [Bottleneck Analysis](#3-bottleneck-analysis)
4. [Phase 1: Foundation (100 → 1,000 customers)](#4-phase-1-foundation-100--1000-customers)
5. [Phase 2: Growth (1,000 → 10,000 customers)](#5-phase-2-growth-1000--10000-customers)
6. [Phase 3: Scale (10,000 → 100,000+ customers)](#6-phase-3-scale-10000--100000-customers)
7. [Database Optimization Strategy](#7-database-optimization-strategy)
8. [Caching Architecture](#8-caching-architecture)
9. [Scan Pipeline Optimization](#9-scan-pipeline-optimization)
10. [Frontend Performance](#10-frontend-performance)
11. [Infrastructure & Deployment](#11-infrastructure--deployment)
12. [Observability & Performance Monitoring](#12-observability--performance-monitoring)
13. [Cost Optimization](#13-cost-optimization)
14. [Risk Register & Mitigations](#14-risk-register--mitigations)
15. [Implementation Timeline](#15-implementation-timeline)
16. [Success Metrics & SLOs](#16-success-metrics--slos)

---

## 1. Executive Summary

DoppelDown is a Next.js 14 + Supabase (Postgres) SaaS for brand protection and phishing detection. The application runs scans that generate domain variations, perform DNS lookups, web scraping, screenshot capture, AI analysis, and social media checks. A scan worker runs on an Oracle Cloud VPS (ARM64, 23GB RAM).

### Current State
- **Good foundations:** Redis+memory caching layer, rate-limited scan queues (p-queue), 30+ database indexes, performance monitoring, structured logging.
- **Known constraints:** Single scan worker, Supabase free/Pro tier connection limits, Vercel serverless cold starts, in-process evidence handling, monolithic scan pipeline.

### Strategy Summary
| Phase | Customer Target | Timeline | Focus |
|-------|----------------|----------|-------|
| Phase 1 | 100 → 1,000 | Months 1-3 | Database tuning, query optimization, cache effectiveness |
| Phase 2 | 1,000 → 10,000 | Months 4-8 | Horizontal worker scaling, read replicas, CDN optimization |
| Phase 3 | 10,000 → 100,000+ | Months 9-18 | Multi-region, partitioning, event-driven architecture |

---

## 2. Current Architecture Assessment

### Architecture Diagram (Text)
```
                    ┌─────────────┐
                    │  Cloudflare  │
                    │  CDN / WAF   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Vercel    │
                    │  Next.js 14 │
                    │  (Serverless)│
                    └──┬───┬──┬──┘
                       │   │  │
            ┌──────────┘   │  └──────────┐
            ▼              ▼             ▼
    ┌──────────────┐ ┌──────────┐ ┌──────────┐
    │  Supabase    │ │  Redis   │ │  Stripe  │
    │  (Postgres)  │ │ (Upstash)│ │          │
    └──────────────┘ └──────────┘ └──────────┘
            ▲
            │
    ┌───────┴───────┐
    │  Scan Worker  │
    │  Oracle VPS   │
    │  (PM2, ARM64) │
    └───────────────┘
```

### Component Inventory

| Component | Technology | Role | Current Bottleneck Risk |
|-----------|-----------|------|------------------------|
| Web App | Next.js 14 on Vercel | Dashboard, API routes, landing pages | Cold starts on API routes |
| Database | Supabase Postgres | Primary data store, RLS | Connection pooling limits, JSONB bloat |
| Cache | Redis (Upstash) + in-memory LRU | DNS/WHOIS/search caching | Single Redis, no read replicas |
| Scan Worker | Node.js + PM2 on Oracle VPS | Background scan processing | Single instance, sequential processing |
| Screenshot | Puppeteer-core (Chromium) | Evidence capture | Memory-intensive, serial queue |
| AI Analysis | OpenAI Vision API | Threat analysis | Rate limits, cost at scale |
| Email | Resend + Nodemailer | Alerts, digests, summaries | Queue-based but in-process |
| Storage | Supabase Storage | Evidence screenshots | Signed URL generation |

### Strengths Already in Place
1. **Caching layer**: Redis + in-memory fallback with TTLs, tags, and invalidation helpers
2. **Rate-limited queues**: DNS (10/s), Search (2/s), Screenshot (1/2s), OpenAI (50/min), External (5/s)
3. **Database indexes**: 30+ indexes including partial indexes, GIN indexes, composite indexes
4. **Performance monitoring**: Request duration tracking, P50/P95/P99, slow query detection
5. **Scan job queue**: Database-backed job queue with priority, retry, and worker claiming
6. **Cache invalidation**: Tag-based and pattern-based invalidation on mutations

---

## 3. Bottleneck Analysis

### Bottleneck Map (by Scale)

```
100 customers     → Current architecture works, minor optimizations needed
1,000 customers   → DB connections, single worker throughput, scan backlog
5,000 customers   → Supabase row limits, Redis memory, evidence storage costs
10,000 customers  → Need horizontal workers, read replicas, table partitioning
50,000 customers  → Multi-region, event-driven pipeline, dedicated Postgres
100,000 customers → Full microservice decomposition, data warehousing
```

### Critical Path Analysis

**Scan throughput** is the hardest constraint. Math:

| Scale | Daily Scans | Domains/Scan | DNS Checks/Day | Time @ 10 checks/s |
|-------|------------|-------------|----------------|---------------------|
| 100 users | ~30 scans | 50 domains | 1,500 | 2.5 min |
| 1,000 users | ~300 scans | 50 domains | 15,000 | 25 min |
| 10,000 users | ~3,000 scans | 50 domains | 150,000 | 4.2 hours |
| 100,000 users | ~30,000 scans | 50 domains | 1,500,000 | 41.7 hours ❌ |

A single worker processing 10 DNS checks/second **cannot** serve 10,000+ customers with daily scans. This is the primary scaling constraint.

### Top 10 Bottlenecks (Ranked by Impact)

| # | Bottleneck | Impact | When it Breaks | Mitigation |
|---|-----------|--------|---------------|------------|
| 1 | Single scan worker | Scan backlog | ~1,000 customers | Horizontal worker scaling |
| 2 | Supabase connection limits | API errors, timeouts | ~2,000 concurrent users | Connection pooling (PgBouncer) |
| 3 | threats table growth | Slow queries, storage | ~500K rows | Table partitioning |
| 4 | Evidence JSONB in threats | Row size bloat | ~100K threats | Separate evidence table |
| 5 | Puppeteer memory | Worker OOM crashes | ~50 concurrent scans | Browser pool, dedicated service |
| 6 | OpenAI API rate limits | Analysis delays | ~500 scans/day | Batch processing, local models |
| 7 | Vercel function cold starts | P95 latency spikes | Always present | Edge caching, keep-alive |
| 8 | Redis memory (Upstash free) | Cache evictions | ~10K cached keys | Managed Redis, eviction policy |
| 9 | DNS resolution throughput | Scan speed | ~10K daily scans | Distributed DNS resolvers |
| 10 | Single cron trigger | Missed scan windows | ~5K brands | Distributed scheduler |

---

## 4. Phase 1: Foundation (100 → 1,000 Customers)

**Timeline:** Months 1-3  
**Cost:** ~$50-150/month infrastructure increase  
**Goal:** Ensure solid performance at current scale, eliminate easy wins

### 4.1 Database Quick Wins

#### 4.1.1 Connection Pooling
Supabase Pro provides PgBouncer. Ensure all connections route through the pooler.

```typescript
// src/lib/supabase/server.ts — Use pooler connection string
const POOLER_URL = process.env.SUPABASE_POOLER_URL || process.env.DATABASE_URL;

// For the scan worker (long-running), use direct connection
const DIRECT_URL = process.env.SUPABASE_DIRECT_URL || process.env.DATABASE_URL;
```

**Action items:**
- [ ] Switch API routes to `SUPABASE_POOLER_URL` (transaction mode)
- [ ] Keep scan worker on `SUPABASE_DIRECT_URL` (session mode for long transactions)
- [ ] Set `max_connections` to 60 on Supabase Pro (15 per app instance, 15 for worker)

#### 4.1.2 Query Optimization — N+1 Elimination

The scan runner has multiple sequential Supabase calls inside loops. Batch them.

**Current (scan-runner.ts, threat dedup loop):**
```typescript
// ❌ N+1: One query per domain variation
for (const variation of variationsToCheck) {
  const { data: existingThreat } = await supabase
    .from('threats')
    .select('id')
    .eq('brand_id', brand.id)
    .eq('domain', variation.domain)
    .limit(1)
    .maybeSingle()
  // ...
}
```

**Optimized:**
```typescript
// ✅ Batch: One query for all domains
const domainList = variationsToCheck.map(v => v.domain);
const { data: existingThreats } = await supabase
  .from('threats')
  .select('id, domain')
  .eq('brand_id', brand.id)
  .in('domain', domainList);

const existingDomainSet = new Set(existingThreats?.map(t => t.domain) || []);

for (const variation of variationsToCheck) {
  if (existingDomainSet.has(variation.domain)) continue;
  // ... process new threats only
}
```

**Impact:** Reduces database queries from O(n) to O(1) per scan. For a 100-domain scan, this eliminates ~99 queries.

#### 4.1.3 Batch Threat Inserts

**Current:** Single insert at the end of scan.  
**Problem:** If scan crashes mid-way, all threat data is lost.  
**Optimization:** Batch insert every 10-20 threats, with final reconciliation.

```typescript
const BATCH_SIZE = 20;
const pendingThreats: Partial<Threat>[] = [];

async function flushThreats() {
  if (pendingThreats.length === 0) return;
  const batch = pendingThreats.splice(0, pendingThreats.length);
  const { error } = await supabase.from('threats').insert(batch);
  if (error) console.error('Batch insert error:', error);
}

// In scan loop:
threats.push(newThreat);
if (threats.length % BATCH_SIZE === 0) await flushThreats();

// At end:
await flushThreats();
```

#### 4.1.4 Materialized Views for Dashboard Aggregations

Dashboard queries aggregate across threats, scans, and brands. Create materialized views:

```sql
-- Materialized view: threat summary per brand
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_brand_threat_summary AS
SELECT
  b.id AS brand_id,
  b.user_id,
  b.name AS brand_name,
  b.domain,
  COUNT(t.id) AS total_threats,
  COUNT(t.id) FILTER (WHERE t.severity = 'critical') AS critical_count,
  COUNT(t.id) FILTER (WHERE t.severity = 'high') AS high_count,
  COUNT(t.id) FILTER (WHERE t.severity = 'medium') AS medium_count,
  COUNT(t.id) FILTER (WHERE t.severity = 'low') AS low_count,
  COUNT(t.id) FILTER (WHERE t.status NOT IN ('resolved', 'false_positive')) AS active_threats,
  COUNT(t.id) FILTER (WHERE t.detected_at > NOW() - INTERVAL '7 days') AS new_this_week,
  MAX(t.detected_at) AS latest_threat_at,
  b.last_scan_at
FROM brands b
LEFT JOIN threats t ON t.brand_id = b.id
GROUP BY b.id, b.user_id, b.name, b.domain, b.last_scan_at;

CREATE UNIQUE INDEX ON mv_brand_threat_summary (brand_id);
CREATE INDEX ON mv_brand_threat_summary (user_id);

-- Refresh policy: after each scan completion
-- Called from scan worker after updating scan status
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_brand_threat_summary;
```

**Refresh strategy:** Call `REFRESH MATERIALIZED VIEW CONCURRENTLY` from the scan worker after each scan completion. Use `CONCURRENTLY` to avoid locking reads.

### 4.2 Cache Effectiveness Improvements

#### 4.2.1 Cache Warming on Login

Pre-populate cache when a user logs in, rather than waiting for first dashboard load:

```typescript
// src/app/auth/callback/route.ts
import { warmBrandCache } from '@/lib/cache';

// After successful auth:
const userId = user.id;
// Fire-and-forget cache warming
warmUserDashboard(userId).catch(() => {}); // Don't block auth flow

async function warmUserDashboard(userId: string) {
  const { data: brands } = await supabase
    .from('brands')
    .select('id')
    .eq('user_id', userId);
  
  for (const brand of (brands || []).slice(0, 5)) {
    await warmBrandCache(brand.id, {
      threats: () => fetchThreatsForBrand(brand.id),
      stats: () => fetchThreatStats(brand.id),
      scans: () => fetchScanHistory(brand.id),
    });
  }
}
```

#### 4.2.2 Stale-While-Revalidate Pattern

For dashboard data that doesn't need to be real-time:

```typescript
async function getOrSetWithSWR<T>(
  key: string,
  factory: () => Promise<T>,
  ttlSeconds: number,
  staleSeconds: number,
  tags: string[] = []
): Promise<T> {
  const cache = getCache();
  const fullKey = `swr:${key}`;
  
  interface SWREntry<T> {
    value: T;
    fetchedAt: number;
    ttl: number;
    stale: number;
  }
  
  const cached = await cache.get<SWREntry<T>>(fullKey);
  if (cached) {
    const age = Date.now() - cached.fetchedAt;
    
    // Fresh: return immediately
    if (age < cached.ttl * 1000) return cached.value;
    
    // Stale but usable: return stale, refresh in background
    if (age < (cached.ttl + cached.stale) * 1000) {
      // Background refresh (don't await)
      factory().then(freshValue => {
        cache.set(fullKey, {
          value: freshValue,
          fetchedAt: Date.now(),
          ttl: ttlSeconds,
          stale: staleSeconds
        }, ttlSeconds + staleSeconds, tags);
      }).catch(() => {});
      
      return cached.value;
    }
  }
  
  // Cache miss or expired: fetch synchronously
  const value = await factory();
  await cache.set(fullKey, {
    value,
    fetchedAt: Date.now(),
    ttl: ttlSeconds,
    stale: staleSeconds
  }, ttlSeconds + staleSeconds, tags);
  
  return value;
}
```

#### 4.2.3 DNS Result Caching Across Scans

Currently, each scan re-checks domains even if they were checked recently by another brand's scan. Add a global DNS result cache:

```typescript
// In scan-runner.ts, replace direct DNS check with:
const isRegistered = await dnsQueue.add(async () => {
  return getCachedDomainRegistration(
    variation.domain,
    () => checkDomainRegistration(variation.domain)
  );
});
```

**Impact:** If 100 brands share common TLD-swap targets (e.g., `*.net`, `*.org`), this eliminates ~80% of redundant DNS lookups.

### 4.3 API Route Optimization

#### 4.3.1 Response Compression

Add compression for JSON API responses:

```typescript
// next.config.js
const nextConfig = {
  compress: true, // Enable gzip/brotli (Vercel does this by default)
  // ...
}
```

#### 4.3.2 Selective Column Fetching

Many Supabase queries select `*` when only a few columns are needed:

```typescript
// ❌ Over-fetching
const { data: brands } = await supabase.from('brands').select('*');

// ✅ Select only needed columns
const { data: brands } = await supabase
  .from('brands')
  .select('id, name, domain, threat_count, last_scan_at, status');
```

#### 4.3.3 Pagination for List Endpoints

```typescript
// src/app/api/threats/route.ts
const page = parseInt(searchParams.get('page') || '1');
const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '25'), 100);
const offset = (page - 1) * pageSize;

const { data, count } = await supabase
  .from('threats')
  .select('id, type, severity, status, url, domain, detected_at, threat_score', { count: 'exact' })
  .eq('brand_id', brandId)
  .order('detected_at', { ascending: false })
  .range(offset, offset + pageSize - 1);

return NextResponse.json({
  data,
  pagination: {
    page,
    pageSize,
    total: count,
    totalPages: Math.ceil((count || 0) / pageSize),
  }
});
```

### 4.4 Scan Worker Quick Wins

#### 4.4.1 Parallel DNS Resolution

The current scan checks domains sequentially through the queue. Enable batched parallel resolution:

```typescript
// Process DNS checks in batches of 10 (within rate limit of 10/s)
const BATCH_SIZE = 10;
for (let i = 0; i < variationsToCheck.length; i += BATCH_SIZE) {
  const batch = variationsToCheck.slice(i, i + BATCH_SIZE);
  
  const results = await Promise.all(
    batch.map(variation =>
      dnsQueue.add(() => getCachedDomainRegistration(
        variation.domain,
        () => checkDomainRegistration(variation.domain)
      )).then(isRegistered => ({ variation, isRegistered }))
    )
  );
  
  for (const { variation, isRegistered } of results) {
    domainsChecked++;
    if (isRegistered) {
      // ... threat processing
    }
  }
  
  await updateProgress('domains', domainsChecked, variationsToCheck.length);
}
```

**Impact:** Reduces domain checking phase from sequential (50 × 200ms = 10s) to batched parallel (5 batches × 200ms = 1s).

#### 4.4.2 Early Termination for Low-Risk Domains

Skip evidence collection for domains that are clearly parked/inactive:

```typescript
async function quickTriage(domain: string): Promise<'skip' | 'investigate'> {
  try {
    const resp = await fetch(`https://${domain}`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000),
      redirect: 'follow',
    });
    
    // Parked domain indicators
    const server = resp.headers.get('server')?.toLowerCase() || '';
    if (['parking', 'sedoparking', 'godaddy'].some(p => server.includes(p))) {
      return 'skip';
    }
    
    return 'investigate';
  } catch {
    return 'skip'; // Connection refused = not actively serving
  }
}
```

**Impact:** Eliminates expensive evidence collection (WHOIS + screenshot + AI analysis) for ~60-70% of registered-but-parked domains.

---

## 5. Phase 2: Growth (1,000 → 10,000 Customers)

**Timeline:** Months 4-8  
**Cost:** ~$200-800/month infrastructure  
**Goal:** Horizontal scaling, eliminate single points of failure

### 5.1 Horizontal Worker Scaling

#### 5.1.1 Multi-Worker Architecture

The current scan worker uses database-backed job claiming (`UPDATE ... WHERE status = 'queued' RETURNING *`). This pattern supports multiple workers natively.

```
┌──────────────────────────────────────────────────┐
│              Scan Job Queue (Postgres)            │
│  ┌─────────┬─────────┬─────────┬─────────┐       │
│  │ Job 1   │ Job 2   │ Job 3   │ Job 4   │  ...  │
│  │ queued  │ running │ queued  │ queued  │       │
│  └────┬────┴────┬────┴────┬────┴────┬────┘       │
│       │         │         │         │             │
└───────┼─────────┼─────────┼─────────┼─────────────┘
        │         │         │         │
   ┌────▼───┐ ┌───▼────┐ ┌──▼─────┐ ┌▼───────┐
   │Worker 1│ │Worker 2│ │Worker 3│ │Worker 4│
   │(Oracle)│ │(Oracle)│ │  (AWS) │ │  (AWS) │
   └────────┘ └────────┘ └────────┘ └────────┘
```

**Implementation:**

1. **Atomic job claiming with advisory locks:**
```sql
-- Replace the current optimistic UPDATE approach with advisory lock
CREATE OR REPLACE FUNCTION claim_next_scan_job(p_worker_id TEXT)
RETURNS scan_jobs AS $$
DECLARE
  v_job scan_jobs;
BEGIN
  SELECT * INTO v_job
  FROM scan_jobs
  WHERE status = 'queued'
    AND scheduled_at <= NOW()
    AND (locked_at IS NULL OR locked_at < NOW() - INTERVAL '30 minutes')
  ORDER BY priority DESC, created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;  -- Key: SKIP LOCKED prevents contention
  
  IF v_job.id IS NOT NULL THEN
    UPDATE scan_jobs
    SET status = 'running',
        locked_at = NOW(),
        locked_by = p_worker_id,
        started_at = NOW(),
        attempts = COALESCE(attempts, 0) + 1
    WHERE id = v_job.id;
    
    -- Re-fetch with updated fields
    SELECT * INTO v_job FROM scan_jobs WHERE id = v_job.id;
  END IF;
  
  RETURN v_job;
END;
$$ LANGUAGE plpgsql;
```

2. **Worker deployment via Docker Compose:**
```yaml
# docker-compose.workers.yml
services:
  worker-1:
    image: doppeldown-worker:latest
    environment:
      - WORKER_ID=worker-1
      - SCAN_WORKER_POLL_MS=3000
    deploy:
      resources:
        limits:
          memory: 4G
    restart: always

  worker-2:
    image: doppeldown-worker:latest
    environment:
      - WORKER_ID=worker-2
      - SCAN_WORKER_POLL_MS=3000
    deploy:
      resources:
        limits:
          memory: 4G
    restart: always
```

3. **Auto-scaling policy:**
```
Queue depth > 50 jobs  → Scale to 4 workers
Queue depth > 200 jobs → Scale to 8 workers
Queue depth < 10 jobs  → Scale to 2 workers (minimum)
Queue idle > 30 min    → Scale to 1 worker
```

#### 5.1.2 Worker Specialization

Split scan steps into specialized worker types:

```
┌─────────────────────────────────┐
│   Orchestrator Worker           │
│   Coordinates scan steps        │
└──┬──────┬──────┬──────┬────────┘
   │      │      │      │
   ▼      ▼      ▼      ▼
┌──────┐┌──────┐┌──────┐┌──────────┐
│ DNS  ││ Web  ││Screen││ AI       │
│Worker││Worker││Worker││ Analysis │
│(bulk)││(HTTP)││(Pupp)││  Worker  │
└──────┘└──────┘└──────┘└──────────┘
```

**Why:** Screenshot capture is memory-intensive (Chromium: ~300MB per instance). DNS checking is CPU-light but I/O heavy. Separating them allows independent scaling.

**Implementation (Phase 2b):**
```typescript
// scan_subtasks table
interface ScanSubtask {
  id: string;
  scan_id: string;
  type: 'dns_batch' | 'web_scan' | 'screenshot' | 'ai_analysis' | 'social_scan';
  status: 'queued' | 'running' | 'completed' | 'failed';
  input: Record<string, unknown>;  // domains, URLs, etc.
  output: Record<string, unknown>; // results
  worker_id: string | null;
  created_at: string;
}
```

### 5.2 Database Scaling

#### 5.2.1 Evidence Normalization

Move evidence JSONB out of the threats table into a dedicated evidence table:

```sql
-- New evidence table
CREATE TABLE public.evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  threat_id UUID NOT NULL REFERENCES public.threats(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('screenshot', 'whois', 'html_snapshot', 'dns_record', 'certificate')),
  data JSONB NOT NULL DEFAULT '{}',
  storage_path TEXT,         -- Path in object storage
  content_hash TEXT,         -- For deduplication
  captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_evidence_threat ON public.evidence(threat_id);
CREATE INDEX idx_evidence_type ON public.evidence(threat_id, type);
CREATE INDEX idx_evidence_hash ON public.evidence(content_hash) WHERE content_hash IS NOT NULL;

-- Migrate existing evidence
INSERT INTO public.evidence (threat_id, type, data, captured_at)
SELECT 
  id,
  'screenshot',
  jsonb_build_object('screenshots', evidence->'screenshots'),
  created_at
FROM threats
WHERE evidence->'screenshots' != '[]'::jsonb;

-- After migration, remove evidence column from threats
-- ALTER TABLE threats DROP COLUMN evidence;
-- ALTER TABLE threats ADD COLUMN evidence_count INTEGER DEFAULT 0;
```

**Impact:** Reduces threats table row size by 50-80%, dramatically improving query performance.

#### 5.2.2 Read Replica Configuration

Add a Supabase read replica for dashboard queries:

```typescript
// src/lib/supabase/read-replica.ts
import { createClient } from '@supabase/supabase-js';

const readReplicaUrl = process.env.SUPABASE_READ_REPLICA_URL;

export function getReadClient() {
  if (readReplicaUrl) {
    return createClient(readReplicaUrl, process.env.SUPABASE_ANON_KEY!, {
      auth: { persistSession: false },
    });
  }
  // Fallback to primary
  return getSupabaseClient();
}
```

**Routing rules:**
- **Read replica:** Dashboard queries, threat lists, scan history, reports, aggregations
- **Primary:** All writes, auth, real-time subscriptions, scan progress updates

#### 5.2.3 Table Partitioning for Threats

Partition the threats table by detection month once it exceeds ~1M rows:

```sql
-- Convert to partitioned table (requires migration)
-- Step 1: Create partitioned table
CREATE TABLE public.threats_partitioned (
  LIKE public.threats INCLUDING ALL
) PARTITION BY RANGE (detected_at);

-- Step 2: Create monthly partitions
CREATE TABLE threats_2026_01 PARTITION OF threats_partitioned
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE threats_2026_02 PARTITION OF threats_partitioned
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
-- ... auto-create future partitions via cron

-- Step 3: Auto-partition creation function
CREATE OR REPLACE FUNCTION create_threats_partition()
RETURNS void AS $$
DECLARE
  partition_date DATE := date_trunc('month', NOW() + INTERVAL '1 month');
  partition_name TEXT := 'threats_' || to_char(partition_date, 'YYYY_MM');
  start_date TEXT := partition_date::TEXT;
  end_date TEXT := (partition_date + INTERVAL '1 month')::TEXT;
BEGIN
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF threats_partitioned
     FOR VALUES FROM (%L) TO (%L)',
    partition_name, start_date, end_date
  );
END;
$$ LANGUAGE plpgsql;
```

**Impact:** Queries for recent threats (the common case) only scan the current partition instead of the entire table.

#### 5.2.4 Scan History Archival

Move completed scans older than 90 days to an archive table:

```sql
-- Archive old scans
CREATE TABLE public.scans_archive (LIKE public.scans INCLUDING ALL);

-- Monthly archival job
INSERT INTO scans_archive
SELECT * FROM scans
WHERE status = 'completed'
  AND completed_at < NOW() - INTERVAL '90 days';

DELETE FROM scans
WHERE status = 'completed'
  AND completed_at < NOW() - INTERVAL '90 days';
```

### 5.3 Advanced Caching

#### 5.3.1 Dedicated Redis Instance

Replace Upstash free tier with a managed Redis instance:

| Scale | Redis Config | Cost |
|-------|-------------|------|
| 1K customers | Upstash Pro (1GB) | ~$10/mo |
| 5K customers | Redis Cloud 5GB | ~$30/mo |
| 10K customers | Redis Cloud 10GB, replicas | ~$80/mo |

#### 5.3.2 Multi-Tier Cache Architecture

```
Request → L1 (Edge Cache, Vercel) → L2 (In-Memory, process) → L3 (Redis) → Database
                5s TTL                    60s TTL                 300s TTL
```

```typescript
// Multi-tier cache implementation
class MultiTierCache {
  private l1: Map<string, { value: unknown; expiresAt: number }> = new Map();
  private l2: InMemoryCache;
  private l3: RedisClient;

  async get<T>(key: string): Promise<T | null> {
    // L1: Process-local (microseconds)
    const l1Entry = this.l1.get(key);
    if (l1Entry && l1Entry.expiresAt > Date.now()) {
      return l1Entry.value as T;
    }

    // L2: In-memory LRU (microseconds)
    const l2Value = this.l2.get<T>(key);
    if (l2Value !== undefined) {
      this.l1.set(key, { value: l2Value, expiresAt: Date.now() + 5000 });
      return l2Value;
    }

    // L3: Redis (milliseconds)
    const l3Value = await this.l3.get(key);
    if (l3Value) {
      const parsed = JSON.parse(l3Value) as T;
      this.l2.set(key, parsed, 60);
      this.l1.set(key, { value: parsed, expiresAt: Date.now() + 5000 });
      return parsed;
    }

    return null;
  }
}
```

#### 5.3.3 Cache-Aside for Scan Results

After a scan completes, proactively push results into cache:

```typescript
// In scan worker, after scan completion:
async function postScanCacheWarm(brandId: string, userId: string) {
  // Pre-compute and cache dashboard metrics
  const metrics = await computeDashboardMetrics(userId);
  await cache.set(cacheKeys.dashboardMetrics(userId), metrics, 600);
  
  // Pre-compute and cache brand threat summary
  const stats = await computeThreatStats(brandId);
  await cache.set(cacheKeys.threatStats(brandId), stats, 600);
  
  // Refresh materialized view
  await supabase.rpc('refresh_brand_threat_summary');
}
```

### 5.4 CDN and Edge Optimization

#### 5.4.1 Static Page ISR (Incremental Static Regeneration)

Blog pages, industry pages, and comparison pages should be ISR'd:

```typescript
// src/app/blog/[slug]/page.tsx
export const revalidate = 3600; // Revalidate every hour

// src/app/industries/[slug]/page.tsx
export const revalidate = 86400; // Revalidate daily

// src/app/pricing/page.tsx
export const revalidate = 300; // Revalidate every 5 minutes (prices change)
```

#### 5.4.2 API Edge Functions

Move read-heavy, auth-light API routes to Vercel Edge Runtime:

```typescript
// src/app/api/health/route.ts
export const runtime = 'edge';

export async function GET() {
  return new Response(JSON.stringify({ status: 'ok', timestamp: Date.now() }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

**Candidates for Edge Runtime:**
- `/api/health` — Zero-dependency health check
- `/api/scan/quota` — Simple cache lookup
- `/api/monitoring/vitals` — Client-side metrics ingestion

---

## 6. Phase 3: Scale (10,000 → 100,000+ Customers)

**Timeline:** Months 9-18  
**Cost:** ~$2,000-10,000/month infrastructure  
**Goal:** Multi-region, event-driven, enterprise-grade

### 6.1 Event-Driven Scan Pipeline

Replace the monolithic `runScanForBrand()` with an event-driven pipeline:

```
┌──────────┐   ┌────────────┐   ┌─────────────┐   ┌───────────┐
│ Scan     │──▶│  Message   │──▶│ Step Workers │──▶│ Results   │
│ Request  │   │  Queue     │   │             │   │ Aggregator│
└──────────┘   │ (Redis     │   │ DNS Worker  │   └─────┬─────┘
               │  Streams/  │   │ Web Worker  │         │
               │  BullMQ)   │   │ Screenshot  │         ▼
               └────────────┘   │ AI Analysis │   ┌───────────┐
                                └─────────────┘   │ Database  │
                                                  │ + Cache   │
                                                  └───────────┘
```

**Technology choice:** BullMQ (Redis-based job queue) for step orchestration:

```typescript
// Scan pipeline definition
import { Queue, Worker, FlowProducer } from 'bullmq';

const flowProducer = new FlowProducer({ connection: redisConnection });

// Create scan flow
async function createScanFlow(scanId: string, brandId: string, mode: ScanMode) {
  return flowProducer.add({
    name: 'finalize-scan',
    queueName: 'scan-finalize',
    data: { scanId, brandId },
    children: [
      {
        name: 'dns-check',
        queueName: 'scan-dns',
        data: { scanId, brandId, domains: generatedDomains },
      },
      {
        name: 'web-scan',
        queueName: 'scan-web',
        data: { scanId, brandId, brandName, brandDomain },
        opts: { delay: 0 }, // Start immediately, parallel with DNS
      },
      {
        name: 'social-scan',
        queueName: 'scan-social',
        data: { scanId, brandId, platforms: mode.socialPlatforms },
        opts: { delay: 5000 }, // Start after brief delay
      },
    ],
  });
}

// DNS worker
const dnsWorker = new Worker('scan-dns', async (job) => {
  const { scanId, brandId, domains } = job.data;
  const results = [];
  
  for (const batch of chunk(domains, 50)) {
    const batchResults = await Promise.all(
      batch.map(d => resolveDomain(d))
    );
    results.push(...batchResults);
    await job.updateProgress(results.length / domains.length * 100);
  }
  
  return { registeredDomains: results.filter(r => r.registered) };
}, {
  connection: redisConnection,
  concurrency: 5, // 5 concurrent DNS jobs
});
```

**Benefits at scale:**
- Each step scales independently (10 DNS workers, 3 screenshot workers, 2 AI workers)
- Failed steps can be retried without restarting entire scan
- Queue depth per step gives visibility into bottlenecks
- Steps can be distributed across regions

### 6.2 Multi-Region Deployment

```
                  ┌─────────────────────────────────┐
                  │      Global Load Balancer        │
                  │      (Cloudflare / Vercel)       │
                  └──────┬──────────┬───────────────┘
                         │          │
              ┌──────────▼─┐   ┌───▼──────────┐
              │ US Region  │   │ EU Region    │
              │ Vercel Edge│   │ Vercel Edge  │
              └──────┬─────┘   └─────┬────────┘
                     │               │
              ┌──────▼─────┐   ┌─────▼────────┐
              │ US Database│◄──│ EU Read      │
              │ (Primary)  │──▶│ Replica      │
              └──────┬─────┘   └──────────────┘
                     │
              ┌──────▼─────┐
              │ US Workers │
              │ (Primary)  │
              └────────────┘
```

**Database topology:**
- Primary (writes) in US-East
- Read replica in EU-West for European customers
- Application routes reads to nearest replica based on user geography

### 6.3 Dedicated Database (Beyond Supabase)

At 100K+ customers, consider migrating to dedicated Postgres:

| Metric | Supabase Pro | Dedicated (RDS/AlloyDB) |
|--------|-------------|------------------------|
| Connections | 60 (pooled 200) | 500+ (pooled 5000) |
| Storage | 8GB included | 500GB+ |
| CPU | Shared | Dedicated 4-16 vCPU |
| Read Replicas | 2 | 5+ |
| IOPS | ~1000 | 10,000+ (provisioned) |
| Point-in-time Recovery | 7 days | 35 days |

**Migration path:** Supabase allows direct Postgres access, so migration is straightforward. Use `pg_dump`/`pg_restore` or logical replication for zero-downtime migration.

### 6.4 Data Warehousing and Analytics

Separate OLTP (real-time operations) from OLAP (analytics/reporting):

```
┌──────────────┐    CDC/ETL    ┌──────────────┐
│ Operational  │──────────────▶│  Analytics   │
│ Database     │               │  Warehouse   │
│ (Postgres)   │               │ (ClickHouse/ │
│              │               │  BigQuery)   │
└──────────────┘               └──────────────┘
                                      │
                               ┌──────▼──────┐
                               │ Dashboards  │
                               │ (Metabase/  │
                               │  Grafana)   │
                               └─────────────┘
```

Move expensive analytics queries (threat trends, scan metrics, customer usage) to a columnar store.

### 6.5 API Rate Limiting at Scale

Implement tiered rate limiting per subscription level:

```typescript
// src/middleware.ts — Add rate limiting
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // Default
  analytics: true,
});

const TIER_RATE_LIMITS: Record<string, { requests: number; window: string }> = {
  free:         { requests: 30,   window: '1 m' },
  starter:      { requests: 100,  window: '1 m' },
  professional: { requests: 300,  window: '1 m' },
  enterprise:   { requests: 1000, window: '1 m' },
};
```

---

## 7. Database Optimization Strategy

### 7.1 Query Performance Audit Checklist

Run these queries periodically on Supabase to identify problems:

```sql
-- 1. Find slow queries
SELECT query, calls, mean_exec_time, max_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;

-- 2. Find unused indexes (candidates for removal)
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;

-- 3. Find tables that need VACUUM
SELECT relname, n_dead_tup, n_live_tup,
  round(n_dead_tup::numeric / GREATEST(n_live_tup, 1) * 100, 2) as dead_pct
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY n_dead_tup DESC;

-- 4. Table sizes
SELECT * FROM get_table_stats();

-- 5. Index usage
SELECT * FROM get_index_stats();

-- 6. Cache hit ratio (should be > 99%)
SELECT
  sum(heap_blks_read) as heap_read,
  sum(heap_blks_hit) as heap_hit,
  round(sum(heap_blks_hit)::numeric / GREATEST(sum(heap_blks_hit) + sum(heap_blks_read), 1) * 100, 2) as cache_hit_ratio
FROM pg_statio_user_tables;
```

### 7.2 Index Maintenance Plan

| Frequency | Action |
|-----------|--------|
| Daily | `ANALYZE` on frequently-updated tables (threats, scans, scan_jobs) |
| Weekly | Check for bloated indexes, unused indexes |
| Monthly | `REINDEX CONCURRENTLY` on high-churn indexes |
| Quarterly | Review query plans for top 20 queries |

### 7.3 JSONB Optimization

The `evidence` and `analysis` columns use JSONB. Optimization strategies:

1. **Extract frequently-queried fields to columns:**
```sql
-- Add computed columns for common evidence queries
ALTER TABLE threats ADD COLUMN has_screenshot BOOLEAN GENERATED ALWAYS AS (
  (evidence->'screenshots') IS NOT NULL AND jsonb_array_length(evidence->'screenshots') > 0
) STORED;

ALTER TABLE threats ADD COLUMN evidence_count INTEGER GENERATED ALWAYS AS (
  COALESCE(jsonb_array_length(evidence->'screenshots'), 0) +
  COALESCE(jsonb_array_length(evidence->'whois_snapshots'), 0) +
  COALESCE(jsonb_array_length(evidence->'html_snapshots'), 0)
) STORED;
```

2. **Compress large JSONB values:**
```sql
-- Set storage to EXTENDED for TOAST compression
ALTER TABLE threats ALTER COLUMN evidence SET STORAGE EXTENDED;
ALTER TABLE threats ALTER COLUMN analysis SET STORAGE EXTENDED;
```

### 7.4 Supabase-Specific Optimizations

1. **Use `maybeSingle()` instead of `single()` for optional records** — avoids 406 errors
2. **Prefer `head: true, count: 'exact'` for count-only queries** — avoids data transfer
3. **Use `abortSignal` for client-side request cancellation** — prevents orphaned queries
4. **Batch RPC calls** using Supabase edge functions for multiple related queries

---

## 8. Caching Architecture

### 8.1 Cache Strategy by Data Type

| Data Type | TTL | Invalidation Strategy | Cache Layer |
|-----------|-----|----------------------|-------------|
| DNS lookup results | 5 min | TTL expiry | Redis + Memory |
| WHOIS data | 10 min | TTL expiry | Redis |
| Web search results | 15 min | TTL expiry | Redis |
| Social profiles | 5 min | TTL expiry | Redis + Memory |
| AI analysis | 1 hour | On re-analysis | Redis |
| User subscription | 1 hour | On Stripe webhook | Redis + Memory |
| Brand list | 10 min | On brand CRUD | Redis + Memory |
| Threat list | 5 min | On scan complete, threat update | Redis |
| Dashboard metrics | 5 min | SWR pattern | Redis + Memory |
| Static pages | 1 hour | ISR revalidation | Edge (Vercel) |
| API responses (GET) | 30-60s | ETags + conditional | Edge + Redis |

### 8.2 Cache Key Design

Current key design is good. Enhancements:

```typescript
// Add version prefix for cache-busting on schema changes
const CACHE_VERSION = 'v2';

const cacheKeys = {
  // Versioned keys
  dashboardMetrics: (userId: string) => 
    `${CACHE_VERSION}:metrics:dashboard:${userId}`,
  
  // Composite keys for complex queries
  threatList: (brandId: string, filters: ThreatFilters) => {
    const filterHash = hashObject(filters); // Deterministic hash
    return `${CACHE_VERSION}:threats:${brandId}:${filterHash}`;
  },
};
```

### 8.3 Cache Invalidation Matrix

```
Event                    → Caches to Invalidate
─────────────────────────────────────────────────
Scan completes           → brand threats, threat stats, scan history, dashboard metrics, materialized views
Threat status changed    → brand threats, threat stats, dashboard metrics
Brand created/updated    → brand list, brand data, dashboard metrics
Brand deleted            → brand list, brand data, all brand threats, dashboard metrics
User tier changed        → user subscription, scan quota
Stripe webhook           → user subscription, scan quota, brand limits
```

### 8.4 Cache Monitoring Dashboard

Add cache metrics to the existing monitoring endpoint:

```typescript
// src/app/api/monitoring/route.ts
import { getCache } from '@/lib/cache';

// Add to monitoring response:
const cacheStats = getCache().getStats();
const cacheMetrics = {
  hitRate: getCache().getHitRate(),
  ...cacheStats,
  memoryUsagePercent: (cacheStats.memoryEntries / 10000) * 100,
  recommendations: [
    cacheStats.hitRate < 80 && 'Hit rate below 80% — consider increasing TTLs',
    cacheStats.errors > 100 && 'High cache error rate — check Redis connection',
    cacheStats.memoryEntries > 8000 && 'Memory cache near capacity — increase limit or use Redis',
  ].filter(Boolean),
};
```

---

## 9. Scan Pipeline Optimization

### 9.1 Current Pipeline Performance Profile

```
Scan Phase          | Time (50-domain scan) | Time (500-domain scan)
─────────────────────────────────────────────────────────────────────
Domain generation   | 50ms                  | 200ms
DNS resolution      | 10s (sequential)      | 100s (sequential)
Threat dedup check  | 500ms (N+1 queries)   | 5s (N+1 queries)
Evidence collection | 5s per threat         | 5s per threat
AI analysis         | 3s per threat         | 3s per threat
Social scan         | 15s                   | 15s
Database writes     | 200ms                 | 500ms
─────────────────────────────────────────────────────────────────────
TOTAL (5 threats)   | ~50s                  | ~150s
```

### 9.2 Optimized Pipeline Target

```
Scan Phase          | After Phase 1         | After Phase 2
─────────────────────────────────────────────────────────────────────
Domain generation   | 50ms                  | 50ms
DNS resolution      | 2s (batched parallel) | 0.5s (distributed)
Threat dedup check  | 50ms (batch query)    | 50ms (batch query)
Quick triage        | 1s (HEAD checks)      | 0.3s (distributed)
Evidence collection | 3s per threat (async) | 1s per threat (pool)
AI analysis         | 2s per threat (cached)| 0.5s (local model)
Social scan         | 10s (cached)          | 3s (distributed)
Database writes     | 100ms (batch)         | 100ms (batch)
─────────────────────────────────────────────────────────────────────
TOTAL (5 threats)   | ~25s                  | ~8s
```

### 9.3 DNS Resolution Optimization

At scale, DNS is the dominant bottleneck. Strategies:

1. **Use multiple DNS resolvers in rotation:**
```typescript
const DNS_RESOLVERS = [
  'https://dns.google/resolve',
  'https://cloudflare-dns.com/dns-query',
  'https://dns.nextdns.io/dns-query',
  'https://dns.quad9.net:5053/dns-query',
];

let resolverIndex = 0;

function getNextResolver(): string {
  const resolver = DNS_RESOLVERS[resolverIndex];
  resolverIndex = (resolverIndex + 1) % DNS_RESOLVERS.length;
  return resolver;
}
```

2. **Pre-filter unlikely registrations:**
```typescript
// Skip domains that are known TLD+random-string patterns unlikely to be registered
function isLikelyRegistered(domain: string): boolean {
  const parts = domain.split('.');
  const name = parts[0];
  
  // Very long random-looking names are unlikely squatting targets
  if (name.length > 30) return false;
  
  // Uncommon TLDs with high registration cost
  const expensiveTlds = ['museum', 'aero', 'int', 'mil', 'gov'];
  if (expensiveTlds.includes(parts[parts.length - 1])) return false;
  
  return true;
}
```

3. **DNS result sharing across brands:**
```typescript
// Global DNS cache (survives across scans)
// Already implemented via getCachedDomainRegistration with 5-min TTL
// Increase TTL for negative results (unregistered = unlikely to change fast)
const NEGATIVE_DNS_TTL = 3600; // 1 hour for "not registered"
const POSITIVE_DNS_TTL = 300;  // 5 min for "registered" (need fresh data)
```

### 9.4 Screenshot Pipeline Optimization

Puppeteer is the most resource-intensive component. Optimization strategies:

1. **Browser pool management:**
```typescript
import puppeteer from 'puppeteer-core';

class BrowserPool {
  private browsers: puppeteer.Browser[] = [];
  private available: puppeteer.Browser[] = [];
  private maxBrowsers: number;

  constructor(maxBrowsers = 3) {
    this.maxBrowsers = maxBrowsers;
  }

  async acquire(): Promise<puppeteer.Browser> {
    if (this.available.length > 0) {
      return this.available.pop()!;
    }
    
    if (this.browsers.length < this.maxBrowsers) {
      const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
      });
      this.browsers.push(browser);
      return browser;
    }
    
    // Wait for an available browser
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (this.available.length > 0) {
          clearInterval(check);
          resolve(this.available.pop()!);
        }
      }, 100);
    });
  }

  release(browser: puppeteer.Browser): void {
    this.available.push(browser);
  }

  async shutdown(): Promise<void> {
    await Promise.all(this.browsers.map(b => b.close()));
    this.browsers = [];
    this.available = [];
  }
}
```

2. **Screenshot-as-a-service (Phase 2+):**
   Replace in-process Puppeteer with a dedicated screenshot service (e.g., Browserless.io or self-hosted Playwright service):
   - Eliminates Chromium memory from worker processes
   - Dedicated scaling for screenshot load
   - Cost: ~$50/mo for 10K screenshots

### 9.5 AI Analysis Cost Optimization

OpenAI Vision costs add up at scale. Strategies:

| Strategy | Savings | Implementation |
|----------|---------|---------------|
| Cache analysis by content hash | 40-60% | Hash screenshot, skip if analyzed before |
| Batch similar domains | 20-30% | Group related domains in single prompt |
| Pre-filter obvious false positives | 30-50% | Skip parked domains, error pages |
| Local embedding model for triage | 60-80% | Use ONNX model for initial scoring |
| GPT-4o-mini for triage, GPT-4o for deep analysis | 50% | Two-tier analysis |

```typescript
// Two-tier analysis
async function analyzeTheat(screenshot: Buffer, metadata: ThreatMetadata) {
  // Tier 1: Fast triage with gpt-4o-mini ($0.00015/1K tokens)
  const triage = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'Is this screenshot a phishing/impersonation threat? Respond: YES/NO/UNCERTAIN' }],
    max_tokens: 50,
  });
  
  if (triage.choices[0].message.content?.includes('NO')) {
    return { severity: 'low', score: 10, source: 'triage' };
  }
  
  // Tier 2: Deep analysis with gpt-4o ($0.005/1K tokens) — only for YES/UNCERTAIN
  const analysis = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: 'Analyze this screenshot for brand impersonation...' }],
  });
  
  return parseAnalysis(analysis);
}
```

---

## 10. Frontend Performance

### 10.1 Bundle Optimization

```typescript
// next.config.js — Add bundle analysis
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

**Key optimizations:**
1. **Dynamic imports for heavy components:**
```typescript
// Dashboard page — lazy load chart components
const ThreatChart = dynamic(() => import('@/components/ThreatChart'), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false,
});

const ThreatMap = dynamic(() => import('@/components/ThreatMap'), {
  loading: () => <Skeleton className="h-96 w-full" />,
  ssr: false,
});
```

2. **Tree-shake unused Lucide icons:**
```typescript
// ❌ Imports entire icon library
import { Shield, AlertTriangle, Search } from 'lucide-react';

// ✅ Individual imports (already correct in current codebase)
// Lucide-react already supports tree-shaking with named imports
```

3. **Optimize PDF generation imports:**
```typescript
// jspdf and html2canvas are large (~500KB combined)
// Only import on report generation pages
const jsPDF = dynamic(() => import('jspdf'), { ssr: false });
```

### 10.2 Image Optimization

```typescript
// next.config.js
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200],
  imageSizes: [16, 32, 48, 64, 96, 128, 256],
  minimumCacheTTL: 86400, // 24 hours
  remotePatterns: [
    { protocol: 'https', hostname: '*.supabase.co' },
  ],
},
```

### 10.3 Dashboard Loading Optimization

Implement a streaming SSR pattern for the dashboard:

```typescript
// src/app/dashboard/page.tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      {/* Critical metrics load first */}
      <Suspense fallback={<MetricsSkeleton />}>
        <DashboardMetrics />
      </Suspense>
      
      {/* Threat list streams in */}
      <Suspense fallback={<ThreatListSkeleton />}>
        <RecentThreats />
      </Suspense>
      
      {/* Scan history loads last */}
      <Suspense fallback={<ScanHistorySkeleton />}>
        <ScanHistory />
      </Suspense>
    </div>
  );
}
```

### 10.4 Real-Time Updates

Replace polling with Supabase Realtime for scan progress:

```typescript
// src/hooks/useScanProgress.ts
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export function useScanProgress(scanId: string) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const supabase = createClient(/* ... */);
    
    const channel = supabase
      .channel(`scan:${scanId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'scans',
        filter: `id=eq.${scanId}`,
      }, (payload) => {
        setProgress(payload.new.overall_progress);
      })
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, [scanId]);
  
  return progress;
}
```

---

## 11. Infrastructure & Deployment

### 11.1 Infrastructure Scaling Plan

| Scale | Web | Database | Cache | Workers | Monthly Cost |
|-------|-----|----------|-------|---------|-------------|
| 100 | Vercel Hobby | Supabase Free | Upstash Free | 1× Oracle VPS | ~$0-20 |
| 1K | Vercel Pro | Supabase Pro | Upstash Pro | 1× Oracle VPS | ~$50-150 |
| 5K | Vercel Pro | Supabase Pro + replica | Redis Cloud 5GB | 2× workers | ~$200-400 |
| 10K | Vercel Team | Supabase Team | Redis Cloud 10GB | 4× workers | ~$500-1,000 |
| 50K | Vercel Enterprise | Dedicated Postgres | Redis Cluster | 8× workers + k8s | ~$3,000-5,000 |
| 100K+ | Multi-region | Postgres cluster + DW | Redis Cluster (multi-region) | Auto-scaling k8s | ~$8,000-15,000 |

### 11.2 Worker Deployment Evolution

```
Phase 1 (Current): Single PM2 process on Oracle VPS
    └─ Simple, works for <1K customers

Phase 2: Docker Compose on VPS(es)
    └─ 2-4 workers, easy to add more VPS instances
    └─ Use Oracle Cloud free tier for additional workers

Phase 3: Kubernetes (k8s)
    └─ Auto-scaling based on queue depth
    └─ Health checks, rolling updates, resource limits
    └─ Options: Oracle OKE, AWS EKS, DigitalOcean DOKS
```

### 11.3 CI/CD Pipeline Enhancements

```yaml
# .github/workflows/deploy.yml additions
jobs:
  performance-check:
    runs-on: ubuntu-latest
    steps:
      - name: Build and analyze bundle
        run: ANALYZE=true npm run build
        
      - name: Check bundle size budget
        run: |
          # Fail if main bundle exceeds 200KB gzipped
          MAIN_SIZE=$(find .next/static -name "*.js" -exec gzip -c {} \; | wc -c)
          if [ $MAIN_SIZE -gt 204800 ]; then
            echo "Bundle size budget exceeded: $MAIN_SIZE bytes"
            exit 1
          fi
      
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v12
        with:
          urls: |
            https://staging.doppeldown.app/
            https://staging.doppeldown.app/pricing
          budgetPath: ./lighthouse-budget.json
```

### 11.4 Zero-Downtime Deployment

```typescript
// Scan worker graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Completing current scan...');
  
  // Stop accepting new jobs
  isShuttingDown = true;
  
  // Wait for current job to complete (max 5 minutes)
  const timeout = setTimeout(() => {
    console.log('Graceful shutdown timeout. Forcing exit.');
    process.exit(1);
  }, 5 * 60 * 1000);
  
  // Release all claimed but unstarted jobs back to queue
  await releaseUnstartedJobs(WORKER_ID);
  
  // Wait for current job
  await currentJobPromise;
  clearTimeout(timeout);
  
  console.log('Graceful shutdown complete.');
  process.exit(0);
});
```

---

## 12. Observability & Performance Monitoring

### 12.1 Key Metrics to Track

| Category | Metric | Target | Alert Threshold |
|----------|--------|--------|----------------|
| **API Latency** | P50 response time | <200ms | >500ms |
| **API Latency** | P95 response time | <1s | >3s |
| **API Latency** | P99 response time | <3s | >10s |
| **Scan Pipeline** | Avg scan duration | <60s | >300s |
| **Scan Pipeline** | Queue depth | <50 | >200 |
| **Scan Pipeline** | Job failure rate | <2% | >5% |
| **Database** | Query P95 latency | <100ms | >500ms |
| **Database** | Connection pool utilization | <70% | >90% |
| **Database** | Cache hit ratio | >95% | <80% |
| **Cache** | Redis hit rate | >80% | <60% |
| **Cache** | Memory utilization | <70% | >85% |
| **Frontend** | LCP (Largest Contentful Paint) | <2.5s | >4s |
| **Frontend** | FID (First Input Delay) | <100ms | >300ms |
| **Frontend** | CLS (Cumulative Layout Shift) | <0.1 | >0.25 |
| **Business** | Scans/day | Trending up | Sudden drop >50% |
| **Business** | Active threats/customer | Monitoring | Spike >10x |

### 12.2 Monitoring Stack Recommendation

```
Phase 1: Built-in monitoring (current) + Vercel Analytics
Phase 2: Add Grafana Cloud (free tier) + structured log shipping
Phase 3: Full APM (Datadog/New Relic) + custom dashboards
```

### 12.3 Alerting Rules

```yaml
# Alert definitions
alerts:
  - name: high_api_latency
    condition: api_p95_latency > 3000ms for 5 minutes
    severity: warning
    action: PagerDuty notification
    
  - name: scan_queue_backup
    condition: scan_queue_depth > 200 for 15 minutes
    severity: critical
    action: Scale workers + PagerDuty
    
  - name: database_connection_exhaustion
    condition: db_connection_utilization > 90% for 5 minutes
    severity: critical
    action: PagerDuty + auto-scale connection pool
    
  - name: cache_failure
    condition: redis_connected = false for 2 minutes
    severity: warning
    action: Slack notification (in-memory fallback active)
    
  - name: scan_failure_spike
    condition: scan_failure_rate > 10% for 30 minutes
    severity: critical
    action: Pause automated scans + PagerDuty
```

### 12.4 Performance Testing Plan

| Test Type | Tool | Frequency | Target |
|-----------|------|-----------|--------|
| Load test (API) | k6 | Pre-release | 100 concurrent users, <1s P95 |
| Stress test (scan) | Custom script | Monthly | 1000 concurrent scans |
| Soak test (worker) | PM2 + monitoring | Weekly | 24h continuous scanning |
| Database benchmark | pgbench | Monthly | 1000 TPS |
| Frontend perf | Lighthouse CI | Every deploy | Score >90 |

---

## 13. Cost Optimization

### 13.1 Cost Model at Scale

| Component | 1K Customers | 10K Customers | 100K Customers |
|-----------|-------------|---------------|----------------|
| Vercel | $20/mo | $100/mo | $500/mo |
| Supabase | $25/mo | $100/mo | $500/mo (or dedicated) |
| Redis | $10/mo | $50/mo | $200/mo |
| Worker VPS | $0 (Oracle free) | $100/mo | $500/mo |
| OpenAI | $50/mo | $500/mo | $2,000/mo |
| Screenshots | $0 (self-hosted) | $50/mo | $200/mo |
| DNS APIs | $0 (public) | $0 (public) | $50/mo |
| Email (Resend) | $0 | $20/mo | $100/mo |
| **Total** | **~$105/mo** | **~$920/mo** | **~$4,050/mo** |

### 13.2 Revenue vs. Cost Sustainability

| Customers | MRR (avg $30/user) | Infrastructure Cost | Margin |
|-----------|-------------------|-------------------|--------|
| 1,000 | $30,000 | $105 | 99.7% |
| 10,000 | $300,000 | $920 | 99.7% |
| 100,000 | $3,000,000 | $4,050 | 99.9% |

Infrastructure costs are extremely favorable for this type of SaaS. The primary cost scaling concern is **OpenAI API usage**, which should be optimized first.

### 13.3 Cost Optimization Priorities

1. **OpenAI costs** — Two-tier analysis, caching, pre-filtering → 50-70% savings
2. **Database costs** — Evidence normalization, archival → 30-50% storage savings
3. **Screenshot costs** — Browser pooling, skip parked domains → 60% savings
4. **Bandwidth** — CDN caching, image optimization → 40% savings

---

## 14. Risk Register & Mitigations

| # | Risk | Probability | Impact | Mitigation |
|---|------|------------|--------|------------|
| 1 | Supabase outage | Low | Critical | Implement circuit breaker, cache fallback for reads |
| 2 | Redis data loss | Medium | Medium | Dual write (Redis + memory), persist critical data to DB |
| 3 | Worker crash during scan | Medium | Medium | Idempotent retry with `scan_jobs.attempts`, partial result preservation |
| 4 | OpenAI API rate limit | Medium | Low | Queue backpressure, fallback to rule-based analysis |
| 5 | DNS provider throttling | Medium | Medium | Multiple resolver rotation, exponential backoff |
| 6 | Vercel cold start spike | High | Low | Edge caching for critical paths, keep-alive cron |
| 7 | Database connection pool exhaustion | Medium | High | PgBouncer pooling, connection timeout management |
| 8 | Evidence storage cost explosion | Low | Medium | Storage lifecycle policies, compression, archival |
| 9 | Scan queue starvation (one tenant) | Low | Medium | Fair scheduling (round-robin per user, priority caps) |
| 10 | Data migration failures | Medium | High | Blue-green migration, rollback plan, data validation |

---

## 15. Implementation Timeline

```
Month 1: Phase 1a — Database & Query Optimization
├── Connection pooling setup
├── N+1 query elimination in scan runner
├── Batch threat inserts
├── Selective column fetching
└── Pagination for list endpoints

Month 2: Phase 1b — Cache & Scan Optimization
├── DNS caching across scans
├── Cache warming on login
├── Stale-while-revalidate for dashboard
├── Parallel DNS resolution (batched)
└── Early termination for parked domains

Month 3: Phase 1c — Frontend & Monitoring
├── Dynamic imports for heavy components
├── Streaming SSR for dashboard
├── Bundle size budgets in CI
├── Cache monitoring dashboard
└── Materialized views for aggregations

Month 4-5: Phase 2a — Worker Scaling
├── SKIP LOCKED job claiming
├── Docker-based worker deployment
├── 2-4 worker instances
├── Graceful shutdown handling
└── Queue depth monitoring + alerts

Month 6-7: Phase 2b — Database Scaling
├── Evidence normalization (separate table)
├── Read replica setup
├── Scan history archival
├── Index usage audit + cleanup
└── Table partitioning analysis

Month 8: Phase 2c — Advanced Caching
├── Dedicated Redis instance
├── Multi-tier cache (L1/L2/L3)
├── Cache-aside for scan results
├── ISR for static pages
└── Edge functions for read-heavy routes

Month 9-12: Phase 3a — Event-Driven Pipeline
├── BullMQ integration
├── Step-based scan decomposition
├── Independent step scaling
├── Screenshot-as-a-service
└── Two-tier AI analysis

Month 12-18: Phase 3b — Enterprise Scale
├── Multi-region deployment
├── Dedicated database evaluation
├── Data warehousing for analytics
├── Kubernetes migration for workers
└── Rate limiting at scale
```

---

## 16. Success Metrics & SLOs

### Service Level Objectives (SLOs)

| SLO | Current | Phase 1 Target | Phase 2 Target | Phase 3 Target |
|-----|---------|---------------|---------------|---------------|
| API availability | ~99.5% | 99.9% | 99.95% | 99.99% |
| Dashboard load time (P95) | ~2s | <1s | <500ms | <300ms |
| Scan start latency | ~5s | <3s | <1s | <500ms |
| Scan completion (50 domains) | ~50s | ~25s | ~10s | ~5s |
| Threat detection latency | <5 min | <3 min | <1 min | <30s |
| Cache hit rate | ~70% | >85% | >90% | >95% |
| Error rate (API) | ~2% | <1% | <0.5% | <0.1% |
| Max concurrent scans | 1 | 4 | 20 | 100+ |

### Business Metrics to Track

| Metric | Definition | Why it Matters |
|--------|-----------|---------------|
| Scan-to-value time | Time from scan start to first threat notification | Core user experience |
| Dashboard TTFB | Time to first byte for dashboard page | User perception of speed |
| Scan backlog age | Age of oldest queued scan job | Capacity indicator |
| Cost per scan | Infrastructure cost / total scans | Unit economics |
| Cache savings | Estimated API calls avoided by caching | ROI on cache investment |
| Evidence freshness | Average age of cached evidence on display | Data quality |

---

## Appendix A: Quick Reference — What to Implement First

If limited to 5 changes, prioritize these:

1. **Batch N+1 queries in scan runner** — Immediate 10x reduction in DB calls per scan
2. **Parallel DNS resolution** — 5x scan speed improvement
3. **Early domain triage (skip parked)** — 60% reduction in evidence collection load
4. **Cache warming on login** — Eliminates dashboard "first load" latency
5. **Connection pooling** — Prevents connection exhaustion at 1,000+ users

## Appendix B: Technology Decisions

| Decision | Chosen | Alternatives Considered | Rationale |
|----------|--------|------------------------|-----------|
| Job queue | Postgres + BullMQ (later) | RabbitMQ, SQS | Postgres already in stack, BullMQ adds when needed |
| Cache | Redis + in-memory LRU | Memcached, Dragonfly | Redis already integrated, rich data structures |
| Workers | Docker + PM2 → k8s | AWS Lambda, Cloud Functions | Long-running scans don't fit serverless model |
| Screenshot | Self-hosted Puppeteer → Browserless | Playwright, Screenshotone | Puppeteer already integrated |
| AI | OpenAI → two-tier | Anthropic, local models | OpenAI Vision already integrated, good quality |
| Database | Supabase → dedicated Postgres | PlanetScale, CockroachDB | Supabase works well through 10K+ |
| CDN | Vercel Edge + Cloudflare | AWS CloudFront | Already on Vercel, native integration |

---

*This document is a living roadmap. Review and update quarterly as the product grows and customer patterns emerge.*
