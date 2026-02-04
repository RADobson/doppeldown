# DoppelDown: Third-Party Integrations & Ecosystem Strategy
*Version 1.0 | Prepared: 2026-02-05*
*Companion to: PARTNERSHIP_CHANNEL_STRATEGY.md, OPERATIONAL_READINESS.md, CUSTOMER_ACQUISITION_GROWTH_STRATEGY.md*

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Integration Philosophy & Principles](#2-integration-philosophy--principles)
3. [Technical Foundation: The Integrations Platform](#3-technical-foundation-the-integrations-platform)
4. [Integration Tier Framework](#4-integration-tier-framework)
5. [Tier 1: Notification & Communication Integrations](#5-tier-1-notification--communication-integrations)
   - 5.1 Slack
   - 5.2 Microsoft Teams
   - 5.3 Discord
   - 5.4 Email (Advanced)
   - 5.5 SMS/WhatsApp (Twilio)
6. [Tier 2: MSP/MSSP Tool Integrations](#6-tier-2-mspmssp-tool-integrations)
   - 6.1 ConnectWise PSA & Manage
   - 6.2 Datto Autotask
   - 6.3 HaloPSA
   - 6.4 NinjaOne (NinjaRMM)
   - 6.5 Kaseya VSA
7. [Tier 3: Automation & Workflow Integrations](#7-tier-3-automation--workflow-integrations)
   - 7.1 Zapier
   - 7.2 Make (formerly Integromat)
   - 7.3 n8n
   - 7.4 Power Automate
8. [Tier 4: Security & Incident Management Integrations](#8-tier-4-security--incident-management-integrations)
   - 8.1 PagerDuty
   - 8.2 Opsgenie (Atlassian)
   - 8.3 Jira Service Management
   - 8.4 SIEM/SOAR (Splunk, Elastic, Sentinel)
   - 8.5 TheHive / Cortex
9. [Tier 5: CRM & Business Tool Integrations](#9-tier-5-crm--business-tool-integrations)
   - 9.1 HubSpot
   - 9.2 Salesforce
   - 9.3 Notion / Confluence (Documentation)
10. [Tier 6: E-Commerce Platform Integrations](#10-tier-6-e-commerce-platform-integrations)
    - 10.1 Shopify App
    - 10.2 WooCommerce Plugin
    - 10.3 BigCommerce
11. [Tier 7: Domain & Infrastructure Integrations](#11-tier-7-domain--infrastructure-integrations)
    - 11.1 Cloudflare
    - 11.2 Domain Registrar APIs
    - 11.3 Google Workspace / Microsoft 365 (DMARC)
12. [API Design & Developer Experience](#12-api-design--developer-experience)
13. [Webhook System Architecture](#13-webhook-system-architecture)
14. [Marketplace & Listing Strategy](#14-marketplace--listing-strategy)
15. [Partnership Approaches by Integration Type](#15-partnership-approaches-by-integration-type)
16. [Go-to-Market Strategy for Integrations](#16-go-to-market-strategy-for-integrations)
17. [Phased Implementation Roadmap](#17-phased-implementation-roadmap)
18. [Integration Quality & Reliability](#18-integration-quality--reliability)
19. [Metrics & Success Criteria](#19-metrics--success-criteria)
20. [Risk Register & Mitigations](#20-risk-register--mitigations)

---

## 1. Executive Summary

### The Integration Thesis

DoppelDown's core product detects brand threats. But **threats are only valuable when they reach the right person, in the right tool, at the right time.** A brand impersonation alert sitting unread in a DoppelDown dashboard is a failed alert. The same alert arriving in a Slack channel, creating a ConnectWise ticket, or triggering a PagerDuty incident is an **actionable threat**.

Integrations transform DoppelDown from a "tool you log into" to a "system embedded in your workflow." This matters because:

1. **Customers don't want another dashboard** — They want threats surfaced where they already work
2. **MSP partners need PSA/RMM integration** — Without ConnectWise/Autotask integration, partners must manually re-enter threat data (they won't)
3. **Marketplace presence = free distribution** — Slack App Directory, Shopify App Store, Zapier's 6,000+ integrations are all discovery channels
4. **Integrations increase stickiness** — A customer who has DoppelDown wired into Slack + PagerDuty + ConnectWise is 5x harder to churn than one using the web dashboard alone
5. **"Powered by DoppelDown"** — Every integration is a surface area where DoppelDown's brand appears inside another product's ecosystem

### Strategic Objectives

| Objective | Measure | Timeline |
|-----------|---------|----------|
| Alerts reach customers in <5 min via their preferred tool | Alert delivery latency by channel | Month 6 |
| 50% of Business/Enterprise customers use ≥1 integration | Integration adoption rate | Month 12 |
| Listed in 3+ major marketplaces (Slack, Zapier, ConnectWise) | Marketplace listings | Month 9 |
| Integrations cited as a buying factor in 30%+ of closed deals | Win/loss analysis | Month 12 |
| MSP partner activation improves 2x with PSA integration | Partner activation rate | Month 12 |

### Integration Revenue Impact Model

Integrations don't generate revenue directly — they **multiply it** through higher conversion, lower churn, and partner activation:

```
┌─────────────────────────────────────────────────────────────────┐
│          INTEGRATION REVENUE MULTIPLIER MODEL                    │
│                                                                  │
│  WITHOUT INTEGRATIONS:                                           │
│  • Free → Paid conversion: 10%                                  │
│  • Monthly churn: 5%                                            │
│  • MSP partner activation: 60%                                  │
│  • Average monthly expansion: 2%                                │
│                                                                  │
│  WITH INTEGRATIONS (projected):                                  │
│  • Free → Paid conversion: 14% (+40%)                           │
│  │  ↳ "Set up Slack alerts" in onboarding = higher engagement  │
│  • Monthly churn: 3% (-40%)                                     │
│  │  ↳ Embedded in workflow = higher switching cost              │
│  • MSP partner activation: 80% (+33%)                           │
│  │  ↳ ConnectWise integration = frictionless ticket creation    │
│  • Average monthly expansion: 4% (+100%)                        │
│  │  ↳ Visible alerts → more stakeholders see value → upgrade   │
│                                                                  │
│  NET IMPACT ON MONTH 12 MRR:                                    │
│  Without integrations: ~$15,000 MRR (baseline)                  │
│  With integrations:    ~$22,000 MRR (+47%)                      │
│                                                                  │
│  The integrations themselves cost $0 per customer.               │
│  The engineering investment pays back in reduced churn alone.    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Integration Philosophy & Principles

### Core Principles

**1. "Alerts Where You Work" — Not "Another Dashboard"**
DoppelDown's primary integration value is getting threat alerts into the tools people already use. The DoppelDown dashboard is for deep investigation; integrations are for awareness and triage.

**2. API-First, Integrations Second**
Every integration is built on DoppelDown's public API and webhook system. We never build integration-specific backend logic that bypasses the API. This ensures:
- Any customer can build what we haven't built yet
- Integrations are maintainable (one API surface, not N custom backends)
- The API stays honest (if integrations use it, it works)

**3. Webhooks as the Universal Connector**
The webhook system is the foundation. Every event in DoppelDown (new threat, scan complete, risk score change, takedown status update) emits a webhook. Integrations consume webhooks. Customers who want custom integrations consume webhooks.

**4. Progressive Complexity**
- **Level 1:** One-click "Send alerts to Slack/Teams" (5-minute setup)
- **Level 2:** Zapier/Make connection for custom workflows (15-minute setup)
- **Level 3:** Direct API integration for custom builds (requires developer)

Every customer should find their level. Most will stay at Level 1. That's fine.

**5. Partner-Centric Integration Priorities**
MSP partners are Priority #1 customers. Their toolchain (ConnectWise, Autotask, HaloPSA) gets prioritised over tools that serve only direct customers. A ConnectWise integration that activates 10 MSP partners generates 10x the revenue of a Notion integration that delights 5 individual customers.

### What DoppelDown Is NOT Building

| ❌ Not Building | Why |
|----------------|-----|
| A general-purpose iPaaS (integration platform) | Zapier/Make exist. Don't reinvent them. |
| Two-way deep sync with every CRM | Read/write CRM sync is a maintenance nightmare. Push alerts only. |
| Custom integration per partner | Build reusable integrations; don't build bespoke solutions per partner. |
| Complex workflow builders inside DoppelDown | Zapier is the workflow builder. DoppelDown triggers events. |

---

## 3. Technical Foundation: The Integrations Platform

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   DOPPELDOWN INTEGRATIONS ARCHITECTURE                   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │                    DOPPELDOWN CORE                           │       │
│  │                                                              │       │
│  │  Scan Engine → Threat Detection → Risk Scoring → Alerts     │       │
│  │       │              │                │            │         │       │
│  │       └──────────────┴────────────────┴────────────┘         │       │
│  │                          │                                    │       │
│  │                    EVENT BUS                                  │       │
│  │              (internal event system)                          │       │
│  └──────────────────────┬───────────────────────────────────────┘       │
│                         │                                               │
│                         ▼                                               │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │              INTEGRATIONS PLATFORM LAYER                     │      │
│  │                                                              │      │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐    │      │
│  │  │  WEBHOOK     │  │  PUBLIC API   │  │  OAUTH          │    │      │
│  │  │  DISPATCHER  │  │  (REST + key) │  │  MANAGER        │    │      │
│  │  │              │  │              │  │  (token store)   │    │      │
│  │  │  • Retry     │  │  • /threats  │  │  • Slack OAuth   │    │      │
│  │  │  • Queue     │  │  • /scans    │  │  • Teams OAuth   │    │      │
│  │  │  • Sign      │  │  • /brands   │  │  • HubSpot OAuth │    │      │
│  │  │  • Filter    │  │  • /reports  │  │  • Refresh cycle │    │      │
│  │  └──────┬──────┘  └──────┬───────┘  └────────┬────────┘    │      │
│  │         │                │                    │              │      │
│  └─────────┼────────────────┼────────────────────┼──────────────┘      │
│            │                │                    │                      │
│            ▼                ▼                    ▼                      │
│  ┌─────────────────────────────────────────────────────────────┐      │
│  │                    INTEGRATION ADAPTERS                      │      │
│  │                                                              │      │
│  │  ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐           │      │
│  │  │ Slack  │ │ Teams  │ │ConnectW. │ │ Zapier   │           │      │
│  │  │Adapter │ │Adapter │ │ Adapter  │ │ Triggers │           │      │
│  │  └────────┘ └────────┘ └──────────┘ └──────────┘           │      │
│  │  ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐           │      │
│  │  │PagerDt │ │Jira SM │ │ HubSpot  │ │ Shopify  │           │      │
│  │  │Adapter │ │Adapter │ │ Adapter  │ │ Adapter  │           │      │
│  │  └────────┘ └────────┘ └──────────┘ └──────────┘           │      │
│  │                                                              │      │
│  │  Each adapter:                                               │      │
│  │  • Transforms DoppelDown events → partner format            │      │
│  │  • Handles auth (OAuth tokens, API keys)                    │      │
│  │  • Manages rate limits and retries                          │      │
│  │  • Logs delivery status                                     │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                    DATA STORES                               │      │
│  │                                                              │      │
│  │  integrations (Supabase)         integration_logs            │      │
│  │  • id                            • id                        │      │
│  │  • user_id / partner_org_id      • integration_id            │      │
│  │  • type (slack, teams, etc.)     • event_type                │      │
│  │  • config (encrypted JSON)       • status (sent/failed/retry)│      │
│  │  • status (active/paused)        • payload_hash              │      │
│  │  • created_at                    • response_code             │      │
│  │                                  • created_at                │      │
│  └──────────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
```

### Database Schema: Integration Tables

```sql
-- Integration configurations
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  partner_org_id UUID REFERENCES partner_organisations(id), -- NULL for direct customers
  brand_id UUID REFERENCES brands(id), -- NULL = all brands for this user/partner
  
  -- Integration type and configuration
  type TEXT NOT NULL, -- 'slack', 'teams', 'connectwise', 'zapier', 'pagerduty', etc.
  name TEXT NOT NULL, -- user-defined name: "Slack - #security-alerts"
  config JSONB NOT NULL DEFAULT '{}', -- encrypted; schema varies by type
  
  -- State
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'paused', 'error', 'pending_auth'
  last_triggered_at TIMESTAMPTZ,
  error_message TEXT,
  error_count INTEGER DEFAULT 0,
  
  -- Filtering
  event_types TEXT[] DEFAULT ARRAY['threat.new', 'threat.severity_change', 'scan.complete'],
  min_severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integration delivery logs (append-only, for debugging and audit)
CREATE TABLE integration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES integrations(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_id UUID, -- reference to the originating event (threat, scan, etc.)
  
  -- Delivery details
  status TEXT NOT NULL, -- 'sent', 'failed', 'retrying', 'filtered'
  attempt_number INTEGER DEFAULT 1,
  response_code INTEGER,
  response_body TEXT, -- truncated, first 500 chars
  error_message TEXT,
  latency_ms INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook subscriptions (for customers building custom integrations)
CREATE TABLE webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  partner_org_id UUID REFERENCES partner_organisations(id),
  
  url TEXT NOT NULL,
  secret TEXT NOT NULL, -- for HMAC signature verification
  event_types TEXT[] NOT NULL,
  min_severity TEXT DEFAULT 'low',
  
  status TEXT NOT NULL DEFAULT 'active',
  last_triggered_at TIMESTAMPTZ,
  consecutive_failures INTEGER DEFAULT 0, -- auto-disable after 10 consecutive failures
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OAuth tokens for third-party integrations
CREATE TABLE integration_oauth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
  
  provider TEXT NOT NULL, -- 'slack', 'microsoft', 'hubspot', etc.
  access_token TEXT NOT NULL, -- encrypted at rest
  refresh_token TEXT, -- encrypted at rest
  token_type TEXT DEFAULT 'Bearer',
  scope TEXT,
  expires_at TIMESTAMPTZ,
  
  -- Provider-specific metadata
  team_id TEXT, -- Slack workspace ID
  team_name TEXT, -- Slack workspace name
  channel_id TEXT, -- Slack/Teams channel ID
  channel_name TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_integrations_user ON integrations(user_id);
CREATE INDEX idx_integrations_partner ON integrations(partner_org_id);
CREATE INDEX idx_integrations_type ON integrations(type);
CREATE INDEX idx_integration_logs_integration ON integration_logs(integration_id);
CREATE INDEX idx_integration_logs_created ON integration_logs(created_at);
CREATE INDEX idx_webhook_subs_user ON webhook_subscriptions(user_id);

-- RLS Policies
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own integrations"
  ON integrations FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own integration logs"
  ON integration_logs FOR SELECT
  USING (integration_id IN (
    SELECT id FROM integrations WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own webhooks"
  ON webhook_subscriptions FOR ALL
  USING (auth.uid() = user_id);
```

### Event Types (The Integration Vocabulary)

Every integration speaks the same event vocabulary. This is the canonical list of events that can trigger integrations:

```typescript
// src/lib/integrations/events.ts

export type DoppelDownEventType =
  // Threat events
  | 'threat.new'                    // New threat detected
  | 'threat.severity_change'        // Threat severity upgraded/downgraded
  | 'threat.status_change'          // Threat status changed (active, investigating, resolved, false_positive)
  | 'threat.takedown_requested'     // Takedown request initiated
  | 'threat.takedown_complete'      // Takedown confirmed
  | 'threat.evidence_updated'       // New evidence collected for a threat
  
  // Scan events
  | 'scan.started'                  // Scan initiated
  | 'scan.complete'                 // Scan completed (with summary)
  | 'scan.failed'                   // Scan failed (with error)
  
  // Brand events
  | 'brand.risk_score_change'       // Brand's overall risk score changed significantly
  | 'brand.new_domain_variation'    // New domain variation discovered (even if not yet active)
  
  // Report events
  | 'report.generated'              // Scheduled or manual report ready
  
  // Account events (useful for partner integrations)
  | 'account.usage_limit_approaching' // 80% of plan limit reached
  | 'account.usage_limit_reached';    // Plan limit hit

export interface DoppelDownEvent {
  id: string;                       // Unique event ID (UUID)
  type: DoppelDownEventType;
  timestamp: string;                // ISO 8601
  brand_id: string;
  brand_name: string;
  brand_domain: string;
  
  // Event-specific payload
  data: Record<string, unknown>;
  
  // Metadata
  severity?: 'low' | 'medium' | 'high' | 'critical';
  user_id: string;
  partner_org_id?: string;
}
```

### Event Payload Examples

```json
// threat.new
{
  "id": "evt_01HZ...",
  "type": "threat.new",
  "timestamp": "2026-02-05T10:30:00Z",
  "brand_id": "brand_01HX...",
  "brand_name": "Acme Corp",
  "brand_domain": "acmecorp.com",
  "severity": "high",
  "data": {
    "threat_id": "thr_01HZ...",
    "threat_type": "lookalike_domain",
    "threat_url": "acme-corp-login.com",
    "risk_score": 85,
    "summary": "Active lookalike domain with login page mimicking acmecorp.com. MX records configured, potentially sending phishing emails.",
    "evidence": {
      "screenshot_url": "https://evidence.doppeldown.com/...",
      "whois_registrar": "NameSilo",
      "whois_created": "2026-01-28",
      "has_ssl": true,
      "has_mx_records": true,
      "page_similarity_score": 0.87
    },
    "recommended_action": "Initiate takedown request with registrar"
  }
}

// scan.complete
{
  "id": "evt_01HZ...",
  "type": "scan.complete",
  "timestamp": "2026-02-05T10:35:00Z",
  "brand_id": "brand_01HX...",
  "brand_name": "Acme Corp",
  "brand_domain": "acmecorp.com",
  "data": {
    "scan_id": "scan_01HZ...",
    "duration_seconds": 45,
    "domains_checked": 247,
    "new_threats_found": 2,
    "total_active_threats": 5,
    "risk_score": 72,
    "risk_score_change": "+8",
    "summary": "Scan complete. 2 new threats detected: 1 high-severity lookalike domain, 1 medium-severity social media impersonation."
  }
}
```

### Webhook Delivery System

```typescript
// src/lib/integrations/webhook-dispatcher.ts

/**
 * Webhook delivery with exponential backoff retry.
 * 
 * Retry schedule: 30s, 2min, 10min, 1hr, 6hr (5 attempts max)
 * Auto-disable after 10 consecutive failures across events.
 * 
 * All payloads signed with HMAC-SHA256 using the subscription secret.
 * Signature in X-DoppelDown-Signature header.
 * Timestamp in X-DoppelDown-Timestamp header (for replay protection).
 */

interface WebhookDelivery {
  subscription_id: string;
  url: string;
  payload: DoppelDownEvent;
  secret: string;
  attempt: number;
}

// Signature generation
function signPayload(payload: string, secret: string, timestamp: number): string {
  const message = `${timestamp}.${payload}`;
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

// Headers sent with every webhook
// X-DoppelDown-Signature: sha256=<hex>
// X-DoppelDown-Timestamp: <unix_seconds>
// X-DoppelDown-Event: <event_type>
// X-DoppelDown-Delivery-Id: <uuid>
// Content-Type: application/json
// User-Agent: DoppelDown-Webhook/1.0
```

### Integration Configuration UI (Conceptual)

```
┌─────────────────────────────────────────────────────────────────┐
│  SETTINGS > INTEGRATIONS                                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  CONNECTED INTEGRATIONS                                   │   │
│  │                                                           │   │
│  │  🟢 Slack — #security-alerts      [Configure] [Disable]  │   │
│  │  🟢 ConnectWise — Auto-ticket     [Configure] [Disable]  │   │
│  │  🔴 PagerDuty — Critical only     [Reconnect] [Remove]   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ADD INTEGRATION                        [Filter: All ▼]   │   │
│  │                                                           │   │
│  │  COMMUNICATION                                            │   │
│  │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐               │   │
│  │  │ Slack │ │ Teams │ │Discord│ │ Email │               │   │
│  │  │  ✓    │ │       │ │       │ │  ✓    │               │   │
│  │  └───────┘ └───────┘ └───────┘ └───────┘               │   │
│  │                                                           │   │
│  │  MSP / ITSM                                               │   │
│  │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐               │   │
│  │  │ConnWi.│ │Autotsk│ │ Halo  │ │Ninja  │               │   │
│  │  │  ✓    │ │       │ │       │ │       │               │   │
│  │  └───────┘ └───────┘ └───────┘ └───────┘               │   │
│  │                                                           │   │
│  │  AUTOMATION                                               │   │
│  │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐               │   │
│  │  │Zapier │ │ Make  │ │ n8n   │ │PowerA │               │   │
│  │  │       │ │       │ │       │ │       │               │   │
│  │  └───────┘ └───────┘ └───────┘ └───────┘               │   │
│  │                                                           │   │
│  │  INCIDENT MANAGEMENT                                      │   │
│  │  ┌───────┐ ┌───────┐ ┌───────┐                          │   │
│  │  │PagerD │ │Opsgen.│ │JiraSM │                          │   │
│  │  │       │ │       │ │       │                          │   │
│  │  └───────┘ └───────┘ └───────┘                          │   │
│  │                                                           │   │
│  │  CUSTOM                                                   │   │
│  │  ┌────────────────────────────┐                          │   │
│  │  │ Webhook (any URL endpoint) │                          │   │
│  │  └────────────────────────────┘                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Integration Tier Framework

Integrations are prioritised into tiers based on impact, effort, and strategic alignment:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                    INTEGRATION PRIORITY MATRIX                              │
│                                                                            │
│  HIGH IMPACT │                          │                                  │
│              │  ConnectWise    Slack     │  Shopify                        │
│              │  Zapier     MS Teams      │  Salesforce                     │
│              │  Autotask                 │  Cloudflare                     │
│              │                           │                                  │
│              │  ← BUILD FIRST            │  ← BUILD WHEN DEMAND EXISTS    │
│              │                           │                                  │
│  ────────────┼───────────────────────────┼──────────────────────────────── │
│              │                           │                                  │
│              │  PagerDuty    HubSpot     │  BigCommerce                    │
│              │  Jira SM      n8n         │  WooCommerce                    │
│              │  Discord                  │  Confluence                     │
│              │                           │                                  │
│              │  ← BUILD ON SCHEDULE      │  ← DEFER / PARTNER-BUILT       │
│              │                           │                                  │
│  LOW IMPACT  │  LOW EFFORT              │  HIGH EFFORT                     │
└────────────────────────────────────────────────────────────────────────────┘
```

### Priority Tier Summary

| Tier | Integrations | Target Users | Build Timeline | Revenue Impact |
|------|-------------|-------------|----------------|----------------|
| **T1: Notifications** | Slack, Teams, Discord, Email, SMS | All customers | Month 3-5 | High (engagement + retention) |
| **T2: MSP Tools** | ConnectWise, Autotask, HaloPSA, NinjaOne | MSP partners | Month 5-9 | Very High (partner activation) |
| **T3: Automation** | Zapier, Make, n8n, Power Automate | Technical customers | Month 4-6 | High (reach + flexibility) |
| **T4: Security/IR** | PagerDuty, Opsgenie, Jira SM, SIEM | Security teams | Month 7-12 | Medium (upsell signal) |
| **T5: CRM/Business** | HubSpot, Salesforce, Notion | Mid-market companies | Month 9-15 | Medium (mid-market stickiness) |
| **T6: E-Commerce** | Shopify, WooCommerce, BigCommerce | E-commerce brands | Month 9-15 | Medium-High (new segment) |
| **T7: Infrastructure** | Cloudflare, Registrar APIs, DMARC | Technical customers | Month 12-18 | Medium (differentiation) |

---

## 5. Tier 1: Notification & Communication Integrations

### 5.1 Slack Integration

**Why Slack First:** Slack is the most requested integration across SaaS products. It has the easiest OAuth flow, the best app directory for discovery, and a mature Bot API. Most SMBs and agencies use Slack. Building this first establishes the pattern for all other integrations.

#### Technical Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    SLACK INTEGRATION FLOW                      │
│                                                                │
│  SETUP (one-time):                                            │
│  User clicks "Add to Slack" → Slack OAuth → User selects      │
│  workspace + channel → DoppelDown stores token + channel_id   │
│                                                                │
│  RUNTIME (per event):                                         │
│  DoppelDown event → Integration dispatcher → Slack adapter →  │
│  Format as Block Kit message → POST chat.postMessage →        │
│  Message appears in channel                                    │
│                                                                │
│  OPTIONAL (interactive):                                      │
│  User clicks button in Slack message →                         │
│  Slack sends interaction payload to DoppelDown webhook →       │
│  DoppelDown processes action (e.g., "Mark as False Positive") │
│  → Updates message in Slack with new status                    │
└──────────────────────────────────────────────────────────────┘
```

#### Slack App Manifest

```yaml
# slack-app-manifest.yaml
display_information:
  name: DoppelDown
  description: Brand protection alerts — phishing, impersonation, and domain threats
  background_color: "#1a1a2e"
  long_description: |
    DoppelDown monitors your brand for impersonation threats including lookalike domains, 
    phishing sites, and social media fakes. Get instant alerts in your Slack channels 
    when new threats are detected.
    
    Features:
    • Real-time threat alerts with severity and risk scores
    • Interactive buttons to acknowledge, investigate, or dismiss threats
    • Configurable severity filters (critical only, high+, all)
    • Multi-brand support for agencies and MSPs
    • Scan summary reports on schedule
    
features:
  bot_user:
    display_name: DoppelDown
    always_online: true
  slash_commands:
    - command: /doppeldown
      description: DoppelDown brand protection commands
      usage_hint: "[scan | status | threats | help]"
      url: https://app.doppeldown.com/api/integrations/slack/commands
  
oauth_config:
  scopes:
    bot:
      - chat:write          # Post messages to channels
      - chat:write.customize # Custom bot name/icon per message
      - commands             # Slash commands
      - incoming-webhook     # (fallback) Incoming webhook support

settings:
  interactivity:
    is_enabled: true
    request_url: https://app.doppeldown.com/api/integrations/slack/interactions
  event_subscriptions:
    request_url: https://app.doppeldown.com/api/integrations/slack/events
    bot_events:
      - app_home_opened     # Show dashboard in Slack's App Home tab
```

#### Slack Message Format (Block Kit)

```json
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🚨 New High-Severity Threat Detected"
      }
    },
    {
      "type": "section",
      "fields": [
        { "type": "mrkdwn", "text": "*Brand:*\nacmecorp.com" },
        { "type": "mrkdwn", "text": "*Severity:*\n🔴 High (85/100)" },
        { "type": "mrkdwn", "text": "*Threat Type:*\nLookalike Domain" },
        { "type": "mrkdwn", "text": "*Detected:*\n<!date^1738749000^{date_short_pretty} at {time}|Feb 5, 2026>" }
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Threat:* `acme-corp-login.com`\nActive lookalike domain with login page. MX records configured — possible phishing emails."
      }
    },
    {
      "type": "image",
      "title": { "type": "plain_text", "text": "Screenshot Evidence" },
      "image_url": "https://evidence.doppeldown.com/screenshots/thr_01HZ.png",
      "alt_text": "Screenshot of lookalike domain"
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "🔍 Investigate" },
          "url": "https://app.doppeldown.com/threats/thr_01HZ",
          "style": "primary"
        },
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "📋 Start Takedown" },
          "action_id": "start_takedown",
          "value": "thr_01HZ"
        },
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "✅ False Positive" },
          "action_id": "mark_false_positive",
          "value": "thr_01HZ",
          "confirm": {
            "title": { "type": "plain_text", "text": "Mark as False Positive?" },
            "text": { "type": "mrkdwn", "text": "This threat will be dismissed and won't alert again." },
            "confirm": { "type": "plain_text", "text": "Yes, dismiss" },
            "deny": { "type": "plain_text", "text": "Cancel" }
          }
        }
      ]
    },
    {
      "type": "context",
      "elements": [
        { "type": "mrkdwn", "text": "DoppelDown Brand Protection • <https://app.doppeldown.com|Dashboard>" }
      ]
    }
  ]
}
```

#### Slash Commands

| Command | Description | Response |
|---------|-------------|----------|
| `/doppeldown status` | Show current threat summary for all monitored brands | Ephemeral message with threat counts by severity |
| `/doppeldown scan <domain>` | Trigger an on-demand scan (if within plan limits) | Acknowledgement + results posted when complete |
| `/doppeldown threats` | List top 5 active threats by severity | Ephemeral message with threat list + links |
| `/doppeldown help` | Show available commands | Ephemeral message with command list |

#### Implementation Effort

| Component | Effort | Notes |
|-----------|--------|-------|
| OAuth flow + token storage | 2-3 days | Standard Slack OAuth 2.0 |
| Message posting (Block Kit) | 2-3 days | Template engine for different event types |
| Slash commands | 2-3 days | 4 commands, ephemeral responses |
| Interactive buttons (actions) | 2-3 days | Mark false positive, start takedown |
| App Home tab | 1-2 days | Summary dashboard in Slack |
| Slack App Directory submission | 1-2 days | Listing copy, screenshots, review process |
| **Total** | **10-16 days** | |

#### Slack App Directory Listing

**Category:** Security & Compliance
**Short Description:** "Get instant alerts when someone impersonates your brand online. AI-powered phishing and domain threat detection."

**Key Screenshots:**
1. Threat alert message in a channel (Block Kit, looks beautiful)
2. Slash command `/doppeldown status` response
3. Configuration settings in DoppelDown showing Slack connected
4. App Home tab with threat summary

**Pricing Note:** "Free with any DoppelDown plan (Growth, Business, Enterprise). DoppelDown subscription required."

#### Go-to-Market: Slack

| Activity | Timeline | Expected Impact |
|----------|----------|-----------------|
| Submit to Slack App Directory | Month 4 | Ongoing organic discovery |
| Blog: "How to Set Up Brand Protection Alerts in Slack" | Month 4 | SEO + onboarding aid |
| Include in onboarding flow: "Set up Slack alerts" step | Month 4 | Higher activation rate |
| Feature on DoppelDown /integrations page | Month 4 | Buyer confidence |
| Announce on LinkedIn + Twitter | Month 4 | Community awareness |

---

### 5.2 Microsoft Teams Integration

**Why Teams:** Teams dominates in enterprise and MSP environments. ConnectWise-using MSPs almost always use Teams. Building this unlocks the entire corporate/MSP notification channel.

#### Technical Architecture

Teams integrations can work via two paths:
1. **Incoming Webhook** (simpler, no app registration needed, but limited)
2. **Teams App (Bot Framework)** (full-featured, listed in Teams App Store)

**Recommendation:** Start with Incoming Webhook connector (Week 1-2), then build full Teams App (Month 6-8).

#### Phase 1: Incoming Webhook (Quick Win)

```
┌────────────────────────────────────────────────────────────┐
│  TEAMS INCOMING WEBHOOK SETUP                               │
│                                                             │
│  1. User creates an Incoming Webhook in their Teams channel │
│  2. User copies the webhook URL                             │
│  3. User pastes the URL in DoppelDown Settings > Teams      │
│  4. DoppelDown posts Adaptive Card payloads to that URL     │
│                                                             │
│  Pros: No app registration, works today, 30 min to build   │
│  Cons: No interactive buttons, no slash commands,           │
│        user must manually create webhook in Teams           │
└────────────────────────────────────────────────────────────┘
```

#### Phase 2: Full Teams App (Bot Framework)

```
┌────────────────────────────────────────────────────────────┐
│  TEAMS BOT APP FLOW                                        │
│                                                             │
│  Setup:                                                     │
│  User installs DoppelDown app from Teams App Store →        │
│  Azure AD OAuth → User selects channel → App posts alerts  │
│                                                             │
│  Runtime:                                                   │
│  Same as Slack — events trigger Adaptive Card messages      │
│  with interactive buttons (investigate, dismiss, takedown)  │
│                                                             │
│  Technology:                                                │
│  • Azure Bot Service (free tier)                           │
│  • Bot Framework SDK (Node.js)                             │
│  • Adaptive Cards for rich formatting                      │
│  • Azure AD app registration for auth                      │
└────────────────────────────────────────────────────────────┘
```

#### Adaptive Card Format

```json
{
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "type": "AdaptiveCard",
  "version": "1.5",
  "body": [
    {
      "type": "ColumnSet",
      "columns": [
        {
          "type": "Column",
          "width": "auto",
          "items": [
            {
              "type": "Image",
              "url": "https://app.doppeldown.com/icon-alert.png",
              "size": "Small"
            }
          ]
        },
        {
          "type": "Column",
          "width": "stretch",
          "items": [
            {
              "type": "TextBlock",
              "text": "🚨 New High-Severity Threat",
              "weight": "Bolder",
              "size": "Medium"
            },
            {
              "type": "TextBlock",
              "text": "acmecorp.com — Lookalike Domain Detected",
              "spacing": "None",
              "isSubtle": true
            }
          ]
        }
      ]
    },
    {
      "type": "FactSet",
      "facts": [
        { "title": "Threat:", "value": "acme-corp-login.com" },
        { "title": "Severity:", "value": "🔴 High (85/100)" },
        { "title": "Type:", "value": "Lookalike Domain" },
        { "title": "Detected:", "value": "5 Feb 2026, 10:30 AM" }
      ]
    },
    {
      "type": "TextBlock",
      "text": "Active lookalike domain with login page mimicking acmecorp.com. MX records configured, potentially sending phishing emails.",
      "wrap": true
    }
  ],
  "actions": [
    {
      "type": "Action.OpenUrl",
      "title": "🔍 Investigate",
      "url": "https://app.doppeldown.com/threats/thr_01HZ"
    },
    {
      "type": "Action.Submit",
      "title": "✅ False Positive",
      "data": { "action": "mark_false_positive", "threat_id": "thr_01HZ" }
    }
  ]
}
```

#### Implementation Effort

| Component | Effort | Notes |
|-----------|--------|-------|
| Phase 1: Incoming Webhook | 2-3 days | Adaptive Card formatting + webhook URL storage |
| Phase 2: Azure Bot Service setup | 3-4 days | Azure AD app reg, Bot Framework scaffolding |
| Phase 2: Interactive actions | 2-3 days | Button callbacks, state updates |
| Phase 2: Teams App Store submission | 2-3 days | Listing, validation, Microsoft review |
| **Total (Phase 1)** | **2-3 days** | |
| **Total (Phase 1+2)** | **10-13 days** | |

---

### 5.3 Discord Integration

**Why Discord:** Growing use among tech-savvy SMBs, crypto/Web3 companies, gaming companies, and developer teams. Low effort to build (similar to Slack). Also useful for DoppelDown's own community.

#### Technical Approach

- Discord Bot using Discord.js
- OAuth2 for adding to servers
- Embed messages (rich formatting, similar to Slack blocks)
- Slash commands support

**Implementation Effort:** 5-8 days (reuse patterns from Slack adapter)

---

### 5.4 Email (Advanced Alerts)

**Why:** Email is the universal fallback. Every customer has email. The existing email alert system should be enhanced to be a proper "integration" with configurable templates, digest modes, and escalation rules.

#### Features Beyond Current Email Alerts

| Feature | Description |
|---------|-------------|
| **Digest mode** | Daily/weekly summary email instead of per-threat emails |
| **Escalation rules** | If no action taken on high-severity threat within 24h, send reminder to additional recipients |
| **Multi-recipient** | CC additional team members on alerts |
| **HTML templates** | Beautiful, professional email templates with evidence previews |
| **Partner co-branding** | Partner logo on alert emails sent to partner's clients |

**Implementation Effort:** 3-5 days (extends existing email system)

---

### 5.5 SMS / WhatsApp via Twilio

**Why:** For critical-severity alerts only. Some customers (especially smaller ones without Slack/Teams) want an immediate text for critical threats.

#### Technical Approach

- Twilio API for SMS delivery
- WhatsApp Business API via Twilio for WhatsApp messages
- Only triggered for `critical` severity events (configurable)
- Rate-limited: max 5 SMS per day per brand (prevents cost explosion)

**Implementation Effort:** 3-4 days
**Ongoing Cost:** ~$0.01-0.05 per SMS. Pass through to customer on Enterprise tier, or include 20 SMS/month on Enterprise.

---

## 6. Tier 2: MSP/MSSP Tool Integrations

### Why MSP Tools Are Critical

From the Partnership & Channel Strategy:

> "Partners fail when they can't efficiently manage multiple client brands — and they'll churn."

MSP partners live in their PSA (Professional Services Automation) and RMM (Remote Monitoring & Management) tools. If DoppelDown can automatically create tickets, populate dashboards, and trigger workflows in these tools, the partner experience goes from "another tab to check" to "it just shows up in our system."

**The math:** A ConnectWise integration that makes 10 MSP partners 50% more productive = 10 × 50% more client brands onboarded = significant MRR impact.

---

### 6.1 ConnectWise PSA & Manage

**Why #1 MSP Integration:** ConnectWise is the dominant PSA tool in the MSP market (35-40% market share among US/AU MSPs). Richard's MSP contacts overwhelmingly use it. It has an established vendor integration marketplace (ConnectWise Marketplace) for discovery.

#### Integration Capabilities

| Capability | Description | Priority |
|-----------|-------------|----------|
| **Auto-create service tickets** | New threat → new ConnectWise ticket with threat details, evidence, and recommended actions | 🔴 Critical |
| **Update ticket status** | Threat status changes in DoppelDown → ticket notes updated in ConnectWise | 🔴 Critical |
| **Client/company mapping** | Map DoppelDown brands to ConnectWise Companies for correct ticket routing | 🔴 Critical |
| **Configuration item** | Register DoppelDown as a Configuration/Agreement item under a Company | 🟡 Important |
| **Board/status mapping** | Configurable: which CW Board, Status, Type, Priority to use for tickets | 🟡 Important |
| **Billing integration** | Sync DoppelDown usage → ConnectWise Agreements for billing | 🟢 Future |

#### Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              CONNECTWISE INTEGRATION ARCHITECTURE                │
│                                                                  │
│  AUTHENTICATION:                                                 │
│  ConnectWise uses API keys (public + private) + company ID      │
│  Partner enters credentials in DoppelDown → stored encrypted    │
│  DoppelDown makes REST calls to ConnectWise Manage API          │
│                                                                  │
│  SETUP FLOW:                                                     │
│  1. Partner enters ConnectWise URL, Company ID, API keys        │
│  2. DoppelDown validates by fetching /system/info               │
│  3. Partner maps DoppelDown brands → ConnectWise Companies      │
│  4. Partner configures ticket defaults (Board, Type, Priority)  │
│  5. Integration active                                           │
│                                                                  │
│  RUNTIME FLOW:                                                   │
│  DoppelDown threat event →                                       │
│    ConnectWise adapter looks up Company mapping →                │
│    Creates ticket via POST /service/tickets →                    │
│    Attaches evidence screenshots via POST /service/tickets/{id}/ │
│      documents →                                                 │
│    Stores CW ticket ID in DoppelDown for future updates →        │
│    On threat status change → PATCH /service/tickets/{id}         │
│                                                                  │
│  REVERSE SYNC (future):                                          │
│  CW ticket closed → webhook to DoppelDown →                      │
│    Mark threat as resolved in DoppelDown                         │
└─────────────────────────────────────────────────────────────────┘
```

#### ConnectWise Ticket Template

```json
{
  "summary": "[DoppelDown] High-Severity Threat: Lookalike domain targeting acmecorp.com",
  "board": { "id": 1, "name": "Service Board" },
  "status": { "name": "New" },
  "company": { "id": 12345, "identifier": "AcmeCorp" },
  "type": { "name": "Security Alert" },
  "subType": { "name": "Brand Protection" },
  "priority": { "id": 3, "name": "Priority 2 - High" },
  "severity": "High",
  "impact": "High",
  "initialDescription": "## Brand Threat Detected by DoppelDown\n\n**Brand:** acmecorp.com\n**Threat:** acme-corp-login.com\n**Type:** Lookalike Domain\n**Severity:** High (85/100)\n**Detected:** 2026-02-05 10:30 AM AEST\n\n### Summary\nActive lookalike domain with login page mimicking acmecorp.com. MX records configured, potentially sending phishing emails.\n\n### Evidence\n- Screenshot: [attached]\n- WHOIS Registrar: NameSilo\n- Domain Created: 2026-01-28\n- SSL Certificate: Yes\n- MX Records: Yes\n- Page Similarity: 87%\n\n### Recommended Actions\n1. Notify the client about the threat\n2. Review DoppelDown dashboard for full evidence: https://app.doppeldown.com/threats/thr_01HZ\n3. Initiate takedown request (template available in DoppelDown)\n4. Check if client employees/customers have received phishing emails\n\n---\n*Auto-generated by DoppelDown Brand Protection*",
  "automaticEmailContactFlag": false,
  "automaticEmailResourceFlag": true
}
```

#### ConnectWise Marketplace Listing Strategy

| Element | Detail |
|---------|--------|
| **Category** | Security |
| **Listing Title** | DoppelDown — AI-Powered Brand Protection for MSPs |
| **Short Description** | "Detect and respond to brand impersonation threats. Auto-create tickets for lookalike domains, phishing sites, and social media fakes targeting your client brands." |
| **Pricing on Marketplace** | "Partner pricing starting at $59.25/brand/month (25% discount). Free evaluation available." |
| **Integration Type** | API Integration (REST) |
| **Key Benefits** | Auto-ticket creation, client company mapping, evidence attachments, two-way status sync |
| **Submission Timeline** | Month 6-7 (after integration is stable with 3+ beta MSPs) |

#### Implementation Effort

| Component | Effort | Notes |
|-----------|--------|-------|
| ConnectWise API client + auth | 2-3 days | REST API, API key storage |
| Company mapping UI | 3-4 days | Map DoppelDown brands ↔ CW Companies |
| Ticket creation + evidence attachment | 3-4 days | POST /service/tickets, document upload |
| Ticket update on status change | 2-3 days | PATCH tickets, add notes |
| Board/Type/Priority configuration UI | 2-3 days | Fetch CW metadata for dropdowns |
| Testing with 2-3 MSP beta partners | 5-7 days | Real-world validation |
| ConnectWise Marketplace submission | 2-3 days | Listing, screenshots, review |
| **Total** | **19-27 days** | |

---

### 6.2 Datto Autotask PSA

**Why:** Autotask (now Kaseya/Datto) is the #2 PSA tool in the MSP market. Similar API structure to ConnectWise. Many MSPs choose one or the other.

#### Technical Approach

Nearly identical to ConnectWise integration:
- Autotask REST API v1.0
- API key authentication (username + secret)
- Auto-create tickets with brand threat details
- Map DoppelDown brands to Autotask Accounts
- Configurable ticket queue, priority, and status

**Key Difference from ConnectWise:** Autotask uses "Resource/Account" terminology instead of "Member/Company." The integration adapter translates DoppelDown's data model accordingly.

#### Implementation Effort

| Component | Effort | Notes |
|-----------|--------|-------|
| Autotask API client + auth | 2-3 days | Similar to ConnectWise |
| Account mapping + ticket creation | 3-5 days | Reuse 70% of ConnectWise logic |
| Testing with beta partners | 3-5 days | |
| **Total** | **8-13 days** | (Faster due to ConnectWise patterns) |

---

### 6.3 HaloPSA

**Why:** Fastest-growing PSA tool, popular with newer/smaller MSPs (especially in APAC and UK). Modern REST API. Good fit for DoppelDown's target MSP size.

**Implementation Effort:** 8-12 days (similar patterns)
**Timeline:** Month 8-10

---

### 6.4 NinjaOne (NinjaRMM)

**Why:** NinjaOne is an RMM tool (Remote Monitoring & Management), not a PSA. But it has a built-in ticketing system and is increasingly used by smaller MSPs as their only management tool. The integration creates alerts/tickets in NinjaOne's system.

**Implementation Effort:** 6-10 days
**Timeline:** Month 9-12

---

### 6.5 Kaseya VSA

**Why:** Kaseya's RMM platform. Large install base. Integration creates alerts visible in the Kaseya agent dashboard for the relevant client.

**Implementation Effort:** 8-12 days
**Timeline:** Month 10-14

---

## 7. Tier 3: Automation & Workflow Integrations

### 7.1 Zapier

**Why Zapier Is High Priority:** Zapier connects DoppelDown to 6,000+ apps without DoppelDown building each integration individually. A customer who needs "DoppelDown threat → Google Sheet row" or "DoppelDown threat → Trello card" gets it via Zapier without DoppelDown writing a single line of code for Google Sheets or Trello. It's a force multiplier.

#### What DoppelDown Builds for Zapier

DoppelDown needs to build a **Zapier App** (listed on Zapier's platform) that exposes:

**Triggers** (events that start a Zap):

| Trigger | Description | Data Provided |
|---------|-------------|---------------|
| `New Threat Detected` | Fires when a new threat is found | Threat details, severity, brand, evidence URLs |
| `Scan Completed` | Fires when a scan finishes | Scan summary, threat count, risk score |
| `Threat Status Changed` | Fires when a threat is resolved, escalated, etc. | Old status, new status, threat details |
| `Risk Score Changed` | Fires when a brand's risk score changes significantly | Brand, old score, new score, direction |

**Actions** (things a Zap can make DoppelDown do):

| Action | Description | Input Required |
|--------|-------------|----------------|
| `Start Scan` | Trigger a scan for a specific brand | Brand ID or domain |
| `Update Threat Status` | Mark a threat as resolved/false_positive | Threat ID, new status |
| `Get Threat Details` | Fetch full details for a specific threat | Threat ID |
| `List Active Threats` | Get all active threats for a brand | Brand ID, optional severity filter |

**Searches** (lookups a Zap can perform):

| Search | Description |
|--------|-------------|
| `Find Brand` | Look up a brand by domain name |
| `Find Threat` | Look up a specific threat by ID |

#### Zapier App Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  ZAPIER APP ARCHITECTURE                         │
│                                                                  │
│  Authentication: API Key (DoppelDown API key)                   │
│                                                                  │
│  Triggers (REST Hook / Polling):                                │
│  ┌───────────────────────────────────────────────┐             │
│  │  DoppelDown subscribes to Zapier's REST Hook  │             │
│  │  (webhook-based triggers for real-time)       │             │
│  │                                                │             │
│  │  When user enables a Zap:                      │             │
│  │  1. Zapier calls DoppelDown subscribe endpoint │             │
│  │  2. DoppelDown creates webhook_subscription    │             │
│  │     with Zapier's target URL                   │             │
│  │  3. Events flow: DoppelDown → Zapier → Zap     │             │
│  │                                                │             │
│  │  When user disables a Zap:                     │             │
│  │  1. Zapier calls DoppelDown unsubscribe        │             │
│  │  2. DoppelDown deletes webhook_subscription    │             │
│  └───────────────────────────────────────────────┘             │
│                                                                  │
│  Actions & Searches:                                             │
│  ┌───────────────────────────────────────────────┐             │
│  │  Standard REST API calls via DoppelDown API    │             │
│  │  Zapier handles the UX for field mapping       │             │
│  │  DoppelDown just needs clean API endpoints     │             │
│  └───────────────────────────────────────────────┘             │
│                                                                  │
│  Key files to build (Zapier CLI):                               │
│  • authentication.js    — API key auth                          │
│  • triggers/            — newThreat.js, scanComplete.js, etc.  │
│  • creates/             — startScan.js, updateThreat.js        │
│  • searches/            — findBrand.js, findThreat.js          │
│  • test/                — unit + integration tests              │
└─────────────────────────────────────────────────────────────────┘
```

#### Popular Zap Templates (Pre-Built)

When listing on Zapier, create popular templates that show up on the listing page:

| Template | Description | Zapier Apps Involved |
|----------|-------------|---------------------|
| "DoppelDown threat → Slack message" | Redundant with native Slack, but shows cross-platform awareness | DoppelDown + Slack |
| "DoppelDown threat → Google Sheet row" | Log all threats in a spreadsheet for reporting/audit | DoppelDown + Google Sheets |
| "DoppelDown threat → Trello card" | Create Trello card for each threat to track response | DoppelDown + Trello |
| "DoppelDown threat → Jira issue" | Create Jira issue for security team | DoppelDown + Jira |
| "DoppelDown threat → Email (custom)" | Send formatted email to a custom distribution list | DoppelDown + Gmail/Outlook |
| "DoppelDown scan complete → SMS" | Get a text when a scan finishes (for non-Slack users) | DoppelDown + Twilio |
| "DoppelDown high-severity threat → PagerDuty incident" | Escalate critical threats | DoppelDown + PagerDuty |

#### Zapier Integration Listing

**Category:** Security & Identity
**Listing Title:** DoppelDown — AI Brand Protection
**Description:** "Automate your brand protection workflow. Get alerts when someone impersonates your brand online — lookalike domains, phishing sites, social media fakes. Connect DoppelDown to any of 6,000+ apps."

#### Implementation Effort

| Component | Effort | Notes |
|-----------|--------|-------|
| Zapier CLI app scaffolding + auth | 1-2 days | |
| 4 triggers (REST hook based) | 3-4 days | Requires webhook subscribe/unsubscribe endpoints |
| 2 actions (start scan, update threat) | 2-3 days | |
| 2 searches (find brand, find threat) | 1-2 days | |
| Pre-built Zap templates | 1-2 days | 5-7 popular templates |
| Zapier review + listing | 2-3 days | Zapier reviews all public apps |
| **Total** | **10-16 days** | |

#### Go-to-Market: Zapier

| Activity | Timeline |
|----------|----------|
| Submit Zapier app for review | Month 4 |
| Blog: "10 Ways to Automate Brand Protection with DoppelDown + Zapier" | Month 5 |
| Feature Zapier badge on DoppelDown integrations page | Month 5 |
| Create 7 pre-built Zap templates | Month 5 |
| Reach out to Zapier's partner team for co-marketing | Month 6 |

---

### 7.2 Make (formerly Integromat)

**Why:** Make is the #2 automation platform. More popular in Europe and among power users who want visual workflow builders. Growing fast. Having both Zapier + Make covers 90%+ of the automation market.

#### Technical Approach

Make uses a different integration model than Zapier:
- **Modules** (equivalent to Zapier's triggers/actions)
- **Webhooks** (Make can consume DoppelDown webhooks directly)
- **Custom App** (for full listing in Make's marketplace)

**Simpler path:** Since DoppelDown has a webhook system, Make users can connect via Make's generic "Webhooks" module without a custom app. Build the custom app listing later.

**Phase 1:** Document "How to Connect DoppelDown to Make via Webhooks" (2 days)
**Phase 2:** Build formal Make Custom App for marketplace listing (8-12 days, Month 7-8)

---

### 7.3 n8n

**Why:** Open-source workflow automation, popular with self-hosted / privacy-conscious customers. DoppelDown's technical persona ("James") likely uses n8n. Low effort because n8n supports generic webhooks natively.

**Approach:** Documentation + community node (n8n community can build a node using DoppelDown's API). Optionally, DoppelDown publishes an official n8n community node.

**Effort:** 3-5 days for a community node + documentation

---

### 7.4 Power Automate (Microsoft)

**Why:** Microsoft's automation tool, deeply integrated with Teams, Outlook, SharePoint. Enterprises and MSPs in the Microsoft ecosystem use this. Connects nicely with Teams integration.

**Approach:**
- **Phase 1:** DoppelDown webhook → Power Automate "When an HTTP request is received" trigger (documentation, 2 days)
- **Phase 2:** Custom connector for Power Automate (for Marketplace listing, 8-12 days, Month 9-12)

---

## 8. Tier 4: Security & Incident Management Integrations

### 8.1 PagerDuty

**Why:** PagerDuty is the standard for critical incident escalation. Security teams use it for on-call rotation. A DoppelDown → PagerDuty integration means critical brand threats trigger the same incident response workflow as a server going down.

#### Technical Architecture

PagerDuty Events API v2 makes this straightforward:

```
DoppelDown critical threat →
  POST https://events.pagerduty.com/v2/enqueue
  {
    "routing_key": "<partner's PD integration key>",
    "event_action": "trigger",
    "dedup_key": "doppeldown-thr_01HZ",
    "payload": {
      "summary": "High-severity brand threat: acme-corp-login.com targeting acmecorp.com",
      "severity": "critical",
      "source": "DoppelDown Brand Protection",
      "component": "acmecorp.com",
      "class": "brand_impersonation",
      "custom_details": {
        "threat_type": "lookalike_domain",
        "risk_score": 85,
        "brand": "acmecorp.com",
        "dashboard_url": "https://app.doppeldown.com/threats/thr_01HZ"
      }
    },
    "links": [
      {
        "href": "https://app.doppeldown.com/threats/thr_01HZ",
        "text": "View in DoppelDown"
      }
    ],
    "images": [
      {
        "src": "https://evidence.doppeldown.com/screenshots/thr_01HZ.png",
        "alt": "Threat screenshot"
      }
    ]
  }
```

**Dedup key:** `doppeldown-{threat_id}` prevents duplicate incidents for the same threat.
**Resolve:** When threat is resolved in DoppelDown, send `event_action: "resolve"` to auto-close the PD incident.

**Implementation Effort:** 3-5 days
**Listing:** PagerDuty Integration Directory (free listing)

---

### 8.2 Opsgenie (Atlassian)

**Why:** Atlassian's incident management tool. Popular with Jira-heavy organisations. Similar to PagerDuty but in the Atlassian ecosystem.

**Technical Approach:** Very similar to PagerDuty — Opsgenie Alert API.
**Implementation Effort:** 3-4 days (reuse PagerDuty patterns)

---

### 8.3 Jira Service Management

**Why:** Jira SM is used by many security teams for ticket tracking. Unlike ConnectWise (MSP-focused), Jira serves internal security teams at mid-market companies.

#### Technical Approach

- Jira REST API + OAuth 2.0 (3LO) via Atlassian Connect
- Create issues in configurable Jira project
- Map threat severity → Jira Priority
- Attach evidence as issue attachments
- Update issue when threat status changes

**Implementation Effort:** 8-12 days
**Listing:** Atlassian Marketplace (free listing in Security category)

---

### 8.4 SIEM/SOAR Integrations (Splunk, Elastic, Microsoft Sentinel)

**Why:** Larger MSPs and mid-market security teams aggregate alerts in SIEM platforms. Getting DoppelDown alerts into SIEM means brand threats appear alongside all other security events.

#### Approach: Syslog + CEF/LEEF Format

Rather than building individual SIEM integrations, DoppelDown can output alerts in **Common Event Format (CEF)** — the industry standard that all major SIEMs consume:

```
CEF:0|DoppelDown|BrandProtection|1.0|THREAT_NEW|New Brand Threat Detected|8|
  src=acme-corp-login.com dst=acmecorp.com 
  cs1Label=ThreatType cs1=lookalike_domain
  cs2Label=RiskScore cs2=85
  cs3Label=ThreatID cs3=thr_01HZ
  cs4Label=DashboardURL cs4=https://app.doppeldown.com/threats/thr_01HZ
  msg=Active lookalike domain with login page mimicking acmecorp.com
```

**Delivery Methods:**
1. **Syslog (TCP/UDP):** Customer provides syslog endpoint; DoppelDown forwards CEF events
2. **Webhook → SIEM HTTP endpoint:** Many SIEMs support HTTP event collectors (Splunk HEC, Elastic HTTP input)
3. **File-based:** Export CEF logs for import (simplest, least real-time)

**Implementation Effort:** 5-8 days for CEF formatter + Syslog sender
**Timeline:** Month 10-14

---

### 8.5 TheHive / Cortex

**Why:** Open-source security incident response platform. Popular with security-conscious organisations and MSSPs. Cortex analysers can enrich DoppelDown threat data.

**Approach:** TheHive4py API integration — create cases and observables from DoppelDown threats.
**Implementation Effort:** 5-7 days
**Timeline:** Month 12-15

---

## 9. Tier 5: CRM & Business Tool Integrations

### 9.1 HubSpot

**Why:** HubSpot is popular with SMBs and agencies (exactly DoppelDown's target market). Integration creates a "Brand Protection" card in HubSpot contact/company records, showing threat status.

#### Capabilities

| Capability | Description |
|-----------|-------------|
| **CRM Card** | Show brand threat summary on HubSpot Company record |
| **Timeline Events** | Log DoppelDown threats as timeline events on Company records |
| **Workflow Trigger** | "New DoppelDown Threat" as a trigger for HubSpot Workflows |
| **Contact Enrichment** | Flag contacts whose company has active brand threats |

#### Technical Approach

- HubSpot CRM Extensions API + OAuth
- Custom CRM card (iframe) showing threat summary
- Timeline Events API for logging threats
- Listed in HubSpot App Marketplace

**Implementation Effort:** 10-15 days
**Timeline:** Month 10-14

---

### 9.2 Salesforce

**Why:** Enterprise CRM. Relevant when DoppelDown moves upmarket. Lower priority for initial SMB focus, but worth planning for.

**Approach:** Salesforce AppExchange listing with custom objects for threats.
**Implementation Effort:** 15-20 days
**Timeline:** Month 15-18+

---

## 10. Tier 6: E-Commerce Platform Integrations

### 10.1 Shopify App

**Why:** 2M+ Shopify merchants. Many are DoppelDown's "Michelle" persona — e-commerce brand owners worried about fake stores. The Shopify App Store is a massive distribution channel.

#### Shopify App Features

| Feature | Description |
|---------|-------------|
| **Brand monitoring setup** | One-click: detect brand name and domain from Shopify store, start monitoring |
| **Threat dashboard** | Embedded admin section showing active threats |
| **Fake store alerts** | Notify merchant when a fake version of their store is detected |
| **Takedown templates** | Pre-filled takedown request templates for common platforms |
| **Monthly digest** | Email summary of threats detected (co-branded with Shopify admin experience) |

#### Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              SHOPIFY APP ARCHITECTURE                             │
│                                                                  │
│  Shopify App (embedded):                                         │
│  • App Bridge for admin integration                             │
│  • OAuth (Shopify's own OAuth flow)                             │
│  • Polaris UI components for native look and feel               │
│  • Billing via Shopify Billing API (Shopify takes 20% rev share)│
│                                                                  │
│  SETUP:                                                          │
│  1. Merchant installs from Shopify App Store                    │
│  2. OAuth grants access to shop data (name, domain, product)    │
│  3. DoppelDown creates brand automatically from shop data       │
│  4. First scan runs immediately                                  │
│  5. Results shown in embedded admin dashboard                    │
│                                                                  │
│  PRICING:                                                        │
│  Via Shopify Billing API (recurring charge):                     │
│  • Basic: $49/mo (Growth equivalent) — Shopify gets $9.80      │
│  • Pro: $99/mo (Business equivalent) — Shopify gets $19.80     │
│  • Premium: $199/mo (Enterprise lite) — Shopify gets $39.80    │
│                                                                  │
│  Note: Shopify's 20% rev share is significant. Price tiers      │
│  may need adjustment to maintain margins.                        │
└─────────────────────────────────────────────────────────────────┘
```

#### Shopify App Store Listing

**Category:** Store Design → Trust & Security
**Title:** DoppelDown — Brand Protection & Anti-Phishing
**Tagline:** "Detect fake stores, phishing sites, and social media impersonators targeting your brand"

**Key Screenshots:**
1. Embedded dashboard showing active threats
2. Alert notification with fake store screenshot
3. Takedown template generator
4. Monthly threat report

**Implementation Effort:** 15-22 days (Shopify's App Bridge and Billing API have learning curve)
**Timeline:** Month 10-14
**Revenue Impact:** Potential for 100+ merchants in first year from App Store discovery alone

---

### 10.2 WooCommerce Plugin

**Why:** WooCommerce powers ~25% of e-commerce sites. WordPress plugin ecosystem is massive. WordPress.org plugin directory is a discovery channel.

**Technical Approach:**
- WordPress plugin (PHP) that connects to DoppelDown API
- Admin dashboard widget showing threat summary
- Email alerts for new threats
- Settings page for API key entry

**Implementation Effort:** 10-15 days
**Timeline:** Month 12-16

---

## 11. Tier 7: Domain & Infrastructure Integrations

### 11.1 Cloudflare

**Why:** Cloudflare sits in front of millions of websites. A Cloudflare integration could:
1. **Detect:** Use Cloudflare's DNS analytics to identify traffic to lookalike domains
2. **Block:** Automatically add lookalike domains to Cloudflare's blocklist for the customer's network
3. **Alert:** Surface DoppelDown threats in Cloudflare's security dashboard

#### Cloudflare Workers Integration

```
Approach: Cloudflare Worker that calls DoppelDown API
• Periodically fetches active threats for the zone
• Adds lookalike domains to a custom blocklist
• Shows threat count in Cloudflare Dashboard (via Cloudflare Apps)
```

**Cloudflare Apps Marketplace:** Free listing. Security category. High-trust environment.

**Implementation Effort:** 8-12 days (Cloudflare Workers + Apps framework)
**Timeline:** Month 12-16

---

### 11.2 Google Workspace / Microsoft 365 (DMARC Reporting)

**Why:** DMARC aggregate reports tell domain owners who is sending email using their domain. DoppelDown can ingest DMARC reports, correlate with known threats, and surface email-based impersonation that traditional domain scanning misses.

**Feature:** "Connect your DMARC reports to DoppelDown. We'll tell you if anyone is sending phishing emails using your brand."

**Technical Approach:**
- Customer configures DMARC rua= to point to DoppelDown's DMARC ingestion endpoint
- DoppelDown parses XML DMARC reports
- Correlates sending IPs with known threats
- Flags unauthorized senders as threats

**Implementation Effort:** 10-15 days
**Timeline:** Month 14-18

---

## 12. API Design & Developer Experience

### API Principles

DoppelDown's public API is the foundation for all integrations. A well-designed API turns every customer into a potential integration builder.

#### API Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Protocol** | REST (JSON) | Universal, every language has HTTP clients |
| **Authentication** | API Key (Bearer token) | Simple, no OAuth complexity for API consumers |
| **Versioning** | URL path: `/api/v1/` | Clear, easy to evolve without breaking |
| **Rate Limits** | Per-plan: Growth 60/min, Business 300/min, Enterprise 1000/min | Prevent abuse while enabling automation |
| **Pagination** | Cursor-based (`?cursor=xxx&limit=25`) | Consistent, handles large datasets |
| **Error Format** | RFC 7807 Problem Details | Industry standard, self-documenting |
| **Webhooks** | HMAC-SHA256 signed | Secure, verifiable |

#### API Endpoints (Core)

```
# Brands
GET    /api/v1/brands                    # List all brands
POST   /api/v1/brands                    # Create a brand
GET    /api/v1/brands/:id                # Get brand details
PATCH  /api/v1/brands/:id                # Update brand
DELETE /api/v1/brands/:id                # Delete brand

# Scans
POST   /api/v1/brands/:id/scans         # Start a scan
GET    /api/v1/brands/:id/scans          # List scans for a brand
GET    /api/v1/scans/:id                 # Get scan details + results

# Threats
GET    /api/v1/brands/:id/threats        # List threats for a brand
GET    /api/v1/threats                    # List all threats (filterable)
GET    /api/v1/threats/:id               # Get threat details
PATCH  /api/v1/threats/:id               # Update threat status
GET    /api/v1/threats/:id/evidence      # Get evidence for a threat

# Reports
POST   /api/v1/brands/:id/reports        # Generate a report
GET    /api/v1/reports/:id               # Get report (PDF URL)

# Webhooks
GET    /api/v1/webhooks                  # List webhook subscriptions
POST   /api/v1/webhooks                  # Create webhook subscription
PATCH  /api/v1/webhooks/:id              # Update subscription
DELETE /api/v1/webhooks/:id              # Delete subscription
POST   /api/v1/webhooks/:id/test        # Send test event to webhook

# Integrations (managed)
GET    /api/v1/integrations              # List configured integrations
POST   /api/v1/integrations              # Create integration
PATCH  /api/v1/integrations/:id          # Update integration config
DELETE /api/v1/integrations/:id          # Remove integration
POST   /api/v1/integrations/:id/test     # Test integration
GET    /api/v1/integrations/:id/logs     # Get delivery logs
```

#### Developer Documentation Site

Build with **Mintlify** or **ReadMe.com** (DX-focused documentation platforms):

| Section | Content |
|---------|---------|
| **Getting Started** | API key generation, first API call, authentication |
| **Quickstart Guides** | "Your first scan in 5 API calls," "Set up Slack alerts in 3 minutes" |
| **API Reference** | Auto-generated from OpenAPI spec, with examples in cURL, Python, Node.js, Go |
| **Webhooks Guide** | Event types, payload schemas, signature verification, retry behavior |
| **Integration Guides** | Per-integration: Slack, Teams, ConnectWise, Zapier, etc. |
| **SDKs** | `doppeldown-node`, `doppeldown-python` (thin wrappers, auto-generated from OpenAPI) |
| **Changelog** | API versioning and deprecation policy |

**URL:** `docs.doppeldown.com`

#### OpenAPI Specification

Maintain an OpenAPI 3.1 spec as the single source of truth:
- Auto-generate documentation
- Auto-generate SDKs (via openapi-generator)
- Auto-generate Zapier/Make app scaffolding
- Validate API responses in tests

**Implementation Effort (API + Docs):**

| Component | Effort | Notes |
|-----------|--------|-------|
| OpenAPI spec (comprehensive) | 3-5 days | Define all endpoints, schemas, examples |
| Webhook system (subscribe/deliver/retry) | 5-8 days | Most critical piece |
| Rate limiting middleware | 2-3 days | Per-plan limits |
| API key management UI | 2-3 days | Generate, rotate, revoke keys |
| Documentation site (Mintlify) | 3-5 days | Hosted, beautiful, auto-generated |
| Node.js SDK | 2-3 days | Thin wrapper, published to npm |
| Python SDK | 2-3 days | Thin wrapper, published to PyPI |
| **Total** | **19-30 days** | Spread over Month 3-6 |

---

## 13. Webhook System Architecture

The webhook system deserves its own section because it's the backbone of every integration.

### Webhook Delivery Pipeline

```
┌───────────────────────────────────────────────────────────────────────┐
│                     WEBHOOK DELIVERY PIPELINE                          │
│                                                                        │
│  1. EVENT OCCURS                                                       │
│  ┌─────────────────────────────────────────────────┐                  │
│  │  Scan engine detects new threat                  │                  │
│  │  → Threat saved to database                      │                  │
│  │  → Event emitted: { type: 'threat.new', ... }    │                  │
│  └─────────────────────────────┬───────────────────┘                  │
│                                │                                       │
│  2. EVENT FANOUT                                                       │
│  ┌─────────────────────────────▼───────────────────┐                  │
│  │  Event dispatcher queries:                       │                  │
│  │  • webhook_subscriptions WHERE user_id = X       │                  │
│  │    AND event_types @> '{threat.new}'              │                  │
│  │    AND status = 'active'                          │                  │
│  │  • integrations WHERE user_id = X                │                  │
│  │    AND event_types @> '{threat.new}'              │                  │
│  │    AND status = 'active'                          │                  │
│  │    AND min_severity <= event.severity             │                  │
│  │                                                   │                  │
│  │  Result: List of delivery targets                 │                  │
│  └─────────────────────────────┬───────────────────┘                  │
│                                │                                       │
│  3. ENQUEUE DELIVERIES                                                 │
│  ┌─────────────────────────────▼───────────────────┐                  │
│  │  For each target, enqueue a delivery job:        │                  │
│  │  {                                                │                  │
│  │    target_type: 'webhook' | 'slack' | 'teams'..  │                  │
│  │    target_config: { url, token, channel, ... }    │                  │
│  │    payload: event_data,                           │                  │
│  │    attempt: 1,                                    │                  │
│  │    max_attempts: 5                                │                  │
│  │  }                                                │                  │
│  │                                                   │                  │
│  │  Queue: Supabase pg_cron + pgmq (or BullMQ on    │                  │
│  │  worker node if available)                         │                  │
│  └─────────────────────────────┬───────────────────┘                  │
│                                │                                       │
│  4. DELIVER                                                            │
│  ┌─────────────────────────────▼───────────────────┐                  │
│  │  Worker processes queue:                          │                  │
│  │                                                   │                  │
│  │  webhook → Sign payload, POST to URL              │                  │
│  │  slack   → Format Block Kit, POST chat.postMessage│                  │
│  │  teams   → Format Adaptive Card, POST to webhook  │                  │
│  │  connectwise → Create ticket via CW API           │                  │
│  │  pagerduty → Trigger incident via Events API      │                  │
│  │  zapier  → POST to Zapier REST hook URL           │                  │
│  │                                                   │                  │
│  │  On success: Log delivery, update last_triggered_at│                 │
│  │  On failure: Log error, schedule retry             │                  │
│  └─────────────────────────────┬───────────────────┘                  │
│                                │                                       │
│  5. RETRY (on failure)                                                 │
│  ┌─────────────────────────────▼───────────────────┐                  │
│  │  Retry schedule (exponential backoff):            │                  │
│  │  Attempt 2: 30 seconds                            │                  │
│  │  Attempt 3: 2 minutes                             │                  │
│  │  Attempt 4: 10 minutes                            │                  │
│  │  Attempt 5: 1 hour                                │                  │
│  │                                                   │                  │
│  │  After 5 failed attempts:                         │                  │
│  │  • Log permanent failure                          │                  │
│  │  • Increment consecutive_failures on subscription │                  │
│  │  • If consecutive_failures >= 10:                 │                  │
│  │    → Auto-disable subscription                    │                  │
│  │    → Email user: "Your webhook to X has been      │                  │
│  │      disabled after repeated failures"            │                  │
│  └──────────────────────────────────────────────────┘                  │
└───────────────────────────────────────────────────────────────────────┘
```

### Queue Technology Decision

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **Supabase pg_cron + custom queue table** | No additional infrastructure; works within current stack | Limited concurrency; no built-in retry | ✅ **Phase 1** (Month 3-6, low volume) |
| **BullMQ (Redis) on worker node** | Battle-tested; excellent retry; dashboard (Bull Board) | Requires Redis on worker node | ✅ **Phase 2** (Month 6+, scaling) |
| **Inngest** | Serverless event processing; built for Vercel; automatic retries | Third-party dependency; cost at scale | Alternative to BullMQ |

**Recommendation:** Start with Supabase queue table (simple, no new infra). Migrate to BullMQ on the Oracle Cloud worker node when volume exceeds 1,000 events/day.

---

## 14. Marketplace & Listing Strategy

### Why Marketplaces Matter

Being listed in a partner's marketplace = permanent, free distribution. Every MSP browsing ConnectWise Marketplace for security tools discovers DoppelDown. Every Shopify merchant searching for brand protection finds DoppelDown. Zero acquisition cost.

### Marketplace Priority List

| Marketplace | Audience | Effort to List | Discovery Potential | Timeline |
|-------------|----------|---------------|---------------------|----------|
| **Slack App Directory** | All Slack users | Low | Medium (crowded) | Month 4-5 |
| **Zapier App Directory** | Automation users | Medium | High (6,000+ app network) | Month 5-6 |
| **ConnectWise Marketplace** | MSPs (30K+) | Medium | Very High (target audience) | Month 7-8 |
| **Microsoft AppSource** (Teams) | Enterprise/MSP | High | High (hundreds of millions of Teams users) | Month 8-10 |
| **Datto/Kaseya Marketplace** | MSPs | Medium | High | Month 8-10 |
| **PagerDuty Integration Directory** | Security teams | Low | Medium | Month 8-9 |
| **Atlassian Marketplace** (Jira) | Dev/security teams | Medium | Medium | Month 10-12 |
| **Shopify App Store** | E-commerce merchants | High | Very High (2M+ merchants) | Month 11-14 |
| **HubSpot App Marketplace** | SMB marketers | Medium | Medium | Month 12-15 |
| **WordPress Plugin Directory** | Website owners | Medium | High (millions of WP sites) | Month 13-16 |
| **Cloudflare Apps** | Developers/webmasters | Medium | Medium | Month 14-16 |

### Marketplace Listing Optimization

For each marketplace, apply this checklist:

```
MARKETPLACE LISTING CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Title includes primary keyword ("Brand Protection")
□ Short description is benefit-focused, not feature-focused
□ Long description addresses target persona's pain points
□ 4-6 high-quality screenshots showing the integration in action
□ Video demo (30-60 seconds) if marketplace supports it
□ Pricing is clear and transparent
□ Setup instructions are included
□ Support contact / link to documentation
□ Reviews/ratings (plan to seed with early adopters)
□ Categories and tags are properly selected
□ Listing follows marketplace-specific formatting guidelines
□ Test mode / sandbox available for evaluators
```

### Reviews & Social Proof Strategy

Marketplace listings with 0 reviews get ignored. Plan to generate reviews:

1. **Ask beta integration users to review** (first 5-10 users per marketplace)
2. **Include review request in post-setup email**: "You just set up DoppelDown in [Slack/ConnectWise]. Would you leave a quick review?"
3. **Incentivise reviews**: "Leave a review → get 1 month free on your current plan" (check marketplace ToS first)
4. **Respond to every review** (shows active support)

---

## 15. Partnership Approaches by Integration Type

### How to Work with Each Partner's Ecosystem Team

| Partner | Partnership Model | How to Engage | Key Contact |
|---------|-------------------|---------------|-------------|
| **Slack** | Self-serve App Directory listing | Submit app → automated review → listed | No partnership needed initially; Slack Platform team for co-marketing at scale |
| **Microsoft** | ISV Partnership (free tier) | Join Microsoft for Startups → build → submit to AppSource | Microsoft Partner Network (MPN) |
| **Zapier** | App Developer Program | Zapier CLI → submit → review → listed. Zapier reaches out for popular apps. | Zapier Partner Manager (assigned after launch if app gains traction) |
| **ConnectWise** | Inbound Technology Partner | Apply to CW Inbound program → API access → build → Marketplace listing | ConnectWise partner development team |
| **Datto/Kaseya** | Technology Alliance | Apply via Kaseya Partner Portal → API credentials → build integration | Kaseya Technology Alliances team |
| **PagerDuty** | Integration Partner (self-serve) | Build using Events API → submit listing → PD reviews | PagerDuty Developer Relations |
| **Shopify** | App Partner (free) | Shopify Partner account → build app → submit to App Store → review | Shopify App Review team (automated + human) |
| **HubSpot** | App Partner (free) | HubSpot Developer account → build → submit to Marketplace | HubSpot App Marketplace team |
| **Atlassian** | Marketplace Partner | Atlassian Developer account → build Forge/Connect app → submit | Atlassian Marketplace team |

### Co-Marketing Opportunities

Once integrations are live and have traction, pursue co-marketing with each partner:

| Partner | Co-Marketing Opportunity | When to Pursue |
|---------|------------------------|----------------|
| **Slack** | Featured in "Security Apps" collection | After 100+ installs |
| **ConnectWise** | Sponsored content in CW's partner newsletter; booth at IT Nation | After 10+ MSPs using the integration |
| **Zapier** | "App of the Month" feature; blog post on Zapier's blog | After 500+ Zap activations |
| **Shopify** | Shopify Blog feature; Partner-led webinar | After 50+ installs + good reviews |
| **Microsoft** | Co-branded case study; Azure Marketplace listing | After Microsoft for Startups membership |

### Integration Partnership Playbook

For each technology partner, follow this sequence:

```
STEP 1: BUILD (Weeks 1-4)
• Read API docs, build the integration
• Test with 2-3 beta users (internal or early customers)
• Write documentation ("How to Connect DoppelDown + [Partner]")

STEP 2: LIST (Weeks 4-6)
• Submit to marketplace/directory
• Prepare listing: screenshots, description, video
• Pass review process (1-4 weeks depending on partner)

STEP 3: LAUNCH (Weeks 6-8)
• Announce on DoppelDown blog, LinkedIn, Twitter
• Email existing customers: "New integration available"
• Create setup guide in docs.doppeldown.com
• Add to /integrations page on website

STEP 4: GROW (Ongoing)
• Monitor usage and reviews
• Reach out to partner's ecosystem team
• Propose co-marketing activities
• Iterate on integration based on user feedback

STEP 5: DEEPEN (6-12 months post-launch)
• Add advanced features (bidirectional sync, etc.)
• Build deeper partnership (co-sell, bundling)
• Attend partner events, speak about the integration
```

---

## 16. Go-to-Market Strategy for Integrations

### Launch Playbook (Per Integration)

Every integration launch follows the same playbook:

#### Pre-Launch (2 weeks before)

| Action | Owner |
|--------|-------|
| Integration working + tested with 3 beta users | Engineering |
| Documentation written (setup guide, troubleshooting) | Engineering |
| Marketplace listing prepared (copy, screenshots, video) | Marketing |
| Blog post drafted: "How to [Use Case] with DoppelDown + [Partner]" | Marketing |
| Email draft for existing customers | Marketing |
| Social media posts prepared (LinkedIn, Twitter) | Marketing |

#### Launch Day

| Action | Owner |
|--------|-------|
| Submit marketplace listing (if not already) | Engineering |
| Publish blog post | Marketing |
| Send customer email: "New: DoppelDown now integrates with [Partner]" | Marketing |
| Post on LinkedIn (Richard's account + DoppelDown page) | Richard |
| Post on Twitter/X | Marketing |
| Add to /integrations page on website | Engineering |
| Add "Set up [Partner] integration" to onboarding flow | Engineering |
| Update API documentation | Engineering |

#### Post-Launch (Weeks 1-4)

| Action | Owner |
|--------|-------|
| Monitor adoption metrics (installs, activations) | Both |
| Collect user feedback, fix bugs | Engineering |
| Ask 3-5 early users to leave marketplace review | Marketing |
| Reach out to partner ecosystem team (introduce DoppelDown) | Richard |
| Write follow-up content: "5 Ways to Use DoppelDown + [Partner]" | Marketing |

### Integration-Specific GTM Strategies

#### Slack GTM

| Channel | Activity |
|---------|----------|
| **Onboarding** | "Get threat alerts in Slack" as Step 2 of new user onboarding |
| **Free → Paid** | "Set up Slack alerts" as activation milestone that correlates with conversion |
| **Content** | "The Security Team's Guide to Slack Alerts" blog post |
| **Community** | Share in security Slack communities (e.g., MacAdmins, SecurityPros) |

#### ConnectWise GTM

| Channel | Activity |
|---------|----------|
| **MSP Partners** | "ConnectWise integration available" email to all MSP partners |
| **Partner Enablement** | Add CW setup to partner onboarding flow |
| **ConnectWise Events** | Apply to speak/demo at IT Nation (annual CW conference) |
| **CW Community** | Post in ConnectWise Community forums |
| **CW Marketplace** | Paid promotion within CW Marketplace (if available) |

#### Zapier GTM

| Channel | Activity |
|---------|----------|
| **Content** | "10 Automations for Brand Protection" blog post |
| **Templates** | 7 pre-built Zap templates for common use cases |
| **Partners** | Notify agency partners who use Zapier heavily |
| **Zapier Blog** | Pitch guest post to Zapier's editorial team |
| **Integration Page** | Feature Zapier prominently on /integrations page |

#### Shopify GTM

| Channel | Activity |
|---------|----------|
| **App Store SEO** | Optimise listing for "brand protection," "anti-phishing," "fake store" |
| **Content** | "The E-Commerce Brand Protection Guide" targeting Shopify merchants |
| **Shopify Community** | Post in Shopify Community forums (value-first, not salesy) |
| **Shopify Partners** | Notify agency partners who build Shopify stores |
| **E-commerce Events** | Shopify Unite, eCom Expo virtual sessions |

### Integrations Page Design

The `/integrations` page on doppeldown.com serves as both a selling tool and a setup portal:

```
┌────────────────────────────────────────────────────────────────────┐
│  doppeldown.com/integrations                                       │
│                                                                    │
│  INTEGRATIONS                                                      │
│  Connect DoppelDown to your favourite tools.                       │
│  Get threat alerts where you work.                                 │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │  POPULAR                                                  │     │
│  │  ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐        │     │
│  │  │ Slack  │ │ Teams  │ │ConnectW. │ │ Zapier   │        │     │
│  │  │ ★★★★★ │ │ ★★★★☆ │ │ ★★★★★   │ │ ★★★★★   │        │     │
│  │  │Connect │ │Connect │ │ Connect  │ │ Connect  │        │     │
│  │  └────────┘ └────────┘ └──────────┘ └──────────┘        │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │  COMMUNICATION                                            │     │
│  │  Slack · Microsoft Teams · Discord · Email · SMS          │     │
│  └──────────────────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │  MSP / IT SERVICE MANAGEMENT                              │     │
│  │  ConnectWise · Autotask · HaloPSA · NinjaOne · Kaseya    │     │
│  └──────────────────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │  AUTOMATION                                               │     │
│  │  Zapier · Make · n8n · Power Automate                     │     │
│  └──────────────────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │  INCIDENT MANAGEMENT                                      │     │
│  │  PagerDuty · Opsgenie · Jira Service Management           │     │
│  └──────────────────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │  E-COMMERCE                                               │     │
│  │  Shopify · WooCommerce · BigCommerce                      │     │
│  └──────────────────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │  CUSTOM                                                   │     │
│  │  Webhooks · REST API · SDKs (Node.js, Python)             │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                    │
│  Don't see your tool? Request an integration →                     │
│  Or build your own with our API: docs.doppeldown.com →            │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 17. Phased Implementation Roadmap

### Phase 0: Foundation (Month 2-3) — "The Plumbing"

Build the integration infrastructure before any individual integration:

| Week | Deliverable | Effort | Notes |
|------|------------|--------|-------|
| 1-2 | Event bus (internal event system) | 3-5 days | All events emitted from scan engine, threat updates, etc. |
| 2-3 | Webhook system (subscribe, deliver, retry, sign) | 5-8 days | The universal connector |
| 3-4 | Integration configuration UI (Settings > Integrations) | 3-5 days | List, add, configure, disable integrations |
| 3-4 | Public API enhancement (OpenAPI spec, rate limiting, key management) | 5-8 days | API is the foundation for everything |
| 4 | Integration logging & debugging UI | 2-3 days | Users can see delivery status/errors |
| **Total** | **Phase 0** | **18-29 days** | |

### Phase 1: Quick Wins (Month 3-5) — "Alerts Where You Work"

| Week | Deliverable | Effort | Notes |
|------|------------|--------|-------|
| 1-2 | Slack integration (OAuth + messages + commands) | 10-16 days | Flagship integration |
| 3 | Teams incoming webhook (Phase 1) | 2-3 days | Quick coverage for Teams users |
| 3-4 | Zapier app (triggers + actions + listing) | 10-16 days | Force multiplier |
| 4-5 | Enhanced email alerts (digest, multi-recipient, escalation) | 3-5 days | Universal fallback |
| 5 | API documentation site (docs.doppeldown.com) | 3-5 days | Developer experience |
| **Total** | **Phase 1** | **28-45 days** | |

### Phase 2: MSP Activation (Month 5-9) — "Partner Tools"

| Week | Deliverable | Effort | Notes |
|------|------------|--------|-------|
| 1-3 | ConnectWise PSA integration | 19-27 days | #1 MSP integration |
| 4-5 | Autotask PSA integration | 8-13 days | #2 MSP integration |
| 5-6 | PagerDuty integration | 3-5 days | Quick win for security teams |
| 6-7 | Teams full Bot App (Phase 2) | 8-10 days | Full Teams experience |
| 7-8 | ConnectWise Marketplace submission | 2-3 days | Distribution |
| **Total** | **Phase 2** | **40-58 days** | |

### Phase 3: Ecosystem Expansion (Month 9-14) — "Everywhere"

| Week | Deliverable | Effort | Notes |
|------|------------|--------|-------|
| 1-2 | Make (Integromat) custom app | 8-12 days | Automation alternative |
| 2-4 | HaloPSA integration | 8-12 days | Growing PSA tool |
| 3-5 | Shopify App | 15-22 days | E-commerce distribution |
| 5-6 | Jira Service Management | 8-12 days | Security team tickets |
| 6-7 | HubSpot CRM integration | 10-15 days | SMB/agency CRM |
| 7-8 | Opsgenie integration | 3-4 days | Atlassian ecosystem |
| 8-9 | Discord Bot | 5-8 days | Tech-savvy segment |
| **Total** | **Phase 3** | **57-85 days** | |

### Phase 4: Deepening (Month 14-18+) — "Platform Maturity"

| Deliverable | Effort | Notes |
|------------|--------|-------|
| SIEM/SOAR (CEF output) | 5-8 days | Enterprise security teams |
| Cloudflare integration | 8-12 days | Infrastructure play |
| WooCommerce plugin | 10-15 days | WordPress e-commerce |
| DMARC report ingestion | 10-15 days | Email-based threat detection |
| Power Automate connector | 8-12 days | Microsoft automation |
| Salesforce AppExchange | 15-20 days | Enterprise CRM |
| TheHive/Cortex | 5-7 days | Open-source security |
| NinjaOne integration | 6-10 days | RMM tool |
| **Total** | **Phase 4** | **67-99 days** | |

### Roadmap Visualization

```
Month:  2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17   18
        ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
        
PHASE 0 ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
        Event Bus, Webhooks, API, Config UI
        
PHASE 1 ░░░░████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
        Slack, Teams(v1), Zapier, Email+, API Docs
        
PHASE 2 ░░░░░░░░░░░░████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
        ConnectWise, Autotask, PagerDuty, Teams(v2)
        
PHASE 3 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
        Make, HaloPSA, Shopify, Jira SM, HubSpot, Opsgenie, Discord
        
PHASE 4 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████████████████████████░
        SIEM, Cloudflare, WooCommerce, DMARC, Power Automate, Salesforce
```

### Engineering Resource Requirements

| Phase | Estimated Days | Recommended Staffing |
|-------|---------------|---------------------|
| Phase 0 | 18-29 days | Ernie (solo), Month 2-3 |
| Phase 1 | 28-45 days | Ernie (solo), Month 3-5 |
| Phase 2 | 40-58 days | Ernie + 1 contractor, Month 5-9 |
| Phase 3 | 57-85 days | Ernie + 1 contractor, Month 9-14 |
| Phase 4 | 67-99 days | Needs dedicated integration engineer, Month 14-18 |

**Key hiring trigger:** When Phase 2 begins (Month 5), evaluate hiring a part-time integration contractor. By Phase 3, a dedicated integration engineer (contract or full-time) is needed.

---

## 18. Integration Quality & Reliability

### SLA Commitments

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Webhook delivery latency** | <10 seconds (p95) | Time from event to webhook delivery |
| **Integration uptime** | 99.5% | Per-integration, excluding partner downtime |
| **Failed delivery retry** | 100% of failures retried (up to 5 attempts) | Automatic, no manual intervention |
| **Auto-disable on failure** | After 10 consecutive failures | Prevents wasted resources |
| **Recovery notification** | Email user when integration auto-disabled | User can re-enable after fixing the issue |

### Monitoring & Alerting

| What to Monitor | Alert Threshold | Action |
|----------------|-----------------|--------|
| Webhook delivery success rate (per integration type) | <95% over 1 hour | Investigate integration adapter |
| Webhook delivery latency (p95) | >30 seconds | Check queue depth, worker health |
| OAuth token refresh failures | Any failure | Auto-retry; alert if 3 consecutive fails |
| Integration error rate (per customer) | >50% failures in 24h | Auto-disable + email customer |
| Queue depth | >1,000 pending deliveries | Scale workers or investigate bottleneck |
| API rate limit hits | >100 429s/hour from a single customer | Review customer usage, consider plan upgrade nudge |

### Testing Strategy

| Test Type | What | When |
|-----------|------|------|
| **Unit tests** | Each integration adapter transforms events correctly | Every PR |
| **Integration tests** | Webhook delivery succeeds against mock endpoints | Every PR |
| **Contract tests** | API payloads match OpenAPI spec | Every PR |
| **E2E tests** | Full flow: scan → event → webhook delivery to real endpoint | Nightly |
| **Partner sandbox tests** | Delivery to Slack/ConnectWise/etc. sandbox environments | Before each release |
| **Chaos tests** | Webhook endpoint down → verify retry behavior | Monthly |

---

## 19. Metrics & Success Criteria

### Integration KPIs

#### Adoption Metrics (Monthly)

| Metric | Month 6 Target | Month 12 Target | Month 18 Target |
|--------|---------------|-----------------|-----------------|
| % of paid customers with ≥1 integration | 25% | 50% | 65% |
| Total active integrations (across all customers) | 30 | 150 | 400 |
| Webhook events delivered per month | 5,000 | 50,000 | 200,000 |
| API calls per month (external) | 10,000 | 100,000 | 500,000 |
| Marketplace installs (all marketplaces) | 20 | 100 | 300 |

#### Engagement Metrics (Monthly)

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Integration setup completion rate | >80% | Are setup flows intuitive? |
| Integration disable rate (within 30 days) | <15% | Are integrations delivering value? |
| Mean time from event to acknowledgement (interactive integrations) | <1 hour | Are alerts actually being acted on? |
| Marketplace review rating (average) | ≥4.0/5 | Social proof for new customers |

#### Revenue-Correlated Metrics

| Metric | Expected Impact |
|--------|-----------------|
| Customers with integrations vs. without: churn rate | Integration users churn 40% less |
| Customers with integrations vs. without: ARPU | Integration users have 20% higher ARPU (upgrade more) |
| MSP partners with CW/Autotask integration: client brands per partner | 2x more client brands than partners without |
| Marketplace-sourced signups per month | 10-30 by Month 12 |

### Reporting Dashboard

Build an internal integration health dashboard:

```
┌─────────────────────────────────────────────────────────────────┐
│  INTEGRATION HEALTH DASHBOARD (internal)                         │
│                                                                  │
│  Overall:                                                        │
│  • Active integrations: 147                                     │
│  • Events delivered (24h): 1,247                                │
│  • Delivery success rate (24h): 98.7%                           │
│  • Avg. delivery latency (24h): 2.3 seconds                    │
│                                                                  │
│  By Type:                                                        │
│  ┌──────────────┬──────┬─────────┬────────┬──────────┐         │
│  │ Integration  │Active│ 24h Evt │Success%│ Avg Lat. │         │
│  ├──────────────┼──────┼─────────┼────────┼──────────┤         │
│  │ Slack        │  52  │   423   │ 99.5%  │  1.8s    │         │
│  │ Webhook      │  34  │   312   │ 97.1%  │  2.1s    │         │
│  │ ConnectWise  │  23  │   187   │ 98.9%  │  3.4s    │         │
│  │ Teams        │  18  │   156   │ 99.2%  │  2.0s    │         │
│  │ Zapier       │  12  │    98   │ 99.0%  │  1.5s    │         │
│  │ PagerDuty    │   5  │    42   │100.0%  │  0.9s    │         │
│  │ Other        │   3  │    29   │ 96.6%  │  4.1s    │         │
│  └──────────────┴──────┴─────────┴────────┴──────────┘         │
│                                                                  │
│  Failures (last 24h):                                            │
│  • 16 total failures across 4 integrations                      │
│  • 14 retried successfully                                      │
│  • 2 permanently failed (webhook endpoints down)                │
│  • 0 integrations auto-disabled                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 20. Risk Register & Mitigations

### Integration-Specific Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Partner API changes break integrations** | Medium | High | Pin API versions; monitor partner changelogs; automated contract tests; 1 engineer day/month for maintenance |
| **Webhook delivery failures at scale** | Low | High | Queue-based delivery with retry; auto-disable; monitoring; migrate to BullMQ when volume grows |
| **OAuth token expiration not handled** | Medium | Medium | Background token refresh job; alert on refresh failures; graceful degradation (queue events, retry after re-auth) |
| **Marketplace rejection** | Medium | Medium | Follow submission guidelines precisely; test with sandbox accounts; review published examples |
| **Low integration adoption** | Medium | High | Make setup frictionless (1-2 clicks); include in onboarding; show value immediately (test event on setup) |
| **Integration maintenance burden** | High | Medium | API-first design (integrations are thin adapters); shared infrastructure; prioritise fewer, higher-quality integrations over breadth |
| **Customer data leaking through integrations** | Low | Very High | Customers control what data is sent; audit integration permissions; encrypt tokens at rest; never send sensitive evidence to third parties without explicit consent |
| **Rate limiting by partners (Slack, CW, etc.)** | Medium | Medium | Batch events when possible; respect rate limits with backoff; queue for burst protection |
| **Shopify 20% revenue share erodes margins** | Certain (if Shopify app built) | Medium | Adjust Shopify-specific pricing to account for 20% cut; consider Shopify as lead-gen channel (convert to direct billing after trial) |
| **Engineering capacity for maintenance** | High | High | Budget 20% of integration engineering time for maintenance; hire dedicated integration engineer by Phase 3 |

### Dependency Map

```
┌─────────────────────────────────────────────────────────────────────┐
│  INTEGRATION DEPENDENCY MAP                                          │
│                                                                      │
│  MUST EXIST FIRST:                                                   │
│  ┌──────────────────────────────────────────┐                       │
│  │  1. Event Bus (internal event system)     │                       │
│  │  2. Webhook system (subscribe/deliver)    │  ← PHASE 0           │
│  │  3. Public API (enhanced, rate-limited)   │                       │
│  │  4. Integration config UI                 │                       │
│  └──────────────────────┬───────────────────┘                       │
│                         │                                            │
│  THEN BUILD:            ▼                                            │
│  ┌──────────────────────────────────────────┐                       │
│  │  Slack, Teams(v1), Zapier, Email+         │  ← PHASE 1           │
│  └──────────────────────┬───────────────────┘                       │
│                         │                                            │
│  THEN BUILD:            ▼                                            │
│  ┌──────────────────────────────────────────┐                       │
│  │  ConnectWise, Autotask, PagerDuty         │  ← PHASE 2           │
│  │  (requires partner portal + multi-tenant  │                       │
│  │   from PARTNERSHIP_CHANNEL_STRATEGY.md)   │                       │
│  └──────────────────────┬───────────────────┘                       │
│                         │                                            │
│  PARALLEL / INDEPENDENT:▼                                            │
│  ┌──────────────────────────────────────────┐                       │
│  │  Shopify, HubSpot, Jira, Discord, Make    │  ← PHASE 3           │
│  │  (independent of each other; build in     │                       │
│  │   order of customer demand)               │                       │
│  └──────────────────────────────────────────┘                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Appendix A: Integration Comparison Matrix

| Integration | Auth Model | Effort (days) | Phase | Marketplace | Plan Requirement |
|-------------|-----------|---------------|-------|-------------|-----------------|
| Webhooks (custom) | API key + HMAC | Part of Phase 0 | 0 | N/A | All plans |
| Slack | OAuth 2.0 | 10-16 | 1 | Slack App Directory | Growth+ |
| Teams (webhook) | Incoming webhook URL | 2-3 | 1 | N/A | Growth+ |
| Teams (bot) | Azure AD OAuth | 8-10 | 2 | MS AppSource | Growth+ |
| Zapier | API key | 10-16 | 1 | Zapier | Business+ |
| Make | API key / webhook | 8-12 | 3 | Make | Business+ |
| n8n | API key | 3-5 | 3 | n8n community | Business+ |
| ConnectWise | API key pair | 19-27 | 2 | CW Marketplace | Business+ (partner) |
| Autotask | API key | 8-13 | 2 | Kaseya Marketplace | Business+ (partner) |
| HaloPSA | API key + OAuth | 8-12 | 3 | HaloPSA | Business+ (partner) |
| NinjaOne | API key | 6-10 | 4 | NinjaOne | Business+ (partner) |
| PagerDuty | Integration key | 3-5 | 2 | PD Integration Dir. | Business+ |
| Opsgenie | API key | 3-4 | 3 | Atlassian | Business+ |
| Jira SM | Atlassian OAuth | 8-12 | 3 | Atlassian Marketplace | Business+ |
| HubSpot | OAuth 2.0 | 10-15 | 3 | HubSpot Marketplace | Business+ |
| Shopify | Shopify OAuth | 15-22 | 3 | Shopify App Store | Custom pricing |
| WooCommerce | API key | 10-15 | 4 | WordPress Plugin Dir. | Growth+ |
| Cloudflare | API token | 8-12 | 4 | Cloudflare Apps | Enterprise |
| SIEM (CEF) | Syslog/HTTP | 5-8 | 4 | N/A | Enterprise |
| Salesforce | OAuth 2.0 | 15-20 | 4 | AppExchange | Enterprise |
| Power Automate | Azure AD | 8-12 | 4 | Power Platform | Business+ |

---

## Appendix B: Integration Request Tracking

As customers and partners request integrations, track demand to inform prioritisation:

```
INTEGRATION REQUEST TRACKER (Template)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Integration    | Requests | Revenue at Risk | Notes              |
|----------------|----------|-----------------|--------------------|
| ConnectWise    |    8     |  $2,400 MRR     | 3 MSPs waiting    |
| Slack          |    12    |  $1,800 MRR     | Most requested     |
| Zapier         |    6     |  $900 MRR       | "Connect to X" asks|
| Shopify        |    4     |  $600 MRR       | E-commerce segment |
| Teams          |    5     |  $750 MRR       | Corporate/MSP      |
| ...            |          |                 |                    |
```

Track in a simple spreadsheet or Notion table. Update weekly. Use to adjust Phase 3-4 prioritisation.

---

## Appendix C: Cost Estimates

### Per-Integration Operational Costs

| Integration | Ongoing Cost | Notes |
|-------------|-------------|-------|
| Slack | $0 | Slack API is free for bot messages |
| Teams | $0 | Azure Bot Service free tier: 10K messages/month |
| Zapier | $0 | Free for app developers (Zapier charges users) |
| ConnectWise | $0 | API access is free for technology partners |
| PagerDuty | $0 | Events API is free |
| Shopify | 20% rev share | Significant — plan for pricing adjustment |
| SMS (Twilio) | ~$0.01-0.05/msg | Pass through or include limited allocation |
| SIEM (Syslog) | $0-50/mo | Syslog server costs if self-hosted |
| Webhook delivery | ~$5-20/mo | Compute for worker processing |

**Total estimated monthly cost (Month 12):** $50-200/month (excluding Shopify rev share)

### One-Time Development Costs

| Phase | Est. Engineering Days | At $150/day (contractor) | At $500/day (senior) |
|-------|----------------------|--------------------------|---------------------|
| Phase 0 | 18-29 | $2,700-4,350 | $9,000-14,500 |
| Phase 1 | 28-45 | $4,200-6,750 | $14,000-22,500 |
| Phase 2 | 40-58 | $6,000-8,700 | $20,000-29,000 |
| Phase 3 | 57-85 | $8,550-12,750 | $28,500-42,500 |
| Phase 4 | 67-99 | $10,050-14,850 | $33,500-49,500 |
| **Total** | **210-316 days** | **$31,500-47,400** | **$105,000-158,000** |

Note: If Ernie builds most of Phase 0-2 (as existing team), the out-of-pocket cost is contractor support for Phase 2-3 and a hire for Phase 4.

---

## Document Cross-References

| Document | Relevance |
|----------|-----------|
| **PARTNERSHIP_CHANNEL_STRATEGY.md** | Partner portal requirements, MSP partner profiles, Tier 4 tech partners overview |
| **OPERATIONAL_READINESS.md** | Job queue architecture (reuse for webhook delivery), worker node setup |
| **CUSTOMER_ACQUISITION_GROWTH_STRATEGY.md** | Customer personas, PLG strategy (integrations enhance PLG conversion) |
| **COMPETITIVE_ANALYSIS.md** | Competitor integration capabilities (Bolster API-first approach) |
| **PRICING_STRATEGY.md** | Plan-level API/integration access limits |

---

*This is a living document. Re-prioritise integrations quarterly based on customer demand, partner feedback, and competitive dynamics. The best integration strategy is one that ships fast, listens to users, and doubles down on what's working.*

*Last updated: 2026-02-05*
