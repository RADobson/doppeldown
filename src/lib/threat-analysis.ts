import {
  Evidence,
  HtmlSnapshot,
  ThreatAnalysis,
  ThreatSeverity,
  ThreatType
} from '../types'
import {
  analyzePhishingIntentOpenAI,
  analyzeVisualSimilarityOpenAI,
  isOpenAIEnabled
} from './openai-analysis'

const ANALYSIS_VERSION = 'v1'
const DEFAULT_WEIGHTS = {
  domainRisk: 0.35,
  visualSimilarity: 0.4,
  phishingIntent: 0.25
}

const MAX_INTENT_TEXT_CHARS = parseInt(process.env.PHISHING_INTENT_MAX_CHARS || '4000', 10)
const OPENAI_INTENT_ENABLED = process.env.OPENAI_INTENT_ENABLED !== 'false'
const OPENAI_VISION_ENABLED = process.env.OPENAI_VISION_ENABLED !== 'false'
const VISION_PROVIDER = (process.env.VISION_PROVIDER || '').toLowerCase()

const TYPE_RISK: Record<ThreatType, number> = {
  typosquat_domain: 0.7,
  lookalike_website: 0.75,
  phishing_page: 0.95,
  fake_social_account: 0.6,
  brand_impersonation: 0.65,
  trademark_abuse: 0.5
}

const SEVERITY_RISK: Record<ThreatSeverity, number> = {
  critical: 0.95,
  high: 0.75,
  medium: 0.55,
  low: 0.3
}

const INTENT_KEYWORDS: Array<{ id: string; weight: number; patterns: string[] }> = [
  {
    id: 'credential_keywords',
    weight: 0.12,
    patterns: ['password', 'login', 'signin', 'sign in', 'verify', 'account', 'credential']
  },
  {
    id: 'urgency_keywords',
    weight: 0.1,
    patterns: ['urgent', 'immediately', 'act now', 'limited time', 'suspended', 'locked']
  },
  {
    id: 'payment_keywords',
    weight: 0.1,
    patterns: ['payment', 'billing', 'card number', 'cvv', 'bank', 'wallet']
  }
]

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))
const unique = (items: string[]) => Array.from(new Set(items))

function mapScoreToSeverity(score: number): ThreatSeverity {
  if (score >= 85) return 'critical'
  if (score >= 70) return 'high'
  if (score >= 45) return 'medium'
  return 'low'
}

function getPrimaryHtmlSnapshot(evidence?: Evidence): HtmlSnapshot | undefined {
  if (!evidence?.html_snapshots?.length) return undefined
  return evidence.html_snapshots[0]
}

function computeDomainRiskScore(threatType: ThreatType, severity: ThreatSeverity): number {
  const typeRisk = TYPE_RISK[threatType] ?? 0.4
  const severityRisk = SEVERITY_RISK[severity] ?? 0.4
  return clamp01(Math.max(typeRisk, severityRisk))
}

function computeVisualSimilarity(evidence?: Evidence): {
  score: number | null
  status: ThreatAnalysis['visualSimilarityStatus']
  provider?: string
} {
  const hasScreenshot = Boolean(evidence?.screenshots && evidence.screenshots.length > 0)
  if (!hasScreenshot) {
    return { score: null, status: 'unavailable' }
  }

  const provider = (process.env.VISION_PROVIDER || '').trim()
  if (!provider) {
    return { score: null, status: 'pending' }
  }

  return { score: null, status: 'pending', provider }
}

function computePhishingIntent(
  snapshot?: HtmlSnapshot,
  brandName?: string
): { score: number; signals: string[]; available: boolean } {
  const analysis = snapshot?.analysis
  const html = snapshot?.html || snapshot?.html_preview || ''
  const htmlLower = html.toLowerCase()
  const signals: string[] = []
  let score = 0

  const hasContent = Boolean(html || analysis)

  if (analysis?.hasLoginForm) {
    score += 0.4
    signals.push('login_form')
  }

  if (analysis?.hasPaymentForm) {
    score += 0.25
    signals.push('payment_form')
  }

  if ((analysis?.hasBrandMentions || 0) >= 3 || (brandName && htmlLower.includes(brandName.toLowerCase()))) {
    score += 0.1
    signals.push('brand_mentions')
  }

  if (analysis?.suspiciousElements?.length) {
    const bump = Math.min(0.2, analysis.suspiciousElements.length * 0.05)
    score += bump
    signals.push('suspicious_elements')
  }

  for (const keywordGroup of INTENT_KEYWORDS) {
    const matched = keywordGroup.patterns.some(pattern => htmlLower.includes(pattern))
    if (matched) {
      score += keywordGroup.weight
      signals.push(keywordGroup.id)
    }
  }

  return { score: clamp01(score), signals, available: hasContent }
}

function stripHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildIntentText(snapshot?: HtmlSnapshot): string {
  const html = snapshot?.html || snapshot?.html_preview || ''
  if (!html) return ''
  const text = stripHtml(html)
  if (text.length <= MAX_INTENT_TEXT_CHARS) return text
  return text.slice(0, MAX_INTENT_TEXT_CHARS)
}

