-- Add detailed progress tracking and retry visibility to scans table
-- Enables real-time progress percentage, error aggregation, and retry status

-- Add step tracking columns
ALTER TABLE scans ADD COLUMN IF NOT EXISTS current_step TEXT;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS step_progress INTEGER DEFAULT 0;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS step_total INTEGER DEFAULT 0;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS overall_progress INTEGER DEFAULT 0;

-- Add error aggregation column (JSONB array of error objects)
ALTER TABLE scans ADD COLUMN IF NOT EXISTS partial_errors JSONB DEFAULT '[]'::jsonb;

-- Add retry tracking (synced from scan_jobs.attempts for UI visibility)
-- HARD-03: Failed scans auto-retry - this column lets UI show "Retry 2/3"
ALTER TABLE scans ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;

-- Add column comments for documentation
COMMENT ON COLUMN scans.current_step IS 'Current scan phase: domains, web, logo, social, evidence';
COMMENT ON COLUMN scans.step_progress IS 'Items completed in current step';
COMMENT ON COLUMN scans.step_total IS 'Total items in current step';
COMMENT ON COLUMN scans.overall_progress IS 'Overall scan progress 0-100 percentage';
COMMENT ON COLUMN scans.partial_errors IS 'Array of non-fatal errors that occurred during scan';
COMMENT ON COLUMN scans.retry_count IS 'Number of retry attempts (synced from scan_jobs.attempts)';
