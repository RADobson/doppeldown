/**
 * Email Templates
 * HTML/Text templates for all email types with responsive design
 */

import { format } from 'date-fns'
import type {
  EmailTemplate,
  ThreatAlertData,
  ScanCompleteData,
  DigestData,
  WelcomeData,
  PasswordResetData,
  AlertType,
} from './types'
import type { Threat, ThreatSeverity } from '../../types'

// ============================================================================
// Shared Styles & Components
// ============================================================================

const BRAND_COLORS = {
  primary: '#1e40af',
  primaryLight: '#3b82f6',
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#d97706',
  low: '#3b82f6',
  success: '#22c55e',
  gray: '#6b7280',
  lightGray: '#f8fafc',
  border: '#e5e7eb',
} as const

const SEVERITY_COLORS: Record<ThreatSeverity, { bg: string; text: string; badge: string }> = {
  critical: { bg: '#fef2f2', text: '#dc2626', badge: '#dc2626' },
  high: { bg: '#fff7ed', text: '#ea580c', badge: '#ea580c' },
  medium: { bg: '#fffbeb', text: '#d97706', badge: '#d97706' },
  low: { bg: '#eff6ff', text: '#3b82f6', badge: '#3b82f6' },
}

/**
 * Base email wrapper with consistent styling
 */
