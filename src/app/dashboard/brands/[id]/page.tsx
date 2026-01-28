'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Play,
  AlertTriangle,
  AlertCircle,
  Globe,
  Clock,
  FileText,
  Loader2,
  ExternalLink,
  Plus,
  X,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MoreVertical,
  Trash2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, SeverityBadge, StatusBadge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { PlatformSelector } from '@/components/PlatformSelector'
import { formatDateTime, truncateUrl } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { ScanProgress } from '@/components/ScanProgress'
import { getEffectiveTier, getSocialPlatformLimit, type SocialPlatform } from '@/lib/tier-limits'
import { useQuotaStatus } from '@/hooks/useQuotaStatus'
import { SwipeableListItem } from '@/components/ui/swipeable-list-item'

interface Brand {
  id: string
  name: string
  domain: string
  logo_url?: string | null
  status: string
  keywords: string[]
  social_handles: Record<string, string[] | string | null>
  enabled_social_platforms?: string[]
  threat_count: number
  last_scan_at: string | null
  created_at: string
}

interface Threat {
  id: string
  url: string
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: string
  detected_at: string
  threat_score?: number | null
  analysis?: { compositeScore?: number | null }
}

interface Scan {
  id: string
  scan_type: string
  status: string
  threats_found: number
  domains_checked: number
  started_at: string
  completed_at: string | null
}

interface AiStatusSummary {
  scanId: string
  total: number
  vision: {
    computed: number
    pending: number
    unavailable: number
    unknown: number
  }
  intent: {
    openai: number
    heuristic: number
    unknown: number
  }
}

const threatTypeLabels: Record<string, string> = {
  phishing_page: 'Phishing',
  typosquat_domain: 'Typosquat',
  lookalike_website: 'Lookalike',
  fake_social_account: 'Fake Social',
  brand_impersonation: 'Impersonation',
  trademark_abuse: 'Trademark Abuse'
}

const socialIcons: Record<string, typeof Twitter> = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Globe,
  telegram: Globe,
  discord: Globe
}

const SOCIAL_PLATFORMS = [
  { key: 'twitter', label: 'Twitter/X', placeholder: '@yourbrand' },
  { key: 'facebook', label: 'Facebook', placeholder: 'yourbrand' },
  { key: 'instagram', label: 'Instagram', placeholder: '@yourbrand' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'company/yourbrand' },
  { key: 'youtube', label: 'YouTube', placeholder: '@yourbrand or channel/UC...' },
  { key: 'tiktok', label: 'TikTok', placeholder: '@yourbrand' },
  { key: 'telegram', label: 'Telegram', placeholder: 't.me/yourbrand' },
  { key: 'discord', label: 'Discord', placeholder: 'discord.gg/yourbrand' }
] as const

