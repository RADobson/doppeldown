import { Threat, ThreatSeverity, ThreatType } from '../types'
import {
  SearchResult,
  SCAN_CONFIG,
  isSafeDomain,
  fetchWithRetry,
  searchDuckDuckGo,
  searchSerpApi,
} from './scan-utils'

// ============================================================================
// Configuration
// ============================================================================

const MAX_QUERIES_PER_SCAN = parseInt(process.env.SCAN_MAX_QUERIES || '5', 10)
const SERP_API_KEY = process.env.SERPAPI_API_KEY

// ============================================================================
// Search Query Generation
// ============================================================================

/**
 * Generate search queries to find potential brand threats
 */
export function generateSearchQueries(brandName: string, domain: string): string[] {
  const quotedBrand = `"${brandName}"`
  const brandSlug = brandName.toLowerCase().replace(/\s+/g, '')

  return [
    // Direct brand searches (high-value targets)
    `${quotedBrand} login`,
    `${quotedBrand} account`,
    `${quotedBrand} sign in`,
    `${quotedBrand} official`,

    // Scam indicators (exclude legitimate domain)
    `${quotedBrand} -site:${domain} login`,
    `${quotedBrand} giveaway -site:${domain}`,
    `${quotedBrand} free -site:${domain}`,
    `${quotedBrand} support -site:${domain}`,

    // Phishing indicators
    `${quotedBrand} verify account`,
    `${quotedBrand} confirm identity`,
    `${quotedBrand} update payment`,

    // Domain/URL variations
    `inurl:${brandSlug} login -site:${domain}`,
  ]
}

// ============================================================================
// Threat Analysis
// ============================================================================

interface ThreatAnalysis {
  isThreat: boolean
  severity: ThreatSeverity
  type: ThreatType
  reason: string
}

// Keywords indicating potential phishing attempts
const PHISHING_KEYWORDS = [
  'login', 'signin', 'sign-in', 'account', 'verify', 'confirm',
  'secure', 'update', 'suspended', 'locked', 'password', 'credential',
]

// Keywords indicating potential scam attempts
const SCAM_KEYWORDS = [
  'giveaway', 'free', 'winner', 'congratulations', 'claim', 'prize',
  'gift', 'reward', 'bonus', 'limited', 'urgent', 'act now',
]

/**
 * Analyze a URL for threat indicators
 * @returns ThreatAnalysis if threat detected, null otherwise
 */
export function analyzeUrl(
  url: string,
  title: string,
  snippet: string,
  brandName: string,
  legitimateDomain: string
): ThreatAnalysis | null {
  const urlLower = url.toLowerCase()
  const titleLower = title.toLowerCase()
  const snippetLower = snippet.toLowerCase()
  const brandLower = brandName.toLowerCase()
  const brandNoSpaces = brandLower.replace(/\s/g, '')
  const domainLower = legitimateDomain.toLowerCase()

  // Skip legitimate domain
  if (urlLower.includes(domainLower)) {
    return null
  }

  // Skip known safe domains
  if (isSafeDomain(url)) {
    return null
  }

  let isThreat = false
  let severity: ThreatSeverity = 'low'
  let type: ThreatType = 'brand_impersonation'
  let reason = ''

  // Check if URL contains brand name (potential typosquat/lookalike)
  const urlContainsBrand = urlLower.includes(brandLower) || urlLower.includes(brandNoSpaces)

  if (urlContainsBrand) {
    isThreat = true
    reason = 'URL contains brand name'

    // Check for phishing indicators - escalate severity
    const hasPhishing = PHISHING_KEYWORDS.some(
      (kw) => urlLower.includes(kw) || titleLower.includes(kw)
    )

    if (hasPhishing) {
      severity = 'critical'
      type = 'phishing_page'
      reason = 'Potential phishing page - contains login/account keywords'
    } else {
      severity = 'high'
      type = 'lookalike_website'
    }
  }

  // Check for scam indicators (with brand mention)
  const hasScamKeywords = SCAM_KEYWORDS.some(
    (kw) => titleLower.includes(kw) || snippetLower.includes(kw)
  )

  if (hasScamKeywords && (titleLower.includes(brandLower) || snippetLower.includes(brandLower))) {
    isThreat = true
    if (severity === 'low') severity = 'high'
    type = 'brand_impersonation'
    reason = reason
      ? `${reason}; Contains scam keywords with brand name`
      : 'Contains scam keywords with brand name'
  }

  return isThreat ? { isThreat, severity, type, reason } : null
}

