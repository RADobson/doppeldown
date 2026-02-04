/**
 * Email error classes
 * Custom errors with detailed context for debugging and retry logic
 */

import type { EmailError, EmailErrorCode } from './types'

/**
 * Base email error class
 */
export class EmailServiceError extends Error {
  public readonly code: EmailErrorCode
  public readonly retryable: boolean
  public readonly smtpCode?: number
  public readonly context?: Record<string, unknown>
  public readonly originalCause?: Error

  constructor(
    code: EmailErrorCode,
    message: string,
    options?: {
      cause?: Error
      smtpCode?: number
      retryable?: boolean
      context?: Record<string, unknown>
    }
  ) {
    super(message)
    this.name = 'EmailServiceError'
    this.code = code
    this.originalCause = options?.cause
    this.smtpCode = options?.smtpCode
    this.retryable = options?.retryable ?? this.isRetryableByCode(code)
    this.context = options?.context

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /**
   * Determine if error is retryable based on code
   */
  private isRetryableByCode(code: EmailErrorCode): boolean {
    const retryableCodes: EmailErrorCode[] = [
      'CONNECTION_FAILED',
      'TIMEOUT',
      'RATE_LIMITED',
      'SERVICE_UNAVAILABLE',
    ]
    return retryableCodes.includes(code)
  }

  /**
   * Convert to EmailError interface
   */
  toErrorInfo(): EmailError {
    return {
      code: this.code,
      message: this.message,
      cause: this.originalCause,
      smtpCode: this.smtpCode,
      retryable: this.retryable,
      context: this.context,
    }
  }

  /**
   * Create a JSON-serializable representation
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      smtpCode: this.smtpCode,
      retryable: this.retryable,
      context: this.context,
      stack: this.stack,
    }
  }
}

/**
 * Connection error - failed to connect to SMTP server
 */
export class ConnectionError extends EmailServiceError {
  constructor(message: string, cause?: Error, context?: Record<string, unknown>) {
    super('CONNECTION_FAILED', message, { cause, retryable: true, context })
    this.name = 'ConnectionError'
  }
}

/**
 * Authentication error - SMTP auth failed
 */
export class AuthenticationError extends EmailServiceError {
  constructor(message: string, cause?: Error) {
    super('AUTHENTICATION_FAILED', message, { cause, retryable: false })
    this.name = 'AuthenticationError'
  }
}

/**
 * Timeout error - operation timed out
 */
export class TimeoutError extends EmailServiceError {
  constructor(message: string, cause?: Error, context?: Record<string, unknown>) {
    super('TIMEOUT', message, { cause, retryable: true, context })
    this.name = 'TimeoutError'
  }
}

/**
 * Rate limit error - too many requests
 */
export class RateLimitError extends EmailServiceError {
  public readonly retryAfterMs?: number

  constructor(message: string, retryAfterMs?: number) {
    super('RATE_LIMITED', message, { retryable: true })
    this.name = 'RateLimitError'
    this.retryAfterMs = retryAfterMs
  }
}

/**
 * Invalid recipient error - bad email address
 */
export class InvalidRecipientError extends EmailServiceError {
  public readonly recipient: string

  constructor(recipient: string, message?: string) {
    super('INVALID_RECIPIENT', message || `Invalid recipient: ${recipient}`, { retryable: false })
    this.name = 'InvalidRecipientError'
    this.recipient = recipient
  }
}

/**
 * Message too large error
 */
export class MessageTooLargeError extends EmailServiceError {
  public readonly size: number
  public readonly maxSize: number

  constructor(size: number, maxSize: number) {
    super('MESSAGE_TOO_LARGE', `Message size ${size} exceeds maximum ${maxSize}`, { retryable: false })
    this.name = 'MessageTooLargeError'
    this.size = size
    this.maxSize = maxSize
  }
}

/**
 * SMTP error - server returned an error
 */
export class SmtpError extends EmailServiceError {
  constructor(message: string, smtpCode: number, cause?: Error) {
    // Determine if retryable based on SMTP code
    // 4xx codes are temporary, 5xx are permanent
    const retryable = smtpCode >= 400 && smtpCode < 500
    super('SMTP_ERROR', message, { cause, smtpCode, retryable })
    this.name = 'SmtpError'
  }
}

/**
 * Queue full error - cannot accept more messages
 */
export class QueueFullError extends EmailServiceError {
  public readonly queueSize: number
  public readonly maxSize: number

  constructor(queueSize: number, maxSize: number) {
    super('QUEUE_FULL', `Queue is full (${queueSize}/${maxSize})`, { retryable: false })
    this.name = 'QueueFullError'
    this.queueSize = queueSize
    this.maxSize = maxSize
  }
}

/**
 * Service unavailable error
 */
export class ServiceUnavailableError extends EmailServiceError {
  constructor(message: string, cause?: Error) {
    super('SERVICE_UNAVAILABLE', message, { cause, retryable: true })
    this.name = 'ServiceUnavailableError'
  }
}

/**
 * Template error - failed to render template
 */
export class TemplateError extends EmailServiceError {
  public readonly templateName: string

  constructor(templateName: string, message: string, cause?: Error) {
    super('TEMPLATE_ERROR', message, { cause, retryable: false, context: { templateName } })
    this.name = 'TemplateError'
    this.templateName = templateName
  }
}

/**
 * Validation error - invalid email data
 */
export class ValidationError extends EmailServiceError {
  public readonly field?: string

  constructor(message: string, field?: string) {
    super('VALIDATION_ERROR', message, { retryable: false, context: field ? { field } : undefined })
    this.name = 'ValidationError'
    this.field = field
  }
}

/**
 * Parse an error from nodemailer or other sources
 */
export function parseError(error: unknown): EmailServiceError {
  if (error instanceof EmailServiceError) {
    return error
  }

  if (error instanceof Error) {
    const err = error as Error & { 
      code?: string
      responseCode?: number
      response?: string
      errno?: string
    }

    // Connection errors
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.errno === 'ECONNREFUSED') {
      return new ConnectionError(
        `Failed to connect to SMTP server: ${err.message}`,
        err,
        { code: err.code }
      )
    }

    // Timeout errors
    if (err.code === 'ETIMEDOUT' || err.code === 'ESOCKET' || err.message.includes('timeout')) {
      return new TimeoutError(`Operation timed out: ${err.message}`, err)
    }

    // Authentication errors
    if (
      err.code === 'EAUTH' ||
      err.message.includes('authentication') ||
      err.message.includes('credentials') ||
      (err.responseCode && err.responseCode === 535)
    ) {
      return new AuthenticationError(`Authentication failed: ${err.message}`, err)
    }

    // SMTP errors with response codes
    if (err.responseCode) {
      return new SmtpError(
        err.response || err.message,
        err.responseCode,
        err
      )
    }

    // Generic error
    return new EmailServiceError('UNKNOWN', err.message, { cause: err })
  }

  // Non-Error objects
  return new EmailServiceError('UNKNOWN', String(error))
}

/**
 * Check if an error is retryable
 */
export function isRetryable(error: unknown): boolean {
  if (error instanceof EmailServiceError) {
    return error.retryable
  }
  return false
}
