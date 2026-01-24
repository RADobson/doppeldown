# Phase 1: Admin Foundation - Research

**Researched:** 2026-01-24
**Domain:** Database schema modification, tier enforcement, admin privilege systems
**Confidence:** HIGH

## Summary

This phase adds an `is_admin` boolean column to the users table and fixes broken tier enforcement for brand creation limits. The existing codebase has incorrect BRAND_LIMITS (Starter=1, Professional=3, Enterprise=10) that don't match requirements (Free=1, Starter=3, Pro=10, Enterprise=unlimited). The enforcement logic exists but uses wrong values.

The standard approach for admin bypass in Supabase is adding a boolean column to the public.users table (not using auth.app_metadata), then checking this flag in application code. RLS bypass using BYPASSRLS role attribute is not recommended for this use case since the app uses a single service role key, not per-user database roles.

**Primary recommendation:** Add `is_admin BOOLEAN DEFAULT false` column via migration, update brand limit constants to match tier definitions, implement admin bypass in API routes by checking the column before enforcing limits.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| PostgreSQL | (Supabase) | Database with boolean columns | Native boolean type, indexed efficiently |
| Supabase Auth | 2.47.0 | User authentication | Already integrated, manages auth.users table |
| Supabase Client | 2.47.0 | Database operations | Type-safe queries, RLS-aware |
| Next.js API Routes | 14.2.35 | Request handling | Server-side logic execution, integrated with framework |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Supabase CLI | Latest | Migration management | Creating and applying database migrations |
| TypeScript | 5.7.2 | Type safety | Interface definitions for User type with is_admin |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Database column | auth.app_metadata | Metadata harder to query/index, requires JWT refresh to update |
| Database column | Separate admin_users table | Adds join complexity, foreign key management |
| Application check | RLS BYPASSRLS role | Requires per-user database roles (not feasible with service key model) |

**Installation:**
No new dependencies required — using existing stack.

## Architecture Patterns

### Recommended Project Structure
```
supabase/
├── migrations/        # Timestamped SQL files
│   └── YYYYMMDDHHMMSS_add_admin_column.sql
└── seed.sql          # Optional: seed admin users for dev

src/app/api/
└── brands/
    └── route.ts      # Enforce limits here, check is_admin
```

