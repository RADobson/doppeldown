/**
 * Email System Test Endpoint
 * 
 * Tests email provider connectivity and optionally sends a test email.
 * Protected by CRON_SECRET to prevent abuse.
 * 
 * GET /api/email/test — Check provider health
 * POST /api/email/test — Send a test email
 */

import { NextRequest, NextResponse } from 'next/server'
import { detectProvider, testEmailProvider, sendEmail, getDefaultFrom } from '@/lib/email/provider'
import { validateBearerToken } from '@/lib/security'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!validateBearerToken(authHeader, process.env.CRON_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const provider = detectProvider()
  const health = await testEmailProvider()

  return NextResponse.json({
    provider,
    configured: provider !== 'console',
    health,
    config: {
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasSmtpHost: !!process.env.SMTP_HOST,
      hasSmtpUser: !!process.env.SMTP_USER,
      hasSmtpPass: !!(process.env.SMTP_PASS || process.env.SMTP_PASSWORD),
      hasEmailFrom: !!process.env.EMAIL_FROM,
      defaultFrom: getDefaultFrom(),
      emailEnabled: process.env.EMAIL_ENABLED !== 'false',
    },
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!validateBearerToken(authHeader, process.env.CRON_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { to?: string } = {}
  try {
    body = await request.json()
  } catch {
    // Use default
  }

  const to = body.to
  if (!to) {
    return NextResponse.json(
      { error: 'Missing "to" email address in request body' },
      { status: 400 }
    )
  }

  const result = await sendEmail({
    to,
    subject: '✅ DoppelDown Email Test — It works!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px;">
        <h1 style="color: #1e40af;">DoppelDown Email Test</h1>
        <p>If you're reading this, transactional emails are working correctly.</p>
        <p style="color: #6b7280; font-size: 14px;">
          Provider: <strong>${detectProvider()}</strong><br>
          Sent at: ${new Date().toISOString()}<br>
          From: ${getDefaultFrom()}
        </p>
      </div>
    `,
  })

  return NextResponse.json({
    result,
    timestamp: new Date().toISOString(),
  })
}
