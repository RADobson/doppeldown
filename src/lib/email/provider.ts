/**
 * Email Provider Abstraction
 * 
 * Supports both Resend (primary, recommended for Vercel) and SMTP (fallback).
 * Automatically selects the provider based on available configuration.
 * 
 * Priority:
 * 1. Resend (if RESEND_API_KEY is set) — best for serverless/Vercel
 * 2. SMTP via nodemailer (if SMTP_HOST + SMTP_USER are set) — for self-hosted
 * 3. Console logging (development fallback)
 */

import { Logger } from '../logger'

const logger = new Logger('EmailProvider')

export type EmailProvider = 'resend' | 'smtp' | 'console'

export interface EmailSendOptions {
  to: string | string[]
  from?: string
  replyTo?: string
  subject: string
  html: string
  text?: string
  cc?: string | string[]
  bcc?: string | string[]
  priority?: 'high' | 'normal' | 'low'
}

export interface EmailSendResult {
  success: boolean
  messageId?: string
  provider: EmailProvider
  error?: string
}

/**
 * Detect which email provider to use based on environment
 */
export function detectProvider(): EmailProvider {
  if (process.env.RESEND_API_KEY) {
    return 'resend'
  }
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return 'smtp'
  }
  return 'console'
}

/**
 * Get the default from address
 */
export function getDefaultFrom(): string {
  return process.env.EMAIL_FROM 
    || process.env.FROM_EMAIL 
    || 'DoppelDown <noreply@doppeldown.com>'
}

/**
 * Get the default reply-to address
 */
export function getDefaultReplyTo(): string | undefined {
  return process.env.EMAIL_REPLY_TO || process.env.REPLY_TO_EMAIL || undefined
}

/**
 * Send email via the detected provider
 */
export async function sendEmail(options: EmailSendOptions): Promise<EmailSendResult> {
  const provider = detectProvider()
  const from = options.from || getDefaultFrom()
  const replyTo = options.replyTo || getDefaultReplyTo()

  logger.info('Sending email', {
    provider,
    to: options.to,
    subject: options.subject,
  })

  switch (provider) {
    case 'resend':
      return sendViaResend({ ...options, from, replyTo })

    case 'smtp':
      return sendViaSmtp({ ...options, from, replyTo })

    case 'console':
    default:
      return sendViaConsole({ ...options, from, replyTo })
  }
}

/**
 * Send email via Resend API
 */
async function sendViaResend(options: EmailSendOptions & { from: string }): Promise<EmailSendResult> {
  try {
    // Dynamic import to avoid loading in environments without the key
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: options.from,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo ? (Array.isArray(options.replyTo) ? options.replyTo : [options.replyTo]) : undefined,
      cc: options.cc ? (Array.isArray(options.cc) ? options.cc : [options.cc]) : undefined,
      bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc : [options.bcc]) : undefined,
    })

    if (error) {
      logger.error('Resend API error', undefined, { error: error.message })
      return {
        success: false,
        provider: 'resend',
        error: error.message,
      }
    }

    logger.info('Email sent via Resend', { messageId: data?.id })
    return {
      success: true,
      messageId: data?.id,
      provider: 'resend',
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Resend error'
    logger.error('Failed to send via Resend', err instanceof Error ? err : undefined)
    return {
      success: false,
      provider: 'resend',
      error: message,
    }
  }
}

/**
 * Send email via SMTP (nodemailer)
 */
async function sendViaSmtp(options: EmailSendOptions & { from: string }): Promise<EmailSendResult> {
  try {
    const nodemailer = await import('nodemailer')
    
    const port = parseInt(process.env.SMTP_PORT || '587', 10)
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
      },
      connectionTimeout: 30000,
      socketTimeout: 60000,
    })

    const result = await transporter.sendMail({
      from: options.from,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      html: options.html,
      text: options.text,
      cc: options.cc,
      bcc: options.bcc,
      priority: options.priority,
    })

    logger.info('Email sent via SMTP', { messageId: result.messageId })
    return {
      success: true,
      messageId: result.messageId,
      provider: 'smtp',
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown SMTP error'
    logger.error('Failed to send via SMTP', err instanceof Error ? err : undefined)
    return {
      success: false,
      provider: 'smtp',
      error: message,
    }
  }
}

/**
 * Console fallback (development only)
 */
async function sendViaConsole(options: EmailSendOptions & { from: string }): Promise<EmailSendResult> {
  const isDev = process.env.NODE_ENV === 'development'
  
  if (isDev) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 EMAIL (console fallback — no provider configured)')
    console.log(`   To:      ${options.to}`)
    console.log(`   From:    ${options.from}`)
    console.log(`   Subject: ${options.subject}`)
    console.log(`   HTML:    ${options.html.length} chars`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    return {
      success: true,
      messageId: `console-${Date.now()}`,
      provider: 'console',
    }
  }

  // In production with no provider, log a warning and fail gracefully
  logger.warn('No email provider configured! Set RESEND_API_KEY or SMTP_HOST+SMTP_USER', {
    to: options.to,
    subject: options.subject,
  })

  return {
    success: false,
    provider: 'console',
    error: 'No email provider configured. Set RESEND_API_KEY (recommended) or SMTP_HOST + SMTP_USER.',
  }
}

/**
 * Test email provider connectivity
 */
export async function testEmailProvider(): Promise<{
  provider: EmailProvider
  healthy: boolean
  error?: string
}> {
  const provider = detectProvider()

  if (provider === 'console') {
    return { provider, healthy: false, error: 'No email provider configured' }
  }

  if (provider === 'resend') {
    try {
      const response = await fetch('https://api.resend.com/domains', {
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      })
      return {
        provider,
        healthy: response.ok,
        error: response.ok ? undefined : `HTTP ${response.status}`,
      }
    } catch (err) {
      return {
        provider,
        healthy: false,
        error: err instanceof Error ? err.message : 'Connection failed',
      }
    }
  }

  if (provider === 'smtp') {
    try {
      const nodemailer = await import('nodemailer')
      const port = parseInt(process.env.SMTP_PORT || '587', 10)
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
        },
        connectionTimeout: 10000,
      })
      await transporter.verify()
      return { provider, healthy: true }
    } catch (err) {
      return {
        provider,
        healthy: false,
        error: err instanceof Error ? err.message : 'SMTP verification failed',
      }
    }
  }

  return { provider, healthy: false, error: 'Unknown provider' }
}