### Pattern 1: Database Migration for Boolean Column
**What:** Use Supabase CLI to generate migration, add column with default value
**When to use:** Any schema change (this is the only safe way)
**Example:**
```sql
-- Migration: add is_admin column
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create index for efficient admin checks
CREATE INDEX IF NOT EXISTS idx_users_is_admin
ON public.users(is_admin) WHERE is_admin = true;

-- Optional: promote specific user to admin
-- UPDATE public.users SET is_admin = true WHERE email = 'admin@example.com';
```
**Source:** [Supabase Database Migrations](https://supabase.com/docs/guides/deployment/database-migrations)

### Pattern 2: Tier Enforcement with Admin Bypass
**What:** Check user's is_admin flag before enforcing resource limits
**When to use:** Any API route that creates/updates resources with tier limits
**Example:**
```typescript
// In API route (brands/route.ts)
const { data: userData } = await supabase
  .from('users')
  .select('subscription_status, subscription_tier, is_admin')
  .eq('id', user.id)
  .single()

// Admin bypass - skip all limit checks
if (userData?.is_admin) {
  // Allow operation without limit check
  // Proceed to create brand
}

// Regular tier enforcement
const effectiveTier = userData.subscription_status === 'active'
  ? userData.subscription_tier
  : 'free'
const brandLimit = BRAND_LIMITS[effectiveTier] ?? BRAND_LIMITS.free

// Check existing count against limit
const { count: existingBrands } = await supabase
  .from('brands')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', user.id)

if (existingBrands >= brandLimit) {
  return NextResponse.json(
    { error: `Brand limit reached for ${effectiveTier} tier`, code: 'BRAND_LIMIT_REACHED' },
    { status: 403 }
  )
}
```

### Pattern 3: Correct Brand Limit Constants
**What:** Define tier limits matching product requirements
**When to use:** Wherever tier limits are referenced
**Example:**
```typescript
const BRAND_LIMITS: Record<string, number> = {
  free: 1,
  starter: 3,
  professional: 10,
  enterprise: Infinity, // or Number.MAX_SAFE_INTEGER
}
```

### Pattern 4: Tier Downgrade Handling (Deferred Decision)
**What:** User downgrades from Pro (3 brands) to Free (1 brand) with 3 existing brands
**When to use:** Subscription downgrade webhook, user-initiated plan changes
**Common approaches:**
- **Read-only mode:** Block creation of new brands, allow viewing existing ones
- **Scheduled enforcement:** Apply limit at next billing cycle (grace period)
- **Immediate hard block:** Prevent access until user deletes brands or upgrades
- **Soft warning:** Show warning banner but don't block (temporary grace)

**No consensus pattern found** — this is a product/UX decision. Research shows SaaS platforms split between immediate enforcement and grace periods.

**Recommendation for Phase 1:** Only enforce limits on brand **creation** (not deletion, not existing brands). Defer downgrade over-limit handling to later phase or product decision.

### Anti-Patterns to Avoid
- **Don't use subscription_tier directly** — check subscription_status first, default to 'free' if inactive
- **Don't skip admin checks in every route** — forgetting admin bypass creates bad UX for admin users
- **Don't use undefined for unlimited** — use Infinity or Number.MAX_SAFE_INTEGER for type safety
- **Don't add RLS policies for is_admin column** — application-level checks sufficient, RLS adds complexity

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Database migrations | Manual SQL in production | Supabase CLI migrations | Version control, rollback capability, idempotency |
| Password hashing for seed users | Custom bcrypt | auth.admin.createUser() API | Supabase handles hashing, salting, auth.identities linking |
| Admin role in JWT | Custom JWT claims | Database column check | Simpler, no JWT refresh needed, queryable |
| Unlimited tier value | null or -1 | Number.MAX_SAFE_INTEGER or Infinity | Type-safe comparisons, no special case logic |

**Key insight:** Supabase provides battle-tested migration tooling and auth APIs — don't reinvent these wheels with custom SQL execution or manual password management.

## Common Pitfalls

### Pitfall 1: Migration Doesn't Use IF NOT EXISTS
**What goes wrong:** Re-running migration fails with "column already exists" error
**Why it happens:** ALTER TABLE ADD COLUMN without IF NOT EXISTS is not idempotent
**How to avoid:** Always use `ADD COLUMN IF NOT EXISTS` in migrations
**Warning signs:** Migration works first time, fails on db reset

### Pitfall 2: Brand Limits Don't Match Pricing Page
**What goes wrong:** Users see "3 brands" on pricing page but get blocked at 1 brand
**Why it happens:** BRAND_LIMITS constants hardcoded incorrectly (current bug in codebase)
**How to avoid:** Cross-reference BRAND_LIMITS in brands/route.ts with pricing/page.tsx feature lists
**Warning signs:** Customer support tickets about "brand limit reached" despite paying

### Pitfall 3: Admin Flag Not Fetched in Existing Query
**What goes wrong:** Admin checks fail because is_admin column not SELECTed
**Why it happens:** Existing queries fetch specific columns, not SELECT *
**How to avoid:** Update .select() calls to include 'is_admin' field
**Warning signs:** userData?.is_admin always undefined

### Pitfall 4: Free Tier With Active Status Gets Paid Limits
**What goes wrong:** Free users with subscription_status='active' get wrong limits
**Why it happens:** Logic checks subscription_status before subscription_tier
**How to avoid:** Effective tier = subscription_status === 'active' ? subscription_tier : 'free'
**Warning signs:** Free users creating 3+ brands

### Pitfall 5: Forgetting Index on is_admin Column
**What goes wrong:** Admin checks become slow with many users
**Why it happens:** Full table scan to find is_admin = true
**How to avoid:** Create partial index: WHERE is_admin = true (only indexes admins)
**Warning signs:** API latency increases as user count grows

### Pitfall 6: Seeding admin.users Without auth.identities Entry
**What goes wrong:** Seeded admin cannot log in
**Why it happens:** Supabase auth requires corresponding auth.identities row
**How to avoid:** Use auth.admin.createUser() API or manually insert both tables
**Warning signs:** "Invalid login credentials" for seeded admin email
**Source:** [Supabase Discussion #35391](https://github.com/orgs/supabase/discussions/35391)

## Code Examples

Verified patterns from official sources:

### Database Migration File
```sql
-- Migration: YYYYMMDDHHMMSS_add_admin_column.sql
-- Description: Add is_admin flag to users table for privilege bypass

-- Add admin column with safe default
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.users.is_admin IS
  'Admin users bypass all tier limits (brand count, scan quotas)';

-- Create partial index for efficient admin lookups
-- Only indexes rows where is_admin = true (small subset)
CREATE INDEX IF NOT EXISTS idx_users_is_admin
ON public.users(is_admin)
WHERE is_admin = true;

-- Optional: Promote first user to admin for development
-- UPDATE public.users
-- SET is_admin = true
-- WHERE email = 'admin@example.com';
```
**Source:** [Supabase Migrations Best Practices](https://supabase.com/docs/guides/deployment/database-migrations)

### TypeScript Interface Update
```typescript
// src/types/index.ts
export interface User {
  id: string;
  email: string;
  created_at: string;
  subscription_status: 'free' | 'active' | 'cancelled' | 'past_due';
  subscription_tier: 'free' | 'starter' | 'professional' | 'enterprise';
  subscription_id?: string;
  customer_id?: string;
  is_admin?: boolean; // Add this field
}
```

### Corrected Brand Limits
```typescript
// src/app/api/brands/route.ts
const BRAND_LIMITS: Record<string, number> = {
  free: 1,
  starter: 3,
  professional: 10,
  enterprise: Number.MAX_SAFE_INTEGER, // Unlimited
}
```

### Admin Bypass Check
```typescript
// src/app/api/brands/route.ts - POST handler
const { data: userData } = await supabase
  .from('users')
  .select('subscription_status, subscription_tier, is_admin')
  .eq('id', user.id)
  .single()

// Admin bypass - skip limit enforcement entirely
if (userData?.is_admin) {
  // Admins can create unlimited brands
  // Skip to brand creation logic
  const { data: brand, error } = await supabase
    .from('brands')
    .insert({ user_id: user.id, name, domain, ... })
    .select()
    .single()

  return NextResponse.json(brand)
}

// Regular tier enforcement for non-admins
const effectiveTier = userData.subscription_status === 'active'
  ? userData.subscription_tier
  : 'free'
const brandLimit = BRAND_LIMITS[effectiveTier] ?? BRAND_LIMITS.free

// ... rest of limit check logic
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| auth.app_metadata for roles | Database column for is_admin | ~2024 | Easier querying, no JWT refresh needed |
| RLS policies for admin bypass | Application-level checks | Ongoing | Simpler logic, better performance |
| Manual SQL for migrations | Supabase CLI migrations | Since Supabase v1 | Version control, idempotency |
| null for unlimited | Number.MAX_SAFE_INTEGER | TypeScript best practice | Type-safe comparisons |

**Deprecated/outdated:**
- **RLS BYPASSRLS attribute for admin users**: Only works with per-user database roles, not applicable to service key model
- **Storing roles in JWT claims**: Requires token refresh, harder to query, not indexed

## Open Questions

Things that couldn't be fully resolved:

1. **How should we handle tier downgrades when user exceeds new limit?**
   - What we know: No industry consensus — some platforms use grace periods, others hard block
   - What's unclear: Product decision on UX approach (read-only vs block vs grace period)
   - Recommendation: Phase 1 only enforces creation limits, defer downgrade handling to product team or Phase 3

2. **Should admins see tier limit warnings in UI?**
   - What we know: Admins bypass limits in backend logic
   - What's unclear: Should UI show "1/1 brands used" for admin with 5 brands?
   - Recommendation: Show "Admin (unlimited)" in UI when is_admin = true

3. **Should admin actions be audit logged?**
   - What we know: Best practice for compliance, but not in scope for Phase 1
   - What's unclear: Whether weekend sprint timeline allows audit logging
   - Recommendation: Add TODO comment for future audit logging, not blocking

4. **How are admins created in production?**
   - What we know: Seed files work for development, not for production
   - What's unclear: Manual UPDATE query? Admin management UI? CLI script?
   - Recommendation: Manual SQL UPDATE in production Supabase SQL editor is sufficient for v1

## Sources

### Primary (HIGH confidence)
- [Supabase Database Migrations](https://supabase.com/docs/guides/deployment/database-migrations) - Migration best practices
- [PostgreSQL Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) - RLS patterns and BYPASSRLS
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) - RLS implementation patterns
- [Supabase Seeding Database](https://supabase.com/docs/guides/local-development/seeding-your-database) - Seed file structure
- [Stripe Subscription Quantities](https://docs.stripe.com/billing/subscriptions/quantities) - Metadata vs billed quantities

### Secondary (MEDIUM confidence)
- [Setting Up RLS in Supabase User and Admin Roles](https://dev.to/shahidkhans/setting-up-row-level-security-in-supabase-user-and-admin-2ac1) - Admin column patterns
- [Supabase Service Key Bypass RLS](https://egghead.io/lessons/supabase-use-the-supabase-service-key-to-bypass-row-level-security) - Service key usage
- [Seeding auth.users Discussion](https://github.com/orgs/supabase/discussions/35391) - Auth seeding pitfalls
- [SaaS Subscription Downgrade Guide](https://www.binadox.com/blog/saas-license-management-cancellation-vs-downgrade-vs-reassignment-guide/) - Downgrade patterns

### Tertiary (LOW confidence)
- [How We Manage Plans in SaaS](https://news.ycombinator.com/item?id=19473336) - Community discussion on tier enforcement
- [SaaS Grace Periods](https://payproglobal.com/answers/what-is-saas-grace-period/) - Grace period patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Existing stack already in use, no new dependencies
- Architecture: HIGH - PostgreSQL boolean columns and Supabase migrations well-documented
- Pitfalls: HIGH - Identified from codebase analysis and official documentation warnings

**Research date:** 2026-01-24
**Valid until:** 2026-02-24 (30 days - stable PostgreSQL/Supabase patterns)

**Current codebase issues identified:**
1. BRAND_LIMITS constants incorrect (Starter=1 should be 3, Professional=3 should be 10, Enterprise=10 should be unlimited)
2. No is_admin column exists
3. No admin bypass logic implemented
4. Pricing page claims don't match enforcement (1 brand vs 3 brands for Starter)
