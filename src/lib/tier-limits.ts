/**
 * Centralized tier configuration for subscription limits.
 * This is the single source of truth for all tier-based limits across the application.
 */

export type TierName = 'free' | 'starter' | 'professional' | 'enterprise'

export interface TierLimits {
  brands: number
  variationLimit: number
  socialPlatforms: number
  scanFrequencyDays: number | null  // null = manual only, 0 = continuous (deprecated, use scanFrequencyHours)
  scanFrequencyHours: number | null  // null = manual only, hours between automated scans
  nrdMonitoring: boolean
}

export const TIER_LIMITS: Record<TierName, TierLimits> = {
  free: {
    brands: 1,
    variationLimit: 25,
    socialPlatforms: 1,
    scanFrequencyDays: null,  // Manual only (deprecated)
    scanFrequencyHours: null,  // Manual only
    nrdMonitoring: false,
  },
  starter: {
    brands: 3,
    variationLimit: 100,
    socialPlatforms: 3,
    scanFrequencyDays: 7,  // Weekly (deprecated)
    scanFrequencyHours: 24,  // Daily
    nrdMonitoring: false,
  },
  professional: {
    brands: 10,
    variationLimit: 500,
    socialPlatforms: 6,
    scanFrequencyDays: 1,  // Daily (deprecated)
    scanFrequencyHours: 6,  // Every 6 hours
    nrdMonitoring: false,
  },
  enterprise: {
    brands: Infinity,
    variationLimit: 2500,
    socialPlatforms: 8,  // All platforms
    scanFrequencyDays: 0,  // Continuous (deprecated)
    scanFrequencyHours: 1,  // Hourly
    nrdMonitoring: true,
  },
}

export const ALL_SOCIAL_PLATFORMS = [
  'twitter',
  'facebook',
  'instagram',
  'linkedin',
  'tiktok',
  'youtube',
  'telegram',
  'discord',
] as const

export type SocialPlatform = typeof ALL_SOCIAL_PLATFORMS[number]

/**
 * Get the limits for a specific tier.
 * Defaults to free tier if tier is not recognized.
 */
export function getTierLimits(tier: string): TierLimits {
  const normalizedTier = tier?.toLowerCase() as TierName
  return TIER_LIMITS[normalizedTier] ?? TIER_LIMITS.free
}

/**
 * Get the effective tier based on subscription status.
 * Returns 'free' if subscription is not active.
 */
export function getEffectiveTier(
  subscriptionStatus: string | null | undefined,
  subscriptionTier: string | null | undefined
): TierName {
  if (subscriptionStatus !== 'active') {
    return 'free'
  }
  const tier = (subscriptionTier?.toLowerCase() ?? 'free') as TierName
  return TIER_LIMITS[tier] ? tier : 'free'
}

/**
 * Get brand limit as a number suitable for comparison.
 * Returns MAX_SAFE_INTEGER for unlimited tiers.
 */
export function getBrandLimit(tier: string): number {
  const limits = getTierLimits(tier)
  return limits.brands === Infinity ? Number.MAX_SAFE_INTEGER : limits.brands
}

/**
 * Check if a tier has access to NRD monitoring.
 */
export function hasNrdAccess(tier: string): boolean {
  return getTierLimits(tier).nrdMonitoring
}

/**
 * Get the number of social platforms allowed for a tier.
 */
export function getSocialPlatformLimit(tier: string): number {
  return getTierLimits(tier).socialPlatforms
}

/**
 * Check if automated scans are enabled for a tier.
 */
export function hasAutomatedScans(tier: string): boolean {
  const limits = getTierLimits(tier)
  return limits.scanFrequencyHours !== null
}

/**
 * Get the scan frequency in hours for a tier.
 * Returns null for tiers without automated scanning (manual only).
 */
export function getScanFrequencyHours(tier: string): number | null {
  return getTierLimits(tier).scanFrequencyHours
}

/**
 * Manual scan quota period duration (7 days in milliseconds).
 */
export const MANUAL_SCAN_PERIOD_MS = 604800000 // 7 * 24 * 60 * 60 * 1000

/**
 * Get the manual scan limit for a tier.
 * Returns null for unlimited tiers, number for limited tiers.
 */
export function getManualScanLimit(tier: string): number | null {
  const normalizedTier = tier?.toLowerCase() as TierName
  // Only free tier has a manual scan limit (1 per week)
  // All paid tiers (starter, professional, enterprise) are unlimited
  if (normalizedTier === 'free') {
    return 1
  }
  return null // unlimited
}
