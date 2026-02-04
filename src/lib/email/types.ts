/**
 * Email system types and interfaces
 * Comprehensive type definitions for the SMTP alert system
 */

import type { Threat, Brand, ThreatSeverity } from '../../types'

// ============================================================================
// Email Configuration Types
// ============================================================================

/**
 * SMTP connection configuration
 */
export interface SmtpConfig {
  /** SMTP server hostname */
  host: string
  /** SMTP server port */
  port: number
  /** Use TLS/SSL */
  secure: boolean
  /** Authentication credentials */
  auth?: {
    user: string
    pass: string
  }
  /** Connection timeout in milliseconds */
  connectionTimeout: number
  /** Socket timeout in milliseconds */
  socketTimeout: number
  /** Maximum connections in pool */
  maxConnections: number
  /** Maximum messages per connection */
  maxMessages: number
  /** Enable debug logging */
  debug: boolean
  /** TLS options */
  tls?: {
    rejectUnauthorized: boolean
    minVersion?: string
  }
}

/**
 * Email service configuration
 */
export interface EmailServiceConfig {
  /** SMTP configuration */
  smtp: SmtpConfig
  /** Default from address */
  defaultFrom: string
  /** Reply-to address */
  replyTo?: string
  /** Maximum retry attempts */
  maxRetries: number
  /** Base delay between retries (ms) */
  retryDelayMs: number
  /** Retry backoff multiplier */
  retryBackoffMultiplier: number
  /** Maximum retry delay (ms) */
  maxRetryDelayMs: number
  /** Queue processing interval (ms) */
  queueProcessingInterval: number
  /** Maximum queue size */
  maxQueueSize: number
  /** Rate limit (emails per minute) */
  rateLimit: number
  /** Enable email sending (false for testing) */
  enabled: boolean
  /** Log email content (for debugging) */
  logContent: boolean
  /** Application base URL */
  appUrl: string
}

// ============================================================================
// Email Message Types
// ============================================================================

/**
 * Email priority levels
 */
export type EmailPriority = 'critical' | 'high' | 'normal' | 'low'

/**
 * Email status
 */
export type EmailStatus = 'pending' | 'queued' | 'sending' | 'sent' | 'failed' | 'retry'

/**
 * Email attachment
 */
export interface EmailAttachment {
  /** Filename */
  filename: string
  /** Content (Buffer, string, or path) */
  content: Buffer | string
  /** MIME type */
  contentType?: string
  /** Content ID for inline images */
  cid?: string
  /** Encoding (base64, utf-8, etc.) */
  encoding?: string
}

/**
 * Base email message
 */
export interface EmailMessage {
  /** Unique message ID */
  id: string
  /** Recipient email address(es) */
  to: string | string[]
  /** CC recipients */
  cc?: string | string[]
  /** BCC recipients */
  bcc?: string | string[]
  /** From address (overrides default) */
  from?: string
  /** Reply-to address */
  replyTo?: string
  /** Email subject */
  subject: string
  /** Plain text body */
  text?: string
  /** HTML body */
  html: string
  /** Attachments */
  attachments?: EmailAttachment[]
  /** Email priority */
  priority: EmailPriority
  /** Message headers */
  headers?: Record<string, string>
  /** Metadata for tracking */
  metadata?: Record<string, unknown>
}

/**
 * Queued email with status tracking
 */
export interface QueuedEmail extends EmailMessage {
  /** Email status */
  status: EmailStatus
  /** Number of retry attempts */
  retryCount: number
  /** Timestamp when queued */
  queuedAt: Date
  /** Timestamp of last attempt */
  lastAttemptAt?: Date
  /** Timestamp when sent */
  sentAt?: Date
  /** Last error message */
  lastError?: string
  /** Next retry timestamp */
  nextRetryAt?: Date
}

// ============================================================================
// Email Alert Types
// ============================================================================

/**
 * Alert type categories
 */
export type AlertType = 
  | 'threat_detected'
  | 'scan_complete'
  | 'daily_digest'
  | 'weekly_digest'
  | 'welcome'
  | 'password_reset'
  | 'account_alert'
  | 'subscription_alert'
  | 'system_notification'

