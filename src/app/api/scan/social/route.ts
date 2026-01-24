import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Dedicated endpoint for social media scanning
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { brandId, platforms } = body

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

    const platformsToScan = platforms || [
      'facebook',
      'instagram',
      'twitter',
      'linkedin',
      'tiktok',
      'youtube',
      'telegram',
      'discord'
    ]

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
        scan_type: 'social_only',
        status: 'pending',
        threats_found: 0,
        domains_checked: 0,
        pages_scanned: 0
      })
      .select()
      .single()

    if (scanError) throw scanError

    // Create scan job with platform payload
    const { data: job, error: jobError } = await supabase
      .from('scan_jobs')
      .insert({
        brand_id: brandId,
        scan_id: scan.id,
        scan_type: 'social_only',
        status: 'queued',
        priority: 0,
        scheduled_at: new Date().toISOString(),
        payload: { platforms: platformsToScan }
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
      success: true,
      message: 'Social scan queued',
      scanId: scan.id,
      jobId: job.id,
      platforms: platformsToScan
    })
  } catch (error) {
    console.error('Social scan error:', error)
    return NextResponse.json(
      { error: 'Failed to queue social media scan' },
      { status: 500 }
    )
  }
}
