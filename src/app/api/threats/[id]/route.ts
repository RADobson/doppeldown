import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit-logger'
import type { Threat } from '@/types'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Note: Next.js 14+ App Router params is a Promise that must be awaited
    const { id } = await params
    const supabase = await createClient()

    // 1. Authenticate
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Fetch threat with evidence field and verify ownership via brand
    const { data: threat, error: fetchError } = await supabase
      .from('threats')
      .select('id, brand_id, type, severity, url, evidence, brands!inner(user_id)')
      .eq('id', id)
      .single<Threat & { brands: { user_id: string } }>()

    if (fetchError || !threat) {
      return NextResponse.json({ error: 'Threat not found' }, { status: 404 })
    }

    // Verify user owns the brand
    if (threat.brands.user_id !== user.id) {
      return NextResponse.json({ error: 'Threat not found' }, { status: 404 })
    }

    // 3. Extract storage paths from evidence for cleanup
    const storagePaths = threat.evidence?.screenshots
      ?.filter(s => s.storage_path)
      .map(s => s.storage_path) || []

    // 4. Best-effort storage cleanup using service client
    let filesDeleted = 0
    if (storagePaths.length > 0) {
      try {
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
      } catch (storageErr) {
        console.error('Storage cleanup error:', storageErr)
        // Continue - best-effort cleanup
      }
    }

    // 5. Call logAudit() before deletion
    await logAudit({
      user_id: user.id,
      user_email: user.email,
      action: 'DELETE',
      entity_type: 'threat',
      entity_id: threat.id,
      metadata: {
        brand_id: threat.brand_id,
        threat_type: threat.type,
        severity: threat.severity,
        url: threat.url,
        evidence_files_deleted: filesDeleted
      }
    })

    // 6. Delete threat from database
    // Use service client for delete to bypass RLS (ownership already verified above)
    const serviceClient = await createServiceClient()
    const { error: deleteError } = await serviceClient
      .from('threats')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting threat:', deleteError)
      throw deleteError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/threats/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete threat' },
      { status: 500 }
    )
  }
}
