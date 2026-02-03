/**
 * Security utilities for DoppelDown
 * Provides timing-safe comparison and SSRF protection
 */

import { createHash, timingSafeEqual } from 'crypto'

// ============================================================================
// Timing-Safe Token Comparison
// ============================================================================

/**
 * Compare two tokens in constant-time to prevent timing attacks.
 * Uses crypto.timingSafeEqual with normalized buffer lengths.
 * 
 * @param provided - The token provided in the request (e.g., from header)
 * @param expected - The expected token (e.g., from environment variable)
 * @returns boolean - true if tokens match, false otherwise
 */
export function timingSafeCompare(provided: string, expected: string): boolean {
  // Handle edge cases - still perform comparison to avoid leaking info
  if (!provided || !expected) {
    // Perform a dummy comparison to maintain constant-time behavior
    const dummy = createHash('sha256').digest()
    timingSafeEqual(dummy, dummy)
    return false
  }

  // Normalize lengths by hashing both tokens
  // This ensures we compare equal-length buffers without leaking length info
  const providedHash = createHash('sha256').update(provided).digest()
  const expectedHash = createHash('sha256').update(expected).digest()

  try {
    return timingSafeEqual(providedHash, expectedHash)
  } catch {
    // Should never happen with same-length SHA256 hashes, but handle gracefully
    return false
  }
}

/**
 * Extract and validate Bearer token from Authorization header
 * 
 * @param authHeader - The Authorization header value
 * @param expectedToken - The expected token value
 * @returns boolean - true if valid Bearer token matches
 */
export function validateBearerToken(authHeader: string | null, expectedToken: string | undefined): boolean {
  if (!authHeader || !expectedToken) {
    return false
  }

  const prefix = 'Bearer '
  if (!authHeader.startsWith(prefix)) {
    return false
  }

  const providedToken = authHeader.slice(prefix.length)
  return timingSafeCompare(providedToken, expectedToken)
}

// ============================================================================
// SSRF Protection
// ============================================================================

// Dangerous URL patterns that should be blocked
const DANGEROUS_URL_PATTERNS = [
  // Internal metadata services
  /169\.254\.169\.254/,  // AWS, GCP, Azure metadata
  /metadata\.google\.internal/,
  /metadata\.google/,
  /instance-data/,  // AWS
  /169\.254\.170\.2/,  // AWS ECS metadata
  
  // localhost variations
  /^https?:\/\/localhost/i,
  /^https?:\/\/127\./i,
  /^https?:\/\/0\./i,
  /^https?:\/\/\[::1\]/i,
  /^https?:\/\/\[0:/i,
  
  // Private IP ranges (IPv4)
  /^https?:\/\/10\./i,           // 10.0.0.0/8
  /^https?:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\./i,  // 172.16.0.0/12
  /^https?:\/\/192\.168\./i,     // 192.168.0.0/16
  /^https?:\/\/169\.254\./i,     // 169.254.0.0/16 (link-local)
  
  // Common internal hostnames
  /\.internal$/i,
  /\.local$/i,
  /\.localhost$/i,
  /\.corp$/i,
  /\.home$/i,
  
  // Dangerous protocols
  /^file:/i,
  /^ftp:/i,
  /^sftp:/i,
  /^gopher:/i,
  /^dict:/i,
  /^ldap:/i,
  /^tftp:/i,
]

// URL patterns that are explicitly allowed despite matching private ranges
// (for legitimate internal services if needed)
const ALLOWLIST: RegExp[] = []

/**
 * Check if a URL is potentially dangerous (SSRF risk)
 * 
 * @param url - The URL to check
 * @returns object - { isValid: boolean, reason?: string }
 */
export function validateUrlForSsrf(url: string): { isValid: boolean; reason?: string } {
  // Basic URL validation
  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    return { isValid: false, reason: 'Invalid URL format' }
  }

  // Check protocol
  const allowedProtocols = ['http:', 'https:']
  if (!allowedProtocols.includes(parsedUrl.protocol)) {
    return { isValid: false, reason: `Protocol '${parsedUrl.protocol}' is not allowed` }
  }

  // Check against allowlist first (bypasses denylist)
  for (const pattern of ALLOWLIST) {
    if (pattern.test(url)) {
      return { isValid: true }
    }
  }

  // Check against denylist
  for (const pattern of DANGEROUS_URL_PATTERNS) {
    if (pattern.test(url)) {
      return { isValid: false, reason: 'URL matches blocked pattern (SSRF protection)' }
    }
  }

  // Additional check for URL-encoded versions of dangerous IPs
  const decodedUrl = decodeURIComponent(url)
  if (decodedUrl !== url) {
    for (const pattern of DANGEROUS_URL_PATTERNS) {
      if (pattern.test(decodedUrl)) {
        return { isValid: false, reason: 'URL contains encoded blocked pattern (SSRF protection)' }
      }
    }
  }

  // Check for DNS rebinding protection
  // Ensure hostname doesn't look like an IP with port obfuscation
  const hostname = parsedUrl.hostname.toLowerCase()
  
  // Check for IP addresses in decimal/octal/hex format
  if (isDangerousIpFormat(hostname)) {
    return { isValid: false, reason: 'URL uses potentially obfuscated IP address' }
  }

  return { isValid: true }
}

