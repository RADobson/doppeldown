# Phase 3: Manual Scan Limits - Research

**Researched:** 2026-01-27
**Domain:** Quota enforcement, rolling time windows, freemium upgrade walls
**Confidence:** HIGH

## Summary

Phase 3 implements tier-based manual scan quotas with rolling 7-day windows. Free tier users get 1 manual scan per week, paid tiers get unlimited. The phase requires tracking scan usage per user, displaying quota status inline with scan buttons, and blocking exhausted users with upgrade CTAs.

**Core technical challenge:** Implement a rolling time window quota system that tracks first scan timestamp, calculates remaining quota, and resets automatically after 7 days without calendar-week complexity.

**Primary recommendation:** Store `manual_scans_period_start` timestamp in users table. Count scans since that timestamp. Reset period automatically when 7 days elapsed. Use database-side timestamp math for accuracy. Display quota inline with scan button state.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| PostgreSQL timestamp | Built-in | Track period start time | Native TIMESTAMP WITH TIME ZONE provides timezone-aware, microsecond-precision tracking |
| React useState | Built-in | Button disabled state | Standard React pattern for managing UI state based on quota |
| Next.js API Routes | 14.x | Quota enforcement | Server-side validation prevents client-side bypass |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Supabase RPC | 2.x | Complex quota queries | If quota logic becomes complex enough to warrant stored procedures |
| React Context | Built-in | Share quota state | If multiple components need quota data (likely not needed for this phase) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Rolling window | Fixed calendar week | Simpler but unfair to mid-week signups; user decided rolling |
| Timestamp in users | Separate usage_logs table | More flexible but overkill for single quota; adds query complexity |
| Client countdown | No countdown | User wanted countdown option left to Claude's discretion |

**Installation:**
No additional packages needed - using built-in Next.js, React, and PostgreSQL features.

## Architecture Patterns

### Recommended Database Schema
```sql
-- Add to users table via migration
ALTER TABLE users
ADD COLUMN manual_scans_period_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN manual_scans_count INTEGER DEFAULT 0;

-- Optional: Add index for quota queries
CREATE INDEX idx_users_manual_scan_period
ON users(manual_scans_period_start)
WHERE manual_scans_period_start IS NOT NULL;
```

**Why this schema:**
- `manual_scans_period_start`: First scan timestamp of current period (NULL = no scans yet)
- `manual_scans_count`: Cached count for performance (avoid counting scans table each request)
- Period automatically resets when `NOW() - manual_scans_period_start > 7 days`

### Pattern 1: Rolling Window Quota Check
**What:** Calculate if user is within quota by checking period start timestamp and count
**When to use:** Every manual scan request (POST /api/scan)
**Example:**
```typescript
// Source: Derived from Apigee rolling window pattern + PostgreSQL timestamp math
// In /api/scan route.ts

const { data: userData } = await supabase
  .from('users')
  .select('subscription_tier, subscription_status, is_admin, manual_scans_period_start, manual_scans_count')
  .eq('id', user.id)
  .single()

// Admin bypass (Phase 1 pattern)
if (!userData?.is_admin && effectiveTier === 'free') {
  const now = new Date()
  const periodStart = userData?.manual_scans_period_start

  // Check if period expired (7 days = 604800000 ms)
  const periodExpired = !periodStart ||
    (now.getTime() - new Date(periodStart).getTime() > 604800000)

  if (periodExpired) {
    // Reset period
    await supabase
      .from('users')
      .update({
        manual_scans_period_start: now.toISOString(),
        manual_scans_count: 0
      })
      .eq('id', user.id)
  } else {
    // Check quota
    const scansUsed = userData.manual_scans_count || 0
    if (scansUsed >= 1) {
      return NextResponse.json(
        {
          error: 'Manual scan quota exceeded',
          quota: { limit: 1, used: scansUsed, resetsAt: new Date(periodStart).getTime() + 604800000 }
        },
        { status: 429 }
      )
    }
  }

  // Increment count
  await supabase
    .from('users')
    .update({ manual_scans_count: (userData.manual_scans_count || 0) + 1 })
    .eq('id', user.id)
}
```

