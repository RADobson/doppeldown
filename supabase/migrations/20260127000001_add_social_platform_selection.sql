-- Add enabled_social_platforms column to brands table
-- Allows users to select which social platforms to monitor based on their tier

ALTER TABLE public.brands
  ADD COLUMN IF NOT EXISTS enabled_social_platforms TEXT[] DEFAULT '{}';

-- Add index for efficient filtering
CREATE INDEX IF NOT EXISTS idx_brands_enabled_social_platforms
  ON public.brands USING gin (enabled_social_platforms);

COMMENT ON COLUMN public.brands.enabled_social_platforms IS
  'Array of social platform keys that are enabled for scanning. Platforms: twitter, facebook, instagram, linkedin, tiktok, youtube, telegram, discord';