/**
 * Check if a hostname uses alternative IP representations
 * that could bypass simple string-based filters
 */
function isDangerousIpFormat(hostname: string): boolean {
  // Pure decimal IP (e.g., 2130706433 for 127.0.0.1)
  if (/^\d+$/.test(hostname)) {
    return true
  }

  // Hex IP (e.g., 0x7f000001)
  if (/^0x[0-9a-f]+$/i.test(hostname)) {
    return true
  }

  // Octal IP (e.g., 0177.0000.0000.0001)
  if (/^0[0-7]+\./.test(hostname)) {
    return true
  }

  // Mixed format (e.g., 127.0.0.1.xip.io or partial decimal)
  const parts = hostname.split('.')
  if (parts.length >= 4) {
    // Check if all parts are numeric (various IP representations)
    const allNumeric = parts.slice(0, 4).every(part => /^\d+$/.test(part))
    if (allNumeric) {
      // Check if it resolves to private IP ranges
      const firstOctet = parseInt(parts[0], 10)
      const secondOctet = parseInt(parts[1], 10)
      
      if (firstOctet === 10) return true // 10.0.0.0/8
      if (firstOctet === 127) return true // 127.0.0.0/8 (loopback)
      if (firstOctet === 0) return true // 0.0.0.0/8
      if (firstOctet === 169 && secondOctet === 254) return true // Link-local
      if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) return true // 172.16.0.0/12
      if (firstOctet === 192 && secondOctet === 168) return true // 192.168.0.0/16
    }
  }

  return false
}

/**
 * Wrapper for fetch that includes SSRF protection
 * 
 * @param url - URL to fetch
 * @param options - Fetch options
 * @returns Promise<Response>
 * @throws Error if URL is blocked
 */
export async function safeFetch(
  url: string, 
  options?: RequestInit
): Promise<Response> {
  const validation = validateUrlForSsrf(url)
  if (!validation.isValid) {
    throw new Error(`SSRF protection: ${validation.reason}`)
  }

  return fetch(url, options)
}

/**
 * Validate a domain for SSRF protection
 * Used for WHOIS lookups and DNS queries
 * 
 * @param domain - Domain name to validate
 * @returns object - { isValid: boolean, reason?: string }
 */
export function validateDomainForSsrf(domain: string): { isValid: boolean; reason?: string } {
  // Block empty domains
  if (!domain || typeof domain !== 'string') {
    return { isValid: false, reason: 'Domain is required' }
  }

  const trimmedDomain = domain.trim()
  if (!trimmedDomain) {
    return { isValid: false, reason: 'Domain cannot be empty' }
  }

  // Block overly long domains (potential DoS)
  if (trimmedDomain.length > 253) {
    return { isValid: false, reason: 'Domain exceeds maximum length' }
  }

  // Block domains that look like IP addresses (these should use IP validation)
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/
  if (ipv4Pattern.test(trimmedDomain)) {
    return { isValid: false, reason: 'IP addresses not allowed in domain validation' }
  }

  // Block localhost and common variations
  const lowerDomain = trimmedDomain.toLowerCase()
  const blockedDomains = [
    'localhost',
    'localhost.localdomain',
    'ip6-localhost',
    'ip6-loopback',
  ]
  
  if (blockedDomains.includes(lowerDomain)) {
    return { isValid: false, reason: 'Localhost domains are not allowed' }
  }

  // Block internal TLDs
  const blockedTlds = ['.internal', '.local', '.localhost', '.corp', '.home']
  for (const tld of blockedTlds) {
    if (lowerDomain.endsWith(tld)) {
      return { isValid: false, reason: `TLD '${tld}' is not allowed` }
    }
  }

  // Validate domain format (basic check)
  // Allow internationalized domains (punycode) and standard domains
  const validDomainPattern = /^[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9\-]{0,61}[a-z0-9])?)*$/i
  if (!validDomainPattern.test(trimmedDomain)) {
    // Might be punycode (xn--), allow if it starts with that
    if (!lowerDomain.startsWith('xn--')) {
      return { isValid: false, reason: 'Invalid domain format' }
    }
  }

  return { isValid: true }
}