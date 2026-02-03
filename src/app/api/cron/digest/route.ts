import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendWeeklyDigest } from '@/lib/email'
import { subDays } from 'date-fns'
import { 
  withErrorHandler, 
  createSuccessResponse,
  AppError,
} from '@/lib/errors'
import { logger } from '@/lib/logger'
import { validateBearerToken } from '@/lib/security'

async function getHandler(request: NextRequest) {
  // Verify cron secret (timing-safe comparison)
  const authHeader = request.headers.get('authorization')
  if (!validateBearerToken(authHeader, process.env.CRON_SECRET)) {
    throw new AppError('UNAUTHORIZED', 'Invalid cron authorization')
  }

  const supabase = await createServiceClient()
  const weekAgo = subDays(new Date(), 7).toISOString()
  const requestId = crypto.randomUUID()

  logger.info('Starting weekly digest cron job', { requestId })

  // Get users with weekly digest enabled
  const { data: settings, error: settingsError } = await supabase
    .from('alert_settings')
    .select('user_id, alert_email')
    .eq('email_alerts', true)
    .or('weekly_digest.eq.true,daily_digest.eq.true')  // Support both for transition

  if (settingsError) {
    logger.error('Failed to fetch alert settings', settingsError, { requestId })
    throw new AppError('DATABASE_ERROR', 'Failed to fetch alert settings')
  }

  const results = { sent: 0, skipped: 0, errors: [] as string[] }

  for (const setting of settings || []) {
    try {
      // Get user email fallback
      const { data: user } = await supabase
        .from('users')
        .select('email')
        .eq('id', setting.user_id)
        .single()

      const email = setting.alert_email || user?.email
      if (!email) {
        results.skipped++
        continue
      }

      // Get user's brands
      const { data: brands } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', setting.user_id)

      if (!brands?.length) {
        results.skipped++
        continue
      }

      // Get threats from past week for each brand
      const brandSummaries = []
      for (const brand of brands) {
        const { data: threats, count } = await supabase
          .from('threats')
          .select('*', { count: 'exact' })
          .eq('brand_id', brand.id)
          .gte('detected_at', weekAgo)
          .order('detected_at', { ascending: false })
          .limit(10)  // Limit to avoid Gmail clipping

        if (count && count > 0) {
          brandSummaries.push({ brand, newThreats: count, threats: threats || [] })
        }
      }

      // Send digest if there's anything to report
      if (brandSummaries.length > 0) {
        await sendWeeklyDigest(email, brandSummaries)
        results.sent++
        
        logger.info('Weekly digest sent', {
          requestId,
          userId: setting.user_id,
          email,
          brandCount: brandSummaries.length,
          totalThreats: brandSummaries.reduce((sum, b) => sum + b.newThreats, 0),
        })
      } else {
        results.skipped++
      }
    } catch (userError) {
      const msg = userError instanceof Error ? userError.message : 'Unknown'
      results.errors.push(`User ${setting.user_id}: ${msg}`)
      logger.error(`Error sending digest to user ${setting.user_id}`,
        userError instanceof Error ? userError : undefined,
        { requestId, userId: setting.user_id }
      )
    }
  }

  logger.info('Weekly digest cron job completed', {
    requestId,
    sent: results.sent,
    skipped: results.skipped,
    errors: results.errors.length,
  })

  return createSuccessResponse({
    results,
    timestamp: new Date().toISOString()
  })
}

export const GET = withErrorHandler(getHandler)
