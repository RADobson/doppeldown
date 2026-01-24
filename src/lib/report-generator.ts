import { Threat, Brand, WhoisData } from '../types'
import { format } from 'date-fns'

export interface TakedownReport {
  brandInfo: {
    name: string
    domain: string
    owner: string
  }
  threats: ThreatReport[]
  generatedAt: string
  reportId: string
}

export interface ThreatReport {
  url: string
  domain: string
  type: string
  severity: string
  detectedAt: string
  evidence: {
    screenshotUrl?: string
    whoisData?: WhoisData
    htmlCaptured: boolean
  }
  analysis: string
}

// Generate a comprehensive takedown report
export function generateTakedownReport(
  brand: Brand,
  threats: Threat[],
  ownerName: string
): TakedownReport {
  const reportId = `TR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  return {
    brandInfo: {
      name: brand.name,
      domain: brand.domain,
      owner: ownerName
    },
    threats: threats.map(threat => ({
      url: threat.url,
      domain: threat.domain || extractDomain(threat.url),
      type: formatThreatType(threat.type),
      severity: threat.severity.toUpperCase(),
      detectedAt: threat.detected_at,
      evidence: {
        screenshotUrl: threat.screenshot_url,
        whoisData: threat.whois_data,
        htmlCaptured: threat.evidence?.html_snapshots?.length > 0
      },
      analysis: generateThreatAnalysis(threat, brand.name)
    })),
    generatedAt: new Date().toISOString(),
    reportId
  }
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function formatThreatType(type: string): string {
  const typeMap: Record<string, string> = {
    'typosquat_domain': 'Typosquatting Domain',
    'lookalike_website': 'Lookalike Website',
    'phishing_page': 'Phishing Page',
    'fake_social_account': 'Fake Social Media Account',
    'brand_impersonation': 'Brand Impersonation',
    'trademark_abuse': 'Trademark Abuse'
  }
  return typeMap[type] || type
}

function generateThreatAnalysis(threat: Threat, brandName: string): string {
  const analyses: string[] = []

  switch (threat.type) {
    case 'typosquat_domain':
      analyses.push(
        `This domain appears to be a typosquatting attempt targeting ${brandName}.`,
        'The domain name is similar enough to the legitimate brand to confuse users.'
      )
      break
    case 'phishing_page':
      analyses.push(
        `This page appears to be designed to steal user credentials or personal information.`,
        `It impersonates ${brandName} and may contain login forms or payment requests.`
      )
      break
    case 'lookalike_website':
      analyses.push(
        `This website mimics the appearance or functionality of ${brandName}'s legitimate site.`,
        'Users may be deceived into believing this is an official site.'
      )
      break
    case 'brand_impersonation':
      analyses.push(
        `This content falsely represents affiliation with ${brandName}.`,
        'It may be used to deceive users or damage the brand\'s reputation.'
      )
      break
    default:
      analyses.push(`This content poses a potential risk to ${brandName}'s brand integrity.`)
  }

  return analyses.join(' ')
}

