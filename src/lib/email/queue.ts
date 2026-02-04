/**
 * Email Queue Manager
 * Handles email queuing, retry logic, rate limiting, and persistence
 */

import { randomUUID } from 'crypto'
import type {
  EmailMessage,
  QueuedEmail,
  EmailStatus,
  EmailPriority,
  EmailServiceConfig,
  SendResult,
  EmailEvent,
  EmailEventListener,
} from './types'
import { QueueFullError, isRetryable } from './errors'
import { Logger } from '../logger'

const logger = new Logger('EmailQueue')

/**
 * Priority weights for queue ordering
 */
const PRIORITY_WEIGHTS: Record<EmailPriority, number> = {
  critical: 4,
  high: 3,
  normal: 2,
  low: 1,
}

/**
 * Email Queue Manager
 */
export class EmailQueue {
  private config: EmailServiceConfig
  private queue: Map<string, QueuedEmail> = new Map()
  private processingIds: Set<string> = new Set()
  private eventListeners: Set<EmailEventListener> = new Set()
  
  // Rate limiting
  private sentTimestamps: number[] = []
  private readonly RATE_WINDOW_MS = 60000 // 1 minute

  // Processing state
  private isProcessing = false
  private processingInterval: NodeJS.Timeout | null = null

  constructor(config: EmailServiceConfig) {
    this.config = config
    logger.info('EmailQueue initialized', {
      maxQueueSize: config.maxQueueSize,
      rateLimit: config.rateLimit,
    })
  }

  /**
   * Add email to queue
   */
  async enqueue(message: Omit<EmailMessage, 'id'>): Promise<QueuedEmail> {
    // Check queue size
    if (this.queue.size >= this.config.maxQueueSize) {
      throw new QueueFullError(this.queue.size, this.config.maxQueueSize)
    }

    const id = message.metadata?.emailId as string || randomUUID()
    
    const queuedEmail: QueuedEmail = {
      ...message,
      id,
      status: 'pending',
      retryCount: 0,
      queuedAt: new Date(),
    }

    this.queue.set(id, queuedEmail)
    queuedEmail.status = 'queued'

    logger.debug('Email enqueued', {
      id,
      to: message.to,
      subject: message.subject,
      priority: message.priority,
      queueSize: this.queue.size,
    })

    this.emit({ type: 'queued', email: queuedEmail })

    return queuedEmail
  }

  /**
   * Get next email to process (priority-based)
   */
  getNext(): QueuedEmail | null {
    // Filter to ready emails (pending/queued/retry with nextRetryAt passed)
    const now = Date.now()
    const readyEmails = Array.from(this.queue.values())
      .filter(email => {
        if (this.processingIds.has(email.id)) {
          return false
        }
        if (email.status === 'pending' || email.status === 'queued') {
          return true
        }
        if (email.status === 'retry' && email.nextRetryAt) {
          return email.nextRetryAt.getTime() <= now
        }
        return false
      })

    if (readyEmails.length === 0) {
      return null
    }

    // Sort by priority (highest first), then by queue time (oldest first)
    readyEmails.sort((a, b) => {
      const priorityDiff = PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority]
      if (priorityDiff !== 0) {
        return priorityDiff
      }
      return a.queuedAt.getTime() - b.queuedAt.getTime()
    })

