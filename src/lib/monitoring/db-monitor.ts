/**
 * Database Query Performance Monitor
 * 
 * Tracks Supabase query performance:
 * - Query duration by operation and table
 * - Slow query detection and logging
 * - Connection pool monitoring
 * - Query error tracking
 * 
 * Usage:
 * ```ts
 * const timer = dbMonitor.startQuery('select', 'brands')
 * const { data, error } = await supabase.from('brands').select('*')
 * timer.end(error)
 * ```
 */

import { MetricHelpers } from '../metrics'
import { structuredLogger } from './structured-logger'

// ============================================================================
// Types
// ============================================================================

export interface QueryMetrics {
  operation: string
  table: string
  durationMs: number
  success: boolean
  error?: string
  timestamp: string
  rowCount?: number
}

interface TableStats {
  queryCount: number
  totalDurationMs: number
  errorCount: number
  slowQueryCount: number
  avgDurationMs: number
  maxDurationMs: number
  recentQueries: QueryMetrics[]
}

// ============================================================================
// Configuration
// ============================================================================

const SLOW_QUERY_THRESHOLD_MS = parseInt(process.env.SLOW_QUERY_THRESHOLD_MS || '500', 10)
const MAX_RECENT_QUERIES_PER_TABLE = 50

// ============================================================================
// Database Monitor
// ============================================================================

class DatabaseMonitor {
  private tableStats = new Map<string, TableStats>()
  private log = structuredLogger.child({ component: 'db-monitor' })

  /**
   * Start timing a database query.
   * Returns an object with an `end()` method to stop the timer.
   */
  startQuery(
    operation: string,
    table: string
  ): { end: (error?: { message: string } | null, rowCount?: number) => QueryMetrics } {
    const start = performance.now()

    return {
      end: (error?: { message: string } | null, rowCount?: number): QueryMetrics => {
        const durationMs = Math.round(performance.now() - start)
        const success = !error

        const queryMetrics: QueryMetrics = {
          operation,
          table,
          durationMs,
          success,
          error: error?.message,
          timestamp: new Date().toISOString(),
          rowCount,
        }

        this.recordQuery(queryMetrics)
        return queryMetrics
      },
    }
  }

  /**
   * Record a completed query
   */
  private recordQuery(query: QueryMetrics): void {
    const key = query.table

    // Initialize table stats if needed
    if (!this.tableStats.has(key)) {
      this.tableStats.set(key, {
        queryCount: 0,
        totalDurationMs: 0,
        errorCount: 0,
        slowQueryCount: 0,
        avgDurationMs: 0,
        maxDurationMs: 0,
        recentQueries: [],
      })
    }

    const stats = this.tableStats.get(key)!
    stats.queryCount++
    stats.totalDurationMs += query.durationMs
    stats.avgDurationMs = Math.round(stats.totalDurationMs / stats.queryCount)
    stats.maxDurationMs = Math.max(stats.maxDurationMs, query.durationMs)

    if (!query.success) {
      stats.errorCount++
    }

    if (query.durationMs > SLOW_QUERY_THRESHOLD_MS) {
      stats.slowQueryCount++
      this.log.warn(`Slow query: ${query.operation} on ${query.table}`, {
        durationMs: query.durationMs,
        threshold: SLOW_QUERY_THRESHOLD_MS,
        operation: query.operation,
        table: query.table,
        rowCount: query.rowCount,
      })
    }

    // Keep recent queries
    stats.recentQueries.push(query)
    if (stats.recentQueries.length > MAX_RECENT_QUERIES_PER_TABLE) {
      stats.recentQueries.shift()
    }

    // Push to Prometheus metrics
    MetricHelpers.trackDbQuery(query.operation, query.table, query.durationMs / 1000)
  }

  /**
   * Get stats for all tables
   */
  getStats(): Record<string, Omit<TableStats, 'recentQueries'>> {
    const result: Record<string, Omit<TableStats, 'recentQueries'>> = {}
    for (const [table, stats] of this.tableStats) {
      const { recentQueries: _, ...rest } = stats
      result[table] = rest
    }
    return result
  }

  /**
   * Get recent slow queries across all tables
   */
  getSlowQueries(limit = 20): QueryMetrics[] {
    const allQueries: QueryMetrics[] = []
    for (const stats of this.tableStats.values()) {
      allQueries.push(
        ...stats.recentQueries.filter(q => q.durationMs > SLOW_QUERY_THRESHOLD_MS)
      )
    }
    return allQueries
      .sort((a, b) => b.durationMs - a.durationMs)
      .slice(0, limit)
  }

  /**
   * Get error summary
   */
  getErrorSummary(): Record<string, { errorCount: number; errorRate: number; recentErrors: QueryMetrics[] }> {
    const result: Record<string, { errorCount: number; errorRate: number; recentErrors: QueryMetrics[] }> = {}
    for (const [table, stats] of this.tableStats) {
      if (stats.errorCount > 0) {
        result[table] = {
          errorCount: stats.errorCount,
          errorRate: stats.queryCount > 0 ? stats.errorCount / stats.queryCount : 0,
          recentErrors: stats.recentQueries.filter(q => !q.success).slice(-5),
        }
      }
    }
    return result
  }

  /**
   * Reset all stats (for testing)
   */
  reset(): void {
    this.tableStats.clear()
  }
}

// ============================================================================
// Monitored Supabase Query Wrapper
// ============================================================================

/**
 * Wraps a Supabase query with automatic performance monitoring.
 * 
 * Usage:
 * ```ts
 * const { data, error } = await monitoredQuery('select', 'brands', () =>
 *   supabase.from('brands').select('*').eq('user_id', userId)
 * )
 * ```
 */
export async function monitoredQuery<T>(
  operation: string,
  table: string,
  queryFn: () => Promise<{ data: T; error: { message: string } | null; count?: number | null }>
): Promise<{ data: T; error: { message: string } | null }> {
  const timer = dbMonitor.startQuery(operation, table)
  
  try {
    const result = await queryFn()
    timer.end(result.error, result.count ?? undefined)
    return result
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    timer.end({ message: err.message })
    throw error
  }
}

// ============================================================================
// Export Singleton
// ============================================================================

export const dbMonitor = new DatabaseMonitor()