### Pattern 2: Quota Status Display
**What:** Fetch quota status and display remaining scans inline with button
**When to use:** Brand detail page, anywhere manual scan button appears
**Example:**
```typescript
// Source: React disabled button patterns + freemium upgrade prompt best practices
// In brands/[id]/page.tsx

interface QuotaStatus {
  limit: number
  used: number
  remaining: number
  resetsAt: number | null
  isUnlimited: boolean
}

const fetchQuotaStatus = async (): Promise<QuotaStatus> => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users')
    .select('subscription_tier, subscription_status, is_admin, manual_scans_period_start, manual_scans_count')
    .eq('id', user.id)
    .single()

  const effectiveTier = getEffectiveTier(userData?.subscription_status, userData?.subscription_tier)

  if (userData?.is_admin || effectiveTier !== 'free') {
    return { limit: Infinity, used: 0, remaining: Infinity, resetsAt: null, isUnlimited: true }
  }

  const periodStart = userData?.manual_scans_period_start
  const scansUsed = userData?.manual_scans_count || 0
  const limit = 1

  // Check if period expired
  const now = Date.now()
  const periodExpired = !periodStart || (now - new Date(periodStart).getTime() > 604800000)

  if (periodExpired) {
    return { limit, used: 0, remaining: limit, resetsAt: null, isUnlimited: false }
  }

  return {
    limit,
    used: scansUsed,
    remaining: Math.max(0, limit - scansUsed),
    resetsAt: new Date(periodStart).getTime() + 604800000,
    isUnlimited: false
  }
}

// Button rendering
<Button
  variant="outline"
  onClick={handleScan}
  disabled={scanning || (quotaStatus && quotaStatus.remaining === 0)}
>
  {scanning ? (
    <>
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      Scanning...
    </>
  ) : quotaStatus?.remaining === 0 ? (
    <>Upgrade to scan</>
  ) : quotaStatus && !quotaStatus.isUnlimited ? (
    <>
      <Play className="h-4 w-4 mr-2" />
      Scan Now · {quotaStatus.remaining} left this week
    </>
  ) : (
    <>
      <Play className="h-4 w-4 mr-2" />
      Run Scan
    </>
  )}
</Button>
```

### Pattern 3: Upgrade CTA Modal
**What:** Show empathetic upgrade prompt when quota exhausted
**When to use:** User clicks scan button with 0 remaining quota
**Example:**
```typescript
// Source: Appcues freemium upgrade prompts best practices
// Separate modal component or inline message

{quotaStatus?.remaining === 0 && (
  <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 mb-4">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-blue-100 rounded-lg">
        <AlertCircle className="h-5 w-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-blue-900 mb-1">
          You've used your free scan this week
        </h3>
        <p className="text-sm text-blue-800 mb-3">
          Upgrade for unlimited manual scans, automated monitoring, and more.
        </p>
        <Link href="/pricing">
          <Button size="sm">View plans</Button>
        </Link>
      </div>
    </div>
  </div>
)}
```

### Pattern 4: PostgreSQL Period Reset Query
**What:** Database-side query to check and reset expired periods atomically
**When to use:** Alternative to application-level reset logic for consistency
**Example:**
```sql
-- Source: PostgreSQL timestamp arithmetic patterns
-- Can be used in stored procedure or direct query

WITH period_check AS (
  SELECT
    id,
    manual_scans_period_start,
    manual_scans_count,
    CASE
      WHEN manual_scans_period_start IS NULL THEN true
      WHEN EXTRACT(EPOCH FROM (NOW() - manual_scans_period_start)) > 604800 THEN true
      ELSE false
    END AS period_expired
  FROM users
  WHERE id = $1
)
UPDATE users
SET
  manual_scans_period_start = CASE WHEN period_check.period_expired THEN NOW() ELSE users.manual_scans_period_start END,
  manual_scans_count = CASE WHEN period_check.period_expired THEN 0 ELSE users.manual_scans_count END
FROM period_check
WHERE users.id = period_check.id
RETURNING
  users.manual_scans_count,
  users.manual_scans_period_start,
  period_check.period_expired;
```

### Anti-Patterns to Avoid
- **Counting scans table on every request:** Slow, doesn't scale. Cache count in users table.
- **Calendar week boundaries:** User decided against this - rolling window is fairer.
- **Client-side quota enforcement only:** Must validate server-side to prevent bypass.
- **Separate period_end column:** Redundant - calculate end as `start + 7 days`.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Timestamp math precision | Custom date arithmetic | PostgreSQL EXTRACT(EPOCH) + division | Handles timezones, leap seconds, DST automatically |
| Countdown timer component | Custom setInterval logic | React useEffect with cleanup | Prevents memory leaks, handles unmount properly |
| 429 quota error format | Custom error shape | Standard HTTP 429 with Retry-After | Industry standard, tools recognize it |
| Period reset race conditions | Application-level locking | PostgreSQL transaction isolation | Database handles concurrent updates atomically |

**Key insight:** Timestamp arithmetic is deceptively complex (timezones, DST, leap seconds). Let PostgreSQL handle it with native TIMESTAMP WITH TIME ZONE and EXTRACT functions.

## Common Pitfalls

