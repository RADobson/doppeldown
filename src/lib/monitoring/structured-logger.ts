/**
 * Production-Grade Structured Logger
 * 
 * Enhances the base logger with:
 * - JSON structured output in production (machine-parseable by log aggregators)
 * - Request correlation IDs that flow through the entire call stack
 * - Sampling for high-volume debug/info logs to reduce cost
 * - Automatic context enrichment (environment, version, hostname)
 * - Log batching with async flush for external services
 * - Sensitive data redaction
 */

import { logger as baseLogger } from '../logger'

// ============================================================================
// Types
// ============================================================================

export interface CorrelationContext {
  requestId: string
  traceId?: string
  spanId?: string
  userId?: string
  sessionId?: string
  route?: string
  method?: string
  userAgent?: string
  ip?: string
}

export interface LogEntry {
  timestamp: string
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  message: string
  service: string
  environment: string
  version: string
  hostname: string
  component?: string
  correlation?: Partial<CorrelationContext>
  error?: {
    name: string
    message: string
    stack?: string
    code?: string
  }
  context?: Record<string, unknown>
  duration_ms?: number
  sampled?: boolean
}

interface SamplingConfig {
  debug: number   // 0.0 - 1.0, fraction of debug logs to emit
  info: number
  warn: number    // typically 1.0
  error: number   // always 1.0
  fatal: number   // always 1.0
}

// ============================================================================
// Configuration
// ============================================================================

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const SERVICE_NAME = 'doppeldown'
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
const HOSTNAME = typeof process !== 'undefined' ? (process.env.HOSTNAME || process.env.VERCEL_URL || 'unknown') : 'browser'

const DEFAULT_SAMPLING: SamplingConfig = IS_PRODUCTION
  ? { debug: 0.01, info: 0.1, warn: 1.0, error: 1.0, fatal: 1.0 }
  : { debug: 1.0, info: 1.0, warn: 1.0, error: 1.0, fatal: 1.0 }

// Fields that should be redacted in logs
const SENSITIVE_FIELDS = new Set([
  'password', 'token', 'secret', 'apiKey', 'api_key', 'authorization',
  'cookie', 'creditCard', 'credit_card', 'ssn', 'cvv', 'cardNumber',
  'card_number', 'accessToken', 'access_token', 'refreshToken', 'refresh_token',
  'private_key', 'privateKey',
])

// ============================================================================
// Sensitive Data Redaction
// ============================================================================

function redactSensitiveData(obj: unknown, depth = 0): unknown {
  if (depth > 10) return '[MAX_DEPTH]'
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'string') return obj
  if (typeof obj === 'number' || typeof obj === 'boolean') return obj

  if (Array.isArray(obj)) {
    return obj.map(item => redactSensitiveData(item, depth + 1))
  }

  if (typeof obj === 'object') {
    const redacted: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (SENSITIVE_FIELDS.has(key.toLowerCase())) {
        redacted[key] = '[REDACTED]'
      } else {
        redacted[key] = redactSensitiveData(value, depth + 1)
      }
    }
    return redacted
  }

  return String(obj)
}

// ============================================================================
// Sampling
// ============================================================================

function shouldSample(level: LogEntry['level'], config: SamplingConfig): boolean {
  const rate = config[level]
  if (rate >= 1.0) return true
  if (rate <= 0.0) return false
  return Math.random() < rate
}

// ============================================================================
// Log Buffer for External Shipping
// ============================================================================

const logBuffer: LogEntry[] = []
const MAX_BUFFER_SIZE = 200
const FLUSH_INTERVAL_MS = 15_000
let flushTimer: ReturnType<typeof setTimeout> | null = null

function scheduleFlush() {
  if (flushTimer || typeof setTimeout === 'undefined') return
  flushTimer = setTimeout(() => {
    flushLogBuffer()
    flushTimer = null
  }, FLUSH_INTERVAL_MS)
}

