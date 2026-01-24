# Coding Conventions

**Analysis Date:** 2026-01-24

## Naming Patterns

**Files:**
- Page files: `page.tsx` (Next.js app router pages)
- Route handlers: `route.ts` (Next.js API routes)
- Components: `ComponentName.tsx` (PascalCase)
- Utilities/helpers: `kebab-case.ts` (e.g., `domain-generator.ts`, `evidence-collector.ts`)
- Type definitions: `index.ts` (centralized in `src/types/`)

**Functions:**
- Named exports: camelCase (e.g., `runScanForBrand`, `generateDomainVariations`, `checkDomainRegistration`)
- React components: PascalCase (e.g., `HomePage`, `BrandsPage`, `Card`)
- Async functions: camelCase prefix with `async` keyword (e.g., `async function fetchImageBuffer()`)
- Helper/utility functions: camelCase (e.g., `sanitizeKeywords()`, `normalizeDomain()`)

**Variables:**
- Constants: UPPER_SNAKE_CASE (e.g., `BRAND_LIMITS`, `ALLOWED_SOCIAL_PLATFORMS`, `SCAN_CONFIG`)
- Regular variables: camelCase (e.g., `supabase`, `threats`, `domainsChecked`)
- Booleans: camelCase with `is`, `has`, `can` prefix (e.g., `isDebugBrand`, `hasOpenAiKey`, `canRunOpenAIVision`)
- Database fields: snake_case (e.g., `user_id`, `brand_id`, `social_handles`, `created_at`)

**Types:**
- Interfaces: PascalCase with descriptive names (e.g., `CardProps`, `User`, `Brand`, `Threat`)
- Type aliases: PascalCase (e.g., `SocialHandleValue`, `ThreatSeverity`, `VariationType`)
- Enum-like types: UPPER_SNAKE_CASE values (e.g., `'typo' | 'homoglyph' | 'hyphen'`)

## Code Style

**Formatting:**
- Tool: Not explicitly configured (Next.js default with TypeScript strict mode)
- Uses Tailwind CSS classes directly in JSX (no separate CSS files)
- Single quotes for strings: Not enforced but observe codebase
- Semicolons: Required (TypeScript strict)
- Indentation: 2 spaces (observed in all files)
- Line length: No hard limit observed, practical limit ~100 characters for readability

**Linting:**
- ESLint: `next lint` command available (from `eslint-config-next`)
- TypeScript: `strict: true` in `tsconfig.json` - enforces strong type safety
- No custom `.eslintrc` present; using Next.js default rules via `eslint-config-next`

## Import Organization

**Order:**
1. External packages (React, Next.js) - e.g., `import Link from 'next/link'`
2. Third-party UI/utility libraries - e.g., `import { Shield } from 'lucide-react'`
3. Type imports - e.g., `import type { Threat } from '../types'`
4. Internal absolute imports - e.g., `import { createClient } from '@/lib/supabase/server'`
5. Relative imports - e.g., `import { cn } from '@/lib/utils'`

**Path Aliases:**
- `@/*` resolves to `./src/*` (defined in `tsconfig.json`)
- Always use absolute imports with `@/` prefix - never use relative paths like `../../../`

**Examples from codebase:**
```typescript
// src/app/api/brands/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// src/app/page.tsx
import Link from 'next/link'
import { Shield, Search, FileText, Bell, CheckCircle, AlertTriangle, Globe, Lock } from 'lucide-react'

// src/lib/scan-runner.ts
import { generateDomainVariations, checkDomainRegistration, assessThreatLevel, splitDomainAndTld } from './domain-generator'
import type { Threat, ThreatSeverity, ThreatType, VariationType } from '../types'
```

## Error Handling

**Patterns:**
- Try-catch blocks used for async operations, especially with database/API calls
- Supabase errors checked immediately after queries: `if (error) throw error`
- Authentication errors return 401: `return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })`
- Validation errors return 400: `return NextResponse.json({ error: 'validation message' }, { status: 400 })`
- Not found errors return 404: `return NextResponse.json({ error: 'Brand not found' }, { status: 404 })`
- Business logic errors (like brand limits) return 403: `return NextResponse.json({ error: 'message', code: 'BRAND_LIMIT_REACHED' }, { status: 403 })`
- Generic server errors return 500 with wrapped error message
- Errors caught in outer try-catch are logged and return generic 500 response

