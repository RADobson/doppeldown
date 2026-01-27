'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlatformSelector } from '@/components/PlatformSelector'
import { createClient } from '@/lib/supabase/client'
import { getEffectiveTier, getSocialPlatformLimit, type SocialPlatform } from '@/lib/tier-limits'

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

export default function NewBrandPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [tierLoading, setTierLoading] = useState(true)
  const [maxPlatforms, setMaxPlatforms] = useState(1)
  const [enabledSocialPlatforms, setEnabledSocialPlatforms] = useState<SocialPlatform[]>([])

  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    keywords: [] as string[],
    newKeyword: '',
    socialHandles: Object.fromEntries(
      SOCIAL_PLATFORMS.map(platform => [platform.key, ['']])
    ) as Record<string, string[]>
  })

  // Fetch user tier on mount
  useEffect(() => {
    async function fetchUserTier() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

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
      } catch (error) {
        console.error('Error fetching user tier:', error)
      } finally {
        setTierLoading(false)
      }
    }

    fetchUserTier()
  }, [router])

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview)
      }
    }
  }, [logoPreview])

  const addKeyword = () => {
    setFormData((prev) => {
      const trimmed = prev.newKeyword.trim()
      if (!trimmed || prev.keywords.includes(trimmed)) {
        return prev
      }
      return {
        ...prev,
        keywords: [...prev.keywords, trimmed],
        newKeyword: ''
      }
    })
  }

  const removeKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }))
  }

  const addSocialHandle = (platform: string) => {
    setFormData(prev => {
      const nextHandles = { ...prev.socialHandles }
      const handles = [...(nextHandles[platform] || [])]
      handles.push('')
      nextHandles[platform] = handles
      return { ...prev, socialHandles: nextHandles }
    })
  }

  const updateSocialHandle = (platform: string, index: number, value: string) => {
    setFormData(prev => {
      const nextHandles = { ...prev.socialHandles }
      const handles = [...(nextHandles[platform] || [])]
      handles[index] = value
      nextHandles[platform] = handles
      return { ...prev, socialHandles: nextHandles }
    })
  }

  const removeSocialHandle = (platform: string, index: number) => {
    setFormData(prev => {
      const nextHandles = { ...prev.socialHandles }
      const handles = [...(nextHandles[platform] || [])]
      handles.splice(index, 1)
      nextHandles[platform] = handles.length > 0 ? handles : ['']
      return { ...prev, socialHandles: nextHandles }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const social_handles = Object.fromEntries(
        Object.entries(formData.socialHandles).map(([platform, handles]) => {
          const cleaned = handles.map(handle => handle.trim()).filter(Boolean)
          return [platform, cleaned]
        }).filter(([_, handles]) => (handles as string[]).length > 0)
      )

      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          domain: formData.domain,
          keywords: formData.keywords,
          social_handles,
          enabled_social_platforms: enabledSocialPlatforms
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create brand')
      }

      const brand = await response.json()

      if (logoFile) {
        try {
          const logoForm = new FormData()
          logoForm.append('brandId', brand.id)
          logoForm.append('logo', logoFile)
          const logoResponse = await fetch('/api/brands/logo', {
            method: 'POST',
            body: logoForm
          })
          if (!logoResponse.ok) {
            throw new Error('Logo upload failed')
          }
        } catch (logoError) {
          console.error('Logo upload failed:', logoError)
          alert('Brand created, but logo upload failed. You can upload it later from the brand page.')
        }
      }

      // Start initial scan
      setScanning(true)
      await fetch(`/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId: brand.id })
      })

      router.push(`/dashboard/brands/${brand.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
      setScanning(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/brands"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to brands
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Brand</h1>
        <p className="text-gray-500 mt-1">Set up monitoring for a new brand</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Brand Information</CardTitle>
            <CardDescription>Basic details about the brand you want to protect</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Brand Name"
              placeholder="e.g., Acme Inc"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              hint="The name that will be monitored for impersonation"
            />

            <Input
              label="Primary Domain"
              placeholder="e.g., acme.com"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value.replace(/^https?:\/\//, '').replace(/\/$/, '') })}
              required
              hint="Your official domain (without http/https)"
            />

            <div>
              <Input
                type="file"
                label="Brand Logo (optional)"
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
                hint="Upload your official logo to enable logo-based scans (PNG required)"
              />
              {logoPreview && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
                    <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain" />
                  </div>
                  <p className="text-sm text-gray-600">{logoFile?.name}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Keywords */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Keywords</CardTitle>
            <CardDescription>Additional terms to monitor (product names, slogans, etc.)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Add a keyword"
                value={formData.newKeyword}
                onChange={(e) => setFormData({ ...formData, newKeyword: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addKeyword()
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={addKeyword}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Social Platform Selection</CardTitle>
            <CardDescription>Choose which social platforms to scan for impersonators</CardDescription>
          </CardHeader>
          <CardContent>
            {tierLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <PlatformSelector
                value={enabledSocialPlatforms}
                onChange={setEnabledSocialPlatforms}
                maxPlatforms={maxPlatforms}
              />
            )}
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Social Media Handles</CardTitle>
            <CardDescription>Add your official social handles - we'll scan for fake accounts impersonating these</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {SOCIAL_PLATFORMS.map((platform) => {
              const handles = formData.socialHandles[platform.key] || ['']
              return (
                <div key={platform.key} className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">{platform.label}</p>
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
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link href="/dashboard/brands">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading || scanning}>
            {scanning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running Initial Scan...
              </>
            ) : loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Brand & Start Scan'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
