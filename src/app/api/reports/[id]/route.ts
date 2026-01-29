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

    // 2. Fetch report and verify ownership via brand
    const { data: report, error: fetchError } = await supabase
      .from('reports')
      .select('id, brand_id, type, brands!inner(user_id)')
      .eq('id', id)
      .single<{ id: string; brand_id: string; type: string; brands: { user_id: string } }>()

    if (fetchError || !report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    // Verify user owns the brand
    if (report.brands.user_id !== user.id) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    // 3. Call logAudit() before deletion
    await logAudit({
      user_id: user.id,
      user_email: user.email,
      action: 'DELETE',
      entity_type: 'report',
      entity_id: report.id,
      metadata: {
        brand_id: report.brand_id,
        report_type: report.type
      }
    })

    // 4. Delete report from database
    // No storage cleanup needed - reports generated on-demand
    // Use service client for delete to bypass RLS (ownership already verified above)
    const serviceClient = await createServiceClient()
    const { error: deleteError } = await serviceClient
      .from('reports')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting report:', deleteError)
      throw deleteError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/reports/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete report' },
      { status: 500 }
    )
  }
}
