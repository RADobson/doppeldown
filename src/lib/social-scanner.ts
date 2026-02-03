import { Threat, ThreatSeverity, SocialHandles } from '../types'
import {
  SearchResult,
  SCAN_CONFIG,
  fetchWithRetry,
  searchDuckDuckGo,
  searchSerpApi,
} from './scan-utils'

// ============================================================================
// Configuration
// ============================================================================

const HANDLE_VARIATIONS_LIMIT = parseInt(process.env.SCAN_HANDLE_VARIATIONS_LIMIT || '10', 10)
const SEARCH_RESULTS_LIMIT = parseInt(process.env.SCAN_SOCIAL_RESULTS_LIMIT || '20', 10)
const QUERIES_PER_PLATFORM = parseInt(process.env.SCAN_QUERIES_PER_PLATFORM || '2', 10)
const PLATFORM_DELAY_MS = parseInt(process.env.SCAN_PLATFORM_DELAY_MS || '2000', 10)
const HANDLE_CHECK_DELAY_MS = parseInt(process.env.SCAN_HANDLE_CHECK_DELAY_MS || '500', 10)
const SERP_API_KEY = process.env.SERPAPI_API_KEY

// ============================================================================
// Platform Definitions
// ============================================================================

export interface SocialPlatformConfig {
  name: string
  baseUrl: string
  profilePattern: string
  searchUrl?: string
}

export const SOCIAL_PLATFORMS: Readonly<Record<string, SocialPlatformConfig>> = {
  facebook: {
    name: 'Facebook',
    baseUrl: 'https://www.facebook.com',
    profilePattern: 'https://www.facebook.com/{username}',
    searchUrl: 'https://www.facebook.com/search/pages?q={query}',
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
  },
}

const DEFAULT_PLATFORMS = ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube']

// ============================================================================
// Threat Indicators
// ============================================================================

const SCAM_INDICATORS = [
  'giveaway', 'free', 'winner', 'claim', 'prize', 'airdrop',
  'dm for', 'send dm', 'limited time', 'act now', 'hurry',
  'bitcoin', 'crypto', 'invest', 'profit', 'guaranteed',
]

const IMPERSONATION_INDICATORS = [
  'official', 'real', 'verified', 'support', 'helpdesk', 'customer service',
]

const CHAR_SUBSTITUTIONS: Readonly<Record<string, readonly string[]>> = {
  a: ['4', '@'],
  e: ['3'],
  i: ['1', 'l'],
  l: ['1', 'i'],
  o: ['0'],
  s: ['5', '$'],
  t: ['7'],
}

const HANDLE_AFFIXES = [
  'official', 'real', 'the', 'get', 'try', 'app',
  'hq', 'team', 'support', 'help', 'news',
]

// ============================================================================
// URL Helpers
// ============================================================================

function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, '')
}

function isPlatformUrl(candidate: string, platform: SocialPlatformConfig): boolean {
  try {
    const candidateHost = new URL(candidate).hostname.toLowerCase()
    const platformHost = new URL(platform.baseUrl).hostname.toLowerCase()
    return candidateHost === platformHost || candidateHost.endsWith(`.${platformHost}`)
  } catch {
    return false
  }
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

  let candidate: string | null = null
  if (hasProtocol) {
    candidate = trimmed
  } else if (trimmed.startsWith('www.') || trimmed.includes(platformHost)) {
    candidate = `https://${trimmed.replace(/^https?:\/\//i, '')}`
  }

  if (!candidate) return null

  try {
    const parsed = new URL(candidate)
    const host = normalizeHost(parsed.hostname)
    if (host === platformHost || host.endsWith(`.${platformHost}`)) {
      return parsed
    }
  } catch {
    // Invalid URL
  }
  return null
}

// ============================================================================
// Handle Processing
// ============================================================================

function coerceHandleList(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed ? [trimmed] : []
  }
  return []
}

