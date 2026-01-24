import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

type EvidenceKind = 'screenshot' | 'html'

function resolveEvidencePath(evidence: any, kind: EvidenceKind, index: number) {
  const list = kind === 'screenshot'
    ? (evidence?.screenshots || [])
    : (evidence?.html_snapshots || [])
  const item = list[index] || list[0]
  return item?.storage_path as string | undefined
}

function resolveEvidenceBucket(evidence: any) {
  return evidence?.storage_bucket || process.env.SUPABASE_EVIDENCE_BUCKET || 'evidence'
}

function resolveTtlSeconds(value?: unknown) {
  const envDefault = parseInt(process.env.EVIDENCE_SIGNED_URL_TTL_SECONDS || '3600', 10)
  const parsed = typeof value === 'string' || typeof value === 'number'
    ? parseInt(String(value), 10)
    : envDefault
  if (Number.isNaN(parsed)) return envDefault
  return Math.min(Math.max(parsed, 60), 86400)
}

async function getStorageClient(supabase: any) {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createServiceClient()
  }
  return supabase
}

async function handleSign(request: NextRequest, body: any) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const threatId = body?.threatId as string | undefined
  const kind = (body?.kind as EvidenceKind) || 'screenshot'
  const index = typeof body?.index === 'number' ? body.index : 0
  const ttl = resolveTtlSeconds(body?.expiresIn)

  if (!threatId) {
    return NextResponse.json({ error: 'threatId is required' }, { status: 400 })
  }

  const { data: threat, error } = await supabase
    .from('threats')
    .select('id, evidence, brands!inner(user_id)')
    .eq('id', threatId)
    .eq('brands.user_id', user.id)
    .single()

  if (error || !threat) {
    return NextResponse.json({ error: 'Threat not found' }, { status: 404 })
  }

  const evidence = threat.evidence || {}
  const path = resolveEvidencePath(evidence, kind, index)
  if (!path) {
    return NextResponse.json({ error: 'Evidence not found' }, { status: 404 })
  }

  const bucket = resolveEvidenceBucket(evidence)
  const storageClient = await getStorageClient(supabase)
  const { data, error: signError } = await storageClient.storage
    .from(bucket)
    .createSignedUrl(path, ttl)

  if (signError || !data?.signedUrl) {
    return NextResponse.json({ error: signError?.message || 'Failed to sign URL' }, { status: 500 })
  }

  return NextResponse.json({
    signedUrl: data.signedUrl,
    expiresIn: ttl,
    bucket,
    path
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    return await handleSign(request, body)
  } catch (error) {
    console.error('Evidence signing error:', error)
    return NextResponse.json({ error: 'Failed to sign evidence URL' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const threatId = searchParams.get('threatId')
    const kind = (searchParams.get('kind') as EvidenceKind) || 'screenshot'
    const index = searchParams.get('index')
    const expiresIn = searchParams.get('expiresIn')

    return await handleSign(request, {
      threatId,
      kind,
      index: index ? parseInt(index, 10) : 0,
      expiresIn: expiresIn ? parseInt(expiresIn, 10) : undefined
    })
  } catch (error) {
    console.error('Evidence signing error:', error)
    return NextResponse.json({ error: 'Failed to sign evidence URL' }, { status: 500 })
  }
}
