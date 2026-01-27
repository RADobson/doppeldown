# Phase 4: Automated Scanning - Research

**Researched:** 2026-01-27
**Domain:** Vercel Cron Jobs, Background Scheduling, Database Indexing
**Confidence:** HIGH

## Summary

Phase 4 implements automated scanning using Vercel Cron Jobs to trigger tier-based scanning schedules. The existing `/api/cron/scan` endpoint already exists and runs every 6 hours, but needs updating to handle hourly execution with tier-specific filtering (Free=manual only, Starter=daily, Professional=6hr, Enterprise=hourly).

The standard approach is a single hourly cron job that filters brands by tier and time-since-last-scan, with random jitter to prevent thundering herd. The existing codebase already has the infrastructure (scan jobs table, queue system, retry logic) — this phase primarily adds scheduling logic, tier schedule updates, and a pause flag.

**Primary recommendation:** Update vercel.json to hourly (`0 * * * *`), modify tier-limits.ts to use hours instead of days, add `auto_scan_enabled` boolean to brands table with partial index, and implement jitter using `crypto.randomInt` for scheduled_at timestamps.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vercel Cron | Built-in | Schedule automated tasks | Native Vercel feature, no external service needed |
| Node.js crypto | Built-in | Cryptographically secure random jitter | Standard library, no dependencies |
| Supabase Postgres | Existing | Time-based scheduling queries | Already in use, supports timestamp indexes |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| pg indexes (B-tree) | Built-in | Timestamp-based scheduling queries | Default for timestamp columns |
| Partial indexes | Built-in | Filter auto_scan_enabled=true | When querying subset of table |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Single hourly cron | Per-tier cron jobs | Multiple jobs more complex, count toward limits (100 max) |
| crypto.randomInt | Math.random | Math.random faster but not cryptographically secure |
| B-tree index | BRIN index | BRIN saves 99% space but only beneficial for very large datasets (millions of rows) |

**Installation:**
No new dependencies required — uses built-in Vercel Cron and Node.js crypto.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/api/cron/scan/route.ts    # Hourly cron endpoint (existing, needs update)
├── lib/tier-limits.ts             # Update scanFrequencyDays → scanFrequencyHours
└── lib/scan-queue.ts              # Existing queue infrastructure (no changes)

supabase/
└── migrations/
    └── YYYYMMDD_add_auto_scan_enabled.sql    # New migration
```

### Pattern 1: Time-Based Eligibility Filtering
**What:** Check `last_scan_at` timestamp against tier frequency to determine if brand needs scanning
**When to use:** Every cron invocation, for each brand
**Example:**
```typescript
// Source: Existing code pattern from route.ts line 54-63
const tierLimits = getTierLimits(effectiveTier)
if (tierLimits.scanFrequencyHours === null) {
  // Free tier - skip (manual only)
  continue
}

const lastScan = brand.last_scan_at ? new Date(brand.last_scan_at) : null
const hoursSinceLastScan = lastScan
  ? Math.floor((now.getTime() - lastScan.getTime()) / (1000 * 60 * 60))
  : Infinity

if (tierLimits.scanFrequencyHours > 0 && hoursSinceLastScan < tierLimits.scanFrequencyHours) {
  // Not due yet
  continue
}
```

### Pattern 2: Jitter for Thundering Herd Prevention
**What:** Add random offset (0-5 minutes) to `scheduled_at` timestamp to spread load
**When to use:** When creating scan jobs in cron endpoint
**Example:**
```typescript
// Source: Research findings on exponential backoff with jitter
import { randomInt } from 'crypto'

// Add 0-5 minutes of jitter
const jitterMs = randomInt(0, 5 * 60 * 1000) // 0 to 300000ms
const scheduledAt = new Date(Date.now() + jitterMs)

await supabase.from('scan_jobs').insert({
  brand_id: brand.id,
  scan_id: scan.id,
  scan_type: 'automated',
  status: 'queued',
  priority: 1,
  scheduled_at: scheduledAt.toISOString(),
  payload: { /* ... */ }
})
```

### Pattern 3: Brand-Level Pause Flag
**What:** Boolean `auto_scan_enabled` on brands table (default: true) to allow users to pause automated scans
**When to use:** User settings page, cron job filtering
**Example:**
```typescript
// Source: User decisions in CONTEXT.md
const { data: brands } = await supabase
  .from('brands')
  .select(`*, users!inner(*)`)
  .eq('status', 'active')
  .eq('auto_scan_enabled', true) // Filter paused brands

// In brand settings:
await supabase
  .from('brands')
  .update({ auto_scan_enabled: false })
  .eq('id', brandId)
```

### Pattern 4: Partial Index for Scheduling Query
**What:** Index only brands with `auto_scan_enabled = true` and `status = 'active'`
**When to use:** Optimizing the cron job's brand selection query
**Example:**
```sql
-- Source: PostgreSQL partial index pattern
CREATE INDEX idx_brands_auto_scan_scheduling
  ON public.brands (last_scan_at, user_id)
  WHERE status = 'active' AND auto_scan_enabled = true;
