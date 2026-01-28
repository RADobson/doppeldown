# Phase 11: Audit Logging Infrastructure - Research

**Researched:** 2026-01-29
**Domain:** Application audit logging with PostgreSQL/Supabase
**Confidence:** HIGH

## Summary

Audit logging for delete operations requires capturing user identity, entity type, entity ID, and timestamp for every delete action. For this Next.js + Supabase application, a hybrid approach is recommended: application-level audit log writing (for capturing JWT user context) combined with database-level RLS policies (for security). This avoids the complexity of database triggers while ensuring complete accountability.

The standard pattern involves creating a dedicated `audit_logs` table with indexed fields, a service function in TypeScript to write audit entries, and integrating audit calls into delete API endpoints. This approach aligns with the existing codebase patterns (similar to the `notifications` table), provides full flexibility for future audit requirements, and maintains low complexity.

**Primary recommendation:** Application-level audit logging via dedicated service function, called from delete API routes before performing deletions.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| PostgreSQL | 15+ | Audit log storage | Native JSONB support, excellent indexing, built into Supabase |
| Supabase Auth | 2.47.0+ | User context extraction | Already integrated, provides JWT claims with user ID/email |
| Next.js API Routes | 14.2.35+ | Application-level audit hooks | Existing pattern for server-side operations with auth |
| TypeScript | 5.7.2 | Type-safe audit functions | Prevents audit data structure drift |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| date-fns | 4.1.0 | Timestamp formatting | Already in stack, standardized date handling |
| @supabase/ssr | 0.5.0 | Server-side user context | Extract user from JWT in API routes |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Application-level | Database triggers | Triggers capture all deletes (including bulk SQL) but can't access JWT user context, require PostgreSQL functions |
| Application-level | pgAudit extension | Enterprise-grade but logs SQL statements not business entities, requires Supabase Pro |
| Application-level | supa_audit extension | Tracks all table changes but overkill for delete-only audit, performance impact on high-throughput tables |
| Separate audit table | Append to entity tables | Simpler schema but deleted entities lose context, harder to query across entity types |

**Installation:**
```bash
# No additional packages required - use existing stack
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── lib/
│   ├── audit-logger.ts        # Core audit logging service
│   └── supabase/
│       ├── server.ts           # Existing: user context extraction
│       └── client.ts           # Existing: client-side Supabase
├── app/api/
│   ├── scans/[id]/route.ts     # DELETE endpoint with audit
│   ├── threats/[id]/route.ts   # DELETE endpoint with audit
│   └── reports/[id]/route.ts   # DELETE endpoint with audit
└── types/
    └── index.ts                # Audit log types
supabase/
└── migrations/
    └── 20260129_add_audit_logs.sql  # Audit log table schema
```

### Pattern 1: Application-Level Audit Service

**What:** Centralized TypeScript function that writes audit entries before delete operations
**When to use:** For capturing user context from JWT, flexibility, maintainability

**Example:**
```typescript
// src/lib/audit-logger.ts
import { createServiceClient } from './supabase/server'

export type AuditAction = 'DELETE'
export type AuditEntityType = 'scan' | 'threat' | 'report'

interface AuditLogEntry {
  user_id: string
  user_email?: string
  action: AuditAction
  entity_type: AuditEntityType
  entity_id: string
  metadata?: Record<string, unknown>
}

export async function logAudit(entry: AuditLogEntry) {
  const supabase = await createServiceClient()

  const { error } = await supabase
    .from('audit_logs')
    .insert({
      user_id: entry.user_id,
      user_email: entry.user_email,
      action: entry.action,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id,
      metadata: entry.metadata || {},
      created_at: new Date().toISOString()
    })

  if (error) {
    // Log but don't throw - audit failure shouldn't block delete
    console.error('Failed to write audit log:', error)
  }
}
```

**Usage in delete endpoint:**
```typescript
// src/app/api/scans/[id]/route.ts
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify ownership
  const { data: scan } = await supabase
    .from('scans')
    .select('id, brand_id')
    .eq('id', params.id)
    .single()

  if (!scan) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Write audit log BEFORE deletion
  await logAudit({
    user_id: user.id,
    user_email: user.email,
    action: 'DELETE',
    entity_type: 'scan',
    entity_id: scan.id,
    metadata: { brand_id: scan.brand_id }
  })

  // Perform deletion
  const { error } = await supabase
    .from('scans')
    .delete()
    .eq('id', params.id)

  if (error) throw error

  return NextResponse.json({ success: true })
}
```

### Pattern 2: Audit Log Table Schema

**What:** Dedicated PostgreSQL table with indexed fields for efficient querying
**When to use:** Always - foundation for audit system

**Example:**
```sql
-- supabase/migrations/20260129000000_add_audit_logs.sql
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL CHECK (action IN ('DELETE')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('scan', 'threat', 'report')),
  entity_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs (user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs (created_at DESC);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin-only access (users with is_admin = true)
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

-- Service role can insert (used by audit-logger.ts)
CREATE POLICY "Service can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (TRUE);
```

