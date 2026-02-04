# DoppelDown API Changelog

All notable changes to the DoppelDown API will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this API adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-03

### Added

#### Authentication
- Supabase Auth integration with Bearer token and session cookie support
- Token lifecycle documentation (access: 1h, refresh: 7d)
- Security headers including CSP, HSTS, and X-Frame-Options

#### Brands API
- `GET /api/brands` - List all user brands
- `POST /api/brands` - Create new brand with domain normalization
- `PATCH /api/brands` - Update brand with merge/replace modes for social handles
- `POST /api/brands/logo` - Upload PNG logo (max 5MB)
- `DELETE /api/brands/logo` - Remove brand logo
- Tier-based brand limits (Free: 1, Starter: 3, Pro: 10, Enterprise: unlimited)
- Zod schema validation for all inputs

#### Scans API
- `POST /api/scan` - Queue security scans with 5 scan types
- `GET /api/scan` - Get scan status and progress
- `POST /api/scan/cancel` - Cancel running/queued scans
- `GET /api/scan/quota` - Check manual scan quota
- `POST /api/scan/social` - Social-only platform scans
- `DELETE /api/scans/{id}` - Delete scan with cascade deletion
- Manual scan quota (Free: 1/week, Paid: unlimited)
- Duplicate scan prevention

#### Threats API
- `DELETE /api/threats/{id}` - Delete threat with evidence cleanup
- Audit logging for all threat deletions
- Evidence file storage management

#### Evidence API
- `POST /api/evidence/sign` - Generate signed URLs for screenshots/HTML
- `GET /api/evidence/sign` - Alternative GET method
- Configurable TTL (60-86400 seconds, default 1 hour)
- Support for screenshot and HTML snapshot evidence

#### Reports API
- `POST /api/reports` - Generate takedown reports (HTML, text, CSV, JSON)
- `GET /api/reports` - List all reports with brand filtering
- `DELETE /api/reports/{id}` - Delete report with audit logging
- Automatic signed URL generation for evidence

#### Notifications API
- `GET /api/notifications` - Fetch notifications with unread count
- `PATCH /api/notifications` - Mark specific or all notifications as read
- Support for threat_detected, scan_completed, scan_failed, quota_warning types

#### Billing API (Stripe)
- `POST /api/stripe/checkout` - Create subscription checkout session
- `POST /api/stripe/portal` - Create customer portal session
- `POST /api/stripe/webhook` - Handle Stripe webhook events
- Support for starter, professional, and enterprise plans

#### Admin API
- `GET /api/admin/audit-logs` - Retrieve system audit logs
- Filtering by entity_type, user_id
- Pagination with limit/offset

#### Cron Endpoints
- `GET /api/cron/scan` - Automated scan scheduler with tier-based frequency
- `GET /api/cron/digest` - Weekly email digest sender
- `GET /api/cron/nrd` - Newly Registered Domain monitoring (Enterprise only)
- CRON_SECRET authentication

#### Rate Limiting
- Tier-based rate limits (Free: 60/min, Starter: 120/min, Pro: 300/min, Enterprise: unlimited)
- Rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)
- Retry-After header for 429 responses

#### Error Handling
- Standardized error response format with codes
- 20+ error codes covering all failure scenarios
- Request ID tracking for debugging
- Graceful degradation helpers

#### Documentation
- Complete OpenAPI 3.0 specification
- Interactive Swagger UI
- Security annotations for all endpoints
- Example requests and responses
- Tier limits reference table

### Security

- TLS 1.3 enforced on all connections
- HSTS with 2-year max-age and preload
- Content-Security-Policy headers
- Row-Level Security (RLS) in database
- Input validation with Zod schemas
- SQL injection prevention
- XSS protection headers
- Audit logging for sensitive operations

---

## Versioning & Compatibility Policy

For the complete API versioning strategy, deprecation timelines, and migration procedures, see **[API_VERSIONING_STRATEGY.md](./API_VERSIONING_STRATEGY.md)**.

### Quick Reference

- **API versions** are supported for a minimum of **18 months** after a successor version is released
- **Deprecation notice** is provided at least **6 months** before any feature is removed
- **Deprecated endpoints** return `Deprecation` and `Sunset` headers (RFC 8594)
- **Breaking changes** are only introduced in new major URL versions (`/api/v1/` → `/api/v2/`)
- **Non-breaking changes** (new fields, new endpoints, new optional params) ship within the current version

### Semver Within URL Versions

- **Major (x.0.0)**: Breaking changes → requires new URL version (`/api/v2/`)
- **Minor (0.x.0)**: New features, new endpoints, new optional parameters
- **Patch (0.0.x)**: Bug fixes, documentation updates

### Change Markers

- ⚠️ = Potentially breaking for clients with exhaustive type handling (new enum values, etc.)
- 🗑️ = Deprecated (will be removed in next major version)

### Rate Limit Changes

Rate limit changes are announced 30 days in advance via:
- Email to registered developers
- API changelog update
- Dashboard notification
