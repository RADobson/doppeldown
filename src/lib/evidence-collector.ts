import { WhoisData, Evidence, HtmlSnapshot, PageAnalysis } from '../types'
import puppeteer from 'puppeteer-core'
import * as crypto from 'crypto'
import { screenshotQueue, externalQueue } from './scan-queue'
import { EVIDENCE_CONFIG, SCAN_CONFIG } from './constants'

/**
 * Options for collecting evidence
 */
type CollectEvidenceOptions = {
  url: string
  brandId?: string
  brandName?: string
  scanId?: string
  supabase?: unknown
  storageBucket?: string
  includeScreenshot?: boolean
  includeWhois?: boolean
  includeHtml?: boolean
}

/**
 * Result of an evidence file upload
 */
type UploadResult = {
  storagePath: string
  publicUrl?: string
  sizeBytes: number
  contentType: string
  hash: string
}

/**
 * Custom error class for evidence collection failures
 */
class EvidenceCollectionError extends Error {
  constructor(
    message: string,
    public readonly stage: string,
    public readonly cause?: Error
  ) {
    super(message)
    this.name = 'EvidenceCollectionError'
  }
}

/**
 * Calculate hash of content for integrity verification
 */
function calculateHash(data: Buffer | string): string {
  const hasher = crypto.createHash('sha256')
  hasher.update(data)
  return hasher.digest('hex').slice(0, 16)
}

/**
 * Build the base storage path for evidence files
 * Creates a structured path: brands/{brandId}/scans/{scanId}/{domain}/{timestamp}-{uuid}
 * 
 * @param options - Options containing brandId, scanId, and domain
 * @returns Structured path string
 */
function buildEvidenceBasePath(options: {
  brandId?: string
  scanId?: string
  domain?: string
}): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const salt = crypto.randomUUID().slice(0, 8)
  const safeDomain = (options.domain || 'unknown').replace(/[^a-z0-9.-]/gi, '_').toLowerCase()
  const brandPart = options.brandId ? `brands/${options.brandId}` : 'brands/unknown'
  const scanPart = options.scanId ? `scans/${options.scanId}` : 'scans/manual'
  return `${brandPart}/${scanPart}/${safeDomain}/${timestamp}-${salt}`
}

/**
 * Upload an evidence file to storage with retry logic
 * 
 * @param params - Upload parameters
 * @returns Upload result with path and metadata
 * @throws Error if upload fails
 */
