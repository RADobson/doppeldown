import { Threat, ThreatSeverity, SocialHandles } from '../types'

export interface SocialPlatform {
  name: string
  baseUrl: string
  profilePattern: string
  searchUrl?: string
}

export const SOCIAL_PLATFORMS: Record<string, SocialPlatform> = {
  facebook: {
    name: 'Facebook',
    baseUrl: 'https://www.facebook.com',
    profilePattern: 'https://www.facebook.com/{username}',
    searchUrl: 'https://www.facebook.com/search/pages?q={query}'
  },
  instagram: {
    name: 'Instagram',
    baseUrl: 'https://www.instagram.com',
    profilePattern: 'https://www.instagram.com/{username}',
  },
  twitter: {
    name: 'Twitter/X',
    baseUrl: 'https://twitter.com',
    profilePattern: 'https://twitter.com/{username}',
  },
  linkedin: {
    name: 'LinkedIn',
    baseUrl: 'https://www.linkedin.com',
    profilePattern: 'https://www.linkedin.com/company/{username}',
  },
  tiktok: {
    name: 'TikTok',
    baseUrl: 'https://www.tiktok.com',
    profilePattern: 'https://www.tiktok.com/@{username}',
  },
  youtube: {
    name: 'YouTube',
    baseUrl: 'https://www.youtube.com',
    profilePattern: 'https://www.youtube.com/@{username}',
  },
  telegram: {
    name: 'Telegram',
    baseUrl: 'https://t.me',
    profilePattern: 'https://t.me/{username}',
  },
  discord: {
    name: 'Discord',
    baseUrl: 'https://discord.gg',
    profilePattern: 'https://discord.gg/{username}',
  }
}

const NETWORK_TIMEOUT_MS = parseInt(process.env.SCAN_NETWORK_TIMEOUT_MS || '4000', 10)
const SOCIAL_SEARCH_PROVIDER = (process.env.SOCIAL_SEARCH_PROVIDER || process.env.SEARCH_PROVIDER || '').toLowerCase()
const SOCIAL_SEARCH_FALLBACK_ENABLED = process.env.SOCIAL_SEARCH_FALLBACK !== 'false'

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
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

function stripHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractDuckDuckGoResults(html: string, limit: number): { url: string; title: string; snippet: string }[] {
  const results: { url: string; title: string; snippet: string }[] = []
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

function isPlatformUrl(candidate: string, platform: SocialPlatform): boolean {
  try {
    const candidateHost = new URL(candidate).hostname.toLowerCase()
    const platformHost = new URL(platform.baseUrl).hostname.toLowerCase()
    return candidateHost === platformHost || candidateHost.endsWith(`.${platformHost}`)
  } catch {
    return false
  }
}

const normalizeHost = (host: string) => host.toLowerCase().replace(/^www\./, '')

const coerceHandleList = (value: unknown): string[] => {
  if (!value) return []
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .map(item => item.trim())
      .filter(Boolean)
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed ? [trimmed] : []
  }
  return []
}

function normalizeUrlForComparison(value: string): string | null {
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
    const host = normalizeHost(parsed.hostname)
    const path = parsed.pathname.replace(/\/+$/, '').toLowerCase()
    return `${host}${path}`
  } catch {
    return null
  }
}

function coercePlatformUrl(platform: string, raw: string): URL | null {
  const platformConfig = SOCIAL_PLATFORMS[platform]
  if (!platformConfig) return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  const platformHost = normalizeHost(new URL(platformConfig.baseUrl).hostname)
  const hasProtocol = /^https?:\/\//i.test(trimmed)
  const candidate = hasProtocol ? trimmed : trimmed.startsWith('www.') || trimmed.includes(platformHost)
    ? `https://${trimmed.replace(/^https?:\/\//i, '')}`
    : null
  if (!candidate) return null
  try {
    const parsed = new URL(candidate)
    const host = normalizeHost(parsed.hostname)
    if (host === platformHost || host.endsWith(`.${platformHost}`)) return parsed
  } catch {
    return null
  }
  return null
}

function extractHandleFromPathSegments(platform: string, segments: string[]): string | null {
  const normalizedSegments = segments
    .map(segment => segment.replace(/^@/, '').toLowerCase())
    .filter(Boolean)
  if (normalizedSegments.length === 0) return null

  switch (platform) {
    case 'linkedin': {
      const prefix = normalizedSegments[0]
      if (['company', 'in', 'school'].includes(prefix)) {
        return normalizedSegments[1] || null
      }
      return normalizedSegments[0]
    }
    case 'youtube': {
      const prefix = normalizedSegments[0]
      if (['channel', 'c', 'user'].includes(prefix)) {
        return normalizedSegments[1] || null
      }
      return normalizedSegments[0]
    }
    default:
      return normalizedSegments[0]
  }
}

