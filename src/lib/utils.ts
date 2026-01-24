import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function truncateUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) return url
  return url.slice(0, maxLength - 3) + '...'
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

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
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

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
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

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

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

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