// ============================================================================
// Web Search
// ============================================================================

/**
 * Search the web for potential threats
 * Uses SerpAPI if configured, falls back to DuckDuckGo
 */
export async function searchWeb(query: string): Promise<SearchResult[]> {
  try {
    // Try SerpAPI first if configured
    if (SCAN_CONFIG.webSearchProvider === 'serpapi' && SERP_API_KEY) {
      try {
        return await searchSerpApi(query, SERP_API_KEY, 10)
      } catch (error) {
        console.warn('SerpAPI search failed, falling back:', error)
      }
    }

    // Fall back to DuckDuckGo
    if (SCAN_CONFIG.fallbackEnabled) {
      return await searchDuckDuckGo(query, 10)
    }

    return []
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
}

// ============================================================================
// Main Scanning
// ============================================================================

export interface ScanOptions {
  onProgress?: (delta: number) => void
  maxQueries?: number
}

/**
 * Scan for threats targeting a brand
 */
export async function scanForThreats(
  brandName: string,
  domain: string,
  keywords: string[] = [],
  options: ScanOptions = {}
): Promise<Partial<Threat>[]> {
  const { onProgress, maxQueries = MAX_QUERIES_PER_SCAN } = options
  const threats: Partial<Threat>[] = []
  const seenUrls = new Set<string>()

  // Generate search queries
  const queries = generateSearchQueries(brandName, domain)

  // Add keyword-based queries
  for (const keyword of keywords) {
    queries.push(`"${brandName}" "${keyword}" -site:${domain}`)
  }

  // Execute searches (limited to avoid rate limiting)
  const queriesToRun = queries.slice(0, maxQueries)

  for (let i = 0; i < queriesToRun.length; i++) {
    const query = queriesToRun[i]
    const results = await searchWeb(query)

    for (const result of results) {
      onProgress?.(1)

      if (seenUrls.has(result.url)) continue
      seenUrls.add(result.url)

      const analysis = analyzeUrl(
        result.url,
        result.title,
        result.snippet,
        brandName,
        domain
      )

      if (analysis) {
        threats.push({
          type: analysis.type,
          severity: analysis.severity,
          status: 'new',
          url: result.url,
          title: result.title,
          description: analysis.reason,
          detected_at: new Date().toISOString(),
          evidence: {
            screenshots: [],
            whois_snapshots: [],
            html_snapshots: [],
            timestamps: [new Date().toISOString()],
          },
        })
      }
    }

    // Rate limiting between queries (skip after last)
    if (i < queriesToRun.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, SCAN_CONFIG.rateLimitDelayMs))
    }
  }

  return threats
}

// ============================================================================
// URL Status Checking
// ============================================================================

export interface UrlStatus {
  active: boolean
  statusCode?: number
  redirectUrl?: string
  error?: string
}

/**
 * Check if a URL is currently active/reachable
 */
export async function checkUrlStatus(url: string): Promise<UrlStatus> {
  try {
    const response = await fetchWithRetry(url, {
      method: 'HEAD',
      redirect: 'manual',
    }, 1) // Single retry for URL checks

    const isRedirect = response.status >= 300 && response.status < 400

    return {
      active: response.ok || isRedirect,
      statusCode: response.status,
      redirectUrl: isRedirect ? response.headers.get('location') || undefined : undefined,
    }
  } catch (error) {
    return {
      active: false,
      error: error instanceof Error ? error.message : 'Request failed',
    }
  }
}
