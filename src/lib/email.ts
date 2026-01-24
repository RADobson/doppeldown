import nodemailer from 'nodemailer'
import { Threat, Brand, ThreatSeverity } from '../types'
import { format } from 'date-fns'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendThreatAlert(
  to: string,
  brand: Brand,
  threats: Threat[]
): Promise<void> {
  const criticalThreats = threats.filter(t => t.severity === 'critical')
  const highThreats = threats.filter(t => t.severity === 'high')

  const subject = criticalThreats.length > 0
    ? `[CRITICAL] ${criticalThreats.length} critical threats detected for ${brand.name}`
    : `[Alert] ${threats.length} new threats detected for ${brand.name}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .alert-banner { padding: 15px; text-align: center; font-weight: bold; }
    .alert-critical { background: #dc2626; color: white; }
    .alert-high { background: #ea580c; color: white; }
    .alert-medium { background: #d97706; color: white; }
    .content { padding: 30px; }
    .threat-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 15px; }
    .threat-card.critical { border-left: 4px solid #dc2626; background: #fef2f2; }
    .threat-card.high { border-left: 4px solid #ea580c; background: #fff7ed; }
    .threat-card.medium { border-left: 4px solid #d97706; background: #fffbeb; }
    .threat-card.low { border-left: 4px solid #3b82f6; background: #eff6ff; }
    .threat-url { font-family: monospace; word-break: break-all; background: #f3f4f6; padding: 8px; border-radius: 4px; font-size: 13px; }
    .severity-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; color: white; }
    .severity-critical { background: #dc2626; }
    .severity-high { background: #ea580c; }
    .severity-medium { background: #d97706; }
    .severity-low { background: #3b82f6; }
    .cta-button { display: inline-block; background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="header">
    <h1>DoppelDown Alert</h1>
    <p>Brand Protection Monitoring</p>
  </div>

  ${criticalThreats.length > 0 ? `
    <div class="alert-banner alert-critical">
      ${criticalThreats.length} CRITICAL THREAT${criticalThreats.length > 1 ? 'S' : ''} DETECTED
    </div>
  ` : highThreats.length > 0 ? `
    <div class="alert-banner alert-high">
      ${highThreats.length} HIGH PRIORITY THREAT${highThreats.length > 1 ? 'S' : ''} DETECTED
    </div>
  ` : ''}

  <div class="content">
    <p>New threats have been detected for <strong>${brand.name}</strong> (${brand.domain}):</p>

    ${threats.slice(0, 10).map(threat => `
      <div class="threat-card ${threat.severity}">
        <div style="margin-bottom: 10px;">
          <span class="severity-badge severity-${threat.severity}">${threat.severity.toUpperCase()}</span>
          <span style="margin-left: 10px; color: #6b7280; font-size: 13px;">
            ${formatThreatType(threat.type)}
          </span>
        </div>
        <div class="threat-url">${threat.url}</div>
        ${threat.description ? `<p style="margin-top: 10px; font-size: 14px; color: #4b5563;">${threat.description}</p>` : ''}
        <p style="margin-top: 10px; font-size: 12px; color: #9ca3af;">
          Detected: ${format(new Date(threat.detected_at), 'PPP p')}
        </p>
      </div>
    `).join('')}

    ${threats.length > 10 ? `
      <p style="text-align: center; color: #6b7280;">
        And ${threats.length - 10} more threats...
      </p>
    ` : ''}

    <div style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/brands/${brand.id}" class="cta-button">
        View All Threats
      </a>
    </div>

    <h3 style="margin-top: 30px;">Recommended Actions:</h3>
    <ol>
      <li>Review each threat in your dashboard</li>
      <li>Collect additional evidence if needed</li>
      <li>Generate a takedown report</li>
      <li>Submit takedown requests to registrars/hosts</li>
    </ol>
  </div>

  <div class="footer">
    <p>This alert was sent by DoppelDown</p>
    <p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings">Manage alert settings</a>
    </p>
  </div>
</body>
</html>
`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'alerts@doppeldown.app',
    to,
    subject,
    html,
  })
}