### Pitfall 1: Race Condition on Period Reset
**What goes wrong:** Two concurrent scan requests both see expired period, both reset it, both allow scan
**Why it happens:** Period check and reset are separate operations without locking
**How to avoid:**
- Use database transaction with `BEGIN` and `COMMIT`
- Check period and increment count in single atomic UPDATE
- Or use optimistic locking with `WHERE manual_scans_period_start = $expected_value`
**Warning signs:** Free tier users report getting multiple scans in same period

### Pitfall 2: Timezone Confusion
**What goes wrong:** Period resets at wrong time for users in different timezones
**Why it happens:** Mixing `Date.now()` (UTC milliseconds) with local timezone date objects
**How to avoid:**
- Always use `TIMESTAMP WITH TIME ZONE` in PostgreSQL
- Always use `new Date().toISOString()` when writing timestamps
- Always calculate durations in milliseconds or use `EXTRACT(EPOCH)`
**Warning signs:** Users report quota reset at unexpected times

### Pitfall 3: Cached Quota Status Stale
**What goes wrong:** User scans, button still shows "1 left" until page refresh
**Why it happens:** Quota status fetched once on mount, not invalidated after scan
**How to avoid:**
- Refetch quota status after successful scan
- Optimistically update local state on scan start
- Use SWR or React Query for automatic revalidation
**Warning signs:** Users confused why button says "1 left" but scan fails with quota error

### Pitfall 4: Forgetting Admin Bypass
**What goes wrong:** Admins get quota-limited like normal users
**Why it happens:** Quota check doesn't follow Phase 1 `!userData?.is_admin &&` pattern
**How to avoid:**
- Always check `!userData?.is_admin &&` before tier-based limits
- Grep codebase for existing admin bypass pattern and follow it
- Test with admin account before deploying
**Warning signs:** Admin reports being blocked from scanning test brands

### Pitfall 5: Count Increment Without Period Start
**What goes wrong:** First scan increments count to 1 but period_start stays NULL, quota appears unlimited
**Why it happens:** Count increment and period start initialization are separate
**How to avoid:**
- Initialize period_start in same operation as first count increment
- Use `COALESCE(manual_scans_period_start, NOW())` pattern
- Validate period_start is not NULL before checking quota
**Warning signs:** Free tier users can scan multiple times immediately after signup

## Code Examples

Verified patterns from official sources:

### PostgreSQL 7-Day Period Check
```sql
-- Source: PostgreSQL date/time functions documentation
-- https://www.postgresql.org/docs/current/functions-datetime.html

-- Check if 7 days (604800 seconds) have elapsed
SELECT
  EXTRACT(EPOCH FROM (NOW() - manual_scans_period_start)) > 604800 AS period_expired
FROM users
WHERE id = $1;

-- Or using interval arithmetic
SELECT
  (NOW() - manual_scans_period_start) > INTERVAL '7 days' AS period_expired
FROM users
WHERE id = $1;
```

### React Quota Status Hook
```typescript
// Source: React hooks patterns + SWR-style revalidation
// Custom hook for quota status with automatic refresh

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getEffectiveTier } from '@/lib/tier-limits'

interface QuotaStatus {
  limit: number
  used: number
  remaining: number
  resetsAt: number | null
  isUnlimited: boolean
}

export function useQuotaStatus() {
  const [quota, setQuota] = useState<QuotaStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchQuota = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: userData } = await supabase
        .from('users')
        .select('subscription_tier, subscription_status, is_admin, manual_scans_period_start, manual_scans_count')
        .eq('id', user.id)
        .single()

      const effectiveTier = getEffectiveTier(
        userData?.subscription_status,
        userData?.subscription_tier
      )

      if (userData?.is_admin || effectiveTier !== 'free') {
        setQuota({
          limit: Infinity,
          used: 0,
          remaining: Infinity,
          resetsAt: null,
          isUnlimited: true
        })
        return
      }

      const periodStart = userData?.manual_scans_period_start
      const scansUsed = userData?.manual_scans_count || 0
      const limit = 1
      const now = Date.now()
      const periodExpired = !periodStart ||
        (now - new Date(periodStart).getTime() > 604800000)

      if (periodExpired) {
        setQuota({ limit, used: 0, remaining: limit, resetsAt: null, isUnlimited: false })
      } else {
        setQuota({
          limit,
          used: scansUsed,
          remaining: Math.max(0, limit - scansUsed),
          resetsAt: new Date(periodStart).getTime() + 604800000,
          isUnlimited: false
        })
      }
    } catch (error) {
      console.error('Error fetching quota:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuota()
  }, [])

  return { quota, loading, refetch: fetchQuota }
}
```

