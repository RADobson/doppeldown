import { NextRequest } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getEffectiveTier, getBrandLimit, getSocialPlatformLimit, ALL_SOCIAL_PLATFORMS } from '@/lib/tier-limits'
import { 
  withErrorHandler, 
  createSuccessResponse,
  AppError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '@/lib/errors'
import { logger } from '@/lib/logger'
import { invalidateUserCache, invalidateBrandCache } from '@/lib/cache'
import { z } from 'zod'

// ============================================================================
// Zod Schemas for Input Validation
// ============================================================================

const MAX_NAME_LENGTH = 100
const MAX_DOMAIN_LENGTH = 253  // RFC 1035 max domain length
const MAX_KEYWORD_LENGTH = 50
const MAX_KEYWORDS = 50
const MAX_SOCIAL_HANDLE_LENGTH = 100
const MAX_SOCIAL_HANDLES_PER_PLATFORM = 10

const ALLOWED_SOCIAL_PLATFORMS_SET = new Set<string>(ALL_SOCIAL_PLATFORMS)

// Domain validation regex (simplified but effective)
const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/

// Schema for creating a brand
const createBrandSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(MAX_NAME_LENGTH, `Name must be at most ${MAX_NAME_LENGTH} characters`)
    .transform(val => val.trim()),
  
  domain: z.string()
    .min(1, 'Domain is required')
    .max(MAX_DOMAIN_LENGTH, `Domain must be at most ${MAX_DOMAIN_LENGTH} characters`)
    .regex(domainRegex, 'Invalid domain format')
    .transform(val => val.trim().toLowerCase()),
  
  keywords: z.array(
    z.string()
      .min(1, 'Keyword cannot be empty')
      .max(MAX_KEYWORD_LENGTH, `Keyword must be at most ${MAX_KEYWORD_LENGTH} characters`)
      .transform(val => val.trim())
  )
    .max(MAX_KEYWORDS, `At most ${MAX_KEYWORDS} keywords allowed`)
    .optional()
    .default([]),
  
  social_handles: z.record(
    z.string().refine(
      val => ALLOWED_SOCIAL_PLATFORMS_SET.has(val),
      val => ({ message: `Invalid social platform: ${val}` })
    ),
    z.array(
      z.string()
        .min(1)
        .max(MAX_SOCIAL_HANDLE_LENGTH)
        .transform(val => val.trim())
    )
      .max(MAX_SOCIAL_HANDLES_PER_PLATFORM)
  )
    .optional()
    .default({}),
  
  enabled_social_platforms: z.array(
    z.string().refine(
      val => ALLOWED_SOCIAL_PLATFORMS_SET.has(val),
      val => ({ message: `Invalid platform: ${val}` })
    )
  )
    .optional()
    .default([]),
})

// Schema for updating a brand
const updateBrandSchema = z.object({
  brandId: z.string().min(1, 'Brand ID is required'),
  
  name: z.string()
    .min(1, 'Name cannot be empty')
    .max(MAX_NAME_LENGTH, `Name must be at most ${MAX_NAME_LENGTH} characters`)
    .transform(val => val.trim())
    .optional(),
  
  domain: z.string()
    .min(1, 'Domain cannot be empty')
    .max(MAX_DOMAIN_LENGTH, `Domain must be at most ${MAX_DOMAIN_LENGTH} characters`)
    .regex(domainRegex, 'Invalid domain format')
    .transform(val => val.trim().toLowerCase())
    .optional(),
  
  keywords: z.array(
    z.string()
      .min(1, 'Keyword cannot be empty')
      .max(MAX_KEYWORD_LENGTH, `Keyword must be at most ${MAX_KEYWORD_LENGTH} characters`)
      .transform(val => val.trim())
  )
    .max(MAX_KEYWORDS, `At most ${MAX_KEYWORDS} keywords allowed`)
    .optional(),
  
  social_handles: z.record(
    z.string().refine(
      val => ALLOWED_SOCIAL_PLATFORMS_SET.has(val),
      val => ({ message: `Invalid social platform: ${val}` })
    ),
    z.array(
      z.string()
        .min(1)
        .max(MAX_SOCIAL_HANDLE_LENGTH)
        .transform(val => val.trim())
    )
      .max(MAX_SOCIAL_HANDLES_PER_PLATFORM)
  )
    .optional(),
  
  enabled_social_platforms: z.array(
    z.string().refine(
      val => ALLOWED_SOCIAL_PLATFORMS_SET.has(val),
      val => ({ message: `Invalid platform: ${val}` })
    )
  )
    .optional(),
  
  mode: z.enum(['merge', 'replace']).optional().default('merge'),
})

