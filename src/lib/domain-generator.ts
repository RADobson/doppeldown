import { DomainVariation, VariationType, ThreatSeverity } from '../types'

// Homoglyphs - characters that look similar
const HOMOGLYPHS: Record<string, string[]> = {
  'a': ['@', '4', 'а', 'ä', 'à', 'á', 'â', 'ã', 'å', 'ą'],
  'b': ['d', '6', 'ḃ', 'ḅ', 'ƀ'],
  'c': ['ç', 'ć', 'č', 'ĉ', 'с'],
  'd': ['b', 'ḋ', 'ḍ', 'đ'],
  'e': ['3', 'ë', 'è', 'é', 'ê', 'ē', 'ę', 'е'],
  'f': ['ḟ'],
  'g': ['9', 'q', 'ġ', 'ģ', 'ǧ'],
  'h': ['ḣ', 'ḥ', 'ħ', 'н'],
  'i': ['1', 'l', '!', 'ï', 'ì', 'í', 'î', 'ī', 'і'],
  'j': ['ĵ'],
  'k': ['ḳ', 'ķ', 'к'],
  'l': ['1', 'i', '|', 'ḷ', 'ļ', 'ł'],
  'm': ['n', 'rn', 'ṁ', 'ṃ', 'м'],
  'n': ['m', 'ṅ', 'ṇ', 'ñ', 'ń', 'п'],
  'o': ['0', 'ö', 'ò', 'ó', 'ô', 'õ', 'ø', 'о'],
  'p': ['ṗ', 'р'],
  'q': ['9', 'g'],
  'r': ['ṙ', 'ṛ', 'ř', 'г'],
  's': ['5', '$', 'ṡ', 'ṣ', 'ś', 'š', 'ş', 'ѕ'],
  't': ['7', '+', 'ṫ', 'ṭ', 'ţ', 'т'],
  'u': ['ü', 'ù', 'ú', 'û', 'ū', 'µ', 'ц'],
  'v': ['ṿ', 'ν'],
  'w': ['vv', 'ẁ', 'ẃ', 'ŵ', 'ш', 'щ'],
  'x': ['×', 'х'],
  'y': ['ÿ', 'ý', 'ŷ', 'у'],
  'z': ['2', 'ẑ', 'ż', 'ž', 'з'],
}

// Common keyboard proximity typos
const KEYBOARD_PROXIMITY: Record<string, string[]> = {
  'a': ['q', 'w', 's', 'z'],
  'b': ['v', 'g', 'h', 'n'],
  'c': ['x', 'd', 'f', 'v'],
  'd': ['s', 'e', 'r', 'f', 'c', 'x'],
  'e': ['w', 's', 'd', 'r'],
  'f': ['d', 'r', 't', 'g', 'v', 'c'],
  'g': ['f', 't', 'y', 'h', 'b', 'v'],
  'h': ['g', 'y', 'u', 'j', 'n', 'b'],
  'i': ['u', 'j', 'k', 'o'],
  'j': ['h', 'u', 'i', 'k', 'm', 'n'],
  'k': ['j', 'i', 'o', 'l', 'm'],
  'l': ['k', 'o', 'p'],
  'm': ['n', 'j', 'k'],
  'n': ['b', 'h', 'j', 'm'],
  'o': ['i', 'k', 'l', 'p'],
  'p': ['o', 'l'],
  'q': ['w', 'a'],
  'r': ['e', 'd', 'f', 't'],
  's': ['a', 'w', 'e', 'd', 'x', 'z'],
  't': ['r', 'f', 'g', 'y'],
  'u': ['y', 'h', 'j', 'i'],
  'v': ['c', 'f', 'g', 'b'],
  'w': ['q', 'a', 's', 'e'],
  'x': ['z', 's', 'd', 'c'],
  'y': ['t', 'g', 'h', 'u'],
  'z': ['a', 's', 'x'],
}