```

### Anti-Patterns to Avoid
- **Multiple cron jobs per tier:** Wastes cron job quota (100 max), adds configuration complexity, doesn't provide benefits over single job with filtering
- **Catch-up logic for missed scans:** Adds complexity, can create thundering herd if system was down, better to wait for next natural tick
- **Math.random() for jitter:** Not cryptographically secure, use `crypto.randomInt` instead
- **Calendar-based scheduling (midnight resets):** Creates synchronized load spikes, use rolling windows instead

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cron scheduling | Custom scheduler daemon | Vercel Cron Jobs | Built-in, production-only execution, automatic security headers, no infrastructure |
| Random jitter | Math.random() * range | crypto.randomInt(min, max) | Cryptographically secure, standard library, prevents prediction |
| Retry logic | Custom retry in cron | Existing scan_jobs retry infrastructure | Already has exponential backoff with full jitter (Phase 2) |
| Concurrent run prevention | Custom locking | Check scan_jobs for queued/running status | Already implemented in existing code (line 66-77) |
| Timestamp queries | Custom date math | PostgreSQL timestamp operators | Database-native, indexed, efficient |

**Key insight:** Vercel Cron Jobs handle scheduling reliability, production-only execution, and invocation logging automatically. Don't reimplement infrastructure — use the platform feature.

## Common Pitfalls

### Pitfall 1: Function Timeout on Large Brand Counts
**What goes wrong:** Cron job tries to process 100+ brands in one invocation, hits 60-second timeout (Pro tier limit)
**Why it happens:** Iterating brands with database queries in a loop is slow, especially with RLS checks
**How to avoid:**
- Limit batch size per invocation (e.g., process first 50 brands, rest wait for next tick)
- Use efficient single query with joins instead of per-brand queries
- Consider pagination if brand count exceeds ~100
**Warning signs:** 504 FUNCTION_INVOCATION_TIMEOUT errors in cron logs

### Pitfall 2: Thundering Herd Without Jitter
**What goes wrong:** All hourly scans start at exactly :00, overloading external APIs and database
**Why it happens:** Cron runs precisely on schedule, creating synchronized load spike
**How to avoid:** Add random jitter (0-5 minutes) to `scheduled_at` timestamp, spreading load across the hour
**Warning signs:** API rate limit errors clustered at top of hour, database connection spikes

### Pitfall 3: Boolean Index on Low-Cardinality Column
**What goes wrong:** Adding index on `auto_scan_enabled` boolean wastes space, doesn't improve performance
**Why it happens:** Most brands have `auto_scan_enabled = true`, so index doesn't filter much
**How to avoid:** Use partial index with WHERE clause: `WHERE status = 'active' AND auto_scan_enabled = true`
**Warning signs:** Large index size with minimal query improvement

### Pitfall 4: Cron Expression Confusion (Days vs Hours)
**What goes wrong:** Using `0 */24 * * *` for daily schedule instead of `0 0 * * *`, causing 24 invocations per day
**Why it happens:** Confusion between "every 24 hours" and "once per day at midnight"
**How to avoid:**
- Hourly: `0 * * * *` (minute 0 of every hour)
- Every 6 hours: `0 */6 * * *` (minute 0 of hours 0, 6, 12, 18)
- Daily: `0 0 * * *` (minute 0 of hour 0 = midnight UTC)
**Warning signs:** Unexpected cron invocation count in logs

### Pitfall 5: Vercel Cron Doesn't Follow Redirects
**What goes wrong:** Endpoint returns 3xx redirect, cron job completes without running logic
**Why it happens:** Vercel Cron treats redirects as final responses, doesn't follow them
**How to avoid:** Ensure cron endpoint returns 200 with actual processing, no middleware redirects
**Warning signs:** Cron logs show 200 responses but no scans created

### Pitfall 6: Forgetting Production-Only Execution
**What goes wrong:** Local testing with `next dev` doesn't trigger cron jobs, false sense of failure
**Why it happens:** Vercel Cron only runs in production deployments, not local or preview
**How to avoid:** Test cron endpoint directly via HTTP GET in local development, deploy to production for actual cron testing
**Warning signs:** Cron job works after deploy but not in local testing

### Pitfall 7: RLS Performance on Joined Queries
**What goes wrong:** Query with `users!inner(*)` join becomes slow on large user tables with RLS policies
**Why it happens:** RLS adds WHERE clause to every query, joined queries check policies on both tables
**How to avoid:** Use service client (bypasses RLS) for cron jobs, which run server-side with admin privileges
**Warning signs:** Query fast in SQL editor, slow in API route

## Code Examples

Verified patterns from official sources:

### Vercel Cron Configuration (Hourly)
```json
// Source: https://vercel.com/docs/cron-jobs
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    {
      "path": "/api/cron/scan",
      "schedule": "0 * * * *"
    }
  ]
}
```

### Cron Job Authorization Header Check
```typescript
// Source: https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Process cron job
}
```

### Crypto-Based Jitter Implementation
```typescript
// Source: https://nodejs.org/api/crypto.html#cryptorandomintmin-max-callback
import { randomInt } from 'crypto'

