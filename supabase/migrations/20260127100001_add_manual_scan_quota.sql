-- Add manual scan quota tracking columns to users table
-- Rolling 7-day window: period_start is timestamp of first scan in window
-- count is cached number of scans since period_start

ALTER TABLE users
ADD COLUMN manual_scans_period_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN manual_scans_count INTEGER DEFAULT 0;

-- Partial index for quota queries (only non-null period starts)
-- Similar to is_admin partial index pattern from 01-01
CREATE INDEX idx_users_manual_scan_period
ON users(manual_scans_period_start)
WHERE manual_scans_period_start IS NOT NULL;

COMMENT ON COLUMN users.manual_scans_period_start IS 'Timestamp of first manual scan in current 7-day rolling window (NULL = no scans yet)';
COMMENT ON COLUMN users.manual_scans_count IS 'Cached count of manual scans in current period';