function normalizeHandleForPlatform(platform: string, raw?: string | null): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  const parsedUrl = coercePlatformUrl(platform, trimmed)
  if (parsedUrl) {
    const segments = parsedUrl.pathname.split('/').filter(Boolean)
    return extractHandleFromPathSegments(platform, segments)
  }

  const cleaned = trimmed.replace(/^@/, '').replace(/^\/+/, '').split(/[?#]/)[0]
  const segments = cleaned.split('/').filter(Boolean)
  if (segments.length === 0) return null
  return extractHandleFromPathSegments(platform, segments)
}

function buildOfficialSocialUrlPrefixes(officialHandles: SocialHandles): string[] {
  const prefixes = new Set<string>()

  for (const [platform, rawValue] of Object.entries(officialHandles)) {
    const platformConfig = SOCIAL_PLATFORMS[platform]
    if (!platformConfig) continue

    const handles = coerceHandleList(rawValue)
    for (const rawHandle of handles) {
      const parsedUrl = coercePlatformUrl(platform, rawHandle)
      if (parsedUrl) {
        const normalized = normalizeUrlForComparison(parsedUrl.toString())
        if (normalized) prefixes.add(normalized)
        const handleFromUrl = extractHandleFromPathSegments(
          platform,
          parsedUrl.pathname.split('/').filter(Boolean)
        )
        if (handleFromUrl) {
          const profileUrl = platformConfig.profilePattern.replace('{username}', handleFromUrl)
          const normalizedProfile = normalizeUrlForComparison(profileUrl)
          if (normalizedProfile) prefixes.add(normalizedProfile)
        }
        continue
      }

      if (rawHandle.includes('/')) {
        const path = rawHandle.replace(/^\/+/, '')
        const profileUrl = `${platformConfig.baseUrl.replace(/\/+$/, '')}/${path}`
        const normalizedProfile = normalizeUrlForComparison(profileUrl)
        if (normalizedProfile) prefixes.add(normalizedProfile)
      }

      const normalizedHandle = normalizeHandleForPlatform(platform, rawHandle)
      if (normalizedHandle) {
        const profileUrl = platformConfig.profilePattern.replace('{username}', normalizedHandle)
        const normalizedProfile = normalizeUrlForComparison(profileUrl)
        if (normalizedProfile) prefixes.add(normalizedProfile)
      }
    }
  }

  return Array.from(prefixes)
}

function isOfficialSocialUrl(url: string, officialPrefixes: string[]): boolean {
  if (officialPrefixes.length === 0) return false
  const normalized = normalizeUrlForComparison(url)
  if (!normalized) return false
  return officialPrefixes.some(prefix =>
    normalized === prefix || normalized.startsWith(`${prefix}/`)
  )
}

// Generate variations of social media handles (like typosquatting for usernames)
export function generateSocialHandleVariations(handle: string): string[] {
  const variations: Set<string> = new Set()
  const cleanHandle = handle.replace(/^@/, '').toLowerCase()

  // Original
  variations.add(cleanHandle)

  // Missing character
  for (let i = 0; i < cleanHandle.length; i++) {
    variations.add(cleanHandle.slice(0, i) + cleanHandle.slice(i + 1))
  }

  // Double character
  for (let i = 0; i < cleanHandle.length; i++) {
    variations.add(cleanHandle.slice(0, i) + cleanHandle[i] + cleanHandle.slice(i))
  }

  // Character substitutions
  const substitutions: Record<string, string[]> = {
    'a': ['4', '@'],
    'e': ['3'],
    'i': ['1', 'l'],
    'l': ['1', 'i'],
    'o': ['0'],
    's': ['5', '$'],
    't': ['7'],
  }

  for (let i = 0; i < cleanHandle.length; i++) {
    const char = cleanHandle[i]
    const subs = substitutions[char]
    if (subs) {
      for (const sub of subs) {
        variations.add(cleanHandle.slice(0, i) + sub + cleanHandle.slice(i + 1))
      }
    }
  }

  // Common prefixes/suffixes
  const affixes = ['official', 'real', 'the', 'get', 'try', 'app', 'hq', 'team', 'support', 'help', 'news']
  for (const affix of affixes) {
    variations.add(affix + cleanHandle)
    variations.add(cleanHandle + affix)
    variations.add(affix + '_' + cleanHandle)
    variations.add(cleanHandle + '_' + affix)
    variations.add(affix + '.' + cleanHandle)
    variations.add(cleanHandle + '.' + affix)
  }

  // Underscores and dots
  variations.add(cleanHandle.replace(/[._]/g, ''))
  variations.add(cleanHandle.replace(/[._]/g, '_'))
  variations.add(cleanHandle.replace(/[._]/g, '.'))

  // Remove the original legitimate handle
  variations.delete(cleanHandle)

  return Array.from(variations)
}

// Check if a social media profile exists
export async function checkSocialProfileExists(
  platform: string,
  username: string
): Promise<{ exists: boolean; url: string; error?: string }> {
  const platformConfig = SOCIAL_PLATFORMS[platform]
  if (!platformConfig) {
    return { exists: false, url: '', error: 'Unknown platform' }
  }

  const url = platformConfig.profilePattern.replace('{username}', username)

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      redirect: 'manual',
      signal: AbortSignal.timeout(5000)
    })

    // Most platforms return 200 for existing profiles, 404 for non-existent
    // Some redirect to login or homepage for non-existent profiles
    const exists = response.status === 200 ||
                   (response.status >= 300 && response.status < 400)

    return { exists, url }
  } catch (error) {
    return {
      exists: false,
      url,
      error: error instanceof Error ? error.message : 'Request failed'
    }
  }
}