// Generate random jitter between 0-5 minutes (0-300000ms)
const jitterMs = randomInt(0, 5 * 60 * 1000)
const scheduledAt = new Date(Date.now() + jitterMs)
```

### Efficient Scheduling Query with Service Client
```typescript
// Source: Existing codebase pattern + Supabase best practices
import { createServiceClient } from '@/lib/supabase/server'

const supabase = await createServiceClient() // Bypasses RLS
const { data: brands } = await supabase
  .from('brands')
  .select(`
    *,
    users!inner(
      id,
      email,
      subscription_status,
      subscription_tier
    )
  `)
  .eq('status', 'active')
  .eq('auto_scan_enabled', true) // Filter paused brands
```

### Partial Index for Scheduling Query
```sql
-- Source: https://www.heap.io/blog/speeding-up-postgresql-queries-with-partial-indexes
-- Indexes only active brands with auto-scan enabled
CREATE INDEX idx_brands_auto_scan_scheduling
  ON public.brands (last_scan_at DESC, user_id)
  WHERE status = 'active' AND auto_scan_enabled = true;

COMMENT ON INDEX idx_brands_auto_scan_scheduling IS
  'Optimizes cron job scheduling query by indexing only scannable brands';
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Days-based frequency | Hours-based frequency | 2025+ (Vercel hourly cron) | More granular tier differentiation (6hr Pro vs hourly Enterprise) |
| Math.random() | crypto.randomInt() | Node.js 10+ | Cryptographically secure jitter, prevents prediction |
| Full table index | Partial index with WHERE | PostgreSQL 9.2+ | 90%+ space savings for low-cardinality filters |
| Manual locking | scan_jobs status check | Existing pattern | Simpler, leverages existing queue infrastructure |

**Deprecated/outdated:**
- `Math.random()` for jitter: Use `crypto.randomInt()` instead (cryptographically secure)
- Calendar-based scheduling: Use rolling windows based on `last_scan_at` (avoids synchronized spikes)
- Separate cron jobs per tier: Single job with filtering is simpler and counts as 1 cron job

## Open Questions

Things that couldn't be fully resolved:

1. **Should logging include skipped brands?**
   - What we know: Current code logs errors but not skip reasons
   - What's unclear: Whether `results.skipped++` counter is sufficient or if per-brand skip reasons help debugging
   - Recommendation: Start with counter only, add per-brand logging if debugging needs arise (can be noisy with 100+ brands)

2. **Index strategy for multi-column scheduling query**
   - What we know: Partial indexes recommended for low-cardinality filters (status, auto_scan_enabled)
   - What's unclear: Whether composite index `(last_scan_at, user_id)` or just `(last_scan_at)` performs better
   - Recommendation: Start with `(last_scan_at DESC)` only in partial index, add `user_id` if query planner shows sequential scan

3. **Batch size limit for timeout prevention**
   - What we know: Pro tier has 60-second function timeout
   - What's unclear: How many brands can be processed in 60 seconds (depends on database latency, RLS overhead)
   - Recommendation: No hard limit initially (process all eligible brands), monitor logs for timeouts, add pagination if needed

## Sources

### Primary (HIGH confidence)
- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs) - Cron configuration, schedule syntax
- [Vercel Cron Jobs Management](https://vercel.com/docs/cron-jobs/manage-cron-jobs) - Security, duration limits, error handling
- [Vercel Limits](https://vercel.com/docs/limits) - Function timeouts, cron job counts
- [Node.js Crypto API](https://nodejs.org/api/crypto.html) - `crypto.randomInt()` documentation

### Secondary (MEDIUM confidence)
- [Efficient PostgreSQL Indexes (Heroku)](https://devcenter.heroku.com/articles/postgresql-indexes) - B-tree indexing strategies
- [Partial Indexes (Heap)](https://www.heap.io/blog/speeding-up-postgresql-queries-with-partial-indexes) - WHERE clause optimization
- [PostgreSQL Index Best Practices (MyDBOps)](https://www.mydbops.com/blog/postgresql-indexing-best-practices-guide) - Composite index column order
- [Exponential Backoff with Jitter (Medium)](https://medium.com/@avnein4988/mitigating-the-thundering-herd-problem-exponential-backoff-with-jitter-b507cdf90d62) - Jitter implementation patterns

### Tertiary (LOW confidence - WebSearch only)
- [Next.js Cron Best Practices (Schedo.dev)](https://www.schedo.dev/nextjs) - General patterns, not Vercel-specific
- [Supabase Performance Tuning](https://supabase.com/docs/guides/platform/performance) - Query optimization tips

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Vercel Cron is the built-in solution, crypto is standard library
- Architecture: HIGH - Patterns verified with official docs and existing codebase
- Pitfalls: MEDIUM - Based on WebSearch findings + Vercel documentation, not direct experience

**Research date:** 2026-01-27
**Valid until:** 2026-02-27 (30 days - Vercel features stable, cron patterns mature)