/**
 * Threat alert data
 */
export interface ThreatAlertData {
  brand: Brand
  threats: Threat[]
  totalThreats: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
}

/**
 * Scan completion data
 */
export interface ScanCompleteData {
  brand: Brand
  domainsChecked: number
  threatsFound: number
  threats: Threat[]
  scanDuration: number
  scanId: string
}

/**
 * Brand summary for digests
 */
export interface BrandSummary {
  brand: Brand
  totalThreats: number
  newThreats: number
  resolvedThreats: number
  criticalThreats: number
  threats: Threat[]
}

/**
 * Daily/Weekly digest data
 */
export interface DigestData {
  brandSummaries: BrandSummary[]
  totalBrands: number
  totalNewThreats: number
  totalResolvedThreats: number
  period: 'daily' | 'weekly'
  startDate: Date
  endDate: Date
}

/**
 * Welcome email data
 */
export interface WelcomeData {
  userName: string
  userEmail: string
  activationUrl?: string
}

/**
 * Password reset data
 */
export interface PasswordResetData {
  userName: string
  resetUrl: string
  expiresAt: Date
}

// ============================================================================
// Transport & Connection Types
// ============================================================================

/**
 * Transport health status
 */
export interface TransportHealth {
  /** Is transport healthy */
  healthy: boolean
  /** Last successful connection */
  lastSuccessAt?: Date
  /** Last error */
  lastError?: string
  /** Last error timestamp */
  lastErrorAt?: Date
  /** Total emails sent */
  totalSent: number
  /** Total failures */
  totalFailures: number
  /** Active connections */
  activeConnections: number
  /** Pending messages */
  pendingMessages: number
}

/**
 * Send result
 */
export interface SendResult {
  /** Success status */
  success: boolean
  /** Message ID assigned by SMTP server */
  messageId?: string
  /** Response from SMTP server */
  response?: string
  /** Error if failed */
  error?: EmailError
  /** Time taken to send (ms) */
  duration: number
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Email error codes
 */
export type EmailErrorCode =
  | 'CONNECTION_FAILED'
  | 'AUTHENTICATION_FAILED'
  | 'TIMEOUT'
  | 'RATE_LIMITED'
  | 'INVALID_RECIPIENT'
  | 'MESSAGE_TOO_LARGE'
  | 'SMTP_ERROR'
  | 'QUEUE_FULL'
  | 'SERVICE_UNAVAILABLE'
  | 'TEMPLATE_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN'

/**
 * Email error with additional context
 */
export interface EmailError {
  /** Error code */
  code: EmailErrorCode
  /** Human-readable message */
  message: string
  /** Original error */
  cause?: Error
  /** SMTP response code */
  smtpCode?: number
  /** Whether the error is retryable */
  retryable: boolean
  /** Additional context */
  context?: Record<string, unknown>
}

// ============================================================================
// Event Types
// ============================================================================

/**
 * Email events for monitoring
 */
export type EmailEvent =
  | { type: 'queued'; email: QueuedEmail }
  | { type: 'sending'; emailId: string }
  | { type: 'sent'; emailId: string; result: SendResult }
  | { type: 'failed'; emailId: string; error: EmailError }
  | { type: 'retry'; emailId: string; attempt: number; nextRetryAt: Date }
  | { type: 'expired'; emailId: string }
  | { type: 'health_check'; status: TransportHealth }

/**
 * Event listener callback
 */
export type EmailEventListener = (event: EmailEvent) => void

// ============================================================================
// Template Types
// ============================================================================

/**
 * Email template definition
 */
export interface EmailTemplate<T = unknown> {
  /** Template name/ID */
  name: string
  /** Subject template (can include variables) */
  subject: string | ((data: T) => string)
  /** Render HTML body */
  renderHtml: (data: T) => string
  /** Render plain text body (optional) */
  renderText?: (data: T) => string
  /** Default priority for this template */
  defaultPriority: EmailPriority
}

/**
 * Template registry type
 */
export type TemplateRegistry = Record<AlertType, EmailTemplate<unknown>>
