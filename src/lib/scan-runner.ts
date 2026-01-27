import { generateDomainVariations, checkDomainRegistration, assessThreatLevel, splitDomainAndTld } from './domain-generator'
import { scanForThreats } from './web-scanner'
import { searchLogoUsage } from './logo-scanner'
import { collectEvidence, captureScreenshot } from './evidence-collector'
import { scanSocialMedia } from './social-scanner'
import { sendThreatAlert, sendScanSummary } from './email'
import { sendThreatDetectedWebhook } from './webhooks'
import { buildThreatAnalysis } from './threat-analysis'
import { dnsQueue, clearAllQueues } from './scan-queue'
import { createThreatNotification, createScanCompletedNotification } from './notifications'
import type { Threat, ThreatSeverity, ThreatType, VariationType, ScanError } from '../types'

const DEFAULT_SOCIAL_PLATFORMS = ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube', 'telegram', 'discord']

type ScanMode = {
  domains: boolean
  web: boolean
  social: boolean
  logo: boolean
  variationLimit: number
  socialPlatforms: string[]
}

type VariationCandidate = {
  domain: string
  type: VariationType
}

type ScanJobPayload = {
  platforms?: string[]
  keywords?: string[]
  variationLimit?: number
}

const SCAN_CONFIG: Record<string, ScanMode> = {
  full: {
    domains: true,
    web: true,
    social: true,
    logo: true,
    variationLimit: 100,
    socialPlatforms: DEFAULT_SOCIAL_PLATFORMS
  },
  quick: {
    domains: true,
    web: true,
    social: false,
    logo: true,
    variationLimit: 25,
    socialPlatforms: []
  },
  domain_only: {
    domains: true,
    web: false,
    social: false,
    logo: false,
    variationLimit: 100,
    socialPlatforms: []
  },
  web_only: {
    domains: false,
    web: true,
    social: false,
    logo: true,
    variationLimit: 0,
    socialPlatforms: []
  },
  social_only: {
    domains: false,
    web: false,
    social: true,
    logo: false,
    variationLimit: 0,
    socialPlatforms: DEFAULT_SOCIAL_PLATFORMS
  },
  automated: {
    domains: true,
    web: true,
    social: true,
    logo: true,
    variationLimit: 50,
    socialPlatforms: DEFAULT_SOCIAL_PLATFORMS
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

type ScanStep = 'domains' | 'web' | 'logo' | 'social' | 'finalizing';

const STEP_WEIGHTS: Record<ScanStep, number> = {
  domains: 40,
  web: 25,
  logo: 15,
  social: 20,
  finalizing: 0
};

function calculateOverallProgress(
  step: ScanStep,
  stepProgress: number,
  stepTotal: number,
  mode: ScanMode
): number {
  // Calculate enabled step weights
  const enabledWeights: Partial<Record<ScanStep, number>> = {};
  if (mode.domains) enabledWeights.domains = STEP_WEIGHTS.domains;
  if (mode.web) enabledWeights.web = STEP_WEIGHTS.web;
  if (mode.logo) enabledWeights.logo = STEP_WEIGHTS.logo;
  if (mode.social) enabledWeights.social = STEP_WEIGHTS.social;

  const totalWeight = Object.values(enabledWeights).reduce((a, b) => a + b, 0);
  if (totalWeight === 0) return 100;

  // Calculate cumulative progress from completed steps
  const stepOrder: ScanStep[] = ['domains', 'web', 'logo', 'social'];
  let cumulativeProgress = 0;
  let reachedCurrentStep = false;

  for (const s of stepOrder) {
    if (s === step) {
      reachedCurrentStep = true;
      // Add partial progress for current step
      const stepWeight = enabledWeights[s] || 0;
      const stepPercent = stepTotal > 0 ? (stepProgress / stepTotal) : 0;
      cumulativeProgress += (stepWeight / totalWeight) * stepPercent * 100;
      break;
    }
    if (!reachedCurrentStep && enabledWeights[s]) {
      // Add full weight for completed steps
      cumulativeProgress += (enabledWeights[s]! / totalWeight) * 100;
    }
  }

  return Math.min(100, Math.round(cumulativeProgress));
}
const extractDomainFromUrl = (url?: string) => {
  if (!url) return undefined
  try {
    return new URL(url).hostname
  } catch {
    return undefined
  }
}

const VISION_PROVIDER = (process.env.VISION_PROVIDER || '').toLowerCase()
const OPENAI_VISION_ENABLED = process.env.OPENAI_VISION_ENABLED !== 'false'
const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY)
const canRunOpenAIVision = hasOpenAiKey && OPENAI_VISION_ENABLED && VISION_PROVIDER === 'openai'
const PROGRESS_UPDATE_INTERVAL_MS = parseInt(process.env.SCAN_PROGRESS_INTERVAL_MS || '1500', 10)
const CANCEL_CHECK_EVERY = parseInt(process.env.SCAN_CANCEL_CHECK_EVERY || '25', 10)

const DOMAIN_TYPE_PRIORITY = [
  'tld_swap',
  'homoglyph',
  'missing_letter',
  'keyboard_proximity',
  'double_letter',
  'vowel_swap',
  'hyphen',
  'subdomain',
  'bitsquat',
  'added_letter'
]

const MAX_ADDED_LETTER = parseInt(process.env.SCAN_ADDED_LETTER_LIMIT || '25', 10)
const DEBUG_BRAND = (process.env.SCAN_DEBUG_BRAND || '').toLowerCase()
const DEBUG_DOMAINS = (process.env.SCAN_DEBUG_DOMAINS || '')
  .split(',')
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean)
const PRIORITY_TLDS = (process.env.SCAN_PRIORITY_TLDS || 'com,net,org')
  .split(',')
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean)
const SEED_PLURAL_LIMIT = parseInt(process.env.SCAN_SEED_PLURAL_LIMIT || '12', 10)

