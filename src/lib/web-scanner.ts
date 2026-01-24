import { Threat, ThreatSeverity, ThreatType } from '../types'

interface SearchResult {
  title: string
  url: string
  snippet: string
}

const NETWORK_TIMEOUT_MS = parseInt(process.env.SCAN_NETWORK_TIMEOUT_MS || '4000', 10)
const WEB_SEARCH_PROVIDER = (process.env.WEB_SEARCH_PROVIDER || process.env.SEARCH_PROVIDER || '').toLowerCase()
const WEB_SEARCH_FALLBACK_ENABLED = process.env.WEB_SEARCH_FALLBACK !== 'false'

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

function normalizeSearchResultUrl(rawUrl: string): string | null {
  const cleaned = decodeHtmlEntities(rawUrl.trim())
  if (!cleaned) return null

  try {
    const parsed = new URL(cleaned, 'https://duckduckgo.com')
    const isDuckDuckGoRedirect = parsed.hostname.includes('duckduckgo.com') && parsed.pathname === '/l/'
    const redirectTarget = parsed.searchParams.get('uddg')

    if (isDuckDuckGoRedirect && redirectTarget) {
      return normalizeHttpUrl(decodeURIComponent(redirectTarget))
    }

    return normalizeHttpUrl(parsed.toString())
  } catch {
    return null
  }
}

function normalizeHttpUrl(value: string): string | null {
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
    return parsed.toString()
  } catch {
    return null
  }
}

function stripHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractDuckDuckGoResults(html: string, limit: number): SearchResult[] {
  const results: SearchResult[] = []
  const seen = new Set<string>()

  const pushResult = (rawUrl: string, rawTitle: string, rawSnippet: string) => {
    const normalizedUrl = normalizeSearchResultUrl(rawUrl)
    if (!normalizedUrl || seen.has(normalizedUrl)) return
    seen.add(normalizedUrl)
    results.push({
      url: normalizedUrl,
      title: stripHtml(decodeHtmlEntities(rawTitle || '')),
      snippet: stripHtml(decodeHtmlEntities(rawSnippet || ''))
    })
  }

  const htmlLinkRegex = /<a class="result__a" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g
  let match
  while ((match = htmlLinkRegex.exec(html)) !== null && results.length < limit) {
    const snippetMatch = html
      .slice(match.index)
      .match(/class="result__snippet"[^>]*>([\s\S]*?)<\/(?:a|div|span|p)>/i)
    pushResult(match[1], match[2], snippetMatch?.[1] || '')
  }

  if (results.length >= limit) return results

  const liteLinkRegex = /<a[^>]*class="result-link"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g
  while ((match = liteLinkRegex.exec(html)) !== null && results.length < limit) {
    const snippetMatch = html
      .slice(match.index)
      .match(/class="result-snippet"[^>]*>([\s\S]*?)<\/(?:td|span|div|p)>/i)
    pushResult(match[1], match[2], snippetMatch?.[1] || '')
  }

  return results
}

// Search queries to find potential threats
export function generateSearchQueries(brandName: string, domain: string): string[] {
  const queries = [
    // Direct brand searches
    `"${brandName}" login`,
    `"${brandName}" account`,
    `"${brandName}" sign in`,
    `"${brandName}" official`,

    // Scam indicators
    `"${brandName}" -site:${domain} login`,
    `"${brandName}" giveaway -site:${domain}`,
    `"${brandName}" free -site:${domain}`,
    `"${brandName}" support -site:${domain}`,

    // Phishing indicators
    `"${brandName}" verify account`,
    `"${brandName}" confirm identity`,
    `"${brandName}" update payment`,

    // Domain variations
    `inurl:${brandName.toLowerCase()} login -site:${domain}`,
  ]

  return queries
}

