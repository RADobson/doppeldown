-- Add auto_scan_enabled column to brands table
ALTER TABLE public.brands
ADD COLUMN IF NOT EXISTS auto_scan_enabled BOOLEAN DEFAULT true;

-- Add comment for documentation
COMMENT ON COLUMN public.brands.auto_scan_enabled IS
  'When false, brand is excluded from automated cron scans. Users can still trigger manual scans.';

-- Create partial index for efficient scheduling query
-- Used by cron job to find brands eligible for automated scanning
CREATE INDEX IF NOT EXISTS idx_brands_auto_scan_scheduling
ON public.brands(last_scan_at DESC)
WHERE status = 'active' AND auto_scan_enabled = true;

-- Add comment explaining the index purpose
COMMENT ON INDEX public.idx_brands_auto_scan_scheduling IS
  'Optimizes cron scheduling query: finds active brands with auto-scan enabled, ordered by oldest scan first';