export default function BrandDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [brand, setBrand] = useState<Brand | null>(null)
  const [threats, setThreats] = useState<Threat[]>([])
  const [scans, setScans] = useState<Scan[]>([])
  const [activeScan, setActiveScan] = useState<Scan | null>(null)
  const [activeScanId, setActiveScanId] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [criticalCount, setCriticalCount] = useState(0)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoRemoving, setLogoRemoving] = useState(false)
  const [detailsEditing, setDetailsEditing] = useState(false)
  const [detailsSaving, setDetailsSaving] = useState(false)
  const [maxPlatforms, setMaxPlatforms] = useState(1)
  const [detailsForm, setDetailsForm] = useState({
    name: '',
    domain: '',
    keywords: [] as string[],
    newKeyword: '',
    socialHandles: {} as Record<string, string[]>,
    enabledSocialPlatforms: [] as SocialPlatform[]
  })
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null)
  const [aiStatus, setAiStatus] = useState<AiStatusSummary | null>(null)
  const [aiStatusLoading, setAiStatusLoading] = useState(false)
  const { quota, loading: quotaLoading, refetch: refetchQuota } = useQuotaStatus()
  const [showScanMenu, setShowScanMenu] = useState<string | null>(null)
  const [deletingScan, setDeletingScan] = useState<string | null>(null)
  const scanMenuRef = useRef<HTMLDivElement>(null)
  const [showThreatMenu, setShowThreatMenu] = useState<string | null>(null)
  const [deletingThreat, setDeletingThreat] = useState<string | null>(null)
  const threatMenuRef = useRef<HTMLDivElement>(null)

  const getThreatScore = (threat: Threat) => {
    if (typeof threat.threat_score === 'number') return Math.round(threat.threat_score)
    if (typeof threat.analysis?.compositeScore === 'number') return Math.round(threat.analysis.compositeScore)
    return null
  }

  const normalizeSocialHandles = (handles?: Record<string, string[] | string | null>) => {
    const normalized: Record<string, string[]> = {}
    for (const platform of SOCIAL_PLATFORMS) {
      const raw = handles?.[platform.key]
      const list = Array.isArray(raw) ? raw : (typeof raw === 'string' ? [raw] : [])
      const cleaned = list.map(value => value.trim()).filter(Boolean)
      if (cleaned.length > 0) {
        normalized[platform.key] = cleaned
      }
    }
    return normalized
  }

  const buildSocialHandlesForm = (handles?: Record<string, string[] | string | null>) => {
    const normalized: Record<string, string[]> = {}
    for (const platform of SOCIAL_PLATFORMS) {
      const raw = handles?.[platform.key]
      const list = Array.isArray(raw) ? raw : (typeof raw === 'string' ? [raw] : [])
      const cleaned = list.map(value => value.trim()).filter(Boolean)
      normalized[platform.key] = cleaned.length > 0 ? cleaned : ['']
    }
    return normalized
  }

  const startEditingDetails = () => {
    if (!brand) return
    setDetailsForm({
      name: brand.name || '',
      domain: brand.domain || '',
      keywords: brand.keywords || [],
      newKeyword: '',
      socialHandles: buildSocialHandlesForm(brand.social_handles || {}),
      enabledSocialPlatforms: (brand.enabled_social_platforms || []) as SocialPlatform[]
    })
    setDetailsEditing(true)
  }

  const cancelEditingDetails = () => {
    setDetailsEditing(false)
  }

  const addKeyword = () => {
    const trimmed = detailsForm.newKeyword.trim()
    if (!trimmed || detailsForm.keywords.includes(trimmed)) return
    setDetailsForm(prev => ({
      ...prev,
      keywords: [...prev.keywords, trimmed],
      newKeyword: ''
    }))
  }

  const removeKeyword = (keyword: string) => {
    setDetailsForm(prev => ({
      ...prev,
      keywords: prev.keywords.filter(value => value !== keyword)
    }))
  }

  const addSocialHandle = (platform: string) => {
    setDetailsForm(prev => {
      const nextHandles = { ...prev.socialHandles }
      const handles = [...(nextHandles[platform] || [])]
      handles.push('')
      nextHandles[platform] = handles
      return { ...prev, socialHandles: nextHandles }
    })
  }

  const updateSocialHandle = (platform: string, index: number, value: string) => {
    setDetailsForm(prev => {
      const nextHandles = { ...prev.socialHandles }
      const handles = [...(nextHandles[platform] || [])]
      handles[index] = value
      nextHandles[platform] = handles
      return { ...prev, socialHandles: nextHandles }
    })
  }

  const removeSocialHandle = (platform: string, index: number) => {
    setDetailsForm(prev => {
      const nextHandles = { ...prev.socialHandles }
      const handles = [...(nextHandles[platform] || [])]
      handles.splice(index, 1)
      nextHandles[platform] = handles.length > 0 ? handles : ['']
      return { ...prev, socialHandles: nextHandles }
    })
  }

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview)
      }
    }
  }, [logoPreview])

  // Click-outside handler for scan menu
  useEffect(() => {
    if (!showScanMenu) return
    const handleClickOutside = (event: MouseEvent) => {
      if (scanMenuRef.current && !scanMenuRef.current.contains(event.target as Node)) {
        setShowScanMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showScanMenu])

  // Click-outside handler for threat menu
  useEffect(() => {
    if (!showThreatMenu) return
    const handleClickOutside = (event: MouseEvent) => {
      if (threatMenuRef.current && !threatMenuRef.current.contains(event.target as Node)) {
        setShowThreatMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showThreatMenu])

  const fetchAiStatus = async (scanId: string) => {
    setAiStatusLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('threats')
        .select('id, analysis')
        .eq('brand_id', params.id)
        .eq('scan_id', scanId)

      if (error) throw error

      const summary: AiStatusSummary = {
        scanId,
        total: data?.length || 0,
        vision: { computed: 0, pending: 0, unavailable: 0, unknown: 0 },
        intent: { openai: 0, heuristic: 0, unknown: 0 }
      }

      for (const threat of data || []) {
        const analysis = (threat as { analysis?: Record<string, any> }).analysis || {}
        const visionStatus = analysis.visualSimilarityStatus
        if (visionStatus === 'computed') summary.vision.computed += 1
        else if (visionStatus === 'pending') summary.vision.pending += 1
        else if (visionStatus === 'unavailable') summary.vision.unavailable += 1
        else summary.vision.unknown += 1

        const intentSource = analysis.phishingIntentSource
        if (intentSource === 'openai') summary.intent.openai += 1
        else if (intentSource === 'heuristic') summary.intent.heuristic += 1
        else summary.intent.unknown += 1
      }

      setAiStatus(summary)
    } catch (error) {
      console.error('Error fetching AI status:', error)
      setAiStatus(null)
    } finally {
      setAiStatusLoading(false)
    }
  }

  useEffect(() => {
    if (scans.length === 0) {
      setSelectedScanId(null)
      setAiStatus(null)
      return
    }
    const defaultScan = scans.find(scan => scan.status === 'completed') || scans[0]
    setSelectedScanId(prev => (prev && scans.some(scan => scan.id === prev)) ? prev : defaultScan.id)
  }, [scans])

  useEffect(() => {
    if (!selectedScanId) return
    void fetchAiStatus(selectedScanId)
  }, [selectedScanId])

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
    setActiveScanId(null)
    setScanning(false)
  }

  const startPolling = (scanId: string) => {
    if (!scanId) return
    if (pollRef.current) {
      clearInterval(pollRef.current)
    }

    setActiveScanId(scanId)
    setScanning(true)

    const poll = async () => {
      try {
        const statusResponse = await fetch(`/api/scan?id=${scanId}`)
        if (!statusResponse.ok) return
        const scan = await statusResponse.json()
        setActiveScan(scan)
        setScans(prev => prev.map(s => (s.id === scanId ? { ...s, ...scan } : s)))

        if (scan.status === 'completed' || scan.status === 'failed') {
          stopPolling()
          fetchData()
          refetchQuota()
          if (scan.status === 'completed') {
            setSelectedScanId(scan.id)
            void fetchAiStatus(scan.id)
          }
        }
      } catch (error) {
        console.error('Error polling scan status:', error)
      }
    }

    void poll()
    pollRef.current = setInterval(poll, 4000)
  }

  const handleCancelScan = async () => {
    const scanId = activeScanId || activeScan?.id
    if (!scanId || cancelling) return
    setCancelling(true)
    try {
      const response = await fetch('/api/scan/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId })
      })

      if (!response.ok) throw new Error('Failed to cancel scan')
      setActiveScan(prev => prev ? { ...prev, status: 'failed' } : prev)
      stopPolling()
      fetchData()
    } catch (error) {
      console.error('Error cancelling scan:', error)
      alert('Failed to cancel scan. Please try again.')
    } finally {
      setCancelling(false)
    }
  }

  useEffect(() => {
    fetchData()
    return () => {
      stopPolling()
    }
  }, [params.id])

  async function fetchData() {
    try {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Fetch brand
      const { data: brandData, error: brandError } = await supabase
        .from('brands')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single()

      if (brandError || !brandData) {
        router.push('/dashboard/brands')
        return
      }
      setBrand(brandData)

      // Fetch user tier for platform limit
      const { data: userData } = await supabase
        .from('users')
        .select('subscription_status, subscription_tier')
        .eq('id', user.id)
        .single()

      const effectiveTier = getEffectiveTier(
        userData?.subscription_status,
        userData?.subscription_tier
      )
      setMaxPlatforms(getSocialPlatformLimit(effectiveTier))

      // Fetch threats for this brand
      const { data: threatsData } = await supabase
        .from('threats')
        .select('*')
        .eq('brand_id', params.id)
        .order('detected_at', { ascending: false })
        .limit(10)

      setThreats(threatsData || [])
      setCriticalCount(threatsData?.filter(t => t.severity === 'critical').length || 0)

      // Fetch scans
      const { data: scansData } = await supabase
        .from('scans')
        .select('*')
        .eq('brand_id', params.id)
        .order('started_at', { ascending: false })
        .limit(5)

      setScans(scansData || [])
      const runningScan = scansData?.find(scan => scan.status === 'running' || scan.status === 'pending') || null
      setActiveScan(runningScan)
      if (runningScan && runningScan.id !== activeScanId) {
        startPolling(runningScan.id)
      }

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleScan() {
    if (!brand) return
    setScanning(true)

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId: brand.id, scanType: 'full' })
      })

      if (!response.ok) throw new Error('Failed to start scan')
      const { scanId } = await response.json()
      startPolling(scanId)

    } catch (error) {
      console.error('Error starting scan:', error)
      setScanning(false)
      alert('Failed to start scan. Please try again.')
    }
  }

  async function handleLogoUpload() {
    if (!brand || !logoFile || logoUploading) return
    setLogoUploading(true)

    try {
      const logoForm = new FormData()
      logoForm.append('brandId', brand.id)
      logoForm.append('logo', logoFile)
      const response = await fetch('/api/brands/logo', {
        method: 'POST',
        body: logoForm
      })

      if (!response.ok) {
        throw new Error('Failed to upload logo')
      }

      const data = await response.json()
      setBrand({ ...brand, logo_url: data.logo_url })
      setLogoFile(null)
      setLogoPreview(null)
    } catch (error) {
      console.error('Logo upload failed:', error)
      alert('Failed to upload logo. Please try again.')
    } finally {
      setLogoUploading(false)
    }
  }

  async function handleLogoRemove() {
    if (!brand || logoRemoving) return
    setLogoRemoving(true)
    try {
      const response = await fetch('/api/brands/logo', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId: brand.id })
      })
      if (!response.ok) {
        throw new Error('Failed to remove logo')
      }
      setBrand({ ...brand, logo_url: null })
      setLogoFile(null)
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview)
      }
      setLogoPreview(null)
    } catch (error) {
      console.error('Logo remove failed:', error)
      alert('Failed to remove logo. Please try again.')
    } finally {
      setLogoRemoving(false)
    }
  }

  async function handleSaveDetails() {
    if (!brand || detailsSaving) return
    if (!detailsForm.name.trim() || !detailsForm.domain.trim()) {
      alert('Brand name and domain are required.')
      return
    }
    setDetailsSaving(true)
    try {
      const social_handles = Object.fromEntries(
        Object.entries(detailsForm.socialHandles).map(([platform, handles]) => {
          const cleaned = handles.map(handle => handle.trim()).filter(Boolean)
          return [platform, cleaned]
        }).filter(([_, handles]) => (handles as string[]).length > 0)
      )

      const response = await fetch('/api/brands', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: brand.id,
          name: detailsForm.name,
          domain: detailsForm.domain,
          keywords: detailsForm.keywords,
          social_handles,
          enabled_social_platforms: detailsForm.enabledSocialPlatforms,
          mode: 'replace'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update brand details')
      }

      const updated = await response.json()
      setBrand(updated)
      setDetailsEditing(false)
    } catch (error) {
      console.error('Brand update failed:', error)
      alert('Failed to update brand details. Please try again.')
    } finally {
      setDetailsSaving(false)
    }
  }

  async function handleDeleteScan(scanId: string) {
    if (deletingScan) return
    setDeletingScan(scanId)
    setShowScanMenu(null)

    // Optimistic delete - backup and remove immediately
    const scanBackup = scans.find(s => s.id === scanId)
    if (!scanBackup) return

    setScans(prev => prev.filter(s => s.id !== scanId))

    try {
      const response = await fetch(`/api/scans/${scanId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete scan')
      }

      // Refresh data to update threat counts (scan delete cascades threats)
      await fetchData()
    } catch (error) {
      console.error('Error deleting scan:', error)
      // Rollback - restore scan and re-sort
      setScans(prev => [...prev, scanBackup].sort((a, b) =>
        new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
      ))
      alert('Failed to delete scan. Please try again.')
    } finally {
      setDeletingScan(null)
    }
  }

  async function handleDeleteThreat(threatId: string) {
    if (deletingThreat) return
    setDeletingThreat(threatId)
    setShowThreatMenu(null)

    // Optimistic delete - backup and remove immediately
    const threatBackup = threats.find(t => t.id === threatId)
    if (!threatBackup) return

    setThreats(prev => prev.filter(t => t.id !== threatId))

    // Recalculate critical count
    const newCriticalCount = threats.filter(t => t.id !== threatId && t.severity === 'critical').length
    setCriticalCount(newCriticalCount)

    try {
      const response = await fetch(`/api/threats/${threatId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete threat')
      }
    } catch (error) {
      console.error('Error deleting threat:', error)
      // Rollback - restore threat and re-sort
      setThreats(prev => [...prev, threatBackup].sort((a, b) =>
        new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime()
      ))
      // Recalculate critical count
      setCriticalCount(threats.filter(t => t.severity === 'critical').length)
      alert('Failed to delete threat. Please try again.')
    } finally {
      setDeletingThreat(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Brand not found</p>
        <Link href="/dashboard/brands">
          <Button variant="outline" className="mt-4">Back to Brands</Button>
        </Link>
      </div>
    )
  }

  const displaySocialHandles = normalizeSocialHandles(brand.social_handles)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/brands">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brands
          </Button>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{brand.name}</h1>
            <StatusBadge status={brand.status} />
          </div>
          <p className="text-muted-foreground">{brand.domain}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleScan}
            disabled={scanning || (!!quota && !quota.isUnlimited && quota.remaining === 0)}
          >
            {scanning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : quota && !quota.isUnlimited && quota.remaining === 0 ? (
              <>Upgrade to scan</>
            ) : quota && !quota.isUnlimited ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Scan Now &middot; {quota.remaining} left this week
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Scan
              </>
            )}
          </Button>
        </div>
      </div>

      {quota && !quota.isUnlimited && quota.remaining === 0 && (
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">
                You&apos;ve used your free scan this week
              </h3>
              <p className="text-sm text-blue-800 mb-3">
                Upgrade for unlimited manual scans, automated monitoring, and more.
              </p>
              <Link href="/pricing">
                <Button size="sm">View plans</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {activeScan && (activeScan.status === 'running' || activeScan.status === 'queued' || activeScan.status === 'pending') && (
        <ScanProgress
          scanId={activeScan.id}
          onComplete={() => {
            fetchData();
          }}
          onError={(error) => {
            console.error('Scan failed:', error);
            fetchData();
          }}
          onCancel={() => {
            fetchData();
          }}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Threats</p>
                <p className="text-2xl font-bold text-foreground">{brand.threat_count}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-foreground">{criticalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Scans Run</p>
                <p className="text-2xl font-bold text-foreground">{scans.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Last Scan</p>
                <p className="text-sm font-bold text-foreground">
                  {brand.last_scan_at ? formatDateTime(brand.last_scan_at) : 'Never'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Threats */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Threats</CardTitle>
              <Link href={`/dashboard/threats?brand=${brand.id}`} className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {threats.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No threats detected yet</p>
                  <p className="text-sm text-muted-foreground">Run a scan to check for potential threats</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {threats.map((threat) => {
                    const score = getThreatScore(threat)
                    return (
                      <SwipeableListItem
                        key={threat.id}
                        onDelete={() => handleDeleteThreat(threat.id)}
                        disabled={deletingThreat === threat.id}
                      >
                        <div
                          onClick={() => router.push(`/dashboard/threats/${threat.id}`)}
                          className="flex items-center justify-between py-3 hover:bg-muted -mx-4 px-4 transition-colors cursor-pointer"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <SeverityBadge severity={threat.severity} />
                              <span className="text-xs text-muted-foreground">
                                {threatTypeLabels[threat.type] || threat.type}
                              </span>
                              {score !== null && (
                                <span className="text-xs font-medium text-muted-foreground bg-accent border border-border rounded-full px-2 py-0.5">
                                  Score {score}
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-mono text-foreground truncate">
                              {truncateUrl(threat.url, 45)}
                            </p>
                          </div>
                          <div className="ml-4 flex items-center gap-2">
                            <StatusBadge status={threat.status} />
                            <div ref={threatMenuRef} className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowThreatMenu(showThreatMenu === threat.id ? null : threat.id)
                                }}
                                disabled={deletingThreat === threat.id}
                                className="p-1 text-muted-foreground hover:text-foreground rounded disabled:opacity-50"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              {showThreatMenu === threat.id && (
                                <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-20">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteThreat(threat.id)
                                    }}
                                    disabled={deletingThreat === threat.id}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Threat
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </SwipeableListItem>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scan History */}
          <Card>
            <CardHeader>
              <CardTitle>Scan History</CardTitle>
            </CardHeader>
            <CardContent>
              {scans.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No scans yet</p>
                  <Button onClick={handleScan} disabled={scanning} className="mt-4">
                    Run First Scan
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {scans.map((scan) => {
                    const canDelete = scan.status !== 'running' && scan.status !== 'pending'
                    return (
                      <SwipeableListItem
                        key={scan.id}
                        onDelete={() => handleDeleteScan(scan.id)}
                        disabled={!canDelete || deletingScan === scan.id}
                      >
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-foreground capitalize">{scan.scan_type} Scan</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(scan.started_at)} • {scan.domains_checked} domains checked
                            </p>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <div>
                              <p className="font-medium text-foreground">{scan.threats_found} threats found</p>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                scan.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                scan.status === 'running' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                scan.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                'bg-accent text-foreground'
                              }`}>
                                {scan.status === 'running' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                                {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                              </span>
                            </div>
                            {canDelete && (
                              <div ref={scanMenuRef} className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setShowScanMenu(showScanMenu === scan.id ? null : scan.id)
                                  }}
                                  disabled={deletingScan === scan.id}
                                  className="p-1 text-muted-foreground hover:text-foreground rounded disabled:opacity-50"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                                {showScanMenu === scan.id && (
                                  <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-20">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteScan(scan.id)
                                      }}
                                      disabled={deletingScan === scan.id}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete Scan
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </SwipeableListItem>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Brand Info */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Brand Details</CardTitle>
              {detailsEditing ? (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={cancelEditingDetails}
                    disabled={detailsSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSaveDetails}
                    disabled={detailsSaving}
                  >
                    {detailsSaving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={startEditingDetails}
                >
                  Edit details
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Logo</p>
                <div className="flex items-start gap-3">
                  <div className="h-14 w-14 rounded-lg border border-border bg-card flex items-center justify-center overflow-hidden">
                    {logoPreview || brand.logo_url ? (
                      <img
                        src={logoPreview || brand.logo_url || ''}
                        alt={`${brand.name} logo`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-muted-foreground">No logo</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      type="file"
                      accept="image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        if (file && file.type && file.type !== 'image/png') {
                          alert('Logo must be a PNG image.')
                          e.currentTarget.value = ''
                          if (logoPreview) {
                            URL.revokeObjectURL(logoPreview)
                          }
                          setLogoFile(null)
                          setLogoPreview(null)
                          return
                        }
                        if (logoPreview) {
                          URL.revokeObjectURL(logoPreview)
                        }
                        setLogoFile(file)
                        setLogoPreview(file ? URL.createObjectURL(file) : null)
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleLogoUpload}
                      disabled={!logoFile || logoUploading || logoRemoving}
                    >
                      {logoUploading ? 'Uploading...' : brand.logo_url ? 'Update Logo' : 'Upload Logo'}
                    </Button>
                    {brand.logo_url && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={handleLogoRemove}
                        disabled={logoUploading || logoRemoving}
                      >
                        {logoRemoving ? 'Removing...' : 'Remove Logo'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {detailsEditing ? (
                <>
                  <Input
                    label="Brand Name"
                    placeholder="e.g., Acme Inc"
                    value={detailsForm.name}
                    onChange={(e) => setDetailsForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <Input
                    label="Primary Domain"
                    placeholder="e.g., acme.com"
                    value={detailsForm.domain}
                    onChange={(e) => setDetailsForm(prev => ({
                      ...prev,
                      domain: e.target.value.replace(/^https?:\/\//, '').replace(/\/$/, '')
                    }))}
                    required
                  />

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Keywords</p>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add a keyword"
                        value={detailsForm.newKeyword}
                        onChange={(e) => setDetailsForm(prev => ({ ...prev, newKeyword: e.target.value }))}
                      />
                      <Button type="button" variant="secondary" onClick={addKeyword}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {detailsForm.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {detailsForm.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="inline-flex items-center bg-accent text-foreground px-3 py-1 rounded-full text-sm"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() => removeKeyword(keyword)}
                              className="ml-2 text-muted-foreground hover:text-muted-foreground"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Platforms to Scan</p>
                    <PlatformSelector
                      value={detailsForm.enabledSocialPlatforms}
                      onChange={(platforms) => setDetailsForm(prev => ({
                        ...prev,
                        enabledSocialPlatforms: platforms
                      }))}
                      maxPlatforms={maxPlatforms}
                    />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Social Accounts</p>
                    <div className="space-y-4">
                      {SOCIAL_PLATFORMS.map((platform) => {
                        const handles = detailsForm.socialHandles[platform.key] || ['']
                        return (
                          <div key={platform.key} className="space-y-2">
                            <p className="text-sm font-medium text-foreground">{platform.label}</p>
                            {handles.map((handle, index) => (
                              <div key={`${platform.key}-${index}`} className="flex items-center gap-2">
                                <Input
                                  id={`social-${platform.key}-${index}`}
                                  placeholder={platform.placeholder}
                                  value={handle}
                                  onChange={(e) => updateSocialHandle(platform.key, index, e.target.value)}
                                />
                                {handles.length > 1 && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeSocialHandle(platform.key, index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => addSocialHandle(platform.key)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add account
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Brand Name</p>
                    <p className="text-foreground">{brand.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Domain</p>
                    <a
                      href={`https://${brand.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      {brand.domain}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {brand.keywords && brand.keywords.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Keywords</p>
                      <div className="flex flex-wrap gap-1">
                        {brand.keywords.map((keyword, i) => (
                          <Badge key={i} variant="default" size="sm">{keyword}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {brand.enabled_social_platforms && brand.enabled_social_platforms.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Platforms to Scan</p>
                      <div className="flex flex-wrap gap-1">
                        {brand.enabled_social_platforms.map((platform, i) => (
                          <Badge key={i} variant="default" size="sm">
                            {SOCIAL_PLATFORMS.find(p => p.key === platform)?.label || platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {Object.keys(displaySocialHandles).length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Social Accounts</p>
                      <div className="space-y-3">
                        {SOCIAL_PLATFORMS.map((platform) => {
                          const handles = displaySocialHandles[platform.key]
                          if (!handles) return null
                          const Icon = socialIcons[platform.key] || Globe
                          return (
                            <div key={platform.key} className="flex items-start gap-2 text-sm">
                              <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-foreground">{platform.label}</p>
                                <div className="text-sm text-muted-foreground space-y-1">
                                  {handles.map((handle, index) => (
                                    <div key={`${platform.key}-${index}`}>{handle}</div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-1">Created</p>
                <p className="text-foreground">{formatDateTime(brand.created_at)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scans.length === 0 ? (
                <p className="text-sm text-muted-foreground">No scans yet.</p>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Scan</label>
                    <select
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      value={selectedScanId || ''}
                      onChange={(e) => setSelectedScanId(e.target.value)}
                    >
                      {scans.map((scan) => (
                        <option key={scan.id} value={scan.id}>
                          {scan.started_at ? formatDateTime(scan.started_at) : 'Not started'} • {scan.scan_type} • {scan.status}
                        </option>
                      ))}
                    </select>
                  </div>

                  {aiStatusLoading ? (
                    <p className="text-sm text-muted-foreground">Loading AI analysis...</p>
                  ) : aiStatus && aiStatus.total > 0 ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-border p-3">
                          <p className="text-xs text-muted-foreground">Threats</p>
                          <p className="text-lg font-semibold text-foreground">{aiStatus.total}</p>
                        </div>
                        <div className="rounded-lg border border-border p-3">
                          <p className="text-xs text-muted-foreground">Vision computed</p>
                          <p className="text-lg font-semibold text-foreground">{aiStatus.vision.computed}</p>
                        </div>
                      </div>

                      <div className="space-y-1 text-sm">
                        <p className="font-medium text-foreground">Visual similarity</p>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Computed</span>
                          <span>{aiStatus.vision.computed}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Pending</span>
                          <span>{aiStatus.vision.pending}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Unavailable</span>
                          <span>{aiStatus.vision.unavailable}</span>
                        </div>
                        {aiStatus.vision.unknown > 0 && (
                          <div className="flex justify-between text-muted-foreground">
                            <span>Unknown</span>
                            <span>{aiStatus.vision.unknown}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 text-sm">
                        <p className="font-medium text-foreground">Phishing intent</p>
                        <div className="flex justify-between text-muted-foreground">
                          <span>OpenAI</span>
                          <span>{aiStatus.intent.openai}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Heuristic</span>
                          <span>{aiStatus.intent.heuristic}</span>
                        </div>
                        {aiStatus.intent.unknown > 0 && (
                          <div className="flex justify-between text-muted-foreground">
                            <span>Unknown</span>
                            <span>{aiStatus.intent.unknown}</span>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No AI data for this scan yet.</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleScan}
                disabled={scanning || (!!quota && !quota.isUnlimited && quota.remaining === 0)}
              >
                {quota && !quota.isUnlimited && quota.remaining === 0 ? (
                  <>Upgrade to scan</>
                ) : quota && !quota.isUnlimited ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Scan Now &middot; {quota.remaining} left
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Full Scan
                  </>
                )}
              </Button>
              <Link href={`/dashboard/reports/new?brand=${brand.id}`}>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </Link>
              <Link href={`/dashboard/threats?brand=${brand.id}&severity=critical`}>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  View Critical Threats
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
