-- Audit logs table for tracking delete operations
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL CHECK (action IN ('DELETE')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('scan', 'threat', 'report')),
  entity_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at DESC);

-- Enable RLS (safe to run multiple times)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist, then recreate
DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Service can insert audit logs" ON public.audit_logs;

-- Admins can view all audit logs
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = TRUE
    )
  );

-- Service role can insert audit logs
CREATE POLICY "Service can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (TRUE);
