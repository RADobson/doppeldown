/**
 * SMTP Transport Pool
 * Manages connections to SMTP server with pooling, health checks, and reconnection
 */

/* eslint-disable @typescript-eslint/no-var-requires */
import type { Transporter } from 'nodemailer'
import type { SmtpConfig, TransportHealth, SendResult, EmailMessage } from './types'

// Use require for nodemailer due to module compatibility
const nodemailer = require('nodemailer')
import { ConnectionError, AuthenticationError, parseError } from './errors'
import { Logger } from '../logger'

const logger = new Logger('SmtpTransport')

/**
 * SMTP Transport Pool manager
 */
export class SmtpTransportPool {
  private config: SmtpConfig
  private transporter: Transporter | null = null
  private isInitialized = false
  private isClosing = false
  
  // Health tracking
  private lastSuccessAt: Date | null = null
  private lastError: string | null = null
  private lastErrorAt: Date | null = null
  private totalSent = 0
  private totalFailures = 0
  private messagesSinceLastVerify = 0
  
  // Health check interval
  private healthCheckInterval: NodeJS.Timeout | null = null
  private readonly HEALTH_CHECK_INTERVAL_MS = 60000 // 1 minute
  private readonly VERIFY_INTERVAL = 10 // Verify every 10 messages

  constructor(config: SmtpConfig) {
    this.config = config
    logger.info('SmtpTransportPool created', {
      host: config.host,
      port: config.port,
      secure: config.secure,
      maxConnections: config.maxConnections,
    })
  }

