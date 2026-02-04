# DoppelDown Performance Monitoring & Error Tracking

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                         │
│  ┌───────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ ErrorInit  │  │  WebVitals   │  │   ErrorBoundary (React)  │ │
│  │ (global    │  │  (CWV data)  │  │   + SectionErrorBoundary │ │
│  │  handlers) │  │              │  │                          │ │
│  └──────┬─────┘  └──────┬───────┘  └────────────┬─────────────┘ │
│         │               │                       │               │
│         ▼               ▼                       ▼               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              error-tracking.ts (client buffer)           │   │
│  │  • Breadcrumbs • Fetch instrumentation • Navigation log  │   │
│  └──────────────────────────┬───────────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────────┘
                              │ POST /api/monitoring/vitals
                              │ (buffered & batched)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Server (Node.js)                         │
│                                                                 │
│  ┌───────────────────────┐    ┌──────────────────────────────┐  │
│  │  Structured Logger    │    │   Performance Monitor        │  │
│  │  • JSON output (prod) │    │   • Request duration (P50+)  │  │
│  │  • Correlation IDs    │    │   • Error rate tracking      │  │
│  │  • Sampling           │    │   • Slow request detection   │  │
│  │  • Redaction          │    │   • Throughput monitoring     │  │
│  │  • External shipping  │    │                              │  │
│  └──────────┬────────────┘    └──────────────┬───────────────┘  │
│             │                                │                  │
│  ┌──────────┴────────────┐    ┌──────────────┴───────────────┐  │
│  │  DB Monitor           │    │   Anomaly Detector           │  │
│  │  • Query timing       │    │   • Z-score anomalies        │  │
│  │  • Slow query log     │    │   • Threshold alerts         │  │
│  │  • Error tracking     │    │   • Rate-of-change detection │  │
│  └───────────────────────┘    └──────────────┬───────────────┘  │
│                                              │                  │
│                                   ┌──────────┴───────────────┐  │
│                                   │   Alert Manager          │  │
│                                   │   • Webhook (Slack/etc)  │  │
│                                   │   • Email (critical)     │  │
│                                   │   • Deduplication        │  │
│                                   │   • Rate limiting        │  │
│                                   └──────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Metrics (Prometheus-compatible)               │  │
│  │  GET /api/metrics         GET /api/monitoring             │  │
│  │  (Prometheus scrape)      (Dashboard JSON/text)           │  │
│  │                           GET /api/health                 │  │
│  │                           (Load balancer checks)          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Environment Variables

Add these to your `.env.local`:

```bash
# Minimum viable monitoring
LOG_LEVEL=info
METRICS_API_TOKEN=<openssl rand -hex 32>

# Alerting (optional but recommended)
ALERT_WEBHOOK_URL=https://hooks.slack.com/services/...
ALERT_EMAIL=ops@doppeldown.com

# External log shipping (optional)
LOG_ENDPOINT_URL=https://in.logtail.com
LOG_ENDPOINT_TOKEN=your_logtail_token
```

### 2. Initialization

The monitoring system auto-initializes via Next.js instrumentation (`src/instrumentation.ts`). No manual setup needed.

### 3. Verify

```bash
# Health check
curl http://localhost:3000/api/health

# Detailed health
curl http://localhost:3000/api/health?detailed=true

# Monitoring dashboard
curl -H "Authorization: Bearer $METRICS_API_TOKEN" \
  http://localhost:3000/api/monitoring

# Human-readable
curl -H "Authorization: Bearer $METRICS_API_TOKEN" \
  "http://localhost:3000/api/monitoring?format=text"

# Prometheus metrics
curl -H "Authorization: Bearer $METRICS_API_TOKEN" \
  http://localhost:3000/api/metrics
```

## Components

### 1. Structured Logger (`src/lib/monitoring/structured-logger.ts`)

Production-grade logging with JSON output, correlation IDs, and sampling.

```typescript
import { structuredLogger, createCorrelatedLogger } from '@/lib/monitoring'

// Basic usage
structuredLogger.info('User signed up', { userId: 'abc', plan: 'starter' })
structuredLogger.error('Payment failed', paymentError, { userId: 'abc' })

// In API routes — auto-correlates with request ID
export async function GET(request: Request) {
  const log = createCorrelatedLogger(request, 'brands-api')
  log.info('Fetching brands')
  // All logs from this handler share the same requestId
}

// Timer utility
const timer = structuredLogger.startTimer('openai-analysis')
await analyzeWithAI(data)
timer.end({ model: 'gpt-4', tokens: 150 })

// Child loggers with inherited context
const scanLog = structuredLogger.child({
  component: 'scanner',
  context: { scanId: 'scan_123' }
})
scanLog.info('Starting domain scan')
```

**Production JSON output:**
```json
{
  "timestamp": "2026-02-05T10:30:00.000Z",
  "level": "error",
  "message": "Payment processing failed",
  "service": "doppeldown",
  "environment": "production",
  "version": "1.2.0",
  "hostname": "doppeldown-prod-abc123",
  "component": "stripe-webhook",
  "correlation": {
    "requestId": "req_abc123",
    "route": "/api/stripe/webhook",
    "method": "POST"
  },
  "error": {
    "name": "StripeError",
    "message": "Card declined",
    "code": "card_declined"
  }
}
```