// Common TLDs for variation
const COMMON_TLDS = [
  'com', 'net', 'org', 'io', 'co', 'app', 'dev', 'xyz', 'info',
  'biz', 'us', 'uk', 'de', 'fr', 'ru', 'cn', 'jp', 'ca', 'au',
  'shop', 'store', 'online', 'site', 'website', 'tech', 'cloud'
]
const NETWORK_TIMEOUT_MS = parseInt(process.env.SCAN_NETWORK_TIMEOUT_MS || '4000', 10)

const MULTI_PART_TLDS = [
  'com.au', 'net.au', 'org.au', 'gov.au', 'edu.au',
  'co.uk', 'org.uk', 'gov.uk', 'ac.uk',
  'co.nz', 'co.jp', 'co.kr', 'co.za',
  'com.br', 'com.mx', 'com.ar', 'com.co',
  'com.sg', 'com.hk', 'com.tr', 'com.tw',
  'com.ph', 'com.my', 'com.id', 'com.vn',
  'com.th', 'com.ua', 'com.pl', 'com.ru',
  'com.sa', 'com.eg', 'com.ng', 'com.pk'
]

export function splitDomainAndTld(domain: string): { baseName: string; tld: string } {
  const cleaned = domain
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
  const parts = cleaned.split('.').filter(Boolean)

  if (parts.length <= 1) {
    return { baseName: cleaned.replace(/[^a-z0-9]/g, ''), tld: 'com' }
  }

  const lastTwo = parts.slice(-2).join('.')
  if (MULTI_PART_TLDS.includes(lastTwo) && parts.length >= 3) {
    const base = parts.slice(0, -2).join('.')
    return { baseName: base.replace(/[^a-z0-9]/g, ''), tld: lastTwo }
  }

  const tld = parts.pop() || 'com'
  const base = parts.join('.')
  return { baseName: base.replace(/[^a-z0-9]/g, ''), tld }
}

export function generateDomainVariations(
  brandName: string,
  originalTld: string = 'com'
): { domain: string; type: VariationType }[] {
  const variations: Map<string, VariationType> = new Map()
  const baseName = brandName.toLowerCase().replace(/[^a-z0-9]/g, '')

  // 1. Missing letter variations
  for (let i = 0; i < baseName.length; i++) {
    const variant = baseName.slice(0, i) + baseName.slice(i + 1)
    if (variant.length >= 2) {
      variations.set(`${variant}.${originalTld}`, 'missing_letter')
    }
  }

  // 2. Double letter variations
  for (let i = 0; i < baseName.length; i++) {
    const variant = baseName.slice(0, i) + baseName[i] + baseName.slice(i)
    variations.set(`${variant}.${originalTld}`, 'double_letter')
  }

  // 3. Added letter variations
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  for (let i = 0; i <= baseName.length; i++) {
    for (const letter of alphabet) {
      const variant = baseName.slice(0, i) + letter + baseName.slice(i)
      if (variant !== baseName) {
        variations.set(`${variant}.${originalTld}`, 'added_letter')
      }
    }
  }

  // 4. Vowel swap variations
  const vowels = ['a', 'e', 'i', 'o', 'u']
  for (let i = 0; i < baseName.length; i++) {
    if (vowels.includes(baseName[i])) {
      for (const vowel of vowels) {
        if (vowel !== baseName[i]) {
          const variant = baseName.slice(0, i) + vowel + baseName.slice(i + 1)
          variations.set(`${variant}.${originalTld}`, 'vowel_swap')
        }
      }
    }
  }

  // 5. Keyboard proximity typos
  for (let i = 0; i < baseName.length; i++) {
    const char = baseName[i]
    const proximates = KEYBOARD_PROXIMITY[char] || []
    for (const proximate of proximates) {
      const variant = baseName.slice(0, i) + proximate + baseName.slice(i + 1)
      variations.set(`${variant}.${originalTld}`, 'keyboard_proximity')
    }
  }

  // 6. Homoglyph variations (limited to most common)
  for (let i = 0; i < baseName.length; i++) {
    const char = baseName[i]
    const homoglyphs = HOMOGLYPHS[char] || []
    // Only use ASCII-safe homoglyphs
    const safeHomoglyphs = homoglyphs.filter(h => /^[a-z0-9@$!+]$/.test(h))
    for (const homoglyph of safeHomoglyphs.slice(0, 3)) {
      const variant = baseName.slice(0, i) + homoglyph + baseName.slice(i + 1)
      variations.set(`${variant}.${originalTld}`, 'homoglyph')
    }
  }

  // 7. Hyphen variations
  for (let i = 1; i < baseName.length; i++) {
    const variant = baseName.slice(0, i) + '-' + baseName.slice(i)
    variations.set(`${variant}.${originalTld}`, 'hyphen')
  }

  // 8. TLD swap variations
  for (const tld of COMMON_TLDS) {
    if (tld !== originalTld) {
      variations.set(`${baseName}.${tld}`, 'tld_swap')
    }
  }

  // 9. Subdomain squatting
  const subdomainPrefixes = ['www', 'login', 'secure', 'account', 'my', 'portal', 'app']
  for (const prefix of subdomainPrefixes) {
    variations.set(`${prefix}${baseName}.${originalTld}`, 'subdomain')
    variations.set(`${baseName}${prefix}.${originalTld}`, 'subdomain')
  }

  // 10. Bitsquatting (single bit flip in ASCII)
  for (let i = 0; i < baseName.length; i++) {
    const charCode = baseName.charCodeAt(i)
    for (let bit = 0; bit < 8; bit++) {
      const flipped = charCode ^ (1 << bit)
      if (flipped >= 97 && flipped <= 122) { // lowercase letters only
        const variant = baseName.slice(0, i) + String.fromCharCode(flipped) + baseName.slice(i + 1)
        if (variant !== baseName) {
          variations.set(`${variant}.${originalTld}`, 'bitsquat')
        }
      }
    }
  }

  // Convert to array and remove original domain
  const originalDomain = `${baseName}.${originalTld}`
  variations.delete(originalDomain)

  return Array.from(variations.entries()).map(([domain, type]) => ({
    domain,
    type
  }))
}

