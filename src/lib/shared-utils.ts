/**
 * Shared utilities for web and social scanning
 * Eliminates code duplication between scanner modules
 */

/**
 * Decode HTML entities in a string
 * @param value - String potentially containing HTML entities
 * @returns Decoded string
 */
export function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

/**
 * Normalize a URL to ensure valid http: or https: protocol
 * @param value - URL string to normalize
 * @returns Normalized URL or null if invalid
 */
export function normalizeHttpUrl(value: string): string | null {
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
    return parsed.toString()
  } catch {
    return null
  }
}

/**
 * Normalize search result URLs, handling DuckDuckGo redirects
 * @param rawUrl - Raw URL from search results
 * @returns Normalized URL or null if invalid
 */
export function normalizeSearchResultUrl(rawUrl: string): string | null {
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

/**
 * Strip HTML tags from a string
 * @param value - HTML string
 * @returns Plain text with HTML removed
 */
export function stripHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Search result interface
 */
export interface SearchResult {
  url: string
  title: string
  snippet: string
}

/**
 * Extract search results from DuckDuckGo HTML response
 * @param html - Raw HTML from DuckDuckGo
 * @param limit - Maximum number of results to return
 * @returns Array of search results
 */
export function extractDuckDuckGoResults(html: string, limit: number): SearchResult[] {
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

  // Try standard HTML format first
  const htmlLinkRegex = /<a class="result__a" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g
  let match: RegExpExecArray | null
  while ((match = htmlLinkRegex.exec(html)) !== null && results.length < limit) {
    const snippetMatch = html
      .slice(match.index)
      .match(/class="result__snippet"[^>]*>([\s\S]*?)<\/(?:a|div|span|p)>/i)
    pushResult(match[1], match[2], snippetMatch?.[1] || '')
  }

  if (results.length >= limit) return results

  // Fallback to lite format
  const liteLinkRegex = /<a[^>]*class="result-link"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g
  while ((match = liteLinkRegex.exec(html)) !== null && results.length < limit) {
    const snippetMatch = html
      .slice(match.index)
      .match(/class="result-snippet"[^>]*>([\s\S]*?)<\/(?:td|span|div|p)>/i)
    pushResult(match[1], match[2], snippetMatch?.[1] || '')
  }

  return results
}

/**
 * Sleep for a specified duration
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Normalize a hostname for comparison
 * @param host - Hostname to normalize
 * @returns Normalized hostname (lowercase, no www prefix)
 */
export function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, '')
}

/**
 * Extract domain from a URL
 * @param url - URL string
 * @returns Domain name or original string if parsing fails
 */
export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

/**
 * Format a date for display
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Format a date with time for display
 * @param date - Date string or Date object
 * @returns Formatted date-time string
 */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

/**
 * Truncate a URL to a maximum length
 * @param url - URL string to truncate
 * @param maxLength - Maximum length (default: 50)
 * @returns Truncated URL with ellipsis if needed
 */
export function truncateUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) return url
  return url.slice(0, maxLength - 3) + '...'
}

/**
 * Coerce a value to a string array, handling various input types
 * @param value - Value to coerce
 * @returns Array of non-empty strings
 */
export function coerceStringArray(value: unknown): string[] {
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

/**
 * Validate and sanitize a URL string
 * @param url - URL to validate
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null
    }
    return parsed.toString()
  } catch {
    return null
  }
}

/**
 * Check if a string is a valid email address
 * @param email - Email to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Check if a string is a valid domain name
 * @param domain - Domain to validate
 * @returns True if valid domain format
 */
export function isValidDomain(domain: string): boolean {
  // Simple domain validation regex
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return domainRegex.test(domain) && domain.length <= 253
}

/**
 * Generate a unique ID
 * @returns Unique string ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Debounce a function
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Retry a function with exponential backoff
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param delayMs - Initial delay in milliseconds
 * @returns Result of the function
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (attempt === maxRetries) {
        break
      }
      
      // Exponential backoff with jitter
      const jitter = Math.random() * 1000
      const delay = delayMs * Math.pow(2, attempt) + jitter
      await sleep(delay)
    }
  }
  
  throw lastError
}

/**
 * Safely parse JSON with a fallback value
 * @param json - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed value or fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

/**
 * Deep clone an object using JSON serialization
 * Note: This method doesn't handle functions, circular references, or special objects
 * @param obj - Object to clone
 * @returns Deep clone of the object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Remove undefined and null values from an object
 * @param obj - Object to clean
 * @returns Object with null/undefined values removed
 */
export function removeEmptyValues<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key as keyof T] = value as T[keyof T]
    }
    return acc
  }, {} as Partial<T>)
}
