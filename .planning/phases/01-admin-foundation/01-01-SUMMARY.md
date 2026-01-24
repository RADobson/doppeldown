---
phase: 01-admin-foundation
plan: 01
subsystem: admin-infrastructure
tags: [admin, tier-enforcement, database, migration]
requires:
  - existing users table
  - existing brands API route
provides:
  - is_admin column on users table
  - admin bypass for all tier limits
  - corrected brand limits per tier
affects:
  - 02-automated-scanning (will need admin checks)
  - 03-monitoring-dashboard (admin metrics/controls)
  - 04-alerting-system (admin notification overrides)
tech-stack:
  added: []
  patterns:
    - admin-bypass-guards
    - partial-indexing
key-files:
  created:
    - supabase/migrations/20260124000000_add_admin_column.sql
  modified:
    - src/types/index.ts
    - src/app/api/brands/route.ts
decisions:
  - slug: admin-bypass-pattern
    decision: "Use `!userData?.is_admin &&` guard pattern for all tier limit checks"
    rationale: "Minimal code change, easy to grep, null-safe, clear intent"
    alternatives: "Early return if admin, separate admin function"
  - slug: enterprise-unlimited
    decision: "Use Number.MAX_SAFE_INTEGER for enterprise tier limit"
    rationale: "Semantically represents unlimited, avoids magic values like -1 or 999999"
    alternatives: "null (requires null checks), -1 (less clear), Infinity (may cause calculation issues)"
  - slug: partial-admin-index
    decision: "Index only is_admin=true rows"
    rationale: "Admins are rare, partial index keeps index tiny and fast"
    alternatives: "Full index (wastes space), no index (slow admin lookups)"
metrics:
  duration: 111s
  completed: 2026-01-24
---

# Phase 01 Plan 01: Admin Infrastructure Summary

**One-liner:** Admin bypass infrastructure with corrected tier limits (Free=1, Starter=3, Pro=10, Enterprise=unlimited)

## What Was Built

### Database Changes
- Added `is_admin` BOOLEAN column to `public.users` table (default: false)
- Created partial index `idx_users_is_admin` for efficient admin lookups
- Added column comment documenting admin bypass behavior

### TypeScript Types
- Updated `User` interface with optional `is_admin?: boolean` field
- Maintains type safety across application

### API Route Changes
- **Fixed BRAND_LIMITS constant:**
  - Free: 1 brand (unchanged)
  - Starter: 3 brands (was incorrectly 1)
  - Professional: 10 brands (was incorrectly 3)
  - Enterprise: unlimited brands (was incorrectly 10)
- **Added admin bypass logic:**
  - Modified brand limit check: `!userData?.is_admin &&` guards enforcement
  - Admin users can create unlimited brands regardless of tier
- **Updated getOrCreateUserRecord:**
  - Fetches `is_admin` field from database
  - Included in both SELECT and INSERT operations

## Technical Implementation

### Admin Bypass Pattern
The implementation uses a single-line guard pattern:
```typescript
if (!userData?.is_admin && (existingBrands || 0) >= brandLimit) {
  // enforce limit
}
```

**Benefits:**
- Null-safe (handles undefined/null userData)
- Minimal diff (one condition added)
- Easy to find with grep: `!userData?.is_admin`
- Clear intent: "skip check if admin"

### Tier Enforcement Logic Preserved
The existing effectiveTier logic remains intact:
```typescript
const effectiveTier = subscriptionStatus === 'active' ? subscriptionTier : 'free'
```

This ensures:
- Non-active subscriptions fall back to free tier
- Cancelled/past_due/free users limited to 1 brand
- Only active paid subscriptions get higher limits

### Database Design
**Partial Index Strategy:**
```sql
CREATE INDEX idx_users_is_admin ON users(is_admin) WHERE is_admin = true;
```

Since admin users are rare (typically <1% of users), indexing only `true` values:
- Keeps index size minimal
- Maintains fast admin lookups
- Reduces index maintenance overhead

## Verification Completed

All success criteria met:
- [x] Migration file `20260124000000_add_admin_column.sql` created
- [x] User interface includes `is_admin?: boolean`
- [x] BRAND_LIMITS corrected: starter=3, professional=10, enterprise=unlimited
- [x] Admin bypass guards brand limit check
- [x] effectiveTier logic preserved (non-active → free)
- [x] All files stage and commit successfully

## Deviations from Plan

None - plan executed exactly as written.

## Commits

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Add admin infrastructure | d812f22 | supabase/migrations/20260124000000_add_admin_column.sql, src/types/index.ts |
| 2 | Fix brand limits and add admin bypass | 030776e | src/app/api/brands/route.ts |

## Decisions Made

### 1. Admin Bypass Pattern: Guard-based vs Early Return
**Chosen:** `!userData?.is_admin &&` guard in existing conditional

**Rationale:**
- Minimal code change (one condition added)
- Null-safe with optional chaining
- Easy to grep: `grep "!userData?.is_admin" src/`
- Clear intent: "skip enforcement if admin"

**Alternatives considered:**
- Early return if admin (more verbose, disrupts control flow)
- Separate admin function (overkill for simple check)

### 2. Enterprise Tier Limit: MAX_SAFE_INTEGER vs Alternatives
**Chosen:** `Number.MAX_SAFE_INTEGER`

**Rationale:**
- Semantically represents "unlimited" in JavaScript
- Avoids magic numbers (999999, -1)
- Works correctly with numeric comparisons
- Standard JavaScript constant

**Alternatives considered:**
- `null` (requires null checks, complicates logic)
- `-1` (common pattern but less clear)
- `Infinity` (may cause calculation issues)

