# DoppelDown API Reference

> **Protect your brand from typosquatting, phishing, and impersonation.**

| | |
|---|---|
| **Base URL** | `https://doppeldown.com/api` |
| **Version** | 1.0 |
| **Authentication** | Bearer token or session cookie (see [Authentication](#authentication)) |
| **OpenAPI Spec** | [openapi.yaml](./openapi.yaml) • [Swagger UI](/api-docs/swagger) |
| **Quick Start** | [→ QUICKSTART.md](./QUICKSTART.md) — get your first scan running in 5 minutes |

---

## Related Guides

| Guide | Description |
|-------|-------------|
| [Quick Start](./QUICKSTART.md) | Zero to first scan in 5 minutes |
| [SDK Examples](./SDK_EXAMPLES.md) | Copy-paste code in JavaScript, Python, cURL |
| [Webhooks](./WEBHOOKS.md) | Real-time event notifications |
| [Error Handling](./ERROR_HANDLING.md) | Error classes, retry logic, resilience patterns |

---

## Table of Contents

- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Response Format](#response-format)
- [Brands](#brands)
  - [List Brands](#list-brands)
  - [Create Brand](#create-brand)
  - [Update Brand](#update-brand)
  - [Upload Brand Logo](#upload-brand-logo)
  - [Delete Brand Logo](#delete-brand-logo)
- [Scans](#scans)
  - [Start Scan](#start-scan)
  - [Get Scan Status](#get-scan-status)
  - [Cancel Scan](#cancel-scan)
  - [Get Scan Quota](#get-scan-quota)
  - [Start Social Scan](#start-social-scan)
  - [Delete Scan](#delete-scan)
- [Threats](#threats)
  - [Delete Threat](#delete-threat)
- [Evidence](#evidence)
  - [Sign Evidence URL](#sign-evidence-url)
- [Reports](#reports)
  - [Generate Report](#generate-report)
  - [List Reports](#list-reports)
  - [Delete Report](#delete-report)
- [Notifications](#notifications)
  - [Get Notifications](#get-notifications)
  - [Mark Notifications Read](#mark-notifications-read)
- [Billing (Stripe)](#billing-stripe)
  - [Create Checkout Session](#create-checkout-session)
  - [Create Portal Session](#create-portal-session)
  - [Stripe Webhook](#stripe-webhook)
- [Webhooks](#webhooks)
- [Admin](#admin)
  - [Get Audit Logs](#get-audit-logs)
- [Cron Jobs (Internal)](#cron-jobs-internal)
- [Tier Limits Reference](#tier-limits-reference)
- [Error Codes](#error-codes)
- [Health Check](#health-check)

---

## Authentication

DoppelDown uses **Supabase Auth**. There are two authentication methods:

### Session-Based (Browser)

When using the dashboard, authentication is handled automatically via Supabase session cookies set during login. No additional headers needed.

### Token-Based (API)

For programmatic access, include a Supabase access token:

```
Authorization: Bearer <supabase_access_token>
```

#### Obtaining a Token

1. Sign in via the Supabase Auth API or DoppelDown's login page
2. The Supabase client returns an `access_token` in the session object
3. Use this token in the `Authorization` header for all API calls

```typescript
// Example: getting a token with Supabase JS client
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const { data } = await supabase.auth.signInWithPassword({
  email: 'you@example.com',
  password: 'your-password',
})

const token = data.session.access_token
// Use: Authorization: Bearer <token>
```

### Cron Endpoints (Internal)

Cron endpoints authenticate with a shared secret:

```
Authorization: Bearer <CRON_SECRET>
```

### Common Auth Errors

| Status | Response | Meaning |
|--------|----------|---------|
| `401` | `{ "error": { "code": "UNAUTHORIZED" } }` | Missing or invalid session/token |
| `403` | `{ "error": { "code": "FORBIDDEN" } }` | Valid auth but insufficient permissions |

---

## Rate Limiting

API endpoints are rate-limited based on your subscription tier:

| Tier | Requests/min | Concurrent Scans |
|------|--------------|------------------|
| Free | 60 | 1 |
| Starter | 120 | 3 |
| Professional | 300 | 10 |
| Enterprise | Unlimited | Unlimited |

Rate limit headers are included in every response:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 57
X-RateLimit-Reset: 1707004860
```

When you exceed the limit, you'll receive a `429` response with a `Retry-After` header.

---

## Response Format

All API responses use a consistent envelope:

### Success Response

```json
{
  "success": true,
  "data": { "..." },
  "meta": {
    "timestamp": "2026-02-05T10:00:00Z",
    "requestId": "abc-123-def"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message",
    "details": { "fieldErrors": { "domain": ["Domain is required"] } }
  },
  "meta": {
    "timestamp": "2026-02-05T10:00:00Z",
    "requestId": "abc-123-def"
  }
}
```

> **Note:** Some endpoints (particularly older ones) may return a simpler `{ "error": "message" }` format. The structured format above is the canonical response shape.

---

## Brands

Brands represent the entities you're protecting. Each brand has a primary domain and optional social media handles.

### List Brands

Retrieve all brands owned by the authenticated user.

```http
GET /api/brands
```

**Response:** `200 OK`

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "user-uuid",
    "name": "Acme Corp",
    "domain": "acme.com",
    "keywords": ["acme", "acmecorp"],
    "social_handles": {
      "twitter": ["@acmecorp"],
      "instagram": ["acmecorp"]
    },
    "enabled_social_platforms": ["twitter", "instagram"],
    "logo_url": "https://storage.example.com/logo.png",
    "status": "active",
    "threat_count": 5,
    "created_at": "2026-01-15T00:00:00Z"
  }
]
```

<details>
<summary><strong>Examples</strong></summary>

**cURL:**
```bash
curl -X GET https://doppeldown.com/api/brands \
  -H "Authorization: Bearer $TOKEN"
```

**JavaScript:**
```javascript
const brands = await fetch('https://doppeldown.com/api/brands', {
  headers: { 'Authorization': `Bearer ${token}` },
}).then(r => r.json());
```

**Python:**
```python
brands = requests.get(
    'https://doppeldown.com/api/brands',
    headers={'Authorization': f'Bearer {token}'}
).json()
```
</details>

---

### Create Brand

Create a new brand to monitor. The domain is auto-normalized (strips protocol, `www`, and paths).

```http
POST /api/brands
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Brand display name (1–100 chars) |
| `domain` | string | ✅ | Primary domain — auto-normalized (e.g., `https://www.acme.com/about` → `acme.com`) |
| `keywords` | string[] | | Additional keywords to monitor (max 50, each max 50 chars) |
| `social_handles` | object | | Map of platform → handle arrays (e.g., `{ "twitter": ["@acme"] }`) |
| `enabled_social_platforms` | string[] | | Platforms to scan (see [available platforms](#available-social-platforms)) |

**Response:** `200 OK` — The created brand object.

**Errors:**

| Status | Code | When |
|--------|------|------|
| `400` | `MISSING_REQUIRED_FIELD` | Missing `name` or `domain` |
| `403` | `BRAND_LIMIT_REACHED` | You've hit your plan's brand limit |
| `403` | `PLATFORM_LIMIT_EXCEEDED` | Too many social platforms for your tier |
| `409` | `ALREADY_EXISTS` | A brand with this domain already exists |

<details>
<summary><strong>Examples</strong></summary>

**cURL — minimal:**
```bash
curl -X POST https://doppeldown.com/api/brands \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Acme Corp", "domain": "acme.com"}'
```

**cURL — full:**
```bash
curl -X POST https://doppeldown.com/api/brands \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp",
    "domain": "https://www.acme.com/about",
    "keywords": ["acme", "acmecorp"],
    "social_handles": { "twitter": ["@acmecorp"] },
    "enabled_social_platforms": ["twitter", "instagram"]
  }'
```

**JavaScript:**
```javascript
const brand = await fetch('https://doppeldown.com/api/brands', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Acme Corp',
    domain: 'acme.com',
    keywords: ['acme', 'acmecorp'],
    enabled_social_platforms: ['twitter', 'instagram'],
  }),
}).then(r => r.json());
```

**Python:**
```python
brand = requests.post(
    'https://doppeldown.com/api/brands',
    headers={'Authorization': f'Bearer {token}'},
    json={
        'name': 'Acme Corp',
        'domain': 'acme.com',
        'keywords': ['acme', 'acmecorp'],
        'enabled_social_platforms': ['twitter', 'instagram'],
    },
).json()
```
</details>

---

### Update Brand

Update an existing brand's details. Only provided fields are changed.

```http
PATCH /api/brands
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `brandId` | string | ✅ | Brand UUID to update |
| `name` | string | | New brand name |
| `domain` | string | | New primary domain |
| `keywords` | string[] | | Replacement keywords array |
| `social_handles` | object | | Social handles update |
| `enabled_social_platforms` | string[] | | Updated enabled platforms |
| `mode` | string | | `"merge"` (default) or `"replace"` for `social_handles` |

> **Merge vs Replace:** By default, new social handles are merged with existing ones. Set `mode: "replace"` to completely replace the social handles object.

**Response:** `200 OK` — The updated brand object.

**Errors:**

| Status | Code | When |
|--------|------|------|
| `400` | `INVALID_INPUT` | No updates provided |
| `403` | `PLATFORM_LIMIT_EXCEEDED` | Too many platforms for tier |
| `404` | `NOT_FOUND` | Brand not found or not owned by you |

<details>
<summary><strong>Examples</strong></summary>

**cURL:**
```bash
curl -X PATCH https://doppeldown.com/api/brands \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "brandId": "brand-uuid",
    "keywords": ["acme", "acmecorp", "acme-inc"],
    "enabled_social_platforms": ["twitter", "instagram", "linkedin"]
  }'
```

**JavaScript:**
```javascript
const updated = await fetch('https://doppeldown.com/api/brands', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    brandId: 'brand-uuid',
    keywords: ['acme', 'acmecorp', 'acme-inc'],
  }),
}).then(r => r.json());
```
</details>

---

### Upload Brand Logo

Upload a PNG logo for visual similarity detection during scans.

```http
POST /api/brands/logo
Content-Type: multipart/form-data
```

**Form Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `brandId` | string | ✅ | Brand UUID |
| `logo` | File | ✅ | PNG image file (max 5 MB) |

**Response:** `200 OK`

```json
{
  "logo_url": "https://supabase-storage-url/...",
  "storage_path": "brands/{brandId}/logo/{timestamp}-{uuid}-{filename}.png"
}
```

**Errors:**

| Status | When |
|--------|------|
| `400` | Missing brandId, missing file, file too large (>5 MB), or non-PNG format |
| `404` | Brand not found |

<details>
<summary><strong>Examples</strong></summary>

**cURL:**
```bash
curl -X POST https://doppeldown.com/api/brands/logo \
  -H "Authorization: Bearer $TOKEN" \
  -F "brandId=brand-uuid" \
  -F "logo=@/path/to/logo.png"
```

**Python:**
```python
with open('logo.png', 'rb') as f:
    resp = requests.post(
        'https://doppeldown.com/api/brands/logo',
        headers={'Authorization': f'Bearer {token}'},
        data={'brandId': 'brand-uuid'},
        files={'logo': ('logo.png', f, 'image/png')},
    )
```
</details>

---

### Delete Brand Logo

Remove a brand's logo.

```http
DELETE /api/brands/logo
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `brandId` | string | ✅ | Brand UUID |

**Response:** `200 OK` — `{ "success": true }`

<details>
<summary><strong>Examples</strong></summary>

**cURL:**
```bash
curl -X DELETE https://doppeldown.com/api/brands/logo \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"brandId": "brand-uuid"}'
```
</details>

---

## Scans

Scans detect threats by checking domain variations, web search results, and social media platforms.

### How Scans Work

1. **Queue:** You POST to start a scan → returns a `scanId`
2. **Execute:** The scan runs asynchronously (background worker)
3. **Poll:** Check status via GET until `status` is `completed` or `failed`
4. **Results:** Threats are stored and accessible via the Brands and Threats endpoints

### Scan Types

| Type | What it checks | Typical duration |
|------|----------------|-----------------|
| `full` | Domains + web pages + social media | 1–5 minutes |
| `quick` | Reduced domain variation set | 30s–1 minute |
| `domain_only` | Only typosquatting domain variations | 30s–2 minutes |
| `web_only` | Only web search for brand mentions | 30s–1 minute |
| `social_only` | Only social media platforms | 30s–2 minutes |

### Start Scan

Queue a new scan for a brand. Enforces manual scan quotas per tier.

```http
POST /api/scan
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `brandId` | string | ✅ | — | Brand UUID to scan |
| `scanType` | string | | `"full"` | One of: `full`, `quick`, `domain_only`, `web_only`, `social_only` |

**Response:** `200 OK`

```json
{
  "message": "Scan queued",
  "scanId": "a1b2c3d4-...",
  "jobId": "e5f6a7b8-..."
}
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| `400` | `MISSING_REQUIRED_FIELD` | Missing `brandId` |
| `404` | `NOT_FOUND` | Brand not found |
| `409` | `RESOURCE_CONFLICT` | Scan already queued or running for this brand |
| `429` | `QUOTA_EXCEEDED` | Manual scan quota exceeded |

> **Quota exceeded response** includes a `quota` object:
> ```json
> {
>   "error": { "code": "QUOTA_EXCEEDED", "details": {
>     "quota": { "limit": 3, "used": 3, "resetsAt": 1707004800000 }
>   }}
> }
> ```

<details>
<summary><strong>Examples</strong></summary>

**cURL:**
```bash
curl -X POST https://doppeldown.com/api/scan \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"brandId": "brand-uuid", "scanType": "full"}'
```

**JavaScript:**
```javascript
const { scanId } = await fetch('https://doppeldown.com/api/scan', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ brandId: 'brand-uuid', scanType: 'full' }),
}).then(r => r.json());
```

**Python:**
```python
scan = requests.post(
    'https://doppeldown.com/api/scan',
    headers={'Authorization': f'Bearer {token}'},
    json={'brandId': 'brand-uuid', 'scanType': 'full'},
).json()
scan_id = scan['scanId']
```
</details>

---

### Get Scan Status

Retrieve details and progress for a specific scan.

```http
GET /api/scan?id={scanId}
```

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Scan UUID |

**Response:** `200 OK`

```json
{
  "id": "scan-uuid",
  "brand_id": "brand-uuid",
  "scan_type": "full",
  "status": "running",
  "threats_found": 3,
  "domains_checked": 150,
  "pages_scanned": 42,
  "created_at": "2026-02-05T10:00:00Z",
  "completed_at": null,
  "error": null
}
```

### Scan Status Values

| Status | Meaning | Action |
|--------|---------|--------|
| `pending` | Queued, waiting to start | Keep polling |
| `running` | Currently executing | Keep polling (check `threats_found` for progress) |
| `completed` | Finished successfully | Review threats |
| `failed` | Error occurred | Check `error` field |
| `cancelled` | Manually cancelled | No action needed |

> **📋 Polling Best Practice:** Poll every 5–10 seconds. Stop when status is `completed`, `failed`, or `cancelled`. See [SDK Examples](./SDK_EXAMPLES.md#poll-scan-status) for ready-to-use polling functions.

<details>
<summary><strong>Examples</strong></summary>

**cURL:**
```bash
curl "https://doppeldown.com/api/scan?id=scan-uuid" \
  -H "Authorization: Bearer $TOKEN"
```

**JavaScript (with polling):**
```javascript
async function waitForScan(scanId) {
  while (true) {
    const scan = await fetch(`https://doppeldown.com/api/scan?id=${scanId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(r => r.json());

    if (['completed', 'failed', 'cancelled'].includes(scan.status)) {
      return scan;
    }
    await new Promise(r => setTimeout(r, 5000)); // 5s interval
  }
}
```
</details>

---

### Cancel Scan

Cancel a queued or running scan.

```http
POST /api/scan/cancel
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `scanId` | string | ✅ | Scan UUID to cancel |

**Response:** `200 OK`

```json
{ "message": "Scan cancelled", "scanId": "scan-uuid" }
```

> **Note:** In-flight operations may still complete before cancellation takes effect.

<details>
<summary><strong>Examples</strong></summary>

**cURL:**
```bash
curl -X POST https://doppeldown.com/api/scan/cancel \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"scanId": "scan-uuid"}'
```
</details>

---

### Get Scan Quota

Check the current user's manual scan quota.

```http
GET /api/scan/quota
```

**Response:** `200 OK`

**Free tier:**
```json
{
  "limit": 3,
  "used": 1,
  "remaining": 2,
  "resetsAt": 1707004800000,
  "isUnlimited": false
}
```

**Paid tier:**
```json
{
  "limit": null,
  "used": 0,
  "remaining": null,
  "resetsAt": null,
  "isUnlimited": true
}
```

| Field | Type | Description |
|-------|------|-------------|
| `limit` | number \| null | Maximum manual scans per period (null = unlimited) |
| `used` | number | Scans used in current period |
| `remaining` | number \| null | Scans remaining (null = unlimited) |
| `resetsAt` | number \| null | Unix timestamp (ms) when quota resets |
| `isUnlimited` | boolean | Whether the user has unlimited manual scans |

<details>
<summary><strong>Examples</strong></summary>

**cURL:**
```bash
curl https://doppeldown.com/api/scan/quota \
  -H "Authorization: Bearer $TOKEN"
```
</details>

---

### Start Social Scan

Queue a social-media-only scan for a brand.

```http
POST /api/scan/social
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `brandId` | string | ✅ | — | Brand UUID |
| `platforms` | string[] | | All enabled | Specific platforms to scan |

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Social scan queued",
  "scanId": "scan-uuid",
  "jobId": "job-uuid",
  "platforms": ["twitter", "instagram"]
}
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| `409` | `RESOURCE_CONFLICT` | Scan already running for this brand |

<details>
<summary><strong>Examples</strong></summary>

**cURL:**
```bash
curl -X POST https://doppeldown.com/api/scan/social \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "brandId": "brand-uuid",
    "platforms": ["twitter", "instagram", "tiktok"]
  }'
```
</details>

---

### Delete Scan

Permanently delete a scan and all associated threats and evidence files.

```http
DELETE /api/scans/{id}
```

**Path Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Scan UUID |

**Response:** `200 OK` — `{ "success": true }`

**⚠️ Side Effects:**
- Deletes all threats linked to this scan
- Removes evidence screenshots from storage (best-effort)
- Creates an audit log entry

<details>
<summary><strong>Examples</strong></summary>

**cURL:**
```bash
curl -X DELETE https://doppeldown.com/api/scans/scan-uuid \
  -H "Authorization: Bearer $TOKEN"
```
</details>

---

## Threats

Threats are detected security issues associated with a brand (typosquatting domains, phishing sites, fake social accounts, etc).

### Threat Types

| Type | Description |
|------|-------------|
| `typosquat_domain` | Domain that looks similar to your brand (e.g., `acme-corp.xyz`) |
| `lookalike_website` | Website visually similar to yours |
| `phishing_page` | Fake page designed to steal credentials |
| `fake_social_account` | Social media account impersonating your brand |
| `brand_impersonation` | Unauthorized use of your brand identity |
| `trademark_abuse` | Unauthorized use of your trademark |

### Threat Severity

Each threat gets a composite severity score based on:
- **Domain risk** — How similar the domain is, registration age, DNS configuration
- **Visual similarity** — Logo/screenshot comparison (optional, uses AI)
- **Phishing intent** — Form analysis, credential harvesting signals, suspicious elements

| Severity | Score Range | Action |
|----------|-------------|--------|
| `critical` | 80–100 | Immediate takedown recommended |
| `high` | 60–79 | Investigate and file takedown |
| `medium` | 40–59 | Monitor closely |
| `low` | 0–39 | Informational |

### Delete Threat

Permanently delete a threat and its evidence files.

```http
DELETE /api/threats/{id}
```

**Path Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Threat UUID |

**Response:** `200 OK` — `{ "success": true }`

**⚠️ Side Effects:**
- Removes evidence screenshots from storage (best-effort)
- Creates an audit log entry with threat metadata

<details>
<summary><strong>Examples</strong></summary>

**cURL:**
```bash
curl -X DELETE https://doppeldown.com/api/threats/threat-uuid \
  -H "Authorization: Bearer $TOKEN"
```

**JavaScript:**
```javascript
await fetch('https://doppeldown.com/api/threats/threat-uuid', {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` },
});
```
</details>

---

## Evidence

Evidence files (screenshots, HTML snapshots) are stored privately in Supabase Storage. Access them via time-limited signed URLs.

### Sign Evidence URL

Generate a time-limited signed URL for accessing evidence.

```http
POST /api/evidence/sign
GET  /api/evidence/sign?threatId={id}&kind={kind}&index={index}&expiresIn={seconds}
```

Both POST (body) and GET (query params) are supported.

**Parameters:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `threatId` | string | ✅ | — | Threat UUID |
| `kind` | string | | `"screenshot"` | Evidence type: `"screenshot"` or `"html"` |
| `index` | number | | `0` | 0-based index (if multiple evidence items) |
| `expiresIn` | number | | `3600` | URL TTL in seconds (min: 60, max: 86,400 = 24h) |

**Response:** `200 OK`

```json
{
  "signedUrl": "https://supabase-storage/...",
  "expiresIn": 3600,
  "bucket": "evidence",
  "path": "threats/{threatId}/screenshot-0.png"
}
```

<details>
<summary><strong>Examples</strong></summary>

**cURL (POST):**
```bash
curl -X POST https://doppeldown.com/api/evidence/sign \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"threatId": "threat-uuid", "kind": "screenshot", "expiresIn": 7200}'
```

**cURL (GET):**
```bash
curl "https://doppeldown.com/api/evidence/sign?threatId=threat-uuid&kind=screenshot" \
  -H "Authorization: Bearer $TOKEN"
```

**JavaScript:**
```javascript
const { signedUrl } = await fetch('https://doppeldown.com/api/evidence/sign', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    threatId: 'threat-uuid',
    kind: 'screenshot',
    expiresIn: 7200,
  }),
}).then(r => r.json());

// Open in browser or download
window.open(signedUrl);
```
</details>

---

## Reports

Generate professional takedown reports ready to send to domain registrars, hosting providers, and social media platforms.

### Generate Report

```http
POST /api/reports
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `brandId` | string | ✅ | — | Brand UUID |
| `threatIds` | string[] | | All unresolved | Specific threat UUIDs to include |
| `format` | string | | `"html"` | Output format (see below) |
| `ownerName` | string | | User email | Name for the "brand owner" field |

**Output Formats:**

| Format | Content-Type | Use case |
|--------|-------------|----------|
| `html` | `text/html` | Send to registrars, hosting providers |
| `text` | `text/plain` | Email-friendly plain text |
| `csv` | `text/csv` | Import into spreadsheets |
| `json` | `application/json` | Programmatic processing |

**Response:** File download with headers:
- `Content-Disposition: attachment; filename="takedown-report-{reportId}.{ext}"`
- `X-Report-Id: {reportId}` — Save this to reference the report later

**Errors:**

| Status | When |
|--------|------|
| `400` | Missing `brandId` or no threats to include |
| `404` | Brand not found |

<details>
<summary><strong>Examples</strong></summary>

**cURL:**
```bash
curl -X POST https://doppeldown.com/api/reports \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "brandId": "brand-uuid",
    "format": "html",
    "ownerName": "Acme Legal Team"
  }' \
  -o takedown-report.html
```

**Python:**
```python
resp = requests.post(
    'https://doppeldown.com/api/reports',
    headers={'Authorization': f'Bearer {token}'},
    json={
        'brandId': 'brand-uuid',
        'format': 'html',
        'ownerName': 'Acme Legal Team',
    },
)

report_id = resp.headers.get('X-Report-Id')
with open(f'takedown-{report_id}.html', 'wb') as f:
    f.write(resp.content)
```
</details>

---

### List Reports

```http
GET /api/reports
GET /api/reports?brandId={brandId}
```

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `brandId` | string | | Filter by brand UUID |

**Response:** `200 OK`

```json
[
  {
    "id": "report-uuid",
    "brand_id": "brand-uuid",
    "threat_ids": ["threat-1", "threat-2"],
    "type": "takedown_request",
    "status": "ready",
    "created_at": "2026-02-05T10:00:00Z",
    "brands": {
      "user_id": "user-uuid",
      "name": "Acme Corp"
    }
  }
]
```

---

### Delete Report

```http
DELETE /api/reports/{id}
```

**Response:** `200 OK` — `{ "success": true }`

> **Note:** Deleting a report does not affect the underlying threats. An audit log entry is created.

---

## Notifications

### Get Notifications

Retrieve up to 50 notifications (newest first).

```http
GET /api/notifications
```

**Response:** `200 OK`

```json
{
  "notifications": [
    {
      "id": "notif-uuid",
      "user_id": "user-uuid",
      "type": "threat_detected",
      "title": "New threat found",
      "message": "Suspicious domain acme-corp.xyz detected",
      "read": false,
      "created_at": "2026-02-05T10:00:00Z"
    }
  ],
  "unread_count": 3
}
```

**Notification Types:**

| Type | When it fires |
|------|---------------|
| `threat_detected` | New threat discovered during a scan |
| `scan_completed` | Scan finished (with or without threats) |
| `scan_failed` | Scan encountered an error |
| `quota_warning` | Approaching usage limits |

---

### Mark Notifications Read

```http
PATCH /api/notifications
```

**Request Body** (provide one of):

| Field | Type | Description |
|-------|------|-------------|
| `ids` | string[] | Specific notification UUIDs to mark read |
| `mark_all_read` | boolean | Set `true` to mark all as read |

**Response:** `200 OK` — `{ "success": true }`

<details>
<summary><strong>Examples</strong></summary>

**cURL — mark all:**
```bash
curl -X PATCH https://doppeldown.com/api/notifications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mark_all_read": true}'
```

**cURL — specific IDs:**
```bash
curl -X PATCH https://doppeldown.com/api/notifications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ids": ["notif-1", "notif-2"]}'
```
</details>

---

## Billing (Stripe)

### Create Checkout Session

Start a Stripe Checkout flow for subscribing to a plan.

```http
POST /api/stripe/checkout
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `plan` | string | ✅ | Plan: `"starter"`, `"professional"`, or `"enterprise"` |

**Response:** `200 OK`

```json
{ "url": "https://checkout.stripe.com/c/pay/..." }
```

Redirect the user to the returned `url` to complete payment.

---

### Create Portal Session

Open the Stripe Customer Portal for managing subscriptions, payment methods, and invoices.

```http
POST /api/stripe/portal
```

**Response:** `200 OK`

```json
{ "url": "https://billing.stripe.com/p/session/..." }
```

**Errors:**

| Status | When |
|--------|------|
| `400` | User has no active subscription |

---

### Stripe Webhook

Internal endpoint — configured in the Stripe Dashboard, **not called directly by clients**.

```http
POST /api/stripe/webhook
```

**Auth:** Stripe signature verification (`stripe-signature` header)

**Handled Events:**

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Activates subscription, sets tier |
| `customer.subscription.updated` | Updates subscription status and tier |
| `customer.subscription.deleted` | Resets user to free tier |
| `invoice.payment_failed` | Sets subscription to `past_due` |

---

## Webhooks

DoppelDown can send HTTP POST requests to your server for real-time event notifications. See the **[Webhook Integration Guide](./WEBHOOKS.md)** for complete setup instructions, payload examples, and signature verification.

### Available Events

| Event | When |
|-------|------|
| `threat.detected` | New threats found during a scan |
| `scan.completed` | Scan finished |
| `threat.resolved` | Threat marked as resolved |

### Request Headers

| Header | Description |
|--------|-------------|
| `Content-Type` | `application/json` |
| `User-Agent` | `DoppelDown-Webhooks/1.0` |
| `X-DoppelDown-Signature` | HMAC-SHA256 signature (if webhook secret configured) |

---

## Admin

### Get Audit Logs

Retrieve system audit logs. **Admin only.**

```http
GET /api/admin/audit-logs
```

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `entity_type` | string | — | Filter: `scan`, `threat`, `report`, `user`, `brand` |
| `user_id` | string | — | Filter by user UUID |
| `limit` | number | `100` | Results per page (max 500) |
| `offset` | number | `0` | Pagination offset |

**Response:** `200 OK`

```json
{
  "logs": [
    {
      "id": "log-uuid",
      "user_id": "user-uuid",
      "user_email": "user@example.com",
      "action": "DELETE",
      "entity_type": "threat",
      "entity_id": "threat-uuid",
      "metadata": {
        "brand_id": "brand-uuid",
        "threat_type": "typosquat_domain",
        "severity": "high"
      },
      "created_at": "2026-02-05T10:00:00Z"
    }
  ],
  "total": 42,
  "limit": 100,
  "offset": 0
}
```

**Errors:**

| Status | Code | When |
|--------|------|------|
| `403` | `FORBIDDEN` | User is not an admin |

---

## Cron Jobs (Internal)

These endpoints are called by an external scheduler (e.g., Vercel Cron) and require the `CRON_SECRET` bearer token. They are **not intended for direct API consumption**.

### Automated Scan Scheduler

```http
GET /api/cron/scan
```

Queues automated scans for all active brands based on tier-specific scan frequency. Skips free-tier users, adds 0–5 minute jitter to spread load, and prevents duplicate scans.

**Scan Frequency:**
- Starter: every 24 hours
- Professional: every 6 hours
- Enterprise: every 1 hour

### Weekly Digest

```http
GET /api/cron/digest
```

Sends weekly email digests to users with email alerts enabled. Aggregates threats from the past 7 days per brand.

### NRD Monitor

```http
GET /api/cron/nrd
```

Processes newly registered domains against enterprise brands for typosquatting detection. Enterprise tier only. Max 5-minute execution time.

---

## Tier Limits Reference

| Feature | Free | Starter | Professional | Enterprise |
|---------|------|---------|-------------|------------|
| **Brands** | 1 | 3 | 10 | Unlimited |
| **Domain variations/scan** | 25 | 100 | 500 | 2,500 |
| **Social platforms** | 1 | 3 | 6 | 8 (all) |
| **Automated scans** | Manual only | Every 24h | Every 6h | Every 1h |
| **Manual scans** | 3 per 7 days | Unlimited | Unlimited | Unlimited |
| **NRD monitoring** | ✗ | ✗ | ✗ | ✓ |
| **API rate limit** | 60 req/min | 120 req/min | 300 req/min | Unlimited |

### Available Social Platforms

`twitter` · `facebook` · `instagram` · `linkedin` · `tiktok` · `youtube` · `telegram` · `discord`

---

## Error Codes

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "details": {}
  },
  "meta": {
    "timestamp": "2026-02-05T10:00:00Z",
    "requestId": "abc-123"
  }
}
```

### Error Code Reference

| Code | HTTP Status | Description | Retryable? |
|------|-------------|-------------|------------|
| **Authentication** | | | |
| `UNAUTHORIZED` | 401 | Missing or invalid token | No (re-authenticate) |
| `FORBIDDEN` | 403 | Valid auth, insufficient permissions | No |
| `TOKEN_EXPIRED` | 401 | Session expired | No (re-authenticate) |
| **Validation** | | | |
| `VALIDATION_ERROR` | 422 | Invalid input data | No (fix input) |
| `MISSING_REQUIRED_FIELD` | 400 | Required field missing | No (fix input) |
| `INVALID_INPUT` | 400 | Input format invalid | No (fix input) |
| **Resources** | | | |
| `NOT_FOUND` | 404 | Resource doesn't exist | No |
| `ALREADY_EXISTS` | 409 | Duplicate resource | No |
| `RESOURCE_CONFLICT` | 409 | Conflicting operation (e.g., scan already running) | Yes (wait & retry) |
| **Limits** | | | |
| `RATE_LIMITED` | 429 | Too many requests | Yes (wait for `Retry-After`) |
| `QUOTA_EXCEEDED` | 429 | Scan quota depleted | Yes (wait for `resetsAt`) |
| `BRAND_LIMIT_REACHED` | 403 | Plan brand limit hit | No (upgrade plan) |
| `PLATFORM_LIMIT_EXCEEDED` | 403 | Too many social platforms | No (upgrade plan) |
| **Server** | | | |
| `INTERNAL_ERROR` | 500 | Unexpected server error | Yes (retry with backoff) |
| `SERVICE_UNAVAILABLE` | 503 | Temporary outage | Yes (retry with backoff) |
| `TIMEOUT` | 504 | Request timeout | Yes (retry) |

### HTTP Status Code Summary

| Status | Meaning |
|--------|---------|
| `200` | Success |
| `400` | Bad request / validation error |
| `401` | Not authenticated |
| `402` | Payment required |
| `403` | Forbidden / tier limit |
| `404` | Resource not found |
| `409` | Conflict (duplicate scan, existing resource) |
| `422` | Validation error (structured field errors) |
| `429` | Rate limited / quota exceeded |
| `500` | Internal server error |
| `502` | External service error |
| `503` | Service unavailable |
| `504` | Timeout |

---

## Health Check

Check API availability and system health.

```http
GET /api/health
```

**Response:** `200 OK`

```json
{
  "status": "healthy",
  "timestamp": "2026-02-05T10:00:00Z",
  "version": "1.0.0"
}
```

**Detailed health check:**
```http
GET /api/health?detailed=true
```

Returns dependency status (database, external services) and circuit breaker states.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and breaking changes.