async function uploadEvidenceFile(params: {
  supabase: unknown
  bucket: string
  path: string
  body: Buffer | string
  contentType: string
  maxRetries?: number
}): Promise<UploadResult> {
  const { supabase, bucket, path, body, contentType, maxRetries = 2 } = params
  const sizeBytes = Buffer.byteLength(body)
  const hash = calculateHash(body)
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabaseClient = supabase as any
  let lastError: Error | undefined
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const { data, error } = await supabaseClient
        .storage
        .from(bucket)
        .upload(path, body, {
          contentType,
          upsert: false,
          cacheControl: '3600'
        })

      if (error || !data) {
        throw new Error(error?.message || 'Upload returned no data')
      }

      let publicUrl: string | undefined
      if (EVIDENCE_CONFIG.PUBLIC_BUCKET) {
        const { data: publicData } = supabaseClient
          .storage
          .from(bucket)
          .getPublicUrl(data.path)
        publicUrl = publicData?.publicUrl
      }

      return {
        storagePath: data.path,
        publicUrl,
        sizeBytes,
        contentType,
        hash
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      if (attempt < maxRetries) {
        const delay = 500 * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw new EvidenceCollectionError(
    `Failed to upload after ${maxRetries + 1} attempts: ${lastError?.message}`,
    'upload',
    lastError
  )
}

/**
 * Fetch with timeout and automatic retry logic
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  timeout: number,
  maxRetries: number = 1
): Promise<Response> {
  let lastError: Error | undefined
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`)
      }
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempt)))
      }
    }
  }
  
  throw lastError || new Error(`Request failed after ${maxRetries + 1} attempts`)
}

/**
 * Get basic WHOIS information from DNS records
 * Used as fallback when WHOIS APIs fail
 * 
 * @param domain - Domain to lookup
 * @returns WHOIS data object
 */
async function getBasicWhoisFromDns(domain: string): Promise<WhoisData | null> {
  const nameServers: string[] = []
  const errors: string[] = []

  // Try Google DNS
  try {
    const nsResponse = await fetchWithRetry(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=NS`,
      {},
      SCAN_CONFIG.NETWORK_TIMEOUT_MS,
      1
    )
    
    if (nsResponse.ok) {
      const nsData = await nsResponse.json()
      if (nsData.Answer) {
        nameServers.push(...nsData.Answer.map((a: { data: string }) => a.data.toLowerCase()))
      }
    }
  } catch (error) {
    errors.push(`Google DNS: ${error instanceof Error ? error.message : 'failed'}`)
  }

  // Fallback to Cloudflare DNS
  if (nameServers.length === 0) {
    try {
      const cfResponse = await fetchWithRetry(
        `https://1.1.1.1/dns-query?name=${encodeURIComponent(domain)}&type=NS`,
        { headers: { 'Accept': 'application/dns-json' } },
        SCAN_CONFIG.NETWORK_TIMEOUT_MS,
        1
      )
      
      if (cfResponse.ok) {
        const cfData = await cfResponse.json()
        if (cfData.Answer) {
          nameServers.push(...cfData.Answer.map((a: { data: string }) => a.data.toLowerCase()))
        }
      }
    } catch (error) {
      errors.push(`Cloudflare DNS: ${error instanceof Error ? error.message : 'failed'}`)
    }
  }

  return {
    domain,
    name_servers: Array.from(new Set(nameServers)),
    raw: `DNS lookup only - full WHOIS unavailable. ${errors.length > 0 ? `Errors: ${errors.join(', ')}` : ''}`,
    retrieved_at: new Date().toISOString()
  }
}

/**
 * Parse raw WHOIS text into structured data
 * 
 * @param text - Raw WHOIS response text
 * @param domain - Domain name
 * @returns Structured WHOIS data
 */
function parseWhoisText(text: string, domain: string): WhoisData {
  const data: WhoisData = { 
    domain, 
    raw: text,
    retrieved_at: new Date().toISOString()
  }

  // Parse common WHOIS fields
  const patterns: Record<string, RegExp> = {
    registrar: /Registrar:\s*(.+)/i,
    creation_date: /Creation Date:\s*(.+)/i,
    expiration_date: /Registry Expiry Date:\s*(.+)|Expiration Date:\s*(.+)/i,
    updated_date: /Updated Date:\s*(.+)/i,
    registrant_name: /Registrant Name:\s*(.+)/i,
    registrant_org: /Registrant Organization:\s*(.+)/i,
    registrant_country: /Registrant Country:\s*(.+)/i,
    registrar_iana_id: /Registrar IANA ID:\s*(\d+)/i
  }

  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern)
    if (match) {
      const value = match[1] || match[2]
      if (value) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data as any)[key] = value.trim()
      }
    }
  }

  // Parse nameservers
  const nsMatches = text.matchAll(/Name Server:\s*(.+)/gi)
  const nameServers = Array.from(nsMatches, m => m[1].trim().toLowerCase())
  if (nameServers.length > 0) {
    data.name_servers = Array.from(new Set(nameServers))
  }

  // Parse statuses
  const statusMatches = text.matchAll(/Domain Status:\s*(.+)/gi)
  const statuses = Array.from(statusMatches, m => m[1].trim())
  if (statuses.length > 0) {
    data.statuses = statuses
  }

  return data
}

/**
 * Parse RDAP (Registration Data Access Protocol) response
 */
function parseRdapData(data: unknown, domain: string): WhoisData {
  const rdap = data as Record<string, unknown>
  const result: WhoisData = {
    domain,
    raw: JSON.stringify(data),
    retrieved_at: new Date().toISOString()
  }

  const events = rdap.events as Array<{ eventAction: string; eventDate: string }> | undefined
  if (events) {
    for (const event of events) {
      if (event.eventAction === 'registration') {
        result.creation_date = event.eventDate
      } else if (event.eventAction === 'expiration') {
        result.expiration_date = event.eventDate
      } else if (event.eventAction === 'last update') {
        result.updated_date = event.eventDate
      }
    }
  }

  const entities = rdap.entities as Array<{ 
    roles?: string[]
    vcardArray?: [string, Array<[string, object, string, string]>] 
  }> | undefined
  
  if (entities) {
    for (const entity of entities) {
      if (entity.roles?.includes('registrar')) {
        const vcard = entity.vcardArray?.[1]
        const fnEntry = vcard?.find(v => v[0] === 'fn')
        if (fnEntry) {
          result.registrar = fnEntry[3]
        }
      }
    }
  }

  const nameservers = rdap.nameservers as Array<{ ldhName?: string }> | undefined
  if (nameservers) {
    result.name_servers = nameservers
      .map(ns => ns.ldhName?.toLowerCase())
      .filter((ns): ns is string => Boolean(ns))
  }

  const status = rdap.status as string[] | undefined
  if (status) {
    result.statuses = status
  }

  return result
}

