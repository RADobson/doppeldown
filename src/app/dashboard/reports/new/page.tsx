'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, FileText, CheckCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SeverityBadge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

interface Brand {
  id: string
  name: string
  domain: string
}

interface Threat {
  id: string
  url: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  type: string
  brand_id: string
}

const reportTypes = [
  {
    id: 'takedown_request',
    name: 'Takedown Request',
    description: 'Professional report formatted for registrars and hosting providers'
  },
  {
    id: 'evidence_package',
    name: 'Evidence Package',
    description: 'Complete evidence bundle with all collected data'
  },
  {
    id: 'summary',
    name: 'Summary Report',
    description: 'High-level overview for internal stakeholders'
  }
]

function NewReportContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedThreat = searchParams.get('threat')
  const preselectedBrand = searchParams.get('brand')

  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [threats, setThreats] = useState<Threat[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('takedown_request')
  const [selectedThreats, setSelectedThreats] = useState<string[]>(
    preselectedThreat ? [preselectedThreat] : []
  )

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Fetch user's brands
      const { data: brandsData, error: brandsError } = await supabase
        .from('brands')
        .select('id, name, domain')
        .eq('user_id', user.id)
        .order('name')

      if (brandsError) throw brandsError
      setBrands(brandsData || [])

      // Set initial brand
      if (preselectedBrand && brandsData?.some(b => b.id === preselectedBrand)) {
        setSelectedBrand(preselectedBrand)
      } else if (brandsData && brandsData.length > 0) {
        setSelectedBrand(brandsData[0].id)
      }

      // Fetch all threats for user's brands
      const { data: threatsData, error: threatsError } = await supabase
        .from('threats')
        .select('id, url, severity, type, brand_id')
        .in('brand_id', (brandsData || []).map(b => b.id))
        .not('status', 'in', '("resolved","false_positive")')
        .order('severity')

      if (threatsError) throw threatsError
      setThreats(threatsData || [])

      // If preselected threat, get its brand
      if (preselectedThreat && threatsData) {
        const threat = threatsData.find(t => t.id === preselectedThreat)
        if (threat) {
          setSelectedBrand(threat.brand_id)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const brandThreats = threats.filter(t => t.brand_id === selectedBrand)

  const toggleThreat = (id: string) => {
    setSelectedThreats(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  const selectAllThreats = () => {
    setSelectedThreats(brandThreats.map(t => t.id))
  }

  const handleGenerate = async () => {
    if (selectedThreats.length === 0) {
      alert('Please select at least one threat to include in the report')
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: selectedBrand,
          threatIds: selectedThreats,
          format: 'html'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate report')
      }

      // Download the report
      const blob = await response.blob()
      const reportId = response.headers.get('X-Report-Id') || Date.now().toString()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `takedown-report-${reportId}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Redirect to reports page
      router.push('/dashboard/reports')
    } catch (error) {
      console.error('Error generating report:', error)
      alert(error instanceof Error ? error.message : 'Failed to generate report')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (brands.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/reports">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No brands found</h3>
            <p className="text-gray-500 mb-6">
              You need to add a brand before you can generate reports.
            </p>
            <Link href="/dashboard/brands/new">
              <Button>Add Your First Brand</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/reports">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Generate Report</h1>
        <p className="text-gray-500 mt-1">Create a new takedown or evidence report</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Brand Selection */}
          <Card>
            <CardHeader>
              <CardTitle>1. Select Brand</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => {
                      setSelectedBrand(brand.id)
                      setSelectedThreats([])
                    }}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      selectedBrand === brand.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium text-gray-900">{brand.name}</p>
                    <p className="text-sm text-gray-500">{brand.domain}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Type */}
          <Card>
            <CardHeader>
              <CardTitle>2. Report Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full p-4 border rounded-lg text-left transition-colors ${
                      selectedType === type.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{type.name}</p>
                        <p className="text-sm text-gray-500">{type.description}</p>
                      </div>
                      {selectedType === type.id && (
                        <CheckCircle className="h-5 w-5 text-primary-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Threat Selection */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>3. Select Threats to Include</CardTitle>
              {brandThreats.length > 0 && (
                <Button variant="ghost" size="sm" onClick={selectAllThreats}>
                  Select All
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {brandThreats.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No active threats found for this brand</p>
                  <p className="text-sm text-gray-400">
                    Run a scan to detect potential threats, or select a different brand.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {brandThreats.map((threat) => (
                    <button
                      key={threat.id}
                      onClick={() => toggleThreat(threat.id)}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        selectedThreats.includes(threat.id)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedThreats.includes(threat.id)}
                          onChange={() => {}}
                          className="h-4 w-4 text-primary-600 rounded"
                        />
                        <SeverityBadge severity={threat.severity} />
                        <span className="text-sm font-mono text-gray-700 truncate">
                          {threat.url}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Report Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Brand</p>
                <p className="font-medium">
                  {brands.find(b => b.id === selectedBrand)?.name || 'None selected'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Report Type</p>
                <p className="font-medium">
                  {reportTypes.find(t => t.id === selectedType)?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Threats Included</p>
                <p className="font-medium">{selectedThreats.length} selected</p>
              </div>

              <div className="pt-4 border-t">
                <Button
                  className="w-full"
                  disabled={selectedThreats.length === 0 || generating}
                  onClick={handleGenerate}
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-400 text-center mt-2">
                  Report will be downloaded automatically
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function NewReportPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    }>
      <NewReportContent />
    </Suspense>
  )
}