const stemWord = (word: string) => {
  if (word.length <= 4) return word
  if (word.endsWith('ers')) return word.slice(0, -3)
  if (word.endsWith('er')) return word.slice(0, -2)
  if (word.endsWith('ing')) return word.slice(0, -3)
  if (word.endsWith('ly')) return word.slice(0, -2)
  if (word.endsWith('s') && word.length > 5) return word.slice(0, -1)
  return word
}

const buildSeedNames = (baseName: string, brandName?: string) => {
  const seeds = new Set<string>()
  const normalizedBase = baseName.toLowerCase().replace(/[^a-z0-9]/g, '')
  const addSeed = (value?: string) => {
    if (!value) return
    const cleaned = value.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (cleaned.length >= 3) seeds.add(cleaned)
  }

  addSeed(normalizedBase)
  const stemmedBase = stemWord(normalizedBase)
  if (stemmedBase && stemmedBase !== normalizedBase) {
    addSeed(stemmedBase)
  }
  if (stemmedBase && !stemmedBase.endsWith('s')) {
    addSeed(`${stemmedBase}s`)
  }

  const addRemovedSubstringSeeds = (value: string, substring: string, cap: number) => {
    let count = 0
    let idx = value.indexOf(substring)
    while (idx !== -1 && count < cap) {
      const variant = value.slice(0, idx) + value.slice(idx + substring.length)
      addSeed(variant)
      count += 1
      idx = value.indexOf(substring, idx + 1)
    }
  }

  if (normalizedBase) {
    addRemovedSubstringSeeds(normalizedBase, 'er', 3)
    addRemovedSubstringSeeds(normalizedBase, 'ers', 2)
  }

  if (brandName) {
    const normalizedBrand = brandName.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (normalizedBrand) addSeed(normalizedBrand)

    const words = brandName.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
    if (words.length > 0) {
      const stemmedWords = words.map(stemWord)
      const originalJoin = words.join('')
      const stemmedJoin = stemmedWords.join('')
      addSeed(originalJoin)
      if (stemmedJoin && stemmedJoin !== originalJoin) addSeed(stemmedJoin)

      for (const base of [originalJoin, stemmedJoin]) {
        if (!base) continue
        if (!base.endsWith('s')) addSeed(`${base}s`)
      }
    }
  }

  const finalSeeds = Array.from(seeds).filter(Boolean)
  const pluralSeeds: string[] = []
  for (const seed of finalSeeds) {
    if (pluralSeeds.length >= SEED_PLURAL_LIMIT) break
    if (seed.length < 5) continue
    if (seed.endsWith('s')) continue
    pluralSeeds.push(`${seed}s`)
  }

  for (const plural of pluralSeeds) {
    seeds.add(plural)
  }

  return Array.from(seeds).filter(Boolean)
}

