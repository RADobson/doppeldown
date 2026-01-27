-- Migration: Add enhanced alert preferences columns
-- Phase: 05-alert-settings
-- Purpose: Support severity threshold, scan summary emails, and weekly digest features

-- Add severity_threshold column
-- Simplified threshold selector replacing alert_on_severity for new UI
-- Values: 'all' (low+), 'high_critical' (high/critical only), 'critical' (critical only)
-- Default: 'high_critical' to match existing alert_on_severity default of ['critical', 'high']
ALTER TABLE public.alert_settings
ADD COLUMN IF NOT EXISTS severity_threshold TEXT DEFAULT 'high_critical'
CHECK (severity_threshold IN ('all', 'high_critical', 'critical'));

-- Add scan_summary_emails column
-- Toggle for sending email summary after each scan completes
-- Default: TRUE (users get notified of scan results)
ALTER TABLE public.alert_settings
ADD COLUMN IF NOT EXISTS scan_summary_emails BOOLEAN DEFAULT TRUE;

-- Add weekly_digest column
-- Toggle for weekly digest emails (replacing daily_digest as canonical field)
-- Note: daily_digest column kept for backward compatibility - deprecated
-- Default: TRUE (users receive weekly summary)
ALTER TABLE public.alert_settings
ADD COLUMN IF NOT EXISTS weekly_digest BOOLEAN DEFAULT TRUE;

-- Add column comments for documentation
COMMENT ON COLUMN public.alert_settings.severity_threshold IS
  'Simplified threshold: all (low+), high_critical (high/critical), critical (critical only). Replaces alert_on_severity for new UI.';

COMMENT ON COLUMN public.alert_settings.scan_summary_emails IS
  'Whether to send email summary after each scan completes.';

COMMENT ON COLUMN public.alert_settings.weekly_digest IS
  'Whether to send weekly digest emails. This is the canonical digest field (daily_digest is deprecated).';

COMMENT ON COLUMN public.alert_settings.daily_digest IS
  'DEPRECATED: Use weekly_digest instead. Kept for backward compatibility during migration.';
