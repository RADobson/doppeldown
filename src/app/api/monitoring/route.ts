/**
 * Internal Monitoring Dashboard API
 * 
 * GET /api/monitoring - System health snapshot
 * GET /api/monitoring?section=performance - Performance metrics only
 * GET /api/monitoring?section=database - Database metrics only
 * GET /api/monitoring?section=alerts - Active alerts only
 * 
 * Protected by bearer token (MONITORING_API_TOKEN env var).
 * In development, accessible without token.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSystemSnapshot } from '@/lib/monitoring/dashboard'
import { performanceMonitor } from '@/lib/monitoring/performance-monitor'
import { dbMonitor } from '@/lib/monitoring/db-monitor'
import { anomalyDetector } from '@/lib/monitoring/anomaly-detector'
import { alertManager } from '@/lib/monitoring/alert-manager'

function unauthorized(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

function verifyAccess(request: NextRequest): boolean {
  const token = process.env.MONITORING_API_TOKEN || process.env.METRICS_API_TOKEN
  
  // In development, allow access without token
  if (!token && process.env.NODE_ENV !== 'production') {
    return true
  }
  
  if (!token) return false

  const authHeader = request.headers.get('authorization')
  const providedToken = authHeader?.replace('Bearer ', '')
  return providedToken === token
}

export async function GET(request: NextRequest) {
  if (!verifyAccess(request)) {
    return unauthorized()
  }

  const { searchParams } = new URL(request.url)
  const section = searchParams.get('section')
  const format = searchParams.get('format') || 'json'

  try {
    // Section-specific responses for lighter-weight polling
    switch (section) {
      case 'performance':
        return NextResponse.json({
          performance: performanceMonitor.getSnapshot(),
          recentRequests: performanceMonitor.getRecentRequests(20),
        })

      case 'database':
        return NextResponse.json({
          tableStats: dbMonitor.getStats(),
          slowQueries: dbMonitor.getSlowQueries(20),
          errors: dbMonitor.getErrorSummary(),
        })

      case 'alerts':
        return NextResponse.json({
          activeAlerts: anomalyDetector.getActiveAlerts(),
          alertHistory: anomalyDetector.getAlertHistory(50),
          hourlySummary: alertManager.getHourlySummary(),
          recentAlerts: alertManager.getRecentAlerts(20),
        })

      case 'requests':
        return NextResponse.json({
          recentRequests: performanceMonitor.getRecentRequests(
            parseInt(searchParams.get('limit') || '50', 10)
          ),
        })

      default: {
        // Full system snapshot
        const snapshot = getSystemSnapshot()

        if (format === 'text') {
          // Human-readable text format
          const text = formatAsText(snapshot)
          return new NextResponse(text, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          })
        }

        return NextResponse.json(snapshot)
      }
    }
  } catch (error) {
    console.error('Monitoring endpoint error:', error)
    return NextResponse.json(
      { error: 'Failed to collect monitoring data' },
      { status: 500 }
    )
  }
}

// ============================================================================
// Text Format Helper
// ============================================================================

function formatAsText(snapshot: ReturnType<typeof getSystemSnapshot>): string {
  const lines: string[] = [
    '=== DoppelDown System Status ===',
    `Status: ${snapshot.status.toUpperCase()}`,
    `Timestamp: ${snapshot.timestamp}`,
    `Uptime: ${formatDuration(snapshot.uptime)}`,
    '',
    '--- Performance ---',
    `Active Requests: ${snapshot.performance.activeRequests}`,
    `Requests/min: ${snapshot.performance.requestsPerMinute}`,
    `Error Rate: ${(snapshot.performance.errorRate * 100).toFixed(1)}%`,
    `P50 Latency: ${snapshot.performance.p50LatencyMs}ms`,
    `P95 Latency: ${snapshot.performance.p95LatencyMs}ms`,
    `P99 Latency: ${snapshot.performance.p99LatencyMs}ms`,
    `Slow Requests: ${snapshot.performance.slowRequests}`,
    '',
    '--- Database ---',
  ]

  for (const [table, stats] of Object.entries(snapshot.database.tableStats)) {
    lines.push(`  ${table}: ${stats.queryCount} queries, avg ${stats.avgDurationMs}ms, ${stats.errorCount} errors`)
  }

  if (snapshot.database.slowQueries.length > 0) {
    lines.push('  Slow Queries:')
    for (const q of snapshot.database.slowQueries.slice(0, 5)) {
      lines.push(`    ${q.operation} ${q.table}: ${q.durationMs}ms`)
    }
  }

  lines.push('')
  lines.push('--- Alerts ---')
  lines.push(`Active: ${snapshot.alerts.active}`)
  for (const alert of snapshot.alerts.activeAlerts) {
    lines.push(`  [${alert.severity.toUpperCase()}] ${alert.message}`)
  }

  lines.push('')
  lines.push('--- Circuit Breakers ---')
  for (const [name, cb] of Object.entries(snapshot.circuitBreakers)) {
    lines.push(`  ${name}: ${cb.state} (${cb.failureCount} failures)`)
  }
  if (Object.keys(snapshot.circuitBreakers).length === 0) {
    lines.push('  No circuit breakers registered')
  }

  lines.push('')
  lines.push('--- Resources ---')
  lines.push(`Memory (RSS): ${snapshot.resources.memoryUsageMb}MB`)
  lines.push(`Heap Used: ${snapshot.resources.heapUsedMb}MB / ${snapshot.resources.heapTotalMb}MB`)

  return lines.join('\n')
}

function formatDuration(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const parts: string[] = []
  if (d > 0) parts.push(`${d}d`)
  if (h > 0) parts.push(`${h}h`)
  if (m > 0) parts.push(`${m}m`)
  parts.push(`${s}s`)
  return parts.join(' ')
}