### Countdown Timer Component (Optional)
```typescript
// Source: React useEffect timer patterns
// Optional component to show "resets in X days" countdown

import { useState, useEffect } from 'react'

interface CountdownProps {
  targetTimestamp: number
}

export function QuotaResetCountdown({ targetTimestamp }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now()
      const diff = targetTimestamp - now

      if (diff <= 0) {
        setTimeLeft('Quota reset')
        return
      }

      const days = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)

      if (days > 0) {
        setTimeLeft(`Resets in ${days}d ${hours}h`)
      } else if (hours > 0) {
        setTimeLeft(`Resets in ${hours}h ${minutes}m`)
      } else {
        setTimeLeft(`Resets in ${minutes}m`)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [targetTimestamp])

  return <span className="text-xs text-gray-500">{timeLeft}</span>
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Fixed calendar week quotas | Rolling time windows | 2020s | Fairer to users, no gaming by waiting for week boundary |
| Count scans on every request | Cache count in user record | Always preferred | Scales better, faster API responses |
| Client-side quota display only | Server-side enforcement required | Security standard | Prevents quota bypass via API directly |
| Generic "upgrade" CTA | Empathetic "you discovered a premium feature" messaging | Freemium best practice 2020s | Higher conversion, better UX |

**Deprecated/outdated:**
- Fixed calendar weeks: User explicitly chose rolling window approach in CONTEXT.md
- Countdown timers without purpose: User left as Claude's discretion, only add if enhances clarity

## Open Questions

Things that couldn't be fully resolved:

1. **Countdown timer display decision**
   - What we know: User left as Claude's discretion whether to show "resets in X days"
   - What's unclear: Does seeing countdown help or add clutter for 1-scan-per-week limit?
   - Recommendation: Implement countdown timer component but only show on hover/tooltip, not inline. Less visual clutter but available if user wants to know.

2. **Brand card quota badge placement**
   - What we know: User wants quota status badge on dashboard brand cards for Free tier
   - What's unclear: Exact position (top-right corner? Below brand name? Near scan button?)
   - Recommendation: Small badge in top-right corner of brand card, matches scan button state. Only visible for Free tier users.

3. **Multiple brands quota sharing**
   - What we know: Free tier limited to 1 brand (Phase 1), so should be 1 scan total not per-brand
   - What's unclear: Does quota count toward user's single brand or hypothetically per-brand?
   - Recommendation: Quota is per-user (not per-brand) since Free tier has 1 brand. If user deletes brand and creates new one, quota still applies.

## Sources

### Primary (HIGH confidence)
- PostgreSQL Date/Time Documentation: https://www.postgresql.org/docs/current/functions-datetime.html - Timestamp arithmetic patterns
- React Official Documentation: https://react.dev/learn/managing-state - State management patterns
- PostgreSQL PopSQL Guide: https://popsql.com/learn-sql/postgresql/how-to-query-date-and-time-in-postgresql - Timestamp queries
- Existing codebase: tier-limits.ts, /api/scan/route.ts, brands/[id]/page.tsx - Admin bypass pattern, scan flow

### Secondary (MEDIUM confidence)
- Apigee Quota Policy Docs: https://docs.apigee.com/api-platform/reference/policies/quota-policy - Rolling window vs fixed window tradeoffs
- Appcues Freemium Prompts: https://www.appcues.com/blog/best-freemium-upgrade-prompts - Upgrade CTA messaging best practices
- VWO CTA Guide: https://vwo.com/blog/call-to-action-buttons-ultimate-guide/ - Disabled button states and upgrade CTAs
- GeeksforGeeks Event Sourcing: https://www.geeksforgeeks.org/dbms/event-sourcing-database-design-patterns/ - Timestamp tracking patterns
- Medium User Activity Tracking: https://medium.com/@TheGenerativeMind/tracking-user-activity-efficiently-with-postgresql-a-step-by-step-guide-cb111ad82740 - PostgreSQL activity tracking

### Tertiary (LOW confidence)
- React Countdown Libraries: https://blog.croct.com/post/best-react-countdown-timer-libraries - Timer implementation options (not critical path)
- Transactional Outbox Pattern: https://james-carr.org/posts/2026-01-15-transactional-outbox-pattern/ - Advanced pattern if needed for event consistency

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using built-in PostgreSQL, React, Next.js features only
- Architecture: HIGH - Patterns verified against PostgreSQL docs and existing codebase admin bypass
- Pitfalls: HIGH - Based on race condition knowledge and timezone handling experience
- Quota display: MEDIUM - UI patterns from freemium articles not codebase-specific
- Countdown timer: LOW - User left as discretion, not critical path

**Research date:** 2026-01-27
**Valid until:** 30 days (stable domain - quota patterns well-established)
