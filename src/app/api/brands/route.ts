import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// Brand limits per subscription tier
const BRAND_LIMITS: Record<string, number> = {
  free: 1,
  starter: 1,
  professional: 3,
  enterprise: 10,
}

const ALLOWED_SOCIAL_PLATFORMS = new Set([
  'twitter',
  'facebook',
  'instagram',
  'linkedin',
  'tiktok',
  'youtube',
  'telegram',
  'discord'
])

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

async function getOrCreateUserRecord(user: { id: string; email?: string; user_metadata?: { full_name?: string } }) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('users')
    .select('subscription_status, subscription_tier')
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
    .select('subscription_status, subscription_tier')
    .single()

  if (error) throw error
  return created
}

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: brands, error } = await supabase
      .from('brands')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(brands)
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user's subscription and brand limit
    const userData = await getOrCreateUserRecord(user)
    const subscriptionStatus = userData?.subscription_status || 'free'
    const subscriptionTier = userData?.subscription_tier || 'free'
    const effectiveTier = subscriptionStatus === 'active' ? subscriptionTier : 'free'
    const brandLimit = BRAND_LIMITS[effectiveTier] ?? BRAND_LIMITS.free

    // Count existing brands
    const { count: existingBrands } = await supabase
      .from('brands')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if ((existingBrands || 0) >= brandLimit) {
      const planLabel = effectiveTier === 'free' ? 'free' : effectiveTier
      return NextResponse.json(
        {
          error: `Brand limit reached. Your ${planLabel} plan allows ${brandLimit} brand${brandLimit !== 1 ? 's' : ''}. Please upgrade to add more brands.`,
          code: 'BRAND_LIMIT_REACHED'
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, domain, keywords, social_handles } = body

    if (!name || !domain || typeof name !== 'string' || typeof domain !== 'string') {
      return NextResponse.json(
        { error: 'Name and domain are required' },
        { status: 400 }
      )
    }

    const normalizedDomain = normalizeDomain(domain)
    if (!normalizedDomain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      )
    }

    const sanitizedKeywords = keywords === undefined ? [] : sanitizeKeywords(keywords)
    if (keywords !== undefined && !sanitizedKeywords) {
      return NextResponse.json(
        { error: 'Keywords must be an array of strings' },
        { status: 400 }
      )
    }

    const sanitizedHandles = social_handles === undefined ? {} : sanitizeSocialHandles(social_handles)
    if (social_handles !== undefined && sanitizedHandles === null) {
      return NextResponse.json(
        { error: 'social_handles must be an object of platform arrays' },
        { status: 400 }
      )
    }

    const { data: brand, error } = await supabase
      .from('brands')
      .insert({
        user_id: user.id,
        name: name.trim(),
        domain: normalizedDomain,
        keywords: sanitizedKeywords || [],
        social_handles: sanitizedHandles || {},
        status: 'active',
        threat_count: 0
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(brand)
  } catch (error) {
    console.error('Error creating brand:', error)
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { brandId, name, domain, keywords, social_handles, mode = 'merge' } = body

    if (!brandId || typeof brandId !== 'string') {
      return NextResponse.json({ error: 'Brand ID is required' }, { status: 400 })
    }

    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id, social_handles')
      .eq('id', brandId)
      .eq('user_id', user.id)
      .single()

    if (brandError || !brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return NextResponse.json({ error: 'Name must be a non-empty string' }, { status: 400 })
      }
      updateData.name = name.trim()
    }
    if (domain !== undefined) {
      if (typeof domain !== 'string') {
        return NextResponse.json({ error: 'Domain must be a string' }, { status: 400 })
      }
      const normalized = normalizeDomain(domain)
      if (!normalized) {
        return NextResponse.json({ error: 'Domain must be a non-empty string' }, { status: 400 })
      }
      updateData.domain = normalized
    }
    if (keywords !== undefined) {
      const sanitizedKeywords = sanitizeKeywords(keywords)
      if (!sanitizedKeywords) {
        return NextResponse.json({ error: 'Keywords must be an array of strings' }, { status: 400 })
      }
      updateData.keywords = sanitizedKeywords
    }
    if (social_handles !== undefined) {
      const sanitizedHandles = sanitizeSocialHandles(social_handles)
      if (sanitizedHandles === null) {
        return NextResponse.json(
          { error: 'social_handles must be an object of platform arrays' },
          { status: 400 }
        )
      }
      const nextHandles = mode === 'replace'
        ? sanitizedHandles
        : { ...(brand.social_handles || {}), ...sanitizedHandles }
      updateData.social_handles = nextHandles
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    const { data: updated, error: updateError } = await supabase
      .from('brands')
      .update(updateData)
      .eq('id', brandId)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating brand details:', error)
    return NextResponse.json(
      { error: 'Failed to update brand details' },
      { status: 500 }
    )
  }
}