### Pattern 3: Type-Safe Audit Definitions

**What:** TypeScript types that ensure audit log consistency
**When to use:** Always - prevents data structure drift

**Example:**
```typescript
// src/types/index.ts (add to existing types)
export interface AuditLog {
  id: string
  user_id: string
  user_email?: string
  action: 'DELETE'
  entity_type: 'scan' | 'threat' | 'report'
  entity_id: string
  metadata: Record<string, unknown>
  created_at: string
}
```

### Anti-Patterns to Avoid

- **Blocking deletes on audit failure:** Audit logging should be best-effort; failures should log but not prevent delete operations
- **Storing sensitive data in metadata:** JSONB metadata should contain context (brand_id, scan_type) not user PII beyond what's already in dedicated columns
- **Missing user_email:** Store both user_id and user_email - if user is deleted, email provides accountability trail
- **Synchronous audit in UI:** Never call audit logging from client-side code - always server-side API routes only

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Full table change tracking | Custom triggers for all CRUD | supa_audit extension (if needed) | Handles schema changes, tested at scale, but overkill for delete-only audit |
| PostgreSQL audit logs parsing | Custom log parser | pgAudit + log aggregation service | Enterprise compliance requirements need pgAudit, but DoppelDown only needs application-level |
| User activity dashboards | Custom analytics | Use existing notifications pattern + simple admin query | Notifications already track user actions; audit logs for compliance, not UX |
| Immutable log storage | Custom blockchain append | PostgreSQL with RLS + backups | RLS policies prevent tampering, regular backups provide recovery |

**Key insight:** For delete-only audit logging with user context from JWT, application-level logging is simpler and more maintainable than database triggers. Triggers excel at capturing *all* database changes (including bulk SQL), but this project only needs accountability for user-initiated delete actions through the API.

## Common Pitfalls

### Pitfall 1: Trigger-Based Logging Without User Context

**What goes wrong:** Database triggers capture deletes but can't access JWT claims, so `user_id` is missing or defaults to database role (e.g., `authenticated`)

**Why it happens:** PostgreSQL triggers execute in database context, not application context; JWT is only available in API routes

**How to avoid:** Use application-level audit logging in API routes where `supabase.auth.getUser()` provides user identity

**Warning signs:** Audit logs with NULL user_id or generic role names instead of actual user IDs

### Pitfall 2: Forgetting to Audit Before Delete

**What goes wrong:** Delete operation succeeds but audit log isn't written because code order is wrong

**Why it happens:** Developer writes audit call after delete, then delete throws error or returns early

**How to avoid:** Always call `logAudit()` immediately after ownership verification, before the actual delete operation

**Warning signs:** Missing audit entries for known delete actions; audit log count doesn't match deletion count

### Pitfall 3: Over-Auditing with Full Record Snapshots

**What goes wrong:** Storing entire deleted entity as JSONB in audit metadata causes massive storage growth

**Why it happens:** Developer thinks "capture everything" but `threats` table has large JSONB evidence fields

**How to avoid:** Store only identifying metadata (entity_id, brand_id, entity_type) - deleted records are already gone, don't duplicate in audit

**Warning signs:** Audit log table grows faster than expected; slow queries on metadata JSONB field

### Pitfall 4: Cascading Deletes Without Audit

**What goes wrong:** Deleting a scan cascades to delete threats (via `ON DELETE CASCADE`), but only scan deletion is audited

**Why it happens:** Database-level cascades happen automatically, bypassing application-level audit logging

**How to avoid:** Either (1) audit parent entity only with child count in metadata, or (2) manually delete children with individual audit calls before parent delete

**Warning signs:** Audit logs show scan deletion but not associated threat deletions; compliance reports miss cascade deletes

## Code Examples

Verified patterns from Supabase official sources and existing DoppelDown codebase:

### Example 1: Complete Delete API Endpoint with Audit

```typescript
// src/app/api/threats/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit-logger'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Verify ownership and fetch threat details
    const { data: threat, error: fetchError } = await supabase
      .from('threats')
      .select('id, brand_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !threat) {
      return NextResponse.json({ error: 'Threat not found' }, { status: 404 })
    }

    // Verify brand ownership
    const { data: brand } = await supabase
      .from('brands')
      .select('id')
      .eq('id', threat.brand_id)
      .eq('user_id', user.id)
      .single()

    if (!brand) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // 3. Write audit log BEFORE deletion
    await logAudit({
      user_id: user.id,
      user_email: user.email,
      action: 'DELETE',
      entity_type: 'threat',
      entity_id: threat.id,
      metadata: {
        brand_id: threat.brand_id
      }
    })

    // 4. Perform deletion
    const { error: deleteError } = await supabase
      .from('threats')
      .delete()
      .eq('id', params.id)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting threat:', error)
    return NextResponse.json(
      { error: 'Failed to delete threat' },
      { status: 500 }
    )
  }
}
```

