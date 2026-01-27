'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ExternalLink,
  Download,
  Flag,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Calendar,
  Building,
  Server,
  FileText,
  Camera,
  Code,
  Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SeverityBadge, StatusBadge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface ThreatAnalysis {
  compositeScore?: number
  compositeSeverity?: string
  domainRiskScore?: number
  visualSimilarityScore?: number | null
  visualSimilarityStatus?: string
  visualSimilarityProvider?: string
  visualSimilarityConfidence?: number
  visualSimilarityRationale?: string
  visualSimilarityModel?: string
  phishingIntentScore?: number
  phishingIntentSignals?: string[]
  phishingIntentClass?: string
  phishingIntentConfidence?: number
  phishingIntentRationale?: string
  phishingIntentModel?: string
  phishingIntentSource?: string
}

interface Threat {
  id: string
  brand_id: string
  url: string
  domain: string
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: string
  title: string | null
  description: string | null
  detected_at: string
  whois_data: any
  evidence: any
  notes: string | null
  brands: { name: string }
  threat_score?: number | null
  analysis?: ThreatAnalysis | null
  analysis_version?: string | null
}

const threatTypeLabels: Record<string, string> = {
  phishing_page: 'Phishing Page',
  typosquat_domain: 'Typosquat Domain',
  lookalike_website: 'Lookalike Website',
  fake_social_account: 'Fake Social Account',
  brand_impersonation: 'Brand Impersonation',
  trademark_abuse: 'Trademark Abuse'
}

