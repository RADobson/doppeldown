-- DoppelDown Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'active', 'cancelled', 'past_due')),
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'professional', 'enterprise')),
    subscription_id TEXT,
    customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Brands table
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    domain TEXT NOT NULL,
    logo_url TEXT,
    keywords TEXT[] DEFAULT '{}',
    social_handles JSONB DEFAULT '{}',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused')),
    threat_count INTEGER DEFAULT 0,
    last_scan_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Threats table
CREATE TABLE IF NOT EXISTS public.threats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    scan_id UUID,
    type TEXT NOT NULL CHECK (type IN ('typosquat_domain', 'lookalike_website', 'phishing_page', 'fake_social_account', 'brand_impersonation', 'trademark_abuse')),
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'confirmed', 'takedown_requested', 'resolved', 'false_positive')),
    url TEXT NOT NULL,
    domain TEXT,
    title TEXT,
    description TEXT,
    screenshot_url TEXT,
    whois_data JSONB,
    evidence JSONB DEFAULT '{"screenshots": [], "whois_snapshots": [], "html_snapshots": [], "timestamps": []}',
    analysis JSONB DEFAULT '{}'::jsonb,
    analysis_version TEXT,
    threat_score NUMERIC,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    resolved_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Scans table
CREATE TABLE IF NOT EXISTS public.scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    scan_type TEXT DEFAULT 'full' CHECK (scan_type IN ('full', 'quick', 'domain_only', 'web_only', 'social_only', 'automated')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    threats_found INTEGER DEFAULT 0,
    domains_checked INTEGER DEFAULT 0,
    pages_scanned INTEGER DEFAULT 0,
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Link threats to scans
DO $$
BEGIN
    ALTER TABLE public.threats
        ADD CONSTRAINT threats_scan_id_fkey
        FOREIGN KEY (scan_id) REFERENCES public.scans(id) ON DELETE SET NULL;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Scan jobs table (queue for background workers)
CREATE TABLE IF NOT EXISTS public.scan_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    scan_id UUID REFERENCES public.scans(id) ON DELETE SET NULL,
    scan_type TEXT NOT NULL CHECK (scan_type IN ('full', 'quick', 'domain_only', 'web_only', 'social_only', 'automated')),
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
    priority INTEGER NOT NULL DEFAULT 0,
    payload JSONB DEFAULT '{}'::jsonb,
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    attempts INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 3,
    locked_at TIMESTAMP WITH TIME ZONE,
    locked_by TEXT,
    last_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Reports table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    threat_ids UUID[] DEFAULT '{}',
    type TEXT DEFAULT 'takedown_request' CHECK (type IN ('takedown_request', 'evidence_package', 'summary')),
    status TEXT DEFAULT 'generating' CHECK (status IN ('generating', 'ready', 'sent')),
    pdf_url TEXT,
    sent_to TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Alert settings table
CREATE TABLE IF NOT EXISTS public.alert_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    email_alerts BOOLEAN DEFAULT true,
    alert_email TEXT,
    alert_on_severity TEXT[] DEFAULT '{"critical", "high"}',
    daily_digest BOOLEAN DEFAULT true,
    instant_critical BOOLEAN DEFAULT true,
    webhook_url TEXT,
    webhook_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_brands_user_id ON public.brands(user_id);
CREATE INDEX IF NOT EXISTS idx_threats_brand_id ON public.threats(brand_id);
CREATE INDEX IF NOT EXISTS idx_threats_scan_id ON public.threats(scan_id);
CREATE INDEX IF NOT EXISTS idx_threats_severity ON public.threats(severity);
CREATE INDEX IF NOT EXISTS idx_threats_status ON public.threats(status);
CREATE INDEX IF NOT EXISTS idx_threats_detected_at ON public.threats(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_threats_score ON public.threats(threat_score DESC);
CREATE INDEX IF NOT EXISTS idx_scans_brand_id ON public.scans(brand_id);
CREATE INDEX IF NOT EXISTS idx_reports_brand_id ON public.reports(brand_id);
CREATE INDEX IF NOT EXISTS idx_scan_jobs_brand_id ON public.scan_jobs(brand_id);
CREATE INDEX IF NOT EXISTS idx_scan_jobs_status ON public.scan_jobs(status);
CREATE INDEX IF NOT EXISTS idx_scan_jobs_scheduled_at ON public.scan_jobs(scheduled_at);

-- Auto-create public.users row on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, subscription_status, subscription_tier)
    VALUES (
        NEW.id,
        NEW.email,
        NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
        'free',
        'free'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
ALTER FUNCTION public.handle_new_user() SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for brands table
CREATE POLICY "Users can view own brands" ON public.brands
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own brands" ON public.brands
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brands" ON public.brands
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brands" ON public.brands
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for threats table
CREATE POLICY "Users can view threats for own brands" ON public.threats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.brands
            WHERE brands.id = threats.brand_id
            AND brands.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create threats for own brands" ON public.threats
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.brands
            WHERE brands.id = threats.brand_id
            AND brands.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update threats for own brands" ON public.threats
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.brands
            WHERE brands.id = threats.brand_id
            AND brands.user_id = auth.uid()
        )
    );

-- RLS Policies for scans table
CREATE POLICY "Users can view scans for own brands" ON public.scans
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.brands
            WHERE brands.id = scans.brand_id
            AND brands.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create scans for own brands" ON public.scans
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.brands
            WHERE brands.id = scans.brand_id
            AND brands.user_id = auth.uid()
        )
    );

-- RLS Policies for scan_jobs table
CREATE POLICY "Users can view scan jobs for own brands" ON public.scan_jobs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.brands
            WHERE brands.id = scan_jobs.brand_id
            AND brands.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create scan jobs for own brands" ON public.scan_jobs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.brands
            WHERE brands.id = scan_jobs.brand_id
            AND brands.user_id = auth.uid()
        )
    );

-- RLS Policies for reports table
CREATE POLICY "Users can view reports for own brands" ON public.reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.brands
            WHERE brands.id = reports.brand_id
            AND brands.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create reports for own brands" ON public.reports
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.brands
            WHERE brands.id = reports.brand_id
            AND brands.user_id = auth.uid()
        )
    );

-- RLS Policies for alert_settings table
CREATE POLICY "Users can view own alert settings" ON public.alert_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own alert settings" ON public.alert_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alert settings" ON public.alert_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to auto-create user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_brands_updated_at
    BEFORE UPDATE ON public.brands
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_threats_updated_at
    BEFORE UPDATE ON public.threats
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_alert_settings_updated_at
    BEFORE UPDATE ON public.alert_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_scan_jobs_updated_at
    BEFORE UPDATE ON public.scan_jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