### 3. Admin Index: Partial vs Full Index
**Chosen:** Partial index on `is_admin = true`

**Rationale:**
- Admin users are rare (<1% typically)
- Partial index keeps size tiny (indexes only true rows)
- Fast lookups when checking admin status
- Minimal maintenance overhead

**Alternatives considered:**
- Full index (wastes space on millions of false values)
- No index (slower admin checks, acceptable given rarity)

## Known Limitations

### Pre-existing TypeScript Errors
The project has existing TypeScript compilation errors unrelated to this phase:
- `pages_scanned` missing from Scan type (in dashboard/brands/[id]/page.tsx)
- `screenshot_url` missing from Threat type (in dashboard/threats/[id]/page.tsx)
- `downlevelIteration` flag needed (in lib/scan-runner.ts)

These existed before this plan and do not affect admin infrastructure functionality.

### Migration Not Auto-Applied
The database migration file is created but not automatically applied. To enable admin functionality:

```bash
# Apply migration via Supabase CLI or SQL Editor
supabase db push

# Or manually run in Supabase SQL Editor:
# supabase/migrations/20260124000000_add_admin_column.sql
```

## Testing Recommendations

### Manual Testing Steps
1. **Apply migration:**
   ```bash
   supabase db push
   ```

2. **Create test admin user:**
   ```sql
   UPDATE users SET is_admin = true WHERE email = 'admin@example.com';
   ```

3. **Test admin bypass:**
   - Log in as admin user
   - Create brands beyond tier limit
   - Verify no "Brand limit reached" error

4. **Test tier enforcement:**
   - Log in as free user
   - Create 1 brand (should succeed)
   - Create 2nd brand (should fail with limit error)
   - Upgrade to starter tier, set subscription_status = 'active'
   - Create 2nd and 3rd brands (should succeed)
   - Create 4th brand (should fail)

5. **Test effectiveTier fallback:**
   - Create user with starter tier but subscription_status = 'cancelled'
   - Verify limited to 1 brand (falls back to free)

### Automated Testing
Consider adding integration tests:
- Admin users bypass limits (positive test)
- Non-admin users enforced by tier (negative test)
- Tier fallback logic (cancelled/past_due → free)

## Next Phase Readiness

### For Phase 02 (Automated Scanning)
**Ready:** Admin bypass pattern established and documented

**Action needed:** Apply same `!userData?.is_admin &&` pattern to scan quota enforcement

**Pattern to follow:**
```typescript
if (!userData?.is_admin && (existingScans || 0) >= scanLimit) {
  // enforce scan limit
}
```

### For Phase 03 (Monitoring Dashboard)
**Consideration:** Admin dashboard may want to show:
- Total users by tier
- Admin user list
- Tier enforcement metrics (how many users hitting limits)

### For Phase 04 (Alerting System)
**Consideration:** Admin users might need different alert thresholds or notification preferences

## Performance Notes

**Database Impact:**
- `is_admin` column: 1 byte per row (BOOLEAN)
- Partial index: minimal size (<1KB for typical admin counts)
- Query performance: no impact (is_admin fetched with existing user query)

**API Performance:**
- Admin bypass check: O(1) (simple boolean check)
- No additional database queries
- No performance degradation for non-admin users

## Future Improvements

### Short-term (next sprint)
1. Add admin management UI (promote/demote users)
2. Audit log for admin actions
3. Admin-only API endpoints for user management

### Long-term (future phases)
1. Role-based access control (admin, moderator, support)
2. Granular permissions (can_bypass_limits, can_manage_users)
3. Admin dashboard with analytics and user management
4. Multi-tenancy support (organization admins vs platform admins)

## Files Modified

### Created
- `supabase/migrations/20260124000000_add_admin_column.sql` (11 lines)
  - Adds is_admin column with DEFAULT false
  - Creates partial index for admin lookups
  - Documents column purpose in comment

### Modified
- `src/types/index.ts` (+1 line)
  - Added `is_admin?: boolean` to User interface

- `src/app/api/brands/route.ts` (+6/-6 lines)
  - Fixed BRAND_LIMITS constant (3 lines changed)
  - Updated getOrCreateUserRecord to fetch is_admin (2 lines changed)
  - Added admin bypass guard (1 line changed)

## Key Patterns Established

### 1. Admin Bypass Guard Pattern
```typescript
if (!userData?.is_admin && <limit_condition>) {
  // enforce limit
}
```

**Usage:** Any tier-based limit enforcement
**Benefit:** Consistent, greppable, null-safe

### 2. Partial Index for Rare Flags
```sql
CREATE INDEX idx_table_flag ON table(flag) WHERE flag = true;
```

**Usage:** Boolean columns where true is rare (<5% of rows)
**Benefit:** Tiny index size, fast lookups, low maintenance

### 3. effectiveTier Fallback Pattern
```typescript
const effectiveTier = subscriptionStatus === 'active' ? subscriptionTier : 'free'
```

**Usage:** Any tier-based feature enforcement
**Benefit:** Ensures cancelled/expired subscriptions lose paid features

## References

**Related Requirements:**
- TIER-01: Tier-based feature limits (blocking requirement)
- AUTH-01: Admin user roles

**Migration Path:**
1. Phase 01: Add admin infrastructure ← **YOU ARE HERE**
2. Phase 02: Apply admin bypass to scan quotas
3. Phase 03: Add admin dashboard
4. Phase 04: Admin-controlled alert settings
5. Phase 05: Admin moderation tools

---

**Status:** ✅ Complete - All tasks executed, verified, and committed
**Duration:** 111 seconds (1m 51s)
**Quality:** No deviations, all success criteria met
