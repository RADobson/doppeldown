import { createClient } from '@supabase/supabase-js'
import { runScanForBrand } from '../src/lib/scan-runner'
import { config as loadEnv } from 'dotenv'
import crypto from 'crypto'

loadEnv({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
})

const WORKER_ID = process.env.WORKER_ID || `scan-worker-${crypto.randomUUID()}`
const POLL_MS = parseInt(process.env.SCAN_WORKER_POLL_MS || '5000', 10)
const STALE_MINUTES = parseInt(process.env.SCAN_JOB_STALE_MINUTES || '30', 10)

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function claimNextJob() {
  const now = new Date().toISOString()
  const staleBefore = new Date(Date.now() - STALE_MINUTES * 60 * 1000).toISOString()

  const { data: jobs, error } = await supabase
    .from('scan_jobs')
    .select('*')
    .eq('status', 'queued')
    .lte('scheduled_at', now)
    .or(`locked_at.is.null,locked_at.lt.${staleBefore}`)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(1)

  if (error) {
    console.error('Failed to fetch scan jobs:', error)
    return null
  }

  const job = jobs && jobs[0]
  if (!job) return null

  const { data: claimed, error: claimError } = await supabase
    .from('scan_jobs')
    .update({
      status: 'running',
      locked_at: now,
      locked_by: WORKER_ID,
      started_at: now,
      attempts: (job.attempts || 0) + 1
    })
    .eq('id', job.id)
    .eq('status', 'queued')
    .select('*')
    .single()

  if (claimError || !claimed) {
    return null
  }

  return claimed
}

async function completeJob(jobId: string) {
  const now = new Date().toISOString()
  await supabase
    .from('scan_jobs')
    .update({
      status: 'completed',
      completed_at: now,
      locked_at: null,
      locked_by: null,
      last_error: null
    })
    .eq('id', jobId)
}

async function failOrRetryJob(job: any, error: Error) {
  const now = new Date().toISOString()
  const attempts = job.attempts || 0
  const maxAttempts = job.max_attempts || 3
  const isCancelled = /cancelled by user/i.test(error.message)

  if (isCancelled) {
    await supabase
      .from('scan_jobs')
      .update({
        status: 'cancelled',
        completed_at: now,
        locked_at: null,
        locked_by: null,
        last_error: error.message
      })
      .eq('id', job.id)

    if (job.scan_id) {
      await supabase
        .from('scans')
        .update({
          status: 'failed',
          completed_at: now,
          error: error.message
        })
        .eq('id', job.scan_id)
    }
    return
  }
  const shouldRetry = attempts < maxAttempts
  const backoffMs = Math.min(60000, attempts * 5000)

  await supabase
    .from('scan_jobs')
    .update({
      status: shouldRetry ? 'queued' : 'failed',
      scheduled_at: shouldRetry ? new Date(Date.now() + backoffMs).toISOString() : job.scheduled_at,
      completed_at: shouldRetry ? null : now,
      started_at: shouldRetry ? null : job.started_at,
      locked_at: null,
      locked_by: null,
      last_error: error.message
    })
    .eq('id', job.id)

  if (!shouldRetry && job.scan_id) {
    await supabase
      .from('scans')
      .update({
        status: 'failed',
        completed_at: now,
        error: error.message
      })
      .eq('id', job.scan_id)
  }
}

async function processJob(job: any) {
  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .select('*')
    .eq('id', job.brand_id)
    .single()

  if (brandError || !brand) {
    if (brandError) {
      console.error('Failed to fetch brand for job', {
        jobId: job.id,
        brandId: job.brand_id,
        error: brandError
      })
    }
    throw new Error(brandError?.message ? `Brand not found for job: ${brandError.message}` : 'Brand not found for job')
  }

  let user: any = null
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, email, subscription_status, subscription_tier')
    .eq('id', brand.user_id)
    .maybeSingle()

  if (userError) {
    const { data: userFallback } = await supabase
      .from('users')
      .select('id, email')
      .eq('id', brand.user_id)
      .maybeSingle()
    user = userFallback || null
  } else {
    user = userData || null
  }

  const triggerAlerts = job.scan_type === 'automated'

  await runScanForBrand({
    supabase,
    brand: { ...brand, users: user },
    scanId: job.scan_id,
    scanType: job.scan_type,
    jobPayload: job.payload || {},
    triggerAlerts
  })
}

async function workerLoop() {
  console.log(`Scan worker started: ${WORKER_ID}`)

  while (true) {
    const job = await claimNextJob()

    if (!job) {
      await sleep(POLL_MS)
      continue
    }

    try {
      await processJob(job)
      await completeJob(job.id)
    } catch (error) {
      console.error(`Job ${job.id} failed:`, error)
      await failOrRetryJob(job, error instanceof Error ? error : new Error('Unknown error'))
    }
  }
}

process.on('SIGINT', () => {
  console.log('Scan worker shutting down...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('Scan worker shutting down...')
  process.exit(0)
})

workerLoop().catch(err => {
  console.error('Scan worker crashed:', err)
  process.exit(1)
})