const statusOptions = [
  { value: 'new', label: 'New', icon: Clock },
  { value: 'investigating', label: 'Investigating', icon: Flag },
  { value: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { value: 'takedown_requested', label: 'Takedown Requested', icon: FileText },
  { value: 'resolved', label: 'Resolved', icon: CheckCircle },
  { value: 'false_positive', label: 'False Positive', icon: XCircle }
]

export default function ThreatDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [threat, setThreat] = useState<Threat | null>(null)
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const [screenshotLoading, setScreenshotLoading] = useState(false)
  const [screenshotError, setScreenshotError] = useState<string | null>(null)
  const [htmlSnapshotUrl, setHtmlSnapshotUrl] = useState<string | null>(null)
  const [htmlSnapshotContent, setHtmlSnapshotContent] = useState<string | null>(null)
  const [htmlSnapshotLoading, setHtmlSnapshotLoading] = useState(false)
  const [htmlSnapshotError, setHtmlSnapshotError] = useState<string | null>(null)
  const [showHtmlFrame, setShowHtmlFrame] = useState(false)
  const [screenshotCopied, setScreenshotCopied] = useState(false)
  const [htmlCopied, setHtmlCopied] = useState(false)
  const screenshotCopyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const htmlCopyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function requestSignedUrl(
    kind: 'screenshot' | 'html',
    attempts = 3,
    isCancelled?: () => boolean
  ) {
    if (!threat) {
      throw new Error('Missing threat')
    }

    let lastError: Error | null = null

    for (let attempt = 0; attempt < attempts; attempt++) {
      if (isCancelled?.()) {
        throw new Error('Cancelled')
      }

      try {
        const response = await fetch('/api/evidence/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            threatId: threat.id,
            kind,
            index: 0
          })
        })
        const data = await response.json()
        if (!response.ok || !data?.signedUrl) {
          throw new Error(data?.error || 'Failed to sign evidence URL')
        }
        return data.signedUrl as string
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Failed to sign evidence URL')
        if (attempt < attempts - 1) {
          const delay = 400 * Math.pow(2, attempt)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
        throw lastError
      }
    }

    throw lastError || new Error('Failed to sign evidence URL')
  }

  useEffect(() => {
    fetchThreat()
  }, [params.id])

  useEffect(() => {
    let cancelled = false

    if (!threat) {
      setScreenshotUrl(null)
      setScreenshotError(null)
      setScreenshotLoading(false)
      setHtmlSnapshotUrl(null)
      setHtmlSnapshotContent(null)
      setHtmlSnapshotError(null)
      setHtmlSnapshotLoading(false)
      setShowHtmlFrame(false)
      return
    }

    async function loadScreenshot() {
      if (!threat) return
      setScreenshotError(null)

      const directUrl = (threat as any).screenshot_url || threat.evidence?.screenshots?.[0]?.public_url
      if (directUrl) {
        setScreenshotUrl(directUrl)
        return
      }

      const hasStoragePath = Boolean(threat.evidence?.screenshots?.[0]?.storage_path)
      if (!hasStoragePath) {
        setScreenshotUrl(null)
        return
      }

      setScreenshotLoading(true)
      try {
        const signedUrl = await requestSignedUrl('screenshot', 3, () => cancelled)
        if (!cancelled) {
          setScreenshotUrl(signedUrl)
        }
      } catch (error) {
        if (!cancelled) {
          setScreenshotError(error instanceof Error ? error.message : 'Failed to load screenshot')
        }
      } finally {
        if (!cancelled) {
          setScreenshotLoading(false)
        }
      }
    }

    loadScreenshot()

    return () => {
      cancelled = true
    }
  }, [threat])

  useEffect(() => {
    return () => {
      if (screenshotCopyTimeout.current) {
        clearTimeout(screenshotCopyTimeout.current)
      }
      if (htmlCopyTimeout.current) {
        clearTimeout(htmlCopyTimeout.current)
      }
    }
  }, [])

  async function refreshScreenshotUrl() {
    if (!threat) return
    if (!threat.evidence?.screenshots?.[0]?.storage_path) return
    setScreenshotLoading(true)
    setScreenshotError(null)
    try {
      const signedUrl = await requestSignedUrl('screenshot')
      setScreenshotUrl(signedUrl)
    } catch (error) {
      setScreenshotError(error instanceof Error ? error.message : 'Failed to refresh screenshot')
    } finally {
      setScreenshotLoading(false)
    }
  }

  async function loadHtmlSnapshot() {
    if (!threat) return
    if (!threat.evidence?.html_snapshots?.[0]?.storage_path) return
    setHtmlSnapshotLoading(true)
    setHtmlSnapshotError(null)
    try {
      const signedUrl = await requestSignedUrl('html')
      const htmlResponse = await fetch(signedUrl)
      const htmlText = await htmlResponse.text()
      setHtmlSnapshotUrl(signedUrl)
      setHtmlSnapshotContent(htmlText)
    } catch (error) {
      setHtmlSnapshotError(error instanceof Error ? error.message : 'Failed to load HTML snapshot')
    } finally {
      setHtmlSnapshotLoading(false)
    }
  }

  async function refreshHtmlSnapshotUrl() {
    if (!threat) return
    if (!threat.evidence?.html_snapshots?.[0]?.storage_path) return
    setHtmlSnapshotLoading(true)
    setHtmlSnapshotError(null)
    try {
      const signedUrl = await requestSignedUrl('html')
      setHtmlSnapshotUrl(signedUrl)
    } catch (error) {
      setHtmlSnapshotError(error instanceof Error ? error.message : 'Failed to refresh HTML snapshot')
    } finally {
      setHtmlSnapshotLoading(false)
    }
  }

  async function toggleHtmlFrame() {
    const next = !showHtmlFrame
    setShowHtmlFrame(next)
    if (next && !htmlSnapshotContent) {
      await loadHtmlSnapshot()
    }
  }

  async function copyEvidenceUrl(url: string, kind: 'screenshot' | 'html') {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = url
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      if (kind === 'screenshot') {
        setScreenshotCopied(true)
        if (screenshotCopyTimeout.current) clearTimeout(screenshotCopyTimeout.current)
        screenshotCopyTimeout.current = setTimeout(() => setScreenshotCopied(false), 2000)
      } else {
        setHtmlCopied(true)
        if (htmlCopyTimeout.current) clearTimeout(htmlCopyTimeout.current)
        htmlCopyTimeout.current = setTimeout(() => setHtmlCopied(false), 2000)
      }
    } catch {
      if (kind === 'screenshot') {
        setScreenshotError('Failed to copy URL')
      } else {
        setHtmlSnapshotError('Failed to copy URL')
      }
    }
  }

  async function fetchThreat() {
    try {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('threats')
        .select('*, brands!inner(name, user_id)')
        .eq('id', params.id)
        .eq('brands.user_id', user.id)
        .single()

      if (error || !data) {
        router.push('/dashboard/threats')
        return
      }

      setThreat(data)
      setStatus(data.status)
      setNotes(data.notes || '')
    } catch (error) {
      console.error('Error fetching threat:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!threat) return
    setSaving(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('threats')
        .update({
          status,
          notes,
          resolved_at: status === 'resolved' ? new Date().toISOString() : null
        })
        .eq('id', threat.id)

      if (error) throw error

      setThreat({ ...threat, status, notes })
      alert('Changes saved successfully')
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!threat) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Threat not found</p>
        <Link href="/dashboard/threats">
          <Button variant="outline" className="mt-4">Back to Threats</Button>
        </Link>
      </div>
    )
  }

  const htmlSnapshots = threat.evidence?.html_snapshots || []
  const brandName = threat.brands?.name || ''
  const brandPattern = brandName
    ? new RegExp(brandName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    : null

  const analysisResults = {
    hasLoginForm: htmlSnapshots.some((s: any) => {
      if (typeof s.analysis?.hasLoginForm === 'boolean') return s.analysis.hasLoginForm
      const html = s.html || s.html_preview
      return html ? html.toLowerCase().includes('password') : false
    }),
    hasPaymentForm: htmlSnapshots.some((s: any) => {
      if (typeof s.analysis?.hasPaymentForm === 'boolean') return s.analysis.hasPaymentForm
      const html = s.html || s.html_preview
      return html
        ? html.toLowerCase().includes('credit') || html.toLowerCase().includes('payment')
        : false
    }),
    brandMentions: htmlSnapshots.reduce((count: number, s: any) => {
      const analysisMentions = s.analysis?.hasBrandMentions ?? s.analysis?.brandMentions
      if (typeof analysisMentions === 'number') {
        return count + analysisMentions
      }
      const html = s.html || s.html_preview
      if (!html || !brandPattern) return count
      const matches = html.match(brandPattern)
      return count + (matches?.length || 0)
    }, 0)
  }

  const analysis = threat.analysis || {}
  const compositeScore = typeof threat.threat_score === 'number'
    ? Math.round(threat.threat_score)
    : (typeof analysis.compositeScore === 'number' ? Math.round(analysis.compositeScore) : null)
  const visualScore = typeof analysis.visualSimilarityScore === 'number'
    ? Math.round(analysis.visualSimilarityScore * 100)
    : null
  const intentScore = typeof analysis.phishingIntentScore === 'number'
    ? Math.round(analysis.phishingIntentScore * 100)
    : null
  const intentSignals = Array.isArray(analysis.phishingIntentSignals) ? analysis.phishingIntentSignals : []
  const visualStatus = analysis.visualSimilarityStatus || (visualScore !== null ? 'computed' : 'unavailable')
  const intentClass = analysis.phishingIntentClass || (intentScore !== null ? 'suspicious' : 'unknown')
  const intentSource = analysis.phishingIntentSource || (intentScore !== null ? 'heuristic' : 'unknown')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/threats">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Threats
          </Button>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <SeverityBadge severity={threat.severity} />
            <span className="text-muted-foreground">{threatTypeLabels[threat.type] || threat.type}</span>
            {compositeScore !== null && (
              <span className="text-xs font-medium text-muted-foreground bg-accent border border-border rounded-full px-2 py-0.5">
                Score {compositeScore}
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-foreground break-all">{threat.url}</h1>
          <p className="text-muted-foreground mt-1">
            Detected {formatDateTime(threat.detected_at)} • {threat.brands?.name}
          </p>
        </div>
        <div className="flex gap-2">
          <a href={threat.url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit URL
            </Button>
          </a>
          <Link href={`/dashboard/reports/new?threat=${threat.id}`}>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Threat Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">
                {threat.description || `This ${threatTypeLabels[threat.type]?.toLowerCase() || 'threat'} was detected targeting ${threat.brands?.name}. The domain ${threat.domain || new URL(threat.url).hostname} may be attempting to impersonate the legitimate brand.`}
              </p>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{analysisResults.brandMentions}</p>
                  <p className="text-xs text-muted-foreground">Brand Mentions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{analysisResults.hasLoginForm ? 'Yes' : 'No'}</p>
                  <p className="text-xs text-muted-foreground">Login Form</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{analysisResults.hasPaymentForm ? 'Yes' : 'No'}</p>
                  <p className="text-xs text-muted-foreground">Payment Form</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Signals */}
          <Card>
            <CardHeader>
              <CardTitle>AI Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-xs text-muted-foreground">Composite Score</p>
                  <p className="text-2xl font-bold text-foreground">{compositeScore ?? '—'}</p>
                  <p className="text-xs text-muted-foreground">Severity: {analysis.compositeSeverity || threat.severity}</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-xs text-muted-foreground">Visual Similarity</p>
                  <p className="text-2xl font-bold text-foreground">{visualScore !== null ? `${visualScore}%` : '—'}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {visualStatus}
                    {analysis.visualSimilarityProvider ? ` • ${analysis.visualSimilarityProvider}` : ''}
                  </p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-xs text-muted-foreground">Phishing Intent</p>
                  <p className="text-2xl font-bold text-foreground">{intentScore !== null ? `${intentScore}%` : '—'}</p>
                  <p className="text-xs text-muted-foreground capitalize">{intentClass}</p>
                </div>
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm text-foreground">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Visual Details</p>
                  <div className="mt-3 space-y-1">
                    <p><span className="text-muted-foreground">Status:</span> <span className="capitalize">{visualStatus}</span></p>
                    <p><span className="text-muted-foreground">Provider:</span> {analysis.visualSimilarityProvider || '—'}</p>
                    <p><span className="text-muted-foreground">Model:</span> {analysis.visualSimilarityModel || '—'}</p>
                    <p><span className="text-muted-foreground">Confidence:</span> {typeof analysis.visualSimilarityConfidence === 'number' ? `${Math.round(analysis.visualSimilarityConfidence * 100)}%` : '—'}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    {analysis.visualSimilarityRationale || 'No visual rationale available yet.'}
                  </p>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Intent Details</p>
                  <div className="mt-3 space-y-1">
                    <p><span className="text-muted-foreground">Source:</span> {intentSource}</p>
                    <p><span className="text-muted-foreground">Class:</span> <span className="capitalize">{intentClass}</span></p>
                    <p><span className="text-muted-foreground">Model:</span> {analysis.phishingIntentModel || '—'}</p>
                    <p><span className="text-muted-foreground">Confidence:</span> {typeof analysis.phishingIntentConfidence === 'number' ? `${Math.round(analysis.phishingIntentConfidence * 100)}%` : '—'}</p>
                  </div>
                  {intentSignals.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {intentSignals.map((signal) => (
                        <span
                          key={signal}
                          className="text-xs font-medium text-muted-foreground bg-accent border border-border rounded-full px-2 py-0.5"
                        >
                          {signal.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-3">No intent signals recorded yet.</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    {analysis.phishingIntentRationale || 'No intent rationale available yet.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WHOIS Data */}
          {threat.whois_data && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  WHOIS Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Registrar</p>
                        <p className="text-sm font-medium">{threat.whois_data.registrar || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="text-sm font-medium">{threat.whois_data.creation_date || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Expires</p>
                        <p className="text-sm font-medium">{threat.whois_data.expiration_date || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Registrant Country</p>
                        <p className="text-sm font-medium">{threat.whois_data.registrant_country || 'Hidden'}</p>
                      </div>
                    </div>
                    {threat.whois_data.name_servers && threat.whois_data.name_servers.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Server className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="text-xs text-muted-foreground">Name Servers</p>
                          {threat.whois_data.name_servers.map((ns: string, i: number) => (
                            <p key={i} className="text-sm font-mono">{ns}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Evidence */}
          <Card>
            <CardHeader>
              <CardTitle>Collected Evidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-medium text-foreground">{threat.evidence?.screenshots?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Screenshots</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <Code className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-medium text-foreground">{threat.evidence?.html_snapshots?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">HTML Snapshots</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <Globe className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-medium text-foreground">{threat.evidence?.whois_snapshots?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">WHOIS Records</p>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-border bg-muted p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-foreground">Latest Screenshot</p>
                  <div className="flex items-center gap-2">
                    {screenshotError && (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                        {screenshotError}
                      </span>
                    )}
                    {threat.evidence?.screenshots?.[0]?.storage_path && (
                      <Button variant="outline" size="sm" onClick={refreshScreenshotUrl}>
                        {screenshotError ? 'Retry' : 'Refresh URL'}
                      </Button>
                    )}
                    {screenshotUrl && (
                      <a href={screenshotUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">View Full</Button>
                      </a>
                    )}
                    {screenshotUrl && (
                      <Button variant="outline" size="sm" onClick={() => copyEvidenceUrl(screenshotUrl, 'screenshot')}>
                        {screenshotCopied ? 'Copied' : 'Copy URL'}
                      </Button>
                    )}
                  </div>
                </div>

                {screenshotLoading ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                  </div>
                ) : screenshotUrl ? (
                  <img
                    src={screenshotUrl}
                    alt="Evidence screenshot"
                    className="w-full h-auto rounded-md border border-border"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {screenshotError || 'No screenshot available yet.'}
                  </p>
                )}
              </div>

              <div className="mt-6 rounded-lg border border-border bg-muted p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-foreground">HTML Snapshot</p>
                  <div className="flex items-center gap-2">
                    {htmlSnapshotError && (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                        {htmlSnapshotError}
                      </span>
                    )}
                    {threat.evidence?.html_snapshots?.[0]?.storage_path && (
                      <Button variant="outline" size="sm" onClick={refreshHtmlSnapshotUrl}>
                        {htmlSnapshotError ? 'Retry' : 'Refresh URL'}
                      </Button>
                    )}
                    {htmlSnapshotUrl && (
                      <a href={htmlSnapshotUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">Download</Button>
                      </a>
                    )}
                    {htmlSnapshotUrl && (
                      <Button variant="outline" size="sm" onClick={() => copyEvidenceUrl(htmlSnapshotUrl, 'html')}>
                        {htmlCopied ? 'Copied' : 'Copy URL'}
                      </Button>
                    )}
                    {threat.evidence?.html_snapshots?.[0]?.storage_path && (
                      <Button variant="outline" size="sm" onClick={loadHtmlSnapshot}>
                        {htmlSnapshotContent ? 'Reload HTML' : 'Load HTML'}
                      </Button>
                    )}
                    {(htmlSnapshotContent || threat.evidence?.html_snapshots?.[0]?.html_preview || threat.evidence?.html_snapshots?.[0]?.html) && (
                      <Button variant="outline" size="sm" onClick={toggleHtmlFrame}>
                        {showHtmlFrame ? 'Hide Render' : 'Render HTML'}
                      </Button>
                    )}
                  </div>
                </div>

                {htmlSnapshotLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                  </div>
                ) : htmlSnapshotContent ? (
                  <div className="space-y-3">
                    {showHtmlFrame ? (
                      <iframe
                        title="HTML Snapshot Preview"
                        sandbox=""
                        srcDoc={htmlSnapshotContent}
                        className="w-full h-64 rounded-md border border-border bg-card"
                      />
                    ) : (
                      <pre className="max-h-64 overflow-auto rounded-md border border-border bg-card p-3 text-xs text-foreground whitespace-pre-wrap">
                        {htmlSnapshotContent}
                      </pre>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Rendered preview is sandboxed (no scripts). Use "Download" for the full file.
                    </p>
                  </div>
                ) : threat.evidence?.html_snapshots?.[0]?.html_preview || threat.evidence?.html_snapshots?.[0]?.html ? (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Showing stored preview. Load the full snapshot to view the complete HTML.
                    </p>
                    {showHtmlFrame ? (
                      <iframe
                        title="HTML Snapshot Preview"
                        sandbox=""
                        srcDoc={threat.evidence?.html_snapshots?.[0]?.html || threat.evidence?.html_snapshots?.[0]?.html_preview}
                        className="w-full h-64 rounded-md border border-border bg-card"
                      />
                    ) : (
                      <pre className="max-h-64 overflow-auto rounded-md border border-border bg-card p-3 text-xs text-foreground whitespace-pre-wrap">
                        {threat.evidence?.html_snapshots?.[0]?.html || threat.evidence?.html_snapshots?.[0]?.html_preview}
                      </pre>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Rendered preview is sandboxed (no scripts). Load the full snapshot for complete HTML.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {htmlSnapshotError || 'No HTML snapshot available yet.'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setStatus(option.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      status === option.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-border hover:border-border'
                    }`}
                  >
                    <option.icon className={`h-4 w-4 ${status === option.value ? 'text-primary-600' : 'text-muted-foreground'}`} />
                    <span className={status === option.value ? 'font-medium text-primary-700' : 'text-foreground'}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
              <Button className="w-full mt-4" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Status'}
              </Button>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this threat..."
                className="w-full h-32 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              <Button variant="outline" className="w-full mt-2" onClick={handleSave} disabled={saving}>
                Save Notes
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/dashboard/reports/new?threat=${threat.id}`}>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Takedown Report
                </Button>
              </Link>
              <a href={threat.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
