/**
 * Application-wide constants
 * Centralized configuration for timeouts, limits, and magic numbers
 */

// Scanning configuration
export const SCAN_CONFIG = {
  /** Network timeout for external API calls (ms) */
  NETWORK_TIMEOUT_MS: parseInt(process.env.SCAN_NETWORK_TIMEOUT_MS || '4000', 10),
  
  /** Timeout for WHOIS lookups (ms) */
  WHOIS_TIMEOUT_MS: 10000,
  
  /** Timeout for screenshot capture (ms) */
  SCREENSHOT_TIMEOUT_MS: 30000,
  
  /** Timeout for URL status checks (ms) */
  URL_STATUS_TIMEOUT_MS: 5000,
  
  /** Timeout for social profile checks (ms) */
  SOCIAL_PROFILE_TIMEOUT_MS: 5000,
  
  /** Default page viewport width for screenshots */
  VIEWPORT_WIDTH: 1280,
  
  /** Default page viewport height for screenshots */
  VIEWPORT_HEIGHT: 800,
} as const

// Evidence collection configuration
export const EVIDENCE_CONFIG = {
  /** Maximum HTML content size in bytes (1MB default) */
  MAX_HTML_BYTES: parseInt(process.env.EVIDENCE_HTML_MAX_BYTES || '1048576', 10),
  
  /** Whether screenshots are enabled */
  SCREENSHOTS_ENABLED: process.env.EVIDENCE_SCREENSHOTS_ENABLED !== 'false',
  
  /** Default evidence storage bucket name */
  DEFAULT_BUCKET: process.env.SUPABASE_EVIDENCE_BUCKET || 'evidence',
  
  /** Whether evidence bucket is public */
  PUBLIC_BUCKET: process.env.SUPABASE_EVIDENCE_PUBLIC === 'true',
  
  /** Signed URL TTL in seconds */
  SIGNED_URL_TTL_SECONDS: parseInt(process.env.EVIDENCE_SIGNED_URL_TTL_SECONDS || '3600', 10),
} as const

// Rate limiting and queue configuration
export const QUEUE_CONFIG = {
  /** DNS lookup queue: 10 requests/second */
  DNS_QUEUE: {
    concurrency: 5,
    interval: 1000,
    intervalCap: 10,
  },
  
  /** Web search queue: 2 requests/second */
  SEARCH_QUEUE: {
    concurrency: 2,
    interval: 1000,
    intervalCap: 2,
  },
  
  /** Screenshot queue: 1 request/2 seconds */
  SCREENSHOT_QUEUE: {
    concurrency: 1,
    interval: 2000,
    intervalCap: 1,
  },
  
  /** OpenAI API queue: 50 requests/minute */
  OPENAI_QUEUE: {
    concurrency: 3,
    interval: 60000,
    intervalCap: 50,
  },
  
  /** General external API queue: 5 requests/second */
  EXTERNAL_QUEUE: {
    concurrency: 3,
    interval: 1000,
    intervalCap: 5,
  },
} as const

// Search configuration
export const SEARCH_CONFIG = {
  /** Maximum search results to return */
  MAX_RESULTS: 10,
  
  /** Maximum social search results */
  MAX_SOCIAL_RESULTS: 20,
  
  /** Rate limit delay between queries (ms) */
  QUERY_DELAY_MS: 1000,
  
  /** Rate limit delay between social profile checks (ms) */
  SOCIAL_CHECK_DELAY_MS: 500,
  
  /** Rate limit delay between platform scans (ms) */
  PLATFORM_DELAY_MS: 2000,
  
  /** Web search provider */
  WEB_PROVIDER: (process.env.WEB_SEARCH_PROVIDER || process.env.SEARCH_PROVIDER || '').toLowerCase(),
  
  /** Social search provider */
  SOCIAL_PROVIDER: (process.env.SOCIAL_SEARCH_PROVIDER || process.env.SEARCH_PROVIDER || '').toLowerCase(),
  
  /** Whether to enable fallback search */
  FALLBACK_ENABLED: process.env.WEB_SEARCH_FALLBACK !== 'false',
} as const

