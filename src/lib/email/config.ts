/**
 * Email service configuration
 * Loads and validates configuration from environment variables
 */

import type { EmailServiceConfig, SmtpConfig } from './types'

/**
 * Default SMTP configuration values
 */
const SMTP_DEFAULTS = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  connectionTimeout: 30000, // 30 seconds
  socketTimeout: 60000, // 60 seconds
  maxConnections: 5,
  maxMessages: 100, // Messages per connection before reconnect
  debug: false,
} as const

/**
 * Default email service configuration
 */
const SERVICE_DEFAULTS = {
  maxRetries: 5,
  retryDelayMs: 1000, // 1 second
  retryBackoffMultiplier: 2, // Exponential backoff
  maxRetryDelayMs: 300000, // 5 minutes max
  queueProcessingInterval: 5000, // 5 seconds
  maxQueueSize: 1000,
  rateLimit: 30, // emails per minute
  enabled: true,
  logContent: false,
} as const

/**
 * Parse boolean environment variable
 */
function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue
  return value.toLowerCase() === 'true' || value === '1'
}

/**
 * Parse integer environment variable
 */
function parseInt(value: string | undefined, defaultValue: number): number {
  if (value === undefined) return defaultValue
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? defaultValue : parsed
}

/**
 * Build SMTP configuration from environment
 */
export function buildSmtpConfig(): SmtpConfig {
  const port = parseInt(process.env.SMTP_PORT, SMTP_DEFAULTS.port)
  
  // Auto-detect secure mode based on port if not explicitly set
  const explicitSecure = process.env.SMTP_SECURE
  const secure = explicitSecure 
    ? parseBoolean(explicitSecure, SMTP_DEFAULTS.secure)
    : port === 465

  const config: SmtpConfig = {
    host: process.env.SMTP_HOST || SMTP_DEFAULTS.host,
    port,
    secure,
    connectionTimeout: parseInt(process.env.SMTP_CONNECTION_TIMEOUT, SMTP_DEFAULTS.connectionTimeout),
    socketTimeout: parseInt(process.env.SMTP_SOCKET_TIMEOUT, SMTP_DEFAULTS.socketTimeout),
    maxConnections: parseInt(process.env.SMTP_MAX_CONNECTIONS, SMTP_DEFAULTS.maxConnections),
    maxMessages: parseInt(process.env.SMTP_MAX_MESSAGES, SMTP_DEFAULTS.maxMessages),
    debug: parseBoolean(process.env.SMTP_DEBUG, SMTP_DEFAULTS.debug),
  }

  // Add authentication if credentials provided
  if (process.env.SMTP_USER && (process.env.SMTP_PASS || process.env.SMTP_PASSWORD)) {
    config.auth = {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '',
    }
  }

  // TLS configuration
  const rejectUnauthorized = parseBoolean(process.env.SMTP_TLS_REJECT_UNAUTHORIZED, true)
  if (!rejectUnauthorized || process.env.SMTP_TLS_MIN_VERSION) {
    config.tls = {
      rejectUnauthorized,
      minVersion: process.env.SMTP_TLS_MIN_VERSION,
    }
  }

  return config
}

/**
 * Build full email service configuration
 */
export function buildEmailConfig(): EmailServiceConfig {
  const smtp = buildSmtpConfig()
  
  return {
    smtp,
    defaultFrom: process.env.EMAIL_FROM || process.env.SMTP_FROM || 'alerts@doppeldown.app',
    replyTo: process.env.EMAIL_REPLY_TO || process.env.REPLY_TO_EMAIL,
    maxRetries: parseInt(process.env.EMAIL_MAX_RETRIES, SERVICE_DEFAULTS.maxRetries),
    retryDelayMs: parseInt(process.env.EMAIL_RETRY_DELAY_MS, SERVICE_DEFAULTS.retryDelayMs),
    retryBackoffMultiplier: parseFloat(process.env.EMAIL_RETRY_BACKOFF || String(SERVICE_DEFAULTS.retryBackoffMultiplier)),
    maxRetryDelayMs: parseInt(process.env.EMAIL_MAX_RETRY_DELAY_MS, SERVICE_DEFAULTS.maxRetryDelayMs),
    queueProcessingInterval: parseInt(process.env.EMAIL_QUEUE_INTERVAL_MS, SERVICE_DEFAULTS.queueProcessingInterval),
    maxQueueSize: parseInt(process.env.EMAIL_MAX_QUEUE_SIZE, SERVICE_DEFAULTS.maxQueueSize),
    rateLimit: parseInt(process.env.EMAIL_RATE_LIMIT, SERVICE_DEFAULTS.rateLimit),
    enabled: parseBoolean(process.env.EMAIL_ENABLED, SERVICE_DEFAULTS.enabled),
    logContent: parseBoolean(process.env.EMAIL_LOG_CONTENT, SERVICE_DEFAULTS.logContent),
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://doppeldown.com',
  }
}