// Helper to convert Zod errors to field errors format
function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {}
  
  for (const issue of error.issues) {
    const path = issue.path.join('.')
    if (!fieldErrors[path]) {
      fieldErrors[path] = []
    }
    fieldErrors[path].push(issue.message)
  }
  
  return fieldErrors
}

const ALLOWED_SOCIAL_PLATFORMS = new Set<string>(ALL_SOCIAL_PLATFORMS)

const normalizeDomain = (value: string) => value
  .toLowerCase()
  .replace(/^https?:\/\//, '')
  .replace(/^www\./, '')
  .replace(/\/.*$/, '')
  .trim()

function sanitizeKeywords(input: unknown): string[] | null {
  if (!Array.isArray(input)) return null
  const cleaned = input
    .filter((item): item is string => typeof item === 'string')
    .map(item => item.trim())
    .filter(Boolean)
  return Array.from(new Set(cleaned))
}

function sanitizeSocialHandles(input: unknown): Record<string, string[]> | null {
  if (input === null) return {}
  if (!input || typeof input !== 'object') return null
  const result: Record<string, string[]> = {}
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!ALLOWED_SOCIAL_PLATFORMS.has(key)) continue
    const rawList = Array.isArray(value) ? value : [value]
    const cleaned = rawList
      .filter((item): item is string => typeof item === 'string')
      .map(item => item.trim())
      .filter(Boolean)
    if (cleaned.length > 0) {
      result[key] = Array.from(new Set(cleaned))
    }
  }
  return result
}

function sanitizeEnabledPlatforms(input: unknown): string[] | null {
  if (input === undefined) return null // undefined means no change
  if (input === null || !Array.isArray(input)) return []
  const cleaned = input
    .filter((item): item is string => typeof item === 'string')
    .map(item => item.trim().toLowerCase())
    .filter(item => ALLOWED_SOCIAL_PLATFORMS.has(item))
  return Array.from(new Set(cleaned))
}

async function getOrCreateUserRecord(user: { id: string; email?: string; user_metadata?: { full_name?: string } }) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('users')
    .select('subscription_status, subscription_tier, is_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (data) return data

  const serviceClient = await createServiceClient()
  const { data: created, error } = await serviceClient
    .from('users')
    .insert({
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || null,
      subscription_status: 'free',
      subscription_tier: 'free',
    })
    .select('subscription_status, subscription_tier, is_admin')
    .single()

  if (error) {
    logger.error('Failed to create user record', error, { userId: user.id })
    throw new AppError('DATABASE_ERROR', 'Failed to initialize user account')
  }
  
  return created
}

async function getHandler() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new UnauthorizedError()
  }

  const { data: brands, error } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    logger.error('Failed to fetch brands', error, { userId: user.id })
    throw new AppError('DATABASE_ERROR', 'Failed to fetch brands')
  }

  return createSuccessResponse(brands || [])
}

async function postHandler(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new UnauthorizedError()
  }

  // Check user's subscription and brand limit
  const userData = await getOrCreateUserRecord(user)
  const effectiveTier = getEffectiveTier(
    userData?.subscription_status,
    userData?.subscription_tier
  )
  const brandLimit = getBrandLimit(effectiveTier)

  // Count existing brands
  const { count: existingBrands, error: countError } = await supabase
    .from('brands')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (countError) {
    logger.error('Failed to count brands', countError, { userId: user.id })
    throw new AppError('DATABASE_ERROR', 'Failed to check brand limit')
  }

  if (!userData?.is_admin && (existingBrands || 0) >= brandLimit) {
    const planLabel = effectiveTier === 'free' ? 'free' : effectiveTier
    throw new AppError(
      'BRAND_LIMIT_REACHED',
      `Brand limit reached. Your ${planLabel} plan allows ${brandLimit} brand${brandLimit !== 1 ? 's' : ''}. Please upgrade to add more brands.`
    )
  }

  // Parse and validate request body using Zod
  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    throw new AppError('INVALID_INPUT', 'Invalid JSON in request body')
  }

  const parseResult = createBrandSchema.safeParse(rawBody)
  if (!parseResult.success) {
    throw new ValidationError('Invalid input data', formatZodErrors(parseResult.error))
  }

  const { name, domain, keywords, social_handles, enabled_social_platforms } = parseResult.data

  // Validate enabled social platforms against tier limit
  const platformLimit = getSocialPlatformLimit(effectiveTier)
  if (enabled_social_platforms.length > platformLimit) {
    throw new AppError(
      'PLATFORM_LIMIT_EXCEEDED',
      `Platform limit exceeded. Your ${effectiveTier} plan allows ${platformLimit} platform${platformLimit !== 1 ? 's' : ''}. Please upgrade to select more.`
    )
  }

  // Normalize domain (remove protocol, www, trailing slashes)
  const normalizedDomain = normalizeDomain(domain)
  if (!normalizedDomain) {
    throw new ValidationError('Invalid domain', {
      domain: ['Domain is required and must be valid'],
    })
  }

  const { data: brand, error } = await supabase
    .from('brands')
    .insert({
      user_id: user.id,
      name,
      domain: normalizedDomain,
      keywords: keywords || [],
      social_handles: social_handles || {},
      enabled_social_platforms: enabled_social_platforms,
      status: 'active',
      threat_count: 0
    })
    .select()
    .single()

  if (error) {
    logger.error('Failed to create brand', error, {
      userId: user.id,
      domain: normalizedDomain,
    })
    
    // Check for duplicate domain
    if (error.message?.includes('duplicate') || error.code === '23505') {
      throw new AppError(
        'ALREADY_EXISTS',
        'A brand with this domain already exists in your account'
      )
    }
    
    throw new AppError('DATABASE_ERROR', 'Failed to create brand')
  }

  logger.info('Brand created successfully', {
    userId: user.id,
    brandId: brand.id,
    domain: normalizedDomain,
  })

  // Invalidate user cache to reflect new brand count
  await invalidateUserCache(user.id)

  return createSuccessResponse(brand)
}