// Generate HTML report for PDF conversion
export function generateHtmlReport(report: TakedownReport): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Takedown Request Report - ${report.reportId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { border-bottom: 3px solid #dc2626; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #dc2626; font-size: 24px; margin-bottom: 5px; }
    .header .subtitle { color: #666; font-size: 14px; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 18px; color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 15px; }
    .info-grid { display: grid; grid-template-columns: 150px 1fr; gap: 10px; }
    .info-label { font-weight: 600; color: #6b7280; }
    .threat-card { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .threat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .threat-type { font-weight: 600; color: #991b1b; }
    .severity { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .severity-critical { background: #dc2626; color: white; }
    .severity-high { background: #ea580c; color: white; }
    .severity-medium { background: #d97706; color: white; }
    .severity-low { background: #2563eb; color: white; }
    .threat-url { word-break: break-all; background: #fff; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 13px; margin-bottom: 10px; }
    .threat-analysis { font-size: 14px; color: #4b5563; }
    .evidence-section { background: #f8fafc; padding: 15px; border-radius: 4px; margin-top: 15px; }
    .evidence-title { font-weight: 600; font-size: 14px; margin-bottom: 10px; }
    .evidence-item { font-size: 13px; margin-bottom: 5px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
    .legal-notice { background: #fffbeb; border: 1px solid #fcd34d; padding: 15px; border-radius: 8px; font-size: 13px; margin-top: 30px; }
    .legal-notice h3 { color: #92400e; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>TAKEDOWN REQUEST REPORT</h1>
    <div class="subtitle">Report ID: ${report.reportId} | Generated: ${format(new Date(report.generatedAt), 'PPP p')}</div>
  </div>

  <div class="section">
    <h2 class="section-title">Brand Information</h2>
    <div class="info-grid">
      <span class="info-label">Brand Name:</span>
      <span>${report.brandInfo.name}</span>
      <span class="info-label">Official Domain:</span>
      <span>${report.brandInfo.domain}</span>
      <span class="info-label">Rights Owner:</span>
      <span>${report.brandInfo.owner}</span>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Identified Threats (${report.threats.length})</h2>
    ${report.threats.map((threat, index) => `
      <div class="threat-card">
        <div class="threat-header">
          <span class="threat-type">${index + 1}. ${threat.type}</span>
          <span class="severity severity-${threat.severity.toLowerCase()}">${threat.severity}</span>
        </div>
        <div class="threat-url">${threat.url}</div>
        <p class="threat-analysis">${threat.analysis}</p>

        <div class="evidence-section">
          <div class="evidence-title">Evidence Collected:</div>
          <div class="evidence-item">Domain: ${threat.domain}</div>
          <div class="evidence-item">Detection Date: ${format(new Date(threat.detectedAt), 'PPP p')}</div>
          ${threat.evidence.whoisData ? `
            <div class="evidence-item">Registrar: ${threat.evidence.whoisData.registrar || 'Unknown'}</div>
            <div class="evidence-item">Registration Date: ${threat.evidence.whoisData.creation_date || 'Unknown'}</div>
          ` : ''}
          ${threat.evidence.screenshotUrl ? `
            <div class="evidence-item">Screenshot URL: <a href="${threat.evidence.screenshotUrl}">View Screenshot</a></div>
          ` : ''}
          <div class="evidence-item">Screenshot Captured: ${threat.evidence.screenshotUrl ? 'Yes' : 'Pending'}</div>
          <div class="evidence-item">HTML Source Captured: ${threat.evidence.htmlCaptured ? 'Yes' : 'No'}</div>
        </div>
      </div>
    `).join('')}
  </div>

  <div class="legal-notice">
    <h3>Legal Notice</h3>
    <p>This report documents suspected trademark infringement and/or phishing activity. The brand owner or their authorized representative may use this report to submit takedown requests to:</p>
    <ul style="margin: 10px 0 0 20px;">
      <li>Domain registrars (via WHOIS abuse contacts)</li>
      <li>Web hosting providers</li>
      <li>Search engines (Google Safe Browsing, Microsoft SmartScreen)</li>
      <li>Anti-phishing organizations (APWG, PhishTank)</li>
      <li>Social media platforms</li>
    </ul>
  </div>

  <div class="footer">
    <p>Generated by DoppelDown - Brand Protection & Phishing Detection</p>
    <p>This report is provided for informational purposes. Verify all information before submitting takedown requests.</p>
  </div>
</body>
</html>
`
}

// Generate plain text report for emails
export function generateTextReport(report: TakedownReport): string {
  let text = `
================================================================================
                        TAKEDOWN REQUEST REPORT
================================================================================
Report ID: ${report.reportId}
Generated: ${format(new Date(report.generatedAt), 'PPP p')}

--------------------------------------------------------------------------------
BRAND INFORMATION
--------------------------------------------------------------------------------
Brand Name: ${report.brandInfo.name}
Official Domain: ${report.brandInfo.domain}
Rights Owner: ${report.brandInfo.owner}

--------------------------------------------------------------------------------
IDENTIFIED THREATS (${report.threats.length})
--------------------------------------------------------------------------------
`

  report.threats.forEach((threat, index) => {
    text += `
${index + 1}. ${threat.type.toUpperCase()}
   Severity: ${threat.severity}
   URL: ${threat.url}
   Domain: ${threat.domain}
   Detected: ${format(new Date(threat.detectedAt), 'PPP p')}

   Analysis: ${threat.analysis}

   Evidence:
   - Screenshot: ${threat.evidence.screenshotUrl ? 'Available' : 'Pending'}
   ${threat.evidence.screenshotUrl ? `- Screenshot URL: ${threat.evidence.screenshotUrl}` : ''}
   - HTML Source: ${threat.evidence.htmlCaptured ? 'Captured' : 'Not captured'}
   ${threat.evidence.whoisData ? `- Registrar: ${threat.evidence.whoisData.registrar || 'Unknown'}` : ''}

`
  })

  text += `
--------------------------------------------------------------------------------
RECOMMENDED ACTIONS
--------------------------------------------------------------------------------
1. Contact the domain registrar's abuse department
2. Report to Google Safe Browsing: https://safebrowsing.google.com/safebrowsing/report_phish/
3. Report to Microsoft: https://www.microsoft.com/en-us/wdsi/support/report-unsafe-site
4. Report to PhishTank: https://phishtank.org/
5. Consider engaging a professional takedown service

================================================================================
Generated by DoppelDown - Brand Protection & Phishing Detection
================================================================================
`

  return text
}

// Generate CSV export of threats
export function generateCsvExport(report: TakedownReport): string {
  const headers = ['URL', 'Domain', 'Type', 'Severity', 'Detected At', 'Registrar', 'Screenshot URL', 'Analysis']
  const rows = report.threats.map(threat => [
    threat.url,
    threat.domain,
    threat.type,
    threat.severity,
    threat.detectedAt,
    threat.evidence.whoisData?.registrar || '',
    threat.evidence.screenshotUrl
      ? `"${threat.evidence.screenshotUrl.replace(/"/g, '""')}"`
      : '',
    `"${threat.analysis.replace(/"/g, '""')}"`
  ])

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}
