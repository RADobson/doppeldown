/**
 * Centralized tier configuration for subscription limits.
 * This is the single source of truth for all tier-based limits across the application.
 */

import { DOMAIN_CONFIG, TIER_CONFIG } from './constants'

/**
 * Available subscription tiers
 */
export type TierName = 'free' | 'starter' | 'professional' | 'enterprise'

/**
 * Limit configuration for each tier
 */
export interface TierLimits {
  /** Maximum number of brands allowed */
  brands: number
  /** Maximum number of domain variations to check */
  variationLimit: number
  /** Maximum number of social platforms allowed */
  socialPlatforms: number
  /** 
   * Days between automated scans (deprecated, use scanFrequencyHours)
   * @deprecated
   */
  scanFrequencyDays: number | null
  /** Hours between automated scans (null = manual only) */
  scanFrequencyHours: number | null
  /** Whether NRD (Newly Registered Domains) monitoring is enabled */
  nrdMonitoring: boolean
}

/**
 * Tier limit configurations
 */
export const TIER_LIMITS: Record<TierName, TierLimits> = {
  free: {
    brands: 1,
    variationLimit: DOMAIN_CONFIG.MAX_VARIATIONS.free,
    socialPlatforms: 1,
    scanFrequencyDays: null,
    scanFrequencyHours: null,
    nrdMonitoring: false,
  },
  starter: {
    brands: 3,
    variationLimit: DOMAIN_CONFIG.MAX_VARIATIONS.starter,
    socialPlatforms: 3,
    scanFrequencyDays: 7,
    scanFrequencyHours: 24,
    nrdMonitoring: false,
  },
  professional: {
    brands: 10,
    variationLimit: DOMAIN_CONFIG.MAX_VARIATIONS.professional,
    socialPlatforms: 6,
    scanFrequencyDays: 1,
    scanFrequencyHours: 6,
    nrdMonitoring: false,
  },
  enterprise: {
    brands: Infinity,
    variationLimit: DOMAIN_CONFIG.MAX_VARIATIONS.enterprise,
    socialPlatforms: 8,
    scanFrequencyDays: 0,
    scanFrequencyHours: 1,
    nrdMonitoring: true,
  },
}

/**
 * All available social platforms
 */
export const ALL_SOCIAL_PLATFORMS = TIER_CONFIG.ALL_PLATFORMS

/**
 * Social platform type derived from the platforms array
 */
export type SocialPlatform = typeof ALL_SOCIAL_PLATFORMS[number]

/**
 * Get the limits for a specific tier.
 * Defaults to free tier if tier is not recognized.
 * 
 * @param tier - Tier name
 * @returns Tier limits configuration
 */
export function getTierLimits(tier: string): TierLimits {
  const normalizedTier = tier?.toLowerCase() as TierName
  return TIER_LIMITS[normalizedTier] ?? TIER_LIMITS.free
}

/**
 * Get the effective tier based on subscription status.
 * Returns 'free' if subscription is not active.
 * 
 * @param subscriptionStatus - Current subscription status
 * @param subscriptionTier - Current subscription tier
 * @returns Effective tier name
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
 * 
 * @param tier - Tier name
 * @returns Brand limit number
 */
export function getBrandLimit(tier: string): number {
  const limits = getTierLimits(tier)
  return limits.brands === Infinity ? Number.MAX_SAFE_INTEGER : limits.brands
}

/**
 * Check if a tier has access to NRD monitoring.
 * 
 * @param tier - Tier name
 * @returns True if NRD monitoring is available
 */
export function hasNrdAccess(tier: string): boolean {
  return getTierLimits(tier).nrdMonitoring
}

/**
 * Get the number of social platforms allowed for a tier.
 * 
 * @param tier - Tier name
 * @returns Number of allowed social platforms
 */
export function getSocialPlatformLimit(tier: string): number {
  return getTierLimits(tier).socialPlatforms
}

/**
 * Check if automated scans are enabled for a tier.
 * 
 * @param tier - Tier name
 * @returns True if automated scans are available
 */
export function hasAutomatedScans(tier: string): boolean {
  const limits = getTierLimits(tier)
  return limits.scanFrequencyHours !== null
}

/**
 * Get the scan frequency in hours for a tier.
 * Returns null for tiers without automated scanning (manual only).
 * 
 * @param tier - Tier name
 * @returns Hours between scans or null
 */
export function getScanFrequencyHours(tier: string): number | null {
  return getTierLimits(tier).scanFrequencyHours
}

/**
 * Manual scan quota period duration (7 days in milliseconds).
 * @deprecated Use TIER_CONFIG.MANUAL_SCAN_PERIOD_MS instead
 */
export const MANUAL_SCAN_PERIOD_MS = TIER_CONFIG.MANUAL_SCAN_PERIOD_MS

/**
 * Get the manual scan limit for a tier.
 * Returns null for unlimited tiers, number for limited tiers.
 * 
 * @param tier - Tier name
 * @returns Scan limit or null for unlimited
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

/**
 * Check if a tier supports a specific feature
 * 
 * @param tier - Tier name
 * @param feature - Feature to check ('nrd', 'automated', etc.)
 * @returns True if feature is available
 */
export function hasFeature(tier: string, feature: 'nrd' | 'automated' | 'api'): boolean {
  const limits = getTierLimits(tier)
  switch (feature) {
    case 'nrd':
      return limits.nrdMonitoring
    case 'automated':
      return limits.scanFrequencyHours !== null
    case 'api':
      return tier !== 'free'
    default:
      return false
  }
}

/**
 * Get the maximum number of brands that can be added for a tier,
 * taking into account current brand count
 * 
 * @param tier - Tier name
 * @param currentBrands - Current number of brands
 * @returns Remaining brand slots or Infinity
 */
export function getRemainingBrandSlots(tier: string, currentBrands: number): number {
  const limit = getBrandLimit(tier)
  const remaining = limit - currentBrands
  return remaining > 0 ? remaining : 0
}

/**
 * Check if adding a brand would exceed the tier limit
 * 
 * @param tier - Tier name
 * @param currentBrands - Current number of brands
 * @returns True if at or over limit
 */
export function isAtBrandLimit(tier: string, currentBrands: number): boolean {
  const limit = getBrandLimit(tier)
  return currentBrands >= limit
}
