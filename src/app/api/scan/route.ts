import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ALLOWED_SCAN_TYPES = new Set(['full', 'quick', 'domain_only', 'web_only', 'social_only'])

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { brandId, scanType = 'full' } = body
    const normalizedScanType = ALLOWED_SCAN_TYPES.has(scanType) ? scanType : 'full'

    if (!brandId) {
      return NextResponse.json({ error: 'Brand ID is required' }, { status: 400 })
    }

    // Get brand details
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('*')
      .eq('id', brandId)
      .eq('user_id', user.id)
      .single()

    if (brandError || !brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    // Prevent duplicate queued/running scans for the same brand
    const { data: existingJob } = await supabase
      .from('scan_jobs')
      .select('id')
      .eq('brand_id', brandId)
      .in('status', ['queued', 'running'])
      .limit(1)
      .maybeSingle()

    if (existingJob) {
      return NextResponse.json(
        { error: 'A scan is already queued or running for this brand.' },
        { status: 409 }
      )
    }

    // Create scan record
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .insert({
        brand_id: brandId,
        scan_type: normalizedScanType,
        status: 'pending',
        threats_found: 0,
        domains_checked: 0,
        pages_scanned: 0
      })
      .select()
      .single()

    if (scanError) throw scanError

    // Create scan job
    const { data: job, error: jobError } = await supabase
      .from('scan_jobs')
      .insert({
        brand_id: brandId,
        scan_id: scan.id,
        scan_type: normalizedScanType,
        status: 'queued',
        priority: 0,
        scheduled_at: new Date().toISOString(),
        payload: {}
      })
      .select()
      .single()

    if (jobError) {
      await supabase
        .from('scans')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error: jobError.message
        })
        .eq('id', scan.id)
      throw jobError
    }

    return NextResponse.json({
      message: 'Scan queued',
      scanId: scan.id,
      jobId: job.id
    })
  } catch (error) {
    console.error('Error queueing scan:', error)
    return NextResponse.json(
      { error: 'Failed to queue scan' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const scanId = searchParams.get('id')

    if (!scanId) {
      return NextResponse.json({ error: 'Scan ID required' }, { status: 400 })
    }

    const { data: scan, error } = await supabase
      .from('scans')
      .select('*, brands!inner(user_id)')
      .eq('id', scanId)
      .eq('brands.user_id', user.id)
      .single()

    if (error || !scan) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 })
    }

    return NextResponse.json(scan)
  } catch (error) {
    console.error('Error fetching scan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scan' },
      { status: 500 }
    )
  }
}
