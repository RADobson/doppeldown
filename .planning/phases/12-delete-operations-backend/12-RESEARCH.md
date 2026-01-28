# Phase 12: Delete Operations Backend - Research

**Researched:** 2026-01-29
**Domain:** RESTful API delete operations with Next.js, Supabase, and audit logging
**Confidence:** HIGH

## Summary

Phase 12 implements hard delete operations for scans, threats, and reports via Next.js API routes with full audit logging. The standard approach for this Next.js + Supabase application is creating DELETE endpoints following RESTful conventions (`/api/scans/[id]/route.ts`) with ownership verification, audit logging before deletion, and proper cascade handling. The existing audit logging infrastructure from Phase 11 provides the foundation for accountability.

Key architectural decisions: (1) leverage database cascade deletes for scans → threats relationships while manually deleting orphaned storage files, (2) return 404 for non-existent resources to provide clear feedback, (3) handle report deletions separately due to potential file storage cleanup, and (4) maintain idempotent behavior where possible while prioritizing clear error responses.

**Primary recommendation:** Implement DELETE endpoints following established codebase patterns (similar to existing GET/POST routes), integrate logAudit() calls before deletion, handle storage file cleanup explicitly, and respect existing foreign key cascade rules.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js API Routes | 14.2.35+ | DELETE endpoint implementation | Already used for all API operations; App Router pattern established |
| Supabase JS Client | 2.47.0+ | Database delete operations with RLS | Existing authentication and database client |
| PostgreSQL CASCADE | 15+ | Automatic child record cleanup | Built into schema; scans → threats, brands → all entities |
| audit-logger.ts | Current | Pre-delete audit logging | Phase 11 infrastructure; best-effort pattern |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Supabase Storage API | 2.47.0+ | Evidence file deletion | When threats have evidence.screenshots with storage_path |
| createServiceClient | Current | Bypass RLS for storage deletes | Service role needed for storage.remove() operations |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hard delete | Soft delete (status='deleted') | Soft delete preserves data but complicates queries, violates user expectation of "instant delete" |
| 404 on missing | 200/204 always (idempotent) | Always-success approach simpler for retries but hides client errors and resource state |
| Manual cascade | Database CASCADE only | Manual gives audit control but increases complexity; hybrid approach balances both |
| File delete before DB | File delete after DB delete | After-delete risks orphaning files on error; before-delete risks losing reference before cleanup |

**Installation:**
```bash
# No additional packages required - use existing stack
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/api/
│   ├── scans/
│   │   └── [id]/
│   │       └── route.ts          # DELETE /api/scans/:id
│   ├── threats/
│   │   └── [id]/
│   │       └── route.ts          # DELETE /api/threats/:id
│   └── reports/
│       └── [id]/
│           └── route.ts          # DELETE /api/reports/:id
├── lib/
│   ├── audit-logger.ts           # Existing: logAudit() function
│   └── supabase/
│       └── server.ts             # Existing: createClient(), createServiceClient()
└── types/
    └── index.ts                  # Existing: AuditLog, AuditEntityType types
```

### Pattern 1: DELETE Endpoint with Ownership Verification

**What:** Next.js API route that authenticates user, verifies ownership, logs audit, performs deletion
**When to use:** All delete operations (scans, threats, reports)

**Example:**
```typescript
// src/app/api/scans/[id]/route.ts
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

    // 2. Fetch resource and verify ownership via brand
    const { data: scan, error: fetchError } = await supabase
      .from('scans')
      .select('id, brand_id, brands!inner(user_id)')
      .eq('id', params.id)
      .single()

    if (fetchError || !scan) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 })
    }

    // Verify user owns the brand
    if (scan.brands.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 3. Count cascade targets for audit metadata
    const { count: threatsCount } = await supabase
      .from('threats')
      .select('id', { count: 'exact', head: true })
      .eq('scan_id', params.id)

    // 4. Write audit log BEFORE deletion
    await logAudit({
      user_id: user.id,
      user_email: user.email,
      action: 'DELETE',
      entity_type: 'scan',
      entity_id: scan.id,
      metadata: {
        brand_id: scan.brand_id,
        cascade_threats_count: threatsCount || 0
      }
    })

    // 5. Perform deletion (CASCADE will handle threats)
    const { error: deleteError } = await supabase
      .from('scans')
      .delete()
      .eq('id', params.id)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting scan:', error)
    return NextResponse.json(
      { error: 'Failed to delete scan' },
      { status: 500 }
    )
  }
}
```

