/**
 * Email Alert Service
 * Main service orchestrating SMTP transport, queue, templates, and logging
 */

import { randomUUID } from 'crypto'
import type {
  EmailServiceConfig,
  EmailMessage,
  QueuedEmail,
  SendResult,
  TransportHealth,
  ThreatAlertData,
  ScanCompleteData,
  DigestData,
  WelcomeData,
  PasswordResetData,
  AlertType,
  EmailPriority,
  EmailEventListener,
} from './types'
import { SmtpTransportPool, getTransportPool, closeTransportPool } from './transport'
import { EmailQueue } from './queue'
import { getEmailConfig, validateEmailConfig, getMaskedConfig } from './config'
import { ValidationError, ServiceUnavailableError, TemplateError, parseError } from './errors'
import {
  threatAlertTemplate,
  scanCompleteTemplate,
  dailyDigestTemplate,
  weeklyDigestTemplate,
  welcomeTemplate,
  passwordResetTemplate,
  getTemplate,
} from './templates'
import { Logger } from '../logger'
import type { Threat, Brand } from '../../types'

const logger = new Logger('EmailAlertService')

/**
 * Email Alert Service
 * Provides high-level API for sending emails with automatic
 * queueing, retry, rate limiting, and template rendering
 */
export class EmailAlertService {
  private config: EmailServiceConfig
  private transport: SmtpTransportPool
  private queue: EmailQueue
  private initialized = false

