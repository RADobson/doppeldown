import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { UnauthorizedError, withErrorHandler, createSuccessResponse } from '@/lib/errors'
import { isAllowedAdminEmail } from '@/lib/admin/allowed-admin'
import { getModelApiUsageSnapshot } from '@/lib/admin/model-usage'

async function getHandler(_request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAllowedAdminEmail(user.email)) {
    throw new UnauthorizedError()
  }

  const data = await getModelApiUsageSnapshot()
  return createSuccessResponse(data)
}

export const GET = withErrorHandler(getHandler)
