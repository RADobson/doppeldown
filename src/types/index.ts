export interface User {
  id: string;
  email: string;
  created_at: string;
  subscription_status: 'free' | 'active' | 'cancelled' | 'past_due';
  subscription_tier: 'free' | 'starter' | 'professional' | 'enterprise';
  subscription_id?: string;
  customer_id?: string;
  is_admin?: boolean;
}

export interface Brand {
  id: string;
  user_id: string;
  name: string;
  domain: string;
  logo_url?: string;
  keywords: string[];
  social_handles: SocialHandles;
  created_at: string;
  last_scan_at?: string;
  threat_count: number;
  status: 'active' | 'paused';
}

export type SocialHandleValue = string | string[];

export interface SocialHandles {
  twitter?: SocialHandleValue;
  facebook?: SocialHandleValue;
  instagram?: SocialHandleValue;
  linkedin?: SocialHandleValue;
  tiktok?: SocialHandleValue;
  youtube?: SocialHandleValue;
  telegram?: SocialHandleValue;
  discord?: SocialHandleValue;
}

export interface Threat {
  id: string;
  brand_id: string;
  scan_id?: string;
  type: ThreatType;
  severity: ThreatSeverity;
  status: ThreatStatus;
  url: string;
  domain?: string;
  title?: string;
  description?: string;
  screenshot_url?: string;
  whois_data?: WhoisData;
  evidence: Evidence;
  threat_score?: number;
  analysis?: ThreatAnalysis;
  analysis_version?: string;
  detected_at: string;
  resolved_at?: string;
  notes?: string;
}

export type ThreatType =
  | 'typosquat_domain'
  | 'lookalike_website'
  | 'phishing_page'
  | 'fake_social_account'
  | 'brand_impersonation'
  | 'trademark_abuse';

export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low';

export type ThreatStatus =
  | 'new'
  | 'investigating'
  | 'confirmed'
  | 'takedown_requested'
  | 'resolved'
  | 'false_positive';

export interface WhoisData {
  domain: string;
  registrar?: string;
  creation_date?: string;
  expiration_date?: string;
  registrant_name?: string;
  registrant_org?: string;
  registrant_country?: string;
  name_servers?: string[];
  raw?: string;
}

export interface Evidence {
  screenshots: ScreenshotEvidence[];
  whois_snapshots: WhoisSnapshot[];
  html_snapshots: HtmlSnapshot[];
  timestamps: string[];
  storage_bucket?: string;
  storage_provider?: 'supabase';
}

export interface ScreenshotEvidence {
  url: string;
  captured_at: string;
  storage_path: string;
  public_url?: string;
  content_type?: string;
  size_bytes?: number;
}

export interface WhoisSnapshot {
  data: WhoisData;
  captured_at: string;
}

export interface HtmlSnapshot {
  url: string;
  captured_at: string;
  html?: string;
  html_preview?: string;
  storage_path?: string;
  content_type?: string;
  size_bytes?: number;
  truncated?: boolean;
  analysis?: PageAnalysis;
}

export interface PageAnalysis {
  hasLoginForm: boolean;
  hasPaymentForm: boolean;
  hasBrandMentions: number;
  suspiciousElements: string[];
}

export interface ThreatAnalysis {
  version: string;
  domainRiskScore: number;
  visualSimilarityScore: number | null;
  visualSimilarityStatus: 'pending' | 'unavailable' | 'computed';
  visualSimilarityProvider?: string;
  visualSimilarityConfidence?: number;
  visualSimilarityRationale?: string;
  visualSimilarityModel?: string;
  phishingIntentScore: number;
  phishingIntentSignals: string[];
  phishingIntentClass: 'phishing' | 'suspicious' | 'benign' | 'unknown';
  phishingIntentConfidence?: number;
  phishingIntentRationale?: string;
  phishingIntentModel?: string;
  phishingIntentSource: 'heuristic' | 'openai';
  compositeScore: number;
  compositeSeverity: ThreatSeverity;
  weights: {
    domainRisk: number;
    visualSimilarity: number;
    phishingIntent: number;
  };
}

export type ScanError = {
  type: string;        // 'dns_check', 'screenshot', 'whois', etc.
  target?: string;     // Domain or URL that failed
  error: string;       // Error message
  timestamp: string;   // ISO timestamp
  retryable: boolean;  // Whether this error could be retried
};

export interface ScanResult {
  id: string;
  brand_id: string;
  scan_type: 'full' | 'quick' | 'domain_only' | 'web_only' | 'social_only' | 'automated';
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  threats_found: number;
  domains_checked: number;
  pages_scanned: number;
  social_accounts_checked: number;
  error?: string;
  // Progress tracking fields
  current_step?: string;
  step_progress?: number;
  step_total?: number;
  overall_progress?: number;
  partial_errors?: ScanError[];
  retry_count?: number;
}

export interface Report {
  id: string;
  brand_id: string;
  threat_ids: string[];
  type: 'takedown_request' | 'evidence_package' | 'summary';
  status: 'generating' | 'ready' | 'sent';
  pdf_url?: string;
  created_at: string;
  sent_to?: string;
}

export interface DomainVariation {
  domain: string;
  type: VariationType;
  registered: boolean;
  threat_level: ThreatSeverity;
  checked_at: string;
}

export type VariationType =
  | 'typo'
  | 'homoglyph'
  | 'hyphen'
  | 'tld_swap'
  | 'subdomain'
  | 'bitsquat'
  | 'vowel_swap'
  | 'double_letter'
  | 'missing_letter'
  | 'added_letter'
  | 'keyboard_proximity';

/**
 * Alert settings for user notification preferences.
 *
 * Note on severity fields:
 * - `severity_threshold` is the new simplified threshold for the UI ('all', 'high_critical', 'critical')
 * - `alert_on_severity` is kept for backward compatibility with existing code
 *
 * Note on digest fields:
 * - `weekly_digest` is the canonical field for digest preferences
 * - `daily_digest` is deprecated and kept only for migration compatibility
 */
export interface AlertSettings {
  email_alerts: boolean;
  alert_email: string;
  /** @deprecated Use severity_threshold for new UI */
  alert_on_severity: ThreatSeverity[];
  /** Simplified severity threshold: 'all' (low+), 'high_critical' (high/critical), 'critical' (critical only) */
  severity_threshold: 'all' | 'high_critical' | 'critical';
  /** Whether to send email summary after each scan completes */
  scan_summary_emails: boolean;
  /** @deprecated Use weekly_digest instead */
  daily_digest: boolean;
  /** Whether to send weekly digest emails */
  weekly_digest: boolean;
  instant_critical: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  brand_limit: number;
  scan_frequency: 'daily' | 'weekly' | 'monthly';
  features: string[];
  stripe_price_id: string;
}
