export interface LogoSearchResult {
  url: string
  title?: string
  source?: string
}

const LOGO_SEARCH_PROVIDER = (process.env.LOGO_SEARCH_PROVIDER || '').toLowerCase()
const LOGO_SEARCH_FALLBACK = (process.env.LOGO_SEARCH_FALLBACK || '').toLowerCase()
const MAX_RESULTS = parseInt(process.env.LOGO_SEARCH_MAX_RESULTS || '15', 10)
const NETWORK_TIMEOUT_MS = parseInt(process.env.LOGO_SEARCH_TIMEOUT_MS || process.env.SCAN_NETWORK_TIMEOUT_MS || '4000', 10)

const normalizeHttpUrl = (value?: string): string | null => {
  if (!value) return null
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
    return parsed.toString()
  } catch {
    return null
  }
}

const dedupeResults = (items: LogoSearchResult[], limit: number) => {
  const seen = new Set<string>()
  const results: LogoSearchResult[] = []
  for (const item of items) {
    const normalized = normalizeHttpUrl(item.url)
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    results.push({ ...item, url: normalized })
    if (results.length >= limit) break
  }
  return results
}

async function fetchWithTimeout(url: string, options: RequestInit = {}) {
  return fetch(url, { ...options, signal: AbortSignal.timeout(NETWORK_TIMEOUT_MS) })
}

async function searchWithGoogleVision(logoUrl: string): Promise<LogoSearchResult[]> {
  const apiKey = process.env.GOOGLE_VISION_API_KEY
  if (!apiKey) return []

  const response = await fetchWithTimeout(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { source: { imageUri: logoUrl } },
            features: [{ type: 'WEB_DETECTION', maxResults: MAX_RESULTS }]
          }
        ]
      })
    }
  )

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    console.error('Google Vision logo search failed:', response.status, errorText)
    return []
  }

  const data = await response.json()
  const webDetection = data?.responses?.[0]?.webDetection
  const pages = Array.isArray(webDetection?.pagesWithMatchingImages)
    ? webDetection.pagesWithMatchingImages
    : []

  const results = pages.map((page: any) => ({
    url: page?.url,
    title: page?.pageTitle,
    source: 'google_vision'
  }))

  return dedupeResults(results, MAX_RESULTS)
}

async function searchWithSerpApi(logoUrl: string): Promise<LogoSearchResult[]> {
  const apiKey = process.env.SERPAPI_API_KEY
  if (!apiKey) return []

  const params = new URLSearchParams({
    engine: 'google_lens',
    url: logoUrl,
    api_key: apiKey
  })

  const response = await fetchWithTimeout(`https://serpapi.com/search?${params.toString()}`)
  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    console.error('SerpAPI logo search failed:', response.status, errorText)
    return []
  }

  const data = await response.json()
  const visualMatches = Array.isArray(data?.visual_matches) ? data.visual_matches : []
  const organicMatches = Array.isArray(data?.organic_results) ? data.organic_results : []

  const results: LogoSearchResult[] = []
  for (const match of visualMatches) {
    results.push({
      url: match?.link || match?.source,
      title: match?.title,
      source: match?.source || 'serpapi'
    })
  }

  for (const match of organicMatches) {
    results.push({
      url: match?.link,
      title: match?.title,
      source: match?.source || 'serpapi'
    })
  }

  return dedupeResults(results, MAX_RESULTS)
}

function resolveProvider(): string | null {
  if (LOGO_SEARCH_PROVIDER) return LOGO_SEARCH_PROVIDER
  if (process.env.GOOGLE_VISION_API_KEY) return 'google_vision'
  if (process.env.SERPAPI_API_KEY) return 'serpapi'
  return null
}

export async function searchLogoUsage(logoUrl: string): Promise<LogoSearchResult[]> {
  const normalizedLogoUrl = normalizeHttpUrl(logoUrl)
  if (!normalizedLogoUrl) return []

  const provider = resolveProvider()
  if (!provider) return []

  try {
    if (provider === 'google_vision') {
      const results = await searchWithGoogleVision(normalizedLogoUrl)
      if (results.length > 0) return results

      const shouldFallback = LOGO_SEARCH_FALLBACK === 'serpapi' || (!LOGO_SEARCH_FALLBACK && Boolean(process.env.SERPAPI_API_KEY))
      if (shouldFallback) {
        console.warn('[logo-search] Google Vision returned 0 results, falling back to SerpAPI Lens')
        return await searchWithSerpApi(normalizedLogoUrl)
      }
      return results
    }
    if (provider === 'serpapi') {
      return await searchWithSerpApi(normalizedLogoUrl)
    }
    console.warn(`Unknown logo search provider: ${provider}`)
    return []
  } catch (error) {
    console.error('Logo search error:', error)
    return []
  }
}