// Search for potential fake accounts using web search
export async function searchForFakeSocialAccounts(
  brandName: string,
  platform: string
): Promise<{ url: string; title: string; snippet: string }[]> {
  const platformConfig = SOCIAL_PLATFORMS[platform]
  if (!platformConfig) return []

  const searchQueries = [
    `site:${platformConfig.baseUrl.replace('https://', '')} "${brandName}"`,
    `site:${platformConfig.baseUrl.replace('https://', '')} ${brandName} official`,
    `site:${platformConfig.baseUrl.replace('https://', '')} ${brandName} giveaway`,
    `site:${platformConfig.baseUrl.replace('https://', '')} ${brandName} support`,
  ]

  const results: { url: string; title: string; snippet: string }[] = []

  for (const query of searchQueries.slice(0, 2)) {
    try {
      const serpApiKey = process.env.SERPAPI_API_KEY
      const encodedQuery = encodeURIComponent(query)
      let parsedResults: { url: string; title: string; snippet: string }[] = []
      if (SOCIAL_SEARCH_PROVIDER === 'serpapi' && serpApiKey) {
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
          parsedResults = organic
            .map((item: any) => ({
              url: item?.link,
              title: item?.title || '',
              snippet: item?.snippet || ''
            }))
            .filter((item: { url: string }) => Boolean(item.url))
            .slice(0, 20)
        }
      }

      if (parsedResults.length === 0 && SOCIAL_SEARCH_FALLBACK_ENABLED) {
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
          parsedResults = extractDuckDuckGoResults(html, 20)
        }
      }

      if (parsedResults.length === 0 && SOCIAL_SEARCH_FALLBACK_ENABLED) {
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
          parsedResults = extractDuckDuckGoResults(liteHtml, 20)
        }
      }

      for (const result of parsedResults) {
        if (!isPlatformUrl(result.url, platformConfig)) continue
        results.push(result)
        if (results.length >= 20) break
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Search error for ${platform}:`, error)
    }
  }

  return results
}

// Analyze if a social profile is likely fake/impersonating
export function analyzeSocialProfile(
  url: string,
  title: string,
  snippet: string,
  brandName: string,
  officialPrefixes: string[]
): { isSuspicious: boolean; severity: ThreatSeverity; reasons: string[] } {
  const reasons: string[] = []
  let severity: ThreatSeverity = 'low'

  const titleLower = title.toLowerCase()
  const snippetLower = snippet.toLowerCase()
  const brandLower = brandName.toLowerCase()

  if (isOfficialSocialUrl(url, officialPrefixes)) {
    return { isSuspicious: false, severity: 'low', reasons: [] }
  }

  // Check for scam indicators
  const scamIndicators = [
    'giveaway', 'free', 'winner', 'claim', 'prize', 'airdrop',
    'dm for', 'send dm', 'limited time', 'act now', 'hurry',
    'bitcoin', 'crypto', 'invest', 'profit', 'guaranteed'
  ]

  for (const indicator of scamIndicators) {
    if (titleLower.includes(indicator) || snippetLower.includes(indicator)) {
      reasons.push(`Contains scam indicator: "${indicator}"`)
      severity = 'high'
    }
  }

  // Check for impersonation indicators
  const impersonationIndicators = [
    'official', 'real', 'verified', 'support', 'helpdesk', 'customer service'
  ]

  for (const indicator of impersonationIndicators) {
    if (titleLower.includes(indicator) && titleLower.includes(brandLower)) {
      reasons.push(`Claims to be official: "${indicator}"`)
      if (severity === 'low') severity = 'medium'
    }
  }

  // Check for brand name in profile
  const urlLower = url.toLowerCase()
  if (titleLower.includes(brandLower) || urlLower.includes(brandLower.replace(/\s/g, ''))) {
    reasons.push('Contains brand name')
    if (severity === 'low') severity = 'medium'
  }

  // High severity if multiple indicators
  if (reasons.length >= 2 && severity === 'medium') {
    severity = 'high'
  }

  return {
    isSuspicious: reasons.length > 0,
    severity,
    reasons
  }
}

// Main function to scan all social platforms for a brand
export async function scanSocialMedia(
  brandName: string,
  officialHandles: SocialHandles,
  platforms: string[] = ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube'],
  options?: { onProgress?: (delta: number) => void }
): Promise<Partial<Threat>[]> {
  const threats: Partial<Threat>[] = []
  const seenUrls = new Set<string>()
  const officialPrefixes = buildOfficialSocialUrlPrefixes(officialHandles || {})

  for (const platform of platforms) {
    console.log(`Scanning ${platform} for ${brandName}...`)

    // 1. Search for accounts mentioning the brand
    const searchResults = await searchForFakeSocialAccounts(brandName, platform)

    for (const result of searchResults) {
      options?.onProgress?.(1)
      if (seenUrls.has(result.url)) continue
      if (isOfficialSocialUrl(result.url, officialPrefixes)) continue
      seenUrls.add(result.url)

      const analysis = analyzeSocialProfile(
        result.url,
        result.title,
        result.snippet,
        brandName,
        officialPrefixes
      )

      if (analysis.isSuspicious) {
        threats.push({
          type: 'fake_social_account',
          severity: analysis.severity,
          status: 'new',
          url: result.url,
          title: result.title,
          description: `Potential fake ${SOCIAL_PLATFORMS[platform]?.name || platform} account. ${analysis.reasons.join('. ')}`,
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

    // 2. Check for typosquatted handles (if official handle is provided)
    const rawHandles = coerceHandleList(officialHandles[platform as keyof SocialHandles])
    for (const rawHandle of rawHandles) {
      const officialHandle = normalizeHandleForPlatform(platform, rawHandle)
      if (!officialHandle) continue
      const handleVariations = generateSocialHandleVariations(officialHandle)

      // Check a subset to avoid rate limiting
      for (const variation of handleVariations.slice(0, 10)) {
        options?.onProgress?.(1)
        const { exists, url } = await checkSocialProfileExists(platform, variation)

        if (exists && !seenUrls.has(url)) {
          seenUrls.add(url)
          threats.push({
            type: 'fake_social_account',
            severity: 'high',
            status: 'new',
            url,
            title: `@${variation} on ${SOCIAL_PLATFORMS[platform]?.name || platform}`,
            description: `Typosquatted social media handle similar to official @${officialHandle}`,
            detected_at: new Date().toISOString(),
            evidence: {
              screenshots: [],
              whois_snapshots: [],
              html_snapshots: [],
              timestamps: [new Date().toISOString()]
            }
          })
        }

        // Rate limiting between checks
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    // Rate limiting between platforms
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  return threats
}

// Generate report of social media threats
export function generateSocialMediaReport(
  brandName: string,
  threats: Partial<Threat>[]
): string {
  const platformCounts: Record<string, number> = {}

  for (const threat of threats) {
    const url = threat.url || ''
    for (const [key, platform] of Object.entries(SOCIAL_PLATFORMS)) {
      if (url.includes(platform.baseUrl.replace('https://', ''))) {
        platformCounts[platform.name] = (platformCounts[platform.name] || 0) + 1
        break
      }
    }
  }

  let report = `# Social Media Threat Report for ${brandName}\n\n`
  report += `**Total suspicious accounts found:** ${threats.length}\n\n`
  report += `## By Platform\n\n`

  for (const [platform, count] of Object.entries(platformCounts)) {
    report += `- ${platform}: ${count} suspicious accounts\n`
  }

  report += `\n## Detailed Findings\n\n`

  for (const threat of threats) {
    report += `### ${threat.title || 'Unknown'}\n`
    report += `- **URL:** ${threat.url}\n`
    report += `- **Severity:** ${threat.severity}\n`
    report += `- **Description:** ${threat.description}\n`
    report += `- **Detected:** ${threat.detected_at}\n\n`
  }

  return report
}
