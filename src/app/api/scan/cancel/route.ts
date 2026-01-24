import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { scanId } = body || {}
    if (!scanId) {
      return NextResponse.json({ error: 'Scan ID is required' }, { status: 400 })
    }

    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .select('id, status, brands!inner(user_id)')
      .eq('id', scanId)
      .eq('brands.user_id', user.id)
      .single()

    if (scanError || !scan) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 })
    }

    const service = await createServiceClient()
    const now = new Date().toISOString()

    await service
      .from('scan_jobs')
      .update({
        status: 'cancelled',
        completed_at: now,
        locked_at: null,
        locked_by: null,
        last_error: 'Cancelled by user'
      })
      .eq('scan_id', scanId)
      .in('status', ['queued', 'running'])

    await service
      .from('scans')
      .update({
        status: 'failed',
        completed_at: now,
        error: 'Cancelled by user'
      })
      .eq('id', scanId)

    return NextResponse.json({ message: 'Scan cancelled', scanId })
  } catch (error) {
    console.error('Error cancelling scan:', error)
    return NextResponse.json(
      { error: 'Failed to cancel scan' },
      { status: 500 }
    )
  }
}
