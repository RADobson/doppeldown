# DoppelDown API Versioning & Backward Compatibility Strategy

> A comprehensive strategy for managing API evolution, maintaining backward compatibility, implementing deprecation policies, and providing migration guides for developers integrating with the DoppelDown API.
>
> **Version:** 1.0  
> **Created:** 2026-02-05  
> **Last Updated:** 2026-02-05  
> **Status:** Proposed  
> **Owner:** Engineering

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Assessment](#2-current-state-assessment)
3. [Versioning Strategy](#3-versioning-strategy)
4. [Backward Compatibility Policy](#4-backward-compatibility-policy)
5. [API Change Classification](#5-api-change-classification)
6. [Deprecation Policy](#6-deprecation-policy)
7. [Version Lifecycle Management](#7-version-lifecycle-management)
8. [Implementation Plan](#8-implementation-plan)
9. [API Gateway & Routing Architecture](#9-api-gateway--routing-architecture)
10. [Developer Communication Plan](#10-developer-communication-plan)
11. [Migration Guide Framework](#11-migration-guide-framework)
12. [SDK Versioning Strategy](#12-sdk-versioning-strategy)
13. [Webhook Versioning](#13-webhook-versioning)
14. [Testing & Validation](#14-testing--validation)
15. [Governance & Decision-Making](#15-governance--decision-making)
16. [Monitoring & Observability](#16-monitoring--observability)
17. [Emergency Procedures](#17-emergency-procedures)
18. [Appendices](#appendices)

---

## 1. Executive Summary

### Why This Matters

DoppelDown is transitioning from a dashboard-first product to an API-first platform. The DevX strategy (see `DEVX_STRATEGY.md`) envisions official SDKs, a CLI tool, third-party integrations, and an MSP ecosystem — all built on the API. Breaking changes to that API would fracture the trust we're building with developers.

This document defines how DoppelDown will evolve its API without breaking existing integrations. It covers the full lifecycle: versioning scheme, compatibility rules, deprecation timelines, communication practices, migration tooling, and governance.

### Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Versioning scheme** | URL-path (`/api/v1/...`) | Explicit, cacheable, easy to route — industry standard for REST APIs |
| **Default version** | Pinned (no implicit "latest") | Prevents silent breakage; clients must opt-in to new versions |
| **Version lifecycle** | 18-month support after successor release | Balances stability with maintenance cost |
| **Deprecation notice** | Minimum 6 months before sunset | Gives integrators time to migrate |
| **Breaking change threshold** | Major version only | Minor versions are always additive |
| **Current migration** | `/api/*` → `/api/v1/*` with transparent redirect | Zero disruption for existing users |

### Design Principles

1. **Don't break what works.** An integration that works today must continue working for at least 18 months after a new version ships.
2. **Explicit over implicit.** Developers should know exactly which version they're using and when it expires.
3. **Additive by default.** New fields, new endpoints, and new enum values are non-breaking. Removal and type changes are breaking.
4. **Migration must be a choice, not a surprise.** Deprecation warnings in headers and docs give developers agency over timing.
5. **Complexity stays on our side.** Developers shouldn't need to understand our internal architecture to use the API correctly across versions.

---

## 2. Current State Assessment

### Current API Surface

DoppelDown v1.0 (released 2026-02-03) exposes 30 route handlers across these resource groups:

| Resource Group | Endpoints | Auth Model |
|----------------|-----------|------------|
| **Brands** | `GET/POST/PATCH /api/brands`, `POST/DELETE /api/brands/logo` | Supabase Bearer / Session |
| **Scans** | `POST/GET /api/scan`, `POST /api/scan/cancel`, `GET /api/scan/quota`, `POST /api/scan/social`, `DELETE /api/scans/{id}` | Supabase Bearer / Session |
| **Threats** | `DELETE /api/threats/{id}` | Supabase Bearer / Session |
| **Evidence** | `POST/GET /api/evidence/sign` | Supabase Bearer / Session |
| **Reports** | `POST/GET /api/reports`, `DELETE /api/reports/{id}` | Supabase Bearer / Session |
| **Notifications** | `GET/PATCH /api/notifications` | Supabase Bearer / Session |
| **Billing** | `POST /api/stripe/checkout`, `POST /api/stripe/portal`, `POST /api/stripe/webhook` | Supabase Bearer / Stripe Signature |
| **Admin** | `GET /api/admin/audit-logs`, `GET /api/admin/model-usage` | Admin-only |
| **Cron** | `GET /api/cron/scan`, `GET /api/cron/digest`, `GET /api/cron/nrd` | CRON_SECRET |
| **System** | `GET /api/health`, `GET /api/metrics`, `GET /api/monitoring` | Public / Internal |
| **Other** | `POST /api/newsletter`, `GET/POST /api/onboarding/*`, `GET /api/threat-intel` | Various |

### Known Inconsistencies (Pre-Versioning Tech Debt)

These should be resolved as part of the v1 stabilization before v2 planning begins:

| Issue | Details | Reference |
|-------|---------|-----------|
| **Inconsistent response shapes** | Some endpoints return raw data; others use `{ success, data, meta }` envelope | TD-026 |
| **Mixed pluralization** | `/api/scan` (singular) vs `/api/scans/{id}` (plural) for the same resource | — |
| **Inconsistent ID passing** | Some use path params (`/threats/{id}`), others use query (`/scan?id=`), others use body (`{ brandId }`) | — |
| **No version prefix** | All routes live at `/api/*` with no version indicator | — |
| **Auth model complexity** | Mix of Supabase tokens and session cookies; no dedicated API keys | DevX Phase 1 |

### Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Existing integrations break during v1 migration | High | Transparent redirects with no behavior change |
| Version routing adds latency | Low | Middleware-level routing, <1ms overhead |
| Maintaining multiple versions increases codebase complexity | Medium | Shared core logic with version-specific adapters |
| Developers ignore deprecation warnings | Medium | Multiple communication channels + SDK warnings |
| Webhook payload changes break receivers | High | Independent webhook versioning with pin option |

---

## 3. Versioning Strategy

### 3.1 URL-Path Versioning

DoppelDown uses **URL-path versioning** as the primary versioning mechanism:

```
https://doppeldown.com/api/v1/brands
https://doppeldown.com/api/v2/brands
```

#### Why URL-Path (Not Headers or Query Params)

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **URL path** (`/api/v1/`) | Explicit, cacheable, easy to test in browser, standard | "Ugly" URLs, requires route changes | ✅ **Selected** |
| **Header** (`Accept: application/vnd.doppeldown.v1+json`) | Clean URLs, flexible | Easy to forget, hard to test in browser, poor cache behavior | ❌ |
| **Query param** (`?version=1`) | Easy to add | Breaks caching, looks like a filter, not a version | ❌ |
| **Subdomain** (`v1.api.doppeldown.com`) | Clean separation | Complex DNS/TLS, CORS issues | ❌ |

### 3.2 Version Numbering

Versions use **integer major versions** only in the URL path:

```
/api/v1/...   ← Major version 1
/api/v2/...   ← Major version 2 (future)
```

**Internal semver** (e.g., `1.3.2`) tracks changes within a major version but is **not exposed in the URL**. It appears in:
- The `X-API-Version` response header: `X-API-Version: 1.3.2`
- The `/api/v1/health` response body: `{ "version": "1.3.2" }`
- The changelog

### 3.3 Semantic Versioning (Internal)

Within each major URL version, changes follow semver:

| Change Type | Version Bump | Example |
|-------------|-------------|---------|
| Bug fix, doc update | Patch (1.0.x) | Fix evidence signing returning wrong bucket path |
| New endpoint, new optional field, new enum value | Minor (1.x.0) | Add `GET /api/v1/threats` list endpoint |
| Removed field, type change, behavior change | Major (x.0.0) | Change threat severity from string to numeric → **new URL version** |

### 3.4 Version Pinning

Clients are **always pinned to the version in their URL path**. There is no "latest" alias.

```bash
# Explicit version — always returns v1 behavior
curl https://doppeldown.com/api/v1/brands

# No version — redirected to v1 during transition period (see §8)
curl https://doppeldown.com/api/brands
# → 301 Redirect to /api/v1/brands
```

After the transition period, unversioned requests receive a `400 Bad Request` with a message directing developers to pin a version.

### 3.5 Version Discovery

The API exposes available versions at the root:

```http
GET /api/versions
```

```json
{
  "versions": [
    {
      "version": "v1",
      "status": "stable",
      "releaseDate": "2026-02-03",
      "sunsetDate": null,
      "docsUrl": "https://docs.doppeldown.com/api/v1"
    }
  ],
  "current": "v1",
  "deprecated": []
}
```

---

## 4. Backward Compatibility Policy

### 4.1 Compatibility Guarantee

**Within a major API version, DoppelDown guarantees that existing integrations will not break.** Specifically:

#### What We Will NOT Do (Breaking Changes — Require Major Version)

| Category | Example | Why It Breaks |
|----------|---------|---------------|
| **Remove a field** from a response | Remove `threat_count` from brand object | Clients parsing that field crash |
| **Remove an endpoint** | Delete `GET /api/v1/scan/quota` | 404s break workflows |
| **Rename a field** | `scan_type` → `scanType` in response | Same as removal + addition |
| **Change a field's type** | `severity` from `"high"` to `85` (number) | Deserialization breaks |
| **Change error code semantics** | Return `403` where `429` was returned before | Error handling logic breaks |
| **Change authentication mechanism** | Require API keys where Bearer tokens worked | Auth flow breaks |
| **Add a required parameter** to existing endpoint | Make `scanType` required on `POST /scan` | Existing calls without it fail |
| **Change default behavior** | Default `scanType` from `"full"` to `"quick"` | Existing clients expect full scans |
| **Change URL structure** | Move `/scan/cancel` to `/scans/{id}/cancel` | Hardcoded URLs break |
| **Change pagination semantics** | Switch from offset to cursor-based | Client pagination logic breaks |
| **Remove an enum value** | Remove `"quick"` from allowed scan types | Existing calls with `"quick"` fail |
| **Change rate limit behavior** | Reduce limits without notice | Clients hit unexpected 429s |
| **Change webhook payload structure** | Rename `data.threats` to `data.findings` | Webhook handlers break |

#### What We CAN Do (Non-Breaking — Within Same Version)

| Category | Example | Why It's Safe |
|----------|---------|---------------|
| **Add a new field** to a response | Add `risk_score` to threat object | Clients ignore unknown fields |
| **Add a new endpoint** | Add `GET /api/v1/threats` | No existing code calls it |
| **Add a new optional parameter** | Add optional `priority` to scan start | Existing calls omit it fine |
| **Add a new enum value** | Add `"deep"` scan type | Existing code doesn't send it |
| **Add a new error code** | Add `SCAN_TIMEOUT` error | New code, not returned for existing flows |
| **Add a new webhook event** | Add `brand.created` event | Only delivered if subscribed |
| **Improve error messages** | More descriptive `message` text | Code should check `code`, not `message` |
| **Fix bugs** | Fix scan status returning wrong `domains_checked` | Bug fix = correct behavior |
| **Improve performance** | Faster scan responses | Faster is never breaking |
| **Relax validation** | Accept domains with or without trailing dot | Strictly more permissive |
| **Add response headers** | Add `X-Request-Cost` header | Clients ignore unknown headers |

### 4.2 Robustness Principle (Postel's Law)

DoppelDown follows the robustness principle:

> **Be liberal in what you accept, and conservative in what you send.**

Specifically:
- **Accept** unknown fields in request bodies (ignore them, don't error)
- **Accept** both `camelCase` and `snake_case` for known fields (normalize internally)
- **Send** responses in a consistent format (always `snake_case`)
- **Send** all documented fields (never omit a field, use `null` for absent values)

### 4.3 The "Add, Don't Remove" Rule

When the desired behavior change is simple enough, prefer adding alongside rather than replacing:

```
# Instead of renaming severity → risk_level:
# 1. Add risk_level alongside severity
# 2. Document severity as deprecated in v1
# 3. Remove severity in v2

# v1 response (after adding risk_level):
{
  "severity": "high",          // Deprecated, maintained for compatibility
  "risk_level": "high",        // New canonical field
  "severity_score": 85         // New numeric detail
}
```

### 4.4 Null vs. Absent vs. Empty

Establish clear semantics that don't change across versions:

| Value | Meaning | Example |
|-------|---------|---------|
| `null` | Field exists but has no value | `"completed_at": null` (scan still running) |
| `""` (empty string) | Field is set to empty | Never used — prefer `null` |
| `[]` (empty array) | Field is set, collection is empty | `"keywords": []` |
| Field absent | **Never happens in documented fields** — always include | — |
| `0` | Numeric zero (meaningful) | `"threats_found": 0` |

This is documented in the API reference and enforced in response serialization.

---

## 5. API Change Classification

### 5.1 Change Review Matrix

Every API change must be classified before implementation:

```
┌─────────────────────────────────────────────────────────────────┐
│                    API CHANGE REVIEW MATRIX                       │
│                                                                   │
│  Is a field/endpoint being removed?              ──── YES → 🔴  │
│  Is a field's type changing?                     ──── YES → 🔴  │
│  Is a required parameter being added?            ──── YES → 🔴  │
│  Is default behavior changing?                   ──── YES → 🔴  │
│  Is URL structure changing?                      ──── YES → 🔴  │
│  Is authentication changing?                     ──── YES → 🔴  │
│                                                                   │
│  Is a new optional parameter being added?        ──── YES → 🟢  │
│  Is a new field being added to responses?        ──── YES → 🟢  │
│  Is a new endpoint being added?                  ──── YES → 🟢  │
│  Is a new enum value being added?                ──── YES → 🟡  │
│  Is an error message text changing?              ──── YES → 🟢  │
│  Is performance improving?                       ──── YES → 🟢  │
│                                                                   │
│  🔴 = Breaking (requires new major version)                      │
│  🟡 = Potentially breaking (requires careful analysis)           │
│  🟢 = Non-breaking (ship within current version)                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 "Potentially Breaking" Changes

Some changes are technically additive but can break poorly-written clients:

| Change | Why It's Risky | Mitigation |
|--------|---------------|------------|
| **New enum value in response** | Clients with exhaustive `switch` statements crash on unknown values | Document: "Clients MUST handle unknown enum values gracefully" |
| **New field in response** | Clients with strict deserialization reject unknown fields | Document: "Clients MUST ignore unknown fields" |
| **Increased array size** | Clients with fixed-size buffers overflow | Document max sizes; paginate |
| **New error code** | Clients with exhaustive error matching miss it | Document: "Handle unknown error codes as generic errors" |
| **Reordered JSON fields** | Clients parsing JSON positionally (cursed but real) | JSON field order is explicitly unspecified |

These are treated as **non-breaking** but are communicated in the changelog with a ⚠️ marker:

```markdown
## [1.2.0] - 2026-04-15

### Added
- ⚠️ New `deep` scan type. Clients with exhaustive scan type handling should update.
- New `risk_score` field on threat objects (numeric 0-100).
```

### 5.3 API Change Proposal (ACP) Process

Any non-trivial API change requires an ACP before implementation:

```markdown
# ACP-XXX: [Title]

**Author:** [name]
**Date:** [date]
**Status:** Draft | Review | Approved | Rejected | Implemented

## Summary
One paragraph describing the change.

## Motivation
Why is this change needed? What problem does it solve?

## Change Classification
- [ ] 🟢 Non-breaking (additive)
- [ ] 🟡 Potentially breaking (new enum values, etc.)
- [ ] 🔴 Breaking (requires new major version)

## Affected Endpoints
- `POST /api/v1/scan` — new optional `priority` parameter
- Response includes new `estimated_duration` field

## Backward Compatibility Analysis
How does this affect existing clients? What assumptions could break?

## SDK Impact
- TypeScript SDK: [describe changes needed]
- Python SDK: [describe changes needed]
- CLI: [describe changes needed]

## Migration Path (if breaking)
Step-by-step guide for developers updating their integration.

## Alternatives Considered
What other approaches were evaluated and why they were rejected.
```

---

## 6. Deprecation Policy

### 6.1 Deprecation Timeline

```
                 ┌──────────┐
                 │ Active   │ Fully supported, recommended for use
                 │          │
                 └─────┬────┘
                       │  New major version released
                       ▼
                 ┌──────────┐
                 │ Deprecated│ Still works, but:
                 │ (6 months)│  - Deprecation headers in responses
                 │          │  - Warnings in docs & SDKs
                 │          │  - No new features added
                 │          │  - Security fixes only
                 └─────┬────┘
                       │  6 months after deprecation
                       ▼
                 ┌──────────┐
                 │ Sunset   │ Still works, but:
                 │ Warning  │  - Sunset header with exact date
                 │ (12 mo.) │  - Dashboard banners for affected users
                 │          │  - Email notifications
                 │          │  - SDK throws warnings on every call
                 └─────┬────┘
                       │  18 months after new version release
                       ▼
                 ┌──────────┐
                 │ Retired  │ Returns 410 Gone with migration link
                 └──────────┘
```

### 6.2 Version Support Matrix

| Version | Status | Released | Deprecated | Sunset Date | Notes |
|---------|--------|----------|------------|-------------|-------|
| v1 | **Active** | 2026-02-03 | — | — | Current production version |
| v2 | *Planned* | ~2026-H2 | — | — | See §8 for roadmap |

### 6.3 Deprecation Headers

When an API version or individual endpoint is deprecated, every response includes:

```http
HTTP/1.1 200 OK
Deprecation: true
Deprecation-Date: Sat, 01 Aug 2026 00:00:00 GMT
Sunset: Sat, 01 Feb 2028 00:00:00 GMT
Link: <https://docs.doppeldown.com/migration/v1-to-v2>; rel="deprecation"
Link: <https://doppeldown.com/api/v2/brands>; rel="successor-version"
X-API-Version: 1.4.2
X-API-Deprecated: true
```

| Header | RFC | Purpose |
|--------|-----|---------|
| `Deprecation` | [RFC 8594](https://www.rfc-editor.org/rfc/rfc8594) | Signals the resource is deprecated |
| `Deprecation-Date` | RFC 8594 | When deprecation was announced |
| `Sunset` | [RFC 8594](https://www.rfc-editor.org/rfc/rfc8594) | When the resource will stop working |
| `Link: rel="deprecation"` | RFC 8594 | Link to migration documentation |
| `Link: rel="successor-version"` | RFC 8594 | Link to the replacement endpoint |

### 6.4 Individual Endpoint Deprecation

Sometimes a single endpoint is deprecated within a version (replaced by a better design):

```http
# Old endpoint (deprecated within v1)
POST /api/v1/scan/social
Deprecation: true
Sunset: 2027-03-01
Link: <https://docs.doppeldown.com/migration/social-scan>; rel="deprecation"

# New endpoint (replacement within v1)
POST /api/v1/scan
# Now accepts scanType: "social_only" with optional platforms filter
```

### 6.5 Field-Level Deprecation

Individual response fields can be deprecated without removing them:

```json
{
  "severity": "high",
  "$deprecated": {
    "severity": {
      "message": "Use 'risk_level' instead. 'severity' will be removed in v2.",
      "successor": "risk_level",
      "sunsetVersion": "v2"
    }
  },
  "risk_level": "high",
  "risk_score": 85
}
```

The `$deprecated` meta-field is opt-in (only returned when `X-Show-Deprecations: true` header is sent) to avoid bloating normal responses.

### 6.6 Deprecation Notification Channels

| Channel | Timing | Audience |
|---------|--------|----------|
| **HTTP headers** | Every response | All API consumers |
| **API changelog** | At deprecation announcement | Developers following changelog |
| **Email** | At deprecation, 3 months before sunset, 1 month before sunset | All users with API activity |
| **Dashboard banner** | Throughout deprecation period | Dashboard users |
| **SDK warnings** | Every SDK call to deprecated endpoint | SDK users |
| **Discord announcement** | At deprecation, at sunset | Community members |
| **Status page** | At deprecation and sunset | Status page subscribers |
| **OpenAPI spec** | `deprecated: true` on endpoints/fields | Tooling consumers |

---

## 7. Version Lifecycle Management

### 7.1 Version States

```
┌──────────────────────────────────────────────────────────────────────┐
│                        VERSION LIFECYCLE                              │
│                                                                       │
│  ┌─────────┐    ┌──────────┐    ┌──────────┐    ┌─────────────┐    │
│  │  Beta    │───▶│  Stable  │───▶│Deprecated│───▶│   Retired   │    │
│  │         │    │  (Active) │    │          │    │ (410 Gone)  │    │
│  └─────────┘    └──────────┘    └──────────┘    └─────────────┘    │
│                                                                       │
│  Beta:                                                                │
│  - Available at /api/v2-beta/                                        │
│  - No stability guarantees                                            │
│  - Breaking changes possible between beta releases                   │
│  - Not for production use                                            │
│  - Duration: 2-4 months                                               │
│                                                                       │
│  Stable:                                                              │
│  - Full backward compatibility guarantee                              │
│  - New features and non-breaking changes                             │
│  - Bug fixes and security patches                                    │
│  - Duration: until successor is stable + 18 months                   │
│                                                                       │
│  Deprecated:                                                          │
│  - Security patches only                                              │
│  - Deprecation headers on all responses                              │
│  - Migration guide published                                         │
│  - Duration: 18 months after successor release                       │
│                                                                       │
│  Retired:                                                             │
│  - Returns 410 Gone with migration link                              │
│  - Request logs kept for 30 days                                     │
│  - Permanent state                                                   │
└──────────────────────────────────────────────────────────────────────┘
```

### 7.2 Beta Program

New major versions go through a beta period before becoming stable:

```
v2-beta.1  →  v2-beta.2  →  v2-beta.3  →  v2 (stable)
   ↓              ↓              ↓
Breaking      Breaking       Bug fixes      No more breaking
changes OK    changes OK     only           changes
```

**Beta access:**
- URL: `/api/v2-beta/...`
- Opt-in: Requires `X-DoppelDown-Beta: true` header or beta API key
- Limited to Professional+ tier users
- Feedback channel: dedicated `#api-v2-beta` Discord channel
- Duration: 2–4 months, minimum 3 beta releases

### 7.3 Parallel Version Support

When two versions are active simultaneously, both must pass all tests:

```
                    v1 (stable)          v2 (stable)
                    ┌───────────┐       ┌───────────┐
  Request ────────▶ │ v1 Router │       │ v2 Router │
                    │           │       │           │
                    └─────┬─────┘       └─────┬─────┘
                          │                   │
                          ▼                   ▼
                    ┌─────────────────────────────────┐
                    │      Shared Business Logic       │
                    │  (Scans, Threats, Evidence, etc.) │
                    └─────────────────────────────────┘
                          │                   │
                          ▼                   ▼
                    ┌───────────┐       ┌───────────┐
                    │ v1 Mapper │       │ v2 Mapper │
                    │ (Response │       │ (Response │
                    │  shaping) │       │  shaping) │
                    └───────────┘       └───────────┘
```

This architecture keeps the core logic version-agnostic. Version-specific code handles:
- Request validation/normalization (accepting old parameter names)
- Response shaping (different field names, structures)
- Default values (different defaults between versions)

---

## 8. Implementation Plan

### 8.1 Phase 0: Pre-Versioning Cleanup (Weeks 1–3)

Before introducing versioning, resolve the inconsistencies that would be frozen into v1:

| Task | Priority | Details |
|------|----------|---------|
| **Standardize response envelope** | P0 | All endpoints return `{ success, data, meta }` |
| **Standardize resource naming** | P0 | All routes use plural nouns: `/api/scans`, `/api/threats`, etc. |
| **Standardize ID passing** | P0 | Path params for specific resources (`/scans/{id}`), query params for filtering |
| **Standardize error responses** | P0 | All errors use `{ success: false, error: { code, message, details }, meta }` |
| **Add `X-Request-Id` header** | P1 | Every response includes a request ID for debugging |
| **Add `X-API-Version` header** | P1 | Returns internal semver (e.g., `1.0.0`) on every response |
| **Document field nullability** | P1 | Every field in the OpenAPI spec has explicit nullable annotation |
| **Freeze v1 response shapes** | P0 | Snapshot the current response structures as the v1 contract |

#### Endpoint Normalization Map

Current → v1 Canonical (with redirects from old paths):

| Current Path | v1 Canonical | Change |
|-------------|-------------|--------|
| `GET /api/brands` | `GET /api/v1/brands` | Add version prefix |
| `POST /api/brands` | `POST /api/v1/brands` | Add version prefix |
| `PATCH /api/brands` | `PATCH /api/v1/brands/{id}` | Move brandId from body to path |
| `POST /api/brands/logo` | `POST /api/v1/brands/{id}/logo` | Move brandId from form to path |
| `DELETE /api/brands/logo` | `DELETE /api/v1/brands/{id}/logo` | Move brandId from body to path |
| `POST /api/scan` | `POST /api/v1/scans` | Pluralize + prefix |
| `GET /api/scan?id=X` | `GET /api/v1/scans/{id}` | Path param + pluralize |
| `POST /api/scan/cancel` | `POST /api/v1/scans/{id}/cancel` | Path param + pluralize |
| `GET /api/scan/quota` | `GET /api/v1/scans/quota` | Pluralize + prefix |
| `POST /api/scan/social` | `POST /api/v1/scans` | Merge into main scan endpoint with `scanType` |
| `DELETE /api/scans/{id}` | `DELETE /api/v1/scans/{id}` | Add version prefix |
| `DELETE /api/threats/{id}` | `DELETE /api/v1/threats/{id}` | Add version prefix |
| `POST /api/evidence/sign` | `POST /api/v1/evidence/sign` | Add version prefix |
| `POST /api/reports` | `POST /api/v1/reports` | Add version prefix |
| `GET /api/reports` | `GET /api/v1/reports` | Add version prefix |
| `DELETE /api/reports/{id}` | `DELETE /api/v1/reports/{id}` | Add version prefix |
| `GET /api/notifications` | `GET /api/v1/notifications` | Add version prefix |
| `PATCH /api/notifications` | `PATCH /api/v1/notifications` | Add version prefix |
| `POST /api/stripe/checkout` | `POST /api/v1/billing/checkout` | Rename stripe → billing |
| `POST /api/stripe/portal` | `POST /api/v1/billing/portal` | Rename stripe → billing |
| `POST /api/stripe/webhook` | `POST /api/v1/billing/webhook` | Rename stripe → billing |
| `GET /api/admin/audit-logs` | `GET /api/v1/admin/audit-logs` | Add version prefix |
| `GET /api/health` | `GET /api/health` | **No version prefix** (system endpoint) |
| `GET /api/versions` | `GET /api/versions` | **No version prefix** (meta endpoint) |

> **Important:** During Phase 0, the old unversioned paths continue to work via `301 Redirect` to the v1 canonical paths. This ensures zero breakage.

### 8.2 Phase 1: Introduce v1 Versioned Routes (Weeks 4–6)

#### Next.js Route Structure

```
src/app/api/
├── health/route.ts              ← Unversioned (system)
├── versions/route.ts            ← Unversioned (meta)
├── v1/                          ← Version 1 routes
│   ├── brands/
│   │   ├── route.ts             ← GET (list), POST (create)
│   │   └── [id]/
│   │       ├── route.ts         ← GET (detail), PATCH (update), DELETE
│   │       └── logo/route.ts    ← POST (upload), DELETE (remove)
│   ├── scans/
│   │   ├── route.ts             ← POST (start scan)
│   │   ├── quota/route.ts       ← GET (check quota)
│   │   └── [id]/
│   │       ├── route.ts         ← GET (status), DELETE
│   │       └── cancel/route.ts  ← POST (cancel)
│   ├── threats/
│   │   ├── route.ts             ← GET (list) — new endpoint
│   │   └── [id]/route.ts        ← GET (detail), DELETE
│   ├── evidence/
│   │   └── sign/route.ts        ← POST, GET
│   ├── reports/
│   │   ├── route.ts             ← GET (list), POST (generate)
│   │   └── [id]/route.ts        ← GET (download), DELETE
│   ├── notifications/
│   │   └── route.ts             ← GET, PATCH
│   ├── billing/
│   │   ├── checkout/route.ts    ← POST
│   │   ├── portal/route.ts      ← POST
│   │   └── webhook/route.ts     ← POST (Stripe)
│   ├── webhooks/                ← New: webhook management
│   │   └── route.ts             ← GET (list), POST (create), DELETE
│   └── admin/
│       ├── audit-logs/route.ts  ← GET
│       └── model-usage/route.ts ← GET
├── cron/                        ← Unversioned (internal)
│   ├── scan/route.ts
│   ├── digest/route.ts
│   └── nrd/route.ts
└── _legacy/                     ← Redirect handlers for old paths
    ├── brands/route.ts          ← 301 → /api/v1/brands
    ├── scan/route.ts            ← 301 → /api/v1/scans
    └── ...
```

#### Version Middleware

```typescript
// src/middleware/api-version.ts

import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_VERSIONS = ['v1'];
const LATEST_VERSION = 'v1';
const UNVERSIONED_PATHS = ['/api/health', '/api/versions', '/api/cron/'];

export function apiVersionMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip unversioned system endpoints
  if (UNVERSIONED_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  
  // Check if path has a version prefix
  const versionMatch = pathname.match(/^\/api\/(v\d+)\//);
  
  if (versionMatch) {
    const version = versionMatch[1];
    if (!SUPPORTED_VERSIONS.includes(version)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNSUPPORTED_VERSION',
            message: `API version '${version}' is not supported. Available: ${SUPPORTED_VERSIONS.join(', ')}`,
            details: { availableVersions: SUPPORTED_VERSIONS }
          }
        },
        { status: 400 }
      );
    }
    // Valid versioned request — add version header to response
    const response = NextResponse.next();
    response.headers.set('X-API-Version', version);
    return response;
  }
  
  // Unversioned API request — redirect to latest version
  if (pathname.startsWith('/api/')) {
    const versionedPath = pathname.replace('/api/', `/api/${LATEST_VERSION}/`);
    const url = request.nextUrl.clone();
    url.pathname = versionedPath;
    
    return NextResponse.redirect(url, {
      status: 301,
      headers: {
        'X-API-Version': LATEST_VERSION,
        'X-Deprecation-Notice': 'Unversioned API paths are deprecated. Use /api/v1/ prefix.',
      }
    });
  }
  
  return NextResponse.next();
}
```

### 8.3 Phase 2: API Key System + Version Headers (Weeks 7–10)

Implement the dedicated API key system from the DevX strategy, with version awareness:

```typescript
// API keys include a default version preference
interface ApiKey {
  id: string;
  userId: string;
  keyHash: string;          // bcrypt hash
  prefix: string;           // dd_live_ or dd_test_
  name: string;
  mode: 'live' | 'test';
  defaultVersion: string;   // "v1" — can be overridden by URL
  createdAt: Date;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
}
```

### 8.4 Phase 3: Stabilize v1, Plan v2 (Months 4–8)

With v1 versioned and the API key system live:

1. **Freeze v1 contract** — publish the v1 OpenAPI spec as the immutable contract
2. **Track v2 candidates** — maintain a list of desired breaking changes
3. **Design v2** — when enough breaking changes accumulate, design v2 holistically
4. **Beta program** — launch v2-beta with opt-in early access

#### v2 Candidate Changes (Running List)

Maintained in `docs/API_V2_CANDIDATES.md`:

```markdown
# API v2 Change Candidates

Changes that require the next major API version. These are collected over time
and designed together when v2 development begins.

## Confirmed for v2
- [ ] Standardize all IDs to path parameters
- [ ] Replace string severity with numeric risk_score as primary
- [ ] Cursor-based pagination (instead of offset)
- [ ] Webhook API management endpoints
- [ ] Consistent resource nesting (/brands/{id}/scans)

## Under Consideration
- [ ] GraphQL alternative for complex queries
- [ ] Streaming scan progress (SSE/WebSocket instead of polling)
- [ ] Batch operations endpoint
```

---

## 9. API Gateway & Routing Architecture

### 9.1 Request Flow

```
Client Request
     │
     ▼
┌──────────────────────────────┐
│    Next.js Middleware          │
│                                │
│  1. Rate limiting              │
│  2. Auth (API key or session)  │
│  3. Version detection          │
│  4. Request logging            │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│    Version Router              │
│                                │
│  /api/v1/* → v1 handlers       │
│  /api/v2/* → v2 handlers       │
│  /api/*    → 301 redirect      │
│  /api/health → system handler  │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│    Version-Specific Handler    │
│                                │
│  - Request validation          │
│  - Parameter normalization     │
│  - Call shared business logic  │
│  - Shape response for version  │
│  - Add version headers         │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│    Response Middleware          │
│                                │
│  - Add deprecation headers     │
│  - Add rate limit headers      │
│  - Add X-API-Version header    │
│  - Add X-Request-Id header     │
│  - Log response                │
└──────────────────────────────┘
```

### 9.2 Shared Business Logic

The core logic is version-agnostic. Version-specific code is thin:

```typescript
// src/lib/services/scan-service.ts — shared (version-agnostic)
export class ScanService {
  async startScan(params: {
    brandId: string;
    userId: string;
    scanType: ScanType;
    platforms?: string[];
  }): Promise<ScanResult> {
    // All the actual logic lives here
  }
}

// src/app/api/v1/scans/route.ts — v1-specific handler
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // v1 validation: brandId required, scanType optional (default: "full")
  const validated = v1ScanSchema.parse(body);
  
  // Call shared logic
  const result = await scanService.startScan({
    brandId: validated.brandId,
    userId: auth.userId,
    scanType: validated.scanType ?? 'full',
  });
  
  // v1 response shape
  return NextResponse.json({
    message: 'Scan queued',
    scanId: result.scanId,
    jobId: result.jobId,
  });
}

// src/app/api/v2/scans/route.ts — v2-specific handler (future)
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // v2 validation: brandId required, scanType required (no default)
  const validated = v2ScanSchema.parse(body);
  
  // Call same shared logic
  const result = await scanService.startScan({
    brandId: validated.brandId,
    userId: auth.userId,
    scanType: validated.scanType,
  });
  
  // v2 response shape (different envelope)
  return NextResponse.json({
    data: {
      id: result.scanId,
      jobId: result.jobId,
      status: 'queued',
      estimatedDuration: result.estimatedDuration,
    },
    meta: { requestId: request.requestId, version: 'v2' },
  });
}
```

### 9.3 Response Header Contract

Every API response (all versions) includes these headers:

```http
X-API-Version: 1.3.2              # Internal semver
X-Request-Id: req_abc123def456    # Unique request identifier
X-RateLimit-Limit: 120            # Rate limit ceiling
X-RateLimit-Remaining: 118        # Remaining requests
X-RateLimit-Reset: 1707004860     # Reset timestamp (Unix)

# If deprecated:
Deprecation: true
Deprecation-Date: 2026-08-01
Sunset: 2028-02-01
Link: <https://docs.doppeldown.com/migration/v1-to-v2>; rel="deprecation"
```

---

## 10. Developer Communication Plan

### 10.1 Communication Timeline for Major Version Release

```
T-6 months:   Blog post: "What's Coming in API v2"
               Changelog entry with planned changes
               Discord announcement

T-4 months:   v2-beta.1 available
               Migration guide draft published
               SDK beta packages published

T-3 months:   v2-beta.2 available
               Migration guide finalized
               Breaking change list finalized

T-2 months:   v2-beta.3 (release candidate)
               Webinar/video walkthrough
               Codemods/migration scripts published

T-0:          v2 stable release
               v1 enters "deprecated" status
               All communication channels notified
               SDKs updated with v2 support

T+6 months:   Reminder email to v1 users
               Dashboard banner for v1 API key users

T+12 months:  Final warning email
               Increased dashboard banner urgency

T+18 months:  v1 retired (410 Gone)
               Post-mortem blog post
```

### 10.2 Changelog Standards

Every release gets a changelog entry following [Keep a Changelog](https://keepachangelog.com/):

```markdown
## [1.3.0] - 2026-05-15

### Added
- `GET /api/v1/threats` — List threats with filtering and pagination
- New `risk_score` (0-100) field on threat objects
- ⚠️ New `content_theft` threat type (handle unknown types gracefully)

### Changed
- `POST /api/v1/scans` now returns `estimated_duration` in response

### Deprecated
- `GET /api/v1/evidence/sign` (GET method) — Use POST method instead. Will be removed in v2.
- `severity` field on threats — Use `risk_level` and `risk_score` instead.

### Fixed
- `GET /api/v1/scans/{id}` now correctly returns `domains_checked: 0` instead of `null` for pending scans
- Rate limit headers now use consistent Unix timestamps

### Security
- Input validation strengthened on brand domain normalization
```

### 10.3 API Status Page

A dedicated status page at `status.doppeldown.com` shows:

```
┌─────────────────────────────────────────────────────────────────┐
│  DoppelDown API Status                                           │
│                                                                   │
│  API v1 ──────────────── ✅ Operational                          │
│  API v2-beta ─────────── 🟡 Beta (not for production)           │
│  Dashboard ───────────── ✅ Operational                          │
│  Scan Workers ────────── ✅ Operational                          │
│  Webhook Delivery ────── ✅ Operational                          │
│                                                                   │
│  ── Version Lifecycle ──────────────────────────────────────     │
│                                                                   │
│  v1: Active (released 2026-02-03)                                │
│  v2-beta: In progress (target: 2026-Q3)                         │
│                                                                   │
│  ── Upcoming Maintenance ───────────────────────────────────     │
│                                                                   │
│  2026-03-15 02:00 UTC: Database maintenance (5 min downtime)    │
│                                                                   │
│  ── Recent Incidents ───────────────────────────────────────     │
│                                                                   │
│  No incidents in the past 30 days.                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Migration Guide Framework

### 11.1 Migration Guide Template

Every major version release ships with a comprehensive migration guide:

```markdown
# Migrating from API v1 to v2

## Quick Summary
- **Timeline:** v1 deprecated on [date], sunset on [date]
- **Effort estimate:** Small integrations: 1-2 hours. Complex: 1-2 days.
- **Breaking changes:** [count] (see full list below)
- **SDK updates:** Update @doppeldown/sdk to v2.0.0+

## Before You Start
1. Read the [v2 changelog](link)
2. Test against the v2-beta sandbox first
3. Update your SDK: `npm install @doppeldown/sdk@latest`

## Step-by-Step Migration

### 1. Update Base URL
```
Old: https://doppeldown.com/api/v1/
New: https://doppeldown.com/api/v2/
```

### 2. Breaking Change: [Specific Change]
**What changed:** [Description]
**Before (v1):**
```json
{ "severity": "high" }
```
**After (v2):**
```json
{ "risk_level": "high", "risk_score": 85 }
```
**Migration:** Replace `severity` references with `risk_level` or `risk_score`.

### 3. [Next breaking change...]

## SDK Migration
If using the official SDK:
```bash
npm install @doppeldown/sdk@2.0.0
```
The SDK handles most changes automatically. Manual updates needed for:
- [specific SDK change]

## Verification Checklist
- [ ] All API calls use /api/v2/ prefix
- [ ] Error handling updated for new error codes
- [ ] Webhook receiver handles new payload structure
- [ ] Tests pass against v2 sandbox
- [ ] SDK updated to v2.x

## Getting Help
- Migration FAQ: [link]
- Discord: #api-migration channel
- Email: api-support@doppeldown.com
```

### 11.2 Automated Migration Tools

#### Codemods (SDK Users)

```bash
# TypeScript/JavaScript codemod
npx @doppeldown/codemod v1-to-v2

# What it does:
# - Updates import paths
# - Renames deprecated method calls
# - Updates type references
# - Flags manual review needed with TODO comments
```

#### API Request Translator

A web tool at `docs.doppeldown.com/migrate` where developers can paste a v1 request and see the v2 equivalent:

```
┌─ API Migration Tool ────────────────────────────────────────┐
│                                                              │
│  Paste your v1 API call:                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ curl -X POST https://doppeldown.com/api/v1/scan \     │ │
│  │   -H "Authorization: Bearer $TOKEN" \                  │ │
│  │   -d '{"brandId":"abc","scanType":"social_only"}'     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [Translate to v2]                                          │
│                                                              │
│  v2 equivalent:                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ curl -X POST https://doppeldown.com/api/v2/scans \    │ │
│  │   -H "Authorization: Bearer $TOKEN" \                  │ │
│  │   -d '{"brandId":"abc","type":"social"}'              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Changes:                                                   │
│  • /scan → /scans (pluralized)                             │
│  • scanType → type (renamed)                               │
│  • "social_only" → "social" (simplified enum)              │
└──────────────────────────────────────────────────────────────┘
```

### 11.3 Migration Metrics

Track migration progress:

| Metric | Target | Tracking |
|--------|--------|----------|
| % of API calls to v2 after 6 months | >50% | API logs |
| % of API calls to v2 after 12 months | >85% | API logs |
| % of API calls to v2 at sunset | >98% | API logs |
| Average migration time (self-reported) | <4 hours | Survey |
| Migration-related support tickets | <10% of total | Support system |

---

## 12. SDK Versioning Strategy

### 12.1 SDK Version ↔ API Version Mapping

SDKs follow their own semver but maintain clear API version compatibility:

```
SDK Version    API Versions Supported    Notes
─────────────────────────────────────────────────────────
1.0.0          v1                        Initial release
1.1.0          v1                        New helper methods
1.2.0          v1                        Bug fixes
2.0.0          v1, v2                    Adds v2 support, v1 still default
2.1.0          v1, v2                    v2 becomes default
3.0.0          v2                        Drops v1 support
```

### 12.2 SDK Version Configuration

```typescript
import { DoppelDown } from '@doppeldown/sdk';

// Default: uses the SDK's recommended API version
const dd = new DoppelDown({ apiKey: 'dd_live_...' });

// Explicit: pin to a specific API version
const dd = new DoppelDown({
  apiKey: 'dd_live_...',
  apiVersion: 'v1',     // Override SDK default
});

// During migration: use v2 with v1 fallback
const dd = new DoppelDown({
  apiKey: 'dd_live_...',
  apiVersion: 'v2',
  fallbackVersion: 'v1',  // If v2 endpoint not found, try v1
});
```

### 12.3 SDK Deprecation Warnings

SDKs emit runtime warnings for deprecated features:

```typescript
// When calling a deprecated endpoint
const result = await dd.scans.startSocial({ brandId: '...' });
// Console: ⚠️ DoppelDown: scans.startSocial() is deprecated. 
//          Use scans.start({ scanType: 'social_only' }) instead.
//          This method will be removed in SDK v3.0.

// When accessing a deprecated field
const severity = threat.severity;
// Console: ⚠️ DoppelDown: threat.severity is deprecated.
//          Use threat.riskLevel or threat.riskScore instead.
//          This field will be removed in API v2.
```

SDK warnings can be configured:

```typescript
const dd = new DoppelDown({
  apiKey: 'dd_live_...',
  deprecationWarnings: 'warn',   // 'warn' (default), 'error', 'silent'
});
```

---

## 13. Webhook Versioning

### 13.1 Webhook API Version

Webhooks have their own version, independent of the REST API version, because:
1. Webhook payloads are **sent** by DoppelDown, not requested — clients can't control the URL path
2. Breaking webhook changes would silently break receivers
3. Webhook consumers may not be the same team as API consumers

### 13.2 Webhook Version Header

Every webhook delivery includes the payload version:

```http
POST /your-webhook-endpoint HTTP/1.1
Content-Type: application/json
User-Agent: DoppelDown-Webhooks/1.0
X-DoppelDown-Signature: sha256=abc123...
X-DoppelDown-Webhook-Version: 2026-02-03
X-DoppelDown-Event: threat.detected
X-DoppelDown-Delivery-Id: del_abc123
```

### 13.3 Webhook Version Pinning

Webhook versions are **date-based** (inspired by Stripe's approach):

```
Dashboard → Settings → Integrations → Webhooks

Webhook API Version: 2026-02-03 (current)
  [Update to 2026-08-15] — Changes: threat payload includes risk_score field

When you created your webhook, it was pinned to the version available at that time.
Updating to a newer version may change payload structures.
```

Users can upgrade their webhook version independently of upgrading their REST API version.

### 13.4 Webhook Payload Versioning Rules

| Change | Breaking? | How Handled |
|--------|-----------|-------------|
| Add new field to existing event | No | Included in all versions after introduction |
| Remove field from event | Yes | Only in new webhook version; old version maintains field |
| Rename field | Yes | New version uses new name; old version maintains old name |
| Add new event type | No | Only sent if subscribed; existing subscribers unaffected |
| Change field type | Yes | Only in new webhook version |

### 13.5 Webhook Test Events

Developers can send test events in any webhook version:

```bash
curl -X POST https://doppeldown.com/api/v1/webhooks/test \
  -H "Authorization: Bearer dd_live_..." \
  -H "Content-Type: application/json" \
  -d '{
    "event": "threat.detected",
    "webhookVersion": "2026-02-03"
  }'
```

---

## 14. Testing & Validation

### 14.1 Contract Testing

Every API version has a contract test suite that verifies:

1. **Response schema compliance** — Every response matches the OpenAPI spec for that version
2. **Backward compatibility** — v1 responses are a superset of the frozen v1 contract
3. **Header compliance** — Required headers present on every response
4. **Error format compliance** — All errors follow the standard envelope

```typescript
// tests/contract/v1.test.ts
import { describe, it, expect } from 'vitest';
import { v1Contract } from './contracts/v1-frozen.json';

describe('API v1 Contract', () => {
  it('GET /api/v1/brands returns stable schema', async () => {
    const response = await fetch('/api/v1/brands', { headers: auth });
    const body = await response.json();
    
    // Verify all v1 contract fields are present
    expectSchema(body[0]).toMatchContract(v1Contract.brand);
    
    // Verify no v1 contract fields were removed
    for (const field of v1Contract.brand.requiredFields) {
      expect(body[0]).toHaveProperty(field);
    }
  });
  
  it('includes required version headers', async () => {
    const response = await fetch('/api/v1/brands', { headers: auth });
    
    expect(response.headers.get('X-API-Version')).toBeTruthy();
    expect(response.headers.get('X-Request-Id')).toBeTruthy();
  });
});
```

### 14.2 Breaking Change Detection (CI)

A CI check runs on every PR that modifies API routes:

```yaml
# .github/workflows/api-compat.yml
name: API Backward Compatibility Check

on:
  pull_request:
    paths:
      - 'src/app/api/**'
      - 'docs/openapi*.yaml'

jobs:
  compat-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Check OpenAPI spec for breaking changes
        uses: oasdiff/oasdiff-action@v1
        with:
          base: 'main'
          revision: 'HEAD'
          fail-on: 'ERR'   # Fail on breaking changes
          format: 'text'
      
      - name: Run v1 contract tests
        run: npm run test:contract:v1
        env:
          API_BASE_URL: http://localhost:3000

      - name: Comment on PR if breaking changes detected
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '⚠️ **Breaking API change detected.** This PR modifies the v1 API contract.\n\n'
                + 'If intentional, this change must:\n'
                + '1. Be added to `docs/API_V2_CANDIDATES.md`\n'
                + '2. Go through the ACP process (see API_VERSIONING_STRATEGY.md §5.3)\n'
                + '3. Ship in the next major version (v2)\n'
            });
```

### 14.3 Multi-Version Test Matrix

When multiple versions are supported, tests run against all active versions:

```yaml
strategy:
  matrix:
    api-version: [v1, v2]
    
steps:
  - name: Run tests for ${{ matrix.api-version }}
    run: npm run test:api -- --version=${{ matrix.api-version }}
```

### 14.4 Frozen Contract Snapshots

When a version is released, its OpenAPI spec is frozen:

```
docs/
├── openapi.yaml              ← Living spec (current development)
├── contracts/
│   ├── v1-frozen.yaml        ← Frozen v1 contract (immutable)
│   ├── v1-frozen.json        ← JSON schema version for contract tests
│   └── v2-frozen.yaml        ← Frozen v2 contract (when released)
```

The frozen spec is **never modified** after release. It's the source of truth for backward compatibility checks.

---

## 15. Governance & Decision-Making

### 15.1 API Review Board

An informal "API Review Board" reviews all API changes:

| Role | Responsibility | Current |
|------|---------------|---------|
| **API Owner** | Final decision on breaking changes and version timeline | Engineering lead |
| **DevX Advocate** | Represents developer experience concerns | DevRel (when hired) |
| **SDK Maintainer** | Assesses SDK impact of changes | SDK developer |

### 15.2 Decision Framework: "Should This Be a New Version?"

```
Has the change list been growing for >6 months?
├── No → Keep collecting candidates
└── Yes → Do we have ≥3 breaking changes that improve DX together?
    ├── No → Keep collecting (breaking changes should be worth it)
    └── Yes → Is the migration cost proportional to the benefit?
        ├── No → Simplify the changes, defer low-value breaks
        └── Yes → Start v(N+1) planning
            ├── Design all changes holistically (not piecemeal)
            ├── Publish RFC for community feedback
            ├── Build beta with early adopters
            └── Release with full migration tooling
```

### 15.3 Version Release Criteria

A new major version can only be released when:

- [ ] All breaking changes documented in migration guide
- [ ] Migration codemods published (for SDK users)
- [ ] API request translator updated
- [ ] SDKs updated with new version support
- [ ] Beta period completed (min 2 months, min 10 beta testers)
- [ ] Contract tests for new version passing
- [ ] Breaking change CI check updated with new frozen contract
- [ ] Deprecation headers configured for old version
- [ ] Communication sent on all channels (§10)
- [ ] Status page updated with version lifecycle

---

## 16. Monitoring & Observability

### 16.1 Version Usage Metrics

Track API version adoption in real-time:

```typescript
// Metrics emitted per request
apiRequestTotal.inc({
  version: 'v1',           // API version
  endpoint: '/brands',     // Normalized endpoint path
  method: 'GET',
  status: '200',
});

apiVersionUsage.inc({
  version: 'v1',
  deprecated: 'false',     // Is this version deprecated?
});
```

### 16.2 Dashboards

**API Version Adoption Dashboard:**

```
┌─────────────────────────────────────────────────────────────────┐
│  API Version Distribution (Last 7 Days)                          │
│                                                                   │
│  v1 (stable)     ████████████████████████████████████  92%       │
│  v2 (stable)     ████████                               8%       │
│  Unversioned     █                                      0.3%     │
│                                                                   │
│  ── Daily Trend ─────────────────────────────────────────        │
│                                                                   │
│  100% ┤ v1 ────────────────────────\                             │
│   80% ┤                             \──────── v1                 │
│   20% ┤                             /──────── v2                 │
│    0% ┤ v2 ────────────────────────/                             │
│       └──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──            │
│        Feb  Mar  Apr  May  Jun  Jul  Aug  Sep                    │
│                                                                   │
│  ── Deprecated Version Alerts ───────────────────────────        │
│                                                                   │
│  ⚠️ 12 unique API keys still using deprecated /api/scan          │
│  ⚠️ 3 users haven't migrated off v1 unversioned paths           │
└─────────────────────────────────────────────────────────────────┘
```

### 16.3 Alerting Rules

| Alert | Condition | Action |
|-------|-----------|--------|
| Deprecated version usage spike | >10% increase in deprecated version calls | Investigate — possible new integration using old docs |
| Unversioned path usage | Any requests to `/api/brands` (no version) | Email user with migration note |
| Error rate by version | >5% error rate on any version | Page on-call |
| Version sunset approaching | 30 days before sunset | Final notification blast |
| Post-sunset 410s | >100 410 responses/hour | Consider extending sunset |

---

## 17. Emergency Procedures

### 17.1 Emergency Breaking Change

Rare situations (security vulnerability, legal requirement) may require an immediate breaking change:

```
EMERGENCY PROTOCOL:
1. Assess: Can this be fixed without a breaking change? (Usually yes)
2. If breaking change is truly required:
   a. Fix the security issue immediately (ship the break)
   b. Email ALL API users within 1 hour with explanation
   c. Publish incident report within 24 hours
   d. Provide migration guidance within 24 hours
   e. Offer dedicated support for affected users
   f. Post-mortem: How do we prevent this in the future?
```

### 17.2 Rolling Back a Version Release

If a new version has critical issues after release:

```
ROLLBACK PROTOCOL:
1. Do NOT delete the version — it may have adopters
2. Mark the version as "known issues" on status page
3. Publish hotfix (patch version) within 24 hours
4. If unfixable, mark version as deprecated immediately
5. Redirect to previous stable version
6. Communicate on all channels
```

### 17.3 Extending a Sunset Date

If significant traffic remains on a version approaching sunset:

```
SUNSET EXTENSION PROTOCOL:
1. If >5% of traffic is on the deprecated version at T-30 days:
   a. Extend sunset by 3 months
   b. Directly contact remaining users
   c. Offer migration assistance
2. If >1% of traffic at T-7 days:
   a. Extend sunset by 1 month
   b. Consider the traffic source (could be abandoned integrations)
```

---

## Appendices

### A. Response Header Quick Reference

```http
# Every response
X-API-Version: 1.3.2
X-Request-Id: req_abc123def456
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 118
X-RateLimit-Reset: 1707004860

# Deprecated version/endpoint
Deprecation: true
Deprecation-Date: Sat, 01 Aug 2026 00:00:00 GMT
Sunset: Sat, 01 Feb 2028 00:00:00 GMT
Link: <https://docs.doppeldown.com/migration/v1-to-v2>; rel="deprecation"
Link: <https://doppeldown.com/api/v2/brands>; rel="successor-version"

# Beta version
X-API-Beta: true
X-API-Beta-Expires: 2026-09-01
```

### B. OpenAPI Spec Versioning Annotations

```yaml
# openapi.yaml — version annotations

openapi: 3.1.0
info:
  title: DoppelDown API
  version: 1.3.2
  x-api-version: v1
  x-lifecycle-status: stable

paths:
  /api/v1/brands:
    get:
      operationId: listBrands
      x-since: "1.0.0"
      # ...
      
  /api/v1/evidence/sign:
    get:
      operationId: signEvidenceGet
      deprecated: true
      x-since: "1.0.0"
      x-deprecated-since: "1.2.0"
      x-sunset-version: "v2"
      x-successor: "signEvidencePost"
      description: |
        **Deprecated:** Use POST method instead.
        
        Generate a signed URL for evidence access.

components:
  schemas:
    Threat:
      properties:
        severity:
          type: string
          deprecated: true
          x-deprecated-since: "1.3.0"
          x-successor: "risk_level"
          description: "**Deprecated.** Use `risk_level` instead."
        risk_level:
          type: string
          x-since: "1.3.0"
        risk_score:
          type: integer
          x-since: "1.3.0"
```

### C. Version Comparison Cheat Sheet

For quick reference when v2 ships:

```markdown
# v1 vs v2 Quick Comparison

| Feature | v1 | v2 |
|---------|----|----|
| Base URL | /api/v1/ | /api/v2/ |
| Pagination | offset/limit | cursor-based |
| Threat severity | string ("high") | string + numeric score |
| Scan start | POST /scans (scanType optional) | POST /scans (type required) |
| Brand update | PATCH /brands (brandId in body) | PATCH /brands/{id} |
| Error codes | 20 codes | 25 codes (5 new) |
| Webhook payloads | version 2026-02-03 | version 2026-08-15 |
```

### D. Glossary

| Term | Definition |
|------|-----------|
| **Breaking change** | A change that requires existing clients to modify their code to continue working |
| **Non-breaking change** | A change that existing clients handle without modification (additive) |
| **Deprecation** | A signal that a feature will be removed in a future version |
| **Sunset** | The date after which a deprecated feature stops working |
| **Contract** | The frozen specification defining expected behavior for a version |
| **ACP** | API Change Proposal — the review process for non-trivial changes |
| **Codemod** | An automated tool that transforms source code to adapt to API changes |
| **Version pinning** | Locking a client to a specific API version to prevent unexpected changes |

### E. External References

- [Stripe API Versioning](https://stripe.com/docs/api/versioning) — Date-based versioning, the gold standard
- [RFC 8594: Deprecation Header](https://www.rfc-editor.org/rfc/rfc8594) — Standard deprecation/sunset headers
- [Google API Design Guide: Versioning](https://cloud.google.com/apis/design/versioning) — URL-path approach
- [Microsoft REST API Guidelines: Versioning](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md) — Header approach
- [Semantic Versioning 2.0](https://semver.org/) — Internal version numbering
- [oasdiff](https://github.com/Tufin/oasdiff) — OpenAPI diff tool for breaking change detection

---

## Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-02-05 | 1.0 | Engineering | Initial strategy document |