export async function sendDailyDigest(
  to: string,
  brands: { brand: Brand; threatCount: number; newThreats: number }[]
): Promise<void> {
  const totalNew = brands.reduce((sum, b) => sum + b.newThreats, 0)

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .brand-row { display: flex; justify-content: space-between; padding: 15px; border-bottom: 1px solid #e5e7eb; }
    .stat { text-align: center; padding: 20px; background: #f8fafc; border-radius: 8px; margin: 10px; flex: 1; }
    .stat-number { font-size: 32px; font-weight: bold; color: #1e40af; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Daily Security Digest</h1>
    <p>${format(new Date(), 'PPPP')}</p>
  </div>

  <div class="content">
    <div style="display: flex; justify-content: space-around; margin-bottom: 30px;">
      <div class="stat">
        <div class="stat-number">${brands.length}</div>
        <div>Brands Monitored</div>
      </div>
      <div class="stat">
        <div class="stat-number">${totalNew}</div>
        <div>New Threats</div>
      </div>
    </div>

    <h3>Brand Summary:</h3>
    ${brands.map(({ brand, threatCount, newThreats }) => `
      <div class="brand-row">
        <div>
          <strong>${brand.name}</strong>
          <div style="font-size: 13px; color: #6b7280;">${brand.domain}</div>
        </div>
        <div style="text-align: right;">
          <div>${threatCount} total threats</div>
          ${newThreats > 0 ? `<div style="color: #dc2626; font-weight: bold;">+${newThreats} new</div>` : '<div style="color: #22c55e;">No new threats</div>'}
        </div>
      </div>
    `).join('')}

    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">
        View Dashboard
      </a>
    </div>
  </div>

  <div class="footer">
    <p>DoppelDown - Protecting your brand 24/7</p>
  </div>
</body>
</html>
`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'alerts@doppeldown.app',
    to,
    subject: `DoppelDown Daily Digest - ${totalNew} new threat${totalNew !== 1 ? 's' : ''} detected`,
    html,
  })
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 40px; text-align: center; }
    .content { padding: 30px; }
    .step { display: flex; margin-bottom: 20px; }
    .step-number { background: #1e40af; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Welcome to DoppelDown</h1>
    <p>Your brand protection journey starts now</p>
  </div>

  <div class="content">
    <p>Hi ${name},</p>
    <p>Thank you for signing up for DoppelDown! We're excited to help you protect your brand from phishing attacks, typosquatting, and brand impersonation.</p>

    <h3>Getting Started:</h3>

    <div class="step">
      <div class="step-number">1</div>
      <div>
        <strong>Add Your Brand</strong>
        <p>Enter your brand name, domain, and any keywords you want to monitor.</p>
      </div>
    </div>

    <div class="step">
      <div class="step-number">2</div>
      <div>
        <strong>Run Your First Scan</strong>
        <p>We'll scan the web for typosquatting domains, lookalike websites, and potential threats.</p>
      </div>
    </div>

    <div class="step">
      <div class="step-number">3</div>
      <div>
        <strong>Review & Take Action</strong>
        <p>Analyze detected threats and generate takedown reports for removal requests.</p>
      </div>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #1e40af; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-size: 16px;">
        Go to Dashboard
      </a>
    </div>

    <p style="margin-top: 30px;">Have questions? Reply to this email and we'll help you get set up.</p>
  </div>

  <div class="footer">
    <p>DoppelDown - Protecting brands from online threats</p>
  </div>
</body>
</html>
`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'welcome@doppeldown.app',
    to,
    subject: 'Welcome to DoppelDown - Let\'s protect your brand',
    html,
  })
}

function formatThreatType(type: string): string {
  const types: Record<string, string> = {
    'typosquat_domain': 'Typosquatting Domain',
    'lookalike_website': 'Lookalike Website',
    'phishing_page': 'Phishing Page',
    'fake_social_account': 'Fake Social Account',
    'brand_impersonation': 'Brand Impersonation',
    'trademark_abuse': 'Trademark Abuse',
  }
  return types[type] || type
}