  /**
   * Initialize the transport pool
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      logger.debug('Transport already initialized')
      return
    }

    logger.info('Initializing SMTP transport pool')

    try {
      this.transporter = this.createTransporter()
      
      // Verify connection
      await this.verify()
      
      this.isInitialized = true
      this.lastSuccessAt = new Date()
      
      // Start health check interval
      this.startHealthChecks()
      
      logger.info('SMTP transport pool initialized successfully')
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : String(error)
      this.lastErrorAt = new Date()
      logger.error('Failed to initialize SMTP transport', error as Error, {
        host: this.config.host,
        port: this.config.port,
      })
      throw error
    }
  }

  /**
   * Create nodemailer transporter with configuration
   */
  private createTransporter(): Transporter {
    return nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      connectionTimeout: this.config.connectionTimeout,
      socketTimeout: this.config.socketTimeout,
      pool: true,
      maxConnections: this.config.maxConnections,
      maxMessages: this.config.maxMessages,
      debug: this.config.debug,
      logger: this.config.debug,
      auth: this.config.auth ? {
        user: this.config.auth.user,
        pass: this.config.auth.pass,
      } : undefined,
      tls: this.config.tls,
    })
  }

  /**
   * Verify SMTP connection
   */
  async verify(): Promise<boolean> {
    if (!this.transporter) {
      throw new ConnectionError('Transport not initialized')
    }

    try {
      logger.debug('Verifying SMTP connection')
      await this.transporter.verify()
      this.lastSuccessAt = new Date()
      this.messagesSinceLastVerify = 0
      logger.debug('SMTP connection verified')
      return true
    } catch (error) {
      const parsed = parseError(error)
      this.lastError = parsed.message
      this.lastErrorAt = new Date()
      
      if (parsed.code === 'AUTHENTICATION_FAILED') {
        throw new AuthenticationError(parsed.message, error as Error)
      }
      
      throw new ConnectionError(
        `SMTP verification failed: ${parsed.message}`,
        error as Error,
        { host: this.config.host, port: this.config.port }
      )
    }
  }

  /**
   * Send an email
   */
  async send(email: EmailMessage): Promise<SendResult> {
    const startTime = Date.now()
    
    if (!this.isInitialized || !this.transporter) {
      await this.initialize()
    }

    if (this.isClosing) {
      throw new ConnectionError('Transport is closing')
    }

    // Periodic verification
    this.messagesSinceLastVerify++
    if (this.messagesSinceLastVerify >= this.VERIFY_INTERVAL) {
      try {
        await this.verify()
      } catch (error) {
        logger.warn('Periodic verification failed, attempting reconnect', { error })
        await this.reconnect()
      }
    }

    try {
      logger.debug('Sending email', {
        id: email.id,
        to: email.to,
        subject: email.subject,
      })

      const result = await this.transporter!.sendMail({
        from: email.from,
        to: email.to,
        cc: email.cc,
        bcc: email.bcc,
        replyTo: email.replyTo,
        subject: email.subject,
        text: email.text,
        html: email.html,
        attachments: email.attachments?.map(att => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType,
          cid: att.cid,
          encoding: att.encoding,
        })),
        headers: email.headers,
        priority: this.mapPriority(email.priority),
      })

      const duration = Date.now() - startTime
      this.totalSent++
      this.lastSuccessAt = new Date()

      logger.info('Email sent successfully', {
        id: email.id,
        messageId: result.messageId,
        duration,
        to: Array.isArray(email.to) ? email.to.join(', ') : email.to,
      })

      return {
        success: true,
        messageId: result.messageId,
        response: result.response,
        duration,
      }
    } catch (error) {
      const duration = Date.now() - startTime
      const parsed = parseError(error)
      
      this.totalFailures++
      this.lastError = parsed.message
      this.lastErrorAt = new Date()

      logger.error('Failed to send email', error as Error, {
        id: email.id,
        to: email.to,
        errorCode: parsed.code,
        duration,
      })

      // Attempt reconnect on connection errors
      if (parsed.code === 'CONNECTION_FAILED' || parsed.code === 'TIMEOUT') {
        logger.info('Connection error detected, scheduling reconnect')
        this.scheduleReconnect()
      }

      return {
        success: false,
        error: parsed.toErrorInfo(),
        duration,
      }
    }
  }

  /**
   * Map email priority to nodemailer priority
   */
  private mapPriority(priority: EmailMessage['priority']): 'high' | 'normal' | 'low' {
    switch (priority) {
      case 'critical':
      case 'high':
        return 'high'
      case 'low':
        return 'low'
      default:
        return 'normal'
    }
  }

  /**
   * Reconnect to SMTP server
   */
  private async reconnect(): Promise<void> {
    logger.info('Reconnecting to SMTP server')
    
    // Close existing connection
    if (this.transporter) {
      try {
        this.transporter.close()
      } catch (error) {
        logger.debug('Error closing existing transport', { error })
      }
    }

    // Create new transporter
    this.transporter = this.createTransporter()
    this.isInitialized = false
    
    // Re-initialize
    await this.initialize()
  }

  /**
   * Schedule reconnect after a delay
   */
  private reconnectTimeout: NodeJS.Timeout | null = null
  
  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      return // Already scheduled
    }

    this.reconnectTimeout = setTimeout(async () => {
      this.reconnectTimeout = null
      try {
        await this.reconnect()
      } catch (error) {
        logger.error('Scheduled reconnect failed', error as Error)
      }
    }, 5000) // 5 second delay
  }

  /**
   * Start periodic health checks
   */
  private startHealthChecks(): void {
    if (this.healthCheckInterval) {
      return
    }

    this.healthCheckInterval = setInterval(async () => {
      if (this.isClosing) {
        return
      }

      try {
        await this.verify()
        logger.debug('Health check passed')
      } catch (error) {
        logger.warn('Health check failed', {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }, this.HEALTH_CHECK_INTERVAL_MS)
  }

  /**
   * Stop health checks
   */
  private stopHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
      this.healthCheckInterval = null
    }
  }

  /**
   * Get transport health status
   */
  getHealth(): TransportHealth {
    const pool = this.transporter as unknown as {
      _connections?: Array<unknown>
      _queue?: Array<unknown>
    }

    return {
      healthy: this.isInitialized && !!this.transporter && !this.lastError,
      lastSuccessAt: this.lastSuccessAt ?? undefined,
      lastError: this.lastError ?? undefined,
      lastErrorAt: this.lastErrorAt ?? undefined,
      totalSent: this.totalSent,
      totalFailures: this.totalFailures,
      activeConnections: pool?._connections?.length ?? 0,
      pendingMessages: pool?._queue?.length ?? 0,
    }
  }

  /**
   * Check if transport is healthy
   */
  isHealthy(): boolean {
    if (!this.isInitialized || !this.transporter) {
      return false
    }

    // Consider unhealthy if last error was recent (within 1 minute)
    if (this.lastErrorAt) {
      const timeSinceError = Date.now() - this.lastErrorAt.getTime()
      if (timeSinceError < 60000) {
        return false
      }
    }

    return true
  }

  /**
   * Close the transport pool
   */
  async close(): Promise<void> {
    logger.info('Closing SMTP transport pool')
    this.isClosing = true
    
    // Stop health checks
    this.stopHealthChecks()
    
    // Clear reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    // Close transporter
    if (this.transporter) {
      try {
        this.transporter.close()
      } catch (error) {
        logger.debug('Error closing transporter', { error })
      }
      this.transporter = null
    }

    this.isInitialized = false
    logger.info('SMTP transport pool closed')
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalSent: number
    totalFailures: number
    successRate: number
    uptime: number | null
  } {
    const total = this.totalSent + this.totalFailures
    return {
      totalSent: this.totalSent,
      totalFailures: this.totalFailures,
      successRate: total > 0 ? (this.totalSent / total) * 100 : 100,
      uptime: this.lastSuccessAt ? Date.now() - this.lastSuccessAt.getTime() : null,
    }
  }
}

// Singleton instance
let transportPool: SmtpTransportPool | null = null

/**
 * Get or create transport pool singleton
 */
export function getTransportPool(config: SmtpConfig): SmtpTransportPool {
  if (!transportPool) {
    transportPool = new SmtpTransportPool(config)
  }
  return transportPool
}

/**
 * Close transport pool singleton
 */
export async function closeTransportPool(): Promise<void> {
  if (transportPool) {
    await transportPool.close()
    transportPool = null
  }
}
