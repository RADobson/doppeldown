# Testing Patterns

**Analysis Date:** 2026-01-24

## Test Framework

**Runner:**
- Not detected - No test framework currently configured in project
- `package.json` contains no test dependencies (jest, vitest, mocha, etc.)
- No test scripts in `package.json` (only `dev`, `build`, `start`, `lint`, `setup`, `worker:scan`)

**Assertion Library:**
- Not applicable (no testing framework present)

**Run Commands:**
- No test commands available

## Test File Organization

**Location:**
- Not applicable - No test files exist in codebase
- No `__tests__` directories found
- No `.test.ts`, `.spec.ts`, `.test.tsx`, or `.spec.tsx` files in source directories

**Naming:**
- Not established (no test files)

**Structure:**
- Not established (no test files)

## Current State

**Testing Coverage:**
- Zero test coverage
- No unit tests
- No integration tests
- No e2e tests

## Recommendations for Test Setup

**Unit Testing Focus Areas:**

1. **Utility Functions** (`src/lib/utils.ts`):
   - Date formatting functions: `formatDate()`, `formatDateTime()`
   - URL utilities: `truncateUrl()`, `extractDomain()`
   - Color/status helpers: `severityColor()`, `statusColor()`, `threatTypeLabel()`
   - Debounce function

2. **Domain Generation** (`src/lib/domain-generator.ts`):
   - `splitDomainAndTld()` - should correctly parse various domain formats
   - `checkDomainRegistration()` - should handle network requests
   - Homoglyph and keyboard proximity variation generation
   - Domain prioritization logic

3. **Sanitization Functions** (`src/app/api/brands/route.ts`):
   - `sanitizeKeywords()` - input validation and normalization
   - `sanitizeSocialHandles()` - input validation for social platforms
   - `normalizeDomain()` - domain URL normalization

4. **Type Definitions** (`src/types/index.ts`):
   - No logic to test, but useful for type-level tests if TypeScript testing library added

**Integration Testing Focus Areas:**

1. **API Routes** (`src/app/api/*/route.ts`):
   - Brand CRUD operations with authentication
   - Scan creation and job queueing
   - Stripe webhook handling
   - Report generation

2. **Database Operations:**
   - Supabase client interactions
   - User creation and subscription management
   - Threat creation and status updates

3. **Scan Pipeline** (`src/lib/scan-runner.ts`):
   - Domain variation checking workflow
   - Web threat scanning
   - Evidence collection
   - Social media scanning
   - Alert triggering

**E2E Testing Focus Areas:**

1. User authentication flow (signup, login, password reset)
2. Brand monitoring workflow (add brand → trigger scan → view threats)
3. Report generation and download
4. Stripe subscription integration
5. Alert notification delivery

## Suggested Testing Stack

**Recommended Setup:**
- **Test Runner:** Vitest (faster, Vite-native, great for Next.js)
  - Alternative: Jest (industry standard, more community libraries)
- **Component Testing:** React Testing Library
- **E2E Testing:** Playwright or Cypress
- **API Testing:** Supertest or native fetch in Vitest

**Installation Example:**
```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D playwright @playwright/test  # for E2E
```

**Config Example** (`vitest.config.ts`):
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## Mock Patterns (Guidance)

**What to Mock:**
- External API calls (Stripe, email service, web screenshots)
- Database operations (Supabase client)
- File system operations
- Network requests in unit tests

**What NOT to Mock:**
- Utility functions and helpers
- Type definitions
- React hooks (unless testing specific behavior)
- Business logic (test real implementations in unit tests)

**Mock Example Pattern:**
```typescript
import { vi } from 'vitest'

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      eq: vi.fn(),
      single: vi.fn(),
    })),
    auth: {
      getUser: vi.fn(),
    },
  })),
}))

// Mock external services
vi.mock('@/lib/email', () => ({
  sendThreatAlert: vi.fn().mockResolvedValue(undefined),
}))
```

## Test Structure Guidance

**Unit Test Pattern:**
```typescript
import { describe, it, expect } from 'vitest'
import { sanitizeKeywords } from '@/app/api/brands/route'

describe('sanitizeKeywords', () => {
  it('should return null for non-array input', () => {
    expect(sanitizeKeywords('not-an-array')).toBeNull()
  })

  it('should filter and trim string values', () => {
    const result = sanitizeKeywords(['  keyword1  ', 'keyword2', null, 123])
    expect(result).toEqual(['keyword1', 'keyword2'])
  })

  it('should remove duplicates', () => {
    const result = sanitizeKeywords(['test', 'test', 'other'])
    expect(result).toEqual(['other', 'test'])
  })
})
```

**API Route Test Pattern:**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/brands/route'
import { NextRequest } from 'next/server'

describe('POST /api/brands', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 401 if user is not authenticated', async () => {
    const request = new NextRequest(new URL('http://localhost:3000/api/brands'), {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', domain: 'test.com' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })
})
```

**Async Test Pattern:**
```typescript
it('should handle async operations', async () => {
  const result = await someAsyncFunction()
  expect(result).toBeDefined()
})
```

---

*Testing analysis: 2026-01-24*

**Note:** This codebase currently has zero test coverage. All testing patterns and guidance are recommendations based on industry best practices and the structure of the code. Implementing tests is a high priority before scaling to production.