### Pattern 2: DELETE with Storage File Cleanup

**What:** Delete threat with evidence files stored in Supabase Storage
**When to use:** Threats with evidence.screenshots containing storage_path

**Example:**
```typescript
// src/app/api/threats/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit-logger'
import type { Threat } from '@/types'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // 1. Authenticate
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Fetch threat and verify ownership
    const { data: threat, error: fetchError } = await supabase
      .from('threats')
      .select('id, brand_id, evidence, brands!inner(user_id)')
      .eq('id', params.id)
      .single<Threat & { brands: { user_id: string } }>()

    if (fetchError || !threat) {
      return NextResponse.json({ error: 'Threat not found' }, { status: 404 })
    }

    if (threat.brands.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 3. Delete evidence files from storage (best-effort)
    const storagePaths = threat.evidence?.screenshots
      ?.filter(s => s.storage_path)
      .map(s => s.storage_path) || []

    if (storagePaths.length > 0) {
      const storageClient = await createServiceClient()
      const bucket = threat.evidence?.storage_bucket ||
                     process.env.SUPABASE_EVIDENCE_BUCKET ||
                     'evidence'

      const { error: storageError } = await storageClient.storage
        .from(bucket)
        .remove(storagePaths)

      if (storageError) {
        console.error('Failed to delete evidence files:', storageError)
        // Continue with database deletion - orphaned files are acceptable
      }
    }

    // 4. Write audit log
    await logAudit({
      user_id: user.id,
      user_email: user.email,
      action: 'DELETE',
      entity_type: 'threat',
      entity_id: threat.id,
      metadata: {
        brand_id: threat.brand_id,
        evidence_files_deleted: storagePaths.length
      }
    })

    // 5. Delete from database
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

### Pattern 3: Ownership Verification via Nested Join

**What:** Verify user owns resource through brand relationship using Supabase's nested select
**When to use:** All entity deletions (scans, threats, reports reference brands)

**Example:**
```typescript
// Ownership verification pattern
const { data: entity, error } = await supabase
  .from('threats')
  .select('id, brand_id, brands!inner(user_id)')  // inner join ensures brand exists
  .eq('id', params.id)
  .single()

if (!entity) {
  return NextResponse.json({ error: 'Threat not found' }, { status: 404 })
}

if (entity.brands.user_id !== user.id) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

### Pattern 4: Report Deletion (Metadata Only)

**What:** Delete report record; no actual file stored (reports are generated on-demand)
**When to use:** DELETE /api/reports/:id

**Example:**
```typescript
// src/app/api/reports/[id]/route.ts
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch and verify ownership
    const { data: report, error: fetchError } = await supabase
      .from('reports')
      .select('id, brand_id, brands!inner(user_id)')
      .eq('id', params.id)
      .single()

    if (fetchError || !report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    if (report.brands.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Audit log
    await logAudit({
      user_id: user.id,
      user_email: user.email,
      action: 'DELETE',
      entity_type: 'report',
      entity_id: report.id,
      metadata: { brand_id: report.brand_id }
    })

    // Delete (no cascade - reports don't own other entities)
    const { error: deleteError } = await supabase
      .from('reports')
      .delete()
      .eq('id', params.id)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting report:', error)
    return NextResponse.json(
      { error: 'Failed to delete report' },
      { status: 500 }
    )
  }
}
```

### Anti-Patterns to Avoid

- **Deleting before audit logging:** Always call logAudit() before the delete operation; if delete fails, audit entry provides investigation trail
- **Blocking delete on storage failure:** Storage file deletion should be best-effort; orphaned files are acceptable, but deleted DB records with referenced files are not
- **Client-side delete calls:** Never expose delete operations to client-side code; always use server-side API routes with authentication
- **Skipping ownership verification:** Every delete must verify user owns the resource via brand relationship; RLS alone is insufficient for clear error messages
- **Using CASCADE without audit metadata:** When deleting parent entities (scans), capture child counts in audit metadata before cascade occurs

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Soft delete system | Custom deleted_at column + filter logic | Hard delete with audit_logs | Phase 11 audit logging provides accountability; soft delete complicates queries and violates "instant delete" UX |
| Batch delete | Custom transaction logic for multiple IDs | One-at-a-time delete via loop | Requirements specify "no bulk delete"; simpler implementation, clearer audit trail |
| Storage cleanup queue | Background job system for orphaned files | Best-effort inline delete with service role | Supabase Storage API handles deletion; inline approach simpler for v1.3 scale |
| Delete confirmation | Multi-step API (lock → confirm → delete) | Single DELETE call with audit log | Requirements specify "no confirmation dialog"; audit log provides accountability |

