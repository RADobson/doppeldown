# DoppelDown API Reference

> **Base URL:** `https://doppeldown.com/api`
>
> **Version:** 1.0
>
> **Authentication:** All endpoints (except Stripe webhooks and cron jobs) require a valid Supabase session cookie or Bearer token.

---

## Table of Contents

- [Authentication](#authentication)
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
- [Admin](#admin)
  - [Get Audit Logs](#get-audit-logs)
- [Cron Jobs](#cron-jobs)
  - [Automated Scan Scheduler](#automated-scan-scheduler)
  - [Weekly Digest](#weekly-digest)
  - [NRD Monitor](#nrd-monitor)
- [Tier Limits Reference](#tier-limits-reference)
- [Error Codes](#error-codes)

---

## Authentication

DoppelDown uses **Supabase Auth** for authentication. All API requests must include a valid session.

### Session-based (Browser)

When using the dashboard, authentication is handled automatically via Supabase session cookies set during login.

### Token-based (API)

For programmatic access, include the Supabase access token in the `Authorization` header:

```
Authorization: Bearer <supabase_access_token>
```

### Cron Endpoints

Cron endpoints use a shared secret for authorization:

```
Authorization: Bearer <CRON_SECRET>
```

### Common Auth Errors

| Status | Response | Meaning |
|--------|----------|---------|
| `401` | `{ "error": "Unauthorized" }` | Missing or invalid session/token |
| `403` | `{ "error": "Forbidden" }` | Valid auth but insufficient permissions |

---

## Brands

### List Brands

Retrieve all brands owned by the authenticated user.

```
GET /api/brands
```

**Auth:** Required

**Response:** `200 OK`

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Acme Corp",
    "domain": "acme.com",
    "keywords": ["acme", "acmecorp"],
    "social_handles": {
      "twitter": ["@acmecorp"],
      "instagram": ["acmecorp"]
    },
    "enabled_social_platforms": ["twitter", "instagram"],
    "logo_url": "https://...",
    "status": "active",
    "threat_count": 5,
    "created_at": "2025-01-15T00:00:00Z"
  }
]
```

**Example:**

```bash
curl -X GET https://doppeldown.com/api/brands \
  -H "Authorization: Bearer $TOKEN"
```

---

### Create Brand

Create a new brand to monitor.

```
POST /api/brands
```

**Auth:** Required

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Brand display name |
| `domain` | string | Yes | Primary domain (auto-normalized, strips protocol/www/paths) |
| `keywords` | string[] | No | Additional keywords to monitor |
| `social_handles` | object | No | Map of platform → handle arrays (e.g. `{ "twitter": ["@acme"] }`) |
| `enabled_social_platforms` | string[] | No | Platforms to scan. Allowed: `twitter`, `facebook`, `instagram`, `linkedin`, `tiktok`, `youtube`, `telegram`, `discord` |

**Response:** `200 OK` — The created brand object.

**Errors:**

| Status | Code | Description |
|--------|------|-------------|
| `400` | — | Missing name or domain |
| `403` | `BRAND_LIMIT_REACHED` | Plan brand limit exceeded |
| `403` | `PLATFORM_LIMIT_EXCEEDED` | Plan social platform limit exceeded |

**Example:**

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

---

### Update Brand

Update an existing brand's details.

```
PATCH /api/brands
```

**Auth:** Required

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `brandId` | string | Yes | Brand UUID to update |
| `name` | string | No | New brand name |
| `domain` | string | No | New primary domain |
| `keywords` | string[] | No | Replacement keywords array |
| `social_handles` | object | No | Social handles update |
| `enabled_social_platforms` | string[] | No | Updated enabled platforms |
| `mode` | string | No | `"merge"` (default) or `"replace"` for social_handles |

**Response:** `200 OK` — The updated brand object.

**Errors:**

| Status | Code | Description |
|--------|------|-------------|
| `400` | — | Invalid input or no updates provided |
| `403` | `PLATFORM_LIMIT_EXCEEDED` | Plan social platform limit exceeded |
| `404` | — | Brand not found or not owned by user |

**Example:**

```bash
curl -X PATCH https://doppeldown.com/api/brands \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "brandId": "uuid-here",
    "keywords": ["acme", "acmecorp", "acme-inc"],
    "enabled_social_platforms": ["twitter", "instagram", "linkedin"]
  }'
```

---

### Upload Brand Logo

Upload a PNG logo for a brand.

```
POST /api/brands/logo
```

**Auth:** Required

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `brandId` | string | Yes | Brand UUID |
| `logo` | File | Yes | PNG image file (max 5MB) |

**Response:** `200 OK`

```json
{
  "logo_url": "https://supabase-storage-url/...",
  "storage_path": "brands/{brandId}/logo/{timestamp}-{uuid}-{filename}.png"
}
```

**Errors:**

| Status | Description |
|--------|-------------|
| `400` | Missing brandId, missing file, file too large, or non-PNG format |
| `404` | Brand not found or not owned by user |

**Example:**

```bash
curl -X POST https://doppeldown.com/api/brands/logo \
  -H "Authorization: Bearer $TOKEN" \
  -F "brandId=uuid-here" \
  -F "logo=@/path/to/logo.png"
```

---

### Delete Brand Logo

Remove a brand's logo.

```
DELETE /api/brands/logo
```

**Auth:** Required

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `brandId` | string | Yes | Brand UUID |

**Response:** `200 OK`

```json
{ "success": true }
```

**Example:**

```bash
curl -X DELETE https://doppeldown.com/api/brands/logo \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "brandId": "uuid-here" }'
```

---

## Scans

### Start Scan

Queue a new scan for a brand. Enforces manual scan quotas per tier.

```
POST /api/scan
```

**Auth:** Required

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `brandId` | string | Yes | Brand UUID to scan |
| `scanType` | string | No | One of: `full`, `quick`, `domain_only`, `web_only`, `social_only`. Default: `full` |

**Response:** `200 OK`

```json
{
  "message": "Scan queued",
  "scanId": "uuid",
  "jobId": "uuid"
}
```

**Errors:**

| Status | Code | Description |
|--------|------|-------------|
| `400` | — | Missing brandId |
| `404` | — | Brand not found |
| `409` | — | Scan already queued or running for this brand |
| `429` | `QUOTA_EXCEEDED` | Manual scan quota exceeded (includes `quota` object with `limit`, `used`, `resetsAt`) |

**Example:**

```bash
curl -X POST https://doppeldown.com/api/scan \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "brandId": "uuid-here", "scanType": "full" }'
```

---

### Get Scan Status

Retrieve details for a specific scan.

```
GET /api/scan?id={scanId}
```

**Auth:** Required

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Scan UUID |

**Response:** `200 OK`

```json
{
  "id": "uuid",
  "brand_id": "uuid",
  "scan_type": "full",
  "status": "running",
  "threats_found": 3,
  "domains_checked": 150,
  "pages_scanned": 42,
  "created_at": "2025-01-15T10:00:00Z",
  "completed_at": null,
  "error": null
}
```

**Example:**

```bash
curl -X GET "https://doppeldown.com/api/scan?id=uuid-here" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Cancel Scan

Cancel a queued or running scan.

```
POST /api/scan/cancel
```

**Auth:** Required

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `scanId` | string | Yes | Scan UUID to cancel |

**Response:** `200 OK`

```json
{
  "message": "Scan cancelled",
  "scanId": "uuid"
}
```

**Example:**

```bash
curl -X POST https://doppeldown.com/api/scan/cancel \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "scanId": "uuid-here" }'
```

---

### Get Scan Quota

Check the current user's manual scan quota status.

```
GET /api/scan/quota
```

**Auth:** Required

**Response:** `200 OK`

```json
{
  "limit": 3,
  "used": 1,
  "remaining": 2,
  "resetsAt": 1705363200000,
  "isUnlimited": false
}
```

For paid tiers / admins:

```json
{
  "limit": null,
  "used": 0,
  "remaining": null,
  "resetsAt": null,
  "isUnlimited": true
}
```

**Example:**

```bash
curl -X GET https://doppeldown.com/api/scan/quota \
  -H "Authorization: Bearer $TOKEN"
```

---

### Start Social Scan

Queue a social-media-only scan for a brand.

```
POST /api/scan/social
```

**Auth:** Required

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `brandId` | string | Yes | Brand UUID |
| `platforms` | string[] | No | Platforms to scan. Default: all 8 platforms |

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Social scan queued",
  "scanId": "uuid",
  "jobId": "uuid",
  "platforms": ["twitter", "instagram"]
}
```

**Errors:**

| Status | Description |
|--------|-------------|
| `409` | Scan already queued or running for this brand |

**Example:**

```bash
curl -X POST https://doppeldown.com/api/scan/social \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "brandId": "uuid-here",
    "platforms": ["twitter", "instagram", "tiktok"]
  }'
```

---

### Delete Scan

Delete a scan and all associated threats and evidence files.

```
DELETE /api/scans/{id}
```

**Auth:** Required

**Path Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Scan UUID |

**Response:** `200 OK`

```json
{ "success": true }
```

**Side Effects:**
- Deletes all threats linked to this scan
- Removes evidence screenshots from storage (best-effort)
- Creates an audit log entry

**Example:**

```bash
curl -X DELETE https://doppeldown.com/api/scans/uuid-here \
  -H "Authorization: Bearer $TOKEN"
```

---

## Threats

### Delete Threat

Delete a specific threat and its evidence files.

```
DELETE /api/threats/{id}
```

**Auth:** Required

**Path Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Threat UUID |

**Response:** `200 OK`

```json
{ "success": true }
```

**Side Effects:**
- Removes evidence screenshots from storage (best-effort)
- Creates an audit log entry with threat metadata

**Example:**

```bash
curl -X DELETE https://doppeldown.com/api/threats/uuid-here \
  -H "Authorization: Bearer $TOKEN"
```

---

## Evidence

### Sign Evidence URL

Generate a time-limited signed URL for accessing evidence files (screenshots or HTML snapshots).

```
POST /api/evidence/sign
GET  /api/evidence/sign?threatId={id}&kind={kind}&index={index}&expiresIn={seconds}
```

**Auth:** Required

**Request Body (POST) / Query Params (GET):**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `threatId` | string | Yes | — | Threat UUID |
| `kind` | string | No | `"screenshot"` | Evidence type: `"screenshot"` or `"html"` |
| `index` | number | No | `0` | Index of the evidence item in the array |
| `expiresIn` | number | No | `3600` | URL TTL in seconds (min: 60, max: 86400) |

**Response:** `200 OK`

```json
{
  "signedUrl": "https://supabase-storage/...",
  "expiresIn": 3600,
  "bucket": "evidence",
  "path": "threats/{threatId}/screenshot-0.png"
}
```

**Example (POST):**

```bash
curl -X POST https://doppeldown.com/api/evidence/sign \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "threatId": "uuid-here", "kind": "screenshot", "expiresIn": 7200 }'
```

**Example (GET):**

```bash
curl -X GET "https://doppeldown.com/api/evidence/sign?threatId=uuid-here&kind=screenshot" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Reports

### Generate Report

Generate a takedown report for threats associated with a brand.

```
POST /api/reports
```

**Auth:** Required

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `brandId` | string | Yes | — | Brand UUID |
| `threatIds` | string[] | No | All unresolved | Specific threat UUIDs to include |
| `format` | string | No | `"html"` | Output format: `"html"`, `"text"`, `"csv"`, or `"json"` |
| `ownerName` | string | No | User email | Name for the report's "brand owner" field |

**Response:** File download with appropriate Content-Type header.

| Format | Content-Type | Extension |
|--------|-------------|-----------|
| `html` | `text/html` | `.html` |
| `text` | `text/plain` | `.txt` |
| `csv` | `text/csv` | `.csv` |
| `json` | `application/json` | `.txt` |

**Headers:**
- `Content-Disposition: attachment; filename="takedown-report-{reportId}.{ext}"`
- `X-Report-Id: {reportId}`

**Errors:**

| Status | Description |
|--------|-------------|
| `400` | Missing brandId or no threats to include |
| `404` | Brand not found |

**Example:**

```bash
curl -X POST https://doppeldown.com/api/reports \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "brandId": "uuid-here",
    "format": "html",
    "ownerName": "Acme Legal Team"
  }' \
  -o takedown-report.html
```

---

### List Reports

List previously generated reports.

```
GET /api/reports
GET /api/reports?brandId={brandId}
```

**Auth:** Required

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `brandId` | string | No | Filter by brand UUID |

**Response:** `200 OK`

```json
[
  {
    "id": "uuid",
    "brand_id": "uuid",
    "threat_ids": ["uuid-1", "uuid-2"],
    "type": "takedown_request",
    "status": "ready",
    "created_at": "2025-01-15T10:00:00Z",
    "brands": {
      "user_id": "uuid",
      "name": "Acme Corp"
    }
  }
]
```

**Example:**

```bash
curl -X GET "https://doppeldown.com/api/reports?brandId=uuid-here" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Delete Report

Delete a report record.

```
DELETE /api/reports/{id}
```

**Auth:** Required

**Path Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Report UUID |

**Response:** `200 OK`

```json
{ "success": true }
```

**Side Effects:**
- Creates an audit log entry

**Example:**

```bash
curl -X DELETE https://doppeldown.com/api/reports/uuid-here \
  -H "Authorization: Bearer $TOKEN"
```

---

## Notifications

### Get Notifications

Retrieve the user's notifications (newest first, max 50).

```
GET /api/notifications
```

**Auth:** Required

**Response:** `200 OK`

```json
{
  "notifications": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "type": "threat_detected",
      "title": "New threat found",
      "message": "Suspicious domain acme-corp.xyz detected",
      "read": false,
      "created_at": "2025-01-15T10:00:00Z"
    }
  ],
  "unread_count": 3
}
```

**Example:**

```bash
curl -X GET https://doppeldown.com/api/notifications \
  -H "Authorization: Bearer $TOKEN"
```

---

### Mark Notifications Read

Mark specific notifications or all notifications as read.

```
PATCH /api/notifications
```

**Auth:** Required

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ids` | string[] | Conditional | Notification UUIDs to mark as read |
| `mark_all_read` | boolean | Conditional | Set `true` to mark all as read |

> One of `ids` or `mark_all_read` must be provided.

**Response:** `200 OK`

```json
{ "success": true }
```

**Example (mark all):**

```bash
curl -X PATCH https://doppeldown.com/api/notifications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "mark_all_read": true }'
```

**Example (specific IDs):**

```bash
curl -X PATCH https://doppeldown.com/api/notifications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "ids": ["uuid-1", "uuid-2"] }'
```

---

## Billing (Stripe)

### Create Checkout Session

Start a Stripe Checkout flow for subscribing to a plan.

```
POST /api/stripe/checkout
```

**Auth:** Required

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `plan` | string | Yes | Plan identifier: `"starter"`, `"professional"`, or `"enterprise"` |

**Response:** `200 OK`

```json
{
  "url": "https://checkout.stripe.com/c/pay/..."
}
```

**Errors:**

| Status | Description |
|--------|-------------|
| `400` | Invalid plan or Stripe price ID not configured |

**Example:**

```bash
curl -X POST https://doppeldown.com/api/stripe/checkout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "plan": "professional" }'
```

---

### Create Portal Session

Open the Stripe Customer Portal for managing subscriptions, invoices, and payment methods.

```
POST /api/stripe/portal
```

**Auth:** Required

**Response:** `200 OK`

```json
{
  "url": "https://billing.stripe.com/p/session/..."
}
```

**Errors:**

| Status | Description |
|--------|-------------|
| `400` | No subscription found (user has no Stripe customer ID) |

**Example:**

```bash
curl -X POST https://doppeldown.com/api/stripe/portal \
  -H "Authorization: Bearer $TOKEN"
```

---

### Stripe Webhook

Receives and processes Stripe webhook events. **Not called directly** — configured in Stripe Dashboard.

```
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

**Response:** `200 OK`

```json
{ "received": true }
```

---

## Admin

### Get Audit Logs

Retrieve system audit logs. **Admin only.**

```
GET /api/admin/audit-logs
```

**Auth:** Required + Admin role

**Query Parameters:**

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `entity_type` | string | No | — | Filter by entity type (e.g. `scan`, `threat`, `report`) |
| `user_id` | string | No | — | Filter by user UUID |
| `limit` | number | No | `100` | Results per page (max 500) |
| `offset` | number | No | `0` | Pagination offset |

**Response:** `200 OK`

```json
{
  "logs": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "user_email": "user@example.com",
      "action": "DELETE",
      "entity_type": "threat",
      "entity_id": "uuid",
      "metadata": {
        "brand_id": "uuid",
        "threat_type": "typosquat_domain",
        "severity": "high"
      },
      "created_at": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 42,
  "limit": 100,
  "offset": 0
}
```

**Errors:**

| Status | Description |
|--------|-------------|
| `403` | User is not an admin |

**Example:**

```bash
curl -X GET "https://doppeldown.com/api/admin/audit-logs?entity_type=scan&limit=50" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Cron Jobs

These endpoints are called by an external scheduler (e.g. Vercel Cron) and require the `CRON_SECRET` bearer token.

### Automated Scan Scheduler

Queues automated scans for all active brands based on tier-specific scan frequency.

```
GET /api/cron/scan
```

**Auth:** `Authorization: Bearer <CRON_SECRET>`

**Behavior:**
- Skips free-tier users (no automated scans)
- Respects per-tier scan frequency (starter: 24h, professional: 6h, enterprise: 1h)
- Adds random jitter (0–5 min) to spread load
- Prevents duplicate queued/running scans

**Response:** `200 OK`

```json
{
  "success": true,
  "results": {
    "queued": 12,
    "skipped": 5,
    "errors": []
  },
  "timestamp": "2025-01-15T10:00:00Z"
}
```

---

### Weekly Digest

Sends weekly email digests to users with email alerts enabled.

```
GET /api/cron/digest
```

**Auth:** `Authorization: Bearer <CRON_SECRET>`

**Behavior:**
- Queries users with `email_alerts` and `weekly_digest` / `daily_digest` enabled
- Aggregates threats from the past 7 days per brand
- Sends digest emails via the configured email provider

**Response:** `200 OK`

```json
{
  "success": true,
  "results": {
    "sent": 8,
    "skipped": 3,
    "errors": []
  },
  "timestamp": "2025-01-15T10:00:00Z"
}
```

---

### NRD Monitor

Processes newly registered domains (NRDs) against enterprise brands for typosquatting detection.

```
GET /api/cron/nrd
```

**Auth:** `Authorization: Bearer <CRON_SECRET>`

**Max Duration:** 5 minutes (Vercel function limit)

**Behavior:**
- Only processes brands belonging to enterprise-tier users with NRD access
- Fetches new domains from the NRD provider since last processing
- Pre-filters candidates using brand term indexes
- Auto-creates threats for high-confidence matches (similarity ≥ threshold)
- Records processing state for incremental feeds

**Response:** `200 OK`

```json
{
  "success": true,
  "results": {
    "domainsProcessed": 50000,
    "matchesFound": 3,
    "threatsCreated": 1,
    "errors": []
  },
  "processingTimeMs": 45000,
  "timestamp": "2025-01-15T10:00:00Z"
}
```

---

## Tier Limits Reference

| Feature | Free | Starter | Professional | Enterprise |
|---------|------|---------|-------------|------------|
| Brands | 1 | 3 | 10 | Unlimited |
| Domain variations per scan | 25 | 100 | 500 | 2,500 |
| Social platforms | 1 | 3 | 6 | 8 (all) |
| Automated scan frequency | Manual only | Every 24h | Every 6h | Every 1h |
| Manual scans | 3 per 7 days | Unlimited | Unlimited | Unlimited |
| NRD monitoring | ✗ | ✗ | ✗ | ✓ |

**Available Social Platforms:** `twitter`, `facebook`, `instagram`, `linkedin`, `tiktok`, `youtube`, `telegram`, `discord`

---

## Error Codes

Standard error response format:

```json
{
  "error": "Human-readable error message",
  "code": "MACHINE_READABLE_CODE"
}
```

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `BRAND_LIMIT_REACHED` | 403 | User has reached their plan's brand limit |
| `PLATFORM_LIMIT_EXCEEDED` | 403 | Too many social platforms selected for tier |
| `QUOTA_EXCEEDED` | 429 | Manual scan quota depleted for the current period |

### HTTP Status Codes

| Status | Meaning |
|--------|---------|
| `200` | Success |
| `400` | Bad request / validation error |
| `401` | Not authenticated |
| `403` | Forbidden / tier limit reached |
| `404` | Resource not found |
| `409` | Conflict (e.g. duplicate scan) |
| `429` | Rate limited / quota exceeded |
| `500` | Internal server error |