export function assessThreatLevel(
  variationType: VariationType,
  isRegistered: boolean
): ThreatSeverity {
  if (!isRegistered) return 'low'

  // High-risk variation types
  const criticalTypes: VariationType[] = ['homoglyph', 'typo', 'missing_letter']
  const highTypes: VariationType[] = ['keyboard_proximity', 'double_letter', 'bitsquat']
  const mediumTypes: VariationType[] = ['vowel_swap', 'added_letter', 'hyphen', 'subdomain']

  if (criticalTypes.includes(variationType)) return 'critical'
  if (highTypes.includes(variationType)) return 'high'
  if (mediumTypes.includes(variationType)) return 'medium'
  return 'low'
}

async function dnsQuery(domain: string, type: string, provider: 'google' | 'cloudflare') {
  if (provider === 'google') {
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=${type}`, {
      signal: AbortSignal.timeout(NETWORK_TIMEOUT_MS)
    })
    if (!response.ok) return false
    const data = await response.json()
    return data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0
  }

  const response = await fetch(`https://1.1.1.1/dns-query?name=${domain}&type=${type}`, {
    headers: { 'Accept': 'application/dns-json' },
    signal: AbortSignal.timeout(NETWORK_TIMEOUT_MS)
  })
  if (!response.ok) return false
  const data = await response.json()
  return data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0
}

export async function checkDomainRegistration(domain: string): Promise<boolean> {
  const recordTypes = ['A', 'AAAA', 'CNAME', 'NS', 'SOA']

  for (const type of recordTypes) {
    try {
      if (await dnsQuery(domain, type, 'google')) return true
    } catch {
      // continue to fallback
    }
    try {
      if (await dnsQuery(domain, type, 'cloudflare')) return true
    } catch {
      // continue to next type
    }
  }

  return false
}

export function groupVariationsByRisk(
  variations: DomainVariation[]
): Record<ThreatSeverity, DomainVariation[]> {
  return {
    critical: variations.filter(v => v.threat_level === 'critical'),
    high: variations.filter(v => v.threat_level === 'high'),
    medium: variations.filter(v => v.threat_level === 'medium'),
    low: variations.filter(v => v.threat_level === 'low'),
  }
}