### Example 2: Admin Audit Log Query

```typescript
// src/app/api/admin/audit-logs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify admin user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!userData?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Query audit logs with filters
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get('entity_type')
    const userId = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '100')

    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (entityType) {
      query = query.eq('entity_type', entityType)
    }
    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: logs, error } = await query

    if (error) throw error

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}
```

### Example 3: Audit Log with Cascade Information

```typescript
// Auditing scan deletion that cascades to threats
await logAudit({
  user_id: user.id,
  user_email: user.email,
  action: 'DELETE',
  entity_type: 'scan',
  entity_id: scan.id,
  metadata: {
    brand_id: scan.brand_id,
    cascade_threats_count: threatsCount,
    cascade_note: 'Associated threats deleted via ON DELETE CASCADE'
  }
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Database triggers only | Hybrid: app-level logging + RLS | 2024-2025 | Better user context, simpler maintenance |
| Separate audit database | Same database, separate schema | 2023-2024 | Easier queries, single backup/restore |
| Synchronous audit writes | Best-effort async (don't block) | 2025 | Delete UX not blocked by audit failures |
| Shadow tables per entity | Single audit_logs table | 2023+ | Easier cross-entity queries, less schema drift |

**Deprecated/outdated:**
- **Full supa_audit for delete-only:** supa_audit tracks all CRUD operations; overkill when only DELETE needs auditing
- **Trigger-based with session variables:** Old pattern `SET LOCAL app.user_id = 'xxx'` before queries - fragile and doesn't work with connection pooling

## Open Questions

1. **Should cascade deletes be individually audited?**
   - What we know: Database `ON DELETE CASCADE` removes child entities automatically without application code
   - What's unclear: Whether compliance requires separate audit entries for each cascaded deletion
   - Recommendation: Start with parent-only audit + cascade metadata; add individual child audits if compliance audit requests it

2. **How long should audit logs be retained?**
   - What we know: GDPR requires 6 months to 7 years depending on industry; PCI DSS requires 1 year
   - What's unclear: DoppelDown's specific compliance requirements
   - Recommendation: Implement 2-year retention by default (covers most regulations); add automated archival/purge as future enhancement

3. **Should audit logs include IP address or request headers?**
   - What we know: IP tracking helps forensic investigation but raises privacy concerns under GDPR
   - What's unclear: Whether benefit outweighs privacy risk for this application
   - Recommendation: Skip IP logging for v1.3 - user_id + email + timestamp sufficient for accountability; add IP as opt-in future feature

## Sources

### Primary (HIGH confidence)
- [Supabase Blog: Postgres Audit in 150 lines of SQL](https://supabase.com/blog/postgres-audit) - Audit table schema and trigger function patterns
- [Supabase supa_audit GitHub](https://github.com/supabase/supa_audit) - Features, limitations, best practices for generic table auditing
- [Bytebase: Database Audit Logging Guide](https://www.bytebase.com/blog/database-audit-logging/) - Audit logging best practices and design patterns
- [Vertabelo: Database Design for Audit Logging](https://vertabelo.com/blog/database-design-for-audit-logging/) - Schema design patterns and anti-patterns
- [TigerData: PostgreSQL Audit Logging](https://www.tigerdata.com/learn/what-is-audit-logging-and-how-to-enable-it-in-postgresql) - PostgreSQL-specific implementation patterns

### Secondary (MEDIUM confidence)
- [Severalnines: PostgreSQL Audit Logging Best Practices](https://severalnines.com/blog/postgresql-audit-logging-best-practices/) - pgAudit vs trigger-based approaches
- [Medium: Simple Audit Trail for Supabase Database](https://medium.com/@harish.siri/simpe-audit-trail-for-supabase-database-efefcce622ff) - User context from JWT in Supabase
- [DEV Community: Audit Logging in .NET with EF Core](https://dev.to/hootanht/comprehensive-guide-to-implementing-audit-logging-in-net-with-ef-core-interceptors-1e83) - Application-level audit patterns (transferable concepts)

### Tertiary (LOW confidence)
- WebSearch results on "application level audit logging vs database triggers 2026" - General pros/cons from multiple sources
- WebSearch results on "audit log table design user context JWT auth 2026" - JWT claims extraction patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - PostgreSQL, Supabase Auth, Next.js API routes already in use; no new dependencies required
- Architecture: HIGH - Application-level audit pattern aligns with existing notifications.ts pattern; verified with Supabase official docs
- Pitfalls: MEDIUM - Based on general database audit logging experience and DoppelDown codebase patterns, not project-specific testing

**Research date:** 2026-01-29
**Valid until:** 2026-04-29 (90 days - database audit patterns are stable)
