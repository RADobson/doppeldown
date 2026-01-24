import { WhoisData, Evidence, HtmlSnapshot, PageAnalysis } from '../types'
import puppeteer from 'puppeteer-core'
import crypto from 'crypto'
import { screenshotQueue, externalQueue } from './scan-queue'

type CollectEvidenceOptions = {
  url: string
  brandId?: string
  brandName?: string
  scanId?: string
  supabase?: any
  storageBucket?: string
}

type UploadResult = {
  storagePath: string
  publicUrl?: string
  sizeBytes: number
  contentType: string
}

const DEFAULT_EVIDENCE_BUCKET = 'evidence'
const SCREENSHOT_ENABLED = process.env.EVIDENCE_SCREENSHOTS_ENABLED !== 'false'
const MAX_HTML_BYTES = parseInt(process.env.EVIDENCE_HTML_MAX_BYTES || '1048576', 10)

function buildEvidenceBasePath(options: {
  brandId?: string
  scanId?: string
  domain?: string
}) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const salt = crypto.randomUUID()
  const safeDomain = (options.domain || 'unknown').replace(/[^a-z0-9.-]/gi, '_')
  const brandPart = options.brandId ? `brands/${options.brandId}` : 'brands/unknown'
  const scanPart = options.scanId ? `scans/${options.scanId}` : 'scans/manual'
  return `${brandPart}/${scanPart}/${safeDomain}/${timestamp}-${salt}`
}

async function uploadEvidenceFile(params: {
  supabase: any
  bucket: string
  path: string
  body: Buffer | string
  contentType: string
}) : Promise<UploadResult> {
  const sizeBytes = typeof params.body === 'string'
    ? Buffer.byteLength(params.body, 'utf8')
    : params.body.length

  const { data, error } = await params.supabase
    .storage
    .from(params.bucket)
    .upload(params.path, params.body, {
      contentType: params.contentType,
      upsert: false
    })

  if (error || !data) {
    throw new Error(error?.message || 'Failed to upload evidence')
  }

  let publicUrl: string | undefined
  if (process.env.SUPABASE_EVIDENCE_PUBLIC === 'true') {
    const { data: publicData } = params.supabase
      .storage
      .from(params.bucket)
      .getPublicUrl(data.path)
    publicUrl = publicData?.publicUrl
  }

  return {
    storagePath: data.path,
    publicUrl,
    sizeBytes,
    contentType: params.contentType
  }
}

// WHOIS lookup using public APIs
export async function getWhoisData(domain: string): Promise<WhoisData | null> {
  return externalQueue.add(async () => {
    try {
      // Try multiple WHOIS APIs
      const apis = [
        `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_demo&domainName=${domain}&outputFormat=JSON`,
        `https://api.whoapi.com/?domain=${domain}&r=whois&apikey=demo`
      ]

      // Use a free WHOIS lookup approach via DNS
      const response = await fetch(`https://whois.iana.org/${domain}`, {
        headers: {
          'Accept': 'text/plain'
        }
      })

      if (!response.ok) {
        // Fallback: construct basic info from DNS
        return await getBasicWhoisFromDns(domain)
      }

      const text = await response.text()
      return parseWhoisText(text, domain)
    } catch (error) {
      console.error('WHOIS lookup error:', error)
      return await getBasicWhoisFromDns(domain)
    }
  }) as Promise<WhoisData | null>
}

async function getBasicWhoisFromDns(domain: string): Promise<WhoisData | null> {
  try {
    // Get nameservers via DNS
    const nsResponse = await fetch(
      `https://dns.google/resolve?name=${domain}&type=NS`
    )
    const nsData = await nsResponse.json()

    const nameServers = nsData.Answer?.map((a: { data: string }) => a.data) || []

    return {
      domain,
      name_servers: nameServers,
      raw: `DNS lookup only - full WHOIS requires API key`
    }
  } catch {
    return {
      domain,
      raw: 'WHOIS lookup failed'
    }
  }
}

function parseWhoisText(text: string, domain: string): WhoisData {
  const data: WhoisData = { domain, raw: text }

  // Parse common WHOIS fields
  const patterns: Record<string, RegExp> = {
    registrar: /Registrar:\s*(.+)/i,
    creation_date: /Creation Date:\s*(.+)/i,
    expiration_date: /Registry Expiry Date:\s*(.+)/i,
    registrant_name: /Registrant Name:\s*(.+)/i,
    registrant_org: /Registrant Organization:\s*(.+)/i,
    registrant_country: /Registrant Country:\s*(.+)/i,
  }

  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern)
    if (match) {
      (data as unknown as Record<string, string>)[key] = match[1].trim()
    }
  }

  // Parse nameservers
  const nsMatches = text.matchAll(/Name Server:\s*(.+)/gi)
  data.name_servers = Array.from(nsMatches, m => m[1].trim())

  return data
}

// Screenshot capture using a local headless browser (worker environment)
export async function captureScreenshot(url: string): Promise<{
  success: boolean
  imageData?: Buffer
  error?: string
}> {
  return screenshotQueue.add(async () => {
    let browser: any
    try {
      const executablePath =
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        process.env.CHROME_EXECUTABLE_PATH ||
        undefined

      const launchOptions: any = {
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }

      if (executablePath) {
        launchOptions.executablePath = executablePath
      } else if (process.env.PUPPETEER_CHANNEL) {
        launchOptions.channel = process.env.PUPPETEER_CHANNEL
      }

      browser = await puppeteer.launch(launchOptions)
      const page = await browser.newPage()
      await page.setViewport({ width: 1280, height: 800 })
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      )
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

      const screenshot = await page.screenshot({ type: 'png', fullPage: false })
      await browser.close()
      browser = null
      return { success: true, imageData: screenshot as Buffer }
    } catch (error) {
      if (browser) {
        try { await browser.close() } catch {}
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Screenshot capture failed'
      }
    }
  }) as Promise<{ success: boolean; imageData?: Buffer; error?: string }>
}