**Features:**
- **Sampling**: Debug logs sampled at 1% in production, info at 10%. Errors always logged.
- **Sensitive data redaction**: Passwords, tokens, API keys automatically replaced with `[REDACTED]`.
- **External shipping**: Logs buffered and shipped to configured endpoint (Datadog, Logtail, etc.).
- **Correlation IDs**: Every request gets a unique ID that flows through all log entries.

### 2. Performance Monitor (`src/lib/monitoring/performance-monitor.ts`)

Server-side request performance tracking.

```typescript
import { withPerformanceTracking } from '@/lib/monitoring'

// Wrap your API route handler
export const GET = withPerformanceTracking('/api/brands', async (request, context) => {
  // Your handler code
  return NextResponse.json({ brands })
})
```

**Automatically tracks:**
- Request duration (P50, P95, P99)
- Error rate per endpoint
- Requests per minute throughput
- Slow request detection (configurable threshold)
- Server-Timing headers for DevTools

### 3. Database Monitor (`src/lib/monitoring/db-monitor.ts`)

Supabase query performance tracking.

```typescript
import { dbMonitor, monitoredQuery } from '@/lib/monitoring/db-monitor'

// Option A: Manual timer
const timer = dbMonitor.startQuery('select', 'brands')
const { data, error } = await supabase.from('brands').select('*')
timer.end(error)

// Option B: Wrapper function
const { data, error } = await monitoredQuery('select', 'brands', () =>
  supabase.from('brands').select('*').eq('user_id', userId)
)
```

**Tracks per table:**
- Query count and average duration
- Slow query detection and logging
- Error rate and recent errors
- Max query duration

### 4. Anomaly Detector (`src/lib/monitoring/anomaly-detector.ts`)

Statistical anomaly detection for proactive issue identification.

**Pre-configured rules (registered in `init.ts`):**
| Metric | Mode | Warning | Critical |
|--------|------|---------|----------|
| API error rate | Z-score | 2.0σ | 3.0σ |
| P95 latency | Absolute | 3000ms | 10000ms |
| Memory usage | Absolute | 400MB | 700MB |
| LCP | Absolute | 4000ms | 8000ms |
| CLS | Absolute | 0.25 | 0.50 |
| INP | Absolute | 500ms | 1000ms |

**Custom rules:**
```typescript
import { anomalyDetector } from '@/lib/monitoring'

// Register a custom metric
anomalyDetector.registerMetric('scan_queue_depth', {
  windowMs: 300_000,
  thresholds: { warning: 50, critical: 200 },
  mode: 'absolute',
})

// Push data points
anomalyDetector.recordValue('scan_queue_depth', currentQueueDepth)
```

### 5. Alert Manager (`src/lib/monitoring/alert-manager.ts`)

Multi-channel alert delivery with deduplication.

**Severity-based routing:**
| Severity | Console | Webhook | Email |
|----------|---------|---------|-------|
| Info | ✅ | - | - |
| Warning | ✅ | ✅ | - |
| Critical | ✅ | ✅ | ✅ |

**Features:**
- **Deduplication**: Same alert won't fire again within cooldown period (default: 5 minutes)
- **Rate limiting**: Max 30 alerts per hour to prevent notification storms
- **Auto-resolution**: Alerts resolve when metrics return to normal
- **Slack/Discord compatible**: Webhook format works with both platforms

### 6. Error Boundaries (React)

**Three layers of error catching:**

1. **`ErrorBoundary`** (`src/components/error-boundary.tsx`): Wraps entire app in root layout. Catches catastrophic render errors.

2. **`SectionErrorBoundary`**: Wraps individual dashboard sections. Isolates failures so the rest of the page works.

3. **`error.tsx`** (Next.js): Global error page for route-level errors. Shows user-friendly error with support contact.

All boundaries:
- Log to structured logger
- Report to error tracking service
- Show user-friendly fallback UI
- Support "Try Again" recovery

### 7. Client-Side Error Tracking

Initialized by `<ErrorInit />` in root layout:
- Unhandled error catching (`window.onerror`)
- Promise rejection tracking
- Navigation breadcrumbs (history API)
- Fetch request/response breadcrumbs
- Buffered error reporting with batched flush

## API Endpoints

### `GET /api/health`
Basic health check for load balancers. Returns 200 or 503.

```bash
# Quick check
curl http://localhost:3000/api/health

# Detailed (includes DB, Redis, circuit breakers)
curl http://localhost:3000/api/health?detailed=true
```

### `GET /api/metrics`
Prometheus-compatible metrics. Requires `METRICS_API_TOKEN`.

### `GET /api/monitoring`
Full system health dashboard. Requires `MONITORING_API_TOKEN`.

| Parameter | Values | Description |
|-----------|--------|-------------|
| `section` | `performance`, `database`, `alerts`, `requests` | Specific section only |
| `format` | `json`, `text` | Output format |