function extractHandleFromPathSegments(platform: string, segments: string[]): string | null {
  const normalizedSegments = segments
    .map((segment) => segment.replace(/^@/, '').toLowerCase())
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

// ============================================================================
// Official Handles
// ============================================================================

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
  return officialPrefixes.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`)
  )
}

// ============================================================================
// Handle Variation Generation
// ============================================================================

/**
 * Generate variations of social media handles for typosquat detection
 */
export function generateSocialHandleVariations(handle: string): string[] {
  const variations = new Set<string>()
  const cleanHandle = handle.replace(/^@/, '').toLowerCase()

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
  for (let i = 0; i < cleanHandle.length; i++) {
    const char = cleanHandle[i]
    const subs = CHAR_SUBSTITUTIONS[char]
    if (subs) {
      for (const sub of subs) {
        variations.add(cleanHandle.slice(0, i) + sub + cleanHandle.slice(i + 1))
      }
    }
  }

  // Common prefixes/suffixes
  for (const affix of HANDLE_AFFIXES) {
    variations.add(affix + cleanHandle)
    variations.add(cleanHandle + affix)
    variations.add(`${affix}_${cleanHandle}`)
    variations.add(`${cleanHandle}_${affix}`)
    variations.add(`${affix}.${cleanHandle}`)
    variations.add(`${cleanHandle}.${affix}`)
  }

  // Punctuation variations
  variations.add(cleanHandle.replace(/[._]/g, ''))
  variations.add(cleanHandle.replace(/[._]/g, '_'))
  variations.add(cleanHandle.replace(/[._]/g, '.'))

  // Remove the original handle
  variations.delete(cleanHandle)

  return Array.from(variations)
}

// ============================================================================
// Profile Checking
// ============================================================================

export interface ProfileCheckResult {
  exists: boolean
  url: string
  error?: string
}

/**
 * Check if a social media profile exists
 */
export async function checkSocialProfileExists(
  platform: string,
  username: string
): Promise<ProfileCheckResult> {
  const platformConfig = SOCIAL_PLATFORMS[platform]
  if (!platformConfig) {
    return { exists: false, url: '', error: 'Unknown platform' }
  }

  const url = platformConfig.profilePattern.replace('{username}', username)

  try {
    const response = await fetchWithRetry(url, {
      method: 'HEAD',
      redirect: 'manual',
    }, 1)

    // Most platforms: 200 = exists, 404 = not found
    // Some redirect to login for non-existent profiles
    const exists = response.status === 200 || (response.status >= 300 && response.status < 400)

    return { exists, url }
  } catch (error) {
    return {
      exists: false,
      url,
      error: error instanceof Error ? error.message : 'Request failed',
    }
  }
}

// ============================================================================
// Profile Analysis
// ============================================================================

export interface ProfileAnalysis {
  isSuspicious: boolean
  severity: ThreatSeverity
  reasons: string[]
}

/**
 * Analyze if a social profile is likely fake/impersonating
 */
export function analyzeSocialProfile(
  url: string,
  title: string,
  snippet: string,
  brandName: string,
  officialPrefixes: string[]
): ProfileAnalysis {
  const reasons: string[] = []
  let severity: ThreatSeverity = 'low'

  const titleLower = title.toLowerCase()
  const snippetLower = snippet.toLowerCase()
  const urlLower = url.toLowerCase()
  const brandLower = brandName.toLowerCase()
  const brandNoSpaces = brandLower.replace(/\s/g, '')

  if (isOfficialSocialUrl(url, officialPrefixes)) {
    return { isSuspicious: false, severity: 'low', reasons: [] }
  }

  // Check for scam indicators
  for (const indicator of SCAM_INDICATORS) {
    if (titleLower.includes(indicator) || snippetLower.includes(indicator)) {
      reasons.push(`Contains scam indicator: "${indicator}"`)
      severity = 'high'
    }
  }

  // Check for impersonation indicators
  for (const indicator of IMPERSONATION_INDICATORS) {
    if (titleLower.includes(indicator) && titleLower.includes(brandLower)) {
      reasons.push(`Claims to be official: "${indicator}"`)
      if (severity === 'low') severity = 'medium'
    }
  }

  // Check for brand name in profile
  if (titleLower.includes(brandLower) || urlLower.includes(brandNoSpaces)) {
    reasons.push('Contains brand name')
    if (severity === 'low') severity = 'medium'
  }

  // Escalate severity for multiple indicators
  if (reasons.length >= 2 && severity === 'medium') {
    severity = 'high'
  }

  return {
    isSuspicious: reasons.length > 0,
    severity,
    reasons,
  }
}

// ============================================================================
// Social Search
// ============================================================================

/**
 * Search for potential fake accounts on a platform
 */
export async function searchForFakeSocialAccounts(
  brandName: string,
  platform: string
): Promise<SearchResult[]> {
  const platformConfig = SOCIAL_PLATFORMS[platform]
  if (!platformConfig) return []

  const platformDomain = platformConfig.baseUrl.replace('https://', '')
  const searchQueries = [
    `site:${platformDomain} "${brandName}"`,
    `site:${platformDomain} ${brandName} official`,
    `site:${platformDomain} ${brandName} giveaway`,
    `site:${platformDomain} ${brandName} support`,
  ]

  const results: SearchResult[] = []

  for (const query of searchQueries.slice(0, QUERIES_PER_PLATFORM)) {
    try {
      let searchResults: SearchResult[] = []

      // Try SerpAPI first if configured
      if (SCAN_CONFIG.socialSearchProvider === 'serpapi' && SERP_API_KEY) {
        try {
          searchResults = await searchSerpApi(query, SERP_API_KEY, SEARCH_RESULTS_LIMIT)
        } catch (error) {
          console.warn(`SerpAPI search failed for ${platform}:`, error)
        }
      }

      // Fall back to DuckDuckGo
      if (searchResults.length === 0 && SCAN_CONFIG.fallbackEnabled) {
        searchResults = await searchDuckDuckGo(query, SEARCH_RESULTS_LIMIT)
      }

      // Filter to platform URLs only
      for (const result of searchResults) {
        if (!isPlatformUrl(result.url, platformConfig)) continue
        results.push(result)
        if (results.length >= SEARCH_RESULTS_LIMIT) break
      }

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, SCAN_CONFIG.rateLimitDelayMs))
    } catch (error) {
      console.error(`Search error for ${platform}:`, error)
    }
  }

  return results
}

// ============================================================================
// Main Scanning
// ============================================================================

export interface SocialScanOptions {
  onProgress?: (delta: number) => void
}

/**
 * Scan all social platforms for a brand
 */
export async function scanSocialMedia(
  brandName: string,
  officialHandles: SocialHandles,
  platforms: string[] = DEFAULT_PLATFORMS,
  options: SocialScanOptions = {}
): Promise<Partial<Threat>[]> {
  const { onProgress } = options
  const threats: Partial<Threat>[] = []
  const seenUrls = new Set<string>()
  const officialPrefixes = buildOfficialSocialUrlPrefixes(officialHandles || {})

  for (let platformIndex = 0; platformIndex < platforms.length; platformIndex++) {
    const platform = platforms[platformIndex]
    console.log(`Scanning ${platform} for ${brandName}...`)

    // 1. Search for accounts mentioning the brand
    const searchResults = await searchForFakeSocialAccounts(brandName, platform)

    for (const result of searchResults) {
      onProgress?.(1)
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
            timestamps: [new Date().toISOString()],
          },
        })
      }
    }

    // 2. Check for typosquatted handles (if official handle provided)
    const rawHandles = coerceHandleList(officialHandles[platform as keyof SocialHandles])
    for (const rawHandle of rawHandles) {
      const officialHandle = normalizeHandleForPlatform(platform, rawHandle)
      if (!officialHandle) continue

      const handleVariations = generateSocialHandleVariations(officialHandle)

      // Check a subset to avoid rate limiting
      for (const variation of handleVariations.slice(0, HANDLE_VARIATIONS_LIMIT)) {
        onProgress?.(1)
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
              timestamps: [new Date().toISOString()],
            },
          })
        }

        // Rate limiting between checks
        await new Promise((resolve) => setTimeout(resolve, HANDLE_CHECK_DELAY_MS))
      }
    }

    // Rate limiting between platforms (skip after last)
    if (platformIndex < platforms.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, PLATFORM_DELAY_MS))
    }
  }

  return threats
}

// ============================================================================
// Reporting
// ============================================================================

/**
 * Generate a markdown report of social media threats
 */
export function generateSocialMediaReport(brandName: string, threats: Partial<Threat>[]): string {
  const platformCounts: Record<string, number> = {}

  for (const threat of threats) {
    const url = threat.url || ''
    for (const [, platform] of Object.entries(SOCIAL_PLATFORMS)) {
      if (url.includes(platform.baseUrl.replace('https://', ''))) {
        platformCounts[platform.name] = (platformCounts[platform.name] || 0) + 1
        break
      }
    }
  }

  const lines: string[] = [
    `# Social Media Threat Report for ${brandName}`,
    '',
    `**Total suspicious accounts found:** ${threats.length}`,
    '',
    '## By Platform',
    '',
  ]

  for (const [platform, count] of Object.entries(platformCounts)) {
    lines.push(`- ${platform}: ${count} suspicious accounts`)
  }

  lines.push('', '## Detailed Findings', '')

  for (const threat of threats) {
    lines.push(
      `### ${threat.title || 'Unknown'}`,
      `- **URL:** ${threat.url}`,
      `- **Severity:** ${threat.severity}`,
      `- **Description:** ${threat.description}`,
      `- **Detected:** ${threat.detected_at}`,
      ''
    )
  }

  return lines.join('\n')
}
