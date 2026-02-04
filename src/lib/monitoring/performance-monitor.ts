/**
 * Performance Monitoring System
 * 
 * Server-side performance tracking for API routes:
 * - Request duration histograms (P50, P95, P99)
 * - Error rate tracking per endpoint
 * - Throughput (requests per minute)
 * - Active request count
 * - Slow request detection and logging
 * 
 * Integrates with the existing Prometheus metrics system.
 */

import { metrics, MetricHelpers } from '../metrics'
import { structuredLogger, createCorrelatedLogger } from './structured-logger'
import { NextRequest, NextResponse } from 'next/server'

// ============================================================================
// Types
// ============================================================================

export interface RequestMetrics {
  requestId: string
  route: string
  method: string
  statusCode: number
  durationMs: number
  contentLength?: number
  userAgent?: string
  ip?: string
  userId?: string
  error?: string
  timestamp: string
}

interface PerformanceSnapshot {
  activeRequests: number
  requestsPerMinute: number
  errorRate: number
  p50LatencyMs: number
  p95LatencyMs: number
  p99LatencyMs: number
  slowRequests: number
  topEndpoints: Array<{
    route: string
    count: number
    avgDurationMs: number
    errorRate: number
  }>
}

// ============================================================================
// Configuration
// ============================================================================

const SLOW_REQUEST_THRESHOLD_MS = parseInt(process.env.SLOW_REQUEST_THRESHOLD_MS || '3000', 10)
const METRICS_WINDOW_MS = 60_000 // 1 minute rolling window
const MAX_RECENT_REQUESTS = 1000

// ============================================================================
// Performance Monitor
// ============================================================================

class PerformanceMonitor {
  private activeRequests = 0
  private recentRequests: RequestMetrics[] = []
  private endpointStats = new Map<string, {
    count: number
    totalDurationMs: number
    errorCount: number
    durations: number[]
  }>()

  /**
   * Record a completed request
   */
  recordRequest(req: RequestMetrics): void {
    // Track in recent requests buffer
    this.recentRequests.push(req)
    if (this.recentRequests.length > MAX_RECENT_REQUESTS) {
      this.recentRequests.shift()
    }

    // Update endpoint stats
    const key = `${req.method} ${req.route}`
    const stats = this.endpointStats.get(key) || {
      count: 0,
      totalDurationMs: 0,
      errorCount: 0,
      durations: [],
    }
    stats.count++
    stats.totalDurationMs += req.durationMs
    if (req.statusCode >= 400) stats.errorCount++
    stats.durations.push(req.durationMs)
    // Keep durations array manageable
    if (stats.durations.length > 500) {
      stats.durations = stats.durations.slice(-500)
    }
    this.endpointStats.set(key, stats)

    // Push to Prometheus metrics
    MetricHelpers.trackRequestDuration(
      req.route,
      req.method,
      req.statusCode,
      req.durationMs / 1000 // Convert to seconds for Prometheus
    )

    if (req.statusCode >= 400) {
      MetricHelpers.trackApiError(
        req.error || String(req.statusCode),
        req.route
      )
    }

    // Log slow requests
    if (req.durationMs > SLOW_REQUEST_THRESHOLD_MS) {
      structuredLogger.child({ component: 'perf-monitor' }).warn(
        `Slow request detected: ${req.method} ${req.route}`,
        {
          durationMs: req.durationMs,
          threshold: SLOW_REQUEST_THRESHOLD_MS,
          statusCode: req.statusCode,
          requestId: req.requestId,
        }
      )
    }
  }

  incrementActive(): void {
    this.activeRequests++
  }

  decrementActive(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1)
  }

  /**
   * Get performance snapshot for the monitoring dashboard
   */
  getSnapshot(): PerformanceSnapshot {
    const now = Date.now()
    const windowStart = now - METRICS_WINDOW_MS

    // Filter to recent window
    const recentInWindow = this.recentRequests.filter(
      r => new Date(r.timestamp).getTime() > windowStart
    )

    const allDurations = recentInWindow.map(r => r.durationMs).sort((a, b) => a - b)
    const errorCount = recentInWindow.filter(r => r.statusCode >= 400).length

    // Top endpoints by request count
    const topEndpoints = Array.from(this.endpointStats.entries())
      .map(([route, stats]) => ({
        route,
        count: stats.count,
        avgDurationMs: Math.round(stats.totalDurationMs / stats.count),
        errorRate: stats.count > 0 ? stats.errorCount / stats.count : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      activeRequests: this.activeRequests,
      requestsPerMinute: recentInWindow.length,
      errorRate: recentInWindow.length > 0 ? errorCount / recentInWindow.length : 0,
      p50LatencyMs: percentile(allDurations, 50),
      p95LatencyMs: percentile(allDurations, 95),
      p99LatencyMs: percentile(allDurations, 99),
      slowRequests: recentInWindow.filter(r => r.durationMs > SLOW_REQUEST_THRESHOLD_MS).length,
      topEndpoints,
    }
  }

  /**
   * Get recent request log (for monitoring dashboard)
   */
  getRecentRequests(limit = 50): RequestMetrics[] {
    return this.recentRequests.slice(-limit).reverse()
  }

  /**
   * Reset stats (for testing)
   */
  reset(): void {
    this.activeRequests = 0
    this.recentRequests = []
    this.endpointStats.clear()
  }
}

// ============================================================================
// Percentile Calculation
// ============================================================================

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0
  const index = Math.ceil((p / 100) * sorted.length) - 1
  return sorted[Math.max(0, index)]
}

// ============================================================================
// API Route Wrapper with Performance Tracking
// ============================================================================

type RouteHandler = (
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>

/**
 * Wraps an API route handler with automatic performance monitoring.
 * 
 * Usage:
 * ```ts
 * export const GET = withPerformanceTracking('/api/brands', async (request, context) => {
 *   // your handler
 * })
 * ```
 */
export function withPerformanceTracking(
  route: string,
  handler: RouteHandler
): RouteHandler {
  return async (request, context) => {
    const requestId = request.headers.get('x-request-id') || crypto.randomUUID()
    const start = performance.now()
    const log = createCorrelatedLogger(request, `api:${route}`)

    performanceMonitor.incrementActive()

    try {
      const response = await handler(request, context)
      const durationMs = Math.round(performance.now() - start)

      performanceMonitor.recordRequest({
        requestId,
        route,
        method: request.method,
        statusCode: response.status,
        durationMs,
        contentLength: parseInt(response.headers.get('content-length') || '0', 10) || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
        ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
        timestamp: new Date().toISOString(),
      })

      // Add timing headers
      response.headers.set('X-Request-ID', requestId)
      response.headers.set('Server-Timing', `total;dur=${durationMs}`)

      log.debug(`${request.method} ${route} → ${response.status}`, {
        durationMs,
        status: response.status,
      })

      return response
    } catch (error) {
      const durationMs = Math.round(performance.now() - start)
      const err = error instanceof Error ? error : new Error(String(error))

      performanceMonitor.recordRequest({
        requestId,
        route,
        method: request.method,
        statusCode: 500,
        durationMs,
        error: err.message,
        timestamp: new Date().toISOString(),
      })

      log.error(`${request.method} ${route} → 500`, err, { durationMs })
      throw error
    } finally {
      performanceMonitor.decrementActive()
    }
  }
}

// ============================================================================
// Export Singleton
// ============================================================================

export const performanceMonitor = new PerformanceMonitor()
