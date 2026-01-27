/**
 * NRD (Newly Registered Domains) Provider abstraction
 * Supports multiple NRD data sources with a common interface
 */

export interface NrdProvider {
  name: string
  fetchDomains(since: Date): AsyncGenerator<string[], void, unknown>
}

/**
 * Open NRD Provider - Stamus Labs free NRD feed
 * URL: https://rules.stamus-networks.io/open/nrd/
 * Updated daily, provides 14-day and 30-day domain lists
 * No API key required
 */
export class OpenNrdProvider implements NrdProvider {
  name = 'open_nrd'

  private readonly baseUrl = 'https://rules.stamus-networks.io/open/nrd'
  private readonly batchSize = 10000

  async *fetchDomains(since: Date): AsyncGenerator<string[], void, unknown> {
    // Open NRD provides feeds by date range
    // Use 14-day feed for recent domains, which is updated daily
    const feedUrl = `${this.baseUrl}/14.txt`

    try {
      const response = await fetch(feedUrl, {
        headers: {
          'User-Agent': 'DoppelDown/1.0 NRD Scanner',
        },
        signal: AbortSignal.timeout(60000), // 60 second timeout
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch NRD feed: ${response.status} ${response.statusText}`)
      }

      const text = await response.text()
      const lines = text.split('\n')

      let batch: string[] = []

      for (const line of lines) {
        const domain = line.trim().toLowerCase()

        // Skip empty lines and comments
        if (!domain || domain.startsWith('#')) continue

        // Basic domain validation
        if (!isValidDomain(domain)) continue

        batch.push(domain)

        // Yield in batches to avoid memory issues
        if (batch.length >= this.batchSize) {
          yield batch
          batch = []
        }
      }

      // Yield remaining domains
      if (batch.length > 0) {
        yield batch
      }
    } catch (error) {
      console.error('Error fetching Open NRD feed:', error)
      throw error
    }
  }
}

/**
 * WhoisXML NRD Provider - Premium NRD feed (future implementation)
 * Requires API key
 */
export class WhoisXmlProvider implements NrdProvider {
  name = 'whoisxml'

  private readonly apiKey: string
  private readonly baseUrl = 'https://newly-registered-domains.whoisxmlapi.com/api/v1'
  private readonly batchSize = 10000

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.WHOISXML_API_KEY || ''
    if (!this.apiKey) {
      throw new Error('WhoisXML API key is required')
    }
  }

  async *fetchDomains(since: Date): AsyncGenerator<string[], void, unknown> {
    // Format date for WhoisXML API (YYYY-MM-DD)
    const sinceDate = since.toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]

    // WhoisXML uses pagination, we'd iterate through pages
    // This is a simplified implementation
    let page = 1
    const perPage = this.batchSize

    while (true) {
      try {
        const params = new URLSearchParams({
          apiKey: this.apiKey,
          sinceDate,
          date: today,
          page: page.toString(),
          perPage: perPage.toString(),
          outputFormat: 'JSON',
        })

        const response = await fetch(`${this.baseUrl}?${params}`, {
          signal: AbortSignal.timeout(60000),
        })

        if (!response.ok) {
          throw new Error(`WhoisXML API error: ${response.status}`)
        }

        const data = await response.json() as {
          domainsList?: string[]
          domainsCount?: number
        }

        if (!data.domainsList || data.domainsList.length === 0) {
          break
        }

        yield data.domainsList.map((d: string) => d.toLowerCase())

        // Check if there are more pages
        if (data.domainsList.length < perPage) {
          break
        }

        page++
      } catch (error) {
        console.error('Error fetching WhoisXML NRD feed:', error)
        throw error
      }
    }
  }
}

/**
 * Get the configured NRD provider
 */
export function getNrdProvider(): NrdProvider {
  const providerName = process.env.NRD_PROVIDER?.toLowerCase() || 'open_nrd'

  switch (providerName) {
    case 'whoisxml':
      return new WhoisXmlProvider()
    case 'open_nrd':
    default:
      return new OpenNrdProvider()
  }
}

/**
 * Basic domain validation
 */
function isValidDomain(domain: string): boolean {
  // Check for reasonable length
  if (domain.length < 4 || domain.length > 253) return false

  // Must have at least one dot
  if (!domain.includes('.')) return false

  // Basic pattern check (alphanumeric, hyphens, dots)
  if (!/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(domain)) return false

  // No consecutive dots or hyphens
  if (/\.\./.test(domain) || /--/.test(domain)) return false

  return true
}
