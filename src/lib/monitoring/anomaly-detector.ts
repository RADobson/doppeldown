/**
 * Anomaly Detection & Alerting Engine
 * 
 * Monitors key metrics for statistical anomalies and triggers alerts:
 * - Error rate spikes (z-score based)
 * - Latency degradation
 * - Traffic anomalies (sudden drops or spikes)
 * - Service health degradation
 * - Resource exhaustion warnings
 * 
 * Uses rolling window statistics with configurable thresholds.
 */

import { structuredLogger } from './structured-logger'
import { alertManager } from './alert-manager'

// ============================================================================
// Types
// ============================================================================

export type AlertSeverity = 'info' | 'warning' | 'critical'

export interface AnomalyAlert {
  id: string
  severity: AlertSeverity
  metric: string
  message: string
  currentValue: number
  threshold: number
  zScore?: number
  timestamp: string
  resolved: boolean
  resolvedAt?: string
}

interface MetricSeries {
  name: string
  values: Array<{ value: number; timestamp: number }>
  windowMs: number
  thresholds: {
    warning: number   // z-score or absolute
    critical: number  // z-score or absolute
  }
  mode: 'zscore' | 'absolute' | 'rate'
}

interface AnomalyRule {
  metric: string
  checkFn: () => { value: number; context?: Record<string, unknown> }
  intervalMs: number
  windowSize: number
  thresholds: { warning: number; critical: number }
  mode: 'zscore' | 'absolute' | 'rate'
  message: (value: number, severity: AlertSeverity) => string
}

// ============================================================================
// Statistical Helpers
// ============================================================================

function mean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0
  const avg = mean(values)
  const squareDiffs = values.map(v => Math.pow(v - avg, 2))
  return Math.sqrt(mean(squareDiffs))
}

function zScore(value: number, values: number[]): number {
  const avg = mean(values)
  const sd = standardDeviation(values)
  if (sd === 0) return 0
  return (value - avg) / sd
}

// ============================================================================
// Anomaly Detector
// ============================================================================

class AnomalyDetector {
  private series = new Map<string, MetricSeries>()
  private activeAlerts = new Map<string, AnomalyAlert>()
  private alertHistory: AnomalyAlert[] = []
  private rules: AnomalyRule[] = []
  private checkIntervals = new Map<string, ReturnType<typeof setInterval>>()
  private log = structuredLogger.child({ component: 'anomaly-detector' })
  private started = false

  /**
   * Register a metric series for monitoring
   */
  registerMetric(
    name: string,
    options: {
      windowMs?: number
      thresholds: { warning: number; critical: number }
      mode?: 'zscore' | 'absolute' | 'rate'
    }
  ): void {
    this.series.set(name, {
      name,
      values: [],
      windowMs: options.windowMs || 300_000, // 5 minutes default
      thresholds: options.thresholds,
      mode: options.mode || 'zscore',
    })
  }

  /**
   * Push a new data point for a metric
   */
  recordValue(metric: string, value: number): void {
    const series = this.series.get(metric)
    if (!series) return

    const now = Date.now()
    series.values.push({ value, timestamp: now })

    // Trim values outside the window
    const windowStart = now - series.windowMs
    series.values = series.values.filter(v => v.timestamp > windowStart)

    // Check for anomaly
    this.checkAnomaly(metric, value, series)
  }

  /**
   * Check if the latest value is anomalous
   */
  private checkAnomaly(metric: string, currentValue: number, series: MetricSeries): void {
    const values = series.values.map(v => v.value)
    if (values.length < 5) return // Need minimum data points

    let severity: AlertSeverity | null = null
    let score = 0

    switch (series.mode) {
      case 'zscore': {
        score = zScore(currentValue, values)
        if (Math.abs(score) >= series.thresholds.critical) {
          severity = 'critical'
        } else if (Math.abs(score) >= series.thresholds.warning) {
          severity = 'warning'
        }
        break
      }
      case 'absolute': {
        if (currentValue >= series.thresholds.critical) {
          severity = 'critical'
          score = currentValue
        } else if (currentValue >= series.thresholds.warning) {
          severity = 'warning'
          score = currentValue
        }
        break
      }
      case 'rate': {
        // Rate of change check
        const recent = values.slice(-5)
        const older = values.slice(-10, -5)
        if (recent.length > 0 && older.length > 0) {
          const recentAvg = mean(recent)
          const olderAvg = mean(older)
          const changeRate = olderAvg > 0 ? (recentAvg - olderAvg) / olderAvg : 0
          score = changeRate
          if (Math.abs(changeRate) >= series.thresholds.critical) {
            severity = 'critical'
          } else if (Math.abs(changeRate) >= series.thresholds.warning) {
            severity = 'warning'
          }
        }
        break
      }
    }

    if (severity) {
      this.raiseAlert(metric, currentValue, severity, score, series)
    } else {
      // Check if we should resolve an existing alert
      this.resolveAlert(metric)
    }
  }

