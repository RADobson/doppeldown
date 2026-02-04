type ProviderResult = {
  provider: string
  ok: boolean
  balanceUsd?: number
  creditLimitUsd?: number
  usedUsd?: number
  remainingUsd?: number
  raw?: unknown
  error?: string
  updatedAt: string
}

const nowIso = () => new Date().toISOString()

async function fetchJson(url: string, init: RequestInit & { timeoutMs?: number } = {}) {
  const { timeoutMs = 12000, ...rest } = init
  const res = await fetch(url, { ...rest, signal: AbortSignal.timeout(timeoutMs) })
  const text = await res.text().catch(() => '')
  let json: any = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    // ignore
  }
  return { res, text, json }
}

export async function getOpenAIUsage(): Promise<ProviderResult> {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    return { provider: 'openai', ok: false, error: 'OPENAI_API_KEY not configured', updatedAt: nowIso() }
  }

  const headers = { Authorization: `Bearer ${key}` }

  // OpenAI has multiple billing endpoints; best-effort.
  // 1) credit grants (remaining balance)
  const credit = await fetchJson('https://api.openai.com/v1/dashboard/billing/credit_grants', { headers, timeoutMs: 12000 })

  if (!credit.res.ok) {
    return {
      provider: 'openai',
      ok: false,
      error: `Failed to fetch OpenAI credits (${credit.res.status})`,
      raw: credit.json || credit.text,
      updatedAt: nowIso(),
    }
  }

  const g = credit.json
  const totalGranted = Number(g?.total_granted ?? 0)
  const totalUsed = Number(g?.total_used ?? 0)
  const totalAvailable = Number(g?.total_available ?? (totalGranted - totalUsed))

  return {
    provider: 'openai',
    ok: true,
    balanceUsd: totalAvailable,
    creditLimitUsd: totalGranted,
    usedUsd: totalUsed,
    remainingUsd: totalAvailable,
    raw: { total_granted: totalGranted, total_used: totalUsed, total_available: totalAvailable },
    updatedAt: nowIso(),
  }
}

export async function getOpenRouterUsage(): Promise<ProviderResult> {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) {
    return { provider: 'openrouter', ok: false, error: 'OPENROUTER_API_KEY not configured', updatedAt: nowIso() }
  }

  const headers = { Authorization: `Bearer ${key}` }
  const r = await fetchJson('https://openrouter.ai/api/v1/credits', { headers, timeoutMs: 12000 })

  if (!r.res.ok) {
    return {
      provider: 'openrouter',
      ok: false,
      error: `Failed to fetch OpenRouter credits (${r.res.status})`,
      raw: r.json || r.text,
      updatedAt: nowIso(),
    }
  }

  const data = r.json?.data || r.json
  // Typical fields: total_credits, total_usage
  const totalCredits = Number(data?.total_credits ?? data?.totalCredits ?? 0)
  const totalUsage = Number(data?.total_usage ?? data?.totalUsage ?? 0)
  const remaining = Number(data?.remaining_credits ?? data?.remaining ?? (totalCredits - totalUsage))

  return {
    provider: 'openrouter',
    ok: true,
    balanceUsd: remaining,
    creditLimitUsd: totalCredits,
    usedUsd: totalUsage,
    remainingUsd: remaining,
    raw: data,
    updatedAt: nowIso(),
  }
}

export async function getAnthropicUsage(): Promise<ProviderResult> {
  // Anthropic does not provide a stable public “credit balance” API like OpenAI.
  // We surface configuration presence only.
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) {
    return { provider: 'anthropic', ok: false, error: 'ANTHROPIC_API_KEY not configured', updatedAt: nowIso() }
  }
  return {
    provider: 'anthropic',
    ok: false,
    error: 'No reliable public Anthropic balance endpoint available; check Anthropic console for credits.',
    updatedAt: nowIso(),
  }
}

export async function getMoonshotUsage(): Promise<ProviderResult> {
  const key = process.env.MOONSHOT_API_KEY || process.env.KIMI_API_KEY
  if (!key) {
    return { provider: 'moonshot', ok: false, error: 'MOONSHOT_API_KEY/KIMI_API_KEY not configured', updatedAt: nowIso() }
  }
  return {
    provider: 'moonshot',
    ok: false,
    error: 'No supported Moonshot/Kimi credit endpoint configured; check provider console.',
    updatedAt: nowIso(),
  }
}

export async function getModelApiUsageSnapshot() {
  const results = await Promise.all([
    getOpenAIUsage(),
    getOpenRouterUsage(),
    getAnthropicUsage(),
    getMoonshotUsage(),
  ])

  const totals = results.reduce(
    (acc, r) => {
      if (r.ok && typeof r.remainingUsd === 'number') acc.totalRemainingUsd += r.remainingUsd
      if (r.ok && typeof r.usedUsd === 'number') acc.totalUsedUsd += r.usedUsd
      return acc
    },
    { totalRemainingUsd: 0, totalUsedUsd: 0 }
  )

  return {
    generatedAt: nowIso(),
    providers: results,
    ...totals,
  }
}