function baseWrapper(content: string, title: string, subtitle?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body { margin: 0; padding: 0; width: 100%; background-color: #f3f4f6; }
    table { border-collapse: collapse; }
    .wrapper { width: 100%; max-width: 600px; margin: 0 auto; }
    @media only screen and (max-width: 620px) {
      .wrapper { padding: 0 10px !important; }
      .content { padding: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <table class="wrapper" width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.primaryLight} 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700;">${escapeHtml(title)}</h1>
              ${subtitle ? `<p style="margin: 10px 0 0; opacity: 0.9; font-size: 14px;">${escapeHtml(subtitle)}</p>` : ''}
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td class="content" style="padding: 30px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: ${BRAND_COLORS.lightGray}; padding: 20px; text-align: center; font-size: 12px; color: ${BRAND_COLORS.gray};">
              <p style="margin: 0;">This email was sent by DoppelDown</p>
              <p style="margin: 10px 0 0;">
                <a href="\${appUrl}/dashboard/settings" style="color: ${BRAND_COLORS.gray}; text-decoration: underline;">Manage notification settings</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

/**
 * Primary CTA button
 */
function ctaButton(text: string, url: string): string {
  return `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 25px 0;">
  <tr>
    <td align="center">
      <a href="${escapeHtml(url)}" style="display: inline-block; background-color: ${BRAND_COLORS.primary}; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        ${escapeHtml(text)}
      </a>
    </td>
  </tr>
</table>
`
}

/**
 * Alert banner for critical/high priority
 */
function alertBanner(text: string, severity: 'critical' | 'high' | 'medium'): string {
  const colors = SEVERITY_COLORS[severity]
  return `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
  <tr>
    <td style="background-color: ${colors.badge}; color: white; padding: 15px; text-align: center; font-weight: 700;">
      ${escapeHtml(text)}
    </td>
  </tr>
</table>
`
}

/**
 * Stat box (for digests and summaries)
 */
function statBox(value: string | number, label: string, color?: string): string {
  return `
<td width="50%" style="text-align: center; padding: 20px; background-color: ${BRAND_COLORS.lightGray};">
  <div style="font-size: 36px; font-weight: 700; color: ${color || BRAND_COLORS.primary};">${value}</div>
  <div style="font-size: 14px; color: ${BRAND_COLORS.gray}; margin-top: 4px;">${escapeHtml(label)}</div>
</td>
`
}

/**
 * Threat card component
 */
function threatCard(threat: Threat): string {
  const colors = SEVERITY_COLORS[threat.severity]
  return `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 12px;">
  <tr>
    <td style="border: 1px solid ${BRAND_COLORS.border}; border-left: 4px solid ${colors.badge}; border-radius: 8px; padding: 16px; background-color: ${colors.bg};">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td>
            <span style="display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; color: white; background-color: ${colors.badge}; text-transform: uppercase;">
              ${threat.severity}
            </span>
            <span style="margin-left: 10px; color: ${BRAND_COLORS.gray}; font-size: 13px;">
              ${formatThreatType(threat.type)}
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 10px;">
            <div style="font-family: 'Courier New', monospace; word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 13px; color: #374151;">
              ${escapeHtml(threat.url)}
            </div>
          </td>
        </tr>
        ${threat.description ? `
        <tr>
          <td style="padding-top: 8px; font-size: 14px; color: #4b5563;">
            ${escapeHtml(threat.description)}
          </td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding-top: 8px; font-size: 12px; color: ${BRAND_COLORS.gray};">
            Detected: ${format(new Date(threat.detected_at), 'PPP p')}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`
}

// ============================================================================
// Template Definitions
// ============================================================================

/**
 * Threat Alert Template
 */
export const threatAlertTemplate: EmailTemplate<ThreatAlertData & { appUrl: string }> = {
  name: 'threat_detected',
  subject: (data) => {
    if (data.criticalCount > 0) {
      return `[CRITICAL] ${data.criticalCount} critical threat${data.criticalCount > 1 ? 's' : ''} detected for ${data.brand.name}`
    }
    if (data.highCount > 0) {
      return `[Alert] ${data.highCount} high-priority threat${data.highCount > 1 ? 's' : ''} detected for ${data.brand.name}`
    }
    return `[Alert] ${data.totalThreats} new threat${data.totalThreats > 1 ? 's' : ''} detected for ${data.brand.name}`
  },
  defaultPriority: 'high',
  renderHtml: (data) => {
    let alertBannerHtml = ''
    if (data.criticalCount > 0) {
      alertBannerHtml = alertBanner(
        `${data.criticalCount} CRITICAL THREAT${data.criticalCount > 1 ? 'S' : ''} DETECTED`,
        'critical'
      )
    } else if (data.highCount > 0) {
      alertBannerHtml = alertBanner(
        `${data.highCount} HIGH PRIORITY THREAT${data.highCount > 1 ? 'S' : ''} DETECTED`,
        'high'
      )
    }

    const threatsHtml = data.threats
      .slice(0, 10)
      .map(threat => threatCard(threat))
      .join('')

    const moreThreatsNote = data.threats.length > 10
      ? `<p style="text-align: center; color: ${BRAND_COLORS.gray}; margin-top: 16px;">
           And ${data.threats.length - 10} more threats...
         </p>`
      : ''

    const content = `
${alertBannerHtml}
<p style="margin: 0 0 20px;">
  New threats have been detected for <strong>${escapeHtml(data.brand.name)}</strong> (${escapeHtml(data.brand.domain)}):
</p>

${threatsHtml}
${moreThreatsNote}

${ctaButton('View All Threats', `${data.appUrl}/dashboard/brands/${data.brand.id}`)}

<h3 style="margin: 30px 0 15px; font-size: 16px; color: #1f2937;">Recommended Actions:</h3>
<ol style="margin: 0; padding-left: 20px; color: #4b5563;">
  <li style="margin-bottom: 8px;">Review each threat in your dashboard</li>
  <li style="margin-bottom: 8px;">Collect additional evidence if needed</li>
  <li style="margin-bottom: 8px;">Generate a takedown report</li>
  <li style="margin-bottom: 8px;">Submit takedown requests to registrars/hosts</li>
</ol>
`
    return baseWrapper(content, 'DoppelDown Alert', 'Brand Protection Monitoring')
      .replace(/\$\{appUrl\}/g, data.appUrl)
  },
}

/**
 * Scan Complete Template
 */
export const scanCompleteTemplate: EmailTemplate<ScanCompleteData & { appUrl: string }> = {
  name: 'scan_complete',
  subject: (data) => `Scan Complete: ${data.brand.name} - ${data.threatsFound} threat${data.threatsFound !== 1 ? 's' : ''} found`,
  defaultPriority: 'normal',
  renderHtml: (data) => {
    const topThreats = data.threats.slice(0, 5)
    const threatsHtml = topThreats.length > 0
      ? topThreats.map(threat => threatCard(threat)).join('')
      : `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 20px 0;">
  <tr>
    <td style="background-color: #f0fdf4; border: 1px solid ${BRAND_COLORS.success}; border-radius: 8px; padding: 20px; text-align: center;">
      <span style="color: ${BRAND_COLORS.success}; font-weight: 700;">
        ✓ No threats detected - your brand is secure!
      </span>
    </td>
  </tr>
</table>
`

    const content = `
<p style="margin: 0 0 20px;">
  Your scan for <strong>${escapeHtml(data.brand.name)}</strong> (${escapeHtml(data.brand.domain)}) has completed.
</p>

<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 25px;">
  <tr>
    ${statBox(data.domainsChecked, 'Domains Checked')}
    ${statBox(data.threatsFound, 'Threats Found', data.threatsFound > 0 ? BRAND_COLORS.critical : BRAND_COLORS.success)}
  </tr>
</table>

${topThreats.length > 0 ? `<h3 style="margin: 0 0 15px; font-size: 16px;">Top Threats:</h3>` : ''}
${threatsHtml}

${ctaButton('View Full Results', `${data.appUrl}/dashboard/brands/${data.brand.id}`)}
`
    return baseWrapper(content, 'Scan Complete', 'DoppelDown Brand Protection')
      .replace(/\$\{appUrl\}/g, data.appUrl)
  },
}

/**
 * Daily Digest Template
 */
export const dailyDigestTemplate: EmailTemplate<DigestData & { appUrl: string }> = {
  name: 'daily_digest',
  subject: (data) => `DoppelDown Daily Digest - ${data.totalNewThreats} new threat${data.totalNewThreats !== 1 ? 's' : ''} detected`,
  defaultPriority: 'normal',
  renderHtml: (data) => {
    const brandRows = data.brandSummaries.map(({ brand, totalThreats, newThreats }) => `
<tr>
  <td style="border-bottom: 1px solid ${BRAND_COLORS.border}; padding: 15px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td>
          <strong style="font-size: 15px;">${escapeHtml(brand.name)}</strong>
          <div style="font-size: 13px; color: ${BRAND_COLORS.gray};">${escapeHtml(brand.domain)}</div>
        </td>
        <td style="text-align: right; vertical-align: top;">
          <div style="font-size: 14px;">${totalThreats} total threats</div>
          ${newThreats > 0
            ? `<div style="color: ${BRAND_COLORS.critical}; font-weight: 700;">+${newThreats} new</div>`
            : `<div style="color: ${BRAND_COLORS.success};">No new threats</div>`
          }
        </td>
      </tr>
    </table>
  </td>
</tr>
`).join('')

    const content = `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 25px;">
  <tr>
    ${statBox(data.totalBrands, 'Brands Monitored')}
    ${statBox(data.totalNewThreats, 'New Threats', data.totalNewThreats > 0 ? BRAND_COLORS.critical : BRAND_COLORS.success)}
  </tr>
</table>

<h3 style="margin: 0 0 15px; font-size: 16px;">Brand Summary:</h3>

<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
  ${brandRows}
</table>

${ctaButton('View Dashboard', `${data.appUrl}/dashboard`)}
`
    return baseWrapper(content, 'Daily Security Digest', format(new Date(), 'PPPP'))
      .replace(/\$\{appUrl\}/g, data.appUrl)
  },
}

/**
 * Weekly Digest Template
 */
export const weeklyDigestTemplate: EmailTemplate<DigestData & { appUrl: string }> = {
  name: 'weekly_digest',
  subject: (data) => `Weekly Security Digest - ${data.totalNewThreats} new threat${data.totalNewThreats !== 1 ? 's' : ''}`,
  defaultPriority: 'normal',
  renderHtml: (data) => {
    const brandSections = data.brandSummaries.map(({ brand, newThreats, threats }) => `
<tr>
  <td style="border-bottom: 1px solid ${BRAND_COLORS.border}; padding: 20px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td>
          <strong style="font-size: 16px;">${escapeHtml(brand.name)}</strong>
          <div style="font-size: 13px; color: ${BRAND_COLORS.gray};">${escapeHtml(brand.domain)}</div>
        </td>
        <td style="text-align: right; vertical-align: top;">
          ${newThreats > 0
            ? `<span style="color: ${BRAND_COLORS.critical}; font-weight: 700;">+${newThreats} new</span>`
            : `<span style="color: ${BRAND_COLORS.success};">No new threats</span>`
          }
        </td>
      </tr>
      ${threats.length > 0 ? `
      <tr>
        <td colspan="2" style="padding-top: 12px;">
          ${threats.slice(0, 5).map(threat => `
            <div style="margin-bottom: 6px;">
              <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 700; color: white; background-color: ${SEVERITY_COLORS[threat.severity].badge}; text-transform: uppercase;">
                ${threat.severity}
              </span>
              <span style="margin-left: 8px; font-size: 13px; color: #4b5563;">
                ${escapeHtml(threat.domain || threat.url)}
              </span>
            </div>
          `).join('')}
          ${threats.length > 5 ? `
            <div style="font-size: 12px; color: ${BRAND_COLORS.gray}; margin-top: 8px;">
              And ${threats.length - 5} more...
            </div>
          ` : ''}
        </td>
      </tr>
      ` : ''}
    </table>
  </td>
</tr>
`).join('')

    const content = `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 25px;">
  <tr>
    ${statBox(data.totalBrands, 'Brands Monitored')}
    ${statBox(data.totalNewThreats, 'New This Week', data.totalNewThreats > 0 ? BRAND_COLORS.critical : BRAND_COLORS.success)}
  </tr>
</table>

<h3 style="margin: 0 0 15px; font-size: 16px;">Brand Summary:</h3>

<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
  ${brandSections}
</table>

${ctaButton('View Dashboard', `${data.appUrl}/dashboard`)}
`
    return baseWrapper(content, 'Weekly Security Digest', `${format(data.startDate, 'MMM d')} - ${format(data.endDate, 'MMM d, yyyy')}`)
      .replace(/\$\{appUrl\}/g, data.appUrl)
  },
}

/**
 * Welcome Email Template
 */
export const welcomeTemplate: EmailTemplate<WelcomeData & { appUrl: string }> = {
  name: 'welcome',
  subject: () => "Welcome to DoppelDown - Let's protect your brand",
  defaultPriority: 'high',
  renderHtml: (data) => {
    const steps = [
      { title: 'Add Your Brand', desc: 'Enter your brand name, domain, and any keywords you want to monitor.' },
      { title: 'Run Your First Scan', desc: "We'll scan the web for typosquatting domains, lookalike websites, and potential threats." },
      { title: 'Review & Take Action', desc: 'Analyze detected threats and generate takedown reports for removal requests.' },
    ]

    const stepsHtml = steps.map((step, i) => `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 20px;">
  <tr>
    <td width="40" valign="top">
      <div style="width: 32px; height: 32px; background-color: ${BRAND_COLORS.primary}; border-radius: 50%; color: white; font-weight: 700; text-align: center; line-height: 32px;">
        ${i + 1}
      </div>
    </td>
    <td style="padding-left: 12px;">
      <strong style="font-size: 15px;">${escapeHtml(step.title)}</strong>
      <p style="margin: 4px 0 0; font-size: 14px; color: #4b5563;">${escapeHtml(step.desc)}</p>
    </td>
  </tr>
</table>
`).join('')

    const content = `
<p style="margin: 0 0 20px; font-size: 16px;">
  Hi ${escapeHtml(data.userName)},
</p>

<p style="margin: 0 0 25px; color: #4b5563;">
  Thank you for signing up for DoppelDown! We're excited to help you protect your brand from phishing attacks, typosquatting, and brand impersonation.
</p>

<h3 style="margin: 0 0 20px; font-size: 16px;">Getting Started:</h3>

${stepsHtml}

${ctaButton('Go to Dashboard', `${data.appUrl}/dashboard`)}

<p style="margin: 25px 0 0; font-size: 14px; color: #4b5563;">
  Have questions? Reply to this email and we'll help you get set up.
</p>
`
    return baseWrapper(content, 'Welcome to DoppelDown', 'Your brand protection journey starts now')
      .replace(/\$\{appUrl\}/g, data.appUrl)
  },
}

/**
 * Password Reset Template
 */
export const passwordResetTemplate: EmailTemplate<PasswordResetData & { appUrl: string }> = {
  name: 'password_reset',
  subject: () => 'Reset your DoppelDown password',
  defaultPriority: 'high',
  renderHtml: (data) => {
    const content = `
<p style="margin: 0 0 20px; font-size: 16px;">
  Hi ${escapeHtml(data.userName)},
</p>

<p style="margin: 0 0 20px; color: #4b5563;">
  We received a request to reset your password. Click the button below to create a new password:
</p>

${ctaButton('Reset Password', data.resetUrl)}

<p style="margin: 20px 0; font-size: 14px; color: ${BRAND_COLORS.gray};">
  This link will expire on ${format(data.expiresAt, 'PPP p')}.
</p>

<p style="margin: 20px 0; font-size: 14px; color: #4b5563;">
  If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
</p>

<hr style="border: none; border-top: 1px solid ${BRAND_COLORS.border}; margin: 25px 0;">

<p style="margin: 0; font-size: 12px; color: ${BRAND_COLORS.gray};">
  For security, this request was received from a web browser. If you didn't make this request, please contact support.
</p>
`
    return baseWrapper(content, 'Password Reset', 'DoppelDown Security')
      .replace(/\$\{appUrl\}/g, data.appUrl)
  },
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Escape HTML entities
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, char => map[char])
}

/**
 * Format threat type for display
 */
function formatThreatType(type: string): string {
  const types: Record<string, string> = {
    typosquat_domain: 'Typosquatting Domain',
    lookalike_website: 'Lookalike Website',
    phishing_page: 'Phishing Page',
    fake_social_account: 'Fake Social Account',
    brand_impersonation: 'Brand Impersonation',
    trademark_abuse: 'Trademark Abuse',
    suspicious_domain: 'Suspicious Domain',
    malware_hosting: 'Malware Hosting',
  }
  return types[type] || type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

// ============================================================================
// Template Registry
// ============================================================================

/**
 * Get template by alert type
 */
export function getTemplate(type: AlertType): EmailTemplate<unknown> {
  const templates: Record<string, EmailTemplate<unknown>> = {
    threat_detected: threatAlertTemplate as EmailTemplate<unknown>,
    scan_complete: scanCompleteTemplate as EmailTemplate<unknown>,
    daily_digest: dailyDigestTemplate as EmailTemplate<unknown>,
    weekly_digest: weeklyDigestTemplate as EmailTemplate<unknown>,
    welcome: welcomeTemplate as EmailTemplate<unknown>,
    password_reset: passwordResetTemplate as EmailTemplate<unknown>,
  }

  const template = templates[type]
  if (!template) {
    throw new Error(`Unknown email template type: ${type}`)
  }
  
  return template
}
