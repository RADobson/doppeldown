/**
 * NRD Scanner - Matches newly registered domains against enterprise brands
 */

import { splitDomainAndTld } from './domain-generator'

export type NrdMatchType = 'exact' | 'keyword' | 'typosquat'

export interface NrdMatch {
  brandId: string
  domain: string
  matchType: NrdMatchType
  matchedKeyword?: string
  similarityScore?: number
}

export interface EnterpriseBrand {
  id: string
  name: string
  domain: string
  keywords: string[]
}

// Minimum similarity score to consider a typosquat match
const TYPOSQUAT_THRESHOLD = 0.75

// Score threshold for auto-creating threats
export const AUTO_THREAT_THRESHOLD = 0.80

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

/**
 * Calculate similarity score (0-1) between two strings
 */
function calculateSimilarity(a: string, b: string): number {
  const maxLength = Math.max(a.length, b.length)
  if (maxLength === 0) return 1
  const distance = levenshteinDistance(a, b)
  return 1 - distance / maxLength
}

/**
 * Extract meaningful parts from a domain for matching
 */
function extractDomainParts(domain: string): { baseName: string; tld: string; full: string } {
  const { baseName, tld } = splitDomainAndTld(domain)
  return {
    baseName: baseName.toLowerCase(),
    tld: tld.toLowerCase(),
    full: domain.toLowerCase()
  }
}

/**
 * Check if a domain matches a brand via exact match, keyword, or typosquat
 */
export function matchDomainToBrand(
  nrdDomain: string,
  brand: EnterpriseBrand
): NrdMatch | null {
  const nrdParts = extractDomainParts(nrdDomain)
  const brandParts = extractDomainParts(brand.domain)

  // 1. Exact match - same base domain name
  if (nrdParts.baseName === brandParts.baseName && nrdParts.tld !== brandParts.tld) {
    return {
      brandId: brand.id,
      domain: nrdDomain,
      matchType: 'exact',
      similarityScore: 1.0
    }
  }

  // 2. Keyword match - domain contains brand name or keywords
  const brandNameLower = brand.name.toLowerCase().replace(/[^a-z0-9]/g, '')
  const allKeywords = [
    brandNameLower,
    brandParts.baseName,
    ...(brand.keywords || []).map(k => k.toLowerCase().replace(/[^a-z0-9]/g, ''))
  ].filter(Boolean)

  for (const keyword of allKeywords) {
    if (keyword.length < 3) continue // Skip very short keywords
    if (nrdParts.baseName.includes(keyword)) {
      return {
        brandId: brand.id,
        domain: nrdDomain,
        matchType: 'keyword',
        matchedKeyword: keyword,
        similarityScore: 0.9 // High score for keyword match
      }
    }
  }

  // 3. Typosquat match - similar to brand domain
  const similarity = calculateSimilarity(nrdParts.baseName, brandParts.baseName)
  if (similarity >= TYPOSQUAT_THRESHOLD && nrdParts.baseName !== brandParts.baseName) {
    return {
      brandId: brand.id,
      domain: nrdDomain,
      matchType: 'typosquat',
      similarityScore: similarity
    }
  }

  // Also check against brand name
  if (brandNameLower.length >= 4) {
    const nameSimilarity = calculateSimilarity(nrdParts.baseName, brandNameLower)
    if (nameSimilarity >= TYPOSQUAT_THRESHOLD && nrdParts.baseName !== brandNameLower) {
      return {
        brandId: brand.id,
        domain: nrdDomain,
        matchType: 'typosquat',
        matchedKeyword: brand.name,
        similarityScore: nameSimilarity
      }
    }
  }

  return null
}

/**
 * Scan a batch of NRD domains against multiple brands
 */
export function scanDomainsAgainstBrands(
  domains: string[],
  brands: EnterpriseBrand[]
): NrdMatch[] {
  const matches: NrdMatch[] = []

  for (const domain of domains) {
    for (const brand of brands) {
      const match = matchDomainToBrand(domain, brand)
      if (match) {
        matches.push(match)
        // A domain can match multiple brands, so continue checking
      }
    }
  }

  return matches
}

/**
 * Build a set of all brand-related terms for quick pre-filtering
 * This allows fast rejection of domains that definitely don't match
 */
export function buildBrandTermsIndex(brands: EnterpriseBrand[]): Set<string> {
  const terms = new Set<string>()

  for (const brand of brands) {
    // Add brand name (normalized)
    const brandName = brand.name.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (brandName.length >= 3) {
      terms.add(brandName)
      // Add substrings of 3+ chars for partial matching
      for (let i = 0; i <= brandName.length - 3; i++) {
        terms.add(brandName.substring(i, i + 3))
      }
    }

    // Add domain base name
    const { baseName } = splitDomainAndTld(brand.domain)
    if (baseName.length >= 3) {
      terms.add(baseName)
      for (let i = 0; i <= baseName.length - 3; i++) {
        terms.add(baseName.substring(i, i + 3))
      }
    }

    // Add keywords
    for (const keyword of brand.keywords || []) {
      const normalized = keyword.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (normalized.length >= 3) {
        terms.add(normalized)
      }
    }
  }

  return terms
}

/**
 * Quick pre-filter to eliminate domains that definitely don't match any brand
 */
export function mightMatchAnyBrand(domain: string, termsIndex: Set<string>): boolean {
  const { baseName } = splitDomainAndTld(domain)
  const lowerName = baseName.toLowerCase()

  // Check if any 3-char substring of the domain is in our terms index
  for (let i = 0; i <= lowerName.length - 3; i++) {
    if (termsIndex.has(lowerName.substring(i, i + 3))) {
      return true
    }
  }

  return false
}
