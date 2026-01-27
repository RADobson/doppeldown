import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getEffectiveTier, getManualScanLimit, MANUAL_SCAN_PERIOD_MS } from '@/lib/tier-limits'

export interface QuotaResponse {
  limit: number | null  // null = unlimited
  used: number
  remaining: number | null  // null = unlimited
  resetsAt: number | null  // timestamp ms, null if unlimited or period not started
  isUnlimited: boolean
}

export async function GET(): Promise<NextResponse<QuotaResponse | { error: string }>> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user subscription and quota data
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_status, subscription_tier, is_admin, manual_scans_period_start, manual_scans_count')
      .eq('id', user.id)
      .single()

    const effectiveTier = getEffectiveTier(
      userData?.subscription_status,
      userData?.subscription_tier
    )

    // Admin or paid tier = unlimited
    const manualScanLimit = getManualScanLimit(effectiveTier)
    if (userData?.is_admin || manualScanLimit === null) {
      return NextResponse.json({
        limit: null,
        used: 0,
        remaining: null,
        resetsAt: null,
        isUnlimited: true
      })
    }

    // Free tier - calculate quota based on rolling 7-day window
    const periodStart = userData?.manual_scans_period_start
    const scansUsed = userData?.manual_scans_count || 0
    const now = Date.now()

    // Check if period expired (7 days)
    const periodExpired = !periodStart ||
      (now - new Date(periodStart).getTime() > MANUAL_SCAN_PERIOD_MS)

    if (periodExpired) {
      // Period expired or never started - full quota available
      return NextResponse.json({
        limit: manualScanLimit,
        used: 0,
        remaining: manualScanLimit,
        resetsAt: null,  // No active period
        isUnlimited: false
      })
    }

    // Active period - calculate remaining
    const resetsAt = new Date(periodStart).getTime() + MANUAL_SCAN_PERIOD_MS

    return NextResponse.json({
      limit: manualScanLimit,
      used: scansUsed,
      remaining: Math.max(0, manualScanLimit - scansUsed),
      resetsAt,
      isUnlimited: false
    })
  } catch (error) {
    console.error('Error fetching quota status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quota status' },
      { status: 500 }
    )
  }
}