// Domain generation configuration
export const DOMAIN_CONFIG = {
  /** Maximum number of domain variations to generate per type */
  MAX_VARIATIONS: {
    /** Limit for free tier */
    free: 25,
    /** Limit for starter tier */
    starter: 100,
    /** Limit for professional tier */
    professional: 500,
    /** Limit for enterprise tier */
    enterprise: 2500,
  },
  
  /** Common TLDs for variation generation */
  COMMON_TLDS: [
    'com', 'net', 'org', 'io', 'co', 'app', 'dev', 'xyz', 'info',
    'biz', 'us', 'uk', 'de', 'fr', 'ru', 'cn', 'jp', 'ca', 'au',
    'shop', 'store', 'online', 'site', 'website', 'tech', 'cloud'
  ] as const,
  
  /** Multi-part TLDs that require special handling */
  MULTI_PART_TLDS: [
    'com.au', 'net.au', 'org.au', 'gov.au', 'edu.au',
    'co.uk', 'org.uk', 'gov.uk', 'ac.uk',
    'co.nz', 'co.jp', 'co.kr', 'co.za',
    'com.br', 'com.mx', 'com.ar', 'com.co',
    'com.sg', 'com.hk', 'com.tr', 'com.tw',
    'com.ph', 'com.my', 'com.id', 'com.vn',
    'com.th', 'com.ua', 'com.pl', 'com.ru',
    'com.sa', 'com.eg', 'com.ng', 'com.pk'
  ] as const,
  
  /** Subdomain prefixes for subdomain squatting detection */
  SUBDOMAIN_PREFIXES: ['www', 'login', 'secure', 'account', 'my', 'portal', 'app'] as const,
} as const

// Threat analysis configuration
export const THREAT_CONFIG = {
  /** Phishing keywords for threat detection */
  PHISHING_KEYWORDS: [
    'login', 'signin', 'sign-in', 'account', 'verify', 'confirm',
    'secure', 'update', 'suspended', 'locked', 'password', 'credential'
  ] as const,
  
  /** Scam keywords for threat detection */
  SCAM_KEYWORDS: [
    'giveaway', 'free', 'winner', 'claim', 'prize', 'airdrop',
    'dm for', 'send dm', 'limited time', 'act now', 'hurry',
    'bitcoin', 'crypto', 'invest', 'profit', 'guaranteed'
  ] as const,
  
  /** Known safe domains to exclude from threat detection */
  SAFE_DOMAINS: [
    'google.com', 'bing.com', 'yahoo.com', 'facebook.com', 'twitter.com',
    'linkedin.com', 'instagram.com', 'youtube.com', 'reddit.com', 'wikipedia.org',
    'github.com', 'stackoverflow.com', 'medium.com', 'trustpilot.com',
    'bbb.org', 'glassdoor.com', 'indeed.com', 'crunchbase.com'
  ] as const,
  
  /** Impersonation indicators */
  IMPERSONATION_INDICATORS: [
    'official', 'real', 'verified', 'support', 'helpdesk', 'customer service'
  ] as const,
} as const

// Social media configuration
export const SOCIAL_CONFIG = {
  /** Character substitutions for social handle variations */
  HANDLE_SUBSTITUTIONS: {
    'a': ['4', '@'],
    'e': ['3'],
    'i': ['1', 'l'],
    'l': ['1', 'i'],
    'o': ['0'],
    's': ['5', '$'],
    't': ['7'],
  } as const,
  
  /** Common affixes for social handle variations */
  HANDLE_AFFIXES: [
    'official', 'real', 'the', 'get', 'try', 'app', 'hq', 'team', 'support', 'help', 'news'
  ] as const,
  
  /** Maximum handle variations to check per platform */
  MAX_HANDLE_VARIATIONS: 10,
  
  /** Maximum platforms to scan per brand */
  MAX_PLATFORMS: ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube'] as const,
} as const

// Subscription/Tier configuration
export const TIER_CONFIG = {
  /** Manual scan period duration (7 days in milliseconds) */
  MANUAL_SCAN_PERIOD_MS: 604800000,
  
  /** All available social platforms */
  ALL_PLATFORMS: [
    'twitter', 'facebook', 'instagram', 'linkedin', 
    'tiktok', 'youtube', 'telegram', 'discord'
  ] as const,
} as const

// Email configuration
export const EMAIL_CONFIG = {
  /** Default SMTP host */
  DEFAULT_SMTP_HOST: 'smtp.gmail.com',
  
  /** Default SMTP port */
  DEFAULT_SMTP_PORT: 587,
  
  /** Default from address for alerts */
  DEFAULT_FROM_ALERTS: 'alerts@doppeldown.app',
  
  /** Default from address for welcome emails */
  DEFAULT_FROM_WELCOME: 'welcome@doppeldown.app',
  
  /** Default from address for scan summaries */
  DEFAULT_FROM_SCANS: 'scans@doppeldown.app',
  
  /** Default from address for digests */
  DEFAULT_FROM_DIGEST: 'digest@doppeldown.app',
} as const

// Cron configuration
export const CRON_CONFIG = {
  /** Jitter range for scan scheduling (5 minutes in ms) */
  JITTER_MAX_MS: 5 * 60 * 1000,
  
  /** Default scan priority for manual scans */
  MANUAL_SCAN_PRIORITY: 0,
  
  /** Default scan priority for automated scans */
  AUTOMATED_SCAN_PRIORITY: 1,
} as const