  constructor(config?: Partial<EmailServiceConfig>) {
    // Load and merge configuration
    const defaultConfig = getEmailConfig()
    this.config = { ...defaultConfig, ...config }

    // Validate configuration
    const errors = validateEmailConfig(this.config)
    if (errors.length > 0) {
      logger.error('Invalid email configuration', undefined, { errors })
      throw new ValidationError(`Email configuration errors: ${errors.join(', ')}`)
    }

    // Initialize transport and queue
    this.transport = getTransportPool(this.config.smtp)
    this.queue = new EmailQueue(this.config)

    logger.info('EmailAlertService created', getMaskedConfig(this.config))
  }

  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      logger.debug('Service already initialized')
      return
    }

    if (!this.config.enabled) {
      logger.warn('Email service is disabled')
      this.initialized = true
      return
    }

    try {
      logger.info('Initializing EmailAlertService')
      
      // Initialize transport
      await this.transport.initialize()
      
      // Start queue processing
      this.queue.startProcessing((email) => this.transport.send(email))
      
      this.initialized = true
      logger.info('EmailAlertService initialized successfully')
    } catch (error) {
      logger.error('Failed to initialize EmailAlertService', error as Error)
      throw error
    }
  }

  /**
   * Ensure service is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize()
    }
  }

  // ==========================================================================
  // High-Level Alert Methods
  // ==========================================================================

  /**
   * Send threat alert email
   */
  async sendThreatAlert(
    to: string,
    brand: Brand,
    threats: Threat[]
  ): Promise<QueuedEmail> {
    logger.info('Sending threat alert', {
      to,
      brand: brand.name,
      threatCount: threats.length,
    })

    const data: ThreatAlertData & { appUrl: string } = {
      brand,
      threats,
      totalThreats: threats.length,
      criticalCount: threats.filter(t => t.severity === 'critical').length,
      highCount: threats.filter(t => t.severity === 'high').length,
      mediumCount: threats.filter(t => t.severity === 'medium').length,
      lowCount: threats.filter(t => t.severity === 'low').length,
      appUrl: this.config.appUrl,
    }

    // Determine priority based on threat severity
    let priority: EmailPriority = 'normal'
    if (data.criticalCount > 0) {
      priority = 'critical'
    } else if (data.highCount > 0) {
      priority = 'high'
    }

    return this.sendTemplatedEmail('threat_detected', to, data, { priority })
  }

  /**
   * Send scan completion summary
   */
  async sendScanSummary(
    to: string,
    brand: Brand,
    scanResult: {
      domainsChecked: number
      threatsFound: number
      threats: Threat[]
      scanDuration?: number
      scanId?: string
    }
  ): Promise<QueuedEmail> {
    logger.info('Sending scan summary', {
      to,
      brand: brand.name,
      domainsChecked: scanResult.domainsChecked,
      threatsFound: scanResult.threatsFound,
    })

    const data: ScanCompleteData & { appUrl: string } = {
      brand,
      domainsChecked: scanResult.domainsChecked,
      threatsFound: scanResult.threatsFound,
      threats: scanResult.threats,
      scanDuration: scanResult.scanDuration || 0,
      scanId: scanResult.scanId || randomUUID(),
      appUrl: this.config.appUrl,
    }

    return this.sendTemplatedEmail('scan_complete', to, data)
  }

  /**
   * Send daily digest email
   */
  async sendDailyDigest(
    to: string,
    brandSummaries: Array<{
      brand: Brand
      totalThreats: number
      newThreats: number
      threats: Threat[]
    }>
  ): Promise<QueuedEmail> {
    logger.info('Sending daily digest', {
      to,
      brandCount: brandSummaries.length,
      totalNewThreats: brandSummaries.reduce((sum, b) => sum + b.newThreats, 0),
    })

    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const data: DigestData & { appUrl: string } = {
      brandSummaries: brandSummaries.map(b => ({
        ...b,
        resolvedThreats: 0,
        criticalThreats: b.threats.filter(t => t.severity === 'critical').length,
      })),
      totalBrands: brandSummaries.length,
      totalNewThreats: brandSummaries.reduce((sum, b) => sum + b.newThreats, 0),
      totalResolvedThreats: 0,
      period: 'daily',
      startDate: yesterday,
      endDate: now,
      appUrl: this.config.appUrl,
    }

    return this.sendTemplatedEmail('daily_digest', to, data)
  }

  /**
   * Send weekly digest email
   */
  async sendWeeklyDigest(
    to: string,
    brandSummaries: Array<{
      brand: Brand
      newThreats: number
      threats: Threat[]
    }>
  ): Promise<QueuedEmail> {
    logger.info('Sending weekly digest', {
      to,
      brandCount: brandSummaries.length,
      totalNewThreats: brandSummaries.reduce((sum, b) => sum + b.newThreats, 0),
    })

    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const data: DigestData & { appUrl: string } = {
      brandSummaries: brandSummaries.map(b => ({
        brand: b.brand,
        totalThreats: b.threats.length,
        newThreats: b.newThreats,
        resolvedThreats: 0,
        criticalThreats: b.threats.filter(t => t.severity === 'critical').length,
        threats: b.threats,
      })),
      totalBrands: brandSummaries.length,
      totalNewThreats: brandSummaries.reduce((sum, b) => sum + b.newThreats, 0),
      totalResolvedThreats: 0,
      period: 'weekly',
      startDate: weekAgo,
      endDate: now,
      appUrl: this.config.appUrl,
    }

    return this.sendTemplatedEmail('weekly_digest', to, data)
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(
    to: string,
    userName: string
  ): Promise<QueuedEmail> {
    logger.info('Sending welcome email', { to, userName })

    const data: WelcomeData & { appUrl: string } = {
      userName,
      userEmail: to,
      appUrl: this.config.appUrl,
    }

    return this.sendTemplatedEmail('welcome', to, data, { priority: 'high' })
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    to: string,
    userName: string,
    resetToken: string,
    expiresAt: Date
  ): Promise<QueuedEmail> {
    logger.info('Sending password reset email', { to })

    const data: PasswordResetData & { appUrl: string } = {
      userName,
      resetUrl: `${this.config.appUrl}/auth/reset-password?token=${resetToken}`,
      expiresAt,
      appUrl: this.config.appUrl,
    }

    return this.sendTemplatedEmail('password_reset', to, data, { priority: 'high' })
  }

  // ==========================================================================
  // Low-Level Methods
  // ==========================================================================

  /**
   * Send templated email
   */
  async sendTemplatedEmail<T extends object>(
    type: AlertType,
    to: string | string[],
    data: T,
    options?: {
      priority?: EmailPriority
      cc?: string | string[]
      bcc?: string | string[]
      replyTo?: string
      metadata?: Record<string, unknown>
    }
  ): Promise<QueuedEmail> {
    await this.ensureInitialized()

    if (!this.config.enabled) {
      logger.debug('Email service disabled, skipping send', { type, to })
      // Return a mock queued email
      return {
        id: randomUUID(),
        to,
        subject: '[DISABLED]',
        html: '',
        priority: options?.priority || 'normal',
        status: 'sent',
        retryCount: 0,
        queuedAt: new Date(),
        sentAt: new Date(),
      }
    }

    // Get and render template
    const template = getTemplate(type)
    
    let subject: string
    let html: string
    
    try {
      subject = typeof template.subject === 'function'
        ? template.subject(data as never)
        : template.subject
      html = template.renderHtml(data as never)
    } catch (error) {
      logger.error('Template rendering failed', error as Error, { type })
      throw new TemplateError(type, `Failed to render template: ${error}`, error as Error)
    }

    // Create email message
    const message: Omit<EmailMessage, 'id'> = {
      to,
      cc: options?.cc,
      bcc: options?.bcc,
      from: this.config.defaultFrom,
      replyTo: options?.replyTo || this.config.replyTo,
      subject,
      html,
      priority: options?.priority || template.defaultPriority,
      metadata: {
        ...options?.metadata,
        templateType: type,
      },
    }

    // Log content if enabled
    if (this.config.logContent) {
      logger.debug('Email content', { subject, htmlLength: html.length })
    }

    // Enqueue
    return this.queue.enqueue(message)
  }

  /**
   * Send raw email (no template)
   */
  async sendRawEmail(
    to: string | string[],
    subject: string,
    html: string,
    options?: {
      text?: string
      priority?: EmailPriority
      cc?: string | string[]
      bcc?: string | string[]
      from?: string
      replyTo?: string
      metadata?: Record<string, unknown>
    }
  ): Promise<QueuedEmail> {
    await this.ensureInitialized()

    if (!this.config.enabled) {
      logger.debug('Email service disabled, skipping send', { to, subject })
      return {
        id: randomUUID(),
        to,
        subject,
        html,
        priority: options?.priority || 'normal',
        status: 'sent',
        retryCount: 0,
        queuedAt: new Date(),
        sentAt: new Date(),
      }
    }

    const message: Omit<EmailMessage, 'id'> = {
      to,
      cc: options?.cc,
      bcc: options?.bcc,
      from: options?.from || this.config.defaultFrom,
      replyTo: options?.replyTo || this.config.replyTo,
      subject,
      text: options?.text,
      html,
      priority: options?.priority || 'normal',
      metadata: options?.metadata,
    }

    return this.queue.enqueue(message)
  }

  /**
   * Send email immediately (bypass queue)
   */
  async sendImmediate(
    to: string | string[],
    subject: string,
    html: string,
    options?: {
      text?: string
      from?: string
      replyTo?: string
    }
  ): Promise<SendResult> {
    await this.ensureInitialized()

    if (!this.config.enabled) {
      logger.debug('Email service disabled, skipping immediate send')
      return {
        success: true,
        messageId: 'disabled',
        duration: 0,
      }
    }

    const message: EmailMessage = {
      id: randomUUID(),
      to,
      from: options?.from || this.config.defaultFrom,
      replyTo: options?.replyTo || this.config.replyTo,
      subject,
      text: options?.text,
      html,
      priority: 'high',
    }

    logger.info('Sending immediate email', { to, subject })
    return this.transport.send(message)
  }

  // ==========================================================================
  // Queue Management
  // ==========================================================================

  /**
   * Get email by ID
   */
  getEmail(id: string): QueuedEmail | undefined {
    return this.queue.get(id)
  }

  /**
   * Cancel pending email
   */
  cancelEmail(id: string): boolean {
    return this.queue.remove(id)
  }

  /**
   * Get queue statistics
   */
  getQueueStats(): ReturnType<EmailQueue['getStats']> {
    return this.queue.getStats()
  }

  /**
   * Process queue immediately
   */
  async processQueueNow(): Promise<number> {
    await this.ensureInitialized()
    return this.queue.processImmediate((email) => this.transport.send(email))
  }

  /**
   * Add event listener
   */
  addEventListener(listener: EmailEventListener): void {
    this.queue.addEventListener(listener)
  }

  /**
   * Remove event listener
   */
  removeEventListener(listener: EmailEventListener): void {
    this.queue.removeEventListener(listener)
  }

  // ==========================================================================
  // Health & Monitoring
  // ==========================================================================

  /**
   * Get service health status
   */
  getHealth(): {
    service: 'healthy' | 'degraded' | 'unhealthy' | 'disabled'
    transport: TransportHealth
    queue: ReturnType<EmailQueue['getStats']>
    config: {
      enabled: boolean
      smtpHost: string
      rateLimit: number
    }
  } {
    const transport = this.transport.getHealth()
    const queue = this.queue.getStats()

    let serviceStatus: 'healthy' | 'degraded' | 'unhealthy' | 'disabled' = 'healthy'
    
    if (!this.config.enabled) {
      serviceStatus = 'disabled'
    } else if (!transport.healthy) {
      serviceStatus = 'unhealthy'
    } else if (queue.retry > 10 || transport.totalFailures > transport.totalSent * 0.1) {
      serviceStatus = 'degraded'
    }

    return {
      service: serviceStatus,
      transport,
      queue,
      config: {
        enabled: this.config.enabled,
        smtpHost: this.config.smtp.host,
        rateLimit: this.config.rateLimit,
      },
    }
  }

  /**
   * Check if service is healthy
   */
  isHealthy(): boolean {
    if (!this.config.enabled) {
      return true // Disabled is "healthy" in a sense
    }
    return this.transport.isHealthy()
  }

  /**
   * Verify SMTP connection
   */
  async verifyConnection(): Promise<boolean> {
    await this.ensureInitialized()
    return this.transport.verify()
  }

  // ==========================================================================
  // Lifecycle
  // ==========================================================================

  /**
   * Shutdown the service gracefully
   */
  async shutdown(): Promise<void> {
    logger.info('Shutting down EmailAlertService')
    
    // Stop queue processing
    this.queue.stopProcessing()
    
    // Wait for pending emails (with timeout)
    const stats = this.queue.getStats()
    if (stats.sending > 0) {
      logger.info('Waiting for pending emails to complete', { pending: stats.sending })
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
    
    // Close transport
    await closeTransportPool()
    
    this.initialized = false
    logger.info('EmailAlertService shutdown complete')
  }
}

// ==========================================================================
// Singleton Instance
// ==========================================================================

let serviceInstance: EmailAlertService | null = null

/**
 * Get or create email service singleton
 */
export function getEmailService(config?: Partial<EmailServiceConfig>): EmailAlertService {
  if (!serviceInstance) {
    serviceInstance = new EmailAlertService(config)
  }
  return serviceInstance
}

/**
 * Shutdown email service singleton
 */
export async function shutdownEmailService(): Promise<void> {
  if (serviceInstance) {
    await serviceInstance.shutdown()
    serviceInstance = null
  }
}

// ==========================================================================
// Convenience Exports (Backwards Compatible)
// ==========================================================================

/**
 * Send threat alert email (convenience function)
 */
export async function sendThreatAlert(
  to: string,
  brand: Brand,
  threats: Threat[]
): Promise<void> {
  const service = getEmailService()
  await service.sendThreatAlert(to, brand, threats)
}

/**
 * Send daily digest email (convenience function)
 */
export async function sendDailyDigest(
  to: string,
  brands: Array<{ brand: Brand; threatCount: number; newThreats: number }>
): Promise<void> {
  const service = getEmailService()
  await service.sendDailyDigest(
    to,
    brands.map(b => ({
      brand: b.brand,
      totalThreats: b.threatCount,
      newThreats: b.newThreats,
      threats: [],
    }))
  )
}

/**
 * Send welcome email (convenience function)
 */
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const service = getEmailService()
  await service.sendWelcomeEmail(to, name)
}

/**
 * Send scan summary email (convenience function)
 */
export async function sendScanSummary(
  to: string,
  brand: Brand,
  scanResult: { domainsChecked: number; threatsFound: number; threats: Threat[] }
): Promise<void> {
  const service = getEmailService()
  await service.sendScanSummary(to, brand, scanResult)
}

/**
 * Send weekly digest email (convenience function)
 */
export async function sendWeeklyDigest(
  to: string,
  brandSummaries: Array<{ brand: Brand; newThreats: number; threats: Threat[] }>
): Promise<void> {
  const service = getEmailService()
  await service.sendWeeklyDigest(to, brandSummaries)
}