// Capture HTML content for evidence
export async function captureHtml(url: string): Promise<{
  success: boolean
  html?: string
  error?: string
}> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(10000)
    })

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` }
    }

    const html = await response.text()
    return { success: true, html }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'HTML capture failed'
    }
  }
}

// Collect all evidence for a threat
export async function collectEvidence(options: CollectEvidenceOptions): Promise<Evidence> {
  const { url, brandId, brandName, scanId, supabase, storageBucket } = options
  const timestamp = new Date().toISOString()
  const evidence: Evidence = {
    screenshots: [],
    whois_snapshots: [],
    html_snapshots: [],
    timestamps: [timestamp]
  }

  const bucket = storageBucket || process.env.SUPABASE_EVIDENCE_BUCKET || DEFAULT_EVIDENCE_BUCKET
  const storageEnabled = Boolean(supabase)

  if (storageEnabled) {
    evidence.storage_bucket = bucket
    evidence.storage_provider = 'supabase'
  }

  // Extract domain from URL
  let domain: string
  try {
    const urlObj = new URL(url)
    domain = urlObj.hostname
  } catch {
    return evidence
  }

  const basePath = storageEnabled
    ? buildEvidenceBasePath({ brandId, scanId, domain })
    : null

  // Collect WHOIS data
  const whoisData = await getWhoisData(domain)
  if (whoisData) {
    evidence.whois_snapshots.push({
      data: whoisData,
      captured_at: timestamp
    })
  }

  // Capture HTML
  const htmlResult = await captureHtml(url)
  if (htmlResult.success && htmlResult.html) {
    const htmlSize = Buffer.byteLength(htmlResult.html, 'utf8')
    const truncated = htmlSize > MAX_HTML_BYTES
    const storedHtml = truncated
      ? htmlResult.html.slice(0, MAX_HTML_BYTES)
      : htmlResult.html
    const preview = storedHtml.slice(0, 2000)
    const analysis = analyzePageContent(storedHtml, brandName || domain)
    const htmlSnapshot: HtmlSnapshot = {
      url,
      captured_at: timestamp,
      html_preview: preview,
      truncated: truncated || undefined,
      analysis
    }

    if (storageEnabled && basePath) {
      try {
        const upload = await uploadEvidenceFile({
          supabase,
          bucket,
          path: `${basePath}/page.html`,
          body: storedHtml,
          contentType: 'text/html'
        })
        htmlSnapshot.storage_path = upload.storagePath
        htmlSnapshot.content_type = upload.contentType
        htmlSnapshot.size_bytes = upload.sizeBytes
      } catch (error) {
        htmlSnapshot.html = storedHtml
      }
    } else {
      htmlSnapshot.html = storedHtml
    }

    evidence.html_snapshots.push(htmlSnapshot)
  }

  // Capture screenshot
  if (SCREENSHOT_ENABLED && storageEnabled && basePath) {
    const screenshotResult = await captureScreenshot(url)
    if (screenshotResult.success && screenshotResult.imageData) {
      try {
        const upload = await uploadEvidenceFile({
          supabase,
          bucket,
          path: `${basePath}/screenshot.png`,
          body: screenshotResult.imageData,
          contentType: 'image/png'
        })
        evidence.screenshots.push({
          url,
          captured_at: timestamp,
          storage_path: upload.storagePath,
          public_url: upload.publicUrl,
          content_type: upload.contentType,
          size_bytes: upload.sizeBytes
        })
      } catch (error) {
        // Skip screenshot on upload failure
      }
    }
  }

  return evidence
}

// Analyze page content for additional threat indicators
export function analyzePageContent(html: string, brandName: string): PageAnalysis {
  const htmlLower = html.toLowerCase()
  const brandLower = brandName.toLowerCase()

  const result = {
    hasLoginForm: false,
    hasPaymentForm: false,
    hasBrandMentions: 0,
    suspiciousElements: [] as string[]
  }

  // Check for login forms
  if (htmlLower.includes('type="password"') ||
      htmlLower.includes("type='password'") ||
      htmlLower.includes('input[type=password]')) {
    result.hasLoginForm = true
    result.suspiciousElements.push('Password input field detected')
  }

  // Check for payment forms
  const paymentIndicators = [
    'credit card', 'card number', 'cvv', 'expiry', 'billing',
    'stripe', 'paypal', 'payment'
  ]
  for (const indicator of paymentIndicators) {
    if (htmlLower.includes(indicator)) {
      result.hasPaymentForm = true
      result.suspiciousElements.push(`Payment indicator: ${indicator}`)
      break
    }
  }

  // Count brand mentions
  const brandRegex = new RegExp(brandLower, 'gi')
  const matches = html.match(brandRegex)
  result.hasBrandMentions = matches ? matches.length : 0

  // Check for suspicious meta tags
  if (htmlLower.includes('robots') && htmlLower.includes('noindex')) {
    result.suspiciousElements.push('Page is hidden from search engines (noindex)')
  }

  // Check for data exfiltration indicators
  if (htmlLower.includes('formspree') ||
      htmlLower.includes('getform') ||
      htmlLower.includes('webhook')) {
    result.suspiciousElements.push('Third-party form submission service detected')
  }

  return result
}
