/**
 * Monitoring Dashboard Data Aggregator
 * 
 * Provides a single snapshot of system health by combining data from:
 * - Performance monitor (request latency, throughput, error rates)
 * - Database monitor (query performance, slow queries)
 * - Anomaly detector (active alerts, alert history)
 * - Circuit breakers (service health)
 * - System resources (memory, uptime)
 */

import { performanceMonitor } from './performance-monitor'
import { dbMonitor } from './db-monitor'
import { anomalyDetector } from './anomaly-detector'
import { alertManager } from './alert-manager'
import { getCircuitBreakerStats } from '../resilience'

// ============================================================================
// Types
// ============================================================================

export interface SystemSnapshot {
  timestamp: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  uptime: number

  performance: {
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

  database: {
    tableStats: Record<string, {
      queryCount: number
      totalDurationMs: number
      errorCount: number
      slowQueryCount: number
      avgDurationMs: number
      maxDurationMs: number
    }>
    slowQueries: Array<{
      operation: string
      table: string
      durationMs: number
      timestamp: string
    }>
    errors: Record<string, { errorCount: number; errorRate: number }>
  }

  alerts: {
    active: number
    activeAlerts: Array<{
      id: string
      severity: string
      metric: string
      message: string
      timestamp: string
    }>
    hourlySummary: Record<string, number>
  }

  circuitBreakers: Record<string, {
    state: string
    failureCount: number
  }>

  resources: {
    memoryUsageMb: number
    memoryLimitMb?: number
    heapUsedMb: number
    heapTotalMb: number
  }
}

// ============================================================================
// Uptime Tracking
// ============================================================================

const processStartTime = Date.now()

function getUptimeSeconds(): number {
  return Math.floor((Date.now() - processStartTime) / 1000)
}

// ============================================================================
// System Status Determination
// ============================================================================

function determineStatus(snapshot: Omit<SystemSnapshot, 'status'>): SystemSnapshot['status'] {
  // Critical alerts → unhealthy
  const activeAlerts = anomalyDetector.getActiveAlerts()
  if (activeAlerts.some(a => a.severity === 'critical')) {
    return 'unhealthy'
  }

  // High error rate → unhealthy
  if (snapshot.performance.errorRate > 0.1) {
    return 'unhealthy'
  }

  // Open circuit breakers → degraded
  const circuitStats = getCircuitBreakerStats()
  for (const stats of circuitStats.values()) {
    if (stats.state === 'open') return 'degraded'
  }

  // Warning alerts → degraded
  if (activeAlerts.some(a => a.severity === 'warning')) {
    return 'degraded'
  }

  // High latency → degraded
  if (snapshot.performance.p95LatencyMs > 3000) {
    return 'degraded'
  }

  // Moderate error rate → degraded
  if (snapshot.performance.errorRate > 0.05) {
    return 'degraded'
  }

  return 'healthy'
}

// ============================================================================
// Snapshot Builder
// ============================================================================

/**
 * Build a complete system health snapshot for the monitoring dashboard
 */
export function getSystemSnapshot(): SystemSnapshot {
  // Performance data
  const perfSnapshot = performanceMonitor.getSnapshot()

  // Database data
  const dbStats = dbMonitor.getStats()
  const slowQueries = dbMonitor.getSlowQueries(10).map(q => ({
    operation: q.operation,
    table: q.table,
    durationMs: q.durationMs,
    timestamp: q.timestamp,
  }))
  const dbErrors = dbMonitor.getErrorSummary()
  const dbErrorSimple: Record<string, { errorCount: number; errorRate: number }> = {}
  for (const [table, data] of Object.entries(dbErrors)) {
    dbErrorSimple[table] = { errorCount: data.errorCount, errorRate: data.errorRate }
  }

  // Alert data
  const activeAlerts = anomalyDetector.getActiveAlerts()
  const hourlySummary = alertManager.getHourlySummary()

  // Circuit breaker data
  const circuitStats = getCircuitBreakerStats()
  const circuitBreakers: Record<string, { state: string; failureCount: number }> = {}
  for (const [name, stats] of circuitStats) {
    circuitBreakers[name] = { state: stats.state, failureCount: stats.failureCount }
  }

  // Resource data
  let memoryUsageMb = 0
  let heapUsedMb = 0
  let heapTotalMb = 0
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const mem = process.memoryUsage()
    memoryUsageMb = Math.round(mem.rss / 1024 / 1024)
    heapUsedMb = Math.round(mem.heapUsed / 1024 / 1024)
    heapTotalMb = Math.round(mem.heapTotal / 1024 / 1024)
  }

  const partialSnapshot = {
    timestamp: new Date().toISOString(),
    uptime: getUptimeSeconds(),
    performance: perfSnapshot,
    database: {
      tableStats: dbStats,
      slowQueries,
      errors: dbErrorSimple,
    },
    alerts: {
      active: activeAlerts.length,
      activeAlerts: activeAlerts.map(a => ({
        id: a.id,
        severity: a.severity,
        metric: a.metric,
        message: a.message,
        timestamp: a.timestamp,
      })),
      hourlySummary,
    },
    circuitBreakers,
    resources: {
      memoryUsageMb,
      heapUsedMb,
      heapTotalMb,
    },
  }

  return {
    ...partialSnapshot,
    status: determineStatus(partialSnapshot),
  }
}