const prioritizeVariations = (variations: VariationCandidate[], limit: number) => {
  const buckets = new Map<string, VariationCandidate[]>()
  for (const variation of variations) {
    const list = buckets.get(variation.type) || []
    list.push(variation)
    buckets.set(variation.type, list)
  }

  const results: VariationCandidate[] = []
  const seen = new Set<string>()
  for (const type of DOMAIN_TYPE_PRIORITY) {
    const list = buckets.get(type) || []
    const cap = type === 'added_letter' ? Math.min(MAX_ADDED_LETTER, list.length) : list.length
    for (let i = 0; i < cap; i++) {
      const candidate = list[i]
      if (seen.has(candidate.domain)) continue
      seen.add(candidate.domain)
      results.push(candidate)
      if (results.length >= limit) return results
    }
  }

  if (results.length >= limit) return results

  for (const list of buckets.values()) {
    for (const item of list) {
      if (results.length >= limit) return results
      if (seen.has(item.domain)) continue
      seen.add(item.domain)
      results.push(item)
    }
  }

  return results
}

const buildPriorityDomains = (seeds: string[], originalTld: string) => {
  const priorities: VariationCandidate[] = []
  const originalTldLower = originalTld.toLowerCase()

  for (const seed of seeds) {
    for (const tld of PRIORITY_TLDS) {
      if (!tld || tld === originalTldLower) continue
      priorities.push({
        domain: `${seed}.${tld}`,
        type: 'tld_swap'
      })
    }
  }

  return priorities
}