### `POST /api/monitoring/vitals`
Client-side Web Vitals collection. No auth required (public endpoint for browsers).

### `GET /api/monitoring/vitals`
Aggregated Web Vitals summary. Requires auth.

## Proactive Issue Detection Strategy

### Tier 1: Immediate Detection (< 1 minute)
- **Error rate spikes**: Z-score analysis on rolling 5-minute windows
- **Circuit breaker trips**: Logged and alerted immediately
- **Fatal errors**: Tracked and flushed immediately via error-tracking
- **Health check failures**: Load balancer removes unhealthy instances

### Tier 2: Early Warning (1-5 minutes)
- **Latency degradation**: P95 threshold monitoring
- **Slow query accumulation**: DB monitor tracks trending slow queries
- **Memory creep**: RSS monitoring with absolute thresholds
- **Web Vitals degradation**: Client-side metrics aggregated server-side

### Tier 3: Trending Analysis (5-60 minutes)
- **Error rate trends**: Rate-of-change detection
- **Resource exhaustion**: Memory trend analysis
- **Traffic anomalies**: Request volume changes

### Response Playbook

| Alert | Severity | Automated Response | Manual Action |
|-------|----------|-------------------|---------------|
| Error rate > 10% | Critical | Circuit breaker opens | Check logs, investigate root cause |
| P95 > 3s | Warning | Log slow requests | Review slow endpoints, optimize queries |
| P95 > 10s | Critical | Alert on-call | Check for DB issues, scale resources |
| Memory > 400MB | Warning | Log warning | Review for memory leaks |
| Memory > 700MB | Critical | Alert on-call | Restart pod, investigate leak |
| Circuit open | Warning | Auto-fallback | Check downstream service |
| DB errors spike | Critical | Log details | Check Supabase status, connection pool |

## Grafana Integration

If using Grafana with Prometheus, scrape the `/api/metrics` endpoint:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'doppeldown'
    scrape_interval: 30s
    bearer_token: '<your METRICS_API_TOKEN>'
    static_configs:
      - targets: ['doppeldown.com']
    metrics_path: '/api/metrics'
```

### Recommended Dashboards

1. **Request Overview**: `doppeldown_http_request_duration_seconds` histogram
2. **Error Rates**: `doppeldown_api_errors_total` rate
3. **Business KPIs**: `doppeldown_scans_completed_total`, `doppeldown_threats_detected_total`
4. **Revenue**: `doppeldown_mrr_usd`, `doppeldown_active_subscriptions`

## Log Aggregation

### Logtail / Better Stack

```bash
LOG_ENDPOINT_URL=https://in.logtail.com
LOG_ENDPOINT_TOKEN=your_source_token
```

### Datadog

```bash
LOG_ENDPOINT_URL=https://http-intake.logs.datadoghq.com/api/v2/logs
LOG_ENDPOINT_TOKEN=your_dd_api_key
```

Logs are automatically shipped in JSON format with structured fields that map to Datadog facets.

## Performance Budgets

Defined in `src/lib/seo/performance.ts`:

| Resource | Budget |
|----------|--------|
| Total page size | 500KB |
| JavaScript | 200KB |
| CSS | 50KB |
| Total requests | 50 |
| FCP | 1800ms |
| LCP | 2500ms |
| TTI | 3800ms |

## File Reference

| File | Purpose |
|------|---------|
| `src/lib/monitoring/index.ts` | Centralized exports |
| `src/lib/monitoring/structured-logger.ts` | Production JSON logger |
| `src/lib/monitoring/performance-monitor.ts` | API request tracking |
| `src/lib/monitoring/db-monitor.ts` | Database query tracking |
| `src/lib/monitoring/anomaly-detector.ts` | Statistical anomaly detection |
| `src/lib/monitoring/alert-manager.ts` | Multi-channel alerting |
| `src/lib/monitoring/dashboard.ts` | Aggregated system snapshot |
| `src/lib/monitoring/init.ts` | Bootstrap + default rules |
| `src/instrumentation.ts` | Next.js auto-initialization |
| `src/lib/logger.ts` | Base logger (dev-friendly) |
| `src/lib/error-tracking.ts` | Error tracking with breadcrumbs |
| `src/lib/metrics.ts` | Prometheus metrics registry |
| `src/lib/errors.ts` | Error classes + API helpers |
| `src/lib/resilience.ts` | Retry + circuit breaker |
| `src/lib/client-errors.ts` | Client-side error utilities |
| `src/components/error-boundary.tsx` | React error boundaries |
| `src/components/error-init.tsx` | Client error tracking init |
| `src/components/seo/WebVitals.tsx` | Core Web Vitals reporter |
| `src/app/api/health/route.ts` | Health check endpoint |
| `src/app/api/metrics/route.ts` | Prometheus metrics endpoint |
| `src/app/api/monitoring/route.ts` | Monitoring dashboard API |
| `src/app/api/monitoring/vitals/route.ts` | Web Vitals collection |
| `src/app/error.tsx` | Global error page |
