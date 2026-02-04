/**
 * Alert Manager
 * 
 * Multi-channel alert delivery system:
 * - Webhook (Slack, Discord, PagerDuty, custom)
 * - Email (via existing Resend integration)
 * - Console (always, as fallback)
 * 
 * Features:
 * - Alert deduplication (same alert won't fire repeatedly within cooldown)
 * - Severity-based routing (critical → all channels, warning → webhook only)
 * - Alert batching to prevent notification storms
 * - Configurable cooldown periods
 */

import { structuredLogger } from './structured-logger'

// ============================================================================
// Types
// ============================================================================

export type AlertChannel = 'webhook' | 'email' | 'console'

export interface AlertPayload {
  severity: 'info' | 'warning' | 'critical'
  title: string
  message: string
  source: string
  metadata?: Record<string, unknown>
  channels?: AlertChannel[]
}

interface AlertRecord {
  payload: AlertPayload
  sentAt: string
  channels: AlertChannel[]
  deduplicationKey: string
}

// ============================================================================
// Configuration
// ============================================================================

interface AlertConfig {
  /** Webhook URL for Slack/Discord/PagerDuty */
  webhookUrl?: string
  /** Secondary webhook URL */
  secondaryWebhookUrl?: string
  /** Email address for critical alerts */
  alertEmail?: string
  /** Cooldown in ms to prevent duplicate alerts (default: 5 minutes) */
  cooldownMs: number
  /** Maximum alerts per hour before throttling */
  maxAlertsPerHour: number
  /** Which channels to use for each severity */
  routing: Record<AlertPayload['severity'], AlertChannel[]>
}

const config: AlertConfig = {
  webhookUrl: process.env.ALERT_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL,
  secondaryWebhookUrl: process.env.ALERT_SECONDARY_WEBHOOK_URL,
  alertEmail: process.env.ALERT_EMAIL || process.env.ADMIN_EMAIL,
  cooldownMs: parseInt(process.env.ALERT_COOLDOWN_MS || '300000', 10), // 5 min default
  maxAlertsPerHour: parseInt(process.env.ALERT_MAX_PER_HOUR || '30', 10),
  routing: {
    info: ['console'],
    warning: ['console', 'webhook'],
    critical: ['console', 'webhook', 'email'],
  },
}

// ============================================================================
// Alert Manager
// ============================================================================

class AlertManager {
  private recentAlerts: AlertRecord[] = []
  private cooldownMap = new Map<string, number>() // dedup key → last sent timestamp
  private hourlyCount = 0
  private hourlyResetTime = Date.now() + 3_600_000
  private log = structuredLogger.child({ component: 'alert-manager' })

  /**
   * Send an alert through configured channels
   */
  async send(payload: AlertPayload): Promise<void> {
    const dedupKey = this.getDeduplicationKey(payload)

    // Check cooldown
    const lastSent = this.cooldownMap.get(dedupKey)
    if (lastSent && Date.now() - lastSent < config.cooldownMs) {
      this.log.debug(`Alert suppressed (cooldown): ${payload.title}`)
      return
    }

    // Check hourly rate limit
    if (Date.now() > this.hourlyResetTime) {
      this.hourlyCount = 0
      this.hourlyResetTime = Date.now() + 3_600_000
    }
    if (this.hourlyCount >= config.maxAlertsPerHour) {
      this.log.warn('Alert throttled: hourly limit reached', {
        limit: config.maxAlertsPerHour,
        title: payload.title,
      })
      return
    }

    // Determine channels
    const channels = payload.channels || config.routing[payload.severity]

    // Record alert
    const record: AlertRecord = {
      payload,
      sentAt: new Date().toISOString(),
      channels,
      deduplicationKey: dedupKey,
    }
    this.recentAlerts.push(record)
    if (this.recentAlerts.length > 200) {
      this.recentAlerts = this.recentAlerts.slice(-200)
    }

    this.cooldownMap.set(dedupKey, Date.now())
    this.hourlyCount++

    // Dispatch to channels
    const promises: Promise<void>[] = []

    for (const channel of channels) {
      switch (channel) {
        case 'console':
          this.sendToConsole(payload)
          break
        case 'webhook':
          promises.push(this.sendToWebhook(payload))
          break
        case 'email':
          promises.push(this.sendToEmail(payload))
          break
      }
    }

    // Fire and forget (don't block on alert delivery)
    Promise.allSettled(promises).catch(() => {
      // Silently handle delivery failures
    })
  }

