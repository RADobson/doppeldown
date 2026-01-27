import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getNrdProvider } from '@/lib/nrd-provider'
import {
  scanDomainsAgainstBrands,
  buildBrandTermsIndex,
  mightMatchAnyBrand,
  AUTO_THREAT_THRESHOLD,
  type EnterpriseBrand,
  type NrdMatch
} from '@/lib/nrd-scanner'
import { hasNrdAccess } from '@/lib/tier-limits'

export const maxDuration = 300 // 5 minute max for Vercel

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()

  try {
    const supabase = await createServiceClient()
    const provider = getNrdProvider()

    // Get all enterprise brands (users with NRD access)
    const { data: enterpriseUsers, error: usersError } = await supabase
      .from('users')
      .select('id, subscription_tier')
      .eq('subscription_status', 'active')

    if (usersError) throw usersError

    // Filter to users with NRD access
    const nrdUserIds = (enterpriseUsers || [])
      .filter(user => hasNrdAccess(user.subscription_tier))
      .map(user => user.id)

    if (nrdUserIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No enterprise users with NRD access',
        timestamp: new Date().toISOString()
      })
    }

    // Get brands for these users
    const { data: brandsData, error: brandsError } = await supabase
      .from('brands')
      .select('id, name, domain, keywords')
      .eq('status', 'active')
      .in('user_id', nrdUserIds)

    if (brandsError) throw brandsError

    const brands: EnterpriseBrand[] = (brandsData || []).map(b => ({
      id: b.id,
      name: b.name,
      domain: b.domain,
      keywords: b.keywords || []
    }))

    if (brands.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active brands for enterprise users',
        timestamp: new Date().toISOString()
      })
    }

    // Build terms index for quick pre-filtering
    const termsIndex = buildBrandTermsIndex(brands)

    // Get last processed date
    const { data: lastState } = await supabase
      .from('nrd_feed_state')
      .select('last_processed_date')
      .eq('provider', provider.name)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const sinceDate = lastState?.last_processed_date
      ? new Date(lastState.last_processed_date)
      : new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // Default: 14 days ago

    const results = {
      domainsProcessed: 0,
      matchesFound: 0,
      threatsCreated: 0,
      errors: [] as string[]
    }

    // Process NRD feed
    const allMatches: NrdMatch[] = []

    for await (const batch of provider.fetchDomains(sinceDate)) {
      // Pre-filter domains
      const candidateDomains = batch.filter(domain => mightMatchAnyBrand(domain, termsIndex))

      // Scan candidates against brands
      const matches = scanDomainsAgainstBrands(candidateDomains, brands)
      allMatches.push(...matches)

      results.domainsProcessed += batch.length
    }

    // Dedupe matches (same domain + brand)
    const uniqueMatches = new Map<string, NrdMatch>()
    for (const match of allMatches) {
      const key = `${match.brandId}:${match.domain}`
      const existing = uniqueMatches.get(key)
      if (!existing || (match.similarityScore || 0) > (existing.similarityScore || 0)) {
        uniqueMatches.set(key, match)
      }
    }

    // Save matches and create threats for high-confidence matches
    for (const match of Array.from(uniqueMatches.values())) {
      try {
        // Check if match already exists
        const { data: existingMatch } = await supabase
          .from('nrd_matches')
          .select('id')
          .eq('brand_id', match.brandId)
          .eq('domain', match.domain)
          .maybeSingle()

        if (existingMatch) continue

        // Insert NRD match
        const { data: nrdMatch, error: matchError } = await supabase
          .from('nrd_matches')
          .insert({
            brand_id: match.brandId,
            domain: match.domain,
            registration_date: new Date().toISOString().split('T')[0], // Today's date
            match_type: match.matchType,
            matched_keyword: match.matchedKeyword,
            similarity_score: match.similarityScore,
            processed: false
          })
          .select()
          .single()

        if (matchError) {
          results.errors.push(`Match insert error for ${match.domain}: ${matchError.message}`)
          continue
        }

        results.matchesFound++

        // Auto-create threat for high-confidence matches
        if ((match.similarityScore || 0) >= AUTO_THREAT_THRESHOLD) {
          // Check if threat already exists
          const { data: existingThreat } = await supabase
            .from('threats')
            .select('id')
            .eq('brand_id', match.brandId)
            .eq('domain', match.domain)
            .maybeSingle()

          if (!existingThreat) {
            const { data: threat, error: threatError } = await supabase
              .from('threats')
              .insert({
                brand_id: match.brandId,
                type: 'typosquat_domain',
                severity: match.matchType === 'exact' ? 'high' : 'medium',
                status: 'new',
                url: `https://${match.domain}`,
                domain: match.domain,
                description: `Newly registered domain detected via NRD monitoring (${match.matchType} match${match.matchedKeyword ? `, keyword: ${match.matchedKeyword}` : ''})`,
                detected_at: new Date().toISOString()
              })
              .select()
              .single()

            if (threatError) {
              results.errors.push(`Threat insert error for ${match.domain}: ${threatError.message}`)
            } else if (threat) {
              // Link threat to NRD match
              await supabase
                .from('nrd_matches')
                .update({
                  threat_id: threat.id,
                  processed: true,
                  processed_at: new Date().toISOString()
                })
                .eq('id', nrdMatch.id)

              results.threatsCreated++

              // Update brand threat count
              await supabase.rpc('increment_threat_count', { brand_id: match.brandId })
            }
          }
        }
      } catch (matchProcessError) {
        const errorMsg = matchProcessError instanceof Error
          ? matchProcessError.message
          : 'Unknown error'
        results.errors.push(`Process error for ${match.domain}: ${errorMsg}`)
      }
    }

    // Record processing state
    const processingTime = Date.now() - startTime
    await supabase
      .from('nrd_feed_state')
      .insert({
        provider: provider.name,
        last_processed_date: new Date().toISOString().split('T')[0],
        domains_processed: results.domainsProcessed,
        matches_found: results.matchesFound,
        processing_time_ms: processingTime,
        error: results.errors.length > 0 ? results.errors.join('; ') : null
      })

    return NextResponse.json({
      success: true,
      results,
      processingTimeMs: processingTime,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('NRD cron error:', error)
    return NextResponse.json(
      {
        error: 'NRD processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
