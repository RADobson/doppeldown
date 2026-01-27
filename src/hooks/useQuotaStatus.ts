import { useState, useEffect, useCallback } from 'react'

export interface QuotaStatus {
  limit: number | null
  used: number
  remaining: number | null
  resetsAt: number | null
  isUnlimited: boolean
}

export function useQuotaStatus() {
  const [quota, setQuota] = useState<QuotaStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQuota = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/scan/quota')
      if (!response.ok) throw new Error('Failed to fetch quota')
      const data = await response.json()
      setQuota(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuota()
  }, [fetchQuota])

  return { quota, loading, error, refetch: fetchQuota }
}
