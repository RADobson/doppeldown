/**
 * Monitoring System Initialization
 * 
 * Call once at application startup to:
 * - Register default anomaly detection rules
 * - Start periodic health checks
 * - Wire up process-level error handlers
 * 
 * Usage (in instrumentation.ts or API startup):
 * ```ts
 * import { initMonitoring } from '@/lib/monitoring/init'
 * initMonitoring()
 * ```
 */

import { anomalyDetector } from './anomaly-detector'
import { performanceMonitor } from './performance-monitor'
import { structuredLogger, flushLogs } from './structured-logger'
import { flushErrors } from '../error-tracking'

let initialized = false

/**
 * Initialize the monitoring system with default rules and health checks
 */
export function initMonitoring(): void {
  if (initialized) return
  initialized = true

  const log = structuredLogger.child({ component: 'monitoring-init' })
  log.info('Initializing monitoring system')

  // =========================================================================
  // Register Anomaly Detection Rules
  // =========================================================================

  // Error rate spike detection
  anomalyDetector.registerMetric('api_error_rate', {
    windowMs: 300_000, // 5 minutes
    thresholds: { warning: 2.0, critical: 3.0 }, // z-scores
    mode: 'zscore',
  })

  // Request latency degradation
  anomalyDetector.registerMetric('api_p95_latency', {
    windowMs: 300_000,
    thresholds: { warning: 3000, critical: 10000 }, // ms
    mode: 'absolute',
  })

  // Memory usage
  anomalyDetector.registerMetric('memory_usage_mb', {
    windowMs: 600_000, // 10 minutes
    thresholds: { warning: 400, critical: 700 }, // MB
    mode: 'absolute',
  })

  // Web Vitals anomaly thresholds
  anomalyDetector.registerMetric('web_vital_lcp', {
    windowMs: 600_000,
    thresholds: { warning: 4000, critical: 8000 },
    mode: 'absolute',
  })

  anomalyDetector.registerMetric('web_vital_cls', {
    windowMs: 600_000,
    thresholds: { warning: 250, critical: 500 }, // CLS * 1000
    mode: 'absolute',
  })

  anomalyDetector.registerMetric('web_vital_inp', {
    windowMs: 600_000,
    thresholds: { warning: 500, critical: 1000 },
    mode: 'absolute',
  })

  // =========================================================================
  // Periodic Health Data Collection
  // =========================================================================

  // Feed performance snapshot into anomaly detector every 30 seconds
  if (typeof setInterval !== 'undefined') {
    setInterval(() => {
      try {
        const perf = performanceMonitor.getSnapshot()
        anomalyDetector.recordValue('api_error_rate', perf.errorRate)
        anomalyDetector.recordValue('api_p95_latency', perf.p95LatencyMs)

        // Memory
        if (typeof process !== 'undefined' && process.memoryUsage) {
          const mem = process.memoryUsage()
          anomalyDetector.recordValue('memory_usage_mb', Math.round(mem.rss / 1024 / 1024))
        }
      } catch {
        // Monitoring collection should never crash the app
      }
    }, 30_000)
  }

  // =========================================================================
  // Process-Level Error Handlers (Server Only)
  // =========================================================================

  if (typeof process !== 'undefined' && process.on) {
    process.on('uncaughtException', (error: Error) => {
      log.fatal('Uncaught exception', error, {
        type: 'uncaughtException',
      })
      // Attempt to flush before crashing
      Promise.all([flushLogs(), flushErrors()]).finally(() => {
        process.exit(1)
      })
    })

    process.on('unhandledRejection', (reason: unknown) => {
      const error = reason instanceof Error ? reason : new Error(String(reason))
      log.error('Unhandled promise rejection', error, {
        type: 'unhandledRejection',
      })
    })

    // Flush on graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      log.info(`Received ${signal}, flushing monitoring data`)
      await Promise.all([flushLogs(), flushErrors()])
      process.exit(0)
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))
  }

  log.info('Monitoring system initialized successfully')
}
