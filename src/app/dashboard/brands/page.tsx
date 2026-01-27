'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Search, Shield, MoreVertical, Play, Pause, Trash2, Settings, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface Brand {
  id: string
  name: string
  domain: string
  status: string
  threat_count: number
  keywords: string[]
  last_scan_at: string | null
  created_at: string
}

export default function BrandsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [brands, setBrands] = useState<Brand[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showMenu, setShowMenu] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchBrands()
  }, [])

  async function fetchBrands() {
    try {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBrands(data || [])
    } catch (error) {
      console.error('Error fetching brands:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleStatus(brand: Brand) {
    setActionLoading(brand.id)
    try {
      const supabase = createClient()
      const newStatus = brand.status === 'active' ? 'paused' : 'active'

      const { error } = await supabase
        .from('brands')
        .update({ status: newStatus })
        .eq('id', brand.id)

      if (error) throw error

      setBrands(brands.map(b =>
        b.id === brand.id ? { ...b, status: newStatus } : b
      ))
    } catch (error) {
      console.error('Error updating brand:', error)
    } finally {
      setActionLoading(null)
      setShowMenu(null)
    }
  }

  async function handleDelete(brandId: string) {
    if (!confirm('Are you sure you want to delete this brand? All associated threats and reports will also be deleted.')) {
      return
    }

    setActionLoading(brandId)
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', brandId)

      if (error) throw error

      setBrands(brands.filter(b => b.id !== brandId))
    } catch (error) {
      console.error('Error deleting brand:', error)
    } finally {
      setActionLoading(null)
      setShowMenu(null)
    }
  }

  async function handleRunScan(brandId: string) {
    setActionLoading(brandId)
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId, scanType: 'full' })
      })

      if (!response.ok) throw new Error('Failed to start scan')

      // Redirect to brand detail to see scan progress
      router.push(`/dashboard/brands/${brandId}`)
    } catch (error) {
      console.error('Error starting scan:', error)
      alert('Failed to start scan. Please try again.')
    } finally {
      setActionLoading(null)
      setShowMenu(null)
    }
  }

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.domain.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          <h1 className="text-2xl font-bold text-foreground">Brands</h1>
          <p className="text-muted-foreground mt-1">Manage the brands you're monitoring</p>
        </div>
        <Link href="/dashboard/brands/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Brand
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Brands Grid */}
      {filteredBrands.length === 0 ? (
        <Card>
          <CardContent className="py-0">
            {searchQuery ? (
              <EmptyState
                icon={Search}
                title="No brands found"
                description="Try a different search term"
              />
            ) : (
              <EmptyState
                icon={Shield}
                title="No brands yet"
                description="Add your first brand to start monitoring"
                action={{ label: 'Add Brand', href: '/dashboard/brands/new' }}
              />
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <Card key={brand.id} className="relative overflow-hidden">
              <CardContent className="pt-6">
                {/* Menu */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setShowMenu(showMenu === brand.id ? null : brand.id)}
                    className="p-1 text-muted-foreground hover:text-muted-foreground rounded"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  {showMenu === brand.id && (
                    <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-10">
                      <button
                        onClick={() => handleRunScan(brand.id)}
                        disabled={actionLoading === brand.id}
                        className="w-full flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Run Scan Now
                      </button>
                      <Link
                        href={`/dashboard/brands/${brand.id}`}
                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(brand)}
                        disabled={actionLoading === brand.id}
                        className="w-full flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        {brand.status === 'active' ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause Monitoring
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Resume Monitoring
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
                        disabled={actionLoading === brand.id}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Brand
                      </button>
                    </div>
                  )}
                </div>

                {/* Brand Info */}
                <Link href={`/dashboard/brands/${brand.id}`}>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-foreground">{brand.name}</h3>
                      <StatusBadge status={brand.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{brand.domain}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{brand.threat_count}</p>
                      <p className="text-sm text-muted-foreground">Total Threats</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {brand.last_scan_at ? formatDateTime(brand.last_scan_at) : 'Never'}
                      </p>
                      <p className="text-sm text-muted-foreground">Last Scan</p>
                    </div>
                  </div>

                  {/* Keywords */}
                  {brand.keywords && brand.keywords.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">Keywords</p>
                      <div className="flex flex-wrap gap-1">
                        {brand.keywords.slice(0, 3).map((keyword, i) => (
                          <Badge key={i} variant="default" size="sm">{keyword}</Badge>
                        ))}
                        {brand.keywords.length > 3 && (
                          <Badge variant="default" size="sm">+{brand.keywords.length - 3}</Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Created */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Created</span>
                      <span className="text-xs text-muted-foreground">{formatDateTime(brand.created_at)}</span>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
