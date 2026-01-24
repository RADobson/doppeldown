-- Add is_admin column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.users.is_admin IS
  'Admin users bypass all tier limits (brand count, scan quotas)';

-- Create partial index for efficient admin lookups (only indexes true values)
CREATE INDEX IF NOT EXISTS idx_users_is_admin
ON public.users(is_admin)
WHERE is_admin = true;