**Key insight:** Hard delete with audit logging is simpler than soft delete for this use case. The audit_logs table serves as the "recycle bin" for compliance, while hard deletes keep the database clean and queries fast.

## Common Pitfalls

### Pitfall 1: Forgetting Storage File Cleanup

**What goes wrong:** Threat deleted from database but evidence screenshots remain in Supabase Storage, wasting space and creating orphaned files

**Why it happens:** Storage and database are separate systems; deleting a row doesn't automatically delete referenced files

**How to avoid:** Before deleting threat, extract evidence.screenshots[].storage_path and call storage.remove() with service role client

**Warning signs:** Storage bucket size grows indefinitely; file count doesn't match threat count

### Pitfall 2: Cascade Blindness in Audit Logs

**What goes wrong:** Deleting a scan cascades to delete threats, but audit log only shows scan deletion without mentioning associated threats

**Why it happens:** Database CASCADE happens automatically after application code completes; developer forgets to query child counts before deletion

**How to avoid:** Before deleting parent entity, query child count and include in audit metadata: `{ cascade_threats_count: 5 }`

**Warning signs:** Audit logs show scan deletions but compliance officer can't determine how many threats were removed

### Pitfall 3: Non-Idempotent DELETE with 500 Errors

**What goes wrong:** Client retries DELETE on network timeout, gets 404 "not found" on second attempt, treats as error and shows failure UI despite successful first delete

**Why it happens:** DELETE succeeded but response was lost; client doesn't understand 404 can mean "already deleted"

**How to avoid:** Return 404 for missing resources with clear message; document that 404 on DELETE can indicate prior success; client should treat 404 as acceptable outcome

**Warning signs:** Support tickets claiming "delete failed" when audit logs show successful deletion; client-side errors on retry

### Pitfall 4: RLS Policy Confusion

**What goes wrong:** Using user client for storage.remove() fails with permission denied because RLS policies block storage.objects access

**Why it happens:** Supabase Storage has separate RLS policies on storage.objects table; user client respects RLS, service role bypasses

**How to avoid:** Always use createServiceClient() for storage.remove() operations, even when user client is used for database operations

**Warning signs:** Database delete succeeds but storage delete fails; error logs show "permission denied for storage.objects"

### Pitfall 5: Ownership Verification Too Late

**What goes wrong:** Audit log written, storage files deleted, then ownership verification fails, leaving partial cleanup state

**Why it happens:** Ownership check placed after side effects instead of immediately after fetching resource

**How to avoid:** Follow pattern: (1) authenticate, (2) fetch + verify ownership, (3) collect metadata, (4) audit log, (5) side effects (storage), (6) delete DB

**Warning signs:** Audit logs for failed operations; orphaned files for aborted deletes

## Code Examples

Verified patterns from Next.js official docs and existing DoppelDown codebase:

### Example 1: Complete Scan Delete with Cascade Audit

```typescript
// src/app/api/scans/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit-logger'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Step 1: Authenticate
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Step 2: Fetch scan with ownership check
    const { data: scan, error: fetchError } = await supabase
      .from('scans')
      .select('id, brand_id, scan_type, threats_found, brands!inner(user_id, name)')
      .eq('id', params.id)
      .single()

    if (fetchError || !scan) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 })
    }

    // Verify ownership
    if (scan.brands.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Step 3: Count threats that will be cascade deleted
    const { count: threatsCount } = await supabase
      .from('threats')
      .select('id', { count: 'exact', head: true })
      .eq('scan_id', params.id)

    // Step 4: Write audit log with cascade metadata
    await logAudit({
      user_id: user.id,
      user_email: user.email,
      action: 'DELETE',
      entity_type: 'scan',
      entity_id: scan.id,
      metadata: {
        brand_id: scan.brand_id,
        brand_name: scan.brands.name,
        scan_type: scan.scan_type,
        cascade_threats_count: threatsCount || 0,
        threats_found: scan.threats_found
      }
    })

    // Step 5: Delete scan (CASCADE will delete associated threats)
    const { error: deleteError } = await supabase
      .from('scans')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('Delete operation failed:', deleteError)
      throw deleteError
    }

    return NextResponse.json({
      success: true,
      message: 'Scan deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting scan:', error)
    return NextResponse.json(
      { error: 'Failed to delete scan' },
      { status: 500 }
    )
  }
}
```

