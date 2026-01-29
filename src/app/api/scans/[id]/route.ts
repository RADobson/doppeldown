import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit-logger'

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

    // 2. Fetch scan and verify ownership via brand
    const { data: scan, error: fetchError } = await supabase
      .from('scans')
      .select('id, brand_id, scan_type, threats_found, brands!inner(user_id)')
      .eq('id', id)
      .single<{ id: string; brand_id: string; scan_type: string; threats_found: number; brands: { user_id: string } }>()

    if (fetchError || !scan) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 })
    }

    // Verify user owns the brand
    if (scan.brands.user_id !== user.id) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 })
    }

    // 3. Query threats count for audit metadata
    const { count: threatsCount } = await supabase
      .from('threats')
      .select('id', { count: 'exact', head: true })
      .eq('scan_id', id)

    // 4. Collect evidence storage paths from associated threats for cleanup
    const { data: threats } = await supabase
      .from('threats')
      .select('evidence')
      .eq('scan_id', id)

    const storagePaths: string[] = []
    if (threats) {
      for (const threat of threats) {
        if (threat.evidence?.screenshots) {
          for (const screenshot of threat.evidence.screenshots) {
            if (screenshot.storage_path) {
              storagePaths.push(screenshot.storage_path)
            }
          }
        }
      }
    }

    // 5. Best-effort storage file cleanup using service client
    if (storagePaths.length > 0) {
      try {
        const storageClient = await createServiceClient()
        const bucket = process.env.SUPABASE_EVIDENCE_BUCKET || 'evidence'

        const { error: storageError } = await storageClient.storage
          .from(bucket)
          .remove(storagePaths)

        if (storageError) {
          console.error('Failed to delete evidence files:', storageError)
          // Continue - orphaned files acceptable
        }
      } catch (storageErr) {
        console.error('Storage cleanup error:', storageErr)
        // Continue - best-effort cleanup
      }
    }

    // 6. Call logAudit() before deletion
    await logAudit({
      user_id: user.id,
      user_email: user.email,
      action: 'DELETE',
      entity_type: 'scan',
      entity_id: scan.id,
      metadata: {
        brand_id: scan.brand_id,
        scan_type: scan.scan_type,
        cascade_threats_count: threatsCount || 0
      }
    })

    // 7. Delete associated threats BEFORE scan deletion
    // CRITICAL: threats.scan_id FK is ON DELETE SET NULL, not CASCADE
    // So we must manually delete threats to fully clean up
    // Use service client for delete to bypass RLS (ownership already verified above)
    const serviceClient = await createServiceClient()

    const { error: threatsDeleteError } = await serviceClient
      .from('threats')
      .delete()
      .eq('scan_id', id)

    if (threatsDeleteError) {
      console.error('Error deleting associated threats:', threatsDeleteError)
      throw threatsDeleteError
    }

    // 8. Delete the scan
    const { error: deleteError } = await serviceClient
      .from('scans')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting scan:', deleteError)
      throw deleteError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/scans/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete scan' },
      { status: 500 }
    )
  }
}
