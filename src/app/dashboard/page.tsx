'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Shield,
  AlertTriangle,
  Globe,
  FileText,
  ArrowRight,
  Plus,
  Loader2,
  Rocket,
  CheckCircle,
  Play
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { SeverityBadge, StatusBadge } from '@/components/ui/badge'
import { formatDateTime, truncateUrl } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface Brand {
  id: string
  name: string
  domain: string
  threat_count: number
  last_scan_at: string | null
}

interface Threat {
  id: string
  url: string
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: string
  detected_at: string
  brands: { name: string }
  threat_score?: number | null
  analysis?: { compositeScore?: number | null }
}

const threatTypeLabels: Record<string, string> = {
  phishing_page: 'Phishing Page',
  typosquat_domain: 'Typosquat Domain',
  lookalike_website: 'Lookalike Website',
  fake_social_account: 'Fake Social Account',
  brand_impersonation: 'Brand Impersonation',
  trademark_abuse: 'Trademark Abuse'
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [brands, setBrands] = useState<Brand[]>([])
  const [threats, setThreats] = useState<Threat[]>([])
  const [stats, setStats] = useState({
    totalThreats: 0,
    criticalThreats: 0,
    domainsScanned: 0,
    resolvedThreats: 0
  })

  const getThreatScore = (threat: Threat) => {
    if (typeof threat.threat_score === 'number') return Math.round(threat.threat_score)
    if (typeof threat.analysis?.compositeScore === 'number') return Math.round(threat.analysis.compositeScore)
    return null
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const supabase = createClient()

      // Check auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Fetch brands
      const { data: brandsData } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setBrands(brandsData || [])

      // Fetch recent threats with brand name
      const { data: threatsData } = await supabase
        .from('threats')
        .select('*, brands!inner(name, user_id)')
        .eq('brands.user_id', user.id)
        .order('detected_at', { ascending: false })
        .limit(6)

      setThreats(threatsData || [])

      // Fetch stats
      const { count: totalThreats } = await supabase
        .from('threats')
        .select('*, brands!inner(user_id)', { count: 'exact', head: true })
        .eq('brands.user_id', user.id)
        .not('status', 'in', '("resolved","false_positive")')

      const { count: criticalThreats } = await supabase
        .from('threats')
        .select('*, brands!inner(user_id)', { count: 'exact', head: true })
        .eq('brands.user_id', user.id)
        .eq('severity', 'critical')
        .not('status', 'in', '("resolved","false_positive")')

      const { count: resolvedThreats } = await supabase
        .from('threats')
        .select('*, brands!inner(user_id)', { count: 'exact', head: true })
        .eq('brands.user_id', user.id)
        .eq('status', 'resolved')

      // Get domains scanned from scans table
      const { data: scansData } = await supabase
        .from('scans')
        .select('domains_checked, brands!inner(user_id)')
        .eq('brands.user_id', user.id)

      const domainsScanned = scansData?.reduce((sum, s) => sum + (s.domains_checked || 0), 0) || 0

      setStats({
        totalThreats: totalThreats || 0,
        criticalThreats: criticalThreats || 0,
        domainsScanned,
        resolvedThreats: resolvedThreats || 0
      })

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  // Show onboarding if no brands
  if (brands.length === 0) {
    return <OnboardingFlow />
  }

  const protectionScore = stats.totalThreats + stats.resolvedThreats > 0
    ? Math.round((stats.resolvedThreats / (stats.totalThreats + stats.resolvedThreats)) * 100)
    : 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your brand protection status</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/brands/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Brands Monitored</p>
                <p className="text-2xl font-bold text-foreground">{brands.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Threats</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.totalThreats}
                  {stats.criticalThreats > 0 && (
                    <span className="text-sm font-medium text-red-600 ml-2">
                      ({stats.criticalThreats} critical)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Domains Scanned</p>
                <p className="text-2xl font-bold text-foreground">{stats.domainsScanned.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Threats Resolved</p>
                <p className="text-2xl font-bold text-foreground">{stats.resolvedThreats}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Threats */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Threats</CardTitle>
              <Link href="/dashboard/threats" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </CardHeader>
            <CardContent>
              {threats.length === 0 ? (
                <EmptyState
                  icon={Shield}
                  title="No threats detected"
                  description="Run a scan to check for potential threats"
                  variant="success"
                />
              ) : (
                <div className="divide-y divide-border">
                  {threats.map((threat) => {
                    const score = getThreatScore(threat)
                    return (
                      <Link
                        key={threat.id}
                        href={`/dashboard/threats/${threat.id}`}
                        className="flex items-center justify-between py-4 hover:bg-muted -mx-4 px-4 transition-colors"
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
                            {truncateUrl(threat.url, 50)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDateTime(threat.detected_at)} • {threat.brands?.name}
                          </p>
                        </div>
                        <div className="ml-4">
                          <StatusBadge status={threat.status} />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Brands Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Brands</CardTitle>
              <Link href="/dashboard/brands/new" className="text-sm text-primary-600 hover:text-primary-700">
                Add new
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/dashboard/brands/${brand.id}`}
                    className="block p-3 border border-border rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{brand.name}</p>
                        <p className="text-sm text-muted-foreground">{brand.domain}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {brand.threat_count} threats
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {brand.last_scan_at ? `Last scan: ${formatDateTime(brand.last_scan_at)}` : 'Never scanned'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/brands/new">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Brand
                </Button>
              </Link>
              <Link href="/dashboard/threats?status=new">
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Review New Threats
                </Button>
              </Link>
              <Link href="/dashboard/reports/new">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Protection Score */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                  protectionScore >= 80 ? 'bg-green-100' : protectionScore >= 50 ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <span className={`text-2xl font-bold ${
                    protectionScore >= 80 ? 'text-green-600' : protectionScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>{protectionScore}%</span>
                </div>
                <p className="font-medium text-foreground">Protection Score</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.resolvedThreats} of {stats.totalThreats + stats.resolvedThreats} threats resolved
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function OnboardingFlow() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [activeScanId, setActiveScanId] = useState<string | null>(null)
  const [brandData, setBrandData] = useState({
    name: '',
    domain: '',
    keywords: '',
    twitter: '',
    facebook: '',
    instagram: '',
    linkedin: ''
  })
  const [createdBrand, setCreatedBrand] = useState<any>(null)
  const [scanResults, setScanResults] = useState<any>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleCreateBrand = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: brandData.name,
          domain: brandData.domain,
          keywords: brandData.keywords.split(',').map(k => k.trim()).filter(Boolean),
          social_handles: {
            twitter: brandData.twitter ? [brandData.twitter] : undefined,
            facebook: brandData.facebook ? [brandData.facebook] : undefined,
            instagram: brandData.instagram ? [brandData.instagram] : undefined,
            linkedin: brandData.linkedin ? [brandData.linkedin] : undefined
          }
        })
      })

      if (!response.ok) throw new Error('Failed to create brand')

      const brand = await response.json()
      setCreatedBrand(brand)
      setStep(2)
    } catch (error) {
      console.error('Error creating brand:', error)
      alert('Failed to create brand. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStartScan = async () => {
    setScanning(true)
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: createdBrand.id,
          scanType: 'full'
        })
      })

      if (!response.ok) throw new Error('Failed to start scan')

      const { scanId } = await response.json()
      setActiveScanId(scanId)

      // Poll for scan completion
      let attempts = 0
      if (pollRef.current) clearInterval(pollRef.current)
      pollRef.current = setInterval(async () => {
        attempts++
        try {
          const statusResponse = await fetch(`/api/scan?id=${scanId}`)
          const scan = await statusResponse.json()
          setScanResults(scan)

          if (scan.status === 'completed' || scan.status === 'failed') {
            if (pollRef.current) clearInterval(pollRef.current)
            pollRef.current = null
            setScanComplete(true)
            setScanning(false)
          }
        } catch (e) {
          console.error('Error polling scan status:', e)
        }

        // Timeout after 5 minutes
        if (attempts > 60) {
          if (pollRef.current) clearInterval(pollRef.current)
          pollRef.current = null
          setScanning(false)
          setScanComplete(true)
        }
      }, 5000)

    } catch (error) {
      console.error('Error starting scan:', error)
      setScanning(false)
    }
  }

  const handleCancelScan = async () => {
    if (!activeScanId || cancelling) return
    setCancelling(true)
    try {
      const response = await fetch('/api/scan/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId: activeScanId })
      })
      if (!response.ok) throw new Error('Failed to cancel scan')
      if (pollRef.current) clearInterval(pollRef.current)
      pollRef.current = null
      setScanResults((prev: any) => ({ ...(prev || {}), status: 'failed', error: 'Cancelled by user' }))
      setScanComplete(true)
      setScanning(false)
    } catch (error) {
      console.error('Error cancelling scan:', error)
      alert('Failed to cancel scan. Please try again.')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <Rocket className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Welcome to DoppelDown</h1>
        <p className="text-muted-foreground mt-2">Let's set up protection for your first brand</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
              step >= s ? 'bg-primary-600 text-white' : 'bg-muted text-muted-foreground'
            }`}>
              {step > s ? <CheckCircle className="h-5 w-5" /> : s}
            </div>
            {s < 3 && (
              <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-primary-600' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Add Your Brand</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Brand Name *</label>
              <input
                type="text"
                value={brandData.name}
                onChange={(e) => setBrandData({ ...brandData, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Acme Corp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Domain *</label>
              <input
                type="text"
                value={brandData.domain}
                onChange={(e) => setBrandData({ ...brandData, domain: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., acme.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Keywords (comma-separated)</label>
              <input
                type="text"
                value={brandData.keywords}
                onChange={(e) => setBrandData({ ...brandData, keywords: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., acme, acme corp, official"
              />
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-foreground mb-3">Social Media Handles (optional)</p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={brandData.twitter}
                  onChange={(e) => setBrandData({ ...brandData, twitter: e.target.value })}
                  className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Twitter @handle"
                />
                <input
                  type="text"
                  value={brandData.facebook}
                  onChange={(e) => setBrandData({ ...brandData, facebook: e.target.value })}
                  className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Facebook page"
                />
                <input
                  type="text"
                  value={brandData.instagram}
                  onChange={(e) => setBrandData({ ...brandData, instagram: e.target.value })}
                  className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Instagram @handle"
                />
                <input
                  type="text"
                  value={brandData.linkedin}
                  onChange={(e) => setBrandData({ ...brandData, linkedin: e.target.value })}
                  className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="LinkedIn company"
                />
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleCreateBrand}
              disabled={!brandData.name || !brandData.domain || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Run Your First Scan</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            {!scanning && !scanComplete && (
              <>
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Ready to scan {createdBrand?.name}
                </h3>
                <p className="text-muted-foreground mb-6">
                  We'll check for typosquatting domains, fake social accounts, and lookalike websites.
                  This may take a few minutes.
                </p>
                <Button onClick={handleStartScan}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Scan
                </Button>
              </>
            )}

            {scanning && (
              <>
                <Loader2 className="h-16 w-16 text-primary-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Scanning...</h3>
                <p className="text-muted-foreground">
                  Checked {scanResults?.domains_checked || 0} domains and reviewed {scanResults?.pages_scanned || 0} URLs.
                  Found {scanResults?.threats_found || 0} potential threats so far.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This can take a few minutes depending on network speed.
                </p>
                <Button variant="outline" className="mt-4" onClick={handleCancelScan} disabled={cancelling}>
                  {cancelling ? 'Stopping...' : 'Cancel scan'}
                </Button>
              </>
            )}

            {scanComplete && (
              <>
                {scanResults?.status === 'failed' && scanResults?.error?.toLowerCase?.().includes('cancelled') ? (
                  <>
                    <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Scan cancelled</h3>
                    <p className="text-muted-foreground mb-6">
                      You can start a new scan anytime.
                    </p>
                    <Button onClick={() => setStep(3)}>
                      Continue
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Scan Complete!</h3>
                    <p className="text-muted-foreground mb-2">
                      Found {scanResults?.threats_found || 0} potential threats
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Checked {scanResults?.domains_checked || 0} domains • Reviewed {scanResults?.pages_scanned || 0} URLs
                    </p>
                    <Button onClick={() => setStep(3)}>
                      Continue
                    </Button>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>You're All Set!</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {createdBrand?.name} is now protected
            </h3>
            <p className="text-muted-foreground mb-6">
              We'll continuously monitor for threats and alert you when we find something.
            </p>

            <div className="bg-muted rounded-lg p-4 mb-6 text-left">
              <h4 className="font-medium text-foreground mb-2">What happens next:</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Daily automated scans for new threats
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Email alerts for critical threats
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Evidence collection for takedowns
                </li>
              </ul>
            </div>

            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