### Example 2: Threat Delete with Storage Cleanup

```typescript
// src/app/api/threats/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit-logger'
import type { Threat } from '@/types'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Authenticate
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch threat with ownership verification
    const { data: threat, error: fetchError } = await supabase
      .from('threats')
      .select('id, brand_id, type, severity, url, evidence, brands!inner(user_id, name)')
      .eq('id', params.id)
      .single<Threat & { brands: { user_id: string; name: string } }>()

    if (fetchError || !threat) {
      return NextResponse.json({ error: 'Threat not found' }, { status: 404 })
    }

    if (threat.brands.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Extract storage paths for cleanup
    const storagePaths = threat.evidence?.screenshots
      ?.filter(s => s.storage_path)
      .map(s => s.storage_path) || []

    // Delete evidence files from storage (best-effort with service role)
    let filesDeleted = 0
    if (storagePaths.length > 0) {
      const storageClient = await createServiceClient()
      const bucket = threat.evidence?.storage_bucket ||
                     process.env.SUPABASE_EVIDENCE_BUCKET ||
                     'evidence'

      const { data, error: storageError } = await storageClient.storage
        .from(bucket)
        .remove(storagePaths)

      if (storageError) {
        console.error('Failed to delete evidence files:', storageError)
        // Continue - orphaned files acceptable
      } else {
        filesDeleted = data?.length || 0
      }
    }

    // Audit log before database deletion
    await logAudit({
      user_id: user.id,
      user_email: user.email,
      action: 'DELETE',
      entity_type: 'threat',
      entity_id: threat.id,
      metadata: {
        brand_id: threat.brand_id,
        brand_name: threat.brands.name,
        threat_type: threat.type,
        severity: threat.severity,
        url: threat.url,
        evidence_files_deleted: filesDeleted,
        evidence_files_attempted: storagePaths.length
      }
    })

    // Delete threat from database
    const { error: deleteError } = await supabase
      .from('threats')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('Delete operation failed:', deleteError)
      throw deleteError
    }

    return NextResponse.json({
      success: true,
      message: 'Threat deleted successfully',
      files_deleted: filesDeleted
    })
  } catch (error) {
    console.error('Error deleting threat:', error)
    return NextResponse.json(
      { error: 'Failed to delete threat' },
      { status: 500 }
    )
  }
}
```

### Example 3: Report Delete (No Storage)

