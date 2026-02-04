import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAllowedAdminEmail } from '@/lib/admin/allowed-admin'

type Provider = {
  provider: string
  ok: boolean
  balanceUsd?: number
  creditLimitUsd?: number
  usedUsd?: number
  remainingUsd?: number
  error?: string
  updatedAt: string
}

function usd(n?: number) {
  if (typeof n !== 'number' || Number.isNaN(n)) return '—'
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}

export default async function ModelUsageAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')
  if (!isAllowedAdminEmail(user.email)) redirect('/dashboard')

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://doppeldown.com'}/api/admin/model-usage`, {
    cache: 'no-store',
    headers: { cookie: (await (await import('next/headers')).cookies()).toString?.() as any },
  }).catch(() => null)

  // If server-side fetch with cookies fails in some runtimes, fall back to relative fetch
  const json = res && res.ok ? await res.json() : await fetch('/api/admin/model-usage', { cache: 'no-store' }).then(r => r.json())

  const data = json?.data || json
  const providers: Provider[] = data?.providers || []

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Model API Credits</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visible only to <code>@dobsondevelopment.com.au</code> and <code>@doppeldown.com</code> accounts.
        </p>
        <p className="text-xs text-muted-foreground mt-1">Generated at: {data?.generatedAt || '—'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((p) => (
          <div key={p.provider} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold capitalize">{p.provider}</div>
              <div className={p.ok ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
                {p.ok ? 'OK' : 'Needs attention'}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Remaining</div>
              <div className="text-right font-medium">{usd(p.remainingUsd ?? p.balanceUsd)}</div>

              <div className="text-muted-foreground">Used</div>
              <div className="text-right">{usd(p.usedUsd)}</div>

              <div className="text-muted-foreground">Credit limit</div>
              <div className="text-right">{usd(p.creditLimitUsd)}</div>
            </div>

            {p.error && (
              <div className="mt-3 text-xs text-red-600 whitespace-pre-wrap">{p.error}</div>
            )}
            <div className="mt-2 text-xs text-muted-foreground">Updated: {p.updatedAt}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-sm text-muted-foreground">
        <p>
          Notes: OpenAI and OpenRouter support credit/balance APIs. Anthropic/Moonshot may require checking the provider console
          depending on account type and API availability.
        </p>
      </div>
    </div>
  )
}
