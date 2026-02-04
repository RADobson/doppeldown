# DoppelDown Developer Experience (DevX) Strategy

> A comprehensive roadmap for transforming DoppelDown from a dashboard-first product into a developer-beloved platform with world-class documentation, tooling, and community.
>
> Last updated: 2026-02-05

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Audit](#current-state-audit)
3. [Strategic Vision](#strategic-vision)
4. [Phase 1: Documentation Foundation (Weeks 1–4)](#phase-1-documentation-foundation-weeks-14)
5. [Phase 2: Interactive Developer Tools (Weeks 5–10)](#phase-2-interactive-developer-tools-weeks-510)
6. [Phase 3: SDK & Client Libraries (Weeks 11–16)](#phase-3-sdk--client-libraries-weeks-1116)
7. [Phase 4: Developer Community & Ecosystem (Weeks 17–24)](#phase-4-developer-community--ecosystem-weeks-1724)
8. [Phase 5: Advanced DevX & Feedback Loops (Weeks 25–32)](#phase-5-advanced-devx--feedback-loops-weeks-2532)
9. [Content Strategy](#content-strategy)
10. [Metrics & Success Criteria](#metrics--success-criteria)
11. [Technical Architecture](#technical-architecture)
12. [Competitive DevX Benchmarks](#competitive-devx-benchmarks)
13. [Budget & Resource Estimates](#budget--resource-estimates)
14. [Risk Assessment](#risk-assessment)
15. [Appendix: Implementation Details](#appendix-implementation-details)

---

## Executive Summary

### The Opportunity

DoppelDown's GTM strategy positions it as "the Stripe of brand protection." To earn that comparison, the developer experience must match. Stripe didn't win because of their API — they won because of **documentation that felt like a conversation, SDKs that just worked, and a community that amplified everything.**

DoppelDown already has solid API documentation (35K+ word API.md, OpenAPI spec, SDK examples, webhook guide). But it's fragmented across markdown files, lacks interactivity, and has no community feedback loop. The gap between "good docs" and "Stripe-tier DevX" is the gap between *adequate* and *exceptional*.

### Key Recommendations

| Priority | Initiative | Impact | Effort |
|----------|-----------|--------|--------|
| 🔴 P0 | Unified docs site (Mintlify/Docusaurus) | High | Medium |
| 🔴 P0 | Interactive API explorer with "Try It" | High | Medium |
| 🟠 P1 | Official TypeScript & Python SDKs | High | High |
| 🟠 P1 | Developer API keys (separate from Supabase tokens) | High | Medium |
| 🟡 P2 | CLI tool for local dev/testing | Medium | Medium |
| 🟡 P2 | Webhook testing tools (CLI + web UI) | Medium | Low |
| 🟢 P3 | Developer community (Discord/GitHub Discussions) | Medium | Low (ongoing) |
| 🟢 P3 | Integration marketplace & partner SDKs | Medium | High |

### Projected Impact

- **API adoption**: 3–5x increase in programmatic API usage within 6 months
- **Time-to-first-scan**: Reduce from ~15 min to <5 min for API users
- **Support ticket reduction**: 40–60% fewer "how do I..." tickets
- **Developer NPS**: Target 50+ (industry benchmark: 30–40)

---

## Current State Audit

### What's Already Built ✅

DoppelDown has a stronger documentation foundation than most early-stage SaaS:

| Asset | Quality | Notes |
|-------|---------|-------|
| `docs/API.md` (35K+ words) | ⭐⭐⭐⭐ | Comprehensive endpoint reference with examples |
| `docs/openapi.yaml` (59K) | ⭐⭐⭐⭐ | Complete OpenAPI 3.0 spec — excellent for code generation |
| `docs/QUICKSTART.md` | ⭐⭐⭐⭐ | Clear 5-minute guide with copy-paste curl commands |
| `docs/SDK_EXAMPLES.md` | ⭐⭐⭐⭐ | JS/Python/cURL examples for every operation |
| `docs/WEBHOOKS.md` | ⭐⭐⭐⭐⭐ | Best-in-class webhook guide with verification code |
| `docs/ERROR_HANDLING.md` | ⭐⭐⭐⭐ | Deep resilience guide (circuit breakers, retry logic) |
| `src/app/api-docs/page.tsx` | ⭐⭐⭐⭐ | Beautiful in-app API reference with interactive sidebar |
| Swagger UI (`/api-docs/swagger`) | ⭐⭐⭐ | Standard OpenAPI viewer |
| `README.md` | ⭐⭐⭐⭐ | Good onboarding but mixes self-hosted and SaaS use cases |

### What's Missing ❌

| Gap | Impact | Priority |
|-----|--------|----------|
| **No dedicated docs site** — docs are markdown files or embedded pages | Discoverability, SEO, search | P0 |
| **No "Try It" API explorer** — devs must leave docs to test | Friction to first call | P0 |
| **No official SDKs** — only code snippet examples | Adoption, DX quality | P1 |
| **No dedicated API keys** — must use Supabase tokens (confusing for API-first users) | Security, UX | P1 |
| **No CLI tool** — everything requires browser or raw HTTP | Power-user experience | P2 |
| **No changelog feed** — only `CHANGELOG.md` | API stability trust | P2 |
| **No developer community** — no forum, Discord, or feedback loop | Retention, insight | P3 |
| **No sandbox/test mode** — no way to test without affecting production data | Safety, onboarding | P1 |
| **No rate limit dashboard** — devs can't see their usage | Transparency | P2 |
| **No status page** — no public uptime/incident tracker | Trust | P2 |

### Developer Persona Analysis

Based on DoppelDown's GTM strategy, there are three primary developer personas:

#### 1. "The Integrator" (Primary — 60% of API users)
- **Who**: Security engineer at a mid-market company, integrating DoppelDown into existing SIEM/SOAR
- **Needs**: Reliable SDKs, webhook events, comprehensive error handling, sandbox testing
- **Pain today**: Must write raw HTTP calls, no test mode, token management is clunky

#### 2. "The MSP Builder" (Secondary — 25% of API users)
- **Who**: MSP/MSSP technical lead building brand monitoring into their managed service
- **Needs**: Multi-tenant API patterns, bulk operations, white-label reporting
- **Pain today**: No multi-tenant examples, no bulk scan endpoints, manual report generation

#### 3. "The Evaluator" (Tertiary — 15% of API users)
- **Who**: CTO/tech lead evaluating DoppelDown vs. competitors during a trial
- **Needs**: Quick "wow" moment, copy-paste to working code, clear pricing/limits
- **Pain today**: Must sign up before seeing API in action, no playground/sandbox

---

## Strategic Vision

### The DevX North Star

> **A developer should go from "I just heard about DoppelDown" to "I have threats showing in my dashboard" in under 10 minutes, using the language and tools they already know.**

### Design Principles

1. **Progressive disclosure**: Show the simple thing first, reveal complexity on demand
2. **Copy-paste to production**: Every code example should actually work (no pseudocode)
3. **Fail with empathy**: Error messages should tell you what you did wrong AND how to fix it
4. **Self-serve first**: A developer should never need to email support for a how-to question
5. **Platform-native**: TypeScript devs get TypeScript. Python devs get Python. No one gets Java first.

---

## Phase 1: Documentation Foundation (Weeks 1–4)

### 1.1 Unified Documentation Site

**Goal**: A single, beautiful, searchable documentation portal at `docs.doppeldown.com`.

#### Recommended Platform: Mintlify

| Option | Pros | Cons | Cost |
|--------|------|------|------|
| **Mintlify** ⭐ | Beautiful out-of-box, OpenAPI import, API playground, analytics | Vendor lock-in | $150/mo (Startup) |
| Docusaurus | Free, customizable, React-based, self-hosted | More setup work, no built-in API playground | Free |
| ReadMe | Strong API explorer, built-in API key management | Expensive, less customizable | $99–399/mo |
| GitBook | Easy editing, good search | Less developer-focused, limited customization | $8/mo+ |

**Why Mintlify**: It directly imports OpenAPI specs, auto-generates "Try It" panels, has beautiful component primitives, and provides built-in search + analytics. DoppelDown's existing `openapi.yaml` becomes interactive documentation with near-zero effort.

#### Information Architecture

```
docs.doppeldown.com/
├── 🏠 Home (hero + quickstart teaser)
├── 📚 Getting Started/
│   ├── Introduction (what is DoppelDown, who it's for)
│   ├── Quick Start (5-min guide — adapted from QUICKSTART.md)
│   ├── Authentication (token flows, API keys)
│   └── Core Concepts (brands, scans, threats, evidence, reports)
├── 📖 API Reference/
│   ├── Overview (base URL, versioning, rate limits)
│   ├── Brands (auto-generated from OpenAPI)
│   ├── Scans
│   ├── Threats
│   ├── Evidence
│   ├── Reports
│   ├── Notifications
│   ├── Billing
│   ├── Admin
│   └── Webhooks
├── 🧰 SDKs & Libraries/
│   ├── TypeScript/JavaScript
│   ├── Python
│   ├── CLI
│   └── Community SDKs
├── 🔌 Integrations/
│   ├── Webhook Setup
│   ├── Slack Integration
│   ├── SIEM/SOAR (Splunk, Sentinel, etc.)
│   ├── Zapier/n8n
│   └── Custom Integrations
├── 📋 Guides/
│   ├── Scan-to-Report Pipeline
│   ├── Continuous Monitoring Setup
│   ├── Multi-Brand Management
│   ├── MSP/Multi-Tenant Patterns
│   ├── Migrating from Competitors
│   └── Error Handling & Resilience
├── 🔄 Changelog
├── 📊 API Status
└── 💬 Community
```

#### Implementation Steps

1. **Set up Mintlify project** — initialize with DoppelDown branding (colors, logo, fonts)
2. **Import OpenAPI spec** — `docs/openapi.yaml` auto-generates API reference pages
3. **Migrate markdown docs** — convert existing `.md` files to Mintlify MDX format
4. **Add navigation structure** — configure `mint.json` with the IA above
5. **Configure custom domain** — `docs.doppeldown.com` with SSL
6. **Add search** — Mintlify includes Algolia-powered search by default
7. **Add analytics** — track page views, search queries, "Try It" usage

**Deliverables**:
- [ ] `docs.doppeldown.com` live with full API reference
- [ ] All existing markdown docs migrated and cross-linked
- [ ] OpenAPI-powered interactive "Try It" panels on every endpoint
- [ ] Full-text search across all documentation
- [ ] Analytics dashboard tracking doc engagement

### 1.2 API Key System

**Goal**: First-class API keys that are separate from Supabase session tokens.

The current auth model requires developers to extract Supabase access tokens — this is a significant DX hurdle. API-first products need dedicated API keys.

#### Design

```
Dashboard → Settings → API Keys
┌──────────────────────────────────────────────────────────────┐
│ API Keys                                                       │
│                                                                │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Production Key                                          │   │
│ │ dd_live_k1a2b3c4d5...                    [Reveal] [🗑️]  │   │
│ │ Created: 2026-02-01  Last used: 2 hours ago            │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                                │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Test Key (sandbox mode)                                 │   │
│ │ dd_test_x9y8z7w6v5...                   [Reveal] [🗑️]  │   │
│ │ Created: 2026-02-01  Last used: 5 min ago              │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                                │
│ [+ Create New Key]                                            │
│                                                                │
│ Rate limit usage: 42/60 requests this minute                  │
└──────────────────────────────────────────────────────────────┘
```

#### Key Format
```
dd_live_<32_random_chars>   — Production key
dd_test_<32_random_chars>   — Sandbox key (no real scans, mock data)
```

#### Implementation

- New table: `api_keys` (id, user_id, key_hash, prefix, name, mode, last_used_at, created_at, revoked_at)
- Middleware: check `Authorization: Bearer dd_*` before Supabase token check
- Keys are hashed (bcrypt) — only the prefix is stored for identification
- Dashboard UI for CRUD operations

### 1.3 Documentation Quality Standards

Establish standards that apply to all future documentation:

#### Every API Endpoint Must Have
- [ ] One-line description
- [ ] Authentication requirement badge
- [ ] Rate limit annotation
- [ ] Request parameters table (name, type, required, default, description)
- [ ] Example request in cURL, TypeScript, and Python
- [ ] Example success response (full JSON)
- [ ] Error response table (status, code, description)
- [ ] "Try It" interactive panel (auto from OpenAPI)

#### Every Guide Must Have
- [ ] Prerequisites section
- [ ] Estimated time to complete
- [ ] Step-by-step instructions with code examples
- [ ] "What's next" links to related guides
- [ ] Common pitfalls / FAQ section

#### Every Code Example Must
- [ ] Be copy-paste runnable (no pseudocode, no `...` in imports)
- [ ] Include error handling (not just the happy path)
- [ ] Use environment variables for secrets (never hardcoded)
- [ ] Be tested in CI (example validation — see Phase 2)

---

## Phase 2: Interactive Developer Tools (Weeks 5–10)

### 2.1 API Explorer & Playground

**Goal**: An in-browser environment where developers can make real API calls without writing code.

#### Option A: Mintlify Built-In (Recommended)

Mintlify's OpenAPI integration already provides "Try It" panels. With the API key system from Phase 1, developers can:
1. Paste their `dd_test_*` key in the explorer
2. Fill in parameters
3. Click "Send"
4. See the real response

This works out of the box with our existing `openapi.yaml`.

#### Option B: Custom Playground (Future Enhancement)

A more advanced playground at `playground.doppeldown.com` with:
- **Pre-populated scenarios**: "Scan for typosquats of nike.com" (using sandbox data)
- **Response visualization**: Threat severity charts, timeline views
- **Code generation**: See the equivalent cURL/JS/Python for any action taken in the UI
- **Share links**: Generate shareable URLs for specific API call configurations

### 2.2 Sandbox / Test Mode

**Goal**: A safe environment for developers to test integrations without consuming scan quotas or generating real threats.

#### Design

```
Test Mode (dd_test_* keys):
├── Brands      → Creates real records tagged with test_mode=true
├── Scans       → Returns realistic mock scan results (no actual scanning)
├── Threats     → Returns seeded test threats with mock evidence
├── Reports     → Generates real PDF reports from test data
├── Webhooks    → Fires real webhook events with test payloads
├── Billing     → Uses Stripe test mode automatically
└── Quota       → Unlimited (doesn't count against real limits)
```

#### Mock Data Seeding

Provide a single API call to seed a test brand with realistic data:

```bash
curl -X POST https://doppeldown.com/api/test/seed \
  -H "Authorization: Bearer dd_test_..." \
  -H "Content-Type: application/json" \
  -d '{ "scenario": "ecommerce_brand_under_attack" }'
```

Available scenarios:
- `ecommerce_brand_under_attack` — 15 threats across typosquats, phishing, social impersonation
- `clean_brand` — Brand with zero threats (test happy path)
- `financial_services` — Compliance-focused scenario with high-severity threats
- `multi_brand_msp` — 5 brands with varying threat levels

### 2.3 Webhook Testing Tools

**Goal**: Make webhook integration development painless.

#### In-Dashboard Webhook Tester

```
Dashboard → Settings → Integrations → Webhooks
┌──────────────────────────────────────────────────────────────┐
│ Webhook Configuration                                         │
│                                                                │
│ URL: https://your-server.com/webhooks/dd  [Test] [Save]       │
│ Secret: ••••••••••••••••••              [Regenerate]          │
│                                                                │
│ Events: ☑ threat.detected ☑ scan.completed ☑ threat.resolved │
│                                                                │
│ ─── Recent Deliveries ──────────────────────────────────────  │
│                                                                │
│ ✅ threat.detected    2026-02-05 10:30:00    200 OK   45ms   │
│    [View Payload] [Resend]                                    │
│                                                                │
│ ❌ scan.completed     2026-02-05 10:29:00    500 Error 120ms  │
│    [View Payload] [View Response] [Resend]                    │
│                                                                │
│ ✅ threat.detected    2026-02-05 10:28:00    200 OK   52ms   │
│    [View Payload] [Resend]                                    │
│                                                                │
│ [Send Test Event ▾]                                           │
│   → threat.detected (sample)                                  │
│   → scan.completed (sample)                                   │
│   → threat.resolved (sample)                                  │
└──────────────────────────────────────────────────────────────┘
```

#### CLI Webhook Listener

```bash
# Install CLI (see Phase 3)
npx doppeldown listen --port 4000

# Output:
# 🔗 Forwarding https://dd-cli-abc123.relay.doppeldown.com → http://localhost:4000
# ✅ Ready to receive webhook events
#
# [10:30:05] threat.detected → 200 OK (45ms)
# [10:30:12] scan.completed  → 200 OK (32ms)
```

### 2.4 Interactive Code Examples

**Goal**: Transform static code snippets into runnable, editable examples.

#### Approach: Embedded Code Sandboxes

For each major workflow in the docs, embed a runnable sandbox:

```
┌─ Full Scan-to-Report Pipeline ─────────────────────────────┐
│                                                              │
│  [TypeScript]  [Python]  [cURL]                             │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ // 1. Create a brand                                  │  │
│  │ const brand = await dd.brands.create({               │  │
│  │   name: 'Acme Corp',                                 │  │
│  │   domain: 'acme.com',                                │  │
│  │ });                                                   │  │
│  │                                                       │  │
│  │ // 2. Start a scan                                    │  │
│  │ const scan = await dd.scans.start({                  │  │
│  │   brandId: brand.id,                                  │  │
│  │   scanType: 'full',                                   │  │
│  │ });                                                   │  │
│  │                                                       │  │
│  │ // 3. Wait for completion                             │  │
│  │ const result = await dd.scans.waitForCompletion(     │  │
│  │   scan.scanId,                                        │  │
│  │   { pollInterval: 5000, timeout: 300000 }            │  │
│  │ );                                                    │  │
│  │                                                       │  │
│  │ // 4. Generate report                                 │  │
│  │ const report = await dd.reports.generate({           │  │
│  │   brandId: brand.id,                                  │  │
│  │   format: 'html',                                     │  │
│  │ });                                                   │  │
│  │                                                       │  │
│  │ console.log(`Found ${result.threats_found} threats`); │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [▶ Run in Sandbox]  [📋 Copy]  [Open in StackBlitz]       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Implementation**: Use [Sandpack](https://sandpack.codesandbox.io/) (CodeSandbox's embeddable editor) for JS/TS examples, or link to StackBlitz/Replit for full projects.

### 2.5 Example Validation in CI

**Goal**: Ensure all code examples in documentation actually work.

```yaml
# .github/workflows/docs-test.yml
name: Test Documentation Examples
on:
  push:
    paths: ['docs/**', 'examples/**']
  schedule:
    - cron: '0 6 * * 1' # Weekly Monday 6am

jobs:
  test-examples:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - uses: actions/setup-python@v5
        with: { python-version: '3.12' }
      
      - name: Test TypeScript examples
        run: |
          cd examples/typescript
          npm install
          npm test
        env:
          DOPPELDOWN_TOKEN: ${{ secrets.DD_TEST_KEY }}
      
      - name: Test Python examples
        run: |
          cd examples/python
          pip install -r requirements.txt
          pytest
        env:
          DOPPELDOWN_TOKEN: ${{ secrets.DD_TEST_KEY }}
      
      - name: Validate cURL examples
        run: |
          cd examples/curl
          bash test-all.sh
        env:
          DOPPELDOWN_TOKEN: ${{ secrets.DD_TEST_KEY }}
```

---

## Phase 3: SDK & Client Libraries (Weeks 11–16)

### 3.1 Official TypeScript SDK

**Goal**: A type-safe, ergonomic TypeScript client that makes DoppelDown integration delightful.

#### Design Philosophy
- **Auto-generated from OpenAPI** (using `openapi-typescript-codegen` or `openapi-fetch`)
- **Thin wrapper** — don't abstract away the API, just make it type-safe
- **Tree-shakeable** — only import what you use
- **Zero dependencies** (uses `fetch` natively)
- **Works everywhere** — Node.js, Deno, Bun, Cloudflare Workers, browsers

#### API Design

```typescript
import { DoppelDown } from '@doppeldown/sdk';

const dd = new DoppelDown({
  apiKey: process.env.DOPPELDOWN_API_KEY, // dd_live_... or dd_test_...
  // Optional:
  baseUrl: 'https://doppeldown.com/api', // Default
  timeout: 30_000,                        // Default: 30s
  retries: 3,                             // Default: 3 with exponential backoff
});

// ─── Brands ──────────────────────────────────────
const brands = await dd.brands.list();
const brand = await dd.brands.create({
  name: 'Acme Corp',
  domain: 'acme.com',
  keywords: ['acme', 'acmecorp'],
  socialHandles: { twitter: ['@acmecorp'] },
  enabledSocialPlatforms: ['twitter', 'instagram'],
});
await dd.brands.update(brand.id, { keywords: ['acme', 'acmecorp', 'acme-inc'] });
await dd.brands.uploadLogo(brand.id, './logo.png');

// ─── Scans ───────────────────────────────────────
const scan = await dd.scans.start({ brandId: brand.id, scanType: 'full' });
const status = await dd.scans.get(scan.scanId);
const result = await dd.scans.waitForCompletion(scan.scanId, {
  pollInterval: 5_000,
  timeout: 300_000,
  onProgress: (s) => console.log(`${s.domains_checked} domains checked`),
});
await dd.scans.cancel(scan.scanId);
const quota = await dd.scans.quota();

// ─── Threats ─────────────────────────────────────
await dd.threats.delete(threatId);

// ─── Evidence ────────────────────────────────────
const signedUrl = await dd.evidence.sign({
  threatId,
  kind: 'screenshot',
  expiresIn: 7200,
});

// ─── Reports ─────────────────────────────────────
const report = await dd.reports.generate({
  brandId: brand.id,
  format: 'html',
  ownerName: 'Acme Legal',
});
const reports = await dd.reports.list({ brandId: brand.id });

// ─── Notifications ───────────────────────────────
const notifications = await dd.notifications.list({ limit: 50, unreadOnly: true });
await dd.notifications.markRead(notificationIds);

// ─── Webhooks (verification helper) ──────────────
import { verifyWebhookSignature } from '@doppeldown/sdk/webhooks';

app.post('/webhooks/dd', (req, res) => {
  const isValid = verifyWebhookSignature(
    req.body,
    req.headers['x-doppeldown-signature'],
    process.env.DD_WEBHOOK_SECRET,
  );
  if (!isValid) return res.status(401).end();
  // Handle event...
  res.status(200).json({ received: true });
});

// ─── Error Handling ──────────────────────────────
import { DoppelDownError, RateLimitError, QuotaExceededError } from '@doppeldown/sdk';

try {
  await dd.scans.start({ brandId: 'invalid' });
} catch (err) {
  if (err instanceof RateLimitError) {
    console.log(`Rate limited. Retry after ${err.retryAfter}s`);
  } else if (err instanceof QuotaExceededError) {
    console.log(`Quota exceeded. Resets at ${err.resetsAt}`);
  } else if (err instanceof DoppelDownError) {
    console.log(`API error ${err.status}: ${err.code} — ${err.message}`);
  }
}
```

#### Package Structure

```
@doppeldown/sdk/
├── src/
│   ├── index.ts          # Main client class
│   ├── client.ts         # HTTP client (fetch-based)
│   ├── resources/
│   │   ├── brands.ts
│   │   ├── scans.ts
│   │   ├── threats.ts
│   │   ├── evidence.ts
│   │   ├── reports.ts
│   │   ├── notifications.ts
│   │   └── billing.ts
│   ├── webhooks.ts       # Webhook verification helpers
│   ├── errors.ts         # Typed error classes
│   └── types.ts          # Generated from OpenAPI
├── package.json
├── tsconfig.json
├── README.md
└── CHANGELOG.md
```

**Published to**: npm as `@doppeldown/sdk`
**Bundle size target**: <15KB gzipped (core client, no optional deps)

### 3.2 Official Python SDK

```python
from doppeldown import DoppelDown, DoppelDownError, RateLimitError

dd = DoppelDown(api_key=os.environ["DOPPELDOWN_API_KEY"])

# Brands
brands = dd.brands.list()
brand = dd.brands.create(
    name="Acme Corp",
    domain="acme.com",
    keywords=["acme", "acmecorp"],
)

# Scans
scan = dd.scans.start(brand_id=brand.id, scan_type="full")
result = dd.scans.wait_for_completion(
    scan.scan_id,
    poll_interval=5,
    timeout=300,
    on_progress=lambda s: print(f"{s.domains_checked} domains checked"),
)

# Reports
report = dd.reports.generate(brand_id=brand.id, format="html")

# Async support
import asyncio
from doppeldown import AsyncDoppelDown

async def main():
    dd = AsyncDoppelDown(api_key=os.environ["DOPPELDOWN_API_KEY"])
    brands = await dd.brands.list()
    # ...

asyncio.run(main())
```

**Published to**: PyPI as `doppeldown`
**Python versions**: 3.9+
**Dependencies**: `httpx` (sync + async HTTP client)

### 3.3 CLI Tool

**Goal**: A command-line tool for developers and CI/CD pipelines.

```bash
# Install
npm install -g @doppeldown/cli
# or
brew install doppeldown/tap/dd

# Auth
dd auth login                     # Opens browser OAuth flow
dd auth set-key dd_live_...       # Set API key directly
dd auth status                    # Show current auth state

# Brands
dd brands list                    # Table of all brands
dd brands create "Acme Corp" --domain acme.com --keywords acme,acmecorp
dd brands update <id> --add-keyword "acme-inc"

# Scans
dd scan <brand-id>                # Start full scan
dd scan <brand-id> --type quick   # Quick scan
dd scan status <scan-id>          # Check status
dd scan status <scan-id> --wait   # Wait for completion (shows progress bar)
dd scan quota                     # Check remaining quota

# Reports
dd report <brand-id>              # Generate HTML report
dd report <brand-id> --format csv -o threats.csv

# Webhooks
dd listen                         # Start local webhook listener
dd webhook test threat.detected   # Send test event to configured URL

# Utilities
dd status                         # API health + your plan info
dd config                         # Show current config
```

**CLI Output Design** — use colors, spinners, tables:

```
$ dd scan my-brand-id --wait

🔍 Scanning "Acme Corp" (acme.com)...

  Domains checked  ████████████████████░░░░  150/200
  Pages scanned    ██████████░░░░░░░░░░░░░░   42/100
  Threats found    5

⏱️  Elapsed: 2m 34s

✅ Scan completed!

  THREAT                       SEVERITY   TYPE              
  acme-corp.xyz                🔴 High    Typosquat domain  
  @acme_corp_official (IG)     🟡 Medium  Social impersonation
  acme-support.com             🔴 High    Phishing site
  @AcmeCorpHelp (Twitter)      🟡 Medium  Social impersonation
  acmecorp.xyz                 🟠 High    Typosquat domain

Run `dd report my-brand-id` to generate a takedown report.
```

---

## Phase 4: Developer Community & Ecosystem (Weeks 17–24)

### 4.1 Community Platform

#### Recommended: GitHub Discussions + Discord

| Platform | Purpose | Audience |
|----------|---------|----------|
| **GitHub Discussions** | Long-form Q&A, feature requests, RFC discussions | Active developers, contributors |
| **Discord** | Real-time chat, quick questions, community building | All developers, prospects |
| **Changelog (docs site)** | Release announcements, breaking changes | All API consumers |

#### Discord Server Structure

```
DoppelDown Community
├── 📢 announcements          # Release notes, status updates
├── 📖 getting-started        # Onboarding help, first questions
├── 💬 general                # General discussion
├── 🔧 api-help               # API questions and debugging
├── 🐛 bug-reports            # Bug reports (triage to GitHub Issues)
├── 💡 feature-requests       # Ideas and wishlist
├── 🔌 integrations           # SIEM, Slack, Zapier, custom integrations
├── 🐍 sdk-python             # Python SDK discussion
├── 📘 sdk-typescript          # TypeScript SDK discussion
├── 🏗️ show-and-tell          # Community projects, integrations
└── 🔐 security-researchers   # Private channel for responsible disclosure
```

#### Community Engagement Playbook

1. **Week 1**: Announce Discord in docs, dashboard banner, email to existing users
2. **Ongoing**: Respond to every question within 4 hours during business hours
3. **Monthly**: "Community Spotlight" — feature a cool integration or use case
4. **Quarterly**: "Developer Survey" — gather feedback on DX priorities
5. **Continuous**: Route feature requests and bug reports to internal tracking

### 4.2 Developer Blog & Content

**Goal**: Technical content that establishes DoppelDown as thought leaders in brand protection automation.

#### Content Calendar (Monthly)

| Week | Content Type | Example |
|------|-------------|---------|
| 1 | **Tutorial** | "Building a Slack Bot That Alerts on New Threats in 50 Lines" |
| 2 | **Deep Dive** | "How We Score Typosquat Domains: The Algorithm Explained" |
| 3 | **Integration Guide** | "Connecting DoppelDown to Microsoft Sentinel for SOC Teams" |
| 4 | **Changelog Roundup** | "What's New: February 2026 — Bulk Scans, Python SDK, and More" |

#### Content Themes

- **"Build With DoppelDown"** — step-by-step integration tutorials
- **"Under the Hood"** — how DoppelDown's detection algorithms work
- **"Security Engineering"** — brand protection best practices (SEO play)
- **"Community Spotlight"** — featuring integrations built by users

### 4.3 Integration Marketplace (V1)

**Goal**: Curated directory of pre-built integrations and templates.

```
doppeldown.com/integrations/
├── 🔔 Slack Notifications       [Install Guide] [Source]
├── 📧 PagerDuty Alerts          [Install Guide] [Source]
├── 📊 Splunk SIEM Integration   [Install Guide] [Source]
├── 🤖 n8n Workflow Templates    [Install Guide] [Source]
├── ⚡ Zapier Integration         [Install Guide]
├── 🐙 GitHub Actions            [Install Guide] [Source]
├── 📋 Jira Ticket Creation      [Install Guide] [Source]
└── 📈 Datadog Monitoring        [Install Guide] [Source]
```

Start with 3–4 first-party integrations as templates, then encourage community contributions.

### 4.4 Open Source Strategy

**Goal**: Build trust and community through strategic open-sourcing.

| Component | Open Source? | Rationale |
|-----------|-------------|-----------|
| TypeScript SDK | ✅ MIT | Standard — SDKs should always be open |
| Python SDK | ✅ MIT | Standard |
| CLI | ✅ MIT | Standard |
| Integration templates | ✅ MIT | Encourages contributions |
| Documentation site content | ✅ CC-BY | Allows community PRs to docs |
| Core scanning engine | ❌ Proprietary | Core competitive advantage |
| ML threat detection | ❌ Proprietary | Core competitive advantage |
| Dashboard UI | ❌ Proprietary | Core product |

---

## Phase 5: Advanced DevX & Feedback Loops (Weeks 25–32)

### 5.1 Developer Feedback Infrastructure

**Goal**: Systematic collection and action on developer feedback.

#### Feedback Touchpoints

```
┌─────────────────────────────────────────────────────────────┐
│                    FEEDBACK COLLECTION                        │
│                                                               │
│  📖 Docs Pages     → "Was this helpful?" (👍/👎 + comment)  │
│  🔧 API Errors     → Link to relevant docs in error body    │
│  💬 Discord        → Auto-tag feedback themes                │
│  📊 NPS Survey     → Quarterly email survey                  │
│  🐛 GitHub Issues  → Bug reports + feature requests          │
│  📈 Analytics      → Search queries, 404s, drop-offs        │
│  🔍 API Logs       → Error rate patterns, common mistakes    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    FEEDBACK PROCESSING                        │
│                                                               │
│  1. Auto-categorize (docs, SDK, API, billing, feature req)  │
│  2. Sentiment analysis (positive, neutral, negative)         │
│  3. Prioritize by frequency × impact                         │
│  4. Route to owner (docs → DevRel, SDK → eng, API → eng)    │
│  5. Close the loop (respond, fix, announce)                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    FEEDBACK ACTION                            │
│                                                               │
│  Weekly: Triage new feedback, update docs for common Qs      │
│  Monthly: Developer survey + NPS measurement                 │
│  Quarterly: DevX roadmap review based on feedback themes     │
│  Yearly: Major "Developer Experience Report" blog post       │
└─────────────────────────────────────────────────────────────┘
```

#### In-Docs Feedback Widget

Every documentation page gets a feedback footer:

```
┌──────────────────────────────────────────────────────────────┐
│ Was this page helpful?                                        │
│                                                                │
│ [👍 Yes]  [👎 No]                                             │
│                                                                │
│ (if No): What was missing or confusing?                       │
│ ┌────────────────────────────────────────────────────────┐   │
│ │                                                         │   │
│ └────────────────────────────────────────────────────────┘   │
│ [Submit Feedback]                                             │
└──────────────────────────────────────────────────────────────┘
```

### 5.2 Developer Analytics Dashboard (Internal)

**Goal**: Understand how developers use DoppelDown's API and where they get stuck.

#### Key Metrics to Track

```
Developer Journey Funnel:
───────────────────────────────────────────────────
Docs visit                          │ 1,000/week
  → Sign up                         │   200  (20%)
  → First API call                  │   120  (12%)
  → First successful scan           │    80   (8%)
  → Webhook configured              │    40   (4%)
  → Paid conversion                 │    20   (2%)
───────────────────────────────────────────────────

API Health:
  • Error rate by endpoint
  • P95 latency by endpoint
  • Most common error codes
  • Rate limit hit frequency

Documentation:
  • Most/least visited pages
  • Average time on page
  • Search queries with no results
  • "Not helpful" feedback by page
  • Drop-off points in Quick Start guide

SDK:
  • npm/PyPI download counts
  • SDK version distribution
  • Most used methods
  • Error patterns
```

### 5.3 Automated Onboarding Sequences

**Goal**: Guide new API users through their first successful integration.

#### Email Drip Sequence (API Users Only)

| Day | Email | Content |
|-----|-------|---------|
| 0 | **Welcome to DoppelDown API** | API key, Quick Start link, sandbox mode explanation |
| 1 | **Your First Scan in 3 Minutes** | Step-by-step with copy-paste code |
| 3 | **Set Up Real-Time Alerts** | Webhook integration guide |
| 7 | **Going to Production** | Best practices, rate limits, error handling |
| 14 | **How's It Going?** | NPS survey, link to community |
| 30 | **Advanced Patterns** | CI/CD integration, multi-brand management |

#### In-Dashboard API Onboarding Checklist

```
┌─ API Setup Checklist ──────────────────────────────────────┐
│                                                              │
│  ✅ Created an API key                                      │
│  ✅ Made your first API call                                │
│  ⬜ Created a brand via API                                  │
│  ⬜ Completed your first scan                                │
│  ⬜ Configured webhooks                                      │
│  ⬜ Generated a takedown report                              │
│                                                              │
│  Progress: 2/6 steps complete                                │
│                                                              │
│  💡 Next: Create a brand using the API                      │
│  curl -X POST .../api/brands ...           [Copy Command]   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 5.4 API Versioning Strategy

**Goal**: Ship improvements without breaking existing integrations.

#### Approach: URL-Path Versioning

```
https://doppeldown.com/api/v1/brands     ← Current (v1 is implicit today)
https://doppeldown.com/api/v2/brands     ← Future version
```

#### Versioning Rules

- **Non-breaking changes** (additive fields, new endpoints): No version bump
- **Breaking changes** (field removal, type changes, behavior changes): New version
- **Deprecation window**: Minimum 6 months with deprecation warnings in response headers
- **Sunset header**: `Sunset: Sat, 01 Aug 2027 00:00:00 GMT` on deprecated versions

#### Deprecation Communication

```
HTTP/1.1 200 OK
Deprecation: true
Sunset: 2027-08-01
Link: <https://docs.doppeldown.com/migration/v1-to-v2>; rel="deprecation"
```

---

## Content Strategy

### Documentation Types Matrix

| Type | Audience | Format | Update Frequency | Owner |
|------|----------|--------|-------------------|-------|
| **API Reference** | All developers | Auto-gen from OpenAPI | Every release | Engineering |
| **Quick Start** | New users | Step-by-step guide | Quarterly review | DevRel |
| **Tutorials** | Intermediate | Long-form walkthrough | Monthly new | DevRel |
| **Guides** | Advanced | Concept + implementation | As needed | Engineering + DevRel |
| **SDK Docs** | SDK users | API reference + examples | Every SDK release | Engineering |
| **Changelog** | All | Release notes | Every release | Engineering |
| **Blog Posts** | Community | Technical articles | 4x/month | DevRel |
| **Video Tutorials** | Visual learners | 5–15 min videos | Monthly | DevRel |

### SEO-Optimized Content Opportunities

Target high-intent developer queries:

| Content | Target Keywords | Type |
|---------|----------------|------|
| "How to detect typosquatting domains" | brand protection API, typosquat detection | Tutorial + SEO landing |
| "Phishing takedown automation guide" | phishing takedown API, automated takedown | Tutorial |
| "Brand monitoring API comparison" | brand protection tool comparison | Comparison guide |
| "DMARC + brand monitoring setup" | dmarc brand monitoring, email security | Integration guide |
| "Webhook security best practices" | webhook signature verification, HMAC | Technical guide |

---

## Metrics & Success Criteria

### Key Performance Indicators

| Metric | Baseline (Today) | 3-Month Target | 6-Month Target | 12-Month Target |
|--------|------------------|----------------|----------------|-----------------|
| **Time to first API call** | ~15 min | <8 min | <5 min | <3 min |
| **API adoption rate** (% of users making API calls) | ~5% | 15% | 25% | 40% |
| **SDK downloads** (monthly) | 0 | 200 | 1,000 | 5,000 |
| **Docs page views** (monthly) | ~500 | 3,000 | 10,000 | 30,000 |
| **Developer NPS** | Unmeasured | 30 | 40 | 50+ |
| **Support tickets (how-to)** | ~20/month | -30% | -50% | -70% |
| **Community members** (Discord) | 0 | 50 | 200 | 500 |
| **Integration templates** | 0 | 4 | 8 | 15 |
| **API error rate** | ~3% | <2% | <1.5% | <1% |
| **Docs search success rate** | Unmeasured | 70% | 80% | 90% |

### Developer Journey Conversion Targets

```
Visit docs ──→ Sign up ──→ First API call ──→ Active user ──→ Paid
  100%          30%           60%              50%            25%

  Today:  100%  → 20%  → 40%  → 30%  → 15%
  Target: 100%  → 30%  → 60%  → 50%  → 25%
```

---

## Technical Architecture

### Docs Site Infrastructure

```
┌─────────────────┐     ┌───────────────────┐     ┌──────────────┐
│  docs.doppeldown │     │  doppeldown.com    │     │  api.doppel  │
│  .com (Mintlify) │     │  (Vercel/Next.js)  │     │  down.com    │
│                  │     │                    │     │  (API)       │
│  - API Reference │────▶│  - Dashboard       │────▶│              │
│  - Guides        │     │  - API docs page   │     │  - REST API  │
│  - SDK docs      │     │  - Swagger UI      │     │  - Webhooks  │
│  - Changelog     │     │  - Blog            │     │              │
│  - Search        │     │                    │     │              │
└────────┬────────┘     └────────┬───────────┘     └──────┬───────┘
         │                       │                         │
         ▼                       ▼                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Analytics & Feedback                          │
│  - Mintlify Analytics (docs engagement)                          │
│  - Vercel Analytics (dashboard + conversion)                     │
│  - API metrics (Prometheus/Grafana — already built)              │
│  - Feedback widgets → internal Supabase table                    │
│  - NPS surveys → email tool                                      │
└─────────────────────────────────────────────────────────────────┘
```

### SDK Build Pipeline

```
openapi.yaml
     │
     ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Type Generation  │────▶│  SDK Source       │────▶│  Published   │
│  (openapi-ts)     │     │  (hand-written    │     │  Packages    │
│                   │     │   + generated)    │     │              │
│  types.ts         │     │  @doppeldown/sdk  │     │  npm         │
│  types.py         │     │  doppeldown (py)  │     │  PyPI        │
└──────────────────┘     └──────────────────┘     └──────────────┘
                                │
                                ▼
                    ┌──────────────────┐
                    │  CI/CD Tests     │
                    │  - Unit tests    │
                    │  - Integration   │
                    │  - E2E (sandbox) │
                    └──────────────────┘
```

---

## Competitive DevX Benchmarks

### How DoppelDown Compares to "Stripe-Tier" DevX

| DevX Element | Stripe | Twilio | DoppelDown (Today) | DoppelDown (Target) |
|-------------|--------|--------|-------------------|-------------------|
| Dedicated docs site | ✅ | ✅ | ❌ (markdown + in-app) | ✅ Phase 1 |
| Interactive API explorer | ✅ | ✅ | ⚠️ (Swagger only) | ✅ Phase 1 |
| Official SDKs (JS + Python) | ✅ (7 languages) | ✅ (7 languages) | ❌ | ✅ Phase 3 |
| CLI tool | ✅ | ✅ | ❌ | ✅ Phase 3 |
| Sandbox/test mode | ✅ | ✅ | ❌ | ✅ Phase 2 |
| Dedicated API keys | ✅ | ✅ | ❌ | ✅ Phase 1 |
| Webhook testing UI | ✅ | ✅ | ❌ | ✅ Phase 2 |
| Changelog/RSS | ✅ | ✅ | ⚠️ (markdown only) | ✅ Phase 1 |
| Developer community | ✅ | ✅ | ❌ | ✅ Phase 4 |
| Status page | ✅ | ✅ | ❌ | ✅ Phase 2 |
| Code examples in docs | ✅ | ✅ | ✅ | ✅ Already good |
| Error messages with fix hints | ✅ | ⚠️ | ⚠️ | ✅ Phase 2 |
| Onboarding email sequence | ✅ | ✅ | ❌ | ✅ Phase 5 |

### Brand Protection Competitor DevX

| Competitor | API Docs | SDKs | Self-Serve | Free Tier | Developer Focus |
|-----------|---------|------|-----------|-----------|----------------|
| **BrandShield** | ❌ None public | ❌ | ❌ (Contact sales) | ❌ | None |
| **Bolster.ai** | ⚠️ Basic | ❌ | ❌ (Contact sales) | ❌ | Minimal |
| **PhishLabs** | ⚠️ Internal only | ❌ | ❌ (Enterprise only) | ❌ | None |
| **ZeroFox** | ⚠️ Portal docs | ⚠️ | ❌ (Contact sales) | ❌ | Low |
| **DoppelDown** | ✅ Strong | 🔜 Coming | ✅ Self-serve | ✅ Free tier | **High (target)** |

**This is a massive competitive moat.** No brand protection competitor has developer-grade documentation or self-serve API access. DoppelDown can own this space.

---

## Budget & Resource Estimates

### Phase-by-Phase Cost Breakdown

| Phase | Duration | Engineering Hours | External Cost | Total Estimate |
|-------|----------|------------------|---------------|----------------|
| **P1: Docs Foundation** | 4 weeks | 80h | Mintlify: $150/mo | ~$6,500 |
| **P2: Interactive Tools** | 6 weeks | 120h | Hosting: ~$50/mo | ~$7,200 |
| **P3: SDKs & CLI** | 6 weeks | 160h | npm/PyPI: free | ~$9,600 |
| **P4: Community** | 8 weeks | 60h | Discord: free, Tooling: ~$50/mo | ~$4,000 |
| **P5: Advanced DevX** | 8 weeks | 100h | Survey tools: ~$30/mo | ~$6,200 |
| **Total** | 32 weeks | 520h | ~$300/mo ongoing | ~$33,500 |

*Engineering hours valued at ~$60/hr (solo founder opportunity cost).*

### Priority vs. Impact Matrix

```
                        HIGH IMPACT
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        │  P1: Docs Site    │  P3: SDKs         │
        │  P1: API Keys     │  P3: CLI          │
        │  P2: Sandbox      │  P4: Community    │
LOW     │                   │                   │  HIGH
EFFORT ─┼───────────────────┼───────────────────┼─ EFFORT
        │                   │                   │
        │  P2: Webhook Test │  P5: Analytics    │
        │  P1: Changelog    │  P4: Marketplace  │
        │                   │  P5: Versioning   │
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                       LOW IMPACT
```

**Recommended execution order** (maximizing ROI):
1. Docs site + API keys (highest impact, medium effort — unblocks everything)
2. Sandbox mode + webhook testing (enables safe experimentation)
3. TypeScript SDK (biggest developer audience)
4. Python SDK + CLI (expand reach)
5. Community + feedback loops (compound over time)

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| **Docs site maintenance burden** | Medium | Medium | Use OpenAPI as single source of truth; auto-generate where possible |
| **SDK breaks on API changes** | Medium | High | Generated types from OpenAPI; integration tests in CI; semantic versioning |
| **Low community engagement** | Medium | Low | Start small (Discord only); seed with quality content; personally respond to early members |
| **Sandbox mode abuse** | Low | Medium | Rate limit sandbox; no real scanning; monitor usage patterns |
| **DevX investment doesn't convert to revenue** | Low | High | Track conversion funnel religiously; A/B test docs changes; focus on paths that lead to paid features |
| **Maintaining multiple SDKs** | Medium | Medium | Generate from OpenAPI; keep thin (wrapper, not abstraction); community SDKs for niche languages |

---

## Appendix: Implementation Details

### A1: Mintlify Configuration

```json
// mint.json
{
  "name": "DoppelDown",
  "logo": {
    "light": "/logo/light.svg",
    "dark": "/logo/dark.svg"
  },
  "favicon": "/favicon.svg",
  "colors": {
    "primary": "#3B82F6",
    "light": "#60A5FA",
    "dark": "#2563EB"
  },
  "topbarLinks": [
    { "name": "Dashboard", "url": "https://doppeldown.com/dashboard" },
    { "name": "Status", "url": "https://status.doppeldown.com" }
  ],
  "topbarCtaButton": {
    "name": "Sign Up Free",
    "url": "https://doppeldown.com/auth/signup"
  },
  "tabs": [
    { "name": "API Reference", "url": "api-reference" },
    { "name": "SDKs", "url": "sdks" },
    { "name": "Guides", "url": "guides" }
  ],
  "navigation": [
    {
      "group": "Getting Started",
      "pages": [
        "introduction",
        "quickstart",
        "authentication",
        "core-concepts"
      ]
    },
    {
      "group": "API Reference",
      "pages": [
        "api-reference/overview",
        {
          "group": "Brands",
          "pages": [
            "api-reference/brands/list",
            "api-reference/brands/create",
            "api-reference/brands/update",
            "api-reference/brands/upload-logo",
            "api-reference/brands/delete-logo"
          ]
        },
        {
          "group": "Scans",
          "pages": [
            "api-reference/scans/start",
            "api-reference/scans/status",
            "api-reference/scans/cancel",
            "api-reference/scans/quota",
            "api-reference/scans/social",
            "api-reference/scans/delete"
          ]
        }
      ]
    }
  ],
  "openapi": "openapi.yaml",
  "api": {
    "baseUrl": "https://doppeldown.com/api",
    "auth": {
      "method": "bearer"
    },
    "playground": {
      "mode": "simple"
    }
  },
  "feedback": {
    "thumbsRating": true,
    "suggestEdit": true
  },
  "analytics": {
    "posthog": {
      "apiKey": "phc_..."
    }
  }
}
```

### A2: API Key Database Schema

```sql
-- api_keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Default',
  key_prefix TEXT NOT NULL,          -- First 12 chars: "dd_live_k1a2" or "dd_test_x9y8"
  key_hash TEXT NOT NULL,            -- bcrypt hash of full key
  mode TEXT NOT NULL CHECK (mode IN ('live', 'test')),
  scopes TEXT[] DEFAULT '{}',       -- Future: granular permissions
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,           -- Optional expiry
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_prefix UNIQUE (key_prefix)
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Users can only see their own keys
CREATE POLICY "Users manage own API keys" ON api_keys
  FOR ALL USING (auth.uid() = user_id);

-- Index for key lookup (auth middleware)
CREATE INDEX idx_api_keys_prefix ON api_keys(key_prefix) WHERE revoked_at IS NULL;

-- API key usage log (for analytics)
CREATE TABLE api_key_usage (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INT NOT NULL,
  response_time_ms INT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Partition by month for performance
-- CREATE INDEX idx_api_key_usage_created ON api_key_usage(created_at);
```

### A3: SDK Scaffold — TypeScript

```typescript
// packages/sdk/src/index.ts
export { DoppelDown } from './client';
export type { DoppelDownConfig } from './client';
export { DoppelDownError, RateLimitError, QuotaExceededError, ValidationError } from './errors';
export type * from './types';

// packages/sdk/src/client.ts
import { BrandsResource } from './resources/brands';
import { ScansResource } from './resources/scans';
import { ThreatsResource } from './resources/threats';
import { EvidenceResource } from './resources/evidence';
import { ReportsResource } from './resources/reports';
import { NotificationsResource } from './resources/notifications';
import type { DoppelDownConfig } from './types';

export class DoppelDown {
  readonly brands: BrandsResource;
  readonly scans: ScansResource;
  readonly threats: ThreatsResource;
  readonly evidence: EvidenceResource;
  readonly reports: ReportsResource;
  readonly notifications: NotificationsResource;

  constructor(config: DoppelDownConfig) {
    const httpClient = new HttpClient(config);
    this.brands = new BrandsResource(httpClient);
    this.scans = new ScansResource(httpClient);
    this.threats = new ThreatsResource(httpClient);
    this.evidence = new EvidenceResource(httpClient);
    this.reports = new ReportsResource(httpClient);
    this.notifications = new NotificationsResource(httpClient);
  }
}
```

### A4: Example Repository Structure

```
github.com/doppeldown/examples/
├── README.md
├── typescript/
│   ├── basic-scan/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/index.ts
│   │   └── README.md
│   ├── webhook-handler/
│   │   ├── package.json
│   │   ├── src/server.ts
│   │   └── README.md
│   ├── continuous-monitoring/
│   │   ├── package.json
│   │   ├── src/monitor.ts
│   │   └── README.md
│   └── slack-bot/
│       ├── package.json
│       ├── src/bot.ts
│       └── README.md
├── python/
│   ├── basic-scan/
│   │   ├── requirements.txt
│   │   ├── main.py
│   │   └── README.md
│   ├── webhook-handler/
│   │   ├── requirements.txt
│   │   ├── app.py
│   │   └── README.md
│   └── splunk-integration/
│       ├── requirements.txt
│       ├── main.py
│       └── README.md
├── curl/
│   ├── full-workflow.sh
│   ├── scan-and-report.sh
│   └── test-all.sh
└── integrations/
    ├── github-actions/
    │   ├── action.yml
    │   └── README.md
    ├── n8n/
    │   ├── workflow.json
    │   └── README.md
    └── zapier/
        └── README.md
```

### A5: Status Page Setup

Use **Betteruptime** (free tier) or **Instatus** ($10/mo):

```
status.doppeldown.com

╔══════════════════════════════════════════════════╗
║  DoppelDown System Status                         ║
║                                                    ║
║  All Systems Operational                ✅         ║
║                                                    ║
║  ──────────────────────────────────────────────   ║
║                                                    ║
║  API (doppeldown.com/api)          ● Operational  ║
║  Dashboard (doppeldown.com)        ● Operational  ║
║  Scan Worker                       ● Operational  ║
║  Webhooks                          ● Operational  ║
║  Database                          ● Operational  ║
║                                                    ║
║  ──────────────────────────────────────────────   ║
║                                                    ║
║  90-day uptime: 99.95%                             ║
║  Subscribe to updates: RSS | Email | Slack         ║
╚══════════════════════════════════════════════════╝
```

---

## Summary: The 30-Second Pitch

DoppelDown has something no brand protection competitor has: **a developer-friendly API with transparent pricing and self-serve access.** The documentation foundation is already strong. This strategy turns that foundation into a developer experience that:

1. **Attracts** technical evaluators with a beautiful docs site and instant "Try It" experience
2. **Converts** them with a <5-minute path to first scan via official SDKs
3. **Retains** them with sandbox testing, reliable SDKs, and responsive community support
4. **Expands** their usage through integration guides, CLI tools, and multi-brand patterns
5. **Amplifies** the product through a community that builds and shares integrations

The competitive moat this creates is deep: once a developer has integrated DoppelDown via SDK, configured webhooks to their SIEM, and built automation around the API, switching costs are enormous. **DevX isn't a nice-to-have — it's the growth engine.**

---

*This strategy document should be reviewed quarterly and updated based on developer feedback, usage analytics, and competitive developments.*