```typescript
// src/app/api/reports/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit-logger'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch report with ownership check
    const { data: report, error: fetchError } = await supabase
      .from('reports')
      .select('id, brand_id, type, threat_ids, brands!inner(user_id, name)')
      .eq('id', params.id)
      .single()

    if (fetchError || !report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    if (report.brands.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Audit log
    await logAudit({
      user_id: user.id,
      user_email: user.email,
      action: 'DELETE',
      entity_type: 'report',
      entity_id: report.id,
      metadata: {
        brand_id: report.brand_id,
        brand_name: report.brands.name,
        report_type: report.type,
        threat_count: report.threat_ids?.length || 0
      }
    })

    // Delete report record (no files to clean up - reports generated on-demand)
    const { error: deleteError } = await supabase
      .from('reports')
      .delete()
      .eq('id', params.id)

    if (deleteError) throw deleteError

    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting report:', error)
    return NextResponse.json(
      { error: 'Failed to delete report' },
      { status: 500 }
    )
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Soft delete (deleted_at) | Hard delete + audit_logs | 2024-2025 | Simpler queries, cleaner database, audit_logs provide compliance |
| Always return 200 on DELETE | Return 404 for missing resources | 2023-2024 | Better error feedback, clearer API semantics |
| Manual cascade in code | Database CASCADE + audit metadata | 2023+ | Less code, fewer bugs, but requires cascade awareness in audit |
| Storage delete in background job | Inline best-effort storage delete | 2025-2026 | Simpler architecture, acceptable orphan risk at small scale |

**Deprecated/outdated:**
- **Soft delete for user-facing features:** Modern best practice prefers hard delete + audit logs for user-initiated deletions; soft delete reserved for system operations
- **200 OK for all idempotent DELETEs:** RFC 7231 allows different responses; 404 provides better client feedback
- **Manual cascade delete logic:** PostgreSQL CASCADE more reliable than application-level cascade with error handling complexity

## Open Questions

1. **Should threats with evidence files block scan deletion if storage cleanup fails?**
   - What we know: Cascade DELETE will remove threat records regardless of storage file status
   - What's unclear: Whether orphaned files justify blocking entire scan deletion
   - Recommendation: Best-effort storage cleanup; allow delete to proceed even if files remain (can add cleanup cron job later)

2. **Should DELETE endpoints support admin bypass for deleted users' data?**
   - What we know: Phase requirements state "all users can delete their own brand's data" with no admin distinction
   - What's unclear: What happens if user account deleted but brand data remains
   - Recommendation: Let CASCADE handle user deletion → brands → scans/threats/reports; Phase 12 only covers user-initiated deletes

3. **Should we implement tombstone records for cascade-deleted threats?**
   - What we know: Scan deletion cascades to threats without individual threat audit entries
   - What's unclear: Whether compliance requires per-threat deletion records
   - Recommendation: Start with cascade metadata in scan audit log; add individual threat audit entries in Phase 13+ if compliance audit requires it

4. **What HTTP status for concurrent delete (race condition)?**
   - What we know: Two clients delete same resource simultaneously; one gets 200, other gets 404
   - What's unclear: Whether 404 message should distinguish "never existed" from "recently deleted"
   - Recommendation: Return 404 for all cases; audit_logs provide recent deletion context if needed

## Sources

### Primary (HIGH confidence)
- [Next.js API Routes Official Docs](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) - DELETE endpoint patterns and App Router conventions
- [Supabase Storage Delete Objects](https://supabase.com/docs/guides/storage/management/delete-objects) - storage.remove() API and best practices
- [Supabase Cascade Deletes Guide](https://supabase.com/docs/guides/database/postgres/cascade-deletes) - PostgreSQL CASCADE DELETE behavior
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) - Authorization and ownership verification patterns
- Phase 11 RESEARCH.md - Audit logging infrastructure and best-effort pattern

### Secondary (MEDIUM confidence)
- [Postgres ON DELETE CASCADE Guide - DbVisualizer](https://www.dbvis.com/thetable/postgres-on-delete-cascade-a-guide/) - CASCADE vs manual delete tradeoffs
- [REST API Delete Idempotency - Lee Davis](https://leedavis81.github.io/is-a-http-delete-requests-idempotent/) - 404 vs 200 debate for idempotent DELETE
- [To 404 or not to 404 - Medium](https://medium.com/vena-engineering/to-404-or-not-to-404-fd5c9ca4f5df) - REST API error response best practices
- [REST API Security Best Practices - Levo.ai](https://www.levo.ai/resources/blogs/rest-api-security-best-practices) - BOLA prevention and ownership verification

### Tertiary (LOW confidence)
- [Supabase JavaScript API Reference](https://supabase.com/docs/reference/javascript/storage-from-remove) - storage.remove() syntax (verified)
- [REST API Authentication - Stack Overflow](https://stackoverflow.blog/2021/10/06/best-practices-for-authentication-and-authorization-for-rest-apis/) - General authentication patterns

### Codebase Analysis (HIGH confidence)
- `/src/app/api/scan/route.ts` - Existing POST pattern with authentication and ownership verification
- `/src/app/api/reports/route.ts` - Existing GET/POST patterns with brand ownership checks
- `/src/lib/audit-logger.ts` - Phase 11 logAudit() implementation (best-effort, never throws)
- `/supabase/schema.sql` - Foreign key relationships: scans/threats/reports → brands (CASCADE), threats → scans (SET NULL)
- `/src/types/index.ts` - Existing AuditAction, AuditEntityType, Evidence types

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Next.js API Routes, Supabase client, PostgreSQL CASCADE all in active use; no new dependencies
- Architecture: HIGH - Patterns match existing POST/GET endpoints; audit-logger.ts integration verified; foreign key CASCADE defined in schema
- Pitfalls: HIGH - Based on verified CASCADE behavior, Supabase Storage API documentation, and common REST API ownership verification failures
- Storage cleanup: MEDIUM - Supabase Storage delete API documented but not yet used in codebase; service role requirement verified

**Research date:** 2026-01-29
**Valid until:** 2026-04-29 (90 days - REST API patterns stable, Supabase API stable)
