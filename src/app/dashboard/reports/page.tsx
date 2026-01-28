'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileText, Download, Send, Plus, Search, Clock, CheckCircle, Loader2, MoreVertical, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDateTime } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { SwipeableListItem } from '@/components/ui/swipeable-list-item'

interface Report {
  id: string
  brand_id: string
  type: string
  status: string
  threat_ids: string[]
  sent_to: string | null
  created_at: string
  brands: { name: string }
}

const reportTypeLabels: Record<string, string> = {
  takedown_request: 'Takedown Request',
  evidence_package: 'Evidence Package',
  summary: 'Summary Report'
}

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  generating: { label: 'Generating', icon: Loader2, color: 'text-yellow-600 bg-yellow-100' },
  ready: { label: 'Ready', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  sent: { label: 'Sent', icon: Send, color: 'text-blue-600 bg-blue-100' }
}

export default function ReportsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState<Report[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [downloading, setDownloading] = useState<string | null>(null)
  const [showMenu, setShowMenu] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchReports()
  }, [])

  // Click outside handler for kebab menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(null)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showMenu])

  async function fetchReports() {
    try {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('reports')
        .select('*, brands!inner(name, user_id)')
        .eq('brands.user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReports(data || [])
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDownload(report: Report) {
    setDownloading(report.id)
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: report.brand_id,
          threatIds: report.threat_ids,
          format: 'html'
        })
      })

      if (!response.ok) throw new Error('Failed to generate report')

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report-${report.id}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading report:', error)
      alert('Failed to download report')
    } finally {
      setDownloading(null)
    }
  }

  async function handleSend(report: Report) {
    const email = prompt('Enter the email address to send this report to:')
    if (!email) return

    try {
      const supabase = createClient()

      // Update report status to sent
      const { error } = await supabase
        .from('reports')
        .update({ status: 'sent', sent_to: email })
        .eq('id', report.id)

      if (error) throw error

      // Update local state
      setReports(reports.map(r =>
        r.id === report.id ? { ...r, status: 'sent', sent_to: email } : r
      ))

      alert(`Report marked as sent to ${email}. Note: Email delivery requires additional setup.`)
    } catch (error) {
      console.error('Error updating report:', error)
      alert('Failed to update report status')
    }
  }

  async function handleDeleteReport(id: string) {
    setDeleting(id)
    setShowMenu(null)

    // Backup the report for rollback
    const reportToDelete = reports.find(r => r.id === id)
    if (!reportToDelete) return

    // Optimistically remove from state
    setReports(reports.filter(r => r.id !== id))

    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete report')
      }
    } catch (error) {
      console.error('Error deleting report:', error)

      // Rollback: restore report to state and re-sort
      setReports(prevReports => {
        const restored = [...prevReports, reportToDelete]
        return restored.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      })

      alert('Failed to delete report. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.brands?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || report.type === typeFilter
    return matchesSearch && matchesType
  })

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
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">Generate and manage takedown reports</p>
        </div>
        <Link href="/dashboard/reports/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value="takedown_request">Takedown Request</option>
              <option value="evidence_package">Evidence Package</option>
              <option value="summary">Summary Report</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No reports found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || typeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Generate your first report to get started'}
            </p>
            {!searchQuery && typeFilter === 'all' && (
              <Link href="/dashboard/reports/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Report
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const statusInfo = statusConfig[report.status] || statusConfig.ready
            const StatusIcon = statusInfo.icon

            return (
              <SwipeableListItem
                key={report.id}
                onDelete={() => handleDeleteReport(report.id)}
                disabled={deleting === report.id}
              >
                <Card className="relative">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-accent rounded-lg">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">
                              {reportTypeLabels[report.type] || report.type}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              <StatusIcon className={`h-3 w-3 ${report.status === 'generating' ? 'animate-spin' : ''}`} />
                              {statusInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {report.brands?.name} • {report.threat_ids?.length || 0} threats included
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Created {formatDateTime(report.created_at)}
                            {report.sent_to && ` • Sent to ${report.sent_to}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-auto items-center">
                        {report.status === 'ready' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(report)}
                              disabled={downloading === report.id}
                            >
                              {downloading === report.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4 mr-2" />
                              )}
                              Download
                            </Button>
                            <Button size="sm" onClick={() => handleSend(report)}>
                              <Send className="h-4 w-4 mr-2" />
                              Send
                            </Button>
                          </>
                        )}
                        {report.status === 'sent' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(report)}
                            disabled={downloading === report.id}
                          >
                            {downloading === report.id ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4 mr-2" />
                            )}
                            Download
                          </Button>
                        )}
                        {report.status === 'generating' && (
                          <Button variant="outline" size="sm" disabled>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </Button>
                        )}

                        {/* Kebab menu */}
                        <div ref={showMenu === report.id ? menuRef : null} className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowMenu(showMenu === report.id ? null : report.id)
                            }}
                            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                            aria-label="More options"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          {showMenu === report.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-20">
                              <button
                                onClick={() => handleDeleteReport(report.id)}
                                disabled={deleting === report.id}
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Report
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SwipeableListItem>
            )
          })}
        </div>
      )}

      {/* Quick Tips */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-3">Report Types</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground mb-1">Takedown Request</h4>
              <p className="text-sm text-muted-foreground">
                Professional report ready to send to registrars and hosting providers
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground mb-1">Evidence Package</h4>
              <p className="text-sm text-muted-foreground">
                Complete evidence bundle with screenshots, WHOIS, and HTML captures
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground mb-1">Summary Report</h4>
              <p className="text-sm text-muted-foreground">
                Overview of all threats for internal review and stakeholder updates
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
