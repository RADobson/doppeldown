'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Search, Download, ExternalLink, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SeverityBadge, StatusBadge } from '@/components/ui/badge'
import { formatDateTime, truncateUrl } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface Threat {
  id: string
  url: string
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: string
  detected_at: string
  brand_id: string
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

export default function ThreatsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [threats, setThreats] = useState<Threat[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [stats, setStats] = useState({ total: 0, critical: 0, high: 0, new: 0 })

  const getThreatScore = (threat: Threat) => {
    if (typeof threat.threat_score === 'number') return Math.round(threat.threat_score)
    if (typeof threat.analysis?.compositeScore === 'number') return Math.round(threat.analysis.compositeScore)
    return null
  }

  useEffect(() => {
    fetchThreats()
  }, [])

  async function fetchThreats() {
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
        .eq('brands.user_id', user.id)
        .order('detected_at', { ascending: false })

      if (error) throw error
      setThreats(data || [])

      // Calculate stats
      const allThreats = data || []
      setStats({
        total: allThreats.length,
        critical: allThreats.filter(t => t.severity === 'critical').length,
        high: allThreats.filter(t => t.severity === 'high').length,
        new: allThreats.filter(t => t.status === 'new').length
      })
    } catch (error) {
      console.error('Error fetching threats:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredThreats = threats.filter(threat => {
    const matchesSearch = threat.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.brands?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || threat.severity === severityFilter
    const matchesStatus = statusFilter === 'all' || threat.status === statusFilter
    const matchesType = typeFilter === 'all' || threat.type === typeFilter
    return matchesSearch && matchesSeverity && matchesStatus && matchesType
  })

  async function exportCsv() {
    const csvContent = [
      ['URL', 'Type', 'Severity', 'Status', 'Brand', 'Threat Score', 'Detected At'].join(','),
      ...filteredThreats.map(t => [
        `"${t.url}"`,
        threatTypeLabels[t.type] || t.type,
        t.severity,
        t.status,
        t.brands?.name || '',
        typeof t.threat_score === 'number'
          ? Math.round(t.threat_score)
          : (typeof t.analysis?.compositeScore === 'number' ? Math.round(t.analysis.compositeScore) : ''),
        t.detected_at
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `threats-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Threats</h1>
          <p className="text-muted-foreground mt-1">
            {stats.total} total threats • {stats.critical} critical • {stats.new} new
          </p>
        </div>
        <Button variant="outline" onClick={exportCsv}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by URL or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="investigating">Investigating</option>
                <option value="confirmed">Confirmed</option>
                <option value="takedown_requested">Takedown Requested</option>
                <option value="resolved">Resolved</option>
                <option value="false_positive">False Positive</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Types</option>
                <option value="phishing_page">Phishing Page</option>
                <option value="typosquat_domain">Typosquat Domain</option>
                <option value="lookalike_website">Lookalike Website</option>
                <option value="fake_social_account">Fake Social Account</option>
                <option value="brand_impersonation">Brand Impersonation</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threats List */}
      {filteredThreats.length === 0 ? (
        <Card>
          <CardContent className="py-0">
            <EmptyState
              icon={AlertTriangle}
              title="No threats found"
              description={
                searchQuery || severityFilter !== 'all' || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No threats have been detected yet'
              }
              action={
                !(searchQuery || severityFilter !== 'all' || statusFilter !== 'all' || typeFilter !== 'all')
                  ? { label: 'Run a scan', href: '/dashboard/brands' }
                  : undefined
              }
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredThreats.map((threat) => {
                const score = getThreatScore(threat)
                return (
                <Link
                  key={threat.id}
                  href={`/dashboard/threats/${threat.id}`}
                  className="flex items-center justify-between p-4 hover:bg-muted transition-colors"
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
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{threat.brands?.name}</span>
                    </div>
                    <p className="text-sm font-mono text-foreground truncate">
                      {truncateUrl(threat.url, 60)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Detected: {formatDateTime(threat.detected_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <StatusBadge status={threat.status} />
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
