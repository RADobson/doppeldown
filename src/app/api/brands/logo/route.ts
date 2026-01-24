import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import crypto from 'crypto'

const MAX_LOGO_BYTES = parseInt(process.env.LOGO_MAX_BYTES || '5242880', 10)
const LOGO_BUCKET = process.env.SUPABASE_LOGO_BUCKET || 'logos'

const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/x-png'
])

function sanitizeFileName(name: string) {
  const cleaned = name.replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase()
  return cleaned || 'logo'
}

function inferExtension(file: File) {
  const nameParts = file.name?.split('.') || []
  const ext = nameParts.length > 1 ? nameParts.pop() : null
  if (ext && /^[a-z0-9]+$/i.test(ext)) return ext.toLowerCase()

  if (file.type === 'image/png' || file.type === 'image/x-png') return 'png'
  return 'png'
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const brandId = formData.get('brandId')
    const logoFile = formData.get('logo')

    if (!brandId || typeof brandId !== 'string') {
      return NextResponse.json({ error: 'Brand ID is required' }, { status: 400 })
    }

    if (!logoFile || !(logoFile instanceof File)) {
      return NextResponse.json({ error: 'Logo file is required' }, { status: 400 })
    }

    if (logoFile.size > MAX_LOGO_BYTES) {
      return NextResponse.json({ error: 'Logo file is too large' }, { status: 400 })
    }

    if (logoFile.type) {
      if (!ALLOWED_MIME_TYPES.has(logoFile.type)) {
        return NextResponse.json({ error: 'Logo must be a PNG image' }, { status: 400 })
      }
    } else {
      const ext = logoFile.name?.split('.').pop()?.toLowerCase()
      if (ext !== 'png') {
        return NextResponse.json({ error: 'Logo must be a PNG image' }, { status: 400 })
      }
    }

    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id')
      .eq('id', brandId)
      .eq('user_id', user.id)
      .single()

    if (brandError || !brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    const serviceClient = await createServiceClient()
    const fileExt = inferExtension(logoFile)
    const safeName = sanitizeFileName(logoFile.name)
    const storagePath = `brands/${brandId}/logo/${Date.now()}-${crypto.randomUUID()}-${safeName}.${fileExt}`
    const arrayBuffer = await logoFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const contentType = logoFile.type || `image/${fileExt}`

    const { error: uploadError } = await serviceClient.storage
      .from(LOGO_BUCKET)
      .upload(storagePath, buffer, {
        contentType,
        upsert: true
      })

    if (uploadError) throw uploadError

    const { data: publicUrlData } = serviceClient.storage
      .from(LOGO_BUCKET)
      .getPublicUrl(storagePath)

    const logoUrl = publicUrlData?.publicUrl
    if (!logoUrl) {
      return NextResponse.json({ error: 'Failed to resolve logo URL' }, { status: 500 })
    }

    const { error: updateError } = await serviceClient
      .from('brands')
      .update({ logo_url: logoUrl })
      .eq('id', brandId)

    if (updateError) throw updateError

    return NextResponse.json({ logo_url: logoUrl, storage_path: storagePath })
  } catch (error) {
    console.error('Error uploading brand logo:', error)
    return NextResponse.json(
      { error: 'Failed to upload logo' },
      { status: 500 }
    )
  }
}

function extractStoragePath(logoUrl: string) {
  const marker = '/storage/v1/object/public/'
  const index = logoUrl.indexOf(marker)
  if (index === -1) return null

  const remainder = decodeURIComponent(logoUrl.slice(index + marker.length))
  const [bucket, ...pathParts] = remainder.split('/')
  if (!bucket || pathParts.length === 0) return null
  return {
    bucket,
    path: pathParts.join('/')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const brandId = body?.brandId
    if (!brandId || typeof brandId !== 'string') {
      return NextResponse.json({ error: 'Brand ID is required' }, { status: 400 })
    }

    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id, logo_url')
      .eq('id', brandId)
      .eq('user_id', user.id)
      .single()

    if (brandError || !brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    const serviceClient = await createServiceClient()

    if (brand.logo_url) {
      const storageInfo = extractStoragePath(brand.logo_url)
      if (storageInfo) {
        await serviceClient.storage
          .from(storageInfo.bucket)
          .remove([storageInfo.path])
      }
    }

    const { error: updateError } = await serviceClient
      .from('brands')
      .update({ logo_url: null })
      .eq('id', brandId)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing brand logo:', error)
    return NextResponse.json(
      { error: 'Failed to remove logo' },
      { status: 500 }
    )
  }
}
