/**
 * Email Alert System
 * Comprehensive SMTP email service with robust error handling,
 * configurable retry logic, and detailed logging
 * 
 * @module lib/email
 * 
 * @example Basic usage:
 * ```typescript
 * import { getEmailService, sendThreatAlert } from '@/lib/email'
 * 
 * // Using the service directly
 * const emailService = getEmailService()
 * await emailService.initialize()
 * await emailService.sendThreatAlert(userEmail, brand, threats)
 * 
 * // Or use convenience functions
 * await sendThreatAlert(userEmail, brand, threats)
 * ```
 * 
 * @example Configuration via environment:
 * ```env
 * # SMTP Settings
 * SMTP_HOST=smtp.gmail.com
 * SMTP_PORT=587
 * SMTP_USER=your-email@gmail.com
 * SMTP_PASS=your-app-password
 * 
 * # Service Settings
 * EMAIL_FROM=alerts@doppeldown.app
 * EMAIL_ENABLED=true
 * EMAIL_MAX_RETRIES=5
 * EMAIL_RATE_LIMIT=30
 * ```
 */

// Main service
export {
  EmailAlertService,
  getEmailService,
  shutdownEmailService,
  // Convenience functions (backwards compatible)
  sendThreatAlert,
  sendDailyDigest,
  sendWelcomeEmail,
  sendScanSummary,
  sendWeeklyDigest,
} from './service'

// Types
export type {
  // Configuration
  SmtpConfig,
  EmailServiceConfig,
  // Messages
  EmailMessage,
  QueuedEmail,
  EmailPriority,
  EmailStatus,
  EmailAttachment,
  // Alerts
  AlertType,
  ThreatAlertData,
  ScanCompleteData,
  DigestData,
  WelcomeData,
  PasswordResetData,
  BrandSummary,
  // Results & Status
  SendResult,
  TransportHealth,
  // Events
  EmailEvent,
  EmailEventListener,
  // Errors
  EmailError,
  EmailErrorCode,
  // Templates
  EmailTemplate,
  TemplateRegistry,
} from './types'

// Configuration utilities
export {
  getEmailConfig,
  buildEmailConfig,
  buildSmtpConfig,
  validateEmailConfig,
  validateSmtpConfig,
  getMaskedConfig,
  clearConfigCache,
} from './config'

// Error classes
export {
  EmailServiceError,
  ConnectionError,
  AuthenticationError,
  TimeoutError,
  RateLimitError,
  InvalidRecipientError,
  MessageTooLargeError,
  SmtpError,
  QueueFullError,
  ServiceUnavailableError,
  TemplateError,
  ValidationError,
  parseError,
  isRetryable,
} from './errors'

// Transport (for advanced use cases)
export {
  SmtpTransportPool,
  getTransportPool,
  closeTransportPool,
} from './transport'

// Queue (for advanced use cases)
export { EmailQueue } from './queue'

// Templates (for customization)
export {
  threatAlertTemplate,
  scanCompleteTemplate,
  dailyDigestTemplate,
  weeklyDigestTemplate,
  welcomeTemplate,
  passwordResetTemplate,
  getTemplate,
} from './templates'