async function patchHandler(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new UnauthorizedError()
  }

  // Parse and validate request body using Zod
  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    throw new AppError('INVALID_INPUT', 'Invalid JSON in request body')
  }

  const parseResult = updateBrandSchema.safeParse(rawBody)
  if (!parseResult.success) {
    throw new ValidationError('Invalid input data', formatZodErrors(parseResult.error))
  }

  const { brandId, name, domain, keywords, social_handles, enabled_social_platforms, mode } = parseResult.data

  // Get user tier for platform limit validation
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('subscription_status, subscription_tier')
    .eq('id', user.id)
    .single()

  if (userError) {
    logger.error('Failed to fetch user tier', userError, { userId: user.id })
    throw new AppError('DATABASE_ERROR', 'Failed to verify user permissions')
  }

  const effectiveTier = getEffectiveTier(
    userData?.subscription_status,
    userData?.subscription_tier
  )

  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .select('id, social_handles')
    .eq('id', brandId)
    .eq('user_id', user.id)
    .single()

  if (brandError || !brand) {
    throw new NotFoundError('Brand', brandId)
  }

  const updateData: Record<string, unknown> = {}
  
  if (name !== undefined) {
    updateData.name = name
  }
  
  if (domain !== undefined) {
    const normalized = normalizeDomain(domain)
    if (!normalized) {
      throw new ValidationError('Invalid domain', {
        domain: ['Domain must be a non-empty string'],
      })
    }
    updateData.domain = normalized
  }
  
  if (keywords !== undefined) {
    updateData.keywords = keywords
  }
  
  if (social_handles !== undefined) {
    const nextHandles = mode === 'replace'
      ? social_handles
      : { ...(brand.social_handles || {}), ...social_handles }
    updateData.social_handles = nextHandles
  }
  
  if (enabled_social_platforms !== undefined) {
    const platformLimit = getSocialPlatformLimit(effectiveTier)
    if (enabled_social_platforms.length > platformLimit) {
      throw new AppError(
        'PLATFORM_LIMIT_EXCEEDED',
        `Platform limit exceeded. Your ${effectiveTier} plan allows ${platformLimit} platform${platformLimit !== 1 ? 's' : ''}. Please upgrade to select more.`
      )
    }
    updateData.enabled_social_platforms = enabled_social_platforms
  }

  if (Object.keys(updateData).length === 0) {
    throw new ValidationError('No updates provided', {
      general: ['At least one field must be provided for update'],
    })
  }

  const { data: updated, error: updateError } = await supabase
    .from('brands')
    .update(updateData)
    .eq('id', brandId)
    .select()
    .single()

  if (updateError) {
    logger.error('Failed to update brand', updateError, {
      userId: user.id,
      brandId,
      updateFields: Object.keys(updateData),
    })
    throw new AppError('DATABASE_ERROR', 'Failed to update brand')
  }

  logger.info('Brand updated successfully', {
    userId: user.id,
    brandId,
    updatedFields: Object.keys(updateData),
  })

  // Invalidate brand cache to reflect changes
  await invalidateBrandCache(brandId, user.id)

  return createSuccessResponse(updated)
}

export const GET = withErrorHandler(getHandler)
export const POST = withErrorHandler(postHandler)
export const PATCH = withErrorHandler(patchHandler)
