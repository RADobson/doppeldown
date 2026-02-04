/**
 * DoppelDown Health Check Endpoint
 * 
 * Returns system health status for monitoring tools.
 * See: docs/DISASTER_RECOVERY_PLAN.md — Appendix B
 * 
 * GET /api/health
 * 
 * Response:
 *   200 — All systems operational
 *   503 — One or more critical systems down
 * 
 * {
 *   "status": "ok" | "degraded" | "down",
 *   "checks": { ... },
 *   "timestamp": "ISO 8601",
 *   "version": "git SHA or 'local'"
 * }
 */

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

type CheckStatus = 'ok' | 'degraded' | 'down'

interface HealthCheck {
  status: CheckStatus
  latencyMs?: number
  message?: string
}

interface HealthResponse {
  status: CheckStatus
  checks: Record<string, HealthCheck>
  timestamp: string
  version: string
  uptime?: number
}

const startTime = Date.now()

export async function GET() {
  const checks: Record<string, HealthCheck> = {}

  // 1. Database connectivity check
  const dbStart = Date.now()
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const { error } = await supabase
      .from('users')
      .select('id')
      .limit(1)

    const latencyMs = Date.now() - dbStart

    if (error) {
      checks.database = {
        status: 'degraded',
        latencyMs,
        message: `Query error: ${error.code}`
      }
    } else if (latencyMs > 5000) {
      checks.database = {
        status: 'degraded',
        latencyMs,
        message: 'High latency'
      }
    } else {
      checks.database = {
        status: 'ok',
        latencyMs
      }
    }
  } catch (err) {
    checks.database = {
      status: 'down',
      latencyMs: Date.now() - dbStart,
      message: 'Connection failed'
    }
  }

  // 2. Job queue health check
  const queueStart = Date.now()
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Check for stale queued jobs (queued > 1 hour ago = worker might be down)
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString()

    const { data: staleJobs, error: queueError } = await supabase
      .from('scan_jobs')
      .select('id', { count: 'exact' })
      .eq('status', 'queued')
      .lt('created_at', oneHourAgo)

    const latencyMs = Date.now() - queueStart

    if (queueError) {
      checks.queue = {
        status: 'degraded',
        latencyMs,
        message: `Query error: ${queueError.code}`
      }
    } else {
      const staleCount = staleJobs?.length || 0
      if (staleCount > 50) {
        checks.queue = {
          status: 'degraded',
          latencyMs,
          message: `${staleCount} stale jobs (worker may be down)`
        }
      } else if (staleCount > 10) {
        checks.queue = {
          status: 'degraded',
          latencyMs,
          message: `${staleCount} stale jobs`
        }
      } else {
        checks.queue = {
          status: 'ok',
          latencyMs
        }
      }
    }
  } catch (err) {
    checks.queue = {
      status: 'degraded',
      latencyMs: Date.now() - queueStart,
      message: 'Queue check failed'
    }
  }

  // 3. Environment check (are critical env vars present?)
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'CRON_SECRET'
  ]

  const missingVars = requiredEnvVars.filter(v => !process.env[v])

  if (missingVars.length > 0) {
    checks.config = {
      status: 'degraded',
      message: `${missingVars.length} missing env var(s)`
    }
  } else {
    checks.config = { status: 'ok' }
  }

  // Determine overall status
  const statuses = Object.values(checks).map(c => c.status)
  let overallStatus: CheckStatus = 'ok'
  if (statuses.includes('down')) {
    overallStatus = 'down'
  } else if (statuses.includes('degraded')) {
    overallStatus = 'degraded'
  }

  const response: HealthResponse = {
    status: overallStatus,
    checks,
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || 'local'
  }

  return NextResponse.json(response, {
    status: overallStatus === 'down' ? 503 : 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  })
}