// Analyze a URL for threat indicators
export function analyzeUrl(
  url: string,
  title: string,
  snippet: string,
  brandName: string,
  legitimateDomain: string
): { isThreat: boolean; severity: ThreatSeverity; type: ThreatType; reason: string } | null {
  const urlLower = url.toLowerCase()
  const titleLower = title.toLowerCase()
  const brandLower = brandName.toLowerCase()
  const domainLower = legitimateDomain.toLowerCase()

  // Skip legitimate domain
  if (urlLower.includes(domainLower)) {
    return null
  }

  // Skip known safe domains
  const safeDomains = [
    'google.com', 'bing.com', 'yahoo.com', 'facebook.com', 'twitter.com',
    'linkedin.com', 'instagram.com', 'youtube.com', 'reddit.com', 'wikipedia.org',
    'github.com', 'stackoverflow.com', 'medium.com', 'trustpilot.com',
    'bbb.org', 'glassdoor.com', 'indeed.com', 'crunchbase.com'
  ]

  for (const safe of safeDomains) {
    if (urlLower.includes(safe)) {
      return null
    }
  }

  // Check for phishing indicators
  const phishingKeywords = [
    'login', 'signin', 'sign-in', 'account', 'verify', 'confirm',
    'secure', 'update', 'suspended', 'locked', 'password', 'credential'
  ]

  const scamKeywords = [
    'giveaway', 'free', 'winner', 'congratulations', 'claim', 'prize',
    'gift', 'reward', 'bonus', 'limited', 'urgent', 'act now'
  ]

  let isThreat = false
  let severity: ThreatSeverity = 'low'
  let type: ThreatType = 'brand_impersonation'
  let reason = ''

  // Check if URL contains brand name (potential typosquat)
  if (urlLower.includes(brandLower) || urlLower.includes(brandLower.replace(/\s/g, ''))) {
    isThreat = true
    reason = 'URL contains brand name'

    // Check for phishing indicators
    const hasPhishing = phishingKeywords.some(kw =>
      urlLower.includes(kw) || titleLower.includes(kw)
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

  // Check for scam indicators
  const hasScamKeywords = scamKeywords.some(kw =>
    titleLower.includes(kw) || snippet.toLowerCase().includes(kw)
  )

  if (hasScamKeywords && titleLower.includes(brandLower)) {
    isThreat = true
    severity = 'high'
    type = 'brand_impersonation'
    reason = 'Contains scam keywords with brand name'
  }

  if (!isThreat) {
    return null
  }

  return { isThreat, severity, type, reason }
}

// Search using a simple web search approach
export async function searchWeb(query: string): Promise<SearchResult[]> {
  // Search via SerpAPI when configured; otherwise use DuckDuckGo HTML.
  try {
    const encodedQuery = encodeURIComponent(query)
    const serpApiKey = process.env.SERPAPI_API_KEY
    let results: SearchResult[] = []

    if (WEB_SEARCH_PROVIDER === 'serpapi' && serpApiKey) {
      const params = new URLSearchParams({
        engine: 'google',
        q: query,
        api_key: serpApiKey
      })
      const response = await fetch(
        `https://serpapi.com/search?${params.toString()}`,
        { signal: AbortSignal.timeout(NETWORK_TIMEOUT_MS) }
      )

      if (response.ok) {
        const data = await response.json()
        const organic = Array.isArray(data?.organic_results) ? data.organic_results : []
        results = organic
          .map((item: any) => ({
            url: item?.link,
            title: item?.title || '',
            snippet: item?.snippet || ''
          }))
          .filter((item: SearchResult) => Boolean(item.url))
          .slice(0, 10)
      }
    }

    if (results.length === 0 && WEB_SEARCH_FALLBACK_ENABLED) {
      const response = await fetch(
        `https://html.duckduckgo.com/html/?q=${encodedQuery}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          signal: AbortSignal.timeout(NETWORK_TIMEOUT_MS)
        }
      )

      if (response.ok) {
        const html = await response.text()
        results = extractDuckDuckGoResults(html, 10)
      }
    }

    if (results.length === 0 && WEB_SEARCH_FALLBACK_ENABLED) {
      const liteResponse = await fetch(
        `https://lite.duckduckgo.com/lite/?q=${encodedQuery}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          signal: AbortSignal.timeout(NETWORK_TIMEOUT_MS)
        }
      )

      if (liteResponse.ok) {
        const liteHtml = await liteResponse.text()
        results = extractDuckDuckGoResults(liteHtml, 10)
      }
    }

    return results
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
}

// Main scanning function
export async function scanForThreats(
  brandName: string,
  domain: string,
  keywords: string[] = [],
  options?: { onProgress?: (delta: number) => void }
): Promise<Partial<Threat>[]> {
  const threats: Partial<Threat>[] = []
  const seenUrls = new Set<string>()

  // Generate search queries
  const queries = generateSearchQueries(brandName, domain)

  // Add keyword-based queries
  for (const keyword of keywords) {
    queries.push(`"${brandName}" "${keyword}" -site:${domain}`)
  }

  // Execute searches (limited to avoid rate limiting)
  for (const query of queries.slice(0, 5)) {
    const results = await searchWeb(query)

    for (const result of results) {
      options?.onProgress?.(1)
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
            timestamps: [new Date().toISOString()]
          }
        })
      }
    }

    // Rate limiting between queries
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return threats
}

// Check if a URL is currently active/reachable
export async function checkUrlStatus(url: string): Promise<{
  active: boolean
  statusCode?: number
  redirectUrl?: string
}> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'manual',
      signal: AbortSignal.timeout(5000)
    })

    return {
      active: response.ok || response.status === 301 || response.status === 302,
      statusCode: response.status,
      redirectUrl: response.headers.get('location') || undefined
    }
  } catch {
    return { active: false }
  }
}