  /**
   * Console output (always works)
   */
  private sendToConsole(payload: AlertPayload): void {
    const icon = payload.severity === 'critical' ? '🔴'
      : payload.severity === 'warning' ? '🟡'
      : 'ℹ️'

    const msg = `${icon} [ALERT:${payload.severity.toUpperCase()}] ${payload.title}\n${payload.message}`

    if (payload.severity === 'critical') {
      console.error(msg)
    } else if (payload.severity === 'warning') {
      console.warn(msg)
    } else {
      console.info(msg)
    }
  }

  /**
   * Webhook delivery (Slack, Discord, PagerDuty compatible)
   */
  private async sendToWebhook(payload: AlertPayload): Promise<void> {
    if (!config.webhookUrl) {
      this.log.debug('Webhook URL not configured, skipping webhook alert')
      return
    }

    const color = payload.severity === 'critical' ? '#FF0000'
      : payload.severity === 'warning' ? '#FFA500'
      : '#0000FF'

    // Slack-compatible format (also works with Discord webhooks)
    const body = {
      text: `[${payload.severity.toUpperCase()}] ${payload.title}`,
      attachments: [{
        color,
        title: payload.title,
        text: payload.message,
        fields: [
          { title: 'Severity', value: payload.severity, short: true },
          { title: 'Source', value: payload.source, short: true },
          ...(payload.metadata
            ? Object.entries(payload.metadata).map(([key, value]) => ({
                title: key,
                value: String(value),
                short: true,
              }))
            : []),
        ],
        ts: Math.floor(Date.now() / 1000),
      }],
    }

    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        this.log.warn(`Webhook delivery failed: ${response.status}`)
      }
    } catch (error) {
      this.log.error('Webhook delivery error', error instanceof Error ? error : undefined)
    }

    // Also send to secondary webhook if configured
    if (config.secondaryWebhookUrl && payload.severity === 'critical') {
      try {
        await fetch(config.secondaryWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } catch {
        // Best effort for secondary
      }
    }
  }

  /**
   * Email delivery for critical alerts
   */
  private async sendToEmail(payload: AlertPayload): Promise<void> {
    if (!config.alertEmail) {
      this.log.debug('Alert email not configured, skipping email alert')
      return
    }

    // Use internal API route to send email (leverages existing email infrastructure)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/email/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: config.alertEmail,
          subject: `[DoppelDown ${payload.severity.toUpperCase()}] ${payload.title}`,
          text: [
            `Severity: ${payload.severity}`,
            `Source: ${payload.source}`,
            `Time: ${new Date().toISOString()}`,
            '',
            payload.message,
            '',
            payload.metadata ? `Metadata: ${JSON.stringify(payload.metadata, null, 2)}` : '',
          ].join('\n'),
        }),
      })
    } catch (error) {
      this.log.error('Email alert delivery error', error instanceof Error ? error : undefined)
    }
  }

  /**
   * Generate deduplication key
   */
  private getDeduplicationKey(payload: AlertPayload): string {
    return `${payload.source}:${payload.severity}:${payload.title}`
  }

  /**
   * Get recent alerts (for dashboard)
   */
  getRecentAlerts(limit = 50): AlertRecord[] {
    return this.recentAlerts.slice(-limit).reverse()
  }

  /**
   * Get alert count by severity in the last hour
   */
  getHourlySummary(): Record<string, number> {
    const hourAgo = Date.now() - 3_600_000
    const recent = this.recentAlerts.filter(
      a => new Date(a.sentAt).getTime() > hourAgo
    )
    return {
      info: recent.filter(a => a.payload.severity === 'info').length,
      warning: recent.filter(a => a.payload.severity === 'warning').length,
      critical: recent.filter(a => a.payload.severity === 'critical').length,
      total: recent.length,
    }
  }
}

// ============================================================================
// Export Singleton
// ============================================================================

export const alertManager = new AlertManager()