/**
 * Perform WHOIS lookup using multiple fallback sources
 * 
 * @param domain - Domain to lookup
 * @returns WHOIS data or null if lookup fails
 */
export async function getWhoisData(domain: string): Promise<WhoisData | null> {
  return externalQueue.add(async () => {
    const errors: string[] = []
    
    // Try IANA WHOIS first
    try {
      const response = await fetchWithRetry(
        `https://whois.iana.org/${encodeURIComponent(domain)}`,
        {
          headers: {
            'Accept': 'text/plain',
            'User-Agent': 'Mozilla/5.0'
          }
        },
        SCAN_CONFIG.WHOIS_TIMEOUT_MS,
        1
      )

      if (response.ok) {
        const text = await response.text()
        return parseWhoisText(text, domain)
      }
    } catch (error) {
      errors.push(`IANA: ${error instanceof Error ? error.message : 'failed'}`)
    }

    // Fallback to RDAP
    try {
      const rdapResponse = await fetchWithRetry(
        `https://root.rdap.org/domain/${encodeURIComponent(domain)}`,
        { headers: { 'Accept': 'application/json' } },
        SCAN_CONFIG.WHOIS_TIMEOUT_MS,
        1
      )
      
      if (rdapResponse.ok) {
        const data = await rdapResponse.json()
        return parseRdapData(data, domain)
      }
    } catch (error) {
      errors.push(`RDAP: ${error instanceof Error ? error.message : 'failed'}`)
    }

    // Final fallback to DNS
    try {
      return await getBasicWhoisFromDns(domain)
    } catch (error) {
      errors.push(`DNS: ${error instanceof Error ? error.message : 'failed'}`)
    }

    console.warn(`All WHOIS lookups failed for ${domain}:`, errors.join('; '))
    return {
      domain,
      raw: `WHOIS lookup failed. Attempted: ${errors.join(', ')}`
    }
  }) as Promise<WhoisData | null>
}

/**
 * Capture a screenshot of a webpage using Puppeteer
 * 
 * @param url - URL to screenshot
 * @returns Screenshot result with image data or error
 */
export async function captureScreenshot(url: string): Promise<{
  success: boolean
  imageData?: Buffer
  error?: string
  metadata?: {
    width: number
    height: number
    captureTime: number
  }
}> {
  if (!EVIDENCE_CONFIG.SCREENSHOTS_ENABLED) {
    return { success: false, error: 'Screenshots disabled' }
  }

  return screenshotQueue.add(async () => {
    let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null
    const startTime = Date.now()
    
    try {
      const executablePath =
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        process.env.CHROME_EXECUTABLE_PATH ||
        undefined

      // Build launch options dynamically to satisfy Puppeteer's types
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const launchOptions: any = {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1280,800'
        ]
      }

      if (executablePath) {
        launchOptions.executablePath = executablePath
      } else if (process.env.PUPPETEER_CHANNEL) {
        launchOptions.channel = process.env.PUPPETEER_CHANNEL
      }

      browser = await puppeteer.launch(launchOptions)
      const page = await browser.newPage()
      await page.setViewport({ 
        width: SCAN_CONFIG.VIEWPORT_WIDTH, 
        height: SCAN_CONFIG.VIEWPORT_HEIGHT,
        deviceScaleFactor: 1
      })
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.0.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      )

      // Block unnecessary resources to speed up loading
      await page.setRequestInterception(true)
      page.on('request', (req) => {
        const resourceType = req.resourceType()
        if (['image', 'font', 'media'].includes(resourceType)) {
          req.abort()
        } else {
          req.continue()
        }
      })

      await page.goto(url, { 
        waitUntil: 'networkidle2', 
        timeout: SCAN_CONFIG.SCREENSHOT_TIMEOUT_MS 
      })

      const screenshot = await page.screenshot({ 
        type: 'png', 
        fullPage: false,
        encoding: 'binary'
      }) as Buffer

      const captureTime = Date.now() - startTime

      return { 
        success: true, 
        imageData: screenshot,
        metadata: {
          width: SCAN_CONFIG.VIEWPORT_WIDTH,
          height: SCAN_CONFIG.VIEWPORT_HEIGHT,
          captureTime
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Screenshot capture failed'
      }
    } finally {
      if (browser) {
        try { 
          await browser.close() 
        } catch (closeError) {
          console.warn('Error closing browser:', closeError)
        }
      }
    }
  }) as Promise<{
    success: boolean
    imageData?: Buffer
    error?: string
    metadata?: { width: number; height: number; captureTime: number }
  }>
}

