import type { PageAnalysis } from '../types'

type OpenAIResponse = {
  output_text?: string
  output?: Array<{
    content?: Array<{
      type?: string
      text?: string
    }>
  }>
}

type VisualSimilarityResult = {
  similarity_score: number
  confidence: number
  rationale: string
  model: string
}

type PhishingIntentResult = {
  intent: 'phishing' | 'suspicious' | 'benign' | 'unknown'
  score: number
  confidence: number
  signals: string[]
  rationale: string
  model: string
}

const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
const OPENAI_VISION_MODEL = process.env.OPENAI_VISION_MODEL || 'gpt-4o-mini'
const OPENAI_INTENT_MODEL = process.env.OPENAI_INTENT_MODEL || 'gpt-4o-mini'
const OPENAI_TIMEOUT_MS = parseInt(process.env.OPENAI_TIMEOUT_MS || '15000', 10)

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

function bufferToDataUrl(buffer: Buffer, mimeType: string = 'image/png') {
  return `data:${mimeType};base64,${buffer.toString('base64')}`
}

function getApiKey(): string | null {
  return process.env.OPENAI_API_KEY || null
}

function extractOutputText(payload: OpenAIResponse): string | null {
  if (payload.output_text) return payload.output_text
  if (!payload.output?.length) return null

  const chunks: string[] = []
  for (const item of payload.output) {
    for (const content of item.content || []) {
      if (content?.text) {
        chunks.push(content.text)
      }
    }
  }

  if (chunks.length === 0) return null
  return chunks.join('')
}

async function createResponse(payload: Record<string, unknown>, timeoutMs = OPENAI_TIMEOUT_MS) {
  const apiKey = getApiKey()
  if (!apiKey) return null

  const response = await fetch(`${OPENAI_BASE_URL}/responses`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(timeoutMs)
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    console.error('OpenAI response error:', response.status, body)
    return null
  }

  return response.json() as Promise<OpenAIResponse>
}

export function isOpenAIEnabled(): boolean {
  return Boolean(getApiKey())
}

export async function analyzeVisualSimilarityOpenAI(params: {
  officialImage: Buffer
  suspectImage: Buffer
  brandName?: string
}): Promise<VisualSimilarityResult | null> {
  if (!isOpenAIEnabled()) return null

  const systemPrompt = [
    'You are a security analyst comparing two website screenshots.',
    'Return a JSON object with similarity_score (0 to 1), confidence (0 to 1), and a short rationale.',
    'Similarity is visual likeness in branding, layout, logos, colors, and typography.'
  ].join(' ')

  const userPrompt = params.brandName
    ? `Compare Image A (official ${params.brandName} site) vs Image B (suspected site).`
    : 'Compare Image A (official site) vs Image B (suspected site).'

  const response = await createResponse({
    model: OPENAI_VISION_MODEL,
    input: [
      {
        role: 'user',
        content: [
          { type: 'input_text', text: systemPrompt },
          { type: 'input_text', text: userPrompt },
          { type: 'input_text', text: 'Image A: Official site screenshot.' },
          { type: 'input_image', image_url: bufferToDataUrl(params.officialImage) },
          { type: 'input_text', text: 'Image B: Suspected site screenshot.' },
          { type: 'input_image', image_url: bufferToDataUrl(params.suspectImage) }
        ]
      }
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'visual_similarity',
        strict: true,
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            similarity_score: { type: 'number', minimum: 0, maximum: 1 },
            confidence: { type: 'number', minimum: 0, maximum: 1 },
            rationale: { type: 'string' }
          },
          required: ['similarity_score', 'confidence', 'rationale']
        }
      }
    }
  })

  if (!response) return null
  const text = extractOutputText(response)
  if (!text) return null

  try {
    const parsed = JSON.parse(text) as Omit<VisualSimilarityResult, 'model'>
    return {
      similarity_score: clamp01(parsed.similarity_score),
      confidence: clamp01(parsed.confidence),
      rationale: parsed.rationale,
      model: OPENAI_VISION_MODEL
    }
  } catch (error) {
    console.error('OpenAI visual similarity parse error:', error)
    return null
  }
}

export async function analyzePhishingIntentOpenAI(params: {
  brandName?: string
  brandDomain?: string
  url?: string
  pageText: string
  pageAnalysis?: PageAnalysis
}): Promise<PhishingIntentResult | null> {
  if (!isOpenAIEnabled()) return null

  const systemPrompt = [
    'You are a security analyst classifying phishing intent for a webpage.',
    'Return JSON with intent, score (0 to 1), confidence (0 to 1), signals (array), and rationale.',
    'Intent values: phishing, suspicious, benign, unknown.'
  ].join(' ')

  const context = {
    brand_name: params.brandName || null,
    brand_domain: params.brandDomain || null,
    url: params.url || null,
    heuristic_signals: params.pageAnalysis || null,
    page_text: params.pageText
  }

  const response = await createResponse({
    model: OPENAI_INTENT_MODEL,
    input: [
      {
        role: 'user',
        content: [
          { type: 'input_text', text: systemPrompt },
          { type: 'input_text', text: JSON.stringify(context) }
        ]
      }
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'phishing_intent',
        strict: true,
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            intent: { type: 'string', enum: ['phishing', 'suspicious', 'benign', 'unknown'] },
            score: { type: 'number', minimum: 0, maximum: 1 },
            confidence: { type: 'number', minimum: 0, maximum: 1 },
            signals: { type: 'array', items: { type: 'string' } },
            rationale: { type: 'string' }
          },
          required: ['intent', 'score', 'confidence', 'signals', 'rationale']
        }
      }
    }
  }, 12000)

  if (!response) return null
  const text = extractOutputText(response)
  if (!text) return null

  try {
    const parsed = JSON.parse(text) as Omit<PhishingIntentResult, 'model'>
    return {
      intent: parsed.intent,
      score: clamp01(parsed.score),
      confidence: clamp01(parsed.confidence),
      signals: Array.isArray(parsed.signals) ? parsed.signals : [],
      rationale: parsed.rationale,
      model: OPENAI_INTENT_MODEL
    }
  } catch (error) {
    console.error('OpenAI phishing intent parse error:', error)
    return null
  }
}