async function fetchImageBuffer(url?: string): Promise<Buffer | null> {
  if (!url) return null
  try {
    const response = await fetch(url)
    if (!response.ok) return null
    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch {
    return null
  }
}

async function captureScreenshotBuffer(url?: string): Promise<Buffer | null> {
  if (!url) return null
  const result = await captureScreenshot(url)
  if (result.success && result.imageData) return result.imageData
  return null
}

export async function runScanForBrand(options: {
  supabase: any
  brand: any
  scanId: string
  scanType: string
  jobPayload?: ScanJobPayload
  triggerAlerts?: boolean
}) {
  const { supabase, brand, scanId, scanType, jobPayload, triggerAlerts } = options
  const isDebugBrand = Boolean(
    DEBUG_BRAND &&
    (brand.id?.toLowerCase?.() === DEBUG_BRAND ||
      brand.domain?.toLowerCase?.() === DEBUG_BRAND ||
      brand.name?.toLowerCase?.().includes(DEBUG_BRAND))
  )

  const mode = { ...(SCAN_CONFIG[scanType] || SCAN_CONFIG.full) }

  if (jobPayload?.variationLimit !== undefined) {
    mode.variationLimit = jobPayload.variationLimit
  }

  if (jobPayload?.platforms && jobPayload.platforms.length > 0) {
    mode.socialPlatforms = jobPayload.platforms
  }

  const keywords = Array.isArray(jobPayload?.keywords)
    ? jobPayload?.keywords
    : (brand.keywords || [])

  const now = new Date().toISOString()

  await supabase
    .from('scans')
    .update({
      status: 'running',
      started_at: now
    })
    .eq('id', scanId)

  const threats: Partial<Threat>[] = []
  const partialErrors: ScanError[] = []
  let threatsFound = 0
  let domainsChecked = 0
  let pagesScanned = 0
  let lastProgressUpdate = 0
  let officialScreenshot: Buffer | null | undefined
  const ensureNotCancelled = async () => {
    try {
      const { data: scan } = await supabase
        .from('scans')
        .select('status, error')
        .eq('id', scanId)
        .single()

      if (scan?.status === 'failed' && typeof scan.error === 'string' && scan.error.toLowerCase().includes('cancelled')) {
        throw new Error('Scan cancelled by user')
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('Scan cancelled')) {
        throw err
      }
    }
  }
  const updateProgress = async (
    step: ScanStep,
    stepProg: number,
    stepTot: number,
    force: boolean = false
  ) => {
    const nowMs = Date.now()
    if (!force && nowMs - lastProgressUpdate < PROGRESS_UPDATE_INTERVAL_MS) return
    lastProgressUpdate = nowMs

    const overallProgress = calculateOverallProgress(step, stepProg, stepTot, mode)

    try {
      await supabase
        .from('scans')
        .update({
          status: 'running',
          current_step: step,
          step_progress: stepProg,
          step_total: stepTot,
          overall_progress: overallProgress,
          domains_checked: domainsChecked,
          pages_scanned: pagesScanned,
          threats_found: threatsFound,
          partial_errors: partialErrors
        })
        .eq('id', scanId)
    } catch (err) {
      console.warn('Failed to update scan progress:', err)
    }
  }
  await updateProgress('domains', 0, 0, true)
  const getOfficialScreenshot = async () => {
    if (!canRunOpenAIVision) return null
    if (officialScreenshot !== undefined) return officialScreenshot

    const httpsUrl = `https://${brand.domain}`
    const httpsShot = await captureScreenshotBuffer(httpsUrl)
    if (httpsShot) {
      officialScreenshot = httpsShot
      return officialScreenshot
    }

    const httpUrl = `http://${brand.domain}`
    const httpShot = await captureScreenshotBuffer(httpUrl)
    officialScreenshot = httpShot
    return officialScreenshot
  }

  try {
    const { baseName, tld } = splitDomainAndTld(brand.domain)
    const seedNames = buildSeedNames(baseName, brand.name)
    if (isDebugBrand) {
      console.log('[scan-debug] domain split', {
        brandId: brand.id,
        brandDomain: brand.domain,
        baseName,
        tld,
        seeds: seedNames
      })
    }

    // 1. Generate and check domain variations
    if (mode.domains) {
      const variationMap = new Map<string, VariationCandidate>()
      for (const seed of seedNames) {
        const variations = generateDomainVariations(seed, tld)
        for (const variation of variations) {
          if (!variationMap.has(variation.domain)) {
            variationMap.set(variation.domain, variation)
          }
        }
      }

      const baseVariations = prioritizeVariations(
        Array.from(variationMap.values()),
        mode.variationLimit
      )
      const priorityVariations = buildPriorityDomains(seedNames, tld)
      const prioritySet = new Set(priorityVariations.map(item => item.domain))
      const variationsToCheck = [
        ...priorityVariations,
        ...baseVariations.filter(item => !prioritySet.has(item.domain))
      ].slice(0, mode.variationLimit)
      if (isDebugBrand) {
        console.log('[scan-debug] variations prepared', {
          brandId: brand.id,
          total: variationMap.size,
          limited: variationsToCheck.length,
          sample: variationsToCheck.slice(0, 10)
        })
      }

      for (const variation of variationsToCheck) {
        try {
          if (isDebugBrand && DEBUG_DOMAINS.includes(variation.domain.toLowerCase())) {
            console.log('[scan-debug] checking target domain', {
              brandId: brand.id,
              domain: variation.domain,
              type: variation.type
            })
          }
          // Use rate-limited queue for DNS check
          const isRegistered = await dnsQueue.add(async () => {
            return await checkDomainRegistration(variation.domain)
          })
          if (isDebugBrand && DEBUG_DOMAINS.includes(variation.domain.toLowerCase())) {
            console.log('[scan-debug] target domain result', {
              brandId: brand.id,
              domain: variation.domain,
              isRegistered
            })
          }
          domainsChecked++
          if (CANCEL_CHECK_EVERY > 0 && domainsChecked % CANCEL_CHECK_EVERY === 0) {
            await ensureNotCancelled()
          }

          // Update progress with step info
          await updateProgress('domains', domainsChecked, variationsToCheck.length)

          if (isRegistered) {
            const severity = assessThreatLevel(variation.type, true)

            if (severity !== 'low') {
              const { data: existingThreat } = await supabase
                .from('threats')
                .select('id')
                .eq('brand_id', brand.id)
                .eq('domain', variation.domain)
                .limit(1)
                .maybeSingle()

              if (!existingThreat) {
                const evidence = await collectEvidence({
                  url: `https://${variation.domain}`,
                  brandId: brand.id,
                  brandName: brand.name,
                  scanId,
                  supabase
                })
                const analysis = await buildThreatAnalysis({
                  threatType: 'typosquat_domain',
                  severity,
                  evidence,
                  brandName: brand.name,
                  brandDomain: brand.domain,
                  threatUrl: `https://${variation.domain}`
                })

                threats.push({
                  brand_id: brand.id,
                  scan_id: scanId,
                  type: 'typosquat_domain',
                  severity: analysis.compositeSeverity,
                  status: 'new',
                  url: `https://${variation.domain}`,
                  domain: variation.domain,
                  description: `Typosquatting domain detected (${variation.type})`,
                  evidence,
                  whois_data: evidence.whois_snapshots?.[0]?.data,
                  screenshot_url: evidence.screenshots?.[0]?.public_url,
                  threat_score: analysis.compositeScore,
                  analysis_version: analysis.version,
                  analysis,
                  detected_at: new Date().toISOString()
                })
                threatsFound++
                await updateProgress('domains', domainsChecked, variationsToCheck.length)
              }
            }
          }

          await sleep(100)
        } catch (err) {
          // Capture error but continue - don't crash scan
          partialErrors.push({
            type: 'dns_check',
            target: variation.domain,
            error: err instanceof Error ? err.message : 'Unknown error',
            timestamp: new Date().toISOString(),
            retryable: true
          })
          domainsChecked++ // Count even failures
          console.error(`Error checking domain ${variation.domain}:`, err)
        }
      }
    }
    await updateProgress('domains', domainsChecked, domainsChecked, true)

    // 2. Web scanning for lookalike pages
    if (mode.web) {
      await ensureNotCancelled()
      await updateProgress('web', 0, 1, true)

      try {
        const webThreats = await scanForThreats(
          brand.name,
          brand.domain,
          keywords || [],
          {
            onProgress: (delta) => {
              pagesScanned += delta
              void updateProgress('web', 0, 1)
            }
          }
        )

        for (const webThreat of webThreats) {
          const { data: existing } = await supabase
            .from('threats')
            .select('id')
            .eq('brand_id', brand.id)
            .eq('url', webThreat.url)
            .limit(1)
            .maybeSingle()

          if (!existing) {
            const url = webThreat.url
            const evidence = url ? await collectEvidence({
              url,
              brandId: brand.id,
              brandName: brand.name,
              scanId,
              supabase
            }) : webThreat.evidence

            let threatScreenshot: Buffer | null = null
            let officialSiteScreenshot: Buffer | null = null

            if (canRunOpenAIVision) {
              threatScreenshot = await fetchImageBuffer(evidence?.screenshots?.[0]?.public_url)
              if (!threatScreenshot) {
                threatScreenshot = await captureScreenshotBuffer(url)
              }
              if (threatScreenshot) {
                officialSiteScreenshot = await getOfficialScreenshot()
              }
            }

            const analysis = await buildThreatAnalysis({
              threatType: (webThreat.type || 'brand_impersonation') as ThreatType,
              severity: (webThreat.severity || 'low') as ThreatSeverity,
              evidence,
              brandName: brand.name,
              brandDomain: brand.domain,
              threatUrl: url,
              officialScreenshot: officialSiteScreenshot || undefined,
              threatScreenshot: threatScreenshot || undefined
            })

            threats.push({
              ...webThreat,
              brand_id: brand.id,
              scan_id: scanId,
              domain: webThreat.domain || extractDomainFromUrl(url),
              evidence: evidence || webThreat.evidence,
              whois_data: evidence?.whois_snapshots?.[0]?.data,
              screenshot_url: evidence?.screenshots?.[0]?.public_url,
              threat_score: analysis.compositeScore,
              analysis_version: analysis.version,
              analysis,
              severity: analysis.compositeSeverity
            })
            threatsFound++
            void updateProgress('web', 1, 1)
          }
        }
      } catch (err) {
        partialErrors.push({
          type: 'web_scan',
          error: err instanceof Error ? err.message : 'Unknown error',
          timestamp: new Date().toISOString(),
          retryable: true
        })
        // Continue to logo/social scanning
      }
      await updateProgress('web', 1, 1, true)
    }

    // 2b. Logo search for brand usage
    if (mode.logo && brand.logo_url) {
      await ensureNotCancelled()
      await updateProgress('logo', 0, 1, true)

      try {
        if (isDebugBrand) {
          console.log('[scan-debug] logo search start', {
            brandId: brand.id,
            logoUrl: brand.logo_url
          })
        }
        const logoResults = await searchLogoUsage(brand.logo_url)
        if (isDebugBrand) {
          console.log('[scan-debug] logo search results', {
            brandId: brand.id,
            count: logoResults.length,
            sample: logoResults.slice(0, 5)
          })
        }
        pagesScanned += logoResults.length
        void updateProgress('logo', 0, 1)

        for (const result of logoResults) {
          const url = result.url
          const resultDomain = extractDomainFromUrl(url)
          if (!url || (resultDomain && (resultDomain === brand.domain || resultDomain.endsWith(`.${brand.domain}`)))) {
            continue
          }

          const { data: existing } = await supabase
            .from('threats')
            .select('id')
            .eq('brand_id', brand.id)
            .eq('url', url)
            .limit(1)
            .maybeSingle()

          if (!existing) {
            const evidence = await collectEvidence({
              url,
              brandId: brand.id,
              brandName: brand.name,
              scanId,
              supabase
            })

            const analysis = await buildThreatAnalysis({
              threatType: 'trademark_abuse',
              severity: 'medium',
              evidence,
              brandName: brand.name,
              brandDomain: brand.domain,
              threatUrl: url
            })

            threats.push({
              brand_id: brand.id,
              scan_id: scanId,
              type: 'trademark_abuse',
              severity: analysis.compositeSeverity,
              status: 'new',
              url,
              domain: extractDomainFromUrl(url),
              title: result.title,
              description: `Logo match found via image search${result.source ? ` (${result.source})` : ''}.`,
              evidence,
              whois_data: evidence?.whois_snapshots?.[0]?.data,
              screenshot_url: evidence?.screenshots?.[0]?.public_url,
              threat_score: analysis.compositeScore,
              analysis_version: analysis.version,
              analysis,
              detected_at: new Date().toISOString()
            })
            threatsFound++
            void updateProgress('logo', 1, 1)
          }
        }
      } catch (err) {
        partialErrors.push({
          type: 'logo_scan',
          error: err instanceof Error ? err.message : 'Unknown error',
          timestamp: new Date().toISOString(),
          retryable: true
        })
      }
      await updateProgress('logo', 1, 1, true)
    }

    // 3. Social media scanning for fake accounts
    if (mode.social) {
      await ensureNotCancelled()
      await updateProgress('social', 0, 1, true)

      try {
        const socialThreats = await scanSocialMedia(
          brand.name,
          brand.social_handles || {},
          mode.socialPlatforms,
          {
            onProgress: (delta) => {
              pagesScanned += delta
              void updateProgress('social', 0, 1)
            }
          }
        )

        for (const socialThreat of socialThreats) {
          const { data: existing } = await supabase
            .from('threats')
            .select('id')
            .eq('brand_id', brand.id)
            .eq('url', socialThreat.url)
            .limit(1)
            .maybeSingle()

          if (!existing) {
            const analysis = await buildThreatAnalysis({
              threatType: (socialThreat.type || 'fake_social_account') as ThreatType,
              severity: (socialThreat.severity || 'low') as ThreatSeverity,
              evidence: socialThreat.evidence,
              brandName: brand.name,
              brandDomain: brand.domain,
              threatUrl: socialThreat.url
            })

            threats.push({
              ...socialThreat,
              brand_id: brand.id,
              scan_id: scanId,
              threat_score: analysis.compositeScore,
              analysis_version: analysis.version,
              analysis,
              severity: analysis.compositeSeverity
            })
            threatsFound++
            void updateProgress('social', 1, 1)
          }
        }
      } catch (err) {
        partialErrors.push({
          type: 'social_scan',
          error: err instanceof Error ? err.message : 'Unknown error',
          timestamp: new Date().toISOString(),
          retryable: true
        })
      }
      await updateProgress('social', 1, 1, true)
    }

    // 4. Save threats to database
    if (threats.length > 0) {
      const { error: threatError } = await supabase
        .from('threats')
        .insert(threats)

      if (threatError) {
        console.error('Error saving threats:', threatError)
      }
    }

    // 5. Update scan record
    await supabase
      .from('scans')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        threats_found: threatsFound,
        domains_checked: domainsChecked,
        pages_scanned: pagesScanned,
        overall_progress: 100,
        current_step: 'finalizing',
        step_progress: 1,
        step_total: 1,
        partial_errors: partialErrors
      })
      .eq('id', scanId)

    // 5b. Create in-app notifications
    if (brand.user_id) {
      // Threat notification (batched per scan)
      if (threats.length > 0) {
        try {
          await createThreatNotification(brand.user_id, brand, threats, scanId)
        } catch (notifError) {
          console.error('Failed to create threat notification:', notifError)
        }
      }

      // Scan completed notification
      try {
        await createScanCompletedNotification(brand.user_id, brand, scanId, {
          domainsChecked,
          threatsFound
        })
      } catch (notifError) {
        console.error('Failed to create scan completed notification:', notifError)
      }
    }

    // 6. Update brand threat count and last scan time
    const { count } = await supabase
      .from('threats')
      .select('*', { count: 'exact', head: true })
      .eq('brand_id', brand.id)
      .not('status', 'in', '("resolved","false_positive")')

    await supabase
      .from('brands')
      .update({
        threat_count: count || 0,
        last_scan_at: new Date().toISOString()
      })
      .eq('id', brand.id)

    // 7. Send alerts for automated scans
    if (triggerAlerts && threats.length > 0) {
      const user = brand.users

      if (user?.email) {
        const { data: alertSettings } = await supabase
          .from('alert_settings')
          .select('*')
          .eq('user_id', user.id)
          .single()

        const shouldAlert = alertSettings?.email_alerts !== false

        if (shouldAlert) {
          const alertEmail = alertSettings?.alert_email || user.email
          // Convert severity_threshold to severity array
          const thresholdToSeverities: Record<string, string[]> = {
            'critical': ['critical'],
            'high_critical': ['critical', 'high'],
            'all': ['critical', 'high', 'medium', 'low']
          }
          const alertSeverities = thresholdToSeverities[alertSettings?.severity_threshold || 'high_critical']
            || alertSettings?.alert_on_severity
            || ['critical', 'high']

          const alertableThreats = threats.filter(t =>
            alertSeverities.includes(t.severity as string)
          )

          if (alertableThreats.length > 0) {
            try {
              await sendThreatAlert(alertEmail, brand, alertableThreats as Threat[])
            } catch (emailError) {
              console.error(`Failed to send alert email for brand ${brand.id}:`, emailError)
            }
          }
        }

        if (user.subscription_tier === 'enterprise' && alertSettings?.webhook_url) {
          try {
            await sendThreatDetectedWebhook(
              alertSettings.webhook_url,
              brand,
              threats as Threat[],
              alertSettings.webhook_secret
            )
          } catch (webhookError) {
            console.error(`Failed to send webhook for brand ${brand.id}:`, webhookError)
          }
        }

        // Send scan summary email if enabled
        if (alertSettings?.scan_summary_emails !== false) {
          const summaryEmail = alertSettings?.alert_email || user.email
          try {
            await sendScanSummary(summaryEmail, brand, {
              domainsChecked,
              threatsFound,
              threats: threats as Threat[]
            })
          } catch (summaryError) {
            console.error(`Failed to send scan summary for brand ${brand.id}:`, summaryError)
          }
        }
      }
    }
  } catch (error) {
    // Clear queues on error/cancellation
    clearAllQueues()

    await supabase
      .from('scans')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        partial_errors: partialErrors
      })
      .eq('id', scanId)

    throw error
  }
}
