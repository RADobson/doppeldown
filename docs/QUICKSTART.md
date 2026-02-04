# DoppelDown API — Quick Start Guide

> **Get from zero to your first threat scan in under 5 minutes.**

DoppelDown protects your brand by detecting typosquatting domains, phishing sites, fake social media accounts, and brand impersonation. This guide walks you through the essential API calls to start monitoring.

---

## Prerequisites

| What you need | Where to get it |
|---|---|
| DoppelDown account | [Sign up at doppeldown.com](https://doppeldown.com/auth/signup) |
| API access token | Dashboard → Settings → API Token (or use Supabase auth) |
| `curl`, Postman, or any HTTP client | Your terminal already has curl |

---

## Step 1: Authenticate

All API calls require a Bearer token. Get yours from the Supabase auth flow:

```bash
# Set your token as an environment variable for convenience
export DOPPELDOWN_TOKEN="your_supabase_access_token_here"
```

Every request uses this header:
```
Authorization: Bearer $DOPPELDOWN_TOKEN
```

> **💡 Tip:** If you're using the DoppelDown dashboard in a browser, authentication is handled automatically via session cookies — no token needed.

---

## Step 2: Create a Brand

Register the brand you want to protect. DoppelDown auto-normalizes domains — you can pass a full URL and it will extract the domain.

```bash
curl -X POST https://doppeldown.com/api/brands \
  -H "Authorization: Bearer $DOPPELDOWN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp",
    "domain": "acme.com",
    "keywords": ["acme", "acmecorp"],
    "social_handles": {
      "twitter": ["@acmecorp"],
      "instagram": ["acmecorp"]
    },
    "enabled_social_platforms": ["twitter", "instagram"]
  }'
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Acme Corp",
  "domain": "acme.com",
  "keywords": ["acme", "acmecorp"],
  "status": "active",
  "threat_count": 0,
  "created_at": "2026-02-05T00:00:00Z"
}
```

Save the `id` — you'll need it for scans.

```bash
export BRAND_ID="550e8400-e29b-41d4-a716-446655440000"
```

---

## Step 3: Run Your First Scan

Kick off a full security scan to check for typosquatting domains, phishing pages, and social media impersonation:

```bash
curl -X POST https://doppeldown.com/api/scan \
  -H "Authorization: Bearer $DOPPELDOWN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "brandId": "'$BRAND_ID'",
    "scanType": "full"
  }'
```

**Response:**
```json
{
  "message": "Scan queued",
  "scanId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "jobId": "job-uuid-here"
}
```

Save the `scanId`:
```bash
export SCAN_ID="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

---

## Step 4: Check Scan Progress

Scans run asynchronously. Poll for status:

```bash
curl -X GET "https://doppeldown.com/api/scan?id=$SCAN_ID" \
  -H "Authorization: Bearer $DOPPELDOWN_TOKEN"
```

**Response (while running):**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "running",
  "threats_found": 2,
  "domains_checked": 87,
  "pages_scanned": 12,
  "completed_at": null
}
```

**Response (completed):**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "completed",
  "threats_found": 5,
  "domains_checked": 150,
  "pages_scanned": 42,
  "completed_at": "2026-02-05T00:05:23Z"
}
```

> **📋 Polling best practice:** Poll every 5–10 seconds. A full scan typically takes 1–5 minutes depending on your tier's variation limit.

### Scan Status Values

| Status | Meaning |
|--------|---------|
| `pending` | Queued, waiting to start |
| `running` | Currently executing |
| `completed` | Finished — check `threats_found` |
| `failed` | Error occurred (see `error` field) |
| `cancelled` | Manually cancelled |

---

## Step 5: Review Threats

After the scan completes, list your brands to see updated threat counts:

```bash
curl -X GET https://doppeldown.com/api/brands \
  -H "Authorization: Bearer $DOPPELDOWN_TOKEN"
```

Each brand includes `threat_count` showing the number of active threats detected.

---

## Step 6: Generate a Takedown Report

Create a professional takedown report you can send to domain registrars or social platforms:

```bash
curl -X POST https://doppeldown.com/api/reports \
  -H "Authorization: Bearer $DOPPELDOWN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "brandId": "'$BRAND_ID'",
    "format": "html",
    "ownerName": "Acme Legal Team"
  }' \
  -o takedown-report.html
```

Available formats: `html`, `text`, `csv`, `json`

---

## What's Next?

| Guide | Description |
|-------|-------------|
| [Full API Reference](./API.md) | Complete endpoint documentation with all parameters |
| [Webhook Integration](./WEBHOOKS.md) | Get real-time notifications when threats are detected |
| [SDK Examples](./SDK_EXAMPLES.md) | Copy-paste code in JavaScript, Python, and cURL |
| [Error Handling](./ERROR_HANDLING.md) | Error codes, retry logic, and resilience patterns |

---

## Common Workflows

### Monitor multiple brands
```bash
# Create brands (up to your tier limit)
curl -X POST .../api/brands -d '{"name":"Brand A","domain":"brand-a.com"}'
curl -X POST .../api/brands -d '{"name":"Brand B","domain":"brand-b.com"}'

# Scan each one
curl -X POST .../api/scan -d '{"brandId":"brand-a-id"}'
curl -X POST .../api/scan -d '{"brandId":"brand-b-id"}'
```

### Quick domain-only scan
```bash
# Skip social/web scanning — just check domain typosquats
curl -X POST .../api/scan -d '{"brandId":"...","scanType":"domain_only"}'
```

### Check your scan quota (free tier)
```bash
curl -X GET https://doppeldown.com/api/scan/quota \
  -H "Authorization: Bearer $DOPPELDOWN_TOKEN"
```

```json
{
  "limit": 3,
  "used": 1,
  "remaining": 2,
  "resetsAt": 1707004800000,
  "isUnlimited": false
}
```

---

## Tier Limits at a Glance

| Feature | Free | Starter ($19/mo) | Professional ($49/mo) | Enterprise |
|---------|------|------|------|------|
| Brands | 1 | 3 | 10 | Unlimited |
| Domain variations/scan | 25 | 100 | 500 | 2,500 |
| Social platforms | 1 | 3 | 6 | All 8 |
| Automated scans | ❌ | Every 24h | Every 6h | Every 1h |
| Manual scans | 3/week | Unlimited | Unlimited | Unlimited |
| NRD monitoring | ❌ | ❌ | ❌ | ✅ |

---

## Need Help?

- **Email:** support@doppeldown.com
- **API Status:** `GET /api/health`
- **Full docs:** [docs/API.md](./API.md)
