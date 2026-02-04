import { NextRequest } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit-logger'
import { 
  withErrorHandler, 
  createSuccessResponse,
  AppError,
  NotFoundError,
  UnauthorizedError,
} from '@/lib/errors'
import { logger } from '@/lib/logger'

async function getHandler(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  // Authenticate
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new UnauthorizedError()
  }

  // Fetch scan and verify ownership via brand
  const { data: scan, error } = await supabase
    .from('scans')
    .select('*, brands!inner(user_id)')
    .eq('id', id)
    .eq('brands.user_id', user.id)
    .single()

  if (error || !scan) {
    throw new NotFoundError('Scan', id)
  }

  return createSuccessResponse(scan)
}

async function deleteHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Authenticate
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new UnauthorizedError()
  }

  // 2. Fetch scan and verify ownership via brand
  const { data: scan, error: fetchError } = await supabase
    .from('scans')
    .select('id, brand_id, scan_type, threats_found, brands!inner(user_id)')
    .eq('id', id)
    .single<{ 
      id: string
      brand_id: string
      scan_type: string
      threats_found: number
      brands: { user_id: string } 
    }>()

  if (fetchError || !scan) {
    throw new NotFoundError('Scan', id)
  }

  // Verify user owns the brand
  if (scan.brands.user_id !== user.id) {
    // Return 404 to avoid leaking scan existence
    throw new NotFoundError('Scan', id)
  }

  // 3. Query threats count for audit metadata
  const { count: threatsCount, error: countError } = await supabase
    .from('threats')
    .select('id', { count: 'exact', head: true })
    .eq('scan_id', id)

  if (countError) {
    logger.warn('Failed to count threats for audit log', {
      userId: user.id,
      scanId: id,
      error: countError.message,
    })
  }

  // 4. Collect evidence storage paths from associated threats for cleanup
  const { data: threats, error: threatsError } = await supabase
    .from('threats')
    .select('evidence')
    .eq('scan_id', id)

  if (threatsError) {
    logger.warn('Failed to fetch threats for cleanup', {
      userId: user.id,
      scanId: id,
      error: threatsError.message,
    })
  }

  const storagePaths: string[] = []
  if (threats) {
    for (const threat of threats) {
      if (threat.evidence?.screenshots) {
        for (const screenshot of threat.evidence.screenshots) {
          if (screenshot.storage_path) {
            storagePaths.push(screenshot.storage_path)
          }
        }
      }
    }
  }

  // 5. Best-effort storage file cleanup using service client
  if (storagePaths.length > 0) {
    try {
      const storageClient = await createServiceClient()
      const bucket = process.env.SUPABASE_EVIDENCE_BUCKET || 'evidence'

      const { error: storageError } = await storageClient.storage
        .from(bucket)
        .remove(storagePaths)

      if (storageError) {
        logger.warn('Failed to delete evidence files during scan cleanup', {
          userId: user.id,
          scanId: id,
          error: storageError.message,
          paths: storagePaths,
        })
        // Continue - orphaned files acceptable
      } else {
        logger.info('Evidence files cleaned up', {
          userId: user.id,
          scanId: id,
          filesDeleted: storagePaths.length,
        })
      }
    } catch (storageErr) {
      logger.warn('Storage cleanup error during scan deletion', {
        userId: user.id,
        scanId: id,
        error: storageErr instanceof Error ? storageErr.message : String(storageErr),
      })
      // Continue - best-effort cleanup
    }
  }

  // 6. Call logAudit() before deletion
  await logAudit({
    user_id: user.id,
    user_email: user.email,
    action: 'DELETE',
    entity_type: 'scan',
    entity_id: scan.id,
    metadata: {
      brand_id: scan.brand_id,
      scan_type: scan.scan_type,
      cascade_threats_count: threatsCount || 0
    }
  })

  // 7. Delete associated threats BEFORE scan deletion
  // CRITICAL: threats.scan_id FK is ON DELETE SET NULL, not CASCADE
  // So we must manually delete threats to fully clean up
  // Use service client for delete to bypass RLS (ownership already verified above)
  const serviceClient = await createServiceClient()

  const { error: threatsDeleteError } = await serviceClient
    .from('threats')
    .delete()
    .eq('scan_id', id)

  if (threatsDeleteError) {
    logger.error('Failed to delete associated threats', threatsDeleteError, {
      userId: user.id,
      scanId: id,
    })
    throw new AppError('DATABASE_ERROR', 'Failed to delete associated threats')
  }

  // 8. Delete the scan
  const { error: deleteError } = await serviceClient
    .from('scans')
    .delete()
    .eq('id', id)

  if (deleteError) {
    logger.error('Failed to delete scan', deleteError, {
      userId: user.id,
      scanId: id,
    })
    throw new AppError('DATABASE_ERROR', 'Failed to delete scan')
  }

  logger.info('Scan deleted successfully', {
    userId: user.id,
    scanId: id,
    brandId: scan.brand_id,
    threatsDeleted: threatsCount || 0,
  })

  return createSuccessResponse({ success: true })
}

export const GET = withErrorHandler(getHandler)
export const DELETE = withErrorHandler(deleteHandler)
