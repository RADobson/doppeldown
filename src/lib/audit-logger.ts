import { createServiceClient } from './supabase/server'
import type { AuditAction, AuditEntityType } from '../types'

interface AuditLogEntry {
  user_id: string
  user_email?: string
  action: AuditAction
  entity_type: AuditEntityType
  entity_id: string
  metadata?: Record<string, unknown>
}

export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    const supabase = await createServiceClient()

    const { error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: entry.user_id,
        user_email: entry.user_email,
        action: entry.action,
        entity_type: entry.entity_type,
        entity_id: entry.entity_id,
        metadata: entry.metadata || {},
      })

    if (error) {
      console.error('Failed to write audit log:', error)
    }
  } catch (err) {
    // Best-effort: audit failure must not block delete operations
    console.error('Audit logging error:', err)
  }
}
