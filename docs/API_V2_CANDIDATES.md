# API v2 Change Candidates

> Breaking changes that will be collected over time and designed together when v2 development begins.
> See `API_VERSIONING_STRATEGY.md` for the full versioning strategy.
>
> **Status:** Collecting  
> **Target:** 2026-H2 (tentative)

---

## Confirmed for v2

Changes that have been reviewed and approved for inclusion in v2:

### Endpoint Consistency
- [ ] **Standardize all resource IDs to path parameters** — Move `brandId` from request body to URL path for all endpoints (PATCH, DELETE, logo operations)
- [ ] **Consistent plural resource names** — All routes use plural nouns (`/scans`, `/threats`, `/brands`)
- [ ] **Merge social scan into main scan endpoint** — Deprecate `POST /api/v1/scan/social`; use `POST /api/v2/scans` with `type: "social"` and optional `platforms` filter

### Response Structure
- [ ] **Mandatory response envelope** — All endpoints return `{ data, meta }` (no bare arrays or objects)
- [ ] **Numeric risk scoring as primary** — Replace string `severity` with numeric `risk_score` (0-100) as primary; string `risk_level` as convenience
- [ ] **Consistent timestamp format** — All timestamps as ISO 8601 with timezone (no Unix timestamps in response bodies)

### Pagination
- [ ] **Cursor-based pagination** — Replace offset/limit with cursor-based approach for list endpoints (`/brands`, `/threats`, `/reports`, `/notifications`, `/audit-logs`)

### Authentication
- [ ] **First-class API keys** — `dd_live_*` and `dd_test_*` keys as primary auth method (Supabase tokens supported but not required)

---

## Under Consideration

Changes being evaluated — need more data or community feedback:

- [ ] **GraphQL alternative** — Optional GraphQL endpoint for complex multi-resource queries (MSP use case)
- [ ] **Streaming scan progress** — SSE or WebSocket for real-time progress instead of polling
- [ ] **Batch operations** — `POST /api/v2/batch` for multiple operations in one request
- [ ] **Resource nesting** — `/brands/{id}/scans` instead of scan + brandId filter
- [ ] **Webhook management API** — Full CRUD for webhook endpoints via API
- [ ] **Idempotency keys** — `Idempotency-Key` header support for POST operations
- [ ] **Field selection** — `?fields=id,name,domain` to reduce payload size
- [ ] **ETag/If-None-Match caching** — HTTP conditional requests for list endpoints

---

## Rejected

Changes considered but rejected:

| Proposal | Reason for Rejection |
|----------|---------------------|
| Switch from REST to GraphQL-only | Too much migration burden; REST is better for simple CRUD |
| Use header-based versioning | Poor browser/cache support; URL-path is industry standard |
| Remove legacy scan types | `domain_only`, `web_only` still have valid use cases |

---

## Change Log

| Date | Change |
|------|--------|
| 2026-02-05 | Initial list created based on v1 inconsistency audit |
