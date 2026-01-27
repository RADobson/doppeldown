import { createServiceClient } from './supabase/server'
import type { NotificationType, ThreatSeverity, Threat, Brand } from '@/types'

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  body?: string
  severity?: ThreatSeverity
  metadata?: Record<string, unknown>
}

export async function createNotification(params: CreateNotificationParams) {
  const supabase = await createServiceClient()

  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: params.userId,
      type: params.type,
      title: params.title,
      body: params.body,
      severity: params.severity,
      metadata: params.metadata || {}
    })

  if (error) {
    console.error('Failed to create notification:', error)
  }

  return { error }
}

/**
 * Create a batched threat notification for a scan.
 * Groups threats by highest severity found.
 */
export async function createThreatNotification(
  userId: string,
  brand: Brand,
  threats: Partial<Threat>[],
  scanId: string
) {
  if (threats.length === 0) return

  // Find highest severity
  const severityOrder: ThreatSeverity[] = ['critical', 'high', 'medium', 'low']
  let highestSeverity: ThreatSeverity = 'low'
  for (const threat of threats) {
    const idx = severityOrder.indexOf(threat.severity as ThreatSeverity)
    const currentIdx = severityOrder.indexOf(highestSeverity)
    if (idx !== -1 && idx < currentIdx) {
      highestSeverity = threat.severity as ThreatSeverity
    }
  }

  const title = threats.length === 1
    ? `New ${highestSeverity} threat detected`
    : `${threats.length} new threats detected`

  const body = `${brand.name}: ${threats.length} threat${threats.length !== 1 ? 's' : ''} found during scan`

  return createNotification({
    userId,
    type: 'threat_detected',
    title,
    body,
    severity: highestSeverity,
    metadata: {
      brand_id: brand.id,
      brand_name: brand.name,
      scan_id: scanId,
      threat_count: threats.length
    }
  })
}

/**
 * Create a scan completed notification.
 */
export async function createScanCompletedNotification(
  userId: string,
  brand: Brand,
  scanId: string,
  stats: { domainsChecked: number; threatsFound: number }
) {
  const title = 'Scan completed'
  const body = stats.threatsFound > 0
    ? `${brand.name}: Found ${stats.threatsFound} threat${stats.threatsFound !== 1 ? 's' : ''} (${stats.domainsChecked} domains checked)`
    : `${brand.name}: No new threats found (${stats.domainsChecked} domains checked)`

  return createNotification({
    userId,
    type: 'scan_completed',
    title,
    body,
    metadata: {
      brand_id: brand.id,
      brand_name: brand.name,
      scan_id: scanId,
      threat_count: stats.threatsFound,
      domains_checked: stats.domainsChecked
    }
  })
}

/**
 * Create a scan failed notification.
 */
export async function createScanFailedNotification(
  userId: string,
  brand: Brand,
  scanId: string,
  error: string
) {
  return createNotification({
    userId,
    type: 'scan_failed',
    title: 'Scan failed',
    body: `${brand.name}: ${error}`,
    metadata: {
      brand_id: brand.id,
      brand_name: brand.name,
      scan_id: scanId,
      error
    }
  })
}