  /**
   * Raise or update an anomaly alert
   */
  private raiseAlert(
    metric: string,
    currentValue: number,
    severity: AlertSeverity,
    score: number,
    series: MetricSeries
  ): void {
    const existing = this.activeAlerts.get(metric)

    // Don't re-alert for the same severity
    if (existing && existing.severity === severity && !existing.resolved) {
      return
    }

    const alert: AnomalyAlert = {
      id: crypto.randomUUID(),
      severity,
      metric,
      message: `Anomaly detected in ${metric}: value=${currentValue.toFixed(2)}, ` +
        `${series.mode === 'zscore' ? `z-score=${score.toFixed(2)}` : `score=${score.toFixed(2)}`}`,
      currentValue,
      threshold: severity === 'critical' ? series.thresholds.critical : series.thresholds.warning,
      zScore: series.mode === 'zscore' ? score : undefined,
      timestamp: new Date().toISOString(),
      resolved: false,
    }

    this.activeAlerts.set(metric, alert)
    this.alertHistory.push(alert)

    // Trim history
    if (this.alertHistory.length > 500) {
      this.alertHistory = this.alertHistory.slice(-500)
    }

    // Log the alert
    const logFn = severity === 'critical' ? 'error' : 'warn'
    this.log[logFn](`🚨 ${alert.message}`, undefined, {
      metric,
      severity,
      currentValue,
      threshold: alert.threshold,
      zScore: alert.zScore,
    })

    // Send to alert manager
    alertManager.send({
      severity,
      title: `${severity.toUpperCase()}: ${metric} anomaly`,
      message: alert.message,
      source: 'anomaly-detector',
      metadata: {
        metric,
        currentValue,
        threshold: alert.threshold,
        zScore: alert.zScore,
      },
    })
  }

  /**
   * Resolve an active alert
   */
  private resolveAlert(metric: string): void {
    const alert = this.activeAlerts.get(metric)
    if (alert && !alert.resolved) {
      alert.resolved = true
      alert.resolvedAt = new Date().toISOString()
      this.log.info(`✅ Alert resolved: ${metric}`, { metric, alertId: alert.id })

      alertManager.send({
        severity: 'info',
        title: `RESOLVED: ${metric} anomaly`,
        message: `The anomaly in ${metric} has been resolved.`,
        source: 'anomaly-detector',
        metadata: { metric, alertId: alert.id },
      })
    }
  }

  /**
   * Register a periodic check rule
   */
  addRule(rule: AnomalyRule): void {
    this.rules.push(rule)
    this.registerMetric(rule.metric, {
      thresholds: rule.thresholds,
      mode: rule.mode,
      windowMs: rule.windowSize * rule.intervalMs,
    })
  }

  /**
   * Start all periodic checks
   */
  start(): void {
    if (this.started) return
    this.started = true

    for (const rule of this.rules) {
      const interval = setInterval(() => {
        try {
          const { value } = rule.checkFn()
          this.recordValue(rule.metric, value)
        } catch (error) {
          this.log.error(`Check failed for ${rule.metric}`, error instanceof Error ? error : undefined)
        }
      }, rule.intervalMs)

      this.checkIntervals.set(rule.metric, interval)
    }

    this.log.info(`Anomaly detector started with ${this.rules.length} rules`)
  }

  /**
   * Stop all periodic checks
   */
  stop(): void {
    for (const [, interval] of this.checkIntervals) {
      clearInterval(interval)
    }
    this.checkIntervals.clear()
    this.started = false
    this.log.info('Anomaly detector stopped')
  }

  /**
   * Get active (unresolved) alerts
   */
  getActiveAlerts(): AnomalyAlert[] {
    return Array.from(this.activeAlerts.values()).filter(a => !a.resolved)
  }

  /**
   * Get alert history
   */
  getAlertHistory(limit = 50): AnomalyAlert[] {
    return this.alertHistory.slice(-limit).reverse()
  }

  /**
   * Get metric series data (for charting)
   */
  getSeriesData(metric: string): Array<{ value: number; timestamp: number }> {
    return this.series.get(metric)?.values || []
  }
}

// ============================================================================
// Export Singleton
// ============================================================================

export const anomalyDetector = new AnomalyDetector()
