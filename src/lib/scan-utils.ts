/**
 * Scan utilities - Web search and domain checking functions
 */

import { SCAN_CONFIG } from './constants'

// Re-export SCAN_CONFIG for backward compatibility
export { SCAN_CONFIG }

export interface SearchResult {
  url: string
  title: string
  description: string
  source: string
}

/**
 * Check if a domain is in the safe list (major legitimate sites)
 */
export function isSafeDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    
    const safeDomains = [
      'google.com',
      'www.google.com',
      'facebook.com',
      'www.facebook.com',
      'twitter.com',
      'x.com',
      'linkedin.com',
      'youtube.com',
      'instagram.com',
      'tiktok.com',
      'apple.com',
      'microsoft.com',
      'amazon.com',
      'wikipedia.org',
      'github.com',
      'gitlab.com',
      'bitbucket.org',
      'stackoverflow.com',
      'reddit.com',
      'medium.com',
      'wordpress.com',
      'wix.com',
      'squarespace.com',
      'shopify.com',
      'godaddy.com',
      'namecheap.com',
      'cloudflare.com',
      'vercel.com',
      'netlify.com',
      'heroku.com',
      'aws.amazon.com',
      'azure.microsoft.com',
      'cloud.google.com',
      'ibm.com',
      'oracle.com',
      'salesforce.com',
      'hubspot.com',
      'mailchimp.com',
      'zendesk.com',
      'slack.com',
      'zoom.us',
      'stripe.com',
      'paypal.com',
      'wise.com',
      'xero.com',
      'myob.com',
      'ato.gov.au',
      'gov.au',
      'gov.uk',
      'gov',
      'edu',
      'ac.uk',
      'edu.au',
      'org',
    ]
    
    // Check exact match or ends with .domain
    return safeDomains.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    )
  } catch {
    return false
  }
}

/**
 * Fetch with retry logic and timeout
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retries = 3
): Promise<Response> {
  let lastError: Error | undefined
  
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30000)
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      
      clearTimeout(timeout)
      
      if (response.ok || response.status === 404) {
        return response
      }
      
      // Retry on server errors
      if (response.status >= 500) {
        throw new Error(`Server error: ${response.status}`)
      }
      
      return response
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      // Wait before retry with exponential backoff
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)))
      }
    }
  }
  
  throw lastError || new Error('Fetch failed after retries')
}

/**
 * Search using DuckDuckGo HTML interface
 * Note: This uses DuckDuckGo's HTML interface which may change
 */
export async function searchDuckDuckGo(
  query: string,
  limit = 10
): Promise<SearchResult[]> {
  try {
    const encodedQuery = encodeURIComponent(query)
    const url = `https://html.duckduckgo.com/html/?q=${encodedQuery}`
    
    const response = await fetchWithRetry(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    const html = await response.text()
    const results: SearchResult[] = []
    
    // Parse DuckDuckGo HTML results
    // Look for result links with class "result__a"
    const linkRegex = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi
    const snippetRegex = /<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>(.*?)<\/a>/gi
    
    let linkMatch
    let snippetMatch
    const links: Array<{url: string, title: string}> = []
    const snippets: string[] = []
    
    // Extract links and titles
    while ((linkMatch = linkRegex.exec(html)) !== null && links.length < limit) {
      const rawUrl = linkMatch[1]
      const title = linkMatch[2].replace(/<[^>]+>/g, '').trim() // Strip HTML tags
      
      // Decode DuckDuckGo redirect URLs
      let finalUrl = rawUrl
      if (rawUrl.startsWith('//duckduckgo.com/l/')) {
        try {
          const urlObj = new URL('https:' + rawUrl)
          finalUrl = urlObj.searchParams.get('uddg') || rawUrl
        } catch {
          finalUrl = rawUrl
        }
      }
      
      links.push({ url: finalUrl, title })
    }
    
    // Extract snippets
    while ((snippetMatch = snippetRegex.exec(html)) !== null && snippets.length < limit) {
      const snippet = snippetMatch[1].replace(/<[^>]+>/g, '').trim()
      snippets.push(snippet)
    }
    
    // Combine into results
    for (let i = 0; i < Math.min(links.length, snippets.length); i++) {
      results.push({
        url: links[i].url,
        title: links[i].title,
        description: snippets[i],
        source: 'duckduckgo'
      })
    }
    
    return results
  } catch (error) {
    console.error('DuckDuckGo search failed:', error)
    return []
  }
}

/**
 * Search using SerpAPI (Google Search API)
 */
export async function searchSerpApi(
  query: string,
  apiKey: string | undefined,
  limit = 10
): Promise<SearchResult[]> {
  if (!apiKey) {
    console.warn('SerpAPI key not configured')
    return []
  }
  
  try {
    const params = new URLSearchParams({
      q: query,
      api_key: apiKey,
      engine: 'google',
      num: Math.min(limit, 10).toString(),
      gl: 'us',
      hl: 'en'
    })
    
    const url = `https://serpapi.com/search?${params.toString()}`
    
    const response = await fetchWithRetry(url)
    const data = await response.json()
    
    const results: SearchResult[] = []
    
    // Parse organic results
    if (data.organic_results && Array.isArray(data.organic_results)) {
      for (const result of data.organic_results.slice(0, limit)) {
        results.push({
          url: result.link || result.url || '',
          title: result.title || '',
          description: result.snippet || result.description || '',
          source: 'serpapi'
        })
      }
    }
    
    return results
  } catch (error) {
    console.error('SerpAPI search failed:', error)
    return []
  }
}
