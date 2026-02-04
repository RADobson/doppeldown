/**
 * Web Vitals Collection Endpoint
 * 
 * POST /api/monitoring/vitals
 * 
 * Receives Core Web Vitals data from the client-side WebVitals component.
 * Aggregates metrics for performance monitoring and anomaly detection.
 */

import { NextRequest, NextResponse } from 'next/server'
import { anomalyDetector } from '@/lib/monitoring/anomaly-detector'
import { structuredLogger } from '@/lib/monitoring/structured-logger'

const log = structuredLogger.child({ component: 'web-vitals-collector' })

// In-memory aggregation for recent vitals
const vitalsBuffer: Array<{
  name: string
  value: number
  rating: string
  timestamp: number
  url?: string
  userAgent?: string
}> = []

const MAX_BUFFER = 500

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      name,
      value,
      rating,
      delta,
      id,
      navigationType,
    } = body

    if (!name || typeof value !== 'number') {
      return NextResponse.json({ error: 'Invalid vital data' }, { status: 400 })
    }

    // Buffer the vital
    vitalsBuffer.push({
      name,
      value,
      rating,
      timestamp: Date.now(),
      url: request.headers.get('referer') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    if (vitalsBuffer.length > MAX_BUFFER) {
      vitalsBuffer.shift()
    }

    // Feed into anomaly detector for degradation detection
    anomalyDetector.recordValue(`web_vital_${name.toLowerCase()}`, value)

    // Log poor vitals
    if (rating === 'poor') {
      log.warn(`Poor Web Vital: ${name}=${value}`, {
        name,
        value,
        rating,
        delta,
        id,
        navigationType,
        url: request.headers.get('referer'),
      })
    }

    return NextResponse.json({ ok: true }, { status: 202 })
  } catch (error) {
    log.error('Failed to process vitals data', error instanceof Error ? error : undefined)
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
}

/**
 * GET /api/monitoring/vitals - Retrieve aggregated vitals summary
 */
export async function GET(request: NextRequest) {
  // Check access
  const token = process.env.MONITORING_API_TOKEN || process.env.METRICS_API_TOKEN
  if (token) {
    const authHeader = request.headers.get('authorization')
    if (authHeader?.replace('Bearer ', '') !== token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } else if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  // Aggregate vitals from buffer
  const now = Date.now()
  const fiveMinAgo = now - 300_000

  const recentVitals = vitalsBuffer.filter(v => v.timestamp > fiveMinAgo)

  const summary: Record<string, {
    count: number
    avg: number
    p50: number
    p95: number
    goodPct: number
    poorPct: number
  }> = {}

  const metricNames = ['LCP', 'CLS', 'INP', 'FCP', 'TTFB']
  for (const metric of metricNames) {
    const values = recentVitals
      .filter(v => v.name === metric)
      .map(v => v.value)
      .sort((a, b) => a - b)

    if (values.length === 0) continue

    const ratings = recentVitals.filter(v => v.name === metric)
    const goodCount = ratings.filter(v => v.rating === 'good').length
    const poorCount = ratings.filter(v => v.rating === 'poor').length

    summary[metric] = {
      count: values.length,
      avg: Math.round(values.reduce((s, v) => s + v, 0) / values.length),
      p50: values[Math.floor(values.length * 0.5)] || 0,
      p95: values[Math.floor(values.length * 0.95)] || 0,
      goodPct: Math.round((goodCount / values.length) * 100),
      poorPct: Math.round((poorCount / values.length) * 100),
    }
  }

  return NextResponse.json({
    summary,
    sampleCount: recentVitals.length,
    windowMs: 300_000,
  })
}