/**
 * Capture HTML content from a URL with size limits
 * 
 * @param url - URL to fetch
 * @returns HTML capture result
 */
export async function captureHtml(url: string): Promise<{
  success: boolean
  html?: string
  truncated?: boolean
  originalSize?: number
  error?: string
}> {
  try {
    const response = await fetchWithRetry(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      },
      SCAN_CONFIG.NETWORK_TIMEOUT_MS,
      1
    )

    if (!response.ok) {
      return { 
        success: false, 
        error: `HTTP ${response.status}: ${response.statusText}` 
      }
    }

    const html = await response.text()
    const originalSize = Buffer.byteLength(html, 'utf8')
    const truncated = originalSize > EVIDENCE_CONFIG.MAX_HTML_BYTES
    const storedHtml = truncated 
      ? html.slice(0, EVIDENCE_CONFIG.MAX_HTML_BYTES)
      : html

    return { 
      success: true, 
      html: storedHtml,
      truncated,
      originalSize
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'HTML capture failed'
    }
  }
}

/**
 * Escape special regex characters
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Analyze page content for threat indicators with risk scoring
 * 
 * @param html - HTML content to analyze
 * @param brandName - Brand name to check for
 * @returns Page analysis result
 */
export function analyzePageContent(html: string, brandName: string): PageAnalysis {
  if (!html || !brandName) {
    return {
      hasLoginForm: false,
      hasPaymentForm: false,
      hasBrandMentions: 0,
      suspiciousElements: [],
      riskScore: 0
    }
  }

  const htmlLower = html.toLowerCase()
  const brandLower = brandName.toLowerCase().trim()
  const suspiciousElements: string[] = []
  let riskScore = 0

  // Check for login forms
  const loginPatterns = [
    /type\s*=\s*["']password["']/i,
    /input\s+[^>]*type\s*=\s*password/i,
    /<form[^>]*>[^]*?password/i,
    /name\s*=\s*["']password["']/i
  ]
  
  const hasLoginForm = loginPatterns.some(pattern => pattern.test(html))
  if (hasLoginForm) {
    suspiciousElements.push('Password input field detected')
    riskScore += 20
  }

  // Check for payment forms
  const paymentIndicators = [
    'credit card', 'card number', 'cvv', 'cvc', 'expiry', 'expiration',
    'billing', 'payment', 'stripe', 'paypal', 'checkout'
  ]
  
  let hasPaymentForm = false
  for (const indicator of paymentIndicators) {
    if (htmlLower.includes(indicator)) {
      hasPaymentForm = true
      suspiciousElements.push(`Payment indicator: ${indicator}`)
      riskScore += 25
      break
    }
  }

  // Count brand mentions
  const brandRegex = new RegExp(`\\b${escapeRegex(brandLower)}\\b`, 'gi')
  const brandMatches = html.match(brandRegex)
  const hasBrandMentions = brandMatches ? brandMatches.length : 0
  
  if (hasBrandMentions > 5) {
    riskScore += Math.min(hasBrandMentions, 20)
  }

  // Check for suspicious meta tags
  if (/<meta[^>]*robots[^>]*noindex/i.test(htmlLower)) {
    suspiciousElements.push('Page hidden from search engines (noindex)')
    riskScore += 15
  }

  // Check for data exfiltration services
  const exfilServices = ['formspree', 'getform', 'webhook.site', 'requestbin']
  for (const service of exfilServices) {
    if (htmlLower.includes(service)) {
      suspiciousElements.push(`Third-party form service: ${service}`)
      riskScore += 20
    }
  }

  // Check for suspicious scripts
  const suspiciousPatterns = [
    { pattern: /eval\s*\(/gi, desc: 'Dynamic code execution (eval)' },
    { pattern: /document\.write\s*\(/gi, desc: 'Dynamic content injection' },
    { pattern: /atob\s*\(/gi, desc: 'Base64 decoding detected' },
    { pattern: /fromCharCode/gi, desc: 'String obfuscation technique' }
  ]
  
  for (const { pattern, desc } of suspiciousPatterns) {
    if (pattern.test(html)) {
      suspiciousElements.push(desc)
      riskScore += 15
    }
  }

  // External form actions
  const externalFormPattern = /<form[^>]*action\s*=\s*["']https?:\/\//gi
  const externalForms = html.match(externalFormPattern)
  if (externalForms && externalForms.length > 0) {
    suspiciousElements.push(`External form action detected (${externalForms.length})`)
    riskScore += 20
  }

  return {
    hasLoginForm,
    hasPaymentForm,
    hasBrandMentions,
    suspiciousElements: suspiciousElements.slice(0, 10),
    riskScore: Math.min(riskScore, 100)
  }
}

/**
 * Collect all evidence for a threat with improved error handling
 * Captures screenshots, WHOIS data, and HTML content
 * 
 * @param options - Evidence collection options
 * @returns Collected evidence object
 */
export async function collectEvidence(options: CollectEvidenceOptions): Promise<Evidence> {
  const { 
    url, 
    brandId, 
    brandName, 
    scanId, 
    supabase, 
    storageBucket,
    includeScreenshot = true,
    includeWhois = true,
    includeHtml = true
  } = options
  
  const timestamp = new Date().toISOString()
  const evidence: Evidence = {
    screenshots: [],
    whois_snapshots: [],
    html_snapshots: [],
    timestamps: [timestamp],
    collected_at: timestamp
  }

  const bucket = storageBucket || EVIDENCE_CONFIG.DEFAULT_BUCKET
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
    evidence.collection_errors = ['Invalid URL provided']
    return evidence
  }

  const basePath = storageEnabled
    ? buildEvidenceBasePath({ brandId, scanId, domain })
    : null

  const errors: string[] = []

  // Collect WHOIS data
  if (includeWhois) {
    try {
      const whoisData = await getWhoisData(domain)
      if (whoisData) {
        evidence.whois_snapshots.push({
          data: whoisData,
          captured_at: timestamp
        })
      }
    } catch (error) {
      errors.push(`WHOIS: ${error instanceof Error ? error.message : 'failed'}`)
    }
  }

  // Capture HTML
  if (includeHtml) {
    try {
      const htmlResult = await captureHtml(url)
      
      if (htmlResult.success && htmlResult.html) {
        const preview = htmlResult.html.slice(0, 2000)
        const analysis = analyzePageContent(htmlResult.html, brandName || domain)
        
        const htmlSnapshot: HtmlSnapshot = {
          url,
          captured_at: timestamp,
          html_preview: preview,
          truncated: htmlResult.truncated,
          original_size: htmlResult.originalSize,
          analysis
        }

        if (storageEnabled && basePath) {
          try {
            const upload = await uploadEvidenceFile({
              supabase,
              bucket,
              path: `${basePath}/page.html`,
              body: htmlResult.html,
              contentType: 'text/html'
            })
            htmlSnapshot.storage_path = upload.storagePath
            htmlSnapshot.content_type = upload.contentType
            htmlSnapshot.size_bytes = upload.sizeBytes
            htmlSnapshot.content_hash = upload.hash
          } catch {
            // Store inline if upload fails
            htmlSnapshot.html = htmlResult.html.slice(0, 50000)
          }
        } else {
          htmlSnapshot.html = htmlResult.html.slice(0, 50000)
        }

        evidence.html_snapshots.push(htmlSnapshot)
      } else if (htmlResult.error) {
        errors.push(`HTML capture: ${htmlResult.error}`)
      }
    } catch (error) {
      errors.push(`HTML: ${error instanceof Error ? error.message : 'failed'}`)
    }
  }

  // Capture screenshot
  if (includeScreenshot && EVIDENCE_CONFIG.SCREENSHOTS_ENABLED && storageEnabled && basePath) {
    try {
      const screenshotResult = await captureScreenshot(url)
      
      if (screenshotResult.success && screenshotResult.imageData) {
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
          size_bytes: upload.sizeBytes,
          content_hash: upload.hash,
          metadata: screenshotResult.metadata
        })
      } else if (screenshotResult.error) {
        errors.push(`Screenshot: ${screenshotResult.error}`)
      }
    } catch (error) {
      errors.push(`Screenshot: ${error instanceof Error ? error.message : 'failed'}`)
    }
  }

  // Add any errors to evidence
  if (errors.length > 0) {
    evidence.collection_errors = errors
  }

  return evidence
}

/**
 * Validate evidence collection configuration
 */
export function validateEvidenceConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (EVIDENCE_CONFIG.SCREENSHOTS_ENABLED && !process.env.PUPPETEER_EXECUTABLE_PATH) {
    console.warn('PUPPETEER_EXECUTABLE_PATH not set - will attempt auto-detection')
  }

  if (EVIDENCE_CONFIG.MAX_HTML_BYTES < 1024) {
    errors.push('EVIDENCE_HTML_MAX_BYTES must be at least 1024 bytes')
  }

  if (SCAN_CONFIG.SCREENSHOT_TIMEOUT_MS < 5000) {
    errors.push('SCREENSHOT_TIMEOUT_MS must be at least 5000ms')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}