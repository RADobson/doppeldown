import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Scan frequency per subscription tier
const SCAN_FREQUENCIES: Record<string, number> = {
  starter: 7,       // Weekly (7 days)
  professional: 1,  // Daily (1 day)
  enterprise: 0,    // Continuous (always scan)
}

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createServiceClient()
    const now = new Date()

    // Get all active brands that need scanning
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select(`
        *,
        users!inner(
          id,
          email,
          subscription_status,
          subscription_tier
        )
      `)
      .eq('status', 'active')

    if (brandsError) throw brandsError

    const results = {
      queued: 0,
      skipped: 0,
      errors: [] as string[]
    }

    for (const brand of brands || []) {
      try {
        const subscriptionStatus = brand.users?.subscription_status || 'free'
        const subscriptionTier = brand.users?.subscription_tier || 'free'

        if (subscriptionStatus !== 'active' || subscriptionTier === 'free') {
          results.skipped++
          continue
        }

        const scanFrequency = SCAN_FREQUENCIES[subscriptionTier] ?? 1

        // Check if brand needs scanning based on frequency
        const lastScan = brand.last_scan_at ? new Date(brand.last_scan_at) : null
        const daysSinceLastScan = lastScan
          ? Math.floor((now.getTime() - lastScan.getTime()) / (1000 * 60 * 60 * 24))
          : Infinity

        if (scanFrequency > 0 && daysSinceLastScan < scanFrequency) {
          results.skipped++
          continue
        }

        // Prevent duplicate queued/running scans for the same brand
        const { data: existingJob } = await supabase
          .from('scan_jobs')
          .select('id')
          .eq('brand_id', brand.id)
          .in('status', ['queued', 'running'])
          .limit(1)
          .maybeSingle()

        if (existingJob) {
          results.skipped++
          continue
        }

        // Create scan record
        const { data: scan, error: scanError } = await supabase
          .from('scans')
          .insert({
            brand_id: brand.id,
            scan_type: 'automated',
            status: 'pending',
            threats_found: 0,
            domains_checked: 0,
            pages_scanned: 0
          })
          .select()
          .single()

        if (scanError) throw scanError

        // Create scan job
        const { error: jobError } = await supabase
          .from('scan_jobs')
          .insert({
            brand_id: brand.id,
            scan_id: scan.id,
            scan_type: 'automated',
            status: 'queued',
            priority: 1,
            scheduled_at: new Date().toISOString(),
            payload: {}
          })

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

        results.queued++
      } catch (brandError) {
        const errorMsg = brandError instanceof Error ? brandError.message : 'Unknown error'
        results.errors.push(`Brand ${brand.id}: ${errorMsg}`)
        console.error(`Error queueing brand ${brand.id}:`, brandError)
      }
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: now.toISOString()
    })
  } catch (error) {
    console.error('Cron scan error:', error)
    return NextResponse.json(
      { error: 'Cron scan failed' },
      { status: 500 }
    )
  }
}
