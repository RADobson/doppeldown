import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { generateTakedownReport, generateHtmlReport, generateTextReport, generateCsvExport } from '@/lib/report-generator'

async function getStorageClient(userClient: any) {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createServiceClient()
  }
  return userClient
}

async function hydrateEvidenceUrls(userClient: any, threats: any[]) {
  const storageClient = await getStorageClient(userClient)
  const ttl = parseInt(process.env.EVIDENCE_SIGNED_URL_TTL_SECONDS || '3600', 10)

  return Promise.all(
    threats.map(async (threat) => {
      if (threat?.screenshot_url) return threat

      const evidence = threat?.evidence || {}
      const screenshot = evidence?.screenshots?.[0]
      const storagePath = screenshot?.storage_path
      const publicUrl = screenshot?.public_url
      if (!storagePath && publicUrl) {
        return { ...threat, screenshot_url: publicUrl }
      }

      if (!storagePath) return threat

      const bucket = evidence?.storage_bucket || process.env.SUPABASE_EVIDENCE_BUCKET || 'evidence'
      const { data } = await storageClient.storage.from(bucket).createSignedUrl(storagePath, ttl)
      if (!data?.signedUrl) return threat

      return { ...threat, screenshot_url: data.signedUrl }
    })
  )
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { brandId, threatIds, format = 'html', ownerName } = body

    if (!brandId) {
      return NextResponse.json({ error: 'Brand ID is required' }, { status: 400 })
    }

    // Get brand
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('*')
      .eq('id', brandId)
      .eq('user_id', user.id)
      .single()

    if (brandError || !brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    // Get threats
    let query = supabase
      .from('threats')
      .select('*')
      .eq('brand_id', brandId)

    if (threatIds && threatIds.length > 0) {
      query = query.in('id', threatIds)
    } else {
      // Default: get all unresolved threats
      query = query.not('status', 'in', '("resolved","false_positive")')
    }

    const { data: threats, error: threatsError } = await query

    if (threatsError) throw threatsError

    if (!threats || threats.length === 0) {
      return NextResponse.json({ error: 'No threats to include in report' }, { status: 400 })
    }

    const threatsWithEvidence = await hydrateEvidenceUrls(supabase, threats)

    // Generate report
    const report = generateTakedownReport(brand, threatsWithEvidence, ownerName || user.email || 'Brand Owner')

    // Create report record
    const { data: reportRecord, error: reportError } = await supabase
      .from('reports')
      .insert({
        brand_id: brandId,
        threat_ids: threats.map(t => t.id),
        type: 'takedown_request',
        status: 'ready'
      })
      .select()
      .single()

    if (reportError) throw reportError

    // Return report in requested format
    let content: string
    let contentType: string

    switch (format) {
      case 'html':
        content = generateHtmlReport(report)
        contentType = 'text/html'
        break
      case 'text':
        content = generateTextReport(report)
        contentType = 'text/plain'
        break
      case 'csv':
        content = generateCsvExport(report)
        contentType = 'text/csv'
        break
      default:
        content = JSON.stringify(report, null, 2)
        contentType = 'application/json'
    }

    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="takedown-report-${report.reportId}.${format === 'html' ? 'html' : format === 'csv' ? 'csv' : 'txt'}"`,
        'X-Report-Id': reportRecord.id
      }
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const brandId = searchParams.get('brandId')

    let query = supabase
      .from('reports')
      .select('*, brands!inner(user_id, name)')
      .eq('brands.user_id', user.id)
      .order('created_at', { ascending: false })

    if (brandId) {
      query = query.eq('brand_id', brandId)
    }

    const { data: reports, error } = await query

    if (error) throw error

    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}