    return readyEmails[0]
  }

  /**
   * Check rate limit
   */
  canSend(): boolean {
    const now = Date.now()
    const windowStart = now - this.RATE_WINDOW_MS
    
    // Clean old timestamps
    this.sentTimestamps = this.sentTimestamps.filter(t => t > windowStart)
    
    return this.sentTimestamps.length < this.config.rateLimit
  }

  /**
   * Wait until rate limit allows sending
   */
  async waitForRateLimit(): Promise<void> {
    while (!this.canSend()) {
      const now = Date.now()
      const windowStart = now - this.RATE_WINDOW_MS
      const oldestInWindow = this.sentTimestamps.find(t => t > windowStart) || now
      const waitTime = Math.max(100, oldestInWindow - windowStart + 100)
      
      logger.debug('Rate limit reached, waiting', { waitTime })
      await this.sleep(waitTime)
    }
  }

  /**
   * Record a sent email for rate limiting
   */
  recordSent(): void {
    this.sentTimestamps.push(Date.now())
  }

  /**
   * Mark email as being processed
   */
  markProcessing(id: string): void {
    const email = this.queue.get(id)
    if (email) {
      email.status = 'sending'
      email.lastAttemptAt = new Date()
      this.processingIds.add(id)
      this.emit({ type: 'sending', emailId: id })
    }
  }

  /**
   * Mark email as sent
   */
  markSent(id: string, result: SendResult): void {
    const email = this.queue.get(id)
    if (email) {
      email.status = 'sent'
      email.sentAt = new Date()
      this.processingIds.delete(id)
      this.queue.delete(id)
      
      logger.info('Email marked as sent', {
        id,
        messageId: result.messageId,
        duration: result.duration,
      })
      
      this.emit({ type: 'sent', emailId: id, result })
    }
  }

  /**
   * Mark email as failed
   */
  markFailed(id: string, result: SendResult): void {
    const email = this.queue.get(id)
    if (!email) {
      return
    }

    this.processingIds.delete(id)
    email.lastError = result.error?.message
    email.retryCount++

    const shouldRetry = 
      result.error?.retryable && 
      email.retryCount < this.config.maxRetries

    if (shouldRetry) {
      // Calculate next retry time with exponential backoff
      const delay = this.calculateRetryDelay(email.retryCount)
      email.status = 'retry'
      email.nextRetryAt = new Date(Date.now() + delay)

      logger.info('Email scheduled for retry', {
        id,
        retryCount: email.retryCount,
        maxRetries: this.config.maxRetries,
        nextRetryAt: email.nextRetryAt,
        delay,
      })

      this.emit({
        type: 'retry',
        emailId: id,
        attempt: email.retryCount,
        nextRetryAt: email.nextRetryAt,
      })
    } else {
      // Permanent failure
      email.status = 'failed'
      this.queue.delete(id)

      logger.error('Email permanently failed', undefined, {
        id,
        retryCount: email.retryCount,
        lastError: email.lastError,
        errorCode: result.error?.code,
      })

      this.emit({
        type: 'failed',
        emailId: id,
        error: result.error!,
      })
    }
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private calculateRetryDelay(retryCount: number): number {
    const baseDelay = this.config.retryDelayMs
    const multiplier = this.config.retryBackoffMultiplier
    const maxDelay = this.config.maxRetryDelayMs

    // Exponential backoff: delay * multiplier^(retryCount-1)
    const delay = baseDelay * Math.pow(multiplier, retryCount - 1)
    
    // Add jitter (±20%)
    const jitter = delay * (0.8 + Math.random() * 0.4)
    
    return Math.min(jitter, maxDelay)
  }

  /**
   * Get email by ID
   */
  get(id: string): QueuedEmail | undefined {
    return this.queue.get(id)
  }

  /**
   * Remove email from queue
   */
  remove(id: string): boolean {
    const email = this.queue.get(id)
    if (email) {
      this.processingIds.delete(id)
      this.queue.delete(id)
      logger.debug('Email removed from queue', { id })
      return true
    }
    return false
  }

  /**
   * Clear all emails from queue
   */
  clear(): void {
    const count = this.queue.size
    this.queue.clear()
    this.processingIds.clear()
    logger.info('Queue cleared', { count })
  }

  /**
   * Get queue statistics
   */
  getStats(): {
    total: number
    pending: number
    queued: number
    sending: number
    retry: number
    failed: number
    byPriority: Record<EmailPriority, number>
    processingRate: number
  } {
    const stats = {
      total: this.queue.size,
      pending: 0,
      queued: 0,
      sending: 0,
      retry: 0,
      failed: 0,
      byPriority: {
        critical: 0,
        high: 0,
        normal: 0,
        low: 0,
      } as Record<EmailPriority, number>,
      processingRate: this.sentTimestamps.length,
    }

    Array.from(this.queue.values()).forEach(email => {
      switch (email.status) {
        case 'pending':
          stats.pending++
          break
        case 'queued':
          stats.queued++
          break
        case 'sending':
          stats.sending++
          break
        case 'retry':
          stats.retry++
          break
        case 'failed':
          stats.failed++
          break
      }
      stats.byPriority[email.priority]++
    })

    return stats
  }

  /**
   * Get all queued emails (for debugging/monitoring)
   */
  getAll(): QueuedEmail[] {
    return Array.from(this.queue.values())
  }

  /**
   * Get emails pending retry
   */
  getRetryQueue(): QueuedEmail[] {
    return Array.from(this.queue.values())
      .filter(email => email.status === 'retry')
      .sort((a, b) => {
        const aTime = a.nextRetryAt?.getTime() || 0
        const bTime = b.nextRetryAt?.getTime() || 0
        return aTime - bTime
      })
  }

  /**
   * Add event listener
   */
  addEventListener(listener: EmailEventListener): void {
    this.eventListeners.add(listener)
  }

  /**
   * Remove event listener
   */
  removeEventListener(listener: EmailEventListener): void {
    this.eventListeners.delete(listener)
  }

  /**
   * Emit event to all listeners
   */
  private emit(event: EmailEvent): void {
    Array.from(this.eventListeners).forEach(listener => {
      try {
        listener(event)
      } catch (error) {
        logger.error('Event listener error', error as Error, { eventType: event.type })
      }
    })
  }

  /**
   * Start processing loop
   */
  startProcessing(processor: (email: QueuedEmail) => Promise<SendResult>): void {
    if (this.processingInterval) {
      return // Already running
    }

    this.isProcessing = true
    logger.info('Starting queue processing')

    this.processingInterval = setInterval(async () => {
      if (!this.isProcessing) {
        return
      }

      const email = this.getNext()
      if (!email) {
        return
      }

      // Check rate limit
      if (!this.canSend()) {
        return
      }

      try {
        this.markProcessing(email.id)
        this.recordSent()
        
        const result = await processor(email)
        
        if (result.success) {
          this.markSent(email.id, result)
        } else {
          this.markFailed(email.id, result)
        }
      } catch (error) {
        logger.error('Error processing email', error as Error, { id: email.id })
        this.markFailed(email.id, {
          success: false,
          error: {
            code: 'UNKNOWN',
            message: error instanceof Error ? error.message : String(error),
            retryable: isRetryable(error),
          },
          duration: 0,
        })
      }
    }, this.config.queueProcessingInterval)
  }

  /**
   * Stop processing loop
   */
  stopProcessing(): void {
    this.isProcessing = false
    if (this.processingInterval) {
      clearInterval(this.processingInterval)
      this.processingInterval = null
    }
    logger.info('Queue processing stopped')
  }

  /**
   * Process queue immediately (for testing or urgent emails)
   */
  async processImmediate(processor: (email: QueuedEmail) => Promise<SendResult>): Promise<number> {
    let processed = 0
    
    while (this.queue.size > 0 && this.canSend()) {
      const email = this.getNext()
      if (!email) {
        break
      }

      this.markProcessing(email.id)
      this.recordSent()
      
      try {
        const result = await processor(email)
        
        if (result.success) {
          this.markSent(email.id, result)
          processed++
        } else {
          this.markFailed(email.id, result)
        }
      } catch (error) {
        this.markFailed(email.id, {
          success: false,
          error: {
            code: 'UNKNOWN',
            message: error instanceof Error ? error.message : String(error),
            retryable: isRetryable(error),
          },
          duration: 0,
        })
      }
    }

    return processed
  }

  /**
   * Helper sleep function
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
