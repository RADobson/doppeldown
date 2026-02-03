import { NextRequest } from 'next/server'
import { randomInt } from 'crypto'
import { createServiceClient } from '@/lib/supabase/server'
import { getEffectiveTier, getTierLimits, getScanFrequencyHours } from '@/lib/tier-limits'
import { CRON_CONFIG } from '@/lib/constants'
import { 
  withErrorHandler, 
  createSuccessResponse,
  AppError,
} from '@/lib/errors'
import { logger } from '@/lib/logger'
import { validateBearerToken } from '@/lib/security'

/**
 * GET handler for automated scan cron job
 * Queues scans for brands that are due based on their tier's frequency
 * 
 * @param request - Next.js request object
 * @returns JSON response with queueing results
 */
async function getHandler(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access (timing-safe comparison)
  const authHeader = request.headers.get('authorization')
  if (!validateBearerToken(authHeader, process.env.CRON_SECRET)) {
    throw new AppError('UNAUTHORIZED', 'Invalid cron authorization')
  }

  const supabase = await createServiceClient()
  const now = new Date()
  const requestId = crypto.randomUUID()

  logger.info('Starting automated scan cron job', { requestId })

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
    .eq('auto_scan_enabled', true)

  if (brandsError) {
    logger.error('Failed to fetch brands for cron scan', brandsError, { requestId })
    throw new AppError('DATABASE_ERROR', 'Failed to fetch brands')
  }

  const results = {
    queued: 0,
    skipped: 0,
    errors: [] as string[]
  }

  for (const brand of brands || []) {
    try {
      const effectiveTier = getEffectiveTier(
        brand.users?.subscription_status,
        brand.users?.subscription_tier
      )

      // Skip free tier users (no automated scans)
      const scanFrequencyHours = getScanFrequencyHours(effectiveTier)
      if (scanFrequencyHours === null) {
        results.skipped++
        continue
      }

      // Check if brand needs scanning based on hours-based frequency
      const lastScan = brand.last_scan_at ? new Date(brand.last_scan_at) : null
      const hoursSinceLastScan = lastScan
        ? Math.floor((now.getTime() - lastScan.getTime()) / (1000 * 60 * 60))
        : Infinity

      if (hoursSinceLastScan < scanFrequencyHours) {
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

      if (scanError) {
        throw new Error(`Failed to create scan: ${scanError.message}`)
      }

      // Build job payload with tier-specific limits
      const enabledPlatforms = Array.isArray(brand.enabled_social_platforms)
        ? brand.enabled_social_platforms
        : undefined

      // Create scan job with jitter to spread load
      const jitterMs = randomInt(0, CRON_CONFIG.JITTER_MAX_MS)
      const tierLimits = getTierLimits(effectiveTier)
      const { error: jobError } = await supabase
        .from('scan_jobs')
        .insert({
          brand_id: brand.id,
          scan_id: scan.id,
          scan_type: 'automated',
          status: 'queued',
          priority: CRON_CONFIG.AUTOMATED_SCAN_PRIORITY,
          scheduled_at: new Date(Date.now() + jitterMs).toISOString(),
          payload: {
            variationLimit: tierLimits.variationLimit,
            platforms: enabledPlatforms,
          }
        })

      if (jobError) {
        // Clean up scan record if job creation fails
        await supabase
          .from('scans')
          .update({
            status: 'failed',
            completed_at: new Date().toISOString(),
            error: jobError.message
          })
          .eq('id', scan.id)
        throw new Error(`Failed to create job: ${jobError.message}`)
      }

      results.queued++
      
      logger.debug('Scan queued for brand', {
        requestId,
        brandId: brand.id,
        scanId: scan.id,
        tier: effectiveTier,
      })
    } catch (brandError) {
      const errorMsg = brandError instanceof Error ? brandError.message : 'Unknown error'
      results.errors.push(`Brand ${brand.id}: ${errorMsg}`)
      logger.error(`Error queueing scan for brand ${brand.id}`, 
        brandError instanceof Error ? brandError : undefined,
        { requestId, brandId: brand.id }
      )
    }
  }

  logger.info('Automated scan cron job completed', {
    requestId,
    queued: results.queued,
    skipped: results.skipped,
    errors: results.errors.length,
  })

  return createSuccessResponse({
    results,
    timestamp: now.toISOString()
  })
}

export const GET = withErrorHandler(getHandler)
