-- NRD (Newly Registered Domains) Feed Tables
-- Enterprise feature for monitoring newly registered domains for brand impersonation

-- Track NRD feed processing state
CREATE TABLE IF NOT EXISTS public.nrd_feed_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'open_nrd',
  last_processed_date DATE NOT NULL,
  domains_processed INTEGER DEFAULT 0,
  matches_found INTEGER DEFAULT 0,
  processing_time_ms INTEGER,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for finding latest state per provider
CREATE INDEX IF NOT EXISTS idx_nrd_feed_state_provider_date
  ON public.nrd_feed_state (provider, last_processed_date DESC);

COMMENT ON TABLE public.nrd_feed_state IS
  'Tracks the state of NRD feed processing, including last processed date and statistics';

-- Store NRD matches against brand keywords/domains
CREATE TABLE IF NOT EXISTS public.nrd_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  registration_date DATE,
  match_type TEXT NOT NULL, -- 'exact', 'keyword', 'typosquat'
  matched_keyword TEXT,     -- The keyword that triggered the match
  similarity_score REAL,    -- 0-1 similarity score for typosquat matches
  processed BOOLEAN DEFAULT false,
  threat_id UUID REFERENCES public.threats(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_nrd_matches_brand_id ON public.nrd_matches (brand_id);
CREATE INDEX IF NOT EXISTS idx_nrd_matches_domain ON public.nrd_matches (domain);
CREATE INDEX IF NOT EXISTS idx_nrd_matches_processed ON public.nrd_matches (processed) WHERE NOT processed;
CREATE INDEX IF NOT EXISTS idx_nrd_matches_created_at ON public.nrd_matches (created_at DESC);

-- Unique constraint to prevent duplicate matches
CREATE UNIQUE INDEX IF NOT EXISTS idx_nrd_matches_unique
  ON public.nrd_matches (brand_id, domain);

COMMENT ON TABLE public.nrd_matches IS
  'Stores NRD domains that match enterprise brand keywords or domains';
COMMENT ON COLUMN public.nrd_matches.match_type IS
  'Type of match: exact (matches brand domain), keyword (contains brand keyword), typosquat (similar to brand domain)';
COMMENT ON COLUMN public.nrd_matches.similarity_score IS
  'For typosquat matches, the Levenshtein-based similarity score (0-1). Higher = more similar';