/**
 * Parse float with default
 */
function parseFloat(value: string): number {
  const parsed = Number.parseFloat(value)
  return Number.isNaN(parsed) ? SERVICE_DEFAULTS.retryBackoffMultiplier : parsed
}

/**
 * Validate SMTP configuration
 */
export function validateSmtpConfig(config: SmtpConfig): string[] {
  const errors: string[] = []

  if (!config.host) {
    errors.push('SMTP host is required')
  }

  if (config.port < 1 || config.port > 65535) {
    errors.push(`Invalid SMTP port: ${config.port}`)
  }

  if (config.connectionTimeout < 1000) {
    errors.push('Connection timeout must be at least 1000ms')
  }

  if (config.socketTimeout < 1000) {
    errors.push('Socket timeout must be at least 1000ms')
  }

  if (config.maxConnections < 1) {
    errors.push('Max connections must be at least 1')
  }

  return errors
}

/**
 * Validate email service configuration
 */
export function validateEmailConfig(config: EmailServiceConfig): string[] {
  const errors: string[] = []

  // Validate SMTP config
  errors.push(...validateSmtpConfig(config.smtp))

  // Validate from address
  if (!config.defaultFrom) {
    errors.push('Default from address is required')
  } else if (!isValidEmail(config.defaultFrom)) {
    // Allow "Name <email>" format
    const emailMatch = config.defaultFrom.match(/<([^>]+)>/) || [null, config.defaultFrom]
    if (!isValidEmail(emailMatch[1] || '')) {
      errors.push(`Invalid default from address: ${config.defaultFrom}`)
    }
  }

  if (config.maxRetries < 0) {
    errors.push('Max retries cannot be negative')
  }

  if (config.retryDelayMs < 100) {
    errors.push('Retry delay must be at least 100ms')
  }

  if (config.rateLimit < 1) {
    errors.push('Rate limit must be at least 1')
  }

  if (config.maxQueueSize < 10) {
    errors.push('Max queue size must be at least 10')
  }

  return errors
}

/**
 * Basic email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Get masked configuration for logging (hides sensitive data)
 */
export function getMaskedConfig(config: EmailServiceConfig): Record<string, unknown> {
  return {
    smtp: {
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      hasAuth: !!config.smtp.auth,
      connectionTimeout: config.smtp.connectionTimeout,
      socketTimeout: config.smtp.socketTimeout,
      maxConnections: config.smtp.maxConnections,
      maxMessages: config.smtp.maxMessages,
      debug: config.smtp.debug,
    },
    defaultFrom: config.defaultFrom,
    replyTo: config.replyTo,
    maxRetries: config.maxRetries,
    retryDelayMs: config.retryDelayMs,
    retryBackoffMultiplier: config.retryBackoffMultiplier,
    maxRetryDelayMs: config.maxRetryDelayMs,
    queueProcessingInterval: config.queueProcessingInterval,
    maxQueueSize: config.maxQueueSize,
    rateLimit: config.rateLimit,
    enabled: config.enabled,
    logContent: config.logContent,
    appUrl: config.appUrl,
  }
}

/**
 * Singleton configuration instance
 */
let cachedConfig: EmailServiceConfig | null = null

/**
 * Get email configuration (cached)
 */
export function getEmailConfig(): EmailServiceConfig {
  if (!cachedConfig) {
    cachedConfig = buildEmailConfig()
  }
  return cachedConfig
}

/**
 * Clear cached configuration (for testing)
 */
export function clearConfigCache(): void {
  cachedConfig = null
}