function computeCompositeScore(params: {
  domainRiskScore: number
  visualSimilarityScore: number | null
  phishingIntentScore: number
  intentAvailable: boolean
}) {
  const weights = {
    domainRisk: DEFAULT_WEIGHTS.domainRisk,
    visualSimilarity: params.visualSimilarityScore === null ? 0 : DEFAULT_WEIGHTS.visualSimilarity,
    phishingIntent: params.intentAvailable ? DEFAULT_WEIGHTS.phishingIntent : 0
  }

  const weightSum = weights.domainRisk + weights.visualSimilarity + weights.phishingIntent
  if (weightSum <= 0) {
    return { compositeScore: Math.round(params.domainRiskScore * 100), weights: weights }
  }

  const normalized =
    (params.domainRiskScore * weights.domainRisk +
      (params.visualSimilarityScore ?? 0) * weights.visualSimilarity +
      params.phishingIntentScore * weights.phishingIntent) /
    weightSum

  const compositeScore = Math.round(normalized * 100)
  const effectiveWeights = {
    domainRisk: weights.domainRisk / weightSum,
    visualSimilarity: weights.visualSimilarity / weightSum,
    phishingIntent: weights.phishingIntent / weightSum
  }

  return { compositeScore, weights: effectiveWeights }
}

export async function buildThreatAnalysis(params: {
  threatType: ThreatType
  severity: ThreatSeverity
  evidence?: Evidence
  brandName?: string
  brandDomain?: string
  threatUrl?: string
  officialScreenshot?: Buffer | null
  threatScreenshot?: Buffer | null
}): Promise<ThreatAnalysis> {
  const domainRiskScore = computeDomainRiskScore(params.threatType, params.severity)
  const snapshot = getPrimaryHtmlSnapshot(params.evidence)
  const intent = computePhishingIntent(snapshot, params.brandName)
  const intentText = buildIntentText(snapshot)

  let visualScore = computeVisualSimilarity(params.evidence)
  let visualConfidence: number | undefined
  let visualRationale: string | undefined
  let visualModel: string | undefined

  let intentScore = intent.score
  let intentSignals = intent.signals
  let intentClass: ThreatAnalysis['phishingIntentClass'] = intent.score >= 0.75
    ? 'phishing'
    : intent.score >= 0.5
      ? 'suspicious'
      : intent.score > 0
        ? 'benign'
        : 'unknown'
  let intentConfidence: number | undefined
  let intentRationale: string | undefined
  let intentModel: string | undefined
  let intentSource: ThreatAnalysis['phishingIntentSource'] = 'heuristic'

  const openAiEnabled = isOpenAIEnabled()
  const canRunVision = openAiEnabled && OPENAI_VISION_ENABLED && VISION_PROVIDER === 'openai'
  const canRunIntent = openAiEnabled && OPENAI_INTENT_ENABLED && intentText.length > 0

  if (canRunVision && params.officialScreenshot && params.threatScreenshot) {
    const vision = await analyzeVisualSimilarityOpenAI({
      officialImage: params.officialScreenshot,
      suspectImage: params.threatScreenshot,
      brandName: params.brandName
    })

    if (vision) {
      visualScore = {
        score: vision.similarity_score,
        status: 'computed',
        provider: 'openai'
      }
      visualConfidence = vision.confidence
      visualRationale = vision.rationale
      visualModel = vision.model
    }
  }

  if (canRunIntent) {
    const aiIntent = await analyzePhishingIntentOpenAI({
      brandName: params.brandName,
      brandDomain: params.brandDomain,
      url: params.threatUrl,
      pageText: intentText,
      pageAnalysis: snapshot?.analysis
    })

    if (aiIntent) {
      intentScore = aiIntent.score
      intentSignals = unique([...intentSignals, ...aiIntent.signals])
      intentClass = aiIntent.intent
      intentConfidence = aiIntent.confidence
      intentRationale = aiIntent.rationale
      intentModel = aiIntent.model
      intentSource = 'openai'
    }
  }

  const composite = computeCompositeScore({
    domainRiskScore,
    visualSimilarityScore: visualScore.score,
    phishingIntentScore: intentScore,
    intentAvailable: intent.available || canRunIntent
  })

  return {
    version: ANALYSIS_VERSION,
    domainRiskScore,
    visualSimilarityScore: visualScore.score,
    visualSimilarityStatus: visualScore.status,
    visualSimilarityProvider: visualScore.provider,
    visualSimilarityConfidence: visualConfidence,
    visualSimilarityRationale: visualRationale,
    visualSimilarityModel: visualModel,
    phishingIntentScore: intentScore,
    phishingIntentSignals: intentSignals,
    phishingIntentClass: intentClass,
    phishingIntentConfidence: intentConfidence,
    phishingIntentRationale: intentRationale,
    phishingIntentModel: intentModel,
    phishingIntentSource: intentSource,
    compositeScore: composite.compositeScore,
    compositeSeverity: mapScoreToSeverity(composite.compositeScore),
    weights: composite.weights
  }
}

export const THREAT_ANALYSIS_VERSION = ANALYSIS_VERSION