**Example from `src/app/api/brands/route.ts`:**
```typescript
if (authError || !user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

const { data: brands, error } = await supabase
  .from('brands')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })

if (error) throw error

try {
  // ... operations ...
} catch (error) {
  console.error('Error creating brand:', error)
  return NextResponse.json(
    { error: 'Failed to create brand' },
    { status: 500 }
  )
}
```

## Logging

**Framework:** `console.error()` and `console.warn()` for structured logging

**Patterns:**
- Log errors with context in catch blocks: `console.error('Error description:', error)`
- Log operation warnings: `console.warn('Failed to update scan progress:', err)`
- Debug logging for specific brands: `console.log('[scan-debug] description', { context })`
- No production logging library configured (using native console)

**Example from `src/lib/scan-runner.ts`:**
```typescript
if (isDebugBrand) {
  console.log('[scan-debug] domain split', {
    brandId: brand.id,
    brandDomain: brand.domain,
    baseName,
    tld,
    seeds: seedNames
  })
}

console.error(`Error checking domain ${variation.domain}:`, err)
console.warn('Failed to update scan progress:', err)
```

## Comments

**When to Comment:**
- Complex domain logic explained with comments (e.g., seed name generation in `scan-runner.ts`)
- Algorithm explanation (e.g., prioritizing domain variations)
- Important business rules (e.g., brand limits, scan types)
- Configuration sections explaining purpose (e.g., SCAN_CONFIG object)
- Generally minimal inline comments; prefer clear function/variable names

**JSDoc/TSDoc:**
- Not extensively used in codebase
- Interface properties sometimes have inline documentation
- Function parameters documented implicitly via TypeScript types

## Function Design

**Size:** Generally 20-50 lines; some utility functions are 2-5 lines

**Parameters:**
- Options objects preferred for multiple parameters (e.g., `runScanForBrand(options: { supabase, brand, scanId, ... })`)
- Destructuring used in function signatures
- Type annotations always provided for TypeScript strict mode

**Return Values:**
- Explicit return types specified (e.g., `Promise<void>`, `string[]`, `Threat[]`)
- Async functions return `Promise<T>`
- Database operations return results directly from Supabase client
- No implicit returns; always use `return` statement

**Examples:**
```typescript
// Sanitization function with clear inputs/outputs
function sanitizeKeywords(input: unknown): string[] | null {
  if (!Array.isArray(input)) return null
  const cleaned = input
    .filter((item): item is string => typeof item === 'string')
    .map(item => item.trim())
    .filter(Boolean)
  return Array.from(new Set(cleaned))
}

// Options object pattern for complex functions
async function runScanForBrand(options: {
  supabase: any
  brand: any
  scanId: string
  scanType: string
  jobPayload?: ScanJobPayload
  triggerAlerts?: boolean
}) {
  // ...
}

// Simple utility function
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}
```

## Module Design

**Exports:**
- Named exports used for utilities and components (e.g., `export function cn()`, `export function Card()`)
- Default exports used for Next.js pages and route handlers (required by Next.js)
- Type exports use `export type` to prevent runtime overhead

**Barrel Files:**
- Centralized types in `src/types/index.ts` - exports all type definitions
- Component exports use barrel pattern: `src/components/ui/card.tsx` exports multiple card subcomponents (`Card`, `CardHeader`, `CardTitle`, etc.)
- Not used extensively for API routes or pages

**Example barrel file from `src/components/ui/card.tsx`:**
```typescript
export function Card({ children, className }: CardProps) { }
export function CardHeader({ children, className }: CardProps) { }
export function CardTitle({ children, className }: CardProps) { }
export function CardContent({ children, className }: CardProps) { }
export function CardFooter({ children, className }: CardProps) { }
```

---

*Convention analysis: 2026-01-24*
