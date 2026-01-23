# Testing Patterns

**Analysis Date:** 2026-01-23

## Test Framework

**Runner:**
- Not detected - no test files found in `src/` directory
- ESLint configured but no Jest, Vitest, or other test runners configured in `package.json`
- No test configuration files (`jest.config.js`, `vitest.config.ts`) present

**Assertion Library:**
- Not applicable - no test framework in use

**Run Commands:**
- No test command in `package.json`
- Available: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`, `npm run setup`

## Test File Organization

**Status:** No tests currently in codebase

**Recommended Pattern (for future implementation):**
- Co-locate test files next to source files
- Test files should use `.test.ts` or `.test.tsx` suffix
- Expected locations if implemented:
  - `src/lib/utils.test.ts` for `/src/lib/utils.ts`
  - `src/lib/domain-generator.test.ts` for `/src/lib/domain-generator.ts`
  - `src/app/api/scan/route.test.ts` for `/src/app/api/scan/route.ts`

## Test Structure

**Current testing gaps:**

No unit tests exist for:
- Utility functions in `src/lib/utils.ts` (`cn()`, `formatDate()`, `extractDomain()`, `severityColor()`, etc.)
- Domain variation generation in `src/lib/domain-generator.ts` (10 variation algorithms)
- Threat assessment logic (`assessThreatLevel()`)
- Report generation functions in `src/lib/report-generator.ts` (HTML, text, CSV generation)
- API route handlers (POST/GET in `src/app/api/scan/route.ts`, `src/app/api/brands/route.ts`, etc.)
- Supabase client initialization

**Recommended structure if tests added:**
```typescript
describe('generateDomainVariations', () => {
  it('should generate typo variations', () => {
    // Test implementation
  })

  it('should remove original domain from results', () => {
    // Test implementation
  })
})
```

## Mocking

**Framework:** Not in use (no tests exist)

**When tests are added, mock these:**
- Supabase client: Mock `createClient()` and `createServiceClient()` to avoid real database calls
- Fetch requests: Mock `fetch()` for external API calls (DNS resolution, whois lookups)
- Next.js routing: Mock `useRouter()` in components
- External services: Mock Stripe, Nodemailer, Puppeteer-core

**Existing async dependencies that will need mocking:**
- `fetch()` calls in `checkDomainRegistration()` - DNS lookups via Google/Cloudflare APIs
- `fetch()` calls in `scanForThreats()` (imported but implementation not reviewed)
- `fetch()` calls in `scanSocialMedia()` (imported but implementation not reviewed)
- Supabase auth: `.auth.getUser()`
- Supabase database: `.from('table').select/insert/update`

## Fixtures and Factories

**Status:** No fixtures currently defined

**Data structures that need fixtures:**

Mock User:
```typescript
{
  id: 'test-user-123',
  email: 'test@example.com',
  subscription_status: 'active',
  subscription_tier: 'professional'
}
```

Mock Brand:
```typescript
{
  id: 'brand-123',
  name: 'Test Brand',
  domain: 'testbrand.com',
  threat_count: 5,
  status: 'active'
}
```

Mock Threat:
```typescript
{
  id: 'threat-123',
  url: 'https://testbrand-typo.com',
  type: 'typosquat_domain',
  severity: 'high',
  status: 'new',
  detected_at: '2026-01-23T00:00:00Z'
}
```

**Recommended location for fixtures:**
- `src/__tests__/fixtures/` or `tests/fixtures/`
- Factory functions: `src/__tests__/factories/` with builder patterns

## Coverage

**Requirements:** None enforced

**Current status:** 0% coverage - no tests implemented

**High-priority areas for testing:**
1. **Domain variation generation** (`src/lib/domain-generator.ts`) - Core business logic with 10 algorithms
2. **Threat assessment** (`assessThreatLevel()`) - Risk classification
3. **Utility functions** (`src/lib/utils.ts`) - Color/label mappings, formatting
4. **API handlers** (`src/app/api/**/route.ts`) - Auth checks, validation, database operations
5. **Report generation** (`src/lib/report-generator.ts`) - Multiple output formats

**Recommended target:** 70%+ coverage for business logic, especially domain generation and API routes

## Test Types

**Unit Tests (To be added):**
- Pure functions in `src/lib/` directory (domain-generator, report-generator, utils)
- Functions with no side effects or external dependencies
- Each algorithm in `generateDomainVariations()` should have individual tests
- Utility format/color functions should verify output for all input types

**Integration Tests (To be added):**
- API route handlers with mocked Supabase
- Authentication flow (getUser check, creating user if new)
- Brand creation with subscription limit enforcement
- Scan workflow with threat detection

**E2E Tests:**
- Not currently configured
- Would require Playwright, Cypress, or similar
- Recommended for future: Test complete onboarding flow, brand creation, scan execution
- Not critical for MVP but valuable for deployment confidence

## Common Patterns

**When implemented, async testing pattern:**
```typescript
it('should fetch scan results', async () => {
  const mockFetch = jest.fn().mockResolvedValue({
    json: async () => ({ status: 'completed' })
  })
  global.fetch = mockFetch

  const result = await fetchScanStatus('scan-id')

  expect(mockFetch).toHaveBeenCalled()
  expect(result.status).toBe('completed')
})
```

**Error testing pattern (when implemented):**
```typescript
it('should handle authorization errors', async () => {
  const mockSupabase = {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: null },
        error: new Error('Unauthorized')
      })
    }
  }

  const response = await GET(mockRequest)

  expect(response.status).toBe(401)
  expect(response.json()).toEqual({ error: 'Unauthorized' })
})
```

## Critical Testing Gaps

**Domain generation (src/lib/domain-generator.ts):**
- 10 different variation types need individual testing:
  - Missing letter variations
  - Double letter variations
  - Added letter variations
  - Vowel swaps
  - Keyboard proximity
  - Homoglyph substitutions
  - Hyphen insertions
  - TLD swaps
  - Subdomain squatting
  - Bitsquatting
- Edge cases: single letter domains, domains with numbers, special characters
- Deduplication via Map needs validation

**API authentication & authorization:**
- Missing user record creation flow in `getOrCreateUserRecord()`
- Brand limit enforcement with different subscription tiers
- User isolation (queries filtered by `user_id`)

**External API calls:**
- DNS resolution fallbacks in `checkDomainRegistration()` - two APIs (Google, Cloudflare)
- Error handling when both APIs fail
- Rate limiting (100ms delay between domain checks)

**Report generation:**
- HTML generation with proper escaping
- CSV export with quote handling
- Plain text formatting

---

*Testing analysis: 2026-01-23*
