import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Re-export shared utilities to maintain backward compatibility
export {
  formatDate,
  formatDateTime,
  truncateUrl,
  extractDomain,
  generateId,
  sleep,
  debounce,
  withRetry,
  safeJsonParse,
  deepClone,
  removeEmptyValues,
  isValidEmail,
  isValidDomain,
  sanitizeUrl,
  coerceStringArray,
} from './shared-utils'

/**
 * Combine Tailwind CSS classes with proper precedence
 * Uses clsx for conditional classes and tailwind-merge for deduplication
 * 
 * @param inputs - Class values to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get Tailwind color classes for a severity level
 * 
 * @param severity - Severity level (critical, high, medium, low)
 * @returns Tailwind CSS class string
 */
export function severityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-300'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-300'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

/**
 * Get Tailwind color classes for a threat status
 * 
 * @param status - Threat status
 * @returns Tailwind CSS class string
 */
export function statusColor(status: string): string {
  switch (status) {
    case 'new':
      return 'bg-purple-100 text-purple-800'
    case 'investigating':
      return 'bg-blue-100 text-blue-800'
    case 'confirmed':
      return 'bg-orange-100 text-orange-800'
    case 'takedown_requested':
      return 'bg-yellow-100 text-yellow-800'
    case 'resolved':
      return 'bg-green-100 text-green-800'
    case 'false_positive':
      return 'bg-muted text-muted-foreground'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

/**
 * Get human-readable label for a threat type
 * 
 * @param type - Threat type identifier
 * @returns Human-readable label
 */
export function threatTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'typosquat_domain': 'Typosquatting Domain',
    'lookalike_website': 'Lookalike Website',
    'phishing_page': 'Phishing Page',
    'fake_social_account': 'Fake Social Account',
    'brand_impersonation': 'Brand Impersonation',
    'trademark_abuse': 'Trademark Abuse',
  }
  return labels[type] || type
}

/**
 * Get social platform name from a URL
 * 
 * @param url - URL to check
 * @returns Platform name or null
 */
export function getSocialPlatformFromUrl(url: string): string | null {
  const platforms: Record<string, string> = {
    'facebook.com': 'Facebook',
    'fb.com': 'Facebook',
    'instagram.com': 'Instagram',
    'twitter.com': 'Twitter/X',
    'x.com': 'Twitter/X',
    'linkedin.com': 'LinkedIn',
    'tiktok.com': 'TikTok',
    'youtube.com': 'YouTube',
    't.me': 'Telegram',
    'telegram.me': 'Telegram',
    'discord.gg': 'Discord',
    'discord.com': 'Discord',
  }

  const urlLower = url.toLowerCase()
  for (const [domain, platform] of Object.entries(platforms)) {
    if (urlLower.includes(domain)) {
      return platform
    }
  }
  return null
}

/**
 * Get Lucide icon name for a social platform
 * 
 * @param platform - Platform name
 * @returns Icon identifier
 */
export function getSocialPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    'Facebook': 'facebook',
    'Instagram': 'instagram',
    'Twitter/X': 'twitter',
    'LinkedIn': 'linkedin',
    'TikTok': 'music',
    'YouTube': 'youtube',
    'Telegram': 'send',
    'Discord': 'message-circle',
  }
  return icons[platform] || 'globe'
}

/**
 * Format a number with appropriate suffix (K, M, B)
 * 
 * @param num - Number to format
 * @returns Formatted string
 */
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Format bytes to human-readable string
 * 
 * @param bytes - Number of bytes
 * @param decimals - Decimal places (default: 2)
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * 
 * @param date - Date to format
 * @returns Relative time string
 */
export function getRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`
}

/**
 * Capitalize first letter of a string
 * 
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert camelCase to Title Case
 * 
 * @param str - camelCase string
 * @returns Title Case string
 */
export function camelToTitle(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .trim()
}

/**
 * Slugify a string for use in URLs
 * 
 * @param str - String to slugify
 * @returns URL-safe slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Truncate text to a maximum length with ellipsis
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Check if a value is empty (null, undefined, empty string, or empty array/object)
 * 
 * @param value - Value to check
 * @returns True if empty
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmpty(value: any): boolean {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Get a random item from an array
 * 
 * @param array - Array to pick from
 * @returns Random item
 */
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * 
 * @param array - Array to shuffle
 * @returns New shuffled array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}