async function flushLogBuffer(): Promise<void> {
  if (logBuffer.length === 0) return

  const batch = logBuffer.splice(0, logBuffer.length)
  const logEndpoint = process.env.LOG_ENDPOINT_URL

  if (!logEndpoint) return

  try {
    await fetch(logEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.LOG_ENDPOINT_TOKEN
          ? { Authorization: `Bearer ${process.env.LOG_ENDPOINT_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({ logs: batch }),
    })
  } catch {
    // Re-queue up to half the buffer on failure
    const requeue = batch.slice(0, Math.min(batch.length, MAX_BUFFER_SIZE / 2))
    logBuffer.unshift(...requeue)
  }
}

// ============================================================================
// Structured Logger
// ============================================================================

class StructuredLogger {
  private component?: string
  private correlation?: Partial<CorrelationContext>
  private defaultContext?: Record<string, unknown>
  private sampling: SamplingConfig

  constructor(options?: {
    component?: string
    correlation?: Partial<CorrelationContext>
    context?: Record<string, unknown>
    sampling?: Partial<SamplingConfig>
  }) {
    this.component = options?.component
    this.correlation = options?.correlation
    this.defaultContext = options?.context
    this.sampling = { ...DEFAULT_SAMPLING, ...options?.sampling }
  }

  private emit(
    level: LogEntry['level'],
    message: string,
    options?: {
      error?: Error
      context?: Record<string, unknown>
      duration_ms?: number
    }
  ): void {
    const sampled = shouldSample(level, this.sampling)
    if (!sampled && level !== 'error' && level !== 'fatal') return

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: SERVICE_NAME,
      environment: process.env.NODE_ENV || 'development',
      version: APP_VERSION,
      hostname: HOSTNAME,
      component: this.component,
      correlation: this.correlation,
      context: options?.context
        ? redactSensitiveData({ ...this.defaultContext, ...options.context }) as Record<string, unknown>
        : this.defaultContext
          ? redactSensitiveData(this.defaultContext) as Record<string, unknown>
          : undefined,
      duration_ms: options?.duration_ms,
      sampled: !sampled ? false : undefined,
    }

    if (options?.error) {
      entry.error = {
        name: options.error.name,
        message: options.error.message,
        stack: IS_PRODUCTION ? undefined : options.error.stack,
        code: (options.error as { code?: string }).code,
      }
    }

    // Output based on environment
    if (IS_PRODUCTION) {
      // JSON structured output for log aggregators (Datadog, CloudWatch, etc.)
      const output = JSON.stringify(entry)
      if (level === 'error' || level === 'fatal') {
        console.error(output)
      } else if (level === 'warn') {
        console.warn(output)
      } else {
        console.log(output)
      }
    } else {
      // Human-readable output in development (delegate to base logger)
      const base = baseLogger.create(this.component || 'app')
      if (level === 'error' || level === 'fatal') {
        base.error(message, options?.error, options?.context)
      } else if (level === 'warn') {
        base.warn(message, options?.context)
      } else if (level === 'info') {
        base.info(message, options?.context)
      } else {
        base.debug(message, options?.context)
      }
    }

    // Buffer for external shipping (errors and fatals always, others by sampling)
    if (level === 'error' || level === 'fatal' || (IS_PRODUCTION && sampled)) {
      logBuffer.push(entry)
      if (logBuffer.length >= MAX_BUFFER_SIZE) {
        flushLogBuffer()
      } else {
        scheduleFlush()
      }
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.emit('debug', message, { context })
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.emit('info', message, { context })
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.emit('warn', message, { context })
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.emit('error', message, { error, context })
  }

  fatal(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.emit('fatal', message, { error, context })
  }

  /**
   * Log with explicit timing
   */
  timed(message: string, durationMs: number, context?: Record<string, unknown>): void {
    this.emit('info', message, { duration_ms: durationMs, context })
  }

  /**
   * Create a timer that logs on completion
   */
  startTimer(operation: string): { end: (context?: Record<string, unknown>) => number } {
    const start = performance.now()
    return {
      end: (context?: Record<string, unknown>) => {
        const duration = Math.round(performance.now() - start)
        this.timed(`${operation} completed`, duration, context)
        return duration
      },
    }
  }

  /**
   * Create a child logger with additional context
   */
  child(options: {
    component?: string
    correlation?: Partial<CorrelationContext>
    context?: Record<string, unknown>
  }): StructuredLogger {
    return new StructuredLogger({
      component: options.component || this.component,
      correlation: { ...this.correlation, ...options.correlation },
      context: { ...this.defaultContext, ...options.context },
      sampling: this.sampling,
    })
  }
}

// ============================================================================
// Exports
// ============================================================================

/** Global structured logger instance */
export const structuredLogger = new StructuredLogger()

/**
 * Create a logger pre-correlated with a request context.
 * Use in API route handlers for automatic request correlation.
 */
export function createCorrelatedLogger(
  request: Request,
  component?: string
): StructuredLogger {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID()
  const url = new URL(request.url)

  return new StructuredLogger({
    component,
    correlation: {
      requestId,
      route: url.pathname,
      method: request.method,
      userAgent: request.headers.get('user-agent') || undefined,
      ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
    },
  })
}

/**
 * Flush all buffered logs (call on process exit)
 */
export async function flushLogs(): Promise<void> {
  if (flushTimer) {
    clearTimeout(flushTimer)
    flushTimer = null
  }
  await flushLogBuffer()
}
